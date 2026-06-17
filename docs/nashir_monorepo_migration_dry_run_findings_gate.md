# Nashir Monorepo Migration Dry-Run Findings Gate

| Field | Value |
|---|---|
| Gate type | Monorepo migration dry-run findings gate |
| Scope | Documentation-only findings; no migration implementation |
| Source evaluation gate | `docs/nashir_monorepo_migration_evaluation_gate.md` |
| Source dry-run plan gate | `docs/nashir_monorepo_migration_dry_run_plan_gate.md` |
| Dry-run branch | `dry-run/monorepo-backend-import` |
| Source backend HEAD | `ebb01d1a00123498d7ef0d81973c9ab5d4646354` |
| Decision | GO to tooling-boundary authorization planning; NO-GO to migration implementation |

---

## 1. Decision Summary

Decision: **GO to tooling-boundary authorization planning.**

Decision: **NO-GO to migration implementation until the lint/tooling boundary is
explicitly authorized.**

Decision: **NO-GO to adding root dependencies merely to satisfy backend lint
config.**

The local dry-run confirmed that the history-preserving backend import can land
all imported files under `apps/api/**` without changing protected frontend,
contract, generated, CI, or root package paths. It also exposed a tooling
boundary issue: the current root lint command discovers the imported backend
ESLint flat config and fails because backend lint tooling is not installed at
the frontend/root level.

This gate records findings only. It does not import the backend, create
`apps/api`, modify CI, change OpenAPI, regenerate types, alter package scripts,
add dependencies, change ESLint config, or change frontend/backend runtime
behavior.

## 2. Dry-Run Environment

The dry-run was executed locally on a throwaway branch:
`dry-run/monorepo-backend-import`.

Source backend HEAD:
`ebb01d1a00123498d7ef0d81973c9ab5d4646354`.

Dry-run method: history-preserving subtree import of `nashir-backend` into
`nashir` under `apps/api`.

The dry-run result was inspected locally and was not authorized for merge,
remote push, or migration implementation.

## 3. Import Result

The subtree add completed successfully.

The import produced the expected backend tree under `apps/api/**`.

No files outside `apps/api/**` were part of the import diff.

## 4. Diff Shape

Observed dry-run diff shape:

| Metric | Result |
|---|---|
| Files changed | 186 |
| Insertions | 61,560 |
| Path scope | All changed files were under `apps/api/**` |

No changes appeared in protected Nashir frontend, governance, contract,
generated, CI, or root package paths.

## 5. Protected Paths Result

Protected path check result: **PASS**.

The dry-run did not change:

- `src/**`
- `docs/**`
- `.github/workflows/**`
- `docs/nashir_v1_openapi.yaml`
- `src/generated/**`
- root `package.json`
- root `package-lock.json`
- `vite.config.*`

This confirms the import shape matched the documentation-only dry-run plan
boundary.

## 6. Secrets and Env Result

Secrets/env check result: **PASS with documented placeholder file only**.

The only committed env-like file observed in the imported tree was:

- `apps/api/.env.example`

That file contained placeholders only. No actual secrets or committed runtime
credential values were identified in the dry-run diff.

## 7. History Preservation Result

History preservation result: **PASS**.

The subtree import preserved backend history for the imported `apps/api` paths.
The dry-run confirmed that the import was not a fresh copy without history.

## 8. Validation Results

| Check | Result | Notes |
|---|---|---|
| `git subtree add` | PASS | Import completed successfully. |
| Diff path scope | PASS | All 186 changed files were under `apps/api/**`. |
| Protected paths | PASS | No protected paths changed. |
| Secrets/env review | PASS | Only `apps/api/.env.example` with placeholders was observed. |
| History preservation | PASS | Backend history was preserved through subtree import. |
| `npm run build -- --outDir /tmp/nashir-build` | PASS | Frontend build completed in the dry-run. |
| `npm run validate:ui-screens` | PASS | UI screen inventory validation completed in the dry-run. |
| `git diff --check` | PASS | No whitespace errors were reported in the dry-run. |
| `npm run lint` | FAIL | Root ESLint discovered backend ESLint config and failed due to missing backend tooling dependency. |

## 9. Stop Condition Triggered

Stop condition: **`npm run lint` failed.**

The migration implementation must not proceed as an import-only change while
the current root lint behavior remains unchanged.

## 10. Root Cause

Root cause:

ESLint flat-config discovers `apps/api/eslint.config.js` and requires backend
tooling dependency `typescript-eslint` that is not installed at the
frontend/root level.

The current root script is:

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

That command runs from the frontend/root package context and, after backend
import, traverses into `apps/api/**`. Because ESLint flat config is discovered
inside the backend tree, frontend/root lint execution attempts to load backend
lint configuration and backend lint dependencies.

## 11. Impact

Migration implementation cannot be import-only if current root lint behavior
remains unchanged.

The import itself is structurally valid, but the existing root tooling boundary
does not distinguish frontend lint from backend lint after `apps/api` exists.
Proceeding without an explicit tooling-boundary decision would either break
root lint or encourage installing backend lint dependencies at the root to mask
the boundary issue.

## 12. Tooling Boundary Decision Needed

A tooling-boundary authorization gate is required before any migration
implementation gate.

That gate must decide how frontend/root lint and backend lint are separated in
the monorepo without weakening Nashir governance boundaries.

The decision must explicitly cover:

- Whether root/frontend lint ignores `apps/api/**`.
- Where backend lint runs after import.
- Whether backend tooling dependencies remain scoped to `apps/api`.
- Whether future CI becomes path-aware for frontend and API validation.
- Which files are authorized for the tooling-boundary change.

## 13. Options Considered

### Option A: Install Backend Lint Dependencies in Root

Install backend lint dependencies, including `typescript-eslint`, in the
frontend/root package.

Result: **Not recommended.**

Why not A:

Installing backend lint dependencies in frontend/root mixes layer tooling and
weakens monorepo boundaries.

### Option B: Exclude `apps/api/**` From Frontend/Root Lint

Update root/frontend lint behavior so root lint ignores imported backend paths.

Result: **Recommended as part of the next tooling-boundary gate.**

This preserves frontend lint as frontend lint and avoids loading backend ESLint
configuration from the root package context.

### Option C: Relocate Frontend to `apps/web` Before Backend Import

Move the current frontend from repository root to `apps/web` before importing
the backend.

Result: **Not recommended now.**

Why not C now:

Frontend relocation is a larger migration and should not block backend import
planning.

### Option D: Add Separate Backend Lint Job After Import

Run backend lint separately within `apps/api` or through a path-aware API CI job
after migration.

Result: **Recommended as part of the next tooling-boundary gate.**

This keeps backend lint execution in the backend package context and allows API
checks to be scoped to `apps/api/**`.

## 14. Recommended Path

Recommended path: **B + D**.

Root/frontend lint must ignore `apps/api/**`, and backend lint must run
separately within `apps/api` or a path-aware API CI job after migration.

This keeps the frontend/root package from absorbing backend lint dependencies
while preserving a clear place for backend validation after import.

## 15. Required Next Gate

Required next gate: **tooling boundary authorization gate before migration
implementation.**

The tooling-boundary gate must authorize any root lint ignore, backend lint
execution path, path-aware API validation, or CI split before those changes are
implemented.

The backend migration implementation remains blocked until that tooling
boundary is explicitly authorized.

## 16. Explicit Non-Goals

This gate does not authorize:

- Moving backend files into this repository.
- Creating `apps/api`.
- Moving frontend files to `apps/web`.
- Changing CI workflows.
- Changing OpenAPI authority or `docs/nashir_v1_openapi.yaml`.
- Regenerating or relocating generated types.
- Changing frontend source code.
- Changing backend source code.
- Adding dependencies.
- Modifying package scripts.
- Modifying ESLint configuration.
- Changing runtime env or secrets configuration.
- Making production or pilot readiness claims.
- Pushing any dry-run branch to remote.

## 17. Final GO/NO-GO

**GO** to tooling-boundary authorization planning.

**NO-GO** to migration implementation until lint/tooling boundary is explicitly
authorized.

**NO-GO** to adding root dependencies merely to satisfy backend lint config.
