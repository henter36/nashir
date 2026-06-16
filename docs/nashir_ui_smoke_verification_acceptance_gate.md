# Nashir UI Smoke Verification Acceptance Gate

## Gate type
UI smoke verification acceptance gate — documentation only. No runtime code, no tests, no dependency changes in this PR.

## Step
Step 20 of the Nashir UI refactor execution sequence.

## Status
Accepted.

---

## 1. Purpose

Record acceptance of the completed zero-dependency static UI screen inventory validator implemented in PR #209.

This is an acceptance gate only. It does not implement new checks, does not authorize browser automation, does not authorize test runner adoption, does not authorize backend integration, and does not authorize route migration.

---

## 2. Inputs

| Reference | Description |
|-----------|-------------|
| PR #204 | UI Refactor Completion Acceptance Gate |
| PR #205 | UI Prototype Stabilization Planning Gate |
| PR #206 | UI Smoke Verification Planning Gate |
| PR #207 | UI Navigation Inventory Gate |
| PR #208 | UI Smoke Verification Implementation Authorization Gate |
| PR #209 | UI Smoke Verification Implementation Execution Gate |
| [docs/nashir_ui_smoke_verification_execution_gate.md](nashir_ui_smoke_verification_execution_gate.md) | Execution gate record — Step 19 |
| `scripts/validate-ui-screen-inventory.mjs` | Implemented validator script |
| `package.json` `validate:ui-screens` script | Zero-dependency npm script entry |

---

## 3. Accepted implementation

The following are formally accepted:

- **`scripts/validate-ui-screen-inventory.mjs`** — static Node.js ESM inventory validator using only built-in modules (`fs`, `path`, `url`)
- **`package.json` script: `validate:ui-screens`** — zero-dependency entry; no lockfile changes
- **`docs/nashir_ui_smoke_verification_execution_gate.md`** — execution gate record documenting implementation, results, and limitations
- **Zero-dependency static validation approach** — no test runner, no browser automation, no new packages
- **No source or runtime UI changes** — `src/App.jsx` and all page components are unchanged
- **No dependency or lockfile changes** — `package.json` `dependencies` and `devDependencies` sections are unchanged
- **No test runner or browser automation added**

---

## 4. Accepted validator coverage

The following checks are accepted as the static smoke verification baseline:

- Confirms all 23 accepted screen IDs are present in the `App.jsx` `screens[]` registry
- Detects missing, duplicate, or unexpected screen IDs in the registry
- Confirms all 23 expected screen IDs have explicit `pageContent` branches (`activeScreen === "..."`)
- Confirms all lazy import file paths (`lazy(() => import("..."))`) exist on disk
- Confirms the `PlaceholderPage` fallback is guarded by `!pageContent` — no named screen ID falls through
- Supports both single and double quote styles for registry IDs, `activeScreen` branches, and lazy import paths
- Resolves lazy import paths relative to `src/App.jsx` via `dirname(APP_JSX)` — handles any relative prefix correctly

---

## 5. Explicit limitations

The following limitations are accepted as-is. They do not block this acceptance gate:

- **Static validation only** — reads `App.jsx` as text; does not execute JavaScript
- **Does not mount React components** — no DOM, no virtual DOM
- **Does not prove browser rendering** — a page that imports correctly may still crash at runtime
- **Does not validate actual user navigation at runtime** — `navigateToScreen` transitions are not exercised
- **Does not validate event handlers** — click, input, and form events are not covered
- **Does not catch async failures or Promise rejections** — `useEffect`, data fetching, and async errors are outside scope
- **Does not replace manual QA** — human review is still needed for visual/UX correctness
- **Depends on current `App.jsx` structure** — the `screens[]` + `pageContent` if-branch pattern must remain stable for the validator to produce meaningful results
- **Future route migration requires revisiting the validator** — switching to React Router or another model would break the current pattern-matching approach

---

## 6. Boundary review

| Boundary | Status |
|----------|--------|
| No `src/` modifications | Accepted |
| No `App.jsx` modification | Accepted |
| No page component modification | Accepted |
| No dependencies added | Accepted |
| No lockfile changes | Accepted |
| No backend/API/OpenAPI/generated changes | Accepted |
| No routing migration | Accepted |
| No redesign | Accepted |
| No browser automation | Accepted |

---

## 7. Verification evidence

Commands run in PR #209 on branch `feat/ui-smoke-verification-static-inventory`:

```bash
npm run validate:ui-screens
npm run lint
npm run build
git diff --check
```

Results as documented in `docs/nashir_ui_smoke_verification_execution_gate.md` §7:

| Check | Result |
|-------|--------|
| `validate:ui-screens` — screens[] registry | ✓ PASS — 23/23 IDs; no duplicates; no unexpected |
| `validate:ui-screens` — pageContent branches | ✓ PASS — 23/23 IDs have explicit branches |
| `validate:ui-screens` — lazy import file paths | ✓ PASS — 23/23 imports exist on disk |
| `validate:ui-screens` — PlaceholderPage fallback | ✓ PASS — guarded; no named ID falls through |
| `npm run lint` | ✓ PASS — 0 errors, 0 warnings |
| `npm run build` | ✓ PASS — 0 errors |
| `git diff --check` | ✓ PASS — no whitespace issues |

---

## 8. Acceptance decision

> **Decision: ACCEPTED — UI Static Smoke Verification Baseline.**

The static inventory validator is now accepted as the baseline smoke verification mechanism for the Nashir UI prototype. Running `npm run validate:ui-screens` is the canonical command for confirming structural consistency of the 23-screen registry before any future UI or structural change.

---

## 9. Remaining gaps

The following gaps are documented and accepted as not addressed by this baseline:

- **No browser render smoke test.** Pages are not mounted or rendered in any environment.
- **No test runner.** No Vitest, Jest, or equivalent exists in `package.json`.
- **No runtime navigation test.** `navigateToScreen` transitions are not exercised.
- **No automated React mount validation.** Component lifecycle and hooks are not tested.
- **No backend/API readiness.** The acceptance of this baseline does not imply the prototype is ready for backend/API integration planning.

---

## 10. Next decision options

**A. GO to UI Prototype Readiness Review Gate**
Use if the accepted static smoke baseline is sufficient foundation for a readiness review before backend/API integration planning begins.

**B. GO to UI Manual Smoke Checklist Gate**
Use if a human-reviewed checklist should supplement the static validator to cover runtime navigation, visual correctness, and Arabic RTL layout verification.

**C. GO to UI Browser Smoke Test Dependency Authorization Gate**
Use if browser-based or runtime React mount smoke tests are desired and require adding new tooling to `package.json`.

**D. NO-GO**
Use if acceptance evidence is incomplete or implementation drift is found since PR #209. Requires a correction gate before this acceptance is finalized.

---

## 11. Recommended decision

The static validator baseline is accepted and provides structural confidence that the 23-screen registry is intact. The most valuable next step is to formally evaluate whether the prototype is ready for backend/API integration planning, rather than continuing to add layers of smoke infrastructure.

> **Decision: GO to UI Prototype Readiness Review Gate.**
>
> Reason: The static validator baseline is accepted. A readiness review gate will determine whether the current prototype state is sufficient to begin backend/API integration planning or whether additional stabilization is needed first.

---

## 12. Verification

```bash
git diff --check
git diff --name-only main...HEAD
```

Expected result: only `docs/nashir_ui_smoke_verification_acceptance_gate.md` changed.

---

## Governance classification

Documentation-only acceptance gate. No runtime code, no backend, no API, no SQL, no auth/RBAC, no migration, no generated client, no dependency change, no test implementation, no production boundary change.
