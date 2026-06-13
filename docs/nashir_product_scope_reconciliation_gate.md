# Nashir Product Scope Reconciliation Gate

| Field | Value |
|---|---|
| Gate type | Product scope reconciliation gate — documentation only |
| Status | Draft — pending review |
| Date | 2026-06-01 |
| Scope | Reconciles current Nashir product scope by comparing README, screen_map.md, App.jsx navigation, and actual page files; identifies inventory gaps before backend/API/productization |
| UI/source code changes | NO |
| API/backend/package/build changes | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is a documentation-only reconciliation gate.

**No UI or source code changes are made.**

**No API, backend, package, or build changes are made.**

**No screens are deleted or renamed.**

**No production readiness is claimed.**

This gate reconciles what is currently built, what is documented, and what needs an explicit scope decision before backend/API/productization begins.

---

## 2. Inputs Reviewed

| Input | Summary |
|---|---|
| `README.md` | Lists 20 approved screens in a table; matches `screen_map.md` 20-screen inventory; does not mention `productIntelligence`, `creatorStudio`, or `contentReview`; defines the core journey |
| `docs/screen_map.md` | 20 approved screens with screen ID, label, file path, role, user type, status, notes; 7 removed standalone screens listed; core journey defined; governance notes present; does not include `productIntelligence`, `creatorStudio`, or `contentReview` |
| `src/App.jsx` | 23 screen routes defined; all `enabled: true`; lazy-loaded; includes `productIntelligence`, `creatorStudio`, and `contentReview` which are not in README or screen_map |
| `src/pages/` | 23 `.jsx` page files + 2 `.css` companions (CreatorStudioPage.css, ProductIntelligencePage.css); all 23 page components are imported and rendered in App.jsx; no orphaned page files |
| `src/data/` | `creatorStudioFlowFixture.js`, `dashboardData.js`, `readinessFixture.js` — mock data fixtures; confirms Creator Studio has its own dedicated mock data |
| `src/generated/` | `creator-studio-openapi-types/` — generated OpenAPI types specifically for Creator Studio; confirms Creator Studio has active development investment |
| `src/App.dashboard.backup.jsx` | Removed during Product UI source-of-truth cleanup; it was never imported or active |
| `package.json` | `name: nashir`; scripts: `dev`, `build`, `lint`, `preview`, `generate:creator-studio-types` |

---

## 3. Current Product Identity

| Principle | Status |
|---|---|
| `nashir` is the product repository | **CONFIRMED** |
| Nashir UI in this repository is the source-of-truth for product journey and UX | **CONFIRMED** |
| `marketing-os` is reference-only and not a scope authority | **CONFIRMED** |
| Existing UI is mock/prototype from implementation perspective | **CONFIRMED** — all screens are "Active Mock" |
| Product source-of-truth does not equal production readiness | **CONFIRMED** |

---

## 4. Screen Inventory From README / Docs

The following 20 screens are documented in both `README.md` and `docs/screen_map.md`:

| Screen ID | Label | Documentation status |
|---|---|---|
| `dashboard` | لوحة التحكم | Explicitly documented |
| `storeSetup` | إعداد المتجر | Explicitly documented |
| `productCatalog` | كتالوج المنتجات | Explicitly documented |
| `dataSourcesHub` | مركز المصادر البياناتية | Explicitly documented |
| `assetLibrary` | مكتبة الأصول | Explicitly documented |
| `campaigns` | معالج الحملات | Explicitly documented |
| `campaignsList` | الحملات | Explicitly documented |
| `content` | المحتوى والمراجعة | Explicitly documented — noted to absorb review/preview temporarily |
| `publishingQueue` | جدولة النشر | Explicitly documented |
| `analytics` | التحليلات | Explicitly documented |
| `templateEngine` | محرك القوالب | Explicitly documented |
| `multiPlatform` | متعدد القنوات | Explicitly documented |
| `teamCollaboration` | تعاون الفريق | Explicitly documented |
| `workflowRuns` | تشغيلات النظام | Explicitly documented |
| `systemAdmin` | إدارة النظام | Explicitly documented |
| `secrets` | الأسرار والمفاتيح | Explicitly documented |
| `modelRouting` | توجيه النماذج | Explicitly documented |
| `promptGovernance` | حوكمة المطالبات | Explicitly documented |
| `costMonitor` | مراقبة التكلفة | Explicitly documented |
| `settings` | الإعدادات | Explicitly documented |

**3 screens present in App.jsx are missing from README and screen_map:** See Section 5.

---

## 5. Screen Inventory From App.jsx / Navigation

App.jsx defines 23 screens — all with `enabled: true`. The following table is the authoritative current navigation state:

| Screen ID | Arabic label | Page component | Navigation group | In README/docs? |
|---|---|---|---|---|
| `dashboard` | لوحة التحكم | `DashboardPage` | Primary (الرئيسية) | YES |
| `storeSetup` | إعداد المتجر | `StoreSetupPage` | Primary (الرئيسية) | YES |
| `productCatalog` | كتالوج المنتجات | `ProductCatalogPage` | Primary (الرئيسية) | YES |
| `productIntelligence` | استوديو تحليل المنتج | `ProductIntelligencePage` | Primary (الرئيسية) | **NO — missing from docs** |
| `dataSourcesHub` | مركز المصادر البياناتية | `DataSourcesHubPage` | Primary (الرئيسية) | YES |
| `assetLibrary` | مكتبة الأصول | `AssetLibraryPage` | Primary (الرئيسية) | YES |
| `campaigns` | معالج الحملات | `CampaignWizardPage` | Campaigns (الحملات والمحتوى) | YES |
| `campaignsList` | الحملات | `CampaignsUnifiedPage` | Campaigns (الحملات والمحتوى) | YES |
| `creatorStudio` | استوديو صانع المحتوى | `CreatorStudioPage` | Campaigns (الحملات والمحتوى) | **NO — missing from docs** |
| `content` | المحتوى | `ContentStudioPage` | Campaigns (الحملات والمحتوى) | YES (as content/review) |
| `contentReview` | المراجعة والمعاينة | `ContentReviewPreviewUnifiedPage` | Campaigns (الحملات والمحتوى) | **NO — missing from docs (docs say content absorbs review)** |
| `publishingQueue` | جدولة النشر | `PublishingQueuePage` | Campaigns (الحملات والمحتوى) | YES |
| `analytics` | التحليلات | `AnalyticsUnifiedPage` | Analytics (التحليلات والقنوات) | YES |
| `templateEngine` | محرك القوالب | `TemplateEnginePage` | Analytics (التحليلات والقنوات) | YES |
| `multiPlatform` | متعدد القنوات | `MultiPlatformPage` | Analytics (التحليلات والقنوات) | YES |
| `teamCollaboration` | تعاون الفريق | `TeamCollaborationPage` | Analytics (التحليلات والقنوات) | YES |
| `workflowRuns` | تشغيلات النظام | `WorkflowRunsPage` | Admin (الإدارة والحوكمة) | YES |
| `systemAdmin` | إدارة النظام | `SystemAdminPage` | Admin (الإدارة والحوكمة) | YES |
| `secrets` | الأسرار والمفاتيح | `SecretsAndKeysPage` | Admin (الإدارة والحوكمة) | YES |
| `modelRouting` | توجيه النماذج | `ModelRoutingPage` | Admin (الإدارة والحوكمة) | YES |
| `promptGovernance` | حوكمة المطالبات | `PromptGovernancePage` | Admin (الإدارة والحوكمة) | YES |
| `costMonitor` | مراقبة التكلفة | `CostMonitorPage` | Admin (الإدارة والحوكمة) | YES |
| `settings` | الإعدادات | `SettingsPage` | Admin (الإدارة والحوكمة) | YES |

---

## 6. Actual Page File Inventory

23 page component files found in `src/pages/` (plus 2 `.css` companion files):

| File | App.jsx route | Used by navigation | Notes |
|---|---|---|---|
| `DashboardPage.jsx` | `dashboard` | YES | Has dedicated mock data in `src/data/dashboardData.js` |
| `StoreSetupPage.jsx` | `storeSetup` | YES | |
| `ProductCatalogPage.jsx` | `productCatalog` | YES | |
| `ProductIntelligencePage.jsx` | `productIntelligence` | YES | Has companion `.css`; accepts `onNavigate` prop; **not in docs** |
| `DataSourcesHubPage.jsx` | `dataSourcesHub` | YES | |
| `AssetLibraryPage.jsx` | `assetLibrary` | YES | |
| `CampaignWizardPage.jsx` | `campaigns` | YES | Accepts `campaignOrigin` and `onNavigate` props |
| `CampaignsUnifiedPage.jsx` | `campaignsList` | YES | Accepts `onCreateCampaign` prop |
| `CreatorStudioPage.jsx` | `creatorStudio` | YES | Has companion `.css`; dedicated fixture `creatorStudioFlowFixture.js`; generated types in `src/generated/`; accepts `onNavigate` prop; **not in docs** |
| `ContentStudioPage.jsx` | `content` | YES | |
| `ContentReviewPreviewUnifiedPage.jsx` | `contentReview` | YES | **not in docs** (docs say content absorbs review) |
| `PublishingQueuePage.jsx` | `publishingQueue` | YES | |
| `AnalyticsUnifiedPage.jsx` | `analytics` | YES | |
| `TemplateEnginePage.jsx` | `templateEngine` | YES | |
| `MultiPlatformPage.jsx` | `multiPlatform` | YES | |
| `TeamCollaborationPage.jsx` | `teamCollaboration` | YES | |
| `WorkflowRunsPage.jsx` | `workflowRuns` | YES | |
| `SystemAdminPage.jsx` | `systemAdmin` | YES | |
| `SecretsAndKeysPage.jsx` | `secrets` | YES | Must never store real secrets |
| `ModelRoutingPage.jsx` | `modelRouting` | YES | |
| `PromptGovernancePage.jsx` | `promptGovernance` | YES | |
| `CostMonitorPage.jsx` | `costMonitor` | YES | |
| `SettingsPage.jsx` | `settings` | YES | |

**No orphaned page files.** All 23 page components are actively imported and rendered in App.jsx.

**Note on `src/App.dashboard.backup.jsx`:** Removed during Product UI source-of-truth cleanup; it was never imported or active.

---

## 7. Reconciliation Matrix

| Screen / module | README/docs status | App.jsx status | Page file status | V1 recommendation | Notes / risk |
|---|---|---|---|---|---|
| dashboard | Documented | Active | Present | **V1 Core** | Entry point; has mock data fixture |
| storeSetup | Documented | Active | Present | **V1 Core** | Required before campaign creation |
| productCatalog | Documented | Active | Present | **V1 Core** | Core merchant data surface |
| productIntelligence | **Missing from docs** | Active | Present | **Extended V1 Candidate** | Has dedicated `.css` + `onNavigate` prop; needs scope decision |
| dataSourcesHub | Documented | Active | Present | **V1 Core** | Core data source visibility |
| assetLibrary | Documented | Active | Present | **V1 Core** | Creative assets surface |
| campaigns (CampaignWizard) | Documented | Active | Present | **V1 Core** | Main campaign creation flow |
| campaignsList (CampaignsUnified) | Documented | Active | Present | **V1 Core** | Campaign management |
| creatorStudio | **Missing from docs** | Active | Present | **Extended V1 Candidate** | Has dedicated fixture, generated types, `onNavigate` prop; significant investment; needs scope decision |
| content (ContentStudio) | Documented | Active | Present | **V1 Core** | Content creation and editing |
| contentReview | **Missing from docs** | Active | Present | **Extended V1 Candidate** | Docs say content absorbs review but separate screen exists; needs reconciliation decision |
| publishingQueue | Documented | Active | Present | **V1 Core** | Publishing workflow |
| analytics | Documented | Active | Present | **V1 Core** | Analytics surface |
| templateEngine | Documented | Active | Present | **V1 Support** | Template/prompt management |
| multiPlatform | Documented | Active | Present | **V1 Support** | Multi-channel readiness |
| teamCollaboration | Documented | Active | Present | **V1 Support** | Team roles and collaboration |
| workflowRuns | Documented | Active | Present | **V1 Admin/Governance** | Workflow simulation |
| systemAdmin | Documented | Active | Present | **V1 Admin/Governance** | Admin configuration |
| secrets | Documented | Active | Present | **V1 Admin/Governance** | Must never store real values |
| modelRouting | Documented | Active | Present | **V1 Admin/Governance** | AI policy governance |
| promptGovernance | Documented | Active | Present | **V1 Admin/Governance** | Prompt lifecycle governance |
| costMonitor | Documented | Active | Present | **V1 Admin/Governance** | AI cost tracking |
| settings | Documented | Active | Present | **V1 Admin/Governance** | General settings |

---

## 8. Proposed V1 Journey

Based on current Nashir UI evidence only:

### Core merchant journey (V1 Core)

```text
Dashboard
→ StoreSetup (store identity + business profile)
→ ProductCatalog (product/service records)
→ DataSourcesHub (data source readiness)
→ AssetLibrary (creative assets)
→ CampaignWizard (campaign creation)
→ CampaignsUnified (campaign management)
→ ContentStudio (content creation/editing)
→ PublishingQueue (publishing schedule)
→ Analytics (performance overview)
```

### Extended merchant journey (Extended V1 Candidates — require scope decision)

```text
ProductIntelligence (product analysis studio — supports campaign targeting)
CreatorStudio (AI content creation studio — significant implementation investment)
ContentReviewPreview (content review/preview — currently separate from ContentStudio)
MultiPlatform (multi-channel readiness)
TeamCollaboration (team roles and review)
```

### Admin/governance journey (V1 Admin/Governance)

```text
TemplateEngine → WorkflowRuns → SystemAdmin → Secrets → ModelRouting → PromptGovernance → CostMonitor → Settings
```

### Key distinction

- **Core merchant journey** must be functional and tested before any productization.
- **Extended V1 candidates** must be explicitly approved or deferred in a V1 Scope Decision Gate.
- **Admin/governance journey** supports the product but should not block core merchant testing.

---

## 9. Scope Conflicts / Gaps

| Conflict / Gap | Detail | Required action |
|---|---|---|
| 3 screens in App.jsx not in README or screen_map | `productIntelligence`, `creatorStudio`, `contentReview` are active navigation items and rendered pages with no documentation in README or screen_map | Add to screen_map and README in a future documentation update PR, or explicitly classify in V1 Scope Decision Gate |
| `contentReview` vs `content` overlap | screen_map says `content` absorbs review/preview temporarily; App.jsx has both `content` (ContentStudioPage) and `contentReview` (ContentReviewPreviewUnifiedPage) as active separate screens | Requires explicit decision: merge or maintain separation |
| Creator Studio has significant implementation investment | Dedicated mock fixture, generated types, companion CSS, `onNavigate` prop — more developed than an undocumented screen suggests | Needs explicit V1 classification: Extended V1 or part of core |
| Product Intelligence not in docs | `ProductIntelligencePage.jsx` is active with companion CSS and `onNavigate` prop linking to campaigns | Needs explicit V1 classification |
| screen_map navigation groups lag App.jsx | screen_map grouping doesn't include productIntelligence, creatorStudio, contentReview | screen_map must be updated after scope decision |
| No auth/API/database implementation | All screens are mock-only; any backend/productization gate must account for this | Explicitly documented; not a bug |
| `src/App.dashboard.backup.jsx` | Removed inactive backup file | Cleanup completed; do not restore |
| `marketing-os` artifacts must not override scope | marketing-os has a different screen set and backend patterns | Confirmed: marketing-os is reference-only |

---

## 10. Product Scope Decision Questions

Before productization or backend/API work, the following must be decided:

| Question | Required decision |
|---|---|
| Which screens are V1 Core? | Recommend: the 10 core merchant journey screens |
| Which screens are V1 Support/Admin? | Recommend: templateEngine, multiPlatform, teamCollaboration, all admin/governance screens |
| Is `creatorStudio` V1 or Extended V1? | **Needs explicit decision** — significant investment suggests V1; scope determines timeline |
| Is `productIntelligence` V1 or Extended V1? | **Needs explicit decision** — linked to campaign flow via `onNavigate` |
| Is `contentReview` separate from `content` (ContentStudio)? | **Needs explicit decision** — both exist and are active; docs say merged but code says separate |
| Which screens require backend first? | All screens showing real data (store, products, campaigns, assets, analytics, publishing) — none currently |
| Which screens can remain mock until later? | Admin/governance screens can remain mock longer than core merchant screens |
| What is the first real implementation slice? | After scope approval: StoreSetup + ProductCatalog backend slice |

---

## 11. Recommended Decision

| Recommendation | Rationale |
|---|---|
| Preserve all 23 existing screens | No screen deletion; App.jsx is the authoritative evidence |
| Treat App.jsx as stronger evidence than README/docs where they diverge | Code is ahead of docs for 3 screens |
| Update README and screen_map after scope decision | Not in this gate; requires dedicated scope update PR |
| Do not reduce Nashir to match marketing-os | marketing-os is reference-only |
| Do not start marketing-os knowledge extraction until Nashir V1 scope is reconciled | Extraction must serve Nashir's own scope, not constrain it |
| Classify `productIntelligence`, `creatorStudio`, and `contentReview` in V1 Scope Decision Gate | Cannot classify without explicit project owner decision |
| After this gate: open V1 Scope Decision Gate or directly approve scope if owner confirms classifications | Document shows enough evidence to make decisions |

---

## 12. NO-GO Boundaries

```text
NO-GO: UI source code changes.
NO-GO: Screen deletion.
NO-GO: Screen renaming.
NO-GO: API integration.
NO-GO: Backend work.
NO-GO: OpenAPI changes.
NO-GO: Generated clients/types changes.
NO-GO: Runtime client.
NO-GO: Package/build/dependency changes.
NO-GO: marketing-os modifications.
NO-GO: marketing-os code copying.
NO-GO: Production/pilot readiness claims.
```

---

## 13. Required Next Gates

| Priority | Gate | Purpose |
|---:|---|---|
| 1 | **Nashir Product Scope Reconciliation Review Gate** | Reviews this reconciliation document; confirms inventory accuracy |
| 2 | **Nashir V1 Scope Decision Gate** | Explicitly classifies all 23 screens (V1 Core / Support / Admin / Extended / Post V1); resolves productIntelligence, creatorStudio, contentReview classification |
| 3 | **Nashir Productization Roadmap Gate** | Plans the path from mock UI to real implementation in approved priority order |
| 4 | **Marketing OS Knowledge Extraction for Nashir Planning Gate** | Plans what to extract from marketing-os only after Nashir's own scope is clear |
| 5 | **Nashir Backend/API Strategy Gate** | Defines backend, auth, database, API strategy for the approved V1 scope |
| 6 | **Nashir Real Implementation Slice 1 Gate** | First real backend/API/auth implementation slice (likely StoreSetup or ProductCatalog) |

**marketing-os extraction must wait until Nashir's own scope is clear. Backend/API strategy must follow approved product scope, not drive it.**

---

## 14. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** — no lint errors |
| `npm run build` | **PASSED** — built successfully |
| `git status --short` | Only new docs file untracked |
| Forbidden files check | **PASS** — no src/, package.json, package-lock.json, or build files modified |

---

## 15. GO / NO-GO Result

| Decision | Status |
|---|---|
| **Scope reconciliation gate complete** | **GO** |
| **CONDITIONAL GO: Nashir Product Scope Reconciliation Review Gate** | After this gate merges |
| **CONDITIONAL GO: Nashir V1 Scope Decision Gate** | After review gate |
| UI implementation in this PR | **NO-GO** |
| API/backend work in this PR | **NO-GO** |
| marketing-os extraction | **NO-GO until Nashir scope is clear** |
| Package/build changes in this PR | **NO-GO** |
| Production/pilot readiness | **NO-GO** |
