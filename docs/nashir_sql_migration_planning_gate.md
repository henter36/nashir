# Nashir SQL Migration Planning Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Planning Gate - documentation only |
| Status | Planning complete |
| Date | 2026-06-03 |
| Scope | Plans future migration organization, naming, review, verification, rollback, and constraints |
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
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is SQL Migration Planning only.

It defines how future Nashir SQL migrations should be organized, named,
reviewed, verified, rolled back, and constrained before any migration files are
created.

This gate follows the SQL Schema Authoring Review Gate because the schema
contract is now reviewed enough to plan migration mechanics.

This gate comes before migration authoring because executable migration files,
runner setup, SQL execution, rollback behavior, and verification expectations
must be planned and reviewed before any database artifact exists.

No migration files are introduced.

No migration runner is introduced.

No SQL is executed or applied to a database.

No backend code is introduced.

No API route implementation is introduced.

No ORM models are introduced.

No seed files are introduced.

No generated clients are introduced.

No UI, package, or build changes are introduced.

No production or pilot readiness is claimed.

---

## 2. Inputs Reviewed

### Controlling inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_schema_authoring_gate.md` | Controls schema contract, table inventory, enum strategy, tenancy rules, credential boundaries, lifecycle support, audit, analytics, and idempotency requirements |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Review decision authorizing only this SQL Migration Planning Gate |

### Direct inputs

| Input | Role |
|---|---|
| `README.md` | Nashir repository status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only constraints |
| `docs/nashir_sql_schema_authoring_planning_gate.md` | Authoring sequence, table checklist, and deferred migration strategy |
| `docs/nashir_sql_schema_authoring_planning_review_gate.md` | Planning review confirmation |
| `docs/nashir_sql_schema_planning_gate.md` | Persistence planning baseline |
| `docs/nashir_sql_schema_planning_review_gate.md` | Persistence planning review decision |
| `docs/nashir_v1_openapi.yaml` | Current API contract authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Workspace identity, RBAC, role, permission, and membership authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |

### Contextual inputs

| Input | Role |
|---|---|
| `docs/nashir_erd_data_model_gate.md` | Entity and relationship source |
| `docs/nashir_erd_data_model_review_gate.md` | ERD/Data Model review confirmation |
| `docs/nashir_backend_api_strategy_gate.md` | Backend/API strategy context |
| `docs/nashir_backend_api_strategy_review_gate.md` | Backend/API strategy review confirmation |
| V1 Scope Decision Gate and Review Gate | Product scope context |
| Product Scope Reconciliation Gate and Review Gate | Product authority and reconciliation context |

### Authority boundaries

| Boundary | Result |
|---|---|
| Nashir is the product, UI journey, scope, API contract, and data model authority | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |
| No marketing-os code, migration files, runner scripts, entities, or runtime assumptions are copied | **CONFIRMED** |

---

## 3. Current Facts vs Planning Decisions vs Deferred Items

### Approved facts from prior gates

| Fact | Source |
|---|---|
| SQL Schema Authoring Gate and Review Gate are complete | SQL Schema Authoring Review Gate |
| The authored schema contract is documentation-only | SQL Schema Authoring Gate |
| No SQL files were created because no approved schema-contract or migration location exists in this repo | SQL Schema Authoring Gate |
| The next authorized step is SQL Migration Planning Gate only | SQL Schema Authoring Review Gate |
| Nashir remains the product and data model authority | Product, ERD, OpenAPI, and SQL gates |
| marketing-os remains reference-only | Product and backend strategy gates |
| Workspace scoping is mandatory for merchant-owned data | Auth/RBAC, ERD, and SQL gates |
| `users` is global identity | Auth/RBAC and SQL gates |
| `workspace_members` is the authorization binding | Auth/RBAC and SQL gates |
| Raw credentials must not appear in general relational rows | ERD and SQL gates |
| OpenAPI-approved enums are candidates, not final DDL approval | SQL Schema Authoring Gate |
| SQL-only statuses remain planning proposals | SQL Schema Authoring Gate |

### Decisions made in this planning gate

| Decision | Result |
|---|---|
| Migration files | Not created by this gate |
| Migration runner | Not introduced by this gate |
| Migration path | No current repo convention found; final path deferred |
| File strategy | Prefer sequenced migrations by dependency group over one large baseline if a future runner supports ordering |
| Naming strategy | Propose timestamped, numbered, descriptive filenames for future review |
| Rollback expectation | Future authoring must define a rollback approach before executable migrations exist |
| Safety posture | Additive by default, destructive changes require explicit review |
| Verification posture | Future migration authoring must prove parse, up/down or rollback strategy, forbidden-path safety, and OpenAPI/schema alignment |

### Deferred items

| Deferred item | Target gate |
|---|---|
| Final migration directory | SQL Migration Authoring Gate |
| Migration runner selection or setup | SQL Migration Authoring Gate and Review Gate |
| Executable SQL migration file creation | SQL Migration Authoring Gate only after this planning gate and review gate merge |
| Up/down implementation style | SQL Migration Authoring Gate |
| Rollback execution process | SQL Migration Authoring Gate and Review Gate |
| Database engine/runtime configuration | Backend Slice 1 Planning or later implementation gate |
| ORM model strategy | Separate ORM/backend planning gate if ever approved |
| Seed data strategy | Separate seed/reference planning and review if needed |
| Generated clients | Separate generated-client planning/review gate |
| Production or pilot readiness | Future readiness gate |

---

## 4. Migration Scope Boundaries

Future migrations may cover schema objects required by the approved Nashir V1
schema contract after a migration authoring gate explicitly allows executable
artifacts.

Future migrations may cover:

- Table creation for approved V1 persistence tables.
- Primary keys.
- Foreign keys.
- Same-workspace constraints.
- Uniqueness constraints.
- Check constraints.
- Approved enum representations.
- Required indexes.
- Archive/delete columns.
- Audit, idempotency, and concurrency support columns.
- Safe metadata and JSON fields when contractually justified.

Future migrations must remain out of scope unless separately approved:

- Backend runtime code.
- API routes.
- ORM models.
- Seed files or seed SQL.
- Generated clients.
- UI integration.
- Package or lockfile changes.
- Migration runner setup.
- Database-applied changes.
- Production or pilot readiness claims.

No backend runtime coupling is authorized.

No ORM-generated migrations are authorized unless a later gate explicitly
selects an ORM and reviews generated SQL.

No seed data is authorized unless explicitly planned and reviewed.

No production or pilot readiness is claimed.

---

## 5. Migration File Strategy Proposal

No repository migration directory, SQL directory, or migration runner convention
exists in this repo today.

This gate does not create migration directories.

This gate does not create SQL files.

Final migration path is deferred to SQL Migration Authoring Gate.

### Proposed path options

| Option | Candidate path | Assessment |
|---|---|---|
| A | `docs/migration_contracts/` | Documentation-adjacent contract drafts only; not executable by default |
| B | `db/migrations/` | Common migration path, but introduces a database artifact directory and must be approved before creation |
| C | `migrations/` | Simple and conventional, but must not be created until executable migrations are authorized |
| D | External backend repository path | Possible later backend decision; must remain Nashir-specific and not copy marketing-os code |

Recommended planning position:

- Defer final path until SQL Migration Authoring Gate.
- Prefer a path owned by the eventual backend/database home.
- Do not create migration directories in this UI/contract repo unless a later
  gate explicitly approves that repository boundary.

### Naming convention proposal

Future migration filenames should be deterministic and sortable.

Candidate format:

```text
YYYYMMDDHHMM__nashir_v1_###_<short_description>.sql
```

Examples for planning only:

- `YYYYMMDDHHMM__nashir_v1_001_foundation_identity_tenant.sql`
- `YYYYMMDDHHMM__nashir_v1_002_store_product_source.sql`
- `YYYYMMDDHHMM__nashir_v1_003_asset_campaign_content.sql`
- `YYYYMMDDHHMM__nashir_v1_004_publishing_analytics_audit.sql`
- `YYYYMMDDHHMM__nashir_v1_005_support_reference.sql`

These examples are not files and are not executable artifacts.

### Baseline vs sequenced migrations

| Strategy | Assessment |
|---|---|
| One large baseline migration | Simpler for an empty database, but harder to review, rollback, isolate, and diagnose |
| Sequenced migrations by dependency group | Preferred because review can verify tenant foundations, content lifecycle, audit, and support tables in smaller units |

Recommendation:

- Prefer sequenced migrations by dependency group.
- Keep each sequence reviewable and reversible.
- Avoid interleaving backend/runtime changes with migration changes.

### Rollback and metadata

Future authoring must decide whether rollback is implemented as:

- Down migrations in paired files.
- Down sections in each migration file.
- Forward-only corrective migrations with documented rollback procedures.

The rollback decision must be reviewed before executable migration files exist.

Future migration metadata should track:

- Migration filename.
- Applied order.
- Applied timestamp.
- Checksum or content hash.
- Execution status.
- Runner version, if a runner exists.
- Failure details and retry policy, if supported.

No metadata table is created by this planning gate.

---

## 6. Migration Sequence Planning

| Sequence group | Tables | Dependencies | Ordering rationale | Rollback risk | Cross-workspace constraints | V1 status |
|---|---|---|---|---|---|---|
| 1. Foundational identity/tenant | `workspaces`, `users`, `workspace_members` | None beyond database engine and UUID strategy | Establish tenant root, global identity, and authorization binding before merchant-owned rows | High if later tables depend on membership FKs | WorkspaceMember user/workspace uniqueness; active/invited/suspended status | V1 required |
| 2. Store/product/source | `store_profiles`, `products`, `data_sources`, `channel_connections`, `integration_credentials` | Foundation tables | Establish store, catalog, source/channel metadata, and credential boundary before campaigns/content | Medium; credential target rollback requires care | `workspace_id` required; same-workspace FK constraints for source/channel/credential links | V1 required; provider implementation deferred |
| 3. Asset/campaign/content | `assets`, `campaigns`, `campaign_briefs`, `campaign_content_items`, `content_drafts`, `content_approvals` | Foundation plus product/source context | Establish creative and approval lifecycle after tenant and source context | High; content lifecycle FKs and immutable approvals require careful rollback | Same-workspace campaign/content/draft/approval constraints | V1 required |
| 4. Publishing/analytics/audit | `publishing_jobs`, `publishing_statuses`, `analytics_snapshots`, `audit_events` | Foundation plus campaign/content/channel tables | Add operational queues, lineage, and append-only audit after resources exist | High; append-only trail tables should not be destructively changed | Workspace-scoped operational and lineage data; no cross-workspace aggregation | V1 required |
| 5. Support/reference | `idempotency_keys`, `roles`, `permissions`, `role_permissions` if approved later | Foundation and Auth/RBAC decisions | Add lifecycle POST support and optional RBAC reference persistence after core relationships are clear | Medium; seed/reference coupling must be avoided unless approved | Idempotency uniqueness includes workspace/operation/actor/key; role tables are global candidates | Support/reference candidates |

Sequence rules:

- Foundation tables must come first.
- Merchant-owned tables must not be authored before workspace scoping exists.
- Credential tables must not store raw secrets.
- Content lifecycle tables must preserve self-approval prevention support.
- Audit, analytics, and idempotency support must be present before backend
  lifecycle implementation relies on them.
- Role and permission reference tables must not imply seed files.

---

## 7. Migration Safety Rules

Future migration authoring must follow these rules:

- No destructive operations without explicit review.
- Prefer additive changes.
- Hard deletes are forbidden unless separately approved.
- Table drops are forbidden unless separately approved.
- Column drops are forbidden unless separately approved.
- Type narrowing is forbidden unless separately reviewed for data safety.
- `CASCADE` must be avoided unless explicitly justified and reviewed.
- Restrict/no cascade is the default for parent delete behavior.
- No plaintext credential columns.
- No raw API key, OAuth token, vault secret value, or provider secret in SQL.
- No cross-workspace leakage through FKs or query-only assumptions.
- Same-workspace relationships require constraints where simple FKs are
  insufficient.
- Migrations should be idempotent at runner level or protected by migration
  metadata so repeat execution cannot corrupt schema state.
- Rollback expectations must be defined before executable files exist.
- Data backfills are out of scope unless separately planned.
- If a future backfill is needed, it must define source, target, batching,
  validation, rollback, and no-secret rules.
- Transaction boundaries must be planned per migration.
- DDL that cannot run in a transaction must be explicitly identified and
  reviewed.
- Long-running locks must be assessed before migration execution is allowed.

---

## 8. OpenAPI-to-Migration Alignment

Future migrations must align with:

- `docs/nashir_v1_openapi.yaml`.
- `docs/nashir_sql_schema_authoring_gate.md`.
- Auth/RBAC/Workspace Identity gates.
- Workspace scoping and `workspaceId` path boundary.
- OpenAPI-approved status enums.
- SQL-only status proposal labels.
- Content lifecycle operations.
- Approval and review semantics.
- Idempotency and optimistic concurrency requirements.
- Audit event boundaries.
- Analytics snapshot lineage.

Alignment checks required later:

| Alignment area | Future migration requirement |
|---|---|
| OpenAPI schemas | Every persisted OpenAPI entity maps to approved table/field strategy or explicit deferral |
| Auth/RBAC | `users`, `workspaces`, and `workspace_members` preserve identity and authorization-binding semantics |
| Workspace scoping | Merchant-owned tables carry `workspace_id` and prevent cross-workspace FK linkage |
| Status enums | Values match OpenAPI or approved SQL-only planning proposals |
| Lifecycle | Content draft, approval, withdraw, rejection, version, and idempotency fields support contract operations |
| Audit | Mutating operations can produce safe audit events without secrets |
| Analytics | Source summary and lineage remain available without cross-workspace leakage |

Any blocking mismatch with OpenAPI or prior schema contract is NO-GO.

---

## 9. Enum Migration Planning

OpenAPI-approved stable enums are PostgreSQL ENUM candidates.

SQL-only or evolving proposal statuses are TEXT + CHECK candidates during early
schema authoring.

Final physical DDL representation remains deferred to SQL Migration Authoring
Gate and review.

No enum value may be introduced without prior contract approval.

Any OpenAPI enum mismatch is NO-GO.

| Status source | Target field | Migration planning rule |
|---|---|---|
| `WorkspaceMemberStatus` | `workspace_members.status` | OpenAPI-approved enum candidate; values must remain active, invited, suspended |
| `AnalyticsSnapshotStatus` | `analytics_snapshots.status` | OpenAPI-approved enum candidate; values must remain available, partial, stale, unavailable |
| `CampaignStatus` | `campaigns.status` | OpenAPI-approved enum candidate |
| `ContentDraftStatus` | `content_drafts.status` | OpenAPI-approved enum candidate |
| `CampaignContentItemStatus` | `campaign_content_items.status` | OpenAPI-approved enum candidate |
| `PublishingJobStatus` | `publishing_jobs.status` | OpenAPI-approved enum candidate |
| `ContentApprovalDecision` | `content_approvals.decision` | OpenAPI-approved server-owned decision enum candidate |
| SQL-only proposal statuses | Various table fields | TEXT + CHECK candidate; not OpenAPI-approved |

Enum changes must be reviewed as contract changes before migration changes.

Future enum migration review must verify:

- OpenAPI schema value list.
- SQL schema contract value list.
- Backward compatibility.
- Rollback implications.
- Whether PostgreSQL ENUM alteration is reversible.
- Whether TEXT + CHECK is safer for evolving fields.

---

## 10. Tenancy and Constraint Migration Planning

Future migrations must plan these tenancy and constraint requirements:

| Requirement | Planning rule |
|---|---|
| `workspace_id` on merchant-owned tables | Required unless table is explicitly global |
| Global `users` table | Allowed as Auth/RBAC global identity |
| Cross-workspace FK prevention | Same-workspace constraints required where child and parent are both workspace-owned |
| Composite uniqueness | Required where uniqueness is tenant-scoped or relationship-scoped |
| `users.email` global uniqueness | Candidate required; normalization/case-folding decision must be made before executable DDL |
| `workspace_members` user/workspace uniqueness | Required |
| `store_profiles` workspace uniqueness | Required |
| `campaign_briefs` campaign uniqueness | Required |
| Idempotency scope uniqueness | Required over workspace, operation family, actor/member, and idempotency key |

Future authoring must not rely only on service-layer checks for tenant
isolation.

Future migration review must verify constraints, not just columns.

---

## 11. Credential Migration Planning

Future migrations must preserve the credential boundary.

| Credential area | Planning rule |
|---|---|
| `channel_connections` | Must not include raw credential columns |
| `integration_credentials.channel_connection_id` | Optional target candidate |
| `integration_credentials.data_source_id` | Optional target candidate |
| Target model | Future authoring must decide exact target exclusivity or documented credential-scope model |
| Credential reference | `credential_ref` / `vault_ref` only |
| Plaintext secrets | Forbidden |
| Audit implication | Credential create, revoke, rotate, and remove operations require audit support |

No migration may add plaintext token, API key, OAuth secret, password, or vault
secret value columns.

Vault/encryption provider implementation remains deferred.

---

## 12. Lifecycle, Idempotency, and Concurrency Migration Planning

Future migrations must support:

- Resource version fields for mutable lifecycle resources.
- `idempotency_keys` table if approved for migration scope.
- Idempotency scope using workspace, operation family, actor/member, and
  idempotency key.
- Request hash or equivalent replay validation field.
- Response replay metadata if approved.
- Expiry and retention fields for idempotency records.
- ContentDraft lifecycle status.
- Submit-review support.
- Approve support.
- Reject support.
- Withdraw support.
- ContentApproval immutable decision records.
- `rejectionReason` persistence.
- `requiredChanges` persistence.
- Self-approval prevention support through creator/reviewer references.
- Creator self-withdrawal support through creator references.
- 409 conflict support through version and idempotency metadata.

SQL migrations must preserve enough structure for service-layer lifecycle rules.

SQL migrations must not imply that SQL alone enforces all approval business
rules unless a later gate explicitly approves database enforcement.

---

## 13. Audit and Analytics Migration Planning

Future migrations must support:

| Area | Planning rule |
|---|---|
| `audit_events` | Append-only structure required |
| Audit actor | Actor user/member references must be representable |
| Audit resource | Resource type and resource id fields required |
| Audit request correlation | `request_id` / `correlation_id` candidate required |
| Audit metadata | Safe metadata payload only; no secrets |
| Audit indexes | Workspace/resource/action/time indexes required |
| `analytics_snapshots` | Source summary and data lineage required |
| Snapshot period | Snapshot timestamp required; period fields require future authoring decision |
| Analytics leakage | Cross-workspace aggregation leakage forbidden |
| Retention/data residency | Future legal/security assessment |

Audit and analytics migration review must verify that operational visibility
does not leak credentials, raw secrets, cross-workspace data, or unapproved
production-readiness claims.

---

## 14. Verification Strategy for Future Migration Authoring Gate

Future SQL Migration Authoring Gate must verify:

- Migration files parse.
- Migration runner decision, if any, is reviewed.
- Up/down execution strategy is defined.
- Rollback strategy is documented.
- No backend/runtime/package changes unless separately approved.
- No ORM models unless separately approved.
- No seed files unless separately approved.
- No generated client.
- OpenAPI-to-SQL alignment remains intact.
- Workspace scoping constraints exist.
- Same-workspace FK protection exists where needed.
- No raw credential columns exist.
- Enum values match approved contract.
- SQL-only statuses remain labeled and constrained as approved.
- Audit/idempotency/concurrency support exists.
- Forbidden-path scan passes.
- Migration files are not applied to any database unless a later execution gate
  explicitly authorizes database application.

Future verification commands should include, as applicable:

- SQL parser or database dry-run check.
- Migration runner plan check.
- Up/down or forward-rollback review.
- `npm run lint` if repository tooling remains relevant.
- `npm run build` if package/tooling remains unchanged and relevant.
- `git status --short`.
- `git diff --stat`.
- Changed-file forbidden-path scan.
- Secret-pattern scan on migration files.
- BIDI scan on new/modified text files.

---

## 15. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Migration framework not selected | HIGH | Defer runner setup until Migration Authoring Gate and Review Gate |
| Migration path not finalized | HIGH | Final path must be approved before files/directories are created |
| Baseline vs sequenced migration risk | MEDIUM | Prefer sequenced migrations by dependency group |
| Rollback complexity | HIGH | Require rollback strategy before executable artifacts |
| Destructive DDL risk | CRITICAL | Destructive operations are NO-GO without explicit review |
| Enum migration risk | HIGH | Enum changes require contract review first |
| Cross-workspace leakage | CRITICAL | Require same-workspace constraints and review |
| Credential leakage | CRITICAL | Plaintext secrets and raw credential columns forbidden |
| Audit/idempotency gaps | HIGH | Audit, version, and idempotency support must be in migration scope before backend lifecycle implementation |
| Backend starting before migration review | HIGH | Backend Slice 1 remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |
| Seed/reference coupling | MEDIUM | Role/permission tables must not imply seed files |
| Package/tooling creep | HIGH | Package changes are forbidden in this planning gate |
| Production/pilot readiness confusion | HIGH | This gate makes no readiness claim |

---

## 16. GO / NO-GO Criteria

### GO criteria for SQL Migration Planning Review Gate

| Criterion | Required result |
|---|---|
| Migration scope boundaries | Clear |
| File strategy | Proposed or explicitly deferred |
| Sequence planning | Complete |
| Safety rules | Defined |
| OpenAPI/schema alignment | Clear |
| Tenancy and credential constraints | Clear |
| Audit/idempotency/concurrency planning | Clear |
| Verification strategy | Defined |
| Executable migrations | None added |
| Migration runner | None introduced |
| Backend/runtime/package changes | None added |

### NO-GO criteria

| Condition | Result |
|---|---|
| Migration files created | NO-GO |
| Migration runner introduced | NO-GO |
| SQL executed or applied | NO-GO |
| Backend code added | NO-GO |
| API route implementation added | NO-GO |
| ORM models added | NO-GO |
| Seed files added | NO-GO |
| Package changes introduced | NO-GO |
| UI changes introduced | NO-GO |
| Generated client introduced | NO-GO |
| Production/pilot readiness claimed | NO-GO |
| Migration strategy unclear | NO-GO |
| Workspace constraints unclear | NO-GO |
| Credential constraints unclear | NO-GO |
| Audit constraints unclear | NO-GO |

---

## 17. Recommended Next Gate

**Nashir SQL Migration Planning Review Gate.**

This planning gate does not authorize SQL Migration Authoring.

This planning gate does not authorize executable migrations.

This planning gate does not authorize migration runner setup.

This planning gate does not authorize backend implementation.

This planning gate does not authorize API route implementation.

This planning gate does not authorize ORM models.

This planning gate does not authorize seed files.

This planning gate does not authorize generated clients.

This planning gate does not authorize package/UI changes.

This planning gate does not authorize production or pilot readiness.

SQL Migration Authoring, executable migrations, backend implementation, ORM
models, generated clients, and production/pilot readiness remain blocked until
this planning gate and its review gate are merged and a later gate explicitly
authorizes the next step.

---

## 18. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_planning_gate.md`; pre-existing untracked `FETCH_HEAD` remains untouched |
| `git diff --stat` | No tracked unstaged diff before staging; new planning document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new planning document shown by `git status --short` |
| BIDI scan on `docs/nashir_sql_migration_planning_gate.md` | `BIDI_CONTROL_CHARS none` |
| Migrations/migration runner/SQL executable/backend/API runtime/ORM/generated/UI/package changed-file search | `FORBIDDEN_CHANGED_FILES: none` |
| Existing migration/SQL file scan | `MIGRATION_SQL_FILES: none` |

Expected result:

- Documentation-only.
- No migrations.
- No migration runner.
- No SQL executable artifacts.
- No backend implementation.
- No ORM models.
- No seed files.
- No generated client.
- No package/UI changes.
- No production/pilot readiness claim.
