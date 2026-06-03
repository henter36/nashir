# Nashir SQL Migration Execution Planning Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Execution Planning Gate - documentation only |
| Status | Planning complete |
| Date | 2026-06-03 |
| Controlling prerequisite | `docs/nashir_sql_migration_draft_authoring_review_gate.md` |
| Draft contract artifacts | `docs/migration_contracts/nashir_v1_001` through `nashir_v1_005` |
| Executable migrations created | NO |
| Migration runner introduced | NO |
| SQL executed or applied | NO |
| Backend/API routes implemented | NO |
| ORM models created | NO |
| Seed files created | NO |
| Generated client produced | NO |
| UI changes | NO |
| Package/build changes | NO |
| Database connection config added | NO |
| CI/CD migration execution added | NO |
| marketing-os extraction | NO |
| Database readiness claimed | NO |
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is the Nashir SQL Migration Execution Planning Gate.

Execution planning follows draft authoring review because the draft migration
contract review (PR #95) confirmed that the five documentation-only draft
contracts are internally consistent, same-workspace safe, and aligned with the
SQL schema contract and OpenAPI authority.

The next logical step — before any migration can be applied to a database — is
to define the future boundaries, prerequisites, environment assumptions,
validation steps, rollback expectations, ownership model, and GO/NO-GO criteria
for eventual migration execution.

This gate plans those boundaries in documentation only.

This gate does not execute any migration.

This gate does not introduce a migration runner.

This gate does not apply SQL to any database.

This gate does not introduce backend code.

This gate does not introduce API route implementation.

This gate does not introduce ORM models.

This gate does not introduce seed files.

This gate does not introduce generated clients.

This gate does not introduce UI, package, or build changes.

This gate does not introduce database connection configuration.

This gate does not introduce CI/CD migration execution steps.

This gate does not claim production or pilot readiness.

This gate does not claim database readiness.

This gate does not authorize Backend Slice 1.

---

## 2. Inputs Reviewed

### Controlling prerequisite

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_draft_authoring_review_gate.md` | Controlling prerequisite; GO with minor follow-up decision that enables this execution planning gate |

### Draft contract artifacts

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_draft_authoring_gate.md` | Draft authoring gate document; scope, sequence, and controls |
| `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` | Draft — group 1 |
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | Draft — group 2 |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | Draft — group 3 |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | Draft — group 4 |
| `docs/migration_contracts/nashir_v1_005_support_reference.sql.md` | Draft — group 5 |

### Contract authority inputs

| Input | Role |
|---|---|
| `docs/nashir_v1_openapi.yaml` | API contract authority |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |

### Contextual inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_authoring_follow_up_review_gate.md` | Follow-up review gate; source of nine follow-up decisions |
| `docs/nashir_sql_migration_authoring_follow_up_gate.md` | Follow-up gate; decisions on runner, rollback, email, audit, credential |
| `docs/nashir_sql_migration_authoring_review_gate.md` | Migration authoring review |
| `docs/nashir_sql_migration_authoring_gate.md` | Migration authoring contract |
| `docs/nashir_sql_migration_planning_review_gate.md` | Migration planning review |
| `docs/nashir_sql_migration_planning_gate.md` | Migration planning baseline |
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |

### Authority boundaries

| Boundary | Result |
|---|---|
| Nashir is the product, UI journey, scope, API contract, SQL schema contract, migration draft contract, and data model authority | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |
| No marketing-os code, runner scripts, backend shape, or runtime assumptions are used | **CONFIRMED** |

---

## 3. Current Facts vs Decisions vs Deferred Items

### Approved facts from prior gates

| Fact | Source |
|---|---|
| SQL Migration Draft Authoring Review Gate is complete with GO with minor follow-up | PR #95 |
| Five documentation-only draft migration contracts exist in `docs/migration_contracts/` | PR #94 |
| Draft contracts use `.sql.md` extension; no executable `.sql` files exist | Draft Authoring Review Gate |
| All workspace-owned same-workspace FK relationships use composite FKs including `workspace_id` | Draft Authoring Review Gate |
| All eight parent tables referenced through composite FKs carry `UNIQUE (workspace_id, id)` | Draft Authoring Review Gate |
| No old direct FK pattern from workspace-owned child to workspace-owned parent was found | Draft Authoring Review Gate |
| `LOWER(email)` functional unique index is the approved mechanism for `users.email` | Follow-up Gate |
| Preferred backend lookup: pre-lowercase email in application code, then `WHERE LOWER(email) = $1` | Follow-up Gate + Review Gate |
| Audit append-only: combined triggers + privilege revocation with owner-role separation is the preferred mechanism | Follow-up Gate |
| Credential XOR model: exactly one of `channel_connection_id` or `data_source_id` must be non-null | Follow-up Gate |
| Rollback convention: prefer down sections within each migration file | Follow-up Gate |
| Parse/dry-run verification is required before any executable migration is approved | Follow-up Gate |
| This repository (`nashir`) remains runner-free; migration artifacts belong in a future backend repository | Follow-up Gate |
| `docs/migration_contracts/` is a documentation-only path; files in it are draft contracts, not executable migrations | Follow-up Review Gate |
| Nashir is not production-ready; README confirms this | README |
| Four OpenAPI-approved enum status values require confirmation against OpenAPI YAML | Draft Authoring Review Gate — WATCH items |

### Decisions made in this execution planning gate

| Decision | Detail |
|---|---|
| Execution belongs in a future backend repository, not in this repository | This repository is a UI prototype and OpenAPI contract host; adding execution tooling here violates the established boundary |
| Execution planning is documentation-only | No runner, no DB config, no package script, no executable artifact introduced |
| Five sequential execution groups are planned | Foundation → Store/product/source → Asset/campaign/content → Publishing/analytics/audit → Support/reference; within each, table order follows FK dependency |
| Pre-execution validation is required before any migration run | Defined in Section 8 |
| Transaction boundaries are per migration file | Each `.sql` file runs in a single transaction unless explicitly identified as non-transactional DDL |
| Audit trigger must be in the executable migration, not deferred to a later patch | Audit append-only enforcement must be enforced from the moment `audit_events` is created |
| Application role must not own `audit_events` | Required for privilege restriction to be effective; must be enforced at database setup |
| `gen_random_uuid()` extension or PostgreSQL ≥ 13 must be confirmed before execution | All draft files use `gen_random_uuid()`; this must be available |
| Enum value confirmation is a pre-execution validation requirement | Four WATCH enum fields must be confirmed before executable migration authoring |
| Rollback plan must exist before any group is applied | Down sections in draft contracts exist as candidates; confirmation in execution review gate required |

### Deferred decisions

| Deferred item | Target gate |
|---|---|
| Backend repository establishment | Future backend decision gate |
| Migration runner selection (Flyway, Liquibase, golang-migrate, custom, runner-free) | Backend Slice 1 Planning Gate or equivalent |
| Database engine runtime version and extension configuration | Backend Slice 1 Planning Gate |
| Application role name for privilege restriction on `audit_events` | Backend database setup gate |
| Migration owner role name for table ownership | Backend database setup gate |
| `credential_ref` vs `vault_ref` — single or dual field | SQL Migration Draft Authoring Correction gate or equivalent |
| `workspace_members.role_code` referential integrity — text code vs FK to `roles.role_code` | SQL Migration Draft Authoring Correction gate |
| Whether `roles`, `permissions`, and `role_permissions` are executed in V1 or deferred | Backend Slice 1 Planning Gate |
| Idempotency actor scope — whether actor is in unique constraint | SQL Migration Draft Authoring Correction gate |
| Circular FK MATCH SIMPLE behavior confirmation for `current_draft_id` | SQL Migration Execution Planning Review Gate |
| Backup/snapshot strategy | Backend infrastructure planning gate |
| CI/CD integration for migrations | Backend DevOps planning gate |
| Staging and production database provisioning | Backend infrastructure planning gate |
| Data retention/residency/legal assessment for `audit_events` and `analytics_snapshots` | Legal/security gate |

---

## 4. Execution Boundary

Future migration execution means: running migration SQL files against a live
database in a controlled, reviewed, and authorized sequence, using an approved
runner or execution process, in an environment that has been provisioned and
verified.

### What this gate does not do

This gate does not run any SQL against any database.

This gate does not verify SQL against a local or remote database.

This gate does not create a local database or database schema.

This gate does not introduce a migration runner.

This gate does not introduce package dependencies.

This gate does not introduce CI/CD migration execution.

This gate does not introduce database connection strings or credentials.

This gate does not introduce environment or secrets configuration.

This gate does not introduce a backend repository.

This gate does not authorize Backend Slice 1.

This gate does not claim production or pilot readiness.

### Execution authorization chain

No migration may be applied to any database until all of the following are true:

1. A backend repository is established with its own governance gates.
2. Migration runner is selected and reviewed in that backend repository.
3. Executable migration file paths and naming are approved in that backend repository.
4. Parse/dry-run verification tooling is selected and reviewed.
5. This execution planning gate and its review gate are merged.
6. A SQL Migration Execution Review Gate in the backend repository reviews and approves each migration file before it is applied.
7. Pre-execution validation passes all checks defined in Section 8.

---

## 5. Repository and Environment Boundary

### Repository decision

Execution artifacts belong in the future backend repository, not in this
repository (`nashir`).

This repository (`nashir`) hosts:

- UI prototype source code.
- OpenAPI contract (`docs/nashir_v1_openapi.yaml`).
- Documentation gates and review records.
- Documentation-only migration contract drafts in `docs/migration_contracts/`.

This repository does not host and must not receive:

- Executable SQL migration files (`.sql`).
- Migration runner or runner configuration.
- Database connection configuration.
- Environment or secrets configuration.
- ORM models.
- Backend API routes.
- Server-side runtime code.
- CI/CD migration execution steps.

### Future backend repository prerequisites

Before execution planning can become executable, the future backend repository
must have:

| Prerequisite | Notes |
|---|---|
| Repository established and governed | Own gate-based planning/review process |
| Migration runner selected and reviewed | Flyway, Liquibase, golang-migrate, custom node-postgres runner, or runner-free with documented manual process |
| Executable migration file paths approved | e.g., `db/migrations/` or equivalent |
| Naming convention confirmed | e.g., `YYYYMMDDHHMM__nashir_v1_NNN_<short_description>.sql` |
| Parse/dry-run tooling selected | e.g., `psql --file --set ON_ERROR_STOP=1` against a test database, SQL parser library, or runner `--dry-run` |
| Migration metadata table or equivalent idempotency mechanism | Tracks applied migrations; prevents repeat execution |
| Application role created with non-owner privileges | Required for `audit_events` privilege restriction |
| Migration owner/deployment role created | Owns tables including `audit_events`; distinct from application role |
| Rollback convention implementation reviewed | Down sections, forward-only corrective, or explicitly approved alternative |
| CI/CD integration reviewed | Optional; must not execute migrations without gate approval |

### Environment prerequisites

Future execution requires these environment layers, each reviewed before use:

| Environment | Purpose | Requirements |
|---|---|---|
| Development database | Iterative migration testing | Isolated; disposable; no production data |
| Staging database | Pre-production validation | Migration-clean snapshot or empty; mirrors production schema config |
| Production database | Final state | No migrations applied until production readiness gate passes; completely separate gate |
| Secrets handling | Database credentials and vault references | No plaintext secrets in migration files, logs, or config; vault provider implementation deferred |
| Database owner role | Owns schema objects including `audit_events` | Separate from application role |
| Application non-owner role | Executes application queries | Must not own any table; specifically must not own `audit_events` |
| Migration/deployment role | Applies migrations | May own schema objects during migration run; separate from application role |

No environment configuration is created by this gate.

---

## 6. Migration Runner Planning

### Current status

This repository is runner-free.

No migration runner exists in this repository.

No migration runner is introduced by this gate.

Runner introduction is NO-GO in this gate because:

- This repository is a UI prototype and contract host, not a backend repository.
- Adding runner packages would modify `package.json`, which is forbidden.
- Runner selection must be reviewed in the backend repository context.
- Package changes require a dedicated review gate.

### Runner selection criteria

When the backend repository is established, runner selection must satisfy:

| Criterion | Requirement |
|---|---|
| Raw SQL compatibility | Runner must execute raw `.sql` files; ORM-generated migrations are not approved |
| Metadata tracking | Runner must track applied migrations by filename, checksum, timestamp, and status |
| Idempotency protection | Runner must not re-apply already-applied migrations |
| Ordering | Runner must apply migrations in deterministic order |
| Rollback support | Runner must support down sections, forward-only corrective migrations, or have a reviewed alternative |
| Parse/dry-run | Runner must provide a dry-run or plan mode before execution |
| Transaction support | Runner must run each migration in a transaction unless DDL explicitly requires otherwise |
| Long-running lock assessment | Runner must support assessing or aborting on long-running locks |
| Security | Runner must not log database credentials or plaintext secrets |

### Candidate runner categories (for future backend repository planning)

| Category | Examples | Assessment |
|---|---|---|
| Standalone SQL runner | Flyway, Liquibase, golang-migrate | Framework-independent; compatible with raw SQL; preferred for pure SQL strategy |
| Custom node-postgres runner | Node.js + `pg` + metadata table | Full control; requires implementation of metadata, ordering, checksum, and error handling |
| Runner-free with manual apply | `psql --file` per migration with manual record-keeping | Acceptable for very early development only; requires strict documentation |
| ORM-integrated runner | Prisma Migrate, Knex, TypeORM | Couples runner to ORM; ORM must be separately approved; not recommended unless ORM is approved |

Final runner selection is deferred to Backend Slice 1 Planning Gate.

### Required review gate before runner introduction

Before any runner is added to the backend repository:

1. A dedicated runner selection review gate must approve the runner.
2. Package changes (if any) must be reviewed.
3. Runner configuration must be reviewed.
4. Metadata table implementation must be reviewed.
5. Idempotency protection must be verified.

---

## 7. Execution Sequence Planning

The five migration groups must be applied in strict dependency order.

### Group 1 — Foundation identity/tenant

| Item | Detail |
|---|---|
| Tables | `workspaces`, `users`, `workspace_members` |
| Dependency | None; must be applied first |
| Preconditions | `gen_random_uuid()` available; extension or PostgreSQL ≥ 13 confirmed; database owner role established |
| Transaction boundary | Single transaction; all DDL in this group is transactional in PostgreSQL |
| Rollback concern | HIGH — all downstream tables depend on these tables; rollback is only safe in an empty or test database |
| Same-workspace constraint concern | `workspace_members UNIQUE (workspace_id, user_id)` and `UNIQUE (workspace_id, id)` are correct; membership uniqueness must hold from first row |
| Independent or grouped | Must be grouped; `workspace_members` references both `workspaces` and `users` |
| Pre-execution check | Confirm `LOWER(email)` functional index creation; confirm `users.status` values; confirm `workspaces.status` matches OpenAPI |

### Group 2 — Store/product/source

| Item | Detail |
|---|---|
| Tables | `store_profiles`, `products`, `data_sources`, `channel_connections`, `integration_credentials` |
| Dependency | Group 1 must be applied |
| Preconditions | Group 1 tables exist; extension availability confirmed |
| Transaction boundary | Single transaction preferred; if `channel_connections` composite FK introduces complexity, split may be evaluated in execution review |
| Rollback concern | MEDIUM — credential target rollback requires care; XOR CHECK and composite FKs must be dropped in correct order |
| Same-workspace constraint concern | `data_sources UNIQUE (workspace_id, id)` and `channel_connections UNIQUE (workspace_id, id)` must precede `integration_credentials`; XOR CHECK must be confirmed |
| SKU partial index | `idx_products_workspace_sku_active_unique` — partial index is transactional; confirm in execution review |
| Independent or grouped | Store/product tables can precede source/channel/credential tables if needed; within-group ordering must respect FK dependencies |
| Pre-execution check | Confirm status values; confirm XOR constraint logic; confirm composite FK references are satisfied by parent `UNIQUE (workspace_id, id)` |

### Group 3 — Asset/campaign/content

| Item | Detail |
|---|---|
| Tables | `assets`, `campaigns`, `campaign_briefs`, `campaign_content_items`, `content_drafts`, `content_approvals` |
| Dependency | Groups 1–2 must be applied |
| Preconditions | Products and data sources exist for composite FK satisfaction |
| Transaction boundary | `campaign_content_items` and `content_drafts` involve a circular FK resolved by deferred `ALTER TABLE`; both table creations and the `ALTER TABLE` should run in a single transaction if possible, or the `ALTER TABLE` runs as a separate statement in the same transaction |
| Rollback concern | HIGH — circular FK requires `DROP CONSTRAINT IF EXISTS fk_current_draft` before dropping tables; down section handles this |
| Same-workspace constraint concern | All seven same-workspace composite FKs in this group confirmed in draft review; `campaign_content_items UNIQUE (workspace_id, id)` and `content_drafts UNIQUE (workspace_id, id)` required by downstream tables and the deferred FK |
| Content approval immutability | `content_approvals` has no `updated_at`; this must hold from creation |
| Independent or grouped | Must be grouped; FK dependency chain requires ordered application within group |
| Pre-execution check | Confirm enum values for `campaigns.status`, `content_drafts.status`, `campaign_content_items.status`, `content_approvals.decision`; confirm circular FK MATCH SIMPLE behavior |

### Group 4 — Publishing/analytics/audit

| Item | Detail |
|---|---|
| Tables | `publishing_jobs`, `publishing_statuses`, `analytics_snapshots`, `audit_events` |
| Dependency | Groups 1–3 must be applied |
| Preconditions | Campaign/content/channel tables exist; application role and owner role established |
| Transaction boundary | `audit_events` trigger function and triggers must be applied in the same transaction as the table creation or as an immediate subsequent statement |
| Rollback concern | HIGH — `audit_events` and `analytics_snapshots` contain immutable trail and lineage data; down section is only safe in empty or test database |
| Same-workspace constraint concern | `publishing_jobs UNIQUE (workspace_id, id)` required by `publishing_statuses`; all three composite FKs on `publishing_jobs` (campaign, content item, channel) confirmed in draft review |
| Audit trigger requirement | Trigger preventing `UPDATE` and `DELETE` on `audit_events` must be created in the same executable migration or immediately after; it must not be deferred to a separate patch without a review gate |
| Audit privilege restriction | `REVOKE UPDATE, DELETE ON audit_events FROM <application_role>` must be applied; application role must not own `audit_events`; owner must be the migration/deployment owner role |
| `source_summary NOT NULL` | `analytics_snapshots.source_summary` is NOT NULL; first row must satisfy this |
| Independent or grouped | Must be grouped; publishing tables reference campaign/content/channel; audit may run after publishing if needed |
| Pre-execution check | Confirm `PublishingJobStatus` enum values; confirm `AnalyticsSnapshotStatus` values; confirm trigger pattern name; confirm application role name for privilege restriction; confirm owner role assignment |

### Group 5 — Support/reference

| Item | Detail |
|---|---|
| Tables | `idempotency_keys`, `roles`, `permissions`, `role_permissions` |
| Dependency | Group 1 must be applied; groups 2–4 informative |
| Preconditions | `workspace_members UNIQUE (workspace_id, id)` exists for composite FK from `idempotency_keys.actor_member_id` |
| Transaction boundary | Single transaction; reference tables are simple DDL |
| Rollback concern | MEDIUM — seed coupling must be avoided; no seed data applied |
| Role/permission tables | If deferred from V1 execution scope, `idempotency_keys` can be applied independently |
| No seed data | `roles`, `permissions`, `role_permissions` created empty; seed data remains unauthorized |
| Independent or grouped | `idempotency_keys` can run independently if RBAC reference tables are deferred |
| Pre-execution check | Confirm idempotency actor scope decision; confirm RBAC table V1 inclusion or deferral |

---

## 8. Pre-execution Validation Plan

Before any migration file is applied to any database, the following checks must
all pass in the execution review gate:

| Check | Requirement |
|---|---|
| Parse/dry-run | Each migration file must parse without error; preferred: `psql --file --set ON_ERROR_STOP=1` against a test database |
| OpenAPI-to-SQL alignment | Each OpenAPI entity maps to an approved table or has an explicit deferral |
| Enum/status alignment | Four WATCH enum fields (`campaigns.status`, `content_drafts.status`, `campaign_content_items.status`, `publishing_jobs.status`) confirmed against current OpenAPI YAML |
| Direct FK leakage scan | No `REFERENCES <workspace-owned-table> (id)` without `workspace_id` in FK column set |
| `UNIQUE (workspace_id, id)` scan | All eight required parent composite unique constraints present |
| Composite FK scan | All workspace-owned FK relationships use `FOREIGN KEY (workspace_id, ...)` form |
| No plaintext credential columns | `integration_credentials` contains only `credential_ref` / `vault_ref`; no raw secrets |
| Audit append-only enforcement | Trigger is present in the executable migration, not deferred; privilege restriction is applied at database setup |
| `users.email` uniqueness and lookup rule | `LOWER(email)` functional index present; backend lookup requirement documented |
| Product SKU uniqueness | Partial unique index is present; conditions verified (`archived_at IS NULL AND sku IS NOT NULL`) |
| Idempotency scope | Unique constraint on `idempotency_keys` covers correct scope |
| Role ownership and privilege model | `audit_events` is owned by migration/deployment owner role; application role does not own it |
| Rollback plan | Down section reviewed and confirmed for each group; rollback risks documented per group |
| Backup/snapshot plan | Database state captured before migration run; plan documented |
| Environment isolation | No migration runs against production without a separate production readiness gate |
| Migration lock/idempotency strategy | Runner metadata or equivalent prevents repeat execution; lock timeout assessed |
| `gen_random_uuid()` availability | Extension or PostgreSQL ≥ 13 confirmed on target database |

---

## 9. Tenancy and FK Execution Safeguards

Future execution plans must prove these safeguards before migration approval:

| Safeguard | Requirement |
|---|---|
| Same-workspace composite FKs exist where needed | All fifteen workspace-owned FK relationships use composite FK including `workspace_id`; confirmed in Draft Authoring Review Gate |
| Parent tables include exact composite unique constraints | All eight `UNIQUE (workspace_id, id)` constraints confirmed in Draft Authoring Review Gate |
| Global user references are intentionally global | `users` is global identity; `creator_user_id`, `reviewer_user_id`, `actor_user_id` are simple FKs to `users (id)`; no workspace scoping on users |
| No old direct workspace-owned FK patterns return | Execution review must run a direct FK leakage scan on every migration file before approval |
| Cross-workspace leakage tests or checks are planned | Future backend testing must include cross-workspace data isolation tests before any staging or production migration |

---

## 10. Credential and Secrets Execution Safeguards

| Safeguard | Requirement |
|---|---|
| No plaintext credential columns | `integration_credentials` carries only `credential_ref` and/or `vault_ref`; no raw API key, token, OAuth secret, or password column |
| Credential target exclusivity enforced | XOR CHECK constraint enforces exactly one non-null target; both-null and both-non-null cases are INVALID |
| Same-workspace credential FKs | `(workspace_id, channel_connection_id)` and `(workspace_id, data_source_id)` composite FKs are required |
| Credential target scope model confirmed | `credential_ref` vs `vault_ref` single vs dual field must be resolved before executable migration |
| No secret values in migration logs | Runner output must be scanned for credential values before logs are retained |
| No provider implementation in migration execution | Vault/encryption provider implementation remains deferred; migration only creates schema structure |
| Credential mutation audit requirement | Create, revoke, rotate, and remove credential operations must produce audit events; `audit_events` table must be applied before any credential lifecycle is enabled |

---

## 11. Audit Append-only Execution Safeguards

| Safeguard | Requirement |
|---|---|
| Append-only structure | `audit_events` has no `updated_at` and no `archived_at`; no UPDATE or DELETE ever |
| Database-level enforcement mechanism selected | Must be one of: (a) triggers preventing UPDATE and DELETE, (b) privilege restriction with non-owner application role, or (c) both (preferred) |
| Trigger is in the executable migration | The trigger function and trigger definitions from draft 004 must be in the executable migration; deferring to a later patch requires its own review gate |
| Owner-role separation confirmed | `audit_events` must be owned by migration/deployment owner role before any `REVOKE` is applied; application role must not own `audit_events` |
| No secrets in audit metadata | `metadata JSONB` must not contain credential values, raw tokens, or sensitive secrets; application-layer enforcement required before first audit event is written |
| Audit indexes verified | Workspace/resource/action/time indexes are in draft 004 and must be confirmed in executable migration |

---

## 12. users.email Execution Safeguards

| Safeguard | Requirement |
|---|---|
| Case-insensitive uniqueness mechanism | `LOWER(email)` functional unique index confirmed as preferred mechanism |
| Index applied in group 1 migration | `CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email))` must be part of the group 1 executable migration |
| Future backend lookup — preferred | Application pre-lowercases email parameter in code, then queries `WHERE LOWER(email) = $1` |
| Future backend lookup — acceptable | `WHERE LOWER(email) = LOWER($1)` |
| Future backend lookup — NOT recommended | `WHERE email = $1` — may not use the functional index; can cause sequential scans |
| `citext` alternative | Remains valid only if a later gate explicitly approves the extension and confirms managed provider support; not the default |
| No backend implementation now | Email lookup requirement is a future backend planning obligation; no backend code is authorized by this gate |

---

## 13. Rollback and Recovery Planning

### Rollback convention

The approved convention from the follow-up gate is down sections within each
migration file.

Forward-only corrective migrations remain a recognized fallback for production
scenarios where rollback is too risky or data has been inserted between the up
run and the rollback attempt.

| Rollback requirement | Detail |
|---|---|
| Down section present | Each draft migration file includes a down section; must be confirmed in executable migration |
| Rollback assumes empty/test database for high-risk groups | Foundation and publishing/analytics/audit down sections are safe only in empty or test databases |
| Circular FK down order | Group 3 down section must `DROP CONSTRAINT IF EXISTS fk_current_draft` before dropping `campaign_content_items`; confirmed in draft 003 |
| Destructive rollback prohibition | Table drops and column drops in production require a separate approved gate; down sections for groups 1–4 are development/test-only unless separately reviewed |
| Rollback documentation per group | Each group must document rollback risks before the execution review gate approves it |

### Backup/snapshot requirement

Before any migration run against a non-empty database:

- A database backup or snapshot must be taken immediately before the migration.
- The backup strategy must be documented and approved in the execution review gate.
- No migration may run against a production database without a confirmed backup.

### Transaction boundaries

| Boundary requirement | Detail |
|---|---|
| Each migration file is a single transaction | Unless explicitly identified as containing non-transactional DDL |
| Non-transactional DDL | Must be identified per statement and reviewed before execution |
| Long-running lock risk | Must be assessed before execution; migrations creating indexes on large tables may lock |
| Concurrent write safety | Migrations must be assessed for impact on concurrent application writes if any application exists |

### Audit and idempotency rollback caveats

Dropping `audit_events` in a down section destroys the immutable audit trail.

Down sections for `audit_events` and `analytics_snapshots` must only be
used in empty or test environments.

If `idempotency_keys` is dropped in a down section, any in-flight idempotency
keys are lost; lifecycle POST operations may become non-idempotent.

### Credential rollback caveats

Dropping `integration_credentials` in a down section removes all credential
references.

Vault entries referenced by dropped rows remain in the vault provider until
separately revoked.

Credential rollback must be coordinated with the vault provider plan when
vault provider implementation is present.

---

## 14. Verification Strategy for Future Execution Gate

A future SQL Migration Execution Review Gate must verify the following before
authorizing migration execution against any database:

| Requirement | Verification check |
|---|---|
| Runner config reviewed | Runner configuration file or setup script reviewed and approved in gate |
| Package changes reviewed | Any new `package.json` dependencies reviewed in a dedicated gate |
| Database connection config reviewed | Connection string source, secrets management, and access control reviewed |
| Dry-run output | Runner dry-run or plan output shows expected operations; no unexpected destructive statements |
| Parse output | All SQL files parse without error against PostgreSQL grammar |
| Up/down or rollback plan | Down sections confirmed for each group; rollback risks documented |
| Migration logs | Runner logs reviewed for credential values, sensitive data, or unexpected errors |
| Enum alignment confirmed | Four WATCH enum values confirmed against current OpenAPI YAML |
| Composite FK and parent unique constraint scan | Direct FK leakage scan passes; all `UNIQUE (workspace_id, id)` constraints present |
| Audit trigger present | Trigger function and trigger definitions are in executable migration, not deferred |
| Owner-role assignment confirmed | `audit_events` owned by non-application role; privilege restriction applied |
| No production readiness | No production database is targeted without a separate production readiness gate |
| No backend coupling | No backend API routes, ORM models, or application code is coupled to migration execution unless a Backend Slice gate has authorized it |
| Backup confirmed | Database backup taken immediately before migration run |
| Environment isolation confirmed | Migration is running against development or staging, not production, unless authorized |

---

## 15. PASS / FAIL / WATCH Checklist

| Check | Result |
|---|---|
| Scope compliance | **PASS** |
| Repository boundary | **PASS** — execution belongs in future backend repository |
| Environment boundary | **PASS** — no environment config introduced |
| Runner boundary | **PASS** — runner-free; runner selection deferred to backend repository |
| Execution sequence clarity | **PASS** — five groups with dependency order, preconditions, and rollback concerns |
| Pre-execution validation plan | **PASS** — seventeen checks defined |
| Tenancy/FK safeguards | **PASS** — same-workspace composite FKs and parent unique constraints confirmed from prior review |
| Credential safeguards | **PASS** — XOR, composite FKs, no plaintext secrets, audit requirement |
| Audit safeguards | **PASS** — append-only, trigger requirement, owner-role caveat, no secrets |
| `users.email` safeguards | **PASS** — LOWER(email) index, preferred/acceptable/not-recommended lookup patterns |
| Rollback/recovery planning | **PASS** — per-group rollback concern, down section convention, backup requirement |
| No implementation changes | **PASS** — documentation only |
| Enum value confirmation (4 WATCH fields) | **WATCH** — must be resolved before executable migration authoring |
| `gen_random_uuid()` availability | **WATCH** — must be confirmed on target database before execution |
| `credential_ref` vs `vault_ref` field count | **WATCH** — must be resolved before executable migration authoring |
| Circular FK MATCH SIMPLE confirmation | **WATCH** — must be confirmed in execution review gate |
| Backend repository establishment | **WATCH** — required before execution planning becomes executable |
| Runner selection | **WATCH** — required in backend repository before runner is introduced |
| Application and migration role separation | **WATCH** — required before `audit_events` privilege restriction is applied |

---

## 16. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Premature execution | CRITICAL | No database connection; no runner; SQL Migration Execution Review Gate required before any migration is applied |
| Runner introduced too early | CRITICAL | Runner-free; runner requires dedicated review gate in backend repository |
| Package changes introduced too early | CRITICAL | `package.json` unchanged; package changes require dedicated gate |
| Database-applied changes outside gate | CRITICAL | No database connection config; no execution tooling; this gate is documentation-only |
| Production database risk | CRITICAL | Production database is not targeted by this gate; separate production readiness gate required |
| Environment/secrets leakage | CRITICAL | No secrets config; no database credentials; no environment config introduced |
| Cross-workspace leakage | CRITICAL | Confirmed absent in Draft Authoring Review Gate; execution review must re-verify with direct FK scan |
| Credential leakage | CRITICAL | XOR constraint and same-workspace composite FKs confirmed; no plaintext secrets; vault provider deferred |
| Audit tampering | HIGH | Trigger must be in executable migration; privilege restriction requires owner-role separation; both confirmed as requirements |
| Email uniqueness/performance | HIGH | `LOWER(email)` functional index confirmed; backend lookup pattern documented; backend implementation not authorized |
| Rollback ambiguity | HIGH | Per-group rollback concerns documented; down sections present; rollback confirmation required in execution review gate |
| Enum drift from OpenAPI | HIGH | Four WATCH fields must be confirmed against current OpenAPI YAML before executable migration authoring |
| `gen_random_uuid()` extension dependency | HIGH | Must be confirmed on target database engine and version before execution |
| Circular FK MATCH SIMPLE behavior | MEDIUM | Confirmed as correct for nullable `current_draft_id`; execution review gate must re-verify |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized; no backend implementation approved |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |
| ORM selection creep | MEDIUM | ORM-generated migrations remain unauthorized |
| Seed/reference coupling | MEDIUM | Role/permission seed files remain unauthorized |
| Long-running lock risk | HIGH | Must be assessed before execution; partial indexes and large table operations can lock |
| Non-transactional DDL identification | MEDIUM | Each migration must identify non-transactional statements before execution review |

---

## 17. GO / NO-GO Decision

**Decision: GO to SQL Migration Execution Planning Review Gate.**

This gate has defined the future execution boundaries, prerequisites, environment
assumptions, validation steps, rollback expectations, ownership model, and
GO/NO-GO criteria in documentation only.

No migration has been executed.

No migration runner has been introduced.

No package changes have been made.

No database connection config has been added.

No backend code, ORM models, seed files, generated clients, UI changes, or
production readiness claims have been introduced.

This authorizes only the SQL Migration Execution Planning Review Gate.

This does not authorize migration execution.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

Backend Slice 1 remains blocked until the appropriate planning/review gate
explicitly authorizes it.

---

## 18. Final Summary

| Item | Summary |
|---|---|
| Inputs | SQL Migration Draft Authoring Review Gate, five draft migration contract files, SQL Migration Authoring Follow-up Review Gate and Gate, SQL Schema Authoring Gate and Review Gate, OpenAPI YAML, Auth/RBAC gates, SQL Migration Planning Gate and Review Gate, README, and screen map |
| Outputs | One documentation-only SQL Migration Execution Planning Gate |
| Remaining gaps | Backend repository not yet established; runner not selected; four OpenAPI-approved enum status values require YAML confirmation; `gen_random_uuid()` availability must be confirmed; `credential_ref` vs `vault_ref` field count unresolved; circular FK MATCH SIMPLE confirmation pending; application and migration role separation plan not yet written; backup/snapshot strategy not yet defined |
| Decision required before next phase | SQL Migration Execution Planning Review Gate must review and confirm the execution boundaries, safeguards, pre-execution validation plan, rollback plan, and environment boundary before any migration execution planning becomes actionable |
| Recommended next gate | Nashir SQL Migration Execution Planning Review Gate |

---

## 19. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_execution_planning_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new planning document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new planning document shown by `git status --short` |
| BIDI scan: `docs/nashir_sql_migration_execution_planning_gate.md` | `BIDI_CONTROL_CHARS none` |
| Executable migrations/migration runner/SQL execution scan | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Backend/API runtime/ORM/generated/UI/package files scan | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Package.json or package-lock changes | **NONE** |
| Database connection config scan | **NONE** |
| CI/CD migration execution scan | **NONE** |
| Database-applied changes scan | No database commands executed; no migration files applied |

BIDI scan method: Python `pathlib` + Unicode code-point lookup;
no BIDI control characters embedded in shell patterns.

Expected result:

- Documentation-only planning.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No ORM models.
- No seed files.
- No generated client.
- No package/UI changes.
- No database-applied changes.
- No production/pilot readiness claim.
