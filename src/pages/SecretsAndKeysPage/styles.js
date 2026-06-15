export const styles = `
.secrets-unified-page {
  min-height: calc(100vh - 80px);
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.06), transparent 32%),
    #f7f8f4;
  color: #1f241d;
  font-family: Inter, "Segoe UI", Tahoma, Arial, sans-serif;
}

.page-title,
.governance-alert,
.stat-card,
.toolbar-card,
.providers-table-card,
.drawer-card,
.side-card {
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
  color: #1d4ed8;
  background: #eff6ff;
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 10px;
}

.page-title h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.2;
  letter-spacing: -0.04em;
}

.page-title p {
  margin: 7px 0 0;
  max-width: 850px;
  color: #6f746b;
  line-height: 1.8;
  font-size: 14px;
}

.title-actions {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.primary-button,
.secondary-button {
  min-height: 42px;
  border-radius: 16px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.primary-button {
  color: #fff;
  border: 0;
  background: #1d4ed8;
  box-shadow: 0 12px 24px rgba(29, 78, 216, 0.16);
}

.secondary-button {
  color: #1f241d;
  background: #fff;
  border: 1px solid #e4e7df;
}

.governance-alert {
  margin-bottom: 16px;
  border-color: #fde68a;
  background: #fff7e6;
  color: #92400e;
  padding: 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.governance-alert strong {
  display: block;
  margin-bottom: 4px;
}

.governance-alert p {
  margin: 0;
  line-height: 1.8;
  font-size: 13px;
  font-weight: 800;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.stat-card {
  min-height: 104px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-card span {
  color: #6f746b;
  font-size: 13px;
  font-weight: 900;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
}

.stat-card.green .stat-icon {
  color: #166534;
  background: #f0fdf4;
}

.stat-card.amber .stat-icon {
  color: #92400e;
  background: #fffbeb;
}

.stat-card.blue .stat-icon {
  color: #1d4ed8;
  background: #eff6ff;
}

.stat-card.red .stat-icon {
  color: #991b1b;
  background: #fef2f2;
}

.toolbar-card {
  min-height: 72px;
  padding: 14px;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.search-box {
  height: 44px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 13px;
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  font-family: inherit;
  background: transparent;
}

.add-provider-inline {
  display: flex;
  gap: 10px;
  align-items: center;
}

.add-provider-inline select {
  min-height: 42px;
  border: 1px solid #e4e7df;
  border-radius: 16px;
  padding: 0 12px;
  font-family: inherit;
}

.main-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.editor-layout {
  max-width: 1180px;
  margin: 0 auto;
}

.providers-table-card,
.drawer-card,
.side-card {
  padding: 18px;
}

.card-header,
.drawer-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.card-header h2,
.drawer-header h2,
.side-card h3,
.config-section h3 {
  margin: 0;
  font-size: 18px;
}

.card-header p,
.drawer-header p {
  margin: 5px 0 0;
  color: #6f746b;
  font-size: 12px;
}

.drawer-header .ownership-note {
  max-width: 760px;
  margin-top: 8px;
  line-height: 1.8;
  color: #475569;
  font-weight: 800;
}

.drawer-header button {
  width: 36px;
  height: 36px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.providers-table {
  border: 1px solid #e4e7df;
  border-radius: 18px;
  overflow: hidden;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: minmax(210px, 1.2fr) 80px 95px 105px 120px 80px 145px 105px 240px;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
}

.table-head {
  background: #f7f8f4;
  color: #6f746b;
  font-size: 12px;
  font-weight: 900;
}

.table-row {
  border-top: 1px solid #e4e7df;
  background: #fff;
  font-size: 12px;
}

.table-row.selected {
  background: #f8fbff;
}

.provider-main {
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: right;
  font-family: inherit;
  cursor: pointer;
}

.provider-avatar {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: #1d4ed8;
  background: #eff6ff;
  flex: 0 0 auto;
}

.provider-main strong,
.provider-main span,
.model-cell {
  display: block;
}

.provider-main strong {
  font-size: 13px;
}

.provider-main span {
  margin-top: 3px;
  color: #6f746b;
  font-size: 11px;
}

.status-badge {
  width: fit-content;
  min-height: 27px;
  border-radius: 999px;
  padding: 0 9px;
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
}

.status-badge.green {
  color: #166534;
  background: #f0fdf4;
}

.status-badge.amber {
  color: #92400e;
  background: #fffbeb;
}

.status-badge.blue {
  color: #1d4ed8;
  background: #eff6ff;
}

.status-badge.slate {
  color: #475569;
  background: #f8fafc;
}

.status-badge.red {
  color: #991b1b;
  background: #fef2f2;
}

.readiness-badge {
  width: fit-content;
  min-height: 28px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 1000;
  white-space: nowrap;
}

.readiness-badge.ready {
  color: #166534;
  background: #dcfce7;
}

.readiness-badge.warning {
  color: #92400e;
  background: #fef3c7;
}

.readiness-badge.blocked {
  color: #991b1b;
  background: #fee2e2;
}

.capability-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.capability-pills small {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 900;
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.row-actions button {
  min-height: 28px;
  border: 1px solid #e4e7df;
  background: #fff;
  color: #1f241d;
  border-radius: 999px;
  padding: 0 8px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
}

.row-actions button.danger {
  color: #991b1b;
  background: #fef2f2;
  border-color: #fecaca;
}

.drawer-card {
  overflow: visible;
}

.editor-card {
  width: 100%;
}

.back-button {
  min-height: 40px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 14px;
  padding: 0 14px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field {
  display: grid;
  gap: 7px;
}

.field.wide {
  grid-column: 1 / -1;
}

.form-subsection {
  grid-column: 1 / -1;
  border: 1px solid #e4e7df;
  background: #f8fafc;
  border-radius: 14px;
  padding: 10px 12px;
}

.form-subsection strong {
  display: block;
  font-size: 13px;
}

.form-subsection small {
  display: block;
  margin-top: 4px;
  color: #6f746b;
  line-height: 1.7;
  font-size: 11px;
  font-weight: 800;
}

.field span {
  font-size: 12px;
  font-weight: 900;
}

.field span b {
  color: #dc2626;
  margin-inline-start: 5px;
  font-size: 10px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e4e7df;
  border-radius: 14px;
  background: #fff;
  color: #1f241d;
  outline: 0;
  font-family: inherit;
}

.field input,
.field select {
  min-height: 40px;
  padding: 0 11px;
}

.field textarea {
  min-height: 88px;
  padding: 12px;
  resize: vertical;
  line-height: 1.7;
}

.config-section {
  margin-top: 16px;
  border: 1px solid #e4e7df;
  border-radius: 18px;
  background: #f7f8f4;
  padding: 14px;
}

.toggle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.toggle-row {
  min-height: 44px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.toggle-row.danger {
  border-color: #fecaca;
  background: #fffafa;
}

.toggle-row span {
  font-size: 11px;
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
  border-radius: 999px;
  background: #fff;
  transform: translateX(0);
  transition: 0.18s ease;
}

.switch.on {
  background: #1d4ed8;
}

.switch.on i {
  transform: translateX(-22px);
}

.drawer-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.readiness-summary,
.editor-section {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 18px;
  padding: 14px;
  margin-top: 14px;
}

.readiness-summary {
  border-color: #d9ead7;
  background: #fbfdf9;
}

.readiness-summary.warning {
  border-color: #fde68a;
  background: #fffaf0;
}

.readiness-summary.blocked {
  border-color: #fecaca;
  background: #fff5f5;
}

.summary-title,
.editor-section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.summary-title strong,
.editor-section-head h3 {
  margin: 0;
  color: #1f241d;
  font-size: 15px;
}

.readiness-summary p,
.editor-section-head p {
  margin: 5px 0 0;
  color: #6f746b;
  font-size: 12px;
  line-height: 1.7;
  font-weight: 800;
}

.summary-metrics {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.summary-metrics .info-cell:first-child {
  grid-row: span 2;
}

.details-cue {
  border: 1px dashed #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 14px;
  padding: 9px 10px;
  font-size: 11px;
  font-weight: 900;
}

.editor-section .form-grid,
.editor-section .toggle-grid {
  margin-top: 12px;
}

.advanced-scope-box {
  margin-top: 14px;
  border: 1px solid #e4e7df;
  background: #f8fafc;
  border-radius: 16px;
  padding: 12px;
}

.advanced-scope-box h4 {
  margin: 0;
  font-size: 13px;
}

.advanced-scope-box p,
.empty-helper {
  margin: 5px 0 0;
  color: #6f746b;
  font-size: 12px;
  line-height: 1.7;
  font-weight: 800;
}

.section-divider {
  height: 1px;
  background: #e4e7df;
  margin: 14px 0;
}

.compact-grid {
  margin-top: 14px;
}

.provider-readiness-panel,
.routing-impact-panel {
  border: 1px solid #d9ead7;
  background: #fbfdf9;
  border-radius: 18px;
  padding: 14px;
  margin-top: 16px;
}

.provider-readiness-panel.warning {
  border-color: #fde68a;
  background: #fffaf0;
}

.provider-readiness-panel.blocked {
  border-color: #fecaca;
  background: #fff5f5;
}

.readiness-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.readiness-head strong,
.routing-impact-panel h3 {
  display: block;
  margin: 0;
  color: #1f241d;
  font-size: 15px;
}

.readiness-head span,
.routing-impact-panel p {
  display: block;
  margin: 4px 0 0;
  color: #6f746b;
  font-size: 12px;
  line-height: 1.7;
}

.readiness-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.link-readiness-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 10px;
}

.info-cell {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
}

.info-cell span {
  display: block;
  color: #6f746b;
  font-size: 11px;
  font-weight: 900;
}

.info-cell strong {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.readiness-notes {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.readiness-notes strong {
  display: block;
  color: #1f241d;
  font-size: 12px;
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

.check-notes span {
  color: #166534;
  background: #ecfdf5;
}

.audit-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 320px 320px minmax(0, 1fr);
  gap: 16px;
}

.side-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  color: #fff;
  background: #1d4ed8;
  display: grid;
  place-items: center;
  margin-bottom: 12px;
}

.side-icon.warning {
  background: #f59e0b;
}

.check-row {
  min-height: 36px;
  border-bottom: 1px solid #e4e7df;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #166534;
  font-size: 12px;
  font-weight: 900;
}

.side-card ul {
  margin: 12px 0 0;
  padding-inline-start: 18px;
  color: #92400e;
  line-height: 1.9;
  font-size: 13px;
}

.test-log {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.empty-log {
  color: #6f746b;
  font-size: 13px;
}

.test-row {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 16px;
  padding: 12px;
}

.test-row.success {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.test-row.failed {
  border-color: #fecaca;
  background: #fef2f2;
}

.test-row.warning {
  border-color: #fde68a;
  background: #fffbeb;
}

.test-row strong,
.test-row span,
.test-row small {
  display: block;
}

.test-row span {
  margin-top: 4px;
  line-height: 1.6;
  font-size: 12px;
}

.test-row small {
  margin-top: 4px;
  color: #6f746b;
  font-size: 11px;
}

@media (max-width: 1400px) {
  .main-layout,
  .audit-grid {
    grid-template-columns: 1fr;
  }

  .drawer-card {
    position: static;
    max-height: none;
  }

  .providers-table {
    overflow: auto;
  }

  .table-head,
  .table-row {
    min-width: 1340px;
  }
}

@media (max-width: 760px) {
  .secrets-unified-page {
    padding: 16px;
  }

  .page-title,
  .title-actions,
  .toolbar-card,
  .add-provider-inline {
    align-items: stretch;
    flex-direction: column;
    display: flex;
  }

  .page-title h1 {
    font-size: 27px;
  }

  .stats-grid,
  .form-grid,
  .readiness-grid,
  .toggle-grid {
    grid-template-columns: 1fr;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
`;
