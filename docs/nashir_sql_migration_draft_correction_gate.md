# Nashir SQL Migration Draft Correction Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Draft Correction Gate - documentation only |
| Status | Correction complete |
| Date | 2026-06-03 |
| Controlling review input | `docs/nashir_sql_migration_execution_planning_follow_up_review_gate.md` |
| Enum authority | `docs/nashir_v1_openapi.yaml` |
| Draft files corrected | `nashir_v1_002`, `nashir_v1_003`, `nashir_v1_004` |
| Corrections applied | 5 (4 enum CHECK updates + 1 vault_ref removal) |
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

This is the Nashir SQL Migration Draft Correction Gate.

This gate corrects draft migration contract documentation according to the
findings from the SQL Migration Execution Planning Follow-up Gate (PR #98)
and Follow-up Review Gate (PR #99).

Five corrections are applied to draft migration contract files:

1. `campaigns.status` CHECK constraint aligned to OpenAPI `CampaignStatus`.
2. `campaign_content_items.status` CHECK constraint aligned to OpenAPI `CampaignContentItemStatus`.
3. `content_drafts.status` CHECK constraint aligned to OpenAPI `ContentDraftStatus`.
4. `publishing_jobs.status` CHECK constraint aligned to OpenAPI `PublishingJobStatus`.
5. `vault_ref TEXT` column removed from `integration_credentials` draft; single `credential_ref` field confirmed.

This gate does not execute any migration.

This gate does not introduce a migration runner.

This gate does not apply SQL to any database.

This gate does not introduce backend code.

This gate does not introduce API route implementation.

This gate does not introduce ORM models.

This gate does not introduce seed files.

This gate does not introduce generated clients.

This gate does not introduce UI, package, or build changes.

This gate does not introduce database connection configuration.

This gate does not introduce CI/CD migration execution steps.

This gate does not claim production or pilot readiness.

This gate does not claim database readiness.

This gate does not authorize SQL Migration Execution Gate.

---

## 2. Inputs Reviewed

### Controlling review input

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_execution_planning_follow_up_review_gate.md` | Controlling review input; GO to SQL Migration Draft Authoring Correction Gate decision |

### Enum and schema authority

| Input | Role |
|---|---|
| `docs/nashir_v1_openapi.yaml` | Enum and status authority for all four OpenAPI-approved status fields |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |

### Draft contract artifacts corrected

| Input | Role |
|---|---|
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | Corrected — `vault_ref` removed |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | Corrected — three enum CHECK constraints updated |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | Corrected — one enum CHECK constraint updated |

### Contextual inputs

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` | Source of follow-up decisions and corrected enum values |
| `docs/nashir_sql_migration_execution_planning_review_gate.md` | Source of the seven WATCH items |
| `docs/nashir_sql_migration_execution_planning_gate.md` | Execution planning gate; execution boundary and safeguards |
| `docs/nashir_sql_migration_draft_authoring_review_gate.md` | Draft authoring review; FK and constraint baseline |
| `docs/nashir_sql_migration_draft_authoring_gate.md` | Draft authoring gate; scope and sequence |
| `docs/migration_contracts/nashir_v1_001_foundation_identity_tenant.sql.md` | Not corrected — no changes needed |
| `docs/migration_contracts/nashir_v1_005_support_reference.sql.md` | Not corrected — no changes needed |
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |

### Authority boundaries

| Boundary | Result |
|---|---|
| `docs/nashir_v1_openapi.yaml` is the enum and status authority | **CONFIRMED** |
| Any draft value that contradicts OpenAPI is corrected in this gate | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |

---

## 3. Correction Scope

This gate applies exactly five corrections to three draft migration contract
files. No other files are modified.

| Correction | Draft file | Change |
|---|---|---|
| `campaigns.status` enum alignment | `nashir_v1_003` | CHECK constraint updated from 5 values to 9 OpenAPI-approved values |
| `campaign_content_items.status` enum alignment | `nashir_v1_003` | CHECK constraint updated; `in_review`→`ready_for_review`; `published` removed |
| `content_drafts.status` enum alignment | `nashir_v1_003` | CHECK constraint updated; `submitted`→`ready_for_review`; `withdrawn`→`archived`; per OpenAPI `rejected` covers creator withdrawal |
| `publishing_jobs.status` enum alignment | `nashir_v1_004` | CHECK constraint updated from 5 non-OpenAPI values to 6 OpenAPI-approved values |
| `vault_ref` removal | `nashir_v1_002` | `vault_ref TEXT` column removed; single `credential_ref TEXT` confirmed |

No new schema entities are introduced.

No existing controls are weakened.

---

## 4. OpenAPI Enum/Status Correction Matrix

### 4.1 CampaignStatus / campaigns.status

| Attribute | Detail |
|---|---|
| OpenAPI schema name | `CampaignStatus` |
| OpenAPI-approved values | `draft`, `generating`, `review`, `ready`, `scheduled`, `active`, `paused`, `completed`, `archived` |
| Previous draft values | `draft`, `active`, `paused`, `completed`, `archived` |
| Corrected draft values | `draft`, `generating`, `review`, `ready`, `scheduled`, `active`, `paused`, `completed`, `archived` |
| Correction action | Added four missing values: `generating`, `review`, `ready`, `scheduled` |
| Rationale | `generating` = AI content in progress; `review` = under human review; `ready` = approved for scheduling; `scheduled` = queued for future activation. All are V1 lifecycle stages defined in OpenAPI. |
| Residual risk | Low — all nine values are now present; CHECK constraint is exact; no unauthorized values added |

### 4.2 ContentDraftStatus / content_drafts.status

| Attribute | Detail |
|---|---|
| OpenAPI schema name | `ContentDraftStatus` |
| OpenAPI-approved values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Previous draft values | `draft`, `submitted`, `approved`, `rejected`, `withdrawn` |
| Corrected draft values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Correction action | Replaced `submitted` with `ready_for_review`; replaced `withdrawn` with `archived`; added `archived` |
| Rationale | `submitted` is not an OpenAPI-approved value; `ready_for_review` is the correct term. `withdrawn` is not an OpenAPI-approved value; creator withdrawal is represented by `rejected` per the OpenAPI description (which states: "rejected = rejected by reviewer or withdrawn by creator"). The `archived` status represents soft-deletion and is a separate lifecycle state. |
| Withdrawal mapping | `withdrawn` → `rejected` per OpenAPI semantics; not `withdrawn` → `archived`. The `archived` status was missing from the draft and is added as a distinct soft-delete state. |
| Residual risk | Low — values now match OpenAPI; withdrawal semantics correctly mapped to `rejected`; `archived` correctly separate |

### 4.3 CampaignContentItemStatus / campaign_content_items.status

| Attribute | Detail |
|---|---|
| OpenAPI schema name | `CampaignContentItemStatus` |
| OpenAPI-approved values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Previous draft values | `draft`, `in_review`, `approved`, `rejected`, `published`, `archived` |
| Corrected draft values | `draft`, `ready_for_review`, `approved`, `rejected`, `archived` |
| Correction action | Replaced `in_review` with `ready_for_review`; removed `published` |
| Rationale | `in_review` is not an OpenAPI-approved value; `ready_for_review` is the correct term. `published` is not a V1 OpenAPI status for this entity; publishing state is tracked via `publishing_jobs`, not via content item status. |
| Residual risk | Low — values now match OpenAPI; `published` removal is correct because this status belongs on `publishing_jobs`, not `campaign_content_items` |

### 4.4 PublishingJobStatus / publishing_jobs.status

| Attribute | Detail |
|---|---|
| OpenAPI schema name | `PublishingJobStatus` |
| OpenAPI-approved values | `draft`, `scheduled`, `queued`, `simulated`, `failed`, `cancelled` |
| Previous draft values | `pending`, `in_progress`, `published`, `failed`, `cancelled` |
| Corrected draft values | `draft`, `scheduled`, `queued`, `simulated`, `failed`, `cancelled` |
| Correction action | Replaced `pending` with `draft`; replaced `in_progress` with `scheduled` and `queued`; replaced `published` with `simulated`; retained `failed` and `cancelled` |
| Rationale | All three replaced values (`pending`, `in_progress`, `published`) are not in OpenAPI. `simulated` must remain explicitly distinct from any future real publishing status per the OpenAPI description — no real external publishing occurs in V1. |
| Residual risk | Low — values now match OpenAPI; `simulated` V1-only constraint is documented in comment |

---

## 5. Required Enum Corrections

All four enum corrections are sourced from `docs/nashir_v1_openapi.yaml`.

No enum value was guessed or invented.

No mismatch was found that could not be resolved without changing OpenAPI.

### ContentDraftStatus mapping note

The `withdrawn` status in the previous draft does not exist in OpenAPI.

Per the OpenAPI `ContentDraftStatus` description:
`rejected` = "rejected by reviewer or withdrawn by creator".

Therefore:

- Creator withdrawal is represented by the `rejected` status.
- `withdrawn` is NOT mapped to `archived`.
- `archived` is a separate and independent soft-delete lifecycle state.
- The corrected CHECK constraint uses `archived` as a distinct value for soft-deletion.

---

## 6. credential_ref vs vault_ref Correction

### Previous state

`docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` defined
two nullable fields on `integration_credentials`:

- `credential_ref TEXT` — opaque vault reference
- `vault_ref TEXT` — alternative vault reference field

### Decision applied

Single `credential_ref` field. `vault_ref` removed.

This decision was made in the SQL Migration Execution Planning Follow-up Gate
(Section 6) and confirmed by the Follow-up Review Gate.

### Correction applied

`vault_ref TEXT` is removed from the `integration_credentials` draft definition.

A comment documents the removal:

```text
-- vault_ref removed: single credential_ref field is sufficient;
-- credential_type identifies the provider.
-- See SQL Migration Draft Correction Gate for rationale.
```

`credential_ref TEXT` remains as the single opaque reference field.

`credential_type TEXT` remains to identify the storage mechanism
(e.g., `hashicorp_vault`, `aws_secrets_manager`, `gcp_secret_manager`).

### Controls preserved

- No plaintext secrets: `credential_ref` is an opaque reference; no raw secrets.
- Credential target exclusivity: XOR CHECK constraint unchanged.
- Same-workspace composite FKs: unchanged.
- Credential mutation audit requirement: unchanged.
- No provider implementation: deferred.

---

## 7. Draft Contract Edits

### nashir_v1_003_asset_campaign_content.sql.md — changes

| Location | Change |
|---|---|
| `campaigns` table `status` CHECK constraint | Updated from 5 values to 9 OpenAPI-approved values |
| `campaigns` table `status` comment | Updated to reflect corrected values with descriptions |
| `campaign_content_items` table `status` CHECK constraint | Updated: `in_review`→`ready_for_review`; `published` removed |
| `campaign_content_items` table `status` comment | Updated to reflect correction |
| `content_drafts` table `status` CHECK constraint | Updated: `submitted`→`ready_for_review`; `withdrawn`→`archived` |
| `content_drafts` table `status` comment | Updated with withdrawal mapping note |
| Open items section | Three resolved open items updated to record correction |

### nashir_v1_004_publishing_analytics_audit.sql.md — changes

| Location | Change |
|---|---|
| `publishing_jobs` table `status` CHECK constraint | Updated from 5 non-OpenAPI values to 6 OpenAPI-approved values |
| `publishing_jobs` table `status` comment | Updated with descriptions and removed-value notes |
| Open items section | Resolved open item updated to record correction |

### nashir_v1_002_store_product_source.sql.md — changes

| Location | Change |
|---|---|
| `integration_credentials` table column list | `vault_ref TEXT` removed; `credential_ref TEXT` retained with updated comment |
| Constraints checklist | Updated: `credential_ref` / `vault_ref` row replaced with `credential_ref` only |
| Open items section | Resolved open item updated to record correction |

### Unchanged files

- `nashir_v1_001_foundation_identity_tenant.sql.md` — no corrections needed.
- `nashir_v1_005_support_reference.sql.md` — no corrections needed.

### Non-executable boundary preserved

All files remain `.sql.md` documentation artifacts.

No `.sql` executable migration files were created.

No migration runner was introduced.

No package scripts were added.

No database connection config was added.

Same-workspace composite FK controls are unchanged in all three corrected files.

Parent `UNIQUE (workspace_id, id)` constraints are unchanged.

Product SKU partial unique index is unchanged.

Audit append-only notes are unchanged.

`users.email` lookup notes are unchanged.

---

## 8. Non-executable Boundary

| Check | Result |
|---|---|
| Corrected files remain `.sql.md` documentation artifacts | **CONFIRMED** |
| No executable `.sql` migration path introduced | **CONFIRMED** |
| No migration runner introduced | **CONFIRMED** |
| No database-applied change claimed | **CONFIRMED** |
| No backend/ORM/generated/package change introduced | **CONFIRMED** |
| No CI/CD migration execution step introduced | **CONFIRMED** |
| No database connection config introduced | **CONFIRMED** |
| Composite FK controls preserved | **CONFIRMED** |
| Parent `UNIQUE (workspace_id, id)` constraints preserved | **CONFIRMED** |
| Credential XOR constraint preserved | **CONFIRMED** |
| No plaintext secrets introduced | **CONFIRMED** |

---

## 9. Impact on Next Gate

### What this gate accomplishes

This gate applies the five draft corrections required before SQL Migration
Execution Gate may be opened.

Items 1–4 (enum CHECK constraints) are corrected and aligned to OpenAPI.

Item 5 (`vault_ref` removal) is corrected; single `credential_ref` field confirmed.

### What this gate does not authorize

This gate does not authorize SQL Migration Execution Gate.

This gate does not authorize executing migrations.

This gate does not authorize adding a migration runner.

This gate does not authorize database-applied changes.

This gate does not authorize backend implementation.

This gate does not authorize ORM models.

This gate does not authorize generated clients.

This gate does not authorize production or pilot readiness.

### Recommended next gate

**GO to SQL Migration Draft Correction Review Gate.**

The SQL Migration Draft Correction Review Gate must verify that the five
corrections are accurate, preserve the non-executable boundary, maintain all
FK and constraint controls, and align exactly with the OpenAPI enum definitions.

---

## 10. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Enum drift from OpenAPI | CRITICAL | All four enum fields corrected to exact OpenAPI values; correction gate and review gate required before execution |
| Draft/OpenAPI mismatch reaching execution | CRITICAL | SQL Migration Execution Gate is blocked until this correction gate and its review gate are merged |
| Wrong withdrawal mapping | HIGH | `withdrawn`→`rejected` per OpenAPI semantics (NOT `withdrawn`→`archived`); correction note documents this in draft 003; `archived` is a separate soft-delete state |
| Credential reference ambiguity | HIGH | `vault_ref` removed; single `credential_ref` field confirmed; no ambiguity remains |
| Cross-workspace leakage if FK controls weakened | CRITICAL | Same-workspace composite FKs and parent `UNIQUE (workspace_id, id)` constraints are unchanged in all corrected files |
| Premature execution | CRITICAL | No migration execution authorized; SQL Migration Execution Gate blocked until correction review merges |
| Runner introduced too early | CRITICAL | Runner-free; no runner introduced in this gate |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |

---

## 11. GO / NO-GO Decision

**Decision: GO to SQL Migration Draft Correction Review Gate.**

This gate has applied all five draft contract corrections required before
SQL Migration Execution Gate may be opened.

All four OpenAPI enum CHECK constraints are corrected.

`vault_ref` is removed from draft 002; single `credential_ref` field confirmed.

All corrections preserve the non-executable boundary, same-workspace FK
controls, parent composite unique constraints, credential XOR model, audit
append-only notes, and users.email lookup notes.

No migration files, migration runner, SQL execution, backend code, ORM models,
seed files, generated client, package changes, UI changes, database connection
config, or production readiness claims are introduced.

This authorizes only the SQL Migration Draft Correction Review Gate.

This does not authorize SQL Migration Execution Gate.

This does not authorize executing migrations.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

---

## 12. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `M docs/migration_contracts/nashir_v1_002_store_product_source.sql.md`, `M docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md`, `M docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md`, `?? docs/nashir_sql_migration_draft_correction_gate.md` before commit |
| `git diff --stat` | 3 draft files changed; 27 insertions, 16 deletions |
| `git diff -- docs/` | Enum CHECK constraints updated in drafts 003 and 004; `vault_ref` removed from draft 002; open items updated |
| BIDI scan: `docs/nashir_sql_migration_draft_correction_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: corrected draft files | `BIDI_CONTROL_CHARS none` |
| `withdrawn -> archived` mapping | **NONE** — removed; withdrawal correctly maps to `rejected` per OpenAPI |
| Enum values match OpenAPI | `campaigns`: 9 values ✓; `content_drafts`: 5 values ✓; `campaign_content_items`: 5 values ✓; `publishing_jobs`: 6 values ✓ |
| `vault_ref` ambiguity resolved | `vault_ref TEXT` column removed from draft 002; `credential_ref TEXT` is the single opaque reference field |
| Executable migration/runner/SQL execution scan | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Backend/API runtime/ORM/generated/UI/package files scan | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Package.json or package-lock changes | **NONE** |
| Database connection config scan | **NONE** |
| CI/CD migration execution scan | **NONE** |
| Database-applied changes scan | No database commands executed; no migration files applied |

BIDI scan method: Python `pathlib` + Unicode code-point lookup;
no BIDI control characters embedded in shell patterns.

Expected result:

- Documentation-only correction.
- Draft contract files remain non-executable `.sql.md`.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No ORM models.
- No generated client.
- No package/UI changes.
- No database-applied changes.
- No production/pilot readiness claim.
