import { randomUUID } from "node:crypto";

import Fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
  type FastifyServerOptions
} from "fastify";

import type { AuditRepository } from "./audit/audit-repository.js";
import type { AuthConfig } from "./auth-config.js";
import { createAuthGuardHook, type JwksGetKey } from "./auth-guard.js";
import { createHttpErrorResponse } from "./error-model.js";
import {
  parseLocalGrantedPermissionsHeader,
  runWithLocalE2eMembership,
  type LocalE2eAuthGuardHook
} from "./local-e2e-auth.js";
import { evaluatePermissionGuard } from "./permission-guard.js";
import {
  createWorkspaceContextGuardHook,
  type WorkspaceMembershipResolver
} from "./workspace-context-guard.js";
import {
  CORRELATION_ID_HEADER,
  resolveRequestContextFromHeaders,
  type RequestContext,
  type VerifiedIdentityContext
} from "./request-context.js";
import type { IdempotencyRepository } from "./idempotency/idempotency-repository.js";
import type { ProductRepository } from "./products/product-repository.js";
import { productPlugin } from "./products/product-route.js";

declare module "fastify" {
  interface FastifyRequest {
    requestContext?: RequestContext;
    verifiedIdentityContext?: VerifiedIdentityContext;
    correlationId?: string;
  }
}

const HEALTH_ROUTE = "/health";
const WORKSPACE_ROUTE_HARNESS_ROUTE =
  "/internal/workspace-route-harness/:workspaceId";
const PERMISSION_GUARD_HARNESS_ROUTE =
  "/internal/permission-guard-harness/:requiredPermission";
const WORKSPACE_PERMISSION_GUARD_HARNESS_ROUTE =
  "/internal/workspace-permission-guard-harness/:workspaceId/:requiredPermission";

const STATIC_HARNESS_GRANTED_PERMISSIONS = Object.freeze([
  "harness.read",
  "harness.write"
]);

interface WorkspaceRouteHarnessParams {
  workspaceId: string;
}

interface PermissionGuardHarnessQuery {
  disclosureMode?: string;
}

interface WorkspacePermissionGuardHarnessParams {
  workspaceId: string;
  requiredPermission: string;
}

interface WorkspacePermissionGuardHarnessQuery {
  disclosureMode?: string;
  resourceWorkspaceId?: string;
}

async function workspaceRouteHarnessHandler(
  request: FastifyRequest<{ Params: WorkspaceRouteHarnessParams }>
) {
  return {
    ok: true,
    workspaceId: request.params.workspaceId,
    requestContext: {
      workspaceId: request.requestContext?.workspaceId ?? null,
      actorId: request.requestContext?.actorId ?? null
    },
    correlationId: request.correlationId ?? null
  };
}

async function permissionGuardHarnessHandler(
  request: FastifyRequest<{
    Params: { requiredPermission: string };
    Querystring: PermissionGuardHarnessQuery;
  }>
) {
  const disclosureMode =
    request.query.disclosureMode === "non_disclosing"
      ? "non_disclosing"
      : "disclosing";

  const decision = evaluatePermissionGuard({
    requiredPermission: request.params.requiredPermission,
    grantedPermissions: STATIC_HARNESS_GRANTED_PERMISSIONS,
    requestContext: {
      workspaceId: request.requestContext?.workspaceId ?? "",
      actorId: request.requestContext?.actorId ?? ""
    },
    disclosureMode
  });

  return { ok: true, decision };
}

async function workspacePermissionGuardHarnessHandler(
  request: FastifyRequest<{
    Params: WorkspacePermissionGuardHarnessParams;
    Querystring: WorkspacePermissionGuardHarnessQuery;
  }>,
  reply: FastifyReply
) {
  const requestContext = request.requestContext;

  if (!requestContext?.actorId || !requestContext.workspaceId) {
    const errorResponse = createHttpErrorResponse({
      code: "REQUEST_CONTEXT_REQUIRED",
      message: "Resolved request context required.",
      statusCode: 500,
      correlationId:
        request.correlationId ?? resolveCorrelationId(request.headers)
    });

    return reply.code(errorResponse.statusCode).send(errorResponse.body);
  }

  const disclosureMode =
    request.query.disclosureMode === "non_disclosing"
      ? "non_disclosing"
      : "disclosing";

  const decision = evaluatePermissionGuard({
    requiredPermission: request.params.requiredPermission,
    grantedPermissions: STATIC_HARNESS_GRANTED_PERMISSIONS,
    requestContext,
    resourceWorkspaceId: request.query.resourceWorkspaceId,
    disclosureMode
  });

  if (!decision.ok) {
    return reply.code(decision.statusCode).send(decision);
  }

  return {
    ok: true,
    workspaceId: requestContext.workspaceId,
    requiredPermission: decision.requiredPermission,
    decision: decision.decision,
    requestContext: decision.requestContext,
    correlationId: request.correlationId ?? null
  };
}

function resolveCorrelationId(headers: FastifyRequest["headers"]): string {
  const raw = headers[CORRELATION_ID_HEADER];
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return randomUUID();
}

type WorkspaceContextGuardHook = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>;

// Selects exactly one auth guard at app-build time: the explicit local E2E
// hook when the bootstrap layer supplied one, otherwise the real Auth0
// guard when authConfig is present, otherwise none. The two are mutually
// exclusive by construction -- there is no per-request fallback between
// them.
function resolveAuthGuardHook(input: {
  localE2eAuthGuardHook?: LocalE2eAuthGuardHook | null;
  authConfig?: AuthConfig;
  jwksGetKey?: JwksGetKey;
}): LocalE2eAuthGuardHook | null {
  if (input.localE2eAuthGuardHook) {
    return input.localE2eAuthGuardHook;
  }

  if (input.authConfig) {
    return createAuthGuardHook({
      config: input.authConfig,
      getKey: input.jwksGetKey
    });
  }

  return null;
}

// Local E2E mode only: the production workspace-context guard never
// attaches grantedPermissions (see workspace-context-guard.ts), so Product
// permission enforcement (permission-guard.ts) would otherwise be
// untestable locally. Membership resolution is scoped strictly to the
// execution of the base guard via runWithLocalE2eMembership(); permission
// enrichment then runs only after that scoped call completes successfully.
// This wrapper is only ever installed when localE2eAuthGuardHook is
// present, so production behavior is unchanged.
function createLocalE2eWorkspaceContextGuard(
  baseWorkspaceContextGuardHook: WorkspaceContextGuardHook
): WorkspaceContextGuardHook {
  return async function localE2eWorkspaceContextGuard(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    await runWithLocalE2eMembership(request.headers, async () => {
      await baseWorkspaceContextGuardHook(request, reply);
    });

    if (reply.sent || !request.requestContext) return;

    request.requestContext = {
      ...request.requestContext,
      grantedPermissions: parseLocalGrantedPermissionsHeader(request.headers)
    };
  };
}

export interface BuildAppOptions extends FastifyServerOptions {
  // Internal-only diagnostic routes (e.g. the workspace route harness) are
  // opt-in and disabled by default so they are never exposed by accident in
  // normal runtime use; callers must explicitly enable them.
  enableInternalHarnessRoutes?: boolean;
  enableInternalPermissionGuardHarnessRoutes?: boolean;
  enableTransitionalRequestContextHeaders?: boolean;
  authConfig?: AuthConfig;
  jwksGetKey?: JwksGetKey;
  workspaceMembershipResolver?: WorkspaceMembershipResolver;
  productRepository?: ProductRepository;
  idempotencyRepository?: IdempotencyRepository;
  auditRepository?: AuditRepository;
  // Set only by the bootstrap layer when NASHIR_ENABLE_LOCAL_E2E_AUTH is
  // explicitly authorized (see local-e2e-auth.ts and index.ts). When
  // present, it fully replaces the real Auth0 guard for this app instance;
  // it is never consulted as a fallback after a failed Auth0 verification.
  localE2eAuthGuardHook?: LocalE2eAuthGuardHook | null;
}

export function buildApp(opts: BuildAppOptions = {}): FastifyInstance {
  const {
    enableInternalHarnessRoutes,
    enableInternalPermissionGuardHarnessRoutes,
    enableTransitionalRequestContextHeaders = false,
    authConfig,
    jwksGetKey,
    workspaceMembershipResolver,
    productRepository,
    idempotencyRepository,
    auditRepository,
    localE2eAuthGuardHook,
    ...fastifyOpts
  } = opts;
  const app = Fastify({ logger: true, ...fastifyOpts });

  app.decorateRequest("requestContext", undefined);
  app.decorateRequest("verifiedIdentityContext", undefined);
  app.decorateRequest("correlationId", undefined);

  const authGuardHook = resolveAuthGuardHook({
    localE2eAuthGuardHook,
    authConfig,
    jwksGetKey
  });

  let workspaceContextGuardHook: WorkspaceContextGuardHook | null = null;
  if (authGuardHook && workspaceMembershipResolver) {
    workspaceContextGuardHook = createWorkspaceContextGuardHook({
      resolveMembership: workspaceMembershipResolver
    });

    if (localE2eAuthGuardHook) {
      app.decorateRequest("localE2eAuth", undefined);
      workspaceContextGuardHook = createLocalE2eWorkspaceContextGuard(
        workspaceContextGuardHook
      );
    }
  }

  if (
    authGuardHook &&
    !workspaceContextGuardHook &&
    productRepository &&
    idempotencyRepository &&
    auditRepository
  ) {
    throw new Error(
      "Product routes require workspaceMembershipResolver when authConfig is configured."
    );
  }

  // Request-context plumbing runs at onRequest -- the earliest hook, before
  // body parsing -- so unauthorized or malformed requests are rejected
  // without the cost or risk of parsing their payload. /health is identified
  // via Fastify's own route metadata (routeOptions.url), which Fastify
  // resolves from the matched route during routing and exposes by the time
  // onRequest hooks run; this avoids fragile manual URL parsing and keeps
  // /health ungated and unaffected, responding identically to before. Unmatched
  // routes also remain ungated so the generic 404 surface does not disclose
  // auth or request-context policy for routes that do not exist.
  app.addHook("onRequest", async (request, reply) => {
    if (
      request.routeOptions?.url === HEALTH_ROUTE ||
      request.routeOptions?.url === undefined
    ) {
      return;
    }

    const correlationId = resolveCorrelationId(request.headers);
    request.correlationId = correlationId;

    // When Auth0 token verification is configured, all non-health requests
    // must pass through authGuard. Transitional harness headers are only
    // available in builds/tests that do not provide authConfig.
    if (authGuardHook) {
      await authGuardHook(request, reply);
      return;
    }

    if (!enableTransitionalRequestContextHeaders) {
      const errorResponse = createHttpErrorResponse({
        code: "REQUEST_CONTEXT_REQUIRED",
        message:
          "Request context requires auth configuration or explicit transitional header mode.",
        statusCode: 401,
        correlationId,
        details: {
          missing: [],
          issues: []
        }
      });

      reply.code(errorResponse.statusCode).send(errorResponse.body);
      return;
    }

    const result = resolveRequestContextFromHeaders(request.headers);
    if (!result.ok) {
      const errorResponse = createHttpErrorResponse({
        code: result.code,
        message: result.message,
        statusCode: result.statusCode,
        correlationId,
        details: {
          missing: result.missing,
          issues: result.issues
        }
      });

      reply.code(errorResponse.statusCode).send(errorResponse.body);
      return;
    }

    request.requestContext = result.context;
  });

  app.get(HEALTH_ROUTE, async () => ({
    data: {
      service: "nashir-backend",
      status: "ok",
      version: "0.0.0"
    }
  }));

  // Read-only harness proving request-context plumbing reaches a real route:
  // it echoes back the route param alongside the gated request context and
  // correlation id, without touching auth, permissions, or any data layer.
  // Opt-in only -- disabled by default so it is never exposed by accident.
  if (enableInternalHarnessRoutes === true) {
    const workspaceRouteHarnessOptions: {
      preHandler?: NonNullable<typeof workspaceContextGuardHook>;
    } = {};

    if (workspaceContextGuardHook) {
      workspaceRouteHarnessOptions.preHandler = workspaceContextGuardHook;
    }

    app.get<{ Params: WorkspaceRouteHarnessParams }>(
      WORKSPACE_ROUTE_HARNESS_ROUTE,
      workspaceRouteHarnessOptions,
      workspaceRouteHarnessHandler
    );
  }

  if (enableInternalPermissionGuardHarnessRoutes === true) {
    app.get(PERMISSION_GUARD_HARNESS_ROUTE, permissionGuardHarnessHandler);

    const workspacePermissionGuardHarnessOptions: {
      preHandler?: NonNullable<typeof workspaceContextGuardHook>;
    } = {};

    if (workspaceContextGuardHook) {
      workspacePermissionGuardHarnessOptions.preHandler =
        workspaceContextGuardHook;
    }

    app.get<{
      Params: WorkspacePermissionGuardHarnessParams;
      Querystring: WorkspacePermissionGuardHarnessQuery;
    }>(
      WORKSPACE_PERMISSION_GUARD_HARNESS_ROUTE,
      workspacePermissionGuardHarnessOptions,
      workspacePermissionGuardHarnessHandler
    );
  }

  if (productRepository && idempotencyRepository && auditRepository) {
    app.register(productPlugin, {
      productRepository,
      idempotencyRepository,
      auditRepository,
      workspaceContextGuardHook
    });
  }

  app.setNotFoundHandler(async (request, reply) => {
    const errorResponse = createHttpErrorResponse({
      code: "NOT_FOUND",
      message: "Route not found.",
      statusCode: 404,
      correlationId:
        request.correlationId ?? resolveCorrelationId(request.headers)
    });

    return reply.code(errorResponse.statusCode).send(errorResponse.body);
  });

  // Catches thrown/unexpected errors only -- the request-context 401 and
  // not-found 404 responses above are sent directly via reply.send and never
  // reach this handler. The thrown error's message and stack are deliberately
  // discarded so internal details are never leaked to the client.
  app.setErrorHandler(async (error, request, reply) => {
    request.log.error(error);

    const errorResponse = createHttpErrorResponse({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error.",
      statusCode: 500,
      correlationId:
        request.correlationId ?? resolveCorrelationId(request.headers)
    });

    return reply.code(errorResponse.statusCode).send(errorResponse.body);
  });

  return app;
}
