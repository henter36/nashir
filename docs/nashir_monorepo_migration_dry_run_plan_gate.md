# Nashir Monorepo Migration Dry-Run Plan Gate

| Field | Value |
|---|---|
| Gate type | Monorepo migration dry-run plan gate |
| Scope | Documentation-only; no migration execution |
| Source evaluation gate | `docs/nashir_monorepo_migration_evaluation_gate.md` |
| Decision | GO to dry-run review only; NO-GO to actual migration implementation in this PR |

---

## 1. Decision Summary

Decision: **GO to dry-run review only.**

This gate produces the exact plan, commands, expected diff shape, and validation
checklist for a future dry-run review of importing `henter36/nashir-backend` into
`henter36/nashir` as `apps/api`. It does not execute the import, does not create
`apps/api`, and does not change any code, CI, OpenAPI, generated types, package
scripts, or runtime behavior.

The dry-run is Phase 1 of the phased migration plan established in the source
evaluation gate. This gate defines what a reviewer must see, verify, and confirm
before any implementation proceeds.

## 2. Source Evaluation Gate Reference

Source gate: `docs/nashir_monorepo_migration_evaluation_gate.md`

Decisions from source gate that this gate inherits:

- Recommended option is Option B: history-preserving git subtree import of
  `nashir-backend` into `nashir` as `apps/api`.
- Migration implementation is not authorized until Phase 1 dry-run review is
  complete and a separate implementation gate explicitly authorizes execution.
- No frontend behavior, backend behavior, CI, OpenAPI, generated types, package
  scripts, secrets, or deployment changes are authorized in either the source
  gate or this gate.

## 3. Dry-Run Objective

The dry-run objective is to determine, without committing any migration to
`main`, whether the proposed git subtree import command sequence produces:

1. A correct, conflict-free `apps/api` tree under `henter36/nashir`.
2. Preserved backend commit history attached to `apps/api` paths.
3. No changes to `src/` (current frontend root; `apps/web` is only a future
   relocation target and does not exist yet), `docs`, `.github/workflows`,
   `docs/nashir_v1_openapi.yaml`, `src/generated`, or `package.json` and scripts.
4. A diff stat that is reviewable as structure-only and does not include runtime,
   contract, or tooling changes.

The dry-run must be run locally on a throwaway branch and must not be pushed to
`main` or merged until a separate migration implementation gate authorizes it.

## 4. Exact Proposed Dry-Run Commands

The following commands are proposed examples for dry-run review. They are not
authorized for execution in this PR. They must be validated in a separate local
environment before any migration implementation proceeds.

```bash
# Step 1 — Ensure local nashir and nashir-backend are both clean and up to date.
cd /path/to/nashir
git status          # Must be clean
git pull origin main

cd /path/to/nashir-backend
git status          # Must be clean
git pull origin main

# Step 2 — Create a throwaway dry-run branch in nashir.
cd /path/to/nashir
git checkout -b dry-run/monorepo-import-$(date +%Y%m%d)

# Step 3 — Add nashir-backend as a remote.
git remote add nashir-backend /path/to/nashir-backend
git fetch nashir-backend

# Step 4 — Perform dry-run subtree add (history-preserving).
git subtree add --prefix=apps/api nashir-backend main

# Step 5 — Inspect the result without merging or pushing.
git log --oneline -20
git diff --stat main...HEAD
unexpected_files="$(git diff --name-only main...HEAD | grep -v '^apps/api/' || true)"
if [ -n "$unexpected_files" ]; then
  echo "Unexpected files changed outside apps/api:"
  echo "$unexpected_files"
  exit 1
fi
echo "No unexpected files changed outside apps/api."
git log --oneline -- apps/api | head -20

# Step 6 — Check that no forbidden paths changed.
forbidden_files="$(git diff --name-only main...HEAD | grep -E \
  '^src/|^\.github/|^package\.json$|^package-lock\.json$|^docs/nashir_v1_openapi\.yaml$|^vite\.config\.' || true)"
if [ -n "$forbidden_files" ]; then
  echo "STOP: forbidden files changed outside the allowed apps/api scope:"
  echo "$forbidden_files"
  exit 1
fi
echo "OK: no forbidden file changes"

# Step 6b — Check for unexpected .env or secret files inside apps/api.
env_files="$(git diff --name-only main...HEAD -- 'apps/api/**.env' 'apps/api/**.env.*' \
  | grep -v '^apps/api/\.env\.example$' || true)"
if [ -n "$env_files" ]; then
  echo "STOP: unexpected .env or secret files found in apps/api:"
  echo "$env_files"
  exit 1
fi
echo "OK: no unexpected .env or secret files in apps/api (apps/api/.env.example, if present and intentional, is allowed)"

# Step 7 — Clean up the throwaway branch after review.
git checkout main
git branch -D dry-run/monorepo-import-$(date +%Y%m%d)
git remote remove nashir-backend
```

These commands are examples for review planning only. Actual path values, remote
names, and command sequence must be reviewed and confirmed in the migration
implementation gate before any execution.

`git-filter-repo` is an alternative if the subtree approach produces an
unacceptable merge commit structure. The choice between `git subtree` and
`git-filter-repo` must be confirmed in the implementation gate.

## 5. Expected Target Structure After Dry-Run

The dry-run should produce the following layout inside `henter36/nashir`:

```text
nashir/                         ← repository root (unchanged)
  apps/
    api/                        ← imported from nashir-backend main
      src/
      tests/
      package.json
      (other backend root files)
  src/                          ← existing frontend root (unchanged)
  docs/                         ← governance gates and contracts (unchanged)
  package.json                  ← nashir frontend package (unchanged)
  .github/
    workflows/
      frontend-ci.yml           ← existing CI (unchanged)
```

Files outside `apps/api` must not change. The existing frontend root (`src/`)
must remain at the repository root until a separate workspace relocation gate
explicitly authorizes moving it to `apps/web`.

## 6. Expected Diff Shape

The expected diff from a clean dry-run:

- New directory: `apps/api/` with all `nashir-backend` files.
- No changes to: `src/`, `docs/`, `.github/`, `package.json`,
  `docs/nashir_v1_openapi.yaml`, `src/generated/`, or any `vite.config.*`.
- A single merge commit that carries the imported backend history as `apps/api`
  path references.
- `git diff --stat main...HEAD` must show only `apps/api/**` insertions.

If any file outside `apps/api` appears in the diff stat, the dry-run must be
considered failed and must not proceed to implementation review.

## 7. History Preservation Approach

Preferred approach: `git subtree add --prefix=apps/api nashir-backend main`

This command rewrites backend commits so their paths are prefixed with
`apps/api/`, preserving commit messages, author metadata, and timestamps. The
result is that `git log --follow -- apps/api/src/...` traces back to the
original backend history.

Alternative: `git-filter-repo --path-rename :apps/api/` applied to a backend
repository clone, then merged into nashir. This avoids a merge commit and
produces a fully linear history but is more complex to execute and reverse.

The dry-run reviewer must confirm:

- That `git log -- apps/api` shows meaningful commit history, not just the merge
  commit.
- That the imported commit count is consistent with the backend repository
  history.
- That author metadata is preserved.

Fresh copy without history (Option C from the source evaluation gate) is not
recommended and must not be used unless a separate gate explicitly reverses the
preference for history preservation.

## 8. Validation Checklist

A reviewer executing the dry-run must verify each item before the result is
accepted as a valid dry-run:

- [ ] `git diff --name-only main...HEAD` contains only `apps/api/**` paths.
- [ ] No files in `src/`, `docs/`, `.github/`, `package.json`,
  `package-lock.json`, or `vite.config.*` appear in the diff.
- [ ] `docs/nashir_v1_openapi.yaml` is unchanged.
- [ ] `src/generated/creator-studio-openapi-types/index.d.ts` is unchanged.
- [ ] `.github/workflows/frontend-ci.yml` is unchanged.
- [ ] `package.json` and `package-lock.json` at the repository root are
  unchanged (no new scripts or dependencies).
- [ ] No `.env` or secret-carrying file appears in `apps/api`, other than an
  `apps/api/.env.example` if one already exists and is intentional.
- [ ] `git log --oneline -- apps/api | head -20` shows real backend commits, not
  just the merge commit.
- [ ] `npm run lint` passes after the import (frontend eslint must not be broken
  by the backend file presence).
- [ ] `npm run validate:ui-screens` passes (screen inventory must be unchanged).
- [ ] `npm run build -- --outDir /tmp/nashir-build` passes (frontend build must
  not be broken).
- [ ] `git diff --check` reports no whitespace errors in tracked files.
- [ ] No new runtime dependencies appear in the root `package.json`.
- [ ] The throwaway dry-run branch is not pushed to remote.

## 9. CI Impact Assessment

Current CI: `.github/workflows/frontend-ci.yml`

Current CI scope: frontend lint, UI screen validation, and frontend build.
It operates on the repository root and does not have path filters.

Dry-run impact on CI: **None. The dry-run is local-only and must not be pushed.**

Future migration impact on CI:

After a successful dry-run review and a separately authorized migration
implementation PR, CI will require path-aware filters:

| Future path | Required CI action |
|---|---|
| `apps/api/**` | Backend lint, typecheck, API smoke check authorized for backend layer |
| `apps/web/**` | Frontend lint, UI screen validation, frontend build (if web is relocated) |
| `apps/api/**` or root config | Must not silently skip frontend checks |

CI changes are **not authorized in this gate or in the migration implementation
PR unless the migration gate explicitly includes CI path filters.** If CI changes
are split into a separate PR, that PR requires its own explicit gate.

The existing `frontend-ci.yml` must remain unchanged through at least the
migration implementation PR. Any CI modification is a separate gate.

## 10. OpenAPI Authority Impact Assessment

Current OpenAPI authority: `docs/nashir_v1_openapi.yaml` inside `henter36/nashir`.

Dry-run impact: **None.**

The dry-run imports `apps/api` files only. It must not move, duplicate, or
reference `docs/nashir_v1_openapi.yaml` from a new path.

Future migration impact:

After the dry-run and implementation, `nashir-backend` must still reference
the OpenAPI authority inside `henter36/nashir` without copying or forking it.
In a monorepo, the backend can reference it via a relative path such as
`../../docs/nashir_v1_openapi.yaml` from `apps/api`, but this is a backend
configuration decision that requires a separate gate.

Moving the OpenAPI authority to `packages/contracts/` is a future option that
requires an explicit OpenAPI authority location gate. This gate does not
authorize or propose that move.

**No OpenAPI file must change in the dry-run or in the migration implementation
PR unless a separate OpenAPI authority gate explicitly authorizes it.**

## 11. Generated Types Impact Assessment

Current generated artifact:
`src/generated/creator-studio-openapi-types/index.d.ts`

Generated by script: `generate:creator-studio-types`
Input path: `docs/nashir_v1_openapi.yaml`

Dry-run impact: **None.**

The dry-run must not regenerate, relocate, or reference generated types.

Future migration impact:

If the frontend is later relocated from repository root to `apps/web`, the
relative path from `apps/web/package.json` back to `docs/nashir_v1_openapi.yaml`
will become `../../docs/nashir_v1_openapi.yaml`. The `generate:creator-studio-types`
script must be updated at that time. This must not happen in the migration
implementation PR unless a separate generated-types gate authorizes it.

**Generated types must not change in the dry-run or migration implementation
PR unless a dedicated generated-types gate explicitly authorizes regeneration
or relocation.**

## 12. Secrets and Env Boundary Assessment

Current state: `henter36/nashir` has no backend secrets. Frontend uses no real
credentials. `.env` files are not committed.

Dry-run impact: **None.**

The dry-run imports backend files but must not expose, copy, or commit any
backend `.env`, secret references, or credential files. The reviewer must verify
that no `.env*` or secrets-carrying files appear in `apps/api` after the import.

Future migration boundaries that must be preserved:

- `apps/web` and `apps/api` must keep completely separate env expectations.
- Backend secret names and vault references remain backend-governed.
- A shared repository does not mean shared secrets or shared env files.
- CI secrets must be scoped by job and environment with least privilege.
- The migration PR must confirm that `apps/api/.gitignore` covers backend env
  files and that no secret values appear in the imported commit history.

If `nashir-backend` has any committed `.env` files or secret values in its
history, this must be identified and remediated before any migration proceeds.
The dry-run reviewer must check: `git log --all --full-history -- '*.env' '*.env.*'`
inside the `nashir-backend` repository before the import.

## 13. Rollback Plan

The dry-run itself has no rollback risk because it runs on a throwaway branch
and must not be pushed to remote.

Rollback plan for future migration implementation PR:

1. Keep `henter36/nashir-backend` unchanged, unrestricted, and fully accessible
   until the monorepo import is reviewed, accepted, and confirmed stable.
2. Perform the import on a dedicated migration branch only; never directly on
   `main`.
3. If review rejects the migration, close the branch without merging.
4. If CI fails after merge, revert the import merge commit using
   `git revert -m 1 <merge-commit-sha>` and force a revert PR.
5. Tag the backend commit imported into `apps/api` before merge so the source
   point is traceable.
6. Do not retire, archive, or change branch protections on
   `henter36/nashir-backend` until a closure gate explicitly confirms the
   monorepo model is stable and backend development has fully moved.

## 14. Stop Conditions

The dry-run must stop and must not proceed to implementation review if any of
the following are true:

- Any file outside `apps/api/**` changes during the import command sequence.
- `docs/nashir_v1_openapi.yaml` changes or is touched.
- `src/generated/**` changes or is touched.
- `.github/workflows/frontend-ci.yml` changes or is touched.
- Any file under `src/` changes or is touched.
- `package.json` or `package-lock.json` at the repository root changes
  (scripts, dependencies, or metadata).
- The frontend build (`npm run build`) fails after the import.
- `npm run lint` fails after the import.
- `npm run validate:ui-screens` fails after the import.
- A merge conflict appears that requires restructuring backend files to resolve.
- Any `.env` or secret-carrying file appears in `apps/api` after the import.
- The import produces a diff so large it cannot be meaningfully reviewed by a
  human in a single PR review session.
- Backend history is not visible via `git log -- apps/api` (indicates a
  non-history-preserving import was used without authorization).
- The import commit references any backend dependency that the root `package.json`
  or frontend `vite.config.*` would pick up automatically.

## 15. Human Decisions Required Before Implementation

Before a migration implementation PR is authorized, a human must explicitly
decide each of the following:

- Whether to proceed with the monorepo migration at all after reviewing the
  dry-run diff.
- Whether `git subtree add` or `git-filter-repo` is the required method.
- Whether history preservation is mandatory or best-effort if a conflict arises.
- Whether `apps/web` relocation (moving `src/` to `apps/web/`) is included in
  the migration PR or is a separate gate. Current recommendation is: separate gate.
- Whether CI path filters are included in the migration PR or a separate gate.
  Current recommendation is: separate gate.
- Whether OpenAPI authority remains at `docs/nashir_v1_openapi.yaml` or moves to
  `packages/contracts/` in a later gate.
- Whether the root `package.json` becomes a workspace root in the migration PR or
  in a later gate.
- Whether `henter36/nashir-backend` is frozen, read-only, or archived after
  migration, and when.
- Who performs the dry-run review and what their acceptance criteria are.
- Whether a GitHub Actions secret scan or history secret scan is required before
  the import proceeds.

## 16. Explicit Non-Goals

This gate does not authorize and must not include:

- Moving backend files.
- Creating `apps/api` in the repository.
- Running git subtree, git-filter-repo, or any import command.
- Changing CI workflows.
- Changing OpenAPI.
- Regenerating or relocating generated types.
- Changing frontend code.
- Changing backend code.
- Adding or modifying dependencies.
- Modifying package scripts.
- Creating workspace or package manager configuration.
- Adding SQL migrations, migration runner behavior, or database-applied changes.
- Adding ORM or query layer.
- Adding runtime env or secrets config.
- Adding deployment config.
- Claiming production or pilot readiness.
- Pushing the dry-run branch to remote.

## 17. Final GO/NO-GO

- **GO** to dry-run review only: proceed with a local dry-run of the git subtree
  import on a throwaway branch, following the exact command sequence in section 4,
  and complete the validation checklist in section 8 before any further decision.
- **NO-GO** to actual migration implementation in this PR.
- **NO-GO** to any code, CI, runtime, OpenAPI, generated type, package script,
  secrets, env, or deployment change in this PR.

All changes in this PR are documentation-only. No code, CI, runtime,
OpenAPI, generated type, or package script was modified.
