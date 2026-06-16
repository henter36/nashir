# Nashir UI Prototype Stabilization Planning Gate

## Gate type
UI prototype stabilization planning gate — documentation only. No runtime code in this PR.

## Step
Step 15 of the Nashir UI refactor execution sequence.

## Status
Planning. Pending reviewer decision before any stabilization implementation begins.

---

## 1. Purpose

Define the stabilization planning boundary for the Nashir UI prototype after the accepted UI refactor sequence (PRs #191–#204).

This gate identifies stabilization risks and proposes candidate future gates. It does **not** authorize any implementation, dependency change, backend integration, API wiring, routing migration, redesign, or test infrastructure work. Those require separate planning and execution gates.

---

## 2. Inputs

| Reference | Description |
|-----------|-------------|
| PR #204 | docs: accept UI refactor completion |
| [docs/nashir_ui_refactor_completion_acceptance_gate.md](nashir_ui_refactor_completion_acceptance_gate.md) | Acceptance gate — Step 14 |
| [docs/nashir_ui_refactor_completion_audit_gate.md](nashir_ui_refactor_completion_audit_gate.md) | Audit gate — Step 13 |
| [docs/INDEX.md](INDEX.md) | Active gates registry |
| Current UI prototype page set | 23 screen IDs registered in `App.jsx` at acceptance time |

---

## 3. Current accepted baseline

The following are confirmed as of PR #204 acceptance:

- **UI refactor sequence accepted.** All 8 page splits complete; root files are thin orchestrators with co-located sub-modules.
- **ErrorBoundary route safety accepted.** `src/components/ErrorBoundary.jsx` wraps the page-render slot in `App.jsx`; `AppShell` is outside the boundary; production logging is gated.
- **`docs/INDEX.md` accepted** as the active gates registry for the UI prototype.
- **UI remains prototype-only.** No production readiness, scalability, or real-user traffic handling is implied.
- **Backend/API/OpenAPI/generated integration remains out of scope** until a future gate explicitly authorizes it.

---

## 4. Stabilization problem statement

The following risks exist that stabilization should address before any next implementation phase:

- **Sonar props-validation warnings** may remain across JSX components in the split pages. These are low-severity for a prototype but may accumulate if new components are added without a plan.
- **Test coverage may remain 0%** across all UI refactor PRs. No automated check currently validates that pages render or that navigation between screens works.
- **Some pages may still contain internal duplication** below Sonar's detection threshold that was not addressed during the split sequence.
- **No automated smoke coverage** validates basic page rendering or screen navigation. A regression in `App.jsx` or a broken lazy import would not be caught until manual testing.
- **No formal "prototype ready for backend integration planning" decision exists.** The acceptance gate closes the refactor sequence but does not evaluate readiness for the next integration phase.
- **ErrorBoundary handles synchronous render crashes** but does not catch async errors, unhandled Promise rejections, or event-handler throws. Pages with async data flows remain partially unprotected.

---

## 5. Candidate stabilization scopes

The following are candidate future gates only. None are authorized by this planning gate.

### A. UI Smoke Verification Planning Gate

Plan minimal smoke checks for:
- Page component rendering (confirm each lazy import resolves without error)
- Screen navigation (confirm `navigateToScreen` transitions work for all 23 screen IDs)
- ErrorBoundary activation (confirm fallback UI renders on forced throw)

No implementation in this PR. A separate execution gate is required before any smoke infrastructure is added.

### B. UI Sonar Warning Cleanup Planning Gate

Plan a decision on Sonar props-validation warnings:
- Accept and suppress with documented rationale
- Fix by adding inline JSDoc or minimal runtime `prop-types` (requires dependency gate first)
- Fix by introducing TypeScript (requires a separate, larger scope gate)

No dependency addition or TypeScript introduction in this PR or any gate derived from option B without explicit authorization.

### C. UI Prototype Readiness Review Gate

Review whether the current prototype is ready for backend/API integration planning. Criteria to evaluate:
- All 23 screens render without white-screen errors
- Navigation between all screens functions correctly
- No unauthorized runtime changes have been introduced since acceptance
- Gate documentation is up to date and linked from `docs/INDEX.md`

### D. UI Navigation Inventory Gate

Confirm the current active page inventory:
- All 23 screen IDs registered in `App.jsx`
- Labels, icons, and enabled flags for each screen
- Identify any screens that are placeholder-only vs. fully implemented
- Identify any deprecated or unused screen IDs

---

## 6. Explicit non-goals

The following are explicitly out of scope for this planning gate and any stabilization gate derived from it unless separately authorized:

| Item | Reason |
|------|--------|
| Backend integration | Not authorized until readiness review approves |
| API wiring | Not authorized until backend integration gate opens |
| OpenAPI/generated type work | Backend-side dependency; out of UI scope |
| Database or runtime changes | No backend work in UI gates |
| Routing migration | Not authorized; page-switch model is stable |
| New package dependencies | Lockfile frozen; requires separate dependency gate |
| Page redesign | Design freeze in effect |
| New feature modules | Outside refactor/stabilization scope |
| Test implementation in this PR | Planning only; execution gate required |

---

## 7. Recommended stabilization path

The recommended path is controlled and sequential. Each step requires its own gate before work begins:

1. **UI Smoke Verification Planning Gate** — define smoke check scope and tooling constraints before any infrastructure is added.
2. **UI Prototype Readiness Review Gate** — evaluate whether prototype is ready for the next phase after smoke verification exists.
3. **Backend/API Integration Planning Gate** — only after readiness review approves the prototype as integration-ready.

> This is a **recommendation, not authorization.** Each gate in this path requires a separate planning PR and reviewer approval before implementation begins.

---

## 8. Risk review

| Risk | Impact | Proposed gate |
|------|--------|---------------|
| Page render regression after future `App.jsx` changes | High — white-screen failure for affected screen | UI Smoke Verification Planning Gate |
| Navigation regression (broken `navigateToScreen` call) | High — user cannot move between screens | UI Smoke Verification Planning Gate |
| Silent broken prototype pages (lazy import fails quietly) | Medium — page appears broken with no recovery path beyond ErrorBoundary | UI Smoke Verification Planning Gate |
| Sonar warnings accumulating as new components are added | Low — does not break behavior; may trigger quality gate failures | UI Sonar Warning Cleanup Planning Gate |
| Premature backend integration before prototype is stable | High — runtime/API errors compound unstable prototype state | UI Prototype Readiness Review Gate |
| Scope creep after refactor acceptance | Medium — unauthorized changes outside gate scope erode boundary discipline | All future gates; enforced by hard-block lists |

---

## 9. Decision options

**A. GO to UI Smoke Verification Planning Gate**
Use if stabilization should begin with defining smoke check scope and tooling constraints. Recommended path.

**B. GO to UI Prototype Readiness Review Gate**
Use if no smoke infrastructure is deemed necessary and the prototype can be evaluated for readiness directly.

**C. NO-GO**
Use if unexpected runtime, API, dependency, or routing drift is found since PR #204 acceptance. Requires a correction gate before stabilization planning continues.

---

## 10. Recommended decision

No blocking gaps have been identified since the acceptance gate (PR #204). The prototype baseline is stable. The highest-impact risk is the absence of any automated check on page rendering and navigation, making smoke verification the most valuable first stabilization step.

> **Decision: GO to UI Smoke Verification Planning Gate.**

---

## 11. Verification

```bash
git diff --check
git diff --name-only main...HEAD
```

Expected result: only `docs/nashir_ui_prototype_stabilization_planning_gate.md` changed.

---

## Governance classification

Documentation-only planning gate. No runtime code, no backend, no API, no SQL, no auth/RBAC, no migration, no generated client, no dependency change, no production boundary change.
