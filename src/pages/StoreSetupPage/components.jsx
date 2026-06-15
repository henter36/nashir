import { ArrowLeft, ArrowRight, CheckCircle2, Save, Upload, Wand2 } from "lucide-react";
import { channelConnectionLabels, statusLabels } from "./constants.js";

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Button({ children, onClick, variant = "primary" }) {
  return <button type="button" onClick={onClick} className={`button ${variant}`}>{children}</button>;
}

export function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="section-header">
      <div className="section-icon"><Icon size={22} /></div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function StepTabs({ steps, step, setStep }) {
  const safeSteps = Array.isArray(steps) ? steps : [];
  return (
    <div className="step-tabs">
      {safeSteps.map(([id, title, desc]) => {
        const state = id < step ? "done" : id === step ? "current" : "future";
        return (
          <button key={id} type="button" onClick={() => setStep(id)} className={`step-tab ${state}`}>
            <div className="step-number">{state === "done" ? "✓" : id}</div>
            <div><strong>{title}</strong><span>{desc}</span></div>
          </button>
        );
      })}
    </div>
  );
}

export function Field({ label, value, placeholder = "", onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function FieldSelect({ label, value, options, onChange }) {
  const safeOptions = Array.isArray(options) ? options : [];
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
        {safeOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function TextArea({ label, value, placeholder = "", onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} rows={5} />
    </label>
  );
}

export function ChoiceGroup({ title, options, selected, setSelected }) {
  const safeOptions = Array.isArray(options) ? options : [];
  return (
    <div className="choice-block">
      <h4>{title}</h4>
      <div className="choice-list">
        {safeOptions.map((item) => (
          <button key={item} type="button" onClick={() => setSelected(item)} className={`choice ${selected === item ? "selected" : ""}`}>{item}</button>
        ))}
      </div>
    </div>
  );
}

export function MultiChoice({ title, options, selected, setSelected }) {
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelected = Array.isArray(selected) ? selected : [];
  const toggle = (item) => setSelected(safeSelected.includes(item) ? safeSelected.filter((value) => value !== item) : [...safeSelected, item]);
  return (
    <div className="choice-block wide">
      <h4>{title}</h4>
      <div className="choice-list">
        {safeOptions.map((item) => (
          <button key={item} type="button" onClick={() => toggle(item)} className={`choice ${safeSelected.includes(item) ? "selected" : ""}`}>{item}</button>
        ))}
      </div>
    </div>
  );
}

export function UploadBox({ title, accept, onFile, value }) {
  return (
    <label className="upload-box">
      <Upload size={22} />
      <strong>{title}</strong>
      <span>{value || "إرفاق تجريبي"}</span>
      <input type="file" accept={accept} onChange={(event) => onFile?.(event.target.files?.[0] || null)} />
      <p>إرفاق تجريبي داخل النموذج الأولي — لا يوجد رفع فعلي للملفات.</p>
    </label>
  );
}

export function Notice({ children }) {
  return <div className="notice amber">{children}</div>;
}

export function SourceStatus({ status, confidence = 0 }) {
  const [label, tone] = statusLabels[status] || statusLabels.manual;
  return (
    <div className={`source-status ${tone}`}>
      <strong>{label}</strong>
      <span>{confidence}% ثقة</span>
    </div>
  );
}

export function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value || "غير متاح"}</strong>
    </div>
  );
}

export function ChannelConnectionStatus({ status }) {
  const [label, tone] = channelConnectionLabels[status] || channelConnectionLabels.disconnected;
  return <span className={`channel-status ${tone}`}>{label}</span>;
}

export function PolicyRow({ title, value, onChange }) {
  return (
    <div className="policy-row">
      <strong>{title}</strong>
      <div>
        {["نعم", "لا", "بحاجة مراجعة"].map((item) => (
          <button key={item} type="button" onClick={() => onChange(item)} className={value === item ? "active" : ""}>{item}</button>
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

export function ChannelPlan({ title, channels }) {
  const safeChannels = Array.isArray(channels) ? channels : [];
  return (
    <div className="channel-plan">
      <strong>{title}</strong>
      <div>
        {safeChannels.length ? safeChannels.map((channel) => <span key={channel}>{channel}</span>) : <span>غير محدد</span>}
      </div>
    </div>
  );
}

export function TimelineCard({ title, text }) {
  return (
    <div className="timeline-card">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export function SmartBox({ step }) {
  const tips = {
    1: ["أبقِ بيانات المتجر مختصرة؛ لا تحولها إلى صفحة Branding كاملة.", "فحص المتجر يولّد اقتراحات فقط، ولا يعتمدها دون مراجعة."],
    2: ["المنتجات هنا ستُستخدم كمدخلات للحملات القادمة.", "لا تجعل هامش الربح إلزاميًا في V1."],
    3: ["اجمع الجمهور والقنوات في قرار واحد قبل الانتقال للسياسات.", "الربط الذي يتم هنا ينعكس تلقائيًا في الإعدادات دون مزامنة يدوية."],
    4: ["السياسات تحمي النظام من ادعاءات أو نشر غير آمن.", "أي عنصر بحاجة مراجعة يجب أن يمنع النشر التلقائي لاحقًا."],
    5: ["لا تنتقل إلى الحملة إذا كانت المنتجات أو السياسات ناقصة.", "ابدأ بحملة منتج واحد قبل التوسع."],
  };
  return (
    <Card className="smart-box">
      <div className="smart-title"><Wand2 size={20} /><h3>توصيات ذكية</h3></div>
      <div className="tips-list">
        {(tips[step] || []).map((tip, index) => (
          <div key={tip} className="tip">
            <span>{index + 1}</span>
            <p>{tip}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Footer({ step, total, back, next, nextLabel, saveDraft }) {
  return (
    <footer className="footer-bar">
      <Button variant="secondary" onClick={back}><ArrowRight size={16} /> رجوع</Button>
      <div className="footer-progress">
        <strong>الخطوة {step} من {total}</strong>
        <span><i style={{ width: `${(step / total) * 100}%` }} /></span>
      </div>
      <div className="footer-actions">
        <Button variant="secondary" onClick={saveDraft}><Save size={16} /> حفظ كمسودة</Button>
        <Button onClick={next}>{nextLabel}{step < total ? <ArrowLeft size={16} /> : <CheckCircle2 size={16} />}</Button>
      </div>
    </footer>
  );
}
