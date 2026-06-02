# Nashir SQL Schema Authoring Planning Gate

| Field | Value |
|---|---|
| Gate type | SQL Schema Authoring Planning Gate - documentation only |
| Status | Planning complete |
| Date | 2026-06-02 |
| Scope | Plans how future SQL schema authoring should be structured, reviewed, sequenced, and constrained |
| Primary inputs | `docs/nashir_sql_schema_planning_gate.md`, `docs/nashir_sql_schema_planning_review_gate.md`, `docs/nashir_v1_openapi.yaml` |
| SQL DDL created | NO |
| Migrations created | NO |
| Database schema files created | NO |
| ORM models created | NO |
| Seed files created | NO |
| Backend routes implemented | NO |
| Generated client produced | NO |
| UI changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is SQL Schema Authoring Planning only.

It prepares the future SQL Schema Authoring Gate without writing SQL.

No SQL DDL is created.

No migrations are created.

No database schema files are created.

No ORM models are created.

No seed files are created.

No backend code or API route implementation is introduced.

No generated TypeScript client, SDK, or runtime client is produced.

No UI, package, or build changes are introduced.

No marketing-os extraction is authorized.

No production or pilot readiness is claimed.

This gate comes after the SQL/Schema Planning Review Gate because the review
authorized only the next planning step: SQL Schema Authoring Planning.

This gate comes before any SQL Schema Authoring because the future authoring
work needs explicit scope, sequence, constraints, and verification requirements
before executable database artifacts are written.

---

## 2. Inputs Reviewed

### Primary inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_schema_planning_gate.md` | Primary persistence planning source |
| `docs/nashir_sql_schema_planning_review_gate.md` | Review decision authorizing this planning gate |
| `docs/nashir_v1_openapi.yaml` | Current API contract authority |

### Direct and contextual inputs

| Input | Role |
|---|---|
| `README.md` | Nashir product status, mock-only constraints, and approved journey |
| `docs/screen_map.md` | 23-screen map and UI prototype constraints |
| `docs/nashir_openapi_yaml_deferred_decisions_gate.md` | Resolved status enums, lifecycle operations, idempotency, and concurrency decisions |
| `docs/nashir_openapi_yaml_deferred_decisions_review_gate.md` | Review confirmation for deferred OpenAPI decisions |
| `docs/nashir_openapi_yaml_authoring_gate.md` | OpenAPI YAML authoring context |
| `docs/nashir_openapi_yaml_authoring_review_gate.md` | OpenAPI YAML authoring review context |
| `docs/nashir_api_contract_openapi_planning_gate.md` | API contract planning context |
| `docs/nashir_api_contract_openapi_planning_review_gate.md` | API contract planning review context |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Workspace identity, roles, permissions, and authorization boundaries |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC/workspace identity review confirmation |
| `docs/nashir_erd_data_model_gate.md` | Entity and relationship planning source |
| `docs/nashir_erd_data_model_review_gate.md` | ERD/Data Model review confirmation |
| `docs/nashir_backend_api_strategy_gate.md` | Backend/API strategy context |
| `docs/nashir_backend_api_strategy_review_gate.md` | Backend/API strategy review confirmation |
| `docs/nashir_v1_scope_decision_gate.md` | Approved V1 scope and journey |
| `docs/nashir_v1_scope_decision_review_gate.md` | V1 scope review confirmation |
| `docs/nashir_product_scope_reconciliation_gate.md` | Product scope reconciliation |
| `docs/nashir_product_scope_reconciliation_review_gate.md` | Product scope review confirmation |

### Product authority

| Authority rule | Result |
|---|---|
| Nashir is the approved product, source of truth, UI journey, scope, API contract, and future data model authority | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |
| marketing-os code, entities, backend shape, runtime assumptions, and journey are not copied into this plan | **CONFIRMED** |

---

## 3. Current Facts, Authoring-Planning Decisions, and Deferred Items

### Approved facts from prior gates

| Fact | Source |
|---|---|
| Nashir remains mock/prototype only before backend implementation | README / Screen Map |
| Backend direction is Nashir-first, PostgreSQL-compatible, REST/OpenAPI-oriented | Backend/API Strategy Gate |
| Workspace scoping is mandatory for merchant-owned data | Auth/RBAC Gate / ERD Gate |
| `User` is global; workspace access is through `WorkspaceMember` | Auth/RBAC Gate / ERD Gate |
| `WorkspaceMember` is the authorization binding | Auth/RBAC Gate |
| OpenAPI is the current API contract authority | OpenAPI gates |
| SQL/Schema Planning Gate is complete | SQL/Schema Planning Gate |
| SQL/Schema Planning Review Gate authorizes only this planning gate | SQL/Schema Planning Review Gate |
| SQL/Schema Planning Review Gate does not authorize SQL DDL or migrations | SQL/Schema Planning Review Gate |
| Raw credentials must not be stored in general relational rows | ERD / Auth / SQL planning gates |
| AuditEvent is append-only in concept | ERD / SQL planning gates |
| AnalyticsSnapshot requires source lineage via `sourceSummary` / `source_summary` | OpenAPI / SQL planning gates |

### Decisions made in this authoring planning gate

| Decision | Detail |
|---|---|
| First authoring scope | Covers V1 required entity tables plus required support/reference planning candidates, subject to authoring review |
| Authoring sequence | Foundation, store/product/source, campaign/content, publishing/analytics/audit, then support/reference |
| Physical DDL | Still not approved; future SQL Schema Authoring Gate must decide exact DDL |
| Migration strategy | Deferred to SQL Schema Authoring Gate because no repo migration convention is established in this gate |
| Enum strategy | OpenAPI-approved stable enums are PostgreSQL ENUM candidates; SQL-only statuses are TEXT + CHECK candidates |
| Workspace constraints | Future authoring must prevent cross-workspace linkage, not only add `workspace_id` columns |
| Credential boundary | Future authoring must keep raw secrets out of SQL and use vault/reference metadata only |
| Audit/idempotency/concurrency | Future authoring must include support structures before backend lifecycle implementation starts |
| Verification | Future authoring must include SQL parse/migration checks if SQL or migration files are introduced |

### Deferred items

| Item | Deferred to |
|---|---|
| Exact SQL DDL | SQL Schema Authoring Gate |
| Migration files | SQL Schema Authoring Gate |
| Migration framework and naming convention | SQL Schema Authoring Gate |
| SQL Schema Authoring Review | SQL Schema Authoring Review Gate |
| ORM models | Backend Slice 1 Planning / later implementation |
| Backend routes and service code | Backend Slice 1 Planning / implementation gates |
| Auth provider persistence details | Backend Slice 1 Planning / Auth implementation gate |
| Role/permission seed file implementation | Backend Slice 1 Planning / SQL authoring if explicitly approved |
| Vault provider integration | Security Gate / implementation gate |
| Audit retention and data residency | Legal/compliance gate |
| Generated clients or SDKs | Later client generation gate |
| Production or pilot readiness | Later readiness gate |

---

## 4. SQL Authoring Scope Boundaries

This section defines future SQL authoring scope without writing SQL.

### First SQL authoring scope candidates

| Table | Scope | Reason |
|---|---|---|
| `workspaces` | First scope | Root tenant boundary |
| `users` | First scope | Global identity anchor |
| `workspace_members` | First scope | Authorization binding |
| `store_profiles` | First scope | Store setup owner data |
| `products` | First scope | Product catalog for campaign creation |
| `data_sources` | First scope | Data readiness/integration metadata |
| `channel_connections` | First scope | Channel metadata and publishing target context |
| `integration_credentials` | First scope candidate | Needed to preserve credential boundary, even if provider implementation is deferred |
| `assets` | First scope | Asset library for content/campaigns |
| `campaigns` | First scope | Campaign root |
| `campaign_briefs` | First scope | Campaign planning detail |
| `campaign_content_items` | First scope | Content units under campaigns |
| `content_drafts` | First scope | Content lifecycle root |
| `content_approvals` | First scope | Immutable approval/rejection records |
| `publishing_jobs` | First scope | Publishing queue planning |
| `publishing_statuses` | First scope | Append-only publishing status trail |
| `analytics_snapshots` | First scope | Analytics lineage support |
| `audit_events` | First scope | Governance and security traceability |

### Support/reference candidates

| Table | Scope | Reason |
|---|---|---|
| `idempotency_keys` | Support candidate in first SQL authoring | Required before lifecycle POST backend implementation |
| `roles` | Reference/seed candidate | Required for role resolution if persisted in SQL |
| `permissions` | Reference/seed candidate | Required for permission resolution if persisted in SQL |
| `role_permissions` | Reference/seed candidate | Required for role-permission mapping if persisted in SQL |

### Deferred table groups

| Table group | Deferred to | Reason |
|---|---|---|
| `templates`, `prompt_versions`, `model_routes`, `usage_cost_events`, `workflow_runs` | Admin/Governance gate | Post-core governance entities |
| `product_insights`, `creator_studio_artifacts`, `review_decisions` | Extended V1 gate | Active product surfaces with deferred backend implementation |
| Auth provider session/token tables | Backend Slice 1 Planning / Auth implementation | Provider-specific design not approved here |

### Review-before-DDL requirements

| Requirement | Review expectation |
|---|---|
| Table list and authoring sequence | Must be reviewed before SQL files are written |
| Workspace scoping constraints | Must be reviewed before SQL files are written |
| OpenAPI enum value mapping | Must be reviewed before SQL files are written |
| SQL-only status values | Must be approved before physical constraints are authored |
| Credential storage boundary | Must be reviewed before SQL files are written |
| Cascade/restrict behavior | Must be reviewed before SQL files are written |
| Migration/file strategy | Must be clarified before SQL files are written |

---

## 5. Authoring Sequence Proposal

| Sequence group | Tables | Reason for ordering | Dependencies | Risk if reordered | V1 status |
|---|---|---|---|---|---|
| 1. Foundation tables | `workspaces`, `users`, `workspace_members` | Establish tenant root, global users, and authorization binding first | None; root layer | Later workspace-scoped tables cannot safely reference tenants or actors | V1 required |
| 2. Store/product/source tables | `store_profiles`, `products`, `data_sources`, `channel_connections`, `integration_credentials`, `assets` | Establish merchant setup, catalog, source/channel metadata, credential boundary, and assets | Foundation tables | Campaign/content tables may lack valid ownership and source context | V1 required; credential implementation deferred |
| 3. Campaign/content tables | `campaigns`, `campaign_briefs`, `campaign_content_items`, `content_drafts`, `content_approvals` | Establish campaign and approval lifecycle after workspace/product foundations | Foundation and product/asset context | Lifecycle tables may reference missing campaign/product/actor structures | V1 required |
| 4. Publishing/analytics/audit tables | `publishing_jobs`, `publishing_statuses`, `analytics_snapshots`, `audit_events` | Establish operational trails and lineage after core entities | Foundation, campaign/content, channel tables | Publishing and analytics may lose traceability or workspace isolation | V1 required |
| 5. Support/reference tables | `idempotency_keys`, `roles`, `permissions`, `role_permissions` | Add lifecycle support and RBAC reference persistence after core relationships are clear | Foundation and Auth/RBAC approval | Backend lifecycle and permission checks may start without persistence support | Support/reference candidates |

### Sequence rules

- Foundation tables must be authored before workspace-scoped merchant tables.
- Workspace-scoped tables must not be authored without reviewed tenant constraints.
- Lifecycle tables must not be authored without status, version, idempotency, and audit requirements.
- Credential tables must not be authored in a way that stores raw secrets.
- Reference/seed candidates must not create seed files unless explicitly authorized by a later gate.

---

## 6. Table Authoring Checklist

Future SQL authoring must specify the following items for every planned table.

| Table | Future authoring must specify |
|---|---|
| `workspaces` | UUID primary key; root tenant boundary; required display fields; SQL planning proposal status; server-owned timestamps; no hard delete; workspace status checks; indexes; OpenAPI mapping; verification |
| `users` | UUID primary key; global identity boundary; email/display fields; PII ownership; SQL planning proposal status; server-owned timestamps; auth-provider deferrals; indexes; OpenAPI mapping; verification |
| `workspace_members` | UUID primary key; `workspace_id`; `user_id`; role code; OpenAPI-approved status; joined/archive fields; timestamps; unique `workspace_id` plus `user_id`; FK behavior; indexes; OpenAPI/RBAC mapping; verification |
| `store_profiles` | UUID primary key; one `workspace_id`; required and optional store fields; SQL planning proposal status; timestamps; unique workspace constraint; indexes; OpenAPI mapping; verification |
| `products` | UUID primary key; `workspace_id`; product display/business fields; SQL planning proposal status; archive field; timestamps; status filters; FK behavior; OpenAPI mapping; verification |
| `data_sources` | UUID primary key; `workspace_id`; type/provider/display fields; SQL planning proposal connection status; sync status; timestamps; indexes; delete/nullify expectations; OpenAPI mapping; verification |
| `channel_connections` | UUID primary key; `workspace_id`; optional `data_source_id`; provider/channel/display fields; SQL planning proposal connection status; capability metadata; timestamps; provider/account uniqueness decision; no credential fields; OpenAPI mapping; verification |
| `integration_credentials` | UUID primary key; `workspace_id`; optional channel connection FK; credential type; vault/reference field; no plaintext secret columns; archive/revoke field; audit requirement; indexes; OpenAPI mapping; verification |
| `assets` | UUID primary key; `workspace_id`; optional product/content item FKs; title/type/source; storage reference; SQL planning proposal status; archive field; timestamps; indexes; OpenAPI mapping; verification |
| `campaigns` | UUID primary key; `workspace_id`; optional primary product FK; display fields; OpenAPI-approved CampaignStatus; version field; archive field; timestamps; indexes; OpenAPI mapping; verification |
| `campaign_briefs` | UUID primary key; `workspace_id`; unique campaign FK; brief fields; timestamps; archive-with-campaign expectations; OpenAPI mapping; verification |
| `campaign_content_items` | UUID primary key; `workspace_id`; campaign FK; optional current draft FK; content type/channel; OpenAPI-approved CampaignContentItemStatus; version; archive field; timestamps; circular FK strategy; indexes; OpenAPI mapping; verification |
| `content_drafts` | UUID primary key; `workspace_id`; content item FK; creator user FK; body/language fields; version number; OpenAPI-approved ContentDraftStatus; resource version; archive field; timestamps; lifecycle indexes; OpenAPI mapping; verification |
| `content_approvals` | UUID primary key; `workspace_id`; content draft FK; reviewer user FK; OpenAPI-approved ContentApprovalDecision; note/rejection reason/required changes fields; decided timestamp; created-only audit field; immutability requirement; self-approval support; OpenAPI mapping; verification |
| `publishing_jobs` | UUID primary key; `workspace_id`; campaign/content/channel FKs; scheduled timestamp; OpenAPI-approved PublishingJobStatus; version field; cancel field; timestamps; queue indexes; OpenAPI mapping; verification |
| `publishing_statuses` | UUID primary key; `workspace_id`; publishing job FK; SQL planning proposal status trail field; status message; occurred timestamp; created-only audit field; append-only requirement; indexes; OpenAPI mapping; verification |
| `analytics_snapshots` | UUID primary key; `workspace_id`; OpenAPI-approved AnalyticsSnapshotStatus; subject type/id; metric JSON; source summary; snapshot time/period decision; created-only audit field; indexes; OpenAPI mapping; verification |
| `audit_events` | UUID primary key; `workspace_id`; actor user/member references; resource type/id; action; request/correlation id decision; safe metadata JSON; occurred/created timestamps; append-only requirement; indexes; no secrets; OpenAPI/RBAC mapping; verification |
| `idempotency_keys` | UUID primary key; `workspace_id`; operation family; actor/member reference; idempotency key; request hash; response status/body; SQL planning proposal status; expiry; created timestamp; uniqueness; cleanup/retention decision; OpenAPI header mapping; verification |
| `roles` | Reference key strategy; role code; display/description fields; global scope; seed/reference boundary; no seed file unless approved; RBAC mapping; verification |
| `permissions` | Reference key strategy; permission code; display/description fields; global scope; seed/reference boundary; no seed file unless approved; RBAC mapping; verification |
| `role_permissions` | Role/permission FK strategy; composite uniqueness or primary key; global scope; seed/reference boundary; no seed file unless approved; RBAC mapping; verification |

### Required authoring dimensions

For each table, future SQL authoring must explicitly cover:

- Primary key.
- Workspace/tenant boundary.
- Foreign keys.
- Nullable vs required fields.
- Server-owned fields.
- Status fields.
- Audit fields.
- Timestamps.
- Archive/delete fields.
- Metadata/JSON fields.
- Sensitive fields.
- Indexes.
- Uniqueness constraints.
- Check constraints or enum strategy.
- Cascade/restrict delete behavior.
- OpenAPI schema mapping.
- Verification requirement.

---

## 7. Status Enum Authoring Strategy

Future SQL authoring must follow these DDL decision rules.

| Rule | Requirement |
|---|---|
| OpenAPI-approved stable enums | PostgreSQL ENUM candidates; final DDL deferred |
| SQL-only/evolving proposal statuses | TEXT + CHECK candidates; final DDL deferred |
| Physical enum representation | Not approved until SQL Schema Authoring Gate |
| New enum values | Must not be introduced unless present in OpenAPI or approved planning docs |
| OpenAPI mismatch | NO-GO |
| SQL-only status approval | Requires SQL Schema Authoring Gate approval |
| Migration approval | No enum strategy in this planning gate approves executable migration work |

### OpenAPI-approved enum candidates

| Status source | Values / source | Future DDL strategy |
|---|---|---|
| `WorkspaceMember.status` | active, invited, suspended | PostgreSQL ENUM candidate; final DDL deferred |
| `AnalyticsSnapshot.status` | available, partial, stale, unavailable | PostgreSQL ENUM candidate; final DDL deferred |
| `CampaignStatus` | OpenAPI-approved values | PostgreSQL ENUM candidate; final DDL deferred |
| `ContentDraftStatus` | OpenAPI-approved values | PostgreSQL ENUM candidate; final DDL deferred |
| `CampaignContentItemStatus` | OpenAPI-approved values | PostgreSQL ENUM candidate; final DDL deferred |
| `PublishingJobStatus` | OpenAPI-approved values | PostgreSQL ENUM candidate; final DDL deferred |
| `ContentApprovalDecision` | approved, rejected; server-owned response decision | PostgreSQL ENUM candidate; final DDL deferred |

### SQL-only proposal status candidates

| Status source | Future DDL strategy |
|---|---|
| Workspace status | TEXT + CHECK candidate; final DDL deferred |
| User status | TEXT + CHECK candidate; final DDL deferred |
| Store profile status | TEXT + CHECK candidate; final DDL deferred |
| Product status | TEXT + CHECK candidate; final DDL deferred |
| Asset status | TEXT + CHECK candidate; final DDL deferred |
| Data source status | TEXT + CHECK candidate; final DDL deferred |
| Channel connection status | TEXT + CHECK candidate; final DDL deferred |
| Idempotency key status | TEXT + CHECK candidate; final DDL deferred |
| `publishing_statuses.status` | TEXT + CHECK or TEXT candidate; final DDL deferred |

---

## 8. Workspace Scoping and Tenancy Authoring Rules

| Rule | Future authoring requirement |
|---|---|
| Merchant-owned tables carry `workspace_id` | Required unless explicitly global |
| Global tables | Only `users` and approved reference tables may be global |
| Root table | `workspaces` is the tenant root |
| Cross-workspace linkage | Foreign keys must not permit linking records from different workspaces |
| Composite constraints | Required where simple FKs cannot guarantee same-workspace relationships |
| StoreProfile one-per-workspace | Unique workspace constraint must be planned |
| WorkspaceMember uniqueness | Unique user/workspace membership constraint must be planned |
| List queries | Must be indexable by `workspace_id` |
| Path scoping | `workspace_id` must be server/path-derived, never trusted from request body |
| Authorization binding | Workspace access must remain tied to active `workspace_members` rows |

### Composite constraint authoring candidates

| Relationship | Requirement |
|---|---|
| Workspace-owned child to parent | Authoring must prevent child and parent from different workspaces |
| CampaignContentItem to Campaign | Same-workspace linkage required |
| ContentDraft to CampaignContentItem | Same-workspace linkage required |
| ContentApproval to ContentDraft | Same-workspace linkage required |
| PublishingJob to Campaign/Content/Channel | Same-workspace linkage required |
| PublishingStatus to PublishingJob | Same-workspace linkage required |
| Asset to Product/ContentItem | Same-workspace linkage required |

---

## 9. Auth/RBAC Persistence Authoring Rules

| Area | Future authoring requirement |
|---|---|
| User global identity | `users` remains global and is not workspace-scoped |
| Workspace authorization binding | `workspace_members` links user, workspace, role, and member status |
| Role persistence | `roles`, `permissions`, and `role_permissions` remain reference/seed candidates until approved |
| Member status | active, invited, suspended is OpenAPI-approved |
| Access denial | invited and suspended members must not authorize workspace access |
| Platform admin confusion | Workspace roles must not imply platform/global admin behavior |
| Auth provider implementation | Not authorized by this gate |
| Permission expectations | Future DDL must support role/permission resolution before backend implementation depends on it |
| Audit | Member invite, activate, suspend, remove, and role-change operations require audit support |

No backend auth provider implementation is introduced or authorized here.

---

## 10. Credential Storage Authoring Rules

| Rule | Future DDL expectation |
|---|---|
| ChannelConnection credentials | Must not store raw credentials |
| IntegrationCredential boundary | Separates credential reference metadata from channel connection metadata |
| Reference field | Use a `credential_ref` / `vault_ref` style opaque reference field |
| Plaintext secrets | Forbidden in SQL |
| Encryption/vault provider | Deferred to Security Gate / implementation |
| Credential metadata | Authoring should evaluate provider, scopes, status, expiry, and last verified metadata |
| Credential indexes | Authoring should evaluate workspace/channel/status/expiry indexes |
| Credential mutations | Create, revoke, and rotate actions require audit support |
| API response safety | Raw secret values must not be returned or persisted outside the vault/reference boundary |

---

## 11. Content Approval and Lifecycle Authoring Rules

| Lifecycle support | Future authoring requirement |
|---|---|
| ContentDraft status | OpenAPI-approved ContentDraftStatus candidate |
| submit-review | Supports draft to ready_for_review transition |
| approve | Supports approved ContentApproval decision and draft/content item status update |
| reject | Supports rejected decision plus rejection reason and required changes |
| withdraw | Supports creator self-withdrawal transition |
| ContentApproval records | Immutable create-only records |
| Decision source | Server-derived from path/operation, not trusted from arbitrary client body |
| Rejection metadata | Must support `rejectionReason` / `requiredChanges` round-trip |
| Self-approval prevention | DDL should support identifying creator and reviewer; enforcement may be application-level |
| Creator self-withdrawal | DDL should support identifying creator; enforcement may be application-level |
| Resource version | Mutable lifecycle resources require version fields |
| Idempotency keys | Lifecycle POSTs require idempotency support before backend implementation |
| Audit | submit, approve, reject, and withdraw require audit support |

No lifecycle backend implementation is introduced or authorized here.

---

## 12. Idempotency and Optimistic Concurrency Authoring Rules

| Area | Future authoring requirement |
|---|---|
| `idempotency_keys` scope | In SQL authoring scope candidate because lifecycle POSTs require it |
| Candidate key scope | `workspace_id` plus operation family plus actor/member plus `idempotency_key` |
| Request hash | Candidate field for safe request replay matching |
| Response replay | Candidate response status/body fields for completed replay |
| Expiry/retention | Expiry timestamp and cleanup/retention policy must be planned |
| Idempotency status | SQL planning proposal status; TEXT + CHECK candidate |
| Resource version fields | Required for mutable resources with lifecycle or concurrency-sensitive updates |
| 409 conflicts | Stale version and in-progress idempotency handling must align with OpenAPI semantics |
| Backend implementation | Not authorized by this gate |

---

## 13. Audit Authoring Rules

| Audit requirement | Future DDL expectation |
|---|---|
| Append-only | `audit_events` must be planned as append-only |
| Workspace scope | `workspace_id` required where applicable |
| Actor references | Actor user and/or member context must be representable |
| Resource references | `resource_type` / `resource_id` or equivalent target fields required |
| Action | Action field required |
| Request correlation | `request_id` / `correlation_id` candidate must be evaluated |
| Metadata payload | Safe JSON metadata candidate |
| Secrets | No secrets, raw credentials, or vault secret values in audit payload |
| Indexing | Workspace/resource/action/time indexes required |
| Retention | Deferred to legal/compliance gate |
| Data residency | Deferred to legal/compliance gate |

---

## 14. Analytics Lineage Authoring Rules

| Analytics requirement | Future DDL expectation |
|---|---|
| `analytics_snapshots` lineage | `source_summary` / `sourceSummary` mapping must be preserved |
| JSON vs normalized | JSON metric payload remains candidate; normalization deferred |
| Snapshot period | Authoring must decide exact period/start/end fields if needed |
| Snapshot time | Snapshot timestamp required |
| Source references | Subject type/id and source summary required |
| Status | AnalyticsSnapshotStatus is OpenAPI-approved |
| Unavailable/stale reasons | Authoring must decide whether source summary is enough or separate reason fields are needed |
| Cross-workspace aggregation | Must not leak across workspaces |
| Production claims | Status and source summary must not imply production data readiness |

---

## 15. Index and Constraint Authoring Plan

| Category | Future authoring requirement |
|---|---|
| Workspace indexes | Required on workspace-scoped listable tables |
| Foreign key indexes | Required for major parent/child lookups |
| Status filters | Required for product, asset, campaign, content, publishing, member, and analytics filtering where applicable |
| `updated_at` filters | Evaluate for mutable resource lists and sync workflows |
| `created_at` ordering | Evaluate for chronological lists |
| Content review queues | Index by workspace/status/content item/creator as needed |
| Publishing queue | Index by workspace/status/campaign/scheduled time as needed |
| Analytics period | Index by workspace/subject/snapshot time or period |
| Audit queries | Index by workspace/resource/action/time |
| Uniqueness constraints | WorkspaceMember user/workspace, StoreProfile workspace, CampaignBrief campaign, idempotency key scope |
| Idempotency uniqueness | Unique workspace plus operation family plus actor/member plus idempotency key |
| Soft archive filters | Evaluate partial indexes or query filters for `archived_at IS NULL` where supported |
| Cross-workspace constraints | Add composite constraints where needed to prevent workspace leakage |

---

## 16. Delete / Archive Authoring Plan

| Rule | Future authoring requirement |
|---|---|
| Soft archive preferred | Use `archived_at` or equivalent for merchant-owned records that support archive |
| Hard delete | Deferred unless explicitly approved |
| `deleted_at` vs `archived_at` | Exact naming strategy deferred to SQL Schema Authoring Gate |
| Cascade behavior | Restrict/no cascade by default unless explicitly justified |
| Nullify behavior | May be used for optional metadata links where approved |
| Audit | Archive/delete/revoke/remove operations require audit support |
| Cross-workspace safety | Delete/archive operations must stay workspace-scoped |
| Append-only records | Audit events, content approvals, publishing statuses, and analytics snapshots should not be hard-deleted in V1 planning |

---

## 17. SQL Authoring File Strategy Proposal

No SQL files are created by this gate.

No migration files are created by this gate.

No repository SQL/migration convention is approved by this gate.

| Strategy item | Proposal / status |
|---|---|
| Future SQL file location | Deferred to SQL Schema Authoring Gate if no existing convention is present |
| Migration naming convention | Deferred to SQL Schema Authoring Gate |
| One large migration vs sequenced migrations | Prefer sequenced authoring by dependency group if migration framework supports it; final decision deferred |
| Schema-only vs seed split | Seed/reference data must be separated and not introduced unless approved |
| Rollback/up-down convention | Deferred to migration framework decision |
| SQL verification | Future authoring must verify parse and migration behavior if SQL is introduced |
| Review expectation | SQL Schema Authoring Review Gate must review file strategy and generated artifacts before backend implementation |

---

## 18. Verification Strategy for Future SQL Authoring

Future SQL Schema Authoring Gate must verify:

- SQL parses.
- Migrations run up and down if a migration framework exists.
- No runtime/backend code is introduced.
- No generated client is produced.
- OpenAPI-to-SQL mapping remains aligned.
- Workspace scoping constraints exist.
- Status enum values match OpenAPI and approved planning docs.
- SQL-only statuses remain approved planning values.
- No raw credential columns exist.
- Audit support is present.
- Idempotency support is present where lifecycle POSTs require it.
- Optimistic concurrency fields exist for mutable lifecycle resources.
- Cascade/restrict behavior is reviewed.
- Rollback strategy exists if migrations are introduced later.
- Verification commands are recorded in the future gate document.

---

## 19. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Premature DDL | HIGH | This gate forbids SQL files and migrations |
| Wrong enum physical representation | HIGH | Physical enum decisions deferred to SQL Schema Authoring Gate |
| Cross-workspace FK leakage | CRITICAL | Composite same-workspace constraints must be reviewed |
| Missing idempotency/concurrency tables | HIGH | `idempotency_keys` and version fields remain first-scope candidates |
| Credential leakage | CRITICAL | Raw credential columns are forbidden |
| Audit tampering | HIGH | Append-only design and future enforcement must be reviewed |
| Over-normalization | MEDIUM | Authoring should avoid unnecessary table complexity before query needs are known |
| JSON overuse | MEDIUM | Lifecycle/status fields must not hide in JSON |
| Migration framework decision missing | MEDIUM | File/migration strategy deferred but must be resolved before SQL authoring |
| Backend starting before SQL authoring review | HIGH | Backend Slice 1 remains unauthorized |
| Generated client before SQL/backend planning | HIGH | Generated clients remain unauthorized |
| Role/permission seed ambiguity | MEDIUM | Reference/seed tables are candidates only until authoring/review approval |
| Analytics reason-field ambiguity | LOW | SQL authoring must decide whether `source_summary` is enough |

---

## 20. GO / NO-GO Criteria

### GO criteria for SQL Schema Authoring Gate

| Criterion | Required status |
|---|---|
| Table authoring sequence approved | Required |
| Workspace scoping rules approved | Required |
| Enum strategy candidate rules approved | Required |
| Relationship/cascade rules approved | Required |
| Credential storage boundary approved | Required |
| Audit support planned | Required |
| Idempotency support planned | Required |
| Optimistic concurrency support planned | Required |
| File/migration strategy clarified or explicitly deferred | Required |
| No implementation added | Required |

### NO-GO conditions

| Condition | Result if present |
|---|---|
| SQL DDL added in this planning gate | NO-GO |
| Migrations added in this planning gate | NO-GO |
| ORM models added | NO-GO |
| Backend implementation added | NO-GO |
| API routes added | NO-GO |
| Package/runtime changes added | NO-GO |
| Credential storage ambiguity remains unaddressed | NO-GO |
| Workspace scoping ambiguity remains unaddressed | NO-GO |
| Enum strategy conflict with OpenAPI exists | NO-GO |
| Generated client introduced | NO-GO |
| UI changes introduced | NO-GO |
| Production/pilot readiness claimed | NO-GO |

---

## 21. Recommended Next Gate

Recommended next gate:

**Nashir SQL Schema Authoring Planning Review Gate.**

Only after this planning gate and its review gate merge should the project open
the Nashir SQL Schema Authoring Gate.

This planning gate does not authorize migrations.

This planning gate does not authorize SQL DDL.

This planning gate does not authorize backend implementation.

This planning gate does not authorize ORM models.

This planning gate does not authorize seed files.

This planning gate does not authorize generated clients.

This planning gate does not authorize production or pilot readiness.

---

## 22. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_schema_authoring_planning_gate.md` before commit; changes limited to the new planning document |
| `git diff --stat` | No tracked unstaged diff before staging; new document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged diff before staging; new document shown by `git status --short` |
| `wc -l docs/nashir_sql_schema_authoring_planning_gate.md` | 641 lines before verification-result update |
| BIDI scan on new/modified docs files | `docs/nashir_sql_schema_authoring_planning_gate.md: BIDI_CONTROL_CHARS none` |
| Forbidden-path changed-file search | **CONFIRMED NONE** - no SQL, migrations, schema, backend, generated, UI, package, or runtime files changed |

Expected result:

- Documentation-only.
- No SQL DDL.
- No migrations.
- No ORM models.
- No backend implementation.
- No generated client.
- No package/UI changes.
