# CLAUDE.md — Nashir Claude Code Instructions

## Project identity

Nashir is a production-grade system under controlled gate-based development.

Nashir screens, journeys, and approved product decisions are the functional source of truth.

marketing-os may be used only as a backend, governance, infrastructure, contract, and implementation reference. It must not override Nashir's product journey, screens, entities, or UX.

## Hard governance rules

Do not implement or modify any of the following unless the current approved gate explicitly authorizes it:

- Backend implementation
- API routes
- SQL migrations
- Migration runner
- Database-applied changes
- ORM/query layer
- Generated clients
- Runtime environment/secrets config
- CI/CD deployment workflows
- Production or pilot readiness claims

Documentation-only gates must remain documentation-only.

If a task is not clearly authorized by the latest approved gate, stop and report the boundary instead of guessing.

## Safe build acceleration policy

Nashir development should move faster only when the acceleration remains inside explicit governance boundaries.

Safe acceleration is allowed by default for low-risk work when all of the following are true:

- The change stays within one layer or one tightly coupled contract path.
- The latest approved gate already establishes the decision or scope.
- No new product assumption is introduced silently.
- No security, RBAC, workspace, audit, data, deployment, or production boundary is weakened.
- The PR includes verification appropriate to the changed layer.

Prefer medium-sized PRs over excessive micro-gates when the work is low-risk and internally coherent.

Allowed acceleration examples:

- Documentation boundary updates that clarify already accepted decisions.
- UI-only alignment work that preserves the approved Nashir product UI source of truth and does not add backend/runtime scope.
- OpenAPI plus generated types only when explicitly authorized together and the prerequisite Auth/RBAC/Workspace Identity design is already established.
- Backend route behavior plus route tests inside an already approved route family.
- Drift checks, scope guards, and verification scripts that do not change product/runtime behavior.

Do not accelerate the following without a dedicated gate:

- Auth, RBAC, workspace identity, or permission model changes.
- SQL migrations, migration runner behavior, or database-applied changes.
- Store/Product write routes or other mutating APIs.
- ErrorModel, disclosure, status-code, or lifecycle semantics.
- Agent runtime, tool execution, memory, approvals, or model routing.
- Publishing integrations, provider integrations, billing, secrets, analytics runtime, deployment, pilot, or production readiness.

Use this rule when selecting PR scope:

- Expand a PR when all changes are in the same layer or a single verified contract path.
- Split a PR when it crosses a risky boundary, changes authority, or combines runtime, migration, UI, generated output, and deployment concerns.

When Codex or Claude Code is asked to execute a step, provide a direct implementation prompt that includes:

- Goal
- Allowed files or layer
- Explicit hard blocks
- Verification commands
- Expected PR title and scope summary

Do not ask for another prompt when the execution step is clear.

## Required Git safety checks

Before making changes, inspect:

```bash
git status -sb
git branch --show-current
git log --oneline --decorate -5
```

## Scope discipline

Never use deprecated or experimental artifacts as source of truth.

The `prototype/` directory in marketing-os is deprecated and must not be used for Nashir UX, API contracts, entities, or implementation logic.

Do not introduce new product assumptions unless clearly marked as proposed and pending approval.

Do not silently change terminology, permissions, statuses, route families, entity names, or lifecycle semantics.

## Nashir functional source of truth

Prioritize Nashir UI screens and approved gate documents.

Current priority is safe accelerated progression through approved gates, not ungoverned fast implementation.

Preserve:

- Arabic-first experience
- Mobile-first usability
- Human-in-the-loop controls
- Governance-first execution
- Merchant-safe behavior
- Cost control
- Workspace/RBAC boundaries
- Auditability and traceability

## Review classification

When reviewing a change, classify findings as:

- Blocking
- Important
- Minor
- Observation

A Blocking issue means the PR/gate should not proceed.

Always check for:

- Authorization boundary violations
- Product-source-of-truth drift
- Contract drift vs. prerequisite design readiness, distinguishing the risk of contract drift from defining the API Contract/OpenAPI before Auth/RBAC/Workspace Identity designs are established
- Authority location vs. alignment readiness, acknowledging that the authority location can be resolved even if alignment readiness with Auth/RBAC/Workspace Identity remains pending
- Auth/RBAC/workspace-scope drift
- OpenAPI/status/permission/status/error/lifecycle mismatch
- SQL/schema/migration overreach
- Generated-client or backend overreach
- Security, privacy, audit, and operational risks
