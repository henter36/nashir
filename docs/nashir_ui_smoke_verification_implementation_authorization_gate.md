# Nashir UI Smoke Verification Implementation Authorization Gate

## Gate type
UI smoke verification implementation authorization gate — documentation only. No runtime code, no tests, no dependency changes in this PR.

## Step
Step 18 of the Nashir UI refactor execution sequence.

## Status
Authorization defined. Pending reviewer decision before any implementation begins.

---

## 1. Purpose

Authorize, restrict, or block a future implementation slice for UI smoke verification after the accepted UI smoke planning gate (PR #206) and navigation inventory gate (PR #207).

This PR is **documentation only**. It does not implement tests. It does not add dependencies. It defines the next implementation boundary — what is allowed, what is blocked, and what tooling may be used — before any smoke implementation work begins.

---

## 2. Inputs

| Reference | Description |
|-----------|-------------|
| PR #204 | docs: accept UI refactor completion |
| PR #205 | docs: plan UI prototype stabilization |
| PR #206 | docs: plan UI smoke verification |
| PR #207 | docs: inventory UI navigation screens |
| [docs/nashir_ui_refactor_completion_acceptance_gate.md](nashir_ui_refactor_completion_acceptance_gate.md) | Acceptance gate — Step 14 |
| [docs/nashir_ui_prototype_stabilization_planning_gate.md](nashir_ui_prototype_stabilization_planning_gate.md) | Stabilization planning gate — Step 15 |
| [docs/nashir_ui_smoke_verification_planning_gate.md](nashir_ui_smoke_verification_planning_gate.md) | Smoke planning gate — Step 16 |
| [docs/nashir_ui_navigation_inventory_gate.md](nashir_ui_navigation_inventory_gate.md) | Navigation inventory gate — Step 17 |
| `package.json` | Inspected read-only; not modified |
| `src/App.jsx` | Inspected read-only; not modified |

---

## 3. Current accepted baseline

- **UI refactor sequence accepted.** All 8 page splits, ErrorBoundary, and gate documentation are merged and closed (PR #204).
- **Prototype stabilization planning accepted.** Smoke verification identified as highest-value first stabilization step (PR #205).
- **Smoke verification planning accepted.** Six check areas defined; three candidate implementation approaches documented (PR #206).
- **Navigation inventory accepted.** 23 screen IDs confirmed and locked as source inventory; 5 legacy-naming observations accepted as non-blocking (PR #207).
- **23 screen IDs are the current source inventory for smoke verification.** Source of truth: `docs/nashir_ui_navigation_inventory_gate.md` §4.
- **UI remains prototype-only.** No production readiness or real-user traffic handling is implied.
- **No backend/API/OpenAPI/generated scope is authorized.**

---

## 4. Authorization question

**Should Nashir UI proceed to a minimal smoke verification implementation slice?**

> **Authorization: Authorized with constraints.**

A minimal implementation slice is authorized subject to the tooling constraints in §6. The project has no existing test runner; therefore, **Option A (test runner smoke checks) is not available** without a separate dependency authorization gate. Implementation must use **Option B (static inventory verification script)** using Node.js built-in modules only, with no new `package.json` dependencies.

---

## 5. Existing test/tooling inspection

Source: `package.json` inspected read-only. Results as of audit time:

| Item | Evidence | Implication |
|------|---------|-------------|
| Test runner | **Not present.** No Vitest, Jest, Mocha, or equivalent in `dependencies` or `devDependencies` | Option A (test runner smoke checks) requires a dependency gate before it can be used |
| Build script | `"build": "vite build"` — Vite 8 | Available for verification; confirms import resolution at bundle time |
| Lint script | `"lint": "eslint ."` — ESLint 10 | Available for static analysis; does not validate runtime navigation |
| Preview script | `"preview": "vite preview"` | Available for manual visual verification |
| TypeScript | `typescript ^5.9.3` in `devDependencies` | Present as a type-gen dependency (`openapi-typescript`); not a project-wide TS setup; does not imply a test runner |
| Browser automation | **Not present.** No Playwright, Cypress, Puppeteer, or WebDriver | Browser-based smoke checks require a dependency gate |
| Node.js ESM | `"type": "module"` in `package.json` | Scripts written as `.mjs` or with `"type": "module"` can use ESM `import`/`import()` without new dependencies |
| OpenAPI generator | `openapi-typescript ^7.13.0` | Unrelated to smoke verification; not usable for screen inventory checks |

**Summary:** No test runner or browser automation exists. A static Node.js script using only built-in modules (`fs`, `path`, `url`) is the only available implementation path that requires no dependency additions.

---

## 6. Authorized implementation boundary

### Authorization status

**Authorized with constraints** — see tooling constraints below.

### Authorized future slice

**UI Smoke Verification Implementation Execution Gate**

A future execution gate may authorize work on one minimal implementation slice with the following goals:

- Confirm all 23 screen IDs from `docs/nashir_ui_navigation_inventory_gate.md` §4 are present in the `App.jsx` `screens` array.
- Confirm each screen ID has a corresponding `pageContent` branch in `App.jsx` (i.e., no named screen falls through to `PlaceholderPage`).
- Confirm each `lazy(() => import(...))` page module path exists as a file in `src/pages/`.
- Report any mismatch between the 23-screen inventory and the current `App.jsx` state.
- Optionally confirm no screen ID present in the inventory has been removed or renamed.

**Explicitly excluded from the authorized slice:**
- Browser rendering or headless DOM checks
- `navigateToScreen` runtime transition testing (requires a DOM/test runner)
- ErrorBoundary activation testing (requires a DOM/test runner)
- Any `src/App.jsx` modification
- Any page component modification
- Any backend/API/generated file access
- Any dependency addition

### Tooling constraint

> The future implementation must use **Option B only** (static Node.js script). No new `package.json` dependencies may be added. If the implementation team determines that meaningful smoke verification requires a test runner or browser automation, a separate **UI Smoke Verification Dependency Authorization Gate** must be opened before any dependency is added.

---

## 7. Candidate implementation path

### Option A — Existing test runner smoke checks

**Not available.** No test runner is present in `package.json`. This option requires opening a separate **UI Smoke Verification Dependency Authorization Gate** before a test runner can be added.

### Option B — Static inventory verification script *(authorized for the next execution gate)*

A plain Node.js ESM script that reads `src/App.jsx` and `docs/nashir_ui_navigation_inventory_gate.md` (or a derived JSON/JS source list) using only Node.js built-in modules.

Potential future allowed file:
- `scripts/validate-ui-screen-inventory.mjs`

The script may optionally add a `package.json` script entry (e.g., `"smoke:inventory": "node scripts/validate-ui-screen-inventory.mjs"`) only if the entry requires **no new dependencies**. No lockfile changes are allowed.

### Option C — Documentation-only manual checklist *(fallback if B is deferred)*

A structured manual QA checklist documenting each screen ID and the expected behavior when navigated.

Potential future allowed file:
- `docs/nashir_ui_smoke_verification_manual_checklist.md`

No automated verification; lowest confidence. Use only if Option B is deferred.

---

## 8. Proposed future allowed files

The following defines the precise allowed file classes for the future execution gate. **No files are created or modified in this PR.**

**Allowed in the future execution gate (if Option B is selected):**

| File | Condition |
|------|-----------|
| `scripts/validate-ui-screen-inventory.mjs` | Primary deliverable; no new dependencies |
| `package.json` script entry only | Only if adding a `scripts` key that requires zero new `dependencies` or `devDependencies` |
| `docs/nashir_ui_smoke_verification_execution_gate.md` | Gate record for the execution gate |

**Allowed in the future execution gate (if Option C is selected):**

| File | Condition |
|------|-----------|
| `docs/nashir_ui_smoke_verification_manual_checklist.md` | Manual checklist only |
| `docs/nashir_ui_smoke_verification_execution_gate.md` | Gate record for the execution gate |

**Blocked in any future execution gate unless separately authorized:**

- `src/App.jsx` — no modifications; read-only inspection is allowed
- Any page component or sub-module
- `package.json` dependency or devDependency additions
- `package-lock.json` or lockfile changes caused by new packages
- Backend/API/OpenAPI/generated files
- Routing migration or navigation restructuring
- Page redesign or component refactors
- Sonar warning cleanup (separate gate)

---

## 9. Future verification commands

Commands available based on current `package.json` (no new scripts authorized yet):

**For Option B (static script path):**

```bash
node scripts/validate-ui-screen-inventory.mjs
npm run lint
npm run build
git diff --check
```

If a `smoke:inventory` script is added to `package.json` in the execution gate (zero-dependency addition):

```bash
npm run smoke:inventory
npm run lint
npm run build
git diff --check
```

**For Option C (manual checklist):**

```bash
git diff --check
git diff --name-only main...HEAD
```

**Currently available scripts confirmed in `package.json`:**

| Script | Command |
|--------|---------|
| `dev` | `vite` |
| `build` | `vite build` |
| `lint` | `eslint .` |
| `preview` | `vite preview` |
| `generate:creator-studio-types` | `openapi-typescript ...` |

---

## 10. Risks

| Risk | Impact | Authorization control |
|------|--------|-----------------------|
| Dependency creep | High — adding a test runner without a gate violates the dependency freeze and lockfile constraint | Execution gate must include hard block on dependency additions; dependency gate required first |
| `App.jsx` behavior drift | Medium — the static script reads `App.jsx` but must not modify it | Execution gate must include `App.jsx` as a hard-blocked file for modification |
| Smoke check becoming redesign/refactor work | Medium — script scope may expand to cover page internals | Execution gate allowed-files list strictly limits scope to inventory validation |
| Backend/API scope creep | High — smoke checks must not call APIs or require real data | Prototype-only boundary check must be included in execution gate goals |
| False confidence from static-only checks | Medium — static script cannot verify runtime rendering or navigation; gives structural confidence only | Document clearly that static script confirms inventory consistency, not runtime behavior |
| Outdated screen inventory | Low — if `App.jsx` changes after this gate, the static script will catch the mismatch | Script should compare live `App.jsx` state against the locked 23-screen list |
| Lazy import failure not caught by static-only checks | Medium — static script can confirm file path existence but not that the module exports a valid React component | Document as known limit in execution gate; defer runtime import resolution to a future dependency-authorized gate |

---

## 11. Decision options

**A. GO to UI Smoke Verification Implementation Execution Gate**
Use if a minimal implementation slice can proceed using Option B (static Node.js script, no new dependencies) within the allowed-file constraints in §8.

**B. GO to UI Smoke Verification Dependency Authorization Gate**
Use if meaningful runtime smoke verification (render checks, navigation transitions, ErrorBoundary activation) requires a test runner dependency. Opens the dependency gate before any test runner is added to `package.json`.

**C. GO to UI Smoke Verification Manual Checklist Gate**
Use if automated implementation should be deferred and a structured manual checklist is the preferred alternative.

**D. NO-GO**
Use if unexpected runtime, API, dependency, or routing drift is found since PR #207. Requires a correction gate before this authorization gate can be re-evaluated.

---

## 12. Recommended decision

`package.json` inspection confirms no test runner or browser automation is present. Option A is therefore unavailable without a dependency gate. Option B (static Node.js script using built-in modules only) can deliver structural confidence — confirming screen registry consistency, file path existence for lazy imports, and `pageContent` branch coverage — without adding any dependency.

This level of confidence is sufficient to verify the 23-screen inventory is intact and that no screen has been silently removed or broken at the structural level. Runtime rendering and navigation transition checks are explicitly deferred to a future dependency-authorized gate.

> **Decision: GO to UI Smoke Verification Implementation Execution Gate.**
>
> Implementation must use Option B only. No new dependencies. Allowed files are strictly limited to `scripts/validate-ui-screen-inventory.mjs`, an optional zero-dependency `package.json` script entry, and the execution gate document.

---

## 13. Verification

```bash
git diff --check
git diff --name-only main...HEAD
```

Expected result: only `docs/nashir_ui_smoke_verification_implementation_authorization_gate.md` changed.

---

## Governance classification

Documentation-only authorization gate. No runtime code, no backend, no API, no SQL, no auth/RBAC, no migration, no generated client, no dependency change, no test implementation, no production boundary change. `package.json` and `src/App.jsx` were inspected read-only; neither was modified.
