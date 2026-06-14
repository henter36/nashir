export function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export function Status({ value }) {
  const map = {
    running: ["قيد التشغيل", "blue"],
    waiting_for_review: ["بانتظار مراجعة", "amber"],
    completed: ["مكتمل", "green"],
    success: ["مكتمل", "green"],
    ready: ["جاهز", "green"],
    warning: ["يحتاج ضبط", "amber"],
    blocked: ["محظور", "red"],
    failed: ["فشل", "red"],
    queued: ["في الطابور", "slate"],
    cancelled: ["ملغي", "slate"],
  };
  const [label, tone] = map[value] || ["غير محدد", "slate"];
  return <span className={`status ${tone}`}>{label}</span>;
}

export function SelectField({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([id, labelText]) => (
          <option key={id} value={id}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button type="button" className={`switch ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}>
        <i />
      </button>
    </div>
  );
}

export function ContractKpi({ title, value }) {
  return (
    <div className="contract-kpi">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}
