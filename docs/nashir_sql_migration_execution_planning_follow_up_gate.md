# Nashir SQL Migration Execution Planning Follow-up Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Execution Planning Follow-up Gate - documentation only |
| Status | Follow-up decisions complete |
| Date | 2026-06-03 |
| Controlling review input | `docs/nashir_sql_migration_execution_planning_review_gate.md` |
| WATCH items resolved | 7 of 7 (decided; 4 enum items require draft correction gate) |
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

This is the Nashir SQL Migration Execution Planning Follow-up Gate.

The SQL Migration Execution Planning Review Gate (PR #97) issued a GO with
minor documentation follow-up decision.

The review gate identified seven WATCH items that must be resolved before any
SQL Migration Execution Gate can be opened.

This gate resolves those seven items through documentation-only decisions.

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

SQL Migration Execution Gate remains blocked until this follow-up gate and
its review gate are merged, and draft file corrections are applied in a
subsequent SQL Migration Draft Authoring Correction Gate.

---

## 2. Inputs Reviewed

### Controlling input

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_execution_planning_review_gate.md` | Primary controlling input; source of the 7 WATCH items |

### Enum and schema authority

| Input | Role |
|---|---|
| `docs/nashir_v1_openapi.yaml` | Enum and status authority for all four OpenAPI-approved status fields |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |

### Draft contract artifacts

| Input | Role |
|---|---|
| `docs/nashir_sql_migration_execution_planning_gate.md` | Execution planning gate; execution boundary and safeguards |
| `docs/nashir_sql_migration_draft_authoring_review_gate.md` | Draft authoring review; enum and FK verification baseline |
| `docs/nashir_sql_migration_draft_authoring_gate.md` | Draft authoring gate; scope and sequence |
| `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` | Draft — credential_ref vs vault_ref source |
| `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md` | Draft — CampaignStatus, ContentDraftStatus, CampaignContentItemStatus source |
| `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md` | Draft — PublishingJobStatus, audit_events source |

### Authority boundaries

| Boundary | Result |
|---|---|
| `docs/nashir_v1_openapi.yaml` is the enum and status authority | **CONFIRMED** |
| Any draft value that contradicts `docs/nashir_v1_openapi.yaml` is FAIL and blocks SQL Migration Execution Gate | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |

---

## 3. WATCH Item Decision Matrix

| # | WATCH item | Decision | Blocks SQL Migration Execution Gate |
|---|---|---|---|
| 1 | `campaigns.status` enum values | **FAIL** — draft values do not match OpenAPI; corrected values documented below | YES — requires SQL Migration Draft Authoring Correction Gate |
| 2 | `content_drafts.status` enum values | **FAIL** — draft values do not match OpenAPI; corrected values documented below | YES — requires SQL Migration Draft Authoring Correction Gate |
| 3 | `campaign_content_items.status` enum values | **FAIL** — draft values do not match OpenAPI; corrected values documented below | YES — requires SQL Migration Draft Authoring Correction Gate |
| 4 | `publishing_jobs.status` enum values | **FAIL** — draft values do not match OpenAPI; corrected values documented below | YES — requires SQL Migration Draft Authoring Correction Gate |
| 5 | `gen_random_uuid()` availability | **DECIDED** — PostgreSQL 13+ required; pgcrypto fallback documented | NO — controlled; future execution gate must verify environment |
| 6 | `credential_ref` vs `vault_ref` field count | **DECIDED** — single `credential_ref` field; `vault_ref` removed | YES — requires SQL Migration Draft Authoring Correction Gate |
| 7 | Application and migration role separation plan | **DECIDED** — plan documented; no SQL or config introduced | NO — controlled; future execution gate must verify |

Items 1–4 and item 6 require a SQL Migration Draft Authoring Correction Gate
to update the draft migration contract files before SQL Migration Execution
Gate may be opened.

Items 5 and 7 are resolved here; no draft file correction is needed.

---

## 4. OpenAPI Enum/Status Verification

### 4.1 CampaignStatus / campaigns.status

**OpenAPI values** (from `docs/nashir_v1_openapi.yaml`):

```
draft, generating, review, ready, scheduled, active, paused, completed, archived
```

**Draft values** (from `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md`):

```
draft, active, paused, completed, archived
```

**Comparison:**

| Value | In OpenAPI | In Draft | Status |
|---|---|---|---|
| `draft` | YES | YES | MATCH |
| `generating` | YES | NO | MISSING FROM DRAFT |
| `review` | YES | NO | MISSING FROM DRAFT |
| `ready` | YES | NO | MISSING FROM DRAFT |
| `scheduled` | YES | NO | MISSING FROM DRAFT |
| `active` | YES | YES | MATCH |
| `paused` | YES | YES | MATCH |
| `completed` | YES | YES | MATCH |
| `archived` | YES | YES | MATCH |

**Result: FAIL**

The draft is missing four approved OpenAPI values: `generating`, `review`, `ready`, `scheduled`.

**Required correction:**

The `campaigns` table draft CHECK constraint must be updated to:

```text
CHECK (status IN (
    'draft', 'generating', 'review', 'ready', 'scheduled',
    'active', 'paused', 'completed', 'archived'
))
```

This correction is required in a SQL Migration Draft Authoring Correction Gate.

**Blocks SQL Migration Execution Gate:** YES — any mismatch with OpenAPI is NO-GO for executable migration authoring.

---

### 4.2 ContentDraftStatus / content_drafts.status

**OpenAPI values** (from `docs/nashir_v1_openapi.yaml`):

```
draft, ready_for_review, approved, rejected, archived
```

Note from OpenAPI description: `rejected` covers both reviewer rejection and creator withdrawal.
`withdrawn` is not a separate OpenAPI-approved value.

**Draft values** (from `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md`):

```
draft, submitted, approved, rejected, withdrawn
```

**Comparison:**

| Value | In OpenAPI | In Draft | Status |
|---|---|---|---|
| `draft` | YES | YES | MATCH |
| `ready_for_review` | YES | NO | MISSING FROM DRAFT |
| `approved` | YES | YES | MATCH |
| `rejected` | YES | YES | MATCH |
| `archived` | YES | NO | MISSING FROM DRAFT |
| `submitted` | NO | YES | NOT IN OPENAPI |
| `withdrawn` | NO | YES | NOT IN OPENAPI |

**Result: FAIL**

The draft uses `submitted` instead of `ready_for_review` and `withdrawn` instead
of `archived`. Both `submitted` and `withdrawn` are not OpenAPI-approved values.

The OpenAPI description confirms: withdrawal is represented by `rejected` status
(the `rejected` value covers reviewer rejection and creator withdrawal).

**Required correction:**

The `content_drafts` table draft CHECK constraint must be updated to:

```text
CHECK (status IN (
    'draft', 'ready_for_review', 'approved', 'rejected', 'archived'
))
```

This correction is required in a SQL Migration Draft Authoring Correction Gate.

**Blocks SQL Migration Execution Gate:** YES.

---

### 4.3 CampaignContentItemStatus / campaign_content_items.status

**OpenAPI values** (from `docs/nashir_v1_openapi.yaml`):

```
draft, ready_for_review, approved, rejected, archived
```

**Draft values** (from `docs/migration_contracts/nashir_v1_003_asset_campaign_content.sql.md`):

```
draft, in_review, approved, rejected, published, archived
```

**Comparison:**

| Value | In OpenAPI | In Draft | Status |
|---|---|---|---|
| `draft` | YES | YES | MATCH |
| `ready_for_review` | YES | NO | MISSING FROM DRAFT |
| `approved` | YES | YES | MATCH |
| `rejected` | YES | YES | MATCH |
| `archived` | YES | YES | MATCH |
| `in_review` | NO | YES | NOT IN OPENAPI |
| `published` | NO | YES | NOT IN OPENAPI |

**Result: FAIL**

The draft uses `in_review` instead of `ready_for_review` and includes `published`
which is not an OpenAPI-approved value.

**Required correction:**

The `campaign_content_items` table draft CHECK constraint must be updated to:

```text
CHECK (status IN (
    'draft', 'ready_for_review', 'approved', 'rejected', 'archived'
))
```

This correction is required in a SQL Migration Draft Authoring Correction Gate.

**Blocks SQL Migration Execution Gate:** YES.

---

### 4.4 PublishingJobStatus / publishing_jobs.status

**OpenAPI values** (from `docs/nashir_v1_openapi.yaml`):

```
draft, scheduled, queued, simulated, failed, cancelled
```

Note from OpenAPI description: `simulated` must remain explicitly distinct from
any future real publishing status. No real external publishing occurs in V1.

**Draft values** (from `docs/migration_contracts/nashir_v1_004_publishing_analytics_audit.sql.md`):

```
pending, in_progress, published, failed, cancelled
```

**Comparison:**

| Value | In OpenAPI | In Draft | Status |
|---|---|---|---|
| `draft` | YES | NO | MISSING FROM DRAFT |
| `scheduled` | YES | NO | MISSING FROM DRAFT |
| `queued` | YES | NO | MISSING FROM DRAFT |
| `simulated` | YES | NO | MISSING FROM DRAFT |
| `failed` | YES | YES | MATCH |
| `cancelled` | YES | YES | MATCH |
| `pending` | NO | YES | NOT IN OPENAPI |
| `in_progress` | NO | YES | NOT IN OPENAPI |
| `published` | NO | YES | NOT IN OPENAPI |

**Result: FAIL**

The draft is missing `draft`, `scheduled`, `queued`, and `simulated`.
The draft includes `pending`, `in_progress`, and `published` which are not
OpenAPI-approved values.

**Required correction:**

The `publishing_jobs` table draft CHECK constraint must be updated to:

```text
CHECK (status IN (
    'draft', 'scheduled', 'queued', 'simulated', 'failed', 'cancelled'
))
```

This correction is required in a SQL Migration Draft Authoring Correction Gate.

**Blocks SQL Migration Execution Gate:** YES.

---

## 5. gen_random_uuid() Decision

### Current source reviewed

All five draft migration files use `gen_random_uuid()` as the UUID generation
function for primary keys.

`gen_random_uuid()` availability depends on PostgreSQL version:

- PostgreSQL 13 and later: natively available; no extension required.
- PostgreSQL 12 and earlier: requires the `pgcrypto` extension.

### Decision

**Target PostgreSQL 13 or later.**

`gen_random_uuid()` remains the approved UUID generation candidate for all
draft migration files.

Alternative — application-side UUID generation:

Application-side UUID generation (e.g., `uuid.v4()` in Node.js) can eliminate
the PostgreSQL version dependency but requires every INSERT to supply the UUID.
This is a valid alternative but introduces coordination with the backend
implementation and is deferred.

Alternative — `uuid_generate_v4()` from `uuid-ossp`:

`uuid_generate_v4()` from the `uuid-ossp` extension is a valid PostgreSQL
alternative but requires `CREATE EXTENSION uuid-ossp` before use. It is
not preferred because `gen_random_uuid()` is native in PostgreSQL 13+.

### Rationale

PostgreSQL 13 was released in September 2020 and is supported by all major
managed PostgreSQL providers (Amazon RDS, Google Cloud SQL, Supabase, Neon,
Fly.io). Targeting PostgreSQL 13+ is a reasonable baseline.

### Risk

If the target environment runs PostgreSQL 12 or earlier:

- `gen_random_uuid()` will fail with "function gen_random_uuid() does not exist."
- Mitigation: Install `pgcrypto` extension before running migrations.
- `CREATE EXTENSION IF NOT EXISTS pgcrypto;` must be applied before group 1.

### Required next control

Future SQL Migration Execution Gate must verify:

1. PostgreSQL version is 13+ (preferred), OR
2. `pgcrypto` extension is installed (fallback for PostgreSQL 12 or earlier).

No SQL or extension creation is introduced in this gate.

**Blocks SQL Migration Execution Gate:** NO — controlled; future gate must verify environment.

---

## 6. credential_ref vs vault_ref Decision

### Current source reviewed

`docs/migration_contracts/nashir_v1_002_store_product_source.sql.md` defines
two nullable fields on `integration_credentials`:

- `credential_ref TEXT` — opaque vault reference; no plaintext secret
- `vault_ref TEXT` — alternative vault reference field

Both fields are optional and serve the same semantic purpose: storing an
opaque reference to a credential in an external vault or secrets manager.

### Decision

**Single `credential_ref` field. Remove `vault_ref`.**

The `integration_credentials` table should use a single opaque reference
field named `credential_ref`.

The `credential_type` field (already present) provides sufficient context
to identify the type of credential storage mechanism (e.g., `hashicorp_vault`,
`aws_secrets_manager`, `gcp_secret_manager`).

Two fields for the same concept creates ambiguity:

- Which field should be populated?
- What happens if both are set?
- What happens if neither is set but a credential type is declared?

A single `credential_ref` field removes this ambiguity.

### Recommended field model

```text
credential_ref TEXT   -- opaque reference; no plaintext secret;
                      -- format is provider-specific (e.g., vault path,
                      --  ARN, GCP resource name)
credential_type TEXT  -- identifies the credential storage mechanism
```

### Rationale

- Simpler: one field, one reference.
- Compatible with the no-plaintext-secrets rule.
- `credential_type` encodes the provider; `credential_ref` encodes the path or identifier.
- Eliminates ambiguity about which field to use.

### Impact on integration_credentials

The `vault_ref` column must be removed from the draft contract.

The `credential_ref` column remains and is sufficient.

### Required next control

A SQL Migration Draft Authoring Correction Gate must:

1. Remove `vault_ref TEXT` from the `integration_credentials` draft in
   `docs/migration_contracts/nashir_v1_002_store_product_source.sql.md`.
2. Update the constraints checklist and open items in that draft file.
3. No provider implementation is introduced.

**Blocks SQL Migration Execution Gate:** YES — draft file correction required
before executable migration authoring.

---

## 7. audit_events Role Separation Plan

### Context

The SQL schema contract, authoring gate, and follow-up gate all require that
`audit_events` be protected by database-level append-only enforcement.

The preferred mechanism is a combination of:

1. Triggers preventing `UPDATE` and `DELETE` on `audit_events`.
2. Privilege restriction: `REVOKE UPDATE, DELETE ON audit_events FROM <application_role>`.

For privilege restriction to work, PostgreSQL requires that the application
role is NOT the owner of `audit_events`. A table owner retains all privileges
regardless of any `REVOKE` statement.

### Role separation plan

| Role | Purpose | Owns audit_events | Privileges on audit_events |
|---|---|---|---|
| Migration/deployment owner role | Runs migrations; creates tables; owns schema objects | YES | All (as owner) |
| Application role | Executes application queries at runtime | NO | `INSERT`, `SELECT` only |

**Rules:**

1. `audit_events` is created by and owned by the migration/deployment owner role.
2. After creation, `GRANT INSERT, SELECT ON audit_events TO <application_role>`.
3. `UPDATE` and `DELETE` are never granted to the application role.
4. A `REVOKE UPDATE, DELETE ON audit_events FROM <application_role>` may be applied as a safeguard, but is effectively a no-op if UPDATE/DELETE were never granted.
5. Triggers enforce append-only behavior independently of privilege grants.
6. If the database engine allows the application role to escalate to owner, triggers remain the sole enforcement.

**Defense-in-depth:**

- Triggers enforce append-only regardless of role or privilege state.
- Privilege restriction prevents application-layer accidents where the application role is used directly.
- Together, they prevent: accidental UPDATE/DELETE from application code; direct psql mutations if the application role is used; accidental mutation from a botched migration rollback.

**PostgreSQL owner-role caveat:**

`REVOKE UPDATE, DELETE ON audit_events FROM <migration_role>` has no effect
if `<migration_role>` owns `audit_events`. The migration role retains all
privileges as owner. This is expected and acceptable because:

- The migration role is used only during migration runs, not at application runtime.
- The application role is distinct from the migration role.
- The application role never owns `audit_events`.

**No SQL or database config is introduced in this gate.**

### Required next control

Future SQL Migration Execution Gate must verify before applying group 4 migrations:

1. The migration/deployment owner role is defined and distinct from the application role.
2. `audit_events` is created and owned by the migration/deployment owner role.
3. `GRANT INSERT, SELECT ON audit_events TO <application_role>` is applied after table creation.
4. `UPDATE` and `DELETE` are not granted to the application role.
5. The trigger function and trigger definitions from draft 004 are present in the executable migration.
6. `metadata JSONB` does not contain credential values, raw tokens, or sensitive secrets.

**Blocks SQL Migration Execution Gate:** NO — controlled; future execution gate must verify role ownership, privilege grants, and trigger presence.

---

## 8. Impact on Next Gate

### What this gate resolves

This gate resolves all seven WATCH items from the SQL Migration Execution
Planning Review Gate.

Items 1–4 (enum mismatches) are FAIL and require a SQL Migration Draft
Authoring Correction Gate to update the draft migration contract files before
SQL Migration Execution Gate may be opened.

Item 5 (`gen_random_uuid()`) is resolved: PostgreSQL 13+ required; pgcrypto
fallback for earlier versions; future execution gate must verify.

Item 6 (`credential_ref` vs `vault_ref`) is decided: single `credential_ref`
field; `vault_ref` removed; draft 002 correction gate required.

Item 7 (role separation plan) is resolved: plan documented; future execution
gate must verify role ownership, privilege grants, and trigger presence.

### What this gate does not authorize

This gate does not authorize SQL Migration Execution Gate.

This gate does not authorize executing migrations.

This gate does not authorize adding a migration runner.

This gate does not authorize database-applied changes.

This gate does not authorize backend implementation.

This gate does not authorize ORM models.

This gate does not authorize generated clients.

This gate does not authorize production or pilot readiness.

### Gate sequence after this follow-up gate

1. **SQL Migration Execution Planning Follow-up Review Gate** — reviews this
   follow-up gate's decisions.

2. **SQL Migration Draft Authoring Correction Gate** — updates the five draft
   migration contract files to fix enum values (items 1–4) and remove
   `vault_ref` (item 6).

3. **SQL Migration Draft Authoring Correction Review Gate** — reviews the
   draft contract corrections.

4. **SQL Migration Execution Gate** — may be opened only after:
   - This follow-up gate and its review gate are merged.
   - Draft authoring correction gate and its review gate are merged.
   - Backend repository is established with runner, path, and verification tooling.
   - Pre-execution validation (Section 8 of the Execution Planning Gate) passes.

---

## 9. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Enum drift from OpenAPI | CRITICAL | Four enum fields confirmed as FAIL; draft correction gate required before executable migration authoring |
| `campaigns.status` missing four OpenAPI values | CRITICAL | `generating`, `review`, `ready`, `scheduled` must be added in draft correction gate |
| `content_drafts.status` using non-OpenAPI values | CRITICAL | `submitted` must become `ready_for_review`; `withdrawn` must become `archived`; draft correction gate required |
| `campaign_content_items.status` using non-OpenAPI values | CRITICAL | `in_review` must become `ready_for_review`; `published` must be removed; draft correction gate required |
| `publishing_jobs.status` using non-OpenAPI values | CRITICAL | `pending`, `in_progress`, `published` must be replaced with `draft`, `scheduled`, `queued`, `simulated`; draft correction gate required |
| PostgreSQL extension availability risk | HIGH | `gen_random_uuid()` requires PostgreSQL 13+ or `pgcrypto`; future execution gate must verify environment version |
| Credential reference ambiguity | HIGH | `vault_ref` removed; single `credential_ref` field decided; draft correction gate required |
| Audit tampering if app role owns audit_events | HIGH | Role separation plan documented; application role must not own `audit_events`; trigger enforcement provides defense-in-depth |
| Premature execution | CRITICAL | No migration execution authorized; SQL Migration Execution Gate blocked until draft corrections and gate chain complete |
| Runner introduced too early | CRITICAL | Runner-free; runner selection deferred to backend repository |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |

---

## 10. GO / NO-GO Decision

**Decision: GO to SQL Migration Execution Planning Follow-up Review Gate.**

All seven WATCH items are resolved or clearly decided.

Four enum fields (items 1–4) are FAIL; corrected values are documented here;
a SQL Migration Draft Authoring Correction Gate is required.

Item 6 (`vault_ref` removal) is decided; a draft correction gate is required.

Items 5 (`gen_random_uuid()`) and 7 (role separation plan) are resolved;
no draft correction is needed.

This gate is documentation-only.

No migration files, migration runner, SQL execution, backend code, ORM models,
seed files, generated client, package changes, UI changes, database connection
config, or production readiness claims are introduced.

This authorizes only the SQL Migration Execution Planning Follow-up Review Gate.

This does not authorize SQL Migration Execution Gate.

This does not authorize executing migrations.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

SQL Migration Execution Gate remains blocked until:

1. This follow-up gate and its review gate are merged.
2. A SQL Migration Draft Authoring Correction Gate corrects the enum values
   and removes `vault_ref`.
3. The correction gate and its review gate are merged.
4. A backend repository is established with runner, path, and verification tooling.
5. Pre-execution validation passes all checks defined in the Execution Planning Gate.

---

## 11. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_execution_planning_follow_up_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new follow-up gate document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new follow-up gate document shown by `git status --short` |
| BIDI scan: `docs/nashir_sql_migration_execution_planning_follow_up_gate.md` | `BIDI_CONTROL_CHARS none` |
| Executable migrations/migration runner/SQL execution scan | `MIGRATION_RUNNER_SQL_CHANGED_FILES: none` |
| Backend/API runtime/ORM/generated/UI/package files scan | `RUNTIME_FORBIDDEN_CHANGED_FILES: none` |
| Package.json or package-lock changes | **NONE** |
| Database connection config scan | **NONE** |
| CI/CD migration execution scan | **NONE** |
| Database-applied changes scan | No database commands executed; no migration files applied |

BIDI scan method: Python `pathlib` + Unicode code-point lookup;
no BIDI control characters embedded in shell patterns.

Expected result:

- Documentation-only follow-up.
- No executable migrations.
- No migration runner.
- No backend implementation.
- No ORM models.
- No generated client.
- No package/UI changes.
- No database-applied changes.
- No production/pilot readiness claim.
