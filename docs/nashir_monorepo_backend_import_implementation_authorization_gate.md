# Nashir Monorepo Backend Import Implementation Authorization Gate

| Field | Value |
|---|---|
| Gate type | Monorepo backend import implementation authorization gate |
| Scope | Documentation-only authorization; no backend import in this PR |
| Source evaluation gate | `docs/nashir_monorepo_migration_evaluation_gate.md` |
| Source dry-run plan gate | `docs/nashir_monorepo_migration_dry_run_plan_gate.md` |
| Source dry-run findings gate | `docs/nashir_monorepo_migration_dry_run_findings_gate.md` |
| Source tooling boundary authorization gate | `docs/nashir_monorepo_tooling_boundary_authorization_gate.md` |
| Source tooling boundary implementation authorization gate | `docs/nashir_monorepo_tooling_boundary_implementation_authorization_gate.md` |
| Source ESLint revalidation findings gate | `docs/nashir_monorepo_eslint_revalidation_findings_gate.md` |
| Decision | GO to one narrow backend import implementation PR; NO-GO to backend import or `apps/api` creation in this PR |

---

## 1. Decision Summary

Decision: **GO to one narrow backend import implementation PR.**

The authorized implementation target is limited to importing
`nashir-backend`'s `main` branch into this repository under `apps/api/**`
using `git subtree`, preserving backend history through a subtree merge
rather than a copy/paste import. This gate authorizes that one
implementation PR; it does not perform the import itself.

Decision: **NO-GO to backend import in this authorization PR.**

Decision: **NO-GO to creating `apps/api` in this authorization PR.**

Decision: **NO-GO to CI, OpenAPI, generated client, package script, package
dependency, ESLint configuration, or runtime/secrets changes in this PR.**

This gate is documentation-only. It does not move backend code, create
`apps/api`, modify CI, OpenAPI, generated types, package scripts, package
dependencies, ESLint configuration, or runtime/secrets configuration.

## 2. Source Gates

This authorization is based on:

- `docs/nashir_monorepo_migration_evaluation_gate.md`
- `docs/nashir_monorepo_migration_dry_run_plan_gate.md`
- `docs/nashir_monorepo_migration_dry_run_findings_gate.md`
- `docs/nashir_monorepo_tooling_boundary_authorization_gate.md`
- `docs/nashir_monorepo_tooling_boundary_implementation_authorization_gate.md`
- `docs/nashir_monorepo_eslint_revalidation_findings_gate.md`

The ESLint revalidation findings gate decided GO to migration implementation
authorization planning, having confirmed the lint stop condition was
resolved. This gate is that planning step: a docs-only authorization for the
backend import implementation PR itself.

## 3. Evidence Summary From Revalidation

The most recent dry-run revalidation, run in a disposable temporary clone
after the tooling-boundary implementation merged, found:

- `git subtree add --prefix=apps/api` succeeded against backend `main`
  (`ebb01d1a00123498d7ef0d81973c9ab5d4646354`).
- 186 files changed, all under `apps/api/**`; no files changed outside that
  path.
- No protected paths changed (`src/**`, `docs/nashir_v1_openapi.yaml`,
  `src/generated/**`, `.github/workflows/**`, root `package.json`/
  `package-lock.json`, `eslint.config.js`).
- No real secrets found; only `apps/api/.env.example` with placeholder
  values.
- History preservation confirmed: the subtree merge commit has two parents,
  and backend history (389 commits) remains reachable through the second
  parent.
- `npm run lint`, `npm run validate:ui-screens` (23/23),
  `npm run build -- --outDir /tmp/nashir-build`, and `git diff --check` all
  passed after import.
- Root `package.json`/`package-lock.json` were unchanged; no backend
  dependency was added to root.

This evidence is the basis for authorizing the backend import implementation
PR.

## 4. Authorized Implementation Scope

A single, narrowly scoped implementation PR is authorized to:

- Import `nashir-backend`'s `main` branch into this repository under
  `apps/api/**`.
- Preserve backend commit history via `git subtree` merge, not a
  copy/paste import that discards history.

No other implementation scope is authorized by this gate.

## 5. Exact Allowed Import Method

The implementation PR must use:

```bash
git subtree add --prefix=apps/api <backend-remote> main
```

where `<backend-remote>` points to the `nashir-backend` repository's `main`
branch. The merge must not be squashed (no `--squash`), so that backend
history remains reachable as a second parent of the resulting merge commit.

## 6. Exact Allowed File Scope

- All imported files must land under `apps/api/**`.
- No files outside `apps/api/**` may change as a result of the import,
  except where a separate, explicit authorization permits a specific
  out-of-scope change.

## 7. Explicitly Blocked Scope

The following remain blocked in this authorization PR:

- Backend import of any kind.
- Creation of `apps/api`.
- CI/CD workflow changes (`.github/workflows/**`).
- OpenAPI changes (`docs/nashir_v1_openapi.yaml`).
- Generated client/type changes (`src/generated/**`).
- Package script changes (root `package.json` scripts).
- Package dependency changes (root `package.json` / `package-lock.json`).
- ESLint configuration changes (`eslint.config.js`).
- Runtime environment or secrets configuration changes.
- Any production or pilot readiness claim.
- Pushing any branch to remote without explicit instruction.

## 8. Required Verification Commands

The authorized backend import implementation PR must run and report:

```bash
npm run lint
npm run validate:ui-screens
npm run build -- --outDir /tmp/nashir-build
git diff --check
```

The implementation PR must prove:

- `git subtree add --prefix=apps/api` succeeds.
- All changed files are under `apps/api/**`.
- Protected paths are unchanged: `src/**`, `docs/nashir_v1_openapi.yaml`,
  `src/generated/**`, `.github/workflows/**`, root `package.json`, root
  `package-lock.json`, `eslint.config.js`.
- No real secrets are present (placeholder-only `.env.example` is
  acceptable).
- Backend history remains reachable (the merge commit has a second parent
  carrying backend commit history).
- `npm run lint` passes.
- `npm run validate:ui-screens` passes 23/23.
- `npm run build -- --outDir /tmp/nashir-build` passes.
- `git diff --check` passes.

## 9. Post-Import Expected State

After the authorized import PR merges:

- `apps/api/**` exists in this repository with backend source, tests, and
  package files.
- Root/frontend lint continues to ignore `apps/api/**`, per the merged
  tooling-boundary implementation.
- Backend lint and API CI are **not** part of this import PR. Running
  backend lint from the backend package context, or adding a dedicated
  path-aware API CI job, requires separate authorization (Option D from the
  tooling boundary authorization gate) before it is implemented.
- No backend runtime is deployed, started, or otherwise made operational as
  a result of this import; the import is structural only.

## 10. Stop Conditions

The backend import implementation PR must stop and report the boundary,
rather than proceed, if any of the following occur:

- `npm run lint` fails after import.
- Any file outside `apps/api/**` changes as a result of the import.
- Any protected path listed in Section 7/8 changes.
- Real secrets, credentials, or production URLs are found in imported
  files.
- Backend history is not reachable after the merge (e.g., the merge was
  squashed or history was discarded).
- `npm run validate:ui-screens` or `npm run build -- --outDir /tmp/nashir-build`
  fails.

If any stop condition triggers, the import PR must not be merged until the
issue is resolved or a revised authorization is obtained.

## 11. Rollback Plan

This gate is documentation-only; rollback is limited to reverting this
document.

For the authorized backend import implementation PR, rollback must:

- Revert the subtree merge commit(s) that introduced `apps/api/**`.
- Restore the repository to the pre-import state with no `apps/api/**`
  present.
- Leave the tooling-boundary `eslint.config.js` ignore entry intact, since
  it is independent of whether the import is present.

If a stop condition is triggered post-merge, the import must be reverted
before any further migration work proceeds.

## 12. Final GO/NO-GO

**GO** to one narrow backend import implementation PR limited to importing
`nashir-backend`'s `main` branch into `apps/api/**` via `git subtree`,
preserving history.

**NO-GO** to backend import in this authorization PR.

**NO-GO** to creating `apps/api` in this authorization PR.

**NO-GO** to CI, OpenAPI, generated client, package script, package
dependency, ESLint configuration, or runtime/secrets changes in this PR.
