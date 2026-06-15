# nashir_ui_error_boundary_route_safety_planning_gate

## Gate type
UI safety planning gate — documentation only. No runtime code in this PR.

## Step
Step 10 of the Nashir UI refactor execution sequence.

## Status
Planning. Pending review approval before any implementation PR is opened.

---

## 1. Purpose

Define the future implementation boundary for a minimal React Error Boundary around page-level rendering.

**Problem being addressed:**
The current prototype renders all pages through a single `App.jsx` page-switch. If any page component throws an unhandled render error, React unmounts the entire tree and the user sees a blank white screen with no recovery path.

**Goals for the future implementation PR:**
- Prevent full white-screen failures when one page component crashes.
- Show an Arabic-language fallback UI that allows the user to navigate away or retry.
- Preserve the navigation/sidebar shell so the user is never fully stranded.
- Keep all existing page behavior and Arabic RTL layout unchanged on the normal (non-error) path.
- Remain entirely in the frontend prototype boundary — no backend, API, or runtime changes.

---

## 2. Inputs

This planning gate follows the completed UI split sequence:

| Step | PR | Status |
|------|----|--------|
| Step 3 | DashboardPage split | Merged |
| Step 4 | WorkflowRunsPage split | Merged |
| Step 5 | CampaignWizardPage split | Merged |
| Step 6 | PromptGovernancePage split | Merged |
| Step 7 | SecretsAndKeysPage split | Merged |
| Step 8 | ModelRoutingPage split | Merged |
| Step 8b | SettingsPage split | Merged |
| Step 9 | StoreSetupPage split | Merged (PR #199) |

All page-level splits are complete. The codebase is ready for a cross-cutting safety wrapper as the next logical step.

---

## 3. Proposed future implementation scope

### 3.1 New file

**`src/components/ErrorBoundary.jsx`** (or `src/ui/ErrorBoundary.jsx`)

A class-based React Error Boundary (React requires a class component for `componentDidCatch` / `getDerivedStateFromError`).

Proposed structure:
```jsx
// Class component only — React Error Boundary API requires class syntax
class ErrorBoundary extends React.Component {
  constructor(props) { ... }
  static getDerivedStateFromError(error) { ... }
  componentDidCatch(error, info) { /* optional: console.error in dev */ }
  render() { ... }
}
```

**Fallback UI requirements:**
- Arabic RTL (`dir="rtl"`)
- Neutral message: does not imply data loss or backend failure
- Retry / reload action (e.g., `window.location.reload()` or prop-based reset)
- Minimal CSS — inline or a small co-located style block; no new stylesheet dependency

### 3.2 Wrapping point in App.jsx

`App.jsx` currently selects a page component and renders it. The wrapper must surround only the page-level render, not the navigation/sidebar shell, so that navigation remains available after a page crash.

**Proposed wrapping:**
```jsx
// Pseudocode — final form approved in implementation PR
<ErrorBoundary key={activeScreen} onReset={() => navigateToScreen("dashboard")}>
  {pageContent}
</ErrorBoundary>
```

- `key={activeScreen}`: resets the boundary automatically when the user navigates to a different page.
- `onReset`: optional prop passed to the fallback to allow navigating home.
- The navigation/sidebar shell renders outside the boundary.

**Touch surface in App.jsx is strictly limited to:**
- Adding the `ErrorBoundary` import.
- Wrapping the single page-render location.
- No route restructuring, no new state, no layout changes.

### 3.3 CSS

Only if the fallback UI requires styling beyond inline styles. If needed:
- A small co-located `errorBoundary.css` or `error-boundary.css` beside the component.
- No global stylesheet changes.
- No Tailwind, no new CSS framework.

---

## 4. Explicit non-goals

The future implementation PR must NOT include:

| Item | Reason |
|------|--------|
| Routing migration (e.g., React Router) | Out of scope for this step |
| React Router introduction | Not planned at this stage |
| Telemetry backend | No backend work allowed |
| Logging service integration (Sentry, Datadog, etc.) | No external dependencies |
| Global state introduction (Zustand, Redux, Context) | Not needed for a boundary wrapper |
| Page redesign or layout changes | Design freeze in effect |
| Page-specific behavior changes | Each page must remain unmodified |
| Tests or test infrastructure | Deferred |
| TypeScript introduction | Not planned |
| New package dependencies | Lockfile must remain unchanged |
| Broad refactoring of App.jsx beyond wrapping | Minimal-touch rule |

---

## 5. Candidate files for future implementation

| File | Action | Notes |
|------|--------|-------|
| `src/components/ErrorBoundary.jsx` | **Create** | Primary deliverable |
| `src/components/errorBoundary.css` | Create if needed | Only for fallback UI styling |
| `src/App.jsx` | **Minimal edit** | Add import + wrap page render only. Requires explicit approval in implementation PR. |

**Hard-blocked in implementation PR (same as prior steps):**
- All page components and their sub-directories
- `productCatalogStore.js`, `promptTemplateStore.js`, and other shared stores
- OpenAPI/generated types
- `package.json` / lockfiles
- Backend/API/runtime files

---

## 6. Risks

| Risk | Mitigation |
|------|-----------|
| `App.jsx` is the most sensitive file — it controls all page selection and rendering | Touch only the page-render wrap location; no other changes to App.jsx |
| A broad fallback may mask real defects if error messages are not surfaced | Log to `console.error` in development; show neutral message in fallback — never expose raw error stack to users |
| `ErrorBoundary` does not catch async errors or event-handler errors | Document this clearly; the boundary only covers synchronous render errors |
| Fallback UI wording may imply data loss or a backend failure | Use neutral Arabic copy: "حدث خطأ في عرض هذه الصفحة" — no mention of servers or data |
| Arabic RTL shell must not break | The boundary wraps only the page slot; the navigation shell renders outside it and is unaffected |
| `key={activeScreen}` resets boundary on navigation — if the crash source persists across pages, the user may see repeated fallback | Acceptable for a prototype; noted for V1 hardening |

---

## 7. Acceptance criteria for future implementation PR

The implementation PR is accepted only if ALL of the following are true:

- [ ] Existing navigation still works — clicking between pages renders the correct page
- [ ] Existing pages render unchanged on the normal (non-error) path
- [ ] A forced render error (e.g., temporarily throwing in a page) shows the Arabic fallback UI instead of a blank white screen
- [ ] The fallback UI is in Arabic RTL and does not mention servers, data loss, or backend errors
- [ ] A retry/reset action in the fallback does something meaningful (navigate home or reload)
- [ ] No page component files were modified
- [ ] No shared store files were modified
- [ ] No backend/API/OpenAPI/generated files were modified
- [ ] `package.json` and lockfiles are unchanged (no new dependencies)
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero errors/warnings
- [ ] `git diff --check` passes (no whitespace issues)

---

## 8. Required review decision

This planning gate PR is documentation only. It does not authorize any runtime changes.

**Decision required from reviewer:**

> **Decision: GO to Error Boundary implementation PR only after review approval of this gate.**

The implementation PR may be opened only after this planning gate is approved and merged. It must not authorize:
- Broader router or navigation restructuring
- Test infrastructure setup
- External error-monitoring service integration
- Any runtime changes beyond the minimal `ErrorBoundary` component and the single `App.jsx` wrapping point

---

## Governance classification

UI-only planning gate. Documentation only in this PR. No runtime code, no backend, no API, no SQL, no auth/RBAC, no migration, no generated client, no production boundary change.
