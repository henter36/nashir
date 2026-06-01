# Nashir Repository Rename Execution Gate

| Field | Value |
|---|---|
| Gate type | Repository rename execution planning/preparation gate |
| Status | Preparation complete — awaiting manual rename after PR merge |
| Date | 2026-06-01 |
| Scope | Prepares repository and operator instructions for the controlled rename from `nashir-ui-prototype` to `nashir`; updates identity references only |
| GitHub rename performed | NO — manual rename occurs after this PR is reviewed and merged |
| UI/API/backend changes | NO |
| Build/dependency changes | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is a rename execution planning/preparation gate.

**Documentation and identity-reference preparation only. The GitHub repository rename is not performed in this PR.**

**No UI, API, backend, build, or package dependency changes are made in this PR.**

**No production readiness is claimed.**

The GitHub rename must be performed **manually by the repository owner after this PR is reviewed and merged.**

---

## 2. Approved Prior Decision

| Decision | Source |
|---|---|
| `nashir-ui-prototype` adopted as Nashir product repository and UI/source-of-truth | PR #60 |
| Future rename to `nashir` planned | PR #60 |
| `marketing-os` is reference-only, not the Nashir product repository | PR #60 |
| This gate executes the controlled preparation for that rename | This PR |

The repository remains **not production-ready** after the rename. The rename removes naming ambiguity only.

---

## 3. Rename Target

| Item | Current | Target |
|---|---|---|
| GitHub repository | `henter36/nashir-ui-prototype` | `henter36/nashir` |
| GitHub URL | `https://github.com/henter36/nashir-ui-prototype` | `https://github.com/henter36/nashir` |
| git origin | `https://github.com/henter36/nashir-ui-prototype.git` | `https://github.com/henter36/nashir.git` |
| Local path | `~/workspace/nashir-ui-prototype` | `~/workspace/nashir` |
| package name | `nashir-ui` | `nashir` |

---

## 4. Rename Rationale

- The word `prototype` creates ambiguity — reviewers and tools may treat the repository as disposable or pre-product.
- This repository now owns the Nashir product UI and journey (established by PR #60).
- The rename improves product identity and prevents future confusion.
- The rename does **not** mean production readiness. Backend, auth, database, API, QA, and deployment are still required.

---

## 5. Pre-Rename Checklist

Before executing the GitHub rename, verify all of the following:

- [ ] PR #60 is merged to main.
- [ ] This PR (rename execution gate) is merged to main.
- [ ] Working tree is clean (`git status --short` shows nothing).
- [ ] No critical unreviewed PRs are open that would be confused by the rename.
- [ ] Target name `henter36/nashir` is available on GitHub at execution time.
- [ ] GitHub owner (`henter36`) has permission to rename the repository.
- [ ] Collaborators are informed that the old URL will redirect but git remotes should be updated.

---

## 6. GitHub Rename Operator Steps

**Use exactly one of the two options below. Do not choose an alternate repository name without a new gate decision.**

### Option A — GitHub Web UI

1. Navigate to: `https://github.com/henter36/nashir-ui-prototype/settings`
2. Under "Repository name", change the name from `nashir-ui-prototype` to `nashir`.
3. Read and confirm the GitHub warning about redirects and reference updates.
4. Click **Rename**.
5. Verify the new URL loads: `https://github.com/henter36/nashir`
6. Verify the old URL redirects: `https://github.com/henter36/nashir-ui-prototype`

### Option B — GitHub CLI

```bash
gh repo rename nashir --repo henter36/nashir-ui-prototype --yes
```

**Stop immediately if GitHub reports the name is unavailable. Do not substitute an alternate name.**

---

## 7. Local Rename Operator Steps

After the GitHub rename succeeds, update the local environment:

### Preferred: rename the local folder

```bash
cd ~/workspace

mv nashir-ui-prototype nashir

cd ~/workspace/nashir

git remote set-url origin https://github.com/henter36/nashir.git

git remote -v

git fetch origin

git status -sb

git log --oneline --decorate -10
```

### Alternative: update remote only (keep local folder name temporarily)

```bash
cd ~/workspace/nashir-ui-prototype

git remote set-url origin https://github.com/henter36/nashir.git

git remote -v
```

Update the local folder path at a convenient time after confirming the remote is correct.

---

## 8. README Updates

The README status note is updated in this PR to reflect the rename preparation and final product identity. Key points:

- The repository is the approved Nashir product UI and journey reference.
- It is being prepared for a controlled rename to `nashir`.
- It is not production-ready yet.

---

## 9. package.json Identity Update

The `name` field in `package.json` is updated from `nashir-ui` to `nashir` in this PR.

- Only the `name` field is changed.
- No scripts, dependencies, devDependencies, version, or build configuration is changed.

`package-lock.json` root package name metadata is updated from `nashir-ui` to `nashir` for consistency.

- No dependency versions are refreshed.
- Only the root name metadata is updated.

---

## 10. References Not Updated in This PR

| Reference | Status |
|---|---|
| `marketing-os` references to old repo name | Not modified — update in a separate `marketing-os` PR if needed |
| External links, bookmarks, and previous PR URLs | Rely on GitHub redirects |
| Code import paths | No imports reference the repository name |

---

## 11. Post-Rename Verification

After the manual GitHub rename and local folder/remote update, run:

```bash
cd ~/workspace/nashir

git remote -v

git fetch origin

git status -sb

git log --oneline --decorate -10

npm run lint

npm run build
```

Also verify:

- `https://github.com/henter36/nashir` loads the repository.
- `https://github.com/henter36/nashir-ui-prototype` either redirects to the new URL or is no longer the active canonical URL.
- README no longer causes product/prototype ambiguity.
- No production readiness is claimed.

---

## 12. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Rename can break local remotes until updated | **MEDIUM** | Operator steps in Section 7 |
| External references may still use the old URL | **LOW** | GitHub redirects; update docs over time |
| Renaming while PRs are open can confuse reviewers | **LOW** | Pre-rename checklist in Section 5 |
| Changing package metadata beyond name field may cause build drift | **LOW** | Only `name` field changed; no other fields touched |
| Rename does not solve backend/API/productization gaps | **MEDIUM** — risk of false readiness | Section 1 and Section 4 explicitly document this |

---

## 13. Rollback / Stop Conditions

```text
STOP: If the target name henter36/nashir is unavailable.
STOP: If permission to rename is denied.
STOP: If CI fails after identity-only changes — fix via documentation remediation only.
STOP: If any condition in the pre-rename checklist is not met.

DO NOT: Choose alternate names (nashir-app, nashir-ui, nashir-product) without a new decision gate.
DO NOT: Roll back the product identity decision unless explicitly decided through a new gate.
```

---

## 14. GO / NO-GO

| Decision | Status |
|---|---|
| **Preparation PR (this PR)** | **GO** |
| **CONDITIONAL GO: manual GitHub rename after PR merges** | After pre-rename checklist passes |
| **CONDITIONAL GO: local folder and remote update** | After GitHub rename succeeds |
| GitHub rename in this PR | **NO-GO — manual step after merge** |
| Production readiness | **NO-GO** |
| UI implementation in this PR | **NO-GO** |
| API integration in this PR | **NO-GO** |
| Backend changes in this PR | **NO-GO** |
| Dependency changes in this PR | **NO-GO** |
| `marketing-os` modifications | **NO-GO** |
