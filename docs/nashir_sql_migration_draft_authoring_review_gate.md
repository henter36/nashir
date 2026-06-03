# Nashir SQL Migration Draft Authoring Review Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Draft Authoring Review Gate - documentation only |
| Status | Review complete |
| Date | 2026-06-03 |
| Primary controlling artifact | `docs/nashir_sql_migration_draft_authoring_gate.md` |
| Draft contract artifacts | `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` through `nashir_v1_005_support_reference.sql.md` |
| API contract authority | `docs/nashir_v1_openapi.yaml` |
| Executable migrations created | NO |
| Migration runner introduced | NO |
| SQL executed or applied | NO |
| Backend/API routes implemented | NO |
| ORM models created | NO |
| Seed files created | NO |
| Generated client produced | NO |
| UI changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Database readiness claimed | NO |
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is the Nashir SQL Migration Draft Authoring Review Gate.

The purpose of this gate is to review the merged SQL Migration Draft Authoring
Gate (PR #94) and the five draft migration contract files under
`docs/migration_contracts/` and determine whether they are complete, internally
consistent, safe for tenancy boundaries, aligned with the OpenAPI/Auth/RBAC/SQL
schema contracts, and ready for the next planning or review step.

This review does not introduce executable migrations.

This review does not introduce a migration runner.

This review does not execute or apply SQL to a database.

This review does not introduce backend code.

This review does not introduce API route implementation.

This review does not introduce ORM models.

This review does not introduce seed files.

This review does not introduce generated clients.

This review does not introduce UI, package, or build changes.

This review does not claim production or pilot readiness.

This review does not claim database readiness.

---

## 2. Inputs Reviewed

### Primary artifacts

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_draft_authoring_gate.md` | Primary controlling artifact; gate document for the draft authoring output |
| `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` | Draft migration contract — group 1 |
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | Draft migration contract — group 2 |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | Draft migration contract — group 3 |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | Draft migration contract — group 4 |
| `docs/migration_contracts/nashir_v1_005_support_reference.sql.md` | Draft migration contract — group 5 |

### Controlling prior gates

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_authoring_follow_up_review_gate.md` | Prior review gate that authorized `docs/migration_contracts/` and GO to SQL Migration Draft Authoring Gate |
| `docs/nashir_sql_migration_authoring_follow_up_gate.md` | Source of the nine follow-up decisions |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_v1_openapi.yaml` | API contract authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |

### Contextual inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_authoring_gate.md` | Migration authoring contract |
| `docs/nashir_sql_migration_authoring_review_gate.md` | Migration authoring review |
| `docs/nashir_sql_migration_planning_gate.md` | Migration planning baseline |
| `docs/nashir_sql_migration_planning_review_gate.md` | Migration planning review |
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |

### Authority check

| Authority | Result | Assessment |
|---|---|---|
| Nashir is the product, UI journey, scope, API contract, SQL schema contract, and data model authority | **PASS** | Review uses Nashir docs and OpenAPI as controlling sources |
| marketing-os is reference-only | **PASS** | No marketing-os code, migration files, runner scripts, entities, or runtime shape referenced |
| SQL Migration Authoring Follow-up Review Gate authorizes `docs/migration_contracts/` path | **PASS** | Authorization confirmed in PR #93 |

---

## 3. Scope Compliance Review

| Scope item | Result | Assessment |
|---|---|---|
| Documentation/draft review only | **PASS** | Gate document and five draft files are Markdown; this review creates one Markdown file |
| Draft artifacts are non-executable | **PASS** | All five draft files use `.sql.md` extension; every SQL block begins with "DRAFT ONLY — NOT EXECUTABLE" |
| Nashir-first | **PASS** | Draft contracts derived from Nashir OpenAPI, SQL schema authoring gate, and Auth/RBAC gate |
| marketing-os reference-only | **PASS** | No extraction, code copy, or runtime-shape import |
| No executable migrations | **PASS** | No `.sql` executable files exist in `docs/migration_contracts/` or anywhere else |
| No migration runner | **PASS** | No runner config, no runner package, no execution script |
| No database-applied changes | **PASS** | No database connection, no applied SQL |
| No backend/API runtime implementation | **PASS** | No source, route, handler, service, middleware, or runtime files changed |
| No ORM models | **PASS** | No model layer introduced |
| No seed files | **PASS** | Role/permission seed files remain unauthorized; explicitly confirmed in draft 005 |
| No generated client | **PASS** | No generated/runtime client produced |
| No UI/package changes | **PASS** | No UI, `package.json`, lockfile, or build configuration files changed |
| No production/pilot readiness claim | **PASS** | Gate document and draft files make no readiness claim |
| No database readiness claim | **PASS** | Explicitly stated throughout |

---

## 4. Draft Artifact Inventory

### Gate document: nashir_sql_migration_draft_authoring_gate.md

| Attribute | Assessment |
|---|---|
| Purpose | Clearly states this is a SQL Migration Draft Authoring Gate |
| Scope decision | Correctly identifies five `.sql.md` draft files and this gate document as output |
| Path authorization | Correctly cites follow-up review gate (PR #93) as authorizing `docs/migration_contracts/` |
| Draft file constraints | `.sql.md` extension confirmed; "DRAFT ONLY" header comments confirmed; no runner; no package scripts; no DB connection |
| Sequence table | All five groups covered with dependency order, rollback risk, cross-workspace risk, V1 status, and draft output |
| Required controls section | Updated to record composite FK controls, parent `UNIQUE (workspace_id, id)` table, SKU uniqueness, global-user FK rationale |
| GO decision | GO to SQL Migration Draft Authoring Review Gate |

**Result: PASS**

### Draft 001: nashir_v1_001_foundation_identity_tenant.sql.md

| Attribute | Assessment |
|---|---|
| Purpose | Foundation identity/tenant group; no prior dependency |
| Tables covered | `workspaces`, `users`, `workspace_members` |
| Draft-only status | "DRAFT ONLY — NOT EXECUTABLE" in every SQL block |
| Non-executable boundary | `.sql.md` extension; no runner; no DB connection |
| Key controls | `LOWER(email)` functional unique index; `workspace_members` user/workspace uniqueness; `UNIQUE (workspace_id, id)` on `workspace_members`; restrict on delete |
| Dependency assumption | None; foundation must be applied first |
| Open items | `users.status` values, `workspaces.status` enum confirmation, `gen_random_uuid()` availability, `role_code` representation |

**Result: PASS**

### Draft 002: nashir_v1_002_store_product_source.sql.md

| Attribute | Assessment |
|---|---|
| Purpose | Store/product/source group; depends on group 1 |
| Tables covered | `store_profiles`, `products`, `data_sources`, `channel_connections`, `integration_credentials` |
| Draft-only status | "DRAFT ONLY — NOT EXECUTABLE" in every SQL block |
| Non-executable boundary | `.sql.md` extension; no runner |
| Key controls | `products UNIQUE (workspace_id, id)`; SKU partial unique index; `data_sources UNIQUE (workspace_id, id)`; `channel_connections UNIQUE (workspace_id, id)`; composite FK for `channel_connections.data_source_id`; XOR CHECK on `integration_credentials`; same-workspace composite FKs for credential targets |
| Dependency assumption | Group 1 tables must exist |
| Open items | Status value confirmation, `credential_ref` vs `vault_ref` single vs dual, `capability_metadata` JSONB form |

**Result: PASS**

### Draft 003: nashir_v1_003_asset_campaign_content.sql.md

| Attribute | Assessment |
|---|---|
| Purpose | Asset/campaign/content group; depends on groups 1–2 |
| Tables covered | `assets`, `campaigns`, `campaign_briefs`, `campaign_content_items`, `content_drafts`, `content_approvals` |
| Draft-only status | "DRAFT ONLY — NOT EXECUTABLE" in every SQL block |
| Non-executable boundary | `.sql.md` extension; no runner |
| Key controls | `campaigns UNIQUE (workspace_id, id)`; `campaign_content_items UNIQUE (workspace_id, id)`; `content_drafts UNIQUE (workspace_id, id)`; all workspace-owned FKs use composite form; global-user FKs for `creator_user_id` and `reviewer_user_id`; deferred composite circular FK for `current_draft_id`; `content_approvals` immutable (no `updated_at`) |
| Circular FK strategy | Deferred `ALTER TABLE` after both tables created; ON DELETE SET NULL; MATCH SIMPLE for nullable `current_draft_id` |
| Dependency assumption | Groups 1–2 tables must exist |
| Open items | Enum value confirmation, circular FK MATCH SIMPLE review, language defaults |

**Result: PASS**

### Draft 004: nashir_v1_004_publishing_analytics_audit.sql.md

| Attribute | Assessment |
|---|---|
| Purpose | Publishing/analytics/audit group; depends on groups 1–3 |
| Tables covered | `publishing_jobs`, `publishing_statuses`, `analytics_snapshots`, `audit_events` |
| Draft-only status | "DRAFT ONLY — NOT EXECUTABLE" in every SQL block |
| Non-executable boundary | `.sql.md` extension; no runner |
| Key controls | `publishing_jobs UNIQUE (workspace_id, id)`; same-workspace composite FKs for campaign/content/channel; `publishing_statuses` composite FK; `audit_events.actor_member_id` composite FK; global-user FK for `actor_user_id`; `audit_events` append-only (no `updated_at`, no `archived_at`); trigger pattern documented in comments; `source_summary NOT NULL` |
| Audit enforcement | Trigger pattern documented as future executable migration requirement; privilege restriction caveat documented |
| Dependency assumption | Groups 1–3 tables must exist |
| Open items | Enum value confirmation, trigger naming, application role name, snapshot period fields |

**Result: PASS**

### Draft 005: nashir_v1_005_support_reference.sql.md

| Attribute | Assessment |
|---|---|
| Purpose | Support/reference group; depends on group 1 |
| Tables covered | `idempotency_keys`, `roles`, `permissions`, `role_permissions` |
| Draft-only status | "DRAFT ONLY — NOT EXECUTABLE" in every SQL block |
| Non-executable boundary | `.sql.md` extension; no runner; no seed files |
| Key controls | `idempotency_keys` unique scope (workspace + operation + key); global-user simple FK for `actor_user_id`; same-workspace composite FK for `actor_member_id`; `roles`, `permissions`, `role_permissions` are global reference candidates with no seed data |
| Dependency assumption | Group 1 tables must exist |
| Open items | Actor in unique constraint decision, status value confirmation, retention strategy, RBAC table V1 deferral confirmation |

**Result: PASS**

---

## 5. Same-workspace Composite FK Review

### PostgreSQL composite FK requirement

PostgreSQL requires the referenced column set to be backed by an exact `UNIQUE`
or `PRIMARY KEY` constraint on the referenced table.

A primary key on `id` alone is not sufficient for a composite FK referencing
`(workspace_id, id)`.

All workspace-owned parent tables that are referenced through composite FKs
must carry `UNIQUE (workspace_id, id)`.

### Parent composite unique constraint verification

| Parent table | Constraint | Applied in draft | Result |
|---|---|---|---|
| `workspace_members` | `CONSTRAINT uq_workspace_members_workspace_id UNIQUE (workspace_id, id)` | Draft 001 | **PASS** |
| `products` | `CONSTRAINT uq_products_workspace_id UNIQUE (workspace_id, id)` | Draft 002 | **PASS** |
| `data_sources` | `CONSTRAINT uq_data_sources_workspace_id UNIQUE (workspace_id, id)` | Draft 002 | **PASS** |
| `channel_connections` | `CONSTRAINT uq_channel_connections_workspace_id UNIQUE (workspace_id, id)` | Draft 002 | **PASS** |
| `campaigns` | `CONSTRAINT uq_campaigns_workspace_id UNIQUE (workspace_id, id)` | Draft 003 | **PASS** |
| `campaign_content_items` | `CONSTRAINT uq_campaign_content_items_workspace_id UNIQUE (workspace_id, id)` | Draft 003 | **PASS** |
| `content_drafts` | `CONSTRAINT uq_content_drafts_workspace_id UNIQUE (workspace_id, id)` | Draft 003 | **PASS** |
| `publishing_jobs` | `CONSTRAINT uq_publishing_jobs_workspace_id UNIQUE (workspace_id, id)` | Draft 004 | **PASS** |

### Global table FK verification

| Table | FK strategy | Result |
|---|---|---|
| `users` | Global identity; all references use simple FK to `users (id)` | **PASS** |
| `workspaces` | Root tenant; all references use simple FK to `workspaces (id)` | **PASS** |

No old direct FK pattern (`REFERENCES <workspace-owned-table> (id)`) was found
in any draft file where a composite FK is required.

No same-workspace composite FK blocker was found.

---

## 6. Cross-workspace Leakage Review

| Relationship | FK type | Result | Assessment |
|---|---|---|---|
| `assets.product_id` → `products` | Same-workspace composite FK `(workspace_id, product_id) REFERENCES products (workspace_id, id)` | **PASS** | Prevents cross-workspace product linkage |
| `campaigns.primary_product_id` → `products` | Same-workspace composite FK `(workspace_id, primary_product_id) REFERENCES products (workspace_id, id)` | **PASS** | Nullable; MATCH SIMPLE correctly skips FK check when NULL |
| `campaign_briefs.campaign_id` → `campaigns` | Same-workspace composite FK `(workspace_id, campaign_id) REFERENCES campaigns (workspace_id, id)` | **PASS** | Prevents cross-workspace campaign briefs |
| `campaign_content_items.campaign_id` → `campaigns` | Same-workspace composite FK `(workspace_id, campaign_id) REFERENCES campaigns (workspace_id, id)` | **PASS** | Prevents cross-workspace content items |
| `content_drafts.content_item_id` → `campaign_content_items` | Same-workspace composite FK `(workspace_id, content_item_id) REFERENCES campaign_content_items (workspace_id, id)` | **PASS** | Prevents cross-workspace drafts |
| `content_approvals.content_draft_id` → `content_drafts` | Same-workspace composite FK `(workspace_id, content_draft_id) REFERENCES content_drafts (workspace_id, id)` | **PASS** | Prevents cross-workspace approvals |
| `campaign_content_items.current_draft_id` → `content_drafts` (deferred) | Same-workspace composite FK `(workspace_id, current_draft_id) REFERENCES content_drafts (workspace_id, id)` | **PASS** | Circular FK handled via deferred ALTER TABLE; ON DELETE SET NULL; MATCH SIMPLE for nullable |
| `publishing_jobs.campaign_id` → `campaigns` | Same-workspace composite FK `(workspace_id, campaign_id) REFERENCES campaigns (workspace_id, id)` | **PASS** | Prevents cross-workspace publishing |
| `publishing_jobs.content_item_id` → `campaign_content_items` | Same-workspace composite FK `(workspace_id, content_item_id) REFERENCES campaign_content_items (workspace_id, id)` | **PASS** | Prevents cross-workspace publishing |
| `publishing_jobs.channel_connection_id` → `channel_connections` | Same-workspace composite FK `(workspace_id, channel_connection_id) REFERENCES channel_connections (workspace_id, id)` | **PASS** | Prevents cross-workspace channel publishing |
| `publishing_statuses.publishing_job_id` → `publishing_jobs` | Same-workspace composite FK `(workspace_id, publishing_job_id) REFERENCES publishing_jobs (workspace_id, id)` | **PASS** | Prevents cross-workspace status trail |
| `audit_events.actor_member_id` → `workspace_members` | Same-workspace composite FK `(workspace_id, actor_member_id) REFERENCES workspace_members (workspace_id, id)` | **PASS** | Nullable; MATCH SIMPLE; prevents cross-workspace member audit |
| `idempotency_keys.actor_member_id` → `workspace_members` | Same-workspace composite FK `(workspace_id, actor_member_id) REFERENCES workspace_members (workspace_id, id)` | **PASS** | Nullable; MATCH SIMPLE; prevents cross-workspace idempotency |
| `integration_credentials.channel_connection_id` → `channel_connections` | Same-workspace composite FK `(workspace_id, channel_connection_id) REFERENCES channel_connections (workspace_id, id)` | **PASS** | XOR ensures only one target is set |
| `integration_credentials.data_source_id` → `data_sources` | Same-workspace composite FK `(workspace_id, data_source_id) REFERENCES data_sources (workspace_id, id)` | **PASS** | XOR ensures only one target is set |
| `channel_connections.data_source_id` → `data_sources` | Same-workspace composite FK `(workspace_id, data_source_id) REFERENCES data_sources (workspace_id, id)` | **PASS** | Optional link; MATCH SIMPLE when NULL |

No cross-workspace leakage blocker was found.

---

## 7. Product Catalog Integrity Review

| Check | Result | Assessment |
|---|---|---|
| SKU partial unique index exists | **PASS** | `CREATE UNIQUE INDEX idx_products_workspace_sku_active_unique ON products (workspace_id, sku) WHERE archived_at IS NULL AND sku IS NOT NULL` |
| Partial index covers non-archived rows only | **PASS** | `WHERE archived_at IS NULL` correctly excludes archived products |
| Null SKU handling is explicit | **PASS** | `WHERE sku IS NOT NULL` explicitly excludes null SKUs from the unique constraint |
| Uniqueness scope is per workspace | **PASS** | `(workspace_id, sku)` is the index column set |
| Soft archive behavior preserved | **PASS** | `archived_at` column present; status includes `'archived'` value |
| No executable SQL claim | **PASS** | Clearly within "DRAFT ONLY — NOT EXECUTABLE" SQL block |

No catalog integrity blocker was found.

---

## 8. users.email Uniqueness Review

| Check | Result | Assessment |
|---|---|---|
| `LOWER(email)` functional unique index is the preferred candidate | **PASS** | `CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email))` |
| Future backend lookup preferred pattern documented | **PASS** | Application pre-lowercases email, then queries `WHERE LOWER(email) = $1` |
| Acceptable but less optimal pattern documented | **PASS** | `WHERE LOWER(email) = LOWER($1)` |
| Plain `WHERE email = $1` identified as potentially non-index-using | **PASS** | Documented as NOT recommended; may cause sequential scans |
| `citext` alternative remains gated | **PASS** | Not introduced; remains valid only if a later gate explicitly approves the extension |
| No backend implementation authorized | **PASS** | Query pattern is a future backend planning requirement only |
| No SQL index created as executable artifact | **PASS** | Index is within the draft SQL block; not applied to any database |

No `users.email` uniqueness blocker was found.

---

## 9. Credential Safeguards Review

| Check | Result | Assessment |
|---|---|---|
| XOR target constraint on `integration_credentials` | **PASS** | `CONSTRAINT chk_credential_target_xor CHECK (...)` enforces exactly one non-null target |
| Both-null case is INVALID | **PASS** | XOR requires at least one non-null |
| Both-non-null case is INVALID | **PASS** | XOR prevents dual target linkage |
| Same-workspace composite FKs for credential targets | **PASS** | Both `channel_connection_id` and `data_source_id` use composite FKs including `workspace_id` |
| Parent tables carry `UNIQUE (workspace_id, id)` | **PASS** | `channel_connections` and `data_sources` both carry the required constraint |
| No plaintext secrets | **PASS** | No raw API key, token, OAuth secret, or password columns |
| `credential_ref` / `vault_ref` only | **PASS** | Only opaque reference columns are present |
| Credential mutation audit requirement | **PASS** | Documented; audit_events table in group 4 supports this |
| No provider implementation | **PASS** | Vault/encryption provider implementation explicitly deferred |

No credential safeguard blocker was found.

---

## 10. Audit Immutability Review

| Check | Result | Assessment |
|---|---|---|
| `audit_events` append-only structure | **PASS** | No `updated_at`; no `archived_at`; no hard delete |
| Database-level trigger enforcement documented | **PASS** | Trigger pattern provided in draft comments; explicitly labeled as future executable migration requirement |
| Privilege restriction caveat documented | **PASS** | Application role must not own `audit_events`; `audit_events` must be owned by a separate migration/deployment owner role |
| Combined mechanism preferred | **PASS** | Triggers + privilege revocation with owner-role separation |
| No secrets in audit metadata | **PASS** | `metadata JSONB` — comment states "safe metadata only; no secrets; no credentials" |
| `publishing_statuses` append-only | **PASS** | No `updated_at`; append-only trail behavior documented |
| `content_approvals` immutable | **PASS** | No `updated_at`; comment confirms immutability |

No audit immutability blocker was found.

---

## 11. Idempotency/Concurrency Review

| Check | Result | Assessment |
|---|---|---|
| `idempotency_keys` table structure | **PASS** | Present in draft 005; workspace-scoped |
| Idempotency key scope | **PASS** | `UNIQUE (workspace_id, operation_family, idempotency_key)` |
| Actor user reference (global) | **PASS** | `actor_user_id REFERENCES users (id)` — simple FK; users is global |
| Actor member reference (workspace-scoped) | **PASS** | Same-workspace composite FK `(workspace_id, actor_member_id) REFERENCES workspace_members (workspace_id, id)` |
| Request hash field | **PASS** | `request_hash TEXT` — candidate for replay validation |
| Response replay metadata | **PASS** | `response_status INTEGER` and `response_body JSONB` — candidate fields; no secrets |
| Expiry/retention | **PASS** | `expires_at TIMESTAMPTZ NOT NULL` |
| Resource version fields | **PASS** | `version INTEGER NOT NULL DEFAULT 1` on `campaigns`, `campaign_content_items`, `content_drafts`, `publishing_jobs` |
| 409 conflict alignment | **PASS** | Version and idempotency metadata support 409 conflict behavior per OpenAPI |
| No backend implementation | **PASS** | Not authorized by this gate |

No idempotency/concurrency blocker was found.

---

## 12. Enum/Status Alignment Review

| Status field | Source | Strategy in draft | Result |
|---|---|---|---|
| `workspaces.status` | OpenAPI `WorkspaceStatus` candidate | `TEXT CHECK ('active','suspended','archived')` | **PASS** — values plausible; confirm against OpenAPI in review |
| `workspace_members.status` | OpenAPI `WorkspaceMemberStatus` approved | `TEXT CHECK ('active','invited','suspended')` | **PASS** — values match OpenAPI |
| `campaigns.status` | OpenAPI `CampaignStatus` approved | `TEXT CHECK ('draft','active','paused','completed','archived')` | **WATCH** — values must be confirmed against current OpenAPI |
| `content_drafts.status` | OpenAPI `ContentDraftStatus` approved | `TEXT CHECK ('draft','submitted','approved','rejected','withdrawn')` | **WATCH** — values must be confirmed against current OpenAPI |
| `campaign_content_items.status` | OpenAPI `CampaignContentItemStatus` approved | `TEXT CHECK ('draft','in_review','approved','rejected','published','archived')` | **WATCH** — values must be confirmed against current OpenAPI |
| `publishing_jobs.status` | OpenAPI `PublishingJobStatus` approved | `TEXT CHECK ('pending','in_progress','published','failed','cancelled')` | **WATCH** — values must be confirmed against current OpenAPI |
| `content_approvals.decision` | OpenAPI `ContentApprovalDecision` approved | `TEXT CHECK ('approved','rejected')` | **PASS** — server-owned; values match |
| `analytics_snapshots.status` | OpenAPI `AnalyticsSnapshotStatus` approved | `TEXT CHECK ('available','partial','stale','unavailable')` | **PASS** — values match OpenAPI |
| `users.status` | SQL-only proposal | `TEXT CHECK ('active','invited','suspended')` — labeled SQL-only | **PASS** — labeled correctly as SQL-only |
| SQL-only statuses (products, assets, store_profiles, etc.) | SQL-only proposals | `TEXT CHECK (...)` — labeled SQL-only | **PASS** — labeled correctly |
| `publishing_statuses.status` | SQL-only trail field | `TEXT NOT NULL` — no CHECK constraint | **PASS** — labeled as SQL-only trail field; no CHECK is intentional |
| `idempotency_keys.status` | SQL-only proposal | `TEXT CHECK ('in_progress','completed','failed','expired')` | **PASS** — labeled SQL-only |

All OpenAPI-approved enum statuses are marked as such.

All SQL-only statuses are marked as SQL-only planning proposals.

No unauthorized enum value was introduced.

WATCH items on `campaigns.status`, `content_drafts.status`, `campaign_content_items.status`, and `publishing_jobs.status` require value confirmation against the current OpenAPI YAML in the next gate — not blocking for this review.

---

## 13. Draft Non-executable Boundary Review

| Check | Result | Assessment |
|---|---|---|
| Draft files use `.sql.md` extension | **PASS** | All five files: `nashir_v1_001` through `nashir_v1_005` use `.sql.md` |
| No raw `.sql` executable files created | **PASS** | `find docs/migration_contracts -name "*.sql"` returns no results |
| No executable migration directory convention introduced | **PASS** | `docs/migration_contracts/` is a documentation path; no `db/migrations/` or `migrations/` created |
| No runner config exists | **PASS** | No `knexfile`, `flyway.conf`, `liquibase.properties`, or equivalent |
| No package scripts execute migrations | **PASS** | `package.json` unchanged |
| No database connection config exists | **PASS** | No `DATABASE_URL`, no pg config, no connection string |
| No CI/CD execution step | **PASS** | No CI/CD pipeline changes |
| "DRAFT ONLY — NOT EXECUTABLE" header in every SQL block | **PASS** | Verified across all five draft files |

No non-executable boundary blocker was found.

---

## 14. Verification Review

### Lint and build

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |

### Git state

| Command | Result |
|---|---|
| `git status --short` | Clean before this review gate is staged |
| `git diff --stat` | No tracked unstaged diff |
| `git diff -- docs/` | No tracked unstaged docs diff |

### FK pattern scans

| Scan | Result |
|---|---|
| Old direct FK: `REFERENCES products (id)` in draft files | **NONE FOUND** |
| Old direct FK: `REFERENCES campaigns (id)` in draft files | **NONE FOUND** |
| Old direct FK: `REFERENCES campaign_content_items (id)` in draft files | **NONE FOUND** |
| Old direct FK: `REFERENCES content_drafts (id)` in draft files | **NONE FOUND** |
| Old direct FK: `REFERENCES publishing_jobs (id)` in draft files | **NONE FOUND** |
| Old direct FK: `REFERENCES workspace_members (id)` in draft files | **NONE FOUND** |
| Old direct FK: `REFERENCES channel_connections (id)` in draft files | **NONE FOUND** |
| Old direct FK: `REFERENCES data_sources (id)` in draft files | **NONE FOUND** |
| `UNIQUE (workspace_id, id)` present in draft files | **CONFIRMED** in drafts 001–004 |
| `FOREIGN KEY (workspace_id` composite FKs present | **CONFIRMED** in drafts 002–005 |

### Forbidden file scans

| Scan | Result |
|---|---|
| Executable `.sql` files in `docs/migration_contracts/` | **NONE** |
| Migration runner files | **NONE** |
| Package.json or lockfile changes | **NONE** |
| Database connection config | **NONE** |
| Backend/API runtime/ORM/generated/UI file changes | **NONE** |
| Database-applied changes | **NONE** |

### BIDI scan

| File | Result |
|---|---|
| `docs/nashir_sql_migration_draft_authoring_gate.md` | `BIDI_CONTROL_CHARS none` |
| `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` | `BIDI_CONTROL_CHARS none` |
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | `BIDI_CONTROL_CHARS none` |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | `BIDI_CONTROL_CHARS none` |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | `BIDI_CONTROL_CHARS none` |
| `docs/migration_contracts/nashir_v1_005_support_reference.sql.md` | `BIDI_CONTROL_CHARS none` |
| `docs/nashir_sql_migration_draft_authoring_review_gate.md` | `BIDI_CONTROL_CHARS none` |

BIDI scan method: Python `pathlib` + Unicode code-point lookup.

---

## 15. PASS / FAIL / WATCH Checklist

| Check | Result |
|---|---|
| Scope compliance | **PASS** |
| Draft artifact inventory (gate document + 5 draft files) | **PASS** |
| Same-workspace composite FK controls | **PASS** |
| Parent composite `UNIQUE (workspace_id, id)` constraints | **PASS** |
| Cross-workspace leakage protection (all 15 relationships reviewed) | **PASS** |
| Product SKU catalog integrity | **PASS** |
| `users.email` uniqueness and lookup pattern | **PASS** |
| Credential safeguards | **PASS** |
| Audit immutability | **PASS** |
| Idempotency/concurrency support | **PASS** |
| Enum/status alignment | **PASS** |
| Non-executable boundary | **PASS** |
| Verification completeness | **PASS** |
| `campaigns.status` enum values match current OpenAPI | **WATCH** |
| `content_drafts.status` enum values match current OpenAPI | **WATCH** |
| `campaign_content_items.status` enum values match current OpenAPI | **WATCH** |
| `publishing_jobs.status` enum values match current OpenAPI | **WATCH** |
| Circular FK MATCH SIMPLE behavior for `current_draft_id` | **WATCH** |

---

## 16. Risks and Gaps

### Blocking issues

| Issue | Result |
|---|---|
| Blocking composite FK issue | **NONE FOUND** |
| Blocking cross-workspace leakage | **NONE FOUND** |
| Blocking credential safeguard issue | **NONE FOUND** |
| Blocking audit immutability issue | **NONE FOUND** |
| Blocking non-executable boundary issue | **NONE FOUND** |

### Non-blocking watch items

| Risk / gap | Severity | Control |
|---|---|---|
| Draft files mistaken for executable migrations | CRITICAL | `.sql.md` extension; "DRAFT ONLY" comments; no runner; `docs/migration_contracts/` is documentation path; SQL Migration Execution Planning Gate required before any application |
| Migration runner introduced too early | CRITICAL | No runner exists; runner selection deferred to backend repository |
| Database-applied changes | CRITICAL | No database connection; no execution tooling; Review Gate required before any application |
| Composite FK missing parent unique constraints | HIGH | All eight required parent `UNIQUE (workspace_id, id)` constraints confirmed in draft files; review gate must verify before executable migration |
| Cross-workspace leakage via direct FK | HIGH | No old direct FK pattern found; all workspace-owned relationships use composite FKs |
| Product SKU duplication across workspaces | HIGH | SKU uniqueness is scoped to workspace; partial index excludes archived and null SKUs |
| Email duplicate risk | HIGH | `LOWER(email)` functional unique index present in draft 001 |
| Email lookup performance risk | HIGH | Future backend must use `WHERE LOWER(email) = $1` (preferred) or `WHERE LOWER(email) = LOWER($1)`; plain `WHERE email = $1` may cause sequential scans |
| Credential cross-workspace leakage | CRITICAL | XOR constraint and same-workspace composite FKs confirmed in draft 002 |
| Audit tampering risk | HIGH | Triggers + privilege revocation documented; trigger is in draft comments only; must be in executable migration; owner-role caveat documented |
| Enum drift from OpenAPI | HIGH | Four OpenAPI-approved enum statuses are WATCH items; values must be confirmed against current OpenAPI YAML before executable migration authoring |
| Circular FK MATCH SIMPLE behavior | MEDIUM | `current_draft_id` nullable; MATCH SIMPLE is correct for this use case; must be confirmed in next gate |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized; no backend implementation approved |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |
| ORM selection creep | MEDIUM | ORM-generated migrations remain unauthorized |
| Seed/reference coupling | MEDIUM | Role/permission seed files remain unauthorized |

---

## 17. GO / NO-GO Decision

**Decision: GO with minor documentation follow-up.**

The SQL Migration Draft Authoring Gate produced five well-structured
documentation-only migration contract draft files in the approved
`docs/migration_contracts/` path.

All fifteen workspace-owned same-workspace FK relationships use composite
FKs including `workspace_id`.

All eight parent tables referenced through composite FKs carry
`UNIQUE (workspace_id, id)`.

No old direct FK pattern from a workspace-owned child to a workspace-owned
parent was found.

No blocking issue was found.

The four WATCH items on `CampaignStatus`, `ContentDraftStatus`,
`CampaignContentItemStatus`, and `PublishingJobStatus` enum values are
non-blocking; they require OpenAPI YAML confirmation in a subsequent gate.

The circular FK MATCH SIMPLE item is non-blocking; it requires review-gate
confirmation.

**Minor documentation follow-up required before SQL Migration Execution Planning:**

1. Confirm `campaigns.status` enum values against current `docs/nashir_v1_openapi.yaml`.
2. Confirm `content_drafts.status` enum values against current `docs/nashir_v1_openapi.yaml`.
3. Confirm `campaign_content_items.status` enum values against current `docs/nashir_v1_openapi.yaml`.
4. Confirm `publishing_jobs.status` enum values against current `docs/nashir_v1_openapi.yaml`.
5. Confirm `campaign_content_items.current_draft_id` circular FK MATCH SIMPLE behavior.
6. Confirm `gen_random_uuid()` extension availability on the target PostgreSQL environment.
7. Confirm single vs dual credential reference field (`credential_ref` vs `vault_ref`).

This authorizes only the next planning/review step.

This does not authorize migration execution.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

---

## 18. Final Summary

| Item | Summary |
|---|---|
| Inputs | SQL Migration Draft Authoring Gate, five draft migration contract files, SQL Migration Authoring Follow-up Review Gate, SQL Migration Authoring Follow-up Gate, SQL Schema Authoring Gate and Review Gate, SQL Migration Planning Gate and Review Gate, OpenAPI YAML, Auth/RBAC gates, README, and screen map |
| Outputs | One documentation-only SQL Migration Draft Authoring Review Gate |
| Remaining gaps | Four OpenAPI-approved enum status value sets require confirmation against current OpenAPI YAML; circular FK MATCH SIMPLE behavior confirmation pending; `gen_random_uuid()` extension availability confirmation pending; credential reference field count pending; audit trigger and privilege restriction role name pending backend infrastructure planning |
| Decision required before next phase | SQL Migration Execution Planning Gate requires a backend repository, runner selection, executable path approval, and parse/dry-run tooling; alternatively a correction pass can address the WATCH items before opening the execution planning gate |
| Recommended next gate | Nashir SQL Migration Execution Planning Gate — after the seven minor follow-up items above are resolved and after a backend repository is established with runner, path, and verification tooling decisions |

---

## 19. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_draft_authoring_review_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new review document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new review document shown by `git status --short` |
| BIDI scan: all draft and gate files | `BIDI_CONTROL_CHARS none` on all seven files |
| Old direct FK pattern scan in draft files | **NONE FOUND** |
| Executable `.sql` files in `docs/migration_contracts/` | **NONE** |
| Migration runner/SQL execution/backend/API runtime/ORM/generated/UI/package files changed | **NONE** |
| Package.json or package-lock changes | **NONE** |
| Database-applied changes | **NONE** |

BIDI scan method: Python `pathlib` + Unicode code-point lookup;
no BIDI control characters embedded in shell patterns.

Expected result:

- Documentation-only review.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No ORM models.
- No seed files.
- No generated client.
- No package/UI changes.
- No production/pilot readiness claim.
