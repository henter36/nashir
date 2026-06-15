# Gate: Prompt Governance Page Split — Execution Evidence

**Branch:** `refactor/split-prompt-governance-page`
**Date:** 2026-06-15
**Scope:** `src/pages/PromptGovernancePage.jsx` and `src/pages/PromptGovernancePage/`

---

## Inputs

- Base: `main` after PR #195 (SecretsAndKeysPage split) merged
- Source file: `src/pages/PromptGovernancePage.jsx` (2,368 lines before split)
- Pattern reference: `DashboardPage/`, `CampaignWizardPage/`, `WorkflowRunsPage/`, `SecretsAndKeysPage/`

---

## Changed Files

| File | Lines | Role |
|------|-------|------|
| `src/pages/PromptGovernancePage.jsx` | ~370 | Slim orchestrator (was 2,368) |
| `src/pages/PromptGovernancePage/constants.js` | ~195 | Module-level data and seed metadata |
| `src/pages/PromptGovernancePage/helpers.js` | ~195 | Pure helper functions |
| `src/pages/PromptGovernancePage/styles.js` | ~560 | CSS template literal |
| `src/pages/PromptGovernancePage/components.jsx` | ~255 | Local UI primitive components |

**Line reduction in orchestrator:** 2,368 → ~370 (-84%)

---

## Component Split Inventory

### `constants.js`
All module-level data, option arrays, and seed metadata:
- `INITIAL_PROMPTS` — 4 seed prompts (pg1–pg4)
- `rules` — 6 governance rule strings
- `auditEvents` — 3 audit log seed entries
- `STATUS_LABELS`, `REVIEW_LABELS`, `SENSITIVITY_LABELS`
- `TABS` — 5 tab entries
- `WORKFLOW_LINK_OPTIONS` — 6 workflow/step entries
- `ALLOWED_OUTPUT_OPTIONS` — 13 items
- `REQUIRED_CHECK_OPTIONS` — 12 items
- `BLOCKED_PATTERN_OPTIONS` — 11 items
- `BLOCKED_PATTERN_SEVERITY` — severity map for 11 patterns
- `EXPECTED_INPUT_OPTIONS` — 19 items
- `TASK_INPUT_DEFAULTS` — 7 task → input mappings

### `helpers.js`
All module-level pure functions — imports `TASK_INPUT_DEFAULTS` from `./constants.js`:
- `getExpectedInputs(prompt)` — resolves expected inputs from prompt or task defaults
- `getGovernanceFindings(prompt)` — returns governance finding array; uses spread default guard
- `getPromptReadinessLabel(status)` — maps status key to Arabic label
- `buildPromptStepReadiness(prompt)` — large function, spread default guard, returns `{ status, score, checks, warnings, blockedReasons }`
- `getGovernanceScore(prompt)` — penalty-based score from governance findings
- `getReviewQueueReasons(prompt, readiness)` — reasons array for review queue display

### `styles.js`
Full CSS template literal (`export const styles = \`...\``) previously at lines 1458–2368.

### `components.jsx`
All local React component functions — imports from `./constants.js` and `./helpers.js`:
- `PromptReadinessBadge({ status })` — uses `getPromptReadinessLabel`
- `PromptStepReadinessPanel({ prompt, readiness })` — uses `getExpectedInputs`, `STATUS_LABELS`, `REVIEW_LABELS`, `PromptReadinessBadge`, `Info`; null-guards `prompt` as `safePrompt`
- `PromptSafetySummary({ prompt, findings, readiness, score })` — uses `getExpectedInputs`, `Info`; null-guards `prompt` as `safePrompt`
- `ExpectedInputContext({ prompt, onToggle, onTextChange })` — uses `getExpectedInputs`, `EXPECTED_INPUT_OPTIONS`; null-guards `prompt` as `safePrompt`
- `PromptContractCard()` — static, uses `Chip`
- `ChipArrayEditor({ label, helper, values, suggestions, tone, showSeverity, onToggle, onTextChange })` — uses `BLOCKED_PATTERN_SEVERITY`; `Array.isArray` guard on `values`
- `Field({ label, value, onChange })`
- `TextAreaField({ label, value, rows, helper, onChange })`
- `SelectInline({ label, value, options, onChange })`
- `Status({ value })` — uses `STATUS_LABELS`
- `StatCard({ title, value, icon, tone })`
- `Info({ label, value })`
- `Chip({ children, tone })`
- `Finding({ finding })` — uses `CheckCircle2`, `ShieldAlert`, `AlertTriangle`

---

## Behavior Preservation Statement

- All prompt state management, event handlers (`updatePrompt`, `createPrompt`, `duplicateSelectedPrompt`, `archivePrompt`, `deletePrompt`, `addWorkflowUsage`, `removeWorkflowUsage`, `updateArrayField`, `toggleArrayItem`) remain in the orchestrator.
- All 5 tabs (registry, policy, review, simulation, audit) remain in the orchestrator JSX.
- All Arabic RTL strings are preserved character-for-character.
- All CSS class names, selectors, and visual output are unchanged — `styles.js` is an exact extraction.
- `toggleArrayItem` uses the imported `getExpectedInputs` helper for the `expectedInputs` field, identical to original behavior.
- `promptTemplateStore.js` is not modified; imports `deletePrompt as deletePromptFromStore`, `duplicatePrompt`, `readPromptRegistry`, `upsertPrompt` unchanged.
- `src/utils/promptTemplateStore.js` not modified.

---

## Defensive Guards Applied

Following the pattern from SecretsAndKeysPage fix (commit `9e924f8`):

- `PromptStepReadinessPanel`: `const safePrompt = prompt || {}` before field accesses
- `PromptSafetySummary`: `const safePrompt = prompt || {}` before field accesses
- `ExpectedInputContext`: `const safePrompt = prompt || {}` before field accesses
- `ChipArrayEditor`: `const safeValues = Array.isArray(values) ? values : []` guards array prop
- `getGovernanceFindings`: spread default `{ ...prompt }` preserved exactly from original
- `buildPromptStepReadiness`: spread default `{ ...prompt }` preserved exactly from original

---

## Explicit No-Go Boundaries

- No changes to `App.jsx`
- No changes to `DashboardPage` or `src/pages/DashboardPage/*`
- No changes to `WorkflowRunsPage` or `src/pages/WorkflowRunsPage/*`
- No changes to `CampaignWizardPage` or `src/pages/CampaignWizardPage/*`
- No changes to `SecretsAndKeysPage` or `src/pages/SecretsAndKeysPage/*`
- No changes to `ProductCatalogPage.jsx`, `productCatalogApi.js`, `productCatalogStore.js`
- No changes to `src/utils/promptTemplateStore.js`
- No changes to backend/API/runtime files
- No changes to OpenAPI or generated types
- No changes to `package.json` or lockfiles
- No new dependencies added
- No TypeScript introduced
- No Zustand/global state introduced
- No routing/navigation changes
- No tests or tooling changes
- No redesign of the page

---

## Verification

### Build
```text
npm run build → ✓ built in 594ms (0 errors)
PromptGovernancePage-YBcFCE5d.js  62.25 kB │ gzip: 15.19 kB
```

### Lint
```text
npm run lint → exit 0 (no errors, no warnings)
```

### Whitespace
```text
git diff --check → clean (no trailing whitespace)
```

### Scope guard
```text
git status → only PromptGovernancePage.jsx (modified), PromptGovernancePage/ (new), docs/ (new gate)
```

---

## Pattern Conformance

Follows the co-located component pattern established by `DashboardPage/`, `WorkflowRunsPage/`, `CampaignWizardPage/`, and `SecretsAndKeysPage/`:
- `PromptGovernancePage.jsx` — slim orchestrator (state, handlers, JSX layout)
- `PromptGovernancePage/constants.js` — data
- `PromptGovernancePage/helpers.js` — pure functions
- `PromptGovernancePage/styles.js` — CSS
- `PromptGovernancePage/components.jsx` — UI primitives

All component cross-references within `components.jsx` (e.g. `PromptStepReadinessPanel` using `PromptReadinessBadge` and `Info`, `PromptContractCard` using `Chip`, `ChipArrayEditor` using `TextAreaField`, `ExpectedInputContext` using `TextAreaField`) resolve within the same file.

---

## Remaining Gaps

None. The split is complete and all verifications pass.

---

## Decision

**GO for review.** This gate documents the split execution and authorizes the PR for review. It does not constitute acceptance of the overall refactor program.
