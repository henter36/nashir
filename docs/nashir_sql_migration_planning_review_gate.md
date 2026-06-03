# Nashir SQL Migration Planning Review Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Planning Review Gate - documentation only |
| Status | Review complete |
| Date | 2026-06-03 |
| Primary reviewed artifact | `docs/nashir_sql_migration_planning_gate.md` |
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
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is a review gate for Nashir SQL Migration Planning.

The purpose is to decide whether the migration planning is sufficient for a
later SQL Migration Authoring Gate.

This review does not introduce migration files.

This review does not introduce a migration runner.

This review does not execute or apply SQL to a database.

This review does not introduce backend code.

This review does not introduce API route implementation.

This review does not introduce ORM models.

This review does not introduce seed files.

This review does not introduce generated clients.

This review does not introduce UI, package, or build changes.

This review does not claim production or pilot readiness.

---

## 2. Inputs Reviewed

### Direct inputs

| Input | Review use |
|---|---|
| `docs/nashir_sql_migration_planning_gate.md` | Primary reviewed artifact |
| `docs/nashir_sql_schema_authoring_gate.md` | Controlling schema contract input |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Controlling schema review input and authorization for migration planning |
| `docs/nashir_sql_schema_authoring_planning_gate.md` | Authoring planning context |
| `docs/nashir_sql_schema_authoring_planning_review_gate.md` | Authoring planning review context |
| `docs/nashir_sql_schema_planning_gate.md` | Persistence planning baseline |
| `docs/nashir_sql_schema_planning_review_gate.md` | Persistence planning review baseline |
| `docs/nashir_v1_openapi.yaml` | Current API contract authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |
| `README.md` | Product status and non-production boundary |
| `docs/screen_map.md` | UI journey and mock-only context |

### Contextual inputs

| Input | Review use |
|---|---|
| `docs/nashir_erd_data_model_gate.md` | Entity and relationship source |
| `docs/nashir_erd_data_model_review_gate.md` | ERD/Data Model review confirmation |
| `docs/nashir_backend_api_strategy_gate.md` | Backend/API strategy context |
| `docs/nashir_backend_api_strategy_review_gate.md` | Backend/API strategy review confirmation |
| V1 Scope Decision Gate and Review Gate | Product scope context |
| Product Scope Reconciliation Gate and Review Gate | Product authority and reconciliation context |

### Authority check

| Authority | Result | Assessment |
|---|---|---|
| Nashir is product, UI journey, scope, API contract, SQL schema contract, and data model authority | **PASS** | Reviewed planning follows Nashir-first inputs |
| marketing-os is reference-only | **PASS** | No marketing-os code, migrations, runner scripts, runtime shape, or entities are copied |
| Schema authoring gate controls SQL contract | **PASS** | Migration planning follows the reviewed schema contract |

---

## 3. Scope Compliance Review

| Scope item | Result | Assessment |
|---|---|---|
| Documentation-only | **PASS** | This review creates one Markdown file only |
| Planning/review only | **PASS** | No implementation or executable artifact is introduced |
| Nashir-first | **PASS** | Review is based on Nashir gates and OpenAPI |
| marketing-os reference-only | **PASS** | No extraction or backend-shape import |
| No executable migrations | **PASS** | No SQL migration files are created |
| No migration runner | **PASS** | No runner or migration framework is introduced |
| No database-applied changes | **PASS** | No SQL is executed or applied |
| No backend/API runtime implementation | **PASS** | No source, route, handler, service, or middleware files are changed |
| No ORM models | **PASS** | No model layer is introduced |
| No seed files | **PASS** | Role/permission seeds remain unauthorized |
| No generated client | **PASS** | No generated/runtime client is produced |
| No UI/package changes | **PASS** | No UI, `package.json`, lockfile, or build files are changed |
| No production/pilot readiness claim | **PASS** | Review remains gate-only |

---

## 4. Migration File Strategy Review

| Strategy item | Result | Assessment |
|---|---|---|
| Migration directory | **PASS** | No repo convention exists; path options are proposed and final path is deferred |
| Directory creation | **PASS** | Planning explicitly does not create migration directories |
| Naming convention | **PASS** | Sortable timestamped, numbered, descriptive filename format is proposed |
| Baseline vs sequenced migrations | **PASS** | Sequenced migrations by dependency group are preferred over one large baseline |
| Rollback/down expectations | **PASS** | Down files, down sections, or forward-only corrective migrations are listed as future choices |
| Migration metadata tracking | **PASS** | Filename, order, timestamp, checksum, status, runner version, and failure details are planned |
| Unresolved path/framework decisions | **PASS** | Final migration path, runner selection, up/down style, rollback, and metadata table remain explicitly deferred |

No file-strategy blocker was found.

---

## 5. Migration Sequence Review

| Sequence group | Result | Assessment |
|---|---|---|
| Foundation identity/tenant: `workspaces`, `users`, `workspace_members` | **PASS** | Correctly first; establishes tenant root, global identity, and authorization binding before merchant-owned data |
| Store/product/source: `store_profiles`, `products`, `data_sources`, `channel_connections`, `integration_credentials` | **PASS** | Correctly follows foundation tables; credential boundary and source/channel metadata are ordered before campaigns/content |
| Asset/campaign/content: `assets`, `campaigns`, `campaign_briefs`, `campaign_content_items`, `content_drafts`, `content_approvals` | **PASS** | Correctly depends on foundation plus product/source context; lifecycle rollback and immutable approvals are flagged |
| Publishing/analytics/audit: `publishing_jobs`, `publishing_statuses`, `analytics_snapshots`, `audit_events` | **PASS** | Correctly follows campaign/content/channel resources; append-only trail and lineage rollback risks are visible |
| Support/reference: `idempotency_keys`, `roles`, `permissions`, `role_permissions` if approved later | **PASS** | Correctly treated as support/reference candidates, with seed coupling deferred |
| Dependency correctness | **PASS** | Sequence prevents child tables from preceding tenant, actor, source, campaign, and content roots |
| Ordering rationale | **PASS** | Each group explains why it follows prior groups |
| Rollback risk | **PASS** | High-risk lifecycle, audit, and credential rollback areas are flagged |
| Cross-workspace constraint risk | **PASS** | Same-workspace constraints are called out throughout sequence planning |
| V1 required vs deferred clarity | **PASS** | V1 required groups and support/reference candidates are distinct |

No sequencing blocker was found.

---

## 6. Migration Safety Rules Review

| Safety rule | Result | Assessment |
|---|---|---|
| No destructive operations without explicit review | **PASS** | Explicit review is required before destructive DDL |
| Additive changes preferred | **PASS** | Additive-first migration posture is preserved |
| Hard deletes forbidden unless separately approved | **PASS** | Hard delete behavior remains blocked without later approval |
| Table and column drops forbidden unless separately approved | **PASS** | Drop operations remain blocked without later approval |
| Restrict/cascade behavior explicit | **PASS** | Restrict/no cascade is default; `CASCADE` requires explicit review |
| No plaintext credential columns | **PASS** | Credential columns must remain reference-only |
| No cross-workspace leakage | **PASS** | Same-workspace constraints are required where needed |
| Idempotent migration execution expectations | **PASS** | Runner metadata or protection against repeat corruption is planned |
| Rollback expectations | **PASS** | Rollback strategy must be defined before executable files exist |
| Data backfill rules | **PASS** | Backfills are out of scope unless separately planned with source, target, batching, validation, rollback, and no-secret rules |
| Transaction boundaries | **PASS** | Per-migration transaction boundaries and non-transactional DDL review are required |
| Lock risk | **PASS** | Long-running locks must be assessed before execution is allowed |

No safety-rule blocker was found.

---

## 7. OpenAPI-to-Migration Alignment Review

| Alignment area | Result | Assessment |
|---|---|---|
| OpenAPI schemas | **PASS** | Future migrations must map persisted OpenAPI entities to approved table/field strategy or explicit deferral |
| SQL schema authoring contract | **PASS** | Planning is tied to `docs/nashir_sql_schema_authoring_gate.md` |
| Auth/RBAC/Workspace Identity | **PASS** | `users`, `workspaces`, and `workspace_members` preserve identity and authorization binding |
| Workspace scoping | **PASS** | Merchant-owned tables must carry `workspace_id` and prevent cross-workspace FK linkage |
| Status enums | **PASS** | OpenAPI-approved and SQL-only proposal statuses are separated |
| Lifecycle and approval semantics | **PASS** | Draft, approval, withdraw, rejection, version, and idempotency fields are required |
| Idempotency/concurrency | **PASS** | Idempotency keys and resource version fields are in future migration requirements |
| Audit and analytics lineage | **PASS** | Audit events and analytics source summary/lineage are required |
| Blocking mismatch rule | **PASS** | OpenAPI or schema-contract mismatch is NO-GO |

No OpenAPI alignment blocker was found.

---

## 8. Enum Migration Planning Review

| Enum area | Result | Assessment |
|---|---|---|
| PostgreSQL ENUM candidate handling | **PASS** | OpenAPI-approved stable enums are candidates only |
| TEXT + CHECK candidate handling | **PASS** | SQL-only/evolving proposal statuses remain TEXT + CHECK candidates |
| Enum change review process | **PASS** | Enum changes require contract review before migration changes |
| OpenAPI mismatch rule | **PASS** | Any OpenAPI enum mismatch is NO-GO |
| No unapproved enum values | **PASS** | No enum value may be introduced without prior contract approval |
| `WorkspaceMemberStatus` | **PASS** | Values remain active, invited, suspended |
| `AnalyticsSnapshotStatus` | **PASS** | Values remain available, partial, stale, unavailable |
| `CampaignStatus` | **PASS** | OpenAPI-approved candidate |
| `ContentDraftStatus` | **PASS** | OpenAPI-approved candidate |
| `CampaignContentItemStatus` | **PASS** | OpenAPI-approved candidate |
| `PublishingJobStatus` | **PASS** | OpenAPI-approved candidate |
| `ContentApprovalDecision` | **PASS** | OpenAPI-approved server-owned decision candidate |
| SQL-only proposal statuses | **PASS** | Not treated as OpenAPI-approved |

No enum migration blocker was found.

---

## 9. Tenancy and Constraint Migration Review

| Tenancy/constraint item | Result | Assessment |
|---|---|---|
| `workspace_id` on merchant-owned tables | **PASS** | Merchant-owned persistence remains workspace-scoped |
| Global `users` table | **PASS** | Global identity exception is explicit |
| Same-workspace FK constraints | **PASS** | Required where child and parent are workspace-owned |
| Composite uniqueness | **PASS** | Required where tenant-scoped or relationship-scoped |
| `users.email` global case-insensitive uniqueness | **PASS** | Database-level case-insensitive uniqueness is required |
| Email implementation options | **PASS** | `LOWER(email)` functional unique index or approved `citext` type/extension are listed |
| Email implementation deferral | **PASS** | Final choice is deferred to SQL Migration Authoring Gate / Review Gate |
| `workspace_members` user/workspace uniqueness | **PASS** | Unique membership per user/workspace is planned |
| `store_profiles` workspace uniqueness | **PASS** | One store profile per workspace is planned |
| `campaign_briefs` campaign uniqueness | **PASS** | One brief per campaign is planned |
| Idempotency scope uniqueness | **PASS** | Workspace, operation family, actor/member, and idempotency key scope is required |

No tenancy or constraint blocker was found.

---

## 10. Credential Migration Planning Review

| Credential item | Result | Assessment |
|---|---|---|
| `integration_credentials.channel_connection_id` | **PASS** | Optional target candidate is planned |
| `integration_credentials.data_source_id` | **PASS** | Optional target candidate is planned |
| Same-workspace scoping | **PASS** | Composite FKs including `workspace_id` are required for credential target links |
| Target exclusivity or credential-scope decision | **PASS** | Must be decided before executable migrations |
| Final FK/check shape | **PASS** | Deferred to SQL Migration Authoring Gate / Review Gate |
| `credential_ref` / `vault_ref` only | **PASS** | Credential storage remains opaque-reference only |
| No plaintext secrets | **PASS** | Raw secrets remain forbidden |
| Credential mutation audit | **PASS** | Create, revoke, rotate, and remove operations require audit support |

No credential planning blocker was found.

---

## 11. Lifecycle, Idempotency, and Concurrency Migration Review

| Lifecycle/idempotency item | Result | Assessment |
|---|---|---|
| Resource version fields | **PASS** | Mutable resources require version support |
| `idempotency_keys` table | **PASS** | Included if approved for migration scope |
| Idempotency key scope | **PASS** | Workspace, operation family, actor/member, and idempotency key are required |
| Request hash / replay metadata | **PASS** | Replay validation and response replay metadata are addressed as candidates |
| Expiry/retention | **PASS** | Expiry and retention planning is required |
| Content draft lifecycle support | **PASS** | Draft lifecycle state support is planned |
| ContentApproval immutability | **PASS** | Approval records remain immutable decision records |
| `rejectionReason` persistence | **PASS** | Rejection reason round-trip is preserved |
| `requiredChanges` persistence | **PASS** | Required changes round-trip is preserved |
| Self-approval prevention support | **PASS** | Creator/reviewer references are preserved for service-layer rules |
| 409 conflict support | **PASS** | Version and idempotency metadata support conflict behavior |

No lifecycle/idempotency/concurrency blocker was found.

---

## 12. Audit and Analytics Migration Review

| Audit/analytics item | Result | Assessment |
|---|---|---|
| `audit_events` append-only structure | **PASS** | Audit events remain append-only |
| Database-level append-only enforcement | **PASS** | Enforcement is planned beyond service-layer behavior |
| Future enforcement options | **PASS** | Triggers preventing `UPDATE`/`DELETE`, revoked `UPDATE`/`DELETE` privileges, and other reviewed database-level enforcement are listed |
| Final audit enforcement deferral | **PASS** | Final implementation is deferred to SQL Migration Authoring Gate / Review Gate |
| Audit query indexes | **PASS** | Workspace/resource/action/time indexes are required |
| Safe metadata payload | **PASS** | No secrets are allowed in audit metadata |
| `analytics_snapshots` sourceSummary/data lineage | **PASS** | Analytics lineage remains required |
| No cross-workspace aggregation leakage | **PASS** | Workspace isolation remains required for analytics |
| Retention/data residency | **PASS** | Remains future legal/security assessment |

No audit or analytics blocker was found.

---

## 13. Verification Strategy Review

| Verification requirement | Result | Assessment |
|---|---|---|
| Migration files parse | **PASS** | Future migration files must parse before approval |
| Migration runner decision reviewed | **PASS** | Runner decisions must be reviewed before setup |
| Up/down execution strategy | **PASS** | Future authoring must define execution direction strategy |
| Rollback strategy | **PASS** | Rollback planning is required before executable artifacts |
| No backend/runtime/package changes unless separately approved | **PASS** | Runtime and package changes remain outside this gate |
| No generated client | **PASS** | Generated clients remain unauthorized |
| OpenAPI-to-SQL alignment | **PASS** | Future migrations must remain contract-aligned |
| Workspace scoping constraints | **PASS** | Workspace constraints must be present |
| Same-workspace FK protection | **PASS** | Same-workspace FK protection must be verified |
| Case-insensitive email uniqueness | **PASS** | Database-level case-insensitive uniqueness must be verified |
| Credential target same-workspace linkage | **PASS** | Credential target FKs must preserve workspace scoping |
| Database-level audit append-only enforcement | **PASS** | Audit append-only enforcement must be database-level |
| No raw credential columns | **PASS** | Raw credential columns remain forbidden |
| Enum values match approved contract | **PASS** | Enum values must match approved OpenAPI/planning contracts |
| Forbidden path scan | **PASS** | Future authoring must scan changed paths |
| No database application without later execution gate | **PASS** | Database application remains blocked without later approval |

No verification-strategy blocker was found.

---

## 14. Risks and Gaps

### Blocking issues

| Issue | Result |
|---|---|
| Blocking migration planning issue | **NONE FOUND** |
| Blocking OpenAPI/schema inconsistency | **NONE FOUND** |
| Blocking Auth/RBAC/workspace inconsistency | **NONE FOUND** |

### Non-blocking watch items

| Risk / gap | Severity | Control |
|---|---|---|
| Migration framework not selected | HIGH | Must be selected or deferred explicitly in SQL Migration Authoring Gate |
| Migration path not finalized | HIGH | Must be approved before files/directories are created |
| Baseline vs sequenced migration risk | MEDIUM | Sequenced migrations are preferred |
| Rollback complexity | HIGH | Rollback strategy required before executable artifacts |
| Destructive DDL risk | CRITICAL | Destructive operations remain NO-GO without explicit review |
| Enum migration risk | HIGH | Enum changes require contract review first |
| Cross-workspace leakage | CRITICAL | Same-workspace constraints must be proven in authoring |
| Credential leakage | CRITICAL | Plaintext secrets and raw credential columns remain forbidden |
| Audit/idempotency gaps | HIGH | Audit, version, and idempotency support must be present before backend lifecycle implementation |
| Case-sensitive duplicate user emails | HIGH | Case-insensitive database-level uniqueness is now required |
| Cross-workspace credential linkage | CRITICAL | Composite credential target FKs including `workspace_id` are now required |
| Audit log tampering if append-only is only service-enforced | HIGH | Database-level append-only enforcement is now required |
| Backend starting before migration review | HIGH | Backend Slice 1 remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |

---

## 15. PASS / FAIL / WATCH Checklist

| Check | Result |
|---|---|
| Scope compliance | **PASS** |
| Migration file strategy | **PASS** |
| Migration sequence clarity | **PASS** |
| Safety rules | **PASS** |
| OpenAPI-to-migration alignment | **PASS** |
| Enum migration planning | **PASS** |
| Tenancy constraints | **PASS** |
| Credential safeguards | **PASS** |
| Lifecycle/idempotency/concurrency | **PASS** |
| Audit/analytics | **PASS** |
| Verification strategy | **PASS** |
| No implementation changes | **PASS** |
| Migration framework selection | **WATCH** |
| Migration path finalization | **WATCH** |
| Rollback implementation details | **WATCH** |

---

## 16. GO / NO-GO Decision

**Decision: GO to SQL Migration Authoring Gate.**

The SQL Migration Planning Gate is sufficient for the next gate.

This authorizes only the next gate.

This does not authorize executable migrations by itself.

This does not authorize migration runner setup by itself.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize API route implementation.

This does not authorize ORM models.

This does not authorize seed files.

This does not authorize generated clients.

This does not authorize package/UI changes.

This does not authorize production or pilot readiness.

---

## 17. Final Summary

| Item | Summary |
|---|---|
| Inputs | SQL Migration Planning Gate, SQL Schema Authoring Gate and Review Gate, prior SQL planning gates, OpenAPI YAML, Auth/RBAC gates, ERD/Data Model gates, backend strategy context, README, and screen map |
| Outputs | One documentation-only SQL Migration Planning Review Gate |
| Remaining gaps | Migration path, runner/framework, executable rollback mechanism, migration metadata implementation, and final FK/constraint SQL remain future authoring/review decisions |
| Decision required before next phase | SQL Migration Authoring Gate must define exact allowed files, executable migration contents, runner decision, rollback strategy, parse/dry-run verification, and forbidden-path controls before any migration can be applied |
| Recommended next gate | Nashir SQL Migration Authoring Gate |

---

## 18. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_planning_review_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new review document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new review document shown by `git status --short` |
| `wc -l docs/nashir_sql_migration_planning_review_gate.md` | 428 lines before verification-result update |
| BIDI scan: `docs/nashir_sql_migration_planning_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/nashir_sql_migration_planning_review_gate.md` | `BIDI_CONTROL_CHARS none` |
| Migrations/migration runner/SQL executable/backend/API runtime/ORM/generated/UI/package changed-file search | `FORBIDDEN_CHANGED_FILES: none` |

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
