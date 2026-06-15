export const styles = `
.prompt-governance-page{
  min-height:calc(100vh - 80px);
  padding:24px;
  background:#F7F8F4;
  color:#1f241d;
  font-family:Inter,"Segoe UI",Tahoma,Arial,sans-serif;
}
.hero-card,.stat-card,.card{
  background:#fff;
  border:1px solid #e4e7df;
  border-radius:26px;
  box-shadow:0 10px 28px rgba(24,38,18,.04);
}
.hero-card{
  padding:22px;
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:20px;
  margin-bottom:16px;
}
.eyebrow{
  width:fit-content;
  min-height:30px;
  padding:0 12px;
  border-radius:999px;
  display:inline-flex;
  align-items:center;
  gap:7px;
  color:#176B2C;
  background:#eef7e9;
  font-size:12px;
  font-weight:900;
  margin-bottom:10px;
}
.hero-card h1{
  margin:0;
  font-size:34px;
  letter-spacing:-.03em;
}
.hero-card p,.card p{
  color:#6f746b;
  line-height:1.85;
  margin:10px 0 0;
}
.hero-guard{
  min-width:260px;
  display:flex;
  align-items:center;
  gap:10px;
  border:1px solid #dbe8d5;
  background:#f5fbf1;
  color:#176B2C;
  padding:13px;
  border-radius:20px;
}
.hero-guard strong,.hero-guard span,
.prompt-main strong,.prompt-main span,
.audit-row strong,.audit-row span,
.queue-card strong,.queue-card span,.queue-card small,
.usage-row strong,.usage-row span,
.usage-edit-row strong,.usage-edit-row span{display:block;}
.hero-guard span{
  color:#66705f;
  font-size:12px;
  margin-top:3px;
}
.stats-grid{
  display:grid;
  grid-template-columns:repeat(5,minmax(0,1fr));
  gap:12px;
  margin-bottom:16px;
}
.stat-card{
  padding:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  min-height:92px;
}
.stat-card span{
  color:#6f746b;
  font-size:12px;
  font-weight:900;
}
.stat-card strong{
  display:block;
  margin-top:8px;
  font-size:30px;
}
.stat-card svg{
  color:#176B2C;
}
.stat-card.warning svg{
  color:#b45309;
}
.tabs{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-bottom:16px;
}
.tabs button{
  border:1px solid #e1e6dc;
  background:#fff;
  border-radius:999px;
  padding:10px 14px;
  font-weight:900;
  color:#4c5547;
  cursor:pointer;
}
.tabs button.active{
  color:#fff;
  background:#176B2C;
  border-color:#176B2C;
}
.registry-layout{
  display:grid;
  grid-template-columns:minmax(0,1fr)420px;
  gap:16px;
}
.policy-layout,.review-layout,.simulation-layout,.audit-layout{
  display:grid;
  grid-template-columns:minmax(0,1fr)minmax(360px,.65fr);
  gap:16px;
}
.card{
  padding:18px;
}
.card h2{
  margin:0;
  font-size:21px;
}
.card h3{
  margin:18px 0 10px;
  font-size:15px;
}
.card-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:12px;
  margin-bottom:14px;
}
.toolbar{
  display:grid;
  grid-template-columns:minmax(0,1fr)190px;
  gap:10px;
  margin-bottom:14px;
}
.search-box,.filter-box,.textarea-field{
  border:1px solid #e1e6dc;
  background:#fbfcf8;
  border-radius:16px;
  display:flex;
  align-items:center;
  gap:8px;
  padding:0 12px;
}
.search-box input,.filter-box select{
  width:100%;
  min-height:42px;
  border:0;
  outline:0;
  background:transparent;
  font:inherit;
  color:#1f241d;
}
.prompt-list{
  display:grid;
  gap:10px;
}
.prompt-row{
  width:100%;
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:20px;
  padding:14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  text-align:right;
  cursor:pointer;
}
.prompt-row.selected{
  border-color:#176B2C;
  background:#f0f8ec;
}
.prompt-main span{
  color:#6f746b;
  font-size:12px;
  margin-top:5px;
}
.prompt-row-meta{
  display:flex;
  align-items:center;
  gap:8px;
}
.status-pill,.score-pill,.chip{
  border-radius:999px;
  padding:6px 10px;
  font-size:11px;
  font-weight:900;
  white-space:nowrap;
}
.prompt-readiness-badge{
  border-radius:999px;
  padding:6px 10px;
  font-size:11px;
  font-weight:1000;
  white-space:nowrap;
}
.prompt-readiness-badge.ready{
  background:#dcfce7;
  color:#166534;
}
.prompt-readiness-badge.warning{
  background:#fef3c7;
  color:#92400e;
}
.prompt-readiness-badge.blocked{
  background:#fee2e2;
  color:#991b1b;
}
.green,.score-pill.good{
  background:#f0fdf4;
  color:#166534;
}
.amber,.score-pill.mid{
  background:#fffbeb;
  color:#92400e;
}
.red,.score-pill.bad{
  background:#fef2f2;
  color:#991b1b;
}
.slate{
  background:#f1f5f9;
  color:#475569;
}
.detail-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:12px;
}
.big-icon{
  width:56px;
  height:56px;
  border-radius:20px;
  background:#176B2C;
  color:#fff;
  display:grid;
  place-items:center;
}
.score-card{
  border:1px solid #e1e6dc;
  background:#fbfcf8;
  border-radius:20px;
  padding:14px;
  margin:16px 0;
}
.score-card div:first-child{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.score-card span{
  color:#6f746b;
  font-size:12px;
  font-weight:900;
}
.score-card strong{
  font-size:26px;
}
.score-track{
  height:8px;
  border-radius:999px;
  background:#e8ede2;
  margin-top:10px;
  overflow:hidden;
}
.score-track span{
  display:block;
  height:100%;
  background:#176B2C;
  border-radius:inherit;
}
.prompt-readiness-panel{
  border:1px solid #d9ead7;
  background:#fbfdf9;
  border-radius:20px;
  padding:14px;
  margin:16px 0;
}
.prompt-readiness-panel.warning{
  border-color:#fde68a;
  background:#fffaf0;
}
.prompt-readiness-panel.blocked{
  border-color:#fecaca;
  background:#fff5f5;
}
.prompt-readiness-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:10px;
  margin-bottom:12px;
}
.prompt-readiness-head strong{
  display:block;
  color:#1f241d;
  font-size:15px;
}
.prompt-readiness-head span{
  display:block;
  margin-top:4px;
  color:#6f746b;
  font-size:12px;
  line-height:1.7;
}
.prompt-readiness-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:8px;
}
.prompt-readiness-notes{
  display:grid;
  gap:6px;
  margin-top:10px;
}
.prompt-readiness-notes strong{
  display:block;
  color:#1f241d;
  font-size:12px;
}
.prompt-readiness-notes span{
  border-radius:12px;
  padding:7px 9px;
  font-size:11px;
  font-weight:800;
  line-height:1.6;
}
.blocked-notes span{
  background:#fee2e2;
  color:#991b1b;
}
.warning-notes span{
  background:#ffedd5;
  color:#92400e;
}
.check-notes span{
  background:#ecfdf5;
  color:#166534;
}
.info-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}
.info-row{
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:16px;
  padding:10px;
}
.info-row span,.textarea-field span{
  display:block;
  color:#6f746b;
  font-size:11px;
  font-weight:900;
}
.textarea-field em{
  display:block;
  color:#6f746b;
  font-size:11px;
  font-style:normal;
  font-weight:800;
  line-height:1.6;
  margin-top:4px;
}
.info-row strong{
  display:block;
  margin-top:5px;
  font-size:13px;
}
.safe-summary,.internal-preview{
  border-radius:20px;
  padding:13px;
  margin-top:14px;
}
.safe-summary{
  background:#f5fbf1;
  border:1px solid #dbe8d5;
}
.internal-preview{
  background:#f8fafc;
  border:1px dashed #cbd5e1;
}
.safe-summary h3,.internal-preview h3,.finding-list h3{
  display:flex;
  align-items:center;
  gap:7px;
}
.finding-list{
  margin-top:12px;
}
.prompt-safety-card,.chip-array-editor,.expected-input-card,.prompt-contract-card{
  border:1px solid #e4e7df;
  background:#fbfdf9;
  border-radius:18px;
  padding:12px;
  margin-top:12px;
}
.expected-input-card{
  background:#fff;
}
.prompt-contract-card{
  background:#f8fbff;
  border-color:#dbeafe;
}
.prompt-contract-card h3{
  margin:0 0 10px;
  font-size:15px;
}
.prompt-contract-card p{
  color:#1d4ed8;
  font-size:12px;
  font-weight:850;
  line-height:1.8;
  margin:10px 0 0;
}
.contract-flow,.contract-parts{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  align-items:center;
}
.contract-flow span{
  border:1px solid #dbeafe;
  background:#fff;
  border-radius:999px;
  padding:7px 10px;
  color:#1f241d;
  font-size:12px;
  font-weight:900;
}
.contract-flow b{
  color:#1d4ed8;
}
.contract-parts{
  margin-top:10px;
}
.prompt-safety-card.blocked{
  border-color:#fed7aa;
  background:#fff7ed;
}
.compact-header{
  margin-bottom:10px;
}
.safety-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:8px;
}
.chip-array-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
  margin-bottom:10px;
}
.chip-array-head h4{
  margin:0;
  font-size:14px;
}
.chip-array-head p{
  color:#6f746b;
  margin:4px 0 0;
  font-size:12px;
  line-height:1.7;
}
.chip-array-head > span{
  min-width:30px;
  min-height:30px;
  border-radius:999px;
  background:#eef7e9;
  color:#176b2c;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-size:12px;
  font-weight:900;
}
.selectable-chips{
  gap:7px;
}
.chip-select{
  min-height:32px;
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:999px;
  padding:0 10px;
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-family:inherit;
  font-size:11px;
  font-weight:900;
  cursor:pointer;
}
.chip-select.selected{
  border-color:#176b2c;
  background:#eef7e9;
  color:#176b2c;
}
.chip-select.green.selected{
  border-color:#16a34a;
  background:#ecfdf5;
  color:#166534;
}
.chip-select.red.selected{
  border-color:#dc2626;
  background:#fef2f2;
  color:#991b1b;
}
.chip-select small{
  border-radius:999px;
  background:rgba(31,36,29,.08);
  padding:2px 6px;
  font-size:10px;
}
.advanced-array-edit{
  margin-top:10px;
  border-top:1px solid #e4e7df;
  padding-top:10px;
}
.advanced-array-edit summary{
  cursor:pointer;
  color:#6f746b;
  font-size:12px;
  font-weight:900;
}
.review-reasons{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  margin-top:8px;
}
.finding{
  display:flex;
  gap:8px;
  align-items:flex-start;
  border-radius:16px;
  padding:10px;
  margin-top:8px;
  font-size:12px;
  line-height:1.7;
  font-weight:800;
}
.finding.pass{
  background:#f0fdf4;
  color:#166534;
}
.finding.warn,.finding.info{
  background:#fffbeb;
  color:#92400e;
}
.finding.block{
  background:#fef2f2;
  color:#991b1b;
}
.rules-grid,.queue-list,.usage-grid,.audit-list,.dont-list{
  display:grid;
  gap:10px;
  margin-top:14px;
}
.rule-card{
  border:1px solid #dbe8d5;
  background:#f5fbf1;
  color:#176B2C;
  border-radius:18px;
  padding:12px;
  display:flex;
  gap:9px;
  line-height:1.8;
  font-weight:850;
}
.policy-table{
  display:grid;
  gap:8px;
  margin-top:14px;
}
.policy-head,.policy-row{
  display:grid;
  grid-template-columns:170px 1fr 1fr 1fr;
  gap:10px;
  align-items:start;
}
.policy-head{
  color:#6f746b;
  font-size:12px;
  font-weight:900;
  padding:0 8px;
}
.policy-row{
  border:1px solid #e4e7df;
  border-radius:18px;
  padding:12px;
}
.chips{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}
.queue-card{
  border:1px solid #e4e7df;
  border-radius:18px;
  padding:13px;
  display:flex;
  justify-content:space-between;
  gap:12px;
}
.queue-card span{
  color:#6f746b;
  margin-top:4px;
}
.queue-card small{
  color:#6f746b;
  margin-top:7px;
  text-align:left;
}
.usage-card{
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:20px;
  padding:14px;
}
.usage-title{
  display:flex;
  justify-content:space-between;
  gap:8px;
  align-items:center;
  margin-bottom:10px;
}
.usage-row{
  display:flex;
  align-items:flex-start;
  gap:8px;
  border-top:1px solid #edf0e8;
  padding-top:10px;
  margin-top:10px;
}
.usage-row span{
  color:#6f746b;
  font-size:12px;
  margin-top:4px;
}
.unused-warning,.hard-warning{
  border:1px solid #fde68a;
  background:#fff7e6;
  color:#92400e;
  border-radius:16px;
  padding:11px;
  display:flex;
  gap:8px;
  line-height:1.7;
  font-weight:850;
}
.textarea-field{
  display:block;
  padding:12px;
  margin-top:14px;
}
.textarea-field textarea{
  width:100%;
  border:0;
  outline:0;
  resize:vertical;
  background:transparent;
  margin-top:8px;
  font:inherit;
  line-height:1.8;
}
.simulation-result{
  display:grid;
  gap:10px;
  margin-top:12px;
}
.simulation-item{
  border-radius:18px;
  padding:12px;
  display:flex;
  gap:9px;
  line-height:1.8;
  font-weight:850;
}
.simulation-item.safe{
  background:#f0fdf4;
  color:#166534;
}
.simulation-item.blocked{
  background:#fef2f2;
  color:#991b1b;
}
.hard-warning{
  margin-top:14px;
}
.audit-row{
  border:1px solid #e4e7df;
  border-radius:18px;
  padding:12px;
  display:flex;
  gap:10px;
}
.audit-icon{
  width:34px;
  height:34px;
  border-radius:12px;
  display:grid;
  place-items:center;
  background:#eef7e9;
  color:#176B2C;
}
.audit-row span{
  color:#6f746b;
  margin-top:5px;
  font-size:12px;
}
.dont-list div{
  border:1px solid #fecaca;
  background:#fff5f5;
  color:#991b1b;
  border-radius:16px;
  padding:11px;
  display:flex;
  gap:8px;
  line-height:1.8;
  font-weight:850;
}
.empty-state{
  text-align:center;
  padding:20px;
  color:#6f746b;
}
@media(max-width:1180px){
  .stats-grid{grid-template-columns:repeat(2,1fr)}
  .registry-layout,.policy-layout,.review-layout,.simulation-layout,.audit-layout{grid-template-columns:1fr}
}
@media(max-width:720px){
  .prompt-governance-page{padding:14px}
  .hero-card{display:block}
  .hero-guard{min-width:0;margin-top:14px}
  .stats-grid,.toolbar,.info-grid,.prompt-readiness-grid,.policy-head,.policy-row{grid-template-columns:1fr}
  .prompt-row{align-items:flex-start;flex-direction:column}
  .prompt-row-meta{width:100%;justify-content:space-between}
}

.registry-layout.expanded{
  grid-template-columns:minmax(0,1fr)520px;
}
.primary-action,.secondary-action,.danger-action{
  border:0;
  border-radius:14px;
  min-height:38px;
  padding:0 13px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  font-weight:900;
  cursor:pointer;
  white-space:nowrap;
}
.primary-action{background:#176B2C;color:#fff;}
.secondary-action{background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;}
.danger-action{background:#fff5f5;color:#991b1b;border:1px solid #fecaca;}
.danger-action:disabled{opacity:.45;cursor:not-allowed;}
.detail-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin:0 0 14px;
}
.edit-panel,.link-panel,.array-editor{
  border:1px solid #e4e7df;
  background:#fbfcf8;
  border-radius:22px;
  padding:14px;
  margin-top:14px;
}
.form-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}
.inline-field{
  display:block;
  border:1px solid #e1e6dc;
  background:#fff;
  border-radius:15px;
  padding:9px 11px;
}
.inline-field span,.toggle-line span{
  display:block;
  color:#6f746b;
  font-size:11px;
  font-weight:900;
  margin-bottom:5px;
}
.inline-field input,.inline-field select{
  width:100%;
  border:0;
  outline:0;
  background:transparent;
  font:inherit;
  color:#1f241d;
}
.toggle-line{
  display:flex;
  gap:8px;
  align-items:center;
  border:1px solid #dbe8d5;
  background:#f5fbf1;
  border-radius:15px;
  padding:10px 12px;
  margin-top:10px;
}
.toggle-line span{margin:0;color:#176B2C;line-height:1.6;}
.textarea-field.compact{
  margin-top:10px;
  background:#fff;
}
.link-panel h3,.array-editor h3{
  display:flex;
  gap:7px;
  align-items:center;
}
.link-controls{
  display:grid;
  grid-template-columns:minmax(0,1fr)88px;
  gap:8px;
  margin-top:12px;
}
.link-controls select{
  border:1px solid #e1e6dc;
  background:#fff;
  border-radius:14px;
  min-height:40px;
  padding:0 10px;
  font:inherit;
}
.usage-list-inline{
  display:grid;
  gap:8px;
  margin-top:10px;
}
.usage-edit-row{
  display:flex;
  justify-content:space-between;
  gap:10px;
  align-items:center;
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:16px;
  padding:10px;
}
.usage-edit-row span{color:#6f746b;font-size:12px;margin-top:3px;}
.usage-edit-row button{
  border:1px solid #e2e8f0;
  background:#f8fafc;
  color:#475569;
  border-radius:999px;
  min-height:32px;
  padding:0 10px;
  display:inline-flex;
  gap:6px;
  align-items:center;
  font-weight:900;
  cursor:pointer;
}
.usage-count{
  border-radius:999px;
  background:#eef7e9;
  color:#176B2C;
  padding:6px 9px;
  font-size:11px;
  font-weight:900;
  white-space:nowrap;
}
@media(max-width:1180px){
  .registry-layout.expanded{grid-template-columns:1fr;}
  .detail-card{order:-1;}
}
@media(max-width:780px){
  .form-grid,.toolbar,.link-controls{grid-template-columns:1fr;}
}
`;
