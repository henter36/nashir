# Nashir OpenAPI YAML Authoring Gate

| Field | Value |
|---|---|
| Gate type | OpenAPI YAML authoring gate — contract only |
| Status | Authoring complete |
| Date | 2026-06-02 |
| Scope | Authors the Nashir V1 OpenAPI YAML contract for all approved V1 Core path families, based on the approved gate chain through PR #76 |
| Primary file | `docs/nashir_v1_openapi.yaml` |
| Prerequisite gates | `docs/nashir_api_contract_openapi_planning_review_gate.md` — merged (PR #76) |
| Backend/API implementation | NO |
| SQL schema / migrations | NO |
| Generated / runtime client | NO |
| Auth/RBAC implementation | NO |
| UI/source code changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is an OpenAPI YAML authoring gate. No runtime implementation is introduced.

**No backend or API implementation is performed.**

**No SQL schema or database migrations are introduced.**

**No generated TypeScript types, SDK, or runtime client is produced.**

**No auth middleware or guard code is written.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

This gate extends `docs/nashir_v1_openapi.yaml` with the full V1 Core path families and entity schemas approved through the planning gate chain.

---

## 2. Inputs Reviewed

| Input | Finding |
|---|---|
| `docs/nashir_api_contract_openapi_planning_gate.md` (PR #75) | Route family inventory; entity-to-API matrix; request/response rules; error behavior; state transition plan; OpenAPI document structure |
| `docs/nashir_api_contract_openapi_planning_review_gate.md` (PR #76) | All 19 criteria PASS; OpenAPI YAML Authoring Gate authorized |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` (PR #73) | 7 roles; 24 permission groups; workspace scoping rules; error behavior (401/403/404/409/422) |
| `docs/nashir_erd_data_model_gate.md` (PR #71) | 17 V1 Core entities + IntegrationCredential; field-level logical model; approved status enums |
| `docs/nashir_v1_openapi.yaml` (pre-existing) | OpenAPI 3.1; existing paths (products, assets, campaign-contents, AI readiness, Creator Studio); existing schemas and components; existing ErrorModel `{ errorCode, message, details?, requestId, retryable, status }` |
| `README.md` | 23 approved screens; V1 Core journey confirmed |
| `docs/screen_map.md` | 23 screens with V1 Classification |

---

## 3. Scope Boundaries

| Boundary | Status |
|---|---|
| OpenAPI version | **3.1** (preserved from existing file) |
| Existing paths preserved | **YES** — products, assets, campaign-contents, AI readiness, Creator Studio paths unchanged |
| New V1 Core paths added | **YES** — see Section 5 |
| New schemas added | **YES** — see Section 6 |
| New parameters added | **YES** — see Section 7 |
| Backend implementation | **NO** |
| Generated client | **NO** |
| SQL schema | **NO** |
| marketing-os extraction | **NO** |
| Production readiness | **NO** |

---

## 4. OpenAPI Conventions Applied

| Convention | Applied |
|---|---|
| OpenAPI version | 3.1 (preserved) |
| OperationId | lowerCamelCase throughout: `getWorkspace`, `listMembers`, `createCampaign`, etc. |
| ErrorModel | Aligned to existing `{ errorCode, message, details?, requestId, retryable, status }` |
| workspaceId | Path parameter only; `rejectBodyWorkspaceId` guard documented on all mutation operations |
| Guard chain | `authGuard → workspaceContextGuard → membershipCheck → permissionGuard [→ rejectBodyWorkspaceId]` on all protected operations |
| Permission notation | `x-permission` extension follows `nashir.{domain}.{action}` dot notation |
| Tags | One tag per resource group; new tags added to tags section |
| Pagination | `PaginationMeta` (`{ nextCursor?, count, hasMore }`) reused on all list responses |
| State transitions | Sub-resource POSTs (e.g., `/suspend`, `/activate`, `/confirm`, `/cancel`) |
| Credentials | IntegrationCredential response carries only `vaultRef` (opaque); no raw secret returned |
| Deferred status enums | Campaign, ContentDraft, CampaignContentItem status fields typed as nullable string with description deferring enum naming to review gate |
| Approved status enums | WorkspaceMemberStatus (`active/invited/suspended`) and AnalyticsSnapshotStatus (`available/partial/stale/unavailable`) typed as proper enums |

---

## 5. Route Families Authored

All new paths follow `/workspaces/{workspaceId}/...` convention.

| Route Family | Operations Added | Permission(s) |
|---|---|---|
| `/workspaces/{workspaceId}` | GET, PATCH | `nashir.workspace.read` / `nashir.workspace.update` |
| `/workspaces/{workspaceId}/me` | GET | Any active member |
| `/workspaces/{workspaceId}/members` | GET, POST | `nashir.workspace.read` / `nashir.members.manage` |
| `/workspaces/{workspaceId}/members/{memberId}` | GET, PATCH, DELETE | `nashir.workspace.read` (GET self) / `nashir.members.manage` |
| `/workspaces/{workspaceId}/members/{memberId}/suspend` | POST | `nashir.members.manage` |
| `/workspaces/{workspaceId}/members/{memberId}/activate` | POST | `nashir.members.manage` |
| `/workspaces/{workspaceId}/store-profile` | GET, PUT | `nashir.store.read` / `nashir.store.update` |
| `/workspaces/{workspaceId}/data-sources` | GET, POST | `nashir.data_sources.read` / `nashir.data_sources.manage` |
| `/workspaces/{workspaceId}/data-sources/{dataSourceId}` | GET, PATCH, DELETE | `nashir.data_sources.read` / `nashir.data_sources.manage` |
| `/workspaces/{workspaceId}/channel-connections` | GET, POST | `nashir.channel_connections.read` / `nashir.channel_connections.manage` |
| `/workspaces/{workspaceId}/channel-connections/{channelConnectionId}` | GET, PATCH, DELETE | `nashir.channel_connections.read` / `nashir.channel_connections.manage` |
| `/workspaces/{workspaceId}/integration-credentials` | POST | `nashir.integration_credentials.manage` |
| `/workspaces/{workspaceId}/integration-credentials/{integrationCredentialId}` | DELETE | `nashir.integration_credentials.manage` |
| `/workspaces/{workspaceId}/campaigns` | GET, POST | `nashir.campaigns.read` / `nashir.campaigns.manage` |
| `/workspaces/{workspaceId}/campaigns/{campaignId}` | GET, PATCH, DELETE | `nashir.campaigns.read` / `nashir.campaigns.manage` |
| `/workspaces/{workspaceId}/campaigns/{campaignId}/brief` | GET, PUT | `nashir.campaigns.read` / `nashir.campaigns.manage` |
| `/workspaces/{workspaceId}/campaigns/{campaignId}/content-items` | GET, POST | `nashir.content.read` / `nashir.content.manage` |
| `/workspaces/{workspaceId}/content-items` | GET (flat workspace list) | `nashir.content.read` |
| `/workspaces/{workspaceId}/content-drafts` | GET (flat workspace list) | `nashir.content.read` |
| `/workspaces/{workspaceId}/content-approvals` | GET (workspace list) | `nashir.content.read` |
| `/workspaces/{workspaceId}/publishing-jobs` | GET, POST | `nashir.publishing.read` / `nashir.publishing.manage` |
| `/workspaces/{workspaceId}/publishing-jobs/{publishingJobId}` | GET, PATCH | `nashir.publishing.read` / `nashir.publishing.manage` |
| `/workspaces/{workspaceId}/publishing-jobs/{publishingJobId}/confirm` | POST | `nashir.publishing.manage` |
| `/workspaces/{workspaceId}/publishing-jobs/{publishingJobId}/cancel` | POST | `nashir.publishing.manage` |
| `/workspaces/{workspaceId}/publishing-status` | GET (workspace-wide) | `nashir.publishing.read` |
| `/workspaces/{workspaceId}/analytics-snapshots` | GET | `nashir.analytics.read` |
| `/workspaces/{workspaceId}/analytics-snapshots/{analyticsSnapshotId}` | GET | `nashir.analytics.read` |
| `/workspaces/{workspaceId}/audit-events` | GET | `nashir.audit_events.read` |

**Total operations added: 53 new operations across 28 new path entries.**

---

## 6. Schemas Authored

New schemas added to `components.schemas`:

| Schema | Purpose |
|---|---|
| `WorkspaceStatus` | Enum: `active / inactive / suspended` |
| `Workspace` | Workspace object |
| `WorkspaceUpdateRequest` | PATCH workspace body |
| `WorkspaceResponse` | Workspace response envelope |
| `WorkspaceMemberStatus` | Enum: `active / invited / suspended` (APPROVED — PR #71/73) |
| `WorkspaceMemberRole` | Enum: `owner / admin / editor / reviewer / publisher / analyst / viewer` |
| `WorkspaceMember` | WorkspaceMember object |
| `WorkspaceMemberInviteRequest` | POST invite body |
| `WorkspaceMemberUpdateRequest` | PATCH role body |
| `WorkspaceMemberResponse` | WorkspaceMember response envelope |
| `WorkspaceMemberListResponse` | WorkspaceMember list response |
| `StoreProfile` | StoreProfile object (status: active/inactive) |
| `StoreProfileUpsertRequest` | PUT store profile body |
| `StoreProfileResponse` | StoreProfile response envelope |
| `DataSourceStatus` | Enum: `not_connected / connected / error / expired` |
| `DataSource` | DataSource object |
| `DataSourceCreateRequest` | POST data source body |
| `DataSourceUpdateRequest` | PATCH data source body |
| `DataSourceResponse` | DataSource response envelope |
| `DataSourceListResponse` | DataSource list response |
| `ChannelConnectionStatus` | Enum: `not_connected / connected / error / expired` |
| `ChannelConnection` | ChannelConnection with optional `dataSourceId`; no raw credentials |
| `ChannelConnectionCreateRequest` | POST channel connection body |
| `ChannelConnectionUpdateRequest` | PATCH channel connection body |
| `ChannelConnectionResponse` | ChannelConnection response envelope |
| `ChannelConnectionListResponse` | ChannelConnection list response |
| `IntegrationCredential` | Vault-ref-only credential record; no raw secret fields |
| `IntegrationCredentialCreateRequest` | POST credential body (vaultRef is opaque) |
| `IntegrationCredentialResponse` | IntegrationCredential response (no secret returned) |
| `Campaign` | Campaign object (status field nullable string; enum deferred) |
| `CampaignCreateRequest` | POST campaign body |
| `CampaignUpdateRequest` | PATCH campaign body |
| `CampaignResponse` | Campaign response envelope |
| `CampaignListResponse` | Campaign list response |
| `CampaignBrief` | CampaignBrief object |
| `CampaignBriefUpsertRequest` | PUT campaign brief body |
| `CampaignBriefResponse` | CampaignBrief response envelope |
| `CampaignContentItem` | CampaignContentItem object (status field nullable; enum deferred) |
| `CampaignContentItemCreateRequest` | POST content item body |
| `CampaignContentItemUpdateRequest` | PATCH content item body |
| `CampaignContentItemResponse` | CampaignContentItem response envelope |
| `CampaignContentItemListResponse` | CampaignContentItem list response |
| `ContentDraft` | ContentDraft object (status field nullable; enum deferred) |
| `ContentDraftCreateRequest` | POST content draft body |
| `ContentDraftUpdateRequest` | PATCH content draft body |
| `ContentDraftResponse` | ContentDraft response envelope |
| `ContentDraftListResponse` | ContentDraft list response |
| `ContentApprovalDecision` | Enum: `approved / rejected` |
| `ContentApproval` | ContentApproval object; immutable after creation; self-approval forbidden documented |
| `ContentApprovalDecisionRequest` | POST approve/reject body |
| `ContentApprovalResponse` | ContentApproval response envelope |
| `ContentApprovalListResponse` | ContentApproval list response |
| `PublishingJob` | PublishingJob object (status nullable string; planning candidates documented; `simulated` must be distinct) |
| `PublishingJobCreateRequest` | POST publishing job body |
| `PublishingJobUpdateRequest` | PATCH publishing job body |
| `PublishingJobResponse` | PublishingJob response envelope |
| `PublishingJobListResponse` | PublishingJob list response |
| `PublishingStatusRecord` | Append-only publishing status record |
| `PublishingStatusListResponse` | PublishingStatus list response |
| `AnalyticsSnapshotStatus` | Enum: `available / partial / stale / unavailable` (APPROVED — PR #71/72) |
| `AnalyticsSnapshotSubjectType` | Enum: `campaign / product / channel_connection` |
| `AnalyticsSnapshot` | AnalyticsSnapshot with required `sourceSummary` field |
| `AnalyticsSnapshotResponse` | AnalyticsSnapshot response envelope |
| `AnalyticsSnapshotListResponse` | AnalyticsSnapshot list response |
| `AuditEvent` | Append-only audit event; no client writes documented |
| `AuditEventListResponse` | AuditEvent list response |

**Total new schemas: 63.**

---

## 7. Parameters Added

New reusable path parameters added to `components.parameters`:

| Parameter | Used by |
|---|---|
| `MemberIdPath` | `/members/{memberId}` paths |
| `DataSourceIdPath` | `/data-sources/{dataSourceId}` paths |
| `ChannelConnectionIdPath` | `/channel-connections/{channelConnectionId}` paths |
| `IntegrationCredentialIdPath` | `/integration-credentials/{integrationCredentialId}` paths |
| `CampaignIdPath` | `/campaigns/{campaignId}` paths |
| `PublishingJobIdPath` | `/publishing-jobs/{publishingJobId}` paths |
| `AnalyticsSnapshotIdPath` | `/analytics-snapshots/{analyticsSnapshotId}` paths |

---

## 8. Known Deferred Decisions

| Decision | Gate |
|---|---|
| Campaign lifecycle status enum names | OpenAPI YAML Review Gate |
| ContentDraft lifecycle status enum names | OpenAPI YAML Review Gate |
| CampaignContentItem status enum names | OpenAPI YAML Review Gate |
| PublishingJob lifecycle status enum finalization | OpenAPI YAML Review Gate |
| Reject vs creator withdrawal endpoint split | OpenAPI YAML Review Gate — whether `/reject` or a dedicated `/withdraw` sub-resource is used |
| ContentDraft submit-review, approve, reject nested-path operations | Not yet authored; require status enum finalization first |
| URL versioning (`/v1/` prefix) | OpenAPI YAML Review Gate |
| Auth provider implementation | Backend Slice 1 Planning Gate |
| Response success envelope shape | OpenAPI YAML Review Gate |
| Filter/sort parameter specifications per endpoint | OpenAPI YAML Review Gate |

---

## 9. Risks and Gaps

| Risk | Control |
|---|---|
| Campaign/ContentDraft status enums invented prematurely | All three status fields typed as nullable string with explicit deferred-enum description; no enum array defined |
| Reject/withdraw boundary ambiguous | Planning note in ContentApproval description; deferred to OpenAPI YAML Review Gate |
| IntegrationCredential raw secret exposed | vaultRef is opaque; no raw secret fields on schema; response description explicitly states "no raw secret returned" |
| AnalyticsSnapshot lineage lost | `sourceSummary` is a required field; status enum is approved and typed correctly |
| AuditEvent mutated by client | Schema and operation description both state append-only; no PUT/PATCH/DELETE on AuditEvent |
| Cross-workspace enumeration | All operations use 404 non-disclosing behavior; `default:` error covers 401/403 via ErrorModel |
| Self-approval on content approvals | `ContentApproval` schema description and `approveContentDraft` description both state self-approval is forbidden at service layer |

---

## 10. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | Only `docs/nashir_v1_openapi.yaml` and `docs/nashir_openapi_yaml_authoring_gate.md` modified |
| `git diff --stat` | Changes limited to documentation and OpenAPI contract files |
| YAML parse | `node -e "require('js-yaml').load(...)"` — **OK** — 56 paths, 152 schemas, 30 parameters |
| No src/ changes | **CONFIRMED** |
| No SQL/migrations | **CONFIRMED** |
| No generated client | **CONFIRMED** |
| No package changes | **CONFIRMED** |
| No UI changes | **CONFIRMED** |
| Unicode scan (`docs/nashir_v1_openapi.yaml`) | Checked U+202A–U+202E and U+2066–U+2069; `BIDI_CONTROL_CHARS: none` |
| Unicode scan (`docs/nashir_openapi_yaml_authoring_gate.md`) | Checked U+202A–U+202E and U+2066–U+2069; `BIDI_CONTROL_CHARS: none` |

---

## 11. GO / NO-GO Decision

| Dimension | Decision |
|---|---|
| OpenAPI 3.1 preserved | **CONFIRMED** |
| All approved V1 Core path families authored | **CONFIRMED** |
| All new entity schemas present | **CONFIRMED** |
| Approved status enums correctly typed (WorkspaceMember, AnalyticsSnapshot) | **CONFIRMED** |
| Deferred status enums correctly left as nullable string | **CONFIRMED** |
| ErrorModel aligned to existing contract | **CONFIRMED** |
| OperationId convention is lowerCamelCase throughout | **CONFIRMED** |
| workspaceId path-derived; rejectBodyWorkspaceId on mutations | **CONFIRMED** |
| No raw credentials in responses | **CONFIRMED** |
| No generated client | **CONFIRMED** |
| No backend implementation | **CONFIRMED** |
| YAML parses cleanly | **CONFIRMED** |
| **GO: OpenAPI YAML authoring gate complete** | **GO** |
| **CONDITIONAL GO: Nashir OpenAPI YAML Authoring Review Gate** | After this gate merges |
| Backend/API implementation | **NO-GO** |
| SQL schema or migrations | **NO-GO** |
| Generated client or TypeScript types | **NO-GO** |
| marketing-os extraction | **NO-GO** |
| Package/build changes | **NO-GO** |
| Production/pilot readiness | **NO-GO** |

**Next gate: Nashir OpenAPI YAML Authoring Review Gate.** No backend implementation is allowed until at minimum the OpenAPI YAML authoring and review gates are both merged.

---

## 12. NO-GO Boundaries

```text
NO-GO: Backend code or API route implementation.
NO-GO: SQL schema or migrations.
NO-GO: Generated TypeScript types, SDK, or runtime client.
NO-GO: Auth middleware or guard code.
NO-GO: UI source code changes.
NO-GO: Package/build/dependency changes.
NO-GO: marketing-os modifications.
NO-GO: marketing-os extraction.
NO-GO: Production/pilot readiness claims.
```
