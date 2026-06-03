# Nashir SQL Migration Authoring Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Authoring Gate - documentation-only output |
| Status | Authoring complete |
| Date | 2026-06-03 |
| Scope decision | Documentation only; migration draft files deferred |
| Migration draft files created | NO |
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

This is the Nashir SQL Migration Authoring Gate.

This gate authors the migration authoring decision and constraints for Nashir
without creating executable migration files.

This gate does not authorize backend implementation.

This gate does not authorize API route implementation.

This gate does not authorize ORM models.

This gate does not authorize seed files.

This gate does not authorize generated clients.

This gate does not authorize UI or package changes.

This gate does not authorize production or pilot readiness.

This gate does not authorize database readiness.

Migrations are not executed.

No SQL is applied to any database.

No migration runner is introduced or configured.

No executable database artifact is created.

---

## 2. Inputs Reviewed

### Controlling inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_planning_gate.md` | Controls future migration scope, file strategy, sequence, safety, tenancy, credential, audit, verification, and risk requirements |
| `docs/nashir_sql_migration_planning_review_gate.md` | Review decision authorizing this SQL Migration Authoring Gate only |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |

### Direct inputs

| Input | Role |
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

### Authority boundaries

| Boundary | Result |
|---|---|
| Nashir is the product, UI journey, scope, API contract, SQL schema contract, and data model authority | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |
| No marketing-os code, migration files, runner scripts, entities, backend shape, runtime assumptions, or journey are copied | **CONFIRMED** |

---

## 3. Scope Decision

This PR creates documentation only.

This PR does not create migration draft files.

Migration draft files are not created because the controlling SQL Migration
Planning Gate and SQL Migration Planning Review Gate do not approve a final
migration directory or migration runner/framework.

The planning review explicitly leaves the migration path, runner/framework,
rollback mechanism, migration metadata implementation, and final FK/constraint
SQL as future authoring/review decisions.

Remaining decision needed before migration files can be authored:

- Approve the migration file location.
- Approve whether migration files live in this repository or a later backend
  repository.
- Approve the migration runner or explicitly approve runner-free draft files.
- Approve the up/down or forward-only rollback convention.
- Approve exact allowed migration file paths.
- Approve parse/dry-run verification tooling.

Because those decisions remain unresolved, this gate records the migration
authoring output as a reviewable contract only.

SQL Migration Authoring Review Gate is required before any later migration
execution, runner setup, database application, backend implementation, ORM
model, seed, generated-client, package, or UI work.

---

## 4. Migration File Strategy

| Strategy item | Authoring result |
|---|---|
| Migration directory | Deferred; no approved final location exists |
| Migration draft files | Not created |
| Naming convention | Future files should use sortable timestamped, numbered, descriptive names |
| Candidate format | `YYYYMMDDHHMM__nashir_v1_###_<short_description>.sql` |
| Sequencing convention | Sequenced by dependency group |
| Baseline vs sequenced | Sequenced migration approach remains preferred over one large baseline |
| Up/down expectation | Deferred; future gate must select down files, down sections, or forward-only corrective migrations |
| Rollback expectation | Must be documented before executable migration artifacts exist |
| Metadata tracking expectation | Future metadata should track filename, order, timestamp, checksum/hash, status, runner version if any, and failure details |
| Parse/verification expectation | Future authoring must provide parse or dry-run verification if SQL files are created |

Candidate future filenames remain planning examples only:

- `YYYYMMDDHHMM__nashir_v1_001_foundation_identity_tenant.sql`
- `YYYYMMDDHHMM__nashir_v1_002_store_product_source.sql`
- `YYYYMMDDHHMM__nashir_v1_003_asset_campaign_content.sql`
- `YYYYMMDDHHMM__nashir_v1_004_publishing_analytics_audit.sql`
- `YYYYMMDDHHMM__nashir_v1_005_support_reference.sql`

No file with any of those names is created by this gate.

---

## 5. Migration Sequence

| Sequence group | Tables | Dependency order | Rollback risk | Cross-workspace constraint risk | V1 required vs deferred | Appears in this authoring output |
|---|---|---|---|---|---|---|
| Foundation identity/tenant | `workspaces`, `users`, `workspace_members` | First; establishes tenant root, global identity, and authorization binding | HIGH because downstream tables depend on these FKs | WorkspaceMember user/workspace uniqueness and membership status must not leak across workspaces | V1 required | Documented only; no migration file |
| Store/product/source | `store_profiles`, `products`, `data_sources`, `channel_connections`, `integration_credentials` | After foundation tables | MEDIUM; credential target rollback requires care | Same-workspace FKs required for source/channel/credential links | V1 required; provider implementation deferred | Documented only; no migration file |
| Asset/campaign/content | `assets`, `campaigns`, `campaign_briefs`, `campaign_content_items`, `content_drafts`, `content_approvals` | After foundation plus store/product/source context | HIGH because content lifecycle and immutable approvals require careful rollback | Same-workspace campaign/content/draft/approval constraints required | V1 required | Documented only; no migration file |
| Publishing/analytics/audit | `publishing_jobs`, `publishing_statuses`, `analytics_snapshots`, `audit_events` | After campaign/content/channel resources | HIGH because append-only trail and lineage tables should not be destructively changed | Workspace-scoped operational data and no cross-workspace analytics aggregation | V1 required | Documented only; no migration file |
| Support/reference | `idempotency_keys`, `roles`, `permissions`, `role_permissions` if approved | After foundation and Auth/RBAC decisions | MEDIUM; seed/reference coupling must be avoided | Idempotency uniqueness must include workspace, operation, actor/member, and key | Support/reference candidates | Documented only; no migration file |

Authoring rule:

- No group may move to executable migration files until the migration path,
  runner/runner-free strategy, rollback convention, and parse verification are
  approved.

---

## 6. Safety Rules

Future migration authoring must preserve these safety rules:

- No destructive DDL unless explicitly approved.
- Additive-first strategy.
- Hard delete remains deferred unless approved.
- Table drops remain forbidden unless separately approved.
- Column drops remain forbidden unless separately approved.
- Type narrowing remains forbidden unless separately reviewed.
- Restrict/no cascade remains the default.
- `CASCADE` requires explicit justification and review.
- No plaintext credential columns.
- No raw API key, OAuth token, vault secret value, provider secret, or password
  column.
- No cross-workspace leakage through FK design or query-only assumptions.
- Same-workspace relationships require constraints where simple FKs are
  insufficient.
- Migration execution must be idempotent through runner metadata or another
  reviewed mechanism before execution is allowed.
- Rollback expectations must be defined before executable artifacts exist.
- Transaction boundaries must be planned per migration.
- Non-transactional DDL must be explicitly identified and reviewed.
- Long-running lock risk must be assessed before execution is allowed.

---

## 7. OpenAPI and Schema Alignment

| Alignment area | Authoring requirement |
|---|---|
| OpenAPI schemas | Future migrations must map persisted OpenAPI entities to approved table/field strategy or explicit deferral |
| SQL schema authoring contract | Future migrations must follow `docs/nashir_sql_schema_authoring_gate.md` |
| Auth/RBAC/Workspace Identity | `users`, `workspaces`, and `workspace_members` must preserve identity and authorization-binding semantics |
| Workspace scoping | Merchant-owned tables must carry `workspace_id` and prevent cross-workspace FK linkage |
| Status enums | OpenAPI-approved and SQL-only proposal statuses must remain separated |
| Lifecycle and approval semantics | Draft, approval, withdraw, rejection, version, and idempotency fields must support the OpenAPI lifecycle |
| Idempotency/concurrency | Idempotency keys and resource version fields must support 409 conflict behavior |
| Audit and analytics lineage | Audit events and analytics source summary/lineage must be preserved |

Any blocking mismatch with OpenAPI, the SQL schema contract, or Auth/RBAC gates
is NO-GO for future executable migration authoring.

---

## 8. Tenancy and Constraints

Future migration authoring must include:

- `workspace_id` on merchant-owned tables.
- Same-workspace FK constraints where child and parent are workspace-owned.
- Composite uniqueness where tenant-scoped or relationship-scoped.
- `users.email` global case-insensitive uniqueness at database level.
- Acceptable future `users.email` uniqueness mechanisms:
  - Functional unique index on `LOWER(email)`.
  - `citext` type/extension if approved later.
- Final email uniqueness implementation deferred to SQL Migration Authoring
  Review Gate or later approved authoring decision.
- `workspace_members` user/workspace uniqueness.
- `store_profiles` workspace uniqueness.
- `campaign_briefs` campaign uniqueness.
- Idempotency uniqueness over workspace, operation family, actor/member, and
  idempotency key.

Service-layer checks alone are not sufficient for tenant isolation.

Future migration review must verify constraints, not just columns.

---

## 9. Credential Safeguards

Future migration authoring must include:

- `integration_credentials.channel_connection_id` as an optional target
  candidate.
- `integration_credentials.data_source_id` as an optional target candidate.
- Same-workspace scoping through composite FKs including `workspace_id` for
  credential target links.
- A decision before executable migrations on target exclusivity or a documented
  credential-scope model.
- Final FK/check shape deferred to SQL Migration Authoring Review Gate or later
  approved authoring decision.
- `credential_ref` / `vault_ref` only.
- No plaintext secrets.
- No raw token, API key, OAuth secret, password, or vault secret value columns.
- Credential create, revoke, rotate, and remove operations must have audit
  implications planned.

Vault/encryption provider implementation remains deferred.

---

## 10. Audit Immutability

Future migration authoring must include:

- `audit_events` append-only structure.
- Database-level append-only enforcement planning.
- Safe metadata payload.
- No secrets in audit payload.
- Audit query indexes by workspace, resource, action, and time.

Acceptable future database-level enforcement mechanisms include:

- Triggers preventing `UPDATE` and `DELETE`.
- Revoking `UPDATE` and `DELETE` privileges from the application role.
- Another reviewed database-level mechanism.

Final audit enforcement implementation is deferred to SQL Migration Authoring
Review Gate or later approved authoring decision.

Service-layer-only append-only enforcement is insufficient for the final
migration design unless a later review explicitly approves a different
database-level control model.

---

## 11. Idempotency and Concurrency

Future migration authoring must include or explicitly defer:

- `idempotency_keys` table.
- Key scope using workspace, operation family, actor/member, and idempotency
  key.
- Request hash or equivalent replay validation field.
- Response replay metadata if approved.
- Expiry and retention fields for idempotency records.
- Resource version fields for mutable lifecycle resources.
- 409 conflict alignment through version and idempotency metadata.

If `idempotency_keys` is deferred from executable migration scope, future
authoring must document why lifecycle POST backend implementation remains
blocked until idempotency storage is available or an approved alternative
exists.

---

## 12. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| SQL parse | NOT RUN - no SQL files created |
| `git status --short` | `?? docs/nashir_sql_migration_authoring_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new authoring document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new authoring document shown by `git status --short` |
| `git diff -- migration files` | NOT APPLICABLE - no migration files created |
| `wc -l docs/nashir_sql_migration_authoring_gate.md` | 393 lines before verification-result update |
| BIDI scan on `docs/nashir_sql_migration_authoring_gate.md` | `BIDI_CONTROL_CHARS none` |
| Backend/API runtime/ORM/generated/UI/package changed-file search | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Migration runner / SQL executable changed-file search | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Existing migration/SQL file scan | `MIGRATION_SQL_FILES: none` |
| Database-applied changes search | No database commands executed; no migration files created |

Expected result:

- Documentation-only.
- No migration draft files.
- No executable migrations.
- No migration runner.
- No database-applied changes.
- No backend implementation.
- No API route implementation.
- No ORM models.
- No seed files.
- No generated client.
- No package/UI changes.
- No production/pilot/database readiness claim.

---

## 13. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Migration execution before review | CRITICAL | This gate requires SQL Migration Authoring Review Gate before execution/runtime work |
| Migration runner introduced too early | CRITICAL | Runner setup remains forbidden |
| Migration path/framework ambiguity | HIGH | Path and framework remain unresolved; no files are created |
| Rollback complexity | HIGH | Rollback convention must be approved before executable artifacts |
| Destructive DDL risk | CRITICAL | Destructive DDL remains NO-GO without explicit review |
| Enum migration risk | HIGH | Enum changes require contract review and exact OpenAPI alignment |
| Cross-workspace leakage | CRITICAL | Same-workspace constraints must be proven before executable migration approval |
| Credential leakage | CRITICAL | Plaintext credential columns remain forbidden |
| Audit log tampering | HIGH | Database-level append-only enforcement must be selected before executable migration approval |
| Idempotency gaps | HIGH | Lifecycle POST backend implementation remains blocked without idempotency storage or approved alternative |
| Backend starting too early | HIGH | Backend implementation remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |
| Case-sensitive duplicate user emails | HIGH | Case-insensitive database-level uniqueness is required |
| Cross-workspace credential linkage | CRITICAL | Composite credential target FKs including `workspace_id` are required |

---

## 14. GO / NO-GO Decision

**Decision: GO to SQL Migration Authoring Review Gate.**

This gate authoring output is documentation-only because the migration file
location and runner/framework remain unresolved.

This gate does not authorize backend implementation.

This gate does not authorize API route implementation.

This gate does not authorize ORM models.

This gate does not authorize seed files.

This gate does not authorize generated clients.

This gate does not authorize migration execution.

This gate does not authorize migration runner setup.

This gate does not authorize database-applied changes.

This gate does not authorize package/UI changes.

This gate does not authorize production or pilot readiness.

SQL Migration Authoring Review Gate must review this documentation-only
authoring output and decide whether the unresolved migration file location and
runner/framework decisions require another authoring pass before migration
draft files can be created.
