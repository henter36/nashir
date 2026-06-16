# Nashir UI Smoke Verification Planning Gate

## Gate type
UI smoke verification planning gate — documentation only. No runtime code, no tests, no dependency changes in this PR.

## Step
Step 16 of the Nashir UI refactor execution sequence.

## Status
Planning. Pending reviewer decision before any smoke verification implementation begins.

---

## 1. Purpose

Define the planning boundary for future UI smoke verification after the accepted UI refactor completion (PR #204) and prototype stabilization planning (PR #205).

This gate identifies what smoke checks should cover in a future implementation gate and proposes candidate implementation approaches. It does **not** implement tests, add dependencies, add a test runner, modify runtime code, or authorize any backend/API/generated integration. Those require separate gates.

---

## 2. Inputs

| Reference | Description |
|-----------|-------------|
| PR #204 | docs: accept UI refactor completion |
| PR #205 | docs: plan UI prototype stabilization |
| [docs/nashir_ui_refactor_completion_acceptance_gate.md](nashir_ui_refactor_completion_acceptance_gate.md) | Acceptance gate — Step 14 |
| [docs/nashir_ui_prototype_stabilization_planning_gate.md](nashir_ui_prototype_stabilization_planning_gate.md) | Stabilization planning gate — Step 15 |
| [docs/INDEX.md](INDEX.md) | Active gates registry |
| Current `App.jsx` screen inventory | 23 screen IDs registered at acceptance time |

---

## 3. Current accepted baseline

- **UI refactor completion sequence is accepted.** All 8 page splits, ErrorBoundary implementation, active gates index, and audit are merged and closed.
- **Prototype stabilization planning is accepted.** The stabilization planning gate (PR #205) identified smoke verification as the highest-value first stabilization step.
- **UI Smoke Verification Planning is the recommended next gate** per PR #205 decision.
- **UI remains prototype-only.** No production readiness or real-user traffic handling is implied.
- **No backend/API/OpenAPI/generated integration is authorized.** Smoke verification must run against mock/prototype state only.

---

## 4. Smoke verification problem statement

The following risks motivate smoke verification before any further integration planning:

- **Page render regressions may go unnoticed.** A broken import or bad JSX change in any page component would only surface through manual navigation.
- **Lazy imports may fail silently.** React's `lazy()` defers import errors until the user navigates to that screen; a `Suspense` fallback and ErrorBoundary mask the failure from casual observation.
- **`App.jsx` screen registry may drift.** New screen IDs can be added to `screens` without a corresponding `if (activeScreen === ...)` branch — or vice versa — and no check currently catches the mismatch.
- **ErrorBoundary catches render crashes but does not prove pages are healthy.** A page that always throws will always show the fallback, with no automated signal that something is wrong.
- **No automated confidence exists for navigating all 23 screen IDs.** Without smoke coverage, prototype readiness cannot be assessed reliably to confirm that the full screen inventory renders and navigation works before backend integration planning begins.

---

## 5. Proposed future smoke verification scope

The following checks are proposed for a future smoke verification implementation gate. **Nothing in this section is implemented or authorized by this PR.**

### A. App shell boot check

- App renders without crashing on initial load.
- `AppShell` (sidebar + navigation) is visible.
- Default screen is `dashboard`.

### B. Screen registry check

- All 23 screen IDs registered in `App.jsx` `screens` array are known and covered by a `pageContent` assignment.
- No deprecated screen ID is reintroduced accidentally after removal, unless explicitly accepted by a gate.

### C. Lazy page import check

- Each `lazy(() => import(...))` page module resolves without error.
- A missing or mis-pathed import causes the smoke check to fail rather than silently falling through to a Suspense or ErrorBoundary fallback.

### D. Navigation smoke check

- `navigateToScreen` can transition to each of the 23 registered screen IDs.
- The page render slot (`{pageContent}`) updates after navigation.
- No screen transition produces an unhandled error outside `ErrorBoundary`.

### E. ErrorBoundary smoke check

- A forced synchronous render throw in a page is caught by `ErrorBoundary`.
- The Arabic fallback UI renders.
- The reset button calls `navigateToScreen("dashboard")` and clears the boundary state.
- `AppShell` remains visible throughout.

### F. Prototype-only boundary check

- All smoke checks run without requiring a backend, API endpoint, database, or real OAuth token.
- No real-data dependency is assumed.

---

## 6. Candidate implementation approaches

The following are candidate options for a future smoke verification implementation gate. **No approach is selected or authorized by this PR.**

### Option A — Lightweight Vitest smoke checks

- Uses a test runner only if one is already present in the project without adding dependencies.
- If no test runner exists, a dependency gate must be opened first to authorize the addition.
- Could cover import resolution, render-without-crash checks (with `jsdom` or similar), and basic state transitions.

### Option B — Build-time static import inventory script

- A small Node script (no new npm dependency if written in plain JS/Node built-ins) validates that every screen ID in the `screens` array has a corresponding `lazy` import and `pageContent` branch in `App.jsx`.
- No browser rendering; fast and low-cost.
- Lower confidence than runtime checks but catches registry/import mismatches.

### Option C — Manual QA checklist gate

- A reviewed, structured checklist of screens and navigation transitions executed manually before each significant change.
- No automated tests; no dependency additions.
- Lowest engineering cost; lowest ongoing confidence.

---

## 7. Recommended future implementation approach

If an existing test runner is already available without adding dependencies, **Option A** is preferred — it provides the highest confidence with no lockfile change.

If no test runner is present, begin with **Option B** (static inventory script) or the **Option C** manual checklist while a separate dependency policy decision is made. The dependency gate must be approved before any test runner is added to `package.json`.

**No approach is authorized by this planning gate.** A separate implementation gate must specify exact files, commands, and dependency decisions before any work begins.

---

## 8. Explicit non-goals

| Item | Reason |
|------|--------|
| Test implementation in this PR | Planning only; execution gate required |
| Dependency additions | Lockfile frozen; requires separate dependency gate |
| Playwright, Cypress, or browser automation | Not authorized; requires explicit dependency + scope gate |
| Backend/API/OpenAPI/generated integration | Out of scope for UI smoke verification |
| Real data wiring | Prototype-only; no real data sources |
| Routing migration | Not authorized; page-switch model is stable |
| Page redesign or component refactors | Design freeze in effect |
| Sonar warning cleanup implementation | Separate gate required |

---

## 9. Risk review

| Risk | Impact | Proposed future check |
|------|--------|-----------------------|
| Broken lazy import | High — affected screen shows Suspense/ErrorBoundary fallback with no signal | Lazy page import check (§5.C) |
| Missing screen mapping in `App.jsx` | Medium — navigation reaches a screen with no `pageContent` assignment; falls through to placeholder | Screen registry check (§5.B) |
| Broken navigation transition | High — user cannot reach a screen; regressions are invisible without automation | Navigation smoke check (§5.D) |
| Page white-screen after future change | High — ErrorBoundary catches it but gives no signal that the page is broken | ErrorBoundary smoke check (§5.E) |
| ErrorBoundary masking real failures | Medium — all page crashes look identical in the fallback; root cause is hidden | ErrorBoundary + import checks (§5.C, §5.E) |
| Backend/API scope creep | High — smoke checks must not require real endpoints; prototype boundary erodes | Prototype-only boundary check (§5.F) |
| New dependency drift | Medium — a test runner or utility added without a gate violates the dependency freeze | Dependency gate required before Option A |

---

## 10. Decision options

**A. GO to UI Smoke Verification Implementation Authorization Gate**
Use if this planning gate is accepted and a future implementation gate should define exact commands, files, and dependency decisions before work begins.

**B. GO to UI Navigation Inventory Gate**
Use if the 23-screen registry must be formally audited and locked before any smoke implementation depends on it.

**C. GO to UI Prototype Readiness Review Gate**
Use if smoke implementation is deferred and prototype readiness should be evaluated directly.

**D. NO-GO**
Use if unexpected runtime, API, dependency, or routing drift is found since PR #205 acceptance. Requires a correction gate before smoke planning continues.

---

## 11. Recommended decision

Smoke verification as planned above is sound, but its value depends on a stable, reviewable source of truth for the screen inventory. Without a locked list of the 23 screen IDs, a future smoke implementation gate cannot specify its exact coverage targets.

> **Decision: GO to UI Navigation Inventory Gate before implementing smoke verification.**
>
> Reason: The 23-screen inventory must be formally audited and locked as a reviewable artifact before future smoke checks depend on it. Once the inventory gate is closed, a smoke implementation gate can reference it directly.

---

## 12. Verification

```bash
git diff --check
git diff --name-only main...HEAD
```

Expected result: only `docs/nashir_ui_smoke_verification_planning_gate.md` changed.

---

## Governance classification

Documentation-only planning gate. No runtime code, no backend, no API, no SQL, no auth/RBAC, no migration, no generated client, no dependency change, no test implementation, no production boundary change.
