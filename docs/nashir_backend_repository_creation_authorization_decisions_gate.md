# Nashir Backend Repository Creation Authorization Decisions Gate

| Field | Value |
|---|---|
| Gate type | Backend Repository Creation Authorization Decisions Gate - documentation only |
| Status | Decisions complete |
| Date | 2026-06-04 |
| Primary reviewed artifacts | `docs/nashir_backend_repository_creation_authorization_correction_review_gate.md`, `docs/nashir_backend_repository_creation_authorization_final_review_follow_up_gate.md`, `docs/nashir_backend_repository_creation_authorization_final_review_gate.md` |
| Controlling prerequisite | `docs/nashir_backend_repository_creation_authorization_correction_review_gate.md` |
| Upstream selected direction | Separate future backend repository as planning direction only |
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

This is the Nashir Backend Repository Creation Authorization Decisions Gate.

This is not another review-loop gate.

The purpose of this gate is to separate repository-creation blockers from
backend-implementation blockers and SQL migration execution blockers, so the
authorization path can stop repeating the same unresolved list.

This gate is decision-only.

This gate is documentation-only.

This gate does not create a repository.

This gate does not authorize repository creation.

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

### Direct and contextual inputs

| Input | Role |
|---|---|
| `README.md` | Nashir product and non-production boundary |
| `docs/screen_map.md` | Current UI and mock-only context |
| `docs/nashir_backend_repository_creation_authorization_correction_review_gate.md` | Immediate correction-review context |
| `docs/nashir_backend_repository_creation_authorization_final_review_follow_up_gate.md` | Immediate loop context; follow-up classification source |
| `docs/nashir_backend_repository_creation_authorization_final_review_gate.md` | Final NO-GO source |
| `docs/nashir_backend_repository_creation_authorization_follow_up_review_gate.md` | Prior follow-up review source |
| `docs/nashir_backend_repository_creation_authorization_follow_up_gate.md` | Prior follow-up gate source |
| `docs/nashir_backend_repository_creation_authorization_review_gate.md` | Authorization review source |
| `docs/nashir_backend_repository_creation_authorization_planning_gate.md` | Authorization planning source |
| `docs/nashir_backend_repository_creation_setup_review_gate.md` | Setup review source |
| `docs/nashir_backend_repository_creation_review_setup_planning_gate.md` | Setup planning source |
| `docs/nashir_backend_repository_creation_decision_review_gate.md` | Creation decision review source |
| `docs/nashir_backend_repository_creation_decision_gate.md` | Creation direction decision source |
| `docs/nashir_backend_repository_creation_planning_review_gate.md` | Creation planning review source |
| `docs/nashir_backend_repository_creation_planning_gate.md` | Creation planning source |
| `docs/nashir_backend_repository_boundary_review_gate.md` | Backend repository boundary review source |
| `docs/nashir_backend_repository_migration_execution_environment_planning_review_gate.md` | Migration environment review source |
| `docs/nashir_backend_repository_migration_execution_environment_planning_gate.md` | Migration environment planning source |
| `docs/nashir_v1_openapi.yaml` | API contract authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/Workspace Identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC/Workspace Identity review authority |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | SQL schema review authority |
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
remain the contract authorities.

---

## 3. Loop Diagnosis

Prior review gates repeatedly produced the same unresolved blocker list.

That blocker list mixes three categories:

1. repository creation prerequisites
2. backend implementation prerequisites
3. SQL migration execution prerequisites

Continuing with another final review re-run before decisions are made is likely
to reproduce NO-GO.

The purpose of this gate is to make the missing decisions explicit and classify
the blockers into the categories above.

---

## 4. Decision Taxonomy

| Category | Meaning | Example controls |
|---|---|---|
| Blocks empty governed backend repository creation | Must be decided before a new empty backend repository can be authorized | repository name, owner/org, visibility, access model, branch protection, required reviewers, CODEOWNERS/equivalent, required checks, admin restrictions, secret scanning, dependency scanning, issue/PR templates, security policy, minimal contract sync workflow |
| Blocks backend implementation only | May still allow an empty governed repository, but blocks runtime/backend work | runtime language/framework, package manager, ORM, database driver, auth implementation, API route implementation, generated clients, deployment platform, environment/secrets config |
| Blocks SQL migration execution only | May still allow an empty governed repository or backend planning, but blocks execution | ContentApprovalDecision enum verification, PostgreSQL UUID / `gen_random_uuid()` verification, Draft 004 roles, migration runner, executable path, database config, secrets model, dry-run/parse tooling, credential verification, audit_events role separation |
| Blocks production/pilot readiness only | Does not block repository creation or backend planning, but blocks claims of readiness | production controls, pilot controls, operational hardening, deployment approval |
| Does not block repository creation but must be tracked later | Deferred future work that should be recorded, but should not delay empty repo authorization if creation prerequisites are resolved | generated client boundary, detailed backend stack choice, migration runner selection details once a repo exists |

---

## 5. Repository Creation Decision Table

| Item | Decision | Decision value | Blocks repository creation | Blocks backend implementation | Blocks SQL Migration Execution Gate | Required next control |
|---|---|---|---|---|---|---|
| Repository name | STILL PENDING | No final name approved | YES | YES | YES | Decide repository name before creation authorization |
| Owner/org | STILL PENDING | No explicit approval; current repo context is `henter36/nashir` but not an authorization decision | YES | YES | YES | Decide owner/org before creation authorization |
| Visibility | STILL PENDING | No explicit approval; private/internal recommended by governance pattern, but not authorized | YES | YES | YES | Decide visibility before creation authorization |
| Access model | STILL PENDING | Minimum-maintainer/write/admin model required, but not finalized | YES | YES | YES | Decide access model before creation authorization |
| Branch protection | DECIDED | Required before any repository creation authorization | YES | YES | YES | Record protected-branch rules before creation authorization |
| Required reviewers | DECIDED | Required before any repository creation authorization | YES | YES | YES | Record reviewer categories before creation authorization |
| CODEOWNERS or equivalent | DECIDED | Required for ownership routing and protected-branch review flow | YES | YES | YES | Define CODEOWNERS/equivalent before creation authorization |
| Required checks | DECIDED | Must exist for protected branches before creation authorization | YES | YES | YES | Define required checks before creation authorization |
| Admin restrictions | DECIDED | Must limit privileged actions and keep them auditable | YES | YES | YES | Record admin restrictions before creation authorization |
| Secret scanning | DECIDED | Required repository governance prerequisite | YES | YES | YES | Enable secret scanning before creation authorization |
| Dependency scanning | DECIDED | Required repository governance prerequisite | YES | YES | YES | Enable dependency scanning before creation authorization |
| Issue/PR templates | DECIDED | Required repository governance prerequisite | YES | YES | YES | Define issue and PR templates before creation authorization |
| Security policy | DECIDED | Required repository governance prerequisite | YES | YES | YES | Define security policy before creation authorization |
| Contract sync workflow | STILL PENDING | Minimal repository-creation sync policy must be defined; full workflow also needed later for backend implementation | YES | YES | YES | Define minimal sync policy before creation authorization |

Repository creation prerequisites are not fully decided. This gate does not
authorize creation.

---

## 6. Backend Implementation Blocker Table

| Item | Status | Blocks repository creation | Blocks backend implementation | Blocks SQL Migration Execution Gate | Next control |
|---|---|---|---|---|---|
| Runtime language/framework | DEFERRED | NO | YES | YES | Decide in a later backend stack planning gate |
| Package manager | DEFERRED | NO | YES | YES | Decide in a later backend stack planning gate |
| ORM | DEFERRED | NO | YES | YES | Decide in a later backend stack planning gate |
| Database driver | DEFERRED | NO | YES | YES | Decide in a later backend stack planning gate |
| Auth implementation | DEFERRED | NO | YES | YES | Decide in a later backend stack planning gate |
| API route implementation | DEFERRED | NO | YES | YES | Decide in a later backend implementation gate |
| Generated clients | DEFERRED | NO | YES | YES | Decide in a later client-generation gate |
| Deployment platform | DEFERRED | NO | YES | YES | Decide in a later deployment planning gate |
| Environment/secrets config | DEFERRED | NO | YES | YES | Decide in a later environment/secrets gate |

These items do not block empty governed repository creation directly, but they
must remain blocked until backend implementation planning occurs.

---

## 7. SQL Migration Execution Blocker Table

| Item | Status | Blocks repository creation | Blocks backend implementation | Blocks SQL Migration Execution Gate | Next control |
|---|---|---|---|---|---|
| `ContentApprovalDecision` enum re-verification | STILL PENDING | NO | YES | YES | Re-verify OpenAPI enum before migration authoring/execution |
| PostgreSQL UUID / `gen_random_uuid()` verification | STILL PENDING | NO | YES | YES | Verify target PostgreSQL version and extension support |
| Draft 004 roles | STILL PENDING | NO | YES | YES | Record application and migration role names and privileges |
| Migration runner | DEFERRED | NO | YES | YES | Decide runner in a later runner planning gate |
| Executable path | DEFERRED | NO | YES | YES | Approve executable path in a later execution-planning gate |
| Database config | DEFERRED | NO | YES | YES | Define database configuration in a later gate |
| Secrets model | DEFERRED | NO | YES | YES | Define environment/secrets model in a later gate |
| Dry-run/parse tooling | DEFERRED | NO | YES | YES | Approve runner and dry-run tooling in later gates |
| Credential verification | DEFERRED | NO | YES | YES | Require future `credential_ref` and no plaintext secrets scans |
| `audit_events` role separation | STILL PENDING | NO | YES | YES | Verify owner/application separation and UPDATE/DELETE restrictions |

These items block execution, not empty governed repository creation.

---

## 8. Repository Creation Readiness Decision

**NOT READY for repository creation authorization** because one or more
repository-creation prerequisites remain STILL PENDING.

The unresolved repository-creation prerequisites are:

- repository name
- owner/org
- visibility
- access model
- contract sync workflow

Branch protection, required reviewers, CODEOWNERS/equivalent, required checks,
admin restrictions, secret scanning, dependency scanning, issue/PR templates,
and security policy are decided as governance prerequisites, but the creation
authorization still requires the unresolved repository-creation items above to
be decided together with the governance controls.

No actual repository creation is authorized by this gate.

---

## 9. Minimum Criteria for the Next Gate

Before opening another final review/re-run gate, the following must be decided:

1. repository name decided
2. owner/org decided
3. visibility decided
4. access model decided
5. branch protection decided
6. required reviewers decided
7. minimal contract sync workflow decided
8. explicit statement recorded that backend/migration blockers do not block
   creating an empty governed repository, but they do block implementation and
   execution

If these are decided, a later separate creation authorization gate can review
whether to authorize creating an empty governed backend repository. This gate
does not perform that authorization.

---

## 10. Backend Implementation Boundary

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

These remain backend implementation decisions only.

---

## 11. Migration Execution Boundary

| Migration area | Review result | Notes |
|---|---|---|
| SQL Migration Execution Gate | BLOCKED | Repository creation, runner, executable path, config, secrets, and environment readiness remain incomplete |
| Migration runner planning | BLOCKED | Runner planning remains blocked unless a later gate explicitly authorizes it |
| Executable migration files | BLOCKED | No executable `.sql` files are created or authorized |
| Database config | BLOCKED | No database connection config is introduced |
| Database-applied changes | BLOCKED | No SQL is executed or applied |

SQL migration execution remains blocked.

---

## 12. Contract Synchronization Decision

| Contract control | Status | Notes |
|---|---|---|
| OpenAPI source of truth | RESOLVED | `docs/nashir_v1_openapi.yaml` remains the API contract authority |
| SQL migration draft source of truth | RESOLVED | SQL schema gates and `.sql.md` drafts remain persistence contract authority |
| Auth/RBAC/Workspace Identity source of truth | RESOLVED | Auth/RBAC/Workspace Identity gates remain authority for workspace identity, roles, permissions, and guards |
| Auth/RBAC/Workspace Identity before OpenAPI | STILL PENDING | Lifecycle rule must be preserved before defining/modifying OpenAPI |
| Authentication schemes | STILL PENDING | Must be represented consistently in OpenAPI and future backend auth |
| Workspace scoping | STILL PENDING | Must be represented consistently in OpenAPI and future backend routes |
| Permission expectations | STILL PENDING | Must be represented consistently in OpenAPI and future backend guards |
| Minimum sync workflow required before repository creation authorization | STILL PENDING | A minimal repository-creation sync policy must be defined before creation authorization |
| Full sync workflow required before backend implementation | STILL PENDING | Full pinned-contract workflow, drift detection, and failure handling required later |
| Generated client | BLOCKED | Generated clients remain blocked until a later generated-client planning/review gate |

OpenAPI/Auth/RBAC alignment is required before backend implementation, but a
minimal repository-creation sync policy must exist before any repository-creation
authorization.

---

## 13. Security and Secrets Decision

| Security control | Status | Notes |
|---|---|---|
| No plaintext secrets in repo | RESOLVED | Future repository must not store plaintext secrets |
| No plaintext secrets in database schema | RESOLVED | Future executable migration authoring and SQL Migration Execution Gate must verify `credential_ref` and no plaintext secrets |
| `credential_ref` only for secrets references | RESOLVED | Secret references must be opaque references or approved equivalent, not secret values |
| Environment/secrets config | BLOCKED | Backend/execution prerequisite; not allowed in this gate |
| Secret scanning | DECIDED | Repository-governance prerequisite before creation authorization |
| Secrets model | BLOCKED | Backend/execution prerequisite; not allowed in this gate |

Security governance must be present before creation authorization, while
environment/secrets and secrets-model details remain blocked for backend and
execution planning.

---

## 14. Risks

| Risk | Severity | Assessment |
|---|---|---|
| Continuing the review loop without decisions | HIGH | This gate exists to stop repeating the same NO-GO list |
| Premature repository creation | HIGH | Creation remains blocked until repository-creation prerequisites are decided |
| Repository created with wrong visibility | HIGH | Visibility must be decided before creation authorization |
| Repository created without branch protection | HIGH | Branch protection must be decided before creation authorization |
| Repository created without required reviewers | HIGH | Required reviewers must be decided before creation authorization |
| Repository created without CODEOWNERS/equivalent | HIGH | Ownership routing must be decided before creation authorization |
| Backend implementation starting too early | HIGH | Backend implementation decisions remain deferred |
| Migration runner introduced too early | HIGH | Migration execution decisions remain blocked |
| Database config leakage | CRITICAL | Database config remains a blocked execution prerequisite |
| Secrets leakage | CRITICAL | Secrets model and environment/secrets config remain blocked execution prerequisites |
| OpenAPI/SQL/Auth/RBAC contract drift | HIGH | Contract sync workflow must be decided before creation authorization and fully defined before implementation |
| Execution readiness falsely implied | CRITICAL | This gate does not imply backend or migration readiness |

---

## 15. PASS / FAIL / WATCH Checklist

| Item | Status | Notes |
|---|---|---|
| Loop diagnosis completed | **PASS** | Repeated review loop identified |
| Repository creation blockers separated | **PASS** | Creation blockers are separated from backend/execution blockers |
| Backend implementation blockers separated | **PASS** | Backend-only blockers are separated |
| SQL migration execution blockers separated | **PASS** | Execution-only blockers are separated |
| Repository creation not authorized | **PASS** | No repository creation authorization is granted |
| Backend implementation blocked | **PASS** | Backend implementation remains blocked |
| Migration execution blocked | **PASS** | SQL Migration Execution Gate remains blocked |
| Runner blocked | **PASS** | Runner remains deferred/blocked |
| Database config blocked | **PASS** | Database config remains blocked |
| Package changes blocked | **PASS** | No package or lockfile changes are authorized |
| Secrets config blocked | **PASS** | Environment/secrets config remains blocked |
| No implementation changes | **PASS** | No runtime/backend/migration/package/generated/UI/config/CI/CD changes |

---

## 16. GO / NO-GO Decision

Decision: **GO to Backend Repository Creation Authorization Decision Follow-up Gate.**

This authorizes only the next documentation/planning/review step.

This does not authorize creating a repository.

This does not authorize backend implementation.

This does not authorize API routes.

This does not authorize migration execution.

This does not authorize migration runner.

This does not authorize database-applied changes.

This does not authorize database config.

This does not authorize environment/secrets config.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize package changes.

This does not authorize production or pilot readiness.

---

## 17. Final Summary

| Summary item | Result |
|---|---|
| Inputs | Correction review, final-review follow-up gate, final review gate, prior follow-up/review gates, planning/setup gates, boundary review, OpenAPI, Auth/RBAC/Workspace Identity, SQL schema, and draft migration contracts |
| Outputs | Documentation-only decisions gate separating repository-creation blockers from backend and SQL execution blockers |
| Decisions made | Repository creation prerequisites remain unresolved; backend implementation blockers remain deferred; SQL migration execution blockers remain blocked |
| Repository creation blockers remaining | repository name, owner/org, visibility, access model, contract sync workflow, plus governance prerequisites that must be decided before creation authorization |
| Backend implementation blockers deferred | runtime/framework, package manager, ORM, database driver, auth implementation, API routes, generated clients, deployment platform, environment/secrets config |
| SQL migration execution blockers deferred | enum re-verification, PostgreSQL UUID verification, Draft 004 roles, runner, executable path, database config, secrets model, dry-run/parse tooling, credential verification, audit_events role separation |
| Recommended next gate | Backend Repository Creation Authorization Decision Follow-up Gate |

---

## 18. Verification

| Verification item | Result |
|---|---|
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `git status --short` | PASS - `?? docs/nashir_backend_repository_creation_authorization_decisions_gate.md` before commit |
| `git diff --stat` | PASS - one documentation file added |
| `git diff -- docs/` | PASS - new documentation-only decisions gate diff reviewed |
| BIDI scan on `docs/nashir_backend_repository_creation_authorization_decisions_gate.md` | PASS - no BIDI control characters found |
| Search confirming no repository creation files were introduced | PASS - only the new docs decisions gate is present |
| Search confirming no executable migrations/migration runner/SQL execution/backend/API runtime/ORM/generated/UI/package files changed | PASS - no forbidden runtime, migration, generated, UI, package, backend, or API path changes found |
| Search confirming no `package.json` or `package-lock.json` changes | PASS - no package or lockfile changes found |
| Search confirming no database config or CI/CD migration execution was introduced | PASS - no database config or `.github` changes found |
| Search confirming no environment/secrets config was introduced | PASS - no environment or secrets config changes found |

Verification completed after writing the file and before commit.
