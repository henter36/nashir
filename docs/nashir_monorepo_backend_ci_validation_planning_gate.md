# Nashir Monorepo Backend CI / API Validation Planning Gate

## 1. Decision

Decision: GO to Backend CI / API Validation Implementation Authorization Gate only.

This planning gate does not authorize CI implementation.

## 2. Context

* PR #223 imported `nashir-backend` into `apps/api/**`.
* PR #224 accepted the backend import as present in the monorepo.
* The current frontend/root CI remains valid and passed after import.
* Backend validation is not yet wired into the `henter36/nashir` monorepo CI.
* Backend validation must be added carefully without breaking the existing frontend boundary.

## 3. Current State

* `apps/api/**` is now present in the monorepo.
* root/frontend validation already excludes `apps/api/**` from root lint traversal.
* current root frontend checks remain:

  * `npm run lint`
  * `npm run validate:ui-screens`
  * `npm run build`
* backend has its own package/tooling under `apps/api`.
* backend validation should run from `apps/api`, not by adding backend dependencies to the root package.

## 4. Recommended CI Strategy

Recommend a separate backend job, not merged into frontend job.

Proposed job name:

`Validate backend`

Proposed working directory:

`apps/api`

Proposed steps:

* checkout repository
* setup Node
* setup pnpm
* install backend dependencies inside `apps/api`
* checkout or reference Nashir authority repo as required by backend contract validation
* run backend validation commands from `apps/api`

Proposed backend commands:

* `pnpm install --frozen-lockfile`
* `pnpm lint`
* `pnpm typecheck`
* `pnpm test`
* `NASHIR_AUTHORITY_REPO=<resolved-authority-path> pnpm run validate:contract-authority`
* `NASHIR_AUTHORITY_REPO=<resolved-authority-path> pnpm run validate:contracts`
* migration/repository DB tests only if the job provisions PostgreSQL intentionally

## 5. Authority Repo Handling

Backend contract validation still depends on the Nashir authority repo.

The plan should explicitly decide in the next authorization gate whether CI should:

Option A:
Use the same checked-out monorepo root as `NASHIR_AUTHORITY_REPO`.

Option B:
Use a separate checkout path for the authority repo.

Recommended planning decision:
Option A is preferred now because the OpenAPI authority file is already in the same monorepo root at `docs/nashir_v1_openapi.yaml`.

But implementation must verify the backend script accepts this path correctly before finalizing CI.

## 6. Boundaries

This planning gate must preserve:

* no OpenAPI edits
* no generated type regeneration
* no root package dependency changes unless separately authorized
* no backend runtime code changes
* no frontend runtime code changes
* no deployment or pilot claims
* no CI implementation in this PR

## 7. Risks

* Root package pollution if backend dependencies are added at root.
* CI time increase due backend tests and PostgreSQL service.
* Authority path mismatch.
* Contract drift if validation is skipped.
* False confidence if only frontend CI runs after backend import.
* Migration DB tests requiring explicit PostgreSQL provisioning.

## 8. Required Next Gate

Recommended next PR:

Backend CI / API Validation Implementation Authorization Gate

That gate should decide the exact allowed implementation scope, including:

* whether to add `.github/workflows/backend-ci.yml` or modify existing workflow
* exact Node and pnpm setup
* exact `working-directory`
* exact `NASHIR_AUTHORITY_REPO`
* whether PostgreSQL service is included in the first CI slice
* whether migration/repository DB tests are included now or deferred

## 9. Explicit NO-GO In This PR

This PR must not:

* edit `.github/workflows/**`
* edit root `package.json`
* edit root `package-lock.json`
* edit `apps/api/**`
* edit OpenAPI
* edit generated types
* edit frontend runtime files
* add dependencies
* implement backend CI

## 10. Validation

Only docs validation is required:

* `git diff --check`
* confirm only `docs/nashir_monorepo_backend_ci_validation_planning_gate.md` changed
