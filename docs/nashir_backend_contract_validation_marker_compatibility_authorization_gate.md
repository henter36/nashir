# Nashir Backend Contract Validation Marker Compatibility Authorization Gate

## 1. Decision

Decision: GO to one narrow compatibility fix PR for backend contract validation argument parsing.

## 2. Context

PR #227 adds Backend CI for the Nashir monorepo.

Backend CI currently passes:

* install
* lint
* format check
* typecheck
* tests
* contract authority validation

Backend CI currently fails at:

* `pnpm run validate:contracts`

### Root cause (corrected)

The failure is **not** a marker case-sensitivity issue. Investigation of the
actual CI job log for PR #227 shows:

```
> node scripts/validate-contracts.mjs -- --authority-repo /home/runner/work/nashir/nashir
FAIL: Unknown argument: --
FAIL: Stopping immediately; no further checks were run.
```

The workflow invokes the script as `pnpm run validate:contracts --
--authority-repo "${{ github.workspace }}"`. pnpm forwards the literal `--`
token to the underlying script's `process.argv`. The script's
`parseArguments` function in `apps/api/scripts/validate-contracts.mjs` has
no handling for a bare `--` token, so it immediately fails with `Unknown
argument: --` before `--authority-repo` is ever read.

By contrast, `apps/api/scripts/validate-contract-authority.mjs` (which
passes in the same PR's CI run) already handles this case:

```js
if (argument === "--") {
  continue;
}
```

`validate-contracts.mjs` is missing the equivalent handling.

A separate marker case-sensitivity hypothesis was checked and ruled out:
`docs/nashir_ai_agent_runtime_selection_planning_gate.md` already contains a
literal lowercase `documentation-only` match. Reproducing the script
locally without the stray `--` (`node scripts/validate-contracts.mjs
--authority-repo <path>`) confirms the `documentation-only` marker check
passes cleanly. There is no marker-matching defect.

## 3. Authorized Fix Scope

Authorize one narrow implementation PR to update only:

* `apps/api/scripts/validate-contracts.mjs`

The fix may add handling for a bare `--` token in `parseArguments`, matching
the existing pattern already used in
`apps/api/scripts/validate-contract-authority.mjs`:

```js
if (argument === "--") {
  continue;
}
```

* preserve all existing required marker semantics
* do not remove required markers
* do not weaken required contract coverage
* do not change marker matching behavior (case-sensitive `.includes()` is
  not the problem and must not be altered as part of this fix)

## 4. Explicit NO-GO

This authorization does not allow:

* workflow changes
* OpenAPI edits
* generated type changes
* package changes
* lockfile changes
* backend runtime changes
* route changes
* database changes
* migration changes
* frontend changes
* authority document rewrites
* removing validation checks
* skipping `validate:contracts`

## 5. Required Validation

The implementation PR must run:

* `cd apps/api && pnpm run validate:contracts -- --authority-repo ../..`
* `cd apps/api && pnpm lint`
* `cd apps/api && pnpm typecheck`
* `git diff --check`

## 6. Expected Next PR

If this authorization PR is merged, open one narrow implementation PR titled:

`fix: handle "--" separator in backend contract validation argument parsing`

That implementation PR may modify only:

* `apps/api/scripts/validate-contracts.mjs`

## 7. Stop Conditions

Stop if the implementation requires:

* OpenAPI changes
* generated type changes
* package changes
* workflow changes
* docs rewrites
* runtime behavior changes
