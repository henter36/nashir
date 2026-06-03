# Nashir SQL Schema Authoring Gate

| Field | Value |
|---|---|
| Gate type | SQL Schema Authoring Gate - schema contract authoring only |
| Status | Authoring complete |
| Date | 2026-06-03 |
| Scope decision | Documentation-only schema contract in this gate; SQL files deferred |
| SQL DDL files created | NO |
| Migrations created | NO |
| Migration runner introduced | NO |
| SQL applied to database | NO |
| ORM models created | NO |
| Seed files created | NO |
| Backend/API routes implemented | NO |
| Generated client produced | NO |
| UI changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is the Nashir SQL Schema Authoring Gate.

This gate authors the Nashir V1 SQL schema contract as a reviewable
documentation artifact.

It clearly distinguishes schema contract authoring from executable migrations
or runtime implementation.

This gate does not authorize backend implementation.

This gate does not authorize API route implementation.

This gate does not authorize ORM models.

This gate does not authorize seed files.

This gate does not authorize generated clients.

This gate does not authorize UI or package changes.

This gate does not authorize migrations.

This gate does not authorize production or pilot readiness.

No SQL is applied to any database.

No migration runner is introduced or configured.

No executable migration artifact is created.

---

## 2. Inputs Reviewed

### Controlling inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_schema_authoring_planning_gate.md` | Controls authoring sequence, scope, enum strategy, and constraints |
| `docs/nashir_sql_schema_authoring_planning_review_gate.md` | Review decision authorizing this authoring gate |
| `docs/nashir_v1_openapi.yaml` | Current API contract authority |

### Direct and contextual inputs

| Input | Role |
|---|---|
| `README.md` | Nashir product status and mock-only constraints |
| `docs/screen_map.md` | Approved screen map and mock-only constraints |
| `docs/nashir_sql_schema_planning_gate.md` | Persistence planning baseline |
| `docs/nashir_sql_schema_planning_review_gate.md` | SQL/Schema planning review decision |
| `docs/nashir_openapi_yaml_deferred_decisions_gate.md` | Status, lifecycle, idempotency, and concurrency decisions |
| `docs/nashir_openapi_yaml_deferred_decisions_review_gate.md` | Deferred OpenAPI decisions review |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Workspace identity, roles, permissions, and authorization boundaries |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |
| `docs/nashir_erd_data_model_gate.md` | Entity and relationship source |
| `docs/nashir_erd_data_model_review_gate.md` | ERD/Data Model review confirmation |
| `docs/nashir_backend_api_strategy_gate.md` | Backend/API strategy context |
| `docs/nashir_backend_api_strategy_review_gate.md` | Backend/API strategy review confirmation |

### Authority boundaries

| Boundary | Result |
|---|---|
| Nashir is the product, API contract, UI journey, scope, and data model authority | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |
| No marketing-os code, runtime shape, or entity model is copied | **CONFIRMED** |

---

## 3. Scope Decision

This gate creates documentation only.

No approved repository location exists for SQL schema contract files, SQL DDL
draft files, or migration files.

Therefore, this gate does not create SQL files.

Proposed future location, subject to SQL Schema Authoring Review Gate approval:

```text
docs/schema_contracts/nashir_v1_schema.sql
```

This location is not created by this gate.

SQL file creation is deferred to a follow-up authoring patch after review.

If a future gate creates SQL DDL draft files, that gate must confirm:

- They are not migrations.
- No migration runner is introduced.
- No package changes are introduced.
- They are not applied to any database.
- A separate SQL Schema Authoring Review Gate passes before migration,
  backend, ORM, seed, or generated-client work starts.

---

## 4. Authoring Boundaries

| Boundary | Contract requirement |
|---|---|
| Workspace-scoped by default | Merchant-owned tables carry `workspace_id` unless explicitly global |
| User global | `users` is global identity, not workspace-scoped |
| WorkspaceMember authorization binding | `workspace_members` binds user, workspace, role, and member status |
| Credential separation | `integration_credentials` is separate from `channel_connections` |
| No plaintext secrets | SQL contract must not include raw credential or token columns |
| AuditEvent append-only | `audit_events` is append-only in contract and later enforcement |
| Analytics lineage | `analytics_snapshots` must preserve `sourceSummary` / `source_summary` |
| ContentApproval immutability | `content_approvals` records are immutable decision records |
| Self-approval prevention support | Contract must preserve creator/reviewer references for service-layer prevention |
| Idempotency/concurrency support | Lifecycle POST support requires idempotency and resource version fields |

---

## 5. Tables to Author

This section is the schema contract for future SQL DDL authoring.

It is not executable SQL.

### Core entity tables

| Table | Schema contract |
|---|---|
| `workspaces` | UUID primary key; root tenant boundary; `name`; OpenAPI `WorkspaceStatus`; server-owned `created_at` and `updated_at`; no hard delete; workspace status index candidate; OpenAPI `Workspace` mapping |
| `users` | UUID primary key; global identity; `email` and display fields; global unique email candidate; email normalization/case-folding deferred; `users.status` is SQL-only planning proposal — final representation deferred to SQL Schema Authoring Review Gate / later authoring decision; server-owned timestamps; Auth/RBAC global User identity mapping; OpenAPI exposes user identity through WorkspaceMember.userId / membership context unless a dedicated User schema is approved later |
| `workspace_members` | UUID primary key; `workspace_id` FK; `user_id` FK; role code; OpenAPI-approved status; joined/archive timestamps; unique workspace/user membership; RBAC and OpenAPI `WorkspaceMember` mapping |
| `store_profiles` | UUID primary key; `workspace_id` FK and unique constraint; store display/profile fields; SQL-only status proposal; timestamps; OpenAPI `StoreProfile` mapping |
| `products` | UUID primary key; `workspace_id` FK; product business fields; SQL-only status proposal; `archived_at`; timestamps; workspace/status indexes; OpenAPI `Product` mapping |
| `data_sources` | UUID primary key; `workspace_id` FK; source type/provider/display fields; SQL-only connection status proposal; sync status; timestamps; workspace indexes; OpenAPI `DataSource` mapping |
| `channel_connections` | UUID primary key; `workspace_id` FK; optional `data_source_id`; provider/channel/display fields; SQL-only connection status proposal; capability metadata; no credential columns; OpenAPI `ChannelConnection` mapping |
| `integration_credentials` | UUID primary key; `workspace_id` FK; optional `channel_connection_id`; optional `data_source_id`; credential type; `credential_ref`/`vault_ref`; no plaintext secrets; revoke/archive timestamp; credential mutation audit requirement |
| `assets` | UUID primary key; `workspace_id` FK; optional product/content links; title/type/source; storage reference; SQL-only status proposal; `archived_at`; timestamps; OpenAPI `Asset` mapping |
| `campaigns` | UUID primary key; `workspace_id` FK; optional primary product FK; name/objective; OpenAPI `CampaignStatus`; resource `version`; `archived_at`; timestamps; OpenAPI `Campaign` mapping |
| `campaign_briefs` | UUID primary key; `workspace_id` FK; unique `campaign_id`; objective, audience, channel, tone, and constraint fields; timestamps; OpenAPI `CampaignBrief` mapping |
| `campaign_content_items` | UUID primary key; `workspace_id` FK; `campaign_id` FK; optional current draft FK; content type/channel; OpenAPI `CampaignContentItem` / `CampaignContentItemStatus` mapping; resource `version`; `archived_at` |
| `content_drafts` | UUID primary key; `workspace_id` FK; content item FK; creator user FK; body/language; version number; OpenAPI `ContentDraftStatus`; resource `version`; `archived_at`; OpenAPI mapping |
| `content_approvals` | UUID primary key; `workspace_id` FK; content draft FK; reviewer user FK; OpenAPI `ContentApprovalDecision`; note, rejection reason, required changes; decided/created timestamps; immutable; OpenAPI mapping |
| `publishing_jobs` | UUID primary key; `workspace_id` FK; campaign/content/channel FKs; scheduled timestamp; OpenAPI `PublishingJobStatus`; resource `version`; `cancelled_at`; queue indexes; OpenAPI mapping |
| `publishing_statuses` | UUID primary key; `workspace_id` FK; publishing job FK; SQL-only status trail field; message; occurred/created timestamps; append-only trail; OpenAPI publishing status mapping |
| `analytics_snapshots` | UUID primary key; `workspace_id` FK; OpenAPI `AnalyticsSnapshotStatus`; subject type/id; metric JSON candidate; required source summary; snapshot timestamp/period decision; OpenAPI mapping |
| `audit_events` | UUID primary key; `workspace_id` FK; actor user/member references; resource type/id; action; request/correlation id candidate; safe metadata JSON; occurred/created timestamps; append-only |

### Support and reference candidates

| Table | Schema contract |
|---|---|
| `idempotency_keys` | UUID primary key; `workspace_id` FK; operation family; actor/member reference; idempotency key; request hash; response status/body; SQL-only status proposal; expiry; unique idempotency scope |
| `roles` | Reference candidate only; role code; display/description fields; global scope; no seed file in this gate |
| `permissions` | Reference candidate only; permission code; display/description fields; global scope; no seed file in this gate |
| `role_permissions` | Reference mapping candidate only; role/permission references; composite uniqueness or primary key; no seed file in this gate |

### OpenAPI vs Auth/RBAC Mapping Clarification

Some persistence tables map directly to OpenAPI schemas.

Some persistence tables are required by Auth/RBAC/Data Model gates even if they
are not standalone API resources.

SQL authoring must not delete identity tables just because they are not exposed
as direct CRUD resources.

SQL authoring must not claim direct OpenAPI mapping for schemas that do not
exist.

The `users` table is required by the Auth/RBAC/Workspace Identity gates even if
User is not a standalone V1 OpenAPI resource.

The canonical SQL table name remains `campaign_content_items` because the
current V1 OpenAPI route/schema family uses `CampaignContentItem`,
`CampaignContentItemResponse`, `CampaignContentItemStatus`, and
`/content-items` routes.

Any legacy or alternate CampaignContent naming must be handled by a future
OpenAPI cleanup/review decision, not by renaming the SQL table in this gate.

### Required contract dimensions

Future SQL DDL for each table must specify:

- Primary key.
- Workspace boundary.
- Foreign keys.
- Required and nullable fields.
- Server-owned fields.
- Status fields.
- Timestamps.
- Archive/delete fields.
- Audit fields.
- Metadata/JSON fields.
- Sensitive-field rules.
- Indexes.
- Uniqueness constraints.
- Check constraints or enum strategy.
- Cascade/restrict behavior.
- OpenAPI mapping.

---

## 6. Enum and Status Strategy

| Status source | Contract strategy |
|---|---|
| `WorkspaceMemberStatus -> workspace_members.status` | OpenAPI-approved enum candidate: active, invited, suspended |
| `AnalyticsSnapshotStatus -> analytics_snapshots.status` | OpenAPI-approved enum candidate: available, partial, stale, unavailable |
| `CampaignStatus` | OpenAPI-approved PostgreSQL ENUM candidate |
| `ContentDraftStatus` | OpenAPI-approved PostgreSQL ENUM candidate |
| `CampaignContentItemStatus` | OpenAPI-approved PostgreSQL ENUM candidate |
| `PublishingJobStatus` | OpenAPI-approved PostgreSQL ENUM candidate |
| `ContentApprovalDecision` | OpenAPI-approved PostgreSQL ENUM candidate; server-owned decision |
| `WorkspaceStatus` | OpenAPI-approved PostgreSQL ENUM candidate |
| `users.status` | SQL-only planning proposal — final representation deferred to SQL Schema Authoring Review Gate / later authoring decision |
| Store profile status | SQL-only TEXT + CHECK candidate |
| Product status | SQL-only TEXT + CHECK candidate |
| Asset status | SQL-only TEXT + CHECK candidate |
| Data source status | SQL-only TEXT + CHECK candidate |
| Channel connection status | SQL-only TEXT + CHECK candidate |
| Idempotency key status | SQL-only TEXT + CHECK candidate |
| `publishing_statuses.status` | SQL-only TEXT + CHECK or TEXT candidate |

OpenAPI-approved here refers to enum schemas present in
`docs/nashir_v1_openapi.yaml` and mapped to SQL table fields.
SQL-only fields such as `users.status` remain planning proposals and are not
OpenAPI-approved.

No enum may introduce values not approved by OpenAPI or prior planning docs.

Any mismatch with OpenAPI is NO-GO.

Final physical enum representation remains subject to SQL Schema Authoring
Review Gate approval before executable artifacts are created.

---

## 7. Workspace and Tenancy Constraints

| Constraint | Contract requirement |
|---|---|
| Workspace ownership | All merchant-owned tables carry `workspace_id` |
| Global identity | `users` is global |
| Reference tables | `roles`, `permissions`, and `role_permissions` are global candidates only |
| Cross-workspace protection | FKs must not allow child records to reference parents from another workspace |
| Composite constraints | Same-workspace FK/unique strategies required where simple FKs are insufficient |
| StoreProfile uniqueness | One store profile per workspace |
| WorkspaceMember uniqueness | One membership per user per workspace |
| User email uniqueness | Global unique email candidate |
| Email case strategy | Lowercasing, CITEXT, or functional unique index decision deferred |
| List indexes | Workspace-scoped list queries must be indexable by `workspace_id` |

Same-workspace checks are required for campaign/content, publishing, asset,
analytics, and credential relationships where both sides are workspace-owned.

---

## 8. Credential Constraints

| Credential rule | Contract requirement |
|---|---|
| ChannelConnection | Must not contain raw credential columns |
| IntegrationCredential targets | Supports optional `channel_connection_id` and optional `data_source_id` |
| Target model | Future review must decide target exclusivity or documented credential-scope model |
| Credential reference | Use `credential_ref` / `vault_ref` only |
| Plaintext secrets | Forbidden |
| Vault/encryption provider | Deferred |
| Mutation audit | Create, revoke, and rotate require audit events |
| Credential indexes | Workspace, target, status, expiry, and verification indexes are candidates |

---

## 9. Content Approval Lifecycle Constraints

| Lifecycle need | Contract support |
|---|---|
| submit-review | ContentDraft status and resource version support |
| approve | ContentApproval decision plus draft/content item status support |
| reject | Rejection decision plus reason and required changes support |
| withdraw | Creator self-withdrawal support |
| Immutable approvals | ContentApproval records are create-only decision records |
| Decision source | Server-derived from endpoint path, not arbitrary client body |
| Rejection round-trip | `rejectionReason` and `requiredChanges` are persisted |
| Self-approval prevention | Creator and reviewer references support service-layer prevention |
| Creator self-withdrawal | Creator reference supports service-layer authorization |
| Concurrency | Resource version fields support 409 conflict behavior |
| Idempotency | Lifecycle POSTs require idempotency key support |

---

## 10. Idempotency and Concurrency

| Area | Contract requirement |
|---|---|
| Idempotency table | `idempotency_keys` is included in first schema scope candidate |
| Key scope | `workspace_id` + operation family + actor/member + idempotency key |
| Request hash | Candidate field for replay matching |
| Response replay | Candidate response status/body fields for completed replay |
| Expiry/retention | Expiry timestamp and cleanup policy required |
| Status | SQL-only TEXT + CHECK candidate |
| Resource versions | Mutable lifecycle resources require version fields |
| 409 conflicts | Stale version and in-progress idempotency conflicts must align with OpenAPI |

---

## 11. Audit and Analytics

| Area | Contract requirement |
|---|---|
| Audit append-only | `audit_events` is append-only |
| Actor context | Actor user and/or member references must be representable |
| Resource context | Resource type/id fields required |
| Request correlation | `request_id` / `correlation_id` candidate required |
| Audit payload | Safe metadata JSON only; no secrets |
| Audit indexes | Workspace/resource/action/time indexes required |
| Analytics lineage | `sourceSummary` / `source_summary` required |
| Snapshot period | Snapshot timestamp required; period fields deferred |
| Analytics status | OpenAPI `AnalyticsSnapshotStatus` |
| Cross-workspace leakage | Cross-workspace aggregation leakage forbidden |

---

## 12. Indexes and Constraints

| Category | Contract requirement |
|---|---|
| Workspace indexes | Required for workspace-scoped listable tables |
| FK indexes | Required for major parent/child lookups |
| Status indexes | Required for status-filtered operational lists |
| Timestamp indexes | `created_at` / `updated_at` indexes evaluated by query pattern |
| Content review queues | Workspace/status/content item/creator indexes |
| Publishing queue | Workspace/status/campaign/scheduled time indexes |
| Analytics period | Workspace/subject/snapshot time or period indexes |
| Audit queries | Workspace/resource/action/time indexes |
| User email | Global unique email candidate |
| WorkspaceMember | Unique workspace/user constraint |
| StoreProfile | Unique workspace constraint |
| CampaignBrief | Unique campaign constraint |
| Idempotency | Unique workspace/operation/actor/key scope |
| Soft archive | Partial or filtered index candidates for active records |

---

## 13. Delete and Archive Behavior

| Behavior | Contract requirement |
|---|---|
| Soft archive | Preferred for merchant-owned records |
| Hard delete | Deferred unless explicitly approved |
| Cascade behavior | Restrict/no cascade by default unless justified |
| Nullify behavior | Allowed only for approved optional metadata links |
| Archive/delete audit | Required for archive/delete/revoke/remove operations |
| Cross-workspace safety | Delete/archive operations must stay workspace-scoped |
| Append-only records | Audit events, approvals, publishing statuses, and snapshots are not hard-deleted in V1 planning |

---

## 14. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| SQL parse | NOT RUN - no SQL files created |
| `git status --short` | `M docs/nashir_sql_schema_authoring_gate.md` before commit |
| `git diff --stat` | One docs file changed: 34 insertions, 12 deletions |
| `git diff -- docs/nashir_sql_schema_authoring_gate.md` | OpenAPI/SQL mapping clarification changes only |
| Schema/SQL contract diff | NOT APPLICABLE - no schema/SQL files created |
| BIDI scan on `docs/nashir_sql_schema_authoring_gate.md` | `BIDI_CONTROL_CHARS none` |
| Migrations/backend/API runtime/ORM/generated/UI/package changed-file search | `FORBIDDEN_CHANGED_FILES: none` |

---

## 15. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| SQL authoring before review | HIGH | This gate requires SQL Schema Authoring Review Gate before SQL/migration/backend work |
| Migration strategy not final | MEDIUM | Migration location, naming, and runner decisions remain deferred |
| Cross-workspace leakage | CRITICAL | Same-workspace FK/constraint strategy required |
| Credential leakage | CRITICAL | Raw credential columns forbidden |
| Enum mismatch | HIGH | OpenAPI mismatch is NO-GO |
| Audit tampering | HIGH | Append-only contract required; enforcement deferred |
| Idempotency gaps | HIGH | `idempotency_keys` and version fields included as first-scope candidates |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |
| SQL contract location missing | MEDIUM | Proposed location documented; file creation deferred |

---

## 16. GO / NO-GO Decision

**Decision: GO to SQL Schema Authoring Review Gate.**

This gate authors the schema contract in documentation only.

This gate does not authorize backend implementation.

This gate does not authorize API route implementation.

This gate does not authorize ORM models.

This gate does not authorize seed files.

This gate does not authorize generated clients.

This gate does not authorize migrations.

This gate does not authorize package/UI changes.

This gate does not authorize production or pilot readiness.
