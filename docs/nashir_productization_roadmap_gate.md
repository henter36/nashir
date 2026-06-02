# Nashir Productization Roadmap Gate

| Field | Value |
|---|---|
| Gate type | Productization roadmap gate — documentation only |
| Status | Draft — pending review |
| Date | 2026-06-02 |
| Scope | Defines the execution roadmap for converting Nashir from a documented UI/mock product surface into a real product; no implementation authorized |
| UI/source code changes | NO |
| API/backend/package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is a documentation-only productization roadmap gate.

**No UI or source code changes are made.**

**No API, backend, package, or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

This gate defines roadmap sequencing only.

---

## 2. Inputs Reviewed

| Input | Finding |
|---|---|
| `README.md` | 23 screens documented in 4 classified sections; V1 Core journey defined; Extended V1 preserved; rename complete |
| `docs/screen_map.md` | 23 screens with V1 classification column; navigation groups updated; `productIntelligence`, `creatorStudio`, `contentReview` documented |
| Product Scope Reconciliation Gate (PR #62) | 20 docs vs 23 App.jsx screens; 3 undocumented active screens identified |
| Product Scope Reconciliation Review Gate (PR #63) | All criteria PASS; V1 Scope Decision Gate authorized |
| V1 Scope Decision Gate (PR #64) | 10 V1 Core, 2 V1 Support, 8 V1 Admin/Governance, 3 Extended V1 approved |
| V1 Scope Decision Review Gate (PR #65) | All criteria PASS; documentation update and productization roadmap authorized |
| V1 Scope Documentation Update Gate (PR #66) | README and screen_map updated to reflect 23-screen approved scope |
| `src/App.jsx` | 23 active screens; all `enabled: true`; `productIntelligence`, `creatorStudio`, `contentReview` are live routes |
| `src/pages/` | 23 page components; no orphaned files |
| `src/data/` | `creatorStudioFlowFixture.js`, `dashboardData.js`, `readinessFixture.js` — mock data fixtures |
| `src/generated/` | `creator-studio-openapi-types/` — generated types for Creator Studio |
| `package.json` | `name: nashir`; `generate:creator-studio-types` script present |

### Confirmed baseline

- **Approved scope:** 23 active screens preserved
- **Product source-of-truth:** Nashir UI in this repository
- **Current implementation state:** Mock/static from backend/API perspective; all data is frontend mock/seed
- **marketing-os:** Reference-only; not a runtime base; no extraction yet authorized

---

## 3. Productization Principle

| Principle | Detail |
|---|---|
| Journey-first | Nashir productization must follow the approved Nashir UI and journey. Backend/API must serve the product journey, not redefine it. |
| Non-destructive conversion | No screen may be deleted, downgraded, or hidden because backend is not ready. Mock UI should be converted to real data/API progressively, not replaced wholesale. |
| V1 Core priority | V1 must prioritize the merchant value loop before admin/governance depth. |
| marketing-os is optional reference | marketing-os may later provide ideas and patterns only through a separate extraction gate. It must not become Nashir's runtime base. |
| Progressive, not big-bang | Implementation should move screen-by-screen and data-domain-by-data-domain. Avoid large simultaneous backend deployments without clear scope. |
| Preserve Arabic-first UX | Existing UI identity, structure, and UX must be preserved during productization. Backend must not force UI restructuring. |

---

## 4. Approved Product Scope Baseline

### V1 Core — 10 screens

| Screen | Component | Backend priority |
|---|---|---|
| `dashboard` | `DashboardPage` | High — 1st slice (aggregation) |
| `storeSetup` | `StoreSetupPage` | High — 1st slice |
| `productCatalog` | `ProductCatalogPage` | High — 1st slice |
| `dataSourcesHub` | `DataSourcesHubPage` | High — 1st slice |
| `assetLibrary` | `AssetLibraryPage` | High — 1st slice |
| `campaigns` | `CampaignWizardPage` | High — 2nd slice |
| `campaignsList` | `CampaignsUnifiedPage` | High — 2nd slice |
| `content` | `ContentStudioPage` | High — 2nd slice |
| `publishingQueue` | `PublishingQueuePage` | High — 3rd slice |
| `analytics` | `AnalyticsUnifiedPage` | High — 3rd slice |

### V1 Support — 2 screens

| Screen | Component | Backend priority |
|---|---|---|
| `multiPlatform` | `MultiPlatformPage` | Medium — after core |
| `teamCollaboration` | `TeamCollaborationPage` | Medium — after core |

### V1 Admin/Governance — 8 screens

| Screen | Component | Backend priority |
|---|---|---|
| `templateEngine` | `TemplateEnginePage` | Lower — governance slice |
| `workflowRuns` | `WorkflowRunsPage` | Lower — governance slice |
| `systemAdmin` | `SystemAdminPage` | Lower — governance slice |
| `secrets` | `SecretsAndKeysPage` | Lower — threat model required first |
| `modelRouting` | `ModelRoutingPage` | Lower — governance slice |
| `promptGovernance` | `PromptGovernancePage` | Lower — governance slice |
| `costMonitor` | `CostMonitorPage` | Lower — governance slice |
| `settings` | `SettingsPage` | Lower — governance slice |

### Extended V1 — 3 screens

| Screen | Component | Backend priority |
|---|---|---|
| `productIntelligence` | `ProductIntelligencePage` | Extended — after product/catalog data is real |
| `creatorStudio` | `CreatorStudioPage` | Extended — re-evaluate for acceleration |
| `contentReview` | `ContentReviewPreviewUnifiedPage` | Extended — architectural decision required first |

### Post V1 — 0 active screens

---

## 5. Approved V1 Core Journey

```text
Dashboard
→ Store Setup
→ Product Catalog
→ Data Sources
→ Asset Library
→ Campaign Wizard
→ Campaigns
→ Content Studio
→ Publishing Queue
→ Analytics
```

This journey is the main productization driver. It does not mean every screen must be fully backend-backed in Slice 1. Productization should move domain-by-domain along this sequence.

---

## 6. Productization Phases

### Phase 0 — Stabilized UI Authority *(substantially complete)*

| Status | Complete |
|---|---|
| Repository identity | ✓ (renamed to `nashir`) |
| 23-screen scope approval | ✓ (PR #64) |
| Documentation alignment | ✓ (PR #66) |
| Productization roadmap | This gate |
| Productization roadmap review | Next gate |

### Phase 1 — Product Data Model & Backend/API Strategy

- Define real data domains for V1 Core screens.
- Decide backend ownership: workspace/multi-tenant model, persistence layer, API shape, auth/RBAC direction.
- No implementation yet.
- Required gates: Backend/API Strategy Gate, ERD/Data Model Gate, API Contract/OpenAPI Gate, Auth/RBAC/Workspace Identity Gate.

### Phase 2 — Core Data Foundation Slice

- Convert **Store Setup**, **Product Catalog**, **Data Sources**, and **Asset Library** from mock to real data.
- Prioritize persisted merchant/store/product/channel/asset state.
- Keep UI behavior stable; only swap mock data for real API responses.
- Dashboard read models may begin as derived aggregates from this slice.

### Phase 3 — Campaign & Content Execution Slice

- Convert **Campaign Wizard**, **Campaigns**, and **Content Studio** to real persisted flows.
- Define campaign records, draft content, asset linking, and status model.
- Maintain human-in-the-loop review; no auto-publishing.
- Content review/approval must be explicit before any publishing step.

### Phase 4 — Publishing Preparation & Analytics Slice

- Convert **Publishing Queue** to real schedule/status tracking.
- Must not imply automatic publishing without human confirmation.
- Convert **Analytics** to real read models; avoid false metrics if data sources are incomplete.
- Dashboard aggregation becomes real from this slice.

### Phase 5 — Support and Admin/Governance Slice

- Bring **MultiPlatform** and **TeamCollaboration** into real product operations.
- Sequence Admin/Governance screens after core data model is stable:
  - `settings`, `secrets` (vault reference only; threat model required)
  - `modelRouting`, `promptGovernance`, `costMonitor` (AI governance slice)
  - `workflowRuns`, `templateEngine`, `systemAdmin`
- Sensitive governance screens require completed Threat Modeling Gate before implementation.

### Phase 6 — Extended V1 Acceleration Review

- Re-evaluate `productIntelligence`, `creatorStudio`, `contentReview` for acceleration.
- Creator Studio has existing fixture, generated types, and package script — highest acceleration candidate.
- `contentReview`: requires architectural decision (standalone vs. integrated with Content Studio) before backend begins.
- `productIntelligence`: depends on product/catalog/campaign data being real.

---

## 7. Recommended Implementation Sequencing

| # | Phase | Scope area | Screens | Main output | Key dependencies | Risk if skipped |
|---|---|---|---|---|---|---|
| 1 | Phase 0 | Roadmap review | — | Approved roadmap baseline | This gate merges | No agreed implementation sequence |
| 2 | Phase 1 | Backend/API strategy | — | Strategy decision, ERD, API contract, auth model | Roadmap review gate | Backend binds wrong screens |
| 3 | Phase 1 | ERD / data model | — | Approved data model | Backend/API Strategy Gate | Schema drift, migration complexity |
| 4 | Phase 1 | API contract / OpenAPI | — | Approved API spec | ERD Gate | Client/UI mismatch |
| 5 | Phase 1 | Auth/RBAC/Workspace | — | Workspace isolation, role model | ERD + API Gate | Security risk, RBAC bypass |
| 6 | Phase 2 | Core data foundation | storeSetup, productCatalog, dataSourcesHub, assetLibrary | Real persisted merchant data | Phases 1 complete | Campaigns have no real data to reference |
| 7 | Phase 3 | Campaign & content | campaigns, campaignsList, content | Real campaign and content flows | Phase 2 complete | Publishing has no verified content |
| 8 | Phase 4 | Publishing & analytics | publishingQueue, analytics, dashboard | Real publishing status, real metrics | Phase 3 complete | False analytics, premature publishing |
| 9 | Phase 5 | Support | multiPlatform, teamCollaboration | Real collaboration and multi-channel | Phase 4 stable | Team features block production use |
| 10 | Phase 5 | Admin/governance | templateEngine, workflowRuns, systemAdmin, secrets, modelRouting, promptGovernance, costMonitor, settings | Governed AI/ops | Threat modeling gate + Phase 4 stable | Security exposure if rushed |
| 11 | Phase 6 | Extended V1 review | productIntelligence, creatorStudio, contentReview | Acceleration decision + backend plan | Phases 4–5 stable | Extended V1 stagnates indefinitely |
| 12 | Any point after Phase 1 | marketing-os extraction | — | Selective patterns/ideas only | Roadmap review + extraction planning gate | Product scope drift if started too early |

---

## 8. Backend/API Readiness Dependencies

Before any backend code is written or any API is integrated into the UI, the following gates must be completed:

| Gate | Purpose |
|---|---|
| **Backend/API Strategy Gate** | Decide backend ownership, technology, API shape, persistence, and runtime model |
| **ERD/Data Model Gate** | Define the authoritative data model for V1 Core entities |
| **API Contract/OpenAPI Gate** | Approve the API contract before UI calls or generated types |
| **Auth/RBAC/Workspace Identity Gate** | Define workspace isolation, role model, and auth mechanism |
| **Test Strategy Gate** | Define test coverage requirements before backend implementation |
| **Threat Modeling/Security Gate** | Required before implementing secrets, model routing, prompt governance, or sensitive APIs |
| **Data Migration/Storage Strategy Gate** | Required if new persistent storage is introduced |
| **Environment/Deployment Strategy Gate** | Required if runtime hosting is introduced for the backend |

**No backend code should be written before these are approved. No API integration should be added to the UI before the API contract is approved. No generated client should be added before the OpenAPI/tooling decision.**

---

## 9. Mock-to-Real Conversion Rules

| Rule | Detail |
|---|---|
| Replace mock data gradually | Do not remove mock UI until a real backend path exists |
| Preserve UI stability | Keep existing screens functional during conversion; do not break existing navigation |
| Add loading/error/empty states | When real API responses arrive, handle all states gracefully |
| No false production claims | Do not imply real publishing, real analytics, real AI generation, real integrations, or real automation until actually implemented and tested |
| Preserve Arabic-first UX | Arabic labels, RTL layout, and UI structure must remain intact during conversion |
| No big-bang replacement | Convert domain-by-domain; keep mock fallback until new path is verified |

---

## 10. Marketing OS Boundary and Extraction Timing

| Rule | Status |
|---|---|
| `marketing-os` remains reference-only | **CONFIRMED** |
| No extraction authorized by this gate | **CONFIRMED** |
| Extraction gate may open after roadmap review | CONDITIONAL — must be selective |
| Extracted items may include: governance patterns, backend/API ideas, RBAC concepts, OpenAPI concepts, cost/model governance, workflow ideas, operational lessons | Selective only |
| Extracted items must not reduce Nashir's 23-screen scope | **CONFIRMED** |
| `marketing-os` must not become Nashir runtime base | **CONFIRMED** |

---

## 11. Extended V1 Treatment

| Screen | Treatment | Notes |
|---|---|---|
| `productIntelligence` | Preserved active; deferred backend | Depends on product/catalog/campaign data becoming real; backend after Phase 2 |
| `creatorStudio` | Preserved active; **acceleration candidate** | Existing fixture + generated types + package script — most development-ready of the three; re-evaluate at Phase 6 |
| `contentReview` | Preserved active; **architectural decision required** | Merge with ContentStudio backend or standalone review pipeline? Decision must precede backend; resolve before Phase 3 content backend begins |

Extended V1 is not discarded work. All three screens remain visible, active, and preserved in scope. They should not block first core backend slices, but they also must not be indefinitely deferred without re-evaluation.

---

## 12. Admin/Governance Treatment

| Treatment | Detail |
|---|---|
| Not first priority | Admin/Governance screens should not dominate the first merchant value loop |
| Some may remain mock longer | While V1 Core backend is prioritized, admin screens may retain mock behavior |
| Security-sensitive screens require threat modeling | `secrets`, `modelRouting`, `promptGovernance`, `costMonitor`, `workflowRuns` must not be implemented before Threat Modeling Gate |
| Governance must protect, not block | Governance screens should protect the product from misuse but should not slow merchant value unnecessarily |

---

## 13. Productization Risks

| Risk | Severity | Control |
|---|---|---|
| Scope explosion — all 23 screens treated as equal Slice 1 targets | **HIGH** | V1 Core sequencing in Section 7; phased roadmap |
| Product drift — marketing-os extraction starts before Nashir roadmap is clear | **HIGH** | Extraction blocked until after roadmap review |
| False readiness — mock UI mistaken for working product | **HIGH** | Section 9 conversion rules; state boundaries |
| Backend mismatch — API designed from infrastructure rather than journey | **HIGH** | Journey-first principle in Section 3; ERD gate before code |
| Security exposure — secrets/model routing/prompt governance implemented without threat modeling | **HIGH** | Threat Modeling Gate required; Section 8 |
| Analytics trust risk — metrics shown without real data lineage | **MEDIUM** | Phase 4 sequencing; no analytics before Phase 3 data exists |
| Publishing risk — simulated publishing confused for real publishing | **HIGH** | Human-confirmation requirement; no auto-publish in V1 |
| Extended V1 stagnation — Creator Studio/contentReview/productIntelligence deferred indefinitely | **MEDIUM** | Phase 6 acceleration review; Creator Studio flagged as acceleration candidate |
| Backend/UI mismatch — UI integration added before API contract | **MEDIUM** | API Contract Gate required before UI integration |

---

## 14. Roadmap Decision

| Decision | Status |
|---|---|
| Approve roadmap sequencing as planning baseline | **APPROVED** |
| V1 Core is the first productization priority | **APPROVED** |
| Support/Admin/Governance depth deferred until core data model clarity | **APPROVED** |
| Extended V1 preserved; acceleration review at Phase 6 | **APPROVED** |
| marketing-os extraction blocked until separate gate | **APPROVED** |
| No implementation authorized in this PR | **CONFIRMED** |

---

## 15. Required Next Gates

| Priority | Gate | Purpose |
|---:|---|---|
| 1 | **Nashir Productization Roadmap Review Gate** | Reviews this roadmap before any strategy gates begin |
| 2 | **Nashir Backend/API Strategy Gate** | Decides backend ownership, technology, API shape, auth, and runtime model |
| 3 | **Nashir ERD/Data Model Gate** | Approves the authoritative data model for V1 Core |
| 4 | **Nashir API Contract/OpenAPI Gate** | Approves the API contract before UI integration or generated types |
| 5 | **Nashir Auth/RBAC/Workspace Identity Gate** | Defines workspace isolation and role model |
| 6 | **Nashir Test Strategy Gate** | Defines test coverage requirements |
| 7 | **Nashir Threat Modeling/Security Gate** | Required before sensitive API/governance implementation |
| 8 | **Nashir Data Migration/Storage Strategy Gate** | Required if new persistent storage is introduced |
| 9 | **Nashir Environment/Deployment Strategy Gate** | Required if runtime hosting is introduced for the backend |
| 10 | **Marketing OS Knowledge Extraction for Nashir Planning Gate** | After roadmap review; selective reference extraction only |
| 11 | **Nashir Real Implementation Slice 1 Planning Gate** | First real backend implementation scope (Store/Product/DataSources/Assets) |

**Marketing OS extraction may begin after roadmap review, but must remain selective and non-binding. Real implementation cannot start before Backend/API, ERD, API Contract, Test Strategy, and Threat Modeling gates are complete.**

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
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | Only new roadmap doc untracked |
| `git diff --stat` | Only `docs/nashir_productization_roadmap_gate.md` (new file) |
| Forbidden files check | **PASS** — no `src/`, `package.json`, `package-lock.json`, `README.md`, `docs/screen_map.md`, or `marketing-os` files modified |

---

## 18. GO / NO-GO Result

| Decision | Status |
|---|---|
| **Productization roadmap gate complete** | **GO** |
| **CONDITIONAL GO: Nashir Productization Roadmap Review Gate** | After this gate merges |
| **CONDITIONAL GO: Nashir Backend/API Strategy Gate** | After roadmap review gate |
| **CONDITIONAL GO: Marketing OS Knowledge Extraction Gate** | After roadmap review; selective only |
| UI implementation | **NO-GO** |
| API/backend work | **NO-GO** |
| `marketing-os` extraction in this PR | **NO-GO** |
| Package/build changes | **NO-GO** |
| Production/pilot readiness | **NO-GO** |
