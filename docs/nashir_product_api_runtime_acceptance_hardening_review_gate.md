# Nashir Product API Runtime Acceptance Hardening Review Gate

## 1. Decision

Decision: GO to Backend Database CI Planning Gate.

Product API runtime no-op acceptance = NO-GO.

Implementation authorization = NO-GO.

This review does not authorize backend runtime edits, new API routes, OpenAPI edits, generated client updates, SQL/schema/migration changes, PostgreSQL CI service changes, frontend changes, deployment changes, or production readiness work.

## 2. Source Authority

This review follows the accepted Product API Runtime Acceptance Hardening Planning Gate.

The planning gate authorized a review-only pass over the existing Product API runtime and required this review to choose one of:

- ACCEPT / NO-OP
- TEST-ONLY HARDENING AUTHORIZATION
- RUNTIME FIX AUTHORIZATION
- CONTRACT AUTHORITY CORRECTION GATE
- DATABASE CI PLANNING GATE

## 3. Review Summary

The current runtime baseline shows meaningful positive signals:

- Backend CI is active.
- Local backend validation was run from `apps/api`.
- Lint passed.
- Format check passed.
- Typecheck passed.
- Non-DB tests passed.
- Contract authority validation passed when using the pinned authority checkout.
- Contract validation passed.
- Runtime conformance validation passed.
- Product API OpenAPI/runtime shape checks passed at the conformance-script level.

However, full Product API runtime acceptance should not be granted yet because DB-backed Product API confidence is incomplete.

The local test run reported:

- 153 passed tests
- 86 skipped tests

The skipped inventory included Product/API and persistence-sensitive tests, including:

- product route handler tests
- product repository tests
- idempotency repository tests
- audit repository tests
- migration tests

These skipped tests are directly relevant to Product API runtime acceptance.

## 4. Runtime Conformance Findings

Runtime conformance validation passed for the current baseline.

Confirmed areas include:

- `/health` returns HTTP 200.
- missing route returns HTTP 404 with ErrorModel shape.
- OpenAPI Product paths exist.
- Product response schema checks passed.
- Product DTO public fields are present.
- Product `version` is string at runtime.
- `ProductResponse` uses the accepted response shape.
- `ProductListResponse` uses the accepted response shape.

This is sufficient to confirm baseline contract/runtime shape alignment, but not sufficient to grant full Product API acceptance because DB-backed behavioral coverage remains skipped.

## 5. Product API Routes in Scope

The acceptance scope remains limited to:

- `GET /workspaces/{workspaceId}/products`
- `POST /workspaces/{workspaceId}/products`
- `GET /workspaces/{workspaceId}/products/{productId}`
- `PUT /workspaces/{workspaceId}/products/{productId}`

No new routes are authorized.

No route aliases are authorized.

`/products` remains the canonical route segment.

`/nashir-products` remains out of scope and must not be introduced.

## 6. Acceptance Blockers

Full Product API runtime acceptance is blocked by skipped DB-backed tests.

The blocked confidence areas are:

- create/list/read/update behavior against persistence
- repository-level workspace scoping
- idempotency replay/conflict behavior
- audit event behavior
- migration behavior
- database-backed error and conflict paths
- product route behavior under DB-backed scenarios

Because these areas are core to Product API runtime acceptance, the correct next gate is not no-op acceptance.

## 7. Why Not ACCEPT / NO-OP

`ACCEPT / NO-OP` is not appropriate because it would imply the existing Product API runtime is fully accepted.

That would overstate confidence while DB-backed product, audit, idempotency, repository, and migration tests remain skipped.

## 8. Why Not Runtime Fix Authorization

Runtime fix authorization is premature.

The current evidence does not prove a runtime defect. It proves a confidence gap caused by skipped DB-backed tests.

No runtime/API behavior should be changed until DB-backed tests are planned and executed or explicitly classified.

## 9. Why Not Contract Authority Correction

Contract authority correction is not currently indicated.

The available runtime conformance evidence shows contract/runtime shape alignment for the checked Product API and ErrorModel areas.

No OpenAPI or authority correction is authorized by this review.

## 10. Recommended Next Gate

Open:

Backend Database CI Planning Gate

The next gate should decide how to handle DB-backed tests for the imported backend under the monorepo baseline.

It should define whether to:

- add PostgreSQL service to Backend CI
- keep DB tests local-only
- create a separate DB CI workflow
- use a matrix or opt-in DB test job
- keep skipped DB tests but document the acceptance limitation
- convert selected Product API DB-backed tests into required CI gates

## 11. Required Scope for Backend Database CI Planning

The Backend Database CI Planning Gate should cover:

- PostgreSQL CI service requirements
- database URL configuration
- migration setup
- migration rollback expectations
- whether Product repository tests should run in CI
- whether Product route handler tests should run in CI
- whether idempotency repository tests should run in CI
- whether audit repository tests should run in CI
- whether migration tests should run in CI
- runtime conformance dependency on database availability
- expected time/cost impact on CI
- isolation and cleanup strategy
- secret-free local and CI configuration

## 12. Explicit NO-GO

This review does not authorize:

- backend runtime edits
- new API routes
- route aliases
- `/nashir-products`
- OpenAPI edits
- generated client updates
- SQL schema changes
- migrations
- migration runner changes
- PostgreSQL CI service changes
- database configuration changes
- frontend changes
- Product Catalog UI integration changes
- deployment changes
- production readiness
- cache/performance optimization
- changing Auth/RBAC/workspace identity decisions
- weakening validation scripts
- bypassing contract authority validation

## 13. Required Next Decision

The next gate must produce one of:

### Option A — ADD POSTGRESQL CI SERVICE PLANNING

Use if DB-backed Product API tests should become required in CI.

### Option B — SEPARATE DB CI WORKFLOW PLANNING

Use if DB-backed tests should run separately from baseline Backend CI.

### Option C — LOCAL-ONLY DB TEST ACCEPTANCE

Use if DB-backed tests remain local-only with explicit acceptance limitations.

### Option D — TEST CLASSIFICATION GATE

Use if tests must first be classified into unit, integration, DB, and migration groups.

### Option E — NO-GO / PAUSE

Use if the team does not want to introduce DB-backed validation yet.

## 14. Verification Commands

```bash
git status --short
git diff --stat
sed '/## .*Verification/,$d' docs/nashir_product_api_runtime_acceptance_hardening_review_gate.md | grep -E -n "Decision:|NO-GO|Backend Database CI Planning Gate|Acceptance Blockers|Why Not ACCEPT|Required Next Decision"
git diff --check
