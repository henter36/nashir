# Nashir Auth/RBAC and Workspace Identity Gate

| Field | Value |
|---|---|
| Gate type | Auth/RBAC and workspace identity planning gate — documentation only |
| Status | Planning complete |
| Date | 2026-06-02 |
| Scope | Defines Nashir V1 identity model, workspace/merchant isolation, role model, permission groups, entity access rules, and OpenAPI security implications — before any API contract, backend code, SQL schema, or auth middleware |
| Prerequisite gates | `docs/nashir_erd_data_model_gate.md` — merged (PR #71); `docs/nashir_erd_data_model_review_gate.md` — merged (PR #72) |
| Backend/API implementation | NO |
| SQL schema / migrations | NO |
| OpenAPI YAML changes | NO |
| Auth/RBAC implementation | NO |
| UI source code changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Purpose and Scope

This is a documentation-only Auth/RBAC and workspace identity planning gate.

**No backend or auth implementation is performed.**

**No SQL schema or database migrations are approved.**

**No OpenAPI YAML is created or modified.**

**No auth middleware or RBAC code is written.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

### Why this gate must precede API/OpenAPI

The API Contract/OpenAPI Gate cannot be finalized without knowing:

1. **Auth scheme** — What bearer/token mechanism will authenticate requests? What header carries user identity?
2. **Workspace path scoping** — Which paths use `/workspaces/{workspaceId}/...` and how is workspaceId validated?
3. **Membership model** — When is a request authorized vs rejected? Under what conditions is a 401, 403, or 404 returned?
4. **Permission requirements** — What permission is required per operation? What role assignments grant those permissions?
5. **Error contract** — 401 unauthenticated vs 403 forbidden vs 404 non-disclosing must all be defined before OpenAPI security objects are written.

Without these decisions, the OpenAPI security section, operation-level `security` objects, and permission extension fields cannot be written correctly. This gate closes those gaps.

This gate does not authorize any runtime implementation. It authorizes planning of the identity/auth model only.

---

## 2. Inputs Reviewed

| Input | Finding |
|---|---|
| `README.md` | 23 screens; V1 Core journey approved; no backend, auth, or RBAC implemented |
| `docs/screen_map.md` | 23 screens with V1 Classification; navigation groups current |
| `docs/nashir_v1_scope_decision_gate.md` (PR #64) | 10 V1 Core, 2 V1 Support, 8 V1 Admin/Governance, 3 Extended V1 approved |
| `docs/nashir_v1_scope_decision_review_gate.md` (PR #65) | All 21 criteria PASS |
| `docs/nashir_v1_scope_documentation_update_gate.md` (PR #66) | 23-screen scope documented |
| `docs/nashir_productization_roadmap_gate.md` (PR #67) | 7-phase roadmap; Auth/RBAC Gate is prerequisite before API Contract |
| `docs/nashir_productization_roadmap_review_gate.md` (PR #68) | All 28 criteria PASS |
| `docs/nashir_backend_api_strategy_gate.md` (PR #69) | Nashir-first backend direction; Node.js, PostgreSQL-compatible, REST/OpenAPI; Auth/RBAC must precede API Contract; PDPL/GCC compliance is future assessment |
| `docs/nashir_backend_api_strategy_review_gate.md` (PR #70) | All 42 criteria PASS; ERD Gate and Auth/RBAC Gate authorized |
| `docs/nashir_erd_data_model_gate.md` (PR #71) | 17 approved V1 Core logical entities defined, plus IntegrationCredential as an ERD-approved credential-separation entity; Workspace is root scope; WorkspaceMember links User to Workspace; all merchant-owned data workspace-scoped; ChannelConnection has optional dataSourceId; credentials separate from ChannelConnection; AuditEvent is cross-cutting and append-only |
| `docs/nashir_erd_data_model_review_gate.md` (PR #72) | All 71 criteria PASS; field-level model correct; Auth/RBAC Gate authorized as first priority |
| `src/App.jsx` | 23 active screens confirmed; all `enabled: true`; V1 Core journey: Dashboard → StoreSetup → ProductCatalog → DataSourcesHub → AssetLibrary → Campaigns → CampaignsList → Content → PublishingQueue → Analytics |
| `src/pages/` | 23 page components confirmed |
| `src/data/` | Mock data only; no real auth or RBAC |
| `package.json` | `name: nashir`; no backend runtime scripts; no auth dependency |

### Confirmed baseline

- 23-screen scope approved; V1 Core is the first implementation priority.
- Backend/API direction is Nashir-first. marketing-os is rejected as V1 runtime backend — reference-only.
- No real backend, auth, RBAC, SQL schema, migrations, or OpenAPI exists.
- WorkspaceMember uses `active / invited / suspended` status (confirmed in PR #71/72).
- Auth/RBAC Gate is the first downstream gate authorized by PR #72.
- API Contract/OpenAPI Gate must follow Auth/RBAC Gate, not precede it.

---

## 3. Current Facts, Decisions, and Proposals

### Approved facts from prior gates

| Fact | Source |
|---|---|
| Workspace is the governing root for all merchant-owned data | PR #71 |
| User may be global; access goes through WorkspaceMember | PR #71 |
| WorkspaceMember links User to Workspace and carries role/permission placeholder | PR #71 |
| All V1 Core merchant-owned data must be workspace-scoped | PR #71 |
| WorkspaceMember status: active / invited / suspended | PR #71/72 |
| ChannelConnection has optional dataSourceId; no raw credentials directly | PR #71 |
| IntegrationCredential is separate from ChannelConnection; vault-reference model required | PR #71 |
| AuditEvent is cross-cutting and append-only conceptually | PR #71 |
| AnalyticsSnapshot must preserve data lineage/sourceSummary | PR #71 |
| PDPL/GCC data residency/compliance is a future assessment — no claim completed | PR #69/71 |
| Backend is Nashir-first; Node.js, PostgreSQL-compatible, REST/OpenAPI planned direction | PR #69/70 |
| OpenAPI must not start before Auth/RBAC and workspace scoping are defined | PR #69 |

### Decisions made in this gate

| Decision | Detail |
|---|---|
| User is global identity | Users are not workspace-scoped; access to workspace resources goes through WorkspaceMember |
| WorkspaceMember is the authorization binding | Active WorkspaceMember is required for any workspace resource access |
| All V1 Core resource paths carry workspaceId | `/workspaces/{workspaceId}/...` pattern for all workspace-scoped resources |
| workspaceId must never be trusted from request body | Path-derived only; any request body containing workspaceId or workspace_id must be rejected with a validation error |
| Cross-workspace access is forbidden | No route or repository method may return data across workspace boundaries |
| Deny-by-default | No permission is assumed; every protected operation requires explicit role assignment |
| Active membership required | Invited and suspended members are denied access |
| 7-role V1 model | owner, admin, editor, reviewer, publisher, analyst, viewer |
| 24 V1 permission groups defined | See Section 7 |
| Error behavior defined | 401 unauthenticated, 403 authorized but not permitted or not active member, 404 non-disclosing |
| Credential storage rule | Raw credentials must never appear in any Nashir domain entity, API response, or log |

### Proposed items deferred

| Item | Reason |
|---|---|
| Auth provider selection (JWT, session token, API key, external IdP) | Backend Slice 1 Planning Gate |
| Permission code implementation in backend RBAC module | Backend Slice 1 Planning Gate |
| Auth middleware/guard implementation | Backend Slice 1 Planning Gate |
| OpenAPI security objects and permission extensions | API Contract/OpenAPI Gate |
| SQL schema for Role, Permission, RolePermission, WorkspaceMember | SQL/Schema Planning Gate |
| SSO / SAML / external identity federation | Post-V1 |
| SCIM provisioning | Post-V1 |
| Fine-grained custom roles UI | Post-V1 |
| Organization hierarchy / multi-tenant delegation | Post-V1 |
| Policy engine / attribute-based access control | Post-V1 |
| Data residency enforcement implementation | Future legal/compliance gate |
| Field-level encryption implementation | Future security gate |
| Automated compliance reports | Post-V1 |

---

## 4. Identity Model

| Identity Concept | Purpose | Scope | V1 Status | Privacy | Notes |
|---|---|---|---|---|---|
| `User` | Human actor with an account; may belong to multiple workspaces | Global | **IN** | HIGH — PII | Auth provider holds email/name; Nashir stores userId reference; Auth/RBAC Gate decision does not select provider |
| `Workspace` | Top-level merchant tenant boundary; all domain objects belong to one Workspace | Global root | **IN** | LOW | Every workspace-scoped resource carries workspaceId |
| `WorkspaceMember` | Authorization binding: links User to Workspace with role and status | Workspace-scoped | **IN** | MEDIUM | Active membership required for any resource access; role deferred to SQL gate for schema |
| `Role` | Named permission bundle scoped to a workspace | Workspace-scoped | **IN** | LOW | 7 V1 roles defined in Section 6; role_code is canonical |
| `Permission` | Discrete authorization gate for a controlled action | Platform | **IN** | LOW | Permission groups defined in Section 7; dot-notation codes used at implementation time |
| `RolePermission` | Maps a role to its set of permissions | Platform | **IN** | LOW | Many-to-many role_code → permission_code; finalized in SQL gate |
| `AuditEvent` | Append-only record of sensitive state transitions | Workspace-scoped | **IN** | MEDIUM | Cross-cutting; append-only; never deleted; actor carries userId |
| `IntegrationCredential` | External credential/vault reference for channel connections | Workspace-scoped | **IN (deferred implementation)** | HIGH | Vault reference only; no raw credential in Nashir DB or responses |
| `Service/system actor` | Internal service or background job | N/A | **DEFER — Post-V1** | N/A | No background services in V1 |
| `SSO / external IdP` | Federated identity provider | N/A | **DEFER — Post-V1** | HIGH | Out of V1 scope |

### Membership status behavior

| Status | Meaning | Resource Access |
|---|---|---|
| `active` | Member has accepted and is in good standing | **ALLOWED** — all permissions apply |
| `invited` | Invitation sent; user has not yet accepted | **DENIED** — no workspace resource access |
| `suspended` | Access administratively suspended | **DENIED** — no workspace resource access; account not deleted |

---

## 5. Workspace Scoping Rules

| Rule | Detail |
|---|---|
| All V1 merchant-owned data must be scoped by workspaceId | Every persisted business entity (StoreProfile, Product, DataSource, ChannelConnection, Asset, Campaign, etc.) must carry workspaceId |
| Active WorkspaceMember required | Accessing any workspace-scoped resource requires an active (not invited, not suspended) WorkspaceMember record for the target workspace |
| Route-level workspaceId must match stored workspaceId | The workspaceId extracted from the URL path must match the resource's stored workspaceId; mismatch must produce 404 |
| workspaceId must never be trusted from request body | workspaceId is path-derived only; any request body containing workspaceId or workspace_id must be rejected with a validation error |
| Cross-workspace reads are forbidden | No list or get operation may return records from a different workspace |
| Cross-workspace writes are forbidden | No create or update operation may write records to a different workspace |
| Analytics must not leak across workspaces | AnalyticsSnapshot subjects (Campaign, Product, ChannelConnection) must be verified within the request workspace |
| Assets must not leak across workspaces | Asset records must be verified within the request workspace |
| Campaigns and content must not leak across workspaces | All Campaign, CampaignBrief, CampaignContentItem, ContentDraft, ContentApproval records must be within the request workspace |
| Publishing jobs must not leak across workspaces | PublishingJob and PublishingStatus must be scoped to request workspace |
| Audit events must not leak across workspaces | AuditEvent records must be read-accessible only by active members of the owning workspace |
| No globally-shared merchant data | All merchant data is workspace-isolated in V1; no global shared product catalogs or campaigns |

---

## 6. Role Model

Nashir V1 uses 7 roles aligned with the V1 Core journey requirements. The 5-role minimum (owner, admin, editor, analyst, viewer) is extended with `reviewer` and `publisher` to support the content approval and manual publishing workflows mandated by the V1 Core journey (Content Studio → Publishing Queue).

| Role | role_code | Purpose | Manage Members | Manage Channel Connections / Credentials | Publish | View Analytics | View Audit Events |
|---|---|---|---|---|---|---|---|
| Owner | `owner` | Full workspace authority; all capabilities including settings, billing view, member management, and protected governance actions | YES | YES | YES | YES | YES |
| Admin | `admin` | Operational management; workspace ops; most protected actions; cannot modify system-level governance | YES | YES | YES | YES | YES |
| Editor | `editor` | Campaign creation, content drafting, asset management; cannot approve content or manage members | NO | NO | NO | YES (own campaigns) | NO |
| Reviewer | `reviewer` | Human review and approval authority; approves or rejects content drafts; cannot create campaigns, manage members, or publish | NO | NO | NO | YES (content scope) | NO |
| Publisher | `publisher` | Manual publishing execution only; confirms publishing actions; cannot approve content | NO | NO | YES (manual confirm only) | YES (publishing scope) | NO |
| Analyst | `analyst` | Read-only analytics and reporting; no mutation of any business object | NO | NO | NO | YES | NO |
| Viewer | `viewer` | Read-only across workspace content; no mutation, approval, or publishing | NO | NO | NO | YES (read only) | NO |

**Role invariants:**
- A member with `editor` role may not approve their own content drafts — a separate `reviewer`, `admin`, or `owner` must perform approval.
- `publisher` role does not imply content approval authority.
- `analyst` role does not imply campaign edit or content create authority.
- `invited` or `suspended` membership overrides all roles — access is denied regardless of role.
- All roles are workspace-scoped — a User's role in Workspace A has no bearing on their access in Workspace B.

**Note on deferred roles:**
- `integration_admin` and `billing_admin` as discrete roles are Post-V1.
- Fine-grained custom roles are Post-V1.
- Any overlay roles (e.g., evidence reviewer) are Post-V1.

---

## 7. Permission Groups

Permission groups define logical authorization boundaries. Implementation uses dot-notation codes at the backend (e.g., `nashir.products.read`). The group names below are the logical identifiers used in this gate for clarity; OpenAPI Gate will document final permission code strings.

| Permission Group | Logical Code | Action Covered | Minimum Required Role | V1 Status |
|---|---|---|---|---|
| `workspace.read` | Read workspace metadata and settings | View workspace name, settings, status | viewer (all roles) | **V1** |
| `workspace.update` | Update workspace settings | Update workspace name or configuration | admin, owner | **V1** |
| `members.manage` | Add, remove, or change member roles | Invite, remove, suspend, change role | admin, owner | **V1** |
| `store_profile.read` | Read store profile | View store name, URL, brand summary | viewer (all roles) | **V1** |
| `store_profile.update` | Update store profile | Update store metadata | admin, owner | **V1** |
| `products.read` | Read product catalog | List and view products | viewer, analyst, editor, reviewer, publisher | **V1** |
| `products.manage` | Create and update products | Create, edit, archive products | editor, admin, owner | **V1** |
| `data_sources.read` | Read data source records | View data source status and metadata | viewer (all roles) | **V1** |
| `data_sources.manage` | Manage data source records | Create, update, remove data sources | editor, admin, owner | **V1** |
| `channel_connections.read` | Read channel connection records | View channel connection status | viewer (all roles) | **V1** |
| `channel_connections.manage` | Manage channel connections | Create, update, remove channel connections | admin, owner | **V1** |
| `integration_credentials.manage` | Manage integration credentials | Create/rotate vault-backed credential references | admin, owner | **V1 — deferred to IntegrationCredential implementation** |
| `assets.read` | Read asset metadata | List and view asset records | viewer, analyst, editor, reviewer, publisher | **V1** |
| `assets.manage` | Manage asset records | Upload metadata, link assets, archive | editor, admin, owner | **V1** |
| `campaigns.read` | Read campaigns | View campaign list, details, status | viewer, analyst, editor, reviewer, publisher | **V1** |
| `campaigns.manage` | Create and update campaigns | Create, update, archive campaigns | editor, admin, owner | **V1** |
| `content.read` | Read campaign content items and drafts | View content drafts and status | viewer, analyst, editor, reviewer, publisher | **V1** |
| `content.manage` | Create and update content drafts | Create, edit, submit for review | editor, admin, owner | **V1** |
| `content.approve` | Approve or reject content drafts | Approve or reject a content draft; self-approval is forbidden at service layer | reviewer, admin, owner | **V1** |
| `publishing.read` | Read publishing queue and job status | View publishing jobs and status history | viewer, analyst, editor, reviewer, publisher | **V1** |
| `publishing.manage` | Execute publishing actions | Confirm, schedule, or cancel publishing jobs | publisher, admin, owner | **V1** |
| `analytics.read` | Read analytics snapshots | View analytics data; sourceSummary must distinguish real vs mock | viewer, analyst, editor, reviewer, publisher, admin, owner | **V1** |
| `audit_events.read` | Read audit event trail | View audit log records | admin, owner | **V1** |
| `admin_settings.manage` | Workspace-level settings management | Update workspace-level configuration (display preferences, notification settings, workspace defaults); platform-level administration (workspace suspension, platform-wide config) is not part of the V1 merchant role model and is deferred to a platform-admin gate | admin, owner | **V1 (workspace scope only)** |

**Note on deferred permission groups:**
- `integration_credentials.manage` is V1 in concept but deferred until IntegrationCredential entity is implemented.
- Any permission group not listed here (SSO, billing, SCIM, policy engine) is Post-V1.

### Authoritative permission mapping decisions for alignment correction

The approved 24 permission groups above remain the complete authoritative V1
permission vocabulary unless a separately authorized Auth/RBAC amendment
changes them. Canonical OpenAPI/backend codes use `nashir.` followed by the
permission group exactly as written.

The following direct mappings are established:

| Operation action | Canonical permission code |
|---|---|
| Product read / manage | `nashir.products.read` / `nashir.products.manage` |
| Asset read / manage, including link-product | `nashir.assets.read` / `nashir.assets.manage` |
| Store profile read / update | `nashir.store_profile.read` / `nashir.store_profile.update` |
| Content read | `nashir.content.read` |
| Content create, update, submit-review, archive, or creator withdrawal | `nashir.content.manage` |
| Content approve or reject | `nashir.content.approve` |

No backend-local or OpenAPI-local permission may be invented. This follow-up
authority decision approves the following additional contract permission groups
for preserved route families. These groups extend, but do not rename or weaken,
the approved 24 core permission groups:

| Permission Group | Action Covered | Minimum Required Role | Implementation Status |
|---|---|---|---|
| `workflow.read` | Read advisory workspace, workflow, and workflow-step readiness snapshots | viewer (all active roles) | **DEFERRED / BLOCKED** |
| `model_routing.read` | Read advisory provider and model-route readiness snapshots | viewer (all active roles) | **DEFERRED / BLOCKED** |
| `prompt_governance.read` | Read advisory prompt readiness and referenced prompt-governance metadata | viewer (all active roles) | **DEFERRED / BLOCKED** |
| `creator_studio.use` | Create and read a member's permitted Creator Studio session, context, and transfer-draft records | editor, admin, owner; reads additionally require the documented owner/admin or destination-service constraint | **DEFERRED / BLOCKED** |
| `creator_studio.transfer.create` | Create human-reviewed Creator Studio context, readiness-assessment, and destination transfer drafts without executing a transfer | editor, admin, owner | **DEFERRED / BLOCKED** |

Canonical codes are `nashir.workflow.read`, `nashir.model_routing.read`,
`nashir.prompt_governance.read`, `nashir.creator_studio.use`, and
`nashir.creator_studio.transfer.create`. A Prompt Governance transfer draft
requires both `nashir.creator_studio.transfer.create` and
`nashir.prompt_governance.read`. All protected operations remain deny-by-default.
Approval of these contract permission groups does not authorize backend
implementation, permission enforcement, route implementation, or generated
clients.

### Content authorization and unresolved route-family overlap

The content authorization model is established independently of route-family
selection:

- `content.read` authorizes content item, draft, approval-history, and
  preview-artifact reads.
- `content.manage` authorizes content item/draft/preview-artifact creation and
  updates, submit-review, archive, and creator withdrawal.
- `content.approve` authorizes reviewer/admin/owner approval and rejection.
- Self-approval remains forbidden; creator withdrawal and reviewer rejection
  remain distinct actions.

The preserved content route families are segregated as follows:

- `/workspaces/{workspaceId}/campaign-contents...` is the V1 Core Content
  Studio compatibility surface for content-item CRUD, preview-artifact
  metadata, and compatibility lifecycle actions.
- `/workspaces/{workspaceId}/content-items.../drafts...` is the authoritative
  draft lifecycle surface for draft creation and versioning, submit-review,
  approve, reject, withdrawal, and approval-history reads.
- Campaign-content submit-review, approve, and reject operations are
  compatibility aliases over the same underlying authoritative draft lifecycle;
  they must not create a second lifecycle, approval record model, permission
  model, or service implementation.
- Both surfaces use the same canonical `content.read`, `content.manage`, and
  `content.approve` authorization rules. Preview-artifact capability remains on
  the Core Content Studio compatibility surface.

This boundary preserves required V1 screen/API coverage without authorizing
duplicate backend services or generated clients.

### Operation-level non-disclosing policy

Every protected workspace-scoped operation must explicitly represent:

- `401` using `ErrorModel` for missing or invalid authentication
- `403` using `ErrorModel` for an inactive member or insufficient permission
- non-disclosing `404` using `ErrorModel` for a non-member, cross-workspace
  access, invisible path workspace, missing resource, or missing nested parent
- non-disclosing membership guard metadata

This policy applies to list, create, read, update, delete/archive, and lifecycle
operations. It does not authorize runtime guard or repository implementation.

---

## 8. Ownership and Access Rules by Entity

| Entity | Scope | Access Rule | Ownership Boundary | Minimum Permission | Cross-workspace Leakage Risk |
|---|---|---|---|---|---|
| `Workspace` | Global root | Any active WorkspaceMember may read their own workspace | Workspace owns itself | `workspace.read` | LOW — workspace identity is known to its members |
| `User` | Global | Users do not directly expose workspace-scoped data; accessed via WorkspaceMember | Auth provider / platform | Auth only | LOW — no workspace-scoped data on User entity |
| `WorkspaceMember` | Workspace-scoped | Only members of the workspace may view other members; only admin/owner may manage | Workspace | `members.manage` to write; `workspace.read` to list | MEDIUM — member list must not be visible to non-members |
| `StoreProfile` | Workspace-scoped | All active members may read; admin/owner only may update | Workspace | `store_profile.read` | LOW — not sensitive beyond the workspace |
| `Product` | Workspace-scoped | Active members with `products.read` may read; editor/admin/owner may manage | Workspace | `products.read` | HIGH — product catalog must not leak to other workspaces |
| `DataSource` | Workspace-scoped | Active members with `data_sources.read` may read; editor/admin/owner may manage | Workspace | `data_sources.read` | HIGH — integration metadata must not leak |
| `ChannelConnection` | Workspace-scoped | Active members with `channel_connections.read` may read; admin/owner only may manage | Workspace | `channel_connections.read` | HIGH — channel metadata and connection status must not leak |
| `IntegrationCredential` | Workspace-scoped | admin/owner only may manage; never exposed in API responses | Workspace | `integration_credentials.manage` | CRITICAL — raw credential values must never appear; vault ref only |
| `Asset` | Workspace-scoped | Active members with `assets.read` may read; editor/admin/owner may manage | Workspace | `assets.read` | HIGH — creative assets belong to workspace |
| `Campaign` | Workspace-scoped | Active members with `campaigns.read` may read; editor/admin/owner may manage | Workspace | `campaigns.read` | HIGH — campaign strategy must not leak |
| `CampaignBrief` | Workspace-scoped (child of Campaign) | Inherits Campaign access; `campaigns.read` required | Campaign → Workspace | `campaigns.read` | HIGH — brief contains audience/channel strategy |
| `CampaignContentItem` | Workspace-scoped (child of Campaign) | Active members with `content.read` may read | Campaign → Workspace | `content.read` | HIGH — content items belong to campaign/workspace |
| `ContentDraft` | Workspace-scoped (child of CampaignContentItem) | Active members with `content.read` may read; `content.manage` to write | CampaignContentItem → Workspace | `content.read` | HIGH — draft body is workspace-proprietary |
| `ContentApproval` | Workspace-scoped (child of ContentDraft) | Reviewer/admin/owner may create; all active members may read decision | ContentDraft → Workspace | `content.approve` to create; `content.read` to view | MEDIUM — approval trail is workspace governance record |
| `PublishingJob` | Workspace-scoped (child of Campaign) | Active members with `publishing.read` may read; publisher/admin/owner may manage | Campaign → Workspace | `publishing.read` | HIGH — publishing schedule must not leak |
| `PublishingStatus` | Workspace-scoped (append-only child of PublishingJob) | Inherits PublishingJob access | PublishingJob → Workspace | `publishing.read` | MEDIUM — status trail should not cross workspace |
| `AnalyticsSnapshot` | Workspace-scoped | Active members with `analytics.read` may read; subjects must be verified within workspace | Workspace | `analytics.read` | HIGH — analytics data must not cross workspace; sourceSummary required |
| `AuditEvent` | Workspace-scoped (append-only) | admin/owner only may read; never deletable or modifiable after creation | Workspace | `audit_events.read` | HIGH — audit trail tampering or cross-workspace exposure is governance risk |

---

## 9. OpenAPI Implications for Later Gate

The following decisions define what the future API Contract/OpenAPI Gate must reflect. **No OpenAPI YAML is created or modified in this gate.**

| Implication | Required Behavior |
|---|---|
| Auth scheme | All protected operations must declare a bearer auth security scheme; the specific mechanism (JWT, opaque token) is deferred to Backend Slice 1 Planning; placeholder bearer auth is acceptable in OpenAPI until implementation gate |
| workspaceId path scoping | All workspace-scoped operations must use `/workspaces/{workspaceId}/...` path pattern; workspaceId must be a path parameter, not a query parameter or body field |
| Membership/role authorization behavior | OpenAPI operation descriptions must state the minimum required permission group for each operation; role-to-permission mapping must be referenced from this gate |
| 401 — Unauthenticated | Missing or invalid auth token; no user identity established |
| 403 — Authorized but not permitted | User is authenticated but does not have the required permission, or WorkspaceMember is not `active` (invited or suspended) |
| 404 — Non-disclosing | Resource not found within workspace boundary OR user is not a member of the workspace; 404 must be returned to prevent workspace enumeration — not 403 |
| 409 — Conflict | Invalid state transition (e.g., attempting to approve an already-approved draft) |
| 422 — Validation error | Request body fails validation rules |
| No request body on GET endpoints | GET operations must not accept workspaceId or any resource identifier via body |
| No credentials in responses | No operation may return raw secret values, vault references, creator handle raw values, or platform OAuth tokens in any response field |
| No cross-workspace identifiers in list responses | List endpoints must not return resource IDs from outside the request workspace |
| No generated client until OpenAPI is approved | Generated TypeScript types or client SDKs must not be produced until the API Contract/OpenAPI Gate is merged |
| self-approval prevention | `content.approve` operation must enforce that the approver is not the creator of the content draft; this is a service-layer rule, not expressible in OpenAPI security objects; it must be documented in the operation description |

---

## 10. Security and Governance Rules

| Rule | Detail |
|---|---|
| Least privilege | Users receive the minimum permission set for their role; no permission is granted by default |
| Deny by default | Any operation not explicitly permitted by an active role assignment must be denied |
| Active membership required | Invited members (status: `invited`) are denied all workspace resource access until accepted/activated |
| Suspended members denied | Members with status: `suspended` are denied all workspace resource access |
| Credential write-only / vault-managed | IntegrationCredential stores only opaque vault references; no raw secret may be returned in any API response or logged in any audit event |
| AuditEvent append-only | AuditEvent records must never be modified or deleted after creation; this is a design constraint, not just a permission constraint |
| Analytics lineage preserved | AnalyticsSnapshot must carry `sourceSummary` or equivalent field distinguishing real data from mock/partial/stale; four status states required: available / partial / stale / unavailable |
| No auto-approval | Content approval is always human-initiated; no service, schedule, or AI suggestion may create a ContentApproval record without explicit human action |
| No auto-publish | Publishing actions are always human-confirmed; no service or schedule may execute a publishing job without explicit human action |
| No production compliance claim | PDPL/GCC data residency and local regulatory compliance requirements remain a future legal and compliance assessment; this gate does not claim compliance |
| workspaceId body rejection | Any request body containing `workspaceId` or `workspace_id` must be rejected with a validation error; workspaceId is always path-derived and trusted only after auth and active membership validation |
| Cross-workspace prevention at repository layer | Every repository method must receive workspaceId as an explicit, trusted parameter derived from the authenticated request path — never from body or caller assertion |

---

## 11. V1 Required vs Extended V1 vs Post-V1

### V1 Required (this gate defines these decisions)

- Identity model: User, Workspace, WorkspaceMember
- Active membership enforcement
- 7-role model
- 24 permission groups
- Workspace scoping for all 17 approved V1 Core entities plus IntegrationCredential as credential-separation entity
- Deny-by-default
- Credential vault-reference rule
- AuditEvent append-only concept
- Error behavior: 401 / 403 / 404 / 409 / 422
- content.approve self-approval prevention rule
- Analytics lineage requirement

### Extended V1 Considerations

- `integration_credentials.manage` permission group is defined but its backing entity (IntegrationCredential) is deferred to a later implementation gate
- `analyst` role is defined but analytics data is mock/partial until Analytics backend is implemented
- `publisher` role manual-confirm behavior is defined but real publishing is not authorized until integration gate

### Post-V1 / Deferred

- SSO / SAML / external IdP federation
- SCIM member provisioning
- Fine-grained custom roles UI
- Organization hierarchy / multi-tenant agency delegation
- Attribute-based or policy-engine access control
- Data residency enforcement implementation
- Field-level encryption implementation
- Automated compliance reporting
- Service-to-service / machine auth (background jobs)
- Billing/payment roles

---

## 12. Risks and Gaps

### Operational risks

| Risk | Severity | Control |
|---|---|---|
| Cross-workspace data leakage | **CRITICAL** | workspaceId must be enforced at repository layer on every query; route-level workspaceId must match stored workspaceId; 404 must be returned on mismatch |
| Over-privileged users | **HIGH** | Deny-by-default; explicit permission assignment per role only |
| Publishing by unauthorized users | **HIGH** | `publishing.manage` is restricted to publisher, admin, owner; publisher role does not imply content approval |
| Exposure of integration credentials | **CRITICAL** | IntegrationCredential stores vault reference only; no raw value in Nashir domain, API response, or log |
| Analytics lineage ambiguity | **MEDIUM** | AnalyticsSnapshot must carry `sourceSummary`; four-state status model prevents false-real claims |
| Audit trail tampering | **HIGH** | AuditEvent append-only; admin/owner access only; delete must not be permitted |
| Premature OpenAPI before auth rules finalized | **HIGH** | This gate closes before API Contract/OpenAPI Gate begins; no OpenAPI security objects may be written before this gate merges |

### Technical gaps

| Gap | Resolution Gate |
|---|---|
| Auth provider not yet selected | Backend Slice 1 Planning Gate |
| Permission code implementation (backend RBAC module) | Backend Slice 1 Planning Gate |
| Auth/guard middleware design | Backend Slice 1 Planning Gate |
| SQL schema for Role, Permission, RolePermission, WorkspaceMember | SQL/Schema Planning Gate |
| AuditEvent column schema for Nashir-specific action types | SQL/Schema Planning Gate |
| Vault reference storage pattern (IntegrationCredential) | SQL/Schema Planning Gate |
| Self-approval enforcement at service layer | Backend Slice 1 Planning Gate |
| nonDisclosingMembershipCheck vs membershipCheck assignment per endpoint | API Contract/OpenAPI Gate |

### Legal/compliance gaps

| Gap | Detail |
|---|---|
| PDPL/GCC data residency | User PII (email, name) and merchant data must be assessed against PDPL and GCC-relevant data protection requirements; no compliance is claimed here |
| Data retention policy | AuditEvent and analytics retention periods must be determined; not in scope of this gate |
| Right-to-erasure handling | User PII handling under data subject rights not in scope of this gate |

### Reputation risks

| Risk | Control |
|---|---|
| Mock analytics displayed as real | AnalyticsSnapshot `status` and `sourceSummary` fields; UI must label non-real states |
| Simulated publishing displayed as real | PublishingJob status must include `simulated`; no auto-real-publish claim before integration |
| Unauthorized content published | publisher/admin/owner-only publishing.manage; human-confirm required |

---

## 13. Decision to Proceed / No-Go Conditions

### GO criteria for moving to next gate

| Criterion | Status |
|---|---|
| Identity model approved: User (global), Workspace (tenant root), WorkspaceMember (auth binding) | **APPROVED** |
| Membership status behavior defined: active / invited / suspended | **APPROVED** |
| Workspace scoping rules defined for all 17 approved V1 Core entities plus IntegrationCredential | **APPROVED** |
| 7-role V1 model defined | **APPROVED** |
| 24 permission groups defined | **APPROVED** |
| Role-to-permission mapping defined | **APPROVED** |
| OpenAPI implications defined (auth scheme, path scoping, error behavior, no-credential rule) | **APPROVED** |
| Security and governance rules defined | **APPROVED** |
| No runtime implementation added in this gate | **CONFIRMED** |
| GO: proceed to Auth/RBAC/Workspace Identity Review Gate | **GO** |

### NO-GO conditions

| Condition | Status |
|---|---|
| Workspace boundary unclear | **CLEARED** — Workspace is the root for all merchant data |
| Role capability matrix unclear | **CLEARED** — 7 roles with explicit capabilities defined |
| Error behavior unclear (401/403/404) | **CLEARED** — defined in Section 9 |
| Credential storage ambiguous | **CLEARED** — vault reference only; no raw credentials |
| Any implementation added in this gate | **CONFIRMED NONE** |
| Auth provider selected before planning gate | **CONFIRMED NONE** — deferred to Backend Slice 1 Planning |

---

## 14. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | Working tree clean after commit; gate changes limited to documentation |
| `git diff --stat` | Diff limited to `docs/nashir_auth_rbac_workspace_identity_gate.md` |
| Forbidden files check | **PASS** — no `src/`, `package.json`, `README.md`, `docs/screen_map.md`, or marketing-os files modified |

---

## 15. Final Summary

### Inputs

| Input | Gate |
|---|---|
| 23-screen V1 scope | PR #64/65/66 |
| Productization roadmap and sequencing | PR #67/68 |
| Nashir-first backend/API strategy | PR #69/70 |
| 17 V1 Core logical entities and workspace scoping | PR #71/72 |

### Outputs

| Output | Detail |
|---|---|
| Identity model | User / Workspace / WorkspaceMember defined |
| Membership status model | active / invited / suspended |
| Workspace scoping rules | 12 rules covering all V1 Core entities |
| Role model | 7 roles: owner, admin, editor, reviewer, publisher, analyst, viewer |
| Permission groups | 24 groups mapped to roles |
| Entity access rules | 18 entities covered |
| OpenAPI implications | Auth scheme, path pattern, error codes, credential rule, self-approval rule |
| Security rules | 11 governance rules |
| Risks and gaps | Operational, technical, legal/compliance, and reputation risks documented |
| Next gate | Nashir Auth/RBAC/Workspace Identity Review Gate |

### Remaining gaps

| Gap | Resolution gate |
|---|---|
| Auth provider selection | Backend Slice 1 Planning Gate |
| Permission code implementation | Backend Slice 1 Planning Gate |
| SQL schema for auth entities | SQL/Schema Planning Gate |
| Vault reference storage pattern | SQL/Schema Planning Gate |
| OpenAPI security objects | API Contract/OpenAPI Gate |

### Decision required before next phase

The Auth/RBAC/Workspace Identity Review Gate must accept this document — specifically:
- 7-role model and role capability matrix
- 24 permission groups and role-to-permission mapping
- Workspace scoping rules
- Error behavior (401/403/404)
- Credential rule

Until the review gate closes, no auth implementation, RBAC middleware, SQL schema, or API route work may begin.

### Recommended next gate

**Nashir Auth/RBAC/Workspace Identity Review Gate** — documentation-only review of this gate before any implementation, SQL schema, or API Contract work.

---

## 16. NO-GO Boundaries

```text
NO-GO: Auth/RBAC implementation.
NO-GO: Backend code or API routes.
NO-GO: SQL schema or migrations.
NO-GO: OpenAPI files or security objects.
NO-GO: Generated clients or types.
NO-GO: Auth middleware or guard code.
NO-GO: UI source code changes.
NO-GO: Package/build/dependency changes.
NO-GO: marketing-os modifications.
NO-GO: marketing-os extraction.
NO-GO: Production/pilot readiness claims.
```
