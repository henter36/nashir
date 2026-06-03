# Nashir SQL Migration Authoring Follow-up Review Gate

| Field | Value |
|---|---|
| Gate type | SQL Migration Authoring Follow-up Review Gate - documentation only |
| Status | Review complete |
| Date | 2026-06-03 |
| Primary reviewed artifact | `docs/nashir_sql_migration_authoring_follow_up_gate.md` |
| Source of follow-up items | `docs/nashir_sql_migration_authoring_review_gate.md` |
| Follow-up items reviewed | 9 of 9 |
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

This is the Nashir SQL Migration Authoring Follow-up Review Gate.

The purpose of this gate is to review the nine follow-up decisions from the
SQL Migration Authoring Follow-up Gate and determine whether they are complete,
internally consistent, and safe enough to proceed to the next planning or
review step.

This review does not introduce executable migrations.

This review does not introduce a migration runner.

This review does not execute or apply SQL to a database.

This review does not introduce backend code.

This review does not introduce API route implementation.

This review does not introduce ORM models.

This review does not introduce seed files.

This review does not introduce generated clients.

This review does not introduce UI, package, or build changes.

This review does not claim production or pilot readiness.

This review does not claim database readiness.

This review does not authorize SQL Migration Execution Planning Gate by itself.

---

## 2. Inputs Reviewed

### Direct inputs

| Input | Review use |
|---|---|
| `docs/nashir_sql_migration_authoring_follow_up_gate.md` | Primary reviewed artifact; source of all nine follow-up decisions |
| `docs/nashir_sql_migration_authoring_review_gate.md` | Source of the nine controlled watch items now under review |
| `docs/nashir_sql_migration_authoring_gate.md` | Migration authoring contract authority |
| `docs/nashir_sql_migration_planning_gate.md` | Controlling migration scope, file strategy, sequence, and safety rules |
| `docs/nashir_sql_migration_planning_review_gate.md` | Migration planning review confirmation |
| `docs/nashir_sql_schema_authoring_gate.md` | SQL schema contract authority |
| `docs/nashir_sql_schema_authoring_review_gate.md` | Schema authoring review authority |
| `docs/nashir_v1_openapi.yaml` | Current OpenAPI contract authority |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/workspace identity authority |
| `docs/nashir_auth_rbac_workspace_identity_review_gate.md` | Auth/RBAC review confirmation |
| `README.md` | Nashir product status and non-production boundary |
| `docs/screen_map.md` | Approved UI journey and mock-only context |

### Contextual inputs

| Input | Review use |
|---|---|
| `docs/nashir_sql_schema_planning_gate.md` | Persistence planning baseline |
| `docs/nashir_sql_schema_planning_review_gate.md` | Persistence planning review baseline |

### Authority check

| Authority | Result | Assessment |
|---|---|---|
| Nashir is the product, UI journey, scope, API contract, SQL schema contract, and data model authority | **PASS** | Review uses Nashir docs and OpenAPI as controlling sources |
| marketing-os is reference-only | **PASS** | No marketing-os code, migration files, runner scripts, entities, backend shape, or runtime assumptions are copied |
| SQL Migration Authoring Review Gate is source of the nine follow-up items | **PASS** | Follow-up gate explicitly cites the authoring review gate as controlling input |

---

## 3. Scope Compliance Review

| Scope item | Result | Assessment |
|---|---|---|
| Documentation/review only | **PASS** | Follow-up gate creates one Markdown file only |
| Nashir-first | **PASS** | Follow-up gate is grounded in Nashir gates and OpenAPI |
| marketing-os reference-only | **PASS** | No extraction, code copy, or runtime-shape import |
| No executable migrations | **PASS** | Follow-up gate confirms no migration files created |
| No migration runner | **PASS** | Follow-up gate confirms runner-free boundary maintained |
| No database-applied changes | **PASS** | No SQL executed or applied to any database |
| No backend/API runtime implementation | **PASS** | No source, route, handler, service, middleware, or runtime files changed |
| No ORM models | **PASS** | No model layer introduced |
| No seed files | **PASS** | Role/permission seeds remain unauthorized |
| No generated client | **PASS** | No generated/runtime client produced |
| No UI/package changes | **PASS** | No UI, `package.json`, lockfile, or build files changed |
| No production/pilot readiness claim | **PASS** | Follow-up gate makes no production or database readiness claim |
| No database readiness claim | **PASS** | Follow-up gate explicitly states database readiness is not claimed |

---

## 4. Follow-up Item Review Matrix

| # | Item | Decision in follow-up gate | Decision clarity | Rationale | Risk | Blocks migration draft files | Blocks SQL Migration Execution Planning | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Migration file location | Not in this repository; `docs/migration_contracts/` for documentation-only drafts; executable paths deferred to backend repository | **CLEAR** | UI/contract repository boundary; README, constraints, and Backend Home Decision collectively confirm no backend artifacts here | Premature file creation in this repository | NO — docs path approved | YES — executable path requires backend repository | **DECIDED** |
| 2 | Repository boundary | Migration artifacts belong in future backend repository | **CLEAR** | Option C (backend in UI repo) was explicitly rejected by Backend Home Decision | Backend coupling in this repository | NO — docs path approved | YES — executable artifacts require backend repository | **DECIDED** |
| 3 | Runner vs runner-free draft files | This repository remains runner-free; runner selection deferred to backend repository | **CLEAR** | No runner, no database connection, no execution tooling present or authorized in this repository | Runner introduced before backend repository | NO — docs path is runner-free by definition | YES — runner must be selected in backend repository | **DECIDED** |
| 4 | Up/down vs forward-only rollback convention | Prefer down sections within each migration file; forward-only corrective migrations as production fallback | **CLEAR** | Self-contained reviewability; broad runner support; dependency-ordered sequence makes reverse rollback well-defined | Data-sensitive rollback may fail on FK/uniqueness constraints; documented as known tradeoff | NO | YES — must be confirmed in execution planning | **DECIDED — CANDIDATE** |
| 5 | Exact allowed migration file paths | `docs/migration_contracts/` for documentation-only; no executable paths in this repository; backend paths deferred to Backend Slice 1 Planning Gate | **CLEAR** | Preserves UI/contract boundary; prevents executable migration drift | Unauthorized path creation | NO | YES — backend executable paths deferred | **DECIDED** |
| 6 | Parse/dry-run verification tooling | Deferred to backend repository context; explicit blocker: no executable migration approved without parse or dry-run step | **CLEAR** | No new packages may be added to this repository; tooling is backend-repository-specific | Executable migrations applied without parse verification | NO | YES — tooling required before execution | **DECIDED — DEFERRED WITH BLOCKER** |
| 7 | `users.email` uniqueness mechanism | Prefer `LOWER(email)` functional unique index; `citext` remains alternative with explicit approval gate; application-layer query requirement documented | **CLEAR** | Portable across all managed PostgreSQL providers without extension configuration; case-folding visible in index definition | Email lookup performance if backend queries with plain `WHERE email = $1` | NO | NO — mechanism decided; subject to SQL Migration Draft Authoring Gate | **DECIDED — CANDIDATE** |
| 8 | Audit append-only enforcement | Prefer combined triggers + privilege revocation; owner-role caveat documented; final implementation deferred | **CLEAR** | Defense-in-depth; triggers survive application-layer changes; privilege revocation effective only when application role is non-owner; caveat documented | Privilege revocation ineffective if application role owns `audit_events` | NO | NO — mechanism decided; subject to SQL Migration Draft Authoring Gate | **DECIDED — CANDIDATE** |
| 9 | Credential target exclusivity/scope model | Prefer XOR constraint — exactly one of `channel_connection_id` or `data_source_id` must be non-null; same-workspace composite FKs preserved | **CLEAR** | Prevents ambiguous credential scope; unambiguous audit trail; CHECK constraint pattern documented | Cross-workspace credential linkage if composite FKs not enforced | NO | NO — model decided; subject to SQL Migration Draft Authoring Gate | **DECIDED — CANDIDATE** |

All nine items have clear decisions or safe explicit deferrals with blockers.

No item is found to be undecided without a controlling blocker.

---

## 5. Migration File Location and Repository Boundary Review

| Check | Result | Assessment |
|---|---|---|
| Migration draft files not allowed in this repository as executable artifacts | **PASS** | Follow-up gate confirms executable migration files belong in the future backend repository |
| `docs/migration_contracts/` approved for documentation-only drafts | **PASS** | Path is non-executable by definition; subject to this review gate's approval |
| Exact executable paths deferred to Backend Slice 1 Planning Gate | **PASS** | No executable path is created or approved in this repository |
| This repository remains runner-free | **PASS** | No runner, no database connection, no execution tooling |
| No migration directories created | **PASS** | No `db/migrations/`, `migrations/`, or any migration directory created |
| No migration files created | **PASS** | No `.sql` migration files created in any location |
| Decision avoids runtime/backend coupling | **PASS** | Repository boundary preserves UI/contract-only nature of this repository |
| Backend Home Decision consistency | **PASS** | Follow-up gate correctly cites Backend Home Decision as the boundary authority |

No migration location or repository boundary blocker was found.

The `docs/migration_contracts/` path is hereby approved for use in a
subsequent SQL Migration Draft Authoring Gate, subject to the conditions
documented in the follow-up gate:

- Files in that path must be documentation-only.
- Files must not be executable by any runner in this repository.
- Files must not be applied to any database.
- Each file must be reviewed before it is created.

---

## 6. Runner and Execution Boundary Review

| Check | Result | Assessment |
|---|---|---|
| No migration runner introduced | **PASS** | Follow-up gate confirms runner-free boundary |
| No package changes | **PASS** | No `package.json`, lockfile, or build configuration changed |
| No database-applied changes | **PASS** | No SQL executed or applied |
| Future execution planning requires separate gate | **PASS** | SQL Migration Execution Planning Gate explicitly blocked pending backend repository |
| Runner selection safely deferred | **PASS** | Runner categories documented for future backend planning; no selection imposed prematurely |
| Execution authorization conditions listed | **PASS** | Five explicit preconditions for SQL Migration Execution Planning Gate are stated |

No runner or execution boundary blocker was found.

---

## 7. Rollback Convention Review

| Check | Result | Assessment |
|---|---|---|
| Chosen candidate is clear | **PASS** | Down sections within each migration file is the preferred convention |
| Rationale is documented | **PASS** | Reviewability, broad runner support, and dependency-ordered sequence rationale are all present |
| Forward-only corrective migrations recognized as fallback | **PASS** | Acceptable for production scenarios where rollback is too risky |
| Known rollback tradeoff documented | **PASS** | Data-sensitive rollback failure on FK/uniqueness constraints is identified as a known tradeoff |
| Rollback ambiguity does not remain a blocker | **PASS** | Convention is selected; per-migration rollback procedures will be documented in SQL Migration Draft Authoring Gate |
| Destructive rollback not authorized | **PASS** | No destructive DDL is authorized by this gate or the follow-up gate |
| No rollback SQL written | **PASS** | Implementation boundary is explicit |

No rollback convention blocker was found.

---

## 8. Allowed Paths and Verification Tooling Review

| Check | Result | Assessment |
|---|---|---|
| Allowed paths in this repository are explicit | **PASS** | `docs/migration_contracts/` approved for documentation-only; `db/migrations/` and `migrations/` explicitly NOT approved |
| Allowed paths in backend repository are deferred with named gate | **PASS** | Deferred to Backend Slice 1 Planning Gate |
| No new tools or packages added | **PASS** | No new dependencies; runner-free boundary maintained |
| Explicit blocker for parse/dry-run tooling | **PASS** | No executable migration may be approved without a parse or dry-run step |
| Acceptable future verification mechanisms listed | **PASS** | `psql --file`, `pg_query`, runner `--dry-run`, and manual review evaluated with assessments |
| Manual review alone is flagged as insufficient | **PASS** | Must be combined with at least a parse step |
| Future SQL verification requirements are clear | **PASS** | Blocker prevents execution without verification even after deferral |

No allowed-path or verification-tooling blocker was found.

---

## 9. users.email Uniqueness Review

| Check | Result | Assessment |
|---|---|---|
| Preferred mechanism is clear | **PASS** | `LOWER(email)` functional unique index is the recommended candidate |
| `citext` remains a valid alternative with explicit approval gate | **PASS** | Requires later gate to approve extension and confirm managed provider support |
| Application-layer query implication documented | **PASS** | Future backend preferred pattern: lowercase the input email in application code, then query `WHERE LOWER(email) = $1`; acceptable but less optimal: `WHERE LOWER(email) = LOWER($1)`; plain `WHERE email = $1` may not use the functional index |
| Sequential scan risk from plain lookup documented | **PASS** | Follow-up gate explicitly identifies this as a future backend planning requirement |
| Backend implementation not authorized | **PASS** | Application-layer implication is documented as a future requirement only |
| No SQL index written | **PASS** | Implementation boundary is explicit |
| Query pattern confirmation deferred to SQL Migration Draft Authoring Gate or Backend Slice planning gate | **PASS** | Appropriate deferral with named gate |

No `users.email` uniqueness blocker was found.

---

## 10. Audit Append-only Enforcement Review

| Check | Result | Assessment |
|---|---|---|
| Preferred enforcement mechanism is clear | **PASS** | Combined triggers + privilege revocation with confirmed owner-role separation |
| Trigger-based prevention documented | **PASS** | Self-contained in migration SQL; fires at database level regardless of application behavior |
| Privilege revocation documented as secondary layer | **PASS** | Effective only when application role is a non-owner; owner-role separation is required |
| PostgreSQL owner-role caveat explicitly documented | **PASS** | Table owners retain all privileges; `REVOKE` has no effect on the owner role |
| `audit_events` must be owned by separate migration/deployment owner role | **PASS** | Explicitly stated; application role must not own `audit_events` |
| Application role must be non-owner with restricted privileges | **PASS** | Explicitly stated |
| Fallback if triggers are restricted | **PASS** | Privilege revocation remains effective alone if owner-role separation is maintained |
| Final implementation deferred | **PASS** | Deferred to a later approved authoring decision |
| No triggers, roles, SQL, or migrations added | **PASS** | Implementation boundary is explicit |
| Service-layer-only enforcement remains insufficient | **PASS** | Explicitly stated; consistent with all prior gates |

No audit enforcement blocker was found.

---

## 11. Credential Target Exclusivity/Scope Review

| Check | Result | Assessment |
|---|---|---|
| XOR constraint model is clear | **PASS** | Exactly one of `channel_connection_id` or `data_source_id` must be non-null |
| XOR constraint pattern documented | **PASS** | CHECK constraint pattern provided as future migration SQL reference |
| Both-null case is INVALID | **PASS** | Credential must have exactly one target |
| Both-non-null case is INVALID | **PASS** | Credential cannot serve two targets simultaneously |
| Same-workspace composite FK requirement preserved | **PASS** | `workspace_id` must be included in FK for both `channel_connection_id` and `data_source_id` paths |
| Composite FK referenced unique-constraint requirement documented | **PASS** | PostgreSQL requires the referenced parent table to have an explicit unique or primary key constraint on the exact referenced column set; `id` being a primary key alone is not sufficient for a composite FK referencing `(workspace_id, id)`; parent tables must include `UNIQUE (workspace_id, id)` |
| No plaintext secrets | **PASS** | `credential_ref` / `vault_ref` boundary preserved |
| No SQL or CHECK constraint written | **PASS** | Implementation boundary is explicit |
| XOR model deferred to SQL Migration Draft Authoring Gate | **PASS** | Appropriate deferral with named gate |

No credential scope blocker was found.

### Composite FK unique-constraint requirement

PostgreSQL requires the referenced table to have an explicit unique or primary
key constraint on the exact referenced column set when a composite foreign key
is defined.

For same-workspace composite FKs on `integration_credentials`, the following
parent tables must include composite unique constraints:

- `channel_connections`: `UNIQUE (workspace_id, id)`
- `data_sources`: `UNIQUE (workspace_id, id)`

A primary key on `id` alone is not sufficient for a composite FK referencing
`(workspace_id, id)`.

This is a required control for the SQL Migration Draft Authoring Gate.

No SQL is added in this review gate.

---

## 12. Impact on Next Gate

### What this review confirms

This review confirms that all nine follow-up items are decided or deferred with
explicit blockers, and that the follow-up gate produced a documentation-only
decision record.

Items 1–3 (location, repository boundary, runner) remain blockers for
executable migration artifacts until a backend repository is established.

Items 4–6 (rollback convention, allowed paths, parse tooling) are decided or
deferred with explicit blockers applicable to the backend repository context.

Items 7–9 (`users.email` mechanism, audit enforcement, credential scope) are
decided as candidates for the SQL Migration Draft Authoring Gate.

### `docs/migration_contracts/` path authorization

This review gate authorizes the `docs/migration_contracts/` path for
documentation-only migration contract draft files in a subsequent SQL Migration
Draft Authoring Gate.

Files in that path must remain:

- Non-executable in this repository.
- Not applied to any database.
- Subject to individual file-level review.

### What this review does not authorize

This review does not authorize SQL Migration Execution Planning Gate.

This review does not authorize creating executable migration files.

This review does not authorize introducing a migration runner.

This review does not authorize database-applied changes.

This review does not authorize backend implementation.

This review does not authorize ORM models.

This review does not authorize seed files.

This review does not authorize generated clients.

This review does not authorize production or pilot readiness.

### Recommended next gate

**GO to SQL Migration Draft Authoring Gate.**

The SQL Migration Draft Authoring Gate may create documentation-only migration
contract draft files in `docs/migration_contracts/`, confirm mechanism
selections from items 7–9, and prepare for future backend repository context.

**SQL Migration Execution Planning Gate** may be opened only after:

1. A backend repository is established.
2. Runner selection is reviewed and approved in that backend repository.
3. Executable migration file paths are approved in that backend repository.
4. Parse/dry-run verification tooling is approved.
5. This follow-up review gate is merged.
6. SQL Migration Draft Authoring Gate (if opened) is reviewed and merged.

---

## 13. Risks and Gaps

### Blocking issues

| Issue | Result |
|---|---|
| Blocking follow-up decision issue | **NONE FOUND** |
| Blocking repository boundary issue | **NONE FOUND** |
| Blocking scope violation | **NONE FOUND** |

### Non-blocking watch items

| Risk / gap | Severity | Control |
|---|---|---|
| Premature migration file creation | CRITICAL | `docs/migration_contracts/` requires review-gate approval and documentation-only condition; executable paths remain unauthorized in this repository |
| Runner introduced too early | CRITICAL | This repository remains runner-free; runner selection deferred to backend repository |
| Unclear repository boundary | HIGH | Decided and confirmed in this review; migration artifacts belong in future backend repository |
| Rollback ambiguity | HIGH | Convention decided; per-migration rollback procedures must be documented in SQL Migration Draft Authoring Gate |
| Email duplicate risk | HIGH | `LOWER(email)` functional unique index is the recommended candidate; confirmed in SQL Migration Draft Authoring Gate |
| Email lookup performance risk | HIGH | Future backend preferred pattern: lowercase email in application code, then query `WHERE LOWER(email) = $1`; acceptable but less optimal: `WHERE LOWER(email) = LOWER($1)`; plain `WHERE email = $1` may cause sequential scans; documented as future backend planning requirement |
| Audit tampering risk | HIGH | Combined triggers + privilege revocation is the recommended candidate; service-layer-only enforcement remains insufficient |
| Audit immutability risk from role ownership | HIGH | `audit_events` must be owned by a separate migration/deployment owner role; if application role owns `audit_events`, privilege revocation is ineffective; triggers become sole enforcement |
| Same-workspace composite FK failure | CRITICAL | Parent tables `channel_connections` and `data_sources` must include `UNIQUE (workspace_id, id)`; primary key on `id` alone is not sufficient for composite FK referencing `(workspace_id, id)`; required control for SQL Migration Draft Authoring Gate |
| Credential cross-workspace leakage | CRITICAL | XOR constraint with same-workspace composite FKs required; subject to SQL Migration Draft Authoring Gate confirmation |
| Parse/dry-run tooling gap | HIGH | Deferred to backend repository with explicit blocker; no executable migration approved without parse or dry-run step |
| Backend starting too early | HIGH | Backend Slice 1 remains unauthorized; no backend implementation is approved |
| Generated client starting too early | HIGH | Generated clients remain unauthorized |
| ORM selection creep | MEDIUM | ORM strategy remains deferred; ORM-generated migrations not approved |
| Seed/reference coupling | MEDIUM | Role/permission seed files remain unauthorized |

---

## 14. PASS / FAIL / WATCH Checklist

| Check | Result |
|---|---|
| Scope compliance | **PASS** |
| Follow-up item completeness (9 of 9) | **PASS** |
| Migration location decision | **PASS** |
| Repository boundary | **PASS** |
| Runner-free boundary | **PASS** |
| Rollback convention | **PASS** |
| Allowed paths | **PASS** |
| Verification tooling | **PASS** |
| `users.email` uniqueness mechanism | **PASS** |
| Audit append-only enforcement | **PASS** |
| Credential scope/exclusivity | **PASS** |
| No implementation changes | **PASS** |
| Role ownership separation for audit enforcement | **WATCH** |
| Backend repository establishment | **WATCH** |
| Runner selection for backend repository | **WATCH** |

---

## 15. GO / NO-GO Decision

**Decision: GO to SQL Migration Draft Authoring Gate.**

The SQL Migration Authoring Follow-up Gate has resolved all nine controlled
watch items.

All nine decisions are clear, internally consistent, and safe.

No blocking issue was found.

This authorizes only the SQL Migration Draft Authoring Gate as the next step.

This does not authorize executing migrations.

This does not authorize adding a migration runner.

This does not authorize database-applied changes.

This does not authorize backend implementation.

This does not authorize ORM models.

This does not authorize generated clients.

This does not authorize production or pilot readiness.

SQL Migration Execution Planning Gate remains blocked until a backend
repository is established and its own planning gate explicitly authorizes
execution.

---

## 16. Final Summary

| Item | Summary |
|---|---|
| Inputs | SQL Migration Authoring Follow-up Gate, SQL Migration Authoring Review Gate, SQL Migration Authoring Gate, SQL Migration Planning Gate and Review Gate, SQL Schema Authoring Gate and Review Gate, SQL Schema Planning Gate and Review Gate, OpenAPI YAML, Auth/RBAC gates, README, and screen map |
| Outputs | One documentation-only SQL Migration Authoring Follow-up Review Gate |
| Remaining gaps | Backend repository establishment, runner selection, executable path approval, parse/dry-run tooling, and role ownership separation planning remain deferred; items 7–9 mechanism candidates require SQL Migration Draft Authoring Gate confirmation |
| Decision required before next phase | SQL Migration Draft Authoring Gate must create documentation-only migration contract draft files in `docs/migration_contracts/`, confirm mechanism selections for `users.email` uniqueness, audit enforcement, and credential XOR model, and prepare for the future backend repository context |
| Recommended next gate | Nashir SQL Migration Draft Authoring Gate |

---

## 17. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | `?? docs/nashir_sql_migration_authoring_follow_up_review_gate.md` before commit |
| `git diff --stat` | No tracked unstaged diff before staging; new review document shown by `git status --short` |
| `git diff -- docs/` | No tracked unstaged docs diff before staging; new review document shown by `git status --short` |
| `wc -l docs/nashir_sql_migration_authoring_follow_up_review_gate.md` | 458 lines |
| BIDI scan: `docs/nashir_sql_migration_authoring_follow_up_gate.md` | `BIDI_CONTROL_CHARS none` |
| BIDI scan: `docs/nashir_sql_migration_authoring_follow_up_review_gate.md` | `BIDI_CONTROL_CHARS none` |
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
