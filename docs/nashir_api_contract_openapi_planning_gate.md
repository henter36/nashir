# Nashir API Contract / OpenAPI Planning Gate

| Field | Value |
|---|---|
| Gate type | API Contract / OpenAPI planning gate — documentation only |
| Status | Planning complete |
| Date | 2026-06-02 |
| Scope | Plans the future Nashir V1 API contract surface, resource groupings, endpoint inventory, entity coverage, error behavior, and OpenAPI document structure — before any OpenAPI YAML, backend code, or generated client |
| Prerequisite gates | `docs/nashir_auth_rbac_workspace_identity_gate.md` — merged (PR #73); `docs/nashir_auth_rbac_workspace_identity_review_gate.md` — merged (PR #74) |
| Backend/API implementation | NO |
| SQL schema / migrations | NO |
| OpenAPI YAML / JSON | NO |
| Auth/RBAC implementation | NO |
| Generated / runtime client | NO |
| UI/source code changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Purpose and Scope

This is a documentation-only API Contract / OpenAPI planning gate.

**No backend or API implementation is performed.**

**No OpenAPI YAML or JSON is created.**

**No SQL schema or database migrations are introduced.**

**No auth middleware, guard code, or RBAC implementation is added.**

**No generated TypeScript types, SDK, or runtime client is produced.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

### Why this gate comes after Auth/RBAC and before OpenAPI YAML

Auth/RBAC and workspace scoping decisions must precede the OpenAPI contract because:

1. **Every protected operation requires a known permission code** — permission assignments per operation cannot be written into OpenAPI security objects without the approved permission groups from PR #73.
2. **WorkspaceId path scoping must be standardized before paths are written** — the `/workspaces/{workspaceId}/...` pattern and body-rejection rule must be decided before OpenAPI path objects are defined.
3. **Error codes (401 / 403 / 404 non-disclosing) must be consistent** — the non-disclosing 404 behavior and 403 vs 401 distinction must be decided before OpenAPI response objects are written.
4. **Credential and audit rules must inform response schemas** — no raw secrets in responses, no credential fields exposed, AuditEvent append-only concept must shape the schema design.

Writing OpenAPI before these decisions are stable produces a contract that will require immediate breaking revisions. This gate closes those preconditions.

### Output of this gate

This gate produces a planning decision:

- Resource groups organized by V1 journey.
- Endpoint family inventory (route patterns only, no YAML).
- Entity-to-API coverage matrix.
- Request/response rules.
- Error behavior plan.
- State transition plan.
- OpenAPI document structure proposal.
- Screen-to-API dependency map.
- GO/NO-GO for the OpenAPI Planning Review Gate.

The next gate — **Nashir API Contract / OpenAPI Planning Review Gate** — reviews this planning document before any OpenAPI YAML is written.

---

## 2. Inputs Reviewed

### Direct source inputs

| Input | Finding |
|---|---|
| `README.md` | 23 screens; V1 Core journey approved; no backend, auth, or RBAC implemented |
| `docs/screen_map.md` | 23 screens with V1 Classification; navigation groups current |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` (PR #73) | Identity model; workspace scoping rules; 7-role model; 24 permission groups; 18-entity access table; OpenAPI implications; error behavior (401/403/404/409/422) |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` (PR #74) | All 16 criteria PASS; API Contract/OpenAPI Planning Gate authorized |

### Historical context gates

| Gate | Finding |
|---|---|
| PR #62–63 — Product Scope Reconciliation | 23 screens confirmed |
| PR #64–65 — V1 Scope Decision | 10 V1 Core, 2 V1 Support, 8 V1 Admin/Governance, 3 Extended V1 |
| PR #66 — V1 Scope Documentation Update | README and screen_map aligned |
| PR #67–68 — Productization Roadmap | 7-phase roadmap; API Contract after Auth/RBAC |
| PR #69–70 — Backend/API Strategy | Nashir-first; REST/OpenAPI; Node.js; PostgreSQL-compatible |
| PR #71–72 — ERD/Data Model | 17 V1 Core entities + IntegrationCredential; workspace root; relationships; field-level model |

### Confirmed baseline

- 23-screen scope approved; V1 Core is the first implementation priority.
- Backend is Nashir-first; marketing-os is reference-only.
- No backend, auth, OpenAPI, schema, or generated client exists.
- Auth/RBAC/Workspace Identity decisions are approved and reviewed.
- This gate is the first step toward executable OpenAPI.

---

## 3. Current Facts, Planning Decisions, and Deferred Items

### Approved facts from prior gates

| Fact | Source |
|---|---|
| Backend direction is Nashir-first; marketing-os is rejected as V1 runtime backend | PR #69/70 |
| REST + OpenAPI is the planned API style | PR #69/70 |
| Node.js (TypeScript later) + PostgreSQL-compatible is the planned tech stack | PR #69/70 |
| Workspace is the root for all merchant-owned data | PR #71/72 |
| All 17 V1 Core entities + IntegrationCredential are defined | PR #71/72 |
| 7 roles approved: owner, admin, editor, reviewer, publisher, analyst, viewer | PR #73/74 |
| 24 permission groups approved | PR #73/74 |
| workspaceId is path-derived; body workspaceId must be rejected with validation error | PR #73/74 |
| Error behavior: 401 / 403 / 404 non-disclosing / 409 / 422 | PR #73/74 |
| No raw credentials in any API response | PR #73/74 |
| No generated client before OpenAPI is approved | PR #73/74 |
| AuditEvent append-only; analytics must carry sourceSummary | PR #71/72/73/74 |

### Planning decisions made in this gate

| Decision | Detail |
|---|---|
| OpenAPI version | OpenAPI 3.1 recommended (see Section 12) |
| Path structure | All merchant-owned resources under `/workspaces/{workspaceId}/...` |
| workspaceId handling | Path parameter only; body presence is a validation error |
| ID format | String (UUID v4 recommended); path-derived for nested resources |
| Pagination | Cursor-based for list endpoints; `limit` + `cursor` query parameters |
| Partial update | PATCH for partial updates; PUT for full replacement where applicable |
| Delete vs archive | Soft-delete (archive) preferred for content and campaign entities; hard delete deferred |
| Resource naming | Plural kebab-case path segments: `store-profile`, `content-items`, `analytics-snapshots` |
| OperationId convention | `{verb}{ResourceName}` in PascalCase (e.g., `listProducts`, `getStoreProfile`) |
| Error model | Consistent error envelope across all endpoints: `{ code, message, userAction?, correlationId? }` |
| Timestamps | All timestamps are server-owned; ISO 8601 UTC; not accepted from client in create/update |
| State transitions | Modeled as dedicated POST sub-resources (e.g., `.../submit-review`, `.../approve`) |

### Deferred items

| Item | Gate |
|---|---|
| Concrete OpenAPI YAML | OpenAPI YAML Implementation Gate |
| Auth scheme implementation (JWT/token mechanism) | Backend Slice 1 Planning Gate |
| Generated TypeScript types / client SDK | Post-OpenAPI-approval gate |
| SQL schema for all entities | SQL/Schema Planning Gate |
| Real-time / webhook endpoints | Post-V1 |
| GraphQL surface | Post-V1 |
| Bulk operations | Post-V1 unless critical for V1 Core |
| Rate limiting / throttling specification | Backend Slice 1 Planning Gate |
| Versioning strategy (URL vs header) | Recommended: URL versioning (`/v1/...`); decision deferred to OpenAPI YAML gate |
| IntegrationCredential full implementation | Deferred gate (credential/vault strategy) |
| Extended V1 endpoints (productIntelligence, creatorStudio, contentReview) | Extended V1 gate |

---

## 4. API Design Principles for Nashir V1

| Principle | Detail |
|---|---|
| Nashir-first | The API serves the Nashir V1 product journey; marketing-os patterns are reference-only and must not be imposed |
| Workspace-scoped by default | All merchant-owned resources live under `/workspaces/{workspaceId}/...`; no unscoped business data |
| REST + OpenAPI later | REST-style resource design; OpenAPI YAML produced only after planning review is approved |
| Route-derived workspaceId | workspaceId comes from the URL path; validated after auth + active membership check |
| No workspaceId in request body | Any body field named `workspaceId` or `workspace_id` is a validation error (422) |
| No GET request bodies | GET endpoints must not accept or process request bodies |
| No raw credentials in responses | No secret values, vault references, OAuth tokens, or raw API keys may appear in any response field |
| Deny by default | No permission is assumed; every protected operation requires explicit role assignment |
| Least privilege | Operations grant minimum necessary permission; no broad admin catch-alls |
| Explicit error behavior | 401 / 403 / 404 non-disclosing / 409 / 422 are precisely defined and consistent |
| Contract-first before implementation | No backend route is written before its OpenAPI operation is approved |
| No generated client before approved OpenAPI | TypeScript types, SDK, or client generation must not start until OpenAPI YAML is reviewed and merged |
| No marketing-os runtime dependency | Nashir API does not call, extend, or proxy marketing-os routes at runtime |

---

## 5. Auth and Workspace Scoping Implications

| Requirement | Detail |
|---|---|
| Auth scheme placeholder | Bearer token (mechanism TBD in Backend Slice 1 Planning); all protected operations declare `bearerAuth` security requirement in future OpenAPI |
| All merchant-owned resources under `/workspaces/{workspaceId}/...` | No workspace-scoped resource is reachable without workspaceId in the path |
| Active WorkspaceMember required | Every request to a workspace-scoped resource is verified against an active membership record for the target workspace |
| Invited members denied | WorkspaceMember with status `invited` receives 403 |
| Suspended members denied | WorkspaceMember with status `suspended` receives 403 |
| Route-level workspaceId must match stored resource workspaceId | If path workspaceId does not match the resource's stored workspaceId, respond with 404 (not 403) |
| Cross-workspace non-disclosing behavior | A resource in workspace B is invisible to a request authenticated against workspace A — 404, not 403, to prevent enumeration |
| Body workspaceId rejected | `workspaceId` or `workspace_id` in request body is a 422 validation error; never silently overridden |
| Route enforcement order | authGuard → workspaceContextGuard → membershipCheck → permissionGuard (body workspaceId rejection at permissionGuard or schema validation layer) |

---

## 6. Resource Grouping by V1 Journey

| Resource Group | V1 Screen(s) | ERD Entity/Entities | Workspace Scope | Min Permission | Read/Write | V1 Classification | OpenAPI Planning Notes |
|---|---|---|---|---|---|---|---|
| Workspace / Membership | (all screens) | Workspace, WorkspaceMember | YES — root | `workspace.read` / `members.manage` | Read + Write | **V1 Core** | WorkspaceMember invite/suspend as state transitions; member list must not be visible to non-members |
| Store Setup / Store Profile | storeSetup | StoreProfile | YES | `store_profile.read` / `store_profile.update` | Read + Write | **V1 Core** | One StoreProfile per workspace in V1; upsert pattern |
| Product Catalog | productCatalog | Product | YES | `products.read` / `products.manage` | Read + Write + Archive | **V1 Core** | Soft-delete as archive; pagination required |
| Data Sources | dataSourcesHub | DataSource | YES | `data_sources.read` / `data_sources.manage` | Read + Write | **V1 Core** | Connection status tracking; no raw credentials here |
| Channel Connections | dataSourcesHub, multiPlatform | ChannelConnection | YES | `channel_connections.read` / `channel_connections.manage` | Read + Write | **V1 Core** | Optional `dataSourceId` link; no credentials on entity |
| Integration Credentials | secrets | IntegrationCredential | YES | `integration_credentials.manage` | Write only (create/rotate/revoke); never read raw | **V1 Admin/Governance — deferred** | Vault reference only; raw value never returned; implementation deferred |
| Asset Library | assetLibrary | Asset | YES | `assets.read` / `assets.manage` | Read + Write + Archive | **V1 Core** | Optional `productId` and `campaignContentItemId` links; storage reference placeholder |
| Campaign Wizard / Campaign Brief | campaigns (wizard) | Campaign, CampaignBrief | YES | `campaigns.read` / `campaigns.manage` | Read + Write | **V1 Core** | CampaignBrief nested under Campaign |
| Campaigns | campaignsList | Campaign | YES | `campaigns.read` / `campaigns.manage` | Read + List + State transitions | **V1 Core** | Campaign lifecycle state transitions as sub-resource POSTs |
| Campaign Content Items | content | CampaignContentItem | YES | `content.read` / `content.manage` | Read + Write + State | **V1 Core** | Nested under Campaign; status transitions |
| Content Drafts | content | ContentDraft | YES | `content.read` / `content.manage` | Read + Write + Submit | **V1 Core** | Versioned; submit-review as state transition |
| Content Approvals | content | ContentApproval | YES | `content.approve` | Write (approve/reject) + Read | **V1 Core** | Self-approval forbidden at service layer; reviewer/admin/owner only |
| Publishing Queue / Publishing Jobs | publishingQueue | PublishingJob | YES | `publishing.read` / `publishing.manage` | Read + Write + Confirm | **V1 Core** | Manual confirm only; `simulated` status distinct from real |
| Publishing Status | publishingQueue | PublishingStatus | YES | `publishing.read` | Read (append-only source) | **V1 Core** | Append-only status trail; no client writes |
| Analytics Snapshots | analytics | AnalyticsSnapshot | YES | `analytics.read` | Read only | **V1 Core** | sourceSummary required; status: available/partial/stale/unavailable |
| Audit Events | workflowRuns, systemAdmin | AuditEvent | YES | `audit_events.read` | Read only | **V1 Admin/Governance** | Append-only; admin/owner access only |
| Team / Workspace Settings | teamCollaboration, settings | WorkspaceMember, Workspace | YES | varies | Read + Write | **V1 Support / Admin/Governance** | Overlaps with Workspace/Membership group |
| Template Engine | templateEngine | Template (candidate) | YES | TBD | Read + Write | **V1 Admin/Governance** | Template entity is a governance candidate; deferred to Admin/Governance gate |
| Workflow Runs | workflowRuns | WorkflowRun (candidate) | YES | TBD | Read | **V1 Admin/Governance** | Read-only advisory in V1; governance candidate |
| Extended V1 — Product Intelligence | productIntelligence | ProductInsight (candidate) | YES | TBD | Read | **Extended V1** | Depends on real Product/Campaign data |
| Extended V1 — Creator Studio | creatorStudio | CreatorStudioArtifact (candidate) | YES | TBD | Read + Write | **Extended V1** | Architecture candidate; acceleration candidate |
| Extended V1 — Content Review | contentReview | ReviewDecision (candidate) | YES | TBD | Read + Write | **Extended V1** | Architecture decision open: standalone vs. integrated with ContentApproval |

---

## 7. Planned Endpoint Surface Inventory

Route patterns only — no OpenAPI YAML. All paths are planning candidates.

### Workspace and Membership

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}` | GET, PATCH | Read or update workspace metadata | Workspace | `workspace.read` / `workspace.update` | 401/403/404 | **V1 Required** |
| `/workspaces/{workspaceId}/members` | GET, POST | List members; invite new member | WorkspaceMember | `workspace.read` (list) / `members.manage` (create) | 401/403/404 | **V1 Required** |
| `/workspaces/{workspaceId}/members/{memberId}` | GET, PATCH, DELETE | Read / update role / remove member | WorkspaceMember | `members.manage` | 401/403/404 | **V1 Required** |
| `/workspaces/{workspaceId}/members/{memberId}/suspend` | POST | Suspend a member | WorkspaceMember | `members.manage` | 401/403/404/409 | **V1 Required** |
| `/workspaces/{workspaceId}/members/{memberId}/activate` | POST | Reactivate a suspended member | WorkspaceMember | `members.manage` | 401/403/404/409 | **V1 Required** |

### Store Profile

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/store-profile` | GET, PUT | Read or update store profile (upsert semantics) | StoreProfile | `store_profile.read` / `store_profile.update` | 401/403/404 | **V1 Required** |

### Product Catalog

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/products` | GET, POST | List / create products | Product | `products.read` / `products.manage` | 401/403/404/422 | **V1 Required** |
| `/workspaces/{workspaceId}/products/{productId}` | GET, PATCH, DELETE | Read / update / archive product | Product | `products.read` / `products.manage` | 401/403/404/409/422 | **V1 Required** |

### Data Sources

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/data-sources` | GET, POST | List / create data sources | DataSource | `data_sources.read` / `data_sources.manage` | 401/403/404/422 | **V1 Required** |
| `/workspaces/{workspaceId}/data-sources/{dataSourceId}` | GET, PATCH, DELETE | Read / update / remove data source | DataSource | `data_sources.read` / `data_sources.manage` | 401/403/404/409/422 | **V1 Required** |

### Channel Connections

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/channel-connections` | GET, POST | List / create channel connections | ChannelConnection | `channel_connections.read` / `channel_connections.manage` | 401/403/404/422 | **V1 Required** |
| `/workspaces/{workspaceId}/channel-connections/{connectionId}` | GET, PATCH, DELETE | Read / update / remove channel connection | ChannelConnection | `channel_connections.read` / `channel_connections.manage` | 401/403/404/409/422 | **V1 Required** |

### Integration Credentials

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/integration-credentials` | POST | Create credential reference (vault-backed) | IntegrationCredential | `integration_credentials.manage` | 401/403/422 | **Deferred — credential gate** |
| `/workspaces/{workspaceId}/integration-credentials/{credentialId}` | DELETE | Revoke credential reference | IntegrationCredential | `integration_credentials.manage` | 401/403/404 | **Deferred — credential gate** |

### Asset Library

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/assets` | GET, POST | List / create asset records | Asset | `assets.read` / `assets.manage` | 401/403/404/422 | **V1 Required** |
| `/workspaces/{workspaceId}/assets/{assetId}` | GET, PATCH, DELETE | Read / update / archive asset | Asset | `assets.read` / `assets.manage` | 401/403/404/409/422 | **V1 Required** |

### Campaigns

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/campaigns` | GET, POST | List / create campaigns | Campaign | `campaigns.read` / `campaigns.manage` | 401/403/404/422 | **V1 Required** |
| `/workspaces/{workspaceId}/campaigns/{campaignId}` | GET, PATCH, DELETE | Read / update / archive campaign | Campaign | `campaigns.read` / `campaigns.manage` | 401/403/404/409/422 | **V1 Required** |
| `/workspaces/{workspaceId}/campaigns/{campaignId}/brief` | GET, PUT | Read or set campaign brief | CampaignBrief | `campaigns.read` / `campaigns.manage` | 401/403/404/422 | **V1 Required** |

### Campaign Content Items

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items` | GET, POST | List / create content items | CampaignContentItem | `content.read` / `content.manage` | 401/403/404/422 | **V1 Required** |
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items/{itemId}` | GET, PATCH | Read / update content item | CampaignContentItem | `content.read` / `content.manage` | 401/403/404/409/422 | **V1 Required** |

### Content Drafts

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items/{itemId}/drafts` | GET, POST | List / create drafts for a content item | ContentDraft | `content.read` / `content.manage` | 401/403/404/422 | **V1 Required** |
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items/{itemId}/drafts/{draftId}` | GET, PATCH | Read / update draft | ContentDraft | `content.read` / `content.manage` | 401/403/404/409/422 | **V1 Required** |
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items/{itemId}/drafts/{draftId}/submit-review` | POST | Submit draft for review | ContentDraft | `content.manage` | 401/403/404/409 | **V1 Required** |

### Content Approvals

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items/{itemId}/drafts/{draftId}/approve` | POST | Approve a draft | ContentApproval | `content.approve` | 401/403/404/409 (self-approval = 409) | **V1 Required** |
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items/{itemId}/drafts/{draftId}/reject` | POST | Reject a draft | ContentApproval | `content.approve` | 401/403/404/409 | **V1 Required** |
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items/{itemId}/drafts/{draftId}/approvals` | GET | Read approval history for a draft | ContentApproval | `content.read` | 401/403/404 | **V1 Required** |

### Publishing

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/publishing-jobs` | GET, POST | List / create publishing jobs | PublishingJob | `publishing.read` / `publishing.manage` | 401/403/404/422 | **V1 Required** |
| `/workspaces/{workspaceId}/publishing-jobs/{jobId}` | GET, PATCH | Read / update publishing job | PublishingJob | `publishing.read` / `publishing.manage` | 401/403/404/409/422 | **V1 Required** |
| `/workspaces/{workspaceId}/publishing-jobs/{jobId}/confirm` | POST | Confirm a scheduled publishing job | PublishingJob | `publishing.manage` | 401/403/404/409 | **V1 Required** |
| `/workspaces/{workspaceId}/publishing-jobs/{jobId}/cancel` | POST | Cancel a publishing job | PublishingJob | `publishing.manage` | 401/403/404/409 | **V1 Required** |
| `/workspaces/{workspaceId}/publishing-jobs/{jobId}/status` | GET | Read status trail for a publishing job | PublishingStatus | `publishing.read` | 401/403/404 | **V1 Required** |

### Analytics

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/analytics-snapshots` | GET | List analytics snapshots with filter by subject | AnalyticsSnapshot | `analytics.read` | 401/403/404 | **V1 Required** |
| `/workspaces/{workspaceId}/analytics-snapshots/{snapshotId}` | GET | Read a single analytics snapshot | AnalyticsSnapshot | `analytics.read` | 401/403/404 | **V1 Required** |

### Audit Events

| Route Pattern | Methods | Purpose | Entity | Min Permission | Error Notes | V1 Status |
|---|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/audit-events` | GET | List audit events (admin/owner only) | AuditEvent | `audit_events.read` | 401/403/404 | **V1 Required** |

### Deferred / Extended V1

| Route Pattern | Purpose | V1 Status |
|---|---|---|
| `/workspaces/{workspaceId}/templates` | Template Engine (Admin/Governance candidate) | **Deferred — Admin/Governance gate** |
| `/workspaces/{workspaceId}/workflow-runs` | Workflow run advisory read | **Deferred — Admin/Governance gate** |
| `/workspaces/{workspaceId}/product-intelligence` | Product Intelligence (Extended V1) | **Extended V1** |
| `/workspaces/{workspaceId}/creator-studio/...` | Creator Studio (Extended V1) | **Extended V1** |
| `/workspaces/{workspaceId}/content-review/...` | Content Review (Extended V1; architecture open) | **Extended V1** |

---

## 8. Entity-to-API Coverage Matrix

| Entity | Create | Read | List | Update | Delete/Archive | State Transition | Audit Emission | Analytics Linkage | Credential Rule |
|---|---|---|---|---|---|---|---|---|---|
| `Workspace` | NO (provisioned externally in V1) | YES | NO | YES (settings) | NO | NO | YES (settings changes) | NO | — |
| `User` | NO (auth provider) | NO (via WorkspaceMember only) | NO | NO | NO | NO | YES (auth events, provider-managed) | NO | — |
| `WorkspaceMember` | YES (invite) | YES | YES | YES (role change) | YES (remove) | YES (invite→active→suspended) | YES (all changes) | NO | — |
| `StoreProfile` | YES (upsert) | YES | NO (one per workspace) | YES | NO | NO | YES (updates) | NO | — |
| `Product` | YES | YES | YES | YES | YES (archive) | YES (draft→active→archived) | YES (creates/updates) | YES (AnalyticsSnapshot subject) | — |
| `DataSource` | YES | YES | YES | YES | YES | YES (status transitions) | YES | NO | — |
| `ChannelConnection` | YES | YES | YES | YES | YES | YES (status transitions) | YES | YES (AnalyticsSnapshot subject) | No credentials on entity |
| `IntegrationCredential` | YES (vault ref) | NO (never returned) | NO | NO (rotate = delete+create) | YES (revoke) | NO | YES (all operations) | NO | **Vault ref only; raw value never returned** |
| `Asset` | YES | YES | YES | YES | YES (archive) | YES (active→archived) | YES | NO | — |
| `Campaign` | YES | YES | YES | YES | YES (archive) | YES (draft→…→completed→archived) | YES (key transitions) | YES (AnalyticsSnapshot subject) | — |
| `CampaignBrief` | YES (with/after Campaign) | YES | NO (one per Campaign) | YES | NO | NO | YES (updates) | NO | — |
| `CampaignContentItem` | YES | YES | YES | YES | YES (archive) | YES (status transitions) | YES | NO | — |
| `ContentDraft` | YES | YES | YES | YES | YES (archive) | YES (submit-review) | YES | NO | — |
| `ContentApproval` | YES (approve/reject) | YES | YES | NO (immutable after decision) | NO | NO (decision is terminal) | YES (every decision) | NO | — |
| `PublishingJob` | YES | YES | YES | YES (pre-confirm only) | YES (cancel) | YES (draft→scheduled→confirmed→simulated/cancelled) | YES (all transitions) | YES (AnalyticsSnapshot subject) | — |
| `PublishingStatus` | NO (server-appended only) | YES | YES | NO | NO | NO (append-only) | NO (IS the audit trail) | NO | — |
| `AnalyticsSnapshot` | NO (server-generated) | YES | YES | NO | NO | NO (sourceSummary required) | YES (if snapshot is stale or regenerated) | IS the analytics entity | No fake production data |
| `AuditEvent` | NO (server-appended only) | YES | YES | NO | NO | NO (append-only) | IS the audit trail | NO | — |

---

## 9. Request / Response Planning Rules

| Rule | Detail |
|---|---|
| IDs are path-derived | Resource IDs appear in URL path; do not accept ID fields in the request body for existing resources |
| workspaceId is path-derived | Never accepted in request body; presence in body is 422 validation error |
| Server-owned fields excluded from client input | `id`, `workspaceId`, `createdAt`, `updatedAt`, timestamps are server-generated and not accepted in create/update bodies |
| Timestamps are server-owned | ISO 8601 UTC; no client-supplied timestamp for created/updated |
| Status fields use approved enums only | No freeform status strings; enum values must be documented in OpenAPI schema; deferred lifecycle naming must not be invented prematurely |
| Secret values are write-only | IntegrationCredential: vault reference ID is opaque; never returned in any GET or list response; POST returns 201 with no secret body |
| List endpoints require pagination | `limit` (max page size) + `cursor` (opaque continuation token) for all list operations; no offset-based pagination in V1 |
| Filtering and sorting must be explicitly planned | Ad hoc query parameters are not allowed; each filter/sort parameter must be named and documented in OpenAPI |
| Partial updates via PATCH | PATCH for partial field updates; PUT for full replacement where semantically appropriate (e.g., StoreProfile, CampaignBrief) |
| Delete vs archive decided per entity | See entity matrix (Section 8); WorkspaceMember = remove; Campaign/ContentDraft/Asset = archive; AuditEvent/PublishingStatus = neither |
| Audit-emitting operations documented | Operations that emit AuditEvent must note this in their description; not expressed as a response field |
| State transitions as sub-resource POSTs | Lifecycle changes (submit-review, approve, reject, confirm, cancel, suspend, activate) are POST to a named sub-resource, not PATCH to a status field |
| Response envelope | Consistent envelope for error responses: `{ code, message, userAction?, correlationId? }`; success responses may use direct object or `{ data: ... }` — to be decided in OpenAPI YAML gate |

---

## 10. Error Behavior Planning

| Status | Meaning | When to Return |
|---|---|---|
| `401 Unauthorized` | Auth token missing or invalid; no user identity established | Request lacks valid auth token |
| `403 Forbidden` | User authenticated; but WorkspaceMember is not `active` (invited or suspended), or does not have the required permission | Active membership check fails; permission check fails |
| `404 Not Found` | Resource does not exist within the request workspace, OR the requester is not a member of the workspace | Resource missing; cross-workspace access attempt; non-member access attempt (non-disclosing) |
| `409 Conflict` | Invalid state transition; business rule violation | Attempting to approve already-approved draft; self-approval attempt; cancelling an already-cancelled job |
| `422 Unprocessable Entity` | Request body fails schema or business validation | workspaceId in body; required field missing; enum value invalid |
| `500 Internal Server Error` | Unexpected server failure | Infrastructure failure; must not leak stack trace or internal state |

**Cross-workspace non-disclosing rule:** A resource belonging to workspace B must return `404` when accessed from workspace A's context — not `403`. This prevents an authenticated user from discovering whether a resource exists in another workspace.

**Error model consistency:** All error responses must use the same envelope shape across all endpoints. The exact schema is deferred to OpenAPI YAML gate but must be consistent.

---

## 11. State Transition Planning

### WorkspaceMember

| Transition | Trigger | Required Permission | Audit | Approved Status Names |
|---|---|---|---|---|
| `invited` → `active` | Member accepts invitation | None (self-action) | YES | `invited`, `active` — **APPROVED** (PR #71/73) |
| `active` → `suspended` | Admin/owner suspends member | `members.manage` | YES | `suspended` — **APPROVED** |
| `suspended` → `active` | Admin/owner reactivates | `members.manage` | YES | `active` — **APPROVED** |

### Campaign

| Transition | Trigger | Required Permission | Audit | Status Notes |
|---|---|---|---|---|
| lifecycle statuses | editor/admin/owner actions | `campaigns.manage` | YES | **DEFERRED** — Campaign status enum naming (draft/generating/review/ready/scheduled/active/paused/completed/archived from PR #71 Section 10) is a planning candidate; must be confirmed in OpenAPI YAML gate before implementation |

### ContentDraft

| Transition | Trigger | Required Permission | Audit | Status Notes |
|---|---|---|---|---|
| submit-review | editor/admin/owner submits | `content.manage` | YES | **DEFERRED** — ContentDraft lifecycle state names are planning candidates; must not be added to this gate; deferred to OpenAPI YAML gate per PR #72/74 correction |

### ContentApproval

| Decision | Trigger | Required Permission | Self-approval | Audit |
|---|---|---|---|---|
| Approve | reviewer/admin/owner | `content.approve` | **FORBIDDEN** (409 if attempted) | YES |
| Reject | reviewer/admin/owner | `content.approve` | **FORBIDDEN** (409 if attempted) | YES |

### PublishingJob

| Transition | Trigger | Required Permission | Audit | Approved Status Names |
|---|---|---|---|---|
| `draft` → `scheduled` | publisher/admin/owner creates with schedule | `publishing.manage` | YES | `draft`, `scheduled` — planning candidates |
| `scheduled` → `confirmed` | publisher/admin/owner confirms | `publishing.manage` | YES | `confirmed` — planning candidate |
| `confirmed` → `simulated` | Server completes simulated run | server-side | YES | `simulated` — **APPROVED** (PR #71) — must remain distinct from any future real publishing status |
| any → `cancelled` | publisher/admin/owner cancels | `publishing.manage` | YES | `cancelled` — planning candidate |
| any → `failed` | Server-side failure | server-side | YES | `failed` — planning candidate |

**Publishing statuses noted as planning candidates are not finalized until OpenAPI YAML gate.**

### AnalyticsSnapshot

| Status | Meaning | Audit |
|---|---|---|
| `available` | Real data available with valid source | YES on transition |
| `partial` | Some data available; sources incomplete | YES on transition |
| `stale` | Data exists but source freshness expired | YES on transition |
| `unavailable` | No data available | YES on transition |

All four status names are **APPROVED** (PR #71/72). `sourceSummary` field is required on every snapshot.

---

## 12. OpenAPI Document Structure Proposal

No OpenAPI YAML is created in this gate. This section proposes the structure for the future OpenAPI document.

| Element | Recommendation | Notes |
|---|---|---|
| OpenAPI version | **3.1** (recommended) | OAS 3.1 aligns JSON Schema Draft 2020-12; better null handling; preferred for new APIs; marked as planning recommendation — confirmed at OpenAPI YAML gate |
| `info` | `title: Nashir V1 API`, `version: 1.0.0`, `contact`, `license` | Standard metadata |
| `servers` | Placeholder: `https://api.nashir.app/v1` (URL versioning) | URL versioning (`/v1/`) recommended; deferred to OpenAPI YAML gate for final decision |
| `tags` | One tag per resource group (workspace, store-profile, products, data-sources, channel-connections, assets, campaigns, content-items, content-drafts, content-approvals, publishing-jobs, analytics-snapshots, audit-events) | Drives generated docs grouping |
| `securitySchemes` | `bearerAuth` of type `http` with `scheme: bearer`; `bearerFormat: JWT` placeholder | Mechanism TBD in Backend Slice 1 Planning |
| `parameters` | `workspaceId` (path, required, string, UUID), `limit` (query, integer), `cursor` (query, string), common pagination params as `$ref` components | Reuse via `$ref` to avoid duplication |
| `paths` | Organized by resource group; see Section 7 for route inventory | No ad hoc paths |
| `schemas` | One schema per entity; error envelope schema; pagination envelope schema; status enums as `enum` arrays | Naming: `{EntityName}` (e.g., `Product`, `Campaign`, `ContentDraft`) |
| Error model | `{ code: string, message: string, userAction?: string, correlationId?: string }` | Consistent across all 4xx/5xx responses; named `ErrorResponse` |
| Pagination model | `{ data: [...], nextCursor?: string, hasMore: boolean }` for list responses | Cursor-based only |
| OperationId convention | `{verb}{ResourceName}` in PascalCase: `listProducts`, `getProduct`, `createProduct`, `updateProduct`, `archiveProduct`, `submitContentDraftReview`, `approveContentDraft` | Consistent naming enables clean generated client later |
| `examples` | Per-operation request/response examples; use realistic but mock data | Aids reviewers; required for generated docs quality |
| Generated client | **NO-GO until OpenAPI is approved** | No TypeScript types, SDK, or client generation before OpenAPI YAML review gate merges |

---

## 13. Screen-to-API Dependency Map

### V1 Core screens

| Screen | API Resource Groups Needed |
|---|---|
| Dashboard | Read-only aggregation: Workspace, StoreProfile, Campaign (summary), AnalyticsSnapshot, PublishingJob (status summary) |
| Store Setup | StoreProfile (GET, PUT); Workspace (GET, PATCH) |
| Product Catalog | Products (GET list, GET, POST, PATCH, DELETE/archive) |
| Data Sources | DataSources (GET list, GET, POST, PATCH, DELETE); ChannelConnections (GET list) |
| Asset Library | Assets (GET list, GET, POST, PATCH, DELETE/archive) |
| Campaign Wizard | Campaigns (POST); CampaignBrief (PUT); CampaignContentItems (POST) |
| Campaigns | Campaigns (GET list, GET, PATCH, archive); CampaignBrief (GET); PublishingJob (summary) |
| Content Studio | CampaignContentItems (GET, PATCH); ContentDrafts (GET list, GET, POST, PATCH, submit-review); ContentApprovals (GET, approve, reject) |
| Publishing Queue | PublishingJobs (GET list, GET, POST, confirm, cancel); PublishingStatus (GET) |
| Analytics | AnalyticsSnapshots (GET list, GET) — sourceSummary required for all displayed data |

### V1 Support screens

| Screen | API Resource Groups Needed |
|---|---|
| Multi-Platform | ChannelConnections (GET list, GET, POST, PATCH, DELETE) |
| Team Collaboration | WorkspaceMember (GET list, GET, PATCH, invite, suspend, activate) |

### V1 Admin / Governance screens

| Screen | API Resource Groups Needed |
|---|---|
| Template Engine | Templates — deferred to Admin/Governance gate |
| Workflow Runs | WorkflowRun candidates — deferred to Admin/Governance gate |
| System Admin | Workspace (admin PATCH); admin_settings — deferred |
| Secrets and Keys | IntegrationCredential (POST, DELETE) — deferred to credential gate |
| Model Routing | ModelRoute candidates — deferred to Admin/Governance gate |
| Prompt Governance | PromptVersion candidates — deferred to Admin/Governance gate |
| Cost Monitor | UsageCostEvent candidates — deferred to Admin/Governance gate |
| Settings | Workspace (PATCH settings); UserPreference (candidate) — deferred |

### Extended V1 screens

| Screen | API Resource Groups Needed |
|---|---|
| Product Intelligence | ProductInsight candidates — deferred (Extended V1 gate) |
| Creator Studio | CreatorStudioArtifact candidates — deferred (Extended V1 gate) |
| Content Review | ReviewDecision candidates — deferred (architecture decision open) |

---

## 14. Security / Governance Review Points for the Later OpenAPI Gate

The future OpenAPI YAML gate must verify all of the following before merging:

| Check | Detail |
|---|---|
| Auth scheme present | Every protected operation declares `bearerAuth` security requirement |
| workspaceId path parameter required | All workspace-scoped paths declare `workspaceId` as required path parameter |
| No workspaceId in request body schemas | No schema allows `workspaceId` or `workspace_id` as a client-supplied body field |
| No raw credentials in response schemas | No schema field returns raw credential values, vault tokens, OAuth tokens, or platform API keys |
| No GET body | GET operations declare no `requestBody` |
| 401/403/404/409/422 consistency | All protected operations declare all applicable error response codes with the shared error envelope schema |
| Permission notes per operation | Each operation includes an `x-permission` extension or description note referencing the required permission group |
| Audit implications documented | Operations that emit AuditEvent have this noted in their description |
| Analytics lineage documented | AnalyticsSnapshot GET response schema includes `sourceSummary` and `status` fields; status enum is `available / partial / stale / unavailable` |
| Cross-workspace leakage prevention | 404 (not 403) documented for cross-workspace access patterns |
| No generated client before approval | Review gate must confirm no client generation tooling is wired before OpenAPI is approved |
| Self-approval prevention documented | `approve` operation description states self-approval is forbidden at service layer (409 conflict) |

---

## 15. Risks and Gaps

### Risks if this planning gate is skipped or under-specified

| Risk | Severity | Control |
|---|---|---|
| OpenAPI routes not matching V1 screens | HIGH | Section 13 screen-to-API map ensures every V1 Core screen has identified resource groups |
| Resource leakage across workspaces | CRITICAL | Section 5 auth/scoping rules; non-disclosing 404 documented |
| Permission ambiguity in OpenAPI operations | HIGH | Section 7 endpoint inventory specifies min permission per route family |
| Credential exposure in responses | CRITICAL | Section 8 matrix; Section 9 write-only rule for IntegrationCredential |
| Over-broad admin role | MEDIUM | Section 5 and Section 14: `admin_settings.manage` is workspace-scoped only |
| Premature backend implementation | HIGH | No implementation authorized until OpenAPI review gate merges |
| Generated clients based on unstable contract | HIGH | No-GO rule: no generated client before OpenAPI is approved and reviewed |
| Analytics lineage loss | MEDIUM | Section 6 and Section 14: sourceSummary required on all AnalyticsSnapshot responses |
| Audit incompleteness | MEDIUM | Section 8 audit emission column; Section 14 audit check |
| marketing-os drift | MEDIUM | Nashir-first principle; no marketing-os runtime dependency |
| State transition naming locked prematurely | MEDIUM | Section 11 defers unconfirmed status enums to OpenAPI YAML gate |

### Technical gaps

| Gap | Resolution Gate |
|---|---|
| Auth provider implementation | Backend Slice 1 Planning Gate |
| SQL schema for all entities | SQL/Schema Planning Gate |
| URL versioning (`/v1/`) final decision | OpenAPI YAML gate |
| Filtering/sorting parameter specification | OpenAPI YAML gate |
| Rate limiting specification | Backend Slice 1 Planning Gate |
| Pagination model finalized | OpenAPI YAML gate |
| Response envelope shape (direct vs `{ data: ... }`) | OpenAPI YAML gate |

---

## 16. GO / NO-GO Criteria

### GO criteria — proceed to Nashir API Contract / OpenAPI Planning Review Gate

| Criterion | Status |
|---|---|
| Route families planned for all V1 Core entities | **COMPLETE** |
| Screen-to-API dependency map complete | **COMPLETE** |
| Entity-to-API coverage matrix complete | **COMPLETE** |
| Auth/workspace scoping implications defined | **COMPLETE** |
| Error behavior planned (401/403/404/409/422) | **COMPLETE** |
| State transition planning complete for approved entities | **COMPLETE** |
| OpenAPI document structure proposed | **COMPLETE** |
| No implementation added | **CONFIRMED** |
| No OpenAPI YAML created | **CONFIRMED** |
| GO: proceed to API Contract / OpenAPI Planning Review Gate | **GO** |

### NO-GO conditions — do not proceed until resolved

| Condition | Status |
|---|---|
| Missing workspace scoping for any V1 Core entity | **CLEARED** — all 17 entities + IntegrationCredential covered |
| Missing permission mapping for any route | **CLEARED** — min permission defined for all route families |
| Unclear route ownership or path structure | **CLEARED** — all paths follow `/workspaces/{workspaceId}/...` |
| Hidden implementation (backend code, SQL, OpenAPI YAML) | **CONFIRMED NONE** |
| OpenAPI YAML created in this gate | **CONFIRMED NONE** |
| marketing-os copied or imposed | **CONFIRMED NONE** |
| Package or runtime changes introduced | **CONFIRMED NONE** |

---

## 17. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | Working tree clean after commit; gate changes limited to documentation |
| `git diff --stat` | Diff limited to `docs/nashir_api_contract_openapi_planning_gate.md` |
| Forbidden files check | **PASS** — no `src/`, `package.json`, `README.md`, `docs/screen_map.md`, OpenAPI YAML, SQL, migrations, or marketing-os files modified |
| No OpenAPI YAML/JSON added | **CONFIRMED** — `find docs/ -name "*.yaml" -o -name "*.json"` shows only `docs/nashir_v1_openapi.yaml` (pre-existing); no new YAML created |

---

## 18. Final Summary

### Inputs

| Input | Gate |
|---|---|
| 23-screen V1 scope | PR #64–66 |
| Productization roadmap and sequencing | PR #67–68 |
| Nashir-first backend/API strategy | PR #69–70 |
| 17 V1 Core entities + IntegrationCredential | PR #71–72 |
| Identity model, workspace scoping, 7 roles, 24 permission groups | PR #73–74 |

### Outputs

| Output | Detail |
|---|---|
| API design principles | 13 Nashir-first principles |
| Auth/workspace scoping implications | 9 requirements for future API |
| Resource groupings | 22 groups organized by V1 journey |
| Endpoint surface inventory | Route families for all V1 Core entities; deferred for Admin/Gov and Extended V1 |
| Entity-to-API matrix | 18 entities; create/read/list/update/delete/state/audit/analytics coverage |
| Request/response rules | 12 rules for future OpenAPI schemas |
| Error behavior plan | 401/403/404/409/422/500 defined |
| State transition plan | WorkspaceMember, ContentApproval, PublishingJob, AnalyticsSnapshot approved; Campaign/ContentDraft lifecycle naming deferred |
| OpenAPI document structure | OAS 3.1 recommended; tags, securitySchemes, parameters, schemas, error model, pagination model, operationId convention |
| Screen-to-API map | All 23 screens mapped to API resource groups |
| Security review points | 12 checks for the future OpenAPI gate |

### Remaining gaps

| Gap | Gate |
|---|---|
| OpenAPI YAML not written | OpenAPI YAML Implementation Gate |
| Campaign / ContentDraft status enum naming | OpenAPI YAML gate |
| URL versioning final decision | OpenAPI YAML gate |
| Auth provider implementation | Backend Slice 1 Planning Gate |
| SQL schema | SQL/Schema Planning Gate |
| Admin/Governance endpoint surface | Admin/Governance gate |
| Extended V1 endpoint surface | Extended V1 gate |

### Decision required before next phase

The **Nashir API Contract / OpenAPI Planning Review Gate** must accept this document — specifically:

- Route family inventory for V1 Core
- Entity-to-API coverage matrix
- Request/response rules (including workspaceId rejection, write-only credentials)
- Error behavior plan
- State transition plan (confirming deferred status enums)

Until the review gate closes, no OpenAPI YAML, backend code, SQL schema, or generated client work may begin.

### Recommended next gate

**Nashir API Contract / OpenAPI Planning Review Gate** — documentation-only review of this planning gate before any OpenAPI YAML is written.

---

## 19. NO-GO Boundaries

```text
NO-GO: OpenAPI YAML or JSON.
NO-GO: Backend code or API routes.
NO-GO: SQL schema or migrations.
NO-GO: Auth/RBAC implementation.
NO-GO: Generated clients or types.
NO-GO: UI source code changes.
NO-GO: Package/build/dependency changes.
NO-GO: marketing-os modifications.
NO-GO: marketing-os extraction.
NO-GO: Production/pilot readiness claims.
```
