export const styles = `
.model-routing-page {
  min-height: calc(100vh - 80px);
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(23, 107, 44, 0.06), transparent 32%),
    #f7f8f4;
  color: #1f241d;
  font-family: Inter, "Segoe UI", Tahoma, Arial, sans-serif;
}

.page-title,
.admin-only-alert,
.stat-card,
.tabs,
.card {
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
  border: 0;
  background: #176b2c;
  color: #fff;
  box-shadow: 0 12px 24px rgba(23, 107, 44, 0.16);
}

.secondary-button {
  border: 1px solid #e4e7df;
  background: #fff;
  color: #1f241d;
}

.admin-only-alert {
  padding: 14px;
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: #176b2c;
  background: #eef7e9;
  border-color: #d9ead7;
}

.admin-only-alert strong {
  display: block;
  margin-bottom: 4px;
}

.admin-only-alert p {
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
  justify-content: space-between;
  gap: 12px;
  align-items: center;
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

.stat-card.green .stat-icon,
.stat-card.teal .stat-icon {
  color: #176b2c;
  background: #eef7e9;
}

.stat-card.blue .stat-icon {
  color: #2563eb;
  background: #eff6ff;
}

.stat-card.amber .stat-icon {
  color: #92400e;
  background: #fffbeb;
}

.tabs {
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
  color: #fff;
  background: #176b2c;
}

.card {
  padding: 18px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.card-header h2,
.card h2 {
  margin: 0;
  font-size: 18px;
}

.card-header p {
  margin: 5px 0 0;
  color: #6f746b;
  font-size: 12px;
  line-height: 1.7;
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.model-card {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 20px;
  padding: 14px;
}

.model-head {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.model-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  color: #176b2c;
  background: #eef7e9;
}

.model-head h3 {
  margin: 0;
  font-size: 15px;
}

.model-head p {
  margin: 4px 0 0;
  color: #6f746b;
  font-size: 11px;
}

.status {
  min-height: 26px;
  border-radius: 999px;
  padding: 0 9px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 900;
}

.status.green {
  color: #166534;
  background: #f0fdf4;
}

.status.amber {
  color: #92400e;
  background: #fffbeb;
}

.status.slate {
  color: #475569;
  background: #f8fafc;
}

.status.red {
  color: #991b1b;
  background: #fef2f2;
}

.capability-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.capability-list span {
  border: 1px solid #e4e7df;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 10px;
  font-weight: 900;
}

.model-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.model-actions {
  margin-top: 12px;
}

.model-actions select,
.field select,
.field input,
.field textarea,
.fallback-box select {
  width: 100%;
  min-height: 40px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  padding: 0 12px;
  font-family: inherit;
  outline: 0;
}

.routes-layout,
.test-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 16px;
  align-items: start;
}

.routes-table {
  border: 1px solid #e4e7df;
  border-radius: 18px;
  overflow: hidden;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: minmax(210px, 1.35fr) 120px 155px 70px 120px 95px 90px 105px;
  gap: 10px;
  align-items: center;
  padding: 13px 14px;
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
  background: #fff;
  text-align: right;
  font-family: inherit;
  cursor: pointer;
  font-size: 12px;
}

.table-row.selected {
  background: #fbfdf9;
}

.table-row strong,
.table-row small {
  display: block;
}

.table-row small {
  margin-top: 3px;
  color: #6f746b;
}

.route-editor {
  position: sticky;
  top: 96px;
}


.workflow-usage-box {
  border: 1px solid #e4e7df;
  border-radius: 18px;
  padding: 12px;
  margin: 14px 0;
  background: #fbfdf9;
}

.workflow-usage-box.orphan {
  border-color: #fed7aa;
  background: #fff7ed;
}

.usage-box-head,
.usage-mini-row {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #176b2c;
  font-size: 12px;
  font-weight: 900;
}

.usage-list {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.usage-item {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
  display: grid;
  gap: 8px;
}

.usage-item strong,
.usage-item span {
  display: block;
}

.usage-item span {
  color: #6f746b;
  font-size: 12px;
  margin-top: 3px;
}

.route-health-panel {
  border: 1px solid #d9ead7;
  background: #fbfdf9;
  border-radius: 18px;
  padding: 12px;
  margin: 14px 0;
}

.route-health-panel.warning {
  border-color: #fde68a;
  background: #fffaf0;
}

.route-health-panel.blocked {
  border-color: #fecaca;
  background: #fff5f5;
}

.route-health-head,
.cost-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.route-health-head strong {
  display: block;
  color: #1f241d;
  font-size: 14px;
}

.route-health-head span {
  display: block;
  margin-top: 4px;
  color: #6f746b;
  font-size: 12px;
  line-height: 1.6;
}

.route-health-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.route-health-badge {
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

.route-health-badge.ready {
  color: #166534;
  background: #dcfce7;
}

.route-health-badge.warning {
  color: #92400e;
  background: #fef3c7;
}

.route-health-badge.blocked {
  color: #991b1b;
  background: #fee2e2;
}

.health-notes {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.health-notes strong {
  display: block;
  color: #1f241d;
  font-size: 12px;
}

.health-notes span {
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

.usage-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.usage-steps code {
  direction: ltr;
  background: #f7f8f4;
  border: 1px solid #e4e7df;
  border-radius: 999px;
  padding: 4px 7px;
  font-size: 11px;
  color: #374151;
}

.usage-warning {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  color: #9a3412;
  font-size: 12px;
  line-height: 1.8;
  margin-top: 8px;
}

.usage-mini-row {
  margin-top: 12px;
  color: #374151;
}

.route-editor p {
  color: #6f746b;
  font-size: 13px;
  line-height: 1.7;
}

.field {
  display: grid;
  gap: 7px;
  margin-top: 12px;
}

.field span {
  font-size: 12px;
  font-weight: 900;
}

.field textarea {
  min-height: 130px;
  padding: 12px;
  resize: vertical;
  line-height: 1.8;
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.fallback-box {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 18px;
  padding: 12px;
  margin-top: 14px;
}

.fallback-box > strong {
  display: block;
  margin-bottom: 10px;
}

.fallback-row {
  min-height: 36px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  border-bottom: 1px solid #e4e7df;
}

.fallback-row button {
  border: 0;
  color: #991b1b;
  background: transparent;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.fallback-box select {
  margin-top: 10px;
}

.toggle-list {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.toggle-row {
  min-height: 40px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
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
  border-radius: 999px;
  background: #fff;
  transform: translateX(0);
  transition: 0.18s ease;
}

.switch.on {
  background: #176b2c;
}

.switch.on i {
  transform: translateX(-22px);
}

.fallback-grid,
.cost-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.fallback-card,
.cost-card {
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 20px;
  padding: 14px;
}

.cost-card.high {
  border-color: #fde68a;
  background: #fff7e6;
}

.fallback-card h3,
.cost-card h3 {
  margin: 0 0 12px;
  font-size: 15px;
}

.fallback-chain {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
}

.fallback-chain span {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 900;
}

.fallback-chain b {
  color: #176b2c;
}

.fallback-card p {
  margin: 10px 0 0;
  color: #6f746b;
  font-size: 12px;
}

.info-row {
  min-height: 38px;
  border-bottom: 1px solid #e4e7df;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.info-row span {
  color: #6f746b;
  font-size: 12px;
  font-weight: 900;
}

.test-form {
  display: grid;
  gap: 12px;
}

.test-log {
  display: grid;
  gap: 10px;
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

@media (max-width: 1280px) {
  .stats-grid,
  .model-grid,
  .fallback-grid,
  .cost-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .routes-layout,
  .test-layout {
    grid-template-columns: 1fr;
  }

  .route-editor {
    position: static;
  }

  .routes-table {
    overflow: auto;
  }

  .table-head,
  .table-row {
    min-width: 1040px;
  }
}

@media (max-width: 760px) {
  .model-routing-page {
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

  .stats-grid,
  .model-grid,
  .fallback-grid,
  .cost-grid,
  .editor-grid {
    grid-template-columns: 1fr;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
`;
