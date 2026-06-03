# Nashir Backend Repository Creation Review/Setup Planning Gate

| Field | Value |
|---|---|
| Gate type | Backend Repository Creation Review/Setup Planning Gate - documentation only |
| Status | Planning documented — setup decisions pending |
| Date | 2026-06-03 |
| Controlling prerequisite | `docs/nashir_backend_repository_creation_decision_review_gate.md` |
| Selected direction from prior gate | Separate future backend repository as planning direction only |
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

This is the Nashir Backend Repository Creation Review/Setup Planning Gate.

The purpose of this gate is to convert the backend repository creation decision
into a controlled setup plan for a future backend repository.

This gate is planning/review only.

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
| `docs/nashir_backend_repository_creation_decision_review_gate.md` | Controlling prerequisite; authorized this setup planning gate only |

### Direct and contextual inputs

| Input | Role |
|---|---|
| `README.md` | Nashir product and non-production boundary |
| `docs/screen_map.md` | Current UI and mock-only context |
| `docs/nashir_backend_repository_creation_decision_gate.md` | Backend repository creation direction decision |
| `docs/nashir_backend_repository_creation_planning_review_gate.md` | Creation planning review source |
| `docs/nashir_backend_repository_creation_planning_gate.md` | Creation planning source |
| `docs/nashir_backend_repository_boundary_review_gate.md` | Backend repository boundary review source |
| `docs/nashir_backend_repository_migration_execution_environment_planning_review_gate.md` | Confirms backend boundary must precede runner and execution planning |
| `docs/nashir_backend_repository_migration_execution_environment_planning_gate.md` | Backend and migration environment prerequisite planning |
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
| `docs/nashir_v1_openapi.yaml` | OpenAPI and API contract authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/Workspace Identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC/Workspace Identity review authority |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | SQL schema review authority |
| `docs/migration_contracts/*.sql.md` | Non-executable draft migration contract authority |

The OpenAPI, Auth/RBAC/Workspace Identity, SQL schema, and draft migration docs
remain the contract authorities. No contract authority is moved by this gate.

---

## 3. Current Facts vs Setup Decisions vs Deferred Items

### Approved facts from prior gates

| Fact | Source |
|---|---|
| Separate future backend repository is the preferred planning direction | Backend Repository Creation Decision and Decision Review Gates |
| `henter36/nashir` remains documentation/UI/OpenAPI/draft-contract repository | Backend repository boundary and creation gates |
| Actual repository creation is not authorized yet | Backend Repository Creation Decision Review Gate |
| Backend implementation is not authorized yet | Backend repository creation and decision review gates |
| SQL Migration Execution Gate remains blocked | SQL migration execution planning and backend repository gates |
| `docs/migration_contracts/*.sql.md` remain non-executable draft contracts | SQL migration draft and correction gates |

### Setup planning decisions made by this gate

| Setup decision | Result |
|---|---|
| Repository setup must be reviewed before creation | REQUIRED |
| Candidate repository name | `nashir-backend` remains candidate-only |
| Owner/org | Expected `henter36`, final approval pending |
| Access model | Least-privilege role tiers required before creation |
| Branch protection | Required before backend implementation and migration work |
| Required reviewers | Backend, API contract, security/secrets, and database/migration reviewer categories required |
| Contract synchronization | Must cover OpenAPI, SQL drafts, Auth/RBAC/Workspace Identity alignment, pinning, drift detection, dependency rules, and failure handling |
| Actual repository creation in this gate | NOT AUTHORIZED |

### Deferred items

| Deferred item | Required later gate |
|---|---|
| Final repository creation authorization | Backend Repository Creation Authorization Gate |
| Repository settings creation | Backend Repository Creation Setup Review Gate or Authorization Gate |
| Runtime language/framework | Backend stack planning/review gate |
| Package manager | Backend stack or package-boundary planning/review gate |
| ORM and database driver | Backend persistence planning/review gate |
| Migration runner | Migration Runner Planning Gate |
| Executable migration path | Executable Migration Path Gate |
| Database configuration | Database Configuration Planning Gate |
| Environment/secrets model | Environment/Secrets Configuration Gate |
| Generated clients | Generated Client Planning Gate |
| API route implementation | Backend implementation gate |

---

## 4. Repository Setup Scope

The future repository setup review must cover these items before any repository
is created:

| Setup item | Required planning control | Status |
|---|---|---|
| Repository name | Confirm final name and avoid conflict with current repo | PENDING |
| Owner/org | Confirm owner/org and authority to create repository | PENDING |
| Visibility | Decide private/public/internal visibility before creation | PENDING |
| Access model | Define admin, maintainer, write, read, and automation/service-account roles | PENDING |
| Admin restrictions | Limit and audit admin access | PENDING |
| Branch protection | Define protected default branch, review requirements, checks, and force-push restrictions | PENDING |
| Required reviewers | Define reviewer categories and required approvals | PENDING |
| CODEOWNERS or equivalent | Define future ownership routing before implementation | PENDING |
| Required checks | Define minimum checks without adding CI files in this gate | PENDING |
| Secret scanning | Define future secret-scanning expectations before secrets or config exist | PENDING |
| Dependency scanning | Define dependency review/scanning expectations before package changes exist | PENDING |
| Contract synchronization | Define pinning, drift detection, dependency rules, and failure handling | PENDING |
| Issue/PR template expectations | Define future template requirements for contract, security, and migration changes | PENDING |
| Security policy expectations | Define future security reporting and privileged-change expectations | PENDING |

No repository is created by this gate.

---

## 5. Repository Name and Ownership Plan

| Item | Plan |
|---|---|
| Candidate repository name | `nashir-backend` |
| Final name status | PENDING - candidate-only until setup review approves it |
| Naming convention | Repository name must include `nashir` and clearly indicate backend runtime ownership |
| Owner/org | Expected `henter36`, pending final setup review approval |
| Repository creator | Must be an explicitly authorized admin or maintainer approved by a later creation authorization gate |
| Repository administrators | Must be limited to explicitly approved admins with auditable access |
| Repository creation authorization | Requires a separate explicit authorization step after setup review |

This gate does not create, reserve, configure, or initialize the repository.

---

## 6. Access and Governance Setup Plan

| Governance area | Setup requirement |
|---|---|
| Minimum roles | Define admin, maintainer, write, read, and automation/service-account roles |
| Admin restrictions | Admins must be limited, auditable, and separate from ordinary write access where possible |
| Maintainer/write access | Write access must be least-privilege and tied to implementation responsibility |
| Automation identities | Automation/service accounts must be named, scoped, and reviewed before use |
| Required reviewers | Backend, API contract, Auth/RBAC, security/secrets, and database/migration reviewer categories required |
| Branch protection | Default branch must require reviews and required checks before implementation starts |
| Merge strategy | Future setup review must select allowed merge methods and block unreviewed direct pushes |
| Audit expectations | Repository settings, privileged access, branch protection, secrets access, and CI changes must be auditable |
| CODEOWNERS or equivalent | Future repository must route backend, contract, security, and migration-sensitive changes to appropriate reviewers |

No access settings, branch rules, CODEOWNERS, or repository configuration files
are created by this gate.

---

## 7. Contract Synchronization Setup Plan

| Contract area | Future setup control |
|---|---|
| OpenAPI source of truth | `docs/nashir_v1_openapi.yaml` remains API contract authority until a later contract ownership gate changes it |
| SQL migration draft source of truth | SQL schema gates and `docs/migration_contracts/*.sql.md` remain persistence contract authority; `.sql.md` drafts remain non-executable |
| Auth/RBAC/Workspace Identity source of truth | Auth/RBAC/Workspace Identity gates remain authority for workspace identity, roles, permissions, and guards |
| OpenAPI alignment with Auth/RBAC/Workspace Identity design | Future setup must verify OpenAPI reflects Auth/RBAC/Workspace Identity design before backend implementation |
| Authentication schemes | Future sync review must verify OpenAPI security schemes match Auth/RBAC expectations |
| Workspace scoping | Future sync review must verify workspace-scoped routes, identifiers, and tenant boundaries align with Auth/RBAC design |
| Permission expectations | Future sync review must verify endpoint permissions and guard expectations are represented or linked clearly |
| Generated client authorization boundary | Generated clients remain blocked until explicit generated-client planning/review gate |
| Versioning/release tagging | Future backend repo must pin consumed contract revisions by commit SHA, tag, or reviewed equivalent |
| Cross-repo PR dependency rules | Future backend PRs must reference consumed source contract PRs or commits |
| Drift detection | Future CI or review tooling must detect drift from pinned OpenAPI, SQL draft, and Auth/RBAC contract revisions |
| Sync failure handling | Backend changes must block, revert, or require explicit follow-up when consumed contracts drift |

No contract synchronization workflow, CI check, generated client, or backend
consumer is implemented in this gate.

---

## 8. Backend Implementation Boundary

The following remain explicitly deferred and unimplemented:

| Backend area | Status |
|---|---|
| Runtime language/framework | DEFERRED |
| Package manager | DEFERRED |
| ORM | DEFERRED |
| Migration runner | DEFERRED |
| Database driver | DEFERRED |
| Auth implementation | DEFERRED |
| Generated clients | DEFERRED |
| Deployment platform | DEFERRED |
| API route implementation | DEFERRED |

Each deferred backend area requires a later planning/review gate before any
implementation, package, runtime, generated, deployment, or API artifact is
created.

---

## 9. Migration Execution Boundary

| Migration area | Decision |
|---|---|
| SQL Migration Execution Gate | **BLOCKED** |
| Migration runner planning | **BLOCKED** until repository setup planning/review is complete and a later gate authorizes runner planning |
| Executable migration files | **BLOCKED** |
| Executable migration path | **BLOCKED** |
| Database config | **BLOCKED** |
| Database-applied changes | **BLOCKED** |
| CI/CD migration execution | **BLOCKED** |

No migration execution authorization is created by this gate.

---

## 10. Security and Secrets Setup Plan

| Security area | Future setup requirement |
|---|---|
| Plaintext secrets in repository | Future repository must not store plaintext secrets |
| Plaintext secrets in database schema | Future executable migration authoring and SQL Migration Execution Gate must verify that all secrets use `credential_ref` and no plaintext secrets are stored |
| Secret references | Secret references must use opaque `credential_ref` or an approved equivalent, not secret values |
| Environment/secrets config | Separate environment/secrets configuration gate required before config exists |
| `audit_events` role separation | Future gate must verify owner/application role separation and UPDATE/DELETE restrictions |
| Database role ownership | Future execution gate must verify real role names, ownership, and owner privilege caveats |
| Branch protection | Future repository must enforce protected branch expectations before secrets, config, or runtime work |
| Secret scanning | Future setup review must define secret-scanning expectations before implementation |

This gate does not add secrets, environment files, database config, role SQL, or
secret-scanning configuration.

---

## 11. Remaining Gaps

| Gap | Status | Risk | Blocks repository creation | Blocks backend implementation | Blocks SQL Migration Execution Gate | Required next control |
|---|---|---|---|---|---|---|
| Repository name | PENDING | Repository can be created with ambiguous purpose or conflict with current repo | YES | YES | YES | Backend Repository Creation Setup Review Gate |
| Owner/org | PENDING | Wrong owner can weaken governance and access controls | YES | YES | YES | Decide owner/org before creation authorization |
| Visibility | PENDING | Creating repository with incorrect visibility, such as public instead of private, can leak intellectual property | YES | YES | YES | Decide visibility before creation authorization |
| Access model | PENDING | Excessive write/admin access can bypass review controls | YES | YES | YES | Define access tiers and automation identities |
| Admin restrictions | PENDING | Unrestricted admin access can bypass security controls and branch protections | YES | YES | YES | Define admin restriction and auditing controls |
| Branch protection | PENDING | Runtime or migration changes could merge without review | YES | YES | YES | Define protected branch rules and required checks |
| Required reviewers | PENDING | Contract, security, and migration risks may lack accountable reviewers | YES | YES | YES | Assign reviewer categories and CODEOWNERS/equivalent expectations |
| CODEOWNERS or equivalent | PENDING | Lack of explicit ownership routing can lead to unreviewed sensitive changes | YES | YES | YES | Define CODEOWNERS or equivalent rules |
| Required checks | PENDING | Code or migrations could be merged without passing minimum quality and security checks | YES | YES | YES | Define required status checks for protected branches |
| Secret scanning | PENDING | Credentials or API keys could be committed to the repository without detection | YES | YES | YES | Enable secret scanning before repository creation |
| Dependency scanning | PENDING | Vulnerable dependencies could be introduced into the codebase | YES | YES | YES | Enable dependency scanning before package changes |
| Issue/PR template expectations | PENDING | Inconsistent PR descriptions can lead to unreviewed contract or migration changes | YES | YES | YES | Define issue and PR templates |
| Security policy expectations | PENDING | Vulnerabilities might be reported publicly instead of through a secure channel | YES | YES | YES | Define security policy and reporting guidelines |
| Contract sync | PENDING | OpenAPI, SQL, or Auth/RBAC drift can produce incompatible backend behavior, or OpenAPI may not accurately reflect Auth/RBAC/Workspace Identity design | YES | YES | YES | Define pinning, drift detection, dependency rules, failure handling, and verify OpenAPI alignment with Auth/RBAC/Workspace Identity design, including authentication schemes, workspace scoping, and permission expectations |
| `ContentApprovalDecision` enum re-verification | PENDING | Backend or migration may encode enum values inconsistent with OpenAPI | NO | YES | YES | Re-verify OpenAPI enum before implementation and executable migration authoring |
| PostgreSQL UUID / `gen_random_uuid()` verification | PENDING | Future migrations may rely on unavailable UUID function or extension behavior | NO | YES | YES | Verify target PostgreSQL version and `pgcrypto`/UUID support before execution |
| Draft 004 roles | PENDING | Audit ownership and application privileges may allow tampering or block writes | NO | YES | YES | Record migration/application role names and verify `audit_events` owner/application privileges |
| Runner | PENDING | Runner choice can affect lock, checksum, history, rollback, and package boundaries | NO | YES | YES | Migration Runner Planning Gate after setup planning permits it |
| Executable path | PENDING | Executable SQL may appear in an unreviewed path | NO | YES | YES | Executable Migration Path Gate |
| Database config | PENDING | Connection strings or database targets may leak or point to wrong environment | NO | YES | YES | Database Configuration Planning Gate |
| Secrets model | PENDING | Secrets may be stored in repo, config, or schema incorrectly | NO | YES | YES | Environment/Secrets Configuration Gate |
| Dry-run/parse tooling | PENDING | Migration defects may reach execution without parse validation | NO | YES | YES | Runner and execution environment planning gates |
| Credential verification | PENDING | Plaintext API keys, tokens, or credentials may enter schema or data model | NO | YES | YES | Future credential_ref/no plaintext secrets scans |

---

## 12. Risks

| Risk | Severity | Control |
|---|---|---|
| Premature repository creation | HIGH | This gate does not authorize creation; setup review and authorization gates remain required |
| Wrong repository boundary | HIGH | Separate future backend repository remains selected as planning direction only |
| Current repo polluted with runtime files | HIGH | Current `henter36/nashir` remains documentation/UI/OpenAPI/draft-contract only |
| Backend implementation starting too early | HIGH | Backend implementation remains blocked until later implementation gates |
| Migration runner introduced too early | HIGH | Runner planning remains blocked until setup review and later runner gate authorize it |
| Database config leakage | CRITICAL | No database config is added; future config requires dedicated gate |
| Secrets leakage | CRITICAL | No environment/secrets config is added; future secrets model requires dedicated gate |
| OpenAPI/SQL/Auth/RBAC contract drift | HIGH | Future setup must define pinning, drift detection, dependency rules, failure handling, and Auth/RBAC alignment checks |
| Generated client starting too early | HIGH | Generated clients remain blocked until a generated-client planning/review gate |
| Package changes too early | HIGH | No package or lockfile changes are authorized by this gate |
| Execution readiness falsely implied | CRITICAL | SQL Migration Execution Gate remains blocked; this gate does not authorize execution |
| Repository created without branch protection or required reviewers | HIGH | Setup review must approve branch protection, required checks, and reviewer routing before creation authorization |

---

## 13. PASS / FAIL / WATCH Checklist

| Item | Status | Notes |
|---|---|---|
| Scope compliance | **PASS** | Documentation-only setup planning gate |
| Repository creation blocked | **PASS** | No repository creation authorized |
| Repository setup plan completeness | **WATCH** | Setup controls are named, but final values remain pending |
| Backend implementation blocked | **PASS** | No backend code or API routes authorized |
| Migration execution blocked | **PASS** | SQL Migration Execution Gate remains blocked |
| Runner blocked | **PASS** | No runner planning or implementation authorized |
| Database config blocked | **PASS** | No database config authorized |
| Package changes blocked | **PASS** | No package or lockfile changes authorized |
| Secrets config blocked | **PASS** | No environment/secrets config authorized |
| Contract synchronization planned | **WATCH** | Controls are named, but no sync workflow is implemented |
| Remaining gaps identified | **PASS** | Repository, contract, environment, runner, and execution gaps listed |
| No implementation changes | **PASS** | No runtime, backend, migration, package, generated, UI, config, or CI/CD files changed |

---

## 14. GO / NO-GO Decision

Decision: **GO to Backend Repository Creation Setup Review Gate.**

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

## 15. Final Summary

| Summary item | Result |
|---|---|
| Inputs | Backend repository creation decision review gate, decision/planning gates, boundary review, migration environment planning/review, SQL migration planning/draft gates, OpenAPI, Auth/RBAC/Workspace Identity, SQL schema, and draft migration contracts |
| Outputs | Documentation-only setup plan defining controls required before future backend repository creation |
| Remaining gaps | Repository name, owner/org, visibility, access model, branch protection, required reviewers, contract sync, enum re-verification, PostgreSQL UUID verification, Draft 004 roles, runner, executable path, database config, secrets model, dry-run/parse tooling, and credential verification |
| Decision required before next phase | Setup review must confirm or correct repository name, owner/org, access model, branch protection, required reviewers, and contract synchronization controls |
| Recommended next gate | Backend Repository Creation Setup Review Gate |

---

## 16. Verification

| Verification item | Result |
|---|---|
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `git status --short` | PASS - `A docs/nashir_backend_repository_creation_review_setup_planning_gate.md` |
| `git diff --stat` | PASS - `1 file changed, 437 insertions(+)` |
| `git diff -- docs/` | PASS - new documentation-only setup planning gate diff reviewed |
| BIDI scan on `docs/nashir_backend_repository_creation_review_setup_planning_gate.md` | PASS - no BIDI control characters found |
| Search confirming no repository creation files were introduced | PASS - only `docs/nashir_backend_repository_creation_review_setup_planning_gate.md` changed |
| Search confirming no executable migrations/migration runner/SQL execution/backend/API runtime/ORM/generated/UI/package files changed | PASS - no forbidden runtime, migration, generated, UI, package, backend, or API path changes found |
| Search confirming no `package.json` or `package-lock.json` changes | PASS - no package or lockfile changes found |
| Search confirming no database config or CI/CD migration execution was introduced | PASS - no database config or `.github` changes found |
| Search confirming no environment/secrets config was introduced | PASS - no environment or secrets config changes found |

Verification scope expectation: only
`docs/nashir_backend_repository_creation_review_setup_planning_gate.md` is
changed.
