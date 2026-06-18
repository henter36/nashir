# Nashir Product API DB-backed Coverage Authorization Gate

## Decision

Decision: GO to Product API DB-backed Coverage Implementation.

This is an authorization gate only.

This gate authorizes the next narrow implementation PR to expand Backend CI database coverage beyond migration-only validation.

Product API runtime acceptance remains NO-GO until the authorized DB-backed coverage implementation is merged and reviewed.

## Inputs

After the previous accepted gates and merged PRs:

- Backend CI database validation exists.
- Backend CI now uses Node 22.
- `apps/api/package.json` declares `engines.node >=22`.
- `apps/api/package.json` currently defines `test:db` as `vitest run tests/migrations.test.ts`.
- `.github/workflows/backend-ci.yml` currently runs `pnpm run test:db` in the `database-tests` job.
- Therefore, current DB-backed CI validates migrations, but does not yet prove complete Product API DB-backed behavior.

## Current Gap

The current DB-backed CI signal is not enough to accept Product API runtime behavior.

The missing or unconfirmed coverage areas are:

- ProductRepository DB-backed behavior.
- IdempotencyRepository DB-backed behavior.
- AuditRepository DB-backed behavior, if present.
- Product route handler DB-backed behavior, if present or safely addable as tests.
- Workspace-scoped product persistence.
- Idempotency replay, conflict, completion, and expiry behavior.
- Product create/list/read/update behavior against PostgreSQL.

## Authorized Implementation Scope

The next implementation PR may change only what is needed to run DB-backed Product API coverage in CI.

Allowed files:

- `apps/api/package.json`
- `.github/workflows/backend-ci.yml`
- existing DB-backed tests under `apps/api/tests/`
- new test files under `apps/api/tests/products/` if coverage is missing
- new test files under `apps/api/tests/idempotency/` if coverage is missing
- new test files under `apps/api/tests/audit/` if coverage is missing
- additive test helpers under `apps/api/tests/helpers/`

The next PR should prefer enabling existing tests before adding new tests.

## Preferred Implementation Direction

Preferred approach:

- Make `pnpm run test:db` the canonical DB-backed test command.
- Keep the `database-tests` job running `pnpm run test:db`.
- Expand `test:db` only if existing DB-backed tests are not currently included.
- Add tests only where required coverage is missing.

## Required Coverage Targets

The next implementation PR must account for:

1. Migration application and safe re-run.
2. ProductRepository create/read/update/list behavior.
3. Workspace scoping for product persistence.
4. Product pagination or cursor behavior where implemented.
5. Product update conflict or optimistic concurrency behavior where implemented.
6. IdempotencyRepository reserve/get/complete behavior.
7. Idempotency replay behavior.
8. Idempotency conflict behavior.
9. Expired idempotency record reuse behavior.
10. AuditRepository product mutation write behavior if AuditRepository exists.
11. Product route handler DB-backed behavior if route-level DB tests already exist or can be added without runtime changes.

## Blocked Scope

This gate does not authorize:

- Product API runtime acceptance.
- Product Catalog UI integration.
- Frontend changes.
- OpenAPI edits.
- Generated client updates.
- New route shapes.
- Route aliases.
- `/nashir-products`.
- Database schema changes.
- Migration changes.
- ORM introduction.
- Dependency changes unless separately justified.
- Auth/RBAC changes.
- Workspace context model changes.
- Permission guard changes.
- Deployment changes.
- Production database configuration.
- Secrets or environment variable policy changes.

## Acceptance Criteria for the Next PR

The next implementation PR can be accepted only if:

- Node 22 remains in Backend CI.
- The `database-tests` job remains isolated.
- PostgreSQL remains scoped to CI.
- `POSTGRES_HOST_AUTH_METHOD=trust` remains CI-only.
- DB-backed tests run in CI.
- CI passes.
- No OpenAPI, frontend, migration, deployment, or production configuration files change.
- Any newly added tests assert existing behavior only and do not expand runtime behavior.

## Next Step After Implementation

After the DB-backed coverage implementation PR is merged, open:

Product API DB-backed Coverage Implementation Review Gate

That review gate must decide whether Product API runtime acceptance can move from NO-GO to partial GO, or whether more DB-backed route/repository/idempotency/audit coverage is still required.
