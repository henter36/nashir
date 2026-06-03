# Nashir SQL Migration Draft Correction Review Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Draft Correction Review Gate - documentation only |
| Status | Review complete |
| Date | 2026-06-03 |
| Primary reviewed artifact | `docs/nashir_sql_migration_draft_correction_gate.md` |
| Post-merge wording fix | PR #101 — withdrawn mapping wording aligned |
| Enum authority | `docs/nashir_v1_openapi.yaml` |
| Corrected draft artifacts | `nashir_v1_002`, `nashir_v1_003`, `nashir_v1_004` |
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
| CI/CD migration execution added | NO |
| marketing-os extraction | NO |
| Database readiness claimed | NO |
| Production/pilot readiness claimed | NO |

---

## 1. Purpose

This is the Nashir SQL Migration Draft Correction Review Gate.

The purpose of this gate is to review the SQL Migration Draft Correction Gate
(PR #100) and the post-merge wording fix (PR #101) and determine whether the
five draft corrections are accurate, complete, and safe for the next planning
or review step.

This review does not introduce executable migrations.

This review does not introduce a migration runner.

This review does not execute or apply SQL to a database.

This review does not introduce backend code.

This review does not introduce API route implementation.

This review does not introduce ORM models.

This review does not introduce seed files.

This review does not introduce generated clients.

This review does not introduce UI, package, or build changes.

This review does not introduce database connection configuration.

This review does not introduce CI/CD migration execution steps.

This review does not claim production or pilot readiness.

This review does not claim database readiness.

---

## 2. Inputs Reviewed

### Primary artifact

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_draft_correction_gate.md` | Primary reviewed artifact; SQL Migration Draft Correction Gate |

### Enum and schema authority

| Input | Role |
|---|---|
| `docs/nashir_v1_openapi.yaml` | Enum and status authority for all four OpenAPI-approved status fields |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |

### Corrected draft contract artifacts

| Input | Role |
|---|---|
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | Corrected — `vault_ref` removed; `credential_ref TEXT NOT NULL` |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | Corrected — three enum CHECK constraints updated |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | Corrected — one enum CHECK constraint updated |

### Unchanged draft contract artifacts

| Input | Role |
|---|---|
| `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` | Not corrected — no changes needed; reviewed for boundary preservation |
| `docs/migration_contracts/nashir_v1_005_support_reference.sql.md` | Not corrected — no changes needed; reviewed for boundary preservation |

### Controlling prior gates

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_execution_planning_follow_up_review_gate.md` | Issued GO to SQL Migration Draft Correction Gate |
| `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` | Source of five correction requirements |
| `docs/nashir_sql_migration_execution_planning_review_gate.md` | Source of the seven WATCH items |
| `docs/nashir_sql_migration_draft_authoring_review_gate.md` | Draft authoring review; FK and constraint baseline |
| `docs/nashir_sql_migration_draft_authoring_gate.md` | Draft authoring gate; scope and sequence |
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |

### Authority check

| Authority | Result | Assessment |
|---|---|---|
| `docs/nashir_v1_openapi.yaml` is the enum and status authority | **PASS** | Correction gate uses OpenAPI as the authoritative source for all four enum comparisons |
| All four draft enum corrections match OpenAPI exactly | **PASS** | Verified by comparing sorted enum value lists |
| marketing-os is reference-only | **PASS** | No marketing-os code, runner scripts, or runtime assumptions referenced |

---

## 3. Scope Compliance Review

| Scope item | Result | Assessment |
|---|---|---|
| Documentation-only | **PASS** | Correction gate modifies three `.sql.md` Markdown files and creates one gate document |
| Review-only | **PASS** | This review creates one Markdown file only |
| Nashir-first | **PASS** | Correction gate grounded in Nashir OpenAPI, SQL schema contract, and Auth/RBAC gates |
| marketing-os reference-only | **PASS** | No extraction, code copy, or runtime-shape import |
| No executable migrations | **PASS** | No `.sql` executable files created; all corrections are in `.sql.md` draft files |
| No migration runner | **PASS** | Runner-free; no runner config or package change introduced |
| No database-applied changes | **PASS** | No database connection; no applied SQL |
| No backend/API runtime implementation | **PASS** | No source, route, handler, service, middleware, or runtime files changed |
| No ORM models | **PASS** | No model layer introduced |
| No seed files | **PASS** | Seed data remains unauthorized |
| No generated client | **PASS** | No generated/runtime client produced |
| No UI/package changes | **PASS** | No UI, `package.json`, lockfile, or build configuration files changed |
| No database connection config | **PASS** | No connection string, no pg config, no environment secrets |
| No CI/CD migration execution | **PASS** | No CI/CD pipeline changes |
| No production/pilot readiness claim | **PASS** | Correction gate makes no readiness claim |

---

## 4. Draft Correction Review Matrix

| # | Correction item | Source authority | Previous draft issue | Correction made | Values match OpenAPI | Residual risk | Blocks Execution Gate | Result |
|---|---|---|---|---|---|---|---|---|
| 1 | `campaigns.status` | OpenAPI `CampaignStatus` | 5 values — missing `generating`, `review`, `ready`, `scheduled` | CHECK updated to all 9 OpenAPI values | **PASS** | Low — exact match confirmed | NO | **PASS** |
| 2 | `content_drafts.status` | OpenAPI `ContentDraftStatus` | `submitted` and `withdrawn` not in OpenAPI; `ready_for_review` and `archived` missing | `submitted`→`ready_for_review`; `withdrawn` removed (creator withdrawal maps to `rejected`); `archived` added as separate archive/resource state | **PASS** | Low — exact match confirmed; withdrawal semantics correct | NO | **PASS** |
| 3 | `campaign_content_items.status` | OpenAPI `CampaignContentItemStatus` | `in_review` not in OpenAPI; `published` not in OpenAPI | `in_review`→`ready_for_review`; `published` removed | **PASS** | Low — exact match confirmed | NO | **PASS** |
| 4 | `publishing_jobs.status` | OpenAPI `PublishingJobStatus` | `pending`, `in_progress`, `published` not in OpenAPI; `draft`, `scheduled`, `queued`, `simulated` missing | CHECK updated to all 6 OpenAPI values; `simulated` V1-only constraint documented in comment | **PASS** | Low — exact match confirmed; `simulated` constraint preserved | NO | **PASS** |
| 5 | `credential_ref` / `vault_ref` | Follow-up gate decision | Two nullable fields with same purpose; ambiguity about which to use | `vault_ref TEXT` removed; `credential_ref TEXT NOT NULL` retained; removal comment added | **PASS** | Low — single field; NOT NULL enforces every credential row has a reference | NO | **PASS** |
| 6 | Withdrawn mapping wording (PR #101) | OpenAPI `ContentDraftStatus` | Two table rows incorrectly said `withdrawn`→`archived` | Both rows corrected to `withdrawn` removed; creator withdrawal maps to `rejected`; `archived` is separate archive/resource state | **PASS** | None — wording is now consistent with OpenAPI semantics | NO | **PASS** |

All six correction items pass. No Execution Gate blocker found.

---

## 5. OpenAPI Enum/Status Review

### 5.1 CampaignStatus / campaigns.status

| Attribute | Detail |
|---|---|
| OpenAPI schema name | `CampaignStatus` |
| OpenAPI-approved values | `draft`, `generating`, `review`, `ready`, `scheduled`, `active`, `paused`, `completed`, `archived` |
| Corrected draft values | `draft`, `generating`, `review`, `ready`, `scheduled`, `active`, `paused`, `completed`, `archived` |
| Match | **EXACT** |
| Any correction remaining | None |

**Result: PASS**

---

### 5.2 ContentDraftStatus / content_drafts.status

| Attribute | Detail |
|---|---|
| OpenAPI schema name | `ContentDraftStatus` |
| OpenAPI-approved values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Corrected draft values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Match | **EXACT** |
| Withdrawal note | OpenAPI description confirms `rejected` covers both reviewer rejection and creator withdrawal; `withdrawn` is not a separate approved value |
| Any correction remaining | None |

**Result: PASS**

---

### 5.3 CampaignContentItemStatus / campaign_content_items.status

| Attribute | Detail |
|---|---|
| OpenAPI schema name | `CampaignContentItemStatus` |
| OpenAPI-approved values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Corrected draft values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Match | **EXACT** |
| Any correction remaining | None |

**Result: PASS**

---

### 5.4 PublishingJobStatus / publishing_jobs.status

| Attribute | Detail |
|---|---|
| OpenAPI schema name | `PublishingJobStatus` |
| OpenAPI-approved values | `draft`, `scheduled`, `queued`, `simulated`, `failed`, `cancelled` |
| Corrected draft values | `draft`, `scheduled`, `queued`, `simulated`, `failed`, `cancelled` |
| Match | **EXACT** |
| `simulated` note | V1-only; must remain distinct from any future real publishing status; documented in comment |
| Any correction remaining | None |

**Result: PASS**

---

## 6. ContentDraftStatus Withdrawal Mapping Review

| Check | Result | Assessment |
|---|---|---|
| `withdrawn` not treated as an OpenAPI-approved value | **PASS** | `withdrawn` is absent from the corrected `content_drafts` CHECK constraint |
| Creator withdrawal maps to `rejected` per OpenAPI | **PASS** | Draft 003 comment states: "Creator withdrawal is represented by `rejected` per OpenAPI description (which states: 'rejected = rejected by reviewer or withdrawn by creator')" |
| `archived` is a separate archive/resource state | **PASS** | Draft 003 comment and correction gate document both state `archived` is a separate soft-delete/archive state, not a replacement for `withdrawn` |
| No remaining wording saying `withdrawn → archived` | **PASS** | Both table rows in the correction gate that previously said `withdrawn`→`archived` were corrected by PR #101 |
| No OpenAPI change was made | **PASS** | `docs/nashir_v1_openapi.yaml` was not modified by the correction gate or the wording fix |
| Correction gate wording consistent with OpenAPI semantics | **PASS** | Section 4.2 correction action now reads: "removed `withdrawn` because creator withdrawal maps to `rejected` per OpenAPI semantics; added `archived` as a separate archive/resource state" |
| Draft contract comment consistent | **PASS** | draft 003 content_drafts comment: "Creator withdrawal is represented by `rejected` per OpenAPI description" |

No withdrawal mapping wording blocker was found.

---

## 7. credential_ref / vault_ref Review

| Check | Result | Assessment |
|---|---|---|
| `vault_ref` removed from DDL | **PASS** | `vault_ref TEXT` column is absent from `integration_credentials` draft definition in draft 002 |
| `credential_ref` is the single canonical opaque credential reference field | **PASS** | `credential_ref TEXT NOT NULL` is the only credential reference column |
| `credential_ref` is `NOT NULL` | **PASS** | Confirmed: every credential row must have exactly one opaque reference |
| No plaintext secrets introduced | **PASS** | `credential_ref` is described as "provider-specific path/ARN/key; no plaintext secret" |
| Credential target exclusivity/scope model intact | **PASS** | XOR CHECK constraint unchanged |
| Same-workspace composite FK controls intact | **PASS** | `fk_credentials_channel_connection` and `fk_credentials_data_source` composite FKs unchanged |
| Removal documented | **PASS** | Comment in draft 002 explains: `vault_ref` removed; `credential_type` identifies the provider |

No credential field model blocker was found.

---

## 8. Draft Contract Boundary Review

| Check | Result | Assessment |
|---|---|---|
| Files remain `.sql.md` documentation artifacts | **PASS** | All five draft files use `.sql.md` extension |
| No executable `.sql` migration files created | **PASS** | No `.sql` files exist in `docs/migration_contracts/` |
| No runner metadata introduced | **PASS** | No runner config; runner-free boundary maintained |
| No package scripts added | **PASS** | `package.json` unchanged |
| No DB config added | **PASS** | No connection string or database config |
| Same-workspace composite FK controls preserved | **PASS** | All composite FK constraints in corrected files are unchanged |
| Parent `UNIQUE (workspace_id, id)` constraints preserved | **PASS** | All eight parent composite unique constraints are unchanged |
| Product SKU partial unique index preserved | **PASS** | `idx_products_workspace_sku_active_unique` unchanged in draft 002 |
| Audit append-only notes preserved | **PASS** | `audit_events` append-only structure and trigger comment unchanged in draft 004 |
| `users.email` lookup notes preserved | **PASS** | `LOWER(email)` functional index and backend lookup note unchanged in draft 001 |

No draft contract boundary blocker was found.

---

## 9. Verification Review

### Lint and build

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |

### Git state

| Command | Result |
|---|---|
| `git status --short` | Clean before this review gate is staged |
| `git diff --stat` | No tracked unstaged diff |
| `git diff -- docs/` | No tracked unstaged docs diff |

### Enum verification

| Check | Result |
|---|---|
| `campaigns.status` matches `CampaignStatus` in OpenAPI | **PASS** — exact match (9 values) |
| `content_drafts.status` matches `ContentDraftStatus` in OpenAPI | **PASS** — exact match (5 values) |
| `campaign_content_items.status` matches `CampaignContentItemStatus` in OpenAPI | **PASS** — exact match (5 values) |
| `publishing_jobs.status` matches `PublishingJobStatus` in OpenAPI | **PASS** — exact match (6 values) |

### Withdrawal mapping verification

| Check | Result |
|---|---|
| No `withdrawn → archived` mapping in correction gate doc | **CONFIRMED** — no misleading wording remains |
| `withdrawn → rejected` (creator withdrawal semantics) documented | **CONFIRMED** — in correction gate and draft 003 comment |
| `archived` described as separate archive/resource state | **CONFIRMED** — in correction gate doc and draft 003 comment |

### Credential field verification

| Check | Result |
|---|---|
| `vault_ref` absent from `integration_credentials` DDL in draft 002 | **CONFIRMED** |
| `credential_ref TEXT NOT NULL` present in draft 002 | **CONFIRMED** |

### Forbidden file scans

| Scan | Result |
|---|---|
| Executable `.sql` files in `docs/migration_contracts/` | **NONE** |
| Migration runner files | **NONE** |
| Package.json or lockfile changes | **NONE** |
| Database connection config | **NONE** |
| CI/CD migration execution | **NONE** |
| Backend/API runtime/ORM/generated/UI file changes | **NONE** |
| Database-applied changes | **NONE** |

### BIDI scan

| File | Result |
|---|---|
| `docs/nashir_sql_migration_draft_correction_gate.md` | `BIDI_CONTROL_CHARS none` |
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | `BIDI_CONTROL_CHARS none` |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | `BIDI_CONTROL_CHARS none` |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | `BIDI_CONTROL_CHARS none` |
| `docs/nashir_sql_migration_draft_correction_review_gate.md` | `BIDI_CONTROL_CHARS none` |

BIDI scan method: Python `pathlib` + Unicode code-point lookup.

---

## 10. PASS / FAIL / WATCH Checklist

| Check | Result |
|---|---|
| Scope compliance | **PASS** |
| Enum/status correction completeness (4 of 4) | **PASS** |
| ContentDraftStatus withdrawal mapping | **PASS** |
| credential_ref/vault_ref correction | **PASS** |
| credential_ref NOT NULL | **PASS** |
| Non-executable boundary | **PASS** |
| Same-workspace FK preservation | **PASS** |
| Credential safeguards | **PASS** |
| Audit safeguards | **PASS** |
| `users.email` safeguards | **PASS** |
| Verification completeness | **PASS** |
| No implementation changes | **PASS** |
| No execution enablement | **PASS** |

No FAIL or WATCH items.

---

## 11. Risks and Gaps

### Blocking issues

| Issue | Result |
|---|---|
| Blocking enum correction issue | **NONE FOUND** |
| Blocking credential correction issue | **NONE FOUND** |
| Blocking scope violation | **NONE FOUND** |
| Blocking withdrawal mapping issue | **NONE FOUND** |

### Non-blocking watch items

| Risk / gap | Severity | Control |
|---|---|---|
| Enum drift from OpenAPI in future authoring | HIGH | All four enum fields now match OpenAPI exactly; future migration authoring must re-verify against OpenAPI at time of executable migration authoring |
| Draft/OpenAPI mismatch in executable migration | HIGH | SQL Migration Execution Gate must re-verify enum values against OpenAPI before any executable migration is applied |
| Wrong withdrawal mapping in future documentation | MEDIUM | Withdrawal mapping is documented as `rejected` in correction gate and draft 003; executable migration authoring must preserve this |
| Credential reference ambiguity in future | LOW | Single `credential_ref NOT NULL` field; `credential_type` identifies provider; no ambiguity remains |
| Cross-workspace leakage if FK controls weakened | CRITICAL | Future executable migration authoring and the SQL Migration Execution Gate must verify that all composite FK controls and parent UNIQUE (workspace_id, id) constraints remain intact. |
| Premature execution | CRITICAL | SQL Migration Execution Gate requires backend repository, runner, path, and verification tooling; not authorized by this review |
| Runner introduced too early | CRITICAL | Runner-free; no runner introduced |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |

---

## 12. GO / NO-GO Decision

**Decision: GO with minor documentation follow-up.**

The SQL Migration Draft Correction Gate has applied all five required draft
corrections accurately and safely.

All four OpenAPI enum CHECK constraints now match OpenAPI exactly.

`vault_ref` is removed; `credential_ref TEXT NOT NULL` is confirmed.

Withdrawal mapping wording is consistent across correction gate and draft 003.

No blocking issue was found.

The project may proceed to SQL Migration Execution Gate planning once the
backend repository, runner selection, executable migration path, and
parse/dry-run verification tooling prerequisites defined in the Execution
Planning Gate are satisfied.

**Minor documentation follow-up before SQL Migration Execution Gate:**

1. Confirm `ContentApprovalDecision` enum values against current OpenAPI
   (open item in draft 003, not yet resolved).
2. Confirm `gen_random_uuid()` availability on the target PostgreSQL environment
   before the first executable migration run.
3. Write the application and migration role separation plan with named roles
   before group 4 (`publishing_jobs`, `audit_events`) executable migration.

These three items are non-blocking for this review gate and do not block
SQL Migration Execution Gate by themselves — they are pre-execution validation
requirements per the Execution Planning Gate's pre-execution checklist.

This authorizes only the next planning/review step.

This does not authorize migration execution.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

---

## 13. Final Summary

| Item | Summary |
|---|---|
| Inputs | SQL Migration Draft Correction Gate, post-merge wording fix (PR #101), five draft migration contract files, SQL Migration Execution Planning Follow-up Review Gate, OpenAPI YAML, SQL Schema Authoring Gate and Review Gate, Auth/RBAC gates, Draft Authoring Review Gate, README, and screen map |
| Outputs | One documentation-only SQL Migration Draft Correction Review Gate |
| Remaining gaps | `ContentApprovalDecision` enum confirmation pending; `gen_random_uuid()` environment verification required before execution; application/migration role names required for group 4 execution; backend repository not yet established; runner not selected |
| Decision required before next phase | SQL Migration Execution Gate requires: backend repository established, runner selected, executable migration file paths approved, parse/dry-run verification tooling confirmed, pre-execution validation checklist passed including enum re-verification at time of executable migration authoring |
| Recommended next gate | SQL Migration Execution Gate (in the future backend repository, after prerequisites are satisfied) or SQL Migration Execution Planning Gate (if backend repository planning gate has not yet been opened) |

---

## 14. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_draft_correction_review_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new review document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new review document shown by `git status --short` |
| BIDI scan: `docs/nashir_sql_migration_draft_correction_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/nashir_sql_migration_draft_correction_review_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: corrected draft files (002, 003, 004) | `BIDI_CONTROL_CHARS none` |
| `withdrawn → archived` mapping scan in correction gate doc | **NONE FOUND** |
| `withdrawn → rejected` semantics documented | **CONFIRMED** |
| `vault_ref` absent from DDL in draft 002 | **CONFIRMED** |
| `credential_ref TEXT NOT NULL` in draft 002 | **CONFIRMED** |
| Executable migration/runner/SQL execution scan | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Backend/API runtime/ORM/generated/UI/package files scan | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Package.json or package-lock changes | **NONE** |
| Database connection config scan | **NONE** |
| CI/CD migration execution scan | **NONE** |
| Database-applied changes scan | No database commands executed; no migration files applied |

BIDI scan method: Python `pathlib` + Unicode code-point lookup;
no BIDI control characters embedded in shell patterns.

Expected result:

- Documentation-only review.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No ORM models.
- No generated client.
- No package/UI changes.
- No database-applied changes.
- No production/pilot readiness claim.
