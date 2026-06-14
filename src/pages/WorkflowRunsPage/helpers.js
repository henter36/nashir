import {
  MODEL_ROUTE_CATALOG,
  STRUCTURED_INPUT_SOURCES,
  INPUT_FIELD_OPTIONS,
  TRIGGER_TYPES,
  START_CONDITIONS,
  EVENT_SOURCES,
  NEXT_WORKFLOWS,
  WORKFLOW_TEMPLATES,
} from "./constants.js";

export function getModelRouteSummary(processor) {
  const route = MODEL_ROUTE_CATALOG[processor];
  if (!route) return null;
  return {
    primaryModel: route.primaryModel,
    fallback: route.fallback,
    maxCostPerRun: route.maxCostPerRun,
    approvalAbove: route.approvalAbove,
    humanReviewRequired: route.humanReviewRequired,
    blockAutoPublish: route.blockAutoPublish,
    status: route.status,
    taskLabel: route.taskLabel,
  };
}

export function getModelRouteWarnings(step, route) {
  if (!route) return [];
  const warnings = [];
  if (route.blockAutoPublish) warnings.push("النشر التلقائي غير مسموح لهذا المسار");
  if (route.humanReviewRequired) warnings.push("تلزم مراجعة بشرية قبل قبول المخرج");
  if (parseFloat(route.maxCostPerRun) > 1) warnings.push(`حد التكلفة مرتفع: ${route.maxCostPerRun} USD`);
  if (step.visibility === "customer_visible" && route.blockAutoPublish)
    warnings.push("المخرج ظاهر للعميل ولكن يحتاج اعتمادًا");
  return warnings;
}

export function getStepRoute(step, modelRoutes) {
  if (!step || step.processorType !== "model_call") return null;
  return modelRoutes.find((r) => r.processor === step.processor) || null;
}

export function getStepCostRow(step, route, costRows) {
  if (!route || !step) return null;
  return costRows.find((c) => c.routeId === route.id) || null;
}

export function inferDomainForField(field) {
  for (const source of STRUCTURED_INPUT_SOURCES) {
    if (source.fields.includes(field)) return source.value;
  }
  return null;
}

export function normalizeInputRefs(step) {
  if (step.inputRefs && Array.isArray(step.inputRefs) && step.inputRefs.length > 0) {
    return step.inputRefs;
  }
  if (step.inputFrom && Array.isArray(step.inputFrom)) {
    return step.inputFrom.map((field) => ({
      domain: inferDomainForField(field) || "manual",
      field,
    }));
  }
  return [];
}

export function getOptionLabel(options, value) {
  const found = options.find((o) => o[0] === value);
  return found ? found[1] : value;
}

export function getInputFieldLabel(value) {
  return getOptionLabel(INPUT_FIELD_OPTIONS, value);
}

export function getInputSourceLabel(value) {
  const found = STRUCTURED_INPUT_SOURCES.find((s) => s.value === value);
  return found ? found.label : value;
}

export function getInputRefLabel(ref) {
  if (!ref) return "";
  const domain = getInputSourceLabel(ref.domain);
  const field = getInputFieldLabel(ref.field);
  return `${domain} · ${field}`;
}

export function formatInputRefs(step) {
  return normalizeInputRefs(step).map(getInputRefLabel).join("، ");
}

export function inferInputDomain(step) {
  const refs = normalizeInputRefs(step);
  if (refs.length === 0) return null;
  const domains = [...new Set(refs.map((r) => r.domain))];
  return domains.length === 1 ? domains[0] : "mixed";
}

export function getFieldsForSource(sourceValue) {
  const source = STRUCTURED_INPUT_SOURCES.find((s) => s.value === sourceValue);
  return source ? source.fields : [];
}

export function getPromptStatusLabel(prompt) {
  if (!prompt) return "لا توجد مطالبة مرتبطة";
  if (prompt.status === "approved") return "معتمدة";
  if (prompt.status === "draft") return "مسودة";
  if (prompt.status === "review") return "قيد المراجعة";
  return "غير محددة";
}

export function getWorkflowLabel(value) {
  return getOptionLabel(NEXT_WORKFLOWS, value);
}

export function getConsumerLabel(step) {
  if (!step) return "—";
  const dest = step.destination || "";
  const next = step.feedsNextWorkflow ? ` + ${getWorkflowLabel(step.nextWorkflowType)}` : "";
  return `${dest}${next}`;
}

export function getStepOutputName(step) {
  return step?.outputKey || "—";
}

export function getTriggerTypeForTemplate(template) {
  if (!template) return "manual";
  const map = {
    store_intelligence: "manual",
    campaign_generation: "campaign_created",
    product_analysis: "manual",
    content_generation: "content_approved",
    video_generation: "content_approved",
  };
  return map[template.id] || "manual";
}

export function getDefaultTrigger(template) {
  const type = getTriggerTypeForTemplate(template);
  return {
    type,
    startCondition: "required_data_complete",
    eventSource: "manual",
    updatePolicy: "",
    description: "",
  };
}

export function getWorkflowTrigger(workflowDraft) {
  if (!workflowDraft) return getDefaultTrigger(null);
  if (workflowDraft.trigger) return workflowDraft.trigger;
  return getDefaultTrigger({ id: workflowDraft.workflowType });
}

export function getTriggerSummary(trigger) {
  if (!trigger) return "لا يوجد مشغّل محدد";
  const typeLabel = getOptionLabel(TRIGGER_TYPES, trigger.type);
  const condLabel = getOptionLabel(START_CONDITIONS, trigger.startCondition);
  const sourceLabel = getOptionLabel(EVENT_SOURCES, trigger.eventSource);
  return `${typeLabel} — ${condLabel} — ${sourceLabel}`;
}

export function getStepPrompt(step, workflowDraft, promptRegistry) {
  if (!step || !promptRegistry) return null;
  return (
    promptRegistry.find(
      (p) =>
        p.processor === step.processor ||
        p.workflowType === workflowDraft?.workflowType
    ) || null
  );
}

export function getCostLimitLabel(route, costRow) {
  if (!route) return "—";
  const limit = costRow?.maxCostPerRun || route.maxCostPerRun || "—";
  const approval = costRow?.approvalAbove || route.approvalAbove || "—";
  return `${limit} USD / يلزم اعتماد فوق ${approval} USD`;
}

export function buildStepReadiness(step, context) {
  const { modelRoutes = [], costRows = [], promptRegistry = [], workflowDraft = null } = context || {};
  const refs = normalizeInputRefs(step);
  const checks = [];
  const warnings = [];
  const blockedReasons = [];

  const hasInputRefs = refs.length > 0;
  checks.push(["المدخلات محددة", hasInputRefs]);
  if (!hasInputRefs) blockedReasons.push("لا توجد مدخلات محددة");

  const hasOutput = !!step.outputKey;
  checks.push(["المخرج محدد", hasOutput]);
  if (!hasOutput) blockedReasons.push("لا يوجد مفتاح مخرج");

  const hasDestination = !!step.destination;
  checks.push(["الوجهة محددة", hasDestination]);
  if (!hasDestination) blockedReasons.push("لا توجد وجهة محددة");

  let route = null;
  let primaryModel = null;
  let fallbackModels = [];
  let costRow = null;
  let prompt = null;
  let staticRoute = null;

  if (step.processorType === "model_call") {
    route = getStepRoute(step, modelRoutes);
    staticRoute = getModelRouteSummary(step.processor);
    const hasRoute = !!(route || staticRoute);
    checks.push(["مسار النموذج مرتبط", hasRoute]);
    if (!hasRoute) blockedReasons.push("لا يوجد مسار نموذج مرتبط");

    if (staticRoute) {
      primaryModel = staticRoute.primaryModel;
      fallbackModels = staticRoute.fallback || [];
    }
    if (route) {
      primaryModel = route.primaryModel || primaryModel;
      fallbackModels = route.fallback || fallbackModels;
    }

    costRow = getStepCostRow(step, route, costRows);
    const hasCostLimit = !!(costRow || staticRoute?.maxCostPerRun);
    checks.push(["حد التكلفة محدد", hasCostLimit]);
    if (!hasCostLimit) warnings.push("لم يُحدد حد التكلفة لهذه الخطوة");

    prompt = getStepPrompt(step, workflowDraft, promptRegistry);
    const hasPrompt = !!prompt;
    checks.push(["مطالبة معتمدة مرتبطة", hasPrompt]);
    if (!hasPrompt) warnings.push("لا توجد مطالبة معتمدة مرتبطة بهذه الخطوة");

    const routeWarnings = getModelRouteWarnings(step, staticRoute || route);
    warnings.push(...routeWarnings);
  }

  if (step.reviewRequired) {
    checks.push(["مراجعة بشرية مطلوبة", true]);
  }

  const passedChecks = checks.filter((c) => c[1]).length;
  const totalChecks = checks.length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  const status = blockedReasons.length > 0 ? "blocked" : score < 60 ? "partial" : "ready";

  return { status, score, checks, warnings, blockedReasons, route, primaryModel, fallbackModels, costRow, prompt, staticRoute };
}

export function cloneTemplate(template) {
  const source = template || WORKFLOW_TEMPLATES[0];
  return {
    workflowType: source.id,
    name: source.name,
    description: source.description,
    triggerScreen: source.triggerScreen,
    triggerAction: source.triggerAction,
    trigger: getDefaultTrigger(source),
    inputSources: [...source.inputSources],
    outputsTo: [...source.outputsTo],
    steps: source.steps.map((step) => ({
      ...step,
      inputFrom: [...(step.inputFrom || [])],
      inputRefs: normalizeInputRefs(step),
    })),
    policies: {
      requireHumanReview: true,
      blockAutoPublish: true,
      redactSensitiveData: true,
      logAllSteps: true,
      stopOnAssetRightsIssue: true,
      stopOnCostLimit: true,
    },
  };
}
