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

## Required Git safety checks

Before making changes, inspect:

```bash
git status -sb
git branch --show-current
git log --oneline --decorate -5
```
