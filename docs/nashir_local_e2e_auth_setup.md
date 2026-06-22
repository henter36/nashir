# Nashir Local E2E Auth — Setup

## Purpose

Documents the explicit, local-only authentication and workspace-membership
validation mode introduced to unblock the previously recorded **BLOCKED**
Product Catalog end-to-end validation
(`docs/nashir_product_catalog_end_to_end_validation_review.md`), which could
not exercise authenticated Product API scenarios because no real Auth0
tenant/token was available and no local validation bypass existed.

**This mode is forbidden in production.** Startup fails closed
(`process.exit(1)`) if `NASHIR_ENABLE_LOCAL_E2E_AUTH` is set while
`NODE_ENV=production`, independent of every other condition below.

This is documentation for an existing local-only capability. It does not
change Product Catalog UI behavior, OpenAPI, migrations, or the real
Auth0/JWKS path, which remains exactly as before when this mode is disabled.

## When this mode activates

All of the following must be true, or the backend will not start with this
mode active:

1. `NODE_ENV` is exactly `development` or `test`.
2. `NASHIR_ENABLE_LOCAL_E2E_AUTH` is exactly `1` or `true`.
3. `NASHIR_ENABLE_LOCAL_PRODUCT_RUNTIME` is also enabled (`1` or `true`).
4. The request supplies explicit local actor and workspace-membership
   headers (see below) — there is no default actor, no default workspace,
   and no allow-all membership outcome.

There is no automatic activation based on `localhost`, a missing Auth0
configuration, or any hostname/environment heuristic. If the flag is set
but `NODE_ENV` is not `development`/`test`, or
`NASHIR_ENABLE_LOCAL_PRODUCT_RUNTIME` is not also enabled, the process logs
the specific reason and exits — it never silently falls back to the real
Auth0 path or to an unauthenticated mode.

When this mode is active, `AUTH0_ISSUER_URL`/`AUTH0_AUDIENCE` are **not**
read or required — the real Auth0 guard is never constructed in this
process. When this mode is disabled (the default), nothing changes: the
real Auth0/JWKS path is used exactly as before, and the headers below are
never read.

## Exact local startup procedure

```bash
cd apps/api

# Local, non-production database only. Never point this at a production
# database.
createdb nashir_backend_test   # if it does not already exist

env -u DATABASE_URL -u MIGRATION_DATABASE_URL \
  TEST_DATABASE_URL="postgres://<local-user>@localhost:5432/nashir_backend_test" \
  pnpm run db:migrate

env \
  NODE_ENV=development \
  HOST=127.0.0.1 \
  PORT=5050 \
  DATABASE_URL="postgres://<local-user>@localhost:5432/nashir_backend_test" \
  NASHIR_ENABLE_LOCAL_PRODUCT_RUNTIME=1 \
  NASHIR_ENABLE_LOCAL_E2E_AUTH=1 \
  pnpm run dev
```

Port 5000 is unreliable on macOS due to AirPlay Receiver
(`docs/nashir_product_catalog_end_to_end_validation_review.md`, §3); prefer
a different local port such as 5050.

## Required local identity inputs

Every Product API request in this mode must supply:

| Header | Required | Purpose |
|---|---|---|
| `x-nashir-local-actor-id` | Yes | The local actor identity. Must match `^[A-Za-z0-9][A-Za-z0-9._:\|-]{0,127}$`. Missing or blank → `401`. Malformed → `401`. |
| `x-nashir-local-workspaces` | Yes | Comma-separated list of workspace IDs this local actor is a member of (e.g. `workspace-a,workspace-b`). Missing or blank → `503` (`WORKSPACE_MEMBERSHIP_UNAVAILABLE`) — this is a configuration error, not a silent allow or deny. |
| `x-nashir-granted-permissions` | Only if the route requires a permission | Comma-separated list of granted permissions (e.g. `nashir.products.read,nashir.products.manage`), reusing the existing header convention from `request-context.ts`. Absent → no permissions are granted, so any permission-gated route returns `403`. |

There is no fake/forged JWT involved anywhere in this mode. The actor
identity and workspace membership are supplied directly as explicit,
visibly local headers — they are never disguised as an Auth0 token.

## Two deterministic workspace contexts

The local workspace-membership resolver does not default to "member" the
way the pre-existing `NASHIR_ENABLE_LOCAL_PRODUCT_RUNTIME`-only shim does.
It evaluates `x-nashir-local-workspaces` per request:

```bash
# Workspace A — membership allowed
curl http://127.0.0.1:5050/workspaces/workspace-a/products?limit=10 \
  -H "x-nashir-local-actor-id: local-actor-1" \
  -H "x-nashir-local-workspaces: workspace-a" \
  -H "x-nashir-granted-permissions: nashir.products.read"
# → 200

# Workspace B — membership denied (same actor, not configured for workspace-b)
curl http://127.0.0.1:5050/workspaces/workspace-b/products?limit=10 \
  -H "x-nashir-local-actor-id: local-actor-1" \
  -H "x-nashir-local-workspaces: workspace-a" \
  -H "x-nashir-granted-permissions: nashir.products.read"
# → 404 (workspace.not_found, non-disclosing)
```

A product created under `workspace-a` is never retrievable through a
`workspace-b` local context — the route returns the same generic
not-found response used for any other cross-workspace lookup, never a
distinguishable membership error.

## What this mode does not do

- It does not bypass the Product permission guard
  (`evaluatePermissionGuard` in `permission-guard.ts`) — a route still
  returns `403` if the supplied `x-nashir-granted-permissions` header omits
  the required permission.
- It does not change the real Auth0/JWKS verification path
  (`auth-guard.ts`) in any way. If `NASHIR_ENABLE_LOCAL_E2E_AUTH` is
  disabled or unset, a request with these local headers and no
  `Authorization` header is rejected with the same `401` as before this
  mode existed — the headers are simply never read.
- It does not fall back to local auth after a failed Auth0 verification.
  The two paths are constructed exclusively at process startup
  (`apps/api/src/index.ts`); a given process runs exactly one of them.
- It does not modify the database schema, OpenAPI contract, or any
  generated client.

## Verification

From `apps/api`:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run test:db
```

The new local E2E auth tests live in:

- `apps/api/tests/local-e2e-auth.test.ts` (no database required)
- `apps/api/tests/products/product-local-e2e-auth-route.test.ts`
  (database-backed; requires `TEST_DATABASE_URL`, run directly via
  `pnpm exec vitest run tests/products/product-local-e2e-auth-route.test.ts`
  since it is not yet wired into the `test:db` npm script)
