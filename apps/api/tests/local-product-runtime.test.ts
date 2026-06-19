import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../src/app.js";
import type { AuthConfig } from "../src/auth-config.js";
import {
  createLocalProductRuntimeDependencies,
  LOCAL_PRODUCT_RUNTIME_REQUEST_ENV
} from "../src/local-product-runtime.js";

const authConfig: AuthConfig = {
  AUTH0_ISSUER_URL: "https://local-runtime-auth.example.com/",
  AUTH0_AUDIENCE: "https://local-runtime-api.example.com",
  JWKS_CACHE_TTL_SECONDS: 600,
  JWKS_REFRESH_COOLDOWN_SECONDS: 30,
  TOKEN_LEEWAY_SECONDS: 0
};

const databaseUrl = "postgres://localhost/nashir_local_runtime_test";

const openApps = new Set<FastifyInstance>();
const closeCallbacks = new Set<() => Promise<void>>();

afterEach(async () => {
  await Promise.all([...openApps].map((app) => app.close()));
  await Promise.all([...closeCallbacks].map((close) => close()));
  openApps.clear();
  closeCallbacks.clear();
});

function buildLocalRuntimeApp(env: Record<string, string | undefined>) {
  const runtime = createLocalProductRuntimeDependencies({ env });

  if (!runtime) {
    throw new Error("Expected local Product runtime dependencies.");
  }

  closeCallbacks.add(runtime.close);

  const app = buildApp({
    logger: false,
    authConfig,
    ...runtime.buildAppOptions
  });

  openApps.add(app);

  return app;
}

describe("local Product runtime bootstrap wiring", () => {
  it("does not wire Product runtime dependencies in production", () => {
    const runtime = createLocalProductRuntimeDependencies({
      env: {
        NODE_ENV: "production",
        DATABASE_URL: databaseUrl
      }
    });

    expect(runtime).toBeUndefined();
  });

  it("fails safely when local Product runtime wiring is requested without DATABASE_URL", () => {
    expect(() =>
      createLocalProductRuntimeDependencies({
        env: {
          NODE_ENV: "development",
          [LOCAL_PRODUCT_RUNTIME_REQUEST_ENV]: "true"
        }
      })
    ).toThrow(
      `DATABASE_URL is required when ${LOCAL_PRODUCT_RUNTIME_REQUEST_ENV} is enabled.`
    );
  });

  it("fails safely when local Product runtime wiring is requested in production", () => {
    expect(() =>
      createLocalProductRuntimeDependencies({
        env: {
          NODE_ENV: "production",
          DATABASE_URL: databaseUrl,
          [LOCAL_PRODUCT_RUNTIME_REQUEST_ENV]: "true"
        }
      })
    ).toThrow(
      `${LOCAL_PRODUCT_RUNTIME_REQUEST_ENV} cannot be enabled when NODE_ENV=production.`
    );
  });

  it("keeps health available and registers accepted Product routes in local/dev runtime", async () => {
    const app = buildLocalRuntimeApp({
      NODE_ENV: "development",
      DATABASE_URL: databaseUrl
    });

    await app.ready();

    expect(
      app.hasRoute({ method: "GET", url: "/workspaces/:workspaceId/products" })
    ).toBe(true);
    expect(
      app.hasRoute({
        method: "POST",
        url: "/workspaces/:workspaceId/products"
      })
    ).toBe(true);
    expect(
      app.hasRoute({
        method: "GET",
        url: "/workspaces/:workspaceId/products/:productId"
      })
    ).toBe(true);
    expect(
      app.hasRoute({
        method: "PUT",
        url: "/workspaces/:workspaceId/products/:productId"
      })
    ).toBe(true);
    expect(
      app.hasRoute({
        method: "DELETE",
        url: "/workspaces/:workspaceId/products/:productId"
      })
    ).toBe(false);
    expect(
      app.hasRoute({
        method: "GET",
        url: "/workspaces/:workspaceId/nashir-products"
      })
    ).toBe(false);

    const health = await app.inject({ method: "GET", url: "/health" });
    expect(health.statusCode).toBe(200);

    const productList = await app.inject({
      method: "GET",
      url: "/workspaces/local-validation-workspace/products"
    });
    expect(productList.statusCode).toBe(401);
    expect(productList.json().message).not.toBe("Route not found.");

    const nashirProducts = await app.inject({
      method: "GET",
      url: "/workspaces/local-validation-workspace/nashir-products"
    });
    expect(nashirProducts.statusCode).toBe(404);
    expect(nashirProducts.json().message).toBe("Route not found.");
  });
});
