# Nashir Auth/RBAC/OpenAPI Alignment Planning Gate

| Field | Value |
|---|---|
| Gate type | Auth/RBAC/OpenAPI alignment planning |
| Scope | Documentation-only, planning-only; no contract or implementation authorization |
| Previous review gate | `docs/nashir_backend_implementation_planning_review_gate.md` |
| Previous decision | Decision: GO to Auth/RBAC/OpenAPI Alignment Planning Gate, review-only. |
| Previous recommended next gate | Auth/RBAC/OpenAPI Alignment Planning Gate |
| OpenAPI authority location | `docs/nashir_v1_openapi.yaml` |
| Auth/RBAC/Workspace Identity authority | `docs/nashir_auth_rbac_workspace_identity_gate.md` |
| Backend repository | `henter36/nashir-backend` |
| OpenAPI/Auth/RBAC/Workspace Identity alignment | PENDING ALIGNMENT |

---

## 1. Gate Purpose

This planning gate defines how Auth/RBAC/Workspace Identity and OpenAPI must be
compared and aligned before any backend implementation can safely proceed.

It plans the evidence, comparison areas, expected outputs, blockers, and safe
sequencing for a later explicit alignment gate. It does not perform alignment,
change any authority, or authorize downstream synchronization.

This planning gate is documentation-only and planning-only. It must NOT modify
`henter36/nashir-backend`.

---

## 2. Inputs Reviewed

| Input | Planning relevance |
|---|---|
| `docs/nashir_backend_implementation_planning_review_gate.md` | Selects this alignment-first planning path, keeps implementation blocked, and confirms Auth/RBAC/OpenAPI Alignment Planning Gate as the selected next path |
| Previous decision | Decision: GO to Auth/RBAC/OpenAPI Alignment Planning Gate, review-only. |
| Previous recommended next gate | Auth/RBAC/OpenAPI Alignment Planning Gate |
| `docs/nashir_v1_openapi.yaml` | Resolved OpenAPI authority location; candidate operation, security, extension, and error surface to compare |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Identity, membership, role, permission, workspace isolation, error, approval, publishing, and audit authority to compare against OpenAPI |
| `docs/nashir_api_contract_openapi_planning_review_gate.md` | API Contract/OpenAPI planning review history and previously reviewed expectations |
| `docs/nashir_api_contract_openapi_planning_gate.md` | API Contract/OpenAPI planning history; present and reviewed as a comparison input |
| `docs/nashir_backend_runtime_repository_setup_closure_gate.md` | Confirms runtime-skeleton-only state and `/health` infrastructure boundary |
| `docs/nashir_backend_implementation_planning_gate.md` | Defines blocked implementation areas and alignment-first sequencing |

These inputs are reviewed as alignment evidence only. Prior planning or review
history does not replace a later operation-by-operation alignment decision.

---

## 3. Current Backend and Contract State

The `henter36/nashir-backend` runtime skeleton exists. Only the `/health`
infrastructure smoke-check route exists; it is not workspace-scoped and is not
a product API route.

No product API routes, workspace-scoped routes, SQL migrations, migration
runner, ORM/query layer, auth implementation, generated clients, deployment
config, production readiness, or pilot readiness exist.

`docs/nashir_v1_openapi.yaml` contains a candidate contract surface, including a
global bearer security requirement, an unauthenticated `/health` exception,
workspace-scoped paths, permission and guard extensions, shared error
responses, and `ErrorModel`. Its location is resolved, but its alignment with
Auth/RBAC/Workspace Identity remains PENDING ALIGNMENT.

---

## 4. Alignment Planning Scope

This planning gate may:

- identify authoritative alignment inputs and comparison evidence
- define the operation-by-operation comparison method
- identify unresolved conflicts, omissions, naming differences, and sequencing
  dependencies that a later alignment gate must disposition
- define the expected output and acceptance criteria of that later alignment
  gate
- identify blockers for routes, generated clients, permission enforcement,
  service/repository work, and database-backed runtime work
- define safe sequencing after this planning gate

The later alignment gate must produce a reviewed alignment disposition before
any contract change or downstream implementation action is considered. A
disposition may identify required future changes, but those changes require
their own explicit authorization gates.

---

## 5. Alignment Topics

| Topic | Alignment planning question |
|---|---|
| Authentication scheme representation | Does OpenAPI represent the intended authentication requirement and token/provider-neutral boundary without prematurely selecting runtime implementation? |
| Unauthenticated exceptions | Is `/health` the only unauthenticated route, with every other operation protected as intended? |
| Workspace path scoping | Does every merchant-owned resource use `/workspaces/{workspaceId}/...`, and are any unscoped or differently scoped operations justified? |
| User and membership model | Do operations reflect global User identity, WorkspaceMember as the authorization binding, active membership requirements, and invited/suspended denial? |
| Role and permission guards | Do OpenAPI security objects, permission extensions, secondary permissions, guard chains, and descriptions consistently represent the Auth/RBAC authority? |
| Operation permission mapping | Does every protected operation map to an approved permission code with no missing, renamed, broadened, or invented permission? |
| Error behavior | Are 401, 403, non-disclosing 404, 409, and 422 represented consistently and only where semantically applicable? |
| `ErrorModel` consistency | Do all applicable error responses use the authoritative shared shape and semantics consistently? |
| Tenant isolation | Do path, membership, resource lookup, and non-disclosing behavior prevent cross-workspace enumeration and access? |
| Self-approval prevention | Is the service-layer creator-versus-approver invariant documented for approval operations and mapped to the intended 409 behavior and audit requirement? |
| Publisher/reviewer separation | Do approval and publishing operations preserve separate permissions and prevent publisher authority from implying approval authority? |
| Audit and security implications | Are sensitive operations, human-review requirements, audit requirements, evidence requirements, secret handling, and denial behavior consistently represented? |
| Generated client timing | What reviewed alignment evidence and later contract readiness decision are required before client generation may begin? |
| Backend preconditions | What alignment artifacts must be approved before route, service-layer permission, repository, and database-backed implementation planning can proceed? |
| Contract drift control | How will `henter36/nashir-backend` consume, reference, and verify `henter36/nashir` authorities without redefining or forking them? |

---

## 6. Required Comparison Areas

The later alignment gate must compare the Auth/RBAC/Workspace Identity authority
to OpenAPI operation-by-operation and record findings in a traceable matrix.

| Comparison area | Required evidence and disposition |
|---|---|
| Security baseline and exceptions | Inventory global and operation-level `security`; confirm `/health` as the only `security: []` exception; identify every deviation |
| Workspace-scoped path inventory | Inventory all paths and classify each as infrastructure, workspace-scoped merchant resource, or explicitly deferred/non-product surface |
| Membership and guard sequence | Compare active membership, invited/suspended behavior, non-member behavior, workspace context, permission checks, and any documented guard-chain order |
| Permission vocabulary | Compare every OpenAPI `x-permission` and `x-secondary-permission` value with approved Auth/RBAC permission groups; disposition naming, singular/plural, action, and coverage differences |
| Operation permission matrix | For every operation, record path, method, operationId, required permission, allowed role implications, workspace scope, and alignment result |
| Authorization response matrix | For every protected operation, compare applicable 401, 403, and non-disclosing 404 responses and identify missing or overexposed behavior |
| Conflict and validation matrix | Compare 409 business-rule/state-transition behavior and 422 request-validation behavior, including rejection of body `workspaceId` / `workspace_id` |
| Error envelope | Verify all error responses reference a consistent `ErrorModel` and that `errorCode`, `message`, optional `details`, `requestId`, `retryable`, and `status` semantics align |
| Isolation and resource lookup | Verify cross-workspace reads/writes, nested-resource ownership, repository filtering expectations, and 404 non-disclosure requirements are explicit |
| Approval and publishing separation | Compare submit, approve, reject, withdraw, publish, confirm, and cancel operations against self-approval prevention and reviewer/publisher separation |
| Audit/security metadata | Compare audit-required, sensitive-operation, human-review, evidence, secret/credential, and no-automatic-execution implications against authority decisions |
| Route and authority coverage | Identify OpenAPI operations or permission concepts not established by the Auth/RBAC authority, and Auth/RBAC concepts missing from OpenAPI |
| Downstream consumption controls | Define how backend and generated-client consumers will verify authority version/identity and detect drift without creating a second authority |

The expected output of a later alignment gate is:

- a complete operation-to-permission and role-implication matrix
- a security, workspace-scope, membership, and error-behavior comparison matrix
- an explicit discrepancy register with severity, authority source, proposed
  disposition, and required future authorization gate
- confirmation or rejection of `/health` as the only unauthenticated exception
- explicit findings for self-approval prevention, reviewer/publisher separation,
  tenant isolation, audit requirements, and `ErrorModel`
- a downstream synchronization readiness decision
- a precise list of remaining blockers and the next authorized planning gate

---

## 7. Blocked Until Alignment

The following remain BLOCKED until a later explicit alignment gate establishes
alignment and a subsequent gate explicitly authorizes the relevant work:

- product API routes
- workspace-scoped routes
- route implementation
- permission enforcement implementation
- generated clients
- backend service/repository implementation relying on workspace or permissions
- database-backed runtime work
- SQL migrations
- migration runner setup
- ORM/query layer
- auth implementation
- deployment config
- production readiness
- pilot readiness

Alignment planning completion alone does not clear these blockers.

---

## 8. Explicit Non-Authorization Boundary

This planning gate does not authorize, and must NOT modify or add, any of the
following:

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
- OpenAPI, Auth/RBAC/Workspace Identity, or SQL contract content

This is the consolidated non-authorization boundary for this gate.

---

## 9. Contract Authority and Alignment Boundary

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

## 10. Risk Assessment

| Risk | Planning impact | Required mitigation |
|---|---|---|
| Authority location mistaken for alignment readiness | OpenAPI could be consumed as executable truth before its security semantics are reconciled. | Preserve PENDING ALIGNMENT and the active downstream synchronization authority restriction. |
| Permission vocabulary drift | Differing permission names or action granularity could produce overbroad or ineffective guards. | Require a complete permission vocabulary and operation mapping disposition. |
| Missing authentication exception review | An unintended unauthenticated operation could be exposed. | Inventory all security overrides and confirm `/health` only. |
| Cross-workspace leakage | Incorrect membership, lookup, or response behavior could disclose tenant data or resource existence. | Require workspace-path, membership, repository-filter, and non-disclosing 404 comparison evidence. |
| Incorrect 401/403/404 semantics | Clients and guards could reveal membership or resource existence, or deny valid users incorrectly. | Require an operation-level authorization response matrix. |
| Business-rule gaps | OpenAPI-only guards cannot enforce self-approval prevention or separation of reviewer and publisher duties. | Identify service-layer invariants and keep permission enforcement implementation blocked. |
| Error contract drift | Inconsistent 409, 422, or `ErrorModel` usage could create incompatible routes and clients. | Require error-response and shared-envelope comparison matrices. |
| Premature generated clients | Clients could encode unstable paths, permissions, and error semantics. | Keep generated clients BLOCKED until alignment and later contract readiness authorization. |
| Backend contract fork | `henter36/nashir-backend` could redefine permissions, paths, or schemas locally. | Define downstream verification and drift-detection controls before implementation. |
| Audit/security omission | Sensitive state transitions could be implemented without required human review or audit evidence. | Compare all audit and security metadata before implementation planning. |
| Planning mistaken for readiness | A planning-only GO could be treated as implementation, production, or pilot approval. | Preserve the consolidated non-authorization boundary and require later explicit gates. |

---

## 11. GO / NO-GO Decision

Decision: GO to Auth/RBAC/OpenAPI Alignment Planning Review Gate, planning-only.

This decision authorizes review of this alignment plan only. OpenAPI/Auth/RBAC/
Workspace Identity alignment remains PENDING ALIGNMENT, all listed downstream
work remains BLOCKED, and the active downstream synchronization authority
restriction remains in effect.

---

## 12. Recommended Next Gate

Recommended Next Gate: Auth/RBAC/OpenAPI Alignment Planning Review Gate.

The review gate should verify that the planned comparison areas, expected
alignment outputs, blockers, authority boundary, risk controls, and safe
sequencing are sufficient before an explicit Auth/RBAC/OpenAPI alignment gate
is considered.

Safe sequencing after this planning gate is:

1. Review this planning gate.
2. If approved, plan and authorize an explicit alignment gate.
3. Perform and review the operation-by-operation alignment disposition without
   modifying contracts or runtime unless separately authorized.
4. Decide downstream synchronization readiness.
5. Only after alignment and later explicit authorization, consider generated
   client, route boundary, service/repository, permission enforcement,
   migration/runtime, and deployment planning gates.

---

## 13. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n 'GO / NO-GO|Decision:|Recommended Next Gate|planning-only|Auth/RBAC/OpenAPI Alignment Planning Review Gate|PENDING ALIGNMENT|active downstream synchronization authority|BLOCKED|does not authorize|must NOT modify|product API routes|workspace-scoped routes|permission enforcement|generated clients|SQL migrations|migration runner|ORM/query layer|auth implementation|deployment config|production|pilot' docs/nashir_auth_rbac_openapi_alignment_planning_gate.md
```
