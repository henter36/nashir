# Nashir Backend Repository Creation Planning Gate

| Field | Value |
|---|---|
| Gate type | Backend Repository Creation Planning Gate - documentation only |
| Status | Planning complete |
| Date | 2026-06-03 |
| Controlling prerequisite | `docs/nashir_backend_repository_boundary_review_gate.md` |
| API contract authority | `docs/nashir_v1_openapi.yaml` |
| Draft migration contract artifacts | `docs/migration_contracts/*.sql.md` |
| Repository created | NO |
| Backend/API routes implemented | NO |
| Executable migrations created | NO |
| Migration runner introduced | NO |
| SQL executed or applied | NO |
| Database-applied changes | NO |
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

This is the Nashir Backend Repository Creation Planning Gate.

The purpose of this gate is to plan the future backend repository creation
decision for Nashir and define what must be decided before a backend repository
is created or a backend package boundary is approved.

This gate is documentation-only.

This gate is planning-only.

No repository is created in this gate.

This gate does not introduce backend implementation.

This gate does not introduce API route implementation.

This gate does not introduce executable migrations.

This gate does not introduce migration execution.

This gate does not introduce migration runner implementation or setup.

This gate does not introduce database-applied changes.

This gate does not introduce database connection configuration.

This gate does not introduce environment or secrets configuration.

This gate does not introduce package or lockfile changes.

This gate does not introduce ORM models.

This gate does not introduce seed files.

This gate does not introduce generated clients.

This gate does not introduce UI changes.

This gate does not introduce CI/CD migration execution.

This gate does not claim production or pilot readiness.

Backend Slice 1 remains blocked.

SQL Migration Execution Gate remains blocked.

---

## 2. Inputs Reviewed

### Controlling prerequisite

| Input | Role |
|---|---|
| `docs/nashir_backend_repository_boundary_review_gate.md` | Controlling prerequisite; decision is GO to Backend Repository Creation Planning Gate |

### Direct and contextual inputs

| Input | Role |
|---|---|
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Current UI and mock-only context |
| `docs/nashir_backend_repository_migration_execution_environment_planning_review_gate.md` | Confirms repository boundary must precede runner and execution planning |
| `docs/nashir_backend_repository_migration_execution_environment_planning_gate.md` | Backend/migration environment prerequisite source |
| `docs/nashir_sql_migration_draft_correction_review_gate.md` | Corrected draft migration review and remaining execution gaps |
| `docs/nashir_sql_migration_draft_correction_gate.md` | Corrected draft migration contract source |
| `docs/nashir_sql_migration_execution_planning_follow_up_review_gate.md` | Follow-up review for enum, credential, UUID, and role decisions |
| `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` | Follow-up planning source for UUID and role separation |
| `docs/nashir_sql_migration_execution_planning_review_gate.md` | Migration execution planning review and risk baseline |
| `docs/nashir_sql_migration_execution_planning_gate.md` | Migration execution planning source |
| `docs/migration_contracts/*.sql.md` | Non-executable draft migration contract artifacts |
| `docs/nashir_v1_openapi.yaml` | API contract and enum authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review authority |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | SQL schema review authority |

---

## 3. Current Facts vs Decisions vs Deferred Items

### Approved facts

| Fact | Source | Status |
|---|---|---|
| Current repository is `henter36/nashir` | Task context and local checkout | CONFIRMED |
| PR #105 is merged into main | Task context | CONFIRMED |
| Backend Repository Boundary Review Gate decision is GO to this planning gate | `docs/nashir_backend_repository_boundary_review_gate.md` | CONFIRMED |
| Preferred direction is a future backend repository or separately approved backend boundary | Boundary review gate | CONFIRMED |
| Current repository remains documentation/UI/OpenAPI/draft-contract only | Boundary review gate | CONFIRMED |
| SQL Migration Execution Gate remains blocked | Prior gates | CONFIRMED |
| Backend Slice 1 remains blocked | Prior gates | CONFIRMED |

### Decisions made in this planning gate

| Decision | Result |
|---|---|
| Prefer a separate future backend repository unless a later gate proves a monorepo backend package boundary is safer | APPROVED FOR PLANNING |
| Keep `henter36/nashir` as documentation/UI/OpenAPI/draft-contract repository | APPROVED FOR PLANNING |
| Require a creation review gate before any repository is created | APPROVED FOR PLANNING |
| Require stack, ownership, access, contract sync, CI, secrets, and package boundary decisions before creation | APPROVED FOR PLANNING |
| Do not create repository, backend files, package changes, database config, runner, executable migrations, or CI/CD migration execution in this gate | CONFIRMED |

### Deferred items

| Deferred item | Future gate |
|---|---|
| Repository name and owner/org | Backend Repository Creation Planning Review Gate or follow-up creation gate |
| Backend stack decision | Backend Stack Planning Gate |
| Runtime/package boundary | Backend Package Boundary Gate |
| Database configuration model | Backend Database Config Planning Gate |
| Environment/secrets model | Environment and Secrets Planning Gate |
| Migration runner selection | Migration Runner Planning Gate after repository boundary approval |
| Executable migration path | Executable Migration Path Planning Gate |
| CI/CD migration execution | CI/CD Migration Execution Gate |
| Backend implementation | Backend Slice 1 Planning Gate after prerequisites |
| SQL Migration Execution Gate | Future execution gate only after all prerequisites |

---

## 4. Backend Repository Creation Options

| Option | Benefits | Risks | Governance impact | Access control impact | Contract synchronization impact | Migration execution impact | Implementation readiness impact | Decision |
|---|---|---|---|---|---|---|---|---|
| Create a new repository for Nashir backend | Clean runtime, package, config, secrets, runner, and deployment boundary; avoids polluting current docs/UI repo | Requires repo creation process, naming, ownership, cross-repo contract sync, and access setup | Strongest separation and clearest review gates | Can define backend-specific maintainers, branch protection, required reviewers, and secret scopes | Requires explicit OpenAPI/SQL/Auth contract sync workflow | Best candidate for future runner and executable migration files after gates | Prepares a clean place for future backend implementation without starting it | **APPROVED FOR PLANNING** |
| Backend subproject inside `henter36/nashir` | Single repository for docs, UI, OpenAPI, and backend; simpler local discovery | High risk of package, runtime, DB config, and CI leakage into current repo | Requires strict path ownership and CI/package controls | Access model may be too broad if UI/docs contributors get backend runtime access | Easier local sync but higher drift risk if contract and implementation change together without gates | Possible only if runner, package, config, and path are separately approved | Could start faster but raises governance and scope risks | **DEFERRED** |
| Future explicitly approved backend package boundary | Flexible path if later evidence favors monorepo or alternate package layout | Undefined until path, owner, package, CI, and config rules are named | Requires a dedicated approval gate before files exist | Access model depends on selected boundary | Sync model must be defined before implementation | No executable migration path until later gate | Not implementation-ready until named and reviewed | **DEFERRED** |
| Defer repository creation | Preserves current boundary and prevents premature implementation | Leaves backend, runner, executable migration, and SQL execution work blocked | Safest short-term governance state | No new access control impact | No new sync mechanism exists | Keeps all migration execution blocked | No backend implementation readiness | **ACCEPTED FOR THIS GATE ONLY; NOT A FINAL STATE** |

---

## 5. Recommended Repository Creation Direction

**Preferred planning direction: separate future backend repository.**

Nashir should prefer a separate backend repository unless a later gate proves
that a monorepo backend package boundary is safer.

`henter36/nashir` remains the documentation, UI, OpenAPI, and draft-contract
repository.

No repository is created in this gate.

No backend package boundary is approved in this gate.

No backend implementation starts in this gate.

No migration runner planning is authorized by this gate.

No executable migration path is approved by this gate.

---

## 6. Repository Naming and Ownership Planning

Before repository creation, a future gate must decide:

| Planning item | Required decision before creation |
|---|---|
| Repository name candidate | A concrete name such as `nashir-backend` or another approved name |
| Owner/org | Exact owner or GitHub organization that will own the repository |
| Access model | Maintainers, writers, readers, service accounts, and least-privilege expectations |
| Branch protection expectations | Required reviews, status checks, linear history or merge rules, and admin bypass policy |
| Required reviewers | Contract owners for OpenAPI, SQL schema/drafts, Auth/RBAC, security/secrets, and backend runtime |
| CI policy boundary | CI allowed before implementation; no migration execution until a later CI/CD migration execution gate |
| Secrets management policy | No plaintext secrets in repository; repository secret scopes and log redaction requirements |
| Relation to `henter36/nashir` | Current repo remains source for docs/UI/OpenAPI/draft contracts until explicitly changed |
| OpenAPI sync | How backend consumes current OpenAPI and how contract changes are coordinated |
| SQL draft contract sync | How `.sql.md` draft contracts become reviewed executable migrations later |
| Auth/RBAC sync | How permission, role, and workspace identity contracts are mirrored or imported |

This gate creates no repository and no CI files.

---

## 7. Contract Synchronization Planning

Future cross-repository controls must define:

| Contract area | Future control |
|---|---|
| OpenAPI source of truth | `docs/nashir_v1_openapi.yaml` remains authority until a later contract ownership gate changes it |
| SQL migration draft contract source of truth | `docs/migration_contracts/*.sql.md` remain non-executable draft contract source until executable migration gates approve paths |
| Auth/RBAC contract source of truth | Auth/RBAC workspace identity gates remain authority for roles, permissions, and guard patterns |
| Generated client authorization boundary | No generated client until an explicit generation gate approves source, output path, and package impact |
| Versioning/release tagging | Future backend repo must define how it references OpenAPI and draft SQL contract revisions |
| Cross-repo PR dependency rules | Backend PRs that depend on contract changes must link to merged or approved contract PRs |
| Drift detection | Future CI may compare consumed contracts with pinned source revisions, but no CI files are added here |

---

## 8. Backend Stack Decision Boundary

This gate does not decide:

| Stack area | Status |
|---|---|
| Runtime language/framework | DEFERRED |
| ORM | DEFERRED |
| Migration runner | DEFERRED |
| Database driver | DEFERRED |
| Auth implementation | DEFERRED |
| Generated clients | DEFERRED |
| Deployment platform | DEFERRED |
| API route implementation style | DEFERRED |
| Testing framework | DEFERRED |

Each item requires a later planning/review gate before implementation.

---

## 9. Migration Execution Impact

| Area | Status | Assessment |
|---|---|---|
| SQL Migration Execution Gate | **BLOCKED** | Repository creation, runner, executable path, config, secrets, and environment readiness remain incomplete |
| Migration runner planning | **BLOCKED** | Runner planning remains blocked until repository creation planning/review is complete |
| Executable migration files | **BLOCKED** | No executable `.sql` files are created or authorized |
| Database config | **BLOCKED** | No database connection config is introduced |
| Database-applied changes | **BLOCKED** | No SQL is executed or applied |
| CI/CD migration execution | **BLOCKED** | No CI/CD migration execution is introduced |

---

## 10. Security and Secrets Boundary

| Security control | Future requirement |
|---|---|
| No plaintext secrets in repo | Backend repository creation must include a no-plaintext-secrets policy |
| No plaintext secrets in database schema | Executable migration authoring must verify no API keys, tokens, passwords, or secrets are stored as plaintext |
| `credential_ref` only for secret references | Future schema and executable migrations must preserve opaque `credential_ref` references |
| Environment/secrets config gate | Required before any config file, secret reference model, or CI secret binding exists |
| `audit_events` role separation gate | Required before group 4 execution or audit runtime use |
| Database role ownership verification | Required before SQL Migration Execution Gate and before any audit-related execution |
| Log redaction | Future backend and runner must not print connection strings, tokens, passwords, or secret references |

---

## 11. Remaining Gaps

| Gap | Required future control | Blocks SQL Migration Execution Gate |
|---|---|---|
| `ContentApprovalDecision` re-verification | Re-verify against current OpenAPI before executable migration authoring and execution review | YES |
| Target PostgreSQL / `gen_random_uuid()` verification | Verify PostgreSQL 13+ native function or `pgcrypto` availability | YES |
| Draft 004 role names and privileges | Record migration/application role names; verify `audit_events` owner and application role privileges | YES |
| Backend repository name or approved package boundary | Choose exact repository name or approved backend package boundary | YES |
| Runner selection | Open runner planning only after repository creation planning/review is complete | YES |
| Executable migration path | Approve exact path and artifact type before executable migration files exist | YES |
| Database config | Review configuration model with no checked-in connection strings | YES |
| Secrets model | Review secret storage, local handling, CI handling, and log redaction | YES |
| Dry-run/parse tooling | Confirm tooling before SQL Migration Execution Gate | YES |
| `credential_ref` / no plaintext secrets verification | Verify all secrets use `credential_ref` and no plaintext secrets are stored | YES |
| Contract sync model | Define OpenAPI, SQL draft, Auth/RBAC, generated-client, versioning, and drift controls | YES |

---

## 12. Risks

| Risk | Severity | Control |
|---|---|---|
| Premature repository creation | HIGH | This gate does not create a repository; creation requires review |
| Wrong repository boundary | HIGH | Separate backend repository is preferred unless later gate proves monorepo boundary safer |
| Current repo polluted with runtime files | HIGH | Current repo remains docs/UI/OpenAPI/draft-contract only |
| Backend implementation starting too early | CRITICAL | Backend Slice 1 remains blocked |
| Migration runner introduced too early | CRITICAL | Runner remains blocked until repository creation planning/review completes |
| Database config leakage | CRITICAL | No database config is added; future config gate must prevent checked-in connection strings |
| Secrets leakage | CRITICAL | No secrets config is added; future secrets policy must keep secrets out of repository and logs |
| OpenAPI/SQL contract drift | HIGH | Contract synchronization and drift detection must be planned before backend implementation |
| Generated client starting too early | HIGH | Generated clients remain unauthorized until a generation gate approves them |
| Package changes too early | HIGH | No package changes are authorized in this gate |
| Execution readiness falsely implied | CRITICAL | SQL Migration Execution Gate remains blocked and no readiness is claimed |

---

## 13. PASS / FAIL / WATCH Checklist

| Area | Result | Notes |
|---|---|---|
| Scope compliance | **PASS** | Documentation-only planning |
| Repository creation blocked | **PASS** | No repository is created |
| Backend implementation blocked | **PASS** | No backend code or API routes |
| Migration execution blocked | **PASS** | SQL Migration Execution Gate remains blocked |
| Runner blocked | **PASS** | No migration runner planning, setup, or implementation |
| Database config blocked | **PASS** | No DB config or env config |
| Package changes blocked | **PASS** | No `package.json` or lockfile changes |
| Secrets config blocked | **PASS** | No environment/secrets config |
| Contract synchronization planned | **PASS** | OpenAPI, SQL draft, Auth/RBAC, generated client, versioning, PR dependency, and drift controls named |
| Remaining gaps identified | **PASS** | Execution, repository, runner, config, secrets, and contract gaps listed |
| No implementation changes | **PASS** | No runtime/backend/API/ORM/generated/UI/package/DB/CI files changed |
| Repository name | **WATCH** | Must be decided later |
| Owner/org and access model | **WATCH** | Must be decided later |
| Backend stack | **WATCH** | Deferred to later gate |

No FAIL items were found.

---

## 14. GO / NO-GO Decision

**Decision: GO to Backend Repository Creation Planning Review Gate.**

This gate is complete enough for review. It plans the future backend repository
creation decision without creating a repository or starting implementation.

This authorizes only the next planning/review step.

This does not authorize creating a repository.

This does not authorize backend implementation.

This does not authorize API routes.

This does not authorize migration execution.

This does not authorize migration runner implementation or setup.

This does not authorize database-applied changes.

This does not authorize database configuration.

This does not authorize environment or secrets configuration.

This does not authorize ORM models.

This does not authorize seed files.

This does not authorize generated clients.

This does not authorize package changes.

This does not authorize CI/CD migration execution.

This does not authorize production or pilot readiness.

Backend Slice 1 remains blocked.

SQL Migration Execution Gate remains blocked.

---

## 15. Final Summary

| Item | Summary |
|---|---|
| Inputs | README, screen map, Backend Repository Boundary Review Gate, backend migration environment planning/review gates, SQL migration correction/planning gates, non-executable `.sql.md` draft contracts, OpenAPI YAML, Auth/RBAC gates, and SQL schema gates |
| Outputs | One documentation-only Backend Repository Creation Planning Gate |
| Remaining gaps | `ContentApprovalDecision` re-verification, target PostgreSQL / `gen_random_uuid()` verification, Draft 004 role names and privileges, backend repository name or approved package boundary, runner selection, executable migration path, database config, secrets model, dry-run/parse tooling, `credential_ref` / no plaintext secrets verification, and contract sync model |
| Decision required before next phase | Review whether the creation planning is complete enough to proceed to repository creation planning follow-up or naming/ownership approval |
| Recommended next gate | Backend Repository Creation Planning Review Gate |

---

## 16. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `A docs/nashir_backend_repository_creation_planning_gate.md` after intent-to-add, before commit |
| `git diff --stat` | `1 file changed, 416 insertions(+)` |
| `git diff -- docs/` | New creation planning document only |
| BIDI scan: `docs/nashir_backend_repository_creation_planning_gate.md` | `BIDI_CONTROL_CHARS none` |
| Executable migrations/migration runner/SQL execution changed-file scan | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Backend/API runtime/ORM/generated/UI/package changed-file scan | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Package.json or package-lock changes | **NONE** |
| Database connection config scan | **NONE** |
| CI/CD migration execution scan | **NONE** |
| Repository creation/backend runtime files scan | `REPOSITORY_RUNTIME_CHANGED_FILES: none` |
| Database-applied changes scan | No database commands executed; no migration files applied |

Expected result confirmed:

- Documentation-only planning.
- No repository creation.
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
