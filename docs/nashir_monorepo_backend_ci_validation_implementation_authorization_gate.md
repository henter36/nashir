# Nashir Monorepo Backend CI / API Validation Implementation Authorization Gate

## 1. Decision

Decision: GO to one narrow Backend CI / API Validation implementation PR.

This authorization allows only a narrow CI implementation slice for backend validation inside the Nashir monorepo.

## 2. Context

* PR #223 imported `nashir-backend` into `apps/api/**`.
* PR #224 accepted the backend import as present in the monorepo.
* PR #225 completed planning for Backend CI / API Validation.
* Backend validation is currently not wired into the monorepo CI.
* Existing frontend/root CI must remain unchanged in behavior.
* Backend validation must run from `apps/api`, not by installing backend dependencies at the repository root.

## 3. Authorized Implementation Scope

Authorize one implementation PR to add a separate backend validation workflow or separate backend validation job.

Preferred implementation:

* Add `.github/workflows/backend-ci.yml`

Alternative allowed only if clearly justified:

* Extend existing frontend CI with a separate independent backend job.

The implementation may include:

* checkout repository
* setup Node
* setup pnpm
* install dependencies in `apps/api`
* run backend validation from `apps/api`
* set `NASHIR_AUTHORITY_REPO` to the monorepo root path
* keep frontend/root validation isolated from backend dependencies

## 4. Authorized Backend Commands

The implementation PR may run these commands from `apps/api`:

* `pnpm install --frozen-lockfile`
* `pnpm lint`
* `pnpm run format:check`
* `pnpm typecheck`
* `pnpm test`
* `NASHIR_AUTHORITY_REPO=<monorepo-root> pnpm run validate:contract-authority`
* `NASHIR_AUTHORITY_REPO=<monorepo-root> pnpm run validate:contracts`
* `pnpm run validate:runtime-conformance`

## 5. Authority Repo Decision

Use Option A from the planning gate:

`NASHIR_AUTHORITY_REPO` should point to the checked-out monorepo root.

Rationale:

* The OpenAPI authority file exists in the same monorepo at `docs/nashir_v1_openapi.yaml`.
* A separate authority checkout is unnecessary for the first monorepo backend CI slice.
* This reduces path drift and avoids duplicate checkout complexity.

Implementation must verify that backend validation scripts accept the monorepo root path correctly.

## 6. PostgreSQL / DB Test Boundary

Do not add PostgreSQL service in the first implementation PR unless it is already required for the listed backend commands to pass.

If migration or repository DB tests require PostgreSQL, the implementation PR must either:

* include an explicit PostgreSQL service with clear health checks, or
* defer DB-backed validation to a later authorization gate.

Preferred first slice:

* run non-DB validation and existing tests as currently supported by backend tooling
* avoid introducing database service complexity unless required

## 7. Explicitly Allowed Files

The implementation PR may modify only:

* `.github/workflows/backend-ci.yml`

If modifying existing workflow instead of adding a new one, it may modify:

* `.github/workflows/frontend-ci.yml`

But preferred path is adding a new backend workflow.

No other files are authorized unless the implementation proves a minimal CI-only need and documents it clearly.

## 8. Explicit NO-GO

This authorization does not allow:

* root `package.json` changes
* root `package-lock.json` changes
* frontend runtime changes under `src/**`
* backend runtime changes under `apps/api/src/**`
* backend package/dependency changes under `apps/api/package.json` or lockfiles
* OpenAPI edits
* generated type regeneration
* migration changes
* database schema changes
* deployment changes
* pilot/production readiness claims
* broad CI refactors
* formatting unrelated files

## 9. Stop Conditions

The implementation PR must stop if:

* frontend CI behavior changes unexpectedly
* backend dependencies are added to the root package
* root lint starts traversing backend files again
* `NASHIR_AUTHORITY_REPO` path does not work from CI
* backend validation requires PostgreSQL but no service is explicitly configured
* OpenAPI or generated files are touched
* package or lockfile changes appear without separate authorization
* any workflow secret or credential is introduced

## 10. Required Validation For This Authorization PR

This PR is docs-only.

Run:

* `git diff --check`
* confirm only `docs/nashir_monorepo_backend_ci_validation_implementation_authorization_gate.md` changed

## 11. Next PR After This Gate

If this authorization PR is merged, the next PR may implement the narrow backend CI validation workflow according to this gate.

Expected next PR title:

`ci: add backend validation workflow`

Expected next implementation branch:

`ci/monorepo-backend-validation`
