export const styles = `
.dashboard-grid-page {
  min-height: calc(100vh - 80px);
  padding: 22px;
  background:
    radial-gradient(circle at top right, rgba(23, 107, 44, 0.055), transparent 32%),
    #f7f8f4;
  color: #1f241d;
  font-family: Inter, "Segoe UI", Tahoma, Arial, sans-serif;
}

.hero,
.quick-actions-card,
.kpi-card,
.card {
  background: #ffffff;
  border: 1px solid #e4e7df;
  border-radius: 18px;
  box-shadow: 0 8px 22px rgba(24, 38, 18, 0.028);
}

.hero {
  min-height: 112px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.kicker {
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

.hero h1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.2;
  letter-spacing: 0;
}

.hero p {
  margin: 7px 0 0;
  max-width: 760px;
  color: #6f746b;
  line-height: 1.8;
  font-size: 14px;
}

.hero-actions,
.button-row,
.split-buttons {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.period-switch {
  min-height: 40px;
  padding: 4px;
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 16px;
  display: flex;
  gap: 4px;
}

.period-switch button {
  border: 0;
  background: transparent;
  border-radius: 12px;
  padding: 0 10px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.period-switch button.active {
  background: #176b2c;
  color: #fff;
}

.primary-button,
.secondary-button,
.ghost-button,
.mini-button {
  min-height: 40px;
  border-radius: 14px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
}

.primary-button {
  color: #fff;
  border: 0;
  background: #176b2c;
  box-shadow: 0 10px 20px rgba(23, 107, 44, 0.14);
}

.secondary-button,
.ghost-button,
.mini-button {
  color: #1f241d;
  background: #fff;
  border: 1px solid #e4e7df;
}

.mini-button {
  min-height: 34px;
  padding: 0 12px;
  font-size: 12px;
}

.wide {
  width: 100%;
}

.quick-actions-card {
  padding: 15px;
  margin-bottom: 12px;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.quick-action {
  min-height: 68px;
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 18px;
  padding: 12px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 10px;
  text-align: right;
  font-family: inherit;
  cursor: pointer;
}

.quick-action:hover {
  border-color: #176b2c;
  background: #eef7e9;
}

.quick-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #fff;
  color: #176b2c;
}

.quick-action strong,
.quick-action small {
  display: block;
}

.quick-action small {
  margin-top: 4px;
  color: #6f746b;
  font-size: 11px;
  line-height: 1.5;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.strategic-summary-card,
.social-summary-card {
  margin-bottom: 16px;
}

.strategy-note {
  margin: -4px 0 12px;
  color: #66715f;
  font-size: 12px;
  line-height: 1.7;
  font-weight: 800;
}

.strategy-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.prototype-note {
  width: fit-content;
  border: 1px solid #d9ead7;
  background: #eef7e9;
  color: #176b2c;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 900;
}

.prototype-data-note {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #854d0e;
  grid-column: 1 / -1;
}

.kpi-card {
  height: 88px;
  padding: 12px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

.kpi-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #eef7e9;
  color: #176b2c;
}

.kpi-card.blue .kpi-icon { color: #2563eb; background: #eff6ff; }
.kpi-card.amber .kpi-icon { color: #92400e; background: #fffbeb; }

.kpi-card span,
.metric-box span,
.info-row span {
  display: block;
  color: #6f746b;
  font-size: 12px;
  font-weight: 900;
}

.kpi-card strong {
  display: block;
  margin-top: 4px;
  font-size: 22px;
  line-height: 1;
}

.kpi-card small {
  display: block;
  margin-top: 4px;
  color: #6f746b;
  font-size: 11px;
  line-height: 1.35;
}

.section-title {
  margin: 14px 2px 8px;
}

.section-title h2 {
  margin: 0;
  color: #1f241d;
  font-size: 16px;
  line-height: 1.35;
}

.section-title p {
  margin: 4px 0 0;
  color: #6f746b;
  font-size: 12px;
  line-height: 1.6;
}

.support-row {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 12px;
  align-items: stretch;
  margin-bottom: 12px;
}

.middle-row,
.bottom-row { margin-bottom: 12px; }

.bottom-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
}

.card { padding: 15px; }
.support-row .card { min-height: 270px; }
.small-card { min-height: 268px; display: flex; flex-direction: column; }

.card-header {
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  align-items: flex-start;
}

.card-header h2 { margin: 0; color: #1f241d; font-size: 16px; line-height: 1.35; }
.card-header p { margin: 5px 0 0; color: #6f746b; font-size: 12px; line-height: 1.7; }

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #176b2c;
  background: #eef7e9;
  flex: 0 0 auto;
}

.priority-list { display: grid; gap: 10px; }

.priority-row {
  min-height: 78px;
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 18px;
  padding: 12px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.priority-row.green { border-color: #d9ead7; background: #f7fbf3; }
.priority-row.amber { border-color: #fde68a; background: #fffaf0; }
.priority-row.blue { border-color: #bfdbfe; background: #eff6ff; }

.action-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 16px;
  color: #fff;
  background: #176b2c;
}

.priority-row.amber .action-icon { background: #d97706; }
.priority-row.blue .action-icon { background: #2563eb; }

.priority-row strong { display: block; font-size: 14px; }
.priority-row p { margin: 5px 0 0; color: #4d5f4a; line-height: 1.65; font-size: 12px; }
.priority-row button {
  min-height: 36px;
  border: 1px solid #e4e7df;
  background: #fff;
  border-radius: 14px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.readiness-summary {
  min-height: 84px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 18px;
  padding: 12px;
  margin-bottom: 12px;
}

.ring {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 7px solid #176b2c;
  box-shadow: inset 0 0 0 6px #eef7e9;
  font-weight: 1000;
  flex: 0 0 auto;
}

.readiness-summary strong { display: block; }
.readiness-summary span { display: block; color: #6f746b; margin-top: 5px; line-height: 1.6; font-size: 12px; }

.compact-list { display: grid; gap: 6px; margin-bottom: 12px; }

.info-row {
  min-height: 34px;
  border-bottom: 1px solid #e4e7df;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.info-row strong { font-size: 12px; }
.info-row strong.green { color: #166534; }
.info-row strong.amber { color: #92400e; }

.split-buttons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }

.campaign-table { border: 1px solid #e4e7df; border-radius: 18px; overflow: hidden; }

.campaign-row {
  width: 100%;
  min-height: 58px;
  display: grid;
  grid-template-columns: minmax(240px, 1.4fr) 130px 130px 115px 95px;
  gap: 10px;
  align-items: center;
  text-align: right;
  border: 0;
  border-top: 1px solid #e4e7df;
  background: #fff;
  padding: 10px 13px;
  font-family: inherit;
  cursor: pointer;
}

.campaign-row:first-child { border-top: 0; }
.campaign-row:hover { background: #fbfdf9; }

.campaign-main { display: flex; gap: 10px; align-items: center; }
.campaign-thumb { width: 36px; height: 34px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 12px; color: #176b2c; background: #eef7e9; }
.campaign-main strong { display: block; color: #1f241d; font-size: 13px; }
.campaign-main span, .muted { display: block; margin-top: 4px; color: #6f746b; font-size: 11px; }

.status {
  width: fit-content;
  min-height: 27px;
  border-radius: 999px;
  padding: 0 9px;
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 900;
}
.status.green { color: #166534; background: #f0fdf4; }
.status.amber { color: #92400e; background: #fffbeb; }
.status.slate { color: #475569; background: #f8fafc; }
.status.blue { color: #1d4ed8; background: #eff6ff; }

.readiness-cell { display: flex; align-items: center; gap: 8px; }
.readiness-cell i { width: 74px; height: 7px; overflow: hidden; border-radius: 999px; background: #e4e7df; }
.readiness-cell b { display: block; height: 100%; background: #176b2c; }
.readiness-cell small { color: #1f241d; font-size: 11px; font-weight: 900; }
.channel-pill { width: fit-content; border: 1px solid #e4e7df; background: #fff; border-radius: 999px; padding: 5px 9px; font-size: 10px; font-weight: 900; }

.box-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; margin-bottom: 12px; }
.compact-metrics { margin-bottom: 8px; }
.metric-box { min-height: 64px; border: 1px solid #e4e7df; background: #f7f8f4; border-radius: 15px; padding: 10px; }
.metric-box strong { display: block; margin-top: 6px; color: #1f241d; font-size: 18px; }
.metric-box.green strong { color: #166534; }
.metric-box.amber strong { color: #92400e; }

.activity-list { display: grid; gap: 8px; margin-bottom: 12px; }
.activity-row { min-height: 50px; border: 1px solid #e4e7df; background: #f7f8f4; border-radius: 15px; padding: 9px; display: flex; align-items: flex-start; gap: 9px; }
.dot { width: 9px; height: 9px; margin-top: 8px; border-radius: 999px; flex: 0 0 auto; }
.dot.green { background: #16a34a; }
.dot.blue { background: #2563eb; }
.dot.amber { background: #f59e0b; }
.activity-row strong { display: block; font-size: 12px; }
.activity-row span { display: block; margin-top: 3px; color: #6f746b; font-size: 11px; }

@media (max-width: 1320px) {
  .support-row,
  .bottom-row,
  .quick-actions-grid { grid-template-columns: 1fr; }
  .kpi-grid,
  .strategy-summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .campaign-row { grid-template-columns: 1fr; }
  .small-card { min-height: auto; }
  .priority-row { grid-template-columns: 48px minmax(0, 1fr); }
  .priority-row button { grid-column: 2; width: fit-content; }
}

@media (max-width: 760px) {
  .dashboard-grid-page { padding: 16px; }
  .hero,
  .hero-actions,
  .button-row { align-items: stretch; flex-direction: column; }
  .hero h1 { font-size: 27px; }
  .kpi-grid,
  .strategy-summary-grid,
  .box-grid,
  .split-buttons { grid-template-columns: 1fr; }
  .primary-button,
  .secondary-button,
  .ghost-button { width: 100%; }
  .period-switch { width: 100%; overflow:auto; }
}

.screen-guidance-card {
  background: #fff;
  border: 1px solid #e4e7df;
  border-radius: 18px;
  box-shadow: 0 8px 22px rgba(24, 38, 18, 0.028);
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.screen-guidance-card div {
  border: 1px solid #e4e7df;
  background: #f7f8f4;
  border-radius: 14px;
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

@media (max-width: 1180px) {
  .screen-guidance-card { grid-template-columns: 1fr; }
}
`;
