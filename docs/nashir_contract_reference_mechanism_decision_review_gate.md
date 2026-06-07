# Nashir Contract Reference Mechanism Decision Review Gate

| Field | Value |
|---|---|
| Gate type | Contract reference mechanism decision review |
| Scope | Documentation-only review; no executable contract reference or implementation |
| Preferred future mechanism | CI multi-repository checkout pinned to an approved henter36/nashir commit SHA |
| Contract source of truth | `henter36/nashir` |
| Review basis | Current main branch authorities only |

---

## 1. Gate Purpose

This gate reviews the Contract Reference Mechanism Decision Gate and determines
whether Nashir may proceed to a Backend Slice 0 Contract-Safe Infrastructure
Validation Action Planning Gate.

This review confirms a preferred future mechanism and governance controls only.
It does not authorize CI workflows, validation scripts, executable contract
references, or backend implementation.

## 2. Inputs Reviewed

| Input | Review use |
|---|---|
| `docs/nashir_contract_reference_mechanism_decision_gate.md` | Selects and bounds the preferred future contract-reference mechanism |
| `docs/nashir_backend_slice_0_contract_safe_infrastructure_validation_planning_review_gate.md` | Authorizes the mechanism decision path and confirms Slice 0 boundaries |
| `docs/nashir_backend_slice_0_contract_safe_infrastructure_validation_planning_gate.md` | Defines candidate mechanisms and planned validation checks |
| Naming clarification | The listed Slice 0 planning and planning review files are prior gate inputs. The Backend Slice 0 Contract-Safe Infrastructure Validation Action Planning Gate is the next recommended gate and has not yet been created as an input file. |
| `docs/nashir_backend_runtime_repository_setup_closure_gate.md` | Confirms the minimal backend skeleton and `/health`-only route boundary |
| `docs/nashir_v1_openapi.yaml` | OpenAPI authority in `henter36/nashir` |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/Workspace Identity authority |

This review was created from the current main branch inputs listed above. No
file, commit, or content was imported, cherry-picked, copied, or reused from an
unrelated branch.

## 3. Previous Decision Confirmation

The reviewed decision gate used:

Decision: GO to Contract Reference Mechanism Decision Review Gate,
decision-only.

It selected CI multi-repository checkout pinned to an approved
henter36/nashir commit SHA as the preferred future mechanism. It remained
documentation-only and did not implement the mechanism or modify any contract,
backend, validation, or CI artifact.

## 4. Preferred Mechanism Review

CI multi-repository checkout pinned to an approved henter36/nashir commit SHA
is confirmed as the preferred future mechanism.

The selection passes review because it:

- reads authority from a separate, pinned `henter36/nashir` checkout
- keeps `henter36/nashir` as the contract source of truth
- avoids copying the OpenAPI authority into `henter36/nashir-backend`
- supports read-only access, pinning, auditability, and future drift-detection
- preserves visible repository ownership and authority boundaries
- supports future Slice 0 validation without creating a second contract
  authority

The mechanism remains a future direction only. No checkout, workflow,
credential, validation, or executable contract reference is implemented.

## 5. Deferred and Rejected Mechanisms Review

| Mechanism | Reviewed status | Review finding |
|---|---|---|
| Git submodule | Rejected near-term | Operational friction and accidental-authority/update complexity outweigh its near-term benefit |
| Pinned contract artifact/package | Deferred | Publishing, provenance, retention, versioning, and package governance must be established first |
| Manual local path reference | Development exploration only | It is insufficiently auditable and reliably pinned for authoritative CI validation |
| Other explicit read-only models | Deferred | Any later model must satisfy all authority, pinning, auditability, and drift controls |

No deferred or rejected mechanism is implemented or authorized by this review.

## 6. Contract Authority Boundary Review

`henter36/nashir` remains the OpenAPI/Auth/RBAC/docs contract source of truth.
`henter36/nashir-backend` must not copy, fork, redefine, or silently diverge
from `henter36/nashir` contract authorities.

The preferred mechanism preserves this boundary by requiring a separate,
read-only authority checkout pinned to an approved commit SHA. It does not
create a backend-owned contract copy or a second contract authority.

Resolving authority location is not the same as resolving alignment/content
readiness. The authority location may be resolved while alignment/content
readiness remains a separate reviewed state that must be verified before
implementation reliance.

## 7. Future Implementation Controls

A later action proposal for the preferred mechanism must:

1. Pin the authority checkout to an explicit reviewed `henter36/nashir` commit
   SHA rather than a floating branch.
2. Use least-privilege, read-only credentials and prevent writes to the
   authority checkout.
3. Record the authority repository and commit SHA in auditable validation
   output.
4. Read `docs/nashir_v1_openapi.yaml` from the separate authority checkout
   without copying it into `henter36/nashir-backend`.
5. Detect stale pins and contract drift through a reviewed update and
   comparison process.
6. Fail closed when authority, pin, integrity, parse, or contract invariants
   cannot be verified.
7. Preserve Auth/RBAC/Workspace Identity authority and contract semantics while
   distinguishing contract drift risk from prerequisite design sequencing
   risk. Contract drift risk means backend validation, generated clients,
   runtime implementation, or downstream documentation must not copy, fork,
   redefine, or silently diverge from `henter36/nashir` contract authorities.
   Prerequisite design sequencing risk means OpenAPI, backend routes, generated
   clients, or permission enforcement must not define authentication schemes,
   workspace scoping, permission expectations, non-disclosing behavior, or
   lifecycle semantics before those expectations are established in the
   Auth/RBAC/Workspace Identity authority. Resolving authority location is not
   the same as resolving alignment/content readiness; the authority location
   may be resolved while alignment/content readiness remains a separate
   reviewed state that must be verified before implementation reliance. Future
   OpenAPI validation must check against the established authority without
   redefining those semantics.
8. Define exact commands, allowed files, expected outputs, failure behavior,
   security controls, and rollback steps before implementation.

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
| Contract drift risk | Backend validation, generated clients, runtime implementation, or downstream documentation could copy, fork, redefine, or silently diverge from `henter36/nashir` authorities | Use a separate read-only authority checkout pinned by reviewed commit SHA with auditable drift-detection |
| Prerequisite design sequencing risk | OpenAPI, backend routes, generated clients, or permission enforcement could define authentication schemes, workspace scoping, permission expectations, non-disclosing behavior, or lifecycle semantics before Auth/RBAC/Workspace Identity authority establishes them | Validate against established authority only and prohibit downstream semantic invention |
| Authority location versus alignment/content readiness | A resolved authority location could be mistaken for reviewed alignment/content readiness or implementation reliance | Verify the separate alignment/content readiness state before implementation reliance |
| Independent authority risk | A copied OpenAPI file or derivative could become a second source of truth | Preserve `henter36/nashir` authority and prohibit backend-owned contract copies |
| Pinning/versioning risk | A floating reference could silently change validation inputs | Require an explicit reviewed commit SHA and auditable update process |
| Credential/access security risk | Cross-repository checkout requires repository access | Require least-privilege read-only access in a later security-reviewed gate |
| Mechanism-selection creep | A preferred mechanism decision could be mistaken for implementation authorization | Preserve review-only progression and the consolidated non-authorization boundary |

## 10. Review Findings

All review criteria pass:

- CI multi-repository checkout pinned to an approved henter36/nashir commit SHA
  is the preferred future mechanism.
- `henter36/nashir` remains the contract source of truth.
- `henter36/nashir-backend` must not copy, fork, redefine, or silently diverge
  from the authorities.
- Git submodule is rejected near-term.
- Pinned contract artifact/package and other read-only models remain deferred.
- Manual local path reference remains development exploration only.
- The future mechanism must be read-only, pinned, auditable, and
  drift-detectable.
- Contract drift risk, prerequisite design sequencing risk, and authority
  location versus alignment/content readiness are explicitly distinguished.
- Future OpenAPI validation must check established authority without
  redefining contract semantics.
- Future Slice 0 validation can proceed to action planning without creating a
  second contract authority.
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

The preferred mechanism and governance controls are sufficiently clear for a
documentation-only action planning gate. This decision does not authorize
validation scripts, CI workflows, executable contract references, backend
implementation, routes, auth, permission enforcement, generated clients,
database work, deployment, production readiness, or pilot readiness.

## 13. Recommended Next Gate

Recommended Next Gate: Backend Slice 0 Contract-Safe Infrastructure Validation Action Planning Gate.

## 14. Verification Commands

```bash
git status --short
git diff --stat
grep -E -i -n 'Decision:|Recommended Next Gate|Backend Slice 0 Contract-Safe Infrastructure Validation Action Planning Gate|review-only|CI multi-repository checkout|approved henter36/nashir commit SHA|git submodule|pinned contract artifact|manual local path|read-only|pinned|auditable|drift-detectable|source of truth|henter36/nashir|henter36/nashir-backend|copy|fork|redefine|silently diverge|contract drift risk|prerequisite design sequencing risk|authority location|alignment/content readiness|authentication schemes|workspace scoping|permission expectations|non-disclosing behavior|lifecycle semantics|does not authorize|must NOT modify|validation scripts|CI workflows|executable contract references|generated clients|SQL migrations|backend implementation|production|pilot' docs/nashir_contract_reference_mechanism_decision_review_gate.md
git diff --check
```
