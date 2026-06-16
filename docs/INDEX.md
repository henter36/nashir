# Nashir UI Active Gates Index

**Purpose:** Single reviewable index of active UI gate documents and the completed UI refactor sequence. This file is a navigation/index document only — it does not authorize implementation, change runtime behavior, or supersede any individual gate.

---

## Completed UI refactor sequence

| PR | Commit title | Status |
|----|-------------|--------|
| [#191](../pull/191) | docs: review UI refactor report and execution sequence | Merged |
| [#192](../pull/192) | refactor: split dashboard page | Merged |
| [#193](../pull/193) | refactor: split workflow runs page | Merged |
| [#194](../pull/194) | refactor: split campaign wizard page | Merged |
| [#195](../pull/195) | refactor: split secrets and keys page | Merged |
| [#196](../pull/196) | refactor: split prompt governance page | Merged |
| [#197](../pull/197) | refactor: split model routing page | Merged |
| [#198](../pull/198) | refactor: split settings page | Merged |
| [#199](../pull/199) | refactor: split store setup page | Merged |
| [#200](../pull/200) | docs: plan UI error boundary route safety | Merged |
| [#201](../pull/201) | feat: add UI error boundary route safety | Merged |

---

## Active gate documents

### UI split execution gates

| Document | Page / scope |
|----------|-------------|
| [Dashboard Page Split Execution Gate](nashir_ui_dashboard_page_split_execution_gate.md) | DashboardPage |
| [Workflow Runs Page Split Execution Gate](nashir_ui_workflow_runs_page_split_execution_gate.md) | WorkflowRunsPage |
| [Campaign Wizard Page Split Execution Gate](nashir_ui_campaign_wizard_page_split_execution_gate.md) | CampaignWizardPage |
| [Secrets and Keys Page Split Execution Gate](nashir_ui_secrets_and_keys_page_split_execution_gate.md) | SecretsAndKeysPage |
| [Prompt Governance Page Split Execution Gate](nashir_ui_prompt_governance_page_split_execution_gate.md) | PromptGovernancePage |
| [Model Routing Page Split Execution Gate](nashir_ui_model_routing_page_split_execution_gate.md) | ModelRoutingPage |
| [Settings Page Split Execution Gate](nashir_ui_settings_page_split_execution_gate.md) | SettingsPage |
| [Store Setup Page Split Execution Gate](nashir_ui_store_setup_page_split_execution_gate.md) | StoreSetupPage |

### UI safety gates

| Document | Scope |
|----------|-------|
| [Error Boundary Route Safety Planning Gate](nashir_ui_error_boundary_route_safety_planning_gate.md) | ErrorBoundary — planning |
| [Error Boundary Route Safety Implementation Gate](nashir_ui_error_boundary_route_safety_implementation_gate.md) | ErrorBoundary — implementation |

### UI overview and reference gates

| Document | Scope |
|----------|-------|
| [Refactor Report Execution Sequence Review Gate](nashir_ui_refactor_report_execution_sequence_review_gate.md) | Refactor execution sequence review |
| [Readiness Consumption Mapping](nashir_ui_readiness_consumption_mapping_prototype_only.md) | Readiness consumption mapping |
| [Source-of-Truth Cleanup Acceptance Gate](nashir_ui_source_of_truth_cleanup_acceptance_gate.md) | Source-of-truth cleanup acceptance |

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
