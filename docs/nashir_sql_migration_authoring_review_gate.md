# Nashir SQL Migration Authoring Review Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Authoring Review Gate - documentation only |
| Status | Review complete |
| Date | 2026-06-03 |
| Primary reviewed artifact | `docs/nashir_sql_migration_authoring_gate.md` |
| Controlling migration inputs | `docs/nashir_sql_migration_planning_gate.md`; `docs/nashir_sql_migration_planning_review_gate.md` |
| Controlling schema inputs | `docs/nashir_sql_schema_authoring_gate.md`; `docs/nashir_sql_schema_authoring_review_gate.md` |
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

This is the Nashir SQL Migration Authoring Review Gate.

The purpose of this gate is to review the merged SQL Migration Authoring Gate
output and decide whether the documented migration authoring is sufficient to
proceed to the next planning or review step.

This gate does not introduce executable migrations.

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

---

## 2. Inputs Reviewed

### Direct inputs

| Input | Review use |
|---|---|
| `docs/nashir_sql_migration_authoring_gate.md` | Primary reviewed artifact |
| `docs/nashir_sql_migration_planning_gate.md` | Controlling migration scope, file strategy, sequence, safety, tenancy, credential, audit, and verification requirements |
| `docs/nashir_sql_migration_planning_review_gate.md` | Review decision that authorized the SQL Migration Authoring Gate |
| `docs/nashir_sql_schema_authoring_gate.md` | Schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |

### Contextual inputs

| Input | Review use |
|---|---|
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |
| `docs/nashir_sql_schema_authoring_planning_gate.md` | Schema authoring planning context |
| `docs/nashir_sql_schema_authoring_planning_review_gate.md` | Schema authoring planning review context |
| `docs/nashir_sql_schema_planning_gate.md` | Persistence planning baseline |
| `docs/nashir_sql_schema_planning_review_gate.md` | Persistence planning review baseline |
| `docs/nashir_v1_openapi.yaml` | Current OpenAPI contract authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |
| ERD/Data Model Gate and Review Gate | Entity and relationship source |
| Backend/API Strategy Gate and Review Gate | Backend/API strategy context |

### Authority check

| Authority | Result | Assessment |
|---|---|---|
| Nashir is the product, UI journey, scope, API contract, SQL schema contract, and data model authority | **PASS** | Review uses Nashir docs and OpenAPI as controlling sources |
| marketing-os is reference-only | **PASS** | No marketing-os code, migration files, runner scripts, entities, backend shape, or runtime assumptions are copied |
| SQL Migration Planning Gate and Review Gate control migration inputs | **PASS** | Authoring gate cites planning gate and planning review gate as controlling inputs |
| SQL Schema Authoring Gate and Review Gate are schema authority | **PASS** | Authoring gate follows the reviewed schema contract |

---

## 3. Scope Compliance Review

| Scope item | Result | Assessment |
|---|---|---|
| Documentation/review only | **PASS** | Authoring gate creates one Markdown file only |
| Nashir-first | **PASS** | Authoring gate is grounded in Nashir gates and OpenAPI |
| marketing-os reference-only | **PASS** | No extraction, code copy, or runtime-shape import |
| No executable migrations | **PASS** | Authoring gate explicitly confirms no migration files created |
| No migration runner | **PASS** | Runner remains prohibited; gate confirms no runner introduced |
| No database-applied changes | **PASS** | No SQL is executed or applied to any database |
| No backend/API runtime implementation | **PASS** | No source, route, handler, service, middleware, or runtime files changed |
| No ORM models | **PASS** | No model layer introduced |
| No seed files | **PASS** | Role/permission seeds remain unauthorized |
| No generated client | **PASS** | No generated/runtime client produced |
| No UI/package changes | **PASS** | No UI, `package.json`, lockfile, or build files changed |
| No production/pilot readiness claim | **PASS** | Authoring gate makes no production or database readiness claim |
| No database readiness claim | **PASS** | Authoring gate explicitly states database readiness is not claimed |

---

## 4. Migration Authoring Output Review

| Output classification item | Result | Assessment |
|---|---|---|
| Output correctly stated as documentation-only | **PASS** | Header table and scope decision section both confirm documentation-only output |
| No migration draft files created | **PASS** | Gate explicitly states migration draft files are not created because final file location and runner/framework remain unresolved |
| Reason for deferral documented | **PASS** | Gate identifies six unresolved decisions that block migration file authoring: file location, repository boundary, runner approval, rollback convention, exact allowed paths, and parse verification tooling |
| No migration execution | **PASS** | Gate confirms no SQL executed or applied |
| No migration runner | **PASS** | Gate confirms no migration runner introduced |
| No package changes | **PASS** | Gate confirms no package or build changes |
| No database-applied changes | **PASS** | Gate confirms no database commands executed and no migration files created |
| Separate review required before execution/runtime work | **PASS** | Gate states this review gate is required before any later migration execution, runner setup, database application, backend, ORM, seed, generated-client, package, or UI work |

No output classification blocker was found.

---

## 5. Migration File Strategy Review

| Strategy item | Result | Assessment |
|---|---|---|
| Migration directory decision or deferral | **PASS** | Gate explicitly defers directory; states no approved final location exists |
| Naming convention | **PASS** | Sortable timestamped, numbered, descriptive format documented: `YYYYMMDDHHMM__nashir_v1_###_<short_description>.sql` |
| Candidate filenames labeled planning-only | **PASS** | Gate states explicitly that no file with any candidate name is created by this gate |
| Sequencing convention | **PASS** | Sequenced by dependency group; consistent with planning gate |
| Baseline vs sequenced decision | **PASS** | Sequenced approach confirmed as preferred over one large baseline |
| Up/down expectation | **PASS** | Deferred; gate notes future gate must select down files, down sections, or forward-only corrective migrations |
| Rollback expectation | **PASS** | Gate requires rollback to be documented before executable migration artifacts exist |
| Metadata tracking expectation | **PASS** | Future metadata fields documented: filename, order, timestamp, checksum/hash, status, runner version if any, failure details |
| Parse/verification expectation | **PASS** | Future authoring must provide parse or dry-run verification if SQL files are created |
| Unresolved decisions deferred | **PASS** | Six blocking items are enumerated and control conditions are stated |

No file-strategy blocker was found.

---

## 6. Migration Sequence Review

### Foundation identity/tenant tables

| Check | Result | Assessment |
|---|---|---|
| Tables: `workspaces`, `users`, `workspace_members` | **PASS** | Correctly positioned first in sequence |
| Dependency order | **PASS** | Foundation tables establish tenant root, global identity, and authorization binding before any merchant-owned rows |
| Rollback risk | **PASS** | HIGH risk flagged because downstream tables depend on foundation FKs |
| Cross-workspace constraint risk | **PASS** | WorkspaceMember user/workspace uniqueness and membership status must not leak across workspaces |
| V1 required vs deferred | **PASS** | V1 required with no ambiguity |
| Authoring output | **PASS** | Documented only; no migration file |

### Store/product/source tables

| Check | Result | Assessment |
|---|---|---|
| Tables: `store_profiles`, `products`, `data_sources`, `channel_connections`, `integration_credentials` | **PASS** | Correctly follows foundation tables |
| Dependency order | **PASS** | Positioned after foundation tables; establishes store, catalog, source/channel, and credential boundary before campaigns/content |
| Rollback risk | **PASS** | MEDIUM risk flagged; credential target rollback requires care |
| Cross-workspace constraint risk | **PASS** | Same-workspace FKs required for source/channel/credential links |
| V1 required vs deferred | **PASS** | V1 required; provider implementation deferred; distinction is clear |
| Authoring output | **PASS** | Documented only; no migration file |

### Asset/campaign/content tables

| Check | Result | Assessment |
|---|---|---|
| Tables: `assets`, `campaigns`, `campaign_briefs`, `campaign_content_items`, `content_drafts`, `content_approvals` | **PASS** | Correctly positioned after foundation and store/product/source context |
| Dependency order | **PASS** | Creative and approval lifecycle positioned after tenant and source context |
| Rollback risk | **PASS** | HIGH risk flagged; content lifecycle FKs and immutable approvals require careful rollback |
| Cross-workspace constraint risk | **PASS** | Same-workspace campaign/content/draft/approval constraints required |
| V1 required vs deferred | **PASS** | V1 required with no ambiguity |
| Authoring output | **PASS** | Documented only; no migration file |

### Publishing/analytics/audit tables

| Check | Result | Assessment |
|---|---|---|
| Tables: `publishing_jobs`, `publishing_statuses`, `analytics_snapshots`, `audit_events` | **PASS** | Correctly positioned after campaign/content/channel resources |
| Dependency order | **PASS** | Operational queues, lineage, and append-only audit after resources exist |
| Rollback risk | **PASS** | HIGH risk flagged; append-only trail tables should not be destructively changed |
| Cross-workspace constraint risk | **PASS** | Workspace-scoped operational data; no cross-workspace analytics aggregation |
| V1 required vs deferred | **PASS** | V1 required with no ambiguity |
| Authoring output | **PASS** | Documented only; no migration file |

### Support/reference tables

| Check | Result | Assessment |
|---|---|---|
| Tables: `idempotency_keys`; `roles`, `permissions`, `role_permissions` as Auth/RBAC reference candidates | **PASS** | Correctly treated as support/reference candidates only |
| Dependency order | **PASS** | Correctly positioned after foundation and established Auth/RBAC design |
| Rollback risk | **PASS** | MEDIUM risk flagged; seed/reference coupling must be avoided |
| Cross-workspace constraint risk | **PASS** | Idempotency uniqueness includes workspace, operation, actor/member, and key |
| V1 required vs deferred | **PASS** | Support/reference candidates; no seed/runtime RBAC implementation authorized |
| Authoring output | **PASS** | Documented only; no migration file or seed file |

No sequencing blocker was found.

---

## 7. Safety Rules Review

| Safety rule | Result | Assessment |
|---|---|---|
| No destructive DDL unless explicitly approved | **PASS** | Destructive DDL is NO-GO without explicit review |
| Additive-first strategy | **PASS** | Additive migration posture preserved |
| Hard delete deferred unless approved | **PASS** | Hard delete remains blocked without later approval |
| Table drops forbidden unless separately approved | **PASS** | Drop operations remain blocked |
| Column drops forbidden unless separately approved | **PASS** | Drop operations remain blocked |
| Type narrowing forbidden unless separately reviewed | **PASS** | Type narrowing blocked |
| Restrict/no cascade default | **PASS** | Restrict/no cascade is default; CASCADE requires explicit justification and review |
| No plaintext credential columns | **PASS** | Raw API keys, OAuth tokens, vault secret values, provider secrets, and passwords are forbidden |
| No cross-workspace leakage | **PASS** | Same-workspace constraints required where simple FKs are insufficient |
| Idempotent migration execution expectations | **PASS** | Runner metadata or reviewed idempotent mechanism required before execution |
| Rollback expectations before executable artifacts | **PASS** | Rollback must be defined before executable migration files exist |
| Transaction boundary expectations | **PASS** | Per-migration transaction boundaries planned; non-transactional DDL requires explicit identification and review |
| Long-running lock risk assessment | **PASS** | Lock risk must be assessed before execution is allowed |

No safety-rule blocker was found.

---

## 8. OpenAPI/Schema Alignment Review

| Alignment area | Result | Assessment |
|---|---|---|
| OpenAPI schemas | **PASS** | Future migrations must map persisted OpenAPI entities to approved table/field strategy or explicit deferral |
| SQL schema authoring contract | **PASS** | Authoring gate follows `docs/nashir_sql_schema_authoring_gate.md` |
| Auth/RBAC/Workspace Identity | **PASS** | `users`, `workspaces`, and `workspace_members` preserve identity and authorization-binding semantics |
| Workspace scoping | **PASS** | Merchant-owned tables must carry `workspace_id` and prevent cross-workspace FK linkage |
| Status enums | **PASS** | OpenAPI-approved and SQL-only proposal statuses remain separated |
| Lifecycle and approval semantics | **PASS** | Draft, approval, withdraw, rejection, version, and idempotency fields must support the OpenAPI lifecycle |
| Idempotency/concurrency | **PASS** | Idempotency keys and resource version fields must support 409 conflict behavior |
| Audit and analytics lineage | **PASS** | Audit events and analytics source summary/lineage must be preserved |
| Blocking mismatch rule | **PASS** | Any blocking mismatch with OpenAPI, SQL schema contract, or Auth/RBAC gates is NO-GO |

No OpenAPI or schema alignment blocker was found.

---

## 9. Tenancy and Constraints Review

| Tenancy/constraint item | Result | Assessment |
|---|---|---|
| `workspace_id` on merchant-owned tables | **PASS** | Required; explicitly documented in authoring gate |
| Same-workspace FK constraints | **PASS** | Required where child and parent are workspace-owned |
| Composite uniqueness where required | **PASS** | Required where tenant-scoped or relationship-scoped |
| `users.email` global case-insensitive uniqueness | **PASS** | Database-level case-insensitive uniqueness required; acceptable mechanisms documented: functional unique index on `LOWER(email)` or `citext` type/extension if approved later |
| `users.email` implementation deferral | **PASS** | Final mechanism deferred to a subsequent authoring gate or later approved authoring decision |
| `workspace_members` user/workspace uniqueness | **PASS** | Unique membership per user/workspace required |
| `store_profiles` workspace uniqueness | **PASS** | One store profile per workspace required |
| `campaign_briefs` campaign uniqueness | **PASS** | One brief per campaign required |
| Idempotency scope uniqueness | **PASS** | Unique scope over workspace, operation family, actor/member, and idempotency key required |
| Service-layer checks insufficient | **PASS** | Authoring gate states service-layer checks alone are not sufficient for tenant isolation |
| Future review must verify constraints | **PASS** | Explicitly required; not just columns |

No tenancy or constraint blocker was found.

---

## 10. Credential Safeguards Review

| Credential item | Result | Assessment |
|---|---|---|
| `integration_credentials.channel_connection_id` optional target candidate | **PASS** | Documented as an optional target candidate |
| `integration_credentials.data_source_id` optional target candidate | **PASS** | Documented as an optional target candidate |
| Same-workspace scoping via composite FK including `workspace_id` | **PASS** | Composite FKs including `workspace_id` required for credential target links |
| Credential target exclusivity or credential-scope decision | **PASS** | Must be decided before executable migrations; explicitly deferred to a subsequent authoring gate or later approved authoring decision |
| `credential_ref` / `vault_ref` only | **PASS** | Credential storage remains opaque-reference only |
| No plaintext secrets | **PASS** | Raw token, API key, OAuth secret, password, or vault secret value columns are forbidden |
| Credential mutation audit implications | **PASS** | Create, revoke, rotate, and remove operations must have audit implications planned |
| Vault/encryption provider | **PASS** | Implementation remains deferred |

No credential safeguard blocker was found.

The credential target exclusivity or credential-scope model remains an explicitly
tracked deferred decision, consistent with prior gate findings.

---

## 11. Audit Immutability Review

| Audit item | Result | Assessment |
|---|---|---|
| `audit_events` append-only structure | **PASS** | Append-only structure explicitly required |
| Database-level enforcement plan | **PASS** | Database-level enforcement planning required; acceptable mechanisms documented: triggers preventing `UPDATE`/`DELETE`, revoking `UPDATE`/`DELETE` privileges, or another reviewed database-level mechanism |
| Final audit enforcement deferral | **PASS** | Final implementation is deferred to a subsequent authoring gate or later approved authoring decision; service-layer-only enforcement is explicitly insufficient |
| Safe metadata payload | **PASS** | Safe metadata only; no secrets allowed in audit metadata |
| No secrets in audit payload | **PASS** | Explicitly required |
| Audit query indexes | **PASS** | Workspace/resource/action/time indexes required |

No audit immutability blocker was found.

---

## 12. Idempotency/Concurrency Review

| Idempotency/concurrency item | Result | Assessment |
|---|---|---|
| `idempotency_keys` table or deferred decision | **PASS** | Idempotency table included in authoring scope candidate; future authoring must include or explicitly defer |
| Key scope | **PASS** | Workspace, operation family, actor/member, and idempotency key |
| Request hash/response replay planning | **PASS** | Request hash or equivalent replay validation field required; response replay metadata included if approved |
| Expiry/retention | **PASS** | Expiry and retention fields for idempotency records required |
| Resource version fields | **PASS** | Mutable lifecycle resources require version fields |
| 409 conflict alignment | **PASS** | Version and idempotency metadata alignment with OpenAPI 409 conflict behavior required |
| Lifecycle POST block rule | **PASS** | If `idempotency_keys` is deferred from migration scope, future authoring must document why lifecycle POST backend implementation remains blocked |

No idempotency or concurrency blocker was found.

---

## 13. Verification Review

| Verification item | Result | Assessment |
|---|---|---|
| `npm run lint` documented | **PASS** | Gate reports PASSED |
| `npm run build` documented | **PASS** | Gate reports PASSED |
| SQL parse check | **PASS** | NOT RUN documented with correct justification: no SQL files created |
| `git status --short` documented | **PASS** | Gate reports `?? docs/nashir_sql_migration_authoring_gate.md` before commit |
| `git diff --stat` documented | **PASS** | Gate documents no tracked unstaged diff before staging |
| `git diff -- docs/` documented | **PASS** | Gate documents no tracked unstaged docs diff before staging |
| `git diff -- migration files` documented | **PASS** | NOT APPLICABLE documented with correct justification: no migration files created |
| BIDI scan on authoring gate doc | **PASS** | Gate reports `BIDI_CONTROL_CHARS none` |
| Backend/API runtime/ORM/generated/UI/package changed-file search | **PASS** | Gate reports `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Migration runner/SQL executable changed-file search | **PASS** | Gate reports `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Existing migration/SQL file scan | **PASS** | Gate reports `MIGRATION_SQL_FILES: none` |
| Database-applied changes search | **PASS** | Gate confirms no database commands executed and no migration files created |

No verification blocker was found.

---

## 14. Risks and Gaps

### Blocking issues

| Issue | Result |
|---|---|
| Blocking migration authoring issue | **NONE FOUND** |
| Blocking OpenAPI/schema inconsistency | **NONE FOUND** |
| Blocking Auth/RBAC/workspace inconsistency | **NONE FOUND** |
| Blocking scope violation | **NONE FOUND** |

### Non-blocking watch items

| Risk / gap | Severity | Control |
|---|---|---|
| Migration execution before review | CRITICAL | No execution authorized; future execution gate required |
| Migration runner introduced too early | CRITICAL | Runner remains unauthorized; future review required before setup |
| Migration path/framework ambiguity | HIGH | Six unresolved decisions enumerated in authoring gate; no files created until all six are approved |
| Rollback complexity | HIGH | Rollback convention must be approved before executable artifacts exist |
| Destructive DDL risk | CRITICAL | Destructive DDL remains NO-GO without explicit review |
| Enum migration risk | HIGH | Enum changes require contract review and exact OpenAPI alignment |
| Cross-workspace leakage | CRITICAL | Same-workspace constraints must be proven in future executable migration authoring |
| Credential leakage | CRITICAL | Plaintext credential columns remain forbidden |
| Credential target exclusivity unresolved | MEDIUM | Deferred to a subsequent authoring gate or later approved authoring decision; controlled watch item |
| Audit log tampering | HIGH | Database-level append-only enforcement mechanism must be selected before executable migration approval |
| Idempotency gaps | HIGH | Lifecycle POST backend implementation remains blocked without idempotency storage or approved alternative |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |
| Case-sensitive duplicate user emails | HIGH | Case-insensitive database-level uniqueness required; final mechanism deferred |
| Cross-workspace credential linkage | CRITICAL | Composite credential target FKs including `workspace_id` required |

---

## 15. PASS / FAIL / WATCH Checklist

| Check | Result |
|---|---|
| Scope compliance | **PASS** |
| Migration output classification | **PASS** |
| Migration file strategy | **PASS** |
| Sequence correctness | **PASS** |
| Safety rules | **PASS** |
| OpenAPI/schema alignment | **PASS** |
| Tenancy constraints | **PASS** |
| Credential safeguards | **PASS** |
| Audit immutability | **PASS** |
| Idempotency/concurrency | **PASS** |
| Verification completeness | **PASS** |
| No implementation changes | **PASS** |
| Migration path finalization | **WATCH** |
| Migration runner selection | **WATCH** |
| Rollback implementation details | **WATCH** |
| Credential target exclusivity final model | **WATCH** |
| Audit append-only enforcement mechanism | **WATCH** |

---

## 16. GO / NO-GO Decision

**Decision: GO with minor documentation follow-up.**

The SQL Migration Authoring Gate output is documentation-only and correctly
defers all six unresolved migration file decisions.

The authoring gate confirms no migration files, no migration runner, no SQL
execution, no backend code, no ORM models, no seed files, no generated client,
no package or UI changes, and no production or pilot readiness claim.

The authoring gate documents the full migration intent — file strategy,
sequence, safety rules, tenancy constraints, credential safeguards, audit
immutability, idempotency/concurrency, and verification — as a reviewable
contract.

This authorizes only the next planning/review step.

This does not authorize executing migrations.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

### Minor documentation follow-up

The following items must be resolved in a subsequent authoring gate before
migration draft files are created:

1. Approve the migration file location (repository and directory).
2. Approve whether migration files live in this repository or a later backend
   repository.
3. Approve the migration runner or explicitly approve runner-free draft files.
4. Approve the up/down or forward-only rollback convention.
5. Approve exact allowed migration file paths.
6. Approve parse/dry-run verification tooling.
7. Select the `users.email` uniqueness mechanism
   (`LOWER(email)` functional index or approved `citext`).
8. Select the audit append-only database-level enforcement mechanism
   (triggers, privilege restriction, or another reviewed mechanism).
9. Decide the credential target exclusivity or document the credential-scope
   model.

None of these follow-up items is a blocker for this review gate.

All nine items are controlled watch items deferred by the authoring gate and
are required before any later SQL Migration Execution Planning Gate.

---

## 17. Final Summary

| Item | Summary |
|---|---|
| Inputs | SQL Migration Authoring Gate, SQL Migration Planning Gate and Review Gate, SQL Schema Authoring Gate and Review Gate, OpenAPI YAML, Auth/RBAC gates, ERD/Data Model gates, backend strategy context, README, and screen map |
| Outputs | One documentation-only SQL Migration Authoring Review Gate |
| Remaining gaps | Migration file location, repository boundary, runner/framework, rollback convention, exact allowed file paths, parse verification tooling, `users.email` uniqueness mechanism, audit append-only enforcement mechanism, and credential target exclusivity/scope model remain unresolved |
| Decision required before next phase | A subsequent migration authoring gate must resolve all six blocking file-strategy items and document three additional mechanism decisions before migration draft files are created; no migration may be applied to any database without a separate SQL Migration Execution Planning Gate |
| Recommended next gate | Nashir SQL Migration Execution Planning Gate — after the nine follow-up items above are resolved in a subsequent authoring gate and reviewed |

---

## 18. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `M docs/nashir_sql_migration_authoring_review_gate.md` (this patch) |
| `git diff --stat` | `docs/nashir_sql_migration_authoring_review_gate.md` only; no other files changed |
| `git diff -- docs/nashir_sql_migration_authoring_review_gate.md` | Reviewability reformat and BIDI verification update only |
| `wc -l docs/nashir_sql_migration_authoring_review_gate.md` | 504 lines |
| BIDI scan: `docs/nashir_sql_migration_authoring_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/nashir_sql_migration_authoring_review_gate.md` | `BIDI_CONTROL_CHARS none` |
| Circular deferral phrase scan | No circular self-referencing deferral phrases found; all deferrals use `a subsequent authoring gate` |
| Backend/API runtime/ORM/generated/UI/package changed-file search | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Migration runner/SQL executable changed-file search | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Existing migration/SQL file scan | `MIGRATION_SQL_FILES: none` |
| Database-applied changes search | No database commands executed; no migration files created |

BIDI scan method: Python `pathlib` + Unicode code-point lookup;
no BIDI control characters embedded in shell patterns.

Expected result:

- Documentation-only.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No ORM models.
- No seed files.
- No generated client.
- No package/UI changes.
- No production/pilot readiness claim.
