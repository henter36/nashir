# Nashir Product API Runtime Acceptance Hardening Planning Gate

## 1. Decision

Decision: GO to Product API Runtime Acceptance Hardening Review Gate.

Implementation authorization = NO-GO.

This gate authorizes planning and review only. It does not authorize backend runtime edits, new API routes, OpenAPI edits, generated client updates, SQL/schema/migration changes, database CI changes, frontend integration changes, deployment changes, or production readiness work.

## 2. Source Authority

This gate follows the accepted Backend/API Implementation Slice Planning Gate.

The selected next path is:

Product API Runtime Acceptance Hardening.

The goal is to stabilize and accept the already imported Product API runtime before expanding backend/API scope.

## 3. Current Baseline

The current accepted baseline is:

- Nashir monorepo is active.
- Backend runtime exists under `apps/api`.
- Backend CI is merged and active.
- Backend CI validates install, lint, format, typecheck, tests, contract authority, contract validation, and runtime conformance.
- Product API runtime routes already exist in the imported backend.
- Product API OpenAPI authority already exists in the monorepo.
- Current scope remains Product API only.

## 4. Planning Objective

This gate plans a review-only hardening pass over the existing Product API runtime.

The review must determine whether the current Product API runtime should proceed as:

- no-op acceptance
- review-only acceptance with documented findings
- test-only hardening
- runtime fix authorization
- contract authority correction
- or deferred pending database CI planning

## 5. Product API Runtime Scope

The review scope is limited to the existing Product API routes:

- `GET /workspaces/{workspaceId}/products`
- `POST /workspaces/{workspaceId}/products`
- `GET /workspaces/{workspaceId}/products/{productId}`
- `PUT /workspaces/{workspaceId}/products/{productId}`

No new routes are in scope.

## 6. Required Review Areas

The Product API Runtime Acceptance Hardening Review Gate must inspect:

### 6.1 Route registration

Confirm:

- Product routes are registered only under workspace scope.
- No alias routes are introduced.
- `/products` remains the canonical segment.
- No `/nashir-products` route exists.

### 6.2 Workspace scoping

Confirm:

- `workspaceId` is taken from the route path.
- Product access is scoped to the active workspace.
- Cross-workspace access fails safely.
- Missing or malformed workspace context does not leak resource existence.

### 6.3 Permission guard

Confirm:

- List/read/create/update behavior is permission-guarded according to the accepted RBAC model.
- Permission denial uses non-disclosing behavior where required.
- Internal permission harness remains opt-in only.

### 6.4 Request context

Confirm:

- actor identity comes from trusted auth context.
- workspace context is attached consistently.
- optional granted permissions are parsed safely.
- unauthenticated or malformed auth state fails closed.

### 6.5 Idempotency

Confirm for create:

- idempotency key is required where expected.
- duplicate create requests replay safely.
- idempotency conflicts are detected.
- replay does not duplicate audit events.

### 6.6 Audit behavior

Confirm for mutations:

- product create emits the expected audit event.
- product update emits the expected audit event.
- audit is part of the same transaction where required.
- failed mutations do not create misleading audit records.

### 6.7 Error model and disclosure

Confirm:

- not-found behavior does not reveal cross-workspace existence.
- permission failure does not disclose protected resources.
- validation errors use the accepted ErrorModel.
- conflict/idempotency errors use the accepted ErrorModel.
- unexpected errors remain non-disclosing.

### 6.8 Runtime/OpenAPI conformance

Confirm:

- runtime response shape matches OpenAPI.
- `ProductResponse` uses `{ product }`.
- `ProductListResponse` uses `{ products, count, hasMore, nextCursor }`.
- `nextCursor` is required and nullable where expected.
- Product DTO fields match public contract.
- `version` is a string at runtime.

### 6.9 Test coverage inventory

Confirm current tests cover:

- happy-path list/create/read/update
- workspace isolation
- permission denial
- missing resource
- malformed IDs
- idempotency replay/conflict
- audit behavior
- runtime conformance
- error model shape

If coverage is incomplete, the next gate must classify the gap as:

- test-only hardening
- runtime fix authorization
- contract correction
- or database CI planning

## 7. Required Evidence

The review gate must include evidence from:

- repository file inspection
- relevant route/plugin files
- Product repository files
- idempotency repository files
- audit repository files
- test inventory
- OpenAPI authority
- runtime conformance script
- Backend CI status
- local verification commands where applicable

## 8. Validation Commands for Review

The review gate should run or cite:

```bash
cd apps/api
pnpm install --frozen-lockfile
pnpm lint
pnpm run format:check
pnpm typecheck
pnpm test
pnpm run validate:contract-authority -- --authority-repo ../../nashir-authority --authority-ref e22c84fa0e2b6c01d4ee98383ef9fad2d0fa3337
pnpm run validate:contracts -- --authority-repo ../..
pnpm run validate:runtime-conformance -- --authority-repo ../..
```

# Repository-level checks:

```bash
git status --short
git diff --stat
grep -R -nE "/nashir-products|nashir-products" apps/api docs || true
sed '/## .*Verification/,$d' docs/nashir_product_api_runtime_acceptance_hardening_planning_gate.md | grep -E -n "Decision:|Product API Runtime|Implementation authorization|NO-GO|Required Review Areas|Required Next Gate|Stop Conditions"
git diff --check
```

## 9. Explicit NO-GO

This gate does not authorize:

- implementation work
- backend runtime edits
- new API routes
- route alias creation
- OpenAPI edits
- generated client updates
- SQL schema changes
- migrations
- migration runner changes
- PostgreSQL CI service
- database service changes
- frontend changes
- Product Catalog UI integration changes
- deployment changes
- production readiness
- cache/performance optimization
- changing Auth/RBAC/workspace identity decisions
- weakening validation scripts
- bypassing contract authority validation
- changing Product API response shapes
- changing canonical route naming

## 10. Required Next Gate

Open:

Product API Runtime Acceptance Hardening Review Gate

That review gate must produce one of these decisions:

### Option A — ACCEPT / NO-OP

Use if the existing Product API runtime is aligned and no changes are required.

### Option B — TEST-ONLY HARDENING AUTHORIZATION

Use if runtime is aligned but test coverage needs strengthening.

### Option C — RUNTIME FIX AUTHORIZATION

Use if runtime behavior diverges from accepted contract or security boundaries.

### Option D — CONTRACT AUTHORITY CORRECTION GATE

Use if the runtime is correct but OpenAPI/authority text is wrong or stale.

### Option E — DATABASE CI PLANNING GATE

Use if confidence is blocked by skipped database/integration tests.

## 11. Stop Conditions

Stop and ask for a direct decision if review discovers any need for:

- OpenAPI changes
- generated type changes
- database schema or migration changes
- new route behavior
- frontend integration changes
- permission model changes
- Auth/RBAC/workspace identity changes
- production deployment assumptions
- PostgreSQL CI service introduction
- changing route naming
- introducing `/nashir-products`
- broad refactoring outside Product API runtime acceptance

## 12. Verification

```bash
git status --short
git diff --stat
sed '/## .*Verification/,$d' docs/nashir_product_api_runtime_acceptance_hardening_planning_gate.md | grep -E -n "Decision:|Product API Runtime|Implementation authorization|NO-GO|Required Review Areas|Required Next Gate|Stop Conditions"
git diff --check
```
