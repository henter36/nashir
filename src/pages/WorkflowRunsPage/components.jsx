import { getOptionLabel } from "./helpers.js";
import {
  TRIGGER_TYPES,
  TRIGGER_START_WHEN_OPTIONS,
  START_CONDITIONS,
  EVENT_SOURCES,
  TRIGGER_UPDATE_POLICIES,
} from "./constants.js";

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

export function ReadinessNotesList({ className, title, items, emptyText }) {
  return (
    <div className={`readiness-notes ${className}`}>
      <strong>{title}</strong>
      {items.length
        ? items.map((item, idx) => <span key={`${item}-${idx}`}>{item}</span>)
        : emptyText ? <span>{emptyText}</span> : null}
    </div>
  );
}

export function CardHeader({ title, subtitle, children }) {
  return (
    <div className="card-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export function EmptyRow({ text }) {
  return <p className="empty">{text}</p>;
}

export function SectionHead({ title, subtitle }) {
  return (
    <div className="io-designer-head">
      <strong>{title}</strong>
      <span>{subtitle}</span>
    </div>
  );
}

export function TriggerInfoRows({ trigger, updatePolicyLabel = "سياسة تحديث المسار" }) {
  return (
    <>
      <Info label="نوع المشغل" value={getOptionLabel(TRIGGER_TYPES, trigger?.type)} />
      <Info label="متى يبدأ المسار؟" value={getOptionLabel(TRIGGER_START_WHEN_OPTIONS, trigger?.startWhen) || trigger?.startWhen || "—"} />
      <Info label="شرط البدء" value={getOptionLabel(START_CONDITIONS, trigger?.startCondition)} />
      <Info label="مصدر الحدث" value={getOptionLabel(EVENT_SOURCES, trigger?.eventSource)} />
      <Info label={updatePolicyLabel} value={getOptionLabel(TRIGGER_UPDATE_POLICIES, trigger?.updatePolicy) || "غير محددة"} />
    </>
  );
}
