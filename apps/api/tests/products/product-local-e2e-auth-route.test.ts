import process from "node:process";
import pg from "pg";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance, InjectOptions } from "fastify";

import { buildApp } from "../../src/app.js";
import { AuditRepository } from "../../src/audit/audit-repository.js";
import {
  createLocalE2eAuthGuardHook,
  createLocalE2eWorkspaceMembershipResolver,
  LOCAL_ACTOR_ID_HEADER,
  LOCAL_WORKSPACES_HEADER
} from "../../src/local-e2e-auth.js";
import { IdempotencyRepository } from "../../src/idempotency/idempotency-repository.js";
import { ProductRepository } from "../../src/products/product-repository.js";
import { expectErrorResponse } from "../helpers/http-assertions.js";
import {
  getRequiredTestDatabaseUrl,
  resetDatabase,
  runMigrationsForTestDatabase,
  truncateIdempotencyData,
  truncateProductData
} from "../helpers/test-db.js";

const { Pool } = pg;

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const describeDb = testDatabaseUrl ? describe : describe.skip;

const WORKSPACE_A = "workspace-local-e2e-a";
const WORKSPACE_B = "workspace-local-e2e-b";
const LOCAL_ACTOR = "local-actor-e2e";

const PERM_READ = "nashir.products.read";
const PERM_MANAGE = "nashir.products.manage";

const GRANTED_PERMISSIONS_HEADER = "x-nashir-granted-permissions";

describeDb("Product routes — local E2E auth mode", () => {
  let pool: pg.Pool;
  let productRepository: ProductRepository;
  let idempotencyRepository: IdempotencyRepository;
  let auditRepository: AuditRepository;

  const openApps: FastifyInstance[] = [];

  beforeAll(async () => {
    const databaseUrl = getRequiredTestDatabaseUrl(
      "local E2E auth product route tests"
    );

    pool = new Pool({ connectionString: databaseUrl });
    await resetDatabase(pool);
    runMigrationsForTestDatabase(databaseUrl);

    productRepository = new ProductRepository(pool);
    idempotencyRepository = new IdempotencyRepository(pool);
    auditRepository = new AuditRepository(pool);
  });

  afterEach(async () => {
    await pool.query("TRUNCATE TABLE audit_events;");
    await truncateProductData(pool);
    await truncateIdempotencyData(pool);
  });

  afterAll(async () => {
    await resetDatabase(pool);
    await pool.end();
    await Promise.all(openApps.splice(0).map((app) => app.close()));
  });

  function buildLocalE2eApp(): FastifyInstance {
    const app = buildApp({
      logger: false,
      localE2eAuthGuardHook: createLocalE2eAuthGuardHook(),
      workspaceMembershipResolver: createLocalE2eWorkspaceMembershipResolver(),
      productRepository,
      idempotencyRepository,
      auditRepository
    });
    openApps.push(app);
    return app;
  }

  async function localInject(
    app: FastifyInstance,
    options: InjectOptions & {
      actorId?: string;
      allowedWorkspaces?: string;
      permissions?: string | null;
    }
  ) {
    const {
      actorId = LOCAL_ACTOR,
      allowedWorkspaces = WORKSPACE_A,
      permissions = `${PERM_READ},${PERM_MANAGE}`,
      headers: extraHeaders = {},
      ...rest
    } = options;

    const headers: Record<string, string> = {
      [LOCAL_ACTOR_ID_HEADER]: actorId,
      [LOCAL_WORKSPACES_HEADER]: allowedWorkspaces,
      ...(extraHeaders as Record<string, string>)
    };

    if (permissions !== null) {
      headers[GRANTED_PERMISSIONS_HEADER] = permissions;
    }

    const response = await app.inject({ headers, ...rest });
    return { response, body: response.json() };
  }

  it("rejects with 401 when the local actor header is missing", async () => {
    const app = buildLocalE2eApp();
    const response = await app.inject({
      method: "GET",
      url: `/workspaces/${WORKSPACE_A}/products?limit=10`
    });
    expectErrorResponse(response, 401, "permission.denied");
  });

  it("rejects with 503 when no local workspace-membership configuration is supplied", async () => {
    const app = buildLocalE2eApp();
    const { response } = await localInject(app, {
      method: "GET",
      url: `/workspaces/${WORKSPACE_A}/products?limit=10`,
      headers: { [LOCAL_WORKSPACES_HEADER]: "" }
    });
    expectErrorResponse(response, 503, "service.unavailable");
  });

  it("returns 403 when nashir.products.manage is missing from local granted permissions", async () => {
    const app = buildLocalE2eApp();
    const { response } = await localInject(app, {
      method: "POST",
      url: `/workspaces/${WORKSPACE_A}/products`,
      permissions: PERM_READ,
      headers: {
        "content-type": "application/json",
        "idempotency-key": "local-e2e-no-manage-perm"
      },
      payload: JSON.stringify({ name: "Should Be Forbidden" })
    });
    expectErrorResponse(response, 403, "permission.denied");
  });

  it("creates a product end-to-end with one audit event, scoped to the allowed workspace", async () => {
    const app = buildLocalE2eApp();
    const { response, body } = await localInject(app, {
      method: "POST",
      url: `/workspaces/${WORKSPACE_A}/products`,
      headers: {
        "content-type": "application/json",
        "idempotency-key": "local-e2e-create-1"
      },
      payload: JSON.stringify({ name: "Local E2E Product" })
    });

    expect(response.statusCode).toBe(201);
    expect(body.product.name).toBe("Local E2E Product");
    expect(body.product.workspaceId).toBe(WORKSPACE_A);

    const events = await pool.query<{ action_name: string }>(
      "SELECT action_name FROM audit_events ORDER BY created_at;"
    );
    expect(events.rows).toEqual([{ action_name: "product.created" }]);
  });

  it("does not duplicate the product or the audit event on idempotency replay", async () => {
    const app = buildLocalE2eApp();
    const headers = {
      "content-type": "application/json",
      "idempotency-key": "local-e2e-replay-1"
    };
    const payload = JSON.stringify({ name: "Replay Product" });

    const first = await localInject(app, {
      method: "POST",
      url: `/workspaces/${WORKSPACE_A}/products`,
      headers,
      payload
    });
    expect(first.response.statusCode).toBe(201);

    const second = await localInject(app, {
      method: "POST",
      url: `/workspaces/${WORKSPACE_A}/products`,
      headers,
      payload
    });
    expect(second.response.statusCode).toBe(201);
    expect(second.body.product.productId).toBe(first.body.product.productId);

    const products = await pool.query(
      "SELECT product_id FROM products WHERE workspace_id = $1;",
      [WORKSPACE_A]
    );
    expect(products.rows).toHaveLength(1);

    const events = await pool.query("SELECT action_name FROM audit_events;");
    expect(events.rows).toHaveLength(1);
  });

  it("does not disclose a workspace-A product through a workspace-B local context (cross-workspace isolation)", async () => {
    const created = await productRepository.createProduct({
      workspaceId: WORKSPACE_A,
      input: { name: "Workspace A Only" }
    });

    const app = buildLocalE2eApp();

    // Local actor is configured as a member of workspace B only. Workspace
    // B membership succeeds (it is a real, configured workspace), but the
    // product lookup is scoped to workspace B at the repository level, so
    // a workspace-A product is reported as a generic not-found -- the same
    // disposition the production path uses for cross-workspace lookups
    // (see "returns 404 when product belongs to a different workspace" in
    // product-route-handler.test.ts) -- never as a distinguishable
    // workspace-membership error that would leak its existence.
    const { response } = await localInject(app, {
      method: "GET",
      url: `/workspaces/${WORKSPACE_B}/products/${created.productId}`,
      allowedWorkspaces: WORKSPACE_B
    });

    expectErrorResponse(response, 404, "resource.not_found");
  });

  it("denies membership entirely when the actor's local-workspaces configuration excludes the requested workspace", async () => {
    const app = buildLocalE2eApp();

    const { response } = await localInject(app, {
      method: "GET",
      url: `/workspaces/${WORKSPACE_B}/products?limit=10`,
      allowedWorkspaces: WORKSPACE_A
    });

    expectErrorResponse(response, 404, "workspace.not_found");
  });

  it("allows read and returns the product when the local actor is configured as a member", async () => {
    const created = await productRepository.createProduct({
      workspaceId: WORKSPACE_A,
      input: { name: "Readable Product", status: "active" }
    });

    const app = buildLocalE2eApp();
    const { response, body } = await localInject(app, {
      method: "GET",
      url: `/workspaces/${WORKSPACE_A}/products/${created.productId}`
    });

    expect(response.statusCode).toBe(200);
    expect(body.product.productId).toBe(created.productId);
    expect(body.product.workspaceId).toBe(WORKSPACE_A);
  });

  it("updates a product end-to-end with exactly one product.updated audit event", async () => {
    const created = await productRepository.createProduct({
      workspaceId: WORKSPACE_A,
      input: { name: "Before Update" }
    });

    const app = buildLocalE2eApp();
    const { response, body } = await localInject(app, {
      method: "PUT",
      url: `/workspaces/${WORKSPACE_A}/products/${created.productId}`,
      headers: {
        "content-type": "application/json",
        "if-match": String(created.version)
      },
      payload: JSON.stringify({ name: "After Update" })
    });

    expect(response.statusCode).toBe(200);
    expect(body.product.name).toBe("After Update");

    const events = await pool.query<{ action_name: string }>(
      "SELECT action_name FROM audit_events ORDER BY created_at;"
    );
    expect(events.rows).toEqual([{ action_name: "product.updated" }]);
  });

  it("does not log the raw local actor/workspace header values as Authorization-equivalent secrets", async () => {
    // Sanity check that the local guard hook path does not require or
    // forward an Authorization header at all when local mode is active.
    const app = buildLocalE2eApp();
    const { response } = await localInject(app, {
      method: "GET",
      url: `/workspaces/${WORKSPACE_A}/products?limit=10`,
      headers: { authorization: "Bearer should-be-irrelevant-in-local-mode" }
    });

    expect(response.statusCode).toBe(200);
  });
});

describeDb("Product routes — default mode unaffected by local E2E auth module", () => {
  let pool: pg.Pool;
  let productRepository: ProductRepository;
  let idempotencyRepository: IdempotencyRepository;
  let auditRepository: AuditRepository;
  const openApps: FastifyInstance[] = [];

  beforeAll(async () => {
    const databaseUrl = getRequiredTestDatabaseUrl(
      "default-mode regression check"
    );
    pool = new Pool({ connectionString: databaseUrl });
    await resetDatabase(pool);
    runMigrationsForTestDatabase(databaseUrl);

    productRepository = new ProductRepository(pool);
    idempotencyRepository = new IdempotencyRepository(pool);
    auditRepository = new AuditRepository(pool);
  });

  afterAll(async () => {
    await resetDatabase(pool);
    await pool.end();
    await Promise.all(openApps.splice(0).map((app) => app.close()));
  });

  it("still returns 401 for Product routes when neither authConfig nor localE2eAuthGuardHook is provided", async () => {
    const app = buildApp({
      logger: false,
      enableTransitionalRequestContextHeaders: false,
      productRepository,
      idempotencyRepository,
      auditRepository
    });
    openApps.push(app);

    const response = await app.inject({
      method: "GET",
      url: `/workspaces/${WORKSPACE_A}/products?limit=10`,
      headers: {
        [LOCAL_ACTOR_ID_HEADER]: LOCAL_ACTOR,
        [LOCAL_WORKSPACES_HEADER]: WORKSPACE_A
      }
    });

    expectErrorResponse(response, 401, "permission.denied");
  });
});
