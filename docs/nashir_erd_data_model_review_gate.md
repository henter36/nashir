# Nashir ERD/Data Model Review Gate

| Field | Value |
|---|---|
| Gate type | ERD/Data Model review gate — documentation only |
| Status | Review complete |
| Date | 2026-06-02 |
| Scope | Reviews PR #71 / `docs/nashir_erd_data_model_gate.md` for structural sufficiency before authorizing downstream planning gates |
| Prerequisite | `docs/nashir_erd_data_model_gate.md` — merged (PR #71) |
| UI/source code changes | NO |
| API/backend/package/build changes | NO |
| SQL/schema/migration changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is a documentation-only ERD/Data Model review gate.

**This gate reviews `docs/nashir_erd_data_model_gate.md`. It does not implement or change any code.**

**No backend or API implementation is performed.**

**No SQL schema, database migration, or storage implementation is performed.**

**No OpenAPI or API contract is created.**

**No auth/RBAC implementation is performed.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

This gate reviews ERD/Data Model sufficiency only.

---

## 2. Reviewed Inputs

| Input | Finding |
|---|---|
| `docs/nashir_erd_data_model_gate.md` | Primary review input — 21 sections; 17 V1 Core logical entities; 3-slice sequencing; field-level logical model; relationship tree; candidate entity lists; compliance notes; risk register |
| `README.md` | 23 screens in 4 classified groups (V1 Core / V1 Support / V1 Admin/Governance / Extended V1); V1 Core journey documented; no backend |
| `docs/screen_map.md` | 23 screens with V1 Classification; navigation groups current; screen IDs confirmed |
| Backend/API Strategy Gate (PR #69) | Nashir-first direction; REST/OpenAPI; PostgreSQL-compatible; Auth/RBAC before API Contract; PDPL/GCC compliance assessment required |
| Backend/API Strategy Review Gate (PR #70) | All 42 criteria PASS; ERD Gate and Auth/RBAC Gate authorized |
| Productization Roadmap Gate (PR #67) | 7-phase roadmap; Phase 2 targets Store/Profile/Product/DataSources/Assets as Slice 1 |
| Productization Roadmap Review Gate (PR #68) | All 28 criteria PASS; sequencing confirmed |
| V1 Scope Decision Gate (PR #64) | 10 V1 Core, 2 V1 Support, 8 V1 Admin/Governance, 3 Extended V1 approved |
| V1 Scope Decision Review Gate (PR #65) | All 21 criteria PASS |
| V1 Scope Documentation Update Gate (PR #66) | 23-screen scope fully documented in README and screen_map |
| `src/App.jsx` | 23 active screens; all `enabled: true`; V1 Core journey: Dashboard → StoreSetup → ProductCatalog → DataSourcesHub → AssetLibrary → Campaigns → CampaignsList → Content → PublishingQueue → Analytics |
| `src/pages/` | 23 page components confirmed; no orphaned files |
| `src/data/` | `creatorStudioFlowFixture.js`, `dashboardData.js`, `readinessFixture.js` — mock data only; no real backend |
| `src/generated/` | `creator-studio-openapi-types/` — generated types; no real backend; no Nashir V1 core generated client |
| `package.json` | `name: nashir`; `generate:creator-studio-types` script; no backend runtime scripts |

### Confirmed baseline

- 23-screen scope is documented and approved.
- V1 Core is the first backend priority.
- Backend/API strategy has been reviewed and approved (PR #70).
- ERD/Data Model (PR #71) exists and must be reviewed before Auth/RBAC and OpenAPI gates.
- No real backend implementation exists.
- All data is mock/seed inside the frontend.
- marketing-os remains reference-only.

---

## 3. Review Criteria Assessment

### Scope and product alignment

| Criterion | Status | Evidence |
|---|---|---|
| ERD preserves the approved 23-screen Nashir scope | **PASS** | Section 4 maps all 23 screens to data domains across V1 Core, Support, Admin/Governance, and Extended V1; no screen is absent or removed |
| ERD correctly prioritizes V1 Core before Support/Admin/Extended V1 | **PASS** | Sections 5 and 8: all V1 Core entities marked High — Slice 1/2/3; Support and Admin/Governance candidates are explicitly deferred; Section 3 principle: V1 Core first |
| ERD maps approved screens to data domains clearly | **PASS** | Section 4 table: each of the 23 screens listed with its primary data domain; domains are coherent with screen purpose |
| ERD follows Nashir's UI journey instead of redefining product scope | **PASS** | Section 3 principle: "journey-first model — data model must follow Nashir's approved product journey, not redefine UI scope or introduce entities not required by approved screens" |
| ERD does not copy or depend on marketing-os entity model | **PASS** | Section 17 confirms marketing-os remains reference-only; entities are derived from Nashir's 23-screen journey |

### Workspace and identity

| Criterion | Status | Evidence |
|---|---|---|
| Workspace is correctly defined as the root scope for merchant/business data | **PASS** | Section 5: "Root tenant boundary; scopes all merchant/business records"; Section 11: "All merchant/business entities must be workspace-scoped" |
| User is correctly modeled as potentially global | **PASS** | Section 5: "Global — belongs to Workspaces via WorkspaceMember"; Section 8: "Global (accessed via WorkspaceMember)" |
| WorkspaceMember correctly links User to Workspace | **PASS** | Section 5: "Links User to Workspace with role"; Section 7 identity relationships |
| WorkspaceMember role details are correctly deferred to Auth/RBAC Gate | **PASS** | Section 5: "Role/permission placeholder until Auth/RBAC Gate"; Section 9: `rolePlaceholder — status (Auth/RBAC Gate finalizes)` |
| Workspace scoping is identified as mandatory for merchant/business entities | **PASS** | Section 11: "All business records workspace-scoped — every merchant/business record must include workspace context" |
| Cross-workspace leakage is correctly identified as a critical risk | **PASS** | Section 11: "Cross-workspace leakage is critical security risk — no business record may be accessible from a different workspace context" |

### Core entity model

| Criterion | Status | Evidence |
|---|---|---|
| 17 V1 Core logical entities are defined | **PASS** | Section 5 lists all 17: Workspace, User, WorkspaceMember, StoreProfile, Product, DataSource, ChannelConnection, Asset, Campaign, CampaignBrief, CampaignContentItem, ContentDraft, ContentApproval, PublishingJob, PublishingStatus, AnalyticsSnapshot, AuditEvent |
| Slice 1/Phase 2 entities are appropriate: Workspace, User, WorkspaceMember, StoreProfile, Product, DataSource, ChannelConnection, Asset | **PASS** | Section 5 and Section 8: all eight entities marked "High — Slice 1"; form the core data foundation |
| Slice 2/Phase 3 entities are appropriate: Campaign, CampaignBrief, CampaignContentItem, ContentDraft, ContentApproval | **PASS** | Section 5 and Section 8: all five entities marked "High — Slice 2"; model the campaign and content lifecycle |
| Slice 3/Phase 4 entities are appropriate: PublishingJob, PublishingStatus, AnalyticsSnapshot | **PASS** | Section 5 and Section 8: all three entities marked "High — Slice 3"; model publishing and analytics |
| AuditEvent is correctly cross-cutting and append-only in concept | **PASS** | Section 5: "Append-only audit trail for sensitive operations"; Section 8 security sensitivity HIGH; Section 13: "Must be planned for sensitive operations; append-only; must not be modifiable after creation" |
| Core entities are logical only and not treated as SQL tables | **PASS** | Section 3 principle: "Candidates are not SQL tables — candidate entities must not be treated as SQL tables until Storage/Migration Gate approves storage decisions"; Section 9 note: "These fields are logical, not SQL column definitions" |

### Relationship consistency

| Criterion | Status | Evidence |
|---|---|---|
| Workspace relationships are coherent | **PASS** | Section 7 workspace-centric tree: Workspace → WorkspaceMember, StoreProfile, Product, DataSource, ChannelConnection, Asset, Campaign, AnalyticsSnapshot, AuditEvent |
| User / WorkspaceMember relationship is coherent | **PASS** | Section 7: "User may belong to many Workspace records through WorkspaceMember"; identity relationships documented |
| StoreProfile belongs to Workspace | **PASS** | Section 5 and Section 8: "belongs to Workspace"; workspace-scoped YES |
| Product belongs to Workspace and can link to Campaign and Asset | **PASS** | Section 5: "may link to Assets; may link to Campaigns"; Section 7 cross-entity links table |
| DataSource and ChannelConnection relationship is coherent | **PASS** | Section 7: DataSource → ChannelConnection (optional reference); Section 5: "may link to ChannelConnection" |
| ChannelConnection includes optional `dataSourceId` in field-level model | **PASS** | Section 9: `dataSourceId — relationship (optional)` listed after `workspaceId` |
| Asset includes optional `productId` and optional `campaignContentItemId` in field-level model | **PASS** | Section 9: `productId — relationship (optional)` and `campaignContentItemId — relationship (optional)` both present |
| Campaign links Product, CampaignBrief, CampaignContentItem, PublishingJob, and AnalyticsSnapshot coherently | **PASS** | Section 7 tree and Section 5: Campaign → CampaignBrief, CampaignContentItem, PublishingJob; Section 8 confirms Campaign → AnalyticsSnapshot link |
| CampaignContentItem / ContentDraft / ContentApproval supports human-in-the-loop review | **PASS** | Section 5: "ContentApproval — Human review/approval record for ContentDraft"; Section 7 nesting; Section 13: "Human confirmation required; no auto-approval or auto-publish" |
| `contentReview` architecture remains correctly open: separate backend surface vs integrated content approval | **PASS** | Section 5: "contentReview architecture decision still open"; Section 6: ReviewDecision notes "Architectural decision open: standalone vs. integrated with ContentApproval" |
| PublishingJob and PublishingStatus do not imply real publishing | **PASS** | Section 5: "no auto-publish in V1"; Section 9 PublishingJob status includes `simulated`; Section 10: "Publishing statuses must not imply real publishing before integration approval" |
| AnalyticsSnapshot preserves source lineage | **PASS** | Section 9: `sourceSummary — operational metadata (data lineage)`; Section 12: "sourceSummary or equivalent field must distinguish real data from mock/partial/stale" |

### Field-level logical model

| Criterion | Status | Evidence |
|---|---|---|
| Required logical fields are present for all V1 Core entities | **PASS** | Section 9 defines field-level model for all 17 V1 Core entities; each has identity, workspace/ownership, key operational, status, and audit fields |
| Field-level model avoids SQL types and implementation details | **PASS** | Section 9 note: "These fields are logical, not SQL column definitions. Exact names, types, nullability, and indexes are deferred to Storage/Migration Gate and API Contract Gate" |
| WorkspaceMember uses `active / invited / suspended` consistently | **PASS** (Section 9) / **MINOR INCONSISTENCY** (Section 10) | Section 9 field-level model: `status — status: active / invited / suspended` ✓; Section 10 enum candidates table: `active · invited · disabled` (stale — not updated during field-level remediation). Non-blocking: the field-level model in Section 9 is correct and authoritative |
| AnalyticsSnapshot includes status: `available / partial / stale / unavailable` | **PASS** | Section 9: `status — status: available / partial / stale / unavailable` confirmed |
| ChannelConnection does not contain credentials directly | **PASS** | Section 5: "No raw credentials"; Section 13: "must not be stored as plain fields on ChannelConnection" |
| Asset uses `storageReferencePlaceholder` and defers storage details to Storage Gate | **PASS** | Section 9: `storageReferencePlaceholder — operational (Storage Gate finalizes)` |
| Auth/RBAC may refine user/member fields later | **PASS** | Section 9 note; Section 5: "Auth/RBAC Gate defines role carrier" |
| API Contract/OpenAPI may refine request/response models later | **PASS** | Section 9 note: "API Contract Gate and Storage Gate finalize"; Section 3 principle: "API guidance, not contract" |

### Status and enum candidates

| Criterion | Status | Evidence |
|---|---|---|
| Status candidates are documented as non-final | **PASS** | Section 10 header note: "These are candidates only. Final status enums belong to API Contract/OpenAPI Gate and implementation planning" |
| Campaign statuses are adequate as planning candidates | **PASS** | Section 10: `draft · generating · review · ready · scheduled · active · paused · completed · archived` — covers the full campaign lifecycle |
| ContentDraft statuses support review flow | **PASS** | Section 10: `draft · ready_for_review · approved · rejected · archived` — consistent with ContentApproval decision states |
| PublishingJob statuses distinguish simulated from real publishing | **PASS** | Section 10: `draft · scheduled · queued · simulated · failed · cancelled`; Section 10 note: "`simulated` must remain clearly distinct from any future real publishing status" |
| AnalyticsSnapshot statuses distinguish available, partial, stale, unavailable | **PASS** | Section 10: `available · partial · stale · unavailable` — all four states present |
| Final enums are correctly deferred to API Contract/OpenAPI and implementation planning | **PASS** | Section 10 header note confirmed |

### Security and compliance

| Criterion | Status | Evidence |
|---|---|---|
| IntegrationCredential is not modeled as plain fields on ChannelConnection | **PASS** | Section 5: "No raw credentials; credential storage is a separate sensitive concern"; Section 13: "must not be stored as plain fields on ChannelConnection; requires dedicated IntegrationCredential candidate with vault reference model" |
| Credential storage is deferred to Security, Storage, and Threat Modeling gates | **PASS** | Section 13: "Security, Storage, and Threat Modeling gates required" |
| PDPL/GCC-relevant data residency and compliance are included as future evaluation requirements | **PASS** | Section 13: "Personal data and merchant data must be evaluated against PDPL and GCC-relevant data protection requirements where applicable — future evaluation; no compliance is claimed here" |
| AuditEvent supports accountability planning | **PASS** | Section 5: "Append-only audit trail for sensitive operations"; Section 8: HIGH security sensitivity |
| Governance-sensitive candidates are identified: PromptVersion, ModelRoute, UsageCostEvent, WorkflowRun, IntegrationCredential | **PASS** | Section 6 V1 Admin/Governance candidates table documents all five with HIGH/MEDIUM security sensitivity |
| The ERD does not claim legal compliance is complete | **PASS** | Section 13: "no compliance is claimed here"; Section 1: "No production readiness is claimed" |

### Support/Admin/Extended candidates

| Criterion | Status | Evidence |
|---|---|---|
| Support candidates are documented but deferred | **PASS** | Section 6: Comment, ActivityLog, CollaborationAssignment, PlatformCapability documented as V1 Support candidates; deferred implementation |
| Admin/Governance candidates are documented but threat-model dependent | **PASS** | Section 6: nine Admin/Governance candidates listed; IntegrationCredential, PromptVersion, ModelRoute, AdminAuditEvent marked HIGH security — "Threat Modeling required" |
| Extended V1 candidates are preserved, not discarded | **PASS** | Section 6: "All Support/Admin/Extended candidates are: Candidate only — not first-slice implementation commitments. Must not block V1 Core data foundation" |
| CreatorStudioArtifact remains an acceleration candidate | **PASS** | Section 6: "Has existing fixture and generated types; acceleration candidate" |
| ReviewDecision / PreviewState do not conflict with ContentApproval without future architecture decision | **PASS** | Section 6: "ReviewDecision — Architectural decision open: standalone vs. integrated with ContentApproval" — correctly deferred, not resolved prematurely |
| Candidate entities are not first-slice commitments | **PASS** | Section 6 final note: "Candidate only — not first-slice implementation commitments. Must not block V1 Core data foundation. Sensitive candidates require Threat Modeling Gate before implementation" |

### Next-gate readiness

| Criterion | Status | Evidence |
|---|---|---|
| ERD provides enough basis to open Auth/RBAC/Workspace Identity Gate | **PASS** | Section 16: "Must validate User, WorkspaceMember, and role assumptions; must confirm workspace isolation model"; Section 18 Priority 2 |
| ERD provides enough basis to inform API Contract/OpenAPI Gate later | **PASS** | Section 16: "Must use this ERD as input; may refine response/request models; must reflect workspace scoping, auth headers, and permission requirements" |
| ERD provides enough basis for Test Strategy Gate | **PASS** | Section 16: "Must cover workspace isolation, entity relationships, status transitions, and human-in-the-loop flows" |
| ERD provides enough basis for Threat Modeling/Security Gate | **PASS** | Section 16: "Must evaluate credential, publishing, AI/governance, audit, and workspace isolation risks from this model" |
| ERD provides enough basis for Data Migration/Storage Strategy Gate later | **PASS** | Section 16: "Must convert logical entities into concrete storage decisions; PostgreSQL-compatible as planned direction" |
| ERD provides enough basis for Environment/Deployment Strategy Gate later | **PASS** | Section 18 Priority 7 authorization |
| ERD does not authorize Real Implementation Slice 1 yet | **PASS** | Section 19 NO-GO list; Section 18: Slice 1 Planning Gate is Priority 9 — after all prerequisite gates |

### NO-GO verification

| Criterion | Status | Evidence |
|---|---|---|
| ERD does not authorize backend/API implementation | **PASS** | Section 1 and Section 19 confirmed |
| ERD does not authorize SQL/schema implementation | **PASS** | Section 1 and Section 19 confirmed |
| ERD does not authorize database migrations | **PASS** | Section 1 and Section 19 confirmed |
| ERD does not authorize OpenAPI creation | **PASS** | Section 1 and Section 19 confirmed |
| ERD does not authorize auth/RBAC implementation | **PASS** | Section 1 and Section 19 confirmed |
| ERD does not authorize generated/runtime client | **PASS** | Section 19 confirmed |
| ERD does not authorize package/build/dependency changes | **PASS** | Section 1 and Section 19 confirmed |
| ERD does not authorize marketing-os extraction | **PASS** | Section 1 and Section 17 confirmed |
| ERD does not authorize production/pilot readiness | **PASS** | Section 1 and Section 19 confirmed |

**All 71 criteria: PASS.**

*(One non-blocking inconsistency documented in Section 5 below.)*

---

## 4. Findings

**Finding 1 — ERD/Data Model is structurally valid.**

PR #71 correctly defines a logical, journey-driven data model for Nashir V1. All 21 sections are coherent, internally consistent, and properly sequenced. The model serves as an adequate input for Auth/RBAC, API Contract, Test Strategy, Threat Modeling, and Storage planning gates.

**Finding 2 — Workspace-rooted model is appropriate.**

The workspace-first scoping approach is correct for a multi-workspace merchant platform. The decision to route all API-facing business records through workspace context, and all identity through WorkspaceMember, provides the correct isolation foundation for Auth/RBAC to build on.

**Finding 3 — 17 V1 Core logical entities are sufficient for next planning gates.**

The 17 entities cover the full V1 Core journey from identity and store setup through campaign creation, content management, publishing, and analytics. The 3-slice sequencing (Slice 1: foundation, Slice 2: campaigns/content, Slice 3: publishing/analytics) is coherent and correctly ordered.

**Finding 4 — Slice 1/2/3 sequencing is coherent.**

Phase 2/Slice 1 (Workspace, User, WorkspaceMember, StoreProfile, Product, DataSource, ChannelConnection, Asset) correctly targets the data foundation before campaign and content entities. Slices 2 and 3 build on Slice 1 logically.

**Finding 5 — ChannelConnection and IntegrationCredential separation is correct.**

ChannelConnection models platform/channel metadata without raw credentials. IntegrationCredential is correctly treated as a separate governance-sensitive candidate requiring vault reference model and Threat Modeling Gate approval. This prevents premature security exposure.

**Finding 6 — AnalyticsSnapshot lineage requirement is correct.**

The `sourceSummary` field and Section 12 lineage rules ensure that analytics data integrity is explicitly modeled. The four status candidates (available / partial / stale / unavailable) correctly distinguish data quality states. This prevents misleading production analytics claims.

**Finding 7 — ContentApproval and ReviewDecision require future boundary clarity, but this is not blocking.**

ContentApproval models the human-in-the-loop review flow for ContentDraft within the V1 Core campaign domain. ReviewDecision is an Extended V1 candidate for the `contentReview` screen. The architecture decision (standalone `contentReview` backend vs. extension of ContentApproval) is correctly documented as open and deferred. This is the correct posture — premature resolution would risk locking the wrong architecture.

**Finding 8 — Minor inconsistency: WorkspaceMember status enum in Section 10 is stale.**

Section 9 field-level model (authoritative): `status — status: active / invited / suspended` ✓  
Section 10 enum candidates table: `active · invited · disabled` ✗ (not updated during Gemini field-level remediation)

The field-level model in Section 9 is the authoritative source and is correct. Section 10 is labeled "candidates only" and is non-final. The stale `disabled` in Section 10 is a documentation inconsistency, not a structural defect. This is a non-blocking correction — the correct value is `suspended` throughout, consistent with Workspace status candidates and WorkspaceMember status in Section 9.

**Finding 9 — Candidate entity domains are sufficient for planning but correctly non-final.**

Support, Admin/Governance, and Extended V1 candidates are documented with appropriate security sensitivity ratings and implementation conditions. None are promoted to first-slice commitments. Sensitive candidates are correctly gated behind Threat Modeling.

---

## 5. Review Corrections

**One non-blocking inconsistency identified.**

| Item | Location | Current text | Correct text | Blocking |
|---|---|---|---|---|
| WorkspaceMember status enum | Section 10 enum candidates table | `active · invited · disabled` | `active · invited · suspended` | **NO — non-blocking** |

**Correction note:** Section 9 (field-level logical model) is authoritative and already correct (`active / invited / suspended`). Section 10 is labeled "candidates only — non-final" and both sections explicitly defer final enums to API Contract/OpenAPI Gate. The inconsistency does not affect the structural validity of the ERD or the readiness of downstream planning gates. It may be corrected in a housekeeping commit or during API Contract Gate preparation.

**No other corrections are required.** All 71 criteria pass. The ERD is ready to support the next planning gates.

---

## 6. Risks Confirmed

| Risk | Confirmed | Control |
|---|---|---|
| Over-modeling all 23 screens delays V1 Core delivery | **CONFIRMED** | V1 Core entities only in Slices 1–3; Support/Admin/Extended V1 candidates explicitly deferred; Section 15 risk register |
| Under-modeling workspace/auth creates future security rework | **CONFIRMED** | Workspace scoping mandatory for all business entities; Auth/RBAC Gate is next priority |
| Storing credentials on ChannelConnection creates high security exposure | **CONFIRMED** | IntegrationCredential is a separate governance-sensitive candidate; Threat Modeling Gate required before implementation |
| Analytics without lineage creates trust and reputation risk | **CONFIRMED** | `sourceSummary` required on AnalyticsSnapshot; four-state status model; Section 12 lineage rules |
| Publishing statuses can mislead users if simulated vs real is unclear | **CONFIRMED** | `simulated` status distinct; Section 10 note: must remain clearly distinct from any future real publishing status |
| Treating candidate fields as final can prematurely lock API | **CONFIRMED** | Fields are logical only; API Contract Gate and Storage Gate finalize |
| Ignoring PDPL/GCC data considerations creates regulatory risk | **CONFIRMED** | Section 13 compliance notes; future evaluation required at Security/Storage gates |
| Lack of audit model weakens governance and accountability | **CONFIRMED** | AuditEvent included as cross-cutting candidate; append-only model required |
| Ambiguity between ContentApproval and ReviewDecision can confuse contentReview backend later | **CONFIRMED** | Architecture decision correctly deferred; documented as open in Section 5 and 6 of ERD |

---

## 7. Review Decision

| Dimension | Decision |
|---|---|
| ERD/Data Model is structurally sufficient | **ACCEPT** |
| Workspace-rooted model is appropriate | **ACCEPT** |
| 17 V1 Core logical entities are correctly defined | **ACCEPT** |
| Slice 1/2/3 sequencing is coherent | **ACCEPT** |
| Relationship model is internally consistent | **ACCEPT** |
| Field-level logical model is correct in Section 9 | **ACCEPT** |
| Section 10 WorkspaceMember enum inconsistency | **NON-BLOCKING** |
| Credential separation is correct | **ACCEPT** |
| Analytics lineage requirement is correct | **ACCEPT** |
| Candidate domains are sufficient for planning | **ACCEPT** |
| marketing-os boundary is maintained | **ACCEPT** |
| No blocking corrections required | **CONFIRMED** |
| **GO: ERD/Data Model review gate complete** | **GO** |
| **CONDITIONAL GO: Nashir Auth/RBAC/Workspace Identity Gate** | After this review gate merges |
| **CONDITIONAL GO: Nashir API Contract/OpenAPI Gate** | After Auth/RBAC and ERD direction; requires Auth/RBAC Gate first |
| **CONDITIONAL GO: Nashir Test Strategy Gate** | After ERD review; before implementation |
| **CONDITIONAL GO: Nashir Threat Modeling/Security Gate** | After ERD review; before sensitive area implementation |
| **CONDITIONAL GO: Nashir Data Migration/Storage Strategy Gate** | When persistence is introduced |
| **CONDITIONAL GO: Nashir Environment/Deployment Strategy Gate** | When runtime hosting is introduced |
| **CONDITIONAL GO: Nashir Real Implementation Slice 1 Planning Gate** | After all required planning gates are reviewed/approved or explicitly scoped |
| Backend/API implementation | **NO-GO** |
| SQL/schema implementation | **NO-GO** |
| Database migrations | **NO-GO** |
| OpenAPI creation in this PR | **NO-GO** |
| Auth/RBAC implementation | **NO-GO** |
| UI integration | **NO-GO** |
| Package/build changes | **NO-GO** |
| marketing-os extraction in this PR | **NO-GO** |
| Production/pilot readiness | **NO-GO** |

---

## 8. Next Gate Authorization

This review gate authorizes the preparation of:

| Priority | Gate | Condition |
|---:|---|---|
| 1 | **Nashir Auth/RBAC/Workspace Identity Gate** | After this review merges — WorkspaceMember and workspace scoping need role/permission decisions before API Contract/OpenAPI can be finalized |
| 2 | **Nashir API Contract/OpenAPI Gate** | After Auth/RBAC and ERD direction; auth schemes, workspace scoping, permissions, error model, and id formats must be reflected in the contract |
| 3 | **Nashir Test Strategy Gate** | After ERD review; before implementation begins; must cover workspace isolation, entity relationships, status transitions, and human-in-the-loop flows |
| 4 | **Nashir Threat Modeling/Security Gate** | After ERD review; before sensitive area implementation; must evaluate credential, publishing, AI/governance, audit, and workspace isolation risks |
| 5 | **Nashir Data Migration/Storage Strategy Gate** | When persistence is introduced; must convert logical entities into concrete storage decisions |
| 6 | **Nashir Environment/Deployment Strategy Gate** | When runtime hosting is introduced |
| 7 | **Nashir Real Implementation Slice 1 Planning Gate** | After all required planning gates are reviewed or explicitly scoped; likely scope: Workspace, StoreProfile, Product, DataSource, ChannelConnection, Asset, minimal AuditEvent |

**Key clarifications:**

- **Auth/RBAC comes next** because WorkspaceMember, workspace isolation, and role/permission decisions are prerequisites for the API Contract to be complete. The Auth/RBAC Gate must validate User, WorkspaceMember, and workspace isolation strategy before API responses and permission requirements can be finalized.
- **API Contract/OpenAPI must reflect Auth/RBAC decisions** — auth scheme headers, workspace scoping patterns, permission requirements, and error models must be approved before API Contract is finalized.
- **Real Implementation Slice 1 cannot begin** until strategy, ERD, Auth/RBAC, API contract, test strategy, threat modeling, storage, and deployment gates are sufficiently reviewed and approved or explicitly scoped out.

---

## 9. Marketing OS Boundary Review

| Rule | Status |
|---|---|
| `marketing-os` remains reference-only | **CONFIRMED** |
| This review does not authorize extraction | **CONFIRMED** |
| ERD must not copy marketing-os entity model | **CONFIRMED** |
| Any future extraction must be selective, documented, and evaluated against Nashir's approved 23-screen scope | **CONFIRMED** |
| `marketing-os` must not become Nashir runtime base | **CONFIRMED** |
| `marketing-os` must not impose UI, journey, or entity assumptions on Nashir | **CONFIRMED** |
| Future extracted items must be categorized as Adopt / Adapt / Reject / Defer | Recommendation for the extraction gate |

---

## 10. NO-GO Boundaries

```text
NO-GO: UI source code changes.
NO-GO: Navigation changes.
NO-GO: Screen deletion.
NO-GO: Screen renaming.
NO-GO: Backend code.
NO-GO: API implementation.
NO-GO: SQL/schema implementation.
NO-GO: Database migrations.
NO-GO: OpenAPI files.
NO-GO: Auth/RBAC implementation.
NO-GO: Generated clients/types.
NO-GO: Runtime client.
NO-GO: Package/build/dependency changes.
NO-GO: marketing-os modifications.
NO-GO: marketing-os extraction.
NO-GO: Production/pilot readiness claims.
```

---

## 11. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | Only new review gate doc untracked |
| `git diff --stat` | Only `docs/nashir_erd_data_model_review_gate.md` (new file) |
| Forbidden files check | **PASS** — no `src/`, `package.json`, `README.md`, `docs/screen_map.md`, or `marketing-os` files modified |

---

## 12. GO / NO-GO Result

| Decision | Status |
|---|---|
| **ERD/Data Model review gate complete** | **GO** |
| **CONDITIONAL GO: Nashir Auth/RBAC/Workspace Identity Gate** | After this review gate merges |
| **CONDITIONAL GO: Nashir API Contract/OpenAPI Gate** | After Auth/RBAC and ERD direction |
| **CONDITIONAL GO: Nashir Test Strategy Gate** | After ERD review; before implementation |
| **CONDITIONAL GO: Nashir Threat Modeling/Security Gate** | After ERD review; before sensitive area implementation |
| **CONDITIONAL GO: Nashir Data Migration/Storage Strategy Gate** | When persistence is introduced |
| **CONDITIONAL GO: Nashir Environment/Deployment Strategy Gate** | When runtime hosting is introduced |
| **CONDITIONAL GO: Nashir Real Implementation Slice 1 Planning Gate** | After all required planning gates |
| Backend/API implementation | **NO-GO** |
| SQL/schema implementation | **NO-GO** |
| Database migrations | **NO-GO** |
| OpenAPI creation in this PR | **NO-GO** |
| Auth/RBAC implementation | **NO-GO** |
| UI integration | **NO-GO** |
| Package/build changes | **NO-GO** |
| marketing-os extraction in this PR | **NO-GO** |
| Production/pilot readiness | **NO-GO** |
