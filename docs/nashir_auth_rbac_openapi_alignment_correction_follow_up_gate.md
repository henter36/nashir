# Nashir Auth/RBAC/OpenAPI Alignment Correction Follow-up Gate

| Field | Value |
|---|---|
| Gate type | Auth/RBAC/OpenAPI alignment correction follow-up |
| Scope | Documentation and OpenAPI correction-only; no implementation authorization |
| Previous decision | Decision: NO-GO until remaining Auth/RBAC/OpenAPI correction defects are resolved. |
| Auth/RBAC authority | `docs/nashir_auth_rbac_workspace_identity_gate.md` |
| OpenAPI authority | `docs/nashir_v1_openapi.yaml` |

---

## 1. Gate Purpose

This gate resolves the remaining FAIL-02 permission-mapping and FAIL-03 content
route-family defects after the reduced safe correction preserved all routes and
operationIds. Auth/RBAC authority decisions are established before or alongside
their OpenAPI reflection.

## 2. Inputs Reviewed

- `docs/nashir_auth_rbac_openapi_alignment_correction_gate.md`
- `docs/nashir_auth_rbac_workspace_identity_gate.md`
- `docs/nashir_v1_openapi.yaml`
- Previous decision: NO-GO until remaining Auth/RBAC/OpenAPI correction defects
  are resolved.
- Previous recommended next gate: Auth/RBAC/OpenAPI Alignment Correction
  Follow-up Gate.

## 3. Previous Correction Gate Decision

The reduced safe correction gate retained a NO-GO because FAIL-02 and FAIL-03
remained unresolved. It preserved all 62 paths, all 90 operationIds, Creator
Studio, Content Studio CRUD, and preview-artifact capability.

## 4. Remaining FAIL-02 Review

FAIL-02 concerned Creator Studio and deferred route-family permission strings
that were present in OpenAPI but absent from the Auth/RBAC authority. This gate
does not create backend-local permissions. It establishes the exact preserved
contract permissions in Auth/RBAC authority and confirms the existing OpenAPI
metadata reflects them.

The original 24 core permission groups remain authoritative. The follow-up
authority amendment adds five narrowly scoped, implementation-DEFERRED groups
without renaming or weakening the core groups.

## 5. Remaining FAIL-03 Review

FAIL-03 concerned overlapping `/campaign-contents...` and
`/content-items.../drafts...` route families. Required V1 capabilities prevent
safe deletion. This gate establishes one underlying content/draft lifecycle and
segregates the retained surfaces instead.

## 6. Creator Studio Permission Mapping

| Operations | Authoritative permission | Authority result |
|---|---|---|
| Create/read Creator Studio sessions; read context and transfer drafts | `nashir.creator_studio.use` | Approved contract permission; implementation DEFERRED/BLOCKED |
| Create context drafts, readiness assessments, and destination transfer drafts | `nashir.creator_studio.transfer.create` | Approved contract permission; implementation DEFERRED/BLOCKED |
| Create Prompt Governance transfer draft | `nashir.creator_studio.transfer.create` plus `nashir.prompt_governance.read` | Both permissions required; deny-by-default |

Documented owner/admin and destination-service constraints remain additional
object-level guards. Permission mapping does not replace them.

## 7. Deferred Route-Family Permission Handling

| Route family | Authoritative permission | Handling |
|---|---|---|
| Workspace, workflow, and workflow-step readiness | `nashir.workflow.read` | Approved contract mapping; implementation remains DEFERRED/BLOCKED |
| Provider and model-route readiness | `nashir.model_routing.read` | Approved contract mapping; implementation remains DEFERRED/BLOCKED |
| Prompt readiness and referenced prompt-governance metadata | `nashir.prompt_governance.read` | Approved contract mapping; implementation remains DEFERRED/BLOCKED |

These route families remain present and deny-by-default. Their approved
contract mappings resolve vocabulary alignment but do not authorize runtime
implementation.

## 8. Content Route-Family Boundary Decision

- `/campaign-contents...` remains the V1 Core Content Studio compatibility
  surface for content-item CRUD, preview-artifact metadata, and compatibility
  lifecycle actions.
- `/content-items.../drafts...` is the authoritative draft lifecycle surface for
  draft creation/versioning, submit-review, approve, reject, withdrawal, and
  approval-history reads.
- Campaign-content submit-review, approve, and reject are aliases over the same
  authoritative draft lifecycle. They must not create duplicate services,
  lifecycle state, approval records, or permission semantics.
- Both surfaces use `nashir.content.read`, `nashir.content.manage`, and
  `nashir.content.approve` consistently.

Content Studio CRUD and preview-artifact capability remain preserved.

## 9. Auth/RBAC Authority Updates

`docs/nashir_auth_rbac_workspace_identity_gate.md` now:

- establishes five exact contract permission groups for Creator Studio and
  advisory readiness/governance route families
- preserves deny-by-default and marks their implementation DEFERRED/BLOCKED
- requires both primary and secondary permission for Prompt Governance transfer
- establishes the authoritative single-lifecycle content route-family boundary
- prohibits duplicate content lifecycle, approval, permission, or service models

## 10. OpenAPI Reflection Updates

`docs/nashir_v1_openapi.yaml` now reflects the authority decision by:

- retaining the already-aligned Creator Studio and readiness permission metadata
- clarifying Campaign Content as a compatibility surface
- clarifying ContentDrafts as the authoritative lifecycle surface
- documenting campaign-content lifecycle operations as aliases over the same
  ContentDraft lifecycle
- preserving every path, method, operationId, schema, and capability

## 11. Route Preservation Verification

| Verification | Result |
|---|---|
| HEAD paths / worktree paths | 62 / 62 |
| Removed paths | None |
| Added paths | None |
| HEAD operations / worktree operations | 90 / 90 |
| Removed operationIds | None |
| Added operationIds | None |
| Creator Studio capabilities | Preserved |
| Content Studio CRUD | Preserved |
| Preview-artifact capability | Preserved |

## 12. Correction Matrix

| Remaining issue | Current risk | Auth/RBAC authority decision | OpenAPI reflection | Route preservation result | Verification result | Residual status: RESOLVED / WATCH / DEFERRED / FAIL |
|---|---|---|---|---|---|---|
| FAIL-02 / Creator Studio permissions | OpenAPI-local or backend-local permission invention | Approves `creator_studio.use` and `creator_studio.transfer.create`, including secondary prompt permission rule | Existing exact mappings retained | All Creator Studio routes preserved | Permission inventory matches authority | RESOLVED |
| FAIL-02 / advisory readiness and governance permissions | Unmapped preserved route-family permissions | Approves `workflow.read`, `model_routing.read`, and `prompt_governance.read`; runtime remains blocked | Existing exact mappings retained | All readiness routes preserved | Permission inventory matches authority | RESOLVED; implementation DEFERRED |
| FAIL-03 / overlapping content families | Duplicate lifecycle, services, clients, or permission semantics | Establishes Campaign Content compatibility surface and authoritative ContentDraft lifecycle over one underlying model | Tags and lifecycle descriptions reflect boundary | Both route families and all capabilities preserved | Canonical content permissions and zero deletions confirmed | RESOLVED |

## 13. Residual FAIL/WATCH/DEFERRED Items

- FAIL-02 and FAIL-03 are RESOLVED at contract-authority alignment level.
- WATCH: a later correction review must confirm generated-client naming can
  express compatibility aliases without suggesting duplicate lifecycle models.
- DEFERRED: all Creator Studio, readiness, model-routing, and prompt-governance
  route implementation and permission enforcement.
- DEFERRED: backend implementation, generated clients, and runtime validation.
- No blocking FAIL remains in this follow-up slice.

## 14. Explicit Non-Authorization Boundary

This follow-up gate does not authorize, and must NOT modify or add:

- `henter36/nashir-backend` or backend implementation
- product API routes implementation or workspace-scoped route implementation
- permission enforcement implementation or auth implementation
- generated clients
- SQL migrations, migration runner setup, database config, or ORM/query layer
- environment/secrets config with real values
- deployment config or CI workflows
- production readiness or pilot readiness

## 15. Risk Assessment

| Risk | Control |
|---|---|
| Permission invention outside authority | Exact codes are established in Auth/RBAC authority first or alongside OpenAPI reflection |
| Duplicate content lifecycle or services | Compatibility operations delegate to one authoritative ContentDraft lifecycle |
| Contract drift | All downstream artifacts must use the Nashir authorities and may not fork mappings or route semantics |
| Silent V1 coverage reduction | Zero path and operationId deletion is required and verified |
| Alignment mistaken for implementation readiness | Runtime, generated clients, and permission enforcement remain explicitly unauthorized |

## 16. Verification Results

The route-preservation check confirms 62 HEAD and worktree paths, 90 HEAD and
worktree operations, no removed or added paths, no removed or added operationIds,
and PASS for route and operation preservation. YAML and whitespace validation
pass.

## 17. GO / NO-GO Decision

Decision: GO to Auth/RBAC/OpenAPI Alignment Correction Follow-up Review Gate, correction-only.

FAIL-02 and FAIL-03 are resolved at the authority and OpenAPI alignment level
without deleting paths, operations, or V1 capabilities. This decision does not
authorize backend implementation readiness.

## 18. Recommended Next Gate

Recommended Next Gate: Auth/RBAC/OpenAPI Alignment Correction Follow-up Review Gate.

## 19. Verification Commands

```bash
git status --short
git diff --stat
ruby route-and-operation-preservation-check
grep -E -n 'Decision:|Recommended Next Gate|FAIL-02|FAIL-03|Creator Studio|Content Studio|preview-artifact|campaign-contents|content-items|RESOLVED|WATCH|DEFERRED|FAIL|GO / NO-GO|does not authorize|must NOT modify|generated clients|SQL migrations|backend implementation|production|pilot' docs/nashir_auth_rbac_openapi_alignment_correction_follow_up_gate.md
git diff --check
```
