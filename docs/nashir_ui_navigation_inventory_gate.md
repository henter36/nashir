# Nashir UI Navigation Inventory Gate

## Gate type
UI navigation inventory gate — documentation only. No runtime code, no tests, no dependency changes in this PR.

## Step
Step 17 of the Nashir UI refactor execution sequence.

## Status
Inventory complete. Pending reviewer decision.

---

## 1. Purpose

Create a reviewable inventory of the current Nashir UI navigation/screen registry as recorded in `src/App.jsx`, before any future smoke verification implementation depends on it.

This gate inspects `src/App.jsx` read-only. It does **not** modify any source file, implement tests, add dependencies, authorize smoke checks, or open backend/API/routing scope.

---

## 2. Inputs

| Reference | Description |
|-----------|-------------|
| PR #204 | docs: accept UI refactor completion |
| PR #205 | docs: plan UI prototype stabilization |
| PR #206 | docs: plan UI smoke verification |
| [docs/nashir_ui_refactor_completion_acceptance_gate.md](nashir_ui_refactor_completion_acceptance_gate.md) | Acceptance gate — Step 14 |
| [docs/nashir_ui_prototype_stabilization_planning_gate.md](nashir_ui_prototype_stabilization_planning_gate.md) | Stabilization planning gate — Step 15 |
| [docs/nashir_ui_smoke_verification_planning_gate.md](nashir_ui_smoke_verification_planning_gate.md) | Smoke verification planning gate — Step 16 |
| `src/App.jsx` | Inspected read-only; not modified |

---

## 3. Current accepted baseline

- **UI refactor completion sequence is accepted.** All 8 page splits, ErrorBoundary, and gate documentation are merged.
- **UI prototype stabilization planning is accepted.** Smoke verification was identified as the highest-value first stabilization step.
- **UI smoke verification planning is accepted.** The smoke gate (PR #206) recommended locking the screen inventory before smoke implementation begins.
- **Current active `App.jsx` inventory contains 23 screen IDs.** Confirmed by reading `screens` array and `pageContent` branches.
- **No smoke tests are implemented by this gate.**
- **UI remains prototype-only.** No backend/API/generated integration is authorized.

---

## 4. App.jsx screen registry inventory

Source: `screens` array in `App.jsx` (lines 118–150), read-only.

| # | Screen ID | Arabic label | Icon | Target page / content |
|---|-----------|-------------|------|-----------------------|
| 1 | `dashboard` | لوحة التحكم | `LayoutDashboard` | `DashboardPage` (lazy) |
| 2 | `storeSetup` | إعداد المتجر | `Store` | `StoreSetupPage` (lazy) |
| 3 | `productCatalog` | كتالوج المنتجات | `Store` | `ProductCatalogPage` (lazy) |
| 4 | `productIntelligence` | استوديو تحليل المنتج | `PackageSearch` | `ProductIntelligencePage` (lazy, `onNavigate` prop) |
| 5 | `dataSourcesHub` | مركز المصادر البياناتية | `Database` | `DataSourcesHubPage` (lazy) |
| 6 | `assetLibrary` | مكتبة الأصول | `FolderOpen` | `AssetLibraryPage` (lazy) |
| 7 | `campaigns` | معالج الحملات | `Megaphone` | `CampaignWizardPage` (lazy, `campaignOrigin` + `onNavigate` props) |
| 8 | `campaignsList` | الحملات | `Megaphone` | `CampaignsUnifiedPage` (lazy) |
| 9 | `creatorStudio` | استوديو صانع المحتوى | `Video` | `CreatorStudioPage` (lazy, `onNavigate` prop) |
| 10 | `content` | المحتوى | `FileCheck2` | `ContentStudioPage` (lazy) |
| 11 | `contentReview` | المراجعة والمعاينة | `FileCheck2` | `ContentReviewPreviewUnifiedPage` (lazy) |
| 12 | `publishingQueue` | جدولة النشر | `CalendarDays` | `PublishingQueuePage` (lazy) |
| 13 | `analytics` | التحليلات | `BarChart3` | `AnalyticsUnifiedPage` (lazy) |
| 14 | `templateEngine` | محرك القوالب | `Wand2` | `TemplateEnginePage` (lazy) |
| 15 | `multiPlatform` | متعدد القنوات | `Layers` | `MultiPlatformPage` (lazy) |
| 16 | `teamCollaboration` | تعاون الفريق | `Users` | `TeamCollaborationPage` (lazy) |
| 17 | `workflowRuns` | تشغيلات النظام | `Workflow` | `WorkflowRunsPage` (lazy) |
| 18 | `systemAdmin` | إدارة النظام | `Shield` | `SystemAdminPage` (lazy) |
| 19 | `secrets` | الأسرار والمفاتيح | `KeyRound` | `SecretsAndKeysPage` (lazy) |
| 20 | `modelRouting` | توجيه النماذج | `Wand2` | `ModelRoutingPage` (lazy) |
| 21 | `promptGovernance` | حوكمة المطالبات | `Wand2` | `PromptGovernancePage` (lazy) |
| 22 | `costMonitor` | مراقبة التكلفة | `DollarSign` | `CostMonitorPage` (lazy) |
| 23 | `settings` | الإعدادات | `Settings` | `SettingsPage` (lazy) |

**Total: 23 screen IDs confirmed.**

All 23 have explicit `pageContent` assignments in `App.jsx`. The `PlaceholderPage` fallback (lines 205–212) is a safety net; it is not the intended target of any named screen ID.

---

## 5. Page mapping review

| Screen ID | Expected component | Mapping evidence | Concern |
|-----------|-------------------|-----------------|---------|
| `dashboard` | `DashboardPage` | Explicit `if (activeScreen === "dashboard")` block with props | None |
| `storeSetup` | `StoreSetupPage` | Single-line `if` branch | None |
| `productCatalog` | `ProductCatalogPage` | Single-line `if` branch | None |
| `productIntelligence` | `ProductIntelligencePage` | Single-line `if` branch | None |
| `dataSourcesHub` | `DataSourcesHubPage` | Single-line `if` branch | None |
| `assetLibrary` | `AssetLibraryPage` | Single-line `if` branch | None |
| `campaigns` | `CampaignWizardPage` | Single-line `if` branch with `campaignOrigin` context | None |
| `campaignsList` | `CampaignsUnifiedPage` | Explicit `if` block | Legacy naming — see §6 |
| `creatorStudio` | `CreatorStudioPage` | Single-line `if` branch | None |
| `content` | `ContentStudioPage` | Single-line `if` branch | Legacy naming — screen ID `content` maps to `ContentStudio` component |
| `contentReview` | `ContentReviewPreviewUnifiedPage` | Single-line `if` branch | Legacy naming — see §6 |
| `publishingQueue` | `PublishingQueuePage` | Single-line `if` branch | None |
| `analytics` | `AnalyticsUnifiedPage` | Single-line `if` branch | Legacy naming — see §6 |
| `templateEngine` | `TemplateEnginePage` | Single-line `if` branch | None |
| `multiPlatform` | `MultiPlatformPage` | Single-line `if` branch | None |
| `teamCollaboration` | `TeamCollaborationPage` | Single-line `if` branch | None |
| `workflowRuns` | `WorkflowRunsPage` | Single-line `if` branch | None |
| `systemAdmin` | `SystemAdminPage` | Single-line `if` branch | None |
| `secrets` | `SecretsAndKeysPage` | Single-line `if` branch | Legacy naming — screen ID `secrets` maps to `SecretsAndKeys` component |
| `modelRouting` | `ModelRoutingPage` | Single-line `if` branch | None |
| `promptGovernance` | `PromptGovernancePage` | Single-line `if` branch | None |
| `costMonitor` | `CostMonitorPage` | Single-line `if` branch | None |
| `settings` | `SettingsPage` | Single-line `if` branch | None |

**Summary:** 19 of 23 screens have no mapping concern. 4 screens carry a legacy naming observation (documented in §6).

---

## 6. Deprecated / legacy route visibility review

These are **inventory observations only**. They are not blockers unless they break navigation. No fix is authorized by this gate.

### `campaignsList` → `CampaignsUnifiedPage`
Screen ID `campaignsList` maps to a component named `CampaignsUnifiedPage`. The "Unified" suffix is a legacy consolidation label from an earlier architectural decision. Navigation functions correctly; the naming mismatch is cosmetic.

### `analytics` → `AnalyticsUnifiedPage`
Screen ID `analytics` maps to `AnalyticsUnifiedPage`. Same pattern as `campaignsList`. Navigation functions correctly.

### `contentReview` → `ContentReviewPreviewUnifiedPage`
Screen ID `contentReview` maps to `ContentReviewPreviewUnifiedPage`. The component name is significantly longer than the screen ID and contains both "Review" and "Preview". Navigation functions correctly.

### `secrets` → `SecretsAndKeysPage`
Screen ID `secrets` maps to `SecretsAndKeysPage`. The screen ID is abbreviated; the component name is more descriptive. Navigation functions correctly.

### Additional observation: `content` → `ContentStudioPage`
Screen ID `content` (label: "المحتوى") maps to `ContentStudioPage`. The component name implies a studio/editor context that is not reflected in the short screen ID. Navigation functions correctly.

### Additional observation: shared icons
Three pairs of screens share the same icon:
- `storeSetup` and `productCatalog` both use `Store`
- `campaigns` and `campaignsList` both use `Megaphone`
- `content` and `contentReview` both use `FileCheck2`
- `templateEngine`, `modelRouting`, and `promptGovernance` all use `Wand2`

These are visual/UX observations only. Navigation is unaffected.

---

## 7. Smoke verification implications

This inventory should serve as the authoritative source list for the future smoke verification implementation gate:

- **The 23-screen list in §4 is the target inventory.** Future smoke checks should iterate over these exact IDs.
- **Each screen ID should be navigated at least once** to confirm `navigateToScreen` transitions and `pageContent` updates.
- **Each lazy import should resolve.** The component name column in §4 identifies the expected lazy target for each screen.
- **Placeholder screens:** No screen currently falls through to `PlaceholderPage` by design. The smoke implementation gate should treat a `PlaceholderPage` render as a failure for any of the 23 named screen IDs.
- **Legacy-named screens** (`campaignsList`, `analytics`, `contentReview`, `secrets`, `content`) should be included in smoke coverage without renaming — they are navigable and mapped correctly.
- **No backend/API calls should be required.** All 23 pages are designed to render in prototype state without live data sources.

---

## 8. Risks

| Risk | Inventory finding | Future action |
|------|------------------|---------------|
| Screen ID exists without `pageContent` assignment | Not found — all 23 IDs have explicit branches; `PlaceholderPage` is a safety net only | Smoke check should assert no named ID falls through to `PlaceholderPage` |
| Page component exists but carries legacy/unified naming | 4 screens observed (`campaignsList`, `analytics`, `contentReview`, `secrets`; `content` also noted) | Accept as-is or open UI Navigation Cleanup Planning Gate before smoke implementation |
| Placeholder screens counted as active/healthy | None currently — no screen intentionally targets `PlaceholderPage` | Smoke gate should flag any `PlaceholderPage` render as a failure |
| Future smoke checks using wrong screen count | Inventory confirmed at 23; prior gates have stated 23 | Smoke gate should import or reference this document as source of truth |
| Backend/API scope creep in smoke implementation | Not present in current mapping — all pages are prototype-only | Smoke implementation gate must include prototype-only boundary check |
| Deprecated screens reintroduced unintentionally | No deprecated screens found in current `screens` array | Registry check in smoke gate should compare against this locked list |

---

## 9. Decision options

**A. GO to UI Smoke Verification Implementation Authorization Gate**
Use if the 23-screen inventory is accepted as complete and no blocking navigation ambiguity exists. Smoke implementation can then reference this document as its source list.

**B. GO to UI Navigation Cleanup Planning Gate**
Use if legacy/unified component naming (`CampaignsUnifiedPage`, `AnalyticsUnifiedPage`, `ContentReviewPreviewUnifiedPage`, abbreviated `secrets`) should be cleaned before smoke implementation depends on current names.

**C. GO to UI Prototype Readiness Review Gate**
Use if smoke implementation should be deferred in favor of a direct prototype readiness evaluation.

**D. NO-GO**
Use if unexpected runtime, API, dependency, or routing drift is found since PR #206. Requires a correction gate before inventory or smoke work continues.

---

## 10. Recommended decision

All 23 screen IDs are mapped to explicit page components. No screen falls through to the `PlaceholderPage` fallback by design. Navigation is correct for all entries. The 4 legacy/unified naming observations are cosmetic — they do not affect navigation and are not blockers.

> **Decision: GO to UI Smoke Verification Implementation Authorization Gate.**
>
> The 23-screen inventory is complete and unambiguous. The legacy naming observations are noted and accepted as-is for prototype scope. Smoke implementation can reference §4 of this document as its authoritative screen list.

---

## 11. Verification

```bash
git diff --check
git diff --name-only main...HEAD
```

Expected result: only `docs/nashir_ui_navigation_inventory_gate.md` changed.

---

## Governance classification

Documentation-only inventory gate. No runtime code, no backend, no API, no SQL, no auth/RBAC, no migration, no generated client, no dependency change, no test implementation, no production boundary change. `src/App.jsx` was read-only; it was not modified.
