function createPrompt(
  [id, name, task, version, status, owner, visibleToCustomer, review, sensitivity, updatedAt, channel],
  [description, customerFacingSummary, internalPromptPreview],
  [allowedOutputs, blockedPatterns, requiredChecks],
  usage,
) {
  return {
    id,
    name,
    task,
    version,
    status,
    owner,
    visibleToCustomer,
    review,
    sensitivity,
    updatedAt,
    channel,
    description,
    customerFacingSummary,
    internalPromptPreview,
    allowedOutputs,
    blockedPatterns,
    requiredChecks,
    usage,
  };
}

export const INITIAL_PROMPTS = [
  createPrompt(
    ["pg1", "Ad Copy Internal Prompt", "ad_copy_generation", "v1.4", "active", "System Admin", false, "required", "medium", "قبل 3 أيام", "Content Studio"],
    ["مطالبة داخلية لصياغة النصوص الإعلانية مع الحفاظ على نبرة العلامة وتجنب الادعاءات غير الموثقة.", "توجيه عام لصياغة إعلان متوافق مع هوية المتجر والقناة المحددة.", "Use campaign brief, product context, brand tone, and channel constraints to generate compliant ad copy. Do not expose internal policy instructions."],
    [["content_draft", "headline_options", "cta_variants"], ["guaranteed results", "medical claims", "unverified discount claims"], ["risk_review", "brand_tone_check", "claim_evidence_check"]],
    [
      { workflow: "Campaign Generation", step: "generate_content_plan", surface: "معالج الحملات" },
      { workflow: "Content Regeneration", step: "rewrite_content", surface: "المحتوى والمراجعة" },
    ],
  ),
  createPrompt(
    ["pg2", "Image Direction Prompt", "image_generation", "v0.9", "testing", "Creative Admin", false, "required", "high", "قبل 9 أيام", "Asset Library"],
    ["مطالبة اتجاه بصري لتكوين وصف صورة أو مشهد إعلاني قبل إرساله لنموذج توليد الصور.", "شرح بصري مختصر للصورة المقترحة دون كشف المطالبة الداخلية.", "Translate selected assets and product context into a safe image direction prompt. Avoid protected brand imitation and unsafe claims."],
    [["image_direction", "visual_variants", "asset_generation_brief"], ["celebrity likeness", "brand imitation", "unsafe before-after claims"], ["asset_rights_check", "visual_safety_review", "human_review"]],
    [
      { workflow: "Content Generation", step: "prepare_image_direction", surface: "المحتوى والمراجعة" },
      { workflow: "Asset Generation", step: "generate_image_asset", surface: "مكتبة الأصول" },
    ],
  ),
  createPrompt(
    ["pg3", "Risk Review Prompt", "risk_review", "v2.1", "active", "Governance", false, "always", "critical", "اليوم", "Review"],
    ["مطالبة حوكمة لفحص المخاطر والادعاءات وحالة قابلية النشر قبل الاعتماد.", "فحص امتثال ومخاطر للمحتوى قبل نشره أو اعتماده.", "Review claims, evidence, channel policy, sensitive data, and publishing risk. Return blocked reasons and required edits."],
    [["risk_report", "blocked_reasons", "approval_recommendation"], ["missing evidence", "sensitive personal data", "automatic publishing without approval"], ["policy_review", "evidence_check", "human_review"]],
    [
      { workflow: "Video Generation", step: "review_video_prompt", surface: "تشغيلات النظام" },
      { workflow: "Campaign Generation", step: "validate_campaign_brief", surface: "معالج الحملات" },
    ],
  ),
  createPrompt(
    ["pg4", "Customer Safe Summary Prompt", "customer_summary", "v1.0", "draft", "Product Ops", true, "required", "low", "قبل 14 يوم", "Campaign Detail"],
    ["مطالبة لتوليد ملخص مبسط ظاهر للعميل دون كشف المطالبات الداخلية أو أسماء النماذج.", "ملخص مفهوم يشرح ماذا سيتم توليده ولماذا يحتاج للمراجعة.", "Create a customer-safe explanation of generated outputs. Keep internal policy details out of the visible summary."],
    [["customer_explanation", "status_note", "next_action"], ["أسماء النماذج الداخلية", "قواعد السياسة المخفية", "تسريب المطالبة"], ["prompt_leakage_check", "plain_language_check"]],
    [],
  ),
];

export const rules = [
  "لا تعرض المطالبة الداخلية للمستخدم أو العميل.",
  "اعرض للعميل شرحًا عامًا فقط للسيناريو أو الاتجاه الإبداعي.",
  "كل نسخة prompt يجب أن تحمل version وowner وtask.",
  "أي prompt يستخدم ادعاءات تسويقية يجب أن يمر عبر risk_review.",
  "أي prompt ينتج أصلًا بصريًا أو فيديو يجب أن يمر عبر فحص حقوق الأصول.",
  "لا يتم النشر التلقائي بناءً على prompt دون مراجعة بشرية صريحة.",
];

export const auditEvents = [
  { id: "a1", event: "تم اعتماد v2.1", prompt: "Risk Review Prompt", actor: "Governance", time: "اليوم", severity: "success" },
  { id: "a2", event: "تم حظر مسودة بسبب كشف أسماء نماذج", prompt: "Customer Safe Summary Prompt", actor: "Policy Check", time: "أمس", severity: "warning" },
  { id: "a3", event: "تمت إضافة asset_rights_check", prompt: "Image Direction Prompt", actor: "Creative Admin", time: "قبل 4 أيام", severity: "info" },
];

export const STATUS_LABELS = {
  active: ["نشط", "green"],
  testing: ["تجريبي", "amber"],
  draft: ["مسودة", "slate"],
  blocked: ["محظور", "red"],
};

export const REVIEW_LABELS = {
  always: "دائمًا",
  required: "مطلوبة",
  optional: "اختيارية",
};

export const SENSITIVITY_LABELS = {
  low: ["منخفضة", "green"],
  medium: ["متوسطة", "amber"],
  high: ["عالية", "red"],
  critical: ["حرجة", "red"],
};

export const TABS = [
  ["registry", "سجل المطالبات"],
  ["policy", "سياسات المخرجات"],
  ["review", "قائمة مراجعة المطالبات"],
  ["simulation", "فحص التسريب"],
  ["audit", "سجل التدقيق"],
];

export const WORKFLOW_LINK_OPTIONS = [
  { workflow: "Campaign Generation", step: "generate_content_plan", surface: "معالج الحملات", task: "ad_copy_generation" },
  { workflow: "Campaign Generation", step: "validate_campaign_brief", surface: "معالج الحملات", task: "risk_review" },
  { workflow: "Content Regeneration", step: "rewrite_content", surface: "المحتوى والمراجعة", task: "ad_copy_generation" },
  { workflow: "Image Generation", step: "prepare_image_direction", surface: "المحتوى والمراجعة", task: "image_generation" },
  { workflow: "Video Generation", step: "review_video_prompt", surface: "تشغيلات النظام", task: "risk_review" },
  { workflow: "Customer Summary", step: "build_customer_safe_summary", surface: "تفاصيل الحملة", task: "customer_summary" },
];

export const ALLOWED_OUTPUT_OPTIONS = [
  "content_draft",
  "headline_options",
  "cta_variants",
  "image_direction",
  "visual_variants",
  "asset_generation_brief",
  "risk_report",
  "blocked_reasons",
  "approval_recommendation",
  "customer_explanation",
  "status_note",
  "next_action",
  "structured_json",
  "review_notes",
];

export const REQUIRED_CHECK_OPTIONS = [
  "risk_review",
  "brand_tone_check",
  "claim_evidence_check",
  "asset_rights_check",
  "visual_safety_review",
  "human_review",
  "policy_review",
  "evidence_check",
  "prompt_leakage_check",
  "plain_language_check",
  "privacy_check",
  "channel_policy_check",
];

export const BLOCKED_PATTERN_OPTIONS = [
  "raw prompt leakage",
  "hidden policy rules",
  "internal model names",
  "guaranteed results",
  "unverified discount claims",
  "medical claims",
  "celebrity likeness",
  "unsafe before-after claims",
  "missing evidence",
  "sensitive personal data",
  "automatic publishing without approval",
];

export const BLOCKED_PATTERN_SEVERITY = {
  "raw prompt leakage": "حظر",
  "hidden policy rules": "حظر",
  "internal model names": "حظر",
  "guaranteed results": "حظر",
  "unverified discount claims": "تحذير",
  "medical claims": "حظر",
  "celebrity likeness": "مراقبة",
  "unsafe before-after claims": "حظر",
  "missing evidence": "تحذير",
  "sensitive personal data": "حظر",
  "automatic publishing without approval": "حظر",
};

export const EXPECTED_INPUT_OPTIONS = [
  "رابط المتجر",
  "بيانات المتجر",
  "بيانات المنتج",
  "السعر",
  "وصف المنتج",
  "الأصول المختارة",
  "الجمهور",
  "القنوات",
  "العرض",
  "دعوة الإجراء",
  "مخرجات خطوة سابقة",
  "مصدر بيانات",
  "مؤشرات الأداء",
  "ملاحظات المراجعة",
  "محتوى الحملة",
  "محتوى حملة سابق",
  "ادعاءات وتسويق",
  "حالة المراجعة",
  "القناة",
];

export const TASK_INPUT_DEFAULTS = {
  store_reading: ["رابط المتجر", "بيانات المتجر"],
  product_extraction: ["رابط المتجر", "بيانات المنتج"],
  ad_copy_generation: ["بيانات المنتج", "الجمهور", "القنوات", "العرض", "دعوة الإجراء"],
  image_generation: ["بيانات المنتج", "الأصول المختارة", "القناة"],
  video_generation: ["بيانات المنتج", "الأصول المختارة", "القنوات"],
  risk_review: ["محتوى الحملة", "ملاحظات المراجعة", "ادعاءات وتسويق"],
  customer_summary: ["محتوى حملة سابق", "حالة المراجعة"],
};
