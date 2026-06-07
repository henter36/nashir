# Nashir Contract Reference Mechanism Decision Gate

| Field | Value |
|---|---|
| Gate type | Contract reference mechanism decision |
| Scope | Documentation-only decision; no executable contract reference or validation implementation |
| Contract authority | `henter36/nashir` |
| Preferred future mechanism | CI multi-repository checkout pinned to an approved `henter36/nashir` commit SHA |
| Backend route boundary | `/health` remains the only backend route |

---

## 1. Gate Purpose

This gate decides the preferred future read-only contract reference mechanism
for Backend Slice 0 contract-safe infrastructure validation.

It selects a governance direction only. It does not implement the preferred
mechanism, add validation scripts, configure CI workflows, modify
`henter36/nashir-backend`, or authorize backend implementation.

## 2. Inputs Reviewed

| Input | Decision use |
|---|---|
| `docs/nashir_backend_slice_0_contract_safe_infrastructure_validation_planning_review_gate.md` | Authorizes this decision-only gate and confirms mechanism-selection criteria |
| `docs/nashir_backend_slice_0_contract_safe_infrastructure_validation_planning_gate.md` | Defines Slice 0 validation scope and compares candidate mechanisms |
| `docs/nashir_backend_implementation_slice_planning_review_gate.md` | Confirms Option A and the `/health`-only backend boundary |
| `docs/nashir_auth_rbac_openapi_alignment_final_re_review_gate.md` | Confirms Auth/RBAC/OpenAPI alignment is reviewed for planning |
| `docs/nashir_v1_openapi.yaml` | OpenAPI authority in `henter36/nashir` |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/Workspace Identity authority |
| `docs/nashir_backend_runtime_repository_setup_closure_gate.md` | Confirms the minimal backend runtime skeleton and `/health`-only route boundary |

## 3. Current Authorized State

- `henter36/nashir` is the OpenAPI/Auth/RBAC/docs contract authority and source
  of truth.
- `henter36/nashir-backend` must not copy, redefine, fork, copy-and-diverge, or
  silently drift from `henter36/nashir` contract authorities.
- Backend Slice 0 remains contract-safe infrastructure validation only.
- `/health` remains the only backend route.
- A future contract reference must be explicit, read-only, pinned, auditable,
  and drift-detectable.
- Alignment is reviewed for planning; implementation readiness remains
  separate and deferred.
- No contract reference mechanism implementation is authorized now.

## 4. Mechanism Options Reviewed

### 4.1 CI Multi-Repository Checkout

A future CI workflow could check out `henter36/nashir-backend` and a separately
pinned `henter36/nashir` commit, then read the authority contract directly for
validation. The checkout must remain read-only from the validation process and
must identify the exact authority commit SHA.

### 4.2 Git Submodule

A git submodule could pin `henter36/nashir` inside the backend repository.
Although pinning and auditability are strong, the submodule introduces local
workflow friction, update complexity, and a risk that the checked-out content
is mistaken for backend-owned contract authority.

### 4.3 Pinned Contract Artifact/Package

An immutable contract artifact/package could provide strong versioning,
provenance, and CI ergonomics. It requires a separately governed publishing,
integrity, retention, and version lifecycle that does not yet exist.

### 4.4 Manual Local Path Reference for Development Only

An explicit local path can support developer exploration against a separate
`henter36/nashir` checkout. It has weak auditability and pinning unless
additional checks are added, so it must not become authoritative CI behavior.

### 4.5 Other Explicit Read-Only Contract Reference Model

Another model may be considered later only if it is explicit, read-only,
pinned, auditable, drift-detectable, and keeps `henter36/nashir` as the source
of truth.

## 5. Mechanism Comparison Matrix

| Mechanism | Contract drift risk | Auditability | Pinning/versioning | Local developer ergonomics | CI feasibility | Credential/access security | Copying/redefining risk | Governance fit | Backend impact | Future drift-detection | Keeps `henter36/nashir` source of truth | Implementation authorized now |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CI multi-repository checkout | Low when authority commit SHA is pinned and verified | High through checkout SHA and future workflow logs | Strong commit-SHA pinning | Moderate; local equivalent needs separate planning | Strong | Requires least-privilege repository read access | Low; authority is checked out separately, not copied as backend authority | Strong near-term fit | Future CI/config change only | Strong through pinned-SHA and inventory comparison | Yes | No |
| Git submodule | Low when reviewed pin is maintained | High through repository history | Strong commit pin | Lower due to initialization and update friction | Strong | Requires repository read access | Medium; embedded checkout may be mistaken for backend-owned authority | Mixed | Adds submodule metadata and operating process | Strong if submodule pin is verified | Yes, with careful boundary wording | No |
| Pinned contract artifact/package | Low when immutable and provenance-verified | High after publishing governance exists | Strong digest/version pin | Strong | Strong | Requires artifact access and provenance controls | Medium; publication pipeline could diverge from authority | Strong later, incomplete now | Adds package/artifact consumption process | Strong if provenance links to authority commit | Yes, only with governed publication | No |
| Manual local path reference | Medium to high because checkout may be stale or unpinned | Low | Weak unless commit is checked independently | Strong for exploration | Weak | Uses developer-local repository access | Low copying risk, high stale-reference risk | Development-only | Local configuration convention | Weak to moderate | Yes, but not reliably pinned | No |
| Other explicit read-only model | Unknown until defined | Must be high | Must be strong | Must be assessed | Must be assessed | Must be assessed | Must prohibit independent authority | Must satisfy existing controls | Must be separately reviewed | Must be strong | Must be yes | No |

## 6. Preferred Mechanism Decision

The preferred future mechanism is **CI multi-repository checkout pinned to an
approved `henter36/nashir` commit SHA**.

This is the best near-term governance fit because it:

- reads the OpenAPI authority from `henter36/nashir` without copying it into
  `henter36/nashir-backend` as an independent source of truth
- supports explicit commit-SHA pinning, auditability, and drift-detection
- keeps repository ownership and authority boundaries visible
- avoids submodule operating complexity
- avoids requiring premature artifact/package publishing governance
- can support future Slice 0 YAML parse, path/operation inventory, permission
  metadata, public-operation, and backend-absence validation

The mechanism selection is a decision only. Its workflow design, credentials,
allowed files, exact checkout pin, validation commands, update process, failure
behavior, and rollback behavior require later planning and review before any
implementation.

## 7. Rejected or Deferred Mechanisms

| Mechanism | Status | Reason |
|---|---|---|
| Git submodule | Rejected for the near-term Slice 0 path | Adds operational friction and accidental-authority/update complexity without a clear benefit over a separate pinned CI checkout |
| Pinned contract artifact/package | Deferred as a mature future option | Requires publishing, provenance, retention, versioning, and package-governance decisions before it can safely represent authority |
| Manual local path reference | Deferred for non-authoritative developer exploration only | Useful locally but insufficiently auditable or reliably pinned for authoritative validation |
| Other explicit read-only contract reference model | Deferred | No concrete alternative currently demonstrates a better governance fit |

These decisions do not authorize removal of an option from future
consideration and do not authorize implementation of any option.

## 8. Required Controls for Future Implementation

Any later implementation proposal for CI multi-repository checkout must:

1. Pin the `henter36/nashir` authority checkout to an explicit reviewed commit
   SHA rather than a floating branch.
2. Use read-only, least-privilege repository credentials and prevent validation
   from writing to the authority checkout.
3. Record the authority repository and commit SHA in auditable validation
   output.
4. Read `docs/nashir_v1_openapi.yaml` from the separately checked-out authority
   repository without copying it into `henter36/nashir-backend` as an
   independent source of truth.
5. Detect stale pins and contract drift through an explicitly reviewed update
   and comparison process.
6. Fail closed when the authority reference, pin, integrity, parse, or required
   contract invariants cannot be verified.
7. Preserve Auth/RBAC/Workspace Identity authority and avoid redefining
   authentication, workspace scope, permissions, non-disclosure, or lifecycle
   semantics.
8. Define exact allowed files, commands, expected outputs, failure behavior,
   security controls, and rollback steps in later gates.

## 9. Slice 0 Validation Implications

The preferred mechanism can later support read-only Slice 0 checks for:

- OpenAPI YAML parse from the pinned authority checkout
- 62 paths and 90 operations
- `getHealth` as the only intentionally public operation
- protected-operation permission/security metadata invariants
- `/health` as the only backend route
- absence of product API routes and workspace-scoped routes
- absence of generated clients, SQL migrations, migration runner, database
  config, real secrets, auth implementation, and permission enforcement
  implementation
- absence of a copied OpenAPI authority in `henter36/nashir-backend`

These are future validation implications only. This decision gate does not add
or execute any validation.

## 10. Explicit Non-Authorization Boundary

This decision gate does not authorize, and must NOT modify, add, or implement:

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

## 11. Risk Assessment

| Risk | Decision finding | Required control |
|---|---|---|
| Contract drift risk | Backend validation could reference a stale, copied, forked, or silently divergent contract | Use a separately checked-out, explicit authority repository pinned by reviewed commit SHA with future drift-detection |
| Independent authority risk | A copied OpenAPI file or published derivative could become a competing source of truth | Keep `henter36/nashir` authoritative and prohibit copying/redefining the contract in `henter36/nashir-backend` |
| Prerequisite design sequencing risk | Validation or later implementation could redefine security or lifecycle expectations despite resolved authority locations | Read established authorities only; do not redefine authentication, workspace scope, permissions, non-disclosure, or lifecycle rules |
| Authority location versus readiness risk | A resolved authority location or selected reference mechanism could be mistaken for implementation readiness | Preserve the distinction: authority and alignment are reviewed for planning, while implementation remains blocked |
| Pinning/versioning risk | A floating reference could silently change validation inputs | Require an explicit reviewed commit SHA and auditable update process |
| Credential/access security risk | Cross-repository checkout requires repository access | Require least-privilege, read-only credentials in a later security-reviewed gate |
| CI feasibility risk | The preferred mechanism depends on future workflow design | Require separate planning and review before any CI workflow is added |
| Mechanism-selection creep | This decision could be mistaken for executable configuration authorization | Keep this gate decision-only and preserve the consolidated non-authorization boundary |

## 12. GO / NO-GO Decision

Decision: GO to Contract Reference Mechanism Decision Review Gate, decision-only.

CI multi-repository checkout pinned to an approved `henter36/nashir` commit SHA
is selected as the preferred future contract reference mechanism. This
decision does not authorize its implementation or any validation, CI,
backend, route, auth, permission, generated-client, database, deployment,
production, or pilot work.

## 13. Recommended Next Gate

Recommended Next Gate: Contract Reference Mechanism Decision Review Gate.

## 14. Verification Commands

```bash
git status --short
git diff --stat
grep -E -i -n 'Decision:|Recommended Next Gate|Contract Reference Mechanism Decision Review Gate|decision-only|CI multi-repository checkout|git submodule|pinned contract artifact|manual local path|read-only contract reference|preferred mechanism|source of truth|henter36/nashir|henter36/nashir-backend|contract drift risk|auditability|pinning|versioning|CI feasibility|credential|copying|redefining|drift-detection|does not authorize|must NOT modify|validation scripts|CI workflows|git submodules|publish packages|artifacts|backend implementation|generated clients|SQL migrations|production|pilot' docs/nashir_contract_reference_mechanism_decision_gate.md
git diff --check
```
