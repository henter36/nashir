# Nashir Monorepo Tooling Boundary Authorization Gate

| Field | Value |
|---|---|
| Gate type | Monorepo tooling boundary authorization gate |
| Scope | Documentation-only authorization; no tooling implementation |
| Source evaluation gate | `docs/nashir_monorepo_migration_evaluation_gate.md` |
| Source dry-run plan gate | `docs/nashir_monorepo_migration_dry_run_plan_gate.md` |
| Source dry-run findings gate | `docs/nashir_monorepo_migration_dry_run_findings_gate.md` |
| Decision | GO to tooling-boundary implementation planning only; NO-GO to migration implementation |

---

## 1. Decision Summary

Decision: **GO to tooling-boundary implementation planning only.**

Decision: **GO in principle to Option B + Option D**:

- Option B: root/frontend lint should ignore `apps/api/**` after the backend is
  imported.
- Option D: backend lint should run separately within `apps/api` or through a
  dedicated path-aware API CI job after migration.

Decision: **NO-GO to migration implementation in this PR.**

Decision: **NO-GO to adding backend lint dependencies to the root package merely
to satisfy `apps/api/eslint.config.js`.**

This gate authorizes the next planning step for a tooling-boundary
implementation. It does not import the backend, create `apps/api`, modify CI,
change OpenAPI, regenerate types, alter package scripts, add dependencies,
change ESLint configuration, or change frontend/backend runtime behavior.

## 2. Source Findings Reference

This authorization is based on:

- `docs/nashir_monorepo_migration_evaluation_gate.md`
- `docs/nashir_monorepo_migration_dry_run_plan_gate.md`
- `docs/nashir_monorepo_migration_dry_run_findings_gate.md`

The dry-run findings established:

- Subtree import succeeded structurally.
- Backend history preservation succeeded.
- All imported files were under `apps/api/**`.
- No protected paths changed.
- No real secrets were identified.
- `npm run build -- --outDir /tmp/nashir-build` passed.
- `npm run validate:ui-screens` passed.
- `git diff --check` passed.
- `npm run lint` failed after import because the root ESLint execution
  traversed `apps/api/**`, bringing backend files into a frontend/root lint
  context that does not include backend parser/plugin/tooling dependencies.

## 3. Problem Statement

The proposed monorepo migration can import the backend under `apps/api/**`
without changing protected Nashir frontend, governance, contract, generated,
CI, or root package paths.

However, the current root lint command is:

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

After `apps/api/**` exists, root lint traverses the backend tree and can load
backend ESLint flat config from the backend package context. That makes a
frontend/root validation command depend on backend lint tooling.

The migration implementation must not proceed while this boundary remains
unresolved, because an otherwise structure-only backend import would break root
lint.

## 4. Root Cause

Root cause:

- Root `eslint .` traverses `apps/api/**` after backend import.
- This brings backend files into the root/frontend ESLint execution context.
- The root/frontend lint context is not intended to own backend
  parser/plugin/tooling needs, such as `typescript-eslint`.
- Depending on ESLint/workspace/editor invocation, nested backend lint
  configuration may also be loaded from `apps/api`, but the actionable
  boundary remains the same: root/frontend lint must not traverse or validate
  `apps/api/**`.
- Option B is still valid because it prevents root/frontend lint from
  traversing `apps/api/**`, regardless of which exact mechanism would
  otherwise load backend lint/tooling dependencies.

Installing backend lint dependencies at the root would mask the boundary issue
by mixing frontend/root and backend tooling responsibilities.

## 5. Tooling Boundary Options

### Option A: Add Backend Lint Dependencies to Root

Install backend lint dependencies in the Nashir root package so root `eslint .`
can load `apps/api/eslint.config.js`.

Decision: **NO-GO.**

Reason: this weakens the monorepo boundary by making frontend/root tooling
absorb backend package dependencies merely because backend files are nearby.

### Option B: Exclude `apps/api/**` From Root/Frontend Lint

Update root/frontend lint behavior so it does not inspect imported backend
paths.

Decision: **GO in principle for later implementation authorization.**

Reason: root lint remains frontend/root lint and does not load backend ESLint
configuration from `apps/api/**`.

### Option C: Relocate Frontend to `apps/web` Before Backend Import

Move the current root frontend into `apps/web` before importing the backend.

Decision: **NO-GO for this boundary gate.**

Reason: frontend relocation is a larger product/tooling migration and is not
required to authorize the narrower lint boundary.

### Option D: Run Backend Lint Separately

Run backend lint from within `apps/api` or through a dedicated path-aware API CI
job after migration.

Decision: **GO in principle for later implementation authorization.**

Reason: backend lint belongs in the backend package context, with backend
dependencies and backend validation remaining scoped to the imported API
package.

## 6. Recommended Decision

Recommended decision: **Option B + Option D.**

Root/frontend lint should ignore `apps/api/**` after backend import. Backend
lint should run separately within `apps/api` or through a dedicated path-aware
API CI job after migration.

This keeps frontend/root validation stable while preserving a clear future
validation path for the backend.

This document does not implement either option.

## 7. Authorized Future Implementation Scope

A later tooling-boundary implementation PR may be authorized, by a separate
implementation gate, to do one or more of the following:

- Modify root lint ignore behavior so root/frontend lint does not inspect
  `apps/api/**`.
- Modify ESLint ignore/config behavior in a way that preserves frontend lint
  coverage while ensuring root lint does not load backend config.
- Add a dedicated API lint job after backend import, provided the job is
  path-aware and runs backend lint from the backend package context.

Any such implementation must remain narrowly scoped to the tooling-boundary
decision and must include validation proving that frontend lint still runs and
that backend config is not loaded by root lint.

## 8. Explicitly Unauthorized Scope

This gate does not authorize:

- Moving backend files into this repository.
- Creating `apps/api`.
- Changing backend implementation.
- Changing API routes.
- Changing SQL migrations or migration runner behavior.
- Changing ORM/query layer behavior.
- Changing OpenAPI.
- Regenerating or relocating generated types.
- Changing frontend source code.
- Changing package scripts.
- Changing root package dependencies.
- Adding backend dependencies to the root package.
- Modifying CI in this PR.
- Changing runtime environment or secrets configuration.
- Making production or pilot readiness claims.
- Pushing any branch to remote.

## 9. Files Likely Allowed in a Later Implementation PR

Subject to a separate tooling-boundary implementation authorization, later work
may allow changes to:

- Root ESLint ignore/config files, such as `eslint.config.js`, only to keep
  frontend/root lint from traversing or loading `apps/api/**`.
- Dedicated ignore files if selected by the implementation gate and if they do
  not reduce frontend lint coverage.
- `.github/workflows/**` only if a separate CI/path-aware implementation gate
  explicitly authorizes API lint CI after backend import.

The exact file list must be named in the later implementation authorization
before changes are made.

## 10. Files Explicitly Blocked Unless Separately Authorized

The following remain blocked unless a later gate explicitly authorizes them:

- `apps/api/**`
- Backend source, tests, package files, and runtime configuration.
- `src/**`
- `docs/nashir_v1_openapi.yaml`
- `src/generated/**`
- Root `package.json` scripts.
- Root `package-lock.json` dependency changes.
- SQL migration files.
- Migration runner files.
- ORM/query layer files.
- Runtime environment, secrets, deployment, and production configuration.
- CI/CD deployment workflows.

## 11. Validation Required After Implementation

Any later tooling-boundary implementation must run:

```bash
npm run lint
npm run validate:ui-screens
npm run build -- --outDir /tmp/nashir-build
git diff --check
```

If the implementation is tested after a backend import dry-run, validation must
also prove:

- Root/frontend lint does not load `apps/api/eslint.config.js`.
- Root/frontend lint still validates the existing frontend files.
- Backend lint is not silently skipped when an API lint path is authorized.
- No protected Nashir paths changed outside the authorized tooling files.

Migration implementation must not begin until:

1. Tooling-boundary implementation authorization is approved.
2. A new dry-run or updated validation proves that lint will not break after
   backend import.

## 12. CI/Path-Aware Implications

Current CI remains frontend-oriented and runs root `npm run lint`,
`npm run validate:ui-screens`, and frontend build from the repository root.

This gate does not change CI.

Future CI should become path-aware only after separate authorization. The
intended direction is:

| Path | Intended validation after authorization |
|---|---|
| `src/**` and current frontend root files | Root/frontend lint, UI screen validation, frontend build |
| `apps/api/**` | Backend lint, backend tests, and API checks from the backend package context |
| `docs/**` | Documentation/governance checks where available |
| OpenAPI/generated paths | Contract and generated-artifact checks only when separately authorized |

Path-aware CI must not be used to silently skip required frontend validation on
frontend changes or to claim production readiness.

## 13. Rollback Plan

Because this gate is documentation-only, rollback is limited to reverting this
document.

For a later tooling-boundary implementation PR, rollback must be defined before
merge and must restore:

- Root/frontend lint behavior to the previously approved state.
- Any changed ESLint ignore/config files.
- Any changed path-aware CI job definitions.
- No backend import, OpenAPI, generated type, runtime, or package dependency
  changes unless separately authorized.

If a later validation shows lint still fails after backend import, the migration
implementation remains blocked and the tooling-boundary implementation must be
revised or reverted before proceeding.

## 14. Human Decisions Resolved

Resolved by this gate:

- Root/frontend lint should not absorb backend lint dependencies.
- Backend lint should be scoped to the backend package context after import.
- Option B + Option D is the preferred tooling-boundary direction.
- Adding backend lint dependencies to the root package merely to satisfy
  `apps/api/eslint.config.js` is rejected.
- Migration implementation remains blocked until tooling-boundary
  implementation is separately authorized and validated.

Not resolved by this gate:

- Exact implementation file changes.
- Exact ESLint ignore/config mechanism.
- Exact API CI workflow shape.
- Exact backend import implementation PR.

## 15. Final GO/NO-GO

**GO** to tooling-boundary implementation planning only.

**GO in principle** to Option B + Option D.

**NO-GO** to migration implementation in this PR.

**NO-GO** to adding backend lint dependencies to the root package merely to
satisfy `apps/api/eslint.config.js`.

**NO-GO** to code, CI, runtime, OpenAPI, generated type, package script,
package dependency, or ESLint implementation changes in this PR.
