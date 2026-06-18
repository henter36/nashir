# Nashir Monorepo Backend Import Acceptance Gate

| Field | Value |
|---|---|
| Gate type | Monorepo backend import acceptance gate |
| Scope | Documentation-only acceptance; no implementation in this PR |
| Source PR | `henter36/nashir#223` |
| Source backend import implementation authorization gate | `docs/nashir_monorepo_backend_import_implementation_authorization_gate.md` |
| Decision | GO — backend import accepted as present in monorepo |

---

## 1. Decision

Decision: **GO — backend import accepted as present in monorepo.**

This gate accepts the completed `nashir-backend` subtree import into
`apps/api/**`, performed in PR #223, as the current state of the monorepo.
It does not authorize any further implementation; it records acceptance of
what has already merged.

## 2. Context

- PR #223 (`monorepo: import Nashir backend into apps api`) has been merged.
- `nashir-backend` now exists inside `henter36/nashir` under `apps/api/**`.
- The import was performed via `git subtree add --prefix=apps/api`.
- The import was **not** squashed.
- Backend commit history remains reachable through the subtree merge commit.
- Backend source HEAD used in PR #223:
  `f51bef8313048f0f7181c69de4a7326efbdad760`
- Import merge commit in PR #223:
  `e28f1961cc4c1231de255695810f7a1dd94d9daa`
- Final merge commit in `nashir`:
  `cf9d0c77e29ea98bdfcb1838c3ae7c04ad1bf521`

## 3. What Is Accepted

This gate accepts:

- The presence of `apps/api/**` inside the monorepo.
- Preservation of the root/frontend boundary.
- No modification to `src/**`.
- No modification to `docs/nashir_v1_openapi.yaml`.
- No modification to `src/generated/**`.
- No modification to `.github/workflows/**`.
- No modification to root `package.json` or root `package-lock.json`.
- No modification to `eslint.config.js`.

## 4. Verification

PR #223 documented successful local validation after import:

- `npm run lint`
- `npm run validate:ui-screens` — 23/23
- `npm run build -- --outDir /tmp/nashir-build`
- `git diff --check`

Frontend CI on the merged PR #223 head commit also passed after the import:

- Lint
- Validate UI screens
- Build

## 5. Boundaries That Remain Prohibited

This acceptance gate does not authorize:

- Backend CI wiring inside `nashir`.
- Root package dependency or script changes.
- OpenAPI edits.
- Generated types regeneration.
- Runtime/API wiring.
- Deployment or pilot readiness claims.

## 6. Recommended Next Step

**GO to Backend CI / API Validation Planning Gate only.**

This gate does not authorize backend CI implementation; it authorizes
planning only. Any CI changes, root package changes, or backend validation
jobs require a separate, dedicated authorization PR before implementation.

## 7. Final GO/NO-GO

**GO** — backend import accepted as present in monorepo.

**GO** to Backend CI / API Validation Planning Gate only.

**NO-GO** to backend CI implementation in this PR.

**NO-GO** to root package, OpenAPI, generated type, runtime, or deployment
changes in this PR.
