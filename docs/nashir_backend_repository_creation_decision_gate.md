# Nashir Backend Repository Creation Decision Gate

| Field | Value |
|---|---|
| Gate type | Backend Repository Creation Decision Gate - documentation only |
| Status | Decision complete |
| Date | 2026-06-03 |
| Controlling prerequisite | `docs/nashir_backend_repository_creation_planning_review_gate.md` |
| API contract authority | `docs/nashir_v1_openapi.yaml` |
| Auth/RBAC/Workspace Identity authority | `docs/nashir_auth_rbac_workspace_identity_gate.md`, `docs/nashir_auth_rbac_workspace_identity_review_gate.md` |
| Persistence contract authority | SQL schema gates and non-executable migration draft contracts |
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

This is the Nashir Backend Repository Creation Decision Gate.

The purpose of this gate is to decide the future backend repository creation
direction for Nashir and define the required controls before any repository is
created.

This gate is decision/planning only.

This gate is documentation-only.

This gate does not create a repository.

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
| `docs/nashir_backend_repository_creation_planning_review_gate.md` | Controlling prerequisite; authorized this decision gate only |

### Direct and contextual inputs

| Input | Role |
|---|---|
| `README.md` | Nashir product and non-production boundary |
| `docs/screen_map.md` | Current UI and mock-only context |
| `docs/nashir_backend_repository_creation_planning_gate.md` | Backend repository creation planning source |
| `docs/nashir_backend_repository_boundary_review_gate.md` | Backend repository boundary review and prior gate decision |
| `docs/nashir_backend_repository_migration_execution_environment_planning_review_gate.md` | Confirms backend boundary must precede runner and execution planning |
| `docs/nashir_backend_repository_migration_execution_environment_planning_gate.md` | Migration environment prerequisite planning |
| `docs/nashir_sql_migration_draft_correction_review_gate.md` | Corrected draft migration review and remaining execution gaps |
| `docs/nashir_sql_migration_draft_correction_gate.md` | Corrected draft migration contract source |
| `docs/nashir_sql_migration_execution_planning_follow_up_review_gate.md` | Follow-up review for enum, UUID, credential, and role controls |
| `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` | Follow-up planning source for execution controls |
| `docs/nashir_sql_migration_execution_planning_review_gate.md` | Migration execution planning review and risk baseline |
| `docs/nashir_sql_migration_execution_planning_gate.md` | Migration execution planning source |
| `docs/migration_contracts/*.sql.md` | Non-executable draft migration contract artifacts |

### Contract authorities

| Input | Authority |
|---|---|
| `docs/nashir_v1_openapi.yaml` | API contract authority, including API surface and enum contract expectations |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC/workspace identity review authority |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema authoring authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | SQL schema review authority |

The SQL schema gates and `docs/migration_contracts/*.sql.md` are persistence
contract authority. `docs/migration_contracts/*.sql.md` remain non-executable
Markdown draft contract artifacts.

---

## 3. Current Facts vs Decision vs Deferred Items

### Approved facts

| Fact | Source |
|---|---|
| `henter36/nashir` remains the current documentation, UI, OpenAPI, and draft-contract repository | Backend repository boundary and creation planning review gates |
| `docs/migration_contracts/*.sql.md` are non-executable draft migration contract artifacts | SQL migration draft and planning gates |
| OpenAPI remains the API contract authority | `docs/nashir_v1_openapi.yaml` and OpenAPI gates |
| Auth/RBAC/Workspace Identity gates remain the workspace and authorization authority | Auth/RBAC/Workspace Identity gates |
| SQL Migration Execution Gate remains blocked | Migration execution planning and backend repository planning review gates |
| Backend Slice 1 remains blocked | Backend repository planning and review gates |

### Decisions made by this gate

| Decision | Result |
|---|---|
| Backend repository creation direction | Select a separate future backend repository as the preferred direction |
| Current repository boundary | Keep `henter36/nashir` as documentation/UI/OpenAPI/draft-contract repository |
| Repository creation in this gate | Not authorized |
| Backend implementation in this gate | Not authorized |
| Migration runner planning | Remains blocked until this decision is reviewed |
| SQL Migration Execution Gate | Remains blocked |

### Deferred items

| Deferred item | Required later gate |
|---|---|
| Final repository name | Backend Repository Creation Decision Review Gate or setup planning gate |
| Repository owner/org and access model | Backend Repository Creation Decision Review Gate or setup planning gate |
| Branch protection and required reviewers | Repository setup planning/review gate |
| Runtime language/framework | Backend stack planning/review gate |
| ORM and database driver | Backend persistence planning/review gate |
| Migration runner | Migration Runner Planning Gate |
| Executable migration path | Executable Migration Path Gate |
| Database configuration | Database Configuration Planning Gate |
| Environment/secrets model | Environment/Secrets Configuration Gate |
| Generated clients | Generated Client Planning Gate |
| API route implementation | Backend implementation gate |

---

## 4. Repository Creation Decision Options

| Option | Benefits | Risks | Governance impact | Access control impact | Contract synchronization impact | Migration execution impact | Implementation readiness impact | Decision |
|---|---|---|---|---|---|---|---|---|
| Create a separate future backend repository | Clean runtime boundary; backend-specific reviews, CI, secrets, and deployment controls; minimal risk of current repo runtime pollution | Cross-repo drift; contract pinning required; repository creation controls still unresolved | Strongest separation between product contracts and backend runtime | Can define backend-specific maintainers, service accounts, branch rules, and secret access | Requires explicit OpenAPI, SQL draft, and Auth/RBAC sync workflow | Best fit for later runner, executable migration path, and database config after gates | Good once name, owner, access, CI, sync, and secrets controls are reviewed | **SELECTED** |
| Use a backend subproject inside current `henter36/nashir` | Easier local contract access; one repository for UI/docs/backend coordination | Higher risk of package, runtime, database config, CI, and generated-client pollution in current repo | Requires strict path ownership and package governance inside the current repo | Harder to isolate backend secrets, service accounts, and deployment permissions | Lower cross-repo friction but higher accidental coupling risk | Could support future execution only after strict path and CI controls | Not ready; would require a stronger reason and explicit monorepo boundary gate | **REJECTED for current direction; may be reconsidered only by later gate** |
| Use a future explicitly approved backend package boundary | Allows a separately reviewed package boundary without deciding repository shape now | Boundary remains abstract until exact path, package manager, ownership, and CI are approved | Requires a dedicated package-boundary decision and review | Access model depends on whether it is repo-level or path-level | Requires the same contract sync controls as other options | No runner or executable path until boundary is concrete | Useful fallback if separate repository is later rejected | **DEFERRED fallback** |
| Defer repository creation | Avoids premature setup and implementation | Blocks backend, runner, executable migration, and SQL execution progress | Safest temporary state but not a creation direction | No new access model exists | No sync workflow exists | Keeps SQL Migration Execution Gate blocked | Does not prepare implementation | **REJECTED as final direction; accepted only as current temporary state** |

---

## 5. Recommended Decision

The recommended decision is to select a separate future backend repository as
the preferred direction for Nashir backend work.

This selection is a direction decision only.

The future repository should be under `henter36` unless a later decision review
approves a different owner or organization.

The current `henter36/nashir` repository remains the documentation, UI,
OpenAPI, and draft-contract repository.

This gate does not create the backend repository.

This gate does not authorize backend implementation.

This gate does not authorize API routes.

This gate does not authorize executable migrations.

This gate does not authorize migration runner setup.

This gate does not authorize package changes.

This gate does not authorize database config or environment/secrets config.

---

## 6. Repository Naming Decision

| Naming item | Decision |
|---|---|
| Repository name selected now | **DEFERRED** |
| Candidate name | `nashir-backend` is the preferred candidate for later review, not a final name |
| Naming convention | Name must include `nashir` and clearly indicate backend ownership |
| Owner/org | Expected to be under `henter36` unless a later gate approves another owner/org |
| Product clarity | Repository name must distinguish Nashir backend runtime from the current Nashir docs/UI/OpenAPI/draft-contract repo |
| Final creation requirement | Separate creation/setup planning and review gate required before repository creation |

Repository naming remains unresolved enough to block actual repository creation.
The candidate name is safe for planning only and must not be treated as a
created or reserved repository.

---

## 7. Ownership and Access Decision

| Ownership/access item | Decision or future requirement |
|---|---|
| Owner/org | Expected `henter36`; final owner/org selection deferred to creation/setup review |
| Minimum access model | Maintain least-privilege access with separate admin, maintainer, write, read, and automation/service-account roles |
| Required reviewers | Future repository must require backend, API contract, security/secrets, and database/migration reviewers before runtime or migration work |
| Branch protection | Required before backend implementation; expected controls include protected default branch, required reviews, required checks, and restricted force pushes |
| CODEOWNERS or equivalent | Required future control before backend implementation or migration runner setup |
| Admin access restrictions | Admin access must be limited and auditable |
| Secrets access restrictions | Secrets access must be limited to explicitly approved maintainers or automation identities |
| Audit expectations | Repository settings, branch protection, secret access, and privileged changes must be reviewable and auditable |

This gate does not create repository settings, branch protection, CODEOWNERS,
secrets, or access-control files.

---

## 8. Contract Synchronization Decision

| Contract area | Decision/control |
|---|---|
| OpenAPI source of truth | `docs/nashir_v1_openapi.yaml` remains API contract authority until a later contract ownership gate changes it |
| SQL migration draft source of truth | SQL schema gates and `docs/migration_contracts/*.sql.md` remain persistence contract authority; `.sql.md` files remain non-executable |
| Auth/RBAC/Workspace Identity source of truth | Auth/RBAC/Workspace Identity gates remain authority for workspace identity, role, permission, and guard expectations |
| Generated client authorization boundary | Generated clients remain blocked until a later generated-client planning/review gate authorizes generation and consumption |
| Versioning/release tagging | Future backend repository must pin consumed contract revisions by commit SHA, release tag, or reviewed equivalent |
| Cross-repo PR dependency rules | Future backend PRs must reference the source contract PR or commit they consume; contract-changing PRs must identify backend impact |
| Drift detection | Future CI or review tooling must detect backend drift from pinned OpenAPI, SQL draft, and Auth/RBAC contract revisions before implementation is accepted |
| Contract sync failure handling | Future backend changes must block or revert when consumed contracts drift without an approved sync plan |

No contract synchronization workflow is implemented in this gate.

---

## 9. Backend Implementation Boundary

The following remain explicitly deferred and unimplemented:

| Backend area | Status |
|---|---|
| Runtime language/framework | DEFERRED |
| ORM | DEFERRED |
| Migration runner | DEFERRED |
| Database driver | DEFERRED |
| Auth implementation | DEFERRED |
| Generated clients | DEFERRED |
| Deployment platform | DEFERRED |
| API route implementation | DEFERRED |

Each deferred backend area requires a later planning and review gate before any
implementation, package, runtime, generated, or deployment artifact is created.

---

## 10. Migration Execution Boundary

| Migration area | Decision |
|---|---|
| SQL Migration Execution Gate | **BLOCKED** |
| Migration runner planning | **BLOCKED** until this creation decision is reviewed |
| Executable migration files | **BLOCKED** |
| Executable migration path | **BLOCKED** |
| Database config | **BLOCKED** |
| Database-applied changes | **BLOCKED** |
| CI/CD migration execution | **BLOCKED** |

No migration execution authorization is created by this gate.

---

## 11. Security and Secrets Decision

| Security area | Future requirement |
|---|---|
| Plaintext secrets in repository | Future backend repository must not store plaintext secrets |
| Plaintext secrets in database schema | Future executable migration authoring and the SQL Migration Execution Gate must verify that all secrets use `credential_ref` and no plaintext secrets are stored |
| Secret references | Secret references must use opaque `credential_ref` or an approved equivalent, not secret values |
| Environment/secrets config | Separate environment/secrets configuration gate required before config exists |
| `audit_events` role separation | Future gate must verify owner/application role separation and UPDATE/DELETE restrictions |
| Database role ownership | Future execution gate must verify real role names, ownership, and owner privilege caveats before execution |
| Branch protection | Future backend repository must enforce protected branch and reviewed changes before secrets or runtime work |
| Secret scanning | Future repository setup must include reviewed secret-scanning expectations before implementation |

This gate does not add secrets, environment files, database config, role SQL, or
secret-scanning configuration.

---

## 12. Remaining Gaps

| Gap | Status | Risk | Blocks repository creation | Blocks backend implementation | Blocks SQL Migration Execution Gate | Required next control |
|---|---|---|---|---|---|---|
| Repository name or approved package boundary | PENDING | Repository may be created with unclear ownership or ambiguous runtime purpose | YES | YES | YES | Decision Review Gate, then creation/setup planning gate |
| Owner/org | PENDING | Wrong owner can weaken governance and access controls | YES | YES | YES | Decide owner/org before creation |
| Access model | PENDING | Excessive write/admin access can bypass review controls | YES | YES | YES | Define access tiers and service accounts before creation |
| Branch protection | PENDING | Runtime or migration changes could merge without review | YES | YES | YES | Define required reviews/checks before creation or first protected branch use |
| Required reviewers | PENDING | Contract, security, and migration risks may lack owners | YES | YES | YES | Assign reviewer categories and CODEOWNERS/equivalent expectations |
| Contract synchronization model | PENDING | OpenAPI, SQL, or Auth/RBAC drift can produce incompatible backend behavior | YES | YES | YES | Define sync, pinning, drift detection, and failure handling |
| `ContentApprovalDecision` re-verification | PENDING | Backend or migration may encode enum values inconsistent with OpenAPI | NO | YES | YES | Re-verify OpenAPI enum before implementation and executable migration authoring |
| Target PostgreSQL / `gen_random_uuid()` verification | PENDING | Future migrations may rely on unavailable UUID function or extension behavior | NO | YES | YES | Verify target PostgreSQL version and `pgcrypto`/UUID support before execution |
| Draft 004 role names and privileges | PENDING | Audit ownership and application privileges may allow tampering or block writes | NO | YES | YES | Record migration/application role names and verify `audit_events` owner/application privileges |
| Runner selection | PENDING | Runner choice can affect lock, checksum, history, rollback, and package boundaries | NO | YES | YES | Migration Runner Planning Gate after backend creation decision review |
| Executable migration path | PENDING | Executable SQL may appear in an unreviewed path | NO | YES | YES | Executable Migration Path Gate |
| Database config | PENDING | Connection strings or database targets may leak or point to wrong environment | NO | YES | YES | Database Configuration Planning Gate |
| Secrets model | PENDING | Secrets may be stored in repo, config, or schema incorrectly | NO | YES | YES | Environment/Secrets Configuration Gate |
| Dry-run/parse tooling | PENDING | Migration defects may reach execution without parse validation | NO | YES | YES | Runner and execution environment planning gates |
| `credential_ref` / no plaintext secrets verification | PENDING | Plaintext API keys, tokens, or credentials may enter schema or data model | NO | YES | YES | Future executable migration authoring and SQL Migration Execution Gate scans |

---

## 13. Risks

| Risk | Severity | Control |
|---|---|---|
| Premature repository creation | HIGH | This gate selects direction only; creation requires separate setup planning and review |
| Wrong repository boundary | HIGH | Decision Review Gate must confirm separate repository direction or approve a different boundary |
| Current repo polluted with runtime files | HIGH | Current `henter36/nashir` remains documentation/UI/OpenAPI/draft-contract only |
| Backend implementation starting too early | HIGH | Backend implementation remains blocked until later implementation gates |
| Migration runner introduced too early | HIGH | Runner planning remains blocked until creation decision review is complete |
| Database config leakage | CRITICAL | No database config is added; future database config requires a dedicated gate |
| Secrets leakage | CRITICAL | No environment/secrets config is added; future secrets model requires a dedicated gate |
| OpenAPI/SQL/Auth/RBAC contract drift | HIGH | Future backend repository must define pinning, drift detection, and sync failure handling |
| Generated client starting too early | HIGH | Generated clients remain blocked until a generated-client planning/review gate |
| Package changes too early | HIGH | No package or lockfile changes are authorized by this gate |
| Execution readiness falsely implied | CRITICAL | SQL Migration Execution Gate remains blocked; this gate does not authorize execution |

---

## 14. PASS / FAIL / WATCH Checklist

| Item | Status | Notes |
|---|---|---|
| Scope compliance | **PASS** | Documentation-only decision gate |
| Repository creation blocked | **PASS** | No repository creation authorized |
| Backend implementation blocked | **PASS** | No backend code or API routes authorized |
| Migration execution blocked | **PASS** | SQL Migration Execution Gate remains blocked |
| Runner blocked | **PASS** | No runner planning or implementation authorized |
| Database config blocked | **PASS** | No database config authorized |
| Package changes blocked | **PASS** | No package or lockfile changes authorized |
| Secrets config blocked | **PASS** | No environment/secrets config authorized |
| Repository decision captured | **PASS** | Separate future backend repository selected as preferred direction |
| Contract synchronization planned | **WATCH** | Controls named, but no sync workflow implemented |
| Remaining gaps identified | **PASS** | Repository, contract, environment, runner, and execution gaps listed |
| No implementation changes | **PASS** | No runtime, backend, migration, package, generated, UI, config, or CI/CD files changed |

---

## 15. GO / NO-GO Decision

Decision: **GO to Backend Repository Creation Decision Review Gate.**

This authorizes only the next planning/review step.

This does not authorize creating a repository.

This does not authorize backend implementation.

This does not authorize API routes.

This does not authorize migration execution.

This does not authorize migration runner implementation or setup.

This does not authorize database-applied changes.

This does not authorize database config.

This does not authorize environment/secrets config.

This does not authorize ORM models.

This does not authorize seed files.

This does not authorize generated clients.

This does not authorize package changes.

This does not authorize UI changes.

This does not authorize CI/CD migration execution.

This does not authorize production or pilot readiness.

---

## 16. Final Summary

| Summary item | Result |
|---|---|
| Inputs | Backend repository creation planning review, boundary review, migration environment planning/review, SQL migration planning/draft gates, OpenAPI, Auth/RBAC, SQL schema, and draft migration contracts |
| Outputs | Documentation-only decision selecting a separate future backend repository as the preferred direction |
| Remaining gaps | Repository name, owner/org, access model, branch protection, required reviewers, contract sync, enum re-verification, PostgreSQL UUID verification, Draft 004 roles, runner, executable path, database config, secrets model, dry-run/parse tooling, and credential verification |
| Decision required before next phase | Backend Repository Creation Decision Review Gate must confirm or correct this direction |
| Recommended next gate | Backend Repository Creation Decision Review Gate |

---

## 17. Verification

| Verification item | Result |
|---|---|
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `git status --short` | PASS - `A docs/nashir_backend_repository_creation_decision_gate.md` |
| `git diff --stat` | PASS - `1 file changed, 438 insertions(+)` |
| `git diff -- docs/` | PASS - new documentation-only decision gate diff reviewed |
| BIDI scan on `docs/nashir_backend_repository_creation_decision_gate.md` | PASS - no BIDI control characters found |
| Search confirming no repository creation files were introduced | PASS - only `docs/nashir_backend_repository_creation_decision_gate.md` changed |
| Search confirming no executable migrations/migration runner/SQL execution/backend/API runtime/ORM/generated/UI/package files changed | PASS - no forbidden runtime, migration, generated, UI, package, backend, or API path changes found |
| Search confirming no `package.json` or `package-lock.json` changes | PASS - no package or lockfile changes found |
| Search confirming no database config or CI/CD migration execution was introduced | PASS - no database config or `.github` changes found |
| Search confirming no environment/secrets config was introduced | PASS - no environment or secrets config changes found |

Verification scope expectation: only
`docs/nashir_backend_repository_creation_decision_gate.md` is changed.
