# Nashir Product Catalog Local Backend Validation Gate

## Decision

Decision: PENDING LOCAL VALIDATION EVIDENCE.

This gate defines the required local validation evidence for running Product Catalog UI against the local Nashir backend.

This gate does not authorize production readiness, pilot readiness, backend runtime changes, OpenAPI edits, generated client updates, schema changes, migration changes, Auth/RBAC/session expansion, route expansion, `/nashir-products`, delete/archive/store-pull/status mutation, or broader Product Catalog scope.

## Inputs

Accepted prior gates:

- PR #242 authorized Product Catalog UI Adapter Backend Wiring Implementation.
- PR #243 completed the authorized wiring step as documentation-only local setup.
- PR #244 accepted PR #243 and moved to Product Catalog Local Backend Validation Gate.

Known accepted Product Catalog backend wiring facts:

- Product Catalog adapter already reads `VITE_NASHIR_BACKEND_URL`.
- Product Catalog adapter already reads `VITE_NASHIR_WORKSPACE_ID`.
- Product Catalog adapter may read optional `VITE_NASHIR_ACCESS_TOKEN`.
- Product Catalog uses only the accepted four Product API routes.
- Missing backend URL or workspace ID keeps the UI in fallback/mock mode.
- No runtime changes were made in PR #243.

## Validation Scope

This gate validates local operation only.

Allowed validation evidence:

- backend local startup
- database migration execution
- local database existence
- matching local workspace existence
- frontend local startup
- Product Catalog backend mode with valid env
- Product Catalog fallback/mock mode when env is missing
- accepted Product API route usage only
- no `/nashir-products`
- no delete/archive/store-pull/status mutation
- non-disclosing error behavior preserved

## Required Local Backend Evidence

Collect evidence for:

1. Backend dependencies installed.
2. `.env` exists under `apps/api`.
3. `DATABASE_URL` points to an existing local PostgreSQL database.
4. Database migration succeeds.
5. Backend starts locally.
6. Backend health endpoint responds successfully if available.
7. A local workspace record exists for the workspace ID used by the frontend.

Evidence placeholders:

- Backend install: PENDING
- Database exists: PENDING
- Migration result: PENDING
- Backend start result: PENDING
- Health result: PENDING
- Workspace record exists: PENDING

## Required Frontend Evidence

Collect evidence for:

1. `.env.local` exists at repository root.
2. `VITE_NASHIR_BACKEND_URL` is configured.
3. `VITE_NASHIR_WORKSPACE_ID` is configured.
4. The configured workspace ID exists in the local database.
5. Optional `VITE_NASHIR_ACCESS_TOKEN` is configured only if local backend auth requires it.
6. Frontend starts locally.
7. Product Catalog page opens.
8. Product Catalog enters backend mode when required env config is present.
9. Product Catalog stays in fallback/mock mode when required env config is absent.

Evidence placeholders:

- Frontend env configured: PENDING
- Frontend start result: PENDING
- Product Catalog backend mode result: PENDING
- Product Catalog fallback mode result: PENDING

## Required Route Evidence

Only these routes may be used:

- `GET /workspaces/{workspaceId}/products`
- `POST /workspaces/{workspaceId}/products`
- `GET /workspaces/{workspaceId}/products/{productId}`
- `PUT /workspaces/{workspaceId}/products/{productId}`

Blocked routes and operations:

- `/nashir-products`
- DELETE product
- archive product
- store-pull
- status mutation
- campaign routes
- publishing routes
- analytics routes
- readiness routes
- agents routes

Evidence placeholders:

- Accepted route usage only: PENDING
- `/nashir-products` not used: PENDING
- blocked operations not used: PENDING

## Validation Commands to Run Locally

Backend:

- `cd apps/api`
- `pnpm install --frozen-lockfile`
- ensure the PostgreSQL database referenced by `DATABASE_URL` exists
- `pnpm run db:migrate`
- `pnpm run dev`

Frontend:

- configure `.env.local` at repository root
- `npm run dev`
- open Product Catalog page

Repository checks:

- `npm run lint`
- `npm run build`
- `git diff --check`

## Acceptance Criteria

This gate can become GO only if:

- backend starts locally
- migration succeeds
- local workspace exists
- frontend starts locally
- Product Catalog enters backend mode with valid env
- Product Catalog stays fallback/mock when env is missing
- only the four accepted Product API routes are used
- no `/nashir-products` route is used
- no delete/archive/store-pull/status mutation is introduced
- no backend runtime files changed
- no OpenAPI files changed
- no generated client files changed
- no schema or migration files changed
- no Auth/RBAC/session model files changed
- no workspace/permission model files changed

## Remaining Gaps

The following remain blocked after this gate unless separately authorized:

- pilot readiness
- production readiness
- full app session/auth integration
- E2E automation
- Product Catalog delete/archive/store-pull/status mutation
- Product API full runtime acceptance
- broader Nashir module backend integration

## Final Decision

Decision: PENDING.

After local evidence is collected, this gate must be updated or followed by a review gate with one of these outcomes:

- GO to Product Catalog Local Backend Validation Review
- NO-GO with required local setup corrections

