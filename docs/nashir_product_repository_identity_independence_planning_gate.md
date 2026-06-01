# Nashir Product Repository Identity & Independence Planning Gate

| Field | Value |
|---|---|
| Gate type | Product repository identity and independence planning gate — documentation only |
| Status | Draft |
| Date | 2026-06-01 |
| Scope | Formally establishes `nashir-ui-prototype` as the Nashir product repository and UI/source-of-truth; plans future rename to `nashir`; defines independence from `marketing-os` code while allowing selective knowledge extraction |
| Repository rename performed | NO |
| UI/code implementation | NO |
| API/backend/package/build changes | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is a documentation-only planning gate.

**This gate establishes product repository identity and independence. It does not perform a repository rename, UI implementation, or any code changes.**

**No repository rename is performed in this PR.**

**No UI or code implementation is performed in this PR.**

**No API, backend, package, or build changes are performed in this PR.**

**No production readiness is claimed.**

---

## 2. Triggering Context

| Observation | Detail |
|---|---|
| Project owner confirmation | `nashir-ui-prototype` is the desired Nashir product UI and must be the product source of truth |
| `marketing-os /nashir/` inspection | Manually inspected; found materially different from the desired Nashir experience |
| Consequence for marketing-os UI | Nashir development must not continue on `marketing-os` static UI surface |
| Repository name ambiguity | The word `prototype` in the repository name creates ambiguity — it may cause reviewers or tools to treat the product as disposable or incomplete by default |
| Required action | Formal identity establishment + future controlled rename plan |

---

## 3. Core Decision

| Principle | Decision |
|---|---|
| `nashir-ui-prototype` role | **Adopted as the Nashir product repository and UI/source-of-truth** |
| Intended future repository name | **`nashir`** |
| `marketing-os` as Nashir product repository | **NO — marketing-os is not the Nashir product repository** |
| `marketing-os` as Nashir UI source of truth | **NO — marketing-os is not the Nashir UI source of truth** |
| `marketing-os` constraints on Nashir | **PROHIBITED — marketing-os must not constrain or reduce Nashir features, journey, or UX** |
| Nashir independence | **Nashir will be completed independently from marketing-os code unless a future gate approves selective adoption** |

---

## 4. Clarification: Product Source of Truth vs Production Readiness

This section is critical to avoid overstating the current status.

| Dimension | Current Status |
|---|---|
| Source of truth for product UI and journey | **YES — this repository** |
| Production-ready backend | NO — not yet implemented |
| Production-ready auth/RBAC | NO — not yet implemented |
| Production-ready database | NO — not yet implemented |
| Production-ready API | NO — not yet implemented |
| Security review completed | NO |
| QA/deployment readiness | NO |
| Mock/static/prototype content | YES — current screens contain mock/seed data and simulated interactions |

**The rename to `nashir` does not itself create production readiness.** The product journey and UI screens define the intended Nashir experience, but real backend, auth, database, API, security, and QA implementations are required in future gates before any production/pilot claim can be made.

---

## 5. Repository Rename Plan

| Item | Detail |
|---|---|
| Current GitHub repository name | `nashir-ui-prototype` |
| Intended GitHub repository name | `nashir` |
| Current local path | `~/workspace/nashir-ui-prototype` (may remain until rename gate) |
| Rename in this PR | **NO — rename is not performed here** |
| Rename gate required | YES — a separate Nashir Repository Rename Execution Gate |

### Rename gate requirements

The future rename gate must address:

| Item | Action required |
|---|---|
| GitHub repository name | Change via GitHub settings |
| Local folder path guidance | Provide git remote update instructions |
| git remote URLs | Update in all clones referencing the old name |
| README references | Update repository name and any self-referential paths |
| Documentation references | Update any `nashir-ui-prototype` references in docs/ |
| marketing-os docs | Update in a separate marketing-os PR if marketing-os references the old name |

---

## 6. Independence From marketing-os

| Rule | Status |
|---|---|
| Nashir will not be built inside `marketing-os` | **CONFIRMED** |
| Nashir will not use `marketing-os /ui/nashir/` as product UI | **CONFIRMED** |
| Nashir will not inherit marketing-os UI, journey, or operational complexity by default | **CONFIRMED** |
| marketing-os code must not be copied into Nashir without a future selective extraction/adoption gate | **CONFIRMED** |
| marketing-os may be referenced as an archive/source of reusable ideas only | **CONFIRMED** |
| Any conflict between marketing-os assumptions and Nashir UX/journey must be resolved in Nashir's favor | **CONFIRMED** |

---

## 7. Allowed Use of marketing-os

The following items may be **studied** from marketing-os and evaluated for adoption through a separate extraction gate:

| Category | What may be studied |
|---|---|
| Product and features | Feature discussions, product ideas, scope decisions |
| Governance patterns | Documentation structure, gate discipline, decision logs |
| OpenAPI structure | API contract concepts, operationId patterns, permission codes |
| Generated types approach | TypeScript type generation concept, JSDoc boundary patterns |
| RBAC/permission concepts | Role model, permission code naming, role-to-permission matrix |
| Backend route/repository patterns | Repository pattern, workspace scoping, error model |
| SQL/schema ideas | Schema design, FK patterns, idempotency, RBAC seed patterns |
| Decision and change log artifacts | Gate records, decision rationale, change tracking |
| PR/issue discussions | Implementation lessons, review comments, remediation patterns |
| AI governance concepts | Provider routing, prompt governance, cost monitoring ideas |
| Operational lessons | Any lessons from the implementation history |

**All extracted items must be evaluated before adoption. Useful items must enrich Nashir, not reduce it. Any item that conflicts with Nashir UI/source-of-truth must be rejected or redesigned to fit Nashir.**

---

## 8. Disallowed Use of marketing-os

The following must be explicitly rejected:

| Disallowed action | Reason |
|---|---|
| Making marketing-os the runtime base for Nashir | Nashir has its own React/Vite stack; marketing-os is Node.js/Express |
| Continuing to expand `marketing-os /ui/nashir/` as product UI | This surface is not the Nashir product UI |
| Importing unwanted marketing-os modules or patterns | May introduce irrelevant complexity |
| Accepting marketing-os journey/entity assumptions that conflict with Nashir | Nashir's approved journey and screens are the authority |
| Reducing Nashir screens/features to match marketing-os limitations | Nashir must not be simplified to fit marketing-os scope |
| Adding unnecessary governance/infrastructure burden before V1 needs it | Premature complexity must be avoided |
| Treating marketing-os artifacts as automatically canonical for Nashir | All items require evaluation |

---

## 9. Required Future Gates

| Priority | Gate | Purpose |
|---:|---|---|
| 1 | **Nashir Repository Rename Execution Gate** | Performs the controlled rename from `nashir-ui-prototype` to `nashir`; updates references |
| 2 | **Marketing OS Knowledge Extraction for Nashir Planning Gate** | Plans exactly what to study and potentially adopt from marketing-os |
| 3 | **Nashir Product Scope Reconciliation Gate** | Reconciles current README, screen map, and actual App/pages; confirms V1 scope |
| 4 | **Nashir Productization Roadmap Gate** | Plans the path from current UI prototype to real implemented product |
| 5 | **Nashir Backend/API Strategy Gate** | Defines backend, API, auth, database, and deployment strategy |
| 6 | **Nashir Real Implementation Slice 1 Gate** | First real backend/API/auth implementation slice |

### Gate sequencing notes

- **Rename gate** should come before broad external references are updated to avoid reference breakage.
- **Knowledge extraction gate** should happen before importing any specific ideas from marketing-os.
- **Product scope reconciliation** must compare current README, screen map, and actual App/pages to confirm the approved V1 scope.
- **Implementation gates** must not reduce or delete existing Nashir UI functionality.

---

## 10. Immediate NO-GO Boundaries

```text
NO-GO: marketing-os UI expansion as Nashir product UI.
NO-GO: Direct marketing-os integration into this repository.
NO-GO: Backend/API binding until Nashir strategy is separately approved.
NO-GO: Repository rename in this PR.
NO-GO: Production/pilot claims.
NO-GO: Deletion or simplification of existing Nashir screens.
NO-GO: Package/build/tooling changes in this PR.
NO-GO: Generated clients in this PR.
NO-GO: Runtime client in this PR.
NO-GO: Database/backend changes in this PR.
NO-GO: Copying files from marketing-os in this PR.
```

---

## 11. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Keeping `prototype` in the repo name may cause reviewers/tools to treat the product as disposable | **MEDIUM** | Rename gate planned and documented |
| Renaming without a gate can break remotes, documentation, and references | **MEDIUM** | Rename deferred to a dedicated execution gate |
| Copying marketing-os code can import irrelevant complexity | **MEDIUM** | Extraction gate required before any adoption |
| Ignoring marketing-os entirely may lose useful governance/backend lessons | **LOW** | Allowed study via extraction gate |
| Continuing to build UI in marketing-os risks product drift | **HIGH** | Resolved: `marketing-os /ui/nashir/` is reclassified as non-product surface |
| Treating mock UI as production-ready risks false progress | **HIGH** | Section 4 explicitly separates source-of-truth from production readiness |
| Having two UI authorities creates long-term conflict | **HIGH** | Resolved by this gate: only this repository is the Nashir product authority |

---

## 12. Recommended Decision

**Adopt `nashir-ui-prototype` as the Nashir product repository and UI source of truth.**

| Action | Recommendation |
|---|---|
| Product authority | `nashir-ui-prototype` is the Nashir product repository |
| Future name | Plan rename to `nashir` via a separate execution gate |
| `marketing-os` relationship | Reference-only extraction source; not Nashir product base |
| `marketing-os /ui/nashir/` | Reclassified as non-product technical harness |
| Further UI development | Continue independently in `nashir-ui-prototype` |
| Adoption from marketing-os | Via separate knowledge extraction gate only |

---

## 13. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** — no lint errors |
| `npm run build` | **PASSED** — built successfully |
| `git status --short` | Only new docs file untracked |
| Forbidden files check | **PASS** — no src/, package.json, package-lock.json, SQL, backend, API, or prototype files modified |

No `npm test` script exists. Verification via lint and build only.

---

## 14. GO / NO-GO Result

| Decision | Status |
|---|---|
| **Product identity and independence planning gate** | **GO** |
| **CONDITIONAL GO: Nashir Repository Rename Execution Gate** | After this gate merges |
| **CONDITIONAL GO: Marketing OS Knowledge Extraction Gate** | After rename gate |
| Repository rename in this PR | **NO-GO** |
| UI implementation in this PR | **NO-GO** |
| API integration in this PR | **NO-GO** |
| Backend work in this PR | **NO-GO** |
| Package/build changes in this PR | **NO-GO** |
| Generated client in this PR | **NO-GO** |
| Runtime client in this PR | **NO-GO** |
| Production/pilot readiness | **NO-GO** |
