# Nashir Backend Database CI Planning Gate

## 1. Decision

Decision: GO to Backend Database CI Implementation Authorization Gate.

Implementation authorization = NO-GO.

This gate authorizes planning only. It does not authorize CI workflow edits, PostgreSQL service changes, backend runtime edits, API route changes, OpenAPI edits, generated client updates, SQL/schema/migration changes, migration runner changes, frontend changes, deployment changes, or production readiness work.

## 2. Source Authority

This gate follows the accepted Product API Runtime Acceptance Hardening Review Gate.

That review concluded:

- Product API runtime no-op acceptance remains NO-GO.
- Product API runtime has positive contract/runtime conformance signals.
- Full acceptance is blocked by skipped DB-backed tests.
- The required next gate is Backend Database CI Planning Gate.

## 3. Problem Statement

The current backend baseline has strong non-DB validation:

- lint passes
- format check passes
- typecheck passes
- non-DB tests pass
- contract authority validation passes
- contract validation passes
- runtime conformance validation passes

However, full Product API runtime acceptance remains blocked because DB-backed tests are skipped without a CI database service.

The skipped confidence areas include:

- Product route handler DB-backed behavior
- Product repository behavior
- idempotency repository behavior
- audit repository behavior
- migration behavior

These areas are directly relevant to accepting Product API runtime behavior.

## 4. Planning Objective

This gate selects a safe database CI strategy that can later be implemented under a separate authorization gate.

The goal is to make DB-backed backend tests executable in CI without expanding backend runtime scope.

## 5. Candidate Strategies

### Candidate A — Add an isolated DB-backed job to Backend CI

Description:

- Keep the current Backend CI validation job unchanged.
- Add a separate DB-backed job in the existing Backend CI workflow.
- Add PostgreSQL service only to that DB-backed job.
- Run DB-backed tests in that job.
- Keep non-DB validation fast and independent.

Benefits:

- Clear separation between baseline backend validation and DB integration validation.
- Lower risk than modifying the existing validation job.
- Easier to diagnose DB-only failures.
- Makes Product API acceptance evidence stronger.

Risk:

- Requires CI service configuration.
- Requires careful DB URL and migration setup.
- May increase CI runtime.

### Candidate B — Add PostgreSQL to the existing Backend CI validation job

Description:

- Add PostgreSQL service directly to the existing Backend CI job.
- Run all backend tests in one job.

Benefits:

- Simple workflow shape.
- One CI result for backend.

Risk:

- Couples DB service failures to all backend validation.
- Increases baseline CI runtime.
- Makes non-DB failures harder to separate from DB failures.
- Not preferred for the first DB CI step.

### Candidate C — Add a separate DB CI workflow

Description:

- Create a new workflow specifically for DB-backed backend tests.

Benefits:

- Strong separation from existing Backend CI.

Risk:

- Adds workflow surface area.
- May fragment required checks.
- Should be considered later if DB tests become expensive.

### Candidate D — Keep DB tests local-only

Description:

- Do not add PostgreSQL to CI.
- Keep DB-backed tests as local-only/manual.

Benefits:

- No CI cost increase.

Risk:

- Does not resolve the Product API acceptance blocker.
- Leaves acceptance confidence incomplete.

### Candidate E — Test classification gate before CI change

Description:

- First classify tests into unit, integration, DB-backed, migration, and runtime conformance groups.

Benefits:

- Useful if test ownership is unclear.

Risk:

- Adds another planning layer.
- Current skipped test names already identify the DB-backed confidence gap sufficiently.

## 6. Recommended Strategy

Recommended strategy:

Candidate A — Add an isolated DB-backed job to Backend CI.

Reason:

- It directly addresses the acceptance blocker from the Product API runtime review.
- It preserves the existing Backend CI validation job.
- It limits PostgreSQL service scope to DB-backed tests.
- It avoids runtime/API/OpenAPI/database schema changes.
- It creates the evidence needed for a future Product API Runtime Acceptance Review.

## 7. Proposed DB-backed Test Scope

The implementation authorization gate should inspect and decide the exact command set, but the expected DB-backed test inventory includes:

- product route handler tests
- product repository tests
- idempotency repository tests
- audit repository tests
- migration tests

The implementation authorization gate must verify the actual test paths and package scripts before authorizing workflow changes.

## 8. Required CI Design Constraints

The future implementation must preserve these constraints:

- Keep the existing non-DB Backend CI validation path intact.
- Add PostgreSQL only to the DB-backed job.
- Use no repository secrets for local CI database credentials.
- Use ephemeral CI database credentials only.
- Do not add production database configuration.
- Do not change runtime behavior.
- Do not change API routes.
- Do not edit OpenAPI.
- Do not update generated clients.
- Do not change SQL schema or migrations.
- Do not change migration runner behavior unless separately authorized.
- Do not weaken existing validation scripts.
- Do not bypass contract authority validation.
- Do not introduce `/nashir-products`.

## 9. Required Implementation Authorization Gate

Before any workflow or CI service change, open:

Backend Database CI Implementation Authorization Gate

That authorization gate must define:

- exact workflow file to change
- exact job name
- exact PostgreSQL service image/version
- exact database environment variables
- exact test command or commands
- migration/setup command if required
- cleanup/isolation assumptions
- expected skipped-test reduction
- timeout expectations
- CI runtime impact
- rollback plan
- explicit non-goals

## 10. Required Investigation Before Authorization

The implementation authorization gate must inspect:

- `apps/api/package.json`
- DB test files under `apps/api/tests`
- migration scripts under `apps/api`
- test DB helper files
- existing database URL parser/helper
- current Backend CI workflow
- local DB test command behavior
- whether skipped tests are skipped because of missing DB env, missing service, or explicit skip configuration

## 11. Acceptance Criteria for Future Implementation

A future DB CI implementation may be considered successful only if:

- existing Backend CI non-DB validation remains passing
- DB-backed job runs in CI
- PostgreSQL service is scoped only to DB-backed job
- product repository tests run or are explicitly classified
- product route handler DB-backed tests run or are explicitly classified
- idempotency tests run or are explicitly classified
- audit tests run or are explicitly classified
- migration tests run or are explicitly classified
- no runtime/API/OpenAPI/generated/schema changes are introduced
- CI output makes DB-backed coverage visible

## 12. Explicit NO-GO

This planning gate does not authorize:

- CI workflow edits
- PostgreSQL service introduction
- package changes
- backend runtime edits
- new API routes
- route aliases
- OpenAPI edits
- generated client updates
- SQL schema changes
- migrations
- migration runner changes
- database configuration changes
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

## 13. Required Next Decision

The next gate must produce one of:

### Option A — AUTHORIZE ISOLATED DB CI JOB

Use if the exact workflow/job/service/test command details are known and safe.

### Option B — REQUIRE TEST CLASSIFICATION FIRST

Use if the DB-backed test inventory is unclear.

### Option C — KEEP DB TESTS LOCAL-ONLY

Use if the project does not want PostgreSQL in CI yet, while documenting the Product API acceptance limitation.

### Option D — AUTHORIZE SEPARATE DB CI WORKFLOW

Use if DB tests should not run inside the existing Backend CI workflow.

### Option E — NO-GO / PAUSE

Use if DB CI risk, cost, or scope is not acceptable yet.

## 14. Stop Conditions

Stop and ask for a direct decision if investigation discovers any need for:

- SQL schema changes
- migration edits
- migration runner changes
- OpenAPI edits
- generated type changes
- backend runtime changes
- new route behavior
- frontend integration changes
- permission model changes
- Auth/RBAC/workspace identity changes
- production deployment assumptions
- secrets or production database access
- route naming changes
- introducing `/nashir-products`
- broad refactoring outside DB CI enablement

## 15. Verification

```bash
git status --short
git diff --stat
sed '/## .*Verification/,$d' docs/nashir_backend_database_ci_planning_gate.md | grep -E -n "Decision:|Implementation authorization|Candidate A|Recommended strategy|Implementation Authorization|NO-GO|Required Next Decision|Stop Conditions"
git diff --check
```
