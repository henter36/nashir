import { AlertTriangle, CheckCircle2, CircleAlert, Shield } from "lucide-react";

export function SettingsCard({ icon: Icon, title, description, children, action }) {
  return (
    <section className="settings-card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon">
            <Icon size={20} />
          </div>

          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        {action || null}
      </div>

      {children}
    </section>
  );
}

export function Metric({ title, value, note }) {
  return (
    <article className="metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

export function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function WarningsList({ warnings }) {
  const safeWarnings = Array.isArray(warnings) ? warnings : [];
  if (!safeWarnings.length) {
    return (
      <div className="empty-state success">
        <CheckCircle2 size={18} />
        لا توجد تحذيرات حرجة في الإعدادات الحالية.
      </div>
    );
  }

  return (
    <div className="warnings-list">
      {safeWarnings.map((warning) => (
        <div key={warning.id} className={`warning-row ${warning.tone}`}>
          <AlertTriangle size={18} />
          <div>
            <strong>{warning.title}</strong>
            <span>{warning.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SharedConnectionSummary({ channels, sharedConnectionCount }) {
  const safeChannels = Array.isArray(channels) ? channels : [];
  const reflected = safeChannels.filter((channel) => channel.fromSharedConnection);

  if (!sharedConnectionCount) {
    return (
      <div className="empty-state">
        <CircleAlert size={18} />
        لا توجد حالة ربط محفوظة بعد. استخدم محاكاة الربط من إعداد المتجر أو من الإعدادات.
      </div>
    );
  }

  return (
    <div className="shared-connection-summary">
      {reflected.map((channel) => (
        <div key={channel.id} className="shared-connection-row">
          <ConnectionBadge status={channel.status} />
          <div>
            <strong>{channel.name}</strong>
            <span>{channel.accountName || "لم يتم إكمال الربط"}</span>
          </div>
        </div>
      ))}

      {!reflected.length && (
        <div className="empty-state">
          <CircleAlert size={18} />
          توجد بيانات محفوظة في مصدر الربط، لكنها لا تطابق معرفات القنوات الحالية.
        </div>
      )}
    </div>
  );
}

export function ConnectionBadge({ status }) {
  if (status === "connected") {
    return <span className="connection-badge connected">مرتبط تجريبي</span>;
  }

  if (status === "pending_oauth") {
    return <span className="connection-badge pending">بانتظار محاكاة</span>;
  }

  if (status === "failed") {
    return <span className="connection-badge failed">فشل الربط</span>;
  }

  return <span className="connection-badge manual">غير مرتبط</span>;
}

export function Field({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange && onChange(event.target.value)}
      />
    </label>
  );
}

export function SelectField({ label, value, options, onChange }) {
  const safeOptions = Array.isArray(options) ? options : [];
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value ?? ""} onChange={(event) => onChange && onChange(event.target.value)}>
        {safeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <Switch checked={checked} onChange={onChange} ariaLabel={title} />
    </div>
  );
}

export function OwnershipNote({ title, text }) {
  return (
    <div className="ownership-note">
      <Shield size={18} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

export function Switch({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      className={checked ? "switch active" : "switch"}
      onClick={() => onChange && onChange(!checked)}
      aria-pressed={checked}
      aria-label={ariaLabel}
    >
      <span />
    </button>
  );
}
