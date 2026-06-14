# Workflow Runs Page Split — Execution Gate

**Step:** 3 of 13 (UI Refactor Report Execution Sequence)
**Branch:** `refactor/split-workflow-runs-page`
**Date:** 2026-06-14

---

## 1. Inputs

| Input | Value |
|---|---|
| Source file | `src/pages/WorkflowRunsPage.jsx` (4,971 lines before split) |
| Authorization | `docs/nashir_ui_refactor_report_execution_sequence_review_gate.md` — Step 3 scope confirmed |
| Hard-limit list | App.jsx, DashboardPage.jsx, DashboardPage/*, ProductCatalogPage.jsx, productCatalogApi.js, productCatalogStore.js, backend, OpenAPI, package.json, routing, Zustand, TypeScript, i18n, tests/tooling |

---

## 2. Changed Files

| File | Change |
|---|---|
| `src/pages/WorkflowRunsPage.jsx` | Rewritten as slim orchestrator (~290 lines) |
| `src/pages/WorkflowRunsPage/constants.js` | New — all module-level data constants (~490 lines) |
| `src/pages/WorkflowRunsPage/helpers.js` | New — all pure helper functions (~185 lines) |
| `src/pages/WorkflowRunsPage/styles.js` | New — exported CSS string (~840 lines) |
| `src/pages/WorkflowRunsPage/components.jsx` | New — Info, Status, SelectField, Toggle, ContractKpi |
| `src/pages/WorkflowRunsPage/contractHelpers.js` | New — getContractSchema, getAllowedConsumers, isSensitiveOutput, getRetentionPolicy, getContractRiskFlags |
| `src/pages/WorkflowRunsPage/ModelRoutingSummary.jsx` | New — model route badge component |
| `src/pages/WorkflowRunsPage/StepReadinessPanel.jsx` | New — step readiness status panel |
| `src/pages/WorkflowRunsPage/WorkflowTriggerPanel.jsx` | New — trigger configuration panel |
| `src/pages/WorkflowRunsPage/StepEditor.jsx` | New — full step editing form (has own useState for fieldToAdd) |
| `src/pages/WorkflowRunsPage/PipelineReflectionCard.jsx` | New — always-visible pipeline reflection section |
| `src/pages/WorkflowRunsPage/BuilderTab.jsx` | New — builder tab content |
| `src/pages/WorkflowRunsPage/MapTab.jsx` | New — 8-lane flow map tab content |
| `src/pages/WorkflowRunsPage/ContractsTab.jsx` | New — output contracts tab content |
| `src/pages/WorkflowRunsPage/RunsTab.jsx` | New — runs monitoring tab content |
| `src/pages/WorkflowRunsPage/TestTab.jsx` | New — test/dry-run tab content |
| `docs/nashir_ui_workflow_runs_page_split_execution_gate.md` | This file |

**Total:** 1 rewrite + 16 new files + 1 gate document

---

## 3. Scope Confirmation

### What changed
- `WorkflowRunsPage.jsx` monolith (4,971 lines) split into 16 co-located files
- All 13 React state declarations, `useEffect` (6 event listeners), and `useMemo` remain in the orchestrator
- All event handlers remain in the orchestrator: selectTemplate, updateStep, updateWorkflowTrigger, updateStepInputRefs, addStep, removeStep, runLocalTest, addRunAction, retrySelectedRun, cancelSelectedRun, sendSelectedRunToReview, copySelectedRunId
- All props signatures preserved; App.jsx import unchanged (`"./pages/WorkflowRunsPage.jsx"` with explicit `.jsx` extension — coexists safely with the new directory)
- All Arabic RTL text strings preserved exactly
- No routing logic, no Zustand store changes, no utility file changes
- CSS relocated into `src/pages/WorkflowRunsPage/styles.js`; no CSS architecture changes

### What did NOT change
- `App.jsx` — untouched
- `DashboardPage.jsx` and `DashboardPage/*` — untouched
- `ProductCatalogPage.jsx` and product catalog utilities — untouched
- `productCatalogApi.js`, `productCatalogStore.js` — untouched
- `package.json`, `vite.config.js`, `eslint.config.js` — untouched
- All Zustand stores — untouched
- All utility files under `src/utils/` — untouched
- Backend runtime, OpenAPI contract — untouched

---

## 4. Explicit NO-GO Boundaries

The following were NOT done and must NOT be done in this step:

- No App.jsx routing changes
- No React Router introduction
- No TypeScript migration
- No i18n system introduction
- No test file creation or modification
- No additional pages beyond WorkflowRunsPage
- No Zustand store refactoring
- No CSS architecture changes (Tailwind, CSS modules, etc.)
- No package additions or upgrades
- No changes to DashboardPage or any previously split page

---

## 5. Verification Results

| Check | Command | Result |
|---|---|---|
| Vite build | `npm run build` | PASS |
| ESLint | `npm run lint` | PASS |
| Git diff whitespace | `git diff --check` | PASS |

---

## 6. Remaining Gaps

None for this step. The split is structural only. Functional behavior is preserved by:
- All state and handlers in the orchestrator
- Tab content passed down as props to the same rendering logic
- Sub-components (StepEditor, StepReadinessPanel, etc.) imported and composed identically to how they appeared inline

Next step in sequence: **Step 4 — next page split per the UI refactor execution sequence**

---

## 7. Decision

**GO** — WorkflowRunsPage split complete, build and lint pass, scope boundaries respected.
