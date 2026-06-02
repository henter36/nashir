# Nashir Backend/API Strategy Gate

| Field | Value |
|---|---|
| Gate type | Backend/API strategy gate — documentation only |
| Status | Draft — pending review |
| Date | 2026-06-02 |
| Scope | Defines the backend/API strategy direction for Nashir so future ERD, OpenAPI, auth/RBAC, storage, test, threat modeling, and implementation planning gates follow the approved product journey |
| Backend/API implementation | NO |
| ERD/schema implementation | NO |
| OpenAPI/API contract implementation | NO |
| Auth/RBAC implementation | NO |
| UI/source code changes | NO |
| Package/build changes | NO |
| marketing-os extraction | NO |
| Production readiness claimed | NO |

---

## 1. Status

This is a documentation-only Backend/API strategy gate.

**No backend or API implementation is performed.**

**No ERD or schema implementation is performed.**

**No OpenAPI or API contract is created.**

**No auth/RBAC implementation is performed.**

**No UI or source code changes are made.**

**No package or build changes are made.**

**No marketing-os extraction is authorized.**

**No production readiness is claimed.**

This gate decides backend/API strategy direction only.

---

## 2. Inputs Reviewed

| Input | Finding |
|---|---|
| `README.md` | 23 screens; V1 Core journey documented; Extended V1 preserved |
| `docs/screen_map.md` | 23 screens with V1 classification; `productIntelligence`, `creatorStudio`, `contentReview` documented as Extended V1 |
| Productization Roadmap Gate (PR #67) | 6-phase roadmap defined; Backend/API Strategy Gate authorized as Phase 1 prerequisite |
| Productization Roadmap Review Gate (PR #68) | All 28 criteria PASS; Backend/API Strategy Gate authorized to begin |
| V1 Scope Decision Gate (PR #64) | 10 V1 Core, 2 V1 Support, 8 V1 Admin/Governance, 3 Extended V1 approved |
| V1 Scope Decision Review Gate (PR #65) | All 21 criteria PASS |
| V1 Scope Documentation Update Gate (PR #66) | README and screen_map aligned with 23-screen scope |
| `src/App.jsx` | 23 active screens; all `enabled: true`; V1 Core journey confirmed in navigation |
| `src/pages/` | 23 page components; no orphaned files |
| `src/data/` | `creatorStudioFlowFixture.js`, `dashboardData.js`, `readinessFixture.js` — mock data only |
| `src/generated/` | `creator-studio-openapi-types/` — generated types for Creator Studio; no real backend yet |
| `package.json` | `name: nashir`; `generate:creator-studio-types` script; no backend scripts |

### Confirmed baseline

- Nashir has **23 approved active screens**; V1 Core has **10 screens** as first productization priority.
- Current product is **still entirely mock/static** from backend/API perspective; all data is frontend mock/seed.
- **No backend/API strategy currently exists** — this gate defines it.
- **marketing-os is not a runtime base** and must not be used as one.

---

## 3. Strategy Principles

| Principle | Detail |
|---|---|
| Journey-first backend | Backend/API must serve the approved Nashir UI journey, not redefine product scope or impose new entities not required by the approved screens |
| Nashir independence | Nashir must stay independent from marketing-os runtime/code; marketing-os is reference-only |
| V1 Core first | Start from V1 Core (10 screens), not all 23 screens simultaneously |
| Non-destructive scope | Preserve all 23 screens; screens not yet backend-backed remain visible with mock/dev states |
| Progressive mock-to-real | Convert mock data progressively; do not replace entire UI at once |
| No false readiness | Do not imply real publishing, real analytics, real AI generation, or real integrations until implemented and verified |
| Arabic-first UX preserved | Backend changes must not force UI restructuring; existing Arabic-first UX and product flow must be preserved |
| Human-in-the-loop | AI/content/publishing flows must maintain human review requirements; no automated approval or automated publishing in V1 |

---

## 4. Backend Ownership Decision

### Options evaluated

**Option A — Backend inside `nashir` repository**

| | |
|---|---|
| Pros | Product and backend evolve together; simpler early coordination; clean Nashir ownership; single repository review cycle |
| Cons | Repo grows beyond UI; needs backend directory structure and CI/CD planning later |

**Option B — Separate `nashir-api` repository**

| | |
|---|---|
| Pros | Clean backend isolation; independent deployment lifecycle; separation of concerns |
| Cons | More governance overhead; cross-repo coordination; may slow early V1 development |

**Option C — Reuse marketing-os as backend runtime**

| | |
|---|---|
| Pros | Potential existing patterns and backend infrastructure |
| Cons | High product drift risk; would impose non-Nashir entities and journey constraints; violates current independence direction |

### Decision

**Adopt Option A as planning baseline.** Backend/API strategy should be designed for Nashir as an independent product. Backend code will live inside the `nashir` repository, either at the root level or under a future explicitly approved `server/` or `api/` directory.

- **Option B** remains available if later deployment boundaries or team structure require separation — this would require a separate repository structure gate.
- **Option C is rejected** for V1 runtime. marketing-os must not be the Nashir backend base.

---

## 5. Recommended Backend Architecture Direction

The following conceptual layers are recommended as planning direction. No implementation is authorized here.

| Layer | Purpose |
|---|---|
| API layer | HTTP request handling, routing, response shaping |
| Auth/workspace context layer | Authentication verification, workspace scoping per request |
| Domain service layer | Business logic, validation, workflow orchestration per V1 domain |
| Repository/data access layer | Data persistence, query, and transaction handling |
| Integration adapter layer | External data source and channel connection adapters |
| AI orchestration/provider adapter layer *(later)* | AI provider routing, prompt execution, response handling |
| Audit/event layer *(later)* | Append-only audit trail, immutable event recording |
| Background job/workflow layer *(later)* | Scheduled jobs, async processing, workflow execution |

**This is planning direction only.** Directory names and implementation structure must be decided in a future implementation planning gate. No code is added by this gate.

---

## 6. Technology Direction

| Decision | Recommendation | Rationale |
|---|---|---|
| Runtime language | **Node.js** | Current project is JavaScript/Vite; team workflow uses npm; natural progression |
| Type safety | **TypeScript for backend/API contracts** when implementation begins | Type safety at API boundary; consistent with generated types direction; but no TypeScript tooling added in this PR |
| Database | **PostgreSQL-compatible relational persistence** | Workspace/store/product/campaign/content/assets/statuses are relational; strong V1 fit |
| API style | **REST + OpenAPI** | Future gates already require API Contract/OpenAPI Gate; REST is standard and matches existing backend patterns studied from marketing-os |
| GraphQL | **Not recommended for V1** | Adds schema complexity and tooling overhead before V1 Core is stable |
| Event-driven/workflow-first | **Not for V1 Core first slices** | Workflow orchestration should be introduced later under controlled governance; keep first slices simple |
| AI provider routing | **Behind explicit governance gates** | Model routing, prompt governance, and AI orchestration require dedicated strategy and threat modeling |

No package.json or configuration changes are made in this PR.

---

## 7. Workspace, Identity, and Auth Strategy

| Decision area | Planning direction |
|---|---|
| Workspace scoping | Every V1 Core entity must be scoped by `workspaceId`; no cross-workspace access |
| Identity model | Initial V1 assumes one authenticated user may belong to one or more workspaces |
| Role candidates *(for later gate)* | owner/admin · editor/marketer · reviewer/approver · viewer |
| Auth mechanism | To be decided in Auth/RBAC/Workspace Identity Gate |
| Permission model | To be decided in Auth/RBAC/Workspace Identity Gate |

**Do not implement auth here. Do not introduce real permissions here.** The Auth/RBAC/Workspace Identity Gate defines the full model.

---

## 8. API Boundary Strategy

The following boundaries define future API domain groupings. These are planning candidates, not approved endpoints.

| API domain | Serves V1 screens | Notes |
|---|---|---|
| Store/Profile | `storeSetup`, `dashboard` | Workspace-scoped; foundational for all other domains |
| Product Catalog | `productCatalog`, `dashboard` | Depends on Store/Profile |
| Data Sources / Channel Connections | `dataSourcesHub` | Channel readiness; no real OAuth/publishing yet |
| Asset Library | `assetLibrary` | Media references; no real storage decisions yet |
| Campaigns | `campaigns`, `campaignsList`, `dashboard` | Campaign creation and management |
| Content Studio / Content Artifacts | `content` | Content drafts, status, and editing |
| Publishing Queue / Publishing Status | `publishingQueue` | Schedule tracking; no auto-publish in V1 |
| Analytics Read Models | `analytics`, `dashboard` | Read-only; derived from real data in later slices |

Endpoint details, request/response schemas, pagination, error model, and auth requirements belong to the **API Contract/OpenAPI Gate**. This strategy guides that gate, not replaces it.

---

## 9. V1 Core Backend Priority

| Slice | Domain | Screens | Dependencies |
|---|---|---|---|
| **Slice 1** | Store/Profile + Product Catalog + Data Sources + Asset Library | storeSetup, productCatalog, dataSourcesHub, assetLibrary | Workspace/identity model, ERD for store/product/asset/datasource |
| **Slice 2** | Campaigns + Content | campaigns, campaignsList, content | Slice 1 data (products, assets, data sources); content status model |
| **Slice 3** | Publishing Queue + Analytics | publishingQueue, analytics | Slice 2 campaign/content state; no auto-publish; analytics read model |
| **Dashboard** | Aggregation | dashboard | Derived from Slices 1–3 data |

This follows the approved V1 Core journey. It does not require all V1 Core backend in one slice. Slice 1 is the first real implementation target.

---

## 10. V1 Support and Admin/Governance Backend Strategy

### V1 Support

| Screen | Backend dependency | Sequencing |
|---|---|---|
| `multiPlatform` | Data Sources, Publishing Queue, channel connection model | After Slice 1–2 stable |
| `teamCollaboration` | Identity, roles, comments, audit trail, change history | After Auth/RBAC Gate and core data model |

### V1 Admin/Governance *(after core data model clarity and threat modeling)*

| Screen | Backend concerns | Special requirement |
|---|---|---|
| `secrets` | Secret/credential vault references; no raw secret storage | Threat Modeling Gate required |
| `modelRouting` | AI provider routing policy | AI governance gate + Threat Modeling |
| `promptGovernance` | Prompt versioning, review, audit | AI governance gate + Threat Modeling |
| `costMonitor` | Usage/cost event capture, budget limits | AI governance gate |
| `workflowRuns` | Job/workflow runtime model | Workflow layer planning |
| `templateEngine` | Template/content versioning | Content domain clarity first |
| `systemAdmin` | Elevated roles, admin boundaries | Auth/RBAC Gate first |
| `settings` | Workspace/user configuration model | Auth/RBAC Gate first |

**Admin/Governance backend should be planned after V1 Core model clarity and after Threat Modeling Gate is approved.**

---

## 11. Extended V1 Backend Strategy

| Screen | Backend strategy | Condition |
|---|---|---|
| `productIntelligence` | Depends on real product/catalog/campaign data; intelligence layer on top of Slice 1–2 data | After Slice 1–2 backend is real |
| `creatorStudio` | Existing fixture + generated types; highest acceleration candidate; session management, content generation pipeline | Re-evaluate after Slice 2 content domain is stable |
| `contentReview` | **Architectural decision required first:** standalone review/preview pipeline vs. integrated review state within Content Studio | Decision must precede backend; resolve before Slice 2 content backend begins |

**Do not delete or downgrade Extended V1. Do not implement Extended V1 backend before explicit sequencing and architectural decisions.**

---

## 12. Data Domain Candidates

The following are candidate future entities for the ERD. These are planning-level candidates only. ERD/Data Model Gate must approve final entities, relationships, naming, and required fields.

**Core merchant entities:**
`Workspace` · `User` · `WorkspaceMember` · `StoreProfile` · `Product` · `DataSource` · `ChannelConnection` · `Asset`

**Campaign and content entities:**
`Campaign` · `CampaignBrief` · `CampaignContentItem` · `ContentDraft` · `ContentApproval`

**Publishing and analytics entities:**
`PublishingJob` · `PublishingStatus` · `AnalyticsSnapshot`

**Governance and AI entities *(later slices)*:**
`IntegrationCredential` · `AuditEvent` · `Template` · `PromptVersion` · `ModelRoute` · `UsageCostEvent` · `WorkflowRun`

**Do not create schema files here.** ERD/Data Model Gate finalizes all entities.

---

## 13. API Contract Strategy

| Rule | Detail |
|---|---|
| Contract-first | API must be defined before UI integration |
| Contract format | OpenAPI (REST) recommended |
| Not in this gate | No OpenAPI file is created here |
| API Contract Gate must define | Paths, request/response schemas, error model, pagination/filtering, auth requirements, workspace scoping, id formats, status enums, generated type/client policy |
| UI integration blocked until | API contract is approved through API Contract/OpenAPI Gate |
| Generated client policy | Not decided here; requires OpenAPI/tooling decision gate |

---

## 14. Mock-to-Real Transition Strategy

| Rule | Detail |
|---|---|
| Mock fixtures are UX/state examples | Not data authority; do not migrate mock data directly to production schema |
| Preserve UI flow and labels | Backend transition must not require UI restructuring; Arabic labels and UX must remain intact |
| Specify per slice | Each implementation slice must specify which mock data becomes backend-backed |
| Screens not yet backend-backed | Must show safe mock/dev-only status, controlled loading/empty/error states — not fake production status |
| No fake production claims | Do not create fake live analytics, publishing confirmation, AI generation, or integration status |
| Avoid big-bang replacement | Convert domain-by-domain; maintain mock fallback until each slice is verified |

---

## 15. Security and Threat Strategy

**Threat Modeling/Security Gate is required before sensitive area implementation.**

Sensitive areas requiring threat modeling before backend work:
- Secrets/integration credentials (vault reference model, no raw storage)
- Publishing actions (human confirmation required; no auto-publish)
- AI provider/model routing
- Prompt governance and version control
- Cost tracking and budget enforcement
- Workspace membership and access control
- Content approval and human-in-the-loop review
- Audit logs (append-only; immutable)

Future security controls to evaluate:
- Workspace isolation per request
- Role-based access control
- Secret encryption at rest/transit
- Audit logging for sensitive operations
- Rate limiting and abuse prevention
- Input validation and sanitization
- Provider credential isolation
- Least privilege principle
- Safe error handling (no internal detail leakage)

---

## 16. Testing Strategy Direction

**Test Strategy Gate is required before implementation.**

Future test coverage areas:
- Domain service logic
- Repository/data access behavior
- API contract validation (contract tests)
- Workspace isolation (cross-workspace denial)
- Auth/RBAC behavior (role enforcement)
- UI integration behavior (response shape, error states)
- Loading/empty/error state handling
- Security-sensitive flows

No tests are added in this gate.

---

## 17. Marketing OS Boundary

| Rule | Status |
|---|---|
| `marketing-os` remains reference-only | **CONFIRMED** |
| No extraction authorized by this gate | **CONFIRMED** |
| Future extraction gate may study: governance patterns, backend/API concepts, RBAC concepts, OpenAPI concepts, provider/model/cost/prompt governance ideas, workflow concepts, operational lessons | Selective future study only |
| Extracted items must be categorized: Adopt / Adapt / Reject / Defer | For the extraction gate |
| Extracted items must not reduce Nashir's 23-screen scope | **CONFIRMED** |
| `marketing-os` must not become Nashir runtime base | **CONFIRMED** |

---

## 18. Recommended Next Gates

| Priority | Gate | Purpose |
|---:|---|---|
| 1 | **Nashir Backend/API Strategy Review Gate** | Reviews and accepts this strategy before strategy gates begin |
| 2 | **Nashir Marketing OS Knowledge Extraction Planning Gate** | Optional non-binding reference study; only if needed before ERD/API details |
| 3 | **Nashir ERD/Data Model Gate** | Approves entity model and relationships for V1 Core |
| 4 | **Nashir API Contract/OpenAPI Gate** | Approves API contract before UI integration or generated types |
| 5 | **Nashir Auth/RBAC/Workspace Identity Gate** | Defines workspace isolation and role/permission model |
| 6 | **Nashir Test Strategy Gate** | Defines test coverage requirements |
| 7 | **Nashir Threat Modeling/Security Gate** | Required before sensitive area implementation |
| 8 | **Nashir Data Migration/Storage Strategy Gate** | When persistent storage is introduced |
| 9 | **Nashir Environment/Deployment Strategy Gate** | When runtime hosting is introduced |
| 10 | **Nashir Real Implementation Slice 1 Planning Gate** | First real backend/API slice (Store/Profile + Product Catalog + Data Sources + Assets) |

**Real implementation cannot start until prerequisite gates are reviewed and approved. Marketing OS extraction is optional reference study — not a prerequisite if Nashir-first strategy is sufficient.**

---

## 19. Strategy Decision

| Decision | Status |
|---|---|
| Approve Nashir-first backend/API strategy direction | **APPROVED** |
| Backend designed for Nashir's approved V1 Core journey | **APPROVED** |
| REST/OpenAPI planning direction | **APPROVED** |
| Workspace-scoped domain model planning direction | **APPROVED** |
| PostgreSQL-compatible persistence planning direction | **APPROVED** |
| Node.js + TypeScript (future) planning direction | **APPROVED** |
| marketing-os remains reference-only | **CONFIRMED** |
| Option C (marketing-os as runtime base) rejected | **CONFIRMED** |
| No implementation authorized in this PR | **CONFIRMED** |

---

## 20. NO-GO Boundaries

```text
NO-GO: UI source code changes.
NO-GO: Navigation changes.
NO-GO: Screen deletion.
NO-GO: Screen renaming.
NO-GO: Backend code.
NO-GO: API implementation.
NO-GO: ERD/schema implementation.
NO-GO: OpenAPI files.
NO-GO: Auth/RBAC implementation.
NO-GO: Generated clients/types.
NO-GO: Runtime client.
NO-GO: Package/build/dependency changes.
NO-GO: marketing-os modifications.
NO-GO: marketing-os extraction.
NO-GO: Production/pilot readiness claims.
```

---

## 21. Verification

| Command | Result |
|---|---|
| `npm run lint` | **PASSED** |
| `npm run build` | **PASSED** |
| `git status --short` | Only new strategy gate doc untracked |
| `git diff --stat` | Only `docs/nashir_backend_api_strategy_gate.md` (new file) |
| Forbidden files check | **PASS** — no `src/`, `package.json`, `README.md`, `docs/screen_map.md`, or `marketing-os` files modified |

---

## 22. GO / NO-GO Result

| Decision | Status |
|---|---|
| **Backend/API strategy gate complete** | **GO** |
| **CONDITIONAL GO: Nashir Backend/API Strategy Review Gate** | After this gate merges |
| **CONDITIONAL GO: Marketing OS Knowledge Extraction Planning Gate** | After strategy review; optional non-binding study only |
| **CONDITIONAL GO: Nashir ERD/Data Model Gate** | After strategy review |
| **CONDITIONAL GO: Nashir API Contract/OpenAPI Gate** | After strategy review and ERD direction |
| Backend/API implementation | **NO-GO** |
| UI integration | **NO-GO** |
| ERD/schema implementation | **NO-GO** |
| OpenAPI creation | **NO-GO** |
| marketing-os extraction in this PR | **NO-GO** |
| Package/build changes | **NO-GO** |
| Production/pilot readiness | **NO-GO** |
