import { TASK_INPUT_DEFAULTS } from "./constants.js";

export function getExpectedInputs(prompt) {
  if (Array.isArray(prompt?.expectedInputs) && prompt.expectedInputs.length) {
    return prompt.expectedInputs;
  }

  return TASK_INPUT_DEFAULTS[prompt?.task] || ["غير محددة بعد"];
}

export function getGovernanceFindings(prompt) {
  const findings = [];
  const safePrompt = {
    visibleToCustomer: false,
    sensitivity: "medium",
    requiredChecks: [],
    usage: [],
    task: "",
    status: "draft",
    review: "required",
    ...prompt,
  };

  if (safePrompt.visibleToCustomer && safePrompt.sensitivity !== "low") {
    findings.push({
      level: "block",
      text: "المطالبة ظاهرة للعميل مع حساسية غير منخفضة. يجب فصل الشرح الظاهر عن المطالبة الداخلية.",
    });
  }

  if (!safePrompt.requiredChecks.includes("risk_review") && ["ad_copy_generation", "image_generation"].includes(safePrompt.task)) {
    findings.push({
      level: "warn",
      text: "المسار ينتج مخرجات تسويقية ولا يحتوي risk_review ضمن الفحوص المطلوبة.",
    });
  }

  if (safePrompt.status === "testing") {
    findings.push({
      level: "warn",
      text: "النسخة تجريبية؛ لا يجب استخدامها في مخرجات عميل نهائية دون مراجعة.",
    });
  }

  if (safePrompt.status === "draft") {
    findings.push({
      level: "warn",
      text: "المطالبة ما زالت مسودة وتحتاج اعتماد مالك المسار.",
    });
  }

  if (!safePrompt.usage.length) {
    findings.push({
      level: "info",
      text: "لا يوجد Workflow يستخدم هذا prompt حاليًا؛ لا تحذفه قبل قرار ربط أو إخفاء.",
    });
  }

  if (safePrompt.requiredChecks.includes("human_review") || safePrompt.review === "always") {
    findings.push({
      level: "pass",
      text: "المراجعة البشرية مفعلة أو مطلوبة دائمًا.",
    });
  }

  if (!safePrompt.visibleToCustomer) {
    findings.push({
      level: "pass",
      text: "المطالبة الداخلية مخفية عن العميل.",
    });
  }

  return findings;
}

export function getPromptReadinessLabel(status) {
  const labels = {
    ready: "جاهز",
    warning: "يحتاج ضبط",
    blocked: "محظور",
  };

  return labels[status] || "يحتاج ضبط";
}

export function buildPromptStepReadiness(prompt) {
  const checks = [];
  const warnings = [];
  const blockedReasons = [];
  const safePrompt = {
    name: "مطالبة غير محددة",
    task: "",
    owner: "",
    version: "",
    status: "draft",
    review: "required",
    visibleToCustomer: false,
    allowedOutputs: [],
    blockedPatterns: [],
    requiredChecks: [],
    expectedInputs: [],
    usage: [],
    ...prompt,
  };
  const requiredChecks = Array.isArray(safePrompt.requiredChecks) ? safePrompt.requiredChecks : [];
  const blockedPatterns = Array.isArray(safePrompt.blockedPatterns) ? safePrompt.blockedPatterns : [];
  const allowedOutputs = Array.isArray(safePrompt.allowedOutputs) ? safePrompt.allowedOutputs : [];
  const expectedInputs = getExpectedInputs(safePrompt);
  const usage = Array.isArray(safePrompt.usage) ? safePrompt.usage : [];
  const riskyTasks = ["ad_copy_generation", "image_generation", "video_generation", "customer_summary"];
  const assetTasks = ["image_generation", "video_generation"];
  const customerStyle =
    safePrompt.visibleToCustomer ||
    safePrompt.task === "customer_summary" ||
    allowedOutputs.some((item) => String(item).includes("customer"));

  checks.push("المطالبة موجودة.");

  if (safePrompt.task) checks.push("المهمة محددة.");
  else warnings.push("المهمة غير محددة.");

  if (safePrompt.owner) checks.push("المالك محدد.");
  else warnings.push("المالك غير محدد.");

  if (safePrompt.version) checks.push("الإصدار محدد.");
  else warnings.push("الإصدار غير محدد.");

  if (expectedInputs.length && !expectedInputs.includes("غير محددة بعد")) {
    checks.push("المدخلات المتوقعة محددة.");
  } else {
    warnings.push("المدخلات المتوقعة غير محددة.");
  }

  if (safePrompt.status === "active" || safePrompt.status === "approved") {
    checks.push("حالة المطالبة معتمدة.");
  } else if (safePrompt.status === "testing") {
    warnings.push("المطالبة في حالة اختبار وتحتاج اعتمادًا قبل الاستخدام النهائي.");
  } else if (safePrompt.status === "draft") {
    blockedReasons.push("المطالبة ما زالت مسودة.");
  } else if (safePrompt.status === "blocked") {
    blockedReasons.push("المطالبة محظورة.");
  } else {
    warnings.push("حالة المطالبة تحتاج ضبطًا.");
  }

  if ((customerStyle || riskyTasks.includes(safePrompt.task)) && !["required", "always"].includes(safePrompt.review)) {
    warnings.push("المراجعة مطلوبة للمطالبات المؤثرة على العميل أو عالية المخاطر.");
  } else if (["required", "always"].includes(safePrompt.review)) {
    checks.push("المراجعة مفعلة.");
  }

  if (requiredChecks.length) checks.push("الفحوص المطلوبة محددة.");
  else warnings.push("الفحوص المطلوبة غير محددة.");

  if (riskyTasks.includes(safePrompt.task) && !requiredChecks.includes("risk_review")) {
    warnings.push("المهام التسويقية أو المرئية تحتاج risk_review ضمن الفحوص المطلوبة.");
  }

  if (blockedPatterns.length) checks.push("أنماط الحظر محددة.");
  else warnings.push("أنماط الحظر غير محددة.");

  if (allowedOutputs.length) checks.push("المخرجات المتوقعة/المسموحة محددة.");
  else warnings.push("المخرجات المتوقعة/المسموحة غير محددة.");

  if (usage.length) {
    checks.push("روابط الاستخدام موجودة.");
    const incompleteUsage = usage.some((item) => !item.workflow || !item.step);
    if (incompleteUsage) warnings.push("بعض روابط الاستخدام لا تحتوي المسار والخطوة.");
    else checks.push("روابط الاستخدام مرتبطة بخطوات التشغيل.");
  } else {
    warnings.push("لا توجد روابط استخدام؛ لن تظهر المطالبة في جاهزية خطوات التشغيل.");
  }

  if (customerStyle) {
    if (requiredChecks.includes("prompt_leakage_check") || requiredChecks.includes("plain_language_check")) {
      checks.push("فحص تسريب المطالبات أو تبسيط اللغة موجود.");
    } else {
      warnings.push("الملخصات الظاهرة للعميل تحتاج فحص تسريب المطالبات.");
    }
  }

  if (assetTasks.includes(safePrompt.task)) {
    if (requiredChecks.includes("asset_rights_check") || requiredChecks.includes("visual_safety_review")) {
      checks.push("فحوص الأصول أو السلامة البصرية موجودة.");
    } else {
      warnings.push("مطالبات الصور أو الفيديو تحتاج فحص حقوق الأصول أو السلامة البصرية.");
    }
  }

  const score = Math.max(0, 100 - blockedReasons.length * 35 - warnings.length * 8);
  const status = blockedReasons.length ? "blocked" : warnings.length ? "warning" : "ready";

  return {
    status,
    score,
    checks,
    warnings,
    blockedReasons,
  };
}

export function getGovernanceScore(prompt) {
  const findings = getGovernanceFindings(prompt);
  const penalty = findings.reduce((score, finding) => {
    if (finding.level === "block") return score + 32;
    if (finding.level === "warn") return score + 14;
    return score;
  }, 0);

  return Math.max(0, 100 - penalty);
}

export function getReviewQueueReasons(prompt, readiness) {
  const reasons = [];
  const checks = Array.isArray(prompt?.requiredChecks) ? prompt.requiredChecks : [];

  if (prompt?.status === "draft") reasons.push("مسودة");
  if (prompt?.status === "testing") reasons.push("قيد الاختبار");
  if ((readiness?.score ?? getGovernanceScore(prompt)) < 80) reasons.push("درجة حوكمة منخفضة");
  if (!checks.length) reasons.push("فحوص ناقصة");
  if (prompt?.visibleToCustomer && !prompt?.customerFacingSummary) {
    reasons.push("تظهر للعميل وتحتاج تلخيصًا آمنًا");
  }

  return reasons.length ? reasons : ["تحتاج مراجعة"];
}
