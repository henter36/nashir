import { AlertTriangle, ListChecks } from "lucide-react";
import { STATUS_META } from "./constants.js";
import { buildRouteHealth, getRouteHealthLabel, getWorkflowUsage } from "./helpers.js";

export function WorkflowUsagePanel({ route }) {
  const usage = getWorkflowUsage(route?.taskType);

  return (
    <section className={`workflow-usage-box ${usage.length ? "linked" : "orphan"}`}>
      <div className="usage-box-head">
        <ListChecks size={16} />
        <strong>مستخدم في التشغيلات</strong>
      </div>

      {usage.length ? (
        <div className="usage-list">
          {usage.map((item) => (
            <div key={`${item.workflowId}-${item.taskType}`} className="usage-item">
              <div>
                <strong>{item.workflow}</strong>
                <span>{item.source} · {item.steps.length} خطوة</span>
              </div>
              <div className="usage-steps">
                {item.steps.map((step, index) => (
                  <code key={step}>خطوة {index + 1}</code>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="usage-warning">
          <AlertTriangle size={16} />
          <span>
            هذا المسار غير مستخدم في أي Workflow ظاهر داخل النموذج الحالي. لا تحذفه الآن، لكنه يحتاج قرار لاحق: ربطه، إخفاؤه، أو وسمه كمستقبلي.
          </span>
        </div>
      )}
    </section>
  );
}

export function RouteHealthBadge({ status }) {
  return <span className={`route-health-badge ${status}`}>{getRouteHealthLabel(status)}</span>;
}

export function RouteHealthPanel({ route, models = [], costRows = [] }) {
  const health = buildRouteHealth(route, models, costRows);
  const fallbackCount = Array.isArray(route?.fallbackModelIds) ? route.fallbackModelIds.length : 0;
  const maxCost = route?.cost?.maxCostPerRun ?? health.costRow?.avgRunCost ?? "غير محدد";
  const approvalAbove = route?.cost?.requireApprovalAboveCost ?? health.costRow?.approvalAbove ?? "غير محدد";

  return (
    <section className={`route-health-panel ${health.status}`}>
      <div className="route-health-head">
        <div>
          <strong>جاهزية المسار</strong>
          <span>جاهزية المسار تحدد قابلية استخدامه في تشغيلات النظام. · {health.score}%</span>
        </div>
        <RouteHealthBadge status={health.status} />
      </div>

      <div className="route-health-grid">
        <Info label="النموذج الأساسي" value={health.primaryModel?.displayName || "غير محدد"} />
        <Info label="النماذج البديلة" value={`${fallbackCount}`} />
        <Info label="حد التكلفة" value={`$${maxCost}`} />
        <Info label="حد الموافقة" value={`$${approvalAbove}`} />
        <Info label="المراجعة البشرية" value={route?.governance?.humanReviewRequired ? "مطلوبة" : "غير مطلوبة"} />
        <Info label="مستخدم في التشغيلات" value={health.usage.length ? `${health.usage.length} مسار` : "غير مستخدم"} />
      </div>

      <div className="health-notes blocked-notes">
        <strong>أسباب الحظر</strong>
        {health.blockedReasons.length
          ? health.blockedReasons.map((reason) => (
              <span key={reason}>{reason}</span>
            ))
          : <span>لا توجد أسباب حظر</span>}
      </div>

      <div className="health-notes warning-notes">
        <strong>تحذيرات</strong>
        {health.warnings.length
          ? health.warnings.map((warning) => (
              <span key={warning}>{warning}</span>
            ))
          : <span>لا توجد تحذيرات</span>}
      </div>

      <div className="health-notes check-notes">
        <strong>الفحوصات الناجحة</strong>
        {health.checks.slice(0, 5).map((check) => (
          <span key={check}>{check}</span>
        ))}
      </div>
    </section>
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

export function Status({ value }) {
  const [label, tone] = STATUS_META[value] || STATUS_META.testing;
  return <span className={`status ${tone}`}>{label}</span>;
}

export function Field({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value ?? ""} onChange={(event) => onChange && onChange(event.target.value)} />
    </label>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button type="button" className={`switch ${checked ? "on" : ""}`} onClick={() => onChange && onChange(!checked)}>
        <i />
      </button>
    </div>
  );
}

export function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
