# Nashir SQL Schema Planning Gate

| Field | Value |
|---|---|
| Gate type | SQL/Schema planning gate — documentation only |
| Status | Planning complete |
| Date | 2026-06-02 |
| Scope | Translates the approved ERD/Data Model, Auth/RBAC/Workspace Identity, and OpenAPI V1 contract into a planned PostgreSQL persistence model without writing SQL migrations or implementation code |
| Prerequisite gates | `docs/nashir_openapi_yaml_deferred_decisions_review_gate.md` — merged (PR #80) |
| SQL DDL created | NO |
| Migrations created | NO |
| ORM models created | NO |
| Backend routes implemented | NO |
| Auth/RBAC implementation approved | NO |
| Generated client approved | NO |
| UI changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Purpose and Scope

This is a SQL/Schema planning gate only.

**No SQL DDL files are created.**

**No database migrations are created.**

**No ORM models or seed files are created.**

**No backend routes are implemented.**

**No auth/RBAC implementation is approved.**

**No generated TypeScript types, SDK, or runtime client is produced.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

### Why SQL/Schema planning comes after OpenAPI deferred decisions and before Backend Slice 1

The SQL schema must be derived from:
1. **Approved entity model** (ERD/Data Model Gate, PR #71/72) — defines entities, relationships, and field categories.
2. **Approved status enums** (OpenAPI Deferred Decisions Gate, PR #79) — locks status values that will become PostgreSQL enum types.
3. **Approved approval/lifecycle operations** (PR #79) — defines ContentDraft state machine transitions that schema must support.
4. **Approved idempotency/concurrency semantics** (PR #79) — identifies which tables need version fields and idempotency records.

Writing migrations before these decisions are stable creates expensive schema drift. This gate produces a planning document that the SQL Schema Authoring Gate and Backend Slice 1 Planning Gate can execute against a stable contract.

---

## 2. Inputs Reviewed

### Direct source inputs

| Input | Finding |
|---|---|
| `docs/nashir_erd_data_model_gate.md` (PR #71) | 17 V1 Core logical entities + IntegrationCredential; field-level logical model; relationship model; workspace root; approved status enums for WorkspaceMember and AnalyticsSnapshot |
| `docs/nashir_erd_data_model_review_gate.md` (PR #72) | All 71 criteria PASS; entity model confirmed |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` (PR #73) | 7 roles; 24 permission groups; workspace scoping rules; `nashir.content.approve` vs `nashir.content.manage` boundaries |
| `docs/nashir_v1_openapi.yaml` | 62 paths, 157 schemas, 37 parameters; all 4 status enums approved (CampaignStatus, ContentDraftStatus, CampaignContentItemStatus, PublishingJobStatus); ContentDraft lifecycle ops; idempotency/concurrency headers |
| `docs/nashir_openapi_yaml_deferred_decisions_gate.md` (PR #79) | Status enums resolved; ContentDraft sub-resource ops authored; idempotency/concurrency headers added; response envelope approved |
| `docs/nashir_openapi_yaml_deferred_decisions_review_gate.md` (PR #80) | All 15 criteria PASS; SQL/Schema Planning Gate authorized |
| `README.md` | 23 screens; V1 Core journey; Nashir-first |
| `docs/screen_map.md` | 23 screens with V1 Classification |

### Historical context gates

| Gate | Finding |
|---|---|
| PR #62–66 — Product Scope | 23 screens approved |
| PR #67–68 — Productization Roadmap | 7-phase roadmap; SQL/Schema planning before backend |
| PR #69–70 — Backend/API Strategy | Nashir-first; Node.js; PostgreSQL-compatible |
| PR #73–74 — Auth/RBAC | Role and permission model |
| PR #75–78 — API Contract/OpenAPI | Route families; entity-to-API coverage; error behavior |

### Confirmed baseline

- Backend is Nashir-first; marketing-os is reference-only.
- PostgreSQL-compatible persistence is the planned direction (PR #69/70).
- No real backend, schema, migrations, or generated client exists yet.
- All entity status enums are now locked (PR #79).

---

## 3. Current Facts, Planning Decisions, and Deferred Items

### Approved facts from previous gates

| Fact | Source |
|---|---|
| All merchant-owned entities must include `workspace_id` | PR #71/73 |
| `User` may be global; access via `WorkspaceMember` | PR #71/73 |
| `WorkspaceMember` links User to Workspace with role; status: active/invited/suspended | PR #71/73 |
| IntegrationCredential stores vault reference only; no raw secret | PR #71/73/79 |
| AuditEvent is append-only; never modifiable or deletable | PR #71/73 |
| AnalyticsSnapshot must carry `sourceSummary`; status: available/partial/stale/unavailable | PR #71/72 |
| CampaignStatus: draft/generating/review/ready/scheduled/active/paused/completed/archived | PR #79 |
| ContentDraftStatus: draft/ready_for_review/approved/rejected/archived | PR #79 |
| CampaignContentItemStatus: draft/ready_for_review/approved/rejected/archived | PR #79 |
| PublishingJobStatus: draft/scheduled/queued/simulated/failed/cancelled | PR #79 |
| ContentApproval is immutable after creation; self-approval forbidden | PR #73/79 |
| ContentApproval stores `rejectionReason` and `requiredChanges` from reject request | PR #79 |
| Lifecycle POSTs require idempotency key and resource version support | PR #79 |
| URL versioning (`/v1/`) deferred to Backend Slice 1 Planning Gate exit | PR #79/80 |
| `simulated` PublishingJob status is distinct from any future real publishing status | PR #71/79 |

### Planning decisions made in this gate

| Decision | Detail |
|---|---|
| Database engine | PostgreSQL (UUIDs via `gen_random_uuid()`; `timestamptz`; enum types) |
| Primary key format | UUID v4 for all tables |
| `workspace_id` scope | NOT NULL foreign key on all workspace-scoped tables; always path-derived, never from request body |
| Soft-delete pattern | `archived_at TIMESTAMPTZ` nullable column for archivable entities; `NULL` = active, non-NULL = archived |
| Server-owned fields | `id`, `workspace_id`, `created_at`, `updated_at`, `archived_at` never accepted from client |
| Status columns | PostgreSQL ENUM type for approved status enums; nullable during initial schema design for new enum types |
| Audit fields | `created_at`, `updated_at` on all mutable tables; `occurred_at` on append-only tables |
| Idempotency | Candidate `idempotency_keys` table for lifecycle POST deduplication |
| Version/concurrency | `version INTEGER DEFAULT 1` on mutable entities with lifecycle POSTs |
| IntegrationCredential | `vault_ref TEXT NOT NULL`; no raw secret column |
| AuditEvent | No UPDATE, no DELETE; append-only enforced at application layer; `occurred_at` not `updated_at` |
| Cascade deletion | No `ON DELETE CASCADE` on business data; prefer explicit soft-archive or nullify on removal |

### Deferred items

| Item | Gate |
|---|---|
| Exact SQL DDL (column types, constraints, indexes) | SQL Schema Authoring Gate |
| Migration file creation | SQL Schema Authoring Gate |
| ORM model definitions | Backend Slice 1 Planning Gate |
| Auth provider table (sessions, tokens) | Backend Slice 1 Planning Gate |
| URL versioning (`/v1/`) final decision | Backend Slice 1 Planning Gate exit |
| Vault provider integration for IntegrationCredential | Security Gate |
| PDPL/GCC data residency enforcement | Future legal/compliance gate |
| AuditEvent retention policy | Future legal/compliance gate |
| Role/permission seed data | Backend Slice 1 Planning Gate |
| Post-V1 Admin/Governance tables (Template, PromptVersion, ModelRoute, UsageCostEvent, WorkflowRun) | Admin/Governance gate |
| Extended V1 tables (ProductInsight, CreatorStudioArtifact, ReviewDecision) | Extended V1 gate |

---

## 4. Persistence Design Principles

| Principle | Detail |
|---|---|
| Workspace-scoped by default | Every merchant-owned entity has `workspace_id UUID NOT NULL REFERENCES workspaces(id)` |
| User is global | `users` table is not workspace-scoped; access to business records goes through `workspace_members` |
| WorkspaceMember is the authorization binding | All API-layer authorization checks resolve through `workspace_members` to get role; `status = 'active'` required |
| No merchant-owned data without workspace_id | Violation of this principle is a cross-workspace leakage risk |
| No cross-workspace leakage | All queries include `workspace_id = $workspace_id` predicate; never relies on caller assertion |
| Server-owned fields | `id`, `workspace_id`, `created_at`, `updated_at` are controlled by the persistence layer; never accepted from client |
| AuditEvent append-only | No `UPDATE` or `DELETE` on `audit_events`; application layer enforces this; considered for DB trigger backup |
| IntegrationCredential vault-only | `integration_credentials` row stores `vault_ref TEXT` not the raw secret; vault provider handles the secret |
| AnalyticsSnapshot lineage | `source_summary TEXT NOT NULL` on `analytics_snapshots`; status must be one of the approved four values |
| Soft archive preferred | Entities that support archive (products, assets, campaigns, content drafts, etc.) use `archived_at TIMESTAMPTZ` nullable; no hard delete for merchant data in V1 |
| Contract-first alignment | Column names and types derived from OpenAPI schema field names; divergence must be documented |
| No raw secrets in general rows | No plaintext password, API key, or OAuth token in any row outside the vault reference pattern |

---

## 5. Logical Table Inventory

| Table | Source Entity | Workspace-Scoped | Primary Key | Lifecycle/Status | Soft-Delete | V1 Required |
|---|---|---|---|---|---|---|
| `workspaces` | Workspace | Root | UUID | `status` (active/inactive/suspended) | NO (suspended, not deleted) | **YES** |
| `users` | User | Global | UUID | `status` (active/invited/suspended) | NO | **YES** |
| `workspace_members` | WorkspaceMember | YES | UUID | `status` (active/invited/suspended) | YES — `archived_at` | **YES** |
| `store_profiles` | StoreProfile | YES | UUID | `status` (active/inactive) | NO (status only) | **YES** |
| `products` | Product | YES | UUID | `status` (draft/active/archived) | YES — `archived_at` | **YES** |
| `data_sources` | DataSource | YES | UUID | `connection_status` | NO | **YES** |
| `channel_connections` | ChannelConnection | YES | UUID | `connection_status` | NO | **YES** |
| `integration_credentials` | IntegrationCredential | YES | UUID | — (vault ref metadata) | YES — revoked via `archived_at` | **YES (deferred full impl)** |
| `assets` | Asset | YES | UUID | `status` (active/archived) | YES — `archived_at` | **YES** |
| `campaigns` | Campaign | YES | UUID | `status` CampaignStatus enum | YES — `archived_at` | **YES** |
| `campaign_briefs` | CampaignBrief | YES | UUID | — | NO | **YES** |
| `campaign_content_items` | CampaignContentItem | YES | UUID | `status` CampaignContentItemStatus enum | YES — `archived_at` | **YES** |
| `content_drafts` | ContentDraft | YES | UUID | `status` ContentDraftStatus enum | YES — `archived_at` | **YES** |
| `content_approvals` | ContentApproval | YES | UUID | `decision` (approved/rejected) — immutable | NO (append-only) | **YES** |
| `publishing_jobs` | PublishingJob | YES | UUID | `status` PublishingJobStatus enum | YES — `cancelled_at` | **YES** |
| `publishing_statuses` | PublishingStatus | YES | UUID | `status TEXT` — append-only | NO (append-only) | **YES** |
| `analytics_snapshots` | AnalyticsSnapshot | YES | UUID | `status` (available/partial/stale/unavailable) | NO | **YES** |
| `audit_events` | AuditEvent | YES | UUID | — (append-only) | NO (append-only) | **YES** |
| `idempotency_keys` | (system) | YES | UUID | `status` (pending/completed/failed) | NO | **V1 Required (lifecycle POSTs)** |
| `roles` | Role | Global | UUID | — | NO | **YES (seed data)** |
| `permissions` | Permission | Global | UUID | — | NO | **YES (seed data)** |
| `role_permissions` | RolePermission | Global | (composite) | — | NO | **YES (seed data)** |

**Admin/Governance (deferred):** `templates`, `prompt_versions`, `model_routes`, `usage_cost_events`, `workflow_runs`

**Extended V1 (deferred):** `product_insights`, `creator_studio_artifacts`, `review_decisions`

---

## 6. Field Planning by Entity

### `workspaces`
- **Identity:** `id UUID PK`
- **Display:** `name TEXT NOT NULL`
- **Status:** `status workspace_status_enum NOT NULL DEFAULT 'active'`
- **Audit:** `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`

### `users`
- **Identity:** `id UUID PK`
- **Display/PII:** `display_name TEXT`, `email TEXT UNIQUE NOT NULL` — PII; auth provider may own this
- **Status:** `status user_status_enum NOT NULL DEFAULT 'invited'`
- **Audit:** `created_at`, `updated_at`

### `workspace_members`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `user_id UUID NOT NULL REFERENCES users(id)`
- **Business:** `role_code TEXT NOT NULL` — references role seed data
- **Status:** `status workspace_member_status_enum NOT NULL DEFAULT 'invited'`
- **Operational:** `joined_at TIMESTAMPTZ`, `archived_at TIMESTAMPTZ`
- **Audit:** `created_at`, `updated_at`
- **Unique constraint:** `(workspace_id, user_id)` — one membership per user per workspace

### `store_profiles`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id)` — one per workspace
- **Display:** `store_name TEXT NOT NULL`, `store_url TEXT`, `brand_summary TEXT`, `target_market_summary TEXT`, `default_language TEXT`
- **Status:** `status store_profile_status_enum NOT NULL DEFAULT 'inactive'`
- **Audit:** `created_at`, `updated_at`

### `products`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Display:** `name TEXT NOT NULL`, `description TEXT`, `category TEXT`, `price_placeholder TEXT` — commerce integration deferred
- **Status:** `status product_status_enum NOT NULL DEFAULT 'draft'`
- **Soft-delete:** `archived_at TIMESTAMPTZ`
- **Audit:** `created_at`, `updated_at`

### `data_sources`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Operational:** `type TEXT NOT NULL`, `provider TEXT NOT NULL`, `display_name TEXT NOT NULL`, `connection_status TEXT NOT NULL DEFAULT 'not_connected'`, `last_sync_status TEXT`
- **Audit:** `created_at`, `updated_at`

### `channel_connections`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `data_source_id UUID REFERENCES data_sources(id)` — optional
- **Operational:** `provider TEXT NOT NULL`, `channel_type TEXT NOT NULL`, `display_name TEXT NOT NULL`, `connection_status TEXT NOT NULL DEFAULT 'not_connected'`, `capability_summary TEXT`
- **Audit:** `created_at`, `updated_at`

### `integration_credentials`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `channel_connection_id UUID REFERENCES channel_connections(id)` — optional
- **Credential (safe only):** `credential_type TEXT NOT NULL`, `vault_ref TEXT NOT NULL` — opaque vault reference; never a raw secret
- **Lifecycle:** `archived_at TIMESTAMPTZ` — revoke by archiving
- **Audit:** `created_at`

### `assets`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `product_id UUID REFERENCES products(id)`, `campaign_content_item_id UUID REFERENCES campaign_content_items(id)` — both optional
- **Display:** `title TEXT NOT NULL`, `asset_type TEXT NOT NULL`, `source TEXT`
- **Storage:** `storage_reference TEXT` — placeholder; Storage Gate finalizes
- **Status:** `status asset_status_enum NOT NULL DEFAULT 'active'`
- **Soft-delete:** `archived_at TIMESTAMPTZ`
- **Audit:** `created_at`, `updated_at`

### `campaigns`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Display:** `name TEXT NOT NULL`, `objective TEXT`
- **Relationships:** `primary_product_id UUID REFERENCES products(id)` — optional
- **Status:** `status campaign_status_enum NOT NULL DEFAULT 'draft'`
- **Version:** `version INTEGER NOT NULL DEFAULT 1` — for optimistic concurrency
- **Soft-delete:** `archived_at TIMESTAMPTZ`
- **Audit:** `created_at`, `updated_at`

### `campaign_briefs`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `campaign_id UUID NOT NULL UNIQUE REFERENCES campaigns(id)` — one per campaign
- **Display:** `objective TEXT`, `audience_summary TEXT`, `channel_summary TEXT`, `tone TEXT`, `constraints TEXT`
- **Audit:** `created_at`, `updated_at`

### `campaign_content_items`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `campaign_id UUID NOT NULL REFERENCES campaigns(id)`, `current_draft_id UUID REFERENCES content_drafts(id)` — optional circular; set after first draft created
- **Operational:** `content_type TEXT NOT NULL`, `channel TEXT NOT NULL`
- **Status:** `status campaign_content_item_status_enum NOT NULL DEFAULT 'draft'`
- **Version:** `version INTEGER NOT NULL DEFAULT 1`
- **Soft-delete:** `archived_at TIMESTAMPTZ`
- **Audit:** `created_at`, `updated_at`

### `content_drafts`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `campaign_content_item_id UUID NOT NULL REFERENCES campaign_content_items(id)`, `created_by_user_id UUID REFERENCES users(id)`
- **Content:** `body TEXT`, `language TEXT`
- **Operational:** `version_number INTEGER NOT NULL DEFAULT 1`
- **Status:** `status content_draft_status_enum NOT NULL DEFAULT 'draft'`
- **Version:** `version INTEGER NOT NULL DEFAULT 1` — for optimistic concurrency
- **Soft-delete:** `archived_at TIMESTAMPTZ`
- **Audit:** `created_at`, `updated_at`

### `content_approvals`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `content_draft_id UUID NOT NULL REFERENCES content_drafts(id)`, `reviewer_user_id UUID NOT NULL REFERENCES users(id)`
- **Decision (server-owned):** `decision content_approval_decision_enum NOT NULL` — set by server; never from client body
- **Metadata:** `note TEXT`, `rejection_reason TEXT`, `required_changes TEXT[]` — nullable; populated on reject
- **Operational:** `decided_at TIMESTAMPTZ`
- **Audit:** `created_at` only — immutable after creation; no `updated_at`
- **Note:** Self-approval forbidden at application layer (reviewer_user_id ≠ content draft's created_by_user_id)

### `publishing_jobs`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `campaign_id UUID NOT NULL REFERENCES campaigns(id)`, `campaign_content_item_id UUID REFERENCES campaign_content_items(id)`, `target_channel_connection_id UUID REFERENCES channel_connections(id)` — optional
- **Operational:** `scheduled_at TIMESTAMPTZ`
- **Status:** `status publishing_job_status_enum NOT NULL DEFAULT 'draft'`
- **Version:** `version INTEGER NOT NULL DEFAULT 1`
- **Lifecycle:** `cancelled_at TIMESTAMPTZ`
- **Audit:** `created_at`, `updated_at`

### `publishing_statuses`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Relationships:** `publishing_job_id UUID NOT NULL REFERENCES publishing_jobs(id)`
- **Operational:** `status TEXT NOT NULL`, `status_message TEXT`, `occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- **Audit:** `created_at` only — append-only; no `updated_at`

### `analytics_snapshots`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Status:** `status analytics_snapshot_status_enum NOT NULL`
- **Subject:** `subject_type TEXT NOT NULL` — campaign/product/channel_connection, `subject_id UUID NOT NULL`
- **Content:** `metric_summary JSONB`, `source_summary TEXT NOT NULL` — required; distinguishes real vs mock/partial
- **Temporal:** `snapshot_at TIMESTAMPTZ NOT NULL`
- **Audit:** `created_at` only — no client writes

### `audit_events`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Actor:** `actor_user_id UUID REFERENCES users(id)` — nullable for system actions
- **Event:** `action TEXT NOT NULL`, `target_type TEXT NOT NULL`, `target_id UUID NOT NULL`
- **Payload:** `metadata_summary JSONB` — no raw secrets; safe summary only
- **Temporal:** `occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- **Audit:** `created_at` only — append-only; no `updated_at`

### `idempotency_keys`
- **Identity:** `id UUID PK`
- **Tenant:** `workspace_id UUID NOT NULL REFERENCES workspaces(id)`
- **Key:** `idempotency_key TEXT NOT NULL`, `route_family TEXT NOT NULL`, `actor_user_id UUID REFERENCES users(id)`
- **Payload:** `request_hash TEXT`, `response_status INTEGER`, `response_body JSONB` — cached response for replay
- **Status:** `status TEXT NOT NULL DEFAULT 'pending'` — pending/completed/failed
- **Temporal:** `expires_at TIMESTAMPTZ NOT NULL`, `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- **Unique constraint:** `(workspace_id, route_family, idempotency_key, actor_user_id)`

---

## 7. Relationship and Cardinality Planning

| Relationship | Type | Nullable | Cascade Risk | Archive Implication |
|---|---|---|---|---|
| Workspace ↔ WorkspaceMember | one-to-many | Required | LOW — member archive does not delete workspace | Archived member loses access; workspace remains |
| User ↔ WorkspaceMember | one-to-many | Required | LOW | User may be archived independently; workspace membership should be suspended first |
| Workspace ↔ StoreProfile | one-to-one | Optional (created on setup) | MEDIUM — if workspace deleted, store profile is orphaned | No archive; status change only |
| Workspace ↔ Product | one-to-many | Required | MEDIUM | Product archived; workspace unaffected |
| Workspace ↔ DataSource | one-to-many | Required | MEDIUM | DataSource removed; downstream ChannelConnections should nullify data_source_id |
| DataSource ↔ ChannelConnection | many-to-one (optional) | Nullable | LOW | ChannelConnection.data_source_id nullified on DataSource removal |
| ChannelConnection ↔ IntegrationCredential | one-to-many (optional) | Nullable | HIGH — credential revoke must audit | Credential archived/revoked; connection status may change |
| Workspace ↔ Asset | one-to-many | Required | LOW | Asset archived; links to products/content items nullified |
| Campaign ↔ CampaignBrief | one-to-one | Optional | MEDIUM | Brief archived with campaign |
| Campaign ↔ CampaignContentItem | one-to-many | Required | MEDIUM | Content items archived with campaign |
| CampaignContentItem ↔ ContentDraft | one-to-many | Required | MEDIUM — current_draft_id circular FK | current_draft_id nullified on draft archive |
| ContentDraft ↔ ContentApproval | one-to-many | Required | LOW — approval is immutable | No cascade; approval record preserved on draft archive |
| Campaign ↔ PublishingJob | one-to-many | Required | MEDIUM | Publishing job cancelled, not cascade-deleted |
| PublishingJob ↔ PublishingStatus | one-to-many | Required | LOW — append-only | Status records preserved on job archive |
| Workspace ↔ AnalyticsSnapshot | one-to-many | Required | LOW | Snapshots preserved; not cascade-deleted |
| Workspace ↔ AuditEvent | one-to-many | Required | LOW | Audit events preserved; never deleted |

---

## 8. Status Enum Persistence Planning

| Table.column | Enum | Values | Transition Risk | Audit Required | SQL Type Strategy |
|---|---|---|---|---|---|
| `workspaces.status` | workspace_status_enum | active, inactive, suspended | MEDIUM | YES | PostgreSQL ENUM |
| `users.status` | user_status_enum | active, invited, suspended | LOW | YES (auth provider) | PostgreSQL ENUM |
| `workspace_members.status` | workspace_member_status_enum | active, invited, suspended | MEDIUM | YES | PostgreSQL ENUM |
| `store_profiles.status` | store_profile_status_enum | active, inactive | LOW | YES | PostgreSQL ENUM |
| `products.status` | product_status_enum | draft, active, archived | LOW | YES | PostgreSQL ENUM |
| `campaign_content_items.status` | campaign_content_item_status_enum | draft, ready_for_review, approved, rejected, archived | HIGH — driven by ContentApproval | YES | PostgreSQL ENUM |
| `content_drafts.status` | content_draft_status_enum | draft, ready_for_review, approved, rejected, archived | HIGH — lifecycle POSTs | YES | PostgreSQL ENUM |
| `content_approvals.decision` | content_approval_decision_enum | approved, rejected | CRITICAL — immutable after creation | YES | PostgreSQL ENUM |
| `campaigns.status` | campaign_status_enum | draft, generating, review, ready, scheduled, active, paused, completed, archived | HIGH | YES | PostgreSQL ENUM |
| `publishing_jobs.status` | publishing_job_status_enum | draft, scheduled, queued, simulated, failed, cancelled | HIGH — `simulated` must remain distinct | YES | PostgreSQL ENUM |
| `analytics_snapshots.status` | analytics_snapshot_status_enum | available, partial, stale, unavailable | MEDIUM | YES (on transition) | PostgreSQL ENUM |

**Note:** PostgreSQL ENUM types require ALTER TYPE to add values — plan for extension points. If enum evolution is anticipated, TEXT with CHECK constraints is safer for early development.

---

## 9. Approval and Review Lifecycle Persistence Planning

### submit-review
- **Trigger:** `content_drafts.status` `draft` → `ready_for_review`
- **Persistence need:** status update on `content_drafts`; version increment
- **Audit:** AuditEvent with `action = 'content_draft.submitted_for_review'`

### approve
- **Trigger:** `content_drafts.status` → `approved`; `campaign_content_items.status` → `approved`
- **Persistence need:** new row in `content_approvals` (`decision = 'approved'`); status updates
- **Immutability:** `content_approvals` row is never updated after creation
- **Self-approval prevention:** application checks `reviewer_user_id ≠ content_draft.created_by_user_id` before insert
- **Audit:** AuditEvent `content_draft.approved`

### reject
- **Trigger:** `content_drafts.status` → `rejected`
- **Persistence need:** new row in `content_approvals` (`decision = 'rejected'`, `rejection_reason`, `required_changes`); status update
- **Round-trip metadata:** `rejection_reason TEXT` and `required_changes TEXT[]` on `content_approvals` row
- **Audit:** AuditEvent `content_draft.rejected_by_reviewer`

### withdraw
- **Trigger:** `content_drafts.status` `ready_for_review` → `rejected` (creator withdrawal)
- **Persistence need:** status update on `content_drafts`; no new `content_approvals` row (or a distinct system-level withdrawal row — deferred to SQL Schema Authoring Gate)
- **Authorization check:** `content_draft.created_by_user_id = actor_user_id`
- **Audit:** AuditEvent `content_draft.withdrawn_by_creator`

### Optimistic concurrency implication
- `content_drafts.version` must be read and compared before any lifecycle POST
- Stale version returns 409 Conflict
- Version incremented after successful transition

---

## 10. Idempotency and Optimistic Concurrency Planning

### Idempotency
| Aspect | Plan |
|---|---|
| Scope | `(workspace_id, route_family, actor_user_id, idempotency_key)` — unique per actor per endpoint family |
| Candidate table | `idempotency_keys` (see Section 6) |
| TTL | Candidates: 24h for lifecycle POSTs; configurable per route family |
| Replay behavior | If key found and `status = 'completed'`, return cached response without re-executing |
| Conflict behavior | If key found and `status = 'pending'`, return 409 Conflict |
| Routes that require idempotency | `submitContentDraftReview`, `approveContentDraft`, `rejectContentDraft`, `withdrawContentDraft` (confirmed via OpenAPI `IdempotencyKeyHeader`) |
| Deferred | Actual `idempotency_keys` table DDL; expiry/cleanup job |

### Optimistic concurrency
| Entity | Version column | Conflict behavior |
|---|---|---|
| `content_drafts` | `version INTEGER NOT NULL DEFAULT 1` | Lifecycle POST checks version; 409 if stale |
| `campaign_content_items` | `version INTEGER NOT NULL DEFAULT 1` | Update checks version; 409 if stale |
| `campaigns` | `version INTEGER NOT NULL DEFAULT 1` | Update checks version; 409 if stale |
| `publishing_jobs` | `version INTEGER NOT NULL DEFAULT 1` | Confirm/cancel check version; 409 if stale |
| Other entities | Not required in V1 | Deferred |

---

## 11. Credential Storage Planning

### `integration_credentials` design rules
| Rule | Detail |
|---|---|
| No raw secret column | `vault_ref TEXT NOT NULL` stores only an opaque vault provider reference identifier |
| Vault provider | External (e.g., HashiCorp Vault, AWS Secrets Manager); integration deferred to Security Gate |
| Safe metadata only | `credential_type TEXT`, `vault_ref TEXT`, `channel_connection_id UUID` (optional), `archived_at TIMESTAMPTZ` |
| Never returned in API response | Confirmed in OpenAPI contract; `IntegrationCredentialResponse` description says "No raw secret value is returned" |
| Audit on every operation | `audit_events` row on create, revoke, rotation attempt |
| Rotation | Revoke old row (archive), create new row; atomic at application layer |
| Deferred | Encryption key management; vault provider selection; secret rotation automation |

### ChannelConnection safety
| Rule | Detail |
|---|---|
| No credential fields on `channel_connections` | Confirmed in ERD and OpenAPI; `channel_connections` row contains only metadata |
| `data_source_id` is optional metadata link | Not a credential reference |

---

## 12. Audit Planning

### `audit_events` design
| Aspect | Plan |
|---|---|
| Append-only enforcement | Application layer: no UPDATE/DELETE queries on this table; consider DB trigger for belt-and-suspenders |
| Workspace scope | `workspace_id NOT NULL` on all events |
| Actor | `actor_user_id UUID REFERENCES users(id)` nullable (system events have no actor) |
| Resource | `target_type TEXT NOT NULL`, `target_id UUID NOT NULL` |
| Action | `action TEXT NOT NULL` — dot notation: e.g., `content_draft.submitted_for_review`, `workspace_member.suspended` |
| Payload | `metadata_summary JSONB` — safe summary only; no raw credentials, no vault refs, no PII unless necessary |
| Request correlation | Consider `request_id UUID` for correlation with API request logs |
| Timestamp | `occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`, `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` |
| Retention | Deferred to legal/compliance gate; PDPL/GCC assessment required |
| No edit/delete | Enforced at application layer; no API route offers modification |

### Audit-required operations (minimum V1)
Content draft submit/approve/reject/withdraw; workspace member invite/suspend/activate/remove/role-change; campaign create/archive; publishing job confirm/cancel; integration credential create/revoke; workspace settings update

---

## 13. Analytics Lineage Planning

### `analytics_snapshots` design
| Aspect | Plan |
|---|---|
| `source_summary TEXT NOT NULL` | Required field; distinguishes real from mock/partial/stale; populated by server only |
| `status` enum | available/partial/stale/unavailable — approved values |
| Subject linkage | `subject_type TEXT NOT NULL`, `subject_id UUID NOT NULL` — polymorphic subject reference |
| `snapshot_at TIMESTAMPTZ NOT NULL` | When the snapshot was taken |
| `metric_summary JSONB` | Flexible metric payload; nullable initially |
| No cross-workspace data | All snapshots scoped to `workspace_id`; no aggregation across workspaces |
| Storage tradeoff | JSONB `metric_summary` allows flexible metric data without schema migrations per new metric type; trade-off: harder to query normalized. Deferred to SQL Schema Authoring Gate for final decision |
| No production metric claims | `status` field enforces partial/stale/unavailable states; `source_summary` documents what is real vs mock |

---

## 14. Indexing and Query Planning

Indexes are planned but not written as SQL. SQL Schema Authoring Gate will finalize DDL.

| Table | Planned Indexes | Rationale |
|---|---|---|
| `workspace_members` | `(workspace_id)`, `(user_id)`, `(workspace_id, user_id)` UNIQUE | Membership lookup per workspace; user membership lookup |
| `products` | `(workspace_id)`, `(workspace_id, status)` | Workspace product list; status filter |
| `data_sources` | `(workspace_id)` | Workspace data source list |
| `channel_connections` | `(workspace_id)`, `(workspace_id, provider)` | Workspace connection list; provider filter |
| `assets` | `(workspace_id)`, `(workspace_id, status)`, `(product_id)`, `(campaign_content_item_id)` | Workspace asset list; relationship links |
| `campaigns` | `(workspace_id)`, `(workspace_id, status)` | Workspace campaign list; status filter |
| `campaign_content_items` | `(workspace_id)`, `(campaign_id)`, `(workspace_id, status)` | Campaign content items; workspace-wide content studio |
| `content_drafts` | `(workspace_id)`, `(campaign_content_item_id)`, `(workspace_id, status)`, `(created_by_user_id)` | Draft lookup; review queue filter |
| `content_approvals` | `(workspace_id)`, `(content_draft_id)` | Approval history per draft |
| `publishing_jobs` | `(workspace_id)`, `(workspace_id, status)`, `(campaign_id)` | Publishing queue; campaign jobs |
| `publishing_statuses` | `(workspace_id)`, `(publishing_job_id)`, `(occurred_at DESC)` | Status trail per job; chronological order |
| `analytics_snapshots` | `(workspace_id)`, `(workspace_id, subject_type, subject_id)`, `(snapshot_at DESC)` | Subject-specific analytics; chronological |
| `audit_events` | `(workspace_id)`, `(workspace_id, action)`, `(workspace_id, target_type, target_id)`, `(occurred_at DESC)` | Governance queries; resource audit trail |
| `idempotency_keys` | `(workspace_id, route_family, idempotency_key, actor_user_id)` UNIQUE, `(expires_at)` | Deduplication lookup; TTL cleanup |

### Uniqueness constraints planned
| Table | Constraint | Rationale |
|---|---|---|
| `workspace_members` | `(workspace_id, user_id)` | One membership per user per workspace |
| `store_profiles` | `workspace_id` UNIQUE | One store profile per workspace in V1 |
| `campaign_briefs` | `campaign_id` UNIQUE | One brief per campaign |
| `idempotency_keys` | `(workspace_id, route_family, idempotency_key, actor_user_id)` | Unique idempotency per actor per route per key |

---

## 15. Delete / Archive Planning

| Entity | Policy | Archived Records Visible | Audit Required | Cascade Risk |
|---|---|---|---|---|
| `workspaces` | Status `suspended` only; no delete | YES (suspended status) | YES | HIGH — workspace deletion would orphan all records |
| `users` | Status `suspended` only; no delete | YES | YES (auth provider) | HIGH — user deletion would orphan workspace_members |
| `workspace_members` | `archived_at` soft archive | NO (filtered from API) | YES | LOW |
| `store_profiles` | Status `inactive`; no hard delete | YES | YES | LOW |
| `products` | `archived_at` soft archive | NO (filtered from API) | YES | MEDIUM — related assets/campaigns link to product |
| `data_sources` | Hard remove allowed (DELETE endpoint exists); nullify downstream FKs | N/A | YES | MEDIUM — channel_connections.data_source_id → NULL |
| `channel_connections` | Hard remove allowed; nullify downstream FKs | N/A | YES | MEDIUM — integration_credentials.channel_connection_id → NULL |
| `integration_credentials` | `archived_at` revoke; never hard delete (audit trail) | NO | YES | LOW |
| `assets` | `archived_at` soft archive | NO | YES | LOW |
| `campaigns` | `archived_at` soft archive | NO | YES | MEDIUM — content items and briefs archived implicitly |
| `campaign_briefs` | Archived with campaign | NO | YES | LOW |
| `campaign_content_items` | `archived_at` soft archive | NO | YES | LOW |
| `content_drafts` | `archived_at` soft archive | NO | YES | LOW |
| `content_approvals` | NEVER delete | YES (always readable) | NO (IS the record) | NO |
| `publishing_jobs` | `cancelled_at`; no hard delete | YES (cancelled status) | YES | LOW |
| `publishing_statuses` | NEVER delete (append-only trail) | YES | NO (IS the trail) | NO |
| `analytics_snapshots` | NEVER delete | YES | YES (on transition) | LOW |
| `audit_events` | NEVER delete (append-only) | YES | NO (IS the audit) | NO |

---

## 16. OpenAPI-to-SQL Mapping Matrix

| OpenAPI Schema | Planned Table | FK Relationships | Status Enum | Create/Update/Archive | Audit Required | Version Required |
|---|---|---|---|---|---|---|
| `Workspace` | `workspaces` | — | `workspace_status_enum` | Update only; no delete | YES | NO |
| `User` | `users` | — | `user_status_enum` | Auth provider; limited direct update | YES | NO |
| `WorkspaceMember` | `workspace_members` | workspace_id, user_id | `workspace_member_status_enum` | Create/Update/Archive | YES | NO |
| `StoreProfile` | `store_profiles` | workspace_id | `store_profile_status_enum` | Upsert | YES | NO |
| `Product` | `products` | workspace_id | `product_status_enum` | Create/Update/Archive | YES | YES |
| `DataSource` | `data_sources` | workspace_id | connection_status TEXT | Create/Update/Remove | YES | NO |
| `ChannelConnection` | `channel_connections` | workspace_id, data_source_id | connection_status TEXT | Create/Update/Remove | YES | NO |
| `IntegrationCredential` | `integration_credentials` | workspace_id, channel_connection_id | — | Create/Revoke | YES | NO |
| `Asset` | `assets` | workspace_id, product_id, campaign_content_item_id | `asset_status_enum` | Create/Update/Archive | YES | NO |
| `Campaign` | `campaigns` | workspace_id, primary_product_id | `campaign_status_enum` | Create/Update/Archive | YES | YES |
| `CampaignBrief` | `campaign_briefs` | workspace_id, campaign_id | — | Create/Update | YES | NO |
| `CampaignContentItem` | `campaign_content_items` | workspace_id, campaign_id, current_draft_id | `campaign_content_item_status_enum` | Create/Update/Archive | YES | YES |
| `ContentDraft` | `content_drafts` | workspace_id, campaign_content_item_id, created_by_user_id | `content_draft_status_enum` | Create/Update/Archive/Lifecycle | YES | YES |
| `ContentApproval` | `content_approvals` | workspace_id, content_draft_id, reviewer_user_id | `content_approval_decision_enum` | Create only (immutable) | YES | NO |
| `PublishingJob` | `publishing_jobs` | workspace_id, campaign_id, campaign_content_item_id, target_channel_connection_id | `publishing_job_status_enum` | Create/Update/Cancel | YES | YES |
| `PublishingStatus` | `publishing_statuses` | workspace_id, publishing_job_id | — (TEXT) | Append-only | NO (IS the trail) | NO |
| `AnalyticsSnapshot` | `analytics_snapshots` | workspace_id | `analytics_snapshot_status_enum` | Server-created only | YES (on transition) | NO |
| `AuditEvent` | `audit_events` | workspace_id, actor_user_id | — | Append-only | NO (IS the audit) | NO |

---

## 17. Risks and Gaps

| Risk | Severity | Control |
|---|---|---|
| Schema drift from OpenAPI | HIGH | SQL Schema Authoring Gate must be reviewed against `docs/nashir_v1_openapi.yaml` |
| Premature migrations before planning review | HIGH | No migration files created in this gate; NO-GO until SQL Schema Planning Review Gate merges |
| Over-normalization of metric data | MEDIUM | `analytics_snapshots.metric_summary JSONB` defers normalization decision to SQL Schema Authoring Gate |
| JSON overuse for status/lifecycle | MEDIUM | Status fields use typed enums; JSON only for metadata (metric_summary, metadata_summary) |
| IntegrationCredential raw secret leakage | CRITICAL | `vault_ref TEXT NOT NULL` only; no raw secret column |
| AuditEvent tampering | HIGH | No UPDATE/DELETE routes; application-enforced; DB trigger backup considered |
| Cross-workspace leakage | CRITICAL | `workspace_id` required on all workspace-scoped tables; all queries must include workspace predicate |
| Idempotency gaps | MEDIUM | `idempotency_keys` table planned; lifecycle POSTs require this before backend implementation |
| Status enum mismatch | MEDIUM | All 4 status enums are now locked by PR #79; SQL Schema Authoring Gate will align exactly |
| Backend implementation before schema planning review | HIGH | Blocked by this gate and its review gate |
| URL versioning changes after schema | LOW | Schema is URL-agnostic; table names not affected by versioning prefix |
| PDPL/GCC compliance gaps | MEDIUM | Data residency and retention policies are future legal/compliance gate requirements |

---

## 18. GO / NO-GO Criteria

### GO criteria

| Criterion | Status |
|---|---|
| All OpenAPI entities mapped to planned tables or explicitly deferred | **COMPLETE** |
| Workspace scoping model defined for all workspace-scoped tables | **COMPLETE** |
| Status enum persistence planned for all 4 new enums + WorkspaceMember + AnalyticsSnapshot | **COMPLETE** |
| Credential storage boundary defined (vault reference only) | **COMPLETE** |
| Audit and analytics lineage planned | **COMPLETE** |
| Idempotency/concurrency persistence implications identified | **COMPLETE** |
| Approval lifecycle persistence implications planned | **COMPLETE** |
| No implementation introduced | **CONFIRMED** |
| **GO: SQL/Schema planning gate complete** | **GO** |
| **CONDITIONAL GO: SQL/Schema Planning Review Gate** | After this gate merges |
| SQL Schema Authoring Gate | **NO-GO until review gate merges** |
| Backend implementation | **NO-GO** |
| Migrations | **NO-GO** |
| ORM models | **NO-GO** |
| Generated client | **NO-GO** |
| Production/pilot readiness | **NO-GO** |

### NO-GO conditions that would block this gate

| Condition | Status |
|---|---|
| Missing `workspace_id` strategy | **CLEARED** |
| Unclear ContentDraft/ContentApproval persistence | **CLEARED** |
| Credential storage ambiguity | **CLEARED** |
| Missing audit strategy | **CLEARED** |
| SQL files/migrations/ORM code added | **CONFIRMED NONE** |
| Package/runtime changes | **CONFIRMED NONE** |
| marketing-os extraction | **CONFIRMED NONE** |

---

## 19. Recommended Next Gate

**Nashir SQL/Schema Planning Review Gate** — documentation-only review of this planning gate before any SQL DDL, migrations, ORM models, or backend code is written.

Until this planning gate and its review gate are both merged:
- SQL Schema Authoring must not begin
- Migration files must not be created
- Backend implementation must not begin
- Generated client must not be produced

---

## 20. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | Working tree clean after commit; changes limited to documentation |
| `git diff --stat` | Changes limited to `docs/nashir_sql_schema_planning_gate.md` |
| No SQL/migrations/schema files | **CONFIRMED** — `find . -name "*.sql" -o -name "migrations/"` shows no new files |
| No src/backend/API/runtime/generated/UI/package files changed | **CONFIRMED** |
| BIDI scan (`docs/nashir_sql_schema_planning_gate.md`) | `BIDI_CONTROL_CHARS: none` |
