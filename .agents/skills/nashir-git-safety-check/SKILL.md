---
name: nashir-git-safety-check
description: Use before and after any Nashir repository change, PR preparation, merge review, or GitHub push instruction.
---

# Nashir Git Safety Check Skill

## Before changes

Always inspect:

```bash
git status -sb
git branch --show-current
git log --oneline --decorate -5
```

If working tree is dirty, report the dirty files before proposing changes.

Use a feature branch by default.

Do not push directly to main unless the user explicitly asks for direct push.

## During changes

Do not modify files outside the authorized gate scope.

Do not touch:

- backend implementation
- API routes
- SQL migrations
- migration runner
- ORM/query layer
- generated clients
- runtime env/secrets config
- CI/CD deployment workflows

unless the current gate explicitly authorizes that class of change.

## Before final response

Always run:

```bash
git status -sb
git diff --stat
git diff --check
```

If code changed, run applicable checks such as:

```bash
npm run lint
npm run build
npm test
```

Only report checks that were actually run.

Never claim a branch was pushed, a PR was opened, or checks passed unless
verified.
