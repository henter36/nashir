export const styles = `
.settings-page{
  min-height:calc(100vh - 80px);
  padding:24px;
  background:#f7f8f4;
  color:#1f241d;
  font-family:Inter,"Segoe UI",Tahoma,Arial,sans-serif;
}

.settings-hero,
.settings-tabs,
.settings-card{
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:24px;
  box-shadow:0 8px 26px rgba(24,38,18,.035);
}

.settings-hero{
  padding:20px;
  display:grid;
  grid-template-columns:minmax(0,1fr)320px;
  gap:18px;
  margin-bottom:16px;
}

.eyebrow{
  width:fit-content;
  min-height:30px;
  padding:0 11px;
  border-radius:999px;
  display:inline-flex;
  align-items:center;
  gap:7px;
  color:#176b2c;
  background:#eef7e9;
  font-size:12px;
  font-weight:900;
  margin-bottom:10px;
}

.settings-hero h1{
  margin:0;
  font-size:34px;
  letter-spacing:-.04em;
}

.settings-hero p{
  max-width:850px;
  margin:8px 0 0;
  color:#6f746b;
  line-height:1.8;
}

.hero-actions{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:16px;
}

.primary-button,
.secondary-button{
  min-height:42px;
  border-radius:16px;
  padding:0 16px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  font-family:inherit;
  font-size:13px;
  font-weight:900;
  cursor:pointer;
}

.primary-button{
  border:0;
  color:#fff;
  background:#176b2c;
}

.secondary-button{
  border:1px solid #e4e7df;
  color:#1f241d;
  background:#fff;
}

.hero-alert{
  margin-top:14px;
  border:1px solid #fde68a;
  background:#fff7e6;
  color:#92400e;
  border-radius:18px;
  padding:13px;
  display:flex;
  gap:8px;
  line-height:1.8;
  font-size:12px;
  font-weight:800;
}

.settings-score-card{
  border:1px solid #e4e7df;
  background:#f7f8f4;
  border-radius:22px;
  padding:18px;
  display:grid;
  align-content:start;
  gap:8px;
}

.score-icon{
  width:54px;
  height:54px;
  border-radius:18px;
  display:grid;
  place-items:center;
  background:#176b2c;
  color:#fff;
}

.settings-score-card span{
  color:#6f746b;
  font-size:12px;
  font-weight:900;
}

.settings-score-card strong{
  font-size:38px;
  line-height:1;
}

.settings-score-card p{
  margin:0;
  color:#6f746b;
  line-height:1.7;
  font-size:13px;
}

.mini-progress{
  height:9px;
  border-radius:999px;
  background:#e4e7df;
  overflow:hidden;
}

.mini-progress div{
  height:100%;
  border-radius:inherit;
  background:#176b2c;
}

.score-meta{
  display:grid;
  gap:6px;
  margin-top:6px;
}

.settings-tabs{
  padding:8px;
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-bottom:16px;
}

.settings-tabs button{
  min-height:38px;
  border-radius:999px;
  border:1px solid transparent;
  background:transparent;
  padding:0 13px;
  font-family:inherit;
  font-weight:900;
  cursor:pointer;
}

.settings-tabs button.active{
  color:#176b2c;
  background:#eef7e9;
  border-color:#d9ead7;
}

.settings-layout{
  display:grid;
  grid-template-columns:minmax(0,1fr)330px;
  gap:16px;
  align-items:start;
}

.settings-main,
.settings-side{
  display:grid;
  gap:16px;
}

.settings-side{
  position:sticky;
  top:96px;
}

.settings-card{
  padding:18px;
}

.card-header{
  display:flex;
  justify-content:space-between;
  gap:14px;
  align-items:flex-start;
  margin-bottom:14px;
}

.card-header.compact{
  margin-bottom:12px;
}

.card-title{
  display:flex;
  gap:12px;
  align-items:flex-start;
}

.card-icon{
  width:42px;
  height:42px;
  border-radius:15px;
  display:grid;
  place-items:center;
  background:#eef7e9;
  color:#176b2c;
  flex:0 0 auto;
}

.card-header h2{
  margin:0;
  font-size:18px;
}

.card-header p{
  margin:5px 0 0;
  color:#6f746b;
  line-height:1.7;
  font-size:13px;
}

.metrics-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:14px;
}

.boundary-card{
  margin-bottom:16px;
  border-radius:20px;
}

.ownership-map{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:10px;
}

.ownership-row{
  border:1px solid #e4e7df;
  background:#f9faf7;
  border-radius:16px;
  padding:12px;
  display:grid;
  gap:5px;
}

.ownership-row span{
  color:#6f746b;
  font-size:12px;
  font-weight:900;
}

.ownership-row strong{
  color:#176b2c;
  font-size:13px;
  line-height:1.55;
}

.ownership-note{
  border:1px solid #d9ead7;
  background:#eef7e9;
  color:#176b2c;
  border-radius:18px;
  padding:13px;
  display:flex;
  gap:10px;
  align-items:flex-start;
  margin-bottom:14px;
}

.ownership-note strong,
.ownership-note span{
  display:block;
}

.ownership-note strong{
  font-size:13px;
  margin-bottom:4px;
}

.ownership-note span{
  color:#3f5f3a;
  font-size:12px;
  line-height:1.75;
}

.readonly-summary .summary-row{
  background:#fbfcf8;
}

.metric-card{
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:22px;
  padding:16px;
  box-shadow:0 8px 26px rgba(24,38,18,.025);
}

.metric-card span{
  color:#6f746b;
  font-size:13px;
  font-weight:900;
}

.metric-card strong{
  display:block;
  margin-top:8px;
  font-size:28px;
}

.metric-card small{
  display:block;
  margin-top:5px;
  color:#8a9185;
  font-size:12px;
  font-weight:800;
}

.form-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:12px;
}

.field{
  display:grid;
  gap:7px;
}

.field span{
  color:#1f241d;
  font-size:12px;
  font-weight:950;
}

.field input,
.field select{
  width:100%;
  min-height:42px;
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:15px;
  padding:0 12px;
  font-family:inherit;
  font-weight:800;
  outline:none;
}

.summary-list{
  display:grid;
  gap:8px;
}

.summary-list.inline{
  grid-template-columns:repeat(2,minmax(0,1fr));
}

.summary-row{
  min-height:44px;
  border:1px solid #e4e7df;
  background:#f7f8f4;
  border-radius:15px;
  padding:10px 12px;
  display:flex;
  justify-content:space-between;
  gap:10px;
  align-items:center;
}

.summary-row span{
  color:#6f746b;
  font-size:12px;
  font-weight:900;
}

.summary-row strong{
  overflow-wrap:anywhere;
}

.warnings-list{
  display:grid;
  gap:10px;
}

.warning-row,
.empty-state{
  border-radius:18px;
  padding:13px;
  display:flex;
  gap:9px;
  align-items:flex-start;
  line-height:1.8;
  font-size:12px;
  font-weight:800;
}

.warning-row.red{
  border:1px solid #fecaca;
  background:#fef2f2;
  color:#991b1b;
}

.warning-row.amber{
  border:1px solid #fde68a;
  background:#fff7e6;
  color:#92400e;
}

.warning-row strong,
.warning-row span{
  display:block;
}

.warning-row span{
  margin-top:2px;
  color:inherit;
  opacity:.88;
}

.empty-state{
  border:1px dashed #cbd5c0;
  background:#f7f8f4;
  color:#6f746b;
}

.empty-state.success{
  border-color:#bbf7d0;
  background:#f0fdf4;
  color:#166534;
}

.shared-connection-summary{
  display:grid;
  gap:10px;
}

.shared-connection-row{
  border:1px solid #e4e7df;
  background:#f7f8f4;
  border-radius:16px;
  padding:12px;
  display:flex;
  align-items:flex-start;
  gap:10px;
}

.shared-connection-row strong,
.shared-connection-row span{
  display:block;
}

.shared-connection-row span{
  color:#6f746b;
  margin-top:3px;
  font-size:12px;
}

.source-note{
  border:1px solid #d9ead7;
  background:#eef7e9;
  color:#176b2c;
  border-radius:18px;
  padding:13px;
  display:flex;
  align-items:flex-start;
  gap:9px;
  margin-bottom:14px;
}

.source-note strong,
.source-note span{
  display:block;
}

.source-note span{
  margin-top:4px;
  color:#52604c;
  line-height:1.7;
  font-size:12px;
}

.source-note code{
  direction:ltr;
  unicode-bidi:plaintext;
  font-weight:900;
}

.channels-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:14px;
}

.channel-card{
  border:1px solid #e4e7df;
  background:#f7f8f4;
  border-radius:22px;
  padding:15px;
}

.channel-card.from-shared{
  border-color:#bbf7d0;
  background:#f5fbf2;
}

.channel-header{
  display:flex;
  justify-content:space-between;
  gap:12px;
  align-items:flex-start;
}

.channel-title{
  display:flex;
  gap:10px;
  align-items:flex-start;
}

.channel-icon{
  width:40px;
  height:40px;
  border-radius:14px;
  display:grid;
  place-items:center;
  background:#fff;
  color:#176b2c;
  flex:0 0 auto;
}

.channel-title h3{
  margin:0;
  font-size:16px;
}

.channel-title p{
  margin:5px 0 0;
  color:#6f746b;
  line-height:1.7;
  font-size:12px;
}

.connection-badges{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin:12px 0;
}

.connection-badge,
.shared-badge{
  width:fit-content;
  min-height:28px;
  border-radius:999px;
  padding:0 9px;
  display:inline-flex;
  align-items:center;
  font-size:11px;
  font-weight:900;
}

.connection-badge.connected{
  color:#166534;
  background:#f0fdf4;
  border:1px solid #bbf7d0;
}

.connection-badge.pending{
  color:#92400e;
  background:#fffbeb;
  border:1px solid #fde68a;
}

.connection-badge.failed{
  color:#991b1b;
  background:#fef2f2;
  border:1px solid #fecaca;
}

.connection-badge.manual{
  color:#475569;
  background:#f8fafc;
  border:1px solid #e2e8f0;
}

.shared-badge{
  color:#176b2c;
  background:#eef7e9;
  border:1px solid #d9ead7;
}

.oauth-summary{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:8px;
  margin-top:12px;
}

.scope-list{
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:16px;
  padding:10px;
  margin-top:12px;
}

.scope-list strong{
  display:block;
  font-size:12px;
  margin-bottom:8px;
}

.scope-list div{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}

.scope-list span{
  border:1px solid #d9ead7;
  background:#eef7e9;
  color:#176b2c;
  border-radius:999px;
  padding:4px 8px;
  font-size:10px;
  font-weight:900;
}

.oauth-actions{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:12px;
}

.oauth-actions button{
  min-height:36px;
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:14px;
  padding:0 12px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-family:inherit;
  font-size:12px;
  font-weight:900;
  cursor:pointer;
}

.oauth-actions button.danger{
  color:#991b1b;
  background:#fef2f2;
  border-color:#fecaca;
}

.connection-state{
  margin-top:12px;
  border:1px solid #e4e7df;
  background:#fff;
  border-radius:16px;
  padding:10px;
  display:flex;
  gap:8px;
  align-items:flex-start;
  color:#6f746b;
  line-height:1.6;
  font-size:12px;
  font-weight:800;
}

.toggle-grid{
  display:grid;
  gap:10px;
  margin-top:14px;
}

.toggle-row{
  min-height:66px;
  border:1px solid #e4e7df;
  background:#f7f8f4;
  border-radius:18px;
  padding:12px;
  display:flex;
  justify-content:space-between;
  gap:12px;
  align-items:center;
}

.toggle-row strong,
.toggle-row span{
  display:block;
}

.toggle-row span{
  margin-top:4px;
  color:#6f746b;
  line-height:1.6;
  font-size:12px;
}

.switch{
  width:50px;
  height:28px;
  border:0;
  border-radius:999px;
  padding:3px;
  background:#cbd5c0;
  display:flex;
  align-items:center;
  cursor:pointer;
  flex:0 0 auto;
}

.switch span{
  width:22px;
  height:22px;
  border-radius:50%;
  background:#fff;
  box-shadow:0 2px 6px rgba(15,23,42,.18);
  transition:.18s ease;
}

.switch.active{
  background:#176b2c;
}

.switch.active span{
  transform:translateX(-22px);
}

.audit-list{
  display:grid;
  gap:10px;
}

.audit-row{
  border:1px solid #e4e7df;
  background:#f7f8f4;
  border-radius:18px;
  padding:12px;
  display:flex;
  gap:10px;
  align-items:flex-start;
}

.audit-row.success{
  border-color:#bbf7d0;
  background:#f0fdf4;
  color:#166534;
}

.audit-row.warning{
  border-color:#fde68a;
  background:#fff7e6;
  color:#92400e;
}

.audit-icon{
  width:30px;
  height:30px;
  border-radius:11px;
  display:grid;
  place-items:center;
  background:#fff;
  color:inherit;
  flex:0 0 auto;
}

.audit-row strong,
.audit-row span{
  display:block;
}

.audit-row span{
  margin-top:4px;
  color:inherit;
  opacity:.78;
  font-size:12px;
}

.decision-box{
  border:1px solid #e4e7df;
  background:#f7f8f4;
  border-radius:18px;
  padding:14px;
}

.decision-box strong,
.decision-box span{
  display:block;
}

.decision-box strong{
  color:#176b2c;
  font-size:22px;
}

.decision-box span{
  margin-top:5px;
  color:#6f746b;
  line-height:1.7;
  font-size:13px;
}

.settings-toast{
  position:fixed;
  left:22px;
  bottom:22px;
  min-height:44px;
  border-radius:16px;
  padding:0 14px;
  display:flex;
  align-items:center;
  gap:8px;
  color:#166534;
  background:#f0fdf4;
  border:1px solid #bbf7d0;
  box-shadow:0 16px 34px rgba(15,23,42,.12);
  font-size:13px;
  font-weight:900;
}

@media(max-width:1200px){
  .settings-hero,
  .settings-layout{
    grid-template-columns:1fr;
  }

  .settings-side{
    position:static;
  }

  .metrics-grid,
  .channels-grid,
  .ownership-map{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
}

@media(max-width:760px){
  .settings-page{
    padding:16px;
  }

  .metrics-grid,
  .channels-grid,
  .ownership-map,
  .form-grid,
  .summary-list.inline,
  .oauth-summary{
    grid-template-columns:1fr;
  }

  .card-header,
  .channel-header,
  .toggle-row{
    flex-direction:column;
    align-items:stretch;
  }

  .primary-button,
  .secondary-button{
    width:100%;
  }
}
`;
