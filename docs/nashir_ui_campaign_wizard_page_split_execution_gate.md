# Gate: Campaign Wizard Page Split — Execution Evidence

**Branch:** `refactor/split-campaign-wizard-page`
**Date:** 2026-06-15
**Scope:** `src/pages/CampaignWizardPage.jsx` and `src/pages/CampaignWizardPage/`

---

## Objective

Split `CampaignWizardPage.jsx` (3,557 lines) into co-located modules following the DashboardPage pattern, making the main file a slim orchestrator focused on state, event handlers, and JSX layout.

---

## Files Changed

| File | Lines | Role |
|------|-------|------|
| `src/pages/CampaignWizardPage.jsx` | 1,500 | Slim orchestrator (was 3,557) |
| `src/pages/CampaignWizardPage/constants.js` | 140 | Module-level data constants |
| `src/pages/CampaignWizardPage/helpers.js` | 207 | Pure helper functions |
| `src/pages/CampaignWizardPage/styles.js` | 1,459 | CSS template literal |
| `src/pages/CampaignWizardPage/components.jsx` | 298 | Local UI primitive components |

**Line reduction in orchestrator:** 3,557 → 1,500 (-2,057 lines, -58%)

---

## What Was Extracted

### `constants.js`
All module-level data arrays and seed objects:
- `goals`, `occasions`, `languageOptions`, `ageGroupOptions`, `genderOptions`
- `ctaOptions`, `channelOptions`, `outputOptions`
- `initialProducts`, `assetFallbackSeed`, `steps`
- `productRefKey`, `assetRefKey`

### `helpers.js`
All module-level pure functions:
- `toggleValue`, `buildAssetSnapshot`
- `makeCustomerText`, `makeInternalPrompt`, `buildSuggestedCampaignText`
- `getApprovalLabel`, `getOutputTypeLabel`, `getOutputTaskType`, `getOutputRequiredFields`
- `resolvePromptForOutput`, `resolveRouteForOutput`, `checkOutputFieldsReadiness`
- `getPromptStatusArabicLabel`, `buildOutputMockContent`

### `styles.js`
The full CSS template literal (`const styles`) previously at lines 2099–3557.

### `components.jsx`
All local React component functions previously defined after the main export:
- `PageTitle`, `Card`, `Badge`, `Info`
- `AssetSelectionGroup`, `Button`, `SectionHeader`, `StepTabs`
- `Field`, `FileField`, `TextArea`
- `ChoiceGroup`, `MultiChoice`, `Metric`, `BriefRow`, `Notice`
- `SmartBox`, `Footer`

---

## What Was NOT Touched

- No changes to App.jsx
- No changes to DashboardPage or WorkflowRunsPage
- No changes to ProductCatalogPage.jsx, productCatalogApi.js, productCatalogStore.js
- No changes to backend/API/runtime files
- No changes to OpenAPI or generated types
- No changes to package.json or lockfiles
- No new dependencies added
- No TypeScript introduced
- No Zustand/global state introduced
- No routing/navigation changes
- No tests or tooling changes
- No redesign of the page
- Arabic RTL strings preserved exactly as-is

---

## Verification

### Build
```
npm run build → ✓ built in 553ms (0 errors)
CampaignWizardPage-CPQKvXIU.js  81.62 kB │ gzip: 18.90 kB
```

### Lint
```
npm run lint → exit 0 (no errors, no warnings)
```

### Whitespace
```
git diff --check → clean (no trailing whitespace)
```

---

## Pattern Conformance

Follows the co-located component pattern established by `DashboardPage/`:
- `CampaignWizardPage.jsx` — slim orchestrator
- `CampaignWizardPage/constants.js` — data
- `CampaignWizardPage/helpers.js` — pure functions
- `CampaignWizardPage/styles.js` — CSS
- `CampaignWizardPage/components.jsx` — UI primitives

All component cross-references within `components.jsx` (e.g. `SmartBox` using `Card`, `Footer` using `Button`, `AssetSelectionGroup` using `Badge`/`Notice`) resolve within the same file. `MultiChoice` imports `toggleValue` from `./helpers.js`.
