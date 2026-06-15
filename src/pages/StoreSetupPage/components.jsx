import { ArrowLeft, ArrowRight, CheckCircle2, Save, Upload, Wand2 } from "lucide-react";
import { channelConnectionLabels, policyAnswerOptions, smartBoxTips, statusLabels } from "./constants.js";

const fromEvent = (handler) => (event) => handler(event.target.value);
const safeArray = (value) => (Array.isArray(value) ? value : []);

function getStepState(id, step) {
  if (id < step) return "done";
  if (id === step) return "current";
  return "future";
}

function FieldShell({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function LabelValueBlock({ className, label, value }) {
  return (
    <div className={className}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function OptionButtons({ options, onSelect, getClass }) {
  const safeOptions = safeArray(options);
  return safeOptions.map((item) => (
    <button key={item} type="button" onClick={() => onSelect(item)} className={getClass(item)}>
      {item}
    </button>
  ));
}

function ChoiceButtonList({ options, isSelected, onSelect }) {
  return (
    <div className="choice-list">
      <OptionButtons
        options={options}
        onSelect={onSelect}
        getClass={(item) => isSelected(item) ? "choice selected" : "choice"}
      />
    </div>
  );
}

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
  const safeSteps = safeArray(steps);
  return (
    <div className="step-tabs">
      {safeSteps.map(([id, title, desc]) => {
        const state = getStepState(id, step);
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
    <FieldShell label={label}>
      <input value={value ?? ""} placeholder={placeholder} onChange={fromEvent(onChange)} />
    </FieldShell>
  );
}

export function FieldSelect({ label, value, options, onChange }) {
  const safeOptions = safeArray(options);
  return (
    <FieldShell label={label}>
      <select value={value ?? ""} onChange={fromEvent(onChange)}>
        {safeOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextArea({ label, value, placeholder = "", onChange }) {
  return (
    <FieldShell label={label}>
      <textarea value={value ?? ""} placeholder={placeholder} onChange={fromEvent(onChange)} rows={5} />
    </FieldShell>
  );
}

export function ChoiceGroup({ title, options, selected, setSelected }) {
  return (
    <div className="choice-block">
      <h4>{title}</h4>
      <ChoiceButtonList
        options={options}
        isSelected={(item) => selected === item}
        onSelect={setSelected}
      />
    </div>
  );
}

export function MultiChoice({ title, options, selected, setSelected }) {
  const safeSelected = safeArray(selected);
  const toggle = (item) =>
    setSelected(safeSelected.includes(item) ? safeSelected.filter((v) => v !== item) : [...safeSelected, item]);
  return (
    <div className="choice-block wide">
      <h4>{title}</h4>
      <ChoiceButtonList
        options={options}
        isSelected={(item) => safeSelected.includes(item)}
        onSelect={toggle}
      />
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
  return <LabelValueBlock className="info-row" label={label} value={value || "غير متاح"} />;
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
        <OptionButtons
          options={policyAnswerOptions}
          onSelect={onChange}
          getClass={(item) => value === item ? "active" : ""}
        />
      </div>
    </div>
  );
}

export function Metric({ title, value, tone = "green" }) {
  return <LabelValueBlock className={`metric ${tone}`} label={title} value={value} />;
}

export function ChannelPlan({ title, channels }) {
  const safeChannels = safeArray(channels);
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
  return (
    <Card className="smart-box">
      <div className="smart-title"><Wand2 size={20} /><h3>توصيات ذكية</h3></div>
      <div className="tips-list">
        {(smartBoxTips[step] || []).map((tip, index) => (
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
