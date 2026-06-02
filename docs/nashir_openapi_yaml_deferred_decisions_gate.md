# Nashir OpenAPI YAML Deferred Decisions Gate

| Field | Value |
|---|---|
| Gate type | OpenAPI YAML deferred decisions gate — documentation/contract only |
| Status | Decisions complete |
| Date | 2026-06-02 |
| Scope | Resolves or explicitly preserves the 10 deferred OpenAPI decisions from PR #78, and makes minimal justified YAML updates for resolved decisions |
| Source of deferred decisions | `docs/nashir_openapi_yaml_authoring_review_gate.md` (PR #78) |
| Backend/API implementation | NO |
| SQL schema / migrations | NO |
| Generated / runtime client | NO |
| Auth/RBAC implementation | NO |
| UI/source code changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Purpose and Scope

This is a documentation/contract-only deferred decisions gate.

**No backend or API implementation is introduced.**

**No SQL schema or database migrations are introduced.**

**No generated TypeScript types, SDK, or runtime client is produced.**

**No auth middleware or guard code is written.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

This gate follows the merged OpenAPI YAML Authoring Review Gate (PR #78), which confirmed that `docs/nashir_v1_openapi.yaml` is structurally complete but identified 10 deferred decisions that must be resolved or explicitly preserved before backend, SQL/schema, or generated-client work can begin.

### Why this gate matters

Backend implementation and SQL/schema planning cannot safely start when:
- Status enums are nullable strings with no approved values
- Approve/reject/withdraw operations have no authored paths
- Filter specifications are undefined per endpoint
- The response envelope pattern is informal

This gate locks the contract decisions so downstream gates have stable inputs.

---

## 2. Inputs Reviewed

### Direct source inputs

| Input | Finding |
|---|---|
| `docs/nashir_openapi_yaml_authoring_review_gate.md` (PR #78) | Source of the 10 deferred decisions; all 15 review criteria PASS |
| `docs/nashir_v1_openapi.yaml` | Current state: 58 paths, 152 schemas, 32 parameters, 86 operations; 4 entity status fields are nullable string placeholders; no approve/reject/withdraw sub-resources; no per-endpoint filter specs |
| `docs/nashir_openapi_yaml_authoring_gate.md` (PR #77) | Lists 10 deferred decisions; Section 8 confirms count |
| `docs/nashir_api_contract_openapi_planning_gate.md` (PR #75) | State transition plan; status candidates from PR #71 |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` (PR #73) | 7 roles; 24 permission groups; `content.approve` for reviewer; `content.manage` for editor |
| `docs/nashir_erd_data_model_gate.md` (PR #71) | Section 10 status candidates: Campaign, ContentDraft, CampaignContentItem, PublishingJob |
| `README.md` | 23 screens; V1 Core journey |

### Historical context

PR #62–78 gate chain. PRs #71 and #73 provide the approved status candidates and permission model used for resolving decisions.

---

## 3. Deferred Decision Inventory

| # | Decision | Current YAML State | Blocks Backend | Blocks SQL | Blocks Generated Client | Resolution |
|---|---|---|---|---|---|---|
| 1 | Campaign lifecycle status enum names | `status` is nullable string; description says deferred | YES | YES | YES (loose type) | **RESOLVED** — Section 5A |
| 2 | ContentDraft lifecycle status enum names | `status` is nullable string; description says deferred | YES | YES | YES (loose type) | **RESOLVED** — Section 5B |
| 3 | CampaignContentItem status enum names | `status` is nullable string; description says deferred | YES | YES | YES (loose type) | **RESOLVED** — Section 5C |
| 4 | PublishingJob lifecycle status finalization | `status` is nullable string with planning candidates noted | YES | YES | YES (loose type) | **RESOLVED** — Section 5D |
| 5 | Reject vs creator withdrawal endpoint split | `/reject` handles both; planning note defers split | YES | NO | YES (permission ambiguity) | **RESOLVED** — Section 5E |
| 6 | ContentDraft submit-review, approve, reject nested-path operations | No sub-resource paths authored | YES | NO | YES (missing operationIds) | **RESOLVED** — Section 5F |
| 7 | URL versioning `/v1/` prefix | No prefix; paths are `/workspaces/...` | YES (route stability) | NO | YES (client base URL) | **DEFERRED** — Section 6A |
| 8 | Auth provider implementation | Bearer placeholder only | YES | NO | NO | **DEFERRED** — Section 6B |
| 9 | Response success envelope shape | Consistent `{ data }` pattern already used; not formally approved | NO | NO | YES (type shape) | **RESOLVED** — Section 5G |
| 10 | Filter/sort parameter specifications per endpoint | Most list endpoints have no per-resource filter params | YES (query design) | NO | YES (missing params) | **RESOLVED** — Section 5H |

---

## 4. Decision Rules Applied

| Rule | Applied |
|---|---|
| Do not invent lifecycle enums unless necessary for V1 | Status enums promoted only from PR #71 Section 10 planning candidates — no new values invented |
| Auth provider implementation must remain deferred | Auth provider deferred to Backend Slice 1 Planning — only bearer placeholder confirmed |
| If success response shape already consistent, approve it | `{ data }` single / `{ data[], meta }` list pattern is already uniform in YAML — formally approved |
| Resolve before generated client: anything affecting request/response schema shape | Status enums, envelope, filter params, sub-resource paths — all resolved |
| Resolve before SQL/schema: anything affecting database columns/state machines | Status enums resolve before SQL schema planning |
| Resolve before Backend Slice 1: anything affecting service authorization | Approve/reject/withdraw permission split resolved |
| Prefer contract stability over premature precision | Filter params are conservative — minimum V1 requirements only |

---

## 5. Resolved Decisions

### 5A — Campaign lifecycle status enum

**Decision:** Adopt the planning candidates from PR #71 Section 10 as approved V1 enum values.

| Status | Meaning |
|---|---|
| `draft` | Campaign created but not yet in review or scheduled |
| `generating` | AI content generation in progress |
| `review` | Campaign content is under human review |
| `ready` | All content approved; ready to schedule |
| `scheduled` | Publishing scheduled; awaiting confirmation |
| `active` | Campaign is actively running |
| `paused` | Campaign temporarily paused |
| `completed` | Campaign has ended |
| `archived` | Soft-deleted; preserved but hidden from active views |

**YAML change:** Add `CampaignStatus` enum schema; update `Campaign.status` to `$ref: CampaignStatus`.

### 5B — ContentDraft lifecycle status enum

**Decision:** Adopt the planning candidates from PR #71 Section 9.

| Status | Meaning |
|---|---|
| `draft` | Draft created; not yet submitted for review |
| `ready_for_review` | Submitted for review; awaiting approval decision |
| `approved` | Approved by a reviewer; not the content creator |
| `rejected` | Rejected by a reviewer or withdrawn by creator |
| `archived` | Soft-deleted; preserved but hidden from active views |

**Note:** `rejected` covers both reviewer rejection and creator withdrawal in the status field. The _operation_ that sets this status differs (see 5E). The status value itself is the same.

**YAML change:** Add `ContentDraftStatus` enum schema; update `ContentDraft.status` to `$ref: ContentDraftStatus`.

### 5C — CampaignContentItem status enum

**Decision:** Adopt the planning candidates from PR #71 Section 9.

| Status | Meaning |
|---|---|
| `draft` | Content item created; no approved draft |
| `ready_for_review` | Has a draft submitted for review |
| `approved` | Has an approved draft |
| `rejected` | Latest draft rejected |
| `archived` | Soft-deleted |

**YAML change:** Add `CampaignContentItemStatus` enum schema; update `CampaignContentItem.status` to `$ref: CampaignContentItemStatus`.

### 5D — PublishingJob lifecycle status

**Decision:** Adopt the planning candidates from PR #75/77 as approved V1 enum values. `simulated` remains explicitly distinct from any future real publishing status.

| Status | Meaning |
|---|---|
| `draft` | Job created; not yet scheduled |
| `scheduled` | Publishing date/time assigned |
| `queued` | Job submitted to the execution queue |
| `simulated` | Simulation run completed; no real external publish occurred |
| `failed` | Execution failed |
| `cancelled` | Job cancelled before execution |

**YAML change:** Add `PublishingJobStatus` enum schema; update `PublishingJob.status` to `$ref: PublishingJobStatus`.

### 5E — Reject vs creator withdrawal endpoint split

**Decision:** Split into two separate sub-resource operations:

| Operation | Endpoint | Permission | Who | Audit event type |
|---|---|---|---|---|
| Reject draft | `POST .../reject` | `nashir.content.approve` | reviewer, admin, owner | `content_draft.rejected_by_reviewer` |
| Withdraw draft | `POST .../withdraw` | `nashir.content.manage` | content creator (own draft only) | `content_draft.withdrawn_by_creator` |

Rationale: self-approval is forbidden, but self-withdrawal is allowed (PR #73/74 decisions). Mixing both under `/reject` with dual permissions creates audit ambiguity. Separate endpoints enforce distinct authorization and emit distinct AuditEvent action types.

**YAML change:** The existing `/reject` path is authored in the `approveCampaignContent`/`rejectCampaignContent` operations under `/campaign-contents` (older pre-planning paths). For the new ContentDraft paths, add separate `/reject` and `/withdraw` sub-resources.

### 5F — ContentDraft submit-review, approve, reject, and withdraw operations

**Decision:** Author all four sub-resource operations nested under ContentDraft.

| Operation | Endpoint | OperationId | Permission | Notes |
|---|---|---|---|---|
| Submit for review | `POST .../submit-review` | `submitContentDraftReview` | `nashir.content.manage` | Transitions draft to `ready_for_review` |
| Approve | `POST .../approve` | `approveContentDraft` | `nashir.content.approve` | Self-approval forbidden at service layer (409) |
| Reject | `POST .../reject` | `rejectContentDraft` | `nashir.content.approve` | Reviewer/admin/owner only |
| Withdraw | `POST .../withdraw` | `withdrawContentDraft` | `nashir.content.manage` | Creator own-draft withdrawal only |

**YAML change:** Add four new path entries under `/workspaces/{workspaceId}/content-items/{contentItemId}/drafts/{contentDraftId}/...`.

### 5G — Response success envelope shape

**Decision:** Formally approve the existing consistent pattern:

- Single resource response: `{ data: ResourceObject }` (required `data` field)
- List response: `{ data: ResourceObject[], meta: PaginationMeta }` (required `data` and `meta` fields)
- Mutation response (204): no body
- Error response: `ErrorModel` via reusable response components

This pattern is already uniform across all 152 schemas in the current YAML. No YAML change required. This decision formally approves and locks the pattern.

**YAML change:** None. Pattern already consistent.

### 5H — Filter/sort parameter specifications

**Decision:** Add conservative V1-minimum filters to list endpoints where V1 screens require them. Advanced filtering deferred to Backend Slice 1 Planning.

| Endpoint | Filter(s) Added | Rationale |
|---|---|---|
| `GET /workspaces/{workspaceId}/campaigns` | `StatusQuery`, `UpdatedAfterQuery` | Campaigns screen needs status filter |
| `GET /workspaces/{workspaceId}/campaigns/{campaignId}/content-items` | `StatusQuery` | Content Studio filters by item status |
| `GET /workspaces/{workspaceId}/content-items` (flat) | `StatusQuery` | Studio workspace view |
| `GET /workspaces/{workspaceId}/content-drafts` (flat) | `StatusQuery` | Pending-review dashboard |
| `GET /workspaces/{workspaceId}/analytics-snapshots` | `SubjectTypeQuery` | Analytics screen needs subject type filter |

All others (members, products, data sources, channel connections, assets, publishing jobs, publishing status, audit events) retain only the existing generic `LimitQuery`, `CursorQuery`, `StatusQuery` (where already present) parameters. Advanced compound filtering is Post-V1.

**YAML change:** Add `StatusQuery` and `UpdatedAfterQuery` to campaigns list; `StatusQuery` to content items (campaign-nested and flat) and content drafts (flat); add new `SubjectTypeQuery` parameter and apply to analytics snapshots list.

---

## 6. Deferred Decisions

### 6A — URL versioning `/v1/` prefix

**Decision: Deferred to Backend Slice 1 Planning Gate.**

**Rationale:** URL versioning changes every path in the contract and affects client base URLs. Introducing it before the first backend route is implemented creates zero migration cost. Adding it after clients are adopted creates breaking changes. The correct moment to decide is at Backend Slice 1 Planning, when the server router is being wired. The current `/workspaces/...` path structure is not broken — versioning is a deployment concern, not a contract semantic concern.

**Blocking status:** Does not block SQL/schema. Does not block Backend Slice 1 Planning Gate (the planning gate will make this decision). Does block final generated client if introduced after client adoption.

**Note to Backend Slice 1 Planning:** The planning gate must decide between `/v1/workspaces/...`, a version header, or no version. The recommendation from this gate is URL versioning (`/v1/`) for clarity — but the decision is explicitly delegated.

### 6B — Auth provider implementation

**Decision: Deferred to Backend Slice 1 Planning Gate.**

**Rationale:** The `bearerAuth` scheme placeholder is correct for the contract. The specific auth mechanism (JWT issuer, token validation, session management) is an implementation decision, not a contract decision. The contract correctly declares `bearerAuth` without prescribing the mechanism.

**Blocking status:** Does not block SQL/schema. Does not block generated client. Does block Backend Slice 1 route wiring.

---

## 7. YAML Changes Made

| Change | Section | Type | Justification |
|---|---|---|---|
| Add `CampaignStatus` enum schema | 5A | Schema addition | Replaces nullable string placeholder |
| Update `Campaign.status` to `$ref: CampaignStatus` | 5A | Schema update | Contract consistency |
| Add `ContentDraftStatus` enum schema | 5B | Schema addition | Replaces nullable string placeholder |
| Update `ContentDraft.status` to `$ref: ContentDraftStatus` | 5B | Schema update | Contract consistency |
| Add `CampaignContentItemStatus` enum schema | 5C | Schema addition | Replaces nullable string placeholder |
| Update `CampaignContentItem.status` to `$ref: CampaignContentItemStatus` | 5C | Schema update | Contract consistency |
| Add `PublishingJobStatus` enum schema | 5D | Schema addition | Replaces nullable string placeholder |
| Update `PublishingJob.status` to `$ref: PublishingJobStatus` | 5D | Schema update | Contract consistency |
| Add `SubjectTypeQuery` parameter | 5H | Parameter addition | Analytics filter |
| Add `StatusQuery` and `UpdatedAfterQuery` to campaigns list | 5H | Path update | V1 Campaigns screen requires status filter |
| Add `StatusQuery` to campaign-nested content items list | 5H | Path update | Content Studio requires item status filter |
| Add `StatusQuery` to flat content items list | 5H | Path update | Studio workspace view |
| Add `StatusQuery` to flat content drafts list | 5H | Path update | Pending-review dashboard |
| Add `SubjectTypeQuery` to analytics snapshots list | 5H | Path update | Analytics screen requires subject type filter |
| Add `POST .../submit-review` operation | 5F | Path addition | V1 Content Studio requires this operation |
| Add `POST .../approve` operation | 5F | Path addition | V1 Content Studio requires this operation |
| Add `POST .../reject` operation | 5E/5F | Path addition | Reviewer rejection; distinct from withdrawal |
| Add `POST .../withdraw` operation | 5E/5F | Path addition | Creator self-withdrawal; distinct from rejection |

---

## 8. Decisions Still Deferred

| Decision | Target Gate |
|---|---|
| URL versioning (`/v1/` prefix) | Backend Slice 1 Planning Gate |
| Auth provider implementation (JWT/session/token mechanism) | Backend Slice 1 Planning Gate |
| Advanced filter/sort parameters (compound filters, full-text search, sort fields) | Post-V1 |

---

## 9. Blocking Matrix

| Dependency | Blocked by URL versioning? | Blocked by Auth provider? | Blocked by status enums? | Blocked by approve/reject/withdraw paths? | Blocked by envelope shape? | Blocked by filter specs? |
|---|---|---|---|---|---|---|
| Backend Slice 1 Planning Gate | **YES — decision required** | **NO — deferred is OK** | CLEARED | CLEARED | CLEARED | CLEARED |
| SQL/Schema Planning Gate | NO | NO | CLEARED | NO | NO | NO |
| Generated-client planning | **YES — blocks base URL** | NO | CLEARED | CLEARED | CLEARED | CLEARED |

**Remaining blockers before Backend Slice 1 Planning:**
- URL versioning decision (must be resolved in that gate)

**Remaining blockers before generated-client planning:**
- URL versioning decision (affects client base URL configuration)

**No remaining blockers for SQL/Schema Planning Gate** — all status enums are now approved.

---

## 10. Risks and Gaps

| Risk | Severity | Control |
|---|---|---|
| Backend starts before URL versioning is decided | HIGH | URL versioning explicitly delegated to Backend Slice 1 Planning; contract notes the decision |
| SQL schema locks premature lifecycle states | CLEARED | All 4 status enums now approved |
| Generated client produced with unstable envelope | CLEARED | Envelope pattern formally approved |
| reject/withdraw audit semantics remain ambiguous | CLEARED | Separate `/reject` and `/withdraw` operations with distinct permissions |
| ContentApproval and ContentDraft responsibilities overlap | MEDIUM | ContentApproval records the decision; ContentDraft status reflects the outcome; boundary is documented in approve/reject/withdraw operation descriptions |
| Auth provider assumptions leak into contract | LOW — CLEARED | Bearer placeholder confirmed; mechanism deferred correctly |
| Advanced filter requirements unknown until backend | LOW | Conservative V1 minimum filters approved; advanced filtering explicitly Post-V1 |

---

## 11. GO / NO-GO Decision

| Dimension | Decision |
|---|---|
| Status enums resolved (Campaign, ContentDraft, CampaignContentItem, PublishingJob) | **RESOLVED** |
| Approve/reject/withdraw/submit-review operations authored | **RESOLVED** |
| Reject vs creator withdrawal split confirmed | **RESOLVED** |
| Response envelope pattern approved | **RESOLVED** |
| Conservative filter params added to V1 list endpoints | **RESOLVED** |
| URL versioning correctly delegated | **DEFERRED to Backend Slice 1 Planning** |
| Auth provider correctly deferred | **DEFERRED to Backend Slice 1 Planning** |
| No blocking issues for SQL/Schema Planning | **CONFIRMED** |
| YAML parses cleanly after changes | **CONFIRMED** |
| No implementation added | **CONFIRMED** |
| **GO: Deferred decisions gate complete** | **GO** |
| **CONDITIONAL GO: OpenAPI YAML Deferred Decisions Review Gate** | After this gate merges |
| **CONDITIONAL GO: SQL/Schema Planning Gate** | After this gate merges (status enums now approved) |
| **CONDITIONAL GO: Backend Slice 1 Planning Gate** | After URL versioning decision; after deferred decisions review merges |
| Generated-client planning | **DEFERRED until URL versioning decided** |
| Backend implementation | **NO-GO** |
| SQL schema or migrations | **NO-GO** |
| Generated TypeScript types or SDK | **NO-GO** |
| marketing-os extraction | **NO-GO** |
| Production/pilot readiness | **NO-GO** |

---

## 12. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| YAML parse | **OK** — 62 paths, 156 schemas, 33 parameters, 90 operations |
| OperationId uniqueness | **PASS** — all new operationIds unique and lowerCamelCase |
| No stale error model | **PASS** — 0 occurrences of `userAction` or `correlationId` |
| No PascalCase operationIds | **PASS** |
| `git status --short` | Working tree clean after commit; changes limited to OpenAPI contract and gate documentation |
| `git diff --stat` | Changes limited to `docs/nashir_v1_openapi.yaml` and `docs/nashir_openapi_yaml_deferred_decisions_gate.md` |
| Forbidden files check | **PASS** — no `src/`, `package.json`, SQL, migrations, generated client, or marketing-os files modified |
| BIDI scan (`docs/nashir_v1_openapi.yaml`) | `BIDI_CONTROL_CHARS: none` |
| BIDI scan (`docs/nashir_openapi_yaml_deferred_decisions_gate.md`) | `BIDI_CONTROL_CHARS: none` |
