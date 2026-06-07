# Nashir Backend Implementation Slice Planning Gate

| Field | Value |
|---|---|
| Gate type | Backend implementation slice planning |
| Scope | Planning-only; no backend implementation authorization |
| Alignment input | `docs/nashir_auth_rbac_openapi_alignment_final_re_review_gate.md` |
| Backend repository | `henter36/nashir-backend` |
| Current backend route boundary | `/health` infrastructure smoke-check only |
| Recommended slice | Option A: Backend Slice 0 — contract-safe infrastructure validation only |

---

## 1. Gate Purpose

This gate plans the safest first backend implementation slice after the final
Auth/RBAC/OpenAPI alignment re-review. It compares candidate slices and defines
the prerequisites and boundaries for the next planning review.

This gate does not implement the recommended slice and does not authorize
backend implementation.

## 2. Inputs Reviewed

| Input | Planning use |
|---|---|
| `docs/nashir_auth_rbac_openapi_alignment_final_re_review_gate.md` | Confirms alignment blockers are resolved for planning purposes and authorizes this planning path only |
| `docs/nashir_v1_openapi.yaml` | OpenAPI authority with 62 paths, 90 operations, 89 protected operations, and `getHealth` as the only intentionally public operation |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | Auth/RBAC and workspace identity authority |
| `docs/nashir_backend_runtime_repository_setup_closure_gate.md` | Confirms the minimal runtime skeleton and `/health` infrastructure-only boundary |
| `docs/nashir_backend_implementation_planning_gate.md` | Identifies backend implementation prerequisites and blocked areas |
| `docs/nashir_backend_implementation_planning_review_gate.md` | Confirms implementation must follow alignment and reviewed slice planning |
| `docs/nashir_backend_runtime_stack_decision_gate.md` | Selects the runtime stack for later planning |
| `docs/nashir_backend_runtime_stack_decision_review_gate.md` | Confirms the selected stack and deferred implementation areas |

## 3. Current Authorized State

Auth/RBAC/OpenAPI alignment blockers are resolved for planning purposes. The
OpenAPI authority is `docs/nashir_v1_openapi.yaml`, and the Auth/RBAC authority
is `docs/nashir_auth_rbac_workspace_identity_gate.md`.

Current approved facts:

- OpenAPI contains 62 paths and 90 operations.
- 89 operations are protected.
- `getHealth` at `GET /health` is the only intentionally public operation.
- The selected runtime stack is TypeScript, Node.js LTS, Fastify, pnpm, Zod,
  PostgreSQL, and node-postgres / pg.
- `henter36/nashir-backend` contains a minimal runtime skeleton.
- Only the `/health` infrastructure smoke-check exists in the backend.
- Existing runtime-skeleton typecheck, lint, format check, and tests were
  verified during repository setup closure.
- This gate is authorized to plan a backend implementation slice, not execute
  one.

## 4. Current Blocked Areas

The following remain blocked or deferred:

- product API routes and workspace-scoped route implementation
- auth implementation and auth provider/token-format selection
- permission enforcement implementation
- service/repository implementation requiring membership, permissions, tenant
  isolation, or database access
- database connection execution and database config
- SQL migrations and migration runner setup
- ORM/query layer
- environment/secrets config with real values
- generated clients
- deployment config and CI workflows
- production readiness and pilot readiness

Reviewed alignment does not satisfy these implementation prerequisites by
itself.

## 5. Candidate Slice Options

### Option A: Backend Slice 0 — Contract-Safe Infrastructure Validation Only

Plan a non-product validation slice that preserves `/health` as the only
backend route. Candidate planning subjects are:

- OpenAPI YAML parsing validation
- route and operation inventory validation against the 62-path/90-operation
  authority
- public-operation validation confirming `getHealth` only
- protected-operation metadata validation without implementing guards
- contract authority and drift checks
- placeholder-only config validation without real values
- test strategy for validation tooling

Option A adds no business route, workspace-scoped route, auth behavior,
permission enforcement, database execution, migration, generated client, or
deployment behavior.

### Option B: Backend Slice 1 — Workspace Identity Read-Only Foundation

Plan a minimal workspace membership/auth boundary.

This option depends on unresolved implementation planning for auth provider and
token format, membership persistence, permission enforcement, non-disclosing
tenant isolation, database config, SQL migrations, migration runner, and
repository/service boundaries. It is not safe as the first slice.

### Option C: Backend Slice 1 — One Read-Only Workspace-Scoped Endpoint

Plan one OpenAPI GET operation as a backend route.

This option still requires auth, active membership resolution, canonical
permission enforcement, non-disclosing 404 behavior, tenant-isolated database
access, ErrorModel behavior, and route-level tests. Those prerequisites are not
authorized or ready. A read-only endpoint is not low risk when its security and
data boundaries are absent.

## 6. Slice Option Risk Comparison

| Analysis dimension | Option A | Option B | Option C |
|---|---|---|---|
| Alignment readiness | Uses reviewed alignment only for validation | Depends on aligned designs plus unplanned runtime auth | Depends on aligned contract plus unplanned route enforcement |
| Runtime repository readiness | Compatible with minimal skeleton | Requires new auth/membership structure | Requires product route structure |
| Auth implementation readiness | Not required | Required; not ready | Required; not ready |
| Permission enforcement readiness | Validates metadata only | Required; not ready | Required; not ready |
| SQL/migration readiness | Not required | Required; blocked | Likely required; blocked |
| Database config/secrets readiness | Placeholder validation only | Required; deferred | Required; deferred |
| OpenAPI route implementation readiness | No route implementation | Premature | Premature |
| Generated client readiness | Not required | Not authorized | Not authorized |
| Test strategy readiness | Existing tooling can support validation planning | Auth and tenant tests are not planned | Route, permission, tenant, and data tests are not planned |
| CI/workflow readiness | May plan checks; must not add CI | CI remains unauthorized | CI remains unauthorized |
| Contract drift risk | Lowest; validates authority without copying it | Risk of backend-local auth semantics | Risk of backend-local route/permission semantics |
| Tenant isolation risk | None introduced | High | High |
| Implementation creep risk | Lowest | High | High |
| Planning conclusion | Recommended | Not ready | Not ready |

## 7. Recommended Slice

The selected recommended slice is **Option A: Backend Slice 0 — contract-safe
infrastructure validation only**.

Option A is the safest next planning path because it can improve confidence in
contract consumption and drift detection without introducing product behavior,
workspace scope, auth, permission enforcement, database execution, or generated
artifacts.

The next review gate must keep `/health` as the only backend route and decide
whether the proposed validation-only scope is narrow enough for a later
explicit action gate.

Options B and C remain blocked until their auth, permission, tenant isolation,
database, migration, repository/service, and testing prerequisites are planned
and reviewed.

## 8. Required Prerequisites Before Implementation

Before any implementation action gate, Option A requires:

- exact validation-tooling scope and file-change allowlist
- confirmation that validation reads `docs/nashir_v1_openapi.yaml` from the
  authority repository without copying or redefining it
- contract drift check design and expected failure behavior
- route inventory invariants for 62 paths, 90 operations, 89 protected
  operations, and `getHealth` only public
- confirmation that no Fastify product/workspace route registration is added
- placeholder-only configuration validation rules
- focused unit/test plan for validation tooling
- command and check plan using existing backend repository tooling
- explicit exclusion of generated clients and active OpenAPI synchronization
- later action-gate file allowlist and rollback/verification plan

Before Option B or C may be reconsidered, additional prerequisites include:

- auth implementation planning and review
- permission enforcement planning and review
- workspace membership and non-disclosing tenant-isolation enforcement plan
- database config/secrets planning
- SQL migration and migration runner planning
- ORM/query layer or SQL access decision
- service/repository boundary planning
- ErrorModel runtime behavior plan
- route-level and tenant-isolation test strategy

## 9. Allowed Scope For Next Gate

The Backend Implementation Slice Planning Review Gate may:

- review Option A as the selected planning path
- review proposed OpenAPI parsing and invariant checks
- review route inventory, public-operation, permission-metadata, and contract
  drift validation plans
- review placeholder-only config validation planning
- review test strategy and a possible later action-gate file allowlist
- confirm that `/health` remains the only route
- reject or narrow any item that risks implementation creep

The next gate remains planning/review-only. It may not execute Option A or
authorize Options B or C.

## 10. Explicit Non-Authorization Boundary

This planning gate does not authorize, and must NOT modify or add:

- `henter36/nashir-backend` or backend implementation
- OpenAPI, Auth/RBAC documents, or SQL contracts
- product API routes or workspace-scoped route implementation
- permission enforcement implementation or auth implementation
- services, repositories, controllers, or database connection execution
- generated clients
- SQL migrations, migration runner setup, database config, or ORM/query layer
- environment/secrets config with real values
- deployment config or CI workflows
- production readiness or pilot readiness

Option A is selected for planning only. No validation tooling or backend file
change is authorized by this gate.

## 11. Risk Assessment

| Risk | Planning finding | Control |
|---|---|---|
| Contract drift risk | Backend or validation tooling could copy, redefine, fork, or diverge from `henter36/nashir` authorities | Plan read-only authority validation and reject copied contract authority |
| Tenant isolation risk | Options B and C would introduce workspace behavior before runtime enforcement exists | Keep all workspace-scoped routes and membership behavior blocked |
| Auth/permission sequencing risk | Route work could begin before auth and permission enforcement planning | Keep Options B and C blocked |
| Database sequencing risk | A route slice could force premature database config, migrations, or query-layer choices | Keep database-backed work blocked |
| Implementation creep risk | Infrastructure validation planning could expand into runtime or business behavior | Require a narrow allowlist, `/health`-only route invariant, and later action gate |
| Active synchronization risk | Validation could be mistaken for generated-client or contract synchronization authorization | Permit planning of checks only; keep generated clients and synchronization unauthorized |
| Test confidence risk | Existing tests cover the runtime skeleton, not auth, tenant isolation, or business routes | Limit Option A to validation planning and require separate test strategy before later slices |
| CI/workflow risk | Planned checks could be mistaken for permission to add workflows | Keep CI workflows unauthorized |
| Production/pilot readiness risk | A validated skeleton could be mistaken for deployable product behavior | Keep deployment, production, and pilot readiness deferred |

## 12. GO / NO-GO Decision

Decision: GO to Backend Implementation Slice Planning Review Gate, planning-only.

The planning gate is complete. Option A is selected as the safest next planning
path. This decision does not authorize Option A execution, backend
implementation, product API routes, workspace-scoped routes, permission
enforcement, auth, database work, generated clients, deployment, production
readiness, or pilot readiness.

## 13. Recommended Next Gate

Recommended Next Gate: Backend Implementation Slice Planning Review Gate.

## 14. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n 'Decision:|Recommended Next Gate|Backend Implementation Slice Planning Review Gate|planning-only|Option A|Option B|Option C|recommended slice|/health|62 paths|90 operations|89 protected|getHealth|TypeScript|Node.js|Fastify|pnpm|Zod|PostgreSQL|node-postgres|does not authorize|must NOT modify|product API routes|workspace-scoped|permission enforcement|generated clients|SQL migrations|migration runner|database config|auth implementation|deployment config|production|pilot' docs/nashir_backend_implementation_slice_planning_gate.md
git diff --check
```
