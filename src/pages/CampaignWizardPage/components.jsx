import { ArrowLeft, ArrowRight, CheckCircle2, ImageIcon, Video, Wand2 } from "lucide-react";
import { toggleValue } from "./helpers.js";

export function PageTitle({ title, description, status }) {
  return (
    <section className="page-title">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {status ? <Badge tone="blue">{status}</Badge> : null}
    </section>
  );
}

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Info({ label, value }) {
  return (
    <div className="asset-info-cell">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function AssetSelectionGroup({ title, assets = [], selectedAssetKeys = [], selectedProduct, onToggle }) {
  return (
    <section className="asset-selection-section">
      <div className="asset-section-title">
        <h3>{title}</h3>
        <Badge tone="neutral">{assets.length} أصل</Badge>
      </div>

      {assets.length ? (
        <div className="asset-select-grid">
          {assets.map((asset) => {
            const isSelected = selectedAssetKeys.includes(asset.id);
            const isCurrentProduct = asset.linkedType === "product" && asset.linkedName === selectedProduct?.name;
            const linkLabel = isCurrentProduct
              ? "مرتبط بالمنتج الحالي"
              : asset.linkedType === "product"
                ? "مرتبط بمنتج آخر"
                : "أصل عام";

            return (
              <button
                key={asset.id}
                type="button"
                className={`asset-select-card ${isSelected ? "selected" : ""}`}
                onClick={() => onToggle(asset)}
              >
                <div className="asset-select-icon">
                  {asset.type === "video" ? <Video size={22} /> : <ImageIcon size={22} />}
                </div>
                <strong>{asset.name}</strong>
                <span>{asset.linkedName || "أصل عام"}</span>
                <div className="asset-select-actions">
                  <Badge tone={isCurrentProduct ? "green" : "neutral"}>{linkLabel}</Badge>
                  <Badge tone={isSelected ? "green" : "neutral"}>
                    {isSelected ? "مختار" : "غير مختار"}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <Notice tone="neutral">لا توجد أصول في هذه المجموعة.</Notice>
      )}
    </section>
  );
}

export function Button({ children, onClick, variant = "primary", disabled = false }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`button ${variant}`}>
      {children}
    </button>
  );
}

export function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="section-header">
      <div className="section-icon">
        <Icon size={22} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function StepTabs({ steps = [], step, setStep }) {
  return (
    <div className="step-tabs">
      {steps.map(([id, title, desc]) => {
        const state = id < step ? "done" : id === step ? "current" : "future";

        return (
          <button
            key={id}
            type="button"
            onClick={() => setStep(id)}
            className={`step-tab ${state}`}
          >
            <div className="step-number">{state === "done" ? "✓" : id}</div>
            <div>
              <strong>{title}</strong>
              <span>{desc}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function FileField({ label, accept, value, onFile }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="file" accept={accept} onChange={(event) => onFile(event.target.files?.[0] || null)} />
      <small>{value || "إرفاق تجريبي داخل النموذج الأولي — لا يوجد رفع فعلي للملفات."}</small>
    </label>
  );
}

export function TextArea({ label, value, onChange, placeholder }) {
  return (
    <label className="field wide">
      <span>{label}</span>
      <textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function ChoiceGroup({ title, options = [], selected, setSelected }) {
  return (
    <div className="choice-section">
      <div className="choice-title">{title}</div>
      <div className="choice-row">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSelected(item)}
            className={selected === item ? "selected" : ""}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MultiChoice({ title, options = [], selected = [], setSelected }) {
  return (
    <div className="choice-section wide">
      <div className="choice-title">{title}</div>
      <div className="choice-row">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSelected(toggleValue(selected, item))}
            className={selected.includes(item) ? "selected" : ""}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Metric({ title, value, tone = "green" }) {
  return (
    <div className={`metric ${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function BriefRow({ label, value }) {
  return (
    <div className="brief-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function Notice({ children, tone = "neutral" }) {
  return <div className={`notice ${tone}`}>{children}</div>;
}

export function SmartBox({ step, readiness, productName }) {
  const tips = {
    1: [
      "تم حذف نوع الحملة وأولوية الحملة لتقليل الاحتكاك.",
      "إذا لم يكن المنتج موجودًا، أضفه سريعًا من نفس خطوة المنتج.",
    ],
    2: [
      "المخرجات يجب أن تبنى على أصول متاحة فعليًا، لا على افتراضات.",
      "ضعف الأصول يرفع تكلفة التوليد والمراجعة.",
    ],
    3: [
      "وضوح العرض ودعوة الإجراء يقلل الحاجة لإعادة التوليد.",
      "حدد الجمهور والقنوات هنا قبل اختيار المخرجات.",
    ],
    4: [
      "اختيار صورة أو فيديو سيُنشئ شرحًا عامًا للعميل ومطالبة داخلية للنموذج.",
      "المطالبة الفعلية لا تظهر للعميل لأنها من أسرار المنصة.",
    ],
    5: [
      "راجع المخرج الظاهر للعميل وليس المطالبة الداخلية.",
      "أعد توليد السيناريو إذا لم يكن مناسبًا قبل توليد الحملة.",
    ],
  };

  return (
    <Card className="smart-box">
      <div className="smart-title">
        <Wand2 size={20} />
        <h3>توصيات ذكية</h3>
      </div>

      <div className="tips-list">
        {(tips[step] || []).map((tip, index) => (
          <div key={tip} className="tip">
            <span>{index + 1}</span>
            <p>{tip}</p>
          </div>
        ))}
      </div>

      <div className="smart-summary">
        <div>
          <span>المنتج الحالي</span>
          <strong>{productName || "غير محدد"}</strong>
        </div>
        <div>
          <span>جاهزية الحملة</span>
          <strong>{readiness}%</strong>
        </div>
      </div>
    </Card>
  );
}

export function Footer({ step = 1, total = 5, back, next, nextLabel }) {
  const safeTotal = total || 1;
  const progress = Math.min(100, Math.max(0, (step / safeTotal) * 100));
  return (
    <footer className="footer-bar">
      <Button variant="secondary" onClick={back} disabled={step === 1}>
        <ArrowRight size={16} />
        رجوع
      </Button>

      <div className="footer-progress">
        <strong>
          الخطوة {step} من {total}
        </strong>
        <span>
          <i style={{ width: `${progress}%` }} />
        </span>
      </div>

      <div className="footer-actions">
        <Button variant="secondary">حفظ كمسودة</Button>
        <Button onClick={next}>
          {nextLabel}
          {step < total ? <ArrowLeft size={16} /> : <CheckCircle2 size={16} />}
        </Button>
      </div>
    </footer>
  );
}
