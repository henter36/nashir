# Nashir SQL Migration Draft Authoring Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Draft Authoring Gate - draft artifacts under approved constraints |
| Status | Draft authoring complete |
| Date | 2026-06-03 |
| Controlling prior review | `docs/nashir_sql_migration_authoring_follow_up_review_gate.md` |
| Controlling decision source | `docs/nashir_sql_migration_authoring_follow_up_gate.md` |
| Draft output scope | Documentation-only migration contract drafts in `docs/migration_contracts/` |
| Draft path authorization | Authorized by SQL Migration Authoring Follow-up Review Gate (PR #93) |
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

This is the Nashir SQL Migration Draft Authoring Gate.

This gate authors documentation-only migration contract draft files in the
approved path `docs/migration_contracts/` under the constraints established by
all prior gates.

This gate does not authorize migration execution.

This gate does not introduce a migration runner.

This gate does not execute or apply SQL to a database.

This gate does not introduce backend code.

This gate does not introduce API route implementation.

This gate does not introduce ORM models.

This gate does not introduce seed files.

This gate does not introduce generated clients.

This gate does not introduce UI, package, or build changes.

This gate does not claim production or pilot readiness.

This gate does not claim database readiness.

SQL Migration Draft Authoring Review Gate is required before any later
execution planning, migration runner setup, backend implementation, ORM models,
generated clients, or production readiness work.

---

## 2. Inputs Reviewed

### Controlling inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_authoring_follow_up_review_gate.md` | Controlling prior review; authorizes `docs/migration_contracts/` path and GO to this gate |
| `docs/nashir_sql_migration_authoring_follow_up_gate.md` | Controlling decision source for the nine follow-up items |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_v1_openapi.yaml` | API contract authority |

### Direct inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_authoring_gate.md` | Migration authoring contract and sequence authority |
| `docs/nashir_sql_migration_authoring_review_gate.md` | Review confirming authoring gate output |
| `docs/nashir_sql_migration_planning_gate.md` | Migration planning scope, file strategy, sequence, and safety rules |
| `docs/nashir_sql_migration_planning_review_gate.md` | Migration planning review confirmation |
| `docs/nashir_sql_schema_planning_gate.md` | Persistence planning baseline |
| `docs/nashir_sql_schema_planning_review_gate.md` | Persistence planning review baseline |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |
| ERD/Data Model Gate and Review Gate | Entity and relationship source |
| Backend/API Strategy Gate and Review Gate | Backend/API strategy context |

### Authority boundaries

| Boundary | Result |
|---|---|
| Nashir is the product, UI journey, scope, API contract, SQL schema contract, and data model authority | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |
| No marketing-os code, migration files, runner scripts, entities, backend shape, runtime assumptions, or journey are copied | **CONFIRMED** |

---

## 3. Scope Decision

This gate creates:

1. **Five documentation-only migration contract draft files** in `docs/migration_contracts/`.
2. **This gate document** (`docs/nashir_sql_migration_draft_authoring_gate.md`).

### Draft file path authorization

The path `docs/migration_contracts/` was authorized by the SQL Migration
Authoring Follow-up Review Gate (PR #93, commit `21244d0`).

Citation from the follow-up review gate:

> This review gate authorizes the `docs/migration_contracts/` path for
> documentation-only migration contract draft files in a subsequent SQL
> Migration Draft Authoring Gate.
>
> Files in that path must remain:
> - Non-executable in this repository.
> - Not applied to any database.
> - Subject to individual file-level review.

### Draft files created

| File | Sequence group | Status |
|---|---|---|
| `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` | 1 — Foundation identity/tenant | Draft complete |
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | 2 — Store/product/source | Draft complete |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | 3 — Asset/campaign/content | Draft complete |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | 4 — Publishing/analytics/audit | Draft complete |
| `docs/migration_contracts/nashir_v1_005_support_reference.sql.md` | 5 — Support/reference | Draft complete |

### Draft file constraints confirmed

- Draft files use the `.sql.md` extension to make clear they are Markdown
  documents containing SQL draft text, not executable `.sql` files.
- No migration runner exists in this repository.
- No package scripts execute migrations.
- No database connection exists in this repository.
- No CI/CD migration execution is configured.
- Draft files are not applied to any database.
- SQL Migration Draft Authoring Review Gate is required before any executable
  migration or runtime work proceeds.

---

## 4. Draft File Boundary

| Boundary item | Decision |
|---|---|
| Draft file extension | `.sql.md` — Markdown containing SQL draft text; not a raw `.sql` file |
| Draft file location | `docs/migration_contracts/` — approved documentation-only path |
| Naming convention | `nashir_v1_NNN_<short_description>.sql.md` for this gate; future executable files use `YYYYMMDDHHMM__nashir_v1_NNN_<short_description>.sql` |
| Up/down sections | Included as draft SQL text within Markdown code blocks; not executable |
| Rollback documentation | Included as draft DOWN section with rollback notes; not executed |
| Distinction from executable migrations | `.sql.md` extension; "DRAFT ONLY — NOT EXECUTABLE" header comment in every SQL block; no runner config; no package script |
| No runner wiring | Confirmed — no runner exists or is configured |
| No package scripts | Confirmed — no `package.json` migration scripts added |
| No database connection | Confirmed — no connection config added |

---

## 5. Migration Draft Sequence

| Sequence group | Tables | Dependency order | Rollback risk | Cross-workspace constraint risk | V1 required | Included in draft output |
|---|---|---|---|---|---|---|
| 1. Foundation identity/tenant | `workspaces`, `users`, `workspace_members` | First; no prior dependency | HIGH — all downstream tables depend on these FKs | WorkspaceMember user/workspace uniqueness; membership status | V1 required | YES — `nashir_v1_001` |
| 2. Store/product/source | `store_profiles`, `products`, `data_sources`, `channel_connections`, `integration_credentials` | After group 1 | MEDIUM — credential target rollback requires care | Same-workspace FKs for source/channel/credential; XOR constraint; composite unique constraints on referenced parents | V1 required; provider implementation deferred | YES — `nashir_v1_002` |
| 3. Asset/campaign/content | `assets`, `campaigns`, `campaign_briefs`, `campaign_content_items`, `content_drafts`, `content_approvals` | After groups 1–2 | HIGH — content lifecycle FKs; circular FK for current_draft_id; immutable approvals | Same-workspace campaign/content/draft/approval constraints | V1 required | YES — `nashir_v1_003` |
| 4. Publishing/analytics/audit | `publishing_jobs`, `publishing_statuses`, `analytics_snapshots`, `audit_events` | After groups 1–3 | HIGH — append-only trail and lineage tables must not be destructively changed | Workspace-scoped; no cross-workspace analytics aggregation | V1 required | YES — `nashir_v1_004` |
| 5. Support/reference | `idempotency_keys`; `roles`, `permissions`, `role_permissions` as Auth/RBAC reference candidates | After group 1; groups 2–4 informative | MEDIUM — seed/reference coupling must remain unauthorized | Idempotency uniqueness; global role/permission reference tables | `idempotency_keys` — V1 candidate; RBAC tables — reference candidates only; no seed files | YES — `nashir_v1_005` |

---

## 6. Required Draft Controls

| Control | Status in draft files |
|---|---|
| `workspace_id` on all merchant-owned tables | PLANNED in all five drafts |
| Same-workspace composite FK constraints across all workspace-owned child-to-parent relationships | APPLIED — all workspace-owned FK references use composite FKs including `workspace_id` |
| Global-user simple FK for `users` references | APPLIED — `users` is global; `creator_user_id`, `reviewer_user_id`, `actor_user_id`, `actor_user_id` in idempotency_keys remain simple FKs to `users (id)` |
| Composite `UNIQUE (workspace_id, id)` on all parent tables referenced by composite FKs | APPLIED — `workspace_members`, `products`, `data_sources`, `channel_connections`, `campaigns`, `campaign_content_items`, `content_drafts`, `publishing_jobs` |
| Product SKU partial unique index within workspace (non-archived, non-null) | APPLIED in draft 002 |
| `users.email` global case-insensitive uniqueness via `LOWER(email)` functional index | PLANNED in draft 001 |
| Credential XOR target constraint | PLANNED in draft 002 |
| No plaintext credential columns | CONFIRMED in all five drafts |
| `audit_events` append-only enforcement plan | DOCUMENTED in draft 004; trigger pattern in comments |
| Idempotency/concurrency support | PLANNED in draft 005 |
| Status enum alignment with OpenAPI | PLANNED; open items listed per draft |
| No cross-workspace leakage | PLANNED via `workspace_id` on all workspace-owned tables and composite FKs |
| No production readiness claim | CONFIRMED |
| No runtime, runner, execution, backend, ORM, generated client, package, or DB-applied change | CONFIRMED |

---

## 7. Same-workspace Composite FK Rules

PostgreSQL requires the referenced parent table to have an explicit unique or
primary key constraint on the exact referenced column set when a composite
foreign key is defined.

A primary key on `id` alone is not sufficient for a composite FK referencing
`(workspace_id, id)`.

### Composite unique constraints in draft output

All workspace-owned parent tables that are referenced through composite FKs
carry `UNIQUE (workspace_id, id)` constraints in the draft files.

| Parent table | Required constraint | Applied in draft |
|---|---|---|
| `workspace_members` | `UNIQUE (workspace_id, id)` | draft 001 — required for composite FK from `audit_events` and `idempotency_keys` |
| `products` | `UNIQUE (workspace_id, id)` | draft 002 — required for composite FK from `assets` and `campaigns` |
| `data_sources` | `UNIQUE (workspace_id, id)` | draft 002 — required for composite FK from `channel_connections` and `integration_credentials` |
| `channel_connections` | `UNIQUE (workspace_id, id)` | draft 002 — required for composite FK from `integration_credentials` and `publishing_jobs` |
| `campaigns` | `UNIQUE (workspace_id, id)` | draft 003 — required for composite FK from `campaign_briefs`, `campaign_content_items`, and `publishing_jobs` |
| `campaign_content_items` | `UNIQUE (workspace_id, id)` | draft 003 — required for composite FK from `content_drafts`, `publishing_jobs`, and deferred `fk_current_draft` |
| `content_drafts` | `UNIQUE (workspace_id, id)` | draft 003 — required for composite FK from `content_approvals` and deferred `fk_current_draft` |
| `publishing_jobs` | `UNIQUE (workspace_id, id)` | draft 004 — required for composite FK from `publishing_statuses` |

Global tables (`workspaces`, `users`) are referenced by simple FKs and do not
need composite unique constraints for this purpose.

Any additional workspace-owned parent table referenced through a composite FK
must include the matching `UNIQUE (workspace_id, id)` constraint before the
referencing migration can be applied.

---

## 8. users.email Uniqueness Draft Rule

| Rule | Detail |
|---|---|
| Preferred mechanism | `LOWER(email)` functional unique index — approved candidate from follow-up gate |
| Index definition candidate | `CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email))` |
| Future backend lookup — preferred | Application pre-lowercases email parameter in code, then queries `WHERE LOWER(email) = $1` |
| Future backend lookup — acceptable | `WHERE LOWER(email) = LOWER($1)` |
| Future backend lookup — NOT recommended | `WHERE email = $1` — may not use the functional index; can cause sequential scans |
| citext alternative | Remains a valid alternative only if a later gate explicitly approves the extension and confirms managed provider support |
| Backend implementation authorization | NOT authorized by this gate; query pattern is a future backend planning requirement only |
| SQL in this gate | Draft index included in `nashir_v1_001` draft comments; not executed |

---

## 9. Credential Draft Rule

| Rule | Detail |
|---|---|
| Credential storage | `credential_ref` and/or `vault_ref` only — opaque references; no plaintext secrets |
| Target model | XOR constraint — exactly one of `channel_connection_id` or `data_source_id` must be non-null |
| XOR CHECK pattern | `(channel_connection_id IS NOT NULL AND data_source_id IS NULL) OR (channel_connection_id IS NULL AND data_source_id IS NOT NULL)` |
| Same-workspace composite FKs | Both `(workspace_id, channel_connection_id)` and `(workspace_id, data_source_id)` FKs include `workspace_id` |
| Parent composite unique constraints | `channel_connections UNIQUE (workspace_id, id)` and `data_sources UNIQUE (workspace_id, id)` required |
| No plaintext secrets | Confirmed in draft 002 |
| Credential mutation audit | Create/revoke/rotate/remove operations must produce `audit_events` entries |
| Provider implementation | Vault/encryption provider implementation remains deferred |

---

## 10. Audit Immutability Draft Rule

| Rule | Detail |
|---|---|
| `audit_events` structure | Append-only; no `updated_at`; no `archived_at`; no hard delete |
| Database-level enforcement — primary | Triggers preventing `UPDATE` and `DELETE` on `audit_events` |
| Database-level enforcement — secondary | Revoke `UPDATE` and `DELETE` privileges from application database role |
| Combined mechanism | Both mechanisms together provide defense-in-depth |
| PostgreSQL privilege caveat | Table owners retain all privileges; `REVOKE` is ineffective if the application role owns `audit_events` |
| Owner-role requirement | `audit_events` must be owned by a separate migration/deployment owner role; application role must be a non-owner |
| Trigger pattern | Documented as draft comment in `nashir_v1_004`; not executed in this gate |
| Audit payload | Safe metadata JSONB only; no secrets; no credentials; no raw tokens |
| Service-layer-only enforcement | Explicitly insufficient |

---

## 11. Enum/Status Draft Rule

| Status field | Source | Strategy |
|---|---|---|
| `workspaces.status` | OpenAPI `WorkspaceStatus` | PostgreSQL ENUM candidate; values: `active`, `suspended`, `archived` — subject to OpenAPI confirmation |
| `workspace_members.status` | OpenAPI `WorkspaceMemberStatus` | OpenAPI-approved; values: `active`, `invited`, `suspended` |
| `campaigns.status` | OpenAPI `CampaignStatus` | OpenAPI-approved ENUM candidate; values TBC from OpenAPI |
| `content_drafts.status` | OpenAPI `ContentDraftStatus` | OpenAPI-approved ENUM candidate; values TBC from OpenAPI |
| `campaign_content_items.status` | OpenAPI `CampaignContentItemStatus` | OpenAPI-approved ENUM candidate; values TBC from OpenAPI |
| `publishing_jobs.status` | OpenAPI `PublishingJobStatus` | OpenAPI-approved ENUM candidate; values TBC from OpenAPI |
| `content_approvals.decision` | OpenAPI `ContentApprovalDecision` | OpenAPI-approved; server-owned; values: `approved`, `rejected` |
| `analytics_snapshots.status` | OpenAPI `AnalyticsSnapshotStatus` | OpenAPI-approved; values: `available`, `partial`, `stale`, `unavailable` |
| `users.status` | SQL-only proposal | TEXT + CHECK candidate; not OpenAPI-approved; values subject to review |
| `store_profiles.status` | SQL-only proposal | TEXT + CHECK candidate |
| `products.status` | SQL-only proposal | TEXT + CHECK candidate |
| `assets.status` | SQL-only proposal | TEXT + CHECK candidate |
| `data_sources.connection_status` | SQL-only proposal | TEXT + CHECK candidate |
| `channel_connections.connection_status` | SQL-only proposal | TEXT + CHECK candidate |
| `idempotency_keys.status` | SQL-only proposal | TEXT + CHECK candidate |
| `publishing_statuses.status` | SQL-only trail field | TEXT candidate; not an OpenAPI-approved enum |

Draft files use TEXT + CHECK for all statuses pending final enum
representation review.

No enum value may be introduced outside approved OpenAPI or planning docs.

Any OpenAPI mismatch is NO-GO for the SQL Migration Draft Authoring Review Gate.

---

## 12. Idempotency/Concurrency Draft Rule

| Rule | Detail |
|---|---|
| `idempotency_keys` table | Included in draft 005 as V1 candidate |
| Key scope | `workspace_id` + `operation_family` + `idempotency_key` (unique constraint); actor validated at service layer |
| Request hash | `request_hash` TEXT field — candidate for replay validation |
| Response replay | `response_status` INTEGER + `response_body` JSONB — candidate fields; no secrets |
| Expiry/retention | `expires_at` TIMESTAMPTZ NOT NULL; cleanup policy deferred to backend planning |
| Resource version fields | `version` INTEGER on `campaigns`, `campaign_content_items`, `content_drafts`, `publishing_jobs` |
| 409 conflict alignment | Version and idempotency metadata support conflict behavior per OpenAPI |
| Backend implementation | NOT authorized by this gate |

---

## 13. Draft Verification Expectations

The SQL Migration Draft Authoring Review Gate must verify:

| Expectation | Description |
|---|---|
| Draft files exist only in `docs/migration_contracts/` | No draft SQL appears in any other path |
| Draft files use `.sql.md` extension | Not raw `.sql` files; clearly marked as documentation |
| No migration runner exists | No runner config, no runner package, no execution scripts |
| No package scripts execute migrations | No `npm run migrate` or equivalent added |
| No database connection | No connection string, no DATABASE_URL, no pg config |
| No database-applied migration | No migration applied to any database in this gate |
| SQL parse verification | If a parser is available without package changes, parse the draft SQL blocks; otherwise note as deferred |
| OpenAPI-to-SQL alignment | Verify each OpenAPI entity maps to a table or explicit deferral |
| Workspace scoping | Verify `workspace_id` on all merchant-owned tables |
| Composite unique constraints | Verify `channel_connections` and `data_sources` carry `UNIQUE (workspace_id, id)` |
| No raw credential columns | Verify `integration_credentials` carries only `credential_ref` / `vault_ref` |
| XOR constraint presence | Verify XOR CHECK is present on `integration_credentials` |
| Audit append-only | Verify `audit_events` has no `updated_at`; trigger pattern is documented |
| Idempotency/concurrency | Verify `idempotency_keys` is present and version fields are on lifecycle tables |
| Enum alignment | Verify OpenAPI-approved enum values in draft CHECK constraints |
| Forbidden path scan | Confirm no files changed outside `docs/` |
| No migration runner/executable scan | Confirm no runner or executable migration files exist |

---

## 14. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Draft files mistaken for executable migrations | CRITICAL | `.sql.md` extension; "DRAFT ONLY" header comment in every SQL block; no runner; `docs/migration_contracts/` is documentation path only |
| Migration runner introduced too early | CRITICAL | No runner exists or is configured; runner selection deferred to backend repository |
| Database-applied changes | CRITICAL | No database connection; no execution tooling; SQL Migration Draft Authoring Review Gate required before any application |
| Repository boundary ambiguity | HIGH | Executable migration artifacts belong in future backend repository; `docs/migration_contracts/` is approved for documentation-only drafts only |
| Rollback ambiguity | HIGH | Down sections included as draft text; per-draft rollback notes document data-sensitive risks; rollback confirmation required in review gate |
| Composite FK failure — missing parent composite unique constraints | CRITICAL | `channel_connections` and `data_sources` drafts include `UNIQUE (workspace_id, id)`; review gate must verify |
| Email duplicate risk | HIGH | `LOWER(email)` functional unique index included in draft 001; review gate must confirm |
| Email lookup performance risk | HIGH | Future backend must pre-lowercase email or use `WHERE LOWER(email) = LOWER($1)`; plain `WHERE email = $1` may cause sequential scans; documented as future backend planning requirement |
| Credential cross-workspace leakage | CRITICAL | XOR constraint and same-workspace composite FKs planned in draft 002; review gate must verify |
| Audit tampering risk | HIGH | `audit_events` append-only structure planned; trigger pattern documented in draft 004; privilege restriction requires owner-role separation |
| Audit immutability risk from role ownership | HIGH | `audit_events` must be owned by separate migration/deployment owner role; application role must be non-owner; documented in draft 004 |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized; no backend implementation approved by this gate |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |
| ORM selection creep | MEDIUM | ORM-generated migrations remain unauthorized |
| Seed/reference coupling | MEDIUM | Role/permission seed files remain unauthorized; roles table is reference candidate only |
| Enum value mismatch with OpenAPI | HIGH | Draft uses TEXT + CHECK; exact enum values must be confirmed against OpenAPI in review gate |
| Circular FK in campaign_content_items | MEDIUM | `current_draft_id` FK added via ALTER TABLE after `content_drafts` is created; review gate must confirm strategy |

---

## 15. GO / NO-GO Decision

**Decision: GO to SQL Migration Draft Authoring Review Gate.**

This gate has authored five documentation-only migration contract draft files
in the approved `docs/migration_contracts/` path and this gate document.

All draft files:

- Use the `.sql.md` extension.
- Begin each SQL block with "DRAFT ONLY — NOT EXECUTABLE".
- Are not wired to any runner.
- Are not applied to any database.
- Include open items lists for review gate confirmation.

This authorizes only the SQL Migration Draft Authoring Review Gate.

This does not authorize migration execution.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

---

## 16. Final Summary

| Item | Summary |
|---|---|
| Inputs | SQL Migration Authoring Follow-up Review Gate, Follow-up Gate, SQL Migration Authoring Gate and Review Gate, SQL Migration Planning Gate and Review Gate, SQL Schema Authoring Gate and Review Gate, SQL Schema Planning Gate and Review Gate, OpenAPI YAML, Auth/RBAC gates, ERD/Data Model gates, Backend/API Strategy gates, README, and screen map |
| Outputs | Five documentation-only migration contract draft files in `docs/migration_contracts/`; one gate document |
| Remaining gaps | Draft SQL blocks use TEXT + CHECK for most statuses pending OpenAPI confirmation; circular FK strategy for `current_draft_id` pending review; `users.status` values pending review; trigger implementation deferred to executable migration; role ownership strategy for audit_events pending backend planning |
| Decision required before next phase | SQL Migration Draft Authoring Review Gate must verify draft files are documentation-only, non-executable, correctly structured, OpenAPI-aligned, workspace-scoped, and free of constraint gaps |
| Recommended next gate | Nashir SQL Migration Draft Authoring Review Gate |

---

## 17. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | New files: `docs/nashir_sql_migration_draft_authoring_gate.md` and five `docs/migration_contracts/*.sql.md` files before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new files shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new files shown by `git status --short` |
| `git diff -- docs/migration_contracts/` | NOT APPLICABLE — new files shown by `git status --short` |
| BIDI scan: `docs/nashir_sql_migration_draft_authoring_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/migration_contracts/nashir_v1_005_support_reference.sql.md` | `BIDI_CONTROL_CHARS none` |
| Backend/API runtime/ORM/generated/UI/package changed-file search | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Migration runner/SQL executable changed-file search | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Existing executable migration/raw SQL file scan | `MIGRATION_SQL_FILES: none` |
| Database-applied changes search | No database commands executed; no migration files applied |
| Package script migration scan | No `migrate` or migration-execution scripts added to `package.json` |

BIDI scan method: Python `pathlib` + Unicode code-point lookup;
no BIDI control characters embedded in shell patterns.

Expected result:

- Documentation-only and draft-only under approved `docs/migration_contracts/` path.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No ORM models.
- No seed files.
- No generated client.
- No package/UI changes.
- No production/pilot readiness claim.
