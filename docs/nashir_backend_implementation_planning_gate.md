# Nashir Backend Implementation Planning Gate

| Field | Value |
|---|---|
| Gate type | Backend implementation planning |
| Scope | Planning-only; no backend implementation authorization |
| Previous closure gate | `docs/nashir_backend_runtime_repository_setup_closure_gate.md` |
| Previous decision | Decision: GO - backend runtime repository setup sequence closed. |
| Previous recommended next gate | Backend Implementation Planning Gate |
| Backend repository | `henter36/nashir-backend` |
| Backend setup PR | `henter36/nashir-backend` PR #1 |
| Backend setup merge commit | `7db0dd6` |
| Nashir closure PR | `henter36/nashir` PR #151 |
| Nashir closure merge commit | `1450a87` |
| OpenAPI/Auth/RBAC/Workspace Identity alignment | PENDING ALIGNMENT |

---

## 1. Gate Purpose

This planning gate plans Nashir backend implementation sequencing after the
runtime repository setup sequence was closed.

This gate plans prerequisites, blocked work, candidate sequencing paths, and
safe next gates. It does not authorize backend implementation and must NOT
modify `henter36/nashir-backend`.

---

## 2. Inputs Reviewed

| Input | Reviewed value |
|---|---|
| Previous closure gate | `docs/nashir_backend_runtime_repository_setup_closure_gate.md` |
| Previous decision | Decision: GO - backend runtime repository setup sequence closed. |
| Previous recommended next gate | Backend Implementation Planning Gate |
| Backend repository | `henter36/nashir-backend` |
| Backend setup PR and merge | PR #1, merge commit `7db0dd6` |
| Nashir closure PR and merge | PR #151, merge commit `1450a87` |
| Runtime stack | TypeScript, Node.js LTS, Fastify, pnpm, Zod, PostgreSQL, node-postgres / pg |
| Current route boundary | `/health` infrastructure smoke-check route only |
| Contract authority | `henter36/nashir` |
| Alignment status | PENDING ALIGNMENT |

---

## 3. Current Backend Runtime Setup State

The `henter36/nashir-backend` runtime repository setup skeleton is complete.

The selected runtime stack is:

- TypeScript
- Node.js LTS
- Fastify
- pnpm
- Zod
- PostgreSQL
- node-postgres / pg

Only the `/health` infrastructure smoke-check route exists.

No product API routes, workspace-scoped routes, SQL migrations, ORM/query layer,
auth implementation, generated clients, deployment config, production
readiness, or pilot readiness exist or are authorized.

---

## 4. Implementation Planning Scope

This planning gate may:

- identify implementation prerequisites
- identify blocked implementation work
- identify what may be planned next
- identify what cannot be implemented yet
- define safe sequencing toward backend implementation
- determine whether a Backend Implementation Planning Review Gate may proceed
- compare alignment-first and tightly limited implementation-slice planning
  paths

This planning gate must not select or implement a backend slice that depends on
unresolved Auth/RBAC/OpenAPI alignment.

---

## 5. Critical Alignment Constraint

OpenAPI/Auth/RBAC/Workspace Identity alignment remains PENDING ALIGNMENT.

Therefore, workspace-scoped routes, permission enforcement, product API routes,
generated clients, and database-backed implementation remain BLOCKED until a
later explicit alignment gate resolves the required contract and design
sequencing.

The active downstream synchronization authority restriction remains in effect.

---

## 6. Implementation Prerequisites

The following prerequisites must be planned and reviewed before backend
implementation:

- Auth/RBAC/OpenAPI alignment gate
- backend route boundary planning
- repository/service boundary planning
- SQL migration runner planning
- ORM/query layer decision gate
- environment/secrets config planning
- generated-client timing gate
- database connection/config planning
- testing strategy expansion beyond healthcheck
- ErrorModel and permission enforcement alignment
- workspace scoping enforcement plan
- CI/checks planning if later authorized
- backend implementation slice planning after prerequisites

These prerequisites are planning inputs only and do not authorize their
execution.

---

## 7. Blocked Implementation Areas

The following implementation areas remain BLOCKED:

- product API routes
- workspace-scoped routes
- business routes
- controllers
- services
- repositories
- database connection execution
- SQL migrations
- migration runner setup
- ORM/query layer
- auth implementation
- generated clients
- environment/secrets config with real values
- deployment config
- CI workflows
- production readiness
- pilot readiness

---

## 8. Candidate Sequencing Options

### Option A: Alignment-First Planning

Proceed to an Auth/RBAC/OpenAPI Alignment Planning Gate before any product or
workspace-scoped route planning.

This option resolves prerequisite authentication, workspace scoping, permission
expectations, and related contract semantics before backend implementation slice
planning.

### Option B: Tightly Limited Slice 0 Planning

Proceed to a Backend Implementation Slice 0 Planning Gate limited to
non-product internal structure only.

This option must remain planning-only. It must not authorize routes, database
connection execution, SQL migrations, auth, generated clients, product
behavior, or implementation until reviewed.

---

## 9. Preferred Next Planning Path

The preferred path is an Auth/RBAC/OpenAPI Alignment Planning Gate before
product or workspace-scoped backend implementation planning.

This path is preferred because alignment remains PENDING ALIGNMENT and route,
security, workspace-scoping, permission, and error semantics depend on that
alignment.

The Backend Implementation Planning Review Gate should decide whether the next
path is:

- Auth/RBAC/OpenAPI Alignment Planning Gate before any implementation slice; or
- a tightly limited implementation-slice planning gate that does not authorize
  routes, database, auth, generated clients, or product behavior.

---

## 10. Explicit Non-Authorization Boundary

This planning gate must NOT modify `henter36/nashir-backend`.
This planning gate must NOT add backend implementation.
This planning gate must NOT authorize product API routes.
This planning gate must NOT authorize workspace-scoped routes.
This planning gate must NOT authorize SQL migrations.
This planning gate must NOT authorize migration runner setup.
This planning gate must NOT authorize database config.
This planning gate must NOT authorize environment/secrets config with real
values.
This planning gate must NOT authorize ORM.
This planning gate must NOT authorize generated clients.
This planning gate must NOT authorize deployment config.
This planning gate must NOT authorize CI workflows.
This planning gate must NOT authorize production readiness.
This planning gate must NOT authorize pilot readiness.
This planning gate must NOT change OpenAPI/Auth/RBAC/SQL contracts.

This planning gate does not authorize backend implementation.
This planning gate does not authorize product API routes.
This planning gate does not authorize workspace-scoped routes.
This planning gate does not authorize SQL migrations.
This planning gate does not authorize migration runner setup.
This planning gate does not authorize database config.
This planning gate does not authorize environment/secrets config with real
values.
This planning gate does not authorize ORM.
This planning gate does not authorize generated clients.
This planning gate does not authorize deployment config.
This planning gate does not authorize CI workflows.
This planning gate does not authorize production readiness.
This planning gate does not authorize pilot readiness.

---

## 11. Contract Authority and Alignment Boundary

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

## 12. Risk Assessment

| Risk | Planning impact | Mitigation |
|---|---|---|
| Planning mistaken for implementation authorization | A backend implementation plan could be mistaken for permission to add routes, services, repositories, or database behavior. | Keep this gate planning-only and require later review and action gates. |
| Premature product route planning | Product API routes could be planned before Auth/RBAC/OpenAPI alignment resolves route and security semantics. | Prefer the Auth/RBAC/OpenAPI Alignment Planning Gate first. |
| Workspace scoping ambiguity | Workspace-scoped behavior could be designed before the enforcement model is aligned. | Keep workspace-scoped routes BLOCKED until alignment. |
| Database sequencing ambiguity | Database-backed implementation could begin before migration runner and ORM/query layer decisions. | Keep database execution and SQL migrations BLOCKED. |
| Generated-client timing ambiguity | Generated clients could be created before alignment and contract readiness. | Keep generated clients BLOCKED until a later generated-client gate. |
| Contract drift risk | The backend repository could redefine, fork, or diverge from `henter36/nashir` authorities. | Preserve `henter36/nashir` as docs/contracts/governance authority. |
| Prerequisite sequencing risk | API Contract/OpenAPI sequencing could be misunderstood. | Preserve PENDING ALIGNMENT and require alignment-first planning. |
| Production readiness ambiguity | Planning could be mistaken for production or pilot readiness. | State that this planning gate does not authorize production or pilot readiness. |

---

## 13. GO / NO-GO Decision

Decision: GO to Backend Implementation Planning Review Gate, planning-only.

This decision advances implementation sequencing planning only. It does not
authorize backend implementation, product API routes, workspace-scoped routes,
SQL migrations, migration runner setup, database config, environment/secrets
config with real values, ORM, generated clients, deployment config, CI
workflows, production readiness, or pilot readiness.

---

## 14. Recommended Next Gate

Recommended Next Gate: Backend Implementation Planning Review Gate.

The review gate should decide whether the next path is Auth/RBAC/OpenAPI
Alignment Planning Gate before any implementation slice, or a tightly limited
implementation-slice planning gate that does not authorize routes, database,
auth, generated clients, or product behavior.

---

## 15. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n 'GO / NO-GO|Decision:|Recommended Next Gate|planning-only|Backend Implementation Planning Review Gate|Auth/RBAC/OpenAPI Alignment Planning Gate|1450a87|7db0dd6|PENDING ALIGNMENT|active downstream synchronization authority|BLOCKED|DEFERRED|does not authorize|must NOT modify|product API routes|workspace-scoped routes|SQL migrations|migration runner|ORM|generated clients|deployment config|production|pilot' docs/nashir_backend_implementation_planning_gate.md
```
