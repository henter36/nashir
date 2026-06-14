import { CircleAlert } from "lucide-react";
import { TriggerInfoRows } from "./components.jsx";
import {
  VISIBILITY,
  OUTPUT_TYPE_OPTIONS,
  OUTPUT_FORMATS,
  TRANSITION_CONDITIONS,
  DESTINATION_OPTIONS,
  DESTINATION_FIELD_MAP,
  PROCESSOR_TYPES,
  PROCESSORS,
} from "./constants.js";
import {
  normalizeInputRefs,
  getWorkflowTrigger,
  getInputRefLabel,
  getOptionLabel,
  getWorkflowLabel,
  getStepOutputName,
} from "./helpers.js";
import ModelRoutingSummary from "./ModelRoutingSummary.jsx";

export default function MapTab({ workflowDraft, readinessContext }) {
  const trigger = getWorkflowTrigger(workflowDraft);
  return (
    <section className="enhanced-map-layout">
      <article className="map-card">
        <div className="card-header">
          <div>
            <h2>خريطة تدفق البيانات</h2>
            <p>
              توضح انتقال البيانات من المشغل إلى المدخلات ثم المعالجة والمخرج والصفحة المستهدفة والحقل المستهدف والمراجعة والمسار التالي.
              هذا مصمم تدفق واجهي فقط. لا يتم تنفيذ المسارات أو استدعاء النماذج فعليًا في هذا النموذج.
            </p>
          </div>
        </div>

        <div className="flow-lanes flow-lanes-8">
          <div className="lane-title">ما الذي يبدأ المسار؟</div>
          <div className="lane-title">المدخلات المختارة</div>
          <div className="lane-title">الخطوة</div>
          <div className="lane-title">المخرج</div>
          <div className="lane-title">الصفحة المستهدفة</div>
          <div className="lane-title">الحقل أو القسم</div>
          <div className="lane-title">المراجعة</div>
          <div className="lane-title">المسار التالي</div>
        </div>

        <div className="flow-map-enhanced">
          <div className="flow-trigger-card flow-trigger-card-wide">
            <strong>ما الذي يبدأ المسار؟</strong>
            <div className="trigger-info-grid trigger-info-grid-wide">
              <TriggerInfoRows trigger={trigger} updatePolicyLabel="سياسة التحديث" />
            </div>
            <p>هذا المشغل يوضح متى يبدأ المسار، ولا يتضمن إعداد النماذج أو مصادر البيانات. ولا ينفذ أي تشغيل فعلي داخل النموذج.</p>
          </div>

          {workflowDraft.steps.map((step, index) => {
            const visibilityLabel =
              VISIBILITY.find(([id]) => id === step.visibility)?.[1] || step.visibility;

            const processorLabel =
              PROCESSORS.find(([id]) => id === step.processor)?.[1] || step.processor;

            const hasGovernanceWarning =
              (step.visibility === "customer_visible" && !step.reviewRequired) ||
              (step.feedsNextWorkflow && !step.reviewRequired);

            const destinationLabel = getOptionLabel(DESTINATION_OPTIONS, step.destination) || "—";
            const destinationFieldOptions = DESTINATION_FIELD_MAP[step.destination] || [];
            const destinationFieldLabel =
              destinationFieldOptions.find(([id]) => id === step.destinationField)?.[1] ||
              step.destinationField ||
              null;

            return (
              <div key={`${step.id}-map-enhanced`} className="flow-row flow-row-8">
                <div className="flow-index">{index + 1}</div>

                <div className="flow-cell inputs">
                  <strong>المدخلات</strong>
                  <small>من أين تأتي البيانات؟</small>
                  <div className="flow-tags">
                    {normalizeInputRefs(step).map((input) => (
                      <span key={`${input.domain}-${input.field}`}>{getInputRefLabel(input)}</span>
                    ))}
                    {!normalizeInputRefs(step).length ? <span>لم يتم اختيار مدخلات.</span> : null}
                  </div>
                </div>

                <div className="flow-arrow">←</div>

                <div className="flow-cell processor">
                  <strong>{step.name}</strong>
                  <span>{processorLabel}</span>
                  <small>{PROCESSOR_TYPES.find(([id]) => id === step.processorType)?.[1] || step.processorType || "—"}</small>
                  <ModelRoutingSummary step={step} readinessContext={readinessContext} compact />
                </div>

                <div className="flow-arrow">←</div>

                <div className={`flow-cell output ${step.visibility}`}>
                  <strong>{getStepOutputName(step)}</strong>
                  <span>{getOptionLabel(OUTPUT_TYPE_OPTIONS, step.outputType)}</span>
                  <small>الصيغة: {getOptionLabel(OUTPUT_FORMATS, step.outputFormat || "text")}</small>
                  <small>الظهور: {visibilityLabel}</small>
                </div>

                <div className="flow-arrow">←</div>

                <div className="flow-cell flow-cell-dest-page">
                  <strong>الصفحة المستهدفة</strong>
                  <span>{destinationLabel}</span>
                </div>

                <div className="flow-arrow">←</div>

                <div className={`flow-cell flow-cell-dest-field ${!destinationFieldLabel ? "missing-field" : ""}`}>
                  <strong>الحقل أو القسم</strong>
                  {destinationFieldLabel ? (
                    <span>{destinationFieldLabel}</span>
                  ) : (
                    <span className="flow-field-missing">لم يُحدد الحقل المستهدف</span>
                  )}
                </div>

                <div className="flow-arrow">←</div>

                <div className="flow-cell flow-cell-review">
                  <strong>المراجعة</strong>
                  <span>{step.reviewRequired ? "مطلوبة قبل الاستخدام" : "غير مطلوبة"}</span>
                  {step.destination === "publishing_queue" && !step.reviewRequired ? (
                    <small className="flow-review-warn">وجهات النشر تحتاج مراجعة</small>
                  ) : null}
                </div>

                <div className="flow-arrow">←</div>

                <div className="flow-cell flow-cell-next-route">
                  <strong>المسار التالي</strong>
                  {step.feedsNextWorkflow ? (
                    <>
                      <span>{getWorkflowLabel(step.nextWorkflowType)}</span>
                      <small>شرط: {getOptionLabel(TRANSITION_CONDITIONS, step.transitionCondition || "after_review")}</small>
                    </>
                  ) : (
                    <span>لا يفتح مسارًا تاليًا</span>
                  )}
                </div>

                {hasGovernanceWarning ? (
                  <div className="flow-warning flow-warning-full">
                    <CircleAlert size={16} />
                    <span>
                      تحذير: هذا التدفق يحتاج مراجعة قبل السماح بالمخرجات أو فتح مسار لاحق.
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </article>

      <aside className="map-side-card">
        <h3>دليل قواعد الظهور</h3>

        <div className="legend-list">
          <div>
            <span className="dot customer" />
            <strong>ظاهر للعميل</strong>
            <small>أي مخرج ظاهر للعميل يجب أن يمر بالمراجعة.</small>
          </div>

          <div>
            <span className="dot internal" />
            <strong>داخلي فقط</strong>
            <small>لا يظهر للعميل أو التقارير.</small>
          </div>

          <div>
            <span className="dot reviewer" />
            <strong>للمراجع فقط</strong>
            <small>يستخدم لاتخاذ قرار الاعتماد.</small>
          </div>

          <div>
            <span className="dot admin" />
            <strong>للمدير فقط</strong>
            <small>مخرجات تشغيلية أو حساسة.</small>
          </div>
        </div>

        <div className="map-policy-note">
          <CircleAlert size={17} />
          <p>
            أي مخرج ظاهر للعميل أو أي تدفق يفتح مسارًا آخر يجب أن يمر عبر
            مراجعة قبل استخدامه في النشر أو التوليد التالي.
          </p>
        </div>

        <div className="map-lanes-guide">
          <strong>دليل المسارات</strong>
          <div><span className="lane-dot" />المشغل: ما الذي يبدأ المسار ومتى</div>
          <div><span className="lane-dot" />المدخلات: البيانات الواردة للخطوة</div>
          <div><span className="lane-dot" />الخطوة: المعالج والنموذج المستخدم</div>
          <div><span className="lane-dot" />المخرج: نوع البيانات الناتجة وصيغتها</div>
          <div><span className="lane-dot" />الصفحة المستهدفة: وجهة المخرج</div>
          <div><span className="lane-dot" />الحقل أو القسم: المكان الدقيق داخل الصفحة</div>
          <div><span className="lane-dot" />المراجعة: هل تحتاج الخطوة موافقة؟</div>
          <div><span className="lane-dot" />المسار التالي: هل يفتح مسارًا آخر؟</div>
        </div>
      </aside>
    </section>
  );
}
