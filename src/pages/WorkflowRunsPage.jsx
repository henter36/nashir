import { useEffect, useMemo, useState } from "react";
import { PlayCircle, Save, ShieldCheck, Workflow } from "lucide-react";
import { readCostRows, readModelRegistry, readModelRoutes } from "../utils/modelCostStore.js";
import { readPromptRegistry } from "../utils/promptTemplateStore.js";
import { styles } from "./WorkflowRunsPage/styles.js";
import { RUNS, TABS, WORKFLOW_TEMPLATES } from "./WorkflowRunsPage/constants.js";
import {
  cloneTemplate,
  getWorkflowTrigger,
  buildStepReadiness,
  normalizeInputRefs,
  getModelRouteSummary,
  getModelRouteWarnings,
  getTriggerSummary,
  getInputRefLabel,
} from "./WorkflowRunsPage/helpers.js";
import PipelineReflectionCard from "./WorkflowRunsPage/PipelineReflectionCard.jsx";
import BuilderTab from "./WorkflowRunsPage/BuilderTab.jsx";
import MapTab from "./WorkflowRunsPage/MapTab.jsx";
import ContractsTab from "./WorkflowRunsPage/ContractsTab.jsx";
import RunsTab from "./WorkflowRunsPage/RunsTab.jsx";
import TestTab from "./WorkflowRunsPage/TestTab.jsx";

export default function WorkflowRunsPage() {
  const [activeTab, setActiveTab] = useState("builder");
  const [selectedTemplateId, setSelectedTemplateId] = useState("video_generation");
  const [workflowDraft, setWorkflowDraft] = useState(() =>
    cloneTemplate(WORKFLOW_TEMPLATES.find((template) => template.id === "video_generation"))
  );
  const [selectedRunId, setSelectedRunId] = useState(RUNS[0].id);
  const [modelRegistry, setModelRegistry] = useState(() => readModelRegistry([]));
  const [modelRoutes, setModelRoutes] = useState(() => readModelRoutes([]));
  const [costRows, setCostRows] = useState(() => readCostRows([]));
  const [promptRegistry, setPromptRegistry] = useState(() => readPromptRegistry([]));
  const [testLog, setTestLog] = useState([]);
  const [runActionLog, setRunActionLog] = useState([]);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [testInput, setTestInput] = useState({
    sourceScreen: "Store Setup",
    samplePayload:
      "{\n  \"store_url\": \"https://store.example.com\",\n  \"workspace_id\": \"ws_demo\",\n  \"language_hint\": \"ar\"\n}",
    mode: "dry_run",
  });
  const [dryRunResult, setDryRunResult] = useState(null);

  useEffect(() => {
    const reloadReadinessSources = () => {
      setModelRegistry(readModelRegistry([]));
      setModelRoutes(readModelRoutes([]));
      setCostRows(readCostRows([]));
      setPromptRegistry(readPromptRegistry([]));
    };

    window.addEventListener("focus", reloadReadinessSources);
    window.addEventListener("storage", reloadReadinessSources);
    window.addEventListener("nashir-model-registry-updated", reloadReadinessSources);
    window.addEventListener("nashir-model-routing-updated", reloadReadinessSources);
    window.addEventListener("nashir-cost-monitor-updated", reloadReadinessSources);
    window.addEventListener("nashir-prompt-governance-updated", reloadReadinessSources);

    return () => {
      window.removeEventListener("focus", reloadReadinessSources);
      window.removeEventListener("storage", reloadReadinessSources);
      window.removeEventListener("nashir-model-registry-updated", reloadReadinessSources);
      window.removeEventListener("nashir-model-routing-updated", reloadReadinessSources);
      window.removeEventListener("nashir-cost-monitor-updated", reloadReadinessSources);
      window.removeEventListener("nashir-prompt-governance-updated", reloadReadinessSources);
    };
  }, []);

  const readinessContext = useMemo(
    () => ({
      modelRegistry,
      modelRoutes,
      costRows,
      promptRegistry,
      workflowDraft,
    }),
    [costRows, modelRegistry, modelRoutes, promptRegistry, workflowDraft]
  );

  const selectedRun = RUNS.find((run) => run.id === selectedRunId) || RUNS[0] || {
    id: "run-empty",
    title: "لا يوجد تشغيل محدد",
    workflowType: "—",
    status: "waiting_for_review",
    currentStep: "—",
    modelUsed: "—",
    source: "—",
    duration: "—",
    cost: 0,
    owner: "—",
    createdAt: "—",
    inputSummary: "—",
    outputSummary: "—",
    warnings: [],
    steps: [],
  };

  const selectTemplate = (id) => {
    const template = WORKFLOW_TEMPLATES.find((item) => item.id === id);
    if (!template) return;
    setSelectedTemplateId(id);
    setWorkflowDraft(cloneTemplate(template));
    setSelectedStepIndex(0);
  };

  const updateStep = (index, key, value) => {
    setWorkflowDraft((prev) => ({
      ...prev,
      steps: prev.steps.map((step, idx) => (idx === index ? { ...step, [key]: value } : step)),
    }));
  };

  const updateWorkflowTrigger = (key, value) => {
    setWorkflowDraft((prev) => ({
      ...prev,
      trigger: {
        ...getWorkflowTrigger(prev),
        [key]: value,
      },
    }));
  };

  const updateStepInputRefs = (index, inputRefs) => {
    const safeRefs = Array.isArray(inputRefs) ? inputRefs : [];
    setWorkflowDraft((prev) => ({
      ...prev,
      steps: prev.steps.map((step, idx) =>
        idx === index
          ? {
              ...step,
              inputRefs: safeRefs,
              inputFrom: safeRefs.map((ref) => ref.field),
            }
          : step
      ),
    }));
  };

  const addStep = () => {
    setWorkflowDraft((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: `step_${Date.now()}`,
          name: "خطوة جديدة",
          inputDomain: "manual",
          inputRefs: [{ domain: "manual", field: "previous_outputs" }],
          inputFrom: ["previous_outputs"],
          processorType: "model_call",
          processor: "ad_copy_generation",
          outputKey: `output_${Date.now()}`,
          outputType: "content_draft",
          outputFormat: "text",
          destination: "content_studio",
          destinationField: "",
          visibility: "reviewer_only",
          reviewRequired: true,
          feedsNextWorkflow: false,
          nextWorkflowType: "",
          nextStepName: "",
          transitionCondition: "after_review",
          nextInputs: ["previous_outputs"],
          nextPromptName: "",
        },
      ],
    }));
    setSelectedStepIndex(workflowDraft.steps.length);
  };

  const removeStep = (index) => {
    setWorkflowDraft((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== index),
    }));
    setSelectedStepIndex(0);
  };

  const runLocalTest = () => {
    const workflowTrigger = getWorkflowTrigger(workflowDraft);
    const readinessByStep = workflowDraft.steps.map((step) =>
      buildStepReadiness(step, readinessContext)
    );
    const missingInputs = workflowDraft.steps.flatMap((step) =>
      normalizeInputRefs(step).length ? [] : [`${step.name}: لم يتم اختيار مدخلات لهذه الخطوة.`]
    );

    const unsafeOutputs = workflowDraft.steps.flatMap((step) => {
      const issues = [];

      if (step.visibility === "customer_visible" && !step.reviewRequired) {
        issues.push(`${step.name}: أي مخرج ظاهر للعميل يجب أن يمر بالمراجعة.`);
      }

      if (step.feedsNextWorkflow && !step.reviewRequired) {
        issues.push(`${step.name}: يفتح مسارًا آخر دون مراجعة`);
      }

      if (step.destination === "publishing_queue" && !step.reviewRequired) {
        issues.push(`${step.name}: وجهات النشر تحتاج مراجعة قبل الاستخدام.`);
      }

      return issues;
    });

    const missingModelRoutes = workflowDraft.steps.flatMap((step) =>
      step.processorType === "model_call" && !getModelRouteSummary(step.processor)
        ? [`${step.name}: لا يوجد Model Route مطابق للمعالج ${step.processor}`]
        : []
    );

    const readinessBlockedReasons = workflowDraft.steps.flatMap((step, index) =>
      readinessByStep[index].blockedReasons.map((reason) => `${step.name}: ${reason}`)
    );

    const blockedReasons = Array.from(
      new Set([...missingInputs, ...unsafeOutputs, ...missingModelRoutes, ...readinessBlockedReasons])
    );

    const estimatedCost = workflowDraft.steps.reduce((sum, step) => {
      if (step.processorType === "tool") return sum + 0.05;
      if (step.processorType === "tool_call") return sum + 0.05;
      if (step.processorType === "llm") return sum + 0.18;
      if (step.processorType === "model_call") return sum + 0.18;
      if (step.processorType === "vision") return sum + 0.25;
      if (step.processorType === "generator") return sum + 0.75;
      if (step.processorType === "review") return sum + 0.12;
      return sum + 0.08;
    }, 0);

    const estimatedDuration = workflowDraft.steps.length * 12;

    const result = {
      status: blockedReasons.length ? "blocked" : "passed",
      blockedReasons,
      estimatedCost: estimatedCost.toFixed(2),
      estimatedDuration,
      triggerSummary: getTriggerSummary(workflowTrigger),
      simulatedSteps: workflowDraft.steps.map((step, index) => ({
        index: index + 1,
        name: step.name,
        processor: step.processor,
        inputFrom: normalizeInputRefs(step).map(getInputRefLabel),
        outputKey: step.outputKey,
        destination: step.destination,
        visibility: step.visibility,
        reviewRequired: step.reviewRequired,
        modelRoute: step.processorType === "model_call" ? getModelRouteSummary(step.processor) : null,
        modelRouteWarnings: getModelRouteWarnings(step, getModelRouteSummary(step.processor)),
        readiness: readinessByStep[index],
        result:
          readinessByStep[index].status === "blocked" ||
          (step.visibility === "customer_visible" && !step.reviewRequired)
            ? "blocked"
            : "passed",
      })),
      expectedOutputs: workflowDraft.steps.map((step) => ({
        outputKey: step.outputKey,
        outputType: step.outputType,
        destination: step.destination,
        visibility: step.visibility,
      })),
    };

    setDryRunResult(result);

    setTestLog((prev) => [
      {
        id: Date.now(),
        workflow: workflowDraft.name,
        status: result.status,
        message: blockedReasons.length
          ? `تم حظر الاختبار: ${blockedReasons.length} سبب`
          : "نجح الاختبار",
        time: "الآن",
      },
      ...prev,
    ]);
  };

  const addRunAction = (title, detail, tone = "green") => {
    setRunActionLog((prev) => [
      {
        id: Date.now(),
        title,
        detail,
        tone,
        time: "الآن",
      },
      ...prev,
    ]);
  };

  const retrySelectedRun = () => {
    if (selectedRun.status === "waiting_for_review") {
      addRunAction(
        "تعذر إعادة تشغيل المسار",
        "التشغيل يحتاج مراجعة بشرية أولًا قبل أي Retry.",
        "amber"
      );
      return;
    }

    addRunAction("إعادة تشغيل المسار", selectedRun.title, "green");
  };

  const cancelSelectedRun = () => {
    if (selectedRun.status === "completed") {
      addRunAction("لا يمكن إلغاء التشغيل", "التشغيل مكتمل بالفعل.", "amber");
      return;
    }

    addRunAction("إلغاء التشغيل", selectedRun.title, "red");
  };

  const sendSelectedRunToReview = () => {
    addRunAction("إرسال التشغيل للمراجعة", selectedRun.title, "amber");
  };

  const copySelectedRunId = async () => {
    try {
      await navigator.clipboard.writeText(selectedRun.title);
      addRunAction("تم نسخ اسم التشغيل", selectedRun.title, "green");
    } catch {
      addRunAction("تعذر النسخ", "المتصفح لم يسمح بالنسخ.", "amber");
    }
  };

  return (
    <main className="workflow-builder-page" dir="rtl">
      <style>{styles}</style>

      <section className="page-title">
        <div>
          <div className="eyebrow"><Workflow size={15} /> تشغيل المسارات</div>
          <h1>مصمم مسارات البيانات بين الأدوات والنماذج</h1>
          <p>
            هذه الصفحة توثق شكل تشغيل المسارات المطلوب عند التنفيذ. الأزرار والحالات تمثل
            السلوك المستهدف للنظام، ولا تتصل حاليًا بمحرك تشغيل فعلي في هذا النموذج الأولي.
          </p>
        </div>

        <div className="title-actions">
          <button type="button" className="secondary-button">
            <Save size={16} />
            حفظ إعدادات المسار
          </button>
          <button type="button" className="primary-button" onClick={runLocalTest}>
            <PlayCircle size={16} />
            اختبار المسار
          </button>
        </div>
      </section>

      <section className="screen-guidance-card">
        <div><span>هدف الشاشة</span><strong>متابعة مسار التشغيل ومعرفة أين توقفت العملية.</strong></div>
        <div><span>المدخلات</span><strong>Workflow، الموصلات، النماذج، المطالبات، حدود التكلفة.</strong></div>
        <div><span>المخرجات</span><strong>جاهزية التشغيل، أسباب الحظر، حزمة الأدلة، مخرجات قابلة لإعادة الاستخدام.</strong></div>
        <div><span>الإجراء التالي</span><strong>إصلاح سبب الحظر أو إرسال المخرج للمراجعة.</strong></div>
        <div><span>ما لا يحدث هنا</span><strong>لا يتم تنفيذ Backend أو إرسال بيانات فعلية للنماذج.</strong></div>
      </section>

      <section className="governance-alert">
        <ShieldCheck size={20} />
        <div>
          <strong>لا يظهر هذا للمستخدم النهائي</strong>
          <p>
            المستخدم يرى أفعالًا مثل فحص المتجر أو توليد فيديو. أما أسماء
            النماذج، المطالبات الداخلية، ومسارات البيانات فتظهر هنا كمتطلبات تشغيل عند التنفيذ.
            مطالبة تحليل المنتج ترسل بيانات المنتج إلى مسار التحليل في النموذج الأولي، ولا يوجد استدعاء فعلي للنماذج أو أدوات التحليل.
          </p>
        </div>
      </section>

      <section className="tabs">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? "active" : ""}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </section>

      <PipelineReflectionCard />

      {activeTab === "builder" && (
        <BuilderTab
          workflowDraft={workflowDraft}
          selectedTemplateId={selectedTemplateId}
          selectedStepIndex={selectedStepIndex}
          readinessContext={readinessContext}
          selectTemplate={selectTemplate}
          updateStep={updateStep}
          updateWorkflowTrigger={updateWorkflowTrigger}
          updateStepInputRefs={updateStepInputRefs}
          addStep={addStep}
          removeStep={removeStep}
          setSelectedStepIndex={setSelectedStepIndex}
        />
      )}

      {activeTab === "map" && (
        <MapTab
          workflowDraft={workflowDraft}
          readinessContext={readinessContext}
        />
      )}

      {activeTab === "contracts" && (
        <ContractsTab workflowDraft={workflowDraft} />
      )}

      {activeTab === "runs" && (
        <RunsTab
          selectedRun={selectedRun}
          setSelectedRunId={setSelectedRunId}
          runActionLog={runActionLog}
          retrySelectedRun={retrySelectedRun}
          cancelSelectedRun={cancelSelectedRun}
          sendSelectedRunToReview={sendSelectedRunToReview}
          copySelectedRunId={copySelectedRunId}
        />
      )}

      {activeTab === "test" && (
        <TestTab
          testInput={testInput}
          setTestInput={setTestInput}
          runLocalTest={runLocalTest}
          dryRunResult={dryRunResult}
          testLog={testLog}
        />
      )}
    </main>
  );
}
