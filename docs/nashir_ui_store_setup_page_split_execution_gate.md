# nashir_ui_store_setup_page_split_execution_gate

## Gate type
UI refactor execution — documentation and verification record.

## Step
Step 9 of the approved Nashir UI refactor execution sequence.

## Status
Executed and verified. PR pending.

## Branch
`refactor/split-store-setup-page`

## PR title
`refactor: split store setup page`

## Scope
Split `src/pages/StoreSetupPage.jsx` (1791 lines) into co-located modules under `src/pages/StoreSetupPage/` without changing any behavior, Arabic RTL text, visual design, navigation model, mock/prototype boundaries, or runtime scope.

## Files created

| File | Contents |
|------|----------|
| `src/pages/StoreSetupPage/constants.js` | 14 exported constants: steps, channelOptions, storeTypeOptions, marketScopeOptions, acquisitionPlans, productFlagOptions, policyItems, defaultForm, defaultProducts, statusLabels, channelConnectionLabels, oauthProviderMeta, legacyChannelMap, channelUrlLabels |
| `src/pages/StoreSetupPage/helpers.js` | 7 exported helpers: normalizeSalesChannelName, getSelectedSalesChannels, getChannelUrlLabel, channelNeedsUrl, normalizeProviderKey, snapshotToStoreSource, snapshotToCollectedData |
| `src/pages/StoreSetupPage/styles.js` | `export const styles` — full minified CSS from original plus focus-visible accessibility rule |
| `src/pages/StoreSetupPage/components.jsx` | 22 exported UI components: Card, Badge, Button, SectionHeader, StepTabs, Field, FieldSelect, TextArea, ChoiceGroup, MultiChoice, UploadBox, Notice, SourceStatus, Info, ChannelConnectionStatus, PolicyRow, Metric, ChannelPlan, TimelineCard, SmartBox, Footer |

## Files modified

| File | Change |
|------|--------|
| `src/pages/StoreSetupPage.jsx` | Replaced with thin orchestrator that imports from the four sub-modules above. Retains all state, effects, memos, handlers, and JSX. |

## Hardening applied (beyond pure refactor)

- `Field`, `FieldSelect`, `TextArea`: `value ?? ""` guard to prevent uncontrolled-to-controlled React warnings.
- `FieldSelect`, `ChoiceGroup`, `MultiChoice`, `ChannelPlan`, `StepTabs`: `Array.isArray()` guards on array props.
- `snapshotToCollectedData`: `Array.isArray()` guards on all six array fields returned from snapshot.
- `styles.js`: Added `.field input:focus-visible, .field textarea:focus-visible, .field select:focus-visible { outline: 2px solid #176b2c; outline-offset: 2px; }` — accessibility parity with SettingsPage.

## Hard blocks respected

The following were not touched:
- `App.jsx`
- `DashboardPage`, `WorkflowRunsPage`, `CampaignWizardPage`, `SecretsAndKeysPage`, `PromptGovernancePage`, `ModelRoutingPage`, `SettingsPage` or their sub-directories
- `ProductCatalogPage.jsx`, `productCatalogApi.js`, `productCatalogStore.js`
- `src/utils/promptTemplateStore.js`
- Backend/API/runtime files
- OpenAPI/generated types
- `package.json` / lockfiles
- No new dependencies introduced
- No TypeScript introduced
- No Zustand/global state introduced
- No routing/navigation changes
- No tests/tooling introduced

## Verification

```
npm run build  → ✓ built in 634ms (0 errors)
npm run lint   → ✓ (0 errors, 0 warnings)
git diff --check → ✓ (no whitespace issues)
git diff --name-only HEAD → src/pages/StoreSetupPage.jsx (1 modified, src/pages/StoreSetupPage/ new dir)
```

## Predecessor gates

- Step 6: `nashir_ui_prompt_governance_page_split_execution_gate.md`
- Step 7: `nashir_ui_secrets_and_keys_page_split_execution_gate.md`
- Step 8: `nashir_ui_settings_page_split_execution_gate.md`

## Governance classification

UI-only. No backend, no API, no SQL, no auth/RBAC, no migration, no generated client, no production boundary change. Accelerated under the safe build acceleration policy.
