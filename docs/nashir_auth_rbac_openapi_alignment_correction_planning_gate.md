# Nashir Auth/RBAC/OpenAPI Alignment Correction Planning Gate

| Field | Value |
|---|---|
| Gate type | Auth/RBAC/OpenAPI alignment correction planning |
| Scope | Documentation-only, planning-only; no correction or implementation authorization |
| Previous alignment gate | `docs/nashir_auth_rbac_openapi_alignment_gate.md` |
| Previous decision | Decision: NO-GO until Auth/RBAC/OpenAPI alignment defects are corrected. |
| Previous recommended next gate | Auth/RBAC/OpenAPI Alignment Correction Planning Gate |
| OpenAPI authority | `docs/nashir_v1_openapi.yaml` |
| Auth/RBAC/Workspace Identity authority | `docs/nashir_auth_rbac_workspace_identity_gate.md` |
| Alignment readiness | PENDING ALIGNMENT |

---

## 1. Gate Purpose

This planning gate defines how to correct the six blocking FAIL findings from
the Auth/RBAC/OpenAPI Alignment Gate without applying corrections.

It identifies the source and impact of each mismatch, the required correction,
the allowed future correction artifact, the correction type, the risk if not
corrected, and the verification required after correction.

This gate preserves the previous NO-GO basis. It does not downgrade, replace,
or add any FAIL finding.

---

## 2. Inputs Reviewed

| Input | Planning use |
|---|---|
| `docs/nashir_auth_rbac_openapi_alignment_gate.md` | Source of the six blocking FAIL findings, previous NO-GO decision, and correction-planning recommendation |
| Previous decision | Decision: NO-GO until Auth/RBAC/OpenAPI alignment defects are corrected. |
| Previous recommended next gate | Auth/RBAC/OpenAPI Alignment Correction Planning Gate |
| `docs/nashir_v1_openapi.yaml` | OpenAPI authority and target of possible later authorized OpenAPI corrections |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/Workspace Identity authority against which corrections must align |

---

## 3. Previous NO-GO Decision Confirmation

The previous decision is confirmed:

Decision: NO-GO until Auth/RBAC/OpenAPI alignment defects are corrected.

The six blocking FAIL findings prevent alignment from being established.
Alignment readiness remains PENDING ALIGNMENT, and the active downstream
synchronization authority restriction remains in effect.

This correction planning gate does not clear the NO-GO decision or authorize
any correction.

---

## 4. Extracted Blocking FAIL Findings

The following six blocking FAIL findings are extracted exactly from
`docs/nashir_auth_rbac_openapi_alignment_gate.md`:

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

No new FAIL finding is introduced. No FAIL finding is downgraded to WATCH.

---

## 5. Correction Planning Scope

This gate may:

- define a correction approach for each of the six FAIL findings
- identify the mismatch source and impacted contract or document area
- identify the allowed future correction artifact
- distinguish OpenAPI correction, Auth/RBAC document correction, wording
  clarification, and review confirmation
- define correction sequencing and post-correction verification
- preserve confirmed PASS areas while planning corrections
- identify decisions that require later review before correction execution

Future correction artifacts may include an explicitly authorized OpenAPI
correction, an explicitly authorized Auth/RBAC authority amendment when a
deliberate authority change is selected, wording clarification, and a later
alignment correction review. This planning gate authorizes none of them.

---

## 6. Correction Plan Matrix

| FAIL ID / area | Current mismatch | Required correction | Target artifact for later correction | Correction type: OpenAPI / Auth-RBAC doc / wording clarification / review confirmation | Risk if not corrected | Follow-up verification |
|---|---|---|---|---|---|---|
| FAIL-01 / Authentication mechanism over-specification | OpenAPI asserts JWT, an approved provider, and token-carried workspace membership context while the Auth/RBAC authority defers provider and JWT-versus-opaque-token selection. | Select the authority-preserving correction path: remove or neutralize premature JWT/provider/membership-context assertions in OpenAPI. If product governance instead selects those assertions, authorize and review an Auth/RBAC authority amendment before OpenAPI correction. | Primary: `docs/nashir_v1_openapi.yaml`; alternate only after explicit authority-change approval: `docs/nashir_auth_rbac_workspace_identity_gate.md` | OpenAPI; alternate Auth-RBAC doc; review confirmation | Premature auth design lock-in and backend implementation against an unauthorized token model | Verify `securitySchemes`, global security, and descriptions against the reviewed auth-mechanism decision; confirm protected operations remain bearer-authenticated and `/health` remains the only public exception |
| FAIL-02 / Permission vocabulary conflict | OpenAPI uses permission strings outside and inconsistent with the approved 24 permission groups. | Produce an authoritative mapping from every protected operation to the approved permission groups; correct, remove, or separately authorize every divergent permission string. Preserve deny-by-default and role implications. The approved 24 permission groups remain authoritative unless an explicit amendment is separately authorized; do not invent new permissions. | First: `docs/nashir_auth_rbac_workspace_identity_gate.md` to establish the authoritative operation-to-permission mapping design first; then or in a coordinated correction: `docs/nashir_v1_openapi.yaml` to reflect that authority decision | Auth-RBAC doc; OpenAPI; review confirmation | Over-permission, denied valid access, inconsistent guards, and backend-local permission invention | Inventory all `x-permission` and `x-secondary-permission` values; compare each to the reviewed authoritative mapping; confirm every protected operation has exactly the required permission path |
| FAIL-03 / Overlapping content contract families | `/campaign-contents...` and `/content-items.../drafts...` represent overlapping content and approval behavior with different permission models. | Select one authoritative content, draft, approval, rejection, and withdrawal contract model; remove or clearly segregate the non-authoritative overlap and map the retained operations to the authoritative permissions and entities. | First: `docs/nashir_auth_rbac_workspace_identity_gate.md` to establish the authoritative content/draft/approval/rejection/withdrawal permission and route-family model first; then or in a coordinated correction: `docs/nashir_v1_openapi.yaml` plus later alignment correction review record | Auth-RBAC doc; OpenAPI; wording clarification; review confirmation | Duplicate or divergent backend services, conflicting client methods, inconsistent approval enforcement, and contract drift | Compare retained route families, operationIds, schemas, lifecycle actions, permission mappings, and error responses; confirm no overlapping behavior remains ambiguous |
| FAIL-04 / Incomplete authorization error representation | Most protected operations do not explicitly list 401 and 403 responses. | Define and apply one explicit contract rule for 401 and 403 on every protected operation, using the shared `ErrorModel` and preserving the Auth/RBAC meanings for unauthenticated, inactive-member, and permission-denied cases. | `docs/nashir_v1_openapi.yaml` | OpenAPI; wording clarification; review confirmation | Clients and backend routes may implement inconsistent or undiscoverable authorization failures | Count protected operations and verify applicable explicit 401/403 responses or an explicitly reviewed reusable mechanism; confirm all responses reference `ErrorModel` |
| FAIL-05 / Inconsistent non-disclosing behavior | Non-disclosing membership checks and explicit 404 responses are not consistently represented. | Define an operation-level non-disclosing policy for non-member, cross-workspace, nested-resource, and missing-resource cases; apply consistent guard metadata, descriptions, and explicit 404 responses without weakening tenant isolation. | First: `docs/nashir_auth_rbac_workspace_identity_gate.md` to establish the operation-level non-disclosing policy first; then or in a coordinated correction: `docs/nashir_v1_openapi.yaml` plus later alignment correction review record | Auth-RBAC doc; OpenAPI; wording clarification; review confirmation | Workspace enumeration, cross-tenant disclosure, and inconsistent repository/service behavior | Inventory every protected workspace-scoped operation; verify required non-disclosing guard behavior and 404 response coverage; review nested-resource and list semantics explicitly |
| FAIL-06 / Credential response contradiction | OpenAPI returns `vaultRef`, while the Auth/RBAC authority prohibits vault references in API responses. | Remove `vaultRef` and equivalent vault-reference identifiers from response schemas and response descriptions while preserving the write-only/no-raw-secret boundary. If governance intends vault references to be response-safe, authorize and review an Auth/RBAC authority amendment before any OpenAPI correction. | Primary: `docs/nashir_v1_openapi.yaml`; alternate only after explicit authority-change approval: `docs/nashir_auth_rbac_workspace_identity_gate.md` | OpenAPI; alternate Auth-RBAC doc; review confirmation | Exposure of credential metadata and implementation of a response contract that contradicts the security authority | Scan all response schemas, examples, descriptions, audit metadata, and list/read operations for raw secrets and vault references; confirm credential responses satisfy the reviewed authority |

All proposed corrections require later explicit authorization. This matrix does
not select or apply an Auth/RBAC authority amendment.

---

## 7. Correction Sequencing

Safe correction sequencing is:

1. Review this correction planning gate and confirm all six FAIL findings and
   correction approaches are preserved.
2. Resolve authority-choice questions for FAIL-01 and FAIL-06 without changing
   either authority in the planning review.
3. Authorize one correction execution gate with an explicit file boundary and
   reviewed correction decisions.
4. Correct authentication representation and credential response boundaries.
5. Establish the authoritative permission mapping and content route-family
   model before correcting operation-level permissions.
6. Correct protected-operation 401/403 coverage and non-disclosing 404
   behavior against the retained route families.
7. Run complete post-correction inventories and contract validation.
8. Perform an Auth/RBAC/OpenAPI alignment correction review.
9. Reassess every original FAIL item; do not establish alignment unless all six
   are cleared by review.

Corrections that define permission mappings, content route-family authorization
models, or non-disclosing policies must be established in the
Auth/RBAC/Workspace Identity design authority before or alongside OpenAPI
correction. OpenAPI must reflect these authority decisions; it must not become
the first source of truth for those security rules.

Generated clients, backend routes, permission enforcement, and database-backed
runtime planning remain blocked throughout this sequence.

---

## 8. Explicit Non-Authorization Boundary

This planning gate does not authorize, and must NOT modify or add, any of the
following:

- `docs/nashir_v1_openapi.yaml`
- `docs/nashir_auth_rbac_workspace_identity_gate.md`
- SQL contracts
- `henter36/nashir-backend` or backend implementation
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

## 9. Contract Authority and Alignment Boundary

`docs/nashir_v1_openapi.yaml` is resolved only as the OpenAPI authority
location.

Authority location resolution does not mean OpenAPI/Auth/RBAC/Workspace
Identity alignment readiness is resolved.

Alignment readiness remains PENDING ALIGNMENT until the six FAIL findings are
corrected and reviewed.

Consequently, the OpenAPI contract must not be used as an active downstream
synchronization authority for backend implementation, generated clients, route
implementation, permission enforcement, migration/runtime work, or deployment
decisions until alignment is established.

The active downstream synchronization authority restriction remains in effect.

Contract drift risk: downstream repositories must not redefine, fork, or
diverge from `henter36/nashir` contract authorities.

Prerequisite sequencing risk: Auth/RBAC/Workspace Identity expectations must be
reflected accurately before OpenAPI can drive implementation.

---

## 10. Risk Assessment

| Risk | Planning impact | Required mitigation |
|---|---|---|
| FAIL finding omitted or downgraded | The NO-GO basis could be weakened before correction | Preserve and verify all six extracted FAIL findings through planning review |
| Authority amended implicitly | OpenAPI convenience could silently redefine Auth/RBAC expectations | Require explicit authority-choice decisions and separately authorized amendments |
| Partial correction mistaken for alignment | Some failures could be fixed while others remain blocking | Reassess all six findings after correction and preserve PENDING ALIGNMENT until review clears them |
| Permission and route corrections performed out of order | Error and guard corrections could target a route family later removed | Select authoritative permission mapping and route families before final operation-level correction |
| Tenant isolation regression | Non-disclosing correction could expose workspace membership or resource existence | Require complete workspace-operation and nested-resource verification |
| Credential metadata exposure | Credential responses could continue to expose vault references | Require response-schema and description scans after correction |
| Premature downstream consumption | Backend or clients could consume partially corrected OpenAPI | Preserve the active downstream synchronization authority restriction |
| Contract drift risk | Downstream repositories or OpenAPI/backend artifacts could redefine, fork, or diverge from `henter36/nashir` contract authorities | Preserve `henter36/nashir` authority and require reviewed downstream synchronization controls |
| Prerequisite design sequencing risk | OpenAPI correction could define permission, content authorization, or non-disclosing policy before the Auth/RBAC/Workspace Identity authority establishes those expectations | Establish the prerequisite Auth/RBAC design authority decision before or alongside OpenAPI correction |
| Authority location distinction | The resolved OpenAPI authority location could be mistaken for alignment readiness | Record that authority location may be resolved while alignment readiness remains PENDING ALIGNMENT |
| Planning mistaken for implementation authorization | Correction plans could be applied without an execution gate | Preserve the consolidated non-authorization boundary |

---

## 11. GO / NO-GO Decision

Decision: GO to Auth/RBAC/OpenAPI Alignment Correction Planning Review Gate, planning-only.

This decision authorizes review of the correction plan only. It does not correct
or clear any FAIL finding, change the previous NO-GO basis, establish alignment,
or authorize downstream synchronization or implementation.

Alignment readiness remains PENDING ALIGNMENT, and the active downstream
synchronization authority restriction remains in effect.

---

## 12. Recommended Next Gate

Recommended Next Gate: Auth/RBAC/OpenAPI Alignment Correction Planning Review Gate.

The review gate should verify that this plan preserves the six original FAIL
findings, assigns a sufficient correction and verification path to each, avoids
implicit authority changes, and keeps all downstream work blocked.

---

## 13. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n 'GO / NO-GO|Decision:|Recommended Next Gate|planning-only|Correction Planning Review Gate|NO-GO|FAIL|PENDING ALIGNMENT|active downstream synchronization authority|does not authorize|must NOT modify|OpenAPI|Auth/RBAC|product API routes|workspace-scoped routes|permission enforcement|generated clients|SQL migrations|migration runner|ORM/query layer|auth implementation|deployment config|production|pilot' docs/nashir_auth_rbac_openapi_alignment_correction_planning_gate.md
git diff --check
```
