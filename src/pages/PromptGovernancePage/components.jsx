import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { BLOCKED_PATTERN_SEVERITY, EXPECTED_INPUT_OPTIONS, REVIEW_LABELS, STATUS_LABELS } from "./constants.js";
import { getExpectedInputs, getPromptReadinessLabel } from "./helpers.js";

function getScorePillClass(score) {
  if (score >= 80) return "good";
  if (score >= 60) return "mid";
  return "bad";
}

function ReadinessNoteSection({ className, title, items = [], emptyText, limit }) {
  const displayItems = limit != null ? items.slice(0, limit) : items;
  return (
    <div className={`prompt-readiness-notes ${className}`}>
      <strong>{title}</strong>
      {items.length
        ? displayItems.map((item) => <span key={item}>{item}</span>)
        : emptyText
          ? <span>{emptyText}</span>
          : null}
    </div>
  );
}

function AdvancedArrayEdit({ summary, label, value, onChange }) {
  return (
    <details className="advanced-array-edit">
      <summary>{summary}</summary>
      <TextAreaField label={label} value={value} rows={3} onChange={onChange} />
    </details>
  );
}

export function PromptReadinessBadge({ status }) {
  return <span className={`prompt-readiness-badge ${status}`}>{getPromptReadinessLabel(status)}</span>;
}

export function PromptStepReadinessPanel({ prompt, readiness }) {
  const safePrompt = prompt || {};
  const safeReadiness = readiness || { blockedReasons: [], warnings: [], checks: [], status: "", score: 0 };
  const usageCount = Array.isArray(safePrompt.usage) ? safePrompt.usage.length : 0;
  const requiredChecksCount = Array.isArray(safePrompt.requiredChecks) ? safePrompt.requiredChecks.length : 0;
  const allowedOutputsCount = Array.isArray(safePrompt.allowedOutputs) ? safePrompt.allowedOutputs.length : 0;
  const expectedInputs = getExpectedInputs(safePrompt).filter((item) => item !== "غير محددة بعد");
  const blockedReasons = Array.isArray(safeReadiness.blockedReasons) ? safeReadiness.blockedReasons : [];
  const warnings = Array.isArray(safeReadiness.warnings) ? safeReadiness.warnings : [];
  const checks = Array.isArray(safeReadiness.checks) ? safeReadiness.checks : [];

  return (
    <section className={`prompt-readiness-panel ${safeReadiness.status}`}>
      <div className="prompt-readiness-head">
        <div>
          <strong>جاهزية المطالبة للخطوة</strong>
          <span>روابط الاستخدام تؤثر على جاهزية الخطوة في تشغيلات النظام. · {safeReadiness.score}%</span>
        </div>
        <PromptReadinessBadge status={safeReadiness.status} />
      </div>

      <div className="prompt-readiness-grid">
        <Info label="المهمة" value={safePrompt.task || "غير محددة"} />
        <Info label="حالة المطالبة" value={STATUS_LABELS[safePrompt.status]?.[0] || safePrompt.status || "غير محددة"} />
        <Info label="سياسة المراجعة" value={REVIEW_LABELS[safePrompt.review] || "غير محددة"} />
        <Info label="المدخلات المتوقعة محددة" value={expectedInputs.length ? `${expectedInputs.length}` : "غير محددة بعد"} />
        <Info label="عدد روابط الاستخدام" value={usageCount} />
        <Info label="الفحوصات المطلوبة" value={requiredChecksCount} />
        <Info label="المخرجات المتوقعة/المسموحة" value={allowedOutputsCount} />
      </div>

      <ReadinessNoteSection className="blocked-notes" title="أسباب الحظر" items={blockedReasons} emptyText="لا توجد أسباب حظر" />
      <ReadinessNoteSection className="warning-notes" title="تحذيرات" items={warnings} emptyText="لا توجد تحذيرات" />
      <ReadinessNoteSection className="check-notes" title="الفحوصات الناجحة" items={checks} limit={5} />
    </section>
  );
}

export function PromptSafetySummary({ prompt, findings = [], readiness, score }) {
  const safePrompt = prompt || {};
  const safeFindings = Array.isArray(findings) ? findings : [];
  const checks = Array.isArray(safePrompt.requiredChecks) ? safePrompt.requiredChecks : [];
  const patterns = Array.isArray(safePrompt.blockedPatterns) ? safePrompt.blockedPatterns : [];
  const usage = Array.isArray(safePrompt.usage) ? safePrompt.usage : [];
  const expectedInputs = getExpectedInputs(safePrompt).filter((item) => item !== "غير محددة بعد");
  const allowedOutputs = Array.isArray(safePrompt.allowedOutputs) ? safePrompt.allowedOutputs : [];
  const leakageSafe = checks.includes("prompt_leakage_check") || patterns.some((item) => String(item).includes("leak") || String(item).includes("تسريب"));
  const claimsSafe = checks.includes("risk_review") || checks.includes("claim_evidence_check");
  const assetSafe = checks.includes("asset_rights_check") || checks.includes("visual_safety_review");
  const reviewSafe = ["required", "always"].includes(safePrompt.review) || checks.includes("human_review");
  const visibleLabel = safePrompt.visibleToCustomer ? "ملخص آمن فقط" : "غير ظاهر للعميل";
  const hasBlocks = safeFindings.some((f) => f?.level === "block") || readiness?.status === "blocked";

  return (
    <section className={`prompt-safety-card ${hasBlocks ? "blocked" : "safe"}`}>
      <div className="card-header compact-header">
        <div>
          <h3>سلامة المطالبة</h3>
          <p>ملخص سريع للمخاطر قبل استخدامها في التشغيلات.</p>
        </div>
        <span className={`score-pill ${getScorePillClass(score)}`}>{score}%</span>
      </div>

      <div className="safety-grid">
        <Info label="تسريب المطالبة" value={leakageSafe ? "مراقب" : "يحتاج فحصًا"} />
        <Info label="ادعاءات وتسويق" value={claimsSafe ? "مغطاة بفحص" : "تحتاج مراجعة"} />
        <Info label="حقوق الأصول" value={assetSafe ? "مغطاة بفحص" : "غير محددة"} />
        <Info label="مراجعة بشرية" value={reviewSafe ? "مطلوبة" : "غير كافية"} />
        <Info label="ظهور للعميل" value={visibleLabel} />
        <Info label="المدخلات المتوقعة محددة" value={expectedInputs.length ? "نعم" : "غير محددة بعد"} />
        <Info label="المخرجات المتوقعة/المسموحة محددة" value={allowedOutputs.length ? "نعم" : "غير محددة"} />
        <Info label="روابط الاستخدام" value={usage.length ? `${usage.length} روابط` : "غير مرتبطة"} />
      </div>
    </section>
  );
}

export function ExpectedInputContext({ prompt, onToggle, onTextChange }) {
  const safePrompt = prompt || {};
  const expectedInputs = getExpectedInputs(safePrompt);
  const selectedInputs = expectedInputs.filter((item) => item !== "غير محددة بعد");

  return (
    <section className="expected-input-card">
      <div className="chip-array-head">
        <div>
          <h4>المدخلات المتوقعة للمطالبة</h4>
          <p>
            المطالبة تُرسل مع سياق مثل رابط متجر، بيانات منتج، أصول مختارة، قناة، جمهور، أو مخرج سابق.
            هذه الصفحة تضبط العقد المتوقع ولا تنفذ المطالبة.
          </p>
        </div>
        <span>{selectedInputs.length || "—"}</span>
      </div>

      <div className="chips selectable-chips">
        {EXPECTED_INPUT_OPTIONS.map((item) => {
          const isSelected = selectedInputs.includes(item);
          return (
            <button
              type="button"
              key={item}
              className={`chip-select ${isSelected ? "selected" : ""}`}
              onClick={() => onToggle && onToggle(item)}
            >
              <span>{item}</span>
            </button>
          );
        })}
      </div>

      {!selectedInputs.length ? (
        <div className="unused-warning">
          <AlertTriangle size={15} />
          غير محددة بعد
        </div>
      ) : null}

      <AdvancedArrayEdit
        summary="تحرير متقدم للمدخلات المتوقعة"
        label="المدخلات المتوقعة للمطالبة — كل قيمة في سطر"
        value={selectedInputs.join("\n")}
        onChange={onTextChange}
      />
    </section>
  );
}

export function PromptContractCard() {
  return (
    <section className="prompt-contract-card">
      <h3>عقد المطالبة</h3>
      <div className="contract-flow">
        <span>سياق الإدخال</span>
        <b>+</b>
        <span>تعليمات المطالبة</span>
        <b>+</b>
        <span>عقد المخرج</span>
      </div>
      <p>
        النتيجة المنطقية: سياق الإدخال + تعليمات المطالبة + عقد المخرج = استجابة نموذج قابلة للمراجعة.
      </p>
      <div className="contract-parts">
        <Chip>المدخلات المتوقعة</Chip>
        <Chip>معاينة داخلية محجوبة</Chip>
        <Chip>المخرجات المتوقعة/المسموحة</Chip>
        <Chip tone="green">الفحوص المطلوبة</Chip>
        <Chip tone="red">أنماط الحظر</Chip>
      </div>
    </section>
  );
}

export function ChipArrayEditor({ label, helper, values = [], suggestions = [], tone = "slate", showSeverity = false, onToggle, onTextChange }) {
  const safeValues = Array.isArray(values) ? values : [];
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const mergedSuggestions = Array.from(new Set([...safeSuggestions, ...safeValues]));

  return (
    <section className="chip-array-editor">
      <div className="chip-array-head">
        <div>
          <h4>{label}</h4>
          <p>{helper}</p>
        </div>
        <span>{safeValues.length}</span>
      </div>

      <div className="chips selectable-chips">
        {mergedSuggestions.map((item) => {
          const isSelected = safeValues.includes(item);
          const severity = showSeverity ? BLOCKED_PATTERN_SEVERITY[item] || "مراقبة" : "";
          return (
            <button
              type="button"
              key={item}
              className={`chip-select ${isSelected ? "selected" : ""} ${tone}`}
              onClick={() => onToggle && onToggle(item)}
            >
              <span>{item}</span>
              {showSeverity ? <small>{severity}</small> : null}
            </button>
          );
        })}
      </div>

      <AdvancedArrayEdit
        summary="تحرير متقدم للقائمة"
        label={`${label} — كل قيمة في سطر`}
        value={safeValues.join("\n")}
        onChange={onTextChange}
      />
    </section>
  );
}

export function Field({ label, value, onChange }) {
  return (
    <label className="inline-field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange && onChange(event.target.value)} />
    </label>
  );
}

export function TextAreaField({ label, value, rows = 3, helper = "", onChange }) {
  return (
    <label className="textarea-field compact">
      <span>{label}</span>
      {helper ? <em>{helper}</em> : null}
      <textarea value={value} rows={rows} onChange={(event) => onChange && onChange(event.target.value)} />
    </label>
  );
}

export function SelectInline({ label, value, options, onChange }) {
  const safeOptions = Array.isArray(options) ? options : [];
  return (
    <label className="inline-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange && onChange(event.target.value)}>
        {safeOptions.map(([id, labelText]) => (
          <option key={id} value={id}>{labelText}</option>
        ))}
      </select>
    </label>
  );
}

export function Status({ value }) {
  const [label, tone] = STATUS_LABELS[value] || [value, "slate"];
  return <span className={`status-pill ${tone}`}>{label}</span>;
}

export function StatCard({ title, value, icon: Icon, tone = "default" }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
      {Icon ? <Icon size={22} /> : null}
    </article>
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

export function Chip({ children, tone = "slate" }) {
  return <span className={`chip ${tone}`}>{children}</span>;
}

export function Finding({ finding }) {
  if (!finding) return null;
  const level = finding.level || "info";
  const Icon = level === "pass" ? CheckCircle2 : level === "block" ? ShieldAlert : AlertTriangle;
  return (
    <div className={`finding ${level}`}>
      <Icon size={16} />
      <span>{finding.text}</span>
    </div>
  );
}
