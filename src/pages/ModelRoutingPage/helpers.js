import { TASK_TYPES, WORKFLOW_USAGE_SEED } from "./constants.js";

export function findTask(taskType) {
  return TASK_TYPES.find(([id]) => id === taskType);
}

export function modelName(models, id) {
  return models.find((model) => model.id === id)?.displayName || "غير محدد";
}


export function getWorkflowUsage(taskType) {
  return WORKFLOW_USAGE_SEED.filter((usage) => usage.taskType === taskType);
}

export function getWorkflowUsageLabel(taskType) {
  const usage = getWorkflowUsage(taskType);
  if (!usage.length) return "غير مستخدم";
  const stepCount = usage.reduce((sum, item) => sum + item.steps.length, 0);
  return `${usage.length} Workflow · ${stepCount} خطوة`;
}

export function getRouteHealthLabel(status) {
  const labels = {
    ready: "جاهز",
    warning: "يحتاج ضبط",
    blocked: "محظور",
  };

  return labels[status] || "يحتاج ضبط";
}

export function getRouteCostRow(route, costRows = []) {
  if (!route) return null;
  const routeKeys = [route.taskType, route.routeId, route.id].filter(Boolean);
  return costRows.find((row) => routeKeys.includes(row.task) || routeKeys.includes(row.route)) || null;
}

export function buildRouteHealth(route, models = [], costRows = []) {
  const checks = [];
  const warnings = [];
  const blockedReasons = [];

  if (!route) {
    return {
      status: "blocked",
      score: 0,
      checks: [],
      warnings: [],
      blockedReasons: ["لا يوجد مسار محدد."],
      primaryModel: null,
      fallbackModels: [],
      costRow: null,
      usage: [],
    };
  }

  const cost = route.cost || {};
  const policy = route.policy || {};
  const governance = route.governance || {};
  const fallbackModelIds = Array.isArray(route.fallbackModelIds) ? route.fallbackModelIds : [];
  const primaryModel = models.find((model) => model.id === route.primaryModelId || model.modelId === route.primaryModelId);
  const fallbackModels = fallbackModelIds
    .map((id) => models.find((model) => model.id === id || model.modelId === id))
    .filter(Boolean);
  const costRow = getRouteCostRow(route, costRows);
  const usage = getWorkflowUsage(route.taskType);
  const maxCost = Number(cost.maxCostPerRun ?? costRow?.avgRunCost ?? NaN);
  const approvalAbove = Number(cost.requireApprovalAboveCost ?? costRow?.approvalAbove ?? NaN);
  const highCost = Number.isFinite(maxCost) && maxCost >= 1;
  const riskyTask = ["image_generation", "video_generation", "risk_review"].includes(route.taskType);

  if (primaryModel) {
    checks.push("النموذج الأساسي موجود.");
    if (primaryModel.status === "active") {
      checks.push("النموذج الأساسي نشط.");
    } else {
      blockedReasons.push("النموذج الأساسي غير نشط.");
    }
  } else {
    blockedReasons.push("النموذج الأساسي غير موجود.");
  }

  if (fallbackModelIds.length) {
    if (fallbackModels.length === fallbackModelIds.length) {
      checks.push("النماذج البديلة معرفة.");
    } else {
      warnings.push("بعض النماذج البديلة غير موجودة.");
    }
  } else {
    warnings.push("لا توجد نماذج بديلة لهذا المسار.");
  }

  if (route.cost) {
    checks.push("إعداد التكلفة موجود.");
  } else {
    warnings.push("إعداد التكلفة غير مكتمل.");
  }

  if (cost.maxCostPerRun !== undefined && cost.maxCostPerRun !== "") {
    checks.push("حد التكلفة محدد.");
  } else {
    warnings.push("حد التكلفة غير محدد.");
  }

  if (cost.requireApprovalAboveCost !== undefined && cost.requireApprovalAboveCost !== "") {
    checks.push("حد الموافقة محدد.");
  } else {
    warnings.push("حد الموافقة غير محدد.");
  }

  if (Number.isFinite(maxCost) && Number.isFinite(approvalAbove) && maxCost > approvalAbove) {
    warnings.push("حد التكلفة أعلى من حد الموافقة.");
  }

  if ((highCost || riskyTask) && !governance.humanReviewRequired) {
    warnings.push("المراجعة البشرية مطلوبة للمسارات عالية المخاطر أو التكلفة.");
  } else if (governance.humanReviewRequired) {
    checks.push("المراجعة البشرية مفعلة.");
  }

  if (usage.length) {
    checks.push("مستخدم في التشغيلات.");
  } else {
    warnings.push("المسار غير مستخدم في أي تشغيل ظاهر.");
  }

  if (policy.timeoutSeconds) {
    checks.push("مهلة التشغيل محددة.");
  } else {
    warnings.push("مهلة التشغيل غير محددة.");
  }

  if (policy.retryOnFailure || fallbackModelIds.length) {
    checks.push("سياسة retry أو fallback موجودة.");
  } else {
    warnings.push("لا توجد سياسة retry أو fallback واضحة.");
  }

  if (!costRow) {
    warnings.push("لا يوجد صف تكلفة مرتبط من شاشة التكلفة.");
  }

  const score = Math.max(0, 100 - blockedReasons.length * 35 - warnings.length * 8);
  const status = blockedReasons.length ? "blocked" : warnings.length ? "warning" : "ready";

  return {
    status,
    score,
    checks,
    warnings,
    blockedReasons,
    primaryModel,
    fallbackModels,
    costRow,
    usage,
  };
}
