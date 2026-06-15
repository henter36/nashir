export const INITIAL_PROMPTS = [
  {
    id: "pg1",
    name: "Ad Copy Internal Prompt",
    task: "ad_copy_generation",
    version: "v1.4",
    status: "active",
    owner: "System Admin",
    visibleToCustomer: false,
    review: "required",
    sensitivity: "medium",
    updatedAt: "قبل 3 أيام",
    channel: "Content Studio",
    description: "مطالبة داخلية لصياغة النصوص الإعلانية مع الحفاظ على نبرة العلامة وتجنب الادعاءات غير الموثقة.",
    customerFacingSummary: "توجيه عام لصياغة إعلان متوافق مع هوية المتجر والقناة المحددة.",
    internalPromptPreview:
      "Use campaign brief, product context, brand tone, and channel constraints to generate compliant ad copy. Do not expose internal policy instructions.",
    allowedOutputs: ["content_draft", "headline_options", "cta_variants"],
    blockedPatterns: ["guaranteed results", "medical claims", "unverified discount claims"],
    requiredChecks: ["risk_review", "brand_tone_check", "claim_evidence_check"],
    usage: [
      { workflow: "Campaign Generation", step: "generate_content_plan", surface: "معالج الحملات" },
      { workflow: "Content Regeneration", step: "rewrite_content", surface: "المحتوى والمراجعة" },
    ],
  },
  {
    id: "pg2",
    name: "Image Direction Prompt",
    task: "image_generation",
    version: "v0.9",
    status: "testing",
    owner: "Creative Admin",
    visibleToCustomer: false,
    review: "required",
    sensitivity: "high",
    updatedAt: "قبل 9 أيام",
    channel: "Asset Library",
    description: "مطالبة اتجاه بصري لتكوين وصف صورة أو مشهد إعلاني قبل إرساله لنموذج توليد الصور.",
    customerFacingSummary: "شرح بصري مختصر للصورة المقترحة دون كشف المطالبة الداخلية.",
    internalPromptPreview:
      "Translate selected assets and product context into a safe image direction prompt. Avoid protected brand imitation and unsafe claims.",
    allowedOutputs: ["image_direction", "visual_variants", "asset_generation_brief"],
    blockedPatterns: ["celebrity likeness", "brand imitation", "unsafe before-after claims"],
    requiredChecks: ["asset_rights_check", "visual_safety_review", "human_review"],
    usage: [
      { workflow: "Content Generation", step: "prepare_image_direction", surface: "المحتوى والمراجعة" },
      { workflow: "Asset Generation", step: "generate_image_asset", surface: "مكتبة الأصول" },
    ],
  },
  {
    id: "pg3",
    name: "Risk Review Prompt",
    task: "risk_review",
    version: "v2.1",
    status: "active",
    owner: "Governance",
    visibleToCustomer: false,
    review: "always",
    sensitivity: "critical",
    updatedAt: "اليوم",
    channel: "Review",
    description: "مطالبة حوكمة لفحص المخاطر والادعاءات وحالة قابلية النشر قبل الاعتماد.",
    customerFacingSummary: "فحص امتثال ومخاطر للمحتوى قبل نشره أو اعتماده.",
    internalPromptPreview:
      "Review claims, evidence, channel policy, sensitive data, and publishing risk. Return blocked reasons and required edits.",
    allowedOutputs: ["risk_report", "blocked_reasons", "approval_recommendation"],
    blockedPatterns: ["missing evidence", "sensitive personal data", "automatic publishing without approval"],
    requiredChecks: ["policy_review", "evidence_check", "human_review"],
    usage: [
      { workflow: "Video Generation", step: "review_video_prompt", surface: "تشغيلات النظام" },
      { workflow: "Campaign Generation", step: "validate_campaign_brief", surface: "معالج الحملات" },
    ],
  },
  {
    id: "pg4",
    name: "Customer Safe Summary Prompt",
    task: "customer_summary",
    version: "v1.0",
    status: "draft",
    owner: "Product Ops",
    visibleToCustomer: true,
    review: "required",
    sensitivity: "low",
    updatedAt: "قبل 14 يوم",
    channel: "Campaign Detail",
    description: "مطالبة لتوليد ملخص مبسط ظاهر للعميل دون كشف المطالبات الداخلية أو أسماء النماذج.",
    customerFacingSummary: "ملخص مفهوم يشرح ماذا سيتم توليده ولماذا يحتاج للمراجعة.",
    internalPromptPreview:
      "Create a customer-safe explanation of generated outputs. Keep internal policy details out of the visible summary.",
    allowedOutputs: ["customer_explanation", "status_note", "next_action"],
    blockedPatterns: ["أسماء النماذج الداخلية", "قواعد السياسة المخفية", "تسريب المطالبة"],
    requiredChecks: ["prompt_leakage_check", "plain_language_check"],
    usage: [],
  },
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
