# Nashir Backend/API Implementation Slice Planning Gate

## 1. Decision

Decision: GO to define the next Backend/API implementation slice planning path.

Implementation authorization = NO-GO.

This gate authorizes planning only. It does not authorize backend runtime changes, API route changes, OpenAPI edits, generated client updates, SQL/schema/migration changes, database service changes, frontend integration changes, deployment changes, or production readiness work.

## 2. Current Baseline

The current accepted baseline is:

- Nashir monorepo is the active repository baseline.
- Backend code exists under `apps/api`.
- Backend CI validation is merged and accepted as the current validation baseline.
- Backend validation runs from `apps/api`.
- Contract authority validation is pinned to the accepted authority reference.
- Contract and runtime conformance validation run against the current monorepo authority.
- Frontend CI and Backend CI both exist at repository root under `.github/workflows`.

## 3. Completed Prerequisites

The following prerequisite sequence is complete:

- Backend import into monorepo
- Backend import acceptance
- Backend CI validation planning
- Backend CI validation implementation authorization
- Backend CI workflow implementation
- Backend contract validation separator fix authorization
- Backend contract validation separator fix
- Backend CI validation review

## 4. Purpose of This Gate

This gate selects the planning path for the next backend/API slice.

The goal is to avoid jumping directly into runtime implementation and instead define:

- the next implementation slice name
- the business/API scope
- required contract authority inputs
- data persistence needs
- route/runtime boundaries
- CI and validation requirements
- explicit non-goals
- stop conditions
- required authorization gate before implementation

## 5. Candidate Next Slices

### Candidate A — Product API Runtime Acceptance Hardening

Focus:

- Verify the existing Product API runtime implementation against the merged monorepo baseline.
- Confirm route behavior, permission boundaries, workspace scoping, idempotency, audit behavior, and runtime conformance.
- No new routes.
- No new OpenAPI changes unless a later review finds a mismatch requiring a separate contract authority gate.

Risk:

- Low to medium.
- Best fit if the project wants to stabilize imported backend behavior before adding new features.

### Candidate B — Product Catalog UI Adapter Revalidation

Focus:

- Revalidate Product Catalog UI adapter behavior against the monorepo backend baseline.
- Confirm UI/backend assumptions, response shapes, error handling, and non-disclosing behavior.
- No backend runtime changes unless separately authorized.

Risk:

- Medium.
- Useful after backend validation but may cross UI/backend boundary and should be gated carefully.

### Candidate C — Backend Database CI Planning

Focus:

- Plan PostgreSQL service usage in CI for skipped DB/integration tests.
- Define whether DB tests should become required, optional, or matrix-based.
- No database schema changes.
- No migration changes.

Risk:

- Medium.
- Useful, but should be separate from API feature implementation.

### Candidate D — New Backend/API Feature Slice

Focus:

- Add a new backend/API capability beyond current Product API scope.

Risk:

- High.
- Not recommended until the imported backend baseline and existing Product API runtime are reviewed.

## 6. Recommended Planning Decision

Recommended next planning path:

Candidate A — Product API Runtime Acceptance Hardening.

Reason:

- It validates the already imported backend runtime before expanding scope.
- It keeps the next step close to the existing Product API slice.
- It reduces risk before adding database CI, new API features, or UI/backend integration expansion.
- It preserves the contract-first and governance-first sequence.

## 7. Scope for the Recommended Next Planning Gate

The next planning gate should define a narrow Product API Runtime Acceptance Hardening slice covering:

- `GET /workspaces/{workspaceId}/products`
- `POST /workspaces/{workspaceId}/products`
- `GET /workspaces/{workspaceId}/products/{productId}`
- `PUT /workspaces/{workspaceId}/products/{productId}`
- workspace scoping
- permission guard behavior
- request context behavior
- idempotency behavior for create
- audit behavior for mutations
- non-disclosing error behavior
- runtime conformance expectations
- CI validation commands
- local verification commands

## 8. Explicit NO-GO

This gate does not authorize:

- implementation work
- backend runtime edits
- new API routes
- OpenAPI edits
- generated client updates
- SQL schema changes
- migrations
- migration runner changes
- PostgreSQL CI service
- root package changes
- frontend changes
- deployment changes
- production readiness
- cache/performance optimization
- changing Auth/RBAC/workspace identity decisions
- weakening validation scripts
- bypassing contract authority validation

## 9. Required Next Gate

Before any implementation or runtime change, open:

Product API Runtime Acceptance Hardening Planning Gate

That gate must decide whether the next step is:

- review-only
- test-only
- runtime fix authorization
- contract authority correction
- or no-op acceptance

## 10. Stop Conditions

Stop and ask for a direct decision if planning discovers any need for:

- OpenAPI changes
- generated type changes
- database schema or migration changes
- new API route behavior
- frontend integration changes
- permission model changes
- Auth/RBAC/workspace identity changes
- production deployment assumptions
- CI PostgreSQL service introduction

## 11. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n "Decision:|Recommended next planning path|Candidate A|Product API Runtime Acceptance|NO-GO|Required Next Gate|Stop Conditions" docs/nashir_backend_api_implementation_slice_planning_gate.md
git diff --check
