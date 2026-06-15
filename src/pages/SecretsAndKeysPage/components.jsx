import { AlertTriangle, Bot, CheckCircle2 } from "lucide-react";
import { AUTH_TYPES, DELIVERY_CHANNELS, ENVIRONMENTS, statusMap } from "./constants.js";
import {
  buildProviderReadiness,
  capabilityLabel,
  formatKey,
  getConfiguredModels,
  getCredentialScope,
  getOptionLabel,
  getReadinessLabel,
  normalizeCapabilities,
} from "./helpers.js";

export function ProviderRow({ provider, selected, onSelect, onTest, onRotate, onDuplicate, onDelete }) {
  const [statusText, statusTone] = statusMap[provider.status] || statusMap.draft;
  const readiness = buildProviderReadiness(provider);
  const capabilities = Object.entries(normalizeCapabilities(provider.capabilities))
    .filter(([, enabled]) => enabled)
    .map(([key]) => capabilityLabel(key));
  const configuredModelCount = getConfiguredModels(provider).length;

  return (
    <div className={`table-row ${selected ? "selected" : ""}`}>
      <button type="button" className="provider-main" onClick={onSelect}>
        <div className="provider-avatar">
          <Bot size={18} />
        </div>
        <div>
          <strong>{provider.displayName}</strong>
          <span>{provider.category}</span>
        </div>
      </button>

      <span>{provider.providerType}</span>

      <span className={`status-badge ${statusTone}`}>{statusText}</span>

      <span className="model-cell">{configuredModelCount ? `${configuredModelCount} نماذج` : "غير مهيأة"}</span>

      <span>{getOptionLabel(DELIVERY_CHANNELS, provider.deliveryChannel)}</span>

      <span>{getOptionLabel(ENVIRONMENTS, provider.environment)}</span>

      <div className="capability-pills">
        {capabilities.slice(0, 3).map((capability) => (
          <small key={capability}>{capability}</small>
        ))}
        {capabilities.length > 3 ? <small>+{capabilities.length - 3}</small> : null}
      </div>

      <ReadinessBadge status={readiness.status} />

      <div className="row-actions">
        <button type="button" onClick={onSelect}>فتح الإعداد</button>
        <button type="button" onClick={onSelect}>تعديل مزود</button>
        <button type="button" onClick={onTest}>اختبار</button>
        <button type="button" onClick={onRotate}>تدوير</button>
        <button type="button" onClick={onDuplicate}>نسخ</button>
        <button type="button" className="danger" onClick={onDelete}>حذف</button>
      </div>
    </div>
  );
}

export function ReadinessBadge({ status }) {
  return <span className={`readiness-badge ${status}`}>{getReadinessLabel(status)}</span>;
}

export function ProviderReadinessSummary({ provider }) {
  const readiness = buildProviderReadiness(provider);
  const mainBlocker = readiness.blockedReasons[0] || "لا توجد أسباب حظر";
  const mainWarning = readiness.warnings[0] || "لا توجد تحذيرات";

  return (
    <section className={`readiness-summary ${readiness.status}`}>
      <div>
        <div className="summary-title">
          <strong>جاهزية المزود</strong>
          <ReadinessBadge status={readiness.status} />
        </div>
        <p>ابدأ من الجاهزية ثم راجع الاتصال والنماذج والقدرات.</p>
      </div>
      <div className="summary-metrics">
        <Info label="الدرجة" value={`${readiness.score}%`} />
        <Info label="أهم سبب حظر" value={mainBlocker} />
        <Info label="أهم تحذير" value={mainWarning} />
        <span className="details-cue">تفاصيل الجاهزية أدناه</span>
      </div>
    </section>
  );
}

export function ProviderReadinessPanel({ provider }) {
  const readiness = buildProviderReadiness(provider);
  const configuredModels = getConfiguredModels(provider);
  const safeProvider = provider || {};
  const capabilities = Object.entries(normalizeCapabilities(safeProvider.capabilities)).filter(([, enabled]) => enabled);
  const lastTest = safeProvider.metadata?.lastTestedAt || "لم يتم الاختبار";

  return (
    <section className={`provider-readiness-panel ${readiness.status}`}>
      <div className="readiness-head">
        <div>
          <strong>جاهزية المزود</strong>
          <span>جاهزية المزود تكمل جاهزية المسار والتكلفة والمطالبة. · {readiness.score}%</span>
        </div>
        <ReadinessBadge status={readiness.status} />
      </div>

      <div className="readiness-grid">
        <Info label="حالة الجاهزية" value={getReadinessLabel(readiness.status)} />
        <Info label="الدرجة" value={`${readiness.score}%`} />
        <Info label="نوع المزود" value={safeProvider.providerType} />
        <Info label="قناة الوصول" value={getOptionLabel(DELIVERY_CHANNELS, safeProvider.deliveryChannel)} />
        <Info label="البيئة" value={getOptionLabel(ENVIRONMENTS, safeProvider.environment)} />
        <Info label="طريقة المصادقة" value={getOptionLabel(AUTH_TYPES, safeProvider.authType)} />
        <Info label="مرجع السر" value={safeProvider.secretName || "غير محدد"} />
        <Info label="نطاق الاعتماد" value={getCredentialScope(safeProvider)} />
        <Info label="العنوان الأساسي" value={safeProvider.baseUrl || "غير محدد"} />
        <Info label="نماذج يعلن المزود توفرها" value={configuredModels.length ? `${configuredModels.length}` : "غير مهيأة"} />
        <Info label="القدرات" value={capabilities.length ? `${capabilities.length}` : "غير مفعلة"} />
        <Info label="Webhook" value={safeProvider.webhooks?.enabled ? "مفعل" : "غير مفعل"} />
        <Info label="آخر اختبار" value={lastTest} />
        <Info label="أثره على توجيه النماذج" value="يؤثر على جاهزية المسار قبل التشغيل" />
      </div>

      <div className="readiness-notes blocked-notes">
        <strong>أسباب الحظر</strong>
        {readiness.blockedReasons.length
          ? readiness.blockedReasons.map((reason) => (
              <span key={reason}>{reason}</span>
            ))
          : <span>لا توجد أسباب حظر</span>}
      </div>

      <div className="readiness-notes warning-notes">
        <strong>تحذيرات</strong>
        {readiness.warnings.length
          ? readiness.warnings.map((warning) => (
              <span key={warning}>{warning}</span>
            ))
          : <span>لا توجد تحذيرات</span>}
      </div>

      <div className="readiness-notes check-notes">
        <strong>الفحوصات الناجحة</strong>
        {readiness.checks.slice(0, 5).map((check) => (
          <span key={check}>{check}</span>
        ))}
      </div>
    </section>
  );
}

export function EditorSection({ title, helper, children }) {
  return (
    <section className="editor-section">
      <div className="editor-section-head">
        <h3>{title}</h3>
        {helper ? <p>{helper}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function RoutingImpactPanel() {
  return (
    <section className="routing-impact-panel">
      <h3>قابلية الربط</h3>
      <p>هذه الحقول تحدد كيف يمكن ربط المزود لاحقًا بمسارات النماذج والتكلفة والتشغيلات دون حفظ أي قيمة سرية.</p>
      <div className="link-readiness-grid">
        <Info label="توجيه النماذج" value="يختار النموذج الأساسي والنماذج البديلة" />
        <Info label="مراقبة التكلفة" value="تضبط الحدود والاعتماد" />
        <Info label="تشغيلات النظام" value="تستخدم القدرات داخل خطوات التشغيل" />
        <Info label="حدود هذه الصفحة" value="صفحة الأسرار والمفاتيح لا تختار النموذج النهائي للمهمة" />
      </div>
    </section>
  );
}

export function Info({ label, value }) {
  return (
    <div className="info-cell">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export function Stat({ title, value, icon: Icon, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
      <div className="stat-icon">
        <Icon size={21} />
      </div>
    </article>
  );
}

export function Field({ label, value, onChange, required, helper }) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? <b>مطلوب</b> : null}
      </span>
      <input value={value || ""} onChange={(event) => onChange(event.target.value)} />
      {helper ? <small>{helper}</small> : null}
    </label>
  );
}

export function TextArea({ label, value, onChange, wide }) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function SelectField({ label, value, options = [], onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value || ""} onChange={(event) => onChange(event.target.value)}>
        {options.map(([id, labelText]) => (
          <option key={id} value={id}>{labelText}</option>
        ))}
      </select>
    </label>
  );
}

export function ToggleGrid({ source, onChange, dangerKeys = [] }) {
  return (
    <div className="toggle-grid">
      {Object.entries(source).map(([key, value]) => (
        <Toggle
          key={key}
          label={formatKey(key)}
          checked={Boolean(value)}
          onChange={(next) => onChange(key, next)}
          danger={dangerKeys.includes(key)}
        />
      ))}
    </div>
  );
}

export function Toggle({ label, checked, onChange, danger }) {
  return (
    <div className={`toggle-row ${danger ? "danger" : ""}`}>
      <span>{label}</span>
      <button type="button" className={`switch ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}>
        <i />
      </button>
    </div>
  );
}

export function Checklist({ ok, label }) {
  return (
    <div className="check-row">
      {ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
      <span>{label}</span>
    </div>
  );
}
