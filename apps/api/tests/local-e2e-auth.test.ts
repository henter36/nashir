import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import type { AuthConfig } from "../src/auth-config.js";
import { buildApp, type BuildAppOptions } from "../src/app.js";
import {
  assertLocalE2eAuthProductionSafe,
  createLocalE2eAuthGuardHook,
  createLocalE2eWorkspaceMembershipResolver,
  isLocalE2eAuthRequested,
  runWithLocalE2eMembership,
  LOCAL_ACTOR_ID_HEADER,
  LOCAL_E2E_AUTH_REQUEST_ENV,
  LOCAL_WORKSPACES_HEADER
} from "../src/local-e2e-auth.js";
import { expectErrorResponse } from "./helpers/http-assertions.js";

const ROUTE_WORKSPACE_ID = "workspace-route";
const GRANTED_PERMISSIONS_HEADER = "x-nashir-granted-permissions";

const apps: FastifyInstance[] = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

function workspaceHarnessPath(workspaceId: string): string {
  return `/internal/workspace-route-harness/${workspaceId}`;
}

function localApp(options: Partial<BuildAppOptions> = {}): FastifyInstance {
  const app = buildApp({
    logger: false,
    enableInternalHarnessRoutes: true,
    localE2eAuthGuardHook: createLocalE2eAuthGuardHook(),
    workspaceMembershipResolver: createLocalE2eWorkspaceMembershipResolver(),
    ...options
  });
  apps.push(app);
  return app;
}

// Injects a GET against the workspace-route harness with the given local
// E2E headers. `actorId`/`workspaces` are omitted entirely when undefined,
// so callers can exercise the "header absent" boundary precisely.
function injectLocalHarness(
  app: FastifyInstance,
  params: {
    workspaceId?: string;
    actorId?: string;
    workspaces?: string;
    extraHeaders?: Record<string, string>;
  } = {}
): Promise<Awaited<ReturnType<FastifyInstance["inject"]>>> {
  const {
    workspaceId = ROUTE_WORKSPACE_ID,
    actorId,
    workspaces,
    extraHeaders = {}
  } = params;

  const headers: Record<string, string> = { ...extraHeaders };
  if (actorId !== undefined) headers[LOCAL_ACTOR_ID_HEADER] = actorId;
  if (workspaces !== undefined) headers[LOCAL_WORKSPACES_HEADER] = workspaces;

  return app.inject({
    method: "GET",
    url: workspaceHarnessPath(workspaceId),
    headers
  });
}

// ---------------------------------------------------------------------------
// Bootstrap-level flag/production-safety checks (no Fastify app needed)
// ---------------------------------------------------------------------------

describe("isLocalE2eAuthRequested", () => {
  it.each(["1", "true", "TRUE"])("is true for %s", (value) => {
    expect(
      isLocalE2eAuthRequested({ [LOCAL_E2E_AUTH_REQUEST_ENV]: value })
    ).toBe(true);
  });

  it.each([undefined, "", "0", "false", "yes"])("is false for %s", (value) => {
    expect(
      isLocalE2eAuthRequested({ [LOCAL_E2E_AUTH_REQUEST_ENV]: value })
    ).toBe(false);
  });
});

describe("assertLocalE2eAuthProductionSafe", () => {
  it("throws when enabled under NODE_ENV=production", () => {
    expect(() =>
      assertLocalE2eAuthProductionSafe({
        NODE_ENV: "production",
        [LOCAL_E2E_AUTH_REQUEST_ENV]: "true"
      })
    ).toThrow(
      `${LOCAL_E2E_AUTH_REQUEST_ENV} cannot be enabled when NODE_ENV=production.`
    );
  });

  it.each(["development", "test"])(
    "does not throw when enabled under NODE_ENV=%s",
    (nodeEnv) => {
      expect(() =>
        assertLocalE2eAuthProductionSafe({
          NODE_ENV: nodeEnv,
          [LOCAL_E2E_AUTH_REQUEST_ENV]: "true"
        })
      ).not.toThrow();
    }
  );

  it("does not throw under NODE_ENV=production when not requested", () => {
    expect(() =>
      assertLocalE2eAuthProductionSafe({ NODE_ENV: "production" })
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Default mode is unaffected: real Auth0/JWKS configuration is still
// required, and local headers do nothing when local mode is disabled.
// ---------------------------------------------------------------------------

describe("default mode (local E2E auth disabled)", () => {
  const authConfig: AuthConfig = {
    AUTH0_ISSUER_URL: "https://default-mode-auth.example.com/",
    AUTH0_AUDIENCE: "https://default-mode-api.example.com",
    JWKS_CACHE_TTL_SECONDS: 600,
    JWKS_REFRESH_COOLDOWN_SECONDS: 30,
    TOKEN_LEEWAY_SECONDS: 0
  };

  function defaultApp(): FastifyInstance {
    const app = buildApp({
      logger: false,
      enableInternalHarnessRoutes: true,
      authConfig,
      workspaceMembershipResolver: () => ({ outcome: "member" })
    });
    apps.push(app);
    return app;
  }

  it("still requires a real Authorization Bearer token (no localE2eAuthGuardHook wired)", async () => {
    const res = await defaultApp().inject({
      method: "GET",
      url: workspaceHarnessPath(ROUTE_WORKSPACE_ID)
    });

    expectErrorResponse(res, 401, "permission.denied");
  });

  it("ignores local headers entirely when local mode is disabled", async () => {
    const res = await injectLocalHarness(defaultApp(), {
      actorId: "local-actor-1",
      workspaces: ROUTE_WORKSPACE_ID
    });

    // No Authorization header was sent -- local headers must not substitute
    // for it. Same 401 as the case above with no headers at all.
    expectErrorResponse(res, 401, "permission.denied");
  });

  it("never falls back to local mode after a real Auth0 verification failure", async () => {
    const res = await injectLocalHarness(defaultApp(), {
      actorId: "local-actor-1",
      workspaces: ROUTE_WORKSPACE_ID,
      extraHeaders: { authorization: "Bearer not-a-valid-jwt" }
    });

    expectErrorResponse(res, 401, "permission.denied");
  });
});

// ---------------------------------------------------------------------------
// Local E2E auth guard hook — actor identity boundary
// ---------------------------------------------------------------------------

describe("createLocalE2eAuthGuardHook — actor identity boundary", () => {
  it("rejects a request with no local actor header", async () => {
    const res = await injectLocalHarness(localApp(), {
      workspaces: ROUTE_WORKSPACE_ID
    });

    expectErrorResponse(res, 401, "permission.denied");
  });

  it("rejects a blank local actor header", async () => {
    const res = await injectLocalHarness(localApp(), {
      actorId: "   ",
      workspaces: ROUTE_WORKSPACE_ID
    });

    expectErrorResponse(res, 401, "permission.denied");
  });

  it.each(["has space", "weird/chars!", "semi;colon"])(
    "rejects a malformed local actor header: %s",
    async (actorId) => {
      const res = await injectLocalHarness(localApp(), {
        actorId,
        workspaces: ROUTE_WORKSPACE_ID
      });

      expectErrorResponse(res, 401, "permission.denied");
    }
  );

  it("accepts a well-formed local actor header and binds it as verified identity", async () => {
    const res = await injectLocalHarness(localApp(), {
      actorId: "local-actor-1",
      workspaces: ROUTE_WORKSPACE_ID
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().requestContext).toEqual({
      workspaceId: ROUTE_WORKSPACE_ID,
      actorId: "local-actor-1"
    });
  });
});

// ---------------------------------------------------------------------------
// Local E2E workspace membership resolver — at least two deterministic
// workspace contexts, and no unconditional "member" result.
// ---------------------------------------------------------------------------

describe("createLocalE2eWorkspaceMembershipResolver — workspace membership", () => {
  it("rejects when workspace-membership configuration is entirely missing", async () => {
    const res = await injectLocalHarness(localApp(), {
      actorId: "local-actor-1"
    });

    expectErrorResponse(res, 503, "service.unavailable");
  });

  it("rejects when the local-workspaces header is blank", async () => {
    const res = await injectLocalHarness(localApp(), {
      actorId: "local-actor-1",
      workspaces: "   "
    });

    expectErrorResponse(res, 503, "service.unavailable");
  });

  it("allows membership when the route workspace is in the configured set (workspace A)", async () => {
    const res = await injectLocalHarness(localApp(), {
      actorId: "local-actor-1",
      workspaces: `${ROUTE_WORKSPACE_ID},workspace-b`
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().requestContext.workspaceId).toBe(ROUTE_WORKSPACE_ID);
  });

  it("denies membership with a non-disclosing 404 when the route workspace is not configured (workspace B)", async () => {
    const res = await injectLocalHarness(localApp(), {
      workspaceId: "workspace-b",
      actorId: "local-actor-1",
      // Configured for workspace A only -- workspace B must be denied.
      workspaces: ROUTE_WORKSPACE_ID
    });

    expectErrorResponse(res, 404, "workspace.not_found");
  });

  it("does not use an unconditional member result -- two different actors get independent outcomes", async () => {
    const app = localApp();

    const allowed = await injectLocalHarness(app, {
      actorId: "actor-a",
      workspaces: ROUTE_WORKSPACE_ID
    });
    expect(allowed.statusCode).toBe(200);

    const denied = await injectLocalHarness(app, {
      actorId: "actor-b",
      workspaces: "workspace-b"
    });
    expectErrorResponse(denied, 404, "workspace.not_found");
  });
});

// ---------------------------------------------------------------------------
// Granted-permissions enrichment (local mode only)
// ---------------------------------------------------------------------------

describe("local E2E granted-permissions enrichment", () => {
  it("reads granted permissions from the existing x-nashir-granted-permissions header", async () => {
    const res = await injectLocalHarness(localApp(), {
      actorId: "local-actor-1",
      workspaces: ROUTE_WORKSPACE_ID,
      extraHeaders: { [GRANTED_PERMISSIONS_HEADER]: "nashir.products.read" }
    });

    expect(res.statusCode).toBe(200);
    // The workspace-route harness intentionally only echoes
    // actorId/workspaceId (see workspaceRouteHarnessHandler in app.ts);
    // full grantedPermissions enforcement is proven against real Product
    // routes in tests/products/product-local-e2e-auth-route.test.ts.
    expect(res.json().requestContext).toEqual({
      workspaceId: ROUTE_WORKSPACE_ID,
      actorId: "local-actor-1"
    });
  });
});

// ---------------------------------------------------------------------------
// runWithLocalE2eMembership scoping — proves the migration from
// AsyncLocalStorage.enterWith() to .run() actually scopes membership state
// to the callback, rather than leaving it set for the rest of the request
// or leaking it to unrelated calls.
// ---------------------------------------------------------------------------

describe("runWithLocalE2eMembership — scoping", () => {
  it("reports unavailable when the resolver is invoked outside any runWithLocalE2eMembership scope", () => {
    const resolver = createLocalE2eWorkspaceMembershipResolver();

    expect(
      resolver({ actorId: "actor-x", workspaceId: "workspace-a" })
    ).toEqual({ outcome: "unavailable" });
  });

  it("scopes membership strictly to the run() callback and clears it once the callback settles", async () => {
    const resolver = createLocalE2eWorkspaceMembershipResolver();

    await runWithLocalE2eMembership(
      { [LOCAL_WORKSPACES_HEADER]: "workspace-a" },
      async () => {
        expect(
          resolver({ actorId: "actor-x", workspaceId: "workspace-a" })
        ).toEqual({ outcome: "member" });
        expect(
          resolver({ actorId: "actor-x", workspaceId: "workspace-b" })
        ).toEqual({ outcome: "not_member" });
      }
    );

    // Outside the scoped callback, the store must not still report the
    // membership decided inside it.
    expect(
      resolver({ actorId: "actor-x", workspaceId: "workspace-a" })
    ).toEqual({ outcome: "unavailable" });
  });
});

// ---------------------------------------------------------------------------
// Concurrency isolation — the local membership resolver threads per-request
// state through AsyncLocalStorage (see local-e2e-auth.ts), not a shared
// module-level variable. A single shared app instance handling many
// concurrent requests for different actors/workspaces must never let one
// request's context leak into another's response.
// ---------------------------------------------------------------------------

describe("local E2E workspace membership — concurrency isolation", () => {
  const CONCURRENT_PAIRS = 30;

  function concurrentPairs<T>(
    build: (i: number, actorA: string, actorB: string) => [T, T]
  ): T[] {
    return Array.from({ length: CONCURRENT_PAIRS }, (_, i) => i).flatMap((i) =>
      build(i, `actor-a-${i}`, `actor-b-${i}`)
    );
  }

  it("does not leak actor/workspace context between concurrent allowed requests", async () => {
    const app = localApp();

    const results = await Promise.all(
      concurrentPairs((_i, actorA, actorB) => [
        injectLocalHarness(app, {
          workspaceId: "workspace-a",
          actorId: actorA,
          workspaces: "workspace-a"
        }).then((res) => ({
          expectedActorId: actorA,
          expectedWorkspaceId: "workspace-a",
          res
        })),
        injectLocalHarness(app, {
          workspaceId: "workspace-b",
          actorId: actorB,
          workspaces: "workspace-b"
        }).then((res) => ({
          expectedActorId: actorB,
          expectedWorkspaceId: "workspace-b",
          res
        }))
      ])
    );

    for (const { expectedActorId, expectedWorkspaceId, res } of results) {
      expect(res.statusCode).toBe(200);
      expect(res.json().requestContext).toEqual({
        workspaceId: expectedWorkspaceId,
        actorId: expectedActorId
      });
    }
  });

  it("does not leak denial state between concurrent cross-workspace requests (non-disclosing 404 preserved per actor)", async () => {
    const app = localApp();

    const results = await Promise.all(
      concurrentPairs((_i, actorA, actorB) => [
        // actorA is only a member of workspace-a, but requests workspace-b.
        injectLocalHarness(app, {
          workspaceId: "workspace-b",
          actorId: actorA,
          workspaces: "workspace-a"
        }),
        // actorB is only a member of workspace-b, but requests workspace-a.
        injectLocalHarness(app, {
          workspaceId: "workspace-a",
          actorId: actorB,
          workspaces: "workspace-b"
        })
      ])
    );

    for (const res of results) {
      expectErrorResponse(res, 404, "workspace.not_found");
    }
  });
});
