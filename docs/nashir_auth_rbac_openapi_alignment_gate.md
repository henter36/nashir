# Nashir Auth/RBAC/OpenAPI Alignment Gate

| Field | Value |
|---|---|
| Gate type | Auth/RBAC/OpenAPI alignment review |
| Scope | Documentation-only, alignment-only; no contract or implementation authorization |
| Previous planning review gate | `docs/nashir_auth_rbac_openapi_alignment_planning_review_gate.md` |
| Previous decision | Decision: GO to Auth/RBAC/OpenAPI Alignment Gate, review-only. |
| Previous recommended next gate | Auth/RBAC/OpenAPI Alignment Gate |
| OpenAPI authority | `docs/nashir_v1_openapi.yaml` |
| Auth/RBAC/Workspace Identity authority | `docs/nashir_auth_rbac_workspace_identity_gate.md` |
| Backend repository | `henter36/nashir-backend` |
| Alignment status entering this gate | PENDING ALIGNMENT |

---

## 1. Gate Purpose

This gate performs the documentation-only alignment review between the
Auth/RBAC/Workspace Identity authority and the OpenAPI contract before any
backend implementation, generated clients, route implementation, permission
enforcement, or database-backed runtime work.

The review identifies confirmed alignment, watch items, blocking failures, and
deferred topics. It proposes corrections for a later authorized gate but does
not modify either authority.

---

## 2. Inputs Reviewed

| Input | Review use |
|---|---|
| `docs/nashir_auth_rbac_openapi_alignment_planning_review_gate.md` | Authorizes this alignment-only review and defines the comparison method |
| Previous decision | Decision: GO to Auth/RBAC/OpenAPI Alignment Gate, review-only. |
| Previous recommended next gate | Auth/RBAC/OpenAPI Alignment Gate |
| `docs/nashir_v1_openapi.yaml` | OpenAPI authority and contract surface compared |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/Workspace Identity expectations compared |
| `docs/nashir_backend_implementation_planning_review_gate.md` | Confirms alignment-first sequencing and implementation blockers |
| `docs/nashir_backend_runtime_repository_setup_closure_gate.md` | Confirms runtime-skeleton-only state and `/health` boundary |

---

## 3. Current Backend and Contract State

The `henter36/nashir-backend` runtime skeleton exists. Only the `/health`
infrastructure smoke-check route exists.

No product API routes, workspace-scoped routes, route implementation,
permission enforcement implementation, generated clients, SQL migrations,
migration runner, ORM/query layer, auth implementation, deployment config,
production readiness, or pilot readiness exist or are authorized.

`docs/nashir_v1_openapi.yaml` is resolved only as the OpenAPI authority
location. OpenAPI/Auth/RBAC/Workspace Identity alignment enters this gate as
PENDING ALIGNMENT.

---

## 4. Alignment Method

The review compared explicit statements and structures in the two authorities.
It did not infer runtime behavior that is not represented.

Results use these classifications:

| Result | Meaning |
|---|---|
| PASS | OpenAPI clearly reflects the Auth/RBAC/Workspace Identity expectation |
| WATCH | Directionally acceptable, but later wording or implementation guard evidence is required |
| FAIL | OpenAPI contradicts or omits a required rule necessary before backend implementation |
| DEFERRED | The topic is intentionally not authorized and remains blocked |

Evidence reviewed included security schemes, path families, operationIds,
workspace parameters, permission extensions, guard-chain extensions,
membership and role schemas, request/response schemas, error responses,
`ErrorModel`, credential schemas, approval and publishing operations, and audit
metadata.

---

## 5. Auth/RBAC/Workspace Identity Expectations

The authority establishes:

- User is a global identity.
- Workspace is the tenant root for merchant-owned data.
- WorkspaceMember is the workspace authorization binding.
- Only active members may access workspace resources; invited and suspended
  members are denied.
- Seven V1 roles are owner, admin, editor, reviewer, publisher, analyst, and
  viewer.
- Twenty-four V1 permission groups define the approved authorization
  vocabulary.
- Every protected operation requires explicit permission and deny-by-default
  behavior.
- All workspace-scoped operations use `/workspaces/{workspaceId}/...`;
  `workspaceId` is path-derived and rejected in request bodies.
- 401 means unauthenticated, 403 means authenticated but inactive or not
  permitted, and 404 is non-disclosing for non-member or cross-workspace access.
- 409 covers conflicts and invalid state transitions; 422 covers validation.
- No raw credentials or vault references may appear in API responses.
- Self-approval is forbidden at the service layer.
- Reviewer approval and publisher execution are separate authorities.
- Sensitive state transitions require appropriate human action and audit
  evidence.

---

## 6. OpenAPI Contract Surface Reviewed

The OpenAPI contract contains:

- one global HTTP bearer security requirement with `bearerFormat: JWT`
- one explicit unauthenticated exception, `/health`
- 90 operations across `/health` and 61 workspace-scoped path families
- no path family outside `/health` and `/workspaces/{workspaceId}/...`
- WorkspaceMember status and seven-role schemas
- operation-level `x-permission`, guard-chain, audit, human-review, sensitive
  operation, and related extensions
- 32 distinct permission strings, including approved-looking strings and
  strings outside the approved 24-group vocabulary
- overlapping content contract families using different permission vocabulary:
  `/campaign-contents...` and `/content-items.../drafts...`
- explicit 401 and 403 responses on 25 operations each, while the contract has
  89 protected operations
- shared error responses referencing `ErrorModel`
- membership, approval, publishing, analytics, audit, and credential schemas
- an IntegrationCredential response that includes `vaultRef`

---

## 7. Alignment Matrix

| Area | Auth/RBAC/Workspace Identity expectation | OpenAPI representation | Alignment result: PASS / WATCH / FAIL / DEFERRED | Required follow-up |
|---|---|---|---|---|
| Authentication scheme | Protected operations use bearer auth; JWT versus opaque token and provider selection are deferred | Global `bearerAuth` is present, but `bearerFormat: JWT`, an approved provider, and token-carried workspace membership context are asserted | FAIL | Correction planning must restore a provider-neutral placeholder or explicitly authorize and reconcile the selected mechanism |
| Workspace path scoping | All merchant-owned resources use `/workspaces/{workspaceId}/...`; `/health` is infrastructure-only | All non-health path families are workspace-scoped; request-body schemas reviewed do not define `workspaceId`; mutation guard chains commonly include `rejectBodyWorkspaceId` | PASS | Preserve and verify during later contract correction review |
| User identity and WorkspaceMember binding | User is global; workspace access is through WorkspaceMember | WorkspaceMember includes `userId`, `workspaceId`, role, and status; no global merchant-data route was found | PASS | Preserve |
| Membership statuses and lifecycle | `active`, `invited`, and `suspended`; inactive members denied | Matching enum and descriptions; invite, suspend, and activate endpoints are represented | PASS | Preserve; runtime enforcement remains deferred |
| Seven-role model | owner, admin, editor, reviewer, publisher, analyst, viewer | WorkspaceMemberRole contains all seven roles | PASS | Preserve |
| Permission vocabulary | Operations must use the approved 24 permission groups, with final code strings consistently derived from them | OpenAPI contains 32 distinct strings, including `nashir.product.read/write`, `nashir.asset.read/write/link`, `nashir.content.create/update/submit_review`, `nashir.approval.decide`, workflow/model/prompt/creator permissions, and approved-looking plural/manage variants | FAIL | Produce an authoritative permission-code mapping; remove, authorize, or reconcile every divergent permission string |
| Operation-level permission mapping | Every protected operation maps unambiguously to an approved permission | Every protected operation has an `x-permission`, but overlapping content route families use conflicting models and permission strings | FAIL | Correction planning must select authoritative route families and map every operation to one approved permission |
| Public/unauthenticated exceptions | `/health` only | Global bearer security applies; `/health` is the only `security: []` override | PASS | Preserve |
| 401 and 403 behavior | Protected operations explicitly represent unauthenticated and forbidden/inactive-member behavior | Only 25 of 89 protected operations explicitly list 401 and 403; many rely on default error handling | FAIL | Add or explicitly standardize complete protected-operation 401/403 representation in a later authorized contract correction |
| Non-disclosing 404 | Non-member and cross-workspace access return 404; endpoint assignment must prevent enumeration | Some operations use `nonDisclosingMembershipCheck` and explicit 404, while many use `membershipCheck` and omit explicit 404 | FAIL | Define and apply the non-disclosing membership/404 rule consistently per protected operation |
| 409 and 422 behavior | 409 for conflict/state rules; 422 for validation, including body workspaceId rejection | Shared responses and many applicable operations are present; coverage is not consistently explicit across overlapping route families | WATCH | Reconcile after authoritative route-family selection and verify applicable operation coverage |
| `ErrorModel` | Shared error shape: `errorCode`, `message`, optional `details`, `requestId`, `retryable`, `status` | Shared error responses reference a matching `ErrorModel` | PASS | Preserve |
| Tenant isolation | Workspace path, active membership, repository filtering, nested ownership, and non-disclosing behavior prevent leakage | Workspace paths and guard chains are present, but non-disclosing membership assignment and 404 coverage are inconsistent | FAIL | Correct contract-level non-disclosing semantics; repository enforcement remains deferred |
| Self-approval prevention | Approver must not be creator; enforce at service layer; return 409 | Approval descriptions, schemas, error code, human-review/audit metadata, and 409 behavior represent the rule | PASS | Preserve; service-layer enforcement remains DEFERRED |
| Reviewer/publisher separation | Reviewer approves; publisher publishes; publisher does not gain approval authority | ContentDraft approval uses `content.approve`; publishing uses `publishing.manage`; descriptions name separate roles and human actions | PASS | Preserve; runtime role-to-permission enforcement remains DEFERRED |
| Credential response boundary | No raw credential or vault reference may appear in API responses | IntegrationCredential response includes `vaultRef`; descriptions state opaque vault references are returned | FAIL | Remove vault references from response contracts or obtain an explicit authority change in a later authorized correction path |
| Audit/security implications | Sensitive transitions require human action, audit evidence, no auto-approval, and no auto-publish | Audit and human-review extensions are broadly present; approval and publishing descriptions require human action; some extended routes introduce additional security concepts | WATCH | Reconcile extended-route authority and verify audit metadata operation-by-operation |
| Generated client timing | No generated client until aligned and approved OpenAPI is ready | No generated clients exist; contract contains blocking failures | DEFERRED | Keep generated clients BLOCKED through correction and alignment review |
| Backend route readiness | Routes require aligned paths, permissions, security, and errors | Blocking permission, route-family, error, isolation, auth-scheme, and credential gaps remain | DEFERRED | Keep product API routes, workspace-scoped routes, and route implementation BLOCKED |
| Service-layer permission enforcement | Requires authoritative permission mapping, membership behavior, self-approval, and separation rules | Some invariants are documented, but permission vocabulary and non-disclosing behavior are not aligned | DEFERRED | Keep permission enforcement implementation BLOCKED until corrected and reviewed |
| Contract drift control | `henter36/nashir-backend` must not redefine or fork contract authorities | Authority restriction is documented; no downstream synchronization mechanism is authorized | DEFERRED | Define drift verification only after alignment defects are corrected |

---

## 8. Confirmed Alignment Findings

The following are confirmed aligned:

- `/health` is the only unauthenticated operation.
- All other path families are under `/workspaces/{workspaceId}/...`.
- WorkspaceMember represents the User-to-Workspace authorization binding.
- Membership statuses match `active`, `invited`, and `suspended`.
- The seven-role enum matches the Auth/RBAC authority.
- The shared `ErrorModel` shape is consistent.
- ContentDraft approval documents self-approval prevention and 409 behavior.
- Content approval and publishing use separate permission concepts and human
  actions.
- AuditEvent is represented as append-only and server-written.

These PASS findings do not offset the blocking FAIL findings.

---

## 9. Watch Items

- 409 and 422 responses are directionally represented but must be rechecked
  after conflicting route families and permission mappings are corrected.
- Audit and human-review extensions are broadly present, but extended workflow,
  model-routing, prompt-governance, and Creator Studio concepts are not
  established in the approved 24-group Auth/RBAC vocabulary.
- OpenAPI extensions describe guard order, but runtime guard semantics remain
  unimplemented and unauthorized.
- Role names appear in descriptions, but OpenAPI cannot itself enforce the
  role-to-permission assignment.

WATCH items require later explicit review; they are not implementation
authorization.

---

## 10. Failures or Blocking Gaps

The following FAIL items block backend implementation readiness:

1. **Authentication mechanism over-specification:** OpenAPI asserts JWT, an
   approved provider, and token-carried workspace membership context while the
   Auth/RBAC authority defers provider and JWT-versus-opaque-token selection.
2. **Permission vocabulary conflict:** OpenAPI uses permission strings outside
   and inconsistent with the approved 24 permission groups.
3. **Overlapping content contract families:** `/campaign-contents...` and
   `/content-items.../drafts...` represent overlapping content and approval
   behavior with different permission models.
4. **Incomplete authorization error representation:** most protected
   operations do not explicitly list 401 and 403 responses.
5. **Inconsistent non-disclosing behavior:** non-disclosing membership checks
   and explicit 404 responses are not consistently represented.
6. **Credential response contradiction:** OpenAPI returns `vaultRef`, while the
   Auth/RBAC authority prohibits vault references in API responses.

These failures require an authorized correction planning gate before alignment
can be established.

---

## 11. Deferred Items

The following remain DEFERRED and unauthorized:

- auth provider and token mechanism selection
- auth middleware and guard implementation
- role/permission persistence and SQL contracts
- service-layer self-approval enforcement
- repository-layer workspace isolation
- generated clients
- product and workspace-scoped route implementation
- database-backed runtime work
- SQL migrations, migration runner setup, and ORM/query layer
- deployment, CI workflows, production readiness, and pilot readiness

---

## 12. Generated Client Readiness

Generated client readiness is DEFERRED.

The current OpenAPI contract must not be used to generate clients because
permission vocabulary, overlapping route families, authorization errors,
non-disclosing behavior, authentication representation, and credential
response boundaries contain blocking FAIL items.

Generated clients remain BLOCKED until corrections are authorized, completed,
and reviewed through a later alignment decision.

---

## 13. Backend Implementation Readiness

Backend implementation readiness is NO-GO.

Product API routes, workspace-scoped routes, route implementation, permission
enforcement implementation, backend services/repositories relying on workspace
or permissions, and database-backed runtime work remain BLOCKED.

No implementation slice may treat the current OpenAPI contract as an active
downstream synchronization authority.

---

## 14. Explicit Non-Authorization Boundary

This alignment gate does not authorize, and must NOT modify or add, any of the
following:

- `henter36/nashir-backend` or backend implementation
- OpenAPI, Auth/RBAC/Workspace Identity documents, or SQL contracts
- product API routes, workspace-scoped routes, or route implementation
- permission enforcement implementation or auth implementation
- backend services or repositories
- generated clients
- database-backed runtime work, database config, SQL migrations, migration
  runner setup, or ORM/query layer
- environment/secrets config with real values
- deployment config or CI workflows
- production readiness or pilot readiness

This is the consolidated non-authorization boundary for this gate.

---

## 15. Contract Authority and Alignment Boundary

`docs/nashir_v1_openapi.yaml` is resolved only as the OpenAPI authority
location.

Authority location resolution does not mean OpenAPI/Auth/RBAC/Workspace
Identity alignment readiness is resolved.

While the location of the contract authority is resolved, alignment readiness
remains PENDING ALIGNMENT with dependent designs, such as Auth/RBAC/Workspace
Identity.

Consequently, the OpenAPI contract must not be used as an active downstream
synchronization authority for backend implementation, generated clients, route
implementation, permission enforcement, migration/runtime work, or deployment
decisions until alignment is established.

The active downstream synchronization authority restriction remains in effect.

Contract drift risk: downstream repositories must not redefine, fork, or
diverge from `henter36/nashir` contract authorities.

Prerequisite sequencing risk: Defining or finalizing the API Contract/OpenAPI
before establishing the Auth/RBAC/Workspace Identity design violates the
required design sequence. The Auth/RBAC/Workspace Identity design must be
established first, ensuring that the OpenAPI contract accurately reflects
authentication schemes, workspace scoping, and permission expectations.

---

## 16. Risk Assessment

| Risk | Alignment finding | Required control |
|---|---|---|
| Over-permission or denied valid access | Conflicting and unapproved permission strings are present | Correct and review one authoritative operation-to-permission map |
| Cross-workspace disclosure | Non-disclosing membership and 404 representation is inconsistent | Correct contract semantics before route or repository implementation |
| Authentication drift | OpenAPI prematurely specifies JWT/provider behavior | Restore provider-neutral alignment or explicitly authorize the decision |
| Credential metadata exposure | `vaultRef` is returned despite the authority prohibition | Correct response schemas before implementation or client generation |
| Client contract lock-in | Generated clients could encode known failures | Keep generated clients BLOCKED |
| Duplicate behavior implementation | Overlapping content route families could produce divergent services | Select one authoritative contract model before implementation |
| Backend authority fork | Backend could locally resolve unresolved contract gaps | Preserve the active downstream synchronization authority restriction |
| Planning or alignment mistaken for readiness | Documentation progression could be treated as runtime authorization | Preserve the consolidated non-authorization boundary |

---

## 17. GO / NO-GO Decision

Decision: NO-GO until Auth/RBAC/OpenAPI alignment defects are corrected.

Blocking FAIL items prevent OpenAPI/Auth/RBAC/Workspace Identity alignment from
being established. Alignment remains PENDING ALIGNMENT.

The active downstream synchronization authority restriction remains in effect,
and all implementation, generated-client, migration/runtime, deployment,
production, and pilot work remains BLOCKED.

---

## 18. Recommended Next Gate

Recommended Next Gate: Auth/RBAC/OpenAPI Alignment Correction Planning Gate.

The correction planning gate should plan, without modifying authorities, how to
resolve the authentication representation, permission vocabulary, overlapping
route families, authorization error coverage, non-disclosing behavior, and
credential response contradiction.

---

## 19. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n 'GO / NO-GO|Decision:|Recommended Next Gate|alignment-only|NO-GO|PASS|WATCH|FAIL|DEFERRED|Auth/RBAC/OpenAPI Alignment Gate|Auth/RBAC/OpenAPI Alignment Correction Planning Gate|PENDING ALIGNMENT|active downstream synchronization authority|product API routes|workspace-scoped routes|route implementation|permission enforcement|generated clients|SQL migrations|migration runner|ORM/query layer|auth implementation|deployment config|production|pilot' docs/nashir_auth_rbac_openapi_alignment_gate.md
git diff --check
```
