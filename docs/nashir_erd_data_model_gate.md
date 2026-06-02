# Nashir ERD/Data Model Gate

| Field | Value |
|---|---|
| Gate type | ERD/Data Model gate — documentation only |
| Status | Draft — pending review |
| Date | 2026-06-02 |
| Scope | Defines the conceptual and logical V1 data model for Nashir to support Auth/RBAC, API Contract/OpenAPI, Test Strategy, Threat Modeling, Storage, and Implementation Slice planning |
| Backend/API implementation | NO |
| SQL schema implementation | NO |
| Database migration | NO |
| OpenAPI/API contract implementation | NO |
| Auth/RBAC implementation | NO |
| UI/source code changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is a documentation-only ERD/Data Model gate.

**No backend or API implementation is performed.**

**No SQL schema or database migration is performed.**

**No OpenAPI or API contract is created.**

**No auth/RBAC implementation is performed.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

This gate defines the conceptual and logical data model only.

---

## 2. Inputs Reviewed

| Input | Finding |
|---|---|
| `README.md` | 23 screens; V1 Core journey documented; Extended V1 preserved |
| `docs/screen_map.md` | 23 screens with V1 classification; `productIntelligence`, `creatorStudio`, `contentReview` documented as Extended V1 |
| Backend/API Strategy Gate (PR #69) | Nashir-first direction; REST/OpenAPI; PostgreSQL-compatible; Auth/RBAC before API Contract; PDPL/GCC compliance assessment required |
| Backend/API Strategy Review Gate (PR #70) | All 42 criteria PASS; ERD Gate and Auth/RBAC Gate authorized |
| Productization Roadmap Gate (PR #67) | 7-phase roadmap; Phase 2 targets Store/Profile/Product/DataSources/Assets |
| Productization Roadmap Review Gate (PR #68) | All 28 criteria PASS |
| V1 Scope Decision Gate (PR #64) | 10 V1 Core, 2 V1 Support, 8 V1 Admin/Governance, 3 Extended V1 approved |
| V1 Scope Decision Review Gate (PR #65) | All 21 criteria PASS |
| V1 Scope Documentation Update Gate (PR #66) | 23-screen scope fully documented |
| `src/App.jsx` | 23 active screens; V1 Core journey: Dashboard → StoreSetup → ProductCatalog → DataSourcesHub → AssetLibrary → Campaigns → CampaignsList → Content → PublishingQueue → Analytics |
| `src/pages/` | 23 page components; no orphaned files |
| `src/data/` | `creatorStudioFlowFixture.js`, `dashboardData.js`, `readinessFixture.js` — mock data only |
| `src/generated/` | `creator-studio-openapi-types/` — generated types; no real backend |
| `package.json` | `name: nashir`; `generate:creator-studio-types` script; no backend scripts |

### Confirmed baseline

- 23-screen scope documented; V1 Core is first backend priority.
- Backend/API strategy reviewed and approved (PR #70).
- No real backend implementation exists.
- Data model must serve Nashir's approved UI journey.
- marketing-os remains reference-only.

---

## 3. ERD Principles

| Principle | Detail |
|---|---|
| Journey-first model | Data model must follow Nashir's approved product journey, not redefine UI scope or introduce entities not required by approved screens |
| Mandatory workspace scoping | All merchant/business entities must be workspace-scoped; no unscoped business data |
| Progressive conversion support | Model must support progressive mock-to-real conversion domain-by-domain |
| V1 Core first | V1 Core entities are first implementation priority; Support/Admin/Extended V1 entities are documented as future/deferred candidates |
| Candidates are not SQL tables | Candidate entities must not be treated as SQL tables until Storage/Migration Gate approves storage decisions |
| API guidance, not contract | Final fields and constraints guide API Contract/OpenAPI planning but no endpoint is defined here |
| Auth/RBAC deferred | Auth/RBAC will be finalized in a dedicated gate after this ERD |
| Threat modeling required | Sensitive/security-related entities require Threat Modeling before implementation |
| Compliance considered later | Data residency and PDPL/GCC-relevant compliance must be evaluated in Security/Storage gates |

---

## 4. Approved Product Scope Mapping

| V1 Classification | Screen | Primary data domains |
|---|---|---|
| **V1 Core** | dashboard | Dashboard aggregation / read models |
| **V1 Core** | storeSetup | Workspace + StoreProfile |
| **V1 Core** | productCatalog | Product |
| **V1 Core** | dataSourcesHub | DataSource + ChannelConnection |
| **V1 Core** | assetLibrary | Asset |
| **V1 Core** | campaigns | Campaign + CampaignBrief |
| **V1 Core** | campaignsList | Campaign + CampaignStatus/summary |
| **V1 Core** | content | CampaignContentItem + ContentDraft |
| **V1 Core** | publishingQueue | PublishingJob + PublishingStatus |
| **V1 Core** | analytics | AnalyticsSnapshot + AnalyticsMetric |
| **V1 Support** | multiPlatform | ChannelConnection + PlatformCapability candidates |
| **V1 Support** | teamCollaboration | WorkspaceMember + Comment + ActivityLog candidates |
| **V1 Admin/Gov** | templateEngine | Template |
| **V1 Admin/Gov** | workflowRuns | WorkflowRun |
| **V1 Admin/Gov** | systemAdmin | Admin configuration candidates |
| **V1 Admin/Gov** | secrets | IntegrationCredential *(sensitive)* |
| **V1 Admin/Gov** | modelRouting | ModelRoute |
| **V1 Admin/Gov** | promptGovernance | PromptVersion |
| **V1 Admin/Gov** | costMonitor | UsageCostEvent |
| **V1 Admin/Gov** | settings | WorkspaceSetting + UserPreference candidates |
| **Extended V1** | productIntelligence | ProductInsight + ProductAnalysis candidates |
| **Extended V1** | creatorStudio | CreatorStudioArtifact + GeneratedContent candidates |
| **Extended V1** | contentReview | ContentApproval + ReviewDecision + PreviewState candidates |

Only V1 Core entities are first implementation priority. Support/Admin/Extended V1 entities are conceptual candidates.

---

## 5. Core Entity List

| Entity | Purpose | Scope | Key relationships | Priority | Notes |
|---|---|---|---|---|---|
| `Workspace` | Root tenant boundary; scopes all merchant/business records | Global root | has User (via WorkspaceMember), StoreProfile, Products, Campaigns, Assets | **High — Slice 1** | Foundation; every other entity depends on it |
| `User` | Human actor in the system | Global | belongs to Workspaces via WorkspaceMember | **High — Slice 1** | Identity details; Auth/RBAC Gate defines role carrier |
| `WorkspaceMember` | Links User to Workspace with role | Workspace | belongs to User + Workspace | **High — Slice 1** | Role/permission placeholder until Auth/RBAC Gate |
| `StoreProfile` | Commerce identity for a workspace | Workspace | belongs to Workspace; may influence Campaign defaults | **High — Slice 1** | One per workspace in V1 |
| `Product` | Product or service record for campaigns | Workspace | belongs to Workspace; may link to Assets; may link to Campaigns | **High — Slice 1** | Core merchant catalog record |
| `DataSource` | Data source/integration readiness record | Workspace | belongs to Workspace; may link to ChannelConnection | **High — Slice 1** | Channel/integration metadata only; credentials separate |
| `ChannelConnection` | Platform/channel connection record | Workspace | belongs to Workspace; may reference DataSource | **High — Slice 1** | No raw credentials; credential storage is a separate sensitive concern |
| `Asset` | Creative asset metadata | Workspace | belongs to Workspace; may link to Product; may link to CampaignContentItem | **High — Slice 1** | Storage reference is a placeholder until Storage Gate |
| `Campaign` | Campaign record; owner of content/publishing lifecycle | Workspace | belongs to Workspace; links to Products, CampaignBriefs, ContentItems, PublishingJobs | **High — Slice 2** | Central campaign entity |
| `CampaignBrief` | Campaign objective/audience/channel/tone context | Workspace | belongs to Campaign | **High — Slice 2** | Drives content generation context |
| `CampaignContentItem` | A specific content unit within a campaign | Workspace | belongs to Campaign; has many ContentDrafts | **High — Slice 2** | Per-channel or per-format content unit |
| `ContentDraft` | A draft body of a CampaignContentItem | Workspace | belongs to CampaignContentItem; may have ContentApprovals | **High — Slice 2** | Versioned draft content |
| `ContentApproval` | Human review/approval record for ContentDraft | Workspace | belongs to ContentDraft; references reviewer User | **High — Slice 2** | Supports human-in-the-loop; contentReview architecture decision still open |
| `PublishingJob` | Publishing job linked to Campaign/ContentItem | Workspace | belongs to Campaign; optionally links CampaignContentItem; has PublishingStatuses | **High — Slice 3** | Schedule/status tracking; no auto-publish in V1 |
| `PublishingStatus` | Status event for a PublishingJob | Workspace | belongs to PublishingJob | **High — Slice 3** | Append-only status trail |
| `AnalyticsSnapshot` | Read-model analytics snapshot for a subject | Workspace | belongs to Workspace; may link Campaign, Product, ChannelConnection | **High — Slice 3** | Must carry source lineage; no fake production metrics |
| `AuditEvent` | Append-only audit trail for sensitive operations | Workspace | belongs to Workspace; may reference User and target entity | **Medium — Slice 1+ candidate** | Sensitive operations must be auditable; append-only |

---

## 6. Support/Admin/Extended Candidate Entity List

### V1 Support candidates *(real scope; deferred implementation)*

| Candidate | Purpose | Notes |
|---|---|---|
| `Comment` | Team comment on a Campaign, ContentItem, or draft | Depends on identity model |
| `ActivityLog` | Change history record | May merge with or extend AuditEvent |
| `CollaborationAssignment` | Assigns reviewer/collaborator to a content item or campaign | Depends on Auth/RBAC roles |
| `PlatformCapability` | Describes a channel's publishing capabilities | Supports MultiPlatform screen |

### V1 Admin/Governance candidates *(sensitive; threat modeling required)*

| Candidate | Purpose | Security sensitivity |
|---|---|---|
| `IntegrationCredential` | External credential/vault reference | **HIGH** — must use vault reference only; no raw values |
| `WorkspaceSetting` | Workspace-level configuration | Medium |
| `UserPreference` | User-level display/notification preferences | Low–Medium |
| `Template` | Reusable content/prompt template | Medium |
| `PromptVersion` | Versioned prompt with governance state | **HIGH** — approval and audit required |
| `ModelRoute` | AI provider routing policy | **HIGH** — cost and security implications |
| `UsageCostEvent` | AI/platform usage cost record | Medium — billing adjacent |
| `WorkflowRun` | Workflow execution record | Medium — job runtime model |
| `AdminAuditEvent` | Admin-specific audit trail | **HIGH** — elevated access |

### Extended V1 candidates *(preserved; not first-slice commitment)*

| Candidate | Purpose | Notes |
|---|---|---|
| `ProductInsight` | AI-generated product analysis | Depends on real Product/Campaign data |
| `ProductAnalysis` | Structured product analysis output | Part of productIntelligence backend |
| `CreatorStudioArtifact` | Creator Studio session or output artifact | Has existing fixture and generated types; acceleration candidate |
| `GeneratedContent` | AI-generated content candidate | Part of creatorStudio backend |
| `ReviewDecision` | Decision record for contentReview surface | Architectural decision open: standalone vs. integrated with ContentApproval |
| `PreviewState` | Preview rendering state | Part of contentReview backend |

All Support/Admin/Extended candidates are:
- Candidate only — not first-slice implementation commitments.
- Must not block V1 Core data foundation.
- Sensitive candidates require Threat Modeling Gate before implementation.

---

## 7. Relationship Model

### Workspace-centric relationships

```
Workspace
├── WorkspaceMember (many, via User)
├── StoreProfile (one)
├── Product (many)
├── DataSource (many)
├── ChannelConnection (many)
├── Asset (many)
├── Campaign (many)
│   ├── CampaignBrief (one or many)
│   ├── CampaignContentItem (many)
│   │   ├── ContentDraft (many)
│   │   │   └── ContentApproval (many)
│   │   └── Asset (optional link)
│   └── PublishingJob (many)
│       └── PublishingStatus (many, append-only)
├── AnalyticsSnapshot (many; links Campaign / Product / ChannelConnection)
└── AuditEvent (many, append-only)
```

### Identity relationships

- `User` may belong to many `Workspace` records through `WorkspaceMember`.
- `WorkspaceMember` carries role placeholder — details deferred to Auth/RBAC Gate.
- All API-facing business records access User identity through WorkspaceMember context.

### Key cross-entity links

| From | To | Relationship | Notes |
|---|---|---|---|
| StoreProfile | Campaign (defaults) | Influences | Not a hard FK requirement in V1 |
| Product | Campaign | Optional link | Campaign may target one or more Products |
| Product | Asset | Optional link | Product may have associated Assets |
| Asset | CampaignContentItem | Optional link | Assets used in content |
| DataSource | ChannelConnection | Optional reference | Channel may derive from DataSource |
| ChannelConnection | PublishingJob | Optional reference | Publishing targets a channel |
| CampaignContentItem | ContentDraft | one-to-many | Versioned content |
| ContentDraft | ContentApproval | one-to-many | Human review trail |
| Campaign | AnalyticsSnapshot | Optional link | Campaign performance data |

---

## 8. Conceptual ERD Table

| Entity | Category | Workspace-scoped | Primary parent | Key children/links | Implementation priority | Security sensitivity | Notes |
|---|---|---|---|---|---|---|---|
| `Workspace` | Core | Root | — | WorkspaceMember, StoreProfile, Product, DataSource, ChannelConnection, Asset, Campaign, AnalyticsSnapshot, AuditEvent | **High — Slice 1** | LOW | Foundation |
| `User` | Core | Global (accessed via WorkspaceMember) | — | WorkspaceMember | **High — Slice 1** | MEDIUM | PII; Auth/RBAC Gate defines role |
| `WorkspaceMember` | Core | YES | Workspace + User | Role placeholder | **High — Slice 1** | MEDIUM | Auth/RBAC Gate finalizes |
| `StoreProfile` | Core | YES | Workspace | — | **High — Slice 1** | LOW | One per workspace |
| `Product` | Core | YES | Workspace | Asset (optional), Campaign (optional) | **High — Slice 1** | LOW | Core catalog |
| `DataSource` | Core | YES | Workspace | ChannelConnection | **High — Slice 1** | MEDIUM | No credentials directly |
| `ChannelConnection` | Core | YES | Workspace | PublishingJob (optional) | **High — Slice 1** | MEDIUM | Credentials are separate |
| `Asset` | Core | YES | Workspace | Product (optional), CampaignContentItem (optional) | **High — Slice 1** | LOW | Storage ref is placeholder |
| `Campaign` | Core | YES | Workspace | CampaignBrief, CampaignContentItem, PublishingJob, AnalyticsSnapshot | **High — Slice 2** | LOW | Central entity |
| `CampaignBrief` | Core | YES | Campaign | — | **High — Slice 2** | LOW | Context for content |
| `CampaignContentItem` | Core | YES | Campaign | ContentDraft, Asset | **High — Slice 2** | LOW | Per-format content unit |
| `ContentDraft` | Core | YES | CampaignContentItem | ContentApproval | **High — Slice 2** | LOW | Versioned draft |
| `ContentApproval` | Core | YES | ContentDraft | User (reviewer) | **High — Slice 2** | MEDIUM | Human-in-the-loop |
| `PublishingJob` | Core | YES | Campaign | PublishingStatus, ChannelConnection | **High — Slice 3** | MEDIUM | No auto-publish in V1 |
| `PublishingStatus` | Core | YES | PublishingJob | — | **High — Slice 3** | LOW | Append-only |
| `AnalyticsSnapshot` | Core | YES | Workspace | Campaign, Product, ChannelConnection | **High — Slice 3** | LOW | Real lineage required |
| `AuditEvent` | Core | YES | Workspace | User, target entity | **Medium — Slice 1+ candidate** | HIGH | Append-only; sensitive ops |
| `IntegrationCredential` | Admin/Governance | YES | Workspace | ChannelConnection | **Deferred — governance slice** | **HIGH** | Vault ref only; Threat Modeling required |
| `WorkspaceSetting` | Admin/Governance | YES | Workspace | — | **Deferred — governance slice** | LOW–MEDIUM | |
| `Template` | Admin/Governance | YES | Workspace | — | **Deferred — governance slice** | MEDIUM | |
| `PromptVersion` | Admin/Governance | YES | Workspace | — | **Deferred — governance slice** | **HIGH** | AI governance |
| `ModelRoute` | Admin/Governance | YES | Workspace | — | **Deferred — governance slice** | **HIGH** | AI + cost risk |
| `UsageCostEvent` | Admin/Governance | YES | Workspace | — | **Deferred — governance slice** | MEDIUM | |
| `WorkflowRun` | Admin/Governance | YES | Workspace | — | **Deferred — governance slice** | MEDIUM | |
| `ProductInsight` | Extended V1 Candidate | YES | Workspace + Product | — | **Extended — after Slice 2** | LOW | productIntelligence backend |
| `CreatorStudioArtifact` | Extended V1 Candidate | YES | Workspace | — | **Extended — after Slice 2** | MEDIUM | Acceleration candidate |
| `ReviewDecision` | Extended V1 Candidate | YES | Workspace | ContentDraft | **Extended — architecture decision open** | MEDIUM | contentReview backend |

---

## 9. Field-Level Logical Model

> **Note:** These fields are logical, not SQL column definitions. Exact names, types, nullability, and indexes are deferred to Storage/Migration Gate and API Contract Gate. Auth/RBAC Gate may alter user/member fields.

### Workspace
- `id` — identity
- `name` — display
- `status` — status: active / inactive / suspended
- `createdAt`, `updatedAt` — audit

### User
- `id` — identity
- `displayName` — display
- `email` — identity (PII)
- `status` — status: active / invited / suspended
- `createdAt`, `updatedAt` — audit

### WorkspaceMember
- `id` — identity
- `workspaceId` — ownership/scope
- `userId` — relationship
- `rolePlaceholder` — status (Auth/RBAC Gate finalizes)
- `status` — status: active / invited / suspended
- `joinedAt` — operational metadata
- `createdAt`, `updatedAt` — audit

### StoreProfile
- `id` — identity
- `workspaceId` — ownership/scope
- `storeName` — display
- `storeUrl` — display
- `brandSummary` — display
- `targetMarketSummary` — display
- `defaultLanguage` — operational
- `status` — status: active / inactive
- `createdAt`, `updatedAt` — audit

### Product
- `id` — identity
- `workspaceId` — ownership/scope
- `name` — display
- `description` — display
- `category` — display
- `pricePlaceholder` — display (commerce integration deferred)
- `status` — status: draft / active / archived
- `createdAt`, `updatedAt` — audit

### DataSource
- `id` — identity
- `workspaceId` — ownership/scope
- `type` — operational
- `provider` — operational
- `displayName` — display
- `connectionStatus` — status
- `lastSyncStatus` — operational metadata
- `createdAt`, `updatedAt` — audit

### ChannelConnection
- `id` — identity
- `workspaceId` — ownership/scope
- `dataSourceId` — relationship (optional)
- `provider` — operational
- `channelType` — operational
- `displayName` — display
- `connectionStatus` — status
- `capabilitySummary` — operational metadata
- `createdAt`, `updatedAt` — audit

### Asset
- `id` — identity
- `workspaceId` — ownership/scope
- `productId` — relationship (optional)
- `campaignContentItemId` — relationship (optional)
- `title` — display
- `assetType` — operational
- `source` — operational metadata
- `storageReferencePlaceholder` — operational (Storage Gate finalizes)
- `status` — status: active / archived
- `createdAt`, `updatedAt` — audit

### Campaign
- `id` — identity
- `workspaceId` — ownership/scope
- `name` — display
- `objective` — display
- `status` — status: draft / generating / review / ready / scheduled / active / paused / completed / archived
- `primaryProductId` — relationship (optional)
- `createdAt`, `updatedAt` — audit

### CampaignBrief
- `id` — identity
- `workspaceId` — ownership/scope
- `campaignId` — relationship
- `objective` — display
- `audienceSummary` — display
- `channelSummary` — display
- `tone` — display
- `constraints` — display
- `createdAt`, `updatedAt` — audit

### CampaignContentItem
- `id` — identity
- `workspaceId` — ownership/scope
- `campaignId` — relationship
- `contentType` — operational
- `channel` — operational
- `status` — status: draft / ready_for_review / approved / rejected / archived
- `currentDraftId` — relationship (optional)
- `createdAt`, `updatedAt` — audit

### ContentDraft
- `id` — identity
- `workspaceId` — ownership/scope
- `campaignContentItemId` — relationship
- `body` — content
- `language` — operational
- `version` — operational metadata
- `status` — status: draft / ready_for_review / approved / rejected / archived
- `createdByUserId` — relationship
- `createdAt`, `updatedAt` — audit

### ContentApproval
- `id` — identity
- `workspaceId` — ownership/scope
- `contentDraftId` — relationship
- `reviewerUserId` — relationship
- `decision` — status: approved / rejected / changes_requested
- `note` — display
- `decidedAt` — operational metadata
- `createdAt` — audit

### PublishingJob
- `id` — identity
- `workspaceId` — ownership/scope
- `campaignId` — relationship
- `campaignContentItemId` — relationship (optional)
- `scheduledAt` — operational metadata
- `status` — status: draft / scheduled / queued / simulated / failed / cancelled
- `targetChannelConnectionId` — relationship (optional)
- `createdAt`, `updatedAt` — audit

### PublishingStatus
- `id` — identity
- `workspaceId` — ownership/scope
- `publishingJobId` — relationship
- `status` — operational
- `statusMessage` — display
- `occurredAt` — operational metadata
- `createdAt` — audit

### AnalyticsSnapshot
- `id` — identity
- `workspaceId` — ownership/scope
- `status` — status: available / partial / stale / unavailable
- `subjectType` — operational (Campaign / Product / ChannelConnection)
- `subjectId` — relationship
- `metricSummary` — content (must carry real source or be clearly flagged as mock/partial)
- `sourceSummary` — operational metadata (data lineage)
- `snapshotAt` — operational metadata
- `createdAt` — audit

### AuditEvent
- `id` — identity
- `workspaceId` — ownership/scope
- `actorUserId` — relationship (optional; system actions may have no actor)
- `action` — operational
- `targetType` — operational
- `targetId` — relationship
- `metadataSummary` — content
- `occurredAt` — operational metadata
- `createdAt` — audit (append-only)

---

## 10. Status and Enum Candidates

> These are candidates only. Final status enums belong to API Contract/OpenAPI Gate and implementation planning.

| Entity | Status candidates |
|---|---|
| Workspace | active · inactive · suspended |
| WorkspaceMember | active · invited · disabled |
| Product | draft · active · archived |
| DataSource / ChannelConnection | not_connected · connected · error · expired |
| Campaign | draft · generating · review · ready · scheduled · active · paused · completed · archived |
| ContentDraft | draft · ready_for_review · approved · rejected · archived |
| CampaignContentItem | draft · ready_for_review · approved · rejected · archived |
| PublishingJob | draft · scheduled · queued · simulated · failed · cancelled |
| AnalyticsSnapshot | available · partial · stale · unavailable |

**Publishing statuses must not imply real publishing before integration approval.** `simulated` must remain clearly distinct from any future real publishing status.

---

## 11. Data Ownership and Workspace Scoping

| Rule | Detail |
|---|---|
| All business records workspace-scoped | Every merchant/business record must include workspace context |
| User is global but access is workspace-mediated | User entity is global; access to business records must pass through WorkspaceMember |
| API-facing objects infer or carry workspace scope | Every V1 Core API response must enforce workspace context |
| Workspace scoping finalized with Auth/RBAC | Full workspace isolation strategy is confirmed in Auth/RBAC and API Contract gates |
| Cross-workspace leakage is critical security risk | No business record may be accessible from a different workspace context |
| No shared global merchant data | All merchant data is workspace-isolated in V1 |

---

## 12. Data Lineage and Analytics Integrity

| Rule | Detail |
|---|---|
| `AnalyticsSnapshot` must carry source lineage | `sourceSummary` or equivalent field must distinguish real data from mock/partial/stale |
| No production analytics claim without real sources | Analytics must not claim production status until data source, collection, transformation, and freshness are implemented |
| Publishing metrics must be clearly simulated | Publishing performance data must not appear real before publishing integration is approved |
| Partial or stale data must be labeled | UI must clearly distinguish real, partial, stale, and unavailable analytics states |

---

## 13. Sensitive Data and Compliance Notes

| Concern | Detail |
|---|---|
| Integration credentials | Must not be stored as plain fields on `ChannelConnection`; requires dedicated `IntegrationCredential` candidate with vault reference model; Security, Storage, and Threat Modeling gates required |
| Personal data | User email, name, and identity must consider data residency and local regulatory compliance |
| PDPL/GCC-relevant compliance | Personal data and merchant data must be evaluated against PDPL and GCC-relevant data protection requirements where applicable — future evaluation; no compliance is claimed here |
| AuditEvent | Must be planned for sensitive operations; append-only; must not be modifiable after creation |
| AI governance entities | `ModelRoute`, `PromptVersion`, `UsageCostEvent`, `WorkflowRun` are governance-sensitive; must be threat-modeled before implementation |
| Publishing and content approval | Human confirmation required; no auto-approval or auto-publish |

---

## 14. ERD Decisions

| Decision | Status |
|---|---|
| Workspace as root scope for merchant/business data | **APPROVED** |
| User + WorkspaceMember as identity relationship baseline, subject to Auth/RBAC Gate | **APPROVED** |
| StoreProfile, Product, DataSource, ChannelConnection, Asset as Phase 2/Slice 1 Core Data Foundation | **APPROVED** |
| Campaign, CampaignBrief, CampaignContentItem, ContentDraft, ContentApproval as Phase 3/Slice 2 Campaign & Content model | **APPROVED** |
| PublishingJob, PublishingStatus, AnalyticsSnapshot as Phase 4/Slice 3 model | **APPROVED** |
| AuditEvent as cross-cutting audit candidate | **APPROVED** |
| IntegrationCredential, Template, PromptVersion, ModelRoute, UsageCostEvent, WorkflowRun as sensitive/deferred governance candidates | **APPROVED** |
| ProductInsight, CreatorStudioArtifact, ReviewDecision as Extended V1 candidates | **APPROVED** |
| SQL schema and implementation not authorized | **CONFIRMED** |

---

## 15. ERD Risks and Controls

| Risk | Severity | Control |
|---|---|---|
| Over-modeling all 23 screens delays V1 | **HIGH** | V1 Core entities only in first slice; candidates documented but not implemented |
| Under-modeling workspace/auth creates security rework | **HIGH** | Workspace scoping mandatory for all business entities; Auth/RBAC Gate validates |
| Storing credentials on ChannelConnection creates security exposure | **HIGH** | IntegrationCredential is a separate sensitive candidate; Threat Modeling Gate required |
| Analytics without lineage creates trust risk | **MEDIUM** | Section 12 lineage rules; `sourceSummary` required on AnalyticsSnapshot |
| Publishing statuses misleading users | **HIGH** | `simulated` status clearly distinct; no real publishing before integration gate |
| Treating candidate fields as final locks API prematurely | **MEDIUM** | Fields are logical, not SQL; API Contract Gate and Storage Gate finalize |
| Ignoring PDPL/GCC compliance creates regulatory risk | **MEDIUM** | Section 13 compliance notes; future evaluation required |
| Missing audit model weakens governance | **MEDIUM** | AuditEvent included as cross-cutting candidate; append-only required |

---

## 16. Impact on Next Gates

| Gate | Impact from this ERD |
|---|---|
| **Auth/RBAC/Workspace Identity Gate** | Must validate User, WorkspaceMember, and role assumptions; must confirm workspace isolation model |
| **API Contract/OpenAPI Gate** | Must use this ERD as input; may refine response/request models; must reflect workspace scoping, auth headers, and permission requirements |
| **Threat Modeling/Security Gate** | Must evaluate credential, publishing, AI/governance, audit, and workspace isolation risks from this model |
| **Data Migration/Storage Strategy Gate** | Must convert logical entities into concrete storage decisions; PostgreSQL-compatible as planned direction |
| **Test Strategy Gate** | Must cover workspace isolation, entity relationships, status transitions, and human-in-the-loop flows |
| **Implementation Slice 1 Planning Gate** | Likely scope: Workspace, StoreProfile, Product, DataSource, ChannelConnection, Asset, minimal AuditEvent |

---

## 17. Marketing OS Boundary

| Rule | Status |
|---|---|
| `marketing-os` remains reference-only | **CONFIRMED** |
| This ERD must not copy marketing-os entity model | **CONFIRMED** |
| This gate does not authorize extraction | **CONFIRMED** |
| Future extraction may compare concepts only through a separate gate | **CONFIRMED** |
| Extracted items must be categorized: Adopt / Adapt / Reject / Defer | For the extraction gate |
| Nashir's approved 23-screen scope and Nashir-first model remain authoritative | **CONFIRMED** |

---

## 18. Required Next Gates

| Priority | Gate | Purpose |
|---:|---|---|
| 1 | **Nashir ERD/Data Model Review Gate** | Reviews this ERD before downstream strategy gates begin |
| 2 | **Nashir Auth/RBAC/Workspace Identity Gate** | Validates identity model, workspace isolation, and role/permission structure |
| 3 | **Nashir API Contract/OpenAPI Gate** | Approves API contract based on this ERD and Auth/RBAC direction |
| 4 | **Nashir Test Strategy Gate** | Defines coverage for entity relationships and workspace isolation |
| 5 | **Nashir Threat Modeling/Security Gate** | Evaluates credential, publishing, AI governance, audit, and workspace isolation risks |
| 6 | **Nashir Data Migration/Storage Strategy Gate** | Converts logical entities into storage decisions |
| 7 | **Nashir Environment/Deployment Strategy Gate** | Plans backend runtime hosting |
| 8 | **Marketing OS Knowledge Extraction Planning Gate** | Optional non-binding reference study only |
| 9 | **Nashir Real Implementation Slice 1 Planning Gate** | First real backend slice: Workspace, StoreProfile, Product, DataSource, ChannelConnection, Asset |

---

## 19. NO-GO Boundaries

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

## 20. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | Only new ERD gate doc untracked |
| `git diff --stat` | Only `docs/nashir_erd_data_model_gate.md` (new file) |
| Forbidden files check | **PASS** — no `src/`, `package.json`, `README.md`, `docs/screen_map.md`, or `marketing-os` files modified |

---

## 21. GO / NO-GO Result

| Decision | Status |
|---|---|
| **ERD/Data Model gate complete** | **GO** |
| **CONDITIONAL GO: Nashir ERD/Data Model Review Gate** | After this gate merges |
| **CONDITIONAL GO: Nashir Auth/RBAC/Workspace Identity Gate** | After ERD review |
| **CONDITIONAL GO: Nashir API Contract/OpenAPI Gate** | After Auth/RBAC and ERD direction |
| **CONDITIONAL GO: Marketing OS Knowledge Extraction Gate** | Optional non-binding reference only |
| Backend/API implementation | **NO-GO** |
| SQL/schema implementation | **NO-GO** |
| Database migrations | **NO-GO** |
| OpenAPI creation | **NO-GO** |
| Auth/RBAC implementation | **NO-GO** |
| UI integration | **NO-GO** |
| marketing-os extraction in this PR | **NO-GO** |
| Package/build changes | **NO-GO** |
| Production/pilot readiness | **NO-GO** |
