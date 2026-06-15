import { BarChart3, FileSearch, ImageIcon, Layers, PlayCircle, Search, ShieldCheck, Sparkles, Store, Wand2 } from "lucide-react";

function createModel(
  [id, displayName, provider, modelIdentifier, status, qualityTier, speedTier, costTier],
  capabilities,
  [humanReviewRequired, allowCustomerData, allowAssets, allowExternalTools, logRequests],
) {
  return {
    id, displayName, provider, modelIdentifier, status, qualityTier, speedTier, costTier, capabilities,
    governance: { humanReviewRequired, allowCustomerData, allowAssets, allowExternalTools, logRequests },
  };
}

export const MODEL_REGISTRY_SEED = [
  createModel(
    ["model-store-reader","Gemini Store Reader","Gemini","gemini-store-reader","active","high","balanced","medium"],
    ["Text","Vision","Long Context","Structured Output"],
    [true,true,true,false,true],
  ),
  createModel(
    ["model-gpt-analysis","GPT Analysis","OpenAI","gpt-analysis-main","active","premium","balanced","high"],
    ["Text","Tools","Structured Output","Long Context"],
    [true,true,false,true,true],
  ),
  createModel(
    ["model-claude-reviewer","Claude Risk Reviewer","Anthropic","claude-risk-review","active","premium","balanced","high"],
    ["Text","Long Context","Risk Review"],
    [true,true,false,false,true],
  ),
  createModel(
    ["model-gpt-writer","GPT Campaign Writer","OpenAI","gpt-writer-main","active","high","fast","medium"],
    ["Text","Structured Output","Tools"],
    [true,true,false,false,true],
  ),
  createModel(
    ["model-flux-image","Flux Image","Replicate","black-forest-labs/flux-pro","testing","high","slow","high"],
    ["Image Generation"],
    [true,false,true,false,true],
  ),
  createModel(
    ["model-runway-video","Runway Video","Runway","gen-video","testing","premium","slow","high"],
    ["Video Generation"],
    [true,false,true,false,true],
  ),
];

export const TASK_TYPES = [
  ["store_reading", "قراءة المتجر وتحليل صفحاته", "Store Setup", Store],
  ["product_extraction", "استخراج المنتجات والتصنيفات", "Store Setup", FileSearch],
  ["social_analysis", "تحليل حسابات التواصل", "Store Setup", Search],
  ["competitor_analysis", "تحليل المنافسين", "Market", BarChart3],
  ["campaign_strategy", "تحليل وتخطيط الحملة", "Campaign Intake", Wand2],  ["ad_copy_generation", "توليد النصوص الإعلانية", "Content Studio", Wand2],
  ["content_rewrite", "إعادة صياغة المحتوى", "Content Studio", Sparkles],
  ["image_generation", "توليد الصور", "Asset / Content", ImageIcon],
  ["video_script_generation", "كتابة سكربت الفيديو", "Content Studio", PlayCircle],
  ["video_generation", "توليد الفيديو", "Video", PlayCircle],
  ["risk_review", "مراجعة المخاطر والادعاءات", "Review", ShieldCheck],
  ["platform_preview", "تهيئة المحتوى لكل منصة", "Live Preview", Layers],
  ["analytics_summary", "تلخيص الأداء", "Analytics", BarChart3],
  ["ai_recommendations", "توصيات التحسين", "Smart Analytics", Sparkles],
];

function createRoute(
  [id, taskType, primaryModelId],
  fallbackModelIds,
  [useCheapestFirst, useBestQuality, retryOnFailure, maxRetries, timeoutSeconds],
  [maxCostPerRun, monthlyBudgetLimit, requireApprovalAboveCost],
  [humanReviewRequired, blockAutoPublish, redactSensitiveData, includeSourceCitations],
) {
  return {
    id, taskType, primaryModelId, fallbackModelIds,
    policy: { useCheapestFirst, useBestQuality, retryOnFailure, maxRetries, timeoutSeconds },
    cost: { maxCostPerRun, monthlyBudgetLimit, requireApprovalAboveCost },
    governance: { humanReviewRequired, blockAutoPublish, redactSensitiveData, includeSourceCitations },
  };
}

export const ROUTES_SEED = [
  createRoute(
    ["route-store-reading","store_reading","model-store-reader"],
    ["model-gpt-analysis"],
    [false,true,true,2,90],
    ["0.35","150","1.00"],
    [true,true,true,true],
  ),
  createRoute(
    ["route-product-extraction","product_extraction","model-store-reader"],
    ["model-gpt-analysis"],
    [true,false,true,2,60],
    ["0.20","100","0.75"],
    [true,true,true,true],
  ),
  createRoute(
    ["route-campaign-strategy","campaign_strategy","model-gpt-analysis"],
    ["model-claude-reviewer"],
    [false,true,true,1,90],
    ["0.50","250","1.50"],
    [true,true,true,true],
  ),
  createRoute(
    ["route-ad-copy","ad_copy_generation","model-gpt-writer"],
    ["model-claude-reviewer"],
    [false,true,true,2,45],
    ["0.25","300","1.00"],
    [true,true,true,false],
  ),
  createRoute(
    ["route-image","image_generation","model-flux-image"],
    ["model-store-reader"],
    [false,true,false,0,180],
    ["1.50","400","1.00"],
    [true,true,true,false],
  ),
  createRoute(
    ["route-video","video_generation","model-runway-video"],
    ["model-flux-image"],
    [false,true,false,0,1200],
    ["8.00","700","3.00"],
    [true,true,true,false],
  ),
  createRoute(
    ["route-risk","risk_review","model-claude-reviewer"],
    ["model-gpt-analysis"],
    [false,true,true,1,90],
    ["0.40","200","1.00"],
    [true,true,true,true],
  ),
  createRoute(
    ["route-analytics","ai_recommendations","model-gpt-analysis"],
    ["model-store-reader"],
    [false,true,true,1,60],
    ["0.30","180","1.00"],
    [true,true,true,true],
  ),
];

export const WORKFLOW_USAGE_SEED = [
  {
    taskType: "store_reading",
    workflow: "Store Intelligence",
    workflowId: "store_intelligence",
    steps: ["analyze_store_brand"],
    source: "Store Setup",
  },
  {
    taskType: "product_extraction",
    workflow: "Store Intelligence",
    workflowId: "store_intelligence",
    steps: ["extract_products"],
    source: "Store Setup",
  },
  {
    taskType: "campaign_strategy",
    workflow: "Campaign Generation",
    workflowId: "campaign_generation",
    steps: ["build_campaign_strategy"],
    source: "Campaign Wizard",
  },
  {
    taskType: "ad_copy_generation",
    workflow: "Campaign Generation",
    workflowId: "campaign_generation",
    steps: ["generate_content_plan"],
    source: "Campaign Wizard",
  },
  {
    taskType: "content_rewrite",
    workflow: "Content Regeneration",
    workflowId: "content_generation",
    steps: ["rewrite_content"],
    source: "Content Studio",
  },
  {
    taskType: "video_script_generation",
    workflow: "Video Generation",
    workflowId: "video_generation",
    steps: ["write_customer_video_brief", "write_internal_video_prompt"],
    source: "Content Studio",
  },
  {
    taskType: "video_generation",
    workflow: "Video Generation",
    workflowId: "video_generation",
    steps: ["generate_video_asset"],
    source: "Content Studio",
  },
  {
    taskType: "risk_review",
    workflow: "Video Generation",
    workflowId: "video_generation",
    steps: ["review_video_prompt"],
    source: "Review Gate",
  },
];

export const STATUS_META = {
  active: ["نشط", "green"],
  testing: ["تجريبي", "amber"],
  disabled: ["معطل", "slate"],
  deprecated: ["Deprecated", "red"],
  ready: ["جاهز", "green"],
  warning: ["يحتاج ضبط", "amber"],
  blocked: ["محظور", "red"],
};

export const TABS = [
  ["models", "النماذج المتاحة"],
  ["routes", "توجيه المهام"],
  ["fallback", "سلاسل fallback"],
  ["cost", "التكلفة والحدود"],
  ["test", "الاختبار والسجل"],
];
