# Nashir Backend Database CI Implementation Authorization Gate

## 1. Decision

Decision: GO to implement an isolated backend DB-backed CI job.

Implementation authorization = GO, limited to the scope defined in this gate.

This gate authorizes one narrow implementation PR to add a DB-backed backend CI job to the existing Backend CI workflow.

## 2. Source Authority

This gate follows the accepted Backend Database CI Planning Gate.

That planning gate selected:

Candidate A — Add an isolated DB-backed job to Backend CI.

The planning gate did not authorize implementation. This gate provides that narrow implementation authorization.

## 3. Authorized Implementation Scope

The implementation PR may change only:

- `.github/workflows/backend-ci.yml`

The implementation PR may add only:

- one new DB-backed job in Backend CI
- one PostgreSQL service scoped to that new job
- job-level environment variables required for test database access
- setup/install/test steps required to run DB-backed backend tests

## 4. Required Job Design

The implementation PR must preserve the existing `validate` job.

The implementation PR must add a separate job:

```yaml
database-tests:
  name: Validate backend database tests
```

The job must run on:

```yaml
runs-on: ubuntu-latest
```

The job must not replace or weaken the existing non-DB validation job.

## 5. Authorized PostgreSQL Service

The implementation PR may add PostgreSQL only inside the new `database-tests` job.

Authorized service:

```yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_USER: nashir
      POSTGRES_PASSWORD: nashir
      POSTGRES_DB: nashir_test
    ports:
      - 5432:5432
    options: >-
      --health-cmd "pg_isready -U nashir -d nashir_test"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

No production database, repository secret, external database, or persistent database is authorized.

## 6. Authorized Test Database URL

The implementation PR may set this job-level environment variable:

```yaml
env:
  TEST_DATABASE_URL: postgres://nashir:nashir@localhost:5432/nashir_test
```

This is authorized only for the CI ephemeral PostgreSQL service.

No `DATABASE_URL` production-style configuration is authorized unless a later gate explicitly approves it.

## 7. Authorized Steps

The DB-backed job may use the same pinned setup actions already used by Backend CI:

- `actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5`
- `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020`
- `pnpm/action-setup@b906affcce14559ad1aafd4ab0e942779e9f58b1`

The DB-backed job may install backend dependencies from `apps/api` using:

```bash
pnpm install --frozen-lockfile
```

The DB-backed job may run:

```bash
pnpm run test:db
```

The implementation PR may additionally run DB-backed Product tests with `TEST_DATABASE_URL` only if they are already present and require no code, package, schema, migration, runtime, or OpenAPI changes.

If Product DB-backed tests cannot be run cleanly without additional code/test/schema changes, the implementation PR must not expand scope. It must keep the job limited to the safe DB-backed command and document the remaining acceptance limitation for a later gate.

## 8. Authorized Validation Expectations

The implementation PR must demonstrate:

- existing Backend CI `validate` job still passes
- new DB-backed job starts PostgreSQL successfully
- `TEST_DATABASE_URL` is available to DB-backed tests
- `pnpm run test:db` executes in CI
- migration DB tests are no longer skipped when `TEST_DATABASE_URL` is available
- CI logs make DB-backed validation visible

## 9. Explicit Non-Goals

This gate does not authorize:

- backend runtime edits
- new API routes
- route aliases
- `/nashir-products`
- OpenAPI edits
- generated client updates
- SQL schema changes
- migration SQL changes
- migration runner changes
- package script changes
- test file edits
- production database configuration
- repository secrets
- frontend changes
- Product Catalog UI changes
- deployment changes
- production readiness
- cache/performance optimization
- Auth/RBAC/workspace identity changes
- weakening existing Backend CI validation
- bypassing contract authority validation

## 10. Required Implementation PR Boundaries

The implementation PR title should be:

```text
ci: add backend database validation job
```

The implementation PR must include:

- `.github/workflows/backend-ci.yml` only
- no package changes
- no runtime changes
- no test changes
- no docs changes unless required to explain the implementation evidence

If a required change outside `.github/workflows/backend-ci.yml` is discovered, stop and open a new planning or authorization gate.

## 11. Required Implementation Verification

The implementation PR should verify locally where possible:

```bash
cd apps/api
pnpm install --frozen-lockfile
pnpm lint
pnpm run format:check
pnpm typecheck
pnpm test
```

The DB-backed test may require local PostgreSQL. If local PostgreSQL is unavailable, the implementation PR must rely on GitHub Actions DB-backed CI evidence and state that local DB execution was not run.

## 12. CI Success Criteria

Before merge, the implementation PR must show:

- Frontend CI success
- Backend CI `Validate backend` success
- Backend CI `Validate backend database tests` success

If the new DB-backed job fails because tests require additional implementation changes, do not patch runtime/test/schema inside that PR. Return to a new gate.

## 13. Rollback Plan

If DB-backed CI causes repeated failures or unacceptable runtime cost, rollback is limited to removing the new `database-tests` job from `.github/workflows/backend-ci.yml`.

No runtime, schema, OpenAPI, or product code rollback should be needed because this gate does not authorize those changes.

## 14. Stop Conditions

Stop and ask for a direct decision if implementation requires:

- editing package scripts
- editing tests
- editing migrations
- editing migration runner
- changing database schema
- changing backend runtime
- changing Product API routes
- changing OpenAPI
- changing generated clients
- changing frontend integration
- using repository secrets
- connecting to external or production database
- introducing `/nashir-products`
- broad refactoring outside CI job addition

## 15. Required Next Gate After Implementation

After the implementation PR is merged, open:

Backend Database CI Implementation Review Gate

That review gate must decide whether DB-backed CI is sufficient to reopen Product API Runtime Acceptance Review.

## 16. Verification

```bash
git status --short
git diff --stat
sed '/## .*Verification/,$d' docs/nashir_backend_database_ci_implementation_authorization_gate.md | grep -E -n "Decision:|Implementation authorization|Authorized Implementation Scope|Authorized PostgreSQL Service|Authorized Test Database URL|NO-GO|Stop Conditions|Required Next Gate"
git diff --check
```
