# Nashir Product API Local Runtime Repository Wiring Authorization Gate

## Decision

Decision: GO to Product API Local Runtime Repository Wiring Implementation.

This authorization is narrow and limited to enabling the already implemented Product API routes in local/dev runtime by wiring existing repository dependencies into `buildApp`.

This gate does not authorize OpenAPI edits, generated client updates, migration changes, schema changes, route expansion, `/nashir-products`, Product Catalog UI changes, delete/archive/store-pull/status mutation, production readiness, or pilot readiness.

## Inputs

Accepted prior gates:

- PR #242 authorized Product Catalog UI Adapter Backend Wiring Implementation.
- PR #243 documented that Product Catalog backend wiring already existed and added local setup documentation.
- PR #244 accepted Product Catalog backend wiring implementation review.
- PR #245 defined Product Catalog Local Backend Validation Gate.
- PR #246 reviewed local validation evidence and produced a NO-GO for Product Catalog Local Backend Validation Acceptance.

Local validation evidence from PR #246:

- Local PostgreSQL connection succeeded after correcting placeholder `.env` values.
- Product persistence migration succeeded locally.
- Tables created:
  - `products`
  - `idempotency_records`
  - `audit_events`
  - `schema_migrations`
- Local backend started on `127.0.0.1:5050`.
- `GET /health` returned `200 OK`.
- `GET /workspaces/local-validation-workspace/products?limit=50&sort=updatedAt:desc` returned `404 Route not found`.
- `GET /workspaces/local-validation-workspace/nashir-products?limit=50` returned `404 Route not found`, which is acceptable because `/nashir-products` is blocked.

## Problem Statement

The Product API route implementation exists, but the current local/dev runtime does not register Product routes.

The current app entrypoint starts the backend with `buildApp({ authConfig })`.

Product route registration inside `buildApp` is conditional and requires:

- `productRepository`
- `idempotencyRepository`
- `auditRepository`

When `authConfig` is configured, Product routes also require `workspaceMembershipResolver`.

Because those dependencies are not wired in the local/dev runtime bootstrap, the accepted Product API routes are unavailable locally and return `404 Route not found`.

## Authorized Scope

This gate authorizes a narrow implementation PR to wire Product API dependencies into the local/dev runtime bootstrap.

Allowed implementation goals:

1. Instantiate a PostgreSQL pool from `DATABASE_URL`.
2. Instantiate the existing repositories:
   - `ProductRepository`
   - `IdempotencyRepository`
   - `AuditRepository`
3. Pass those repository instances into `buildApp`.
4. Provide a local/dev-only `workspaceMembershipResolver` required for Product route registration.
5. Ensure the local/dev backend registers only the accepted Product API routes.
6. Preserve `/health`.
7. Preserve non-disclosing 404 behavior.
8. Preserve blocked `/nashir-products`.
9. Add tests or verification coverage proving route registration behavior.

## Local/Dev Workspace Membership Boundary

A local/dev-only workspace membership resolver may be introduced only to satisfy the existing `buildApp` requirement for Product routes.

It must not become a production authorization model.

It must be constrained as follows:

- It may only be used in local/dev bootstrap.
- It must not add a real workspace membership table or schema.
- It must not modify Auth0/JWT verification logic.
- It must not broaden RBAC or permission semantics.
- It must not expose database existence through disclosing responses.
- It must preserve `workspace_not_found` / `not_member` as non-disclosing 404 behavior where applicable.
- It must be documented as local/dev-only.

## Allowed Files for the Next Implementation PR

The next implementation PR may modify only these areas:

- `apps/api/src/index.ts`
- optional new local runtime bootstrap/helper under `apps/api/src/`
- tests under `apps/api/tests/`
- documentation under `docs/`

The next implementation PR must not modify:

- `docs/nashir_v1_openapi.yaml`
- generated clients
- frontend UI files
- Product Catalog adapter/store/page files
- database migrations
- schema files
- Product route path names
- Product handler contract shapes
- Auth0/JWT verification logic
- permission guard semantics
- workspace context guard core semantics

## Required Implementation Constraints

The next implementation PR must preserve:

- accepted Product routes only:
  - `GET /workspaces/{workspaceId}/products`
  - `POST /workspaces/{workspaceId}/products`
  - `GET /workspaces/{workspaceId}/products/{productId}`
  - `PUT /workspaces/{workspaceId}/products/{productId}`
- no `/nashir-products`
- no DELETE product
- no archive product
- no store-pull
- no status mutation
- no Campaign routes
- no Publishing routes
- no Analytics routes
- no Readiness routes
- no Agents routes
- flat ErrorModel shape
- non-disclosing 404 behavior
- idempotency on create
- audit on mutations
- optimistic concurrency behavior on update

## Required Verification

The next implementation PR must provide evidence for:

- `npm run lint`
- `npm run build`
- backend typecheck or equivalent backend validation command
- backend unit/integration tests
- DB-backed Product route registration check
- local `/health` remains `200 OK`
- accepted Product list route no longer returns `Route not found`
- `/nashir-products` still returns `404 Route not found`
- no OpenAPI diff
- no generated client diff
- no migration diff
- no frontend diff

## Acceptance Criteria for the Next Implementation PR

The next implementation PR can be accepted only if:

- Product API routes are registered in local/dev runtime.
- Product API route registration uses existing repository classes.
- `DATABASE_URL` is required for DB-backed Product route runtime wiring.
- The app fails safely if required DB config is missing.
- The local/dev workspace membership resolver remains explicitly local/dev only.
- Auth/RBAC/session policy is not expanded.
- No new routes are added.
- `/nashir-products` remains unavailable.
- Product Catalog UI remains unchanged.
- OpenAPI remains unchanged.
- Generated clients remain unchanged.
- Migrations remain unchanged.
- CI passes.

## Remaining Blocked Scope

Still blocked after this authorization unless separately approved:

- production readiness
- pilot readiness
- real tenant/workspace membership model
- app-wide session integration
- broader Auth/RBAC design changes
- Product Catalog delete/archive/store-pull/status mutation
- Product API full runtime acceptance
- E2E browser automation
- deployment configuration
- secrets or real Auth0 tenant values

## Final Decision

Decision: GO to Product API Local Runtime Repository Wiring Implementation.

This is an implementation authorization only. It authorizes a narrow local/dev runtime wiring PR so that the accepted Product API routes can be validated locally.

It does not authorize production/pilot readiness or any Product Catalog feature expansion.
