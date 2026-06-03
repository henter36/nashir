# Nashir SQL Migration Execution Planning Follow-up Review Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Execution Planning Follow-up Review Gate - documentation only |
| Status | Review complete |
| Date | 2026-06-03 |
| Primary reviewed artifact | `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` |
| Source of WATCH items | `docs/nashir_sql_migration_execution_planning_review_gate.md` |
| Enum authority | `docs/nashir_v1_openapi.yaml` |
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

This is the Nashir SQL Migration Execution Planning Follow-up Review Gate.

The purpose of this gate is to review the SQL Migration Execution Planning
Follow-up Gate and determine whether the seven WATCH items from the SQL
Migration Execution Planning Review Gate were resolved accurately, consistently,
and safely enough to proceed to the next planning or review step.

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

This review does not authorize SQL Migration Execution Gate.

---

## 2. Inputs Reviewed

### Primary artifact

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` | Primary reviewed artifact; follow-up gate with seven WATCH item decisions |

### Source of WATCH items and enum authority

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_execution_planning_review_gate.md` | Source of the seven WATCH items now under review |
| `docs/nashir_v1_openapi.yaml` | Enum and status authority for all four OpenAPI-approved status fields |

### Execution planning context

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_execution_planning_gate.md` | Execution planning gate; execution boundary and safeguards |
| `docs/nashir_sql_migration_draft_authoring_review_gate.md` | Draft authoring review; enum and FK verification baseline |
| `docs/nashir_sql_migration_draft_authoring_gate.md` | Draft authoring gate; scope and sequence |

### Draft contract artifacts

| Input | Role |
|---|---|
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | Draft — `credential_ref` vs `vault_ref` source |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | Draft — `CampaignStatus`, `ContentDraftStatus`, `CampaignContentItemStatus` source |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | Draft — `PublishingJobStatus`, `audit_events` source |

### Schema and Auth/RBAC authority

| Input | Role |
|---|---|
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |

### Authority check

| Authority | Result | Assessment |
|---|---|---|
| `docs/nashir_v1_openapi.yaml` is the enum and status authority | **PASS** | Follow-up gate uses OpenAPI as the authoritative source for all four enum comparisons |
| Any draft value contradicting OpenAPI is FAIL and blocks SQL Migration Execution Gate | **PASS** | Follow-up gate correctly applies this rule; all four enum fields are marked FAIL |
| marketing-os is reference-only | **PASS** | No marketing-os code, runner scripts, or runtime assumptions referenced |

---

## 3. Scope Compliance Review

| Scope item | Result | Assessment |
|---|---|---|
| Documentation-only | **PASS** | Follow-up gate creates one Markdown file only; this review creates one Markdown file |
| Review/follow-up only | **PASS** | No implementation, no executable artifact introduced |
| Nashir-first | **PASS** | Follow-up gate grounded in Nashir OpenAPI, SQL schema contract, and Auth/RBAC gates |
| marketing-os reference-only | **PASS** | No extraction, code copy, or runtime-shape import |
| No executable migrations | **PASS** | Follow-up gate confirms no executable files created |
| No migration runner | **PASS** | Follow-up gate confirms runner-free; runner introduction remains NO-GO |
| No database-applied changes | **PASS** | No database connection; no applied SQL |
| No backend/API runtime implementation | **PASS** | No source, route, handler, service, middleware, or runtime files changed |
| No ORM models | **PASS** | No model layer introduced |
| No seed files | **PASS** | Seed data remains unauthorized |
| No generated client | **PASS** | No generated/runtime client produced |
| No UI/package changes | **PASS** | No UI, `package.json`, lockfile, or build configuration files changed |
| No database connection config | **PASS** | Follow-up gate explicitly confirms no environment configuration created |
| No CI/CD migration execution | **PASS** | Follow-up gate explicitly confirms no CI/CD execution introduced |
| No production/pilot readiness claim | **PASS** | Follow-up gate makes no readiness claim |

---

## 4. Seven WATCH Item Review Matrix

| # | WATCH item | Decision in follow-up gate | Decision clarity | Final / candidate / deferred | Blocks Execution Gate | Required next control | Result |
|---|---|---|---|---|---|---|---|
| 1 | `campaigns.status` enum values | FAIL — 4 values missing; corrected 9-value set documented | **CLEAR** | Final — correction required | YES | SQL Migration Draft Authoring Correction Gate | **PASS** |
| 2 | `content_drafts.status` enum values | FAIL — `submitted`→`ready_for_review`; `withdrawn`→`archived`; corrected 5-value set documented | **CLEAR** | Final — correction required | YES | SQL Migration Draft Authoring Correction Gate | **PASS** |
| 3 | `campaign_content_items.status` enum values | FAIL — `in_review`→`ready_for_review`; `published` removed; corrected 5-value set documented | **CLEAR** | Final — correction required | YES | SQL Migration Draft Authoring Correction Gate | **PASS** |
| 4 | `publishing_jobs.status` enum values | FAIL — 4 missing values; 3 non-OpenAPI values; corrected 6-value set documented | **CLEAR** | Final — correction required | YES | SQL Migration Draft Authoring Correction Gate | **PASS** |
| 5 | `gen_random_uuid()` availability | DECIDED — PostgreSQL 13+ required; pgcrypto fallback for older versions; no SQL introduced | **CLEAR** | Final — candidate confirmed | NO | Future execution gate must verify PostgreSQL version or pgcrypto presence | **PASS** |
| 6 | `credential_ref` vs `vault_ref` | DECIDED — single `credential_ref` field; `vault_ref` removed; rationale documented | **CLEAR** | Final — correction required | YES | SQL Migration Draft Authoring Correction Gate for draft 002 | **PASS** |
| 7 | Application/migration role separation | DECIDED — plan documented; migration owner role owns `audit_events`; application role gets `INSERT`, `SELECT` only; triggers provide defense-in-depth | **CLEAR** | Final — no draft correction needed | NO | Future execution gate must verify role ownership, privilege grants, trigger presence | **PASS** |

All seven WATCH items are resolved with clear decisions.

No WATCH item is found to be undecided without a controlling blocker or named correction gate.

---

## 5. OpenAPI Enum/Status Review

### 5.1 CampaignStatus / campaigns.status

| Attribute | Value |
|---|---|
| OpenAPI schema name | `CampaignStatus` |
| OpenAPI values | `draft`, `generating`, `review`, `ready`, `scheduled`, `active`, `paused`, `completed`, `archived` |
| Current draft values | `draft`, `active`, `paused`, `completed`, `archived` |
| Missing from draft | `generating`, `review`, `ready`, `scheduled` |
| Values in draft not in OpenAPI | None |
| Follow-up gate decision | FAIL — correction required |
| Corrected CHECK values | `draft`, `generating`, `review`, `ready`, `scheduled`, `active`, `paused`, `completed`, `archived` |
| OpenAPI confirmation | Verified against `docs/nashir_v1_openapi.yaml` |
| Correction needed | YES — in SQL Migration Draft Authoring Correction Gate |

**Result: PASS** — follow-up gate correctly identifies and documents the mismatch.

---

### 5.2 ContentDraftStatus / content_drafts.status

| Attribute | Value |
|---|---|
| OpenAPI schema name | `ContentDraftStatus` |
| OpenAPI values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Current draft values | `draft`, `submitted`, `approved`, `rejected`, `withdrawn` |
| Missing from draft | `ready_for_review`, `archived` |
| Values in draft not in OpenAPI | `submitted`, `withdrawn` |
| Follow-up gate note | OpenAPI description: `rejected` covers reviewer rejection AND creator withdrawal; `withdrawn` is not a separate OpenAPI-approved value |
| Follow-up gate decision | FAIL — correction required |
| Corrected CHECK values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| OpenAPI confirmation | Verified against `docs/nashir_v1_openapi.yaml` |
| Correction needed | YES — in SQL Migration Draft Authoring Correction Gate |

**Result: PASS** — follow-up gate correctly identifies and documents the mismatch, including the note that withdrawal maps to `rejected` per the OpenAPI description.

---

### 5.3 CampaignContentItemStatus / campaign_content_items.status

| Attribute | Value |
|---|---|
| OpenAPI schema name | `CampaignContentItemStatus` |
| OpenAPI values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Current draft values | `draft`, `in_review`, `approved`, `rejected`, `published`, `archived` |
| Missing from draft | `ready_for_review` |
| Values in draft not in OpenAPI | `in_review`, `published` |
| Follow-up gate decision | FAIL — correction required |
| Corrected CHECK values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| OpenAPI confirmation | Verified against `docs/nashir_v1_openapi.yaml` |
| Correction needed | YES — in SQL Migration Draft Authoring Correction Gate |

**Result: PASS** — follow-up gate correctly identifies and documents the mismatch.

---

### 5.4 PublishingJobStatus / publishing_jobs.status

| Attribute | Value |
|---|---|
| OpenAPI schema name | `PublishingJobStatus` |
| OpenAPI values | `draft`, `scheduled`, `queued`, `simulated`, `failed`, `cancelled` |
| Current draft values | `pending`, `in_progress`, `published`, `failed`, `cancelled` |
| Missing from draft | `draft`, `scheduled`, `queued`, `simulated` |
| Values in draft not in OpenAPI | `pending`, `in_progress`, `published` |
| Follow-up gate note | OpenAPI description: `simulated` must remain explicitly distinct from any future real publishing status; no real external publishing occurs in V1 |
| Follow-up gate decision | FAIL — correction required |
| Corrected CHECK values | `draft`, `scheduled`, `queued`, `simulated`, `failed`, `cancelled` |
| OpenAPI confirmation | Verified against `docs/nashir_v1_openapi.yaml` |
| Correction needed | YES — in SQL Migration Draft Authoring Correction Gate |

**Result: PASS** — follow-up gate correctly identifies the most severe mismatch (4 missing, 3 extra) and documents the corrected value set including the `simulated` V1-only constraint.

---

## 6. PostgreSQL UUID Function Review

| Check | Result | Assessment |
|---|---|---|
| `gen_random_uuid()` remains acceptable | **PASS** | PostgreSQL 13+ natively provides `gen_random_uuid()`; major managed providers all support PostgreSQL 13+ |
| `pgcrypto` fallback for PostgreSQL 12 and earlier documented | **PASS** | Fallback is clear: `CREATE EXTENSION IF NOT EXISTS pgcrypto;` must be applied before group 1 |
| Target environment verification required before execution | **PASS** | Future SQL Migration Execution Gate must verify PostgreSQL version is 13+ or `pgcrypto` is installed |
| Application-side UUID generation remains an alternative | **PASS** | Documented as a valid deferred alternative; not blocking |
| `uuid_generate_v4()` alternative assessed | **PASS** | Not preferred; `gen_random_uuid()` is native in PostgreSQL 13+ |
| No extension SQL or DB config added | **PASS** | Follow-up gate explicitly confirms no SQL or extension creation introduced |

No PostgreSQL UUID function blocker was found.

---

## 7. credential_ref vs vault_ref Review

| Check | Result | Assessment |
|---|---|---|
| Field model resolved | **PASS** | Single `credential_ref` field; `vault_ref` removed |
| Single field name selected | **PASS** | `credential_ref` is the approved field name |
| Rationale documented | **PASS** | Four rationale points listed: simpler, compatible with no-plaintext rule, `credential_type` encodes provider, eliminates ambiguity |
| No-plaintext-secrets rule preserved | **PASS** | `credential_ref` is an opaque reference; no plaintext secrets |
| Impact on `integration_credentials` | **PASS** | `vault_ref TEXT` must be removed from draft 002; `credential_ref TEXT` remains |
| Draft 002 correction gate required | **PASS** | SQL Migration Draft Authoring Correction Gate must remove `vault_ref` and update constraints checklist |
| No provider implementation introduced | **PASS** | Vault/encryption provider implementation remains deferred |
| Remaining ambiguity | **PASS** | Ambiguity resolved; `credential_ref` is the single opaque reference field |
| Blocks SQL Migration Execution Gate | **PASS** | YES — draft correction required before executable migration authoring |

No credential field model blocker was found.

---

## 8. audit_events Role Separation Review

| Check | Result | Assessment |
|---|---|---|
| Migration/deployment owner role plan documented | **PASS** | Role owns `audit_events`; runs migrations; creates tables; has all owner privileges |
| Application non-owner role plan documented | **PASS** | Application role is not the owner; receives `INSERT` and `SELECT` only |
| UPDATE/DELETE privilege restriction plan | **PASS** | `UPDATE` and `DELETE` are never granted to the application role; `REVOKE` is a safeguard for defense-in-depth |
| PostgreSQL owner privilege caveat | **PASS** | `REVOKE` has no effect if application role owned `audit_events`; caveat is correctly scoped to the migration role (which is expected to own the table) |
| Trigger-based enforcement plan | **PASS** | Triggers enforce append-only independently of privilege grants; triggers are the primary enforcement; privilege restriction is secondary |
| Defense-in-depth documented | **PASS** | Both mechanisms together prevent accidental UPDATE/DELETE from application code and direct psql mutations |
| Future execution gate must verify | **PASS** | Six verification requirements listed for group 4 pre-execution check |
| No role SQL or database config added | **PASS** | Follow-up gate explicitly confirms no SQL or config introduced |
| Blocks SQL Migration Execution Gate | **PASS** | NO — controlled; future gate must verify role ownership, privilege grants, and trigger presence |

No audit role separation blocker was found.

---

## 9. Impact on Next Gate

### What this review confirms

This review confirms that all seven WATCH items from the SQL Migration
Execution Planning Review Gate are resolved with clear decisions and safe
explicit blockers or verification requirements.

Items 1–4 (enum mismatches) and item 6 (`vault_ref` removal) are correctly
identified as FAIL and require a SQL Migration Draft Authoring Correction Gate
before SQL Migration Execution Gate may be opened.

Items 5 (`gen_random_uuid()`) and 7 (role separation plan) are resolved; no
draft file correction is needed for these two items.

### Gate sequence confirmed

| Gate | Status |
|---|---|
| SQL Migration Execution Planning Follow-up Gate | COMPLETE (PR #98) |
| SQL Migration Execution Planning Follow-up Review Gate | COMPLETE (this gate) |
| SQL Migration Draft Authoring Correction Gate | REQUIRED — fixes enum values in drafts 003 and 004; removes `vault_ref` from draft 002 |
| SQL Migration Draft Authoring Correction Review Gate | REQUIRED — reviews corrections |
| SQL Migration Execution Gate | BLOCKED — requires all above plus backend repository, runner, path, and verification tooling |

### What this review does not authorize

This review does not authorize SQL Migration Execution Gate.

This review does not authorize executing migrations.

This review does not authorize adding a migration runner.

This review does not authorize database-applied changes.

This review does not authorize backend implementation.

This review does not authorize ORM models.

This review does not authorize generated clients.

This review does not authorize production or pilot readiness.

---

## 10. Risks and Gaps

### Blocking issues

| Issue | Result |
|---|---|
| Blocking follow-up decision issue | **NONE FOUND** |
| Blocking scope violation | **NONE FOUND** |
| Blocking enum mismatch reaching execution | **CONTROLLED** — four enum FAIL items require correction gate before execution |

### Non-blocking watch items

| Risk / gap | Severity | Control |
|---|---|---|
| Enum drift from OpenAPI | CRITICAL | All four enum mismatches documented with exact corrected values; SQL Migration Draft Authoring Correction Gate required |
| Enum mismatch reaching execution | CRITICAL | SQL Migration Execution Gate is blocked until draft correction gate and its review gate are merged |
| PostgreSQL extension availability risk | HIGH | `gen_random_uuid()` requires PostgreSQL 13+ or `pgcrypto`; future execution gate must verify environment |
| Credential reference ambiguity | HIGH | `vault_ref` removal decided; draft 002 correction gate required |
| Audit tampering if app role owns `audit_events` | HIGH | Role separation plan documented; application role must not own `audit_events`; triggers provide defense-in-depth |
| Premature execution | CRITICAL | No migration execution authorized; SQL Migration Execution Gate blocked until gate sequence completes |
| Runner introduced too early | CRITICAL | Runner-free; runner selection deferred to backend repository |
| Database-applied changes outside gate | CRITICAL | No database connection; no execution tooling |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |

---

## 11. PASS / FAIL / WATCH Checklist

| Check | Result |
|---|---|
| Scope compliance | **PASS** |
| WATCH item completeness (7 of 7) | **PASS** |
| `campaigns.status` OpenAPI enum verification | **PASS** |
| `content_drafts.status` OpenAPI enum verification | **PASS** |
| `campaign_content_items.status` OpenAPI enum verification | **PASS** |
| `publishing_jobs.status` OpenAPI enum verification | **PASS** |
| `gen_random_uuid()` decision | **PASS** |
| `credential_ref` / `vault_ref` decision | **PASS** |
| `audit_events` role separation plan | **PASS** |
| No implementation changes | **PASS** |
| No execution enablement | **PASS** |
| Draft correction gate required (enum + vault_ref) | **CONFIRMED** |
| SQL Migration Execution Gate remains blocked | **CONFIRMED** |

---

## 12. GO / NO-GO Decision

**Decision: GO to SQL Migration Draft Authoring Correction Gate.**

The SQL Migration Execution Planning Follow-up Gate has resolved all seven
WATCH items accurately, consistently, and safely.

All seven decisions are clear and internally consistent.

No blocking issue was found in the follow-up gate.

The corrected enum value sets are documented and ready to be applied to the
draft migration contract files in a SQL Migration Draft Authoring Correction
Gate.

The `vault_ref` removal decision is documented and ready to be applied to
draft 002.

This authorizes only the SQL Migration Draft Authoring Correction Gate as
the next step.

This does not authorize SQL Migration Execution Gate.

This does not authorize executing migrations.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

SQL Migration Execution Gate remains blocked until:

1. SQL Migration Draft Authoring Correction Gate corrects enum values in
   drafts 003 and 004 and removes `vault_ref` from draft 002.
2. SQL Migration Draft Authoring Correction Review Gate reviews and approves
   those corrections.
3. A backend repository is established with runner, path, and verification tooling.
4. Pre-execution validation passes all checks defined in the Execution
   Planning Gate.

---

## 13. Final Summary

| Item | Summary |
|---|---|
| Inputs | SQL Migration Execution Planning Follow-up Gate, SQL Migration Execution Planning Review Gate, SQL Migration Execution Planning Gate, SQL Migration Draft Authoring Review Gate, five draft migration contract files, OpenAPI YAML, Auth/RBAC gates, SQL Schema Authoring Gate and Review Gate, README, and screen map |
| Outputs | One documentation-only SQL Migration Execution Planning Follow-up Review Gate |
| Remaining gaps | Four enum fields require draft correction (campaigns, content_drafts, campaign_content_items, publishing_jobs); `vault_ref` must be removed from draft 002; backend repository not yet established; runner not selected; PostgreSQL environment version must be confirmed before execution |
| Decision required before next phase | SQL Migration Draft Authoring Correction Gate must apply the five corrections (four enum CHECK updates and one vault_ref removal) before SQL Migration Execution Gate can be authorized |
| Recommended next gate | SQL Migration Draft Authoring Correction Gate |

---

## 14. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_execution_planning_follow_up_review_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new review document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new review document shown by `git status --short` |
| BIDI scan: `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/nashir_sql_migration_execution_planning_follow_up_review_gate.md` | `BIDI_CONTROL_CHARS none` |
| Executable migrations/migration runner/SQL execution scan | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
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
