# Nashir Backend Runtime Repository Setup Planning Gate

| Field | Value |
|---|---|
| Gate type | Backend runtime repository setup planning |
| Scope | Planning-only; no repository setup execution |
| Previous review gate | `docs/nashir_backend_runtime_stack_decision_review_gate.md` |
| Previous decision | Decision: GO to Backend Runtime Repository Setup Planning Gate, review-only. |
| Previous recommended next gate | Backend Runtime Repository Setup Planning Gate |
| Backend repository | `henter36/nashir-backend` |
| Backend repository state | Private, default branch `main`, first commit `1d6b897`, governance-files-only, no longer empty |
| Runtime stack context | TypeScript, Node.js LTS, Fastify, pnpm, Zod, PostgreSQL, node-postgres / pg |
| Contract authority | `henter36/nashir` remains the docs/contracts/governance authority |
| OpenAPI authority location | `docs/nashir_v1_openapi.yaml` is resolved only as the OpenAPI authority location |
| OpenAPI/Auth/RBAC/Workspace Identity alignment | PENDING ALIGNMENT |

---

## 1. Gate Purpose

This planning gate plans the later setup of the
`henter36/nashir-backend` runtime repository after the runtime stack decision
was reviewed.

This gate only plans repository setup. It does not modify
`henter36/nashir-backend`, add package files, add runtime files, install
dependencies, add backend code, add API routes, add SQL migrations, or claim
production or pilot readiness.

---

## 2. Inputs Reviewed

| Input | Reviewed value |
|---|---|
| Previous review gate | `docs/nashir_backend_runtime_stack_decision_review_gate.md` |
| Previous decision | Decision: GO to Backend Runtime Repository Setup Planning Gate, review-only. |
| Previous recommended next gate | Backend Runtime Repository Setup Planning Gate |
| Runtime stack selected and reviewed | TypeScript, Node.js LTS, Fastify, pnpm, Zod, PostgreSQL, node-postgres / pg |
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

## 4. Runtime Stack Context

The selected and reviewed runtime stack is:

- Runtime language: TypeScript
- Runtime: Node.js LTS
- Backend HTTP framework: Fastify
- Package manager: pnpm
- Validation/schema library: Zod
- Database: PostgreSQL
- PostgreSQL driver: node-postgres / pg

This stack context is available for later repository setup planning only. It
does not authorize package files, dependencies, TypeScript config, source files,
tests, Fastify runtime files, database config, migrations, deployment config, or
implementation.

---

## 5. Repository Setup Planning Scope

This planning gate defines what a later repository setup action may add to
`henter36/nashir-backend` after a review gate.

The planning scope may define repository setup strategy for package manifests,
TypeScript configuration, source and test skeletons, lint/format/type-check
configuration, Fastify application shell structure, validation boundaries,
database driver timing, documentation, and CI/check expectations.

This gate does not execute that setup.

---

## 6. Planned Setup Areas

The following setup areas are planned, not executed:

- package manifest strategy for pnpm
- TypeScript configuration strategy
- source directory skeleton strategy
- test directory skeleton strategy
- lint/format/type-check configuration strategy
- Fastify application shell strategy
- healthcheck placeholder strategy
- Zod validation boundary strategy
- node-postgres / pg dependency timing
- environment variable naming policy, without creating env files
- README/setup documentation strategy
- CI/checks planning, without adding workflows now
- repository governance file compatibility
- contract reference strategy back to `henter36/nashir`

---

## 7. Deferred and Blocked Items

The following items remain deferred or blocked:

- ORM or query layer remains DEFERRED.
- Migration runner remains DEFERRED.
- Auth implementation remains DEFERRED.
- Generated clients remain BLOCKED until a later generated-client gate.
- Deployment target remains DEFERRED.
- Environment/secrets config remains DEFERRED.
- Runtime file creation remains DEFERRED until a later setup action gate.

---

## 8. Explicitly Out of Scope

This gate must only plan repository setup.

This gate must NOT modify `henter36/nashir-backend`.
This gate must NOT modify backend repository files.
This gate must NOT add package.json.
This gate must NOT add pnpm-lock.yaml.
This gate must NOT add package files.
This gate must NOT install dependencies.
This gate must NOT add TypeScript config.
This gate must NOT add source files.
This gate must NOT add tests.
This gate must NOT add API routes.
This gate must NOT add Fastify runtime files.
This gate must NOT add database config.
This gate must NOT add environment/secrets config.
This gate must NOT add ORM.
This gate must NOT add SQL migrations.
This gate must NOT add migration runner setup.
This gate must NOT add generated clients.
This gate must NOT add workflows/CI execution.
This gate must NOT add deployment config.
This gate must NOT claim production readiness.
This gate must NOT claim pilot readiness.
This gate must NOT change OpenAPI/Auth/RBAC/SQL contracts.

This gate does not authorize backend implementation.
This gate does not authorize API routes.
This gate does not authorize SQL migrations.
This gate does not authorize migration runner setup.
This gate does not authorize database config.
This gate does not authorize environment/secrets config.
This gate does not authorize ORM.
This gate does not authorize generated clients.
This gate does not authorize package files.
This gate does not authorize package/dependency files.
This gate does not authorize workflows/CI execution.
This gate does not authorize deployment config.
This gate does not authorize production readiness.
This gate does not authorize pilot readiness.

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

## 10. Risk Assessment

| Risk | Planning impact | Mitigation |
|---|---|---|
| Setup planning mistaken for execution | Planning package manifest, TypeScript config, source files, tests, and Fastify runtime files could be mistaken for permission to add them. | Keep this gate planning-only and require a later setup action gate before modifying `henter36/nashir-backend`. |
| Package file creep | pnpm planning could be mistaken for permission to add package.json, pnpm-lock.yaml, package files, or dependencies. | Keep package files unauthorized until a later reviewed action gate. |
| Runtime implementation creep | Planning a Fastify shell or healthcheck placeholder could be mistaken for permission to add backend code or API routes. | Keep source files, tests, Fastify runtime files, and API routes unauthorized. |
| Database setup creep | PostgreSQL and node-postgres / pg planning could be mistaken for database config, ORM, migrations, or migration runner authorization. | Keep database config, ORM, SQL migrations, and migration runner setup deferred and unauthorized. |
| Generated-client timing ambiguity | Contract reference planning could be mistaken for generated-client authorization. | Keep generated clients BLOCKED until a later generated-client gate. |
| Contract drift risk | Downstream repositories could redefine, fork, or diverge from `henter36/nashir` contract authorities. | Keep `henter36/nashir` as the docs/contracts/governance authority. |
| Prerequisite sequencing risk | API Contract/OpenAPI sequencing could be misunderstood. | Preserve PENDING ALIGNMENT until a later explicit Auth/RBAC/OpenAPI alignment gate. |
| Active synchronization ambiguity | Resolved OpenAPI authority location could be mistaken for permission to use the contract as an active downstream synchronization authority. | Block implementation, generated clients, route implementation, permission enforcement, migration/runtime work, and deployment decisions until alignment is established. |
| Production readiness ambiguity | Setup planning could be mistaken for production or pilot readiness. | State that this gate does not authorize production or pilot readiness. |

Prerequisite sequencing detail: Defining or finalizing the API Contract/OpenAPI
before establishing the Auth/RBAC/Workspace Identity design violates the required
design sequence. The Auth/RBAC/Workspace Identity design must be established
first to ensure the OpenAPI contract accurately reflects authentication,
workspace scoping, permission expectations, and related error semantics. The
OpenAPI authority location itself can be resolved, but alignment readiness
remains PENDING ALIGNMENT and must be tracked separately.

---

## 11. GO / NO-GO Decision

Decision: GO to Backend Runtime Repository Setup Planning Review Gate, planning-only.

This decision approves repository setup planning only. It does not authorize
modifying `henter36/nashir-backend`, adding package files, adding package.json,
adding pnpm-lock.yaml, installing dependencies, adding TypeScript config, adding
source files, adding tests, adding API routes, adding Fastify runtime files,
adding database config, adding environment/secrets config, adding ORM, adding
SQL migrations, adding migration runner setup, adding generated clients, adding
workflows/CI execution, adding deployment config, or claiming production or
pilot readiness.

---

## 12. Recommended Next Gate

Recommended Next Gate: Backend Runtime Repository Setup Planning Review Gate.

The next gate reviews this setup plan only.

A later Backend Runtime Repository Setup Action Gate is required before
modifying `henter36/nashir-backend` or adding package/runtime files.

A later Backend Implementation Planning Gate is required before backend code,
API routes, services, repositories, auth, migrations, generated clients, config,
deployment, or tests are added.

---

## 13. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n "GO / NO-GO|Decision:|Recommended Next Gate|planning-only|Runtime Repository Setup Planning Review Gate|TypeScript|Node.js|Fastify|pnpm|Zod|PostgreSQL|node-postgres|pg|DEFERRED|BLOCKED|PENDING ALIGNMENT|active downstream synchronization authority|does not authorize|must NOT modify `henter36/nashir-backend`|package.json|pnpm-lock|package files|TypeScript config|source files|tests|API routes|SQL migrations|deployment config" docs/nashir_backend_runtime_repository_setup_planning_gate.md
```
