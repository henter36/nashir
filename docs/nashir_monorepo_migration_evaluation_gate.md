# Nashir Monorepo Migration Evaluation Gate

| Field | Value |
|---|---|
| Gate type | Monorepo migration evaluation gate |
| Scope | Documentation-only evaluation; no migration implementation |
| Target backend repository under evaluation | `henter36/nashir-backend` |
| Current repository authority | `henter36/nashir` remains the Nashir Product UI and docs/contracts/governance authority |
| Recommended option | Move `nashir-backend` into `nashir` as `apps/api` with history preservation where feasible |
| Decision | GO to planning only; NO-GO to migration implementation in this PR |

---

## 1. Decision Summary

Decision: **GO to monorepo migration planning only.**

This gate evaluates whether Nashir should later move `henter36/nashir-backend`
into `henter36/nashir` as part of a governed monorepo. It does not perform the
move, create directories, alter package scripts, modify CI, change OpenAPI,
regenerate types, or change frontend/backend runtime behavior.

Recommended direction: move `nashir-backend` into `nashir` as `apps/api` while
preserving git history as much as practical, preferably through a reviewed git
subtree/history-preserving import. The implementation requires a separate
explicit authorization PR with exact allowed files, commands, rollback steps,
and verification.

## 2. Current Repository Model

The current model is separate repositories:

- `henter36/nashir`: approved Nashir Product UI source and
  docs/contracts/governance authority.
- `henter36/nashir-backend`: separate private backend runtime repository.
- `docs/nashir_v1_openapi.yaml`: current Nashir V1 OpenAPI authority inside
  `henter36/nashir`.
- `src/generated/creator-studio-openapi-types/index.d.ts`: downstream generated
  type artifact, generated from `docs/nashir_v1_openapi.yaml`.

Current verified constraints:

- Nashir UI is React/Vite, mock-only, and not production-ready.
- `nashir-backend` has a repository-setup-only runtime skeleton.
- `/health` remains the only backend route.
- Product API routes, workspace-scoped routes, SQL migrations, migration runner,
  ORM/query layer, generated clients, real secrets, deployment config,
  production readiness, and pilot readiness remain unauthorized unless a later
  gate explicitly authorizes them.
- Current frontend CI validates lint, UI screen inventory, and build for the
  frontend repository.

Constraint provenance:

- React/Vite and mock-only UI status are established by `README.md` and
  `docs/nashir_openapi_source_of_truth_gate.md`.
- OpenAPI authority and generated type downstream status are established by
  `docs/nashir_openapi_source_of_truth_gate.md`.
- Backend runtime setup-only and `/health` boundary are established by
  `docs/nashir_backend_runtime_repository_setup_closure_gate.md`.

## 3. Why Monorepo Is Being Considered

Monorepo consolidation is being considered because the current cross-repository
model creates operational overhead around contract reference, review sequencing,
and drift detection.

The current separate-repo model already required a planned future mechanism for
read-only contract reference from backend validation back to `henter36/nashir`.
A monorepo could reduce that cross-repository coordination burden by placing UI,
API, contracts, and governance docs in one repository while preserving strict
ownership boundaries.

## 4. Benefits

- Keeps Nashir UI, API runtime, contracts, and governance decisions in one
  visible repository.
- Reduces contract drift risk by allowing backend validation to reference
  `packages/contracts` or `docs` via local paths after a governed migration.
- Makes PR review easier when a future authorized change spans one verified
  contract path, such as OpenAPI plus generated types.
- Simplifies local development once workspace tooling is explicitly authorized.
- Allows path-aware CI to validate only affected layers while still supporting
  end-to-end contract checks in explicitly authorized PRs.
- Makes OpenAPI authority internal to the repository instead of depending on a
  future external SHA pin from `nashir-backend` to `nashir`.

## 5. Risks

| Risk | Impact | Required control |
|---|---|---|
| Boundary collapse | Reviewers may treat monorepo proximity as permission to mix UI, API, contracts, secrets, and migrations in one PR. | Keep gate-based authorization and layer-specific PR scope. |
| Runtime behavior drift | Migration could accidentally change frontend or backend behavior. | Migration PR must be structure-only unless explicitly authorized otherwise. |
| CI overreach | CI could become slow or accidentally run unsafe backend/deployment checks on docs or UI changes. | Use path-aware CI with explicit frontend, API, contract, and docs filters. |
| Contract authority ambiguity | Moving paths could create confusion between old `docs` authority and future `packages/contracts`. | Decide the authority location before moving or duplicating OpenAPI. |
| Generated type drift | Generated files could be stale after contract path changes. | Keep generated artifacts downstream and regenerate only in an approved generated-types gate. |
| Secret leakage | A shared repository could tempt shared `.env` handling. | Monorepo must not mean shared secrets; env files and secret scopes remain app-specific and excluded from git. |
| History loss | Fresh import can erase backend review context. | Prefer history-preserving subtree import where practical. |
| Rollback complexity | A large import can be difficult to revert if mixed with behavior changes. | Keep migration PR isolated and reversible. |

## 6. Recommended Target Structure

Current layout is still repository-root frontend-oriented. The proposed
monorepo layout does not exist yet and must not be assumed by current scripts or
CI.

Current:

```text
nashir/
  src/
  docs/
  package.json

nashir-backend/
  src/
  tests/
  package.json
```

Proposed:

```text
nashir/
  apps/web/
  apps/api/
  packages/contracts/
  docs/
```

Recommended target structure:

```text
apps/
  web/
  api/
packages/
  contracts/
docs/
```

Intended ownership:

- `apps/web`: Nashir React/Vite UI. It must preserve the approved Arabic-first
  UI and mock-only boundaries until later integration gates.
- `apps/api`: imported backend runtime from `nashir-backend`. Initial migration
  must preserve existing behavior and must not add product routes, workspace
  routes, migrations, generated clients, or deployment behavior.
- `packages/contracts`: future candidate location for OpenAPI/contracts only
  after an explicit authority-location gate. Creating or moving contracts there
  is not authorized by this gate.
- `docs`: governance gates, screen map, decision records, and transition
  documentation.

## 7. Migration Options

### Option A: Keep Separate Repositories

Keep `henter36/nashir` and `henter36/nashir-backend` separate.

Benefits:

- Lowest immediate disruption.
- Preserves current backend repository history and permissions.
- Avoids CI/tooling changes in the near term.

Risks:

- Keeps cross-repository contract reference complexity.
- Requires pinned SHA or equivalent mechanism for backend validation against
  Nashir authorities.
- Leaves higher operational risk of stale contract references.

### Option B: Move Backend Into Nashir With Git Subtree/History Preservation

Import `henter36/nashir-backend` into `henter36/nashir` under `apps/api` using a
history-preserving method where practical.

Example starting point only:

```bash
git remote add nashir-backend ../nashir-backend
git fetch nashir-backend
git subtree add --prefix=apps/api nashir-backend main
```

This example is not authorized for execution by this PR and must be validated
in a separate migration authorization PR. That later PR must validate the exact
command sequence through a dry-run review before execution. `git-filter-repo`,
`git subtree`, or another history-preserving approach may be selected only
after that separate review.

Benefits:

- Best long-term governance fit if strict layer boundaries remain enforced.
- Preserves backend history for auditability and review context.
- Reduces need for external SHA pinning once contract authority is internal.
- Supports path-aware CI and local contract checks in later approved gates.

Risks:

- Requires careful Git execution and rollback planning.
- Can create a large PR even without behavior changes.
- Requires explicit decisions for package manager/workspace shape and CI paths.

### Option C: Fresh Import Without Full History

Copy the current backend files into `apps/api` without preserving full git
history.

Benefits:

- Simpler mechanically.
- Smaller import history inside `henter36/nashir`.

Risks:

- Loses backend audit trail and review context.
- Makes future blame/investigation harder.
- Increases governance risk because prior backend decisions become less visible
  in repository history.

## 8. Recommended Option

Recommended option: **Option B - move `nashir-backend` into `nashir` as
`apps/api` with git subtree/history preservation where feasible.**

This recommendation is planning-only. A later migration implementation PR must
be separately authorized and must include exact commands, expected diff shape,
verification commands, rollback criteria, and branch protection expectations.

## 9. Required Safeguards

Any future migration implementation PR must:

1. Be explicitly authorized as a migration implementation PR.
2. Move repository structure only unless another gate explicitly authorizes
   behavior changes.
3. Preserve backend history where feasible.
4. Keep frontend behavior unchanged.
5. Keep backend runtime behavior unchanged.
6. Keep OpenAPI unchanged unless a separate OpenAPI authority/path gate
   authorizes contract movement.
7. Keep generated types unchanged unless a separate generated-types gate
   authorizes regeneration.
8. Keep CI changes separate or explicitly authorized in the same migration gate.
9. Keep secrets/env boundaries app-specific.
10. Preserve rollback instructions that can restore the previous repository
    model.

## 10. CI Path-Filter Strategy

Future monorepo CI should be path-aware:

| Path | Expected CI scope |
|---|---|
| `apps/web/**` | Frontend lint, UI screen validation, frontend build |
| `apps/api/**` | Backend lint, typecheck, tests, and API smoke checks authorized for the backend layer |
| `packages/contracts/**` | Contract lint/parse, OpenAPI inventory, generated artifact drift checks only when authorized |
| `docs/**` | Documentation checks and governance text validation where available |
| Root configuration files (for example, `package.json`, `tsconfig.json`, `vite.config.*`, `.github/workflows/**`) | Explicitly run affected workspace checks |

Path-aware CI must not weaken required verification. It should avoid running
irrelevant jobs while still failing closed when shared contracts or shared
tooling change.

This gate does not modify CI.

## 11. Contract/OpenAPI Authority Impact

In the current model, `docs/nashir_v1_openapi.yaml` inside `henter36/nashir` is
the OpenAPI authority. `nashir-backend` must reference that authority without
copying, forking, or redefining it.

In a future monorepo model, OpenAPI authority can become internal to the same
repository instead of an external SHA-pinned reference from `nashir-backend` to
`nashir`.

Possible future authority locations:

- Keep `docs/nashir_v1_openapi.yaml` as the authority.
- Move the authority to `packages/contracts/nashir_v1_openapi.yaml`.

This gate does not choose or execute a contract move. A later OpenAPI authority
location gate must decide whether `packages/contracts` becomes authoritative
and must prevent duplicate live contracts.

## 12. Generated Types Impact

Generated types are downstream artifacts, not authority.

Current generated artifact:

```text
src/generated/creator-studio-openapi-types/index.d.ts
```

Current generation script reads:

```text
docs/nashir_v1_openapi.yaml
```

If the frontend `package.json` later moves under `apps/web`, the relative path
from `apps/web` back to the repository-root OpenAPI file would become:

```text
../../docs/nashir_v1_openapi.yaml
```

Package scripts such as `generate:creator-studio-types` must be reviewed in the
relocation PR. This gate does not modify package scripts.

A monorepo migration may later require moving generated types to an app-local
or package-local location, but that must be handled by a separate
generated-types gate. The migration PR itself must not regenerate or relocate
generated types unless explicitly authorized.

## 13. Secrets/Env Boundaries

Monorepo does **not** mean shared secrets.

Required future boundaries:

- `apps/web` and `apps/api` must keep separate env expectations.
- Real secrets must not be committed.
- Backend secret names, vault references, and runtime env handling remain
  backend-governed and require explicit authorization.
- Frontend must not gain access to backend secrets just because the code is in
  the same repository; runtime environments and secret access must remain
  strictly isolated.
- CI secrets must be scoped by job/environment and least privilege.

## 14. Rollback Strategy

Future migration implementation must define rollback before execution:

1. Keep `henter36/nashir-backend` unchanged until the monorepo import is
   reviewed and accepted.
2. Perform the import in a dedicated branch and PR.
3. Avoid behavior changes in the same PR so the import can be reverted cleanly.
4. Tag or record the source backend commit imported into `apps/api`.
5. If validation fails or review rejects the migration, close/revert the
   monorepo branch and continue using the separate backend repository.
6. Do not retire, archive, or change protections on `henter36/nashir-backend`
   until a later closure gate confirms the monorepo model.

## 15. Proposed Phased Migration Plan

Phase 0 - Planning gate:

- Confirm desired target structure.
- Choose history-preserving import method.
- Decide whether CI changes are included in migration PR or split.
- Define exact allowed files and hard blocks.

Phase 1 - Dry-run and diff review:

- Run a local dry-run import into `apps/api`.
- Produce diff stat, imported commit inventory, and conflict report.
- Verify no frontend, OpenAPI, generated type, package script, or CI changes are
  included unless explicitly authorized.

Phase 2 - Migration implementation PR:

- Import backend into `apps/api` with history preservation where feasible.
- Preserve runtime behavior.
- Keep `henter36/nashir-backend` active during review.
- Run frontend checks and backend checks appropriate to the imported skeleton.

Phase 3 - CI path-filter PR:

- Add or adjust CI path filters after explicit authorization.
- Keep jobs layer-specific and least privilege.
- Verify docs-only, frontend-only, API-only, and contract-affecting changes.

Phase 4 - Contract authority/location PR:

- Decide whether OpenAPI remains in `docs` or moves to `packages/contracts`.
- Update generation inputs only with explicit generated-types authorization.
- Add drift checks if required.

Phase 5 - Closure gate:

- Confirm the monorepo model is accepted.
- Define the status of the old `henter36/nashir-backend` repository.
- Preserve rollback/archival policy.

## 16. Explicit Non-Goals

This PR does not authorize and must not include:

- Moving backend files.
- Changing CI workflows.
- Changing OpenAPI.
- Regenerating or moving generated types.
- Changing frontend code.
- Changing backend code.
- Adding dependencies.
- Modifying package scripts.
- Creating workspace/package-manager configuration.
- Adding SQL migrations.
- Adding migration runner behavior.
- Adding database-applied changes.
- Adding ORM/query layer.
- Adding runtime env/secrets config.
- Adding deployment config.
- Claiming production or pilot readiness.

## 17. Human Decisions Required

Before migration implementation, humans must decide:

- Whether to proceed with monorepo migration at all.
- Whether Option B history-preserving import is mandatory or best-effort.
- Exact import method and rollback command sequence.
- Whether `apps/web` relocation happens in the same migration or later.
- Whether CI changes are in the same PR or a separate PR.
- Whether OpenAPI authority remains in `docs` or later moves to
  `packages/contracts`.
- Generated type ownership and output path.
- Secret/env naming and CI secret scoping.
- When and how to freeze or archive `henter36/nashir-backend`.

## 18. Final GO/NO-GO

Final decision:

- **GO** to monorepo migration planning.
- **GO** to recommend Option B as the target direction:
  `nashir-backend` imported into `nashir` as `apps/api` with history preserved
  where feasible.
- **NO-GO** to migration implementation in this PR.
- **NO-GO** to backend file movement, CI changes, OpenAPI changes, generated
  type changes, frontend code changes, backend code changes, dependencies,
  package script changes, runtime behavior changes, UI behavior changes,
  secrets/env changes, deployment changes, production readiness, or pilot
  readiness in this PR.
