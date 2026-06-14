# Nashir UI Refactor Report — Execution Sequence Review Gate

| Field | Value |
|---|---|
| Gate type | Documentation-only sequencing review gate |
| Status | GO for sequencing |
| Repository | `henter36/nashir` |
| Code changes in this PR | NO |
| Backend runtime changes | NO |
| OpenAPI/generated changes | NO |
| Package/lockfile changes | NO |
| Product Catalog adapter changes | NO |
| Production readiness claimed | NO |

## Purpose

Review the UI refactor report, decide what is accepted for near-term execution,
define a safe incremental PR sequence, and surface the risks that must be managed
across the sequence. No code is changed in this gate.

---

## 1. Inputs

### UI Implementation State

- Framework: React 18 + Vite, Arabic RTL (`dir="rtl"` on page roots).
- Navigation: local `useState` in `src/App.jsx`; pages are `lazy`-imported with
  `Suspense`. No React Router. No global state manager.
- Page files live in `src/pages/`. Several pages are monolithic single-file
  components well above reviewable size.

### Page Size Snapshot (lines of JSX)

| Page file | Lines |
|---|---|
| `WorkflowRunsPage.jsx` | 4 971 |
| `CampaignWizardPage.jsx` | 3 557 |
| `SecretsAndKeysPage.jsx` | 2 748 |
| `PromptGovernancePage.jsx` | 2 368 |
| `ModelRoutingPage.jsx` | 2 156 |
| `SettingsPage.jsx` | 2 151 |
| `StoreSetupPage.jsx` | 1 791 |
| `CostMonitorPage.jsx` | 1 754 |
| `SystemAdminPage.jsx` | 1 676 |
| `PublishingQueuePage.jsx` | 1 519 |
| `MultiPlatformPage.jsx` | 1 482 |
| `ContentReviewPreviewUnifiedPage.jsx` | 1 384 |
| `CampaignsUnifiedPage.jsx` | 1 266 |
| `AssetLibraryPage.jsx` | 1 264 |
| `DashboardPage.jsx` | 1 201 |
| `ContentStudioPage.jsx` | 1 166 |
| `DataSourcesHubPage.jsx` | 1 015 |
| `AnalyticsUnifiedPage.jsx` | 1 000 |
| `CreatorStudioPage.jsx` | 717 |
| `ProductCatalogPage.jsx` | 369 |
| `TemplateEnginePage.jsx` | ~250 |
| `TeamCollaborationPage.jsx` | ~200 |

### Refactor Report Summary

The report recommends:

1. Split each large page into a page-level shell and co-located section/component
   files under a matching directory (e.g. `DashboardPage/index.jsx` +
   `DashboardPage/KpiRow.jsx`).
2. Introduce an error boundary component.
3. Add a baseline smoke test layer.
4. Add a Prettier formatting guard.
5. Migrate navigation to React Router.
6. Add Zustand for global state.
7. Migrate to TypeScript.
8. Add i18n support.
9. Add Storybook for component isolation.
10. Add Husky pre-commit hooks.
11. Consolidate and rewrite shared inline styles.

### V1 Priority

Stability, reviewability, and incremental execution. Each PR must be
independently buildable, lintable, and verifiable. No coordination risk between
concurrent streams.

---

## 2. Accepted Near-Term Scope

The following work is accepted for near-term execution, to be carried out in the
sequence defined in section 4:

- **Incremental page splitting.** Each large page is split in its own PR.
  Sub-components are co-located under a directory matching the page file name.
  The page shell (`index.jsx` or same-named file) remains the sole export to
  `App.jsx`; no import paths in `App.jsx` change during splitting.
- **Arabic RTL preservation.** All `dir="rtl"` root attributes, Arabic string
  literals, font selections, and right-to-left layout assumptions are preserved
  exactly. No RTL behavior may regress as a side-effect of file splitting.
- **Navigation model preservation.** Local `useState` navigation in `App.jsx`
  remains unchanged throughout the split sequence. No React Router, hash routing,
  or path-based routing is introduced until the router boundary gate is
  separately authorized.
- **Mock/prototype boundary preservation.** Fallback/mock data patterns in
  existing pages (including `ProductCatalogPage`) are not altered during
  splitting unless a separate authorization gate permits it.
- **Product Catalog adapter boundary preservation.** `ProductCatalogPage.jsx`,
  `productCatalogApi.js`, and `productCatalogStore.js` as delivered by PR #189
  are not touched during any page-split PR. The adapter's routes, allowlists,
  concurrency guards, and disabled-action boundaries remain frozen.
- **Error boundary infrastructure.** A minimal, reusable `ErrorBoundary`
  component may be introduced after the split sequence stabilizes, before or
  together with the smoke test layer.
- **Baseline smoke tests.** Lightweight render smoke tests may be added after
  error boundary infrastructure is present.
- **Prettier formatting guard.** A Prettier config and format check script may
  be added after the smoke test layer, before the router boundary gate.

---

## 3. Deferred Scope

The following items are explicitly deferred. None may be introduced during the
near-term split sequence:

| Item | Reason for deferral |
|---|---|
| React Router migration | Requires navigation model decision gate; coordinate risk with split sequence |
| Zustand / global state | Requires state architecture decision gate; must not precede page split stabilization |
| TypeScript migration | Large blast radius; requires separate type strategy gate |
| i18n | Requires string extraction and locale strategy gate; Arabic literals must not be altered during split |
| Storybook | Requires component boundary stabilization; premature before split complete |
| Husky pre-commit hooks | CI/CD-adjacent; requires separate tooling authorization |
| Broad shared-style rewrite | Risk to Arabic RTL layout; requires separate design-system gate |
| Backend / API / runtime changes | No backend work is in scope for this refactor sequence |
| OpenAPI or generated-type changes | No contract changes in scope |
| Product Catalog adapter scope expansion | Frozen at PR #189 state; separate gate required |

---

## 4. Required Execution Sequence

Each step is a single PR. Steps must be merged in order. No step may be opened
until the previous step has merged to `main`.

```
Step 1  docs: review UI refactor report and execution sequence    ← this PR
Step 2  refactor: split dashboard page
Step 3  refactor: split workflow runs page
Step 4  refactor: split campaign wizard page
Step 5  refactor: split secrets and keys page
Step 6  refactor: split prompt governance page
Step 7  refactor: split model routing page
Step 8  refactor: split settings page
Step 9  refactor: split store setup page
Step 10 chore: add error boundary infrastructure
Step 11 test: add baseline smoke tests
Step 12 chore: add prettier formatting guard
Step 13 docs: decide router migration boundary
```

### Sequencing Rationale

- **Step 2 first.** `DashboardPage` (1 201 lines) is the most immediately visible
  page and the smallest of the pages requiring structural split. It provides the
  lowest-risk pattern to validate the split convention before tackling larger
  files.
- **Steps 3–9 largest-to-smallest within each session.** `WorkflowRunsPage`
  (4 971 lines) and `CampaignWizardPage` (3 557 lines) are the highest priority
  after the pattern is established. `SettingsPage` and `StoreSetupPage` are split
  into separate PRs (Steps 8–9) to keep each PR independently reviewable.
- **Steps 10–12 after splits are stable.** Error boundary, smoke tests, and
  Prettier are infrastructure that should wrap a stable file tree, not one still
  being reorganized.
- **Step 13 as a documentation gate, not code.** The router migration is a
  significant architectural decision. Its gate document should be written after
  the split sequence is complete and the current component boundary inventory
  is accurate.

### Per-Step Constraints

Every split PR must:

1. Build cleanly (`npm run build`).
2. Pass lint (`npm run lint`).
3. Pass whitespace check (`git diff --check`).
4. Leave `App.jsx` import paths unchanged for the split page.
5. Leave all other pages untouched.
6. Leave `ProductCatalogPage.jsx`, `productCatalogApi.js`, and
   `productCatalogStore.js` untouched.
7. Preserve all Arabic RTL attributes and string literals verbatim.
8. Not add any npm dependency.
9. Not change any navigation state or routing mechanism.

---

## 5. Deferred Large Page Backlog

The near-term execution sequence (Steps 2–9) covers eight pages selected for
priority splitting. The following pages from the size snapshot are large enough
to warrant splitting but are not included in the near-term sequence. They are
deferred, not forgotten.

| Page file | Lines | Status |
|---|---|---|
| `CostMonitorPage.jsx` | 1 754 | Deferred — future PR or separately approved sequence |
| `SystemAdminPage.jsx` | 1 676 | Deferred — future PR or separately approved sequence |
| `PublishingQueuePage.jsx` | 1 519 | Deferred — future PR or separately approved sequence |
| `MultiPlatformPage.jsx` | 1 482 | Deferred — future PR or separately approved sequence |
| `ContentReviewPreviewUnifiedPage.jsx` | 1 384 | Deferred — future PR or separately approved sequence |
| `CampaignsUnifiedPage.jsx` | 1 266 | Deferred — future PR or separately approved sequence |
| `AssetLibraryPage.jsx` | 1 264 | Deferred — future PR or separately approved sequence |
| `ContentStudioPage.jsx` | 1 166 | Deferred — future PR or separately approved sequence |
| `DataSourcesHubPage.jsx` | 1 015 | Deferred — future PR or separately approved sequence |
| `AnalyticsUnifiedPage.jsx` | 1 000 | Deferred — future PR or separately approved sequence |

Each deferred page must be handled in its own future PR and must not be bundled
with any other large page. No multiple-large-page split PR is authorized, whether
within the near-term sequence or the deferred backlog.

---

## 6. Risk Review

### R1 — Splitting too many pages in one PR

**Risk:** A single PR touching multiple large pages is unreviable and increases
the probability of a missed regression in Arabic layout, state wiring, or
`lazy`-import contract.

**Mitigation:** One page per PR enforced by the sequence. `App.jsx` import paths
act as a lint-checkable boundary: if an import path in `App.jsx` changes, the PR
is out of scope.

### R2 — Changing the navigation model during refactor

**Risk:** Introducing React Router or hash routing mid-sequence invalidates the
assumption that each split PR is independently verifiable. A route change also
requires updating `App.jsx`, breaking the single-page-per-PR constraint.

**Mitigation:** Navigation model is explicitly frozen until Step 13. The router
boundary decision gate must precede any routing code.

### R3 — Introducing new state architecture before page split

**Risk:** If Zustand or a context provider is added before pages are split, the
state wiring must be duplicated or restructured again after splitting, producing
two large-blast-radius PRs instead of one.

**Mitigation:** All state architecture work is deferred until after Step 9. Each
split PR may only extract sub-components; it may not introduce new state
primitives.

### R4 — Adding tests/tooling before split boundaries are stable

**Risk:** Smoke tests written against monolithic page files will need to be
rewritten when those files are split into sub-components, creating churn.

**Mitigation:** Steps 10–12 are sequenced after Step 9. Smoke tests target the
page shell export, not internal sub-components, to reduce future churn even if
further splitting occurs.

### R5 — Breaking Arabic RTL identity

**Risk:** File splitting may inadvertently remove a `dir="rtl"` attribute,
alter an Arabic string, or change a right-to-left CSS class when copy-pasting
JSX into extracted sub-components.

**Mitigation:** Each split PR must include a diff-visible check that `dir="rtl"`
roots remain on the page shell and that no Arabic string literals were dropped or
modified. The PR description must explicitly confirm this.

### R6 — Accidentally changing Product Catalog adapter behavior

**Risk:** PR #189 delivered a narrow, review-verified adapter with frozen
boundaries. A page-split PR that touches `ProductCatalogPage.jsx` or its utility
files would reopen scope concerns.

**Mitigation:** `ProductCatalogPage.jsx`, `productCatalogApi.js`, and
`productCatalogStore.js` are listed as explicitly out-of-scope in the per-step
constraints. Any diff touching these files is a hard block on the split PR.

---

## 7. Decision

```
GO:    Documentation-only sequencing gate is complete.
GO:    DashboardPage split is the next authorized implementation PR after this gate merges.
GO:    Split sequence Steps 2–13 as defined above.

NO-GO: React Router, Zustand, TypeScript, i18n, Storybook, Husky, or broad
       styling rewrite in any split PR.
NO-GO: Multiple pages in a single split PR.
NO-GO: Any App.jsx navigation model change during the split sequence.
NO-GO: Any touch of ProductCatalogPage.jsx, productCatalogApi.js, or
       productCatalogStore.js in a split PR.
NO-GO: Backend, API, runtime, OpenAPI, generated type, or contract changes.
NO-GO: npm dependency additions.
NO-GO: Production or pilot readiness claims.
```
