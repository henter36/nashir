# Nashir UI Source-of-Truth Cleanup Acceptance Gate

| Field | Value |
|---|---|
| Gate type | UI source-of-truth cleanup acceptance gate |
| Status | GO |
| Scope | Accepts the emergency cleanup that makes henter36/nashir the only approved Nashir Product UI source |
| UI source of truth | henter36/nashir |
| Approved Product UI | Arabic React UI with exactly 23 pages |
| marketing-os UI role | No Nashir Product UI authority |
| nashir-backend UI role | No frontend/Product UI files |
| Production readiness claimed | NO |

---

## 1. Final Decision

**GO.**

`henter36/nashir` and its Arabic React UI with exactly 23 approved pages is the only approved Nashir Product UI source.

No other repository may create, restore, serve, document, or imply an alternative Nashir Product UI without a dedicated future gate.

---

## 2. Approved 23 Pages

```text
dashboard
storeSetup
productCatalog
productIntelligence
dataSourcesHub
assetLibrary
campaigns
campaignsList
creatorStudio
content
contentReview
publishingQueue
analytics
templateEngine
multiPlatform
teamCollaboration
workflowRuns
systemAdmin
secrets
modelRouting
promptGovernance
costMonitor
settings

3. Accepted Nashir Repository State

Accepted:

Exactly 23 active App.jsx screens.
Exactly 23 JSX page components.
Two legitimate CSS companions.
productIntelligence, creatorStudio, and contentReview explicitly documented.
Obsolete src/App.dashboard.backup.jsx removed.
README and docs/screen_map.md aligned with the 23-page source of truth.
4. Accepted marketing-os Cleanup State

Accepted:

ui/nashir/index.html removed.
ui/nashir/app.js removed.
ui/nashir/styles.css removed.
/nashir and /nashir/ static serving removed.
Obsolete static-serving tests removed.
Tests added to prevent restoring the harness or Product UI route.
Misleading Nashir UI planning, serving, smoke, implementation, and authority documents removed.
Exactly one tombstone remains: docs/nashir_ui_deprecation_tombstone.md.
README, decision log, and change log updated with the superseding authority decision.
marketing-os/prototype remains generic and contains no Nashir references.
5. Accepted nashir-backend State

Accepted:

No frontend/Product UI files.
No HTML, JSX, TSX, CSS, Vue, or Svelte files.
No backend files changed for this cleanup.
Backend remains runtime/API only.
6. Explicit NO-GO Boundaries
NO-GO: Any Nashir Product UI outside henter36/nashir.
NO-GO: Restoring marketing-os/ui/nashir.
NO-GO: Serving /nashir or /nashir/ from marketing-os.
NO-GO: Treating any marketing-os UI, harness, prototype, or tombstone as Product UI.
NO-GO: Adding a second Nashir UI tombstone or competing authority document.
NO-GO: Modifying OpenAPI, generated types, migrations, or backend product routes as part of UI cleanup.
NO-GO: Adding UI features before the approved 23-page surface remains clean on main.
7. Verification Evidence

Required verification:

git diff --check
npm run lint
npm run build -- --outDir /tmp/nashir-ui-build

For marketing-os:

test ! -d ui/nashir
npm test

For nashir-backend:

find . -type f \( -name "*.html" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.css" -o -name "*.vue" -o -name "*.svelte" \) -print

Expected result: no frontend/Product UI files.

8. Result
GO: henter36/nashir 23-page Arabic React UI remains the only Nashir Product UI.
NO-GO: Any other Nashir UI surface claiming or implying Product UI authority.
9. Next Allowed Gate
Backend Slice 0 Post-UI-Authority Reconciliation Gate

Purpose:

Verify backend/OpenAPI/generated types documentation no longer assumes marketing-os/ui/nashir.
Confirm future API integration targets the approved henter36/nashir UI only.
Preserve backend implementation boundaries.
