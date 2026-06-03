# Nashir Backend Repository Boundary Review Gate

| Field | Value |
|---|---|
| Gate type | Backend Repository Boundary Review Gate - documentation only |
| Status | Review complete |
| Date | 2026-06-03 |
| Controlling prerequisite | `docs/nashir_backend_repository_migration_execution_environment_planning_review_gate.md` |
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

This is the Nashir Backend Repository Boundary Review Gate.

The purpose of this gate is to review backend repository boundary options and
decide the planning direction before any migration runner planning, executable
migration authoring, database configuration, backend implementation, ORM model,
generated client, or SQL Migration Execution Gate.

This gate is documentation-only.

This gate is review/planning-only.

This gate does not introduce backend implementation.

This gate does not introduce API route implementation.

This gate does not introduce executable migrations.

This gate does not introduce migration execution.

This gate does not introduce a migration runner.

This gate does not introduce database-applied changes.

This gate does not introduce database connection configuration.

This gate does not introduce environment or secrets configuration.

This gate does not introduce package or lockfile changes.

This gate does not introduce ORM models.

This gate does not introduce seed files.

This gate does not introduce generated clients.

This gate does not introduce CI/CD migration execution.

This gate does not claim production or pilot readiness.

Backend Slice 1 remains blocked.

SQL Migration Execution Gate remains blocked.

---

## 2. Inputs Reviewed

### Controlling prerequisite

| Input | Role |
|---|---|
| `docs/nashir_backend_repository_migration_execution_environment_planning_review_gate.md` | Controlling prerequisite; decision is GO to Backend Repository Boundary Review Gate |

### Direct and contextual inputs

| Input | Role |
|---|---|
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Current UI and mock-only context |
| `docs/nashir_backend_repository_migration_execution_environment_planning_gate.md` | Backend repository and migration execution environment planning source |
| `docs/nashir_sql_migration_draft_correction_review_gate.md` | Corrected draft migration review and remaining execution gaps |
| `docs/nashir_sql_migration_draft_correction_gate.md` | Corrected draft migration contract source |
| `docs/nashir_sql_migration_execution_planning_review_gate.md` | Migration execution planning review and risk baseline |
| `docs/nashir_sql_migration_execution_planning_gate.md` | Migration execution planning source |
| `docs/migration_contracts/*.sql.md` | Non-executable draft migration contract artifacts |
| `docs/nashir_v1_openapi.yaml` | API contract and enum authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review authority |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | SQL schema review authority |

`docs/migration_contracts/*.sql.md` remain non-executable Markdown draft
contract artifacts. They are not executable SQL migrations in this gate.

---

## 3. Boundary Options Reviewed

| Boundary option | Benefits | Risks | Governance impact | Package/runtime impact | Migration execution impact | Decision |
|---|---|---|---|---|---|---|
| New backend repository | Clean separation of runtime, database config, secrets model, runner, package dependencies, and deployment controls from current docs/UI repository | Requires repository creation planning, ownership, access control, and cross-repo contract synchronization | Strongest boundary; enables separate backend review gates and minimal risk of accidental pollution of current repo | Backend package and runtime can be introduced in a repository designed for them | Best candidate for future executable migrations and runner once environment gates are complete | **APPROVED AS PREFERRED PLANNING DIRECTION** |
| Backend subproject inside current repo | Keeps UI, OpenAPI, docs, and future backend in one repository; simpler local navigation | High risk of package/runtime/config leakage into current UI/docs repository; unclear deployment and CI boundaries | Requires strict path, package, config, and CI governance before any files are added | Would likely require package and runtime changes in current repo, which are forbidden here | Possible only after explicit path/package/runner gates; not safe by default | **DEFERRED** |
| Future explicitly approved path | Flexible if a later gate names a path such as `backend/`, `server/`, or another package boundary | Ambiguous until path, package ownership, and CI/database config rules are defined | Requires a dedicated approval gate before files exist | No impact now; future impact depends on selected path | No executable migration path approved until a later gate | **DEFERRED** |
| No backend boundary yet | Avoids premature backend or runner decisions | Blocks runner planning, executable migration authoring, database config, and SQL Migration Execution Gate | Preserves current repository boundary but leaves implementation sequence unresolved | No package/runtime impact now | Keeps all execution work blocked | **REJECTED AS FINAL STATE; ACCEPTED ONLY AS CURRENT TEMPORARY STATE** |

The reviewed options support a clear planning direction: prefer a future
backend repository or separately approved backend boundary, while keeping the
current repository unchanged until an implementation gate explicitly changes it.

---

## 4. Recommended Boundary Decision

**Recommended boundary: future backend repository or separately approved backend
boundary.**

The preferred planning direction is a separate backend repository for Nashir
backend runtime, database configuration model, environment/secrets model,
migration runner, executable migration files, package dependencies, and backend
CI/CD controls.

This gate does not create that repository.

This gate does not approve a repository name.

This gate does not approve a backend package path.

This gate does not approve executable migration paths.

This gate does not authorize migration runner planning yet, except to say it
must occur after the backend boundary is accepted by a later planning gate.

The current `henter36/nashir` repository remains the documentation, UI,
OpenAPI, and draft-contract repository until an implementation gate explicitly
changes that boundary.

---

## 5. Current Repository Boundary

| Boundary check | Result | Assessment |
|---|---|---|
| `henter36/nashir` remains documentation/UI/OpenAPI/draft-contract repository | **PASS** | No backend boundary file tree is introduced |
| `docs/migration_contracts/*.sql.md` remain non-executable | **PASS** | Draft contracts stay Markdown-only |
| Backend runtime files added | **NONE** | No backend code, server files, routes, services, middleware, or runtime config added |
| Executable migration paths approved | **NONE** | No executable migration path is approved |
| Package scripts added | **NONE** | No `package.json` or lockfile change |
| Database config added | **NONE** | No connection string, DB client config, env file, or secrets config added |
| CI/CD migration execution added | **NONE** | No workflow or pipeline execution step added |
| UI changes | **NONE** | No UI file changes |

No current repository boundary violation was found.

---

## 6. Future Backend Repository Prerequisites

Before backend implementation or migration execution can begin, a future
planning/review sequence must establish:

| Prerequisite | Required control |
|---|---|
| Repository name or approved package boundary | Must be explicitly named and reviewed before files are created |
| Stack decision | Runtime language, framework, database access approach, testing approach, and deployment target must be reviewed |
| Package/runtime boundary | Package manager, scripts, dependency policy, build/test commands, and runtime ownership must be defined |
| Database configuration model | Connection config shape, environment names, and no-checked-in-secret policy must be reviewed |
| Environment/secrets model | Secret storage, rotation, local development handling, CI secret handling, and log redaction must be reviewed |
| Migration runner selection gate | Runner criteria, dependencies, lock behavior, history/checksum, dry-run/parse, and rollback behavior must be approved |
| Executable migration path gate | Exact migration directories/files and artifact class must be approved before files exist |
| CI/CD migration execution gate | CI/CD must not run migrations until separately approved |
| Role/privilege model | Migration/deployment role, application role, `audit_events` ownership, grants/revokes, and owner caveat must be verified |
| Dry-run/parse tooling | SQL parse/dry-run tooling must exist before execution review |
| Rollback/backup plan | Backup/snapshot and rollback/recovery plans must be approved before staging or production execution |

These prerequisites are future planning controls, not completed outputs of this
gate.

---

## 7. Impact on Migration Execution

| Migration execution area | Status | Assessment |
|---|---|---|
| SQL Migration Execution Gate | **BLOCKED** | Backend boundary, runner, executable path, config, secrets model, and execution readiness remain incomplete |
| Runner planning | **BLOCKED** | Runner planning remains blocked until backend boundary is accepted by a future planning gate |
| Executable migration files | **BLOCKED** | No `.sql` executable files may be created by this gate |
| Database-applied changes | **BLOCKED** | No SQL is executed or applied |
| Database config | **BLOCKED** | No database config or secrets config is introduced |
| Package changes | **BLOCKED** | No package or lockfile changes are authorized |
| Backend implementation | **BLOCKED** | Backend Slice 1 is not started |

This gate only authorizes the next planning/review step for backend repository
creation or backend boundary planning.

---

## 8. Remaining Gaps

| Gap | Source | Required future control | Blocks SQL Migration Execution Gate |
|---|---|---|---|
| `ContentApprovalDecision` re-verification | Draft 003 and OpenAPI | Re-verify against current OpenAPI before executable migration authoring and execution review | YES |
| Target PostgreSQL / `gen_random_uuid()` verification | Migration planning gates and draft contracts | Verify PostgreSQL 13+ native function or `pgcrypto` availability on target environment | YES |
| Draft 004 role names and privileges | Draft 004 and planning gates | Record migration/application role names; verify `audit_events` owner and application role privileges | YES |
| Backend repository boundary | Prior review gate | Choose repository name or explicitly approved backend package boundary | YES |
| Runner selection | Prior review gate | Open runner planning only after backend boundary is sufficiently decided | YES |
| Executable migration path | Prior review gate | Approve exact path and artifact type before executable migration files exist | YES |
| Database config | Prior review gate | Review config model with no checked-in connection strings | YES |
| Secrets model | Prior review gate | Review secret storage, local handling, CI handling, and log redaction | YES |
| Dry-run/parse tooling | Prior review gate | Confirm tooling before SQL Migration Execution Gate | YES |
| `credential_ref` / no plaintext secrets verification | Draft 002 and planning review | Verify all secrets use `credential_ref` and no plaintext secrets are stored | YES |

---

## 9. Risks

| Risk | Severity | Control |
|---|---|---|
| Premature backend implementation | CRITICAL | Backend Slice 1 remains blocked; no backend files are added |
| Wrong repository boundary | HIGH | Next gate must explicitly decide repository name or backend package boundary before implementation |
| Current repo polluted with runtime/backend files | HIGH | Current repo remains docs/UI/OpenAPI/draft-contract repository until explicitly changed |
| Runner introduced too early | CRITICAL | Runner remains blocked until backend boundary planning accepts a boundary |
| Database config leakage | CRITICAL | No database config is added; future config gate must prevent checked-in connection strings |
| Secrets leakage | CRITICAL | No environment/secrets config is added; future secrets model must keep secrets out of repository and logs |
| Migration execution without environment controls | CRITICAL | SQL Migration Execution Gate remains blocked until config, secrets, dry-run, lock, backup, and role controls exist |
| Package changes too early | HIGH | No package changes are authorized; backend package review must precede dependency changes |
| Generated client starting too early | HIGH | Generated clients remain unauthorized until backend/API gates approve them |
| Plaintext secrets in database schema | CRITICAL | Future executable migration authoring and SQL Migration Execution Gate must verify all secrets use `credential_ref` and no plaintext secrets are stored |
| Cross-workspace leakage if FK constraints are weakened | CRITICAL | Future executable migration authoring and SQL Migration Execution Gate must verify composite FKs and parent `UNIQUE (workspace_id, id)` constraints |

---

## 10. PASS / FAIL / WATCH Checklist

| Area | Result | Notes |
|---|---|---|
| Scope compliance | **PASS** | Documentation-only review/planning |
| Repository boundary clarity | **PASS** | Preferred direction is future backend repository or separately approved backend boundary |
| Current repository boundary | **PASS** | Current repo remains docs/UI/OpenAPI/draft-contract |
| Migration execution blocked | **PASS** | SQL Migration Execution Gate remains blocked |
| Runner blocked | **PASS** | Runner planning remains blocked until boundary planning accepts a boundary |
| Backend implementation blocked | **PASS** | Backend Slice 1 not started |
| Package changes blocked | **PASS** | No `package.json` or lockfile changes |
| Database config blocked | **PASS** | No DB config added |
| Secrets config blocked | **PASS** | No environment/secrets config added |
| No implementation changes | **PASS** | No runtime/backend/API/ORM/generated/UI/package/DB/CI files changed |
| Backend repository creation | **WATCH** | Next gate must plan repository creation or approved backend boundary |
| Migration runner planning | **WATCH** | Only after backend boundary is sufficiently decided |
| SQL Migration Execution Gate | **WATCH** | Still blocked |

No FAIL items were found.

---

## 11. GO / NO-GO Decision

**Decision: GO to Backend Repository Creation Planning Gate.**

This gate approves the planning direction of a future backend repository or
separately approved backend boundary while keeping `henter36/nashir` as the
documentation, UI, OpenAPI, and draft-contract repository.

This authorizes only the next planning/review step.

This does not authorize SQL Migration Execution Gate.

This does not authorize migration execution.

This does not authorize migration runner implementation or setup.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize API routes.

This does not authorize ORM models.

This does not authorize seed files.

This does not authorize generated clients.

This does not authorize package changes.

This does not authorize database connection configuration.

This does not authorize environment or secrets configuration.

This does not authorize CI/CD migration execution.

This does not authorize production or pilot readiness.

Backend Slice 1 remains blocked.

---

## 12. Final Summary

| Item | Summary |
|---|---|
| Inputs | README, screen map, Backend Repository and Migration Execution Environment Planning Review Gate, planning gate, SQL migration correction/planning gates, non-executable `.sql.md` draft contracts, OpenAPI YAML, Auth/RBAC gates, and SQL schema gates |
| Outputs | One documentation-only Backend Repository Boundary Review Gate |
| Remaining gaps | `ContentApprovalDecision` re-verification, target PostgreSQL / `gen_random_uuid()` verification, group 4 role names and privileges, backend repository name or approved package boundary, runner selection, executable migration path, database config, secrets model, dry-run/parse tooling, and `credential_ref` / no plaintext secrets verification |
| Decision required before next phase | Plan the backend repository creation or explicitly approved backend package boundary without adding runtime files |
| Recommended next gate | Backend Repository Creation Planning Gate |

---

## 13. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | ` A docs/nashir_backend_repository_boundary_review_gate.md` after intent-to-add, before commit |
| `git diff --stat` | `1 file changed, 347 insertions(+)` |
| `git diff -- docs/` | New boundary review document only |
| BIDI scan: `docs/nashir_backend_repository_boundary_review_gate.md` | `BIDI_CONTROL_CHARS none` |
| Executable migrations/migration runner/SQL execution changed-file scan | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Backend/API runtime/ORM/generated/UI/package changed-file scan | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Package.json or package-lock changes | **NONE** |
| Database connection config scan | **NONE** |
| CI/CD migration execution scan | **NONE** |
| Database-applied changes scan | No database commands executed; no migration files applied |

Expected result confirmed:

- Documentation-only review.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No API routes.
- No ORM models.
- No seed files.
- No generated client.
- No package/UI changes.
- No database-applied changes.
- No production/pilot readiness claim.
