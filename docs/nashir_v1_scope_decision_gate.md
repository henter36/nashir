# Nashir V1 Scope Decision Gate

| Field | Value |
|---|---|
| Gate type | V1 product scope decision gate — documentation only |
| Status | Decision proposed — pending review |
| Date | 2026-06-01 |
| Scope | Classifies all 23 active Nashir screens into V1 Core, V1 Support, V1 Admin/Governance, Extended V1, Post V1, or Needs Later Decision before productization and backend/API work begins |
| UI/source code changes | NO |
| API/backend/package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is a documentation-only V1 product scope decision gate.

**No UI or source code changes are made.**

**No API, backend, package, or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

This gate decides scope classification only.

---

## 2. Inputs Reviewed

### Confirmed baseline

| Source | Finding |
|---|---|
| PR #62 reconciliation document | 20 docs screens vs 23 App.jsx active screens; 3 undocumented active screens identified |
| PR #63 review document | All 18 criteria PASS; reconciliation is accurate; V1 Scope Decision Gate authorized |
| `README.md` | 20 documented screens; does not include `productIntelligence`, `creatorStudio`, `contentReview` |
| `docs/screen_map.md` | 20 documented screens; notes `content` absorbs review temporarily; updated groupings |
| `src/App.jsx` | 23 active screens; all `enabled: true`; lazy-loaded; `productIntelligence`, `creatorStudio`, `contentReview` are live routes |
| `src/pages/` | 23 `.jsx` page components; no orphaned files |
| `src/data/` | `creatorStudioFlowFixture.js`, `dashboardData.js`, `readinessFixture.js` |
| `src/generated/` | `creator-studio-openapi-types/` — generated types for Creator Studio |
| `package.json` | `name: nashir`; `generate:creator-studio-types` script present |

### Confirmed inventory

- **20 screens** documented in `README.md` and `docs/screen_map.md`
- **23 active screens** in `src/App.jsx`
- **23 page components** in `src/pages/`
- **No orphaned page files**
- **3 active but undocumented screens:** `productIntelligence`, `creatorStudio`, `contentReview`

---

## 3. Classification Rules

| Classification | Meaning |
|---|---|
| **V1 Core** | Required for the merchant's primary Nashir value loop: store setup, product readiness, campaign creation, content production, publishing preparation, performance understanding. Must be prioritized in first backend slice. |
| **V1 Support** | Supports the core merchant journey. Remains visible and active. Can be sequenced after the first backend slice. Should not be deleted. |
| **V1 Admin/Governance** | Operational, governance, configuration, model, cost, secret, or workflow controls. Important for platform safety. Not the merchant's primary first journey. Some can remain mock while V1 Core backend is prioritized. |
| **Extended V1** | Valuable, aligned, and active. Can be implemented after the minimum V1 loop. Must not be deleted. Requires explicit future implementation sequencing. |
| **Post V1** | Not required for V1. Deferred. Used only if evidence shows the feature is clearly beyond V1 scope. |
| **Needs Later Decision** | Evidence insufficient for classification. Reserved only when necessary. |

---

## 4. Screen Classification Matrix

| Screen key | Arabic label | Component | README/screen_map | Evidence | **Decision** | Rationale | Backend priority |
|---|---|---|---|---|---|---|---|
| `dashboard` | لوحة التحكم | `DashboardPage` | Documented | Entry point; `dashboardData.js` fixture; `onNavigate` to 8 surfaces | **V1 Core** | Primary entry and journey overview | High — 1st slice |
| `storeSetup` | إعداد المتجر | `StoreSetupPage` | Documented | Required before campaign creation; store identity and business profile | **V1 Core** | Foundation of Nashir value loop | High — 1st slice |
| `productCatalog` | كتالوج المنتجات | `ProductCatalogPage` | Documented | Product/service records for campaigns | **V1 Core** | Core merchant data surface | High — 1st slice |
| `dataSourcesHub` | مركز المصادر البياناتية | `DataSourcesHubPage` | Documented | Data source/integration readiness visibility | **V1 Core** | Channel readiness is required before campaign targeting | High — 1st slice |
| `assetLibrary` | مكتبة الأصول | `AssetLibraryPage` | Documented | Creative assets for content and campaigns | **V1 Core** | Assets are required for content production | High — 1st slice |
| `campaigns` | معالج الحملات | `CampaignWizardPage` | Documented | Main campaign creation; accepts `campaignOrigin` and `onNavigate` | **V1 Core** | Primary campaign creation flow | High — 1st slice |
| `campaignsList` | الحملات | `CampaignsUnifiedPage` | Documented | Campaign management; accepts `onCreateCampaign` | **V1 Core** | Campaign list and management is inseparable from creation | High — 1st slice |
| `content` | المحتوى | `ContentStudioPage` | Documented | Content creation and editing | **V1 Core** | Content production is the core merchant output | High — 1st slice |
| `publishingQueue` | جدولة النشر | `PublishingQueuePage` | Documented | Publishing schedule; must not imply real publishing yet | **V1 Core** | Publishing workflow completes the merchant loop | High — 1st slice |
| `analytics` | التحليلات | `AnalyticsUnifiedPage` | Documented | Unified analytics; replaces standalone smart analytics | **V1 Core** | Performance understanding closes the value loop | High — 1st slice |
| `multiPlatform` | متعدد القنوات | `MultiPlatformPage` | Documented | Channel readiness and multi-platform publishing governance | **V1 Support** | Supports publishing but can follow after core slice | Medium — 2nd slice |
| `teamCollaboration` | تعاون الفريق | `TeamCollaborationPage` | Documented | Team roles, comments, review collaboration | **V1 Support** | Collaboration is product-relevant but should not block merchant loop | Medium — 2nd slice |
| `templateEngine` | محرك القوالب | `TemplateEnginePage` | Documented | Reusable content/template concepts | **V1 Admin/Governance** | Template governance; supports prompt versioning later | Lower — governance slice |
| `workflowRuns` | تشغيلات النظام | `WorkflowRunsPage` | Documented | Simulated workflow runs and statuses | **V1 Admin/Governance** | Operational monitoring; can remain mock while core is built | Lower — governance slice |
| `systemAdmin` | إدارة النظام | `SystemAdminPage` | Documented | Administrative configuration mock | **V1 Admin/Governance** | Admin configuration; must remain clearly non-production | Lower — governance slice |
| `secrets` | الأسرار والمفاتيح | `SecretsAndKeysPage` | Documented | Mock secrets/key governance; must never store real values | **V1 Admin/Governance** | Required for provider key governance; sensitive boundary | Lower — governance slice |
| `modelRouting` | توجيه النماذج | `ModelRoutingPage` | Documented | Model-provider routing policy simulation | **V1 Admin/Governance** | Required for AI provider management in V1 | Lower — governance slice |
| `promptGovernance` | حوكمة المطالبات | `PromptGovernancePage` | Documented | Prompt lifecycle, risk, review, versioning simulation | **V1 Admin/Governance** | Required for prompt safety in V1 | Lower — governance slice |
| `costMonitor` | مراقبة التكلفة | `CostMonitorPage` | Documented | AI cost tracking and budget guardrails simulation | **V1 Admin/Governance** | Required for operational cost control | Lower — governance slice |
| `settings` | الإعدادات | `SettingsPage` | Documented | General prototype settings | **V1 Admin/Governance** | Required for user/workspace configuration | Lower — governance slice |
| `productIntelligence` | استوديو تحليل المنتج | `ProductIntelligencePage` | **Missing from docs** | Active screen; companion `.css`; `onNavigate` to `campaigns` — links product analysis to campaign creation | **Extended V1** | Valuable intelligence surface; linked to core flow; not required for minimum merchant loop; should be prioritized early in Extended V1 | Extended — after core |
| `creatorStudio` | استوديو صانع المحتوى | `CreatorStudioPage` | **Missing from docs** | Active screen; dedicated `creatorStudioFlowFixture.js`; `src/generated/creator-studio-openapi-types/`; `generate:creator-studio-types` script; `onNavigate` — significant development investment | **Extended V1** | Highest investment of the 3 undocumented screens; likely to become high-priority Extended V1; must not be deleted | Extended — after core; re-evaluate for acceleration |
| `contentReview` | المراجعة والمعاينة | `ContentReviewPreviewUnifiedPage` | **Missing from docs** (screen_map implies absorbed into content) | Active live screen; separate from `ContentStudioPage`; both are active in App.jsx navigation | **Extended V1** | Separate review/preview surface that went beyond what screen_map documented; valuable but not required for minimum content production loop | Extended — after core; re-evaluate with content sequencing |

---

## 5. Approved V1 Core Journey

```text
Dashboard
→ Store Setup
→ Product Catalog
→ Data Sources
→ Asset Library
→ Campaign Wizard
→ Campaigns (list + detail)
→ Content Studio
→ Publishing Queue
→ Analytics
```

### Key clarifications

- This is the minimum merchant value loop: a Nashir merchant can set up, build a campaign, produce content, queue for publishing, and measure performance.
- This journey preserves the current Nashir product direction without requiring marketing-os extraction before productization planning.
- Not every V1 Core screen requires full backend implementation in Slice 1 simultaneously. Backend strategy will sequence within V1 Core.
- V1 Core does not mean "finished" or "production-ready." It means these screens are the first implementation priority.

---

## 6. V1 Support Scope

| Screen | Rationale |
|---|---|
| `multiPlatform` | Channel/multi-platform behavior supports publishing and campaign operations; can be sequenced after the first backend slice without breaking the core merchant loop |
| `teamCollaboration` | Collaboration is product-relevant and merchants will need it; should not block the minimum merchant value loop but should follow shortly after |

---

## 7. V1 Admin/Governance Scope

The 8 Admin/Governance screens are:
`templateEngine`, `workflowRuns`, `systemAdmin`, `secrets`, `modelRouting`, `promptGovernance`, `costMonitor`, `settings`

### Decisions

- These screens must not drive the merchant journey before V1 Core is established.
- They are necessary for controlled operation and future provider/AI/workflow governance.
- Some can remain mock/static while V1 Core backend is prioritized.
- `secrets` has a critical non-negotiable constraint: must never store real secret values in frontend state — even in mock form.
- `modelRouting` and `promptGovernance` will depend on AI provider integration decisions; they can remain simulated until a dedicated AI governance slice is approved.

---

## 8. Extended V1 Scope

| Screen | Classification | Implementation notes |
|---|---|---|
| `productIntelligence` | **Extended V1** | Connected to campaign creation via `onNavigate`; provides product analysis intelligence that enriches campaign targeting; not required for minimum loop but adds significant value early; should be accelerated once store and product catalog backend exists |
| `creatorStudio` | **Extended V1** | Most significant development investment of the three; has dedicated mock data, generated OpenAPI types, companion CSS, and a package script; likely to become high-priority Extended V1 once content studio backend exists; must be re-evaluated for acceleration rather than deferral |
| `contentReview` | **Extended V1** | Separate content review/preview surface; exists despite screen_map suggesting it was absorbed; needs explicit decision on whether it merges with `ContentStudio` or remains a standalone review surface; this decision should be made before its backend implementation begins |

### Extended V1 commitments

- All three screens are preserved.
- None are treated as mistakes or temporary scaffolding.
- All three should be reflected in `README.md` and `docs/screen_map.md` after the V1 Scope Documentation Update Gate.
- Creator Studio's `generate:creator-studio-types` capability must be maintained and should not be regressed.

---

## 9. Post V1 Scope

**No active screen is classified as Post V1 in this decision.**

All 23 active screens are preserved. Post V1 is reserved for future features not currently active or not supported by current UI evidence. Any future feature proposed as Post V1 requires its own explicit gate decision.

---

## 10. Backend/API Priority Implications

### V1 Core backend priority (first backend/API strategy)

| Priority | Backend domain | Serves screens |
|---|---|---|
| 1 | Store identity / store profile | `storeSetup` |
| 2 | Product catalog | `productCatalog` |
| 3 | Data sources / channel connections | `dataSourcesHub` |
| 4 | Asset library metadata | `assetLibrary` |
| 5 | Campaign creation and records | `campaigns`, `campaignsList` |
| 6 | Content studio artifacts | `content` |
| 7 | Publishing queue state | `publishingQueue` |
| 8 | Analytics read models | `analytics` |
| 9 | Dashboard aggregation | `dashboard` |

### V1 Support backend (second slice)

| Domain | Serves screens |
|---|---|
| Multi-channel publishing coordination | `multiPlatform` |
| Team membership and collaboration records | `teamCollaboration` |

### V1 Admin/Governance backend (dedicated governance slice)

| Domain | Serves screens |
|---|---|
| Workspace settings and user preferences | `settings` |
| Secret/key vault references (external vault only) | `secrets` |
| Model routing policy | `modelRouting` |
| Prompt governance registry | `promptGovernance` |
| AI cost metering | `costMonitor` |
| Workflow orchestration | `workflowRuns` |
| Template registry | `templateEngine` |
| System administration | `systemAdmin` |

### Extended V1 backend (deferred until sequence approved)

| Domain | Serves screens |
|---|---|
| Product intelligence analysis | `productIntelligence` |
| Creator Studio AI session management | `creatorStudio` |
| Content review/preview pipeline | `contentReview` |

---

## 11. Documentation Update Implications

`README.md` and `docs/screen_map.md` must be updated in a later **V1 Scope Documentation Update Gate** to:

- Add `productIntelligence`, `creatorStudio`, and `contentReview` to the documented screen inventory
- Mark each with their V1 classification (Extended V1)
- Update navigation groups to include the three new documented screens
- Update the core journey section to reflect this decision

**This gate does not update README or screen_map broadly.** This gate is the decision record. A dedicated documentation update gate follows.

---

## 12. Marketing OS Boundary

| Rule | Status |
|---|---|
| `marketing-os` remains reference-only | **CONFIRMED** |
| No `marketing-os` extraction authorized by this gate | **CONFIRMED** |
| Extraction may begin only after this gate merges AND a separate Marketing OS Knowledge Extraction for Nashir Planning Gate is opened | **CONFIRMED** |
| Any extracted items must enrich Nashir and must not reduce Nashir's approved 23-screen product scope | **CONFIRMED** |

---

## 13. Risks and Controls

| Risk | Severity | Control |
|---|---|---|
| Backend starts before this decision, binding the wrong screens | **HIGH** | This gate must merge before backend/API strategy begins |
| Extended V1 screens ignored or lost | **MEDIUM** | All three explicitly preserved and documented here |
| All 23 screens treated as equal V1 Core, making scope too large | **HIGH** | 10 V1 Core, 2 V1 Support, 8 V1 Admin/Governance, 3 Extended V1 — clear sequencing |
| `marketing-os` extraction starts before scope is clear | **MEDIUM** | Extraction blocked until this gate merges |
| `README`/`screen_map` not updated, future contributors miss 3 active screens | **MEDIUM** | V1 Scope Documentation Update Gate must follow |
| Admin/governance screens dominate early implementation | **MEDIUM** | Backend priority order in Section 10 explicitly deprioritizes governance until core is stable |
| Creator Studio's investment is lost due to Extended V1 classification | **MEDIUM** | Section 8 explicitly notes Creator Studio should be re-evaluated for acceleration |

---

## 14. Decision Summary

| Classification | Count | Screens |
|---|---|---|
| **V1 Core** | 10 | dashboard, storeSetup, productCatalog, dataSourcesHub, assetLibrary, campaigns, campaignsList, content, publishingQueue, analytics |
| **V1 Support** | 2 | multiPlatform, teamCollaboration |
| **V1 Admin/Governance** | 8 | templateEngine, workflowRuns, systemAdmin, secrets, modelRouting, promptGovernance, costMonitor, settings |
| **Extended V1** | 3 | productIntelligence, creatorStudio, contentReview |
| **Post V1** | 0 | (none — no active screen classified Post V1) |
| **Total** | **23** | All active screens preserved |

**No active screen is deleted, deprecated, or reduced.**

V1 Core is the first backend/API/productization priority.

`marketing-os` extraction is blocked until after this decision merges.

---

## 15. Required Next Gates

| Priority | Gate | Purpose |
|---:|---|---|
| 1 | **Nashir V1 Scope Decision Review Gate** | Reviews and accepts or challenges this scope classification |
| 2 | **Nashir V1 Scope Documentation Update Gate** | Updates `README.md` and `docs/screen_map.md` with the 3 undocumented screens and their V1 classification |
| 3 | **Nashir Productization Roadmap Gate** | Plans the full path from mock UI to real product in approved V1 Core priority order |
| 4 | **Nashir Backend/API Strategy Gate** | Defines backend, auth, database, API, and deployment strategy for V1 Core screens |
| 5 | **Marketing OS Knowledge Extraction for Nashir Planning Gate** | Plans what to study and adopt from `marketing-os` now that Nashir's scope is decided |
| 6 | **Nashir Real Implementation Slice 1 Gate** | First real backend implementation slice (likely Store Setup + Product Catalog) |

**Marketing OS extraction must come after V1 scope decision is merged and documentation is updated. Backend/API strategy must follow approved V1 Core, not drive it.**

---

## 16. NO-GO Boundaries

```text
NO-GO: UI source code changes.
NO-GO: Navigation changes.
NO-GO: Screen deletion.
NO-GO: Screen renaming.
NO-GO: API integration.
NO-GO: Backend work.
NO-GO: OpenAPI.
NO-GO: Generated clients/types.
NO-GO: Runtime client.
NO-GO: Package/build/dependency changes.
NO-GO: marketing-os modifications.
NO-GO: marketing-os extraction.
NO-GO: Production/pilot readiness claims.
```

---

## 17. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** — no lint errors |
| `npm run build` | **PASSED** — built successfully |
| `git status --short` | Only new scope decision doc untracked |
| `git diff --stat` | Only `docs/nashir_v1_scope_decision_gate.md` (new file) |
| Forbidden files check | **PASS** — no `src/`, `package.json`, `package-lock.json`, build, or `marketing-os` files modified |

---

## 18. GO / NO-GO Result

| Decision | Status |
|---|---|
| **V1 scope decision gate complete** | **GO** |
| **CONDITIONAL GO: Nashir V1 Scope Decision Review Gate** | After this gate merges |
| **CONDITIONAL GO: V1 Scope Documentation Update Gate** | After review gate merges |
| UI implementation | **NO-GO** |
| API/backend work | **NO-GO** |
| `marketing-os` extraction | **NO-GO until this gate merges** |
| Package/build changes | **NO-GO** |
| Production/pilot readiness | **NO-GO** |
