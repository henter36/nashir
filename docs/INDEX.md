# Nashir UI Active Gates Index

**Purpose:** Single reviewable index of active UI gate documents and the completed UI refactor sequence. This file is a navigation/index document only — it does not authorize implementation, change runtime behavior, or supersede any individual gate.

---

## Completed UI refactor sequence

| PR | Commit title | Status |
|----|-------------|--------|
| #191 | docs: review UI refactor report and execution sequence | Merged |
| #192 | refactor: split dashboard page | Merged |
| #193 | refactor: split workflow runs page | Merged |
| #194 | refactor: split campaign wizard page | Merged |
| #195 | refactor: split secrets and keys page | Merged |
| #196 | refactor: split prompt governance page | Merged |
| #197 | refactor: split model routing page | Merged |
| #198 | refactor: split settings page | Merged |
| #199 | refactor: split store setup page | Merged |
| #200 | docs: plan UI error boundary route safety | Merged |
| #201 | feat: add UI error boundary route safety | Merged |

---

## Active gate documents

### UI split execution gates

| Document | Page / scope |
|----------|-------------|
| [nashir_ui_dashboard_page_split_execution_gate.md](nashir_ui_dashboard_page_split_execution_gate.md) | DashboardPage |
| [nashir_ui_workflow_runs_page_split_execution_gate.md](nashir_ui_workflow_runs_page_split_execution_gate.md) | WorkflowRunsPage |
| [nashir_ui_campaign_wizard_page_split_execution_gate.md](nashir_ui_campaign_wizard_page_split_execution_gate.md) | CampaignWizardPage |
| [nashir_ui_secrets_and_keys_page_split_execution_gate.md](nashir_ui_secrets_and_keys_page_split_execution_gate.md) | SecretsAndKeysPage |
| [nashir_ui_prompt_governance_page_split_execution_gate.md](nashir_ui_prompt_governance_page_split_execution_gate.md) | PromptGovernancePage |
| [nashir_ui_model_routing_page_split_execution_gate.md](nashir_ui_model_routing_page_split_execution_gate.md) | ModelRoutingPage |
| [nashir_ui_settings_page_split_execution_gate.md](nashir_ui_settings_page_split_execution_gate.md) | SettingsPage |
| [nashir_ui_store_setup_page_split_execution_gate.md](nashir_ui_store_setup_page_split_execution_gate.md) | StoreSetupPage |

### UI safety gates

| Document | Scope |
|----------|-------|
| [nashir_ui_error_boundary_route_safety_planning_gate.md](nashir_ui_error_boundary_route_safety_planning_gate.md) | ErrorBoundary — planning |
| [nashir_ui_error_boundary_route_safety_implementation_gate.md](nashir_ui_error_boundary_route_safety_implementation_gate.md) | ErrorBoundary — implementation |

### UI overview and reference gates

| Document | Scope |
|----------|-------|
| [nashir_ui_refactor_report_execution_sequence_review_gate.md](nashir_ui_refactor_report_execution_sequence_review_gate.md) | Refactor execution sequence review |
| [nashir_ui_readiness_consumption_mapping_prototype_only.md](nashir_ui_readiness_consumption_mapping_prototype_only.md) | Readiness consumption mapping |
| [nashir_ui_source_of_truth_cleanup_acceptance_gate.md](nashir_ui_source_of_truth_cleanup_acceptance_gate.md) | Source-of-truth cleanup acceptance |

---

## Current implementation boundaries

These apply to all UI gates in the completed sequence above:

- **UI prototype only** unless an individual gate explicitly states otherwise.
- **No backend / API / OpenAPI changes** are authorized by UI gates.
- **No routing migration** — `App.jsx` page-switch model is unchanged.
- **No dependency additions** — `package.json` and lockfiles are frozen.
- **No page redesign** from these gates — Arabic RTL layout is preserved as-is.
- **ErrorBoundary scope** — protects the page-render slot only. It does not catch async errors, Promise rejections, or event-handler errors.

---

## Next recommended gate

**UI Runtime Safety Acceptance Review Gate** — or alternatively a **UI Refactor Completion Audit Gate** — to formally close the split sequence and verify that all split sub-modules are consistent across pages.

> Status: **Recommended, not authorized.** A planning gate PR is required before any implementation work begins.
