export const styles = `
.campaign-wizard-page {
  min-height: calc(100vh - 80px);
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(23, 107, 44, 0.06), transparent 32%),
    #f7f8f4;
  color: #1f241d;
  font-family: Inter, "Segoe UI", Tahoma, Arial, sans-serif;
}

.page-title,
.card,
.footer-bar {
  background: #ffffff;
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

.page-title h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.2;
  letter-spacing: -0.04em;
}

.page-title p {
  margin: 7px 0 0;
  color: #6f746b;
  line-height: 1.8;
  font-size: 14px;
}

.badge {
  min-height: 30px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 900;
}

.badge.blue {
  color: #1d4ed8;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.badge.green {
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.badge.amber {
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.badge.neutral {
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.step-tabs {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.step-tab {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 20px;
  padding: 12px;
  text-align: right;
  display: flex;
  gap: 10px;
  min-height: 82px;
  font-family: inherit;
  cursor: pointer;
}

.step-tab.current {
  border-color: #176b2c;
  background: #eef7e9;
  box-shadow: 0 0 0 4px #eef7e9;
}

.step-tab.done {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: #f7f8f4;
  font-size: 12px;
  font-weight: 900;
}

.step-tab.current .step-number {
  background: #176b2c;
  color: #fff;
}

.step-tab.done .step-number {
  background: #16a34a;
  color: #fff;
}

.step-tab strong {
  display: block;
  font-size: 13px;
}

.step-tab span {
  display: block;
  color: #6f746b;
  font-size: 11px;
  line-height: 1.5;
  margin-top: 3px;
}

.wizard-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 16px;
  align-items: start;
}

.wizard-main {
  display: grid;
  gap: 16px;
}

.card {
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7df;
}

.section-icon {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  background: #176b2c;
  color: #fff;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.section-header h2 {
  margin: 0;
  font-size: 22px;
}

.section-header p {
  margin: 5px 0 0;
  color: #6f746b;
  line-height: 1.7;
  font-size: 13px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-grid.compact-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field,
.choice-section {
  display: grid;
  gap: 8px;
}

.field.wide,
.choice-section.wide {
  grid-column: 1 / -1;
}

.field span,
.choice-title {
  font-size: 13px;
  font-weight: 900;
}

.field input,
.field textarea,
.field select,
.product-picker-row select {
  width: 100%;
  border: 1px solid #e4e7df;
  border-radius: 16px;
  background: #fff;
  color: #1f241d;
  outline: none;
  font-family: inherit;
}

.field input,
.field select,
.product-picker-row select {
  min-height: 46px;
  padding: 0 13px;
}

.field textarea {
  min-height: 120px;
  resize: vertical;
  padding: 13px;
  line-height: 1.8;
}

.field small {
  color: #6f746b;
  font-size: 11px;
}

.product-picker-field {
  grid-column: 1 / -1;
}

.product-picker-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.quick-product-box {
  grid-column: 1 / -1;
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 20px;
  padding: 14px;
}

.quick-product-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.quick-product-header strong {
  font-size: 15px;
}

.quick-product-header button {
  width: 34px;
  height: 34px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.choice-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.choice-row button {
  min-height: 38px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 16px;
  padding: 0 13px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.choice-row button.selected {
  border-color: #176b2c;
  background: #eef7e9;
  color: #176b2c;
}

.store-plan-suggestions {
  grid-column: 1 / -1;
  border: 1px solid #d9ead7;
  background: #eef7e9;
  border-radius: 20px;
  padding: 14px;
}

.suggestion-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.suggestion-head h3 {
  margin: 0;
  font-size: 16px;
}

.suggestion-head p,
.store-plan-suggestions small {
  display: block;
  margin-top: 5px;
  color: #52604c;
  line-height: 1.7;
  font-size: 12px;
  font-weight: 800;
}

.saved-flow-card {
  border: 1px solid #d9ead7;
  background: #eef7e9;
  border-radius: 18px;
  padding: 12px;
  margin-top: 12px;
}

.saved-flow-card .notice {
  margin: 0 0 10px;
}

.saved-flow-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.asset-step-header {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 18px;
  padding: 12px;
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.asset-step-header span {
  color: #6f746b;
  font-size: 13px;
  font-weight: 900;
}

.asset-readiness-summary {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.asset-readiness-summary.compact {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-bottom: 8px;
}

.asset-info-cell {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
}

.asset-info-cell span,
.asset-info-cell strong {
  display: block;
}

.asset-info-cell span {
  color: #6f746b;
  font-size: 11px;
  font-weight: 900;
}

.asset-info-cell strong {
  margin-top: 5px;
  color: #25301f;
  font-size: 12px;
  line-height: 1.6;
}

.asset-selection-section {
  margin-bottom: 16px;
}

.asset-section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.asset-section-title h3 {
  margin: 0;
  font-size: 15px;
}

.asset-select-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.asset-select-card {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 18px;
  padding: 13px;
  text-align: right;
  display: grid;
  gap: 8px;
  font-family: inherit;
  cursor: pointer;
}

.asset-select-card.selected {
  border-color: #176b2c;
  background: #fbfdf9;
  box-shadow: 0 0 0 4px #eef7e9;
}

.asset-select-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #176b2c;
  background: #eef7e9;
}

.asset-select-card strong {
  font-size: 13px;
  line-height: 1.5;
}

.asset-select-card > span {
  color: #6f746b;
  font-size: 12px;
}

.asset-select-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.upload-box {
  min-height: 140px;
  border: 1px dashed #9fd0a6;
  background: #eef7e9;
  color: #176b2c;
  border-radius: 20px;
  padding: 16px;
  display: grid;
  place-items: center;
  text-align: center;
  align-content: center;
  gap: 8px;
}

.upload-box strong,
.upload-box span {
  display: block;
}

.upload-box span {
  color: #4b6b52;
  font-size: 12px;
}

.notice {
  grid-column: 1 / -1;
  border-radius: 18px;
  padding: 14px;
  margin-bottom: 16px;
  line-height: 1.8;
  font-size: 13px;
  font-weight: 800;
}

.notice.neutral {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  color: #1f241d;
}

.notice.amber {
  border: 1px solid #fde68a;
  background: #fff7e6;
  color: #92400e;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.metric {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #166534;
  border-radius: 18px;
  padding: 14px;
}

.metric.amber {
  border-color: #fde68a;
  background: #fff7e6;
  color: #92400e;
}

.metric span,
.metric strong {
  display: block;
}

.metric span {
  font-size: 12px;
  font-weight: 900;
}

.metric strong {
  margin-top: 6px;
  font-size: 22px;
}

.brief-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.brief-row {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 16px;
  padding: 12px;
}

.brief-row span {
  display: block;
  color: #6f746b;
  font-size: 12px;
  font-weight: 900;
}

.brief-row strong {
  display: block;
  margin-top: 6px;
  line-height: 1.6;
}

.readiness-layout {
  display: grid;
  gap: 16px;
}

.approval-sequence-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 16px 0;
}

.approval-sequence-strip span {
  border: 1px solid #d9ead7;
  background: #eef7e9;
  color: #176b2c;
  border-radius: 16px;
  padding: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 950;
}

.suggested-text-approval-card {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 20px;
  padding: 14px;
  margin-bottom: 16px;
}

.output-approval-summary-card {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 20px;
  padding: 14px;
  margin-bottom: 16px;
}

.output-approval-summary-card h3 {
  margin: 0;
  font-size: 17px;
}

.output-approval-summary-card p {
  margin: 6px 0 12px;
  color: #6f746b;
  line-height: 1.7;
  font-size: 12px;
  font-weight: 800;
}

.approval-card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.approval-card-head h3 {
  margin: 0;
  font-size: 17px;
}

.approval-card-head p {
  margin: 5px 0 0;
  color: #6f746b;
  line-height: 1.7;
  font-size: 12px;
}

.suggested-campaign-text {
  border: 1px solid #d9ead7;
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 12px;
}

.suggested-campaign-text span {
  display: block;
  color: #6f746b;
  font-size: 12px;
  font-weight: 900;
}

.suggested-campaign-text strong {
  display: block;
  margin-top: 6px;
  line-height: 1.8;
}

.output-explanation-list {
  display: grid;
  gap: 14px;
}

.output-card {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 20px;
  padding: 14px;
}

.output-card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.output-card-header strong {
  display: block;
}

.output-card-header span {
  color: #6f746b;
  font-size: 12px;
}

.generated-artifact-grid,
.generated-output-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.output-approval-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
}

.customer-output,
.internal-output {
  border-radius: 16px;
  padding: 12px;
  margin-top: 10px;
}

.customer-output {
  background: #eef7e9;
  border: 1px solid #d9ead7;
}

.internal-output {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.customer-output h4,
.internal-output h4 {
  margin: 0 0 8px;
  font-size: 13px;
}

.customer-output p,
.internal-output p {
  margin: 0;
  line-height: 1.8;
  font-size: 13px;
}

.internal-output p {
  font-family: monospace;
  color: #475569;
  letter-spacing: 1px;
}

.internal-output small {
  display: block;
  margin-top: 8px;
  color: #92400e;
  font-size: 11px;
  font-weight: 800;
}

.output-footer {
  margin-top: 10px;
  color: #6f746b;
  font-size: 11px;
}

.smart-panel {
  position: sticky;
  top: 96px;
}

.smart-box {
  background: #eef7e9;
}

.smart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #176b2c;
  margin-bottom: 14px;
}

.smart-title h3 {
  margin: 0;
}

.tips-list {
  display: grid;
  gap: 10px;
}

.tip {
  display: flex;
  gap: 10px;
  background: white;
  border-radius: 16px;
  padding: 12px;
}

.tip span {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #eef7e9;
  color: #176b2c;
  font-size: 12px;
  font-weight: 900;
  flex: 0 0 auto;
}

.tip p {
  margin: 0;
  color: #1f241d;
  line-height: 1.7;
  font-size: 13px;
}

.smart-summary {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.smart-summary div {
  background: white;
  border-radius: 16px;
  padding: 12px;
}

.smart-summary span {
  display: block;
  color: #6f746b;
  font-size: 12px;
  font-weight: 900;
}

.smart-summary strong {
  display: block;
  margin-top: 5px;
}

.footer-bar {
  position: sticky;
  bottom: 16px;
  z-index: 10;
  margin-top: 18px;
  padding: 14px;
  display: grid;
  grid-template-columns: auto minmax(220px, 1fr) auto;
  gap: 12px;
  align-items: center;
  backdrop-filter: blur(16px);
}

.footer-progress {
  display: grid;
  gap: 7px;
  text-align: center;
  color: #176b2c;
  font-size: 13px;
}

.footer-progress span {
  height: 7px;
  background: #eef7e9;
  border-radius: 999px;
  overflow: hidden;
}

.footer-progress i {
  display: block;
  height: 100%;
  background: #176b2c;
  border-radius: inherit;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.button {
  min-height: 42px;
  border-radius: 16px;
  padding: 0 16px;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
}

.button.primary {
  background: #176b2c;
  color: white;
}

.button.secondary {
  background: white;
  color: #1f241d;
  border: 1px solid #e4e7df;
}

.button.compact {
  min-height: 38px;
  padding: 0 12px;
  font-size: 12px;
}

.button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 1180px) {
  .step-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .wizard-layout {
    grid-template-columns: 1fr;
  }

  .smart-panel {
    position: static;
  }

  .upload-grid,
  .asset-readiness-summary,
  .asset-select-grid,
  .metrics-grid,
  .approval-sequence-strip,
  .output-approval-actions,
  .generated-artifact-grid,
  .generated-output-detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .campaign-wizard-page {
    padding: 16px;
  }

  .page-title,
  .footer-bar {
    grid-template-columns: 1fr;
  }

  .page-title {
    flex-direction: column;
  }

  .page-title h1 {
    font-size: 27px;
  }

  .step-tabs,
  .form-grid,
  .form-grid.compact-grid,
  .upload-grid,
  .asset-readiness-summary,
  .asset-select-grid,
  .metrics-grid,
  .approval-sequence-strip,
  .output-approval-actions,
  .generated-artifact-grid,
  .generated-output-detail-grid,
  .brief-grid {
    grid-template-columns: 1fr;
  }

  .product-picker-row {
    grid-template-columns: 1fr;
  }

  .footer-actions,
  .button-row {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}

.screen-guidance-card {
  background: #fff;
  border: 1px solid #e4e7df;
  border-radius: 24px;
  box-shadow: 0 8px 26px rgba(24, 38, 18, 0.035);
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.screen-guidance-card div {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 16px;
  padding: 10px;
}

.screen-guidance-card span {
  display: block;
  color: #6f746b;
  font-size: 12px;
  font-weight: 900;
}

.screen-guidance-card strong {
  display: block;
  margin-top: 5px;
  color: #1f241d;
  font-size: 12px;
  line-height: 1.6;
}

.product-intelligence-context-panel {
  background: #fff;
  border: 1px solid #bfdbfe;
  border-radius: 24px;
  box-shadow: 0 8px 26px rgba(24, 38, 18, 0.035);
  padding: 16px;
  margin-bottom: 16px;
}

.product-intelligence-context-panel .section-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.product-intelligence-context-panel h2 {
  margin: 0;
  font-size: 20px;
}

.product-intelligence-context-panel p {
  margin: 7px 0 0;
  color: #6f746b;
  line-height: 1.8;
  font-size: 13px;
}

.context-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.starter-section {
  margin-top: 14px;
}

.starter-section h3,
.starter-list-card h3 {
  margin: 0 0 10px;
  font-size: 15px;
}

.context-preview-grid,
.starter-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.starter-lists-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.context-preview-grid div,
.starter-summary-grid div,
.starter-list-card {
  border: 1px solid #dbeafe;
  background: #eff6ff;
  border-radius: 16px;
  padding: 10px;
}

.starter-summary-grid div {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.starter-list-card.muted {
  background: #fff7ed;
  border-color: #fed7aa;
}

.context-preview-grid span,
.starter-summary-grid span {
  display: block;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.starter-summary-grid span {
  color: #475569;
}

.context-preview-grid strong,
.starter-summary-grid strong {
  display: block;
  margin-top: 5px;
  line-height: 1.6;
  font-size: 13px;
}

.starter-list-card ul {
  margin: 0;
  padding-right: 18px;
  color: #334155;
  line-height: 1.9;
  font-size: 13px;
}

.starter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.context-demo-note {
  font-weight: 900;
}

.starter-notice-outside {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 16px;
  color: #9a3412;
  line-height: 1.7;
  margin: 0 0 16px;
  padding: 10px 12px;
}

@media (max-width: 1280px) {
  .screen-guidance-card,
  .context-preview-grid,
  .starter-summary-grid,
  .starter-lists-grid { grid-template-columns: 1fr; }

  .product-intelligence-context-panel .section-title-row {
    display: grid;
  }

  .context-badges {
    justify-content: flex-start;
  }
}

.output-generation-readiness-block {
  border: 1px solid #d9ead7;
  background: #eef7e9;
  border-radius: 20px;
  padding: 14px;
  margin-bottom: 16px;
}

.output-generation-readiness-block h3 {
  margin: 0;
  font-size: 17px;
  color: #176b2c;
}

.output-generation-readiness-block p {
  margin: 6px 0 12px;
  color: #52604c;
  line-height: 1.7;
  font-size: 12px;
  font-weight: 800;
}

.output-generation-readiness-block small {
  display: block;
  margin-top: 8px;
  color: #52604c;
  font-size: 11px;
}

.readiness-block-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.readiness-disclaimer-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 4px;
}

.readiness-disclaimer-strip span {
  border: 1px solid #9fd0a6;
  background: #fff;
  color: #176b2c;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 900;
}

.output-linkage-panel {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 16px;
  padding: 12px;
  margin: 10px 0;
  display: grid;
  gap: 10px;
}

.linkage-panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.linkage-panel-title > span {
  font-size: 13px;
  font-weight: 900;
  color: #1f241d;
}

.linkage-info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.linkage-prompt-select {
  display: grid;
  gap: 6px;
}

.linkage-prompt-select > span {
  font-size: 12px;
  font-weight: 900;
  color: #6f746b;
}

.linkage-prompt-select select {
  width: 100%;
  min-height: 40px;
  border: 1px solid #e4e7df;
  border-radius: 12px;
  background: #fff;
  color: #1f241d;
  padding: 0 12px;
  font-family: inherit;
  font-size: 13px;
}

.linkage-empty-notice {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 12px;
  color: #6f746b;
  font-weight: 800;
}

.fields-readiness-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.fields-group {
  display: grid;
  gap: 6px;
}

.fields-group > span {
  font-size: 11px;
  font-weight: 900;
  color: #6f746b;
}

.fields-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.field-chip {
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 900;
}

.field-chip.ready {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.field-chip.missing {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #9a3412;
}

.linkage-readiness-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.linkage-generate-action {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.linkage-warn {
  border: 1px solid #fde68a;
  background: #fff7e6;
  color: #92400e;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.6;
}

.linkage-prototype-note {
  display: block;
  color: #6f746b;
  font-size: 11px;
  line-height: 1.6;
}

.generated-output-display {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  border-radius: 16px;
  padding: 12px;
  margin: 10px 0;
  display: grid;
  gap: 10px;
}

.generated-output-display-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.generated-output-display-header strong {
  font-size: 14px;
  color: #166534;
}

.generated-content-body {
  border: 1px solid #d9ead7;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
}

.generated-content-body pre {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 13px;
  color: #1f241d;
  direction: rtl;
}

.generated-output-helper {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 12px;
  color: #6f746b;
  font-weight: 800;
  line-height: 1.6;
}

@media (max-width: 1180px) {
  .linkage-info-grid,
  .fields-readiness-grid,
  .linkage-readiness-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .linkage-info-grid,
  .fields-readiness-grid,
  .linkage-readiness-row {
    grid-template-columns: 1fr;
  }

  .readiness-block-head {
    flex-direction: column;
  }
}
`;
