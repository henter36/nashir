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

## Execution Bundle Policy

Agents should default to the fastest safe path within the current authorization
boundary.

When work is already authorized and low-risk, agents may complete it in one
execution PR with verification. Agents must not create documentation-only gates
when current policy or an approved gate already authorizes the execution
bundle.

Allowed direct execution bundles:

- Documentation clarification bundle
- UI alignment bundle
- Test hardening bundle
- Contract verification bundle
- Generated types verification bundle
- Backend route test bundle

Dedicated gates remain required for:

- Auth/RBAC/Workspace Identity
- SQL migrations / migration runner
- New write routes or mutating APIs
- ErrorModel / disclosure / status-code / lifecycle semantics
- OpenAPI authority changes before identity/security prerequisites are
  established
- Agent runtime / tools / memory / approvals / model routing
- Publishing / provider integrations / billing / secrets / analytics runtime
- Deployment / pilot / production readiness

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

Prioritize Nashir UI screens, approved gate documents, and the fastest safe
path within the current authorization boundary.

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
