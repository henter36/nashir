# Nashir SQL Migration Authoring Follow-up Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Authoring Follow-up Gate - documentation only |
| Status | Follow-up decisions complete |
| Date | 2026-06-03 |
| Controlling review input | `docs/nashir_sql_migration_authoring_review_gate.md` |
| Follow-up items resolved | 9 of 9 (decided or explicitly deferred with blocker) |
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

This is the Nashir SQL Migration Authoring Follow-up Gate.

The SQL Migration Authoring Review Gate (PR #91, merged as commit `7c3a0f8`)
issued a GO with minor documentation follow-up decision.

The review gate identified nine controlled watch items that must be resolved
before migration draft files are created and before any SQL Migration Execution
Planning Gate may be authorized.

This gate resolves those nine items through documentation-only decisions.

This gate does not create executable migrations.

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

This gate does not authorize SQL Migration Execution Planning.

SQL Migration Execution Planning remains blocked until this follow-up gate and
its review gate are merged and explicitly authorize the next step.

---

## 2. Inputs Reviewed

### Controlling input

| Input | Review use |
|---|---|
| `docs/nashir_sql_migration_authoring_review_gate.md` | Primary controlling input; source of the 9 follow-up items |

### Direct inputs

| Input | Review use |
|---|---|
| `docs/nashir_sql_migration_authoring_gate.md` | Migration authoring contract authority |
| `docs/nashir_sql_migration_planning_gate.md` | Migration planning scope, file strategy, sequence, and safety rules |
| `docs/nashir_sql_migration_planning_review_gate.md` | Migration planning review confirmation |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_v1_openapi.yaml` | Current OpenAPI contract authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |
| `docs/nashir_backend_home_decision.md` | Backend home and repository boundary authority |
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |

### Authority boundaries

| Boundary | Result |
|---|---|
| Nashir is the product, UI journey, scope, API contract, SQL schema contract, and data model authority | **CONFIRMED** |
| marketing-os is reference-only | **CONFIRMED** |
| No marketing-os code, migration files, runner scripts, entities, backend shape, runtime assumptions, or journey are copied | **CONFIRMED** |

---

## 3. Follow-up Item Decision Matrix

The nine follow-up items from the SQL Migration Authoring Review Gate are listed
below with their decisions.

| # | Item | Decision | Blocks migration draft files | Blocks SQL Migration Execution Planning |
|---|---|---|---|---|
| 1 | Migration file location | Decided: not in this repository; `docs/migration_contracts/` approved for documentation-only drafts only | NO — documentation path approved | YES — executable path deferred to backend repository |
| 2 | Repository boundary | Decided: migration artifacts belong in future backend repository | NO — docs path approved | YES — executable artifacts require backend repository |
| 3 | Runner vs runner-free draft files | Decided: this repository remains runner-free; runner selection deferred to backend repository | NO — docs path is runner-free by definition | YES — runner decision required before execution |
| 4 | Up/down vs forward-only rollback | Decided: prefer down sections within each migration file; forward-only corrective migrations as production fallback | NO | YES — must be confirmed in execution planning |
| 5 | Exact allowed migration file paths | Decided: `docs/migration_contracts/` for documentation-only; no executable paths in this repository | NO | YES — backend executable paths deferred to backend repository |
| 6 | Parse/dry-run verification tooling | Decided: deferred to backend repository context with explicit blocker; no new packages added here | NO | YES — tooling must be decided before execution |
| 7 | `users.email` uniqueness mechanism | Decided: prefer `LOWER(email)` functional unique index | NO | NO — mechanism is decided; subject to SQL Migration Draft Authoring Gate confirmation |
| 8 | Audit append-only enforcement | Decided: prefer combined triggers + privilege revocation; subject to SQL Migration Draft Authoring Gate confirmation | NO | NO — mechanism is decided; subject to SQL Migration Draft Authoring Gate confirmation |
| 9 | Credential target exclusivity/scope | Decided: prefer XOR constraint — exactly one of `channel_connection_id` or `data_source_id` must be non-null | NO | NO — model is decided; subject to SQL Migration Draft Authoring Gate confirmation |

All nine items are resolved in this gate.

Items 1 through 6 are path/repository/runner decisions that remain blockers for
SQL Migration Execution Planning until the backend repository is established and
its own planning gate explicitly authorizes execution.

Items 7 through 9 are mechanism decisions that are resolved here and do not
independently block SQL Migration Execution Planning, subject to confirmation
in a SQL Migration Draft Authoring Gate.

---

## 4. Migration File Location Decision

### Decision

Migration draft files do not belong in this repository (`nashir`).

This repository is a UI prototype and OpenAPI contract repository.

The README, established constraints, and Backend Home Decision collectively
confirm: no backend, no database, no migration runner.

Adding executable migration files to this repository would violate the
established UI/contract boundary and introduce backend runtime coupling.

### Approved documentation-only path

For documentation-only migration contract drafts — non-executable SQL outlines
readable as documentation, not intended for runner execution — the following
path is approved:

```text
docs/migration_contracts/
```

Files in this path:

- Are documentation only.
- Are not executable by any runner in this repository.
- Are not applied to any database.
- Are subject to SQL Migration Authoring Follow-up Review Gate approval before
  any file in this path is created.

### Executable migration path

Executable migration files are deferred to the future backend repository.

The Backend Home Decision selected marketing-os as the preferred backend
candidate, with a dedicated nashir-backend repository as a deferred alternative.

Executable migrations will be planned in the backend repository's own planning
and review gates.

The path in the backend repository is deferred to Backend Slice 1 Planning Gate.

### Blockers

No executable migration path is created in this gate.

No migration directory is created in this gate.

---

## 5. Repository Boundary Decision

### Decision

Migration artifacts belong in the future backend repository.

This repository (`nashir`) hosts:

- UI prototype source code.
- OpenAPI contract (`docs/nashir_v1_openapi.yaml`).
- Documentation gates and review records.
- Documentation-only migration contract drafts in `docs/migration_contracts/`
  after SQL Migration Authoring Follow-up Review Gate authorizes them.

This repository does not host:

- Executable SQL migration files.
- Migration runners or runner configuration.
- Database connection configuration.
- ORM models.
- Backend API routes.
- Server-side runtime code.

### Rationale

Option C from the Backend Home Decision (placing backend inside this repository)
was explicitly rejected.

Adding migration artifacts here would violate the same constraints that
prohibit backend code.

### Backend repository authority

When the backend repository is established:

- It will own executable migration files.
- Its own planning and review gates will govern migration runner selection,
  migration directory structure, rollback convention implementation, and
  parse/dry-run verification tooling.
- Nashir V1 OpenAPI and SQL schema contracts from this repository remain the
  authoritative inputs to the backend repository's migration authoring.

---

## 6. Runner and Execution Boundary Decision

### Decision

This repository remains runner-free.

No migration runner is introduced.

No runner configuration is added.

No database connection is added.

### Documentation-only draft files

If documentation-only SQL drafts are created in `docs/migration_contracts/`,
they are non-executable by definition: this repository has no runner, no
database connection, and no execution tooling.

### Future runner selection

When the backend repository is established, runner selection must be made in
the context of that repository's tooling.

Candidate runner categories (for future backend repository planning):

| Runner category | Notes |
|---|---|
| Framework-integrated runner | e.g., Knex, Prisma Migrate, TypeORM migrations — couples runner to ORM; deferred pending ORM decision |
| Standalone SQL runner | e.g., Flyway, Liquibase, golang-migrate — framework-independent; compatible with raw SQL migration files |
| Custom node-postgres runner | Lightweight; full control; requires implementing metadata table, ordering, and checksum logic |
| Runner-free with manual apply | Acceptable for very early backend development; requires strict manual process and metadata tracking |

Final runner selection is deferred to Backend Slice 1 Planning Gate.

### Execution authorization

SQL Migration Execution Planning Gate may not be opened until:

1. A backend repository is established and its own planning gate is opened.
2. Runner selection is reviewed and approved in that backend repository.
3. Executable migration file paths are approved.
4. Parse/dry-run verification tooling is approved.
5. This follow-up gate and its review gate are merged.

---

## 7. Rollback Convention Decision

### Decision

Prefer **down sections within each migration file** as the primary rollback
convention.

Forward-only corrective migrations remain a recognized fallback for production
scenarios where rollback is too risky.

### Rationale

| Convention | Assessment |
|---|---|
| Separate up/down files | Each migration has two files; clean separation; more files to track; runner must know the pair |
| Down sections in same file | Single file per migration; self-contained; compatible with most SQL runners; preferred for reviewability |
| Forward-only corrective migrations | No rollback files; corrective migration issued instead; acceptable for late-stage production where rollback is destructive |

Down sections within each migration file are preferred because:

- Each migration is reviewable as a single unit in a PR diff.
- Runner support is broad.
- Pairing up and down logic in one file reduces the risk of an orphaned rollback
  file being applied in the wrong order.
- Nashir's migration sequence is dependency-ordered; rollback in reverse order
  is well-defined when up and down are colocated.

### Tradeoffs

Down section rollbacks assume the database state matches the up section output.
If data was inserted between the up run and the rollback attempt, the down
section may fail on foreign key or uniqueness constraints.

This is a known tradeoff accepted by the convention.

Rollback procedures for data-sensitive migrations must be documented on a
per-migration basis in the SQL Migration Draft Authoring Gate.

### Implementation boundary

This decision applies to future backend-side executable migrations.

No rollback SQL is written in this gate.

---

## 8. Allowed Paths and Verification Tooling Decision

### Allowed paths decision

#### In this repository (`nashir`)

| Path | Status | Conditions |
|---|---|---|
| `docs/migration_contracts/` | Approved for documentation-only migration contract drafts | Subject to SQL Migration Authoring Follow-up Review Gate approval before any file is created; files must be non-executable and reviewed |
| `db/migrations/` | NOT approved | Executable migration path; not allowed in this repository |
| `migrations/` | NOT approved | Executable migration path; not allowed in this repository |
| Any migration runner config | NOT approved | Runner-free boundary enforced |

#### In the future backend repository

| Path | Status | Decision gate |
|---|---|---|
| Backend migration directory | Deferred | Backend Slice 1 Planning Gate |
| Runner configuration | Deferred | Backend Slice 1 Planning Gate |

### Parse/dry-run verification tooling decision

Deferred to backend repository context with the following explicit blocker:

**BLOCKER:** No executable migration file may be approved for database
application until a parse or dry-run verification step exists in the review
process for that file.

Acceptable future verification mechanisms (for backend repository context):

| Mechanism | Notes |
|---|---|
| `psql --file --set ON_ERROR_STOP=1` against a test database | Requires a test database in CI; preferred for full parse and execution check |
| `pg_query` / SQL parser library | Parse-only; no database required; lighter; does not catch runtime constraint errors |
| Migration runner `--dry-run` flag | Runner-dependent; checks runner metadata only, not full SQL validity |
| Manual review only | Insufficient; must be combined with at least a parse step |

No new packages may be added to this repository to implement verification
tooling.

Final verification tooling selection is deferred to Backend Slice 1 Planning
Gate.

---

## 9. users.email Uniqueness Mechanism Decision

### Decision

Prefer `LOWER(email)` functional unique index as the `users.email` uniqueness
mechanism.

### Candidate comparison

| Mechanism | Assessment |
|---|---|
| `LOWER(email)` functional unique index | Works on any PostgreSQL installation without extension installation; portable; no superuser privilege required; case-insensitive by construction; recommended candidate |
| `citext` type/extension | Requires `CREATE EXTENSION citext`; may require superuser or extension management privilege; less portable across managed PostgreSQL providers; not recommended as default |

### Rationale

The `LOWER(email)` functional unique index:

- Does not require any PostgreSQL extension.
- Works on any managed PostgreSQL provider (RDS, Cloud SQL, Supabase, Neon,
  Fly.io Postgres) without extension configuration.
- Is explicit in the index definition, making the case-folding rule visible in
  the schema review.
- Avoids the risk of `citext` comparison behavior affecting other email-adjacent
  operations unexpectedly.

`citext` remains a valid alternative if a later gate explicitly approves
enabling the extension in the target PostgreSQL environment and confirms that
the managed provider supports it.

### Application-layer implication

Future backend lookup queries must use `LOWER(email)` comparisons to use the
functional index effectively.

Correct future query pattern:

```text
WHERE LOWER(email) = LOWER($1)
```

Plain `WHERE email = $1` lookups may not use the functional index and may
cause sequential scans on the `users` table.

This is a future backend planning requirement.

It does not authorize backend implementation in this gate.

Backend query patterns must be confirmed in the SQL Migration Draft Authoring
Gate or the relevant Backend Slice planning gate.

### Implementation boundary

No SQL index is written in this gate.

The `LOWER(email)` functional unique index is the recommended candidate for
the SQL Migration Draft Authoring Gate.

---

## 10. Audit Append-only Enforcement Mechanism Decision

### Decision

Prefer a **combined mechanism**: triggers preventing `UPDATE` and `DELETE`
on `audit_events`, plus revocation of `UPDATE` and `DELETE` privileges from
the application database role.

### Candidate comparison

| Mechanism | Assessment |
|---|---|
| Triggers preventing `UPDATE` and `DELETE` | Self-contained in migration SQL; fires at database level regardless of application behavior; catches direct psql access; available enforcement option |
| Revoke `UPDATE`/`DELETE` privileges from application role | Defense-in-depth layer; effective only when the application role is a non-owner role; requires `audit_events` to be owned by a separate migration/deployment owner role |
| Both combined | Defense-in-depth; preferred when role ownership is correctly separated; one mechanism survives failure of the other |
| Service-layer only | Explicitly insufficient per SQL schema contract and all prior gates |

### Rationale

Triggers are self-contained in migration SQL and reviewable in a PR.

Privilege revocation adds a second layer: even if a future code change bypasses
the trigger (or if a trigger is accidentally dropped in a failed migration),
the application role cannot issue `UPDATE` or `DELETE` directly.

Together, they prevent:

- Application-layer audit bypass through direct SQL.
- Accidental mutation from a buggy migration rollback.
- Audit tampering through credential escalation to the application role.

### PostgreSQL owner-role caveat

PostgreSQL table owners retain all privileges on their tables.

`REVOKE UPDATE, DELETE ON audit_events FROM <role>` has no effect if that
role is the owner of `audit_events`.

For privilege revocation to work as a second enforcement layer, the following
must be true:

- `audit_events` must be owned by a **separate migration/deployment owner
  role**, not by the application role.
- The **application role must be a non-owner role** with only the privileges
  explicitly granted to it.
- `UPDATE` and `DELETE` must never be granted to the application role on
  `audit_events`.

If the application role owns `audit_events`, privilege revocation is
ineffective and triggers become the sole database-level enforcement mechanism.

Role ownership separation must be planned as part of backend database setup
and confirmed before executable migration authoring is approved.

### Tradeoff

Both mechanisms require the backend database setup to know the application role
name and to enforce role ownership separation.

Role management and ownership decisions must be part of backend infrastructure
planning.

If a managed PostgreSQL provider restricts trigger creation, privilege
revocation remains effective as the sole mechanism provided the owner-role
separation requirement is met.

Final implementation is deferred to a later approved authoring decision.

### Implementation boundary

No SQL triggers, `REVOKE` statements, or role definitions are written in this
gate.

The combined mechanism — triggers plus privilege revocation with confirmed
owner-role separation — is the recommended candidate for the SQL Migration
Draft Authoring Gate.

---

## 11. Credential Target Exclusivity/Scope Model Decision

### Decision

Prefer the **XOR (exclusive OR) constraint model**: each `integration_credentials`
row must reference exactly one of `channel_connection_id` or `data_source_id`,
not both and not neither.

### Constraint model

| Field state | Validity under XOR model |
|---|---|
| `channel_connection_id` non-null, `data_source_id` null | VALID — credential scoped to a channel connection |
| `channel_connection_id` null, `data_source_id` non-null | VALID — credential scoped to a data source |
| Both non-null | INVALID — a credential cannot serve two targets simultaneously |
| Both null | INVALID — a credential must have exactly one target |

The XOR constraint is expressed in future migration SQL as a `CHECK` constraint:

```text
CHECK (
  (channel_connection_id IS NOT NULL AND data_source_id IS NULL)
  OR
  (channel_connection_id IS NULL AND data_source_id IS NOT NULL)
)
```

No SQL is created in this gate.

### Same-workspace composite FK requirement

The same-workspace composite FK requirement from all prior gates remains in force:

- If `channel_connection_id` is non-null, the FK must include `workspace_id` to
  prevent cross-workspace credential linkage.
- If `data_source_id` is non-null, the FK must include `workspace_id` for the
  same reason.

### Rationale

The XOR model:

- Prevents ambiguous credential scope.
- Enforces a single clear ownership chain per credential row.
- Simplifies query logic (no conditional join needed to determine credential
  target type).
- Makes the `audit_events` credential mutation trail unambiguous.

A flexible model (both nullable, both optionally set) would require additional
application-layer validation that cannot be enforced reliably at the SQL level
without the XOR check.

### Plaintext secret boundary

No plaintext secrets are affected by this decision.

`credential_ref` / `vault_ref` columns remain the only approved credential
storage fields.

### Implementation boundary

No SQL or CHECK constraint is written in this gate.

The XOR model is the recommended candidate for the SQL Migration Draft Authoring
Gate.

---

## 12. Impact on Next Gate

### What this gate resolves

This gate resolves all nine follow-up items from the SQL Migration Authoring
Review Gate.

Items 1–3 (location, repository boundary, runner) remain blockers for
executable migration artifacts until the backend repository is established.

Items 4–6 (rollback convention, allowed paths, parse tooling) are decided
or deferred with explicit blockers that apply to the backend repository context.

Items 7–9 (`users.email` mechanism, audit enforcement, credential scope) are
decided and no longer independently block SQL Migration Execution Planning,
subject to SQL Migration Draft Authoring Gate confirmation.

### What this gate does not authorize

This gate does not authorize SQL Migration Execution Planning Gate.

This gate does not authorize creating executable migration files.

This gate does not authorize introducing a migration runner.

This gate does not authorize database-applied changes.

This gate does not authorize backend implementation.

This gate does not authorize ORM models.

This gate does not authorize seed files.

This gate does not authorize generated clients.

This gate does not authorize production or pilot readiness.

### Recommended next gate

**GO to SQL Migration Authoring Follow-up Review Gate.**

This gate's decisions must be reviewed before any subsequent migration draft
authoring is authorized.

After the follow-up review gate merges, the project may open:

**SQL Migration Draft Authoring Gate** — to create documentation-only migration
contract drafts in `docs/migration_contracts/`, confirm mechanism selections
from items 7–9, and prepare for a future backend repository context.

**SQL Migration Execution Planning Gate** may be opened only after:

1. A backend repository is established.
2. Runner selection is reviewed and approved in that backend repository.
3. Executable migration file paths are approved in that backend repository.
4. Parse/dry-run verification tooling is approved.
5. This follow-up gate and its review gate are merged.
6. SQL Migration Draft Authoring Gate (if opened) is reviewed and merged.

---

## 13. Risks and Gaps

| Risk / gap | Severity | Control |
|---|---|---|
| Premature migration file creation | CRITICAL | No executable migration files authorized; `docs/migration_contracts/` requires follow-up review gate before any file is created |
| Runner introduced too early | CRITICAL | This repository remains runner-free; runner selection deferred to backend repository |
| Unclear repository boundary | HIGH | Decided: migration artifacts belong in future backend repository; `docs/migration_contracts/` approved for documentation-only drafts only |
| Rollback ambiguity | HIGH | Decided: prefer down sections within each migration file; forward-only corrective migrations as fallback |
| Email duplicate risk | HIGH | Decided: `LOWER(email)` functional unique index is recommended candidate; subject to SQL Migration Draft Authoring Gate confirmation |
| Email lookup performance risk | HIGH | Future backend must query with `LOWER(email) = LOWER($1)`; plain `WHERE email = $1` may not use the functional index and may cause sequential scans |
| Audit tampering risk | HIGH | Decided: combined triggers + privilege revocation is recommended candidate; service-layer-only enforcement remains explicitly insufficient |
| Audit immutability risk from role ownership | HIGH | If the application role owns `audit_events`, privilege revocation is ineffective; `audit_events` must be owned by a separate migration/deployment owner role; application role must be a non-owner with restricted privileges |
| Credential cross-workspace leakage | CRITICAL | Decided: XOR constraint model with same-workspace composite FKs; subject to SQL Migration Draft Authoring Gate confirmation |
| Parse/dry-run tooling gap | HIGH | Decided: deferred to backend repository with explicit blocker — no executable migration may be approved without a parse or dry-run step |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized; no backend implementation is approved by this gate |
| Generated client starting too early | HIGH | Generated clients remain unauthorized; no client implementation is approved by this gate |
| Backend home ambiguity | MEDIUM | Backend Home Decision selected marketing-os as preferred candidate; nashir-backend deferred; confirmed here |
| ORM selection creep | MEDIUM | ORM strategy remains deferred; ORM-generated migrations are not approved |
| Seed/reference coupling | MEDIUM | Role/permission seed files remain unauthorized |

---

## 14. GO / NO-GO Decision

**Decision: GO to SQL Migration Authoring Follow-up Review Gate.**

All nine follow-up items from the SQL Migration Authoring Review Gate are
resolved or explicitly deferred with blockers in this gate.

This gate produces a documentation-only decision record.

No migration files, migration runner, SQL execution, backend code, ORM models,
seed files, generated client, package changes, UI changes, or production
readiness claims are introduced.

This authorizes only the SQL Migration Authoring Follow-up Review Gate.

This does not authorize SQL Migration Execution Planning Gate.

This does not authorize executing migrations.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

SQL Migration Execution Planning Gate remains blocked until this follow-up gate
and its review gate are merged and a subsequent gate explicitly authorizes the
next step.

---

## 15. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_authoring_follow_up_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new follow-up gate document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new follow-up gate document shown by `git status --short` |
| BIDI scan: `docs/nashir_sql_migration_authoring_follow_up_gate.md` | `BIDI_CONTROL_CHARS none` |
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
