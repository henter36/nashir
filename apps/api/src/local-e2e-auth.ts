import { AsyncLocalStorage } from "node:async_hooks";

import type { FastifyReply, FastifyRequest } from "fastify";

import { createHttpErrorResponse } from "./error-model.js";
import type { VerifiedIdentityContext } from "./request-context.js";
import type {
  WorkspaceMembershipResolver,
  WorkspaceMembershipResolverResult
} from "./workspace-context-guard.js";

export const LOCAL_E2E_AUTH_REQUEST_ENV = "NASHIR_ENABLE_LOCAL_E2E_AUTH";

export const LOCAL_ACTOR_ID_HEADER = "x-nashir-local-actor-id";
export const LOCAL_WORKSPACES_HEADER = "x-nashir-local-workspaces";

// Deliberately the same shape as the workspace-id route-param pattern so a
// local actor id can never collide with characters that would be unsafe to
// log or echo back. This module never accepts a value outside this charset.
const SAFE_LOCAL_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:|-]{0,127}$/;

type HeadersLike = Record<string, string | readonly string[] | undefined>;

function firstHeaderValue(
  headers: HeadersLike,
  name: string
): string | undefined {
  let raw: string | readonly string[] | undefined = headers[name];

  if (raw === undefined) {
    const lowerName = name.toLowerCase();
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === lowerName) {
        raw = headers[key];
        break;
      }
    }
  }

  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" ? value : undefined;
}

function truthyFlag(value: string | undefined): boolean {
  const normalized = (value ?? "").trim().toLowerCase();
  return normalized === "1" || normalized === "true";
}

export function isLocalE2eAuthRequested(
  env: Record<string, string | undefined>
): boolean {
  return truthyFlag(env[LOCAL_E2E_AUTH_REQUEST_ENV]);
}

// Fail-closed guard, independent of every other condition: if this flag is
// ever set while NODE_ENV=production, startup must refuse to continue. This
// must be checked before anything else reads the flag.
export function assertLocalE2eAuthProductionSafe(
  env: Record<string, string | undefined>
): void {
  if (!isLocalE2eAuthRequested(env)) return;

  const nodeEnv = (env.NODE_ENV ?? "").trim().toLowerCase();
  if (nodeEnv === "production") {
    throw new Error(
      `${LOCAL_E2E_AUTH_REQUEST_ENV} cannot be enabled when NODE_ENV=production.`
    );
  }
}

function parsePermissionsHeaderValue(
  value: string | undefined
): readonly string[] {
  if (value === undefined) return [];
  return [
    ...new Set(
      value
        .split(",")
        .map((permission) => permission.trim())
        .filter((permission) => permission.length > 0)
    )
  ];
}

// Reads the same granted-permissions header convention used by the
// transitional request-context path (see request-context.ts), but this
// parser is intentionally self-contained: production wiring must never call
// it, so it does not import any shared parsing helper that production code
// also calls.
export function parseLocalGrantedPermissionsHeader(
  headers: HeadersLike
): readonly string[] {
  return parsePermissionsHeaderValue(
    firstHeaderValue(headers, "x-nashir-granted-permissions")
  );
}

interface LocalE2eMembershipState {
  // null means the request supplied no workspace-membership configuration
  // at all -- this must fail closed (503), never silently allow or deny.
  allowedWorkspaceIds: Set<string> | null;
}

const localE2eMembershipStorage =
  new AsyncLocalStorage<LocalE2eMembershipState>();

function parseLocalWorkspacesHeader(
  value: string | undefined
): Set<string> | null {
  if (value === undefined || value.trim().length === 0) {
    return null;
  }

  return new Set(
    value
      .split(",")
      .map((workspaceId) => workspaceId.trim())
      .filter((workspaceId) => workspaceId.length > 0)
  );
}

function sendLocalAuthError(
  reply: FastifyReply,
  statusCode: 401,
  code: string,
  message: string,
  correlationId: string | undefined
): void {
  const response = createHttpErrorResponse({
    code,
    message,
    statusCode,
    correlationId
  });
  reply.code(statusCode).send(response.body);
}

declare module "fastify" {
  interface FastifyRequest {
    localE2eAuth?: boolean;
  }
}

export type LocalE2eAuthGuardHook = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>;

// Replaces the real Auth0 guard hook only when explicitly wired in by the
// bootstrap layer (see index.ts). It never inspects the Authorization
// header and never attempts JWKS/JWT verification -- it is a parallel,
// mutually-exclusive path, not a fallback for a failed real verification.
export function createLocalE2eAuthGuardHook(): LocalE2eAuthGuardHook {
  return async function localE2eAuthGuardHook(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const correlationId = request.correlationId;
    const rawActorId = firstHeaderValue(request.headers, LOCAL_ACTOR_ID_HEADER);

    if (rawActorId === undefined || rawActorId.trim().length === 0) {
      sendLocalAuthError(
        reply,
        401,
        "LOCAL_ACTOR_CONTEXT_REQUIRED",
        `Missing required ${LOCAL_ACTOR_ID_HEADER} header for local E2E validation.`,
        correlationId
      );
      return;
    }

    const actorId = rawActorId.trim();
    if (!SAFE_LOCAL_ID_PATTERN.test(actorId)) {
      sendLocalAuthError(
        reply,
        401,
        "LOCAL_ACTOR_CONTEXT_INVALID",
        `${LOCAL_ACTOR_ID_HEADER} contains characters that are not allowed.`,
        correlationId
      );
      return;
    }

    const identity: VerifiedIdentityContext = { actorId };
    request.verifiedIdentityContext = identity;
    request.localE2eAuth = true;

    request.log.warn(
      {
        localE2eAuth: true,
        actorId,
        correlationId
      },
      "Local E2E validation auth accepted (non-production, explicit opt-in only)."
    );

    const allowedWorkspaceIds = parseLocalWorkspacesHeader(
      firstHeaderValue(request.headers, LOCAL_WORKSPACES_HEADER)
    );

    localE2eMembershipStorage.enterWith({ allowedWorkspaceIds });
  };
}

// Workspace-membership resolver used only in local E2E mode. Deliberately
// does not default to "member" -- a request with no
// x-nashir-local-workspaces configuration is reported as "unavailable"
// (503), and a workspaceId outside the configured set is reported as
// "not_member" (404, non-disclosing), matching the production resolver's
// disposition for an unknown workspace.
export function createLocalE2eWorkspaceMembershipResolver(): WorkspaceMembershipResolver {
  return function localE2eWorkspaceMembershipResolver(
    input
  ): WorkspaceMembershipResolverResult {
    const state = localE2eMembershipStorage.getStore();

    if (!state || state.allowedWorkspaceIds === null) {
      return { outcome: "unavailable" };
    }

    if (state.allowedWorkspaceIds.has(input.workspaceId)) {
      return { outcome: "member" };
    }

    return { outcome: "not_member" };
  };
}
