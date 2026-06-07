# Nashir Backend Slice 0 Contract-Safe Infrastructure Validation Planning Gate

| Field | Value |
|---|---|
| Gate type | Backend Slice 0 contract-safe infrastructure validation planning |
| Scope | Planning-only; no validation tooling or backend implementation |
| Selected slice | Option A: Backend Slice 0 — contract-safe infrastructure validation only |
| Backend route boundary | `/health` remains the only backend route |
| Contract authority | `henter36/nashir` |

---

## 1. Gate Purpose

This gate plans Backend Slice 0 contract-safe infrastructure validation after
the backend implementation slice planning review selected Option A.

It defines validation requirements, contract-reference decision criteria, and a
future action-gate boundary without implementing validation scripts, changing
the backend, or selecting an executable contract-reference mechanism.

## 2. Inputs Reviewed

| Input | Planning use |
|---|---|
| `docs/nashir_backend_implementation_slice_planning_review_gate.md` | Authorizes this Slice 0 planning gate, review-only |
| `docs/nashir_backend_implementation_slice_planning_gate.md` | Defines Option A and its blocked areas |
| `docs/nashir_auth_rbac_openapi_alignment_final_re_review_gate.md` | Confirms alignment is reviewed for planning |
| `docs/nashir_v1_openapi.yaml` | OpenAPI authority with 62 paths and 90 operations |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC/Workspace Identity authority |
| `docs/nashir_backend_runtime_repository_setup_closure_gate.md` | Confirms `/health` is the only backend route and forbidden implementation is absent |
| `docs/nashir_backend_runtime_stack_decision_gate.md` | Defines selected runtime stack for later authorized work |
| `docs/nashir_backend_runtime_stack_decision_review_gate.md` | Confirms runtime stack decisions and deferred areas |

## 3. Current Authorized State

- Option A is selected: Backend Slice 0 — contract-safe infrastructure
  validation only.
- `/health` remains the only backend route.
- `henter36/nashir` remains the OpenAPI/Auth/RBAC/docs contract authority.
- `henter36/nashir-backend` must not copy, redefine, fork, copy-and-diverge, or
  silently drift from `henter36/nashir` authorities.
- Any future contract reference must be explicit, read-only, pinned, auditable,
  and drift-detectable.
- Alignment is reviewed for planning, not implementation readiness.
- Backend implementation and validation-tooling implementation remain
  unauthorized.

## 4. Slice 0 Scope Definition

Slice 0 is limited to planning infrastructure validation that proves the
runtime skeleton remains contract-safe before any business implementation.

Planned scope:

- validate the runtime skeleton health boundary
- validate OpenAPI authority parsing and inventory from an explicit read-only
  reference
- detect route, operation, permission-metadata, and public-operation drift
- verify `/health` remains the only backend route
- verify no product API routes or workspace-scoped routes exist
- verify absence of generated clients, SQL migrations, migration runner,
  database config, real secrets, auth implementation, and permission
  enforcement implementation
- define contract-reference mechanism decision criteria
- define a future validation action-gate scope and file allowlist

Slice 0 does not implement these checks in this planning gate.

## 5. Contract Reference Mechanism Options

### 1. CI Multi-Repository Checkout

CI could check out a pinned `henter36/nashir` revision alongside
`henter36/nashir-backend` and run read-only validation.

### 2. Git Submodule

The backend could reference a pinned `henter36/nashir` revision through a git
submodule.

### 3. Pinned Contract Artifact/Package

An immutable contract artifact/package could publish the approved OpenAPI
authority at a pinned version or digest.

### 4. Manual Local Path Reference for Development Only

Local validation could accept an explicit path to a separately checked-out
`henter36/nashir` repository. This must never become an implicit source or CI
authority.

### 5. Other Explicit Read-Only Contract Reference Model

A later decision gate may evaluate another mechanism only if it is explicit,
read-only, pinned, auditable, drift-detectable, and preserves
`henter36/nashir` authority.

No option is selected or implemented by this planning gate.

## 6. Contract Reference Mechanism Comparison

| Mechanism | Drift risk | Auditability | Pinning/versioning | Local developer ergonomics | CI feasibility | Credential/access security | Copy/redefinition risk | Governance fit | Implementation authorized now |
|---|---|---|---|---|---|---|---|---|---|
| CI multi-repository checkout | Low if commit pinned | High through workflow logs | Strong commit pin | Moderate | Strong | Requires controlled repository access | Low; no independent copy | Strong for centralized authority | No |
| Git submodule | Low if pin is reviewed | High through git history | Strong commit pin | Moderate; submodule workflow overhead | Strong | Requires repository access | Low, but vendored checkout may be mistaken for authority | Mixed; operational overhead | No |
| Pinned contract artifact/package | Low if immutable digest/version | High with provenance | Strong version/digest | Strong | Strong | Requires artifact access controls | Medium if package publication drifts from authority | Strong only with governed publishing | No |
| Manual local path reference | Medium; developer-selected checkout may be stale | Low to moderate | Weak unless commit checked explicitly | Strong for local development | Weak | Uses local repository access | Low copying risk; high stale-reference risk | Development-only fit | No |
| Other explicit read-only model | Unknown until defined | Must be high | Must be strong | Must be assessed | Must be assessed | Must be assessed | Must prohibit independent authority | Must satisfy current governance | No |

## 7. Recommended Contract Reference Direction

Mechanism selection is DEFERRED to a later **Contract Reference Mechanism
Decision Gate**.

CI multi-repository checkout and a pinned contract artifact/package are the
leading directions for later decision because both can support explicit,
read-only, pinned, auditable, drift-detectable validation. Git submodule,
manual local path reference, and other models remain candidates that require
tradeoff review.

Selecting any mechanism now would imply CI, submodule, package/artifact, local
configuration, credential/access, or repository changes that this planning gate
does not authorize.

Copying `docs/nashir_v1_openapi.yaml` into `henter36/nashir-backend` as an
independent source of truth is prohibited.

## 8. Planned Validation Checks

| Planned check | Required result |
|---|---|
| OpenAPI YAML parse | YAML parse of `docs/nashir_v1_openapi.yaml` succeeds from the authority source |
| Path inventory | Path count remains 62 |
| Operation inventory | Operation count remains 90 |
| Public operation | `getHealth` is the only intentionally public operation |
| Backend health boundary | `/health` remains the only backend route in `henter36/nashir-backend` |
| Product route absence | Confirm no product API routes exist in backend |
| Workspace route absence | Confirm no workspace-scoped routes exist in backend |
| Protected-operation metadata | Read-only validation confirms protected-operation permission/security metadata invariants |
| Generated-client absence | Confirm no generated clients exist |
| SQL migration absence | Confirm no SQL migrations exist |
| Migration runner absence | Confirm no migration runner exists |
| Database config and secrets absence | Confirm no database config or real secrets exist; placeholder documentation remains distinguishable |
| Auth absence | Confirm no auth implementation exists |
| Permission-enforcement absence | Confirm no permission enforcement implementation exists |
| OpenAPI authority-copy absence | Confirm no copied OpenAPI authority file exists in backend as an independent source of truth |
| Contract reference provenance | Confirm any future reference is explicit, read-only, pinned, auditable, and drift-detectable |

The future action gate must define exact commands, expected outputs, allowed
files, failure behavior, and rollback/verification steps.

## 9. Out-of-Scope Areas

The following are outside Slice 0:

- product API routes and workspace-scoped routes
- auth and permission enforcement implementation
- membership or tenant-isolation runtime behavior
- business controllers, services, and repositories
- database connection execution and database config
- SQL migrations and migration runner setup
- ORM/query layer
- generated clients
- CI workflows or contract-reference executable configuration
- deployment config
- production readiness and pilot readiness

## 10. Explicit Non-Authorization Boundary

This planning gate does not authorize, and must NOT modify or add:

- `henter36/nashir-backend` or backend implementation
- OpenAPI, Auth/RBAC documents, or SQL contracts
- validation scripts
- CI workflows
- any CI multi-repository checkout, git submodule, pinned contract
  artifact/package, manual local path, or other contract-reference mechanism as
  executable configuration
- product API routes or workspace-scoped route implementation
- permission enforcement implementation or auth implementation
- generated clients
- SQL migrations, migration runner setup, database config, or ORM/query layer
- environment/secrets config with real values
- deployment config
- production readiness or pilot readiness

## 11. Risk Assessment

| Risk | Planning finding | Control |
|---|---|---|
| Contract drift risk | Backend validation could use a stale, copied, forked, or silently divergent contract | Require an explicit, read-only, pinned, auditable, drift-detectable authority reference |
| Independent authority risk | A copied OpenAPI file could become a backend source of truth | Prohibit copied OpenAPI authority in `henter36/nashir-backend` |
| Mechanism-selection creep | Comparing options could be mistaken for selecting or configuring one | Defer selection to a Contract Reference Mechanism Decision Gate |
| Prerequisite design sequencing risk | Validation or later implementation could redefine Auth/RBAC expectations | Validate against authority without defining authentication, workspace scope, permissions, non-disclosure, or lifecycle rules |
| Route creep risk | Validation planning could add product/workspace routes | Preserve `/health` as the only backend route |
| Secret/config risk | Contract access could introduce credentials or real config | Require later explicit access/security planning; keep real secrets unauthorized |
| CI/workflow risk | CI multi-repository checkout could be implemented prematurely | Keep CI workflows unauthorized |
| Implementation-readiness ambiguity | Validation planning could be mistaken for backend readiness | Keep backend, deployment, production, and pilot readiness blocked |

## 12. GO / NO-GO Decision

Decision: GO to Backend Slice 0 Contract-Safe Infrastructure Validation Planning Review Gate, planning-only.

Slice 0 planning is complete enough for review. Contract-reference mechanism
selection remains deferred. This decision does not authorize validation
scripts, backend implementation, CI workflows, routes, auth, permission
enforcement, generated clients, SQL migrations, database work, deployment,
production readiness, or pilot readiness.

## 13. Recommended Next Gate

Recommended Next Gate: Backend Slice 0 Contract-Safe Infrastructure Validation Planning Review Gate.

## 14. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n 'Decision:|Recommended Next Gate|Backend Slice 0 Contract-Safe Infrastructure Validation Planning Review Gate|planning-only|Slice 0|/health|contract-safe infrastructure validation|CI multi-repository checkout|git submodule|pinned contract artifact|manual local path|read-only contract reference|YAML parse|62|90|getHealth|only backend route|no product API routes|no workspace-scoped|no generated clients|no SQL migrations|no migration runner|no database config|no real secrets|no auth implementation|no permission enforcement|does not authorize|must NOT modify|validation scripts|CI workflows|deployment|production|pilot' docs/nashir_backend_slice_0_contract_safe_infrastructure_validation_planning_gate.md
git diff --check
```
