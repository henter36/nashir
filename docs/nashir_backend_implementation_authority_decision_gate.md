# Nashir Backend Implementation Authority Decision Gate

| Field | Value |
|---|---|
| Gate type | Backend implementation authority decision — documentation only |
| Status date | 2026-06-21 |
| Scope | Decides which repository is the sole current Backend/API implementation authority for Nashir, and the governance status of `henter36/nashir-backend` |
| Implementation approved | NO |
| Repository archival/deletion/migration approved | NO |
| OpenAPI/Auth/RBAC/migration/CI/deployment changes approved | NO |

---

## 1. Decision

**GO:** `henter36/nashir/apps/api` is established as the sole current Backend/API implementation authority for Nashir.

**NO-GO:** No new implementation work — routes, runtime logic, migrations, contract changes, or releases — may begin in `henter36/nashir-backend`.

**NO-GO:** No automatic archival, deletion, code migration, or history rewrite of `henter36/nashir-backend` is authorized by this decision.

This decision is documentation-only. It does not change runtime behavior, CI, OpenAPI, migrations, generated clients, or any repository setting.

---

## 2. Problem

Two repositories currently appear to have a claim on backend implementation authority: `henter36/nashir/apps/api`, where active backend work (Product API runtime wiring, local DB-backed validation, migrations, tests, Auth/RBAC foundations, contract validation, and runtime conformance work) is underway, and `henter36/nashir-backend`, a separate repository originally designated as the backend home and bootstrapped with governance-files-only content.

Leaving this ambiguous creates the following operational risks:

- **Contract drift** — the two repositories could diverge on what the OpenAPI contract, route shapes, or error semantics are.
- **Migration drift** — schema migrations could be written independently in both repositories, producing incompatible database states.
- **Duplicated runtime implementations** — the same route family could be implemented twice with different behavior.
- **CI divergence** — each repository's CI could validate against different assumptions, masking failures.
- **Deployment ambiguity** — it would be unclear which repository's build artifact is the one intended for release.
- **Agent execution against the wrong repository** — an agent or developer could implement a change in the legacy repository under the mistaken belief that it is current.
- **Security fixes applied to only one copy** — a vulnerability fixed in one repository could remain unpatched in the other.
- **Uncertainty over production release ownership** — without a stated authority, it is unclear which repository's history and tags would back a production release.

---

## 3. Current authority map

| Area | Authority |
|---|---|
| Product UI | `henter36/nashir/src` |
| Product and governance documentation | `henter36/nashir/docs` |
| Canonical OpenAPI | `henter36/nashir/docs/nashir_v1_openapi.yaml` |
| Backend/API implementation | `henter36/nashir/apps/api` |
| Backend migrations | `henter36/nashir/apps/api` |
| Backend tests | `henter36/nashir/apps/api` |
| Legacy backend history/reference | `henter36/nashir-backend` |

This table records implementation authority location. It does not assert that all documented contracts are production-ready or that Auth/RBAC/Workspace Identity alignment with the OpenAPI contract is complete. Contract alignment readiness remains tracked separately in the existing Auth/RBAC/OpenAPI alignment gate sequence.

---

## 4. Status of henter36/nashir-backend

`henter36/nashir-backend` is classified as a **legacy/reference repository**. It is:

- read-only by governance policy for new feature implementation,
- not the current implementation authority,
- not authorized for new migrations, routes, runtime fixes, contract edits, or releases.

Urgent security investigation may inspect `henter36/nashir-backend` (for example, to check whether a vulnerability found in `apps/api` also exists there historically). Inspection alone is permitted. Any remediation in `henter36/nashir-backend` requires an explicit decision on a case-by-case basis and must not silently create a parallel implementation track.

---

## 5. Allowed actions after this decision

- Continue approved backend work under `henter36/nashir/apps/api`, subject to existing gates.
- Reference historical commits from `henter36/nashir-backend` for context or comparison.
- Compare implementations between the two repositories for migration-planning or security analysis.
- Prepare a separate, future archival/redirect decision for `henter36/nashir-backend`.

---

## 6. Forbidden actions

Without a new, dedicated decision, the following are forbidden:

- Implementing the same feature in both repositories.
- Copying changes bidirectionally between the two repositories.
- Treating `henter36/nashir-backend` as a manually synchronized backup.
- Publishing releases from `henter36/nashir-backend`.
- Moving code out of or deleting history in `henter36/nashir-backend`.
- Archiving or deleting `henter36/nashir-backend`.
- Changing the visibility of `henter36/nashir-backend`.

---

## 7. Migration and archival boundary

This decision does not claim that every useful commit, control, or artifact in `henter36/nashir-backend` has been migrated to `henter36/nashir/apps/api`.

A separate inventory must be completed before any archival decision is made. That inventory should cover: runtime code, tests, migrations, security controls, CI configuration, documentation, tags, releases, issues, and open pull requests in `henter36/nashir-backend`.

Archival of `henter36/nashir-backend` is **NO-GO** until that inventory confirms there is no unpreserved implementation authority or operational dependency remaining in the legacy repository.

---

## 8. Consequences

**Short-term:**

- Agents and developers receive one clear implementation target for backend work.
- No further backend implementation split occurs.
- Contract and migration drift risk is reduced.

**Long-term:**

- CI and release ownership become simpler to reason about.
- The deployment pipeline has one clear source repository.
- Security patch divergence risk is lowered.
- Production readiness assessment has a single backend codebase to evaluate.

**Cost:**

- `henter36/nashir` becomes a larger governed monorepo containing both frontend and backend code.
- Frontend and backend CI boundaries inside `henter36/nashir` must remain explicit.
- Path-based CI checks and CODEOWNERS rules may be needed later to keep the frontend and backend boundaries enforced as the monorepo grows.

---

## 9. Explicit non-go decisions

This decision does not authorize:

- repository archival,
- code migration,
- history rewriting,
- branch deletion,
- CI removal,
- package publication changes,
- deployment changes,
- production readiness,
- pilot readiness,
- additional backend route families,
- OpenAPI changes,
- generated client changes,
- Auth/RBAC expansion,
- schema or migration changes.

---

## 10. Acceptance criteria

- The sole current backend implementation authority is unambiguous: `henter36/nashir/apps/api`.
- The legacy repository status of `henter36/nashir-backend` is unambiguous: legacy/reference, not authorized for new implementation.
- No repository operation (archive, delete, rename, redirect, visibility change) is authorized by this gate.
- No runtime, CI, OpenAPI, migration, package, lockfile, or generated-code change is authorized by this gate.
- No production or pilot readiness claim is made by this gate.
