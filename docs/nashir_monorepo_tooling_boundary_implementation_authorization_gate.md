# Nashir Monorepo Tooling Boundary Implementation Authorization Gate

| Field | Value |
|---|---|
| Gate type | Monorepo tooling boundary implementation authorization gate |
| Scope | Documentation-only authorization; no tooling implementation in this PR |
| Source evaluation gate | `docs/nashir_monorepo_migration_evaluation_gate.md` |
| Source dry-run plan gate | `docs/nashir_monorepo_migration_dry_run_plan_gate.md` |
| Source dry-run findings gate | `docs/nashir_monorepo_migration_dry_run_findings_gate.md` |
| Source tooling boundary authorization gate | `docs/nashir_monorepo_tooling_boundary_authorization_gate.md` |
| Decision | GO to one narrow tooling-boundary implementation PR; NO-GO to backend import or migration implementation |

---

## 1. Decision Summary

Decision: **GO to one narrow tooling-boundary implementation PR.**

The authorized implementation target is limited to making root/frontend lint
ignore `apps/api/**` so that a future backend import does not break
`npm run lint`. This gate authorizes that one implementation PR; it does not
perform the implementation itself.

Decision: **NO-GO to backend import in this gate or in the authorized
implementation PR.**

Decision: **NO-GO to creating `apps/api` in this authorization PR or in the
authorized implementation PR.**

Decision: **NO-GO to CI changes**, unless a later PR separately authorizes API
lint CI.

Decision: **NO-GO to OpenAPI, generated client, package dependency, package
script, or runtime changes.**

This gate is documentation-only. It does not modify code, CI, OpenAPI,
generated types, package scripts, package dependencies, or ESLint
configuration, and it does not create `apps/api` or move backend code.

## 2. Source Gates

This authorization is based on:

- `docs/nashir_monorepo_migration_evaluation_gate.md`
- `docs/nashir_monorepo_migration_dry_run_plan_gate.md`
- `docs/nashir_monorepo_migration_dry_run_findings_gate.md`
- `docs/nashir_monorepo_tooling_boundary_authorization_gate.md`

The prior tooling boundary authorization gate decided:

- GO to tooling-boundary implementation planning only.
- GO in principle to Option B (root/frontend lint excludes `apps/api/**`) and
  Option D (backend lint runs separately).
- NO-GO to migration implementation.
- NO-GO to adding backend lint dependencies to the root package merely to
  satisfy `apps/api/eslint.config.js`.

## 3. Problem Confirmed

The dry-run findings confirmed that after a structural backend import under
`apps/api/**`:

- `npm run lint` fails because root `eslint .` traverses `apps/api/**`,
  pulling backend files into a frontend/root lint context that lacks backend
  parser/plugin/tooling dependencies.
- `npm run build -- --outDir /tmp/nashir-build`, `npm run validate:ui-screens`,
  and `git diff --check` all passed.
- No protected paths changed and no real secrets were found during the
  dry-run import.

The root cause remains that root/frontend lint is not scoped away from
`apps/api/**`, so any backend import will break root lint until that boundary
is fixed. This gate authorizes the implementation step that fixes the
boundary, without authorizing the import itself.

## 4. Authorized Implementation Target

A single, narrowly scoped implementation PR is authorized to ensure:

- Root/frontend lint (`npm run lint`) ignores `apps/api/**`.
- Root/frontend lint continues to validate all existing frontend/root files
  unchanged.
- Backend lint remains separate from root and is not added as a root
  dependency.

This is the only implementation target authorized by this gate. No backend
import, no `apps/api` creation, and no CI changes are part of this
authorization.

## 5. Exact Allowed Future Changes

The authorized implementation PR may modify only:

- The minimum root ESLint ignore/config mechanism required to keep
  root/frontend lint from traversing or loading `apps/api/**` (for example,
  an `ignores` entry in `eslint.config.js` or an equivalent dedicated ignore
  file).

Nothing else is authorized for that PR.

## 6. Explicitly Blocked Changes

The following remain blocked in the authorized implementation PR unless a
later gate separately authorizes them:

- Backend import or creation of `apps/api`.
- Moving or copying any backend source, tests, or package files into this
  repository.
- CI/CD workflow changes (`.github/workflows/**`), unless a later PR
  separately authorizes API lint CI.
- OpenAPI changes (`docs/nashir_v1_openapi.yaml`).
- Generated client/type changes (`src/generated/**`).
- Root `package.json` scripts.
- Root `package.json` / `package-lock.json` dependency changes, including
  adding `typescript-eslint` or any backend lint/tooling dependency to root.
- Frontend source code changes (`src/**`) beyond the lint configuration
  mechanism itself.
- SQL migrations, migration runner behavior, ORM/query layer behavior.
- Runtime environment, secrets, deployment, or production configuration.
- Any production or pilot readiness claim.
- Pushing any branch to remote without explicit instruction.

## 7. Required Verification

The authorized implementation PR must run and report:

```bash
npm run lint
npm run validate:ui-screens
npm run build -- --outDir /tmp/nashir-build
git diff --check
```

The implementation PR must prove:

- `npm run lint` still lints frontend/root files.
- `apps/api/**` is excluded from root/frontend lint.
- No `typescript-eslint` or other backend dependency is added to the root
  package.
- No `apps/api` import exists anywhere in the implementation PR's diff.

## 8. Dry-Run Revalidation Requirement

After the tooling-boundary implementation PR merges, a new backend-import
dry-run is required before any migration implementation can proceed. That
dry-run must revalidate that:

- `npm run lint` passes after a structural backend import under
  `apps/api/**`.
- Root/frontend lint does not load `apps/api/eslint.config.js`.
- No protected Nashir paths changed outside the authorized tooling files.

Migration implementation remains blocked until this revalidation passes and
is recorded in a follow-up findings gate.

## 9. Rollback Plan

This gate is documentation-only; rollback is limited to reverting this
document.

For the authorized implementation PR, rollback must restore the prior
root/frontend lint configuration so that `npm run lint` behaves exactly as it
did before the ignore/config change, with no residual backend tooling
dependency added to root.

## 10. Final GO/NO-GO

**GO** to one narrow tooling-boundary implementation PR limited to making
root/frontend lint ignore `apps/api/**`.

**NO-GO** to backend import.

**NO-GO** to creating `apps/api` in this authorization PR.

**NO-GO** to CI changes unless a later PR separately authorizes API lint CI.

**NO-GO** to OpenAPI, generated client, package dependency, package script, or
runtime changes.
