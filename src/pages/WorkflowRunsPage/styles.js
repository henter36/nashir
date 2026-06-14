export const styles = `
.workflow-builder-page {
  min-height: calc(100vh - 80px);
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(23, 107, 44, 0.06), transparent 32%),
    #f7f8f4;
  color: #1f241d;
  font-family: Inter, "Segoe UI", Tahoma, Arial, sans-serif;
}

.page-title,
.governance-alert,
.stat-card,
.tabs,
.template-card,
.steps-card,
.step-editor-card,
.map-card,
.contract-card,
.runs-card,
.test-card,
.run-detail-card,
.run-timeline-card,
.run-warnings-card,
.contracts-overview-card,
.pipeline-reflection-card,
.screen-guidance-card {
  background: #fff;
  border: 1px solid #e4e7df;
  border-radius: 24px;
  box-shadow: 0 8px 26px rgba(24, 38, 18, 0.035);
}

.page-title {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.eyebrow {
  width: fit-content;
  min-height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #176b2c;
  background: #eef7e9;
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 10px;
}

.page-title h1 {
  margin: 0;
  font-size: 34px;
  letter-spacing: -0.04em;
}

.page-title p {
  max-width: 850px;
  color: #6f746b;
  line-height: 1.8;
}

.title-actions {
  display: flex;
  gap: 10px;
}

.primary-button,
.secondary-button,
.danger-button {
  min-height: 42px;
  border-radius: 16px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.primary-button {
  border: 0;
  background: #176b2c;
  color: white;
}

.secondary-button {
  border: 1px solid #e4e7df;
  background: white;
}

.compact-action {
  min-height: 36px;
  justify-content: center;
}

.danger-button {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  width: 100%;
  justify-content: center;
}

.governance-alert {
  padding: 14px;
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
  color: #176b2c;
  background: #eef7e9;
  border-color: #d9ead7;
}

.governance-alert p {
  margin: 4px 0 0;
  line-height: 1.8;
  font-size: 13px;
  font-weight: 800;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.stat-card {
  padding: 16px;
}

.stat-card span {
  display: block;
  color: #6f746b;
  font-size: 13px;
  font-weight: 900;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
}

.tabs {
  padding: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tabs button {
  min-height: 38px;
  border: 0;
  background: transparent;
  border-radius: 999px;
  padding: 0 14px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.tabs button.active {
  background: #176b2c;
  color: white;
}

.builder-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 360px;
  gap: 16px;
  align-items: start;
}

.template-card,
.steps-card,
.step-editor-card,
.map-card,
.contract-card,
.runs-card,
.test-card,
.run-detail-card,
.run-timeline-card,
.run-warnings-card,
.contracts-overview-card,
.pipeline-reflection-card {
  padding: 18px;
}

.template-card h2,
.steps-card h2,
.step-editor-card h2,
.map-card h2,
.runs-card h2,
.test-card h2 {
  margin: 0 0 14px;
}

.test-row strong, .test-row span, .test-row small,
.run-step strong, .run-step span, .action-row strong, .action-row span,
.dry-run-mode strong, .dry-run-mode span,
.dry-result strong, .dry-result span, .dry-result p,
.expected-card strong, .expected-card span, .expected-card small, .expected-card em,
.reusable-output-list strong, .reusable-output-list span,
.screen-guidance-card strong, .screen-guidance-card span {
  display: block;
}

.test-row,
.contract-kpi,
.schema-preview,
.allowed-consumers,
.contract-risk-box,
.contract-safe-box {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 16px;
  padding: 12px;
}

.safe-preview,
.run-error,
.run-step,
.warning-row,
.action-row {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 18px;
  padding: 12px;
}

.dry-run-mode,
.expected-card,
.pipeline-step-card,
.pipeline-support-card {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 18px;
  padding: 13px;
}

.template-list {
  display: grid;
  gap: 10px;
}

.template-list button {
  border: 1px solid #e4e7df;
  background: white;
  border-radius: 18px;
  padding: 12px;
  text-align: right;
  font-family: inherit;
  cursor: pointer;
}

.template-list button.active {
  border-color: #176b2c;
  background: #eef7e9;
}

.template-list strong,
.template-list span {
  display: block;
}

.template-list span {
  margin-top: 4px;
  color: #6f746b;
  font-size: 11px;
  line-height: 1.5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.card-header h2 {
  margin: 0;
}

.card-header p {
  color: #6f746b;
  margin: 5px 0 0;
  font-size: 12px;
}

.workflow-meta {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.info-row {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 14px;
  padding: 10px;
}

.info-row span {
  display: block;
  color: #6f746b;
  font-size: 11px;
  font-weight: 900;
}

.info-row strong {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.6;
}

.steps-table {
  border: 1px solid #e4e7df;
  border-radius: 18px;
  overflow: hidden;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 40px 1fr 1.2fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  padding: 12px 14px;
  align-items: center;
}

.table-head {
  background: #f7f8f4;
  color: #6f746b;
  font-size: 12px;
  font-weight: 900;
}

.table-row {
  width: 100%;
  border: 0;
  border-top: 1px solid #e4e7df;
  background: white;
  text-align: right;
  font-family: inherit;
  cursor: pointer;
  font-size: 12px;
}

.table-row.selected {
  background: #fbfdf9;
}

.table-row strong,
.table-row small,
.table-row span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.model-route-summary {
  border: 1px solid #d9ead7;
  background: #fbfdf9;
  border-radius: 18px;
  padding: 12px;
  margin-top: 12px;
}

.model-route-summary.compact {
  padding: 9px;
  margin-top: 9px;
  border-radius: 14px;
}

.model-route-summary.missing,
.model-route-summary.has-warning {
  border-color: #fed7aa;
  background: #fff7ed;
}

.model-route-title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #176b2c;
  font-size: 12px;
  font-weight: 900;
}

.model-route-summary.missing .model-route-title,
.model-route-summary.has-warning .model-route-title {
  color: #9a3412;
}

.model-route-lines {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 9px;
}

.model-route-summary.compact .model-route-lines {
  grid-template-columns: 1fr;
}

.model-route-lines span,
.model-route-safe-note,
.model-route-summary p {
  color: #374151;
  font-size: 12px;
  line-height: 1.7;
  margin: 0;
}

.model-route-lines b {
  color: #1f241d;
}

.model-route-warnings {
  display: grid;
  gap: 5px;
  margin-top: 9px;
}

.model-route-warnings span {
  border-radius: 12px;
  background: #ffedd5;
  color: #9a3412;
  padding: 6px 8px;
  font-size: 11px;
  line-height: 1.6;
  font-weight: 800;
}

.model-route-safe-note {
  margin-top: 8px;
  color: #176b2c;
  font-weight: 800;
}

.step-readiness-panel {
  border: 1px solid #d9ead7;
  background: #fbfdf9;
  border-radius: 18px;
  padding: 12px;
}

.step-readiness-panel.warning {
  border-color: #fde68a;
  background: #fffaf0;
}

.step-readiness-panel.blocked {
  border-color: #fecaca;
  background: #fff5f5;
}

.step-readiness-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.step-readiness-head strong,
.readiness-notes strong {
  display: block;
  color: #1f241d;
  font-size: 13px;
}

.step-readiness-head span {
  display: block;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.6;
}

.step-readiness-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.readiness-notes {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.readiness-notes span {
  border-radius: 12px;
  padding: 7px 9px;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.6;
}

.blocked-notes span {
  color: #991b1b;
  background: #fee2e2;
}

.warning-notes span {
  color: #92400e;
  background: #ffedd5;
}

.safe-notes span {
  color: #166534;
  background: #ecfdf5;
}

.step-editor {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.field span,
.input-source-box > strong {
  font-size: 12px;
  font-weight: 900;
}

.field input,
.field select {
  min-height: 40px;
  border: 1px solid #e4e7df;
  border-radius: 14px;
  padding: 0 11px;
  font-family: inherit;
}

.input-source-box {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 18px;
  padding: 12px;
}

.input-source-box > div {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
}

.input-source-box button {
  min-height: 32px;
  border: 1px solid #e4e7df;
  background: white;
  border-radius: 999px;
  padding: 0 9px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
}

.input-source-box button.selected {
  border-color: #176b2c;
  background: #eef7e9;
  color: #176b2c;
}

.io-designer-card {
  border: 1px solid #e4e7df;
  background: #fbfdf9;
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 10px;
}

.workflow-trigger-card,
.flow-trigger-card {
  border: 1px solid #dbeafe;
  background: #f8fbff;
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
}

.flow-trigger-card > strong {
  color: #1f241d;
  font-size: 14px;
}

.flow-trigger-card p {
  margin: 0;
  color: #1d4ed8;
  font-size: 12px;
  line-height: 1.7;
  font-weight: 800;
}

.trigger-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

@media (max-width: 760px) {
  .trigger-info-grid {
    grid-template-columns: 1fr;
  }
}

.output-designer {
  background: #fff;
}

.chaining-card {
  background: #f8fbff;
  border-color: #dbeafe;
}

.io-designer-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.io-designer-head strong {
  color: #1f241d;
  font-size: 13px;
}

.io-designer-head span,
.inline-note,
.inline-warning {
  color: #6b7280;
  font-size: 11px;
  line-height: 1.6;
  font-weight: 800;
}

.structured-inputs {
  background: white;
}

.input-count {
  display: block;
  margin-top: 6px;
  color: #6b7280;
  font-size: 11px;
  font-weight: 900;
}

.selected-input-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.removable-chip {
  gap: 6px;
}

.removable-chip small {
  color: #9a3412;
  font-size: 10px;
}

.inline-warning {
  margin: 10px 0 0;
  color: #9a3412;
  background: #fff7ed;
  border-radius: 12px;
  padding: 8px 10px;
}

.inline-note {
  margin: 0;
  color: #176b2c;
  background: #eef7e9;
  border-radius: 12px;
  padding: 8px 10px;
}

.toggle-row {
  min-height: 40px;
  border-bottom: 1px solid #e4e7df;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-row span {
  font-size: 12px;
  font-weight: 900;
}

.switch {
  width: 48px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  background: #cbd5e1;
  padding: 3px;
  cursor: pointer;
}

.switch i {
  width: 20px;
  height: 20px;
  display: block;
  background: white;
  border-radius: 999px;
  transform: translateX(0);
  transition: 0.18s ease;
}

.switch.on {
  background: #176b2c;
}

.switch.on i {
  transform: translateX(-22px);
}

.flow-map {
  display: grid;
  gap: 12px;
}

.flow-node {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 20px;
  padding: 14px;
  display: grid;
  gap: 6px;
}

.node-index {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #eef7e9;
  color: #176b2c;
  font-weight: 900;
}

.flow-node span,
.flow-node em,
.flow-node p {
  color: #6f746b;
  font-size: 12px;
  line-height: 1.6;
}

.flow-node b {
  color: #176b2c;
}

.contracts-grid,
.mapping-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.contract-card h3 {
  margin: 0 0 12px;
}

.runs-layout,
.test-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 16px;
}

.runs-list,
.test-log {
  display: grid;
  gap: 10px;
}

.runs-list button {
  border: 1px solid #e4e7df;
  background: white;
  border-radius: 18px;
  padding: 13px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  text-align: right;
  font-family: inherit;
}

.status {
  width: fit-content;
  min-height: 28px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 900;
}

.status.green {
  background: #f0fdf4;
  color: #166534;
}

.status.blue {
  background: #eff6ff;
  color: #1d4ed8;
}

.status.amber {
  background: #fffbeb;
  color: #92400e;
}

.status.red {
  background: #fef2f2;
  color: #991b1b;
}

.test-card p,
.empty {
  color: #6f746b;
  line-height: 1.8;
}

.test-row span {
  margin-top: 5px;
  line-height: 1.7;
  font-size: 12px;
}

.test-row small {
  margin-top: 5px;
  color: #6f746b;
  font-size: 11px;
}

@media (max-width: 1320px) {
  .builder-layout,
  .runs-layout,
  .test-layout {
    grid-template-columns: 1fr;
  }

  .contracts-grid {
    grid-template-columns: 1fr;
  }

  .steps-table {
    overflow: auto;
  }

  .table-head,
  .table-row {
    min-width: 1150px;
  }
}

@media (max-width: 760px) {
  .workflow-builder-page {
    padding: 16px;
  }

  .page-title,
  .title-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .page-title h1 {
    font-size: 27px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}


/* إضافات مراقبة التشغيلات */
.enhanced-runs-layout {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr) 380px;
  gap: 16px;
  align-items: start;
}

.runs-count {
  width: fit-content;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef7e9;
  color: #176b2c;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 900;
}

.run-row.selected {
  border-color: #176b2c !important;
  background: #eef7e9 !important;
}

.run-row small {
  display: block;
  color: #6f746b;
  margin-top: 4px;
  font-size: 11px;
}

.run-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.run-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 14px 0;
}

.run-actions button {
  min-height: 38px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.safe-preview-grid {
  display: grid;
  gap: 10px;
}

.safe-preview strong,
.safe-preview p,
.run-error strong {
  display: block;
  margin: 0;
}

.safe-preview p {
  color: #374151;
  line-height: 1.8;
  margin-top: 6px;
  font-size: 13px;
}

.run-error {
  margin-top: 10px;
  border-color: #fecaca;
  background: #fef2f2;
}

.run-error code {
  display: block;
  direction: ltr;
  text-align: left;
  color: #991b1b;
  margin-top: 6px;
  white-space: pre-wrap;
}

.compact-alert {
  margin-top: 12px;
  box-shadow: none;
}

.run-timeline,
.warnings-list,
.actions-log {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.run-step,
.warning-row,
.action-row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.warning-row,
.action-row {
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: start;
}

.run-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #176b2c;
}

.run-step.running .run-dot {
  background: #2563eb;
}

.run-step.waiting_for_review .run-dot {
  background: #f59e0b;
}

.run-step.failed .run-dot {
  background: #dc2626;
}

.run-step span,
.action-row span {
  color: #6f746b;
  margin-top: 3px;
  font-size: 12px;
}

.action-row.green {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.action-row.amber {
  border-color: #fde68a;
  background: #fffbeb;
}

.action-row.red {
  border-color: #fecaca;
  background: #fef2f2;
}

/* تعزيز ضوابط المخرجات */

.contracts-enhanced-layout {
  display: grid;
  gap: 16px;
}

.contracts-count {
  color: #176b2c;
  background: #eef7e9;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.contracts-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.contract-kpi span {
  display: block;
  color: #6f746b;
  font-size: 11px;
  font-weight: 900;
}

.contract-kpi strong {
  display: block;
  margin-top: 6px;
  font-size: 22px;
  color: #176b2c;
}

.enhanced-contracts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.enhanced-contract-card {
  display: grid;
  gap: 12px;
}

.enhanced-contract-card.has-risk {
  border-color: #fde68a;
}

.contract-card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.contract-card-head h3 {
  margin: 0;
}

.contract-card-head p {
  margin: 4px 0 0;
  color: #6f746b;
  font-size: 12px;
}

.visibility-pill {
  min-height: 28px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 900;
}

.visibility-pill.customer_visible {
  color: #166534;
  background: #f0fdf4;
}

.visibility-pill.internal_only {
  color: #1d4ed8;
  background: #eff6ff;
}

.visibility-pill.reviewer_only {
  color: #92400e;
  background: #fffbeb;
}

.visibility-pill.admin_only {
  color: #475569;
  background: #f8fafc;
}

.contract-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.schema-preview strong,
.allowed-consumers strong,
.contract-risk-box strong {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
}

.schema-fields,
.allowed-consumers div {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.schema-fields span,
.allowed-consumers span {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 10px;
  font-weight: 900;
}

.contract-risk-box {
  border-color: #fde68a;
  background: #fff7e6;
  color: #92400e;
}

.contract-risk-box p {
  margin: 6px 0 0;
  line-height: 1.7;
  font-size: 12px;
  font-weight: 800;
}

.contract-safe-box {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #166534;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  font-weight: 900;
}

@media (max-width: 1180px) {
  .enhanced-contracts-grid,
  .contracts-kpi-grid {
    grid-template-columns: 1fr;
  }

  .contract-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1280px) {
  .enhanced-runs-layout {
    grid-template-columns: 1fr;
  }

  .run-info-grid,
  .run-actions {
    grid-template-columns: 1fr;
  }
}

/* تعزيز اختبار المسار */

.enhanced-test-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 16px;
  align-items: start;
}

.wide-test-card {
  grid-column: 1 / -1;
}

.dry-run-mode {
  margin: 14px 0;
}

.dry-run-mode span {
  margin-top: 4px;
  color: #6f746b;
  font-size: 12px;
}

.dry-result {
  border: 1px solid;
  border-radius: 18px;
  padding: 14px;
}

.dry-result span,
.dry-result p {
  margin-top: 6px;
  line-height: 1.7;
  font-size: 13px;
}

.dry-result.passed {
  color: #166534;
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.dry-result.blocked {
  color: #92400e;
  background: #fffbeb;
  border-color: #fde68a;
}

.blocked-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.blocked-list div {
  border: 1px solid #fde68a;
  background: #fff7e6;
  border-radius: 14px;
  padding: 10px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  line-height: 1.7;
  font-size: 12px;
  font-weight: 800;
}

.simulation-table {
  border: 1px solid #e4e7df;
  border-radius: 18px;
  overflow: hidden;
}

.simulation-head,
.simulation-row {
  display: grid;
  grid-template-columns: 40px 1.1fr 1fr 1.2fr 1fr 1fr 90px;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
}

.simulation-head {
  color: #6f746b;
  background: #f7f8f4;
  font-size: 12px;
  font-weight: 900;
}

.simulation-row {
  border-top: 1px solid #e4e7df;
  background: #fff;
  font-size: 12px;
}

.sim-ok,
.sim-blocked {
  width: fit-content;
  min-height: 26px;
  border-radius: 999px;
  padding: 0 9px;
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 900;
}

.sim-ok {
  color: #166534;
  background: #f0fdf4;
}

.sim-blocked {
  color: #92400e;
  background: #fffbeb;
}

.expected-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.expected-card span {
  margin-top: 5px;
}

.expected-card small {
  margin-top: 4px;
  color: #6f746b;
  font-size: 11px;
}

.expected-card em {
  margin-top: 8px;
  font-style: normal;
  font-size: 11px;
  font-weight: 900;
}

.expected-card.customer_visible {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.expected-card.internal_only {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.expected-card.reviewer_only {
  border-color: #fde68a;
  background: #fffbeb;
}

.expected-card.admin_only {
  border-color: #fecaca;
  background: #fef2f2;
}

@media (max-width: 1180px) {
  .enhanced-test-layout {
    grid-template-columns: 1fr;
  }

  .simulation-table {
    overflow: auto;
  }

  .simulation-head,
  .simulation-row {
    min-width: 980px;
  }

  .expected-grid {
    grid-template-columns: 1fr;
  }
}

.pipeline-reflection-card {
  margin-bottom: 16px;
}

.prototype-pill {
  background: #eef7e9;
  color: #176b2c;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.pipeline-step-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.pipeline-step-head {
  display: flex;
  gap: 9px;
  align-items: center;
  margin-bottom: 8px;
}

.pipeline-step-head span {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #176b2c;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 950;
  flex: 0 0 auto;
}

.pipeline-step-head strong,
.pipeline-support-card h3 {
  font-size: 14px;
  font-weight: 950;
}

.pipeline-support-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.15fr;
  gap: 12px;
  margin-top: 12px;
}

.readiness-check-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.pipeline-helper {
  color: #52604c;
  line-height: 1.7;
  font-size: 12px;
  font-weight: 800;
  margin: 8px 0 0;
}

.pipeline-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.pipeline-chip-grid span {
  border: 1px solid #d9ead7;
  background: #fff;
  color: #176b2c;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 900;
}

.reusable-output-list {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.reusable-output-list div {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
}

.reusable-output-list span {
  margin-top: 4px;
  color: #52604c;
  line-height: 1.6;
  font-size: 12px;
  font-weight: 800;
}

@media (max-width: 1180px) {
  .pipeline-step-grid,
  .pipeline-support-grid,
  .readiness-check-grid {
    grid-template-columns: 1fr;
  }
}

.screen-guidance-card {
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.screen-guidance-card div {
  border: 1px solid #edf0e8;
  background: #f8faf5;
  border-radius: 16px;
  padding: 10px;
}

.screen-guidance-card strong {
  color: #176b2c;
  font-size: 12px;
  font-weight: 950;
  margin-bottom: 6px;
}

.screen-guidance-card span {
  color: #384333;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.6;
}

@media (max-width: 1180px) {
  .screen-guidance-card {
    grid-template-columns: 1fr;
  }
}

/* ── Trigger: readiness warning ── */
.trigger-readiness-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff8e6;
  border: 1px solid #f5c842;
  border-radius: 10px;
  padding: 8px 12px;
  margin-top: 8px;
  color: #7a5a00;
  font-size: 12px;
  font-weight: 800;
}

/* ── Trigger: scope note ── */
.trigger-scope-note {
  margin-top: 10px;
  font-size: 11.5px;
  color: #6b7a5e;
  line-height: 1.65;
}

/* ── 8-lane flow header ── */
.flow-lanes-8 {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 6px;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #e8eddf;
  margin-bottom: 12px;
}

.flow-lanes-8 .lane-title {
  background: #f3f6ee;
  border: 1px solid #e2e8d8;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 900;
  color: #3a4a32;
  text-align: center;
}

/* ── 8-lane flow row ── */
.flow-row-8 {
  display: grid;
  grid-template-columns: 28px repeat(8, minmax(0, 1fr) 16px) minmax(0, 1fr);
  align-items: start;
  gap: 4px;
  padding: 14px 10px;
  border: 1px solid #e8eddf;
  border-radius: 14px;
  margin-bottom: 10px;
  background: #fafcf7;
  position: relative;
}

/* destination page cell */
.flow-cell-dest-page {
  background: #f0f7ff;
  border-radius: 8px;
  padding: 6px 8px;
}

.flow-cell-dest-page strong {
  color: #1a4a7a;
}

/* destination field cell */
.flow-cell-dest-field {
  border-radius: 8px;
  padding: 6px 8px;
  background: #eef6f0;
}

.flow-cell-dest-field.missing-field {
  background: #fff8e6;
  border: 1px dashed #f5c842;
}

.flow-field-missing {
  color: #8a6400;
  font-size: 11px;
  font-weight: 800;
  font-style: italic;
}

/* review cell */
.flow-cell-review {
  border-radius: 8px;
  padding: 6px 8px;
  background: #f5f0ff;
}

.flow-review-warn {
  color: #b04a00;
  font-size: 11px;
  font-weight: 800;
  display: block;
  margin-top: 4px;
}

/* next route cell */
.flow-cell-next-route {
  border-radius: 8px;
  padding: 6px 8px;
  background: #f0fdf4;
}

/* full-width governance warning */
.flow-warning-full {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff4e6;
  border: 1px solid #f5a742;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 6px;
  color: #7a3a00;
  font-size: 12px;
  font-weight: 800;
}

/* trigger card wide variant */
.flow-trigger-card-wide {
  margin-bottom: 16px;
}

.trigger-info-grid-wide {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-top: 8px;
}

/* lanes guide in sidebar */
.map-lanes-guide {
  margin-top: 16px;
  background: #f3f6ee;
  border: 1px solid #dce5d0;
  border-radius: 12px;
  padding: 12px;
}

.map-lanes-guide strong {
  display: block;
  font-size: 12px;
  font-weight: 950;
  color: #2e4028;
  margin-bottom: 8px;
}

.map-lanes-guide div {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: #4a5e40;
  font-weight: 800;
  margin-bottom: 4px;
  line-height: 1.5;
}

.lane-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6aaa52;
  flex-shrink: 0;
}

@media (max-width: 1180px) {
  .flow-lanes-8 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .flow-row-8 {
    grid-template-columns: 1fr;
  }
  .trigger-info-grid-wide {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

`;
