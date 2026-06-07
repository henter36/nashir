# AGENTS.md — Nashir Agent Instructions

## Project identity

Nashir is a production-grade system under controlled gate-based development.

Nashir screens, journeys, and approved product decisions are the functional
source of truth.

marketing-os may be used only as a backend, governance, infrastructure,
contract, and implementation reference. It must not override Nashir's product
journey, screens, entities, or UX.

## Hard governance rules

Do not implement or modify any of the following unless the current approved
gate explicitly authorizes it:

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

If a task is not clearly authorized by the latest approved gate, stop and
report the boundary instead of guessing.

## Git safety rules

Before making changes, always run:

```bash
git status -sb
git branch --show-current
git log --oneline --decorate -5
```

Never use deprecated or experimental artifacts as source of truth.

The `prototype/` directory in marketing-os is deprecated and must not be used
for Nashir UX, API contracts, entities, or implementation logic.

Do not introduce new product assumptions unless clearly marked as proposed and
pending approval.

Do not silently change terminology, permissions, statuses, route families,
entity names, or lifecycle semantics.

## Nashir functional source of truth

Prioritize Nashir UI screens and approved gate documents.

Current priority is controlled progression through gates, not fast
implementation.

Preserve:

- Arabic-first experience
- Mobile-first usability
- Human-in-the-loop controls
- Governance-first execution
- Merchant-safe behavior
- Cost control
- Workspace/RBAC boundaries
- Auditability and traceability

## marketing-os usage boundary

Allowed use of marketing-os:

- Backend architecture reference
- Governance model reference
- Contract-first implementation reference
- Infrastructure pattern reference
- Testing and review discipline reference

Not allowed:

- Forcing marketing-os product flows onto Nashir
- Replacing Nashir entities with marketing-os entities without approval
- Importing deprecated prototype decisions
- Treating marketing-os as the product source of truth

## Review behavior

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

## Output expectations

Be direct and precise.

Separate facts from assumptions.

State GO / NO-GO clearly when reviewing gates.

Mention what is authorized and what is not authorized.

Do not claim production readiness unless explicitly proven and approved.
