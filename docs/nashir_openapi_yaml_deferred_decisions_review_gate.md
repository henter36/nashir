# Nashir OpenAPI YAML Deferred Decisions Review Gate

| Field | Value |
|---|---|
| Gate type | OpenAPI YAML deferred decisions review gate — documentation/contract review only |
| Status | Review complete |
| Date | 2026-06-02 |
| Scope | Reviews PR #79 / `docs/nashir_openapi_yaml_deferred_decisions_gate.md` and `docs/nashir_v1_openapi.yaml` deferred-decision resolutions for sufficiency before the next planning gate |
| Prerequisite | `docs/nashir_openapi_yaml_deferred_decisions_gate.md` — merged (PR #79) |
| UI/source code changes | NO |
| API/backend/package/build changes | NO |
| SQL/schema/migration changes | NO |
| Generated/runtime client | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Purpose

This is a documentation-only review gate for the merged OpenAPI YAML Deferred Decisions Gate (PR #79).

**No backend or API implementation is introduced.**

**No SQL schema or database migrations are introduced.**

**No generated TypeScript types, SDK, or runtime client is produced.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

The purpose of this review is to assess whether the deferred OpenAPI decision resolutions in PR #79 are correct, complete, and consistent with `docs/nashir_v1_openapi.yaml`, and to authorize the next planning gate.

---

## 2. Inputs Reviewed

### Direct source inputs

| Input | Finding |
|---|---|
| `docs/nashir_openapi_yaml_deferred_decisions_gate.md` (PR #79) | Primary review input — 12 sections; 8 of 10 decisions resolved; 2 deferred to Backend Slice 1 Planning |
| `docs/nashir_v1_openapi.yaml` (post PR #79) | 62 paths, 157 schemas, 37 parameters, 90 operations; 4 new status enums; resource-specific filter params; ContentDraft sub-resource lifecycle ops; additionalProperties:false on approval request schemas; rejection metadata on ContentApproval entity |
| `docs/nashir_openapi_yaml_authoring_gate.md` (PR #77) | Authoring gate: 10 deferred decisions identified |
| `docs/nashir_openapi_yaml_authoring_review_gate.md` (PR #78) | Authoring review: all 15 criteria PASS; deferred decisions confirmed as blockers for SQL and backend |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` (PR #73) | Permission groups; 7 roles; workspace scoping rules |
| `docs/nashir_api_contract_openapi_planning_gate.md` (PR #75) | State transition plan; status candidates from PR #71 |
| `docs/nashir_erd_data_model_gate.md` (PR #71) | Section 9/10 approved status candidates for Campaign, ContentDraft, CampaignContentItem, PublishingJob |

### Historical context gates

PR #62–78 gate chain. PRs #71 and #73 provide the status candidates and permission model used to resolve deferred decisions.

---

## 3. Scope Compliance Review

| Criterion | Status | Evidence |
|---|---|---|
| Documentation/contract-only | **PASS** | PR #79 diff: only `docs/nashir_v1_openapi.yaml` and `docs/nashir_openapi_yaml_deferred_decisions_gate.md` modified |
| Nashir-first | **PASS** | All decisions derive from Nashir V1 journey; no marketing-os runtime dependency |
| marketing-os remains reference-only | **PASS** | No marketing-os entities or patterns imported |
| No backend/API runtime implementation | **PASS** | No `src/` changes |
| No SQL/schema/migrations | **PASS** | Confirmed |
| No generated client | **PASS** | No TypeScript types, SDK, or generated artifacts |
| No UI changes | **PASS** | Confirmed |
| No package changes | **PASS** | `package.json` and `package-lock.json` unchanged |
| No production/pilot readiness claim | **PASS** | Gate header and NO-GO boundaries confirmed |

---

## 4. Deferred Decision Review

| # | Decision | Resolution | YAML Consistent | Blocks Backend Slice 1 Start | Blocks SQL | Blocks Generated Client |
|---|---|---|---|---|---|---|
| 1 | Campaign lifecycle status enum names | **RESOLVED** — 9-value `CampaignStatus` enum (PR #71 candidates) | **PASS** — `Campaign.status` uses `$ref: CampaignStatus` | CLEARED | CLEARED | CLEARED |
| 2 | ContentDraft lifecycle status enum names | **RESOLVED** — 5-value `ContentDraftStatus` enum | **PASS** — `ContentDraft.status` uses `$ref: ContentDraftStatus` | CLEARED | CLEARED | CLEARED |
| 3 | CampaignContentItem status enum names | **RESOLVED** — 5-value `CampaignContentItemStatus` enum | **PASS** — `CampaignContentItem.status` uses `$ref: CampaignContentItemStatus` | CLEARED | CLEARED | CLEARED |
| 4 | PublishingJob lifecycle status finalization | **RESOLVED** — 6-value `PublishingJobStatus` enum; `simulated` explicitly distinct | **PASS** — `PublishingJob.status` uses `$ref: PublishingJobStatus` | CLEARED | CLEARED | CLEARED |
| 5 | Reject vs creator withdrawal endpoint split | **RESOLVED** — `/reject` (`nashir.content.approve`) and `/withdraw` (`nashir.content.manage`) are separate operations with distinct audit event types | **PASS** | CLEARED | NO | CLEARED |
| 6 | ContentDraft submit-review, approve, reject nested-path operations | **RESOLVED** — all four authored: `submitContentDraftReview`, `approveContentDraft`, `rejectContentDraft`, `withdrawContentDraft` | **PASS** | CLEARED | NO | CLEARED |
| 7 | URL versioning `/v1/` prefix | **DEFERRED** — explicitly to Backend Slice 1 Planning Gate exit | **N/A — no change** | Does not block start; blocks exit | NO | YES — blocks finalization |
| 8 | Auth provider implementation | **DEFERRED** — to Backend Slice 1 Planning Gate route wiring | **PASS — bearer placeholder correct** | Blocks route wiring only | NO | NO |
| 9 | Response success envelope shape | **RESOLVED** — `{ data }` / `{ data[], meta }` pattern formally approved; already consistent in YAML | **PASS** | CLEARED | NO | CLEARED |
| 10 | Filter/sort parameter specifications | **RESOLVED** — resource-specific enum-bound query params added to V1 list endpoints | **PASS** | CLEARED | NO | CLEARED |

**8 of 10 decisions resolved. 2 correctly deferred.**

---

## 5. YAML Contract Consistency Review

| Criterion | Status | Evidence |
|---|---|---|
| OpenAPI 3.1 valid | **PASS** | `openapi: 3.1.0` on line 1 |
| YAML parses successfully | **PASS** | `js-yaml.load()` — OK; 62 paths, 157 schemas, 37 parameters, 90 operations |
| OperationIds are lowerCamelCase and unique | **PASS** | 90 unique operationIds; 0 PascalCase; 0 duplicates |
| ErrorModel `{ errorCode, message, details?, requestId, retryable, status }` | **PASS** | ErrorModel required: `[errorCode, message, requestId, retryable, status]`; details optional |
| No stale `{ code, message, userAction?, correlationId? }` | **PASS** | 0 occurrences of `userAction` or `correlationId` |
| No GET request bodies | **PASS** | 0 GET operations have `requestBody` |
| No workspaceId/workspace_id in request bodies | **PASS** | `rejectBodyWorkspaceId` in guard chain on all mutation operations that accept a request body; state-transition POSTs with no body correctly omit it |
| No raw credentials in responses | **PASS** | IntegrationCredential: vault reference only; no secret fields |
| x-permission and x-guard-chain consistent | **PASS** | All protected operations carry consistent guard chain |

---

## 6. Status Enum and Filter Review

| Criterion | Status | Evidence |
|---|---|---|
| `CampaignStatus` enum correct | **PASS** | `[draft, generating, review, ready, scheduled, active, paused, completed, archived]` — matches PR #71 Section 10 |
| `ContentDraftStatus` enum correct | **PASS** | `[draft, ready_for_review, approved, rejected, archived]` — matches PR #71 Section 9 |
| `CampaignContentItemStatus` enum correct | **PASS** | `[draft, ready_for_review, approved, rejected, archived]` — matches PR #71 Section 9 |
| `PublishingJobStatus` enum correct | **PASS** | `[draft, scheduled, queued, simulated, failed, cancelled]`; `simulated` explicitly distinct from real publishing |
| Status query params are resource-specific and enum-bound | **PASS** | `CampaignStatusQuery`, `ContentDraftStatusQuery`, `CampaignContentItemStatusQuery`, `PublishingJobStatusQuery` all reference their respective enum schemas |
| Generic `StatusQuery` not used where resource-specific enums exist | **PASS** | Programmatic check: generic `StatusQuery` remains only on pre-existing routes (`listProducts`, `listAssets`, `listCampaignContents`, `listCampaignContentPreviewArtifacts`) — these are pre-authoring-gate paths and were not changed by PR #79; all new routes use resource-specific params |
| `listContentItemDrafts` and `listWorkspaceContentDrafts` have consistent filtering | **PASS** | Both use `ContentDraftStatusQuery` |

---

## 7. ContentDraft Lifecycle Review

| Criterion | Status | Evidence |
|---|---|---|
| submit-review / approve / reject / withdraw routes exist | **PASS** | All four paths present under `/content-items/{contentItemId}/drafts/{contentDraftId}/...` |
| `approveContentDraft` request body does not accept `decision` | **PASS** | Uses `ContentApprovalApproveRequest` with `additionalProperties: false`; properties: `[note]` only |
| `rejectContentDraft` request body does not accept `decision` | **PASS** | Uses `ContentApprovalRejectRequest` with `additionalProperties: false`; properties: `[note, rejectionReason, requiredChanges]` |
| Decision is server-derived from endpoint path | **PASS** | Operation descriptions state: "The decision (approved/rejected) is server-derived from this endpoint path; clients must not supply a decision field" |
| `ContentApprovalDecisionRequest` is absent | **PASS** | Not present in YAML (programmatic check confirmed) |
| `ContentApproval` response round-trips rejection metadata | **PASS** | `ContentApproval.rejectionReason` (nullable string) and `ContentApproval.requiredChanges` (nullable string array) present; described as present only on rejected decisions |
| Lifecycle POSTs include idempotency headers | **PASS** | `IdempotencyKeyHeader` on all four: submitContentDraftReview, approveContentDraft, rejectContentDraft, withdrawContentDraft |
| Lifecycle POSTs include optimistic concurrency headers | **PASS** | `IfMatchHeader` and `ResourceVersionHeader` on all four |
| Self-withdrawal (`/withdraw`) semantically distinct from reviewer rejection (`/reject`) | **PASS** | `/reject` requires `nashir.content.approve` (reviewer/admin/owner); `/withdraw` requires `nashir.content.manage` (creator own draft); audit event action types are distinct |
| Self-approval prevention documented | **PASS** | `approveContentDraft` description states self-approval is forbidden at the service layer (409) |

---

## 8. URL Versioning Review

| Criterion | Status | Evidence |
|---|---|---|
| URL versioning not silently introduced | **PASS** | No `/v1/` path prefix in YAML; paths remain `/workspaces/{workspaceId}/...` |
| Gate clearly states versioning does not block Backend Slice 1 start | **PASS** | Section 6A: "URL versioning does not block starting Backend Slice 1 Planning" |
| Gate clearly states versioning is required for Backend Slice 1 exit | **PASS** | Section 6A: "it is required for Backend Slice 1 Planning Gate exit before backend routes or generated clients are finalized" |
| Gate clearly states versioning blocks generated client finalization | **PASS** | Blocking matrix: generated-client column shows YES for URL versioning |

---

## 9. Response Envelope Review

| Criterion | Status | Evidence |
|---|---|---|
| Success response pattern formally approved | **PASS** | Section 5G approved: `{ data }` for single resource; `{ data[], meta: PaginationMeta }` for lists |
| Pattern is consistent across YAML | **PASS** | All single-resource response schemas use `{ data }` wrapper; all list responses use `{ data[], meta }` |
| No mixed envelope pattern | **PASS** | No direct-resource (unwrapped) responses alongside `{ data }` responses on V1 endpoints |

---

## 10. Auth Provider Review

| Criterion | Status | Evidence |
|---|---|---|
| Auth provider implementation deferred to Backend Slice 1 Planning | **PASS** | Section 6B: "deferred to Backend Slice 1 Planning Gate route wiring" |
| OpenAPI includes only contract-facing auth placeholder | **PASS** | `bearerAuth` security scheme; `bearerFormat: JWT` placeholder; mechanism TBD |
| Bearer placeholder applies to all protected operations | **PASS** | Global `security: [bearerAuth: []]` in YAML; `security: []` only on `/health` |

---

## 11. Security / Governance Review

| Criterion | Status | Evidence |
|---|---|---|
| Deny by default | **PASS** | `permissionGuard` on all protected operations; no open ops except `/health` |
| Least privilege | **PASS** | Minimum permission per operation; resource-specific approval permissions |
| Credential secrecy | **PASS** | `IntegrationCredential` vault ref only; no raw secret fields; no credential in any response |
| IntegrationCredential separation | **PASS** | Separate route family; admin/owner only; write-only (POST + DELETE) |
| AuditEvent append-only concept | **PASS** | No PUT/PATCH/DELETE on AuditEvent; schema: "Append-only … cannot be modified or deleted" |
| AnalyticsSnapshot lineage/sourceSummary | **PASS** | `sourceSummary` is in `AnalyticsSnapshot.required`; `AnalyticsSnapshotStatus` enum correct |
| No generated client before review approval | **PASS** | Not yet produced |
| No production compliance claim | **PASS** | Confirmed throughout gate chain |

---

## 12. Unicode / BIDI Review

| File | Result |
|---|---|
| `docs/nashir_v1_openapi.yaml` | `BIDI_CONTROL_CHARS: none` |
| `docs/nashir_openapi_yaml_deferred_decisions_gate.md` | `BIDI_CONTROL_CHARS: none` |
| `docs/nashir_openapi_yaml_deferred_decisions_review_gate.md` | `BIDI_CONTROL_CHARS: none` |

Scan checked U+202A–U+202E and U+2066–U+2069 on all three files. All confirmed clean.

---

## 13. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| YAML parse | **OK** — 62 paths, 157 schemas, 37 parameters, 90 operations |
| OperationId uniqueness | **PASS** — 90 unique; 0 duplicates; 0 PascalCase |
| Stale error model check | **PASS** — 0 occurrences of `userAction` or `correlationId` |
| approve/reject do not accept `decision` | **PASS** — `ContentApprovalApproveRequest.properties = [note]`; `ContentApprovalRejectRequest.properties = [note, rejectionReason, requiredChanges]`; `additionalProperties: false` on both |
| `ContentApprovalDecisionRequest` absent | **PASS** — programmatic check confirmed absent |
| Generic `StatusQuery` not on enum-bound new routes | **PASS** — only present on pre-existing `listProducts`, `listAssets`, `listCampaignContents`, `listCampaignContentPreviewArtifacts` |
| Lifecycle POSTs have idempotency headers | **PASS** — confirmed on all four lifecycle operations |
| `git status --short` | Working tree clean after commit; changes limited to documentation |
| `git diff --stat` | Diff limited to `docs/nashir_openapi_yaml_deferred_decisions_review_gate.md` (new file) |
| No src/ changes | **CONFIRMED** |
| No SQL/migrations | **CONFIRMED** |
| No generated client | **CONFIRMED** |
| No package changes | **CONFIRMED** |
| No UI changes | **CONFIRMED** |

---

## 14. PASS / FAIL / WATCH Checklist

| Criterion | Result |
|---|---|
| Scope compliance (contract-only; no src/SQL/generated/UI/package) | **PASS** |
| YAML parse (62 paths, 157 schemas, 37 params, 90 ops) | **PASS** |
| Deferred decision closure (8 resolved; 2 correctly deferred) | **PASS** |
| Status enum consistency (4 enums typed; `$ref` in entity schemas) | **PASS** |
| Status filter consistency (resource-specific enum-bound params) | **PASS** |
| ContentDraft lifecycle correctness (all 4 ops; no decision in body; idempotency; rejection metadata round-trips) | **PASS** |
| URL versioning semantics (deferred with correct blocking statement) | **PASS** |
| Success response shape (approved; consistent `{ data }` / `{ data[], meta }`) | **PASS** |
| Auth provider deferral (bearer placeholder; mechanism deferred) | **PASS** |
| ErrorModel consistency (aligned to existing contract; 0 stale refs) | **PASS** |
| OperationId uniqueness and convention (90 unique lowerCamelCase) | **PASS** |
| Credential secrecy (vault ref only; additionalProperties:false on approve/reject) | **PASS** |
| Audit/analytics governance (AuditEvent append-only; sourceSummary required) | **PASS** |
| Unicode scan (all 3 files BIDI_CONTROL_CHARS: none) | **PASS** |
| No implementation changes | **PASS** |

**All 15 criteria: PASS.**

---

## 15. Risks and Gaps

### Blocking issues

**None identified.**

### Non-blocking notes

| ID | Note | Gate |
|---|---|---|
| W-DD-R01 | Pre-existing routes (`listProducts`, `listAssets`, `listCampaignContents`, `listCampaignContentPreviewArtifacts`) still use generic `StatusQuery` — these have typed status enums (`ProductStatus`, `AssetStatus`, `CampaignContentStatus`) and could benefit from resource-specific query params in a future cleanup gate | Post-V1 cleanup or SQL/Schema Planning Gate follow-up |
| W-DD-R02 | URL versioning decision must be made at Backend Slice 1 Planning Gate exit; no backend routes or generated client can be finalized before it is resolved | Backend Slice 1 Planning Gate |
| W-DD-R03 | Auth provider mechanism (JWT issuer, token validation) is a Backend Slice 1 implementation decision; bearer placeholder is correct and does not need to be changed before that gate | Backend Slice 1 Planning Gate |

### Deferred risks

| Risk | Control |
|---|---|
| URL versioning changed after client adoption causes breaking changes | URL versioning decision is required before Backend Slice 1 exit; no generated client before that decision |
| Backend starts without auth provider selected | Auth provider is a Backend Slice 1 Planning concern; bearer placeholder is contract-stable |

### Risks if backend starts before this review merges

| Risk | Severity |
|---|---|
| Backend implements status state machines before enums are reviewed | MEDIUM — status enums are now approved and reviewed; risk is mitigated |
| Backend implements approve/reject without path-specific decision semantics | MEDIUM — decision is server-derived and documented; risk is mitigated by this review |
| Backend implements rejection without round-trip metadata | LOW — `rejectionReason` and `requiredChanges` now in `ContentApproval` entity |

### Risks if generated client starts before this review merges

| Risk | Severity |
|---|---|
| Client generated against unstable status enums | LOW — enums are now resolved and locked |
| Client base URL finalized before URL versioning decision | HIGH — URL versioning must be decided before client base URL is set |

---

## 16. GO / NO-GO Decision

| Dimension | Decision |
|---|---|
| 8 of 10 deferred decisions resolved correctly | **ACCEPT** |
| 2 correctly deferred to Backend Slice 1 Planning Gate | **ACCEPT** |
| Status enums approved and typed in YAML | **ACCEPT** |
| ContentDraft lifecycle operations authored correctly | **ACCEPT** |
| Approve/reject request bodies closed (`additionalProperties: false`; no `decision` field) | **ACCEPT** |
| Rejection metadata round-trips in ContentApproval response | **ACCEPT** |
| Idempotency and optimistic concurrency on lifecycle POSTs | **ACCEPT** |
| URL versioning correctly deferred with blocking semantics clarified | **ACCEPT** |
| Response envelope pattern formally approved | **ACCEPT** |
| Resource-specific status filters applied | **ACCEPT** |
| No blocking corrections required | **CONFIRMED** |
| **GO: OpenAPI YAML deferred decisions review gate complete** | **GO** |
| **CONDITIONAL GO: SQL/Schema Planning Gate** | After this review gate merges — status enums and entity shapes are now contract-stable |
| **CONDITIONAL GO: Backend Slice 1 Planning Gate** | After this review gate merges — URL versioning decision required at planning gate exit |
| Generated-client planning | **DEFERRED until URL versioning decided at Backend Slice 1 Planning Gate exit** |
| Backend implementation | **NO-GO** |
| SQL schema or migrations | **NO-GO** |
| Generated TypeScript types or SDK | **NO-GO** |
| marketing-os extraction | **NO-GO** |
| Production/pilot readiness | **NO-GO** |

**This review authorizes only the next approved planning or documentation step. It does not authorize backend implementation, SQL schema, migrations, generated clients, or production readiness.**

---

## 17. Final Summary

### Inputs

| Input | Gate |
|---|---|
| 23-screen V1 scope | PR #64–66 |
| Productization roadmap | PR #67–68 |
| Nashir-first backend/API strategy | PR #69–70 |
| 17 V1 Core entities + IntegrationCredential; status candidates | PR #71–72 |
| Identity model, workspace scoping, 7 roles, 24 permission groups | PR #73–74 |
| Route families, entity-to-API matrix, error behavior | PR #75–76 |
| OpenAPI YAML contract (58 paths, 152 schemas pre-gate) | PR #77 |
| OpenAPI YAML authoring review (all corrections closed) | PR #78 |
| OpenAPI YAML deferred decisions gate (8 resolved, 2 deferred) | PR #79 |

### Outputs

| Output | Detail |
|---|---|
| Deferred decision review | All 10 decisions reviewed; 8 PASS as resolved; 2 PASS as correctly deferred |
| Contract state confirmed | 62 paths, 157 schemas, 37 params, 90 ops; all 15 checklist criteria PASS |
| Next gates authorized | SQL/Schema Planning Gate and Backend Slice 1 Planning Gate both CONDITIONAL GO |

### Remaining gaps

| Gap | Gate |
|---|---|
| URL versioning (`/v1/` prefix) | Backend Slice 1 Planning Gate exit |
| Auth provider mechanism | Backend Slice 1 Planning Gate route wiring |
| Pre-existing generic StatusQuery cleanup | Post-V1 or cleanup gate |

### Decision before next phase

The **SQL/Schema Planning Gate** and **Backend Slice 1 Planning Gate** are both authorized after this review merges. The Backend Slice 1 Planning Gate must resolve URL versioning before its exit criteria are met.

### Recommended next gates

1. **Nashir SQL/Schema Planning Gate** — status enums and entity shapes are now contract-stable; SQL schema can be planned
2. **Nashir Backend Slice 1 Planning Gate** — must decide URL versioning and select auth provider at planning exit
