# Nashir Contract Reference Mechanism Decision Review Gate

| Field | Value |
|---|---|
| Gate type | Contract reference mechanism decision review |
| Scope | Documentation-only review; no executable contract reference or implementation |
| Reviewed preferred mechanism | CI multi-repository checkout pinned to an approved henter36/nashir commit SHA |
| Contract source of truth | `henter36/nashir` |
| Backend route boundary | `/health` remains the only backend route |

---

## 1. Gate Purpose

This gate reviews the Contract Reference Mechanism Decision Gate and determines
whether Nashir may proceed to a Backend Slice 0 Contract-Safe Infrastructure
Validation Action Planning Gate.

This review confirms a preferred future mechanism and its controls only. It
does not authorize CI workflows, validation scripts, executable contract
references, or backend implementation.

## 2. Inputs Reviewed

| Input | Review use |
|---|---|
| `docs/nashir_contract_reference_mechanism_decision_gate.md` | Selects and bounds the preferred future contract reference mechanism |
| `docs/nashir_backend_slice_0_contract_safe_infrastructure_validation_planning_review_gate.md` | Authorizes the mechanism decision path and confirms Slice 0 boundaries |
| `docs/nashir_backend_slice_0_contract_safe_infrastructure_validation_planning_gate.md` | Defines candidate mechanisms and planned validation checks |
| `docs/nashir_backend_runtime_repository_setup_closure_gate.md` | Confirms the minimal backend skeleton and `/health`-only route boundary |
| `docs/nashir_v1_openapi.yaml` | OpenAPI authority in `henter36/nashir` |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/Workspace Identity authority |

## 3. Previous Decision Confirmation

The reviewed decision gate used:

Decision: GO to Contract Reference Mechanism Decision Review Gate,
decision-only.

It selected CI multi-repository checkout pinned to an approved
henter36/nashir commit SHA as the preferred future mechanism. It remained
documentation-only and did not implement the mechanism or modify any contract,
backend, validation, or CI artifact.

## 4. Preferred Mechanism Review

The preferred mechanism selection passes review.

CI multi-repository checkout pinned to an approved henter36/nashir commit SHA
is the strongest near-term governance fit because it:

- reads the authority from a separate `henter36/nashir` checkout
- keeps `henter36/nashir` as the contract source of truth
- avoids copying the OpenAPI authority into `henter36/nashir-backend`
- supports explicit pinning, auditability, and future drift-detection
- keeps repository ownership and authority boundaries visible
- avoids premature submodule and artifact/package governance
- can support future Slice 0 validation without creating a second contract
  authority

The selection is a preferred future mechanism only. No checkout, workflow,
credential, validation, or executable reference is implemented.

## 5. Deferred and Rejected Mechanisms Review

| Mechanism | Reviewed status | Review finding |
|---|---|---|
| Git submodule | Rejected near-term | Correctly rejected because operational friction and accidental-authority/update complexity outweigh its near-term benefit |
| Pinned contract artifact/package | Deferred | Correctly deferred until publishing, provenance, retention, versioning, and package governance exist |
| Manual local path reference | Development exploration only | Correctly excluded from authoritative CI because it is insufficiently auditable and reliably pinned |
| Other explicit read-only models | Deferred | Correctly left open for later review only if they satisfy all authority and drift controls |

No rejected or deferred mechanism is implemented or authorized by the decision
or this review.

## 6. Contract Authority Boundary Review

`henter36/nashir` remains the OpenAPI/Auth/RBAC/docs contract source of truth.
`henter36/nashir-backend` must not copy, redefine, fork, copy-and-diverge, or
silently diverge from `henter36/nashir` contract authorities.

The reviewed mechanism preserves this boundary by requiring a separate,
read-only authority checkout pinned to an approved commit SHA. It does not
create a backend-owned contract copy or second authority.

Authority location resolution and mechanism selection remain distinct from
implementation readiness. Future validation must read established authorities
without redefining authentication, workspace scope, permission,
non-disclosure, error, or lifecycle semantics.

## 7. Future Implementation Controls

The decision gate correctly requires a later implementation proposal to:

1. Pin the authority checkout to an explicit reviewed `henter36/nashir` commit
   SHA rather than a floating branch.
2. Use least-privilege, read-only credentials.
3. Record the authority repository and commit SHA in auditable output.
4. Read `docs/nashir_v1_openapi.yaml` from the separate authority checkout
   without copying it into `henter36/nashir-backend`.
5. Detect stale pins and contract drift through a reviewed update process.
6. Fail closed when authority, pin, integrity, parse, or contract invariants
   cannot be verified.
7. Preserve Auth/RBAC/Workspace Identity authority and contract semantics.
8. Define exact commands, allowed files, outputs, failure behavior, security
   controls, and rollback steps before implementation.

The next gate may plan these controls. It may not implement them.

## 8. Blocked Areas Review

The following remain blocked or deferred:

- backend implementation
- validation scripts and executable contract references
- CI workflows and CI multi-repository checkout configuration
- git submodules and package/artifact publishing or consumption
- product API routes and workspace-scoped route implementation
- auth implementation and permission enforcement implementation
- generated clients
- SQL migrations, migration runner setup, database config, and ORM/query layer
- environment/secrets config with real values
- deployment config
- production readiness and pilot readiness

## 9. Risk Assessment Review

| Risk | Review finding | Required control |
|---|---|---|
| Contract drift risk | Correctly identifies stale, copied, forked, or silently divergent references | Require a separately checked-out authority pinned by reviewed commit SHA with drift-detection |
| Independent authority risk | Correctly prohibits a backend-owned OpenAPI copy or competing source of truth | Preserve `henter36/nashir` authority |
| Prerequisite design sequencing risk | Correctly prohibits validation or implementation from redefining security and lifecycle expectations | Read established authorities only |
| Pinning/versioning risk | Correctly rejects floating references | Require explicit reviewed commit SHA and auditable update process |
| Credential/access security risk | Correctly defers cross-repository access details | Require least-privilege read-only access in a later security-reviewed gate |
| CI feasibility risk | Correctly recognizes that workflow design remains unimplemented | Require action planning and review before CI changes |
| Mechanism-selection creep | Decision could be mistaken for implementation authorization | Preserve review-only progression and consolidated non-authorization boundary |

## 10. Review Findings

All review criteria pass:

- CI multi-repository checkout pinned to an approved henter36/nashir commit SHA
  is selected as the preferred future mechanism.
- `henter36/nashir` remains the contract source of truth.
- `henter36/nashir-backend` must not copy, redefine, fork, or silently diverge
  from the authorities.
- Git submodule is rejected near-term.
- Pinned contract artifact/package and other read-only models remain deferred.
- Manual local path reference remains development exploration only.
- Future reference controls require read-only, pinned, auditable, and
  drift-detectable behavior.
- The mechanism supports future Slice 0 validation without creating a second
  contract authority.
- No implementation or executable configuration is authorized.

## 11. Explicit Non-Authorization Boundary

This review gate does not authorize, and must NOT modify, add, or implement:

- `henter36/nashir-backend` or backend implementation
- OpenAPI, Auth/RBAC documents, or SQL contracts
- validation scripts or executable contract references
- CI workflows or CI multi-repository checkout configuration
- git submodules
- package or artifact publishing or consumption configuration
- manual local-path configuration
- product API routes or workspace-scoped route implementation
- permission enforcement implementation or auth implementation
- generated clients
- SQL migrations, migration runner setup, database config, or ORM/query layer
- environment/secrets config with real values
- deployment config
- production readiness or pilot readiness

## 12. GO / NO-GO Decision

Decision: GO to Backend Slice 0 Contract-Safe Infrastructure Validation Action Planning Gate, review-only.

The preferred mechanism and its authority controls are sufficiently clear for
a documentation-only action planning gate. This decision does not authorize
validation scripts, CI workflows, executable contract references, backend
implementation, routes, auth, permission enforcement, generated clients,
database work, deployment, production readiness, or pilot readiness.

## 13. Recommended Next Gate

Recommended Next Gate: Backend Slice 0 Contract-Safe Infrastructure Validation Action Planning Gate.

## 14. Verification Commands

```bash
git status --short
git diff --stat
grep -E -i -n 'Decision:|Recommended Next Gate|Backend Slice 0 Contract-Safe Infrastructure Validation Action Planning Gate|review-only|CI multi-repository checkout|approved henter36/nashir commit SHA|git submodule|pinned contract artifact|manual local path|read-only|pinned|auditable|drift-detectable|source of truth|henter36/nashir|henter36/nashir-backend|copy|redefine|fork|diverge|does not authorize|must NOT modify|validation scripts|CI workflows|executable contract references|generated clients|SQL migrations|backend implementation|production|pilot' docs/nashir_contract_reference_mechanism_decision_review_gate.md
git diff --check
```
