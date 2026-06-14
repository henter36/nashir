export function getContractSchema(step) {
  const base = {
    required: ["مفتاح المخرج", "نوع المخرج", "الوجهة", "مستوى الظهور", "حالة المراجعة"],
  };

  const map = {
    raw_store_snapshot: ["مرجع الفحص", "رابط المصدر", "ملخص الالتقاط", "وقت الالتقاط", "درجة الثقة"],
    product_candidates: ["مرجع المنتج", "الاسم", "السعر", "الرابط", "المصدر", "درجة الثقة"],
    asset_candidates: ["مرجع الأصل", "النوع", "رابط المصدر", "حقوق الاستخدام", "حالة المراجعة"],
    brand_insights: ["النبرة", "الكلمات المفتاحية", "تقدير الجمهور", "درجة الثقة", "المصادر"],
    audience_insights: ["الشرائح", "الدوافع", "الملاحظات", "درجة الثقة"],
    campaign_strategy: ["الهدف", "زاوية الرسالة", "القنوات", "العرض", "ملاحظات المخاطر"],
    customer_visible_brief: ["العنوان", "الوصف", "دعوة الإجراء", "القيود", "حالة المراجعة"],
    internal_prompt: ["مرجع المطالبة", "وصف محجوب", "مسار النموذج", "مستوى الظهور"],
    content_draft: ["مرجع المحتوى", "القناة", "النص", "الحالة", "حالة المراجعة"],
    risk_report: ["مستوى المخاطر", "الادعاءات المطلوبة", "العبارات المحظورة", "التوصية"],
    generated_asset: ["مرجع الأصل", "نوع الأصل", "الرابط", "حقوق الاستخدام", "حالة المراجعة"],
    analytics_recommendation: ["مصدر القياس", "التوصيات", "درجة الثقة", "التسميات المقدرة"],
    publishing_item: ["مرجع المحتوى", "القناة", "وقت الجدولة", "حالة الاعتماد", "وضع النشر"],
  };

  return {
    ...base,
    required: map[step.outputType] || base.required,
  };
}

export function getAllowedConsumers(step) {
  const base = [step.destination];

  if (step.reviewRequired) base.push("review");
  if (step.feedsNextWorkflow && step.nextWorkflowType) base.push(step.nextWorkflowType);
  if (step.visibility === "admin_only") base.push("system_admin");
  if (step.visibility === "internal_only") base.push("workflow_runs");
  if (step.outputType === "generated_asset" || step.outputType === "asset_candidates") base.push("asset_library");
  if (step.outputType === "publishing_item") base.push("publishing_queue");

  return Array.from(new Set(base.filter(Boolean)));
}

export function isSensitiveOutput(step) {
  return (
    ["internal_prompt", "raw_store_snapshot", "risk_report"].includes(step.outputType) ||
    step.visibility === "admin_only" ||
    step.visibility === "internal_only"
  );
}

export function getRetentionPolicy(step) {
  if (step.visibility === "admin_only" || step.outputType === "internal_prompt") return "قصير / إداري";
  if (step.reviewRequired) return "حتى الاعتماد";
  return "حسب الحملة";
}

export function getContractRiskFlags(step) {
  if (!step) return [];
  const risks = [];

  if (step.visibility === "customer_visible" && !step.reviewRequired) {
    risks.push("أي مخرج ظاهر للعميل يجب أن يمر بالمراجعة.");
  }

  if (step.feedsNextWorkflow && !step.reviewRequired) {
    risks.push("المخرج يفتح مسارًا آخر دون مراجعة.");
  }

  if (step.outputType === "generated_asset" && step.destination !== "asset_library") {
    risks.push("الأصول المولدة يجب أن تمر عبر Asset Library قبل الاستخدام.");
  }

  if (step.outputType === "internal_prompt" && step.visibility === "customer_visible") {
    risks.push("المطالبات الداخلية لا يجب أن تكون ظاهرة للعميل.");
  }

  if (step.destination === "publishing_queue" && !step.reviewRequired) {
    risks.push("يجب منع النشر التلقائي دون مراجعة.");
  }

  return risks;
}
