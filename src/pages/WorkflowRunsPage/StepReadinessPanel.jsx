import { Info, Status } from "./components.jsx";
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
  const trigger = getWorkflowTrigger(readinessContext.workflowDraft);
  const selectedOutputs = [
    getStepOutputName(step),
    getOptionLabel(OUTPUT_TYPE_OPTIONS, step.outputType),
    getOptionLabel(OUTPUT_FORMATS, step.outputFormat || "text"),
  ].filter(Boolean);
  const promptForNext = step.nextPromptName
    ? (readinessContext.promptRegistry || []).find((prompt) => prompt.name === step.nextPromptName)
    : null;
  const routeLabel =
    readiness.primaryModel?.displayName ||
    readiness.staticRoute?.primaryModel ||
    (step.processorType === "model_call" ? "غير مرتبط" : "لا يحتاج مسار نموذج");
  const promptLabel = readiness.prompt
    ? `${readiness.prompt.name} · ${readiness.prompt.version}`
    : step.processorType === "model_call"
      ? "لا يوجد ربط مطالبة معتمد"
      : "لا يحتاج مطالبة";
  const reviewLabel = step.reviewRequired ? "مطلوبة" : "غير مطلوبة";

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
        <Info label="المسار التالي إن وجد" value={step.feedsNextWorkflow ? getWorkflowLabel(step.nextWorkflowType) : "لا يوجد"} />
        <Info label="المطالبة المرتبطة إن وجدت" value={step.nextPromptName ? `${step.nextPromptName} · ${getPromptStatusLabel(promptForNext)}` : "لا توجد مطالبة مرتبطة"} />
        <Info label="مسار النموذج" value={routeLabel} />
        <Info label="المطالبة المرتبطة" value={promptLabel} />
        <Info label="حد التكلفة" value={getCostLimitLabel(readiness.route, readiness.costRow)} />
        <Info label="المراجعة" value={reviewLabel} />
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

      {readiness.checks.length ? (
        <div className="readiness-notes safe-notes">
          <strong>الفحوصات الناجحة</strong>
          {readiness.checks.slice(0, 3).map((check) => (
            <span key={check}>{check}</span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
