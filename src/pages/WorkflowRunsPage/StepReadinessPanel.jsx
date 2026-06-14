import { Info, Status, ReadinessNotesList } from "./components.jsx";
import {
  buildStepReadiness,
  normalizeInputRefs,
  getWorkflowTrigger,
  getInputRefLabel,
  getStepOutputName,
  getTriggerSummary,
  getOptionLabel,
  getWorkflowLabel,
  getPromptStatusLabel,
  getCostLimitLabel,
} from "./helpers.js";
import { OUTPUT_TYPE_OPTIONS, OUTPUT_FORMATS, START_CONDITIONS } from "./constants.js";

export default function StepReadinessPanel({ step, readinessContext = {}, compact = false }) {
  const readiness = buildStepReadiness(step, readinessContext);
  const selectedInputs = normalizeInputRefs(step);
  const trigger = getWorkflowTrigger(readinessContext?.workflowDraft);
  const selectedOutputs = [
    getStepOutputName(step),
    getOptionLabel(OUTPUT_TYPE_OPTIONS, step?.outputType),
    getOptionLabel(OUTPUT_FORMATS, step?.outputFormat || "text"),
  ].filter(Boolean);
  const promptForNext = step?.nextPromptName
    ? (readinessContext?.promptRegistry || []).find((prompt) => prompt.name === step.nextPromptName)
    : null;
  const routeLabel =
    readiness.primaryModel?.displayName ||
    readiness.staticRoute?.primaryModel ||
    (step?.processorType === "model_call" ? "غير مرتبط" : "لا يحتاج مسار نموذج");
  let promptLabel = "لا يحتاج مطالبة";
  if (readiness.prompt) {
    promptLabel = `${readiness.prompt.name} · ${readiness.prompt.version}`;
  } else if (step?.processorType === "model_call") {
    promptLabel = "لا يوجد ربط مطالبة معتمد";
  }
  const reviewLabel = step?.reviewRequired ? "مطلوبة" : "غير مطلوبة";

  return (
    <section className={`step-readiness-panel ${readiness.status} ${compact ? "compact" : ""}`}>
      <div className="step-readiness-head">
        <div>
          <strong>جاهزية الخطوة</strong>
          <span>جاهزية الخطوة تجمع المسار والمطالبة والتكلفة والمراجعة. · {readiness.score}%</span>
        </div>
        <Status value={readiness.status} />
      </div>

      <div className="step-readiness-grid">
        <Info label="عدد المدخلات المختارة" value={`${selectedInputs.length}`} />
        <Info label="المدخلات المحددة" value={selectedInputs.length ? selectedInputs.map(getInputRefLabel).join("، ") : "لم يتم اختيار مدخلات لهذه الخطوة."} />
        <Info label="مشغل المسار" value={getTriggerSummary(trigger)} />
        <Info label="شرط البدء" value={getOptionLabel(START_CONDITIONS, trigger.startCondition)} />
        <Info label="المخرجات المحددة" value={selectedOutputs.join(" · ")} />
        <Info label="المسار التالي إن وجد" value={step?.feedsNextWorkflow ? getWorkflowLabel(step?.nextWorkflowType) : "لا يوجد"} />
        <Info label="المطالبة المرتبطة إن وجدت" value={step?.nextPromptName ? `${step?.nextPromptName} · ${getPromptStatusLabel(promptForNext)}` : "لا توجد مطالبة مرتبطة"} />
        <Info label="مسار النموذج" value={routeLabel} />
        <Info label="المطالبة المرتبطة" value={promptLabel} />
        <Info label="حد التكلفة" value={getCostLimitLabel(readiness.route, readiness.costRow)} />
        <Info label="المراجعة" value={reviewLabel} />
      </div>

      <ReadinessNotesList className="blocked-notes" title="أسباب الحظر" items={readiness.blockedReasons} emptyText="لا توجد أسباب حظر" />

      <ReadinessNotesList className="warning-notes" title="تحذيرات" items={readiness.warnings} emptyText="لا توجد تحذيرات" />

      {readiness.checks.length ? (
        <ReadinessNotesList className="safe-notes" title="الفحوصات الناجحة" items={readiness.checks.slice(0, 3)} />
      ) : null}
    </section>
  );
}
