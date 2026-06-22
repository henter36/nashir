import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import type { AuthConfig } from "../src/auth-config.js";
import { buildApp, type BuildAppOptions } from "../src/app.js";
import {
  assertLocalE2eAuthProductionSafe,
  createLocalE2eAuthGuardHook,
  createLocalE2eWorkspaceMembershipResolver,
  isLocalE2eAuthRequested,
  LOCAL_ACTOR_ID_HEADER,
  LOCAL_E2E_AUTH_REQUEST_ENV,
  LOCAL_WORKSPACES_HEADER
} from "../src/local-e2e-auth.js";

const ROUTE_WORKSPACE_ID = "workspace-route";
const harnessPath = `/internal/workspace-route-harness/${ROUTE_WORKSPACE_ID}`;
const GRANTED_PERMISSIONS_HEADER = "x-nashir-granted-permissions";

const apps: FastifyInstance[] = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

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
  const issuer = "https://default-mode-auth.example.com/";
  const audience = "https://default-mode-api.example.com";

  const authConfig: AuthConfig = {
    AUTH0_ISSUER_URL: issuer,
    AUTH0_AUDIENCE: audience,
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
    const app = defaultApp();

    const res = await app.inject({ method: "GET", url: harnessPath });

    expect(res.statusCode).toBe(401);
    expect(res.json().errorCode).toBe("permission.denied");
  });

  it("ignores local headers entirely when local mode is disabled", async () => {
    const app = defaultApp();

    const res = await app.inject({
      method: "GET",
      url: harnessPath,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "local-actor-1",
        [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID
      }
    });

    // No Authorization header was sent -- local headers must not substitute
    // for it. Same 401 as the case above with no headers at all.
    expect(res.statusCode).toBe(401);
    expect(res.json().errorCode).toBe("permission.denied");
  });

  it("never falls back to local mode after a real Auth0 verification failure", async () => {
    const app = defaultApp();

    const res = await app.inject({
      method: "GET",
      url: harnessPath,
      headers: {
        authorization: "Bearer not-a-valid-jwt",
        [LOCAL_ACTOR_ID_HEADER]: "local-actor-1",
        [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID
      }
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().errorCode).toBe("permission.denied");
  });
});

// ---------------------------------------------------------------------------
// Local E2E auth guard hook — actor identity boundary
// ---------------------------------------------------------------------------

describe("createLocalE2eAuthGuardHook — actor identity boundary", () => {
  it("rejects a request with no local actor header", async () => {
    const res = await localApp().inject({
      method: "GET",
      url: harnessPath,
      headers: { [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID }
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().errorCode).toBe("permission.denied");
  });

  it("rejects a blank local actor header", async () => {
    const res = await localApp().inject({
      method: "GET",
      url: harnessPath,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "   ",
        [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID
      }
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().errorCode).toBe("permission.denied");
  });

  it.each(["has space", "weird/chars!", "semi;colon"])(
    "rejects a malformed local actor header: %s",
    async (actorId) => {
      const res = await localApp().inject({
        method: "GET",
        url: harnessPath,
        headers: {
          [LOCAL_ACTOR_ID_HEADER]: actorId,
          [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID
        }
      });

      expect(res.statusCode).toBe(401);
      expect(res.json().errorCode).toBe("permission.denied");
    }
  );

  it("accepts a well-formed local actor header and binds it as verified identity", async () => {
    const res = await localApp().inject({
      method: "GET",
      url: harnessPath,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "local-actor-1",
        [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID
      }
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
    const res = await localApp().inject({
      method: "GET",
      url: harnessPath,
      headers: { [LOCAL_ACTOR_ID_HEADER]: "local-actor-1" }
    });

    expect(res.statusCode).toBe(503);
    expect(res.json().errorCode).toBe("service.unavailable");
  });

  it("rejects when the local-workspaces header is blank", async () => {
    const res = await localApp().inject({
      method: "GET",
      url: harnessPath,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "local-actor-1",
        [LOCAL_WORKSPACES_HEADER]: "   "
      }
    });

    expect(res.statusCode).toBe(503);
    expect(res.json().errorCode).toBe("service.unavailable");
  });

  it("allows membership when the route workspace is in the configured set (workspace A)", async () => {
    const res = await localApp().inject({
      method: "GET",
      url: harnessPath,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "local-actor-1",
        [LOCAL_WORKSPACES_HEADER]: `${ROUTE_WORKSPACE_ID},workspace-b`
      }
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().requestContext.workspaceId).toBe(ROUTE_WORKSPACE_ID);
  });

  it("denies membership with a non-disclosing 404 when the route workspace is not configured (workspace B)", async () => {
    const res = await localApp().inject({
      method: "GET",
      url: "/internal/workspace-route-harness/workspace-b",
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "local-actor-1",
        // Configured for workspace A only -- workspace B must be denied.
        [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID
      }
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().errorCode).toBe("workspace.not_found");
  });

  it("does not use an unconditional member result -- two different actors get independent outcomes", async () => {
    const app = localApp();

    const allowed = await app.inject({
      method: "GET",
      url: harnessPath,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "actor-a",
        [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID
      }
    });
    expect(allowed.statusCode).toBe(200);

    const denied = await app.inject({
      method: "GET",
      url: harnessPath,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "actor-b",
        [LOCAL_WORKSPACES_HEADER]: "workspace-b"
      }
    });
    expect(denied.statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Granted-permissions enrichment (local mode only)
// ---------------------------------------------------------------------------

describe("local E2E granted-permissions enrichment", () => {
  it("reads granted permissions from the existing x-nashir-granted-permissions header", async () => {
    const app = localApp();

    const res = await app.inject({
      method: "GET",
      url: harnessPath,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: "local-actor-1",
        [LOCAL_WORKSPACES_HEADER]: ROUTE_WORKSPACE_ID,
        [GRANTED_PERMISSIONS_HEADER]: "nashir.products.read"
      }
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
// Concurrency isolation — the local membership resolver threads per-request
// state through AsyncLocalStorage (see local-e2e-auth.ts), not a shared
// module-level variable. A single shared app instance handling many
// concurrent requests for different actors/workspaces must never let one
// request's context leak into another's response.
// ---------------------------------------------------------------------------

describe("local E2E workspace membership — concurrency isolation", () => {
  const CONCURRENT_PAIRS = 30;

  function workspaceHarnessPath(workspaceId: string): string {
    return `/internal/workspace-route-harness/${workspaceId}`;
  }

  it("does not leak actor/workspace context between concurrent allowed requests", async () => {
    const app = localApp();

    const results = await Promise.all(
      Array.from({ length: CONCURRENT_PAIRS }, (_, i) => i).flatMap((i) => {
        const actorA = `actor-a-${i}`;
        const actorB = `actor-b-${i}`;

        return [
          app
            .inject({
              method: "GET",
              url: workspaceHarnessPath("workspace-a"),
              headers: {
                [LOCAL_ACTOR_ID_HEADER]: actorA,
                [LOCAL_WORKSPACES_HEADER]: "workspace-a"
              }
            })
            .then((res) => ({
              expectedActorId: actorA,
              expectedWorkspaceId: "workspace-a",
              res
            })),
          app
            .inject({
              method: "GET",
              url: workspaceHarnessPath("workspace-b"),
              headers: {
                [LOCAL_ACTOR_ID_HEADER]: actorB,
                [LOCAL_WORKSPACES_HEADER]: "workspace-b"
              }
            })
            .then((res) => ({
              expectedActorId: actorB,
              expectedWorkspaceId: "workspace-b",
              res
            }))
        ];
      })
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
      Array.from({ length: CONCURRENT_PAIRS }, (_, i) => i).flatMap((i) => {
        const actorA = `actor-a-${i}`;
        const actorB = `actor-b-${i}`;

        return [
          // actorA is only a member of workspace-a, but requests workspace-b.
          app.inject({
            method: "GET",
            url: workspaceHarnessPath("workspace-b"),
            headers: {
              [LOCAL_ACTOR_ID_HEADER]: actorA,
              [LOCAL_WORKSPACES_HEADER]: "workspace-a"
            }
          }),
          // actorB is only a member of workspace-b, but requests workspace-a.
          app.inject({
            method: "GET",
            url: workspaceHarnessPath("workspace-a"),
            headers: {
              [LOCAL_ACTOR_ID_HEADER]: actorB,
              [LOCAL_WORKSPACES_HEADER]: "workspace-b"
            }
          })
        ];
      })
    );

    for (const res of results) {
      expect(res.statusCode).toBe(404);
      expect(res.json().errorCode).toBe("workspace.not_found");
    }
  });
});
