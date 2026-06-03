# Nashir SQL Schema Authoring Planning Review Gate

| Field | Value |
|---|---|
| Gate type | SQL Schema Authoring Planning Review Gate - documentation only |
| Status | Review complete |
| Date | 2026-06-03 |
| Primary reviewed artifact | `docs/nashir_sql_schema_authoring_planning_gate.md` |
| SQL DDL created | NO |
| Migrations created | NO |
| Database schema files created | NO |
| ORM models created | NO |
| Seed files created | NO |
| Backend routes implemented | NO |
| Generated client produced | NO |
| UI changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is a review gate for SQL Schema Authoring Planning.

The primary reviewed artifact is
`docs/nashir_sql_schema_authoring_planning_gate.md`.

This review decides whether the future SQL Schema Authoring Gate is sufficiently
planned and constrained.

No SQL DDL is introduced.

No migrations are introduced.

No database schema files are introduced.

No ORM models are introduced.

No seed files are introduced.

No backend code or API route implementation is introduced.

No generated clients are introduced.

No UI, package, or build changes are introduced.

No marketing-os extraction is authorized.

No production or pilot readiness is claimed.

---

## 2. Inputs Reviewed

### Direct inputs

| Input | Review use |
|---|---|
| `docs/nashir_sql_schema_authoring_planning_gate.md` | Primary reviewed artifact |
| `docs/nashir_sql_schema_planning_gate.md` | Persistence model planning baseline |
| `docs/nashir_sql_schema_planning_review_gate.md` | Prior review decision and constraints |
| `docs/nashir_v1_openapi.yaml` | Current API contract authority |
| `docs/nashir_openapi_yaml_deferred_decisions_gate.md` | Status, lifecycle, idempotency, and concurrency decisions |
| `docs/nashir_openapi_yaml_deferred_decisions_review_gate.md` | Review confirmation for deferred OpenAPI decisions |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity design |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |
| `README.md` | Nashir product status and mock-only constraints |
| `docs/screen_map.md` | Approved screen map and mock-only constraints |

### Contextual inputs

| Input | Review use |
|---|---|
| `docs/nashir_erd_data_model_gate.md` | Entity and relationship source |
| `docs/nashir_erd_data_model_review_gate.md` | ERD/Data Model review confirmation |
| `docs/nashir_backend_api_strategy_gate.md` | Backend/API strategy context |
| `docs/nashir_backend_api_strategy_review_gate.md` | Backend/API strategy review confirmation |
| `docs/nashir_v1_scope_decision_gate.md` | Approved V1 scope and journey |
| `docs/nashir_v1_scope_decision_review_gate.md` | V1 scope review confirmation |
| `docs/nashir_product_scope_reconciliation_gate.md` | Product scope reconciliation |
| `docs/nashir_product_scope_reconciliation_review_gate.md` | Product scope review confirmation |

### Authority check

| Authority | Result |
|---|---|
| Nashir is the product, scope, UI journey, API contract, and future data model authority | **PASS** |
| marketing-os remains reference-only | **PASS** |
| No marketing-os code, entity model, backend shape, runtime assumption, or journey is copied | **PASS** |

---

## 3. Scope Compliance Review

| Scope item | Result | Assessment |
|---|---|---|
| Documentation-only | **PASS** | Review creates one Markdown document only |
| Planning/review only | **PASS** | Review does not authorize implementation |
| Nashir-first | **PASS** | Review uses Nashir docs and OpenAPI as authority |
| marketing-os reference-only | **PASS** | No extraction or product-shape import |
| No SQL DDL | **PASS** | No SQL statements or SQL files created |
| No migrations | **PASS** | No migration files created |
| No ORM models | **PASS** | No model files created |
| No seed files | **PASS** | Role/permission seeds remain planning candidates |
| No backend/API runtime implementation | **PASS** | No source or route files changed |
| No generated client | **PASS** | No generated/runtime client created |
| No UI/package changes | **PASS** | No UI, `package.json`, or lockfile changes |
| No production/pilot readiness claim | **PASS** | Decision remains gate-only |

---

## 4. Authoring Sequence Review

| Sequence group | Result | Assessment |
|---|---|---|
| Foundation tables | **PASS** | `workspaces`, `users`, and `workspace_members` correctly establish tenant root, global identity, and authorization binding first |
| Store/product/source tables | **PASS** | Store, catalog, source/channel, credential, and asset structures correctly follow foundation tables |
| Campaign/content tables | **PASS** | Campaign and content lifecycle tables depend on foundation plus product/source context |
| Publishing/analytics/audit tables | **PASS** | Operational trails and lineage follow core entity dependencies |
| Support/reference candidates | **PASS** | `idempotency_keys`, `roles`, `permissions`, and `role_permissions` are correctly planning-only candidates |
| Dependency correctness | **PASS** | Ordering avoids referencing missing tenant, actor, campaign, and content roots |
| Risk if reordered | **PASS** | Planning identifies ownership, traceability, and leakage risks if reordered |
| V1 required vs deferred clarity | **PASS** | V1 required, support candidates, and deferred Admin/Governance/Extended V1 groups are separated |

No ordering blocker was found.

---

## 5. Table Authoring Checklist Review

Future SQL authoring must specify primary keys, workspace/tenant boundaries,
foreign keys, nullable vs required fields, server-owned fields, status fields,
audit fields, timestamps, archive/delete fields, metadata/JSON fields,
sensitive fields, indexes, uniqueness constraints, check constraints or enum
strategy, cascade/restrict delete behavior, OpenAPI schema mapping, and
verification requirements.

| Table | Result | Assessment |
|---|---|---|
| `workspaces` | **PASS** | Root tenant table checklist covers PK, status, server-owned timestamps, no hard delete, indexes, OpenAPI mapping, and verification |
| `users` | **PASS** | Global identity, email uniqueness, normalization deferral, PII ownership, auth deferrals, indexes, and verification are covered |
| `workspace_members` | **PASS** | Checklist covers workspace/user FKs, role code, OpenAPI status, archive fields, timestamps, uniqueness, RBAC mapping, and verification |
| `store_profiles` | **PASS** | One-per-workspace boundary, status, timestamps, uniqueness, mapping, and verification are covered |
| `products` | **PASS** | Checklist covers workspace ownership, business fields, status, archive, timestamps, status filters, FK behavior, OpenAPI mapping, and verification |
| `data_sources` | **PASS** | Checklist covers workspace boundary, provider fields, connection status, sync status, indexes, nullify/delete expectations, and verification |
| `channel_connections` | **PASS** | Workspace/source relationship, provider fields, status, uniqueness decision, no credential fields, and verification are covered |
| `integration_credentials` | **PASS** | Optional targets, scope decision, vault/ref boundary, no plaintext secrets, audit, deferred constraints, and verification are covered |
| `assets` | **PASS** | Checklist covers workspace, optional product/content links, storage reference, status, archive, timestamps, indexes, OpenAPI mapping, and verification |
| `campaigns` | **PASS** | Checklist covers workspace, product relationship, OpenAPI status, version, archive, timestamps, indexes, and verification |
| `campaign_briefs` | **PASS** | Checklist covers campaign uniqueness, workspace, fields, archive-with-campaign expectations, mapping, and verification |
| `campaign_content_items` | **PASS** | Checklist covers campaign/current draft relationships, status, version, archive, circular FK strategy, indexes, mapping, and verification |
| `content_drafts` | **PASS** | Content item/creator relationships, lifecycle status, resource version, archive, indexes, mapping, and verification are covered |
| `content_approvals` | **PASS** | Draft/reviewer FKs, decision enum, rejection metadata, immutability, self-approval prevention, mapping, and verification are covered |
| `publishing_jobs` | **PASS** | Checklist covers campaign/content/channel FKs, schedule, status, version, cancel field, queue indexes, mapping, and verification |
| `publishing_statuses` | **PASS** | Checklist covers job FK, status trail field, message, occurred timestamp, append-only behavior, indexes, mapping, and verification |
| `analytics_snapshots` | **PASS** | Checklist covers status, subject, JSON metrics, source summary, snapshot time/period decision, indexes, mapping, and verification |
| `audit_events` | **PASS** | Workspace, actor/member references, resource fields, action, correlation, safe metadata, append-only behavior, indexes, and no secrets are covered |
| `idempotency_keys` | **PASS** | Workspace, operation family, actor/member, key, request hash, replay fields, expiry, uniqueness, retention, and mapping are covered |
| `roles` | **PASS** | Reference/seed candidate checklist remains planning-only and defers seed files |
| `permissions` | **PASS** | Reference/seed candidate checklist remains planning-only and defers seed files |
| `role_permissions` | **PASS** | Mapping checklist covers FK/composite strategy and remains planning-only |

---

## 6. Gemini Correction Review

| Correction | Result | Assessment |
|---|---|---|
| `integration_credentials` includes optional `channel_connection_id` | **PASS** | Checklist and credential rules include optional channel target |
| `integration_credentials` includes optional `data_source_id` | **PASS** | Checklist and credential rules include optional data source target |
| Credential target exclusivity or scope model required | **PASS** | Future authoring must decide exactly one target or documented workspace-level credential model |
| Final credential FK/check constraints deferred | **PASS** | Planning explicitly defers final FK/check constraints to SQL Schema Authoring Gate |
| Credential ref/vault ref boundary preserved | **PASS** | Opaque `credential_ref` / `vault_ref` style reference remains required |
| No plaintext secrets | **PASS** | Plaintext secrets remain forbidden |
| `content_approvals` uses self-approval prevention support | **PASS** | Stale "self-approval support" wording is removed |
| Self-approval prevention is service-layer enabled | **PASS** | Planning requires enough fields/references and does not imply SQL alone enforces all business rules |
| `users.email` global unique candidate | **PASS** | Users checklist and index/constraint plan include global unique email candidate |
| Email normalization/case-folding deferred | **PASS** | Lowercased email, CITEXT, or functional unique index decision is deferred |

---

## 7. Status Enum Authoring Strategy Review

| Enum strategy check | Result | Assessment |
|---|---|---|
| OpenAPI-approved stable enums are PostgreSQL ENUM candidates only | **PASS** | Planning does not finalize physical DDL |
| SQL-only/evolving proposal statuses are TEXT + CHECK candidates | **PASS** | Planning preserves early-authoring flexibility |
| Final physical DDL representation remains deferred | **PASS** | SQL Schema Authoring Gate must decide |
| No unapproved enum values may be introduced | **PASS** | Planning requires OpenAPI or approved planning-doc source |
| Enum mismatch with OpenAPI is NO-GO | **PASS** | Explicit NO-GO rule exists |
| WorkspaceMember.status | **PASS** | active/invited/suspended is OpenAPI-approved |
| AnalyticsSnapshot.status | **PASS** | available/partial/stale/unavailable is OpenAPI-approved |
| Campaign/Content/Publishing/Approval enums | **PASS** | All remain OpenAPI-approved candidates, not executable migration approvals |

---

## 8. Workspace Scoping and Tenancy Review

| Tenancy check | Result | Assessment |
|---|---|---|
| Merchant-owned tables carry `workspace_id` unless explicitly global | **PASS** | Planning requires it |
| Global exceptions are explicit | **PASS** | `users` and approved reference tables are the only global candidates |
| Cross-workspace FK leakage is prevented | **PASS** | Future authoring must prevent same-table cross-workspace linkage |
| Composite constraints identified | **PASS** | Campaign/content/publishing/asset relationships are flagged |
| StoreProfile one-per-workspace | **PASS** | Unique workspace constraint planned |
| WorkspaceMember user/workspace uniqueness | **PASS** | Unique user/workspace membership planned |
| List queries indexable by workspace_id | **PASS** | Required for workspace-scoped lists |
| Path-derived workspace scoping | **PASS** | `workspace_id` must be path/server-derived, not request-body trusted |

---

## 9. Auth/RBAC Persistence Review

| Auth/RBAC check | Result | Assessment |
|---|---|---|
| User global identity | **PASS** | `users` remains global and not workspace-scoped |
| WorkspaceMember authorization binding | **PASS** | `workspace_members` links user, workspace, role, and status |
| Role/permission persistence planning-only | **PASS** | Reference/seed tables remain candidates and seed files are not authorized |
| active/invited/suspended implication | **PASS** | invited/suspended must not authorize workspace access |
| Platform-admin confusion avoided | **PASS** | Workspace roles do not imply global platform admin behavior |
| No backend auth provider implementation | **PASS** | Auth provider persistence and implementation remain deferred |
| Audit for member changes | **PASS** | Invite, activate, suspend, remove, and role-change audit support is required |

---

## 10. Credential Storage Review

| Credential check | Result | Assessment |
|---|---|---|
| No raw credentials in ChannelConnection | **PASS** | ChannelConnection remains metadata-only |
| IntegrationCredential separates reference metadata | **PASS** | Credential reference metadata is separated from channel/source metadata |
| Optional `data_source_id` planning clear | **PASS** | Optional data source credential target is planned |
| Optional `channel_connection_id` planning clear | **PASS** | Optional channel credential target is planned |
| Target exclusivity/scope model required | **PASS** | Future authoring must decide target rule or workspace-level model |
| Plaintext secrets forbidden | **PASS** | Explicitly forbidden |
| Encryption/vault provider deferred | **PASS** | Deferred to Security Gate / implementation |
| Credential mutation audit planned | **PASS** | Create, revoke, and rotate require audit support |

---

## 11. Content Approval and Lifecycle Review

| Lifecycle check | Result | Assessment |
|---|---|---|
| ContentDraft status planning | **PASS** | OpenAPI-approved ContentDraftStatus candidate |
| submit-review support | **PASS** | Draft to ready_for_review support planned |
| approve support | **PASS** | Approval decision and status updates planned |
| reject support | **PASS** | Rejection decision, reason, and required changes planned |
| withdraw support | **PASS** | Creator self-withdrawal support planned |
| ContentApproval immutable records | **PASS** | Create-only immutable record planning |
| Decision server-derived from path/operation | **PASS** | Not trusted from arbitrary client body |
| rejectionReason / requiredChanges round-trip | **PASS** | Round-trip support required |
| Self-approval prevention support | **PASS** | Fields/references must enable service-layer prevention |
| Creator self-withdrawal support | **PASS** | Creator identification support planned |
| Resource version / optimistic concurrency | **PASS** | Mutable lifecycle resources require version fields |
| Idempotency keys for lifecycle POSTs | **PASS** | Required before backend implementation |

---

## 12. Idempotency and Concurrency Review

| Idempotency/concurrency check | Result | Assessment |
|---|---|---|
| `idempotency_keys` scope | **PASS** | Included as SQL authoring scope candidate |
| Operation family + workspace + actor/member + key | **PASS** | Candidate uniqueness scope is planned |
| Request hash | **PASS** | Planned for replay matching |
| Response replay fields | **PASS** | Response status/body candidates are planned |
| Expiry/retention | **PASS** | Expiry and cleanup/retention policy must be planned |
| Resource version fields | **PASS** | Required for mutable lifecycle/concurrency-sensitive resources |
| 409 conflict alignment | **PASS** | Stale version and in-progress idempotency conflicts align with OpenAPI semantics |
| No backend implementation | **PASS** | Planning only |

---

## 13. Audit and Analytics Review

| Audit/analytics check | Result | Assessment |
|---|---|---|
| `audit_events` append-only | **PASS** | Append-only future DDL expectation |
| Actor user/member context | **PASS** | Actor user and/or member context must be representable |
| Resource type/id | **PASS** | Resource references required |
| Request/correlation id | **PASS** | Candidate must be evaluated |
| No secrets in audit payload | **PASS** | Secrets, raw credentials, and vault secret values are forbidden |
| Retention/data residency | **PASS** | Deferred to legal/compliance gate |
| Analytics lineage/sourceSummary | **PASS** | `source_summary` / `sourceSummary` mapping preserved |
| Snapshot timing/period | **PASS** | Snapshot timestamp required; period fields to be decided if needed |
| No cross-workspace analytics leakage | **PASS** | Workspace leakage is forbidden |

---

## 14. Index and Constraint Review

| Index/constraint area | Result | Assessment |
|---|---|---|
| Workspace_id indexes | **PASS** | Required on workspace-scoped listable tables |
| FK indexes | **PASS** | Required for major parent/child lookups |
| Status filters | **PASS** | Required for status-filtered operational lists |
| updated_at and created_at filters/order | **PASS** | Explicitly evaluated for mutable lists and chronological views |
| Content review queues | **PASS** | Workspace/status/content item/creator indexing planned |
| Publishing queue | **PASS** | Workspace/status/campaign/scheduled indexing planned |
| Analytics period | **PASS** | Workspace/subject/snapshot time or period indexing planned |
| Audit workspace/resource/action/time | **PASS** | Audit query indexes planned |
| `users.email` global unique candidate | **PASS** | Included with case strategy deferred |
| `workspace_members` user/workspace | **PASS** | Unique membership planned |
| `store_profiles` workspace | **PASS** | One profile per workspace planned |
| `campaign_briefs` campaign | **PASS** | One brief per campaign planned |
| Idempotency key scope | **PASS** | Unique scope planned |
| Soft archive filters | **PASS** | Partial index or query-filter evaluation planned |

---

## 15. Delete / Archive Review

| Delete/archive check | Result | Assessment |
|---|---|---|
| Soft archive preferred | **PASS** | `archived_at` or equivalent preferred for merchant-owned archive |
| Hard delete deferred unless approved | **PASS** | Hard delete requires explicit approval |
| Cascade restrict by default | **PASS** | Restrict/no cascade default is planned unless justified |
| Nullify behavior | **PASS** | Allowed only for approved optional metadata links |
| Audit on archive/delete | **PASS** | Required for archive/delete/revoke/remove operations |
| Cross-workspace safety | **PASS** | Delete/archive operations must remain workspace-scoped |
| Append-only records protected | **PASS** | Audit events, approvals, publishing statuses, and snapshots should not be hard-deleted in V1 planning |

---

## 16. SQL Authoring File Strategy Review

| File strategy check | Result | Assessment |
|---|---|---|
| Future SQL file location proposed or deferred | **PASS** | Deferred to SQL Schema Authoring Gate if no convention exists |
| Migration naming convention proposed or deferred | **PASS** | Deferred to SQL Schema Authoring Gate |
| One large migration vs sequenced migrations discussed | **PASS** | Sequenced authoring by dependency group is preferred if framework supports it |
| Schema vs seed split | **PASS** | Seed/reference data must stay separate and unauthorized until approved |
| Rollback/up-down convention | **PASS** | Deferred to migration framework decision |
| Future SQL verification expectations clear | **PASS** | Parse and migration behavior checks are required if SQL is introduced |

---

## 17. Verification Strategy Review

Future SQL Schema Authoring Gate must verify:

| Verification expectation | Result |
|---|---|
| SQL parses | **PASS** |
| Migrations run up/down if migration framework exists | **PASS** |
| No runtime/backend code | **PASS** |
| No generated client | **PASS** |
| OpenAPI-to-SQL mapping remains aligned | **PASS** |
| Workspace scoping constraints exist | **PASS** |
| Status enum values match OpenAPI and approved planning docs | **PASS** |
| No raw credential columns | **PASS** |
| Audit support present | **PASS** |
| Idempotency support present | **PASS** |
| Optimistic concurrency support present | **PASS** |
| Rollback strategy if migrations are introduced later | **PASS** |

---

## 18. Risks and Gaps

### Blocking issues

| Issue | Result |
|---|---|
| Blocking SQL authoring planning defect | **NONE FOUND** |
| Scope violation | **NONE FOUND** |
| OpenAPI cross-contract inconsistency requiring YAML change | **NONE FOUND** |

### Non-blocking watch items

| Watch item | Severity | Follow-up gate |
|---|---|---|
| Migration framework and SQL file path decision | WATCH | SQL Schema Authoring Gate |
| Credential target exclusivity vs workspace-level credential-scope model | WATCH | SQL Schema Authoring Gate |
| Email case-folding strategy | WATCH | SQL Schema Authoring Gate |
| Cross-workspace composite FK strategy | WATCH | SQL Schema Authoring Gate |
| Audit request/correlation and snapshot payload policy | WATCH | SQL Schema Authoring Gate / compliance review |
| Analytics stale/unavailable reason-field decision | WATCH | SQL Schema Authoring Gate |

### Risk review

| Risk | Result | Control |
|---|---|---|
| Premature DDL | **PASS** | Planning/review forbids SQL artifacts |
| Wrong enum physical representation | **PASS** | Physical representation deferred |
| Cross-workspace FK leakage | **WATCH** | Composite constraints must be authored/reviewed |
| Missing idempotency/concurrency tables | **WATCH** | Candidate tables/fields are planned for authoring |
| Credential leakage | **PASS** | Raw credential columns forbidden |
| Audit tampering | **WATCH** | Append-only concept must be enforced later |
| Over-normalization | **WATCH** | Authoring should avoid unnecessary table complexity |
| JSON overuse | **WATCH** | Lifecycle/status must not hide in JSON |
| Migration framework decision missing | **WATCH** | Deferred but must be resolved before SQL files |
| Backend starting before SQL authoring review | **PASS** | Backend remains unauthorized |
| Generated client before SQL/backend planning | **PASS** | Generated clients remain unauthorized |

---

## 19. PASS / FAIL / WATCH Checklist

| Criterion | Result |
|---|---|
| Scope compliance | **PASS** |
| Authoring sequence clarity | **PASS** |
| Table checklist completeness | **PASS** |
| Gemini corrections closed | **PASS** |
| Status enum strategy clarity | **PASS** |
| Workspace scoping | **PASS** |
| Auth/RBAC persistence | **PASS** |
| Credential boundary | **PASS** |
| Content approval/lifecycle | **PASS** |
| Idempotency/concurrency | **PASS** |
| Audit/analytics | **PASS** |
| Index/constraint planning | **PASS** |
| Delete/archive planning | **PASS** |
| SQL file strategy | **PASS** |
| Verification strategy | **PASS** |
| No implementation changes | **PASS** |
| Migration framework decision | **WATCH** |
| Credential target exclusivity final rule | **WATCH** |
| Email normalization/case-folding final rule | **WATCH** |
| Composite FK implementation detail | **WATCH** |

---

## 20. GO / NO-GO Decision

**Decision: GO to SQL Schema Authoring Gate.**

The SQL Schema Authoring Planning Gate is sufficient and constrained enough for
the next gate.

This authorizes only the next gate.

This does not itself authorize SQL DDL.

This does not authorize migrations.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize seed files.

This does not authorize generated clients.

This does not authorize package/UI changes.

This does not authorize production or pilot readiness.

---

## 21. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `M docs/nashir_sql_schema_authoring_planning_review_gate.md` before commit |
| `git diff --stat` | One docs file changed: 12 insertions, 12 deletions |
| `git diff -- docs/` | Review-gate Markdown formatting changes only |
| `wc -l docs/nashir_sql_schema_authoring_planning_review_gate.md` | 477 lines |
| BIDI scan: `docs/nashir_sql_schema_authoring_planning_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/nashir_sql_schema_authoring_planning_review_gate.md` | `BIDI_CONTROL_CHARS none` |
| Forbidden-path changed-file search | **CONFIRMED NONE** - no SQL, migrations, schema, backend, generated, UI, package, or runtime files changed |

Expected result:

- Documentation-only.
- No SQL DDL.
- No migrations.
- No ORM models.
- No backend implementation.
- No generated client.
- No package/UI changes.
- No production/pilot readiness claim or authorization.
