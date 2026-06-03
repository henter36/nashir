# Nashir Backend Repository Migration Execution Environment Planning Gate

| Field | Value |
|---|---|
| Gate type | Backend Repository and Migration Execution Environment Planning Gate - documentation only |
| Status | Planning complete |
| Date | 2026-06-03 |
| Controlling prerequisite | `docs/nashir_sql_migration_draft_correction_review_gate.md` |
| API contract authority | `docs/nashir_v1_openapi.yaml` |
| Draft migration contract artifacts | `docs/migration_contracts/*.sql.md` |
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
| Environment/secrets config added | NO |
| CI/CD migration execution added | NO |
| marketing-os extraction | NO |
| Database readiness claimed | NO |
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is the Nashir Backend Repository Migration Execution Environment Planning
Gate.

The purpose of this gate is to define the future backend repository boundary
and the future migration execution environment prerequisites required before
any SQL Migration Execution Gate can be opened.

This gate is planning-only.

This gate does not introduce executable migrations.

This gate does not introduce a migration runner.

This gate does not execute or apply SQL to a database.

This gate does not introduce backend code.

This gate does not introduce API route implementation.

This gate does not introduce ORM models.

This gate does not introduce seed files.

This gate does not introduce generated clients.

This gate does not introduce UI, package, or build changes.

This gate does not introduce database connection configuration.

This gate does not introduce environment or secrets configuration.

This gate does not introduce CI/CD migration execution steps.

This gate does not claim database readiness.

This gate does not claim production or pilot readiness.

The SQL Migration Execution Gate is not yet allowed because the backend
repository boundary has not been approved, executable migration paths do not
exist, the migration runner has not been selected, package changes have not
been reviewed, database connection and secrets models have not been reviewed,
and target environment validation has not been completed.

---

## 2. Inputs Reviewed

### Controlling prerequisite

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_draft_correction_review_gate.md` | Controlling prerequisite; decision is GO with minor documentation follow-up and no execution authorization |

### Direct planning inputs

| Input | Role |
|---|---|
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | UI journey context; confirms current repository includes mock UI/documentation context |
| `docs/nashir_sql_migration_draft_correction_gate.md` | Corrected draft contract gate |
| `docs/nashir_sql_migration_execution_planning_follow_up_review_gate.md` | Review of execution planning follow-up decisions |
| `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` | Source of resolved WATCH item decisions |
| `docs/nashir_sql_migration_execution_planning_review_gate.md` | Execution planning review and risk baseline |
| `docs/nashir_sql_migration_execution_planning_gate.md` | Original execution planning gate and pre-execution boundaries |
| `docs/nashir_sql_migration_draft_authoring_review_gate.md` | Draft authoring review; FK, enum, and constraint baseline |
| `docs/nashir_sql_migration_draft_authoring_gate.md` | Draft authoring gate; migration group sequence and scope |

### Contract authorities

| Input | Role |
|---|---|
| `docs/nashir_v1_openapi.yaml` | API contract authority; enum and response/request contract source |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC/workspace identity review authority |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | SQL schema authoring review authority |

### Draft contract artifacts

| Input | Role |
|---|---|
| `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` | Non-executable draft contract artifact |
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | Non-executable draft contract artifact |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | Non-executable draft contract artifact |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | Non-executable draft contract artifact |
| `docs/migration_contracts/nashir_v1_005_support_reference.sql.md` | Non-executable draft contract artifact |

`docs/migration_contracts/*.sql.md` are reviewed as Markdown draft contract
artifacts only. They are not executable migration files and are not applied by
this gate.

---

## 3. Current Facts vs Decisions vs Deferred Items

### Approved facts

| Fact | Source | Status |
|---|---|---|
| Current repository is `henter36/nashir` | Task context and repository state | CONFIRMED |
| PR #102 is merged into main | Task context | CONFIRMED |
| SQL Migration Draft Correction Review Gate decision is GO with minor documentation follow-up | `docs/nashir_sql_migration_draft_correction_review_gate.md` | CONFIRMED |
| Draft migration contracts remain `.sql.md` documentation artifacts | `docs/migration_contracts/*.sql.md` | CONFIRMED |
| OpenAPI YAML is the API contract and enum authority | `docs/nashir_v1_openapi.yaml` | CONFIRMED |
| No SQL Migration Execution Gate authorization currently exists | Prior gates and task constraints | CONFIRMED |
| Backend repository is not yet established | Controlling prerequisite | CONFIRMED |
| Runner is not selected | Controlling prerequisite | CONFIRMED |

### Decisions made in this gate

| Decision | Result |
|---|---|
| Current `henter36/nashir` remains the documentation, UI, OpenAPI, and draft contract repository | APPROVED FOR PLANNING |
| Future executable migrations must live behind a backend repository or explicitly approved backend package boundary | APPROVED FOR PLANNING |
| Backend boundary must be approved before runner selection can be finalized | APPROVED FOR PLANNING |
| SQL Migration Execution Gate remains blocked until repository boundary, runner, executable paths, database config, secrets model, dry-run tooling, and target environment checks are complete | APPROVED FOR PLANNING |
| This gate creates no backend repository and adds no backend files | CONFIRMED |

### Deferred items

| Deferred item | Future owner | Blocks SQL Migration Execution Gate |
|---|---|---|
| Backend repository or backend package boundary selection | Backend Repository Boundary Review Gate | YES |
| Migration runner selection | Migration Runner Planning Gate after backend boundary approval | YES |
| Executable migration path approval | Future execution planning/review gate | YES |
| Package/dependency changes for runner | Future backend package review gate | YES |
| Database connection config model | Future environment/config review gate | YES |
| Environment secrets model | Future environment/secrets review gate | YES |
| Development/staging/production environment validation | Future execution readiness gate | YES |
| ContentApprovalDecision enum re-verification | Future executable migration authoring or execution gate | YES |
| `gen_random_uuid()` target PostgreSQL verification | Future execution gate | YES |
| Application and migration role names for group 4 | Future execution gate | YES |

---

## 4. Repository Boundary Decision

| Repository area | Boundary decision |
|---|---|
| Current `henter36/nashir` repository | Remains documentation, UI, OpenAPI, and draft contract repository |
| Current docs | May contain planning gates, review gates, OpenAPI YAML, screen maps, and non-executable draft migration contracts |
| Current UI/source tree | Not modified by this gate; remains outside migration execution scope |
| Future executable migrations | Must belong to a backend repository, backend subproject, or future explicitly approved path |
| Future backend runtime | Must not be created by this gate |
| Future migration runner | Must not be created by this gate |

The preferred next decision is not to create executable migration artifacts in
the current repository by default. The next gate must choose one of these
backend boundaries:

| Candidate boundary | Planning status | Notes |
|---|---|---|
| New backend repository | Candidate | Cleanest separation if Nashir backend runtime, database config, runner, and deployment controls should be isolated from the UI/docs repository |
| Backend subproject in current repository | Candidate | Possible only if explicitly approved; requires package, CI, config, and runtime boundary controls before any files are added |
| Future explicitly approved path | Candidate | Allows a reviewed path such as `backend/`, `server/`, or another approved package boundary, but no path is approved in this gate |

This gate does not create the backend repository.

This gate does not add backend files.

This gate does not start Backend Slice 1.

---

## 5. Migration Artifact Boundary

| Artifact type | Boundary |
|---|---|
| `docs/migration_contracts/*.sql.md` | Non-executable draft contracts only |
| Future executable `.sql` files | Require separate gate before files exist |
| Future generated migrations | Not authorized; ORM-generated migrations require separate ORM and migration review |
| Future runner metadata | Not authorized in this gate |
| Future execution logs | Not authorized in this gate |

Future executable migration paths must be approved before files are created.
The future gate must name the exact backend repository or package path and must
define whether executable migration files are hand-authored SQL, runner-owned
files, or another reviewed artifact class.

No `.sql` executable files are introduced here.

No migration runner is introduced here.

No SQL is executed or applied here.

---

## 6. Runner Selection Planning

Runner selection remains blocked until the backend boundary is approved because
runner dependencies, package scripts, database config, lock behavior, and CI/CD
hooks are repository-bound decisions.

### Runner selection criteria

| Criterion | Required control |
|---|---|
| Sequential migration ordering | Must preserve the approved draft group order |
| Transaction behavior | Must document transactional and non-transactional DDL handling |
| Locking | Must provide a migration lock or equivalent single-run guarantee |
| Dry-run/parse support | Must support validation before applying migrations |
| Checksum/history | Must record what ran and prevent silent drift |
| Rollback model | Must distinguish development/test rollback from production recovery |
| Least-privilege roles | Must support migration/deployment role separate from application role |
| Secrets handling | Must avoid checked-in credentials and avoid printing secrets in logs |
| CI/CD boundary | Must not auto-run migrations until a CI/CD migration execution gate approves it |
| Package impact | Must document dependencies and scripts before package changes are made |

### Supported future candidates

| Candidate | Status in this gate | Notes |
|---|---|---|
| SQL-first migration runner | Option only | Useful if executable SQL remains canonical; requires backend package decision |
| Node.js migration runner | Option only | Possible if backend package is Node-based; requires package review |
| ORM migration framework | Option only | Requires separate ORM decision; ORM models remain unauthorized |
| Managed platform migration tooling | Option only | Requires environment, role, lock, and audit review |
| Custom runner | Option only | Disfavored unless justified; requires dedicated design review |

### Required checks before runner approval

| Check | Required before approval |
|---|---|
| Backend boundary approved | YES |
| Executable migration path approved | YES |
| Package/dependency changes reviewed | YES |
| Database config model reviewed | YES |
| Secrets model reviewed | YES |
| Dry-run/parse behavior demonstrated | YES |
| Locking behavior documented | YES |
| Migration history/checksum behavior documented | YES |
| CI/CD execution explicitly disabled unless separately approved | YES |

Package changes would be reviewed later in the backend boundary where the
runner lives. No `package.json` or `package-lock.json` change is authorized in
this gate.

---

## 7. Environment Prerequisites

No environment config is introduced in this gate.

| Environment area | Future requirement | Blocks SQL Migration Execution Gate |
|---|---|---|
| Development database | Identified target instance, disposable or recoverable data, parse/dry-run support | YES |
| Staging database | Identified target instance, backup/snapshot plan, production-like PostgreSQL version | YES |
| Production database | Explicit target identification, backup/snapshot approval, rollback/recovery approval, production execution gate | YES |
| Target PostgreSQL version | Must be recorded before execution; PostgreSQL 13+ preferred for native `gen_random_uuid()` | YES |
| `gen_random_uuid()` / `pgcrypto` | Must verify PostgreSQL 13+ native function or `pgcrypto` availability before first run | YES |
| Backup/snapshot | Required before staging or production execution | YES |
| Migration lock | Required to prevent concurrent execution | YES |
| Dry-run/parse environment | Required to validate SQL before applying | YES |
| Secrets handling | Database credentials must be outside repository; no secret values in docs, code, logs, or config | YES |
| Database connection config | Must be reviewed in a future config gate; none added here | YES |
| CI/CD execution | Must be separately approved; none added here | YES |

The future execution environment must also confirm that logging does not expose
connection strings, passwords, provider tokens, credential references, or
plaintext secrets.

---

## 8. Database Role Model Planning

The future executable migration environment must separate migration/deployment
ownership from application runtime privileges.

| Role class | Future responsibility | Ownership/privilege requirement |
|---|---|---|
| Migration/deployment owner role | Applies migrations and owns schema objects created during migration | May own `audit_events`; must not be used by application runtime |
| Application non-owner role | Used by backend application at runtime | Must not own `audit_events`; should receive only required privileges |
| Audit event owner | Same as migration/deployment owner unless separately approved | Owns `audit_events` so application role cannot bypass restrictions through ownership |

For `audit_events`, future executable migration authoring must preserve:

| Control | Future requirement |
|---|---|
| Append-only table model | No application `UPDATE` or `DELETE` behavior |
| Trigger enforcement | Future executable migration must verify trigger names and behavior before execution |
| Privilege restriction | Application role must not receive `UPDATE` or `DELETE` on `audit_events` |
| Owner caveat | PostgreSQL table owners retain privileges; `REVOKE` is ineffective against the table owner |
| Role naming | Actual migration and application role names must be recorded before group 4 execution |

No role SQL is added in this gate.

No grants, revokes, triggers, or database users are created by this gate.

The future SQL Migration Execution Gate must verify actual role names,
ownership, grants, revokes, trigger presence, and application runtime role use.

---

## 9. Remaining Gap Review

| Gap | Source | Risk | Required next control | Blocks SQL Migration Execution Gate |
|---|---|---|---|---|
| `ContentApprovalDecision` enum confirmation | `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md`; controlling review gate | HIGH - executable migration could encode stale enum values | Re-verify against current `docs/nashir_v1_openapi.yaml` during executable migration authoring and again in SQL Migration Execution Gate | YES |
| `gen_random_uuid()` target PostgreSQL verification | Execution planning follow-up and review gates | HIGH - first migration can fail if function is unavailable | Record target PostgreSQL version; verify PostgreSQL 13+ or `pgcrypto` before execution | YES |
| Application/migration role names for group 4 execution | Execution planning follow-up and draft 004 | HIGH - audit immutability can be bypassed if application role owns `audit_events` | Record actual role names and privileges before group 4 execution; verify application role is non-owner | YES |
| Backend repository not established | Controlling review gate | CRITICAL - no approved place for backend runtime, runner, package, or executable SQL | Open Backend Repository Boundary Review Gate | YES |
| Runner not selected | Controlling review gate | CRITICAL - no reviewed migration execution mechanism | Open Migration Runner Planning Gate only after backend boundary is sufficiently decided | YES |

`ContentApprovalDecision` currently appears in OpenAPI with `approved` and
`rejected` values. This gate records that observation only as planning context.
The future executable migration gate must re-verify against the then-current
OpenAPI YAML before executable SQL exists or runs.

---

## 10. Execution Readiness Checklist

The SQL Migration Execution Gate must not open until every item below is
complete or explicitly dispositioned by an approved review gate.

| Prerequisite | Required status before SQL Migration Execution Gate |
|---|---|
| Backend repository or approved backend boundary exists | REQUIRED |
| Runner selected through review gate | REQUIRED |
| Executable migration path approved | REQUIRED |
| Package changes reviewed | REQUIRED |
| Database config reviewed | REQUIRED |
| Environment secrets model reviewed | REQUIRED |
| Dry-run/parse tooling confirmed | REQUIRED |
| Enum re-verification completed | REQUIRED |
| Same-workspace FK scan completed | REQUIRED |
| Parent `UNIQUE (workspace_id, id)` scan completed | REQUIRED |
| `credential_ref` and no plaintext secrets scan completed | REQUIRED |
| Audit role ownership plan verified | REQUIRED |
| Backup/snapshot plan approved | REQUIRED |
| Rollback/recovery plan approved | REQUIRED |
| Migration lock behavior confirmed | REQUIRED |
| Migration history/checksum behavior confirmed | REQUIRED |
| CI/CD migration execution boundary reviewed | REQUIRED |
| Production execution gate, if production is targeted | REQUIRED |

The enum re-verification must include all status and decision fields in the
draft migration contracts, including `ContentApprovalDecision`.

The same-workspace FK scan must verify that all composite FK controls and
parent `UNIQUE (workspace_id, id)` constraints remain intact.

---

## 11. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Premature execution | CRITICAL | SQL Migration Execution Gate remains unauthorized; no runner, config, or executable SQL is introduced |
| Runner introduced too early | CRITICAL | Runner selection deferred until backend boundary is approved and runner planning gate is opened |
| Backend repository ambiguity | CRITICAL | Backend Repository Boundary Review Gate must choose new repository, backend subproject, or explicitly approved path |
| Database config leakage | CRITICAL | No database config in this gate; future config gate must prevent checked-in connection strings |
| Secrets leakage | CRITICAL | No environment/secrets config in this gate; future secrets model must keep secrets out of repository and logs |
| Plaintext secrets in database schema | CRITICAL | Future executable migration authoring and the SQL Migration Execution Gate must verify that all secrets use credential_ref and no plaintext secrets are stored. |
| Production database risk | CRITICAL | No production database target is approved; backup/snapshot and production execution review required before production execution |
| Audit tampering due to bad role ownership | HIGH | Future execution gate must verify application role does not own `audit_events`, lacks UPDATE/DELETE, and trigger enforcement exists |
| Enum drift | HIGH | Future executable migration authoring and execution gate must re-verify enums against current OpenAPI |
| Cross-workspace leakage if FK constraints are weakened | CRITICAL | Future executable migration authoring and the SQL Migration Execution Gate must verify that all composite FK controls and parent `UNIQUE (workspace_id, id)` constraints remain intact |
| Package changes too early | HIGH | No package changes in this gate; package changes require backend boundary and runner review |
| Generated client starting too early | HIGH | Generated clients remain unauthorized until backend/API implementation gates explicitly authorize them |
| ORM model creep | HIGH | ORM models and ORM-generated migrations remain unauthorized |
| CI/CD migration execution too early | CRITICAL | No CI/CD migration execution is introduced; future CI/CD execution must be separately approved |
| marketing-os extraction | HIGH | marketing-os remains reference-only; no extraction or runtime-shape import is authorized |

---

## 12. GO / NO-GO Decision

**Decision: GO to Backend Repository Boundary Review Gate.**

This gate establishes the planning boundary for backend repository and migration
execution environment decisions.

The current `henter36/nashir` repository remains the documentation, UI,
OpenAPI, and draft contract repository.

Executable migrations, migration runner configuration, database connection
configuration, environment/secrets configuration, backend runtime code, ORM
models, generated clients, and CI/CD migration execution remain unauthorized.

This authorizes only the next planning/review step.

This does not authorize SQL Migration Execution Gate.

This does not authorize migration execution.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize API route implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize package changes.

This does not authorize UI changes.

This does not authorize production or pilot readiness.

Backend Slice 1 remains blocked until an appropriate planning/review gate
explicitly authorizes it.

---

## 13. Final Summary

| Item | Summary |
|---|---|
| Inputs | README, screen map, SQL Migration Draft Correction Review Gate, SQL Migration Draft Correction Gate, execution planning gates and reviews, draft authoring gates and reviews, five `.sql.md` migration contract artifacts, OpenAPI YAML, Auth/RBAC gates, and SQL schema authoring gates |
| Outputs | One documentation-only backend repository and migration execution environment planning gate |
| Remaining gaps | `ContentApprovalDecision` enum confirmation pending for future execution; `gen_random_uuid()` target PostgreSQL verification required; application/migration role names required for group 4 execution; backend repository not established; runner not selected |
| Decision required before next phase | Choose the backend repository or backend package boundary and confirm no executable migration path, runner, package change, database config, or secrets model exists before approval |
| Recommended next gate | Backend Repository Boundary Review Gate |

---

## 14. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `A docs/nashir_backend_repository_migration_execution_environment_planning_gate.md` after intent-to-add, before commit |
| `git diff --stat` | `1 file changed, 477 insertions(+)` |
| `git diff -- docs/` | New planning document only |
| BIDI scan on new/modified docs files | `BIDI_CONTROL_CHARS none` |
| Executable migrations/migration runner/SQL execution changed-file scan | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Backend/API runtime/ORM/generated/UI/package changed-file scan | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Package.json or package-lock changes | **NONE** |
| Database connection config scan | **NONE** |
| CI/CD migration execution scan | **NONE** |
| Database-applied changes scan | No database commands executed; no migration files applied |

Expected result confirmed:

- Documentation-only planning.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No ORM models.
- No generated client.
- No package/UI changes.
- No database-applied changes.
- No production/pilot readiness claim.
