# Nashir Backend Runtime Stack Decision Gate

| Field | Value |
|---|---|
| Gate type | Backend runtime stack decision |
| Scope | Documentation-only decision; later implementation planning only |
| Previous review gate | `docs/nashir_backend_runtime_stack_decision_planning_review_gate.md` |
| Previous decision | Decision: GO to Backend Runtime Stack Decision Gate, review-only. |
| Previous recommended next gate | Backend Runtime Stack Decision Gate |
| Related merge | PR #143 merged the Backend Runtime Stack Decision Planning Review Gate |
| Backend repository | `henter36/nashir-backend` |
| Backend repository state | Private, default branch `main`, first commit `1d6b897`, governance-files-only, no longer empty |
| Contract authority | `henter36/nashir` remains the docs/contracts/governance authority |
| OpenAPI authority location | `docs/nashir_v1_openapi.yaml` is resolved only as the OpenAPI authority location |
| OpenAPI/Auth/RBAC/Workspace Identity alignment | PENDING ALIGNMENT |

---

## 1. Gate Purpose

This gate decides the Nashir backend runtime stack at documentation and decision
level only.

This decision is for later implementation planning only. It does not modify
`henter36/nashir-backend`, add runtime files, add package files, implement
backend code, add API routes, add migrations, configure deployment, or claim
production or pilot readiness.

---

## 2. Inputs Reviewed

| Input | Reviewed value |
|---|---|
| Previous review gate | `docs/nashir_backend_runtime_stack_decision_planning_review_gate.md` |
| Previous decision | Decision: GO to Backend Runtime Stack Decision Gate, review-only. |
| Previous recommended next gate | Backend Runtime Stack Decision Gate |
| Related merge | PR #143 merged the Backend Runtime Stack Decision Planning Review Gate |
| Backend repository | `henter36/nashir-backend` |
| Backend first commit | `1d6b897 docs: bootstrap nashir backend governance files` |
| First commit scope | Governance-files-only |
| Backend empty status | No longer empty |
| Contract authority | `henter36/nashir` remains the docs/contracts/governance authority |
| Backend implementation authorization | Not authorized |
| OpenAPI/Auth/RBAC/Workspace Identity alignment | PENDING ALIGNMENT |

---

## 3. Current Confirmed Backend Repository State

| Repository state item | Confirmed state |
|---|---|
| Repository | `henter36/nashir-backend` exists |
| Visibility | Private |
| Default branch | `main` |
| First commit | `1d6b897 docs: bootstrap nashir backend governance files` |
| First commit scope | Governance-files-only |
| Empty status | No longer empty |
| Docs/contracts/governance authority | `henter36/nashir` |
| Backend implementation | Not authorized |

---

## 4. Runtime Stack Decision

The Nashir backend runtime stack is selected for later implementation planning
only.

This gate selects the runtime stack direction so later planning gates can define
repository setup, package files, runtime file creation, testing, implementation,
migration, auth, generated-client, config, and deployment sequencing.

This gate does not authorize creating or modifying those files.

---

## 5. Selected Stack

| Decision area | Selection |
|---|---|
| Runtime language | TypeScript |
| Runtime | Node.js LTS |
| Backend HTTP framework | Fastify |
| Package manager | pnpm |
| Validation/schema library | Zod |
| Unit testing | Vitest |
| Route-level HTTP testing | Supertest or equivalent HTTP test utility when routes are later authorized |
| Type-checking | TypeScript compiler |
| Linting | ESLint |
| Formatting | Prettier |
| Database | PostgreSQL |
| PostgreSQL driver | node-postgres / pg |

---

## 6. Deferred Decisions

The following decisions remain DEFERRED or blocked:

- ORM or query layer is DEFERRED.
- Migration runner is DEFERRED.
- Auth implementation is DEFERRED.
- Generated clients are BLOCKED until a later generated-client gate.
- Deployment target is DEFERRED.
- Environment/secrets config is DEFERRED.
- Runtime file creation is DEFERRED.

---

## 7. Alternatives Considered

| Alternative | Decision |
|---|---|
| NestJS | Rejected for now because it may introduce framework structure and decorators before repository/service boundaries are authorized. |
| Express | Rejected because Fastify is preferred for stronger plugin/schema-oriented API structure. |
| Bun | Rejected for V1 backend governance due to operational maturity and team predictability concerns. |
| Deno | Rejected for V1 backend governance due to operational maturity and team predictability concerns. |
| Prisma as immediate ORM | Deferred, not rejected permanently, because ORM selection before repository and migration runner gates may create schema drift or migration authority ambiguity. |
| Drizzle as immediate query layer | Deferred, not rejected permanently, for the same reason. |
| .NET | Rejected for this decision path because the current Nashir/frontend/governance flow is more aligned with TypeScript/Node and contract-first lightweight API development. |

---

## 8. Decision Rationale

TypeScript aligns with the existing frontend/API-contract ecosystem and improves
contract typing later.

Node.js LTS with Fastify provides a lightweight API-first backend foundation
without the structural weight of a heavier framework.

Fastify is suitable for schema-oriented HTTP services and can support OpenAPI
integration later without forcing generated clients now.

pnpm is selected for deterministic and efficient package management later, but
package files remain unauthorized in this gate.

Zod is selected as the intended validation layer because it supports explicit
runtime validation and typed service boundaries later.

PostgreSQL remains the database direction based on the SQL/schema planning
sequence.

node-postgres / pg is selected as the low-level driver because it can support
SQL-first governance without forcing an ORM decision prematurely.

ORM/query layer remains deferred because repository/service implementation
boundaries and migration runner decisions must be reviewed separately.

Migration runner remains deferred because migration execution and runner setup
remain explicitly unauthorized.

Auth implementation remains deferred because OpenAPI/Auth/RBAC/Workspace
Identity alignment remains PENDING ALIGNMENT.

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

Future gates must distinguish contract drift risk from prerequisite design
sequencing risk.

Contract drift risk: downstream repositories must not redefine, fork, or
diverge from `henter36/nashir` contract authorities.

Prerequisite sequencing risk: Defining or finalizing the API Contract/OpenAPI
before establishing the Auth/RBAC/Workspace Identity design violates the
required design sequence. The Auth/RBAC/Workspace Identity design must be
established first to ensure the OpenAPI contract accurately reflects
authentication, workspace scoping, permission expectations, and related error
semantics. The OpenAPI authority location itself can be resolved, but alignment
readiness remains PENDING ALIGNMENT and must be tracked separately.

---

## 10. Explicit Non-Authorization Boundary

This decision gate must NOT modify henter36/nashir-backend.
This decision gate must NOT modify backend repository files.
This decision gate must NOT add package files.
This decision gate must NOT implement backend code.
This decision gate must NOT add API routes.
This decision gate must NOT add SQL migrations.
This decision gate must NOT add migration runner setup.
This decision gate must NOT add database config.
This decision gate must NOT add environment/secrets config.
This decision gate must NOT add ORM.
This decision gate must NOT add generated clients.
This decision gate must NOT add package/dependency files.
This decision gate must NOT add workflows/CI execution.
This decision gate must NOT add deployment config.
This decision gate must NOT claim production readiness.
This decision gate must NOT claim pilot readiness.
This decision gate must NOT change OpenAPI/Auth/RBAC/SQL contracts.

This decision gate does not authorize backend implementation.
This decision gate does not authorize API routes.
This decision gate does not authorize SQL migrations.
This decision gate does not authorize migration runner setup.
This decision gate does not authorize database config.
This decision gate does not authorize environment/secrets config.
This decision gate does not authorize ORM.
This decision gate does not authorize generated clients.
This decision gate does not authorize package files.
This decision gate does not authorize package/dependency files.
This decision gate does not authorize workflows/CI execution.
This decision gate does not authorize deployment config.
This decision gate does not authorize production readiness.
This decision gate does not authorize pilot readiness.

---

## 11. Risk Assessment

| Risk | Decision impact | Mitigation |
|---|---|---|
| Decision mistaken for implementation authorization | Selecting TypeScript, Node.js LTS, Fastify, pnpm, Zod, PostgreSQL, and node-postgres / pg could be mistaken for permission to add runtime files. | State that this gate is documentation-only and requires later setup and implementation planning gates. |
| Package file creep | Selecting pnpm could be mistaken for permission to add package files or package/dependency files. | Keep package files unauthorized until a later Backend Runtime Repository Setup Planning Gate and approved action. |
| ORM timing ambiguity | Selecting PostgreSQL and node-postgres / pg could be mistaken for selecting an ORM. | Keep ORM or query layer DEFERRED. |
| Migration runner ambiguity | Selecting PostgreSQL could be mistaken for authorizing migrations or migration runner setup. | Keep SQL migrations and migration runner DEFERRED and unauthorized. |
| Generated-client timing ambiguity | Fastify and OpenAPI compatibility could be mistaken for permission to generate clients. | Keep generated clients BLOCKED until a later generated-client gate. |
| Contract drift risk | Downstream repositories could redefine, fork, or diverge from `henter36/nashir` contract authorities. | Keep `henter36/nashir` as the docs/contracts/governance authority. |
| Prerequisite sequencing risk | API Contract/OpenAPI sequencing could be misunderstood. | Preserve PENDING ALIGNMENT until a later explicit Auth/RBAC/OpenAPI alignment gate. |
| Active synchronization ambiguity | Resolved OpenAPI authority location could be mistaken for permission to use the contract as an active downstream synchronization authority. | Block implementation, generated clients, route implementation, permission enforcement, migration/runtime work, and deployment decisions until alignment is established. |
| Production readiness ambiguity | Runtime stack selection could be mistaken for production or pilot readiness. | State that this decision gate does not authorize production or pilot readiness. |

Prerequisite sequencing detail: Defining or finalizing the API Contract/OpenAPI
before establishing the Auth/RBAC/Workspace Identity design violates the required
design sequence. The Auth/RBAC/Workspace Identity design must be established
first to ensure the OpenAPI contract accurately reflects authentication,
workspace scoping, permission expectations, and related error semantics. The
OpenAPI authority location itself can be resolved, but alignment readiness
remains PENDING ALIGNMENT and must be tracked separately.

---

## 12. GO / NO-GO Decision

Decision: GO - backend runtime stack selected for later implementation planning only.

This GO decision selects the backend runtime stack at documentation/decision
level only. It does not authorize backend implementation, API routes, SQL
migrations, migration runner setup, database config, environment/secrets config,
ORM, generated clients, package files, package/dependency files, workflows/CI
execution, deployment config, production readiness, or pilot readiness.

---

## 13. Recommended Next Gate

Recommended Next Gate: Backend Runtime Stack Decision Review Gate.

The next gate reviews the stack decision only.

A later Backend Runtime Repository Setup Planning Gate is required before adding
package files or runtime repository files.

A later Backend Implementation Planning Gate is required before backend code,
API routes, services, repositories, migrations, auth, generated clients, config,
deployment, or tests are added.

---

## 14. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n "GO / NO-GO|Decision:|Recommended Next Gate|TypeScript|Node.js|Fastify|pnpm|Zod|PostgreSQL|node-postgres|pg|DEFERRED|PENDING ALIGNMENT|active downstream synchronization authority|does not authorize|must NOT modify henter36/nashir-backend|package files|ORM|generated clients|API routes|migrations|deployment config" docs/nashir_backend_runtime_stack_decision_gate.md
```
