# Nashir Auth/RBAC/OpenAPI Alignment Correction Planning Review Gate

| Field | Value |
|---|---|
| Gate type | Auth/RBAC/OpenAPI alignment correction planning review |
| Scope | Documentation-only, review-only; no correction or implementation authorization |
| Previous correction planning gate | `docs/nashir_auth_rbac_openapi_alignment_correction_planning_gate.md` |
| Previous NO-GO alignment gate | `docs/nashir_auth_rbac_openapi_alignment_gate.md` |
| Previous decision | Decision: GO to Auth/RBAC/OpenAPI Alignment Correction Planning Review Gate, planning-only. |
| Previous recommended next gate | Auth/RBAC/OpenAPI Alignment Correction Planning Review Gate |
| OpenAPI authority | `docs/nashir_v1_openapi.yaml` |
| Auth/RBAC/Workspace Identity authority | `docs/nashir_auth_rbac_workspace_identity_gate.md` |
| Alignment readiness | PENDING ALIGNMENT |

---

## 1. Gate Purpose

This review gate reviews the Auth/RBAC/OpenAPI Alignment Correction Planning
Gate and determines whether Nashir may proceed to an explicit
Auth/RBAC/OpenAPI Alignment Correction Gate.

The review verifies that the correction plan preserves exactly the six original
blocking FAIL findings and the previous NO-GO basis, respects prerequisite
design sequencing, and does not apply or authorize corrections.

---

## 2. Inputs Reviewed

| Input | Review use |
|---|---|
| `docs/nashir_auth_rbac_openapi_alignment_correction_planning_gate.md` | Primary correction planning gate under review |
| `docs/nashir_auth_rbac_openapi_alignment_gate.md` | Source of the six original blocking FAIL findings and previous NO-GO basis |
| Previous decision | Decision: GO to Auth/RBAC/OpenAPI Alignment Correction Planning Review Gate, planning-only. |
| Previous recommended next gate | Auth/RBAC/OpenAPI Alignment Correction Planning Review Gate |
| `docs/nashir_v1_openapi.yaml` | Resolved OpenAPI authority location and possible later correction target |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Prerequisite Auth/RBAC/Workspace Identity design authority |

---

## 3. Previous NO-GO and Planning Decision Confirmation

The previous alignment decision remains confirmed:

Decision: NO-GO until Auth/RBAC/OpenAPI alignment defects are corrected.

The previous correction planning decision is confirmed:

Decision: GO to Auth/RBAC/OpenAPI Alignment Correction Planning Review Gate, planning-only.

The planning-only GO did not clear the NO-GO basis, correct any FAIL finding,
establish alignment, or authorize downstream synchronization.

---

## 4. Six FAIL Findings Preservation Review

The correction planning gate preserves exactly these six original blocking FAIL
findings:

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

Review finding: exactly six original FAIL findings are preserved. No new FAIL
finding is introduced, no FAIL is silently downgraded to WATCH, and the NO-GO
basis is unchanged.

---

## 5. Correction Plan Matrix Review

| Review criterion | Finding |
|---|---|
| One correction-plan row exists per original FAIL | PASS: six rows, FAIL-01 through FAIL-06 |
| Current mismatch included per row | PASS |
| Required correction included per row | PASS |
| Target artifact for later correction included per row | PASS |
| Correction type included per row | PASS |
| Risk if not corrected included per row | PASS |
| Follow-up verification included per row | PASS |
| Corrections applied in planning gate | No |
| New permission groups invented | No |
| Previous NO-GO basis changed | No |

Review finding: the correction plan matrix is complete and suitable for a later
explicit correction gate.

---

## 6. Prerequisite Design Sequencing Review

The correction planning gate states that permission mappings, content
route-family authorization models, and non-disclosing policies must be
established in the Auth/RBAC/Workspace Identity design authority before or
alongside OpenAPI correction.

It also states that OpenAPI must reflect those authority decisions and must not
become the first source of truth for those security rules.

The sequencing distinguishes:

- prerequisite Auth/RBAC authority clarification or amendment
- later or coordinated OpenAPI reflection
- post-correction verification and alignment review

Review finding: prerequisite design sequencing is correctly preserved.

---

## 7. FAIL-02 Permission Mapping Review

FAIL-02 preserves the approved 24 permission groups as authoritative unless a
separately authorized amendment changes them. It explicitly prohibits inventing
new permissions.

The target artifact order establishes the authoritative operation-to-permission
mapping design first in `docs/nashir_auth_rbac_workspace_identity_gate.md`,
then reflects that decision in `docs/nashir_v1_openapi.yaml`.

The planned verification inventories every `x-permission` and
`x-secondary-permission` and confirms every protected operation maps to the
reviewed authority.

Review finding: PASS. The plan prevents backend-local permission invention and
does not use OpenAPI as the first source of truth.

---

## 8. FAIL-03 Content Contract Family Review

FAIL-03 preserves the requirement to select one authoritative content, draft,
approval, rejection, and withdrawal model or clearly segregate route families.

The target artifact order establishes the authoritative permission and
route-family model first in `docs/nashir_auth_rbac_workspace_identity_gate.md`,
then reflects it in `docs/nashir_v1_openapi.yaml` and a later alignment
correction review record.

The planned verification compares retained route families, operationIds,
schemas, lifecycle actions, permission mappings, and error responses.

Review finding: PASS. The plan prevents duplicate backend services and
conflicting generated clients from being authorized before correction review.

---

## 9. FAIL-05 Non-Disclosing Policy Review

FAIL-05 preserves tenant isolation and requires an operation-level
non-disclosing policy for non-member, cross-workspace, nested-resource, and
missing-resource cases.

The target artifact order establishes the non-disclosing policy first in
`docs/nashir_auth_rbac_workspace_identity_gate.md`, then reflects it through
OpenAPI guard metadata, descriptions, and explicit 404 behavior.

The planned verification inventories every protected workspace-scoped
operation and explicitly reviews nested-resource and list semantics.

Review finding: PASS. OpenAPI is not treated as the first source of truth, and
the planned correction does not weaken tenant isolation.

---

## 10. Non-Authorization Boundary Review

This review gate does not authorize, and must NOT modify or add, any of the
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

Review finding: the previous planning gate and this review gate preserve one
consolidated non-authorization boundary. No correction was applied.

---

## 11. Contract Authority and Alignment Boundary Review

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

Prerequisite design sequencing risk: OpenAPI correction must not define
permission mappings, content authorization models, or non-disclosing policy
before the Auth/RBAC/Workspace Identity authority establishes those
expectations.

Authority location distinction: the location of the OpenAPI authority may be
resolved while alignment readiness remains PENDING ALIGNMENT.

Review finding: the authority location, alignment readiness, contract drift,
and prerequisite design sequencing distinctions are explicit and preserved.

---

## 12. Risk Assessment

| Risk | Review finding | Required control |
|---|---|---|
| FAIL finding omitted or downgraded | No omission or downgrade found | Preserve all six findings through correction and review |
| NO-GO basis weakened | No change found | Keep NO-GO in effect until all six findings are corrected and reviewed |
| Backend-local permissions invented | FAIL-02 prohibits new permissions and prioritizes Auth/RBAC authority | Verify the authoritative operation-to-permission mapping before OpenAPI reflection |
| Duplicate content implementations or clients | FAIL-03 requires one authoritative or clearly segregated model | Review retained route families before implementation or client generation |
| Tenant isolation weakened | FAIL-05 prioritizes an Auth/RBAC non-disclosing policy | Verify operation-level 404 and guard behavior after correction |
| Contract drift risk | Distinguished from prerequisite sequencing risk | Preserve `henter36/nashir` authority and reviewed synchronization controls |
| Prerequisite design sequencing risk | Auth/RBAC decisions precede or accompany OpenAPI reflection | Do not permit OpenAPI to become the first source of truth |
| Authority location mistaken for readiness | Distinction is explicit | Preserve PENDING ALIGNMENT and downstream synchronization restriction |
| Planning review mistaken for correction authorization | Review-only progression could be misused | Preserve the consolidated non-authorization boundary |

---

## 13. Review Findings

| Review criterion | Finding |
|---|---|
| Previous correction planning gate documentation-only | Confirmed |
| OpenAPI modified by planning gate | No |
| Auth/RBAC/Workspace Identity documents modified by planning gate | No |
| SQL contracts modified by planning gate | No |
| `henter36/nashir-backend` modified by planning gate | No |
| Exactly six original FAIL findings preserved | Confirmed |
| New FAIL findings invented | No |
| FAIL findings downgraded to WATCH | No |
| One complete correction-plan row per FAIL | Confirmed |
| FAIL-02 prioritizes Auth/RBAC authority | Confirmed |
| FAIL-03 prioritizes Auth/RBAC authority | Confirmed |
| FAIL-05 prioritizes Auth/RBAC authority | Confirmed |
| OpenAPI treated as first source of truth for reviewed security rules | No |
| Contract drift and prerequisite sequencing risks distinguished | Confirmed |
| Authority location and PENDING ALIGNMENT distinction | Confirmed |
| Corrections applied in planning gate | No |
| Active downstream synchronization authority restriction | Preserved |

All review criteria pass. No correction planning defect blocks progression to
an explicit Auth/RBAC/OpenAPI Alignment Correction Gate.

---

## 14. GO / NO-GO Decision

Decision: GO to Auth/RBAC/OpenAPI Alignment Correction Gate, review-only.

This decision authorizes an explicit correction gate only. It does not apply or
clear any FAIL finding, change the previous NO-GO basis, establish alignment,
modify any authority, or authorize downstream synchronization or
implementation.

Alignment readiness remains PENDING ALIGNMENT, and the active downstream
synchronization authority restriction remains in effect.

---

## 15. Recommended Next Gate

Recommended Next Gate: Auth/RBAC/OpenAPI Alignment Correction Gate.

The correction gate must preserve the six original FAIL findings as its
correction scope, establish prerequisite Auth/RBAC authority decisions before
or alongside OpenAPI reflection where required, and remain correction-only
without authorizing backend implementation or downstream synchronization.

---

## 16. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n 'GO / NO-GO|Decision:|Recommended Next Gate|review-only|Auth/RBAC/OpenAPI Alignment Correction Gate|NO-GO|FAIL|FAIL-02|FAIL-03|FAIL-05|PENDING ALIGNMENT|active downstream synchronization authority|Contract drift risk|Prerequisite design sequencing risk|authority location|does not authorize|must NOT modify|OpenAPI|Auth/RBAC|product API routes|workspace-scoped routes|permission enforcement|generated clients|SQL migrations|migration runner|ORM/query layer|auth implementation|deployment config|production|pilot' docs/nashir_auth_rbac_openapi_alignment_correction_planning_review_gate.md
git diff --check
```
