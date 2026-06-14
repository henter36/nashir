import { Info, CardHeader } from "./components.jsx";
import {
  DATA_PROCESSING_PIPELINE,
  PROCESSING_READINESS_CHECKS,
  EVIDENCE_PACK_ITEMS,
  REUSABLE_OUTPUTS,
} from "./constants.js";

export default function PipelineReflectionCard() {
  return (
    <section className="pipeline-reflection-card">
      <CardHeader
        title="مسار معالجة البيانات"
        subtitle="تشغيلات النظام هنا محاكاة واجهية. التنفيذ الحقيقي يحتاج Backend وQueue وموصلات مصرح بها وتخزين أسرار آمن ومراجعة بشرية."
      >
        <span className="prototype-pill">تصميم واجهي</span>
      </CardHeader>

      <div className="pipeline-step-grid">
        {DATA_PROCESSING_PIPELINE.map((step, index) => (
          <div key={step.name} className="pipeline-step-card">
            <div className="pipeline-step-head">
              <span>{index + 1}</span>
              <strong>{step.name}</strong>
            </div>
            <Info label="الحالة" value={step.status} />
            <Info label="المدخل" value={step.input} />
            <Info label="المخرج" value={step.output} />
            <Info label="الطبقة المسؤولة" value={step.layer} />
            <Info label="أداة/مزود محتمل" value={step.tool} />
            <Info label="أسباب الحظر" value={step.blocked} />
            <Info label="تحذيرات" value={step.warnings} />
          </div>
        ))}
      </div>

      <div className="pipeline-support-grid">
        <div className="pipeline-support-card">
          <h3>جاهزية خط المعالجة</h3>
          <div className="readiness-check-grid">
            {PROCESSING_READINESS_CHECKS.map(([label, value]) => (
              <Info key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        <div className="pipeline-support-card">
          <h3>حزمة الأدلة قبل الذكاء الاصطناعي</h3>
          <p className="pipeline-helper">
            هذه الحزمة تمثل ما سيرسل لاحقًا لمهمة ذكاء اصطناعي بعد تنفيذ Backend والموصلات.
            لا يتم إرسال بيانات فعلية من هذه الواجهة.
          </p>
          <div className="pipeline-chip-grid">
            {EVIDENCE_PACK_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="pipeline-support-card reusable-output-card">
          <h3>مخرجات قابلة لإعادة الاستخدام</h3>
          <div className="reusable-output-list">
            {REUSABLE_OUTPUTS.map(([name, reuse]) => (
              <div key={name}>
                <strong>{name}</strong>
                <span>{reuse}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
