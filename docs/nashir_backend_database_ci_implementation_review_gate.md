# Nashir Backend Database CI Implementation Review Gate

## 1. Decision

Decision: GO to Backend CI Node Runtime Alignment Fix.

Backend Database CI implementation baseline = ACCEPTED.

Product API runtime acceptance remains NO-GO.

This review does not authorize backend runtime edits, new API routes, OpenAPI edits, generated client updates, package script changes, test edits, SQL/schema/migration changes, frontend changes, Product Catalog UI integration, deployment changes, or production readiness work.

## 2. Source Authority

This review follows the accepted Backend Database CI Implementation Authorization Gate and merged PR #236.

PR #236 added an isolated DB-backed job to Backend CI.

## 3. Inputs Reviewed

- PR #236 is merged.
- PR #236 changed only `.github/workflows/backend-ci.yml`.
- Backend CI now contains the existing `Validate backend` job.
- Backend CI now contains a separate `database-tests` job named `Validate backend database tests`.
- The DB-backed job uses PostgreSQL 16 scoped to that job.
- The DB-backed job sets `TEST_DATABASE_URL`.
- The DB-backed job runs `pnpm run test:db` from `apps/api`.
- Frontend CI passed for the implementation PR.
- Backend CI passed for the implementation PR.
- Backend CI job `Validate backend` passed.
- Backend CI job `Validate backend database tests` passed.
- `apps/api/package.json` declares `engines.node >=22`.
- `.github/workflows/backend-ci.yml` currently uses `node-version: 20`.
- `apps/api/package.json` maps `test:db` to `vitest run tests/migrations.test.ts`.
- `tests/migrations.test.ts` validates migration status, migration application, and idempotent migration rerun.

## 4. Acceptance Finding

The DB-backed CI implementation is accepted as a baseline CI infrastructure improvement.

It successfully moves migration DB validation from local/skipped-only confidence toward required CI evidence.

However, this does not grant full Product API runtime acceptance.

## 5. Remaining Product API Acceptance Blockers

Product API runtime acceptance remains blocked because the DB-backed CI job currently validates migration behavior through `test:db`.

The remaining DB-backed Product API confidence areas are:

- product route handler behavior
- product repository behavior
- workspace-scoped persistence behavior
- idempotency reservation/replay/conflict behavior
- audit event behavior
- DB-backed error and conflict paths
- create/list/read/update behavior against real persistence

No Product Catalog UI integration should proceed from this evidence alone.

## 6. Critical Runtime Environment Drift

`apps/api/package.json` declares `node >=22`.

Backend CI currently runs backend jobs using `node-version: 20`.

This is a CI/runtime drift risk.

Even if the current CI passes, the project should not accept Product API runtime behavior while tests run under a Node version below the backend package engine.

## 7. Security and Operational Note

`POSTGRES_HOST_AUTH_METHOD=trust` is acceptable only because the PostgreSQL service is ephemeral and scoped to the CI DB-backed job.

This must not be copied into staging, production, deployment templates, or runtime database configuration.

## 8. README Reality Correction

The repository README previously described Nashir as UI-only and stated that no Backend/API/Database existed.

That is no longer accurate after the backend app, Backend CI, migration runner, Product API runtime foundations, and DB-backed CI job were introduced into the repository.

This PR may update README documentation only to reflect the repository’s current reality.

The README update must not claim:

- production readiness
- full Product API acceptance
- complete backend feature coverage
- real AI/provider execution
- deployment readiness
- complete Auth/RBAC production rollout
- Product Catalog UI production integration

## 9. Required Next Step

Open a narrow implementation PR:

Backend CI Node Runtime Alignment Fix

Authorized scope for the next implementation PR:

- edit `.github/workflows/backend-ci.yml` only
- change backend setup-node `node-version` from `20` to `22` wherever backend jobs run
- preserve existing backend CI validation steps
- preserve the database-tests job
- do not change package scripts
- do not change tests
- do not change runtime code
- do not change OpenAPI
- do not change generated clients
- do not change frontend code

## 10. Required Step After Node Alignment

After Node 22 CI passes, open Product API DB-backed Coverage Authorization.

That next gate must decide how to run or classify DB-backed tests for:

- product route handler tests
- product repository tests
- idempotency repository tests
- audit repository tests
- migration tests
- DB-backed Product API error/conflict paths

## 11. Explicit NO-GO

This review does not authorize:

- Product API runtime acceptance
- Product Catalog UI integration
- backend runtime edits
- new API routes
- route aliases
- `/nashir-products`
- OpenAPI edits
- generated client updates
- package script changes
- test edits
- SQL/schema/migration changes
- production database configuration
- repository secrets
- frontend changes
- deployment changes
- production readiness

## 12. Verification

Required commands:

- `git status --short`
- `git diff --stat`
- `grep -nE "Decision:|Node Runtime Alignment|Product API runtime acceptance remains NO-GO|test:db|POSTGRES_HOST_AUTH_METHOD|README Reality Correction|Explicit NO-GO|Required Next Step" docs/nashir_backend_database_ci_implementation_review_gate.md README.md`
- `git diff --check`
