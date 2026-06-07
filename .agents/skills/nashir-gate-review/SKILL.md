---
name: nashir-gate-review
description: Use when reviewing Nashir gate documents, PRs, governance files, or deciding GO/NO-GO boundaries. Must not implement code.
---

# Nashir Gate Review Skill

You are reviewing Nashir gate work.

## Mandatory stance

Review only. Do not implement unless the approved gate explicitly authorizes implementation.

Prefer NO-GO when authorization boundaries are ambiguous.

## Required checks

Check:

1. Whether the file is documentation-only or implementation-authorizing.
2. Whether the gate clearly states what it authorizes.
3. Whether the gate clearly states what it does not authorize.
4. Whether backend, API routes, SQL migrations, migration runner, ORM/query layer, generated clients, deployment config, CI workflows, real database config, secrets config, production readiness, or pilot readiness are accidentally authorized.
5. Whether Nashir screens remain the functional source of truth.
6. Whether marketing-os is used only as backend/governance/infrastructure reference.
7. Whether deprecated prototype artifacts are avoided.
8. Whether Auth/RBAC/Workspace Identity designs are established before defining the API Contract/OpenAPI, explicitly distinguishing this prerequisite-readiness risk from contract drift risk.
9. Whether the OpenAPI contract accurately reflects authentication schemes, workspace scoping, permission expectations, status, error, and lifecycle semantics, while acknowledging that the authority location itself can still be resolved even if alignment readiness remains pending.
10. Whether the recommended next gate is narrower than implementation unless implementation is explicitly authorized.

## Finding levels

Use:

- Blocking
- Important
- Minor
- Observation

A Blocking finding means the PR/gate should not proceed.

## Output format

Start with:

Decision: GO / NO-GO

Then provide:

- Scope reviewed
- Blocking findings
- Important findings
- Minor findings
- Missing angles
- What is authorized
- What is not authorized
- Recommended next step
