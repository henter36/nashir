function makeStep(id, name, inputFrom, processorType, processor, outputKey, outputType, destination, visibility, reviewRequired = false, feedsNextWorkflow = false, nextWorkflowType = "") {
  return { id, name, inputFrom, processorType, processor, outputKey, outputType, destination, visibility, reviewRequired, feedsNextWorkflow, nextWorkflowType };
}

export const WORKFLOW_TEMPLATES = [
  {
    id: "store_intelligence",
    name: "Store Intelligence",
    description: "فحص رابط المتجر ثم استخراج المنتجات والأصول وتحليل العلامة.",
    triggerScreen: "store_setup",
    triggerAction: "فحص المتجر",
    inputSources: ["store_url", "workspace_id", "language_hint"],
    outputsTo: ["store_profile", "product_catalog", "asset_library", "data_sources"],
    steps: [
      makeStep("crawl_store_pages", "زحف صفحات المتجر",
        ["store_url"], "tool_call", "store_crawler", "store_raw_snapshot", "raw_store_snapshot", "workflow_runs", "admin_only"),
      makeStep("extract_products", "استخراج المنتجات",
        ["store_raw_snapshot"], "model_call", "product_extraction", "product_candidates", "product_candidates", "product_catalog", "reviewer_only", true, true, "campaign_generation"),
      makeStep("detect_assets", "رصد الأصول والصور",
        ["store_raw_snapshot"], "tool_call", "asset_detector", "asset_candidates", "asset_candidates", "asset_library", "reviewer_only", true),
      makeStep("analyze_store_brand", "تحليل هوية المتجر",
        ["store_raw_snapshot", "product_candidates"], "model_call", "store_reading", "brand_insights", "brand_insights", "store_setup", "customer_visible", true, true, "campaign_generation"),
    ],
  },
  {
    id: "campaign_generation",
    name: "Campaign Generation",
    description: "تحويل Brief الحملة إلى استراتيجية ومخرجات أولية.",
    triggerScreen: "campaign_intake",
    triggerAction: "توليد الحملة",
    inputSources: ["campaign_brief", "store_context", "product_context", "asset_context", "governance_context"],
    outputsTo: ["campaign_detail", "content_studio", "review"],
    steps: [
      makeStep("validate_campaign_brief", "فحص اكتمال الـ Brief",
        ["campaign_brief", "product_context"], "policy_check", "brief_validation", "brief_validation_report", "risk_report", "review", "reviewer_only"),
      makeStep("build_campaign_strategy", "بناء استراتيجية الحملة",
        ["campaign_brief", "brand_insights", "product_candidates"], "model_call", "campaign_strategy", "campaign_strategy", "campaign_strategy", "campaign_detail", "customer_visible", true, true, "content_generation"),
      makeStep("generate_content_plan", "تجهيز خطة المخرجات",
        ["campaign_strategy", "selected_channels"], "model_call", "ad_copy_generation", "content_plan", "content_draft", "content_studio", "customer_visible", true, true, "risk_review"),
    ],
  },
  {
    id: "product_analysis",
    name: "تحليل المنتجات",
    description: "مسار واجهي فقط يوضح عقد تحليل المنتج دون تنفيذ أدوات أو نماذج.",
    trigger: {
      type: "manual",
      startCondition: "required_data_complete",
      eventSource: "product_catalog",
      description: "تشغيل يدوي، عند إضافة منتج، عند تحديث منتج، أو عند وصول بيانات أداء جديدة.",
    },
    triggerScreen: "product_catalog",
    triggerAction: "تحليل المنتج",
    inputSources: ["product_context", "asset_context", "analytics_metrics"],
    outputsTo: ["product_catalog", "campaign_detail", "content_studio"],
    steps: [
      {
        id: "collect_product_context",
        name: "تجميع بيانات المنتج",
        inputRefs: [
          { domain: "product_catalog", field: "product_name" },
          { domain: "product_catalog", field: "category" },
          { domain: "product_catalog", field: "price" },
          { domain: "product_catalog", field: "product_description" },
          { domain: "product_catalog", field: "product_media" },
          { domain: "asset_library", field: "linked_assets" },
          { domain: "data_sources", field: "performance_metrics" },
        ],
        processorType: "tool_call",
        processor: "product_context_loader",
        outputKey: "product_analysis_context",
        outputType: "product_analysis_summary",
        destination: "workflow_runs",
        visibility: "reviewer_only",
        reviewRequired: false,
        feedsNextWorkflow: false,
        nextWorkflowType: "",
        outputName: "سياق تحليل المنتج",
        outputFormat: "json",
        outputDestination: "تشغيلات النظام",
        outputVisibility: "reviewer_only",
        outputReviewRequired: false,
        outputReusable: true,
      },
      {
        id: "evaluate_product_readiness",
        name: "مطالبة تحليل المنتج",
        inputRefs: [
          { domain: "product_catalog", field: "product_name" },
          { domain: "product_catalog", field: "category" },
          { domain: "product_catalog", field: "price" },
          { domain: "product_catalog", field: "product_description" },
          { domain: "asset_library", field: "linked_assets" },
        ],
        processorType: "model_call",
        processor: "product_analysis",
        outputKey: "product_readiness_report",
        outputType: "product_analysis_summary",
        destination: "product_catalog",
        visibility: "customer_visible",
        reviewRequired: true,
        feedsNextWorkflow: true,
        nextWorkflowType: "campaign_generation",
        outputName: "ملخص تحليل المنتج",
        outputFormat: "preview_card",
        outputDestination: "كتالوج المنتجات",
        outputVisibility: "customer_visible",
        outputReviewRequired: true,
        outputReusable: true,
        nextRouteEnabled: true,
        nextRoute: "campaign_generation",
        nextStep: "build_campaign_strategy",
        transitionCondition: "after_review",
        nextRouteInputs: ["product_analysis_summary", "product_context"],
      },
      {
        id: "publish_product_analysis_summary",
        name: "إرسال ملخص التحليل",
        inputRefs: [
          { domain: "manual", field: "previous_outputs" },
        ],
        processorType: "data_transform",
        processor: "product_analysis",
        outputKey: "campaign_recommendations",
        outputType: "product_campaign_suggestions",
        destination: "content_studio",
        visibility: "customer_visible",
        reviewRequired: true,
        feedsNextWorkflow: true,
        nextWorkflowType: "content_generation",
        outputName: "اقتراحات الحملات",
        outputFormat: "list",
        outputDestination: "استوديو المحتوى",
        outputVisibility: "customer_visible",
        outputReviewRequired: true,
        outputReusable: true,
      },
    ],
  },
  {
    id: "content_generation",
    name: "Content Regeneration",
    description: "إعادة توليد محتوى محدد من Content Studio.",
    triggerScreen: "content_studio",
    triggerAction: "إعادة توليد",
    inputSources: ["content_id", "campaign_brief", "selected_assets", "output_type"],
    outputsTo: ["content_studio", "review"],
    steps: [
      makeStep("load_content_context", "تحميل سياق المحتوى",
        ["content_id", "campaign_brief"], "tool_call", "content_context_loader", "content_context", "raw_store_snapshot", "workflow_runs", "admin_only"),
      makeStep("rewrite_content", "إعادة صياغة المحتوى",
        ["content_context", "brand_insights"], "model_call", "content_rewrite", "content_draft", "content_draft", "content_studio", "customer_visible", true, true, "risk_review"),
    ],
  },
  {
    id: "video_generation",
    name: "Video Generation",
    description: "سيناريو ظاهر للعميل، مطالبة داخلية، مراجعة مخاطر، ثم توليد فيديو.",
    triggerScreen: "content_studio",
    triggerAction: "توليد فيديو",
    inputSources: ["campaign_brief", "product_context", "approved_assets", "channel_specs", "governance_context"],
    outputsTo: ["content_studio", "asset_library", "review", "workflow_runs"],
    steps: [
      makeStep("write_customer_video_brief", "كتابة شرح الفيديو للعميل",
        ["campaign_brief", "product_context"], "model_call", "video_script_generation", "customer_video_brief", "customer_visible_brief", "content_studio", "customer_visible", true),
      makeStep("write_internal_video_prompt", "كتابة مطالبة الفيديو الداخلية",
        ["customer_video_brief", "approved_assets", "brand_rules"], "model_call", "video_script_generation", "internal_video_prompt", "internal_prompt", "workflow_runs", "internal_only", true),
      makeStep("review_video_prompt", "مراجعة المخاطر والادعاءات",
        ["internal_video_prompt", "customer_video_brief", "approved_assets"], "model_call", "risk_review", "risk_clearance", "risk_report", "review", "reviewer_only", true),
      makeStep("generate_video_asset", "إرسال إلى نموذج الفيديو",
        ["risk_clearance", "internal_video_prompt", "approved_assets"], "model_call", "video_generation", "generated_video_asset", "generated_asset", "asset_library", "reviewer_only", true, true, "publishing"),
    ],
  },
];

export const PROCESSOR_TYPES = [
  ["tool_call", "استدعاء أداة"],
  ["model_call", "استدعاء نموذج"],
  ["human_review", "مراجعة بشرية"],
  ["asset_check", "فحص أصول"],
  ["cost_check", "فحص تكلفة"],
  ["policy_check", "فحص سياسة"],
  ["data_transform", "تحويل بيانات"],
];

export const PROCESSORS = [
  ["store_crawler", "Store Crawler"],
  ["social_analyzer", "Social Analyzer"],
  ["product_extraction", "Product Extraction"],
  ["product_analysis", "تحليل المنتج"],
  ["product_context_loader", "تحميل سياق المنتج"],
  ["asset_detector", "Asset Detector"],
  ["store_reading", "Store Reading Model"],
  ["campaign_strategy", "Campaign Strategy Model"],
  ["ad_copy_generation", "Ad Copy Model"],
  ["content_rewrite", "Content Rewrite Model"],
  ["video_script_generation", "Video Script Model"],
  ["image_generation", "Image Generation Model"],
  ["video_generation", "Video Generation Model"],
  ["risk_review", "Risk Review Model"],
  ["analytics_summary", "Analytics Summary Model"],
  ["ai_recommendations", "AI Recommendations Model"],
  ["brief_validation", "Brief Validation"],
  ["content_context_loader", "Content Context Loader"],
];

export const VISIBILITY = [
  ["customer_visible", "ظاهر للعميل"],
  ["internal_only", "داخلي فقط"],
  ["reviewer_only", "للمراجع فقط"],
  ["admin_only", "للمدير فقط"],
];

export const NEXT_WORKFLOWS = [
  ["", "لا يفتح مسارًا آخر"],
  ["store_intelligence", "Store Intelligence"],
  ["campaign_generation", "Campaign Generation"],
  ["content_generation", "Content Generation"],
  ["image_generation", "Image Generation"],
  ["video_generation", "Video Generation"],
  ["risk_review", "Risk Review"],
  ["publishing", "Publishing"],
  ["analytics_recommendation", "Analytics Recommendation"],
];

export const STRUCTURED_INPUT_SOURCES = [
  {
    value: "store_setup",
    label: "إعداد المتجر",
    fields: ["store_name", "store_category", "channels", "audience", "offer", "data_source"],
  },
  {
    value: "product_catalog",
    label: "كتالوج المنتجات",
    fields: ["product_name", "category", "price", "product_description", "product_media"],
  },
  {
    value: "asset_library",
    label: "مكتبة الأصول",
    fields: ["selected_assets", "linked_assets", "asset_usage", "review_notes"],
  },
  {
    value: "campaign_wizard",
    label: "معالج الحملة",
    fields: ["audience", "offer", "channels", "cta", "selected_assets"],
  },
  {
    value: "content_studio",
    label: "استوديو المحتوى",
    fields: ["campaign_content", "cta", "previous_outputs"],
  },
  {
    value: "data_sources",
    label: "مصادر البيانات",
    fields: ["data_source", "performance_metrics", "channels"],
  },
  {
    value: "review_preview",
    label: "المراجعة والمعاينة",
    fields: ["review_notes", "campaign_content", "previous_outputs"],
  },
  {
    value: "analytics",
    label: "التحليلات",
    fields: ["performance_metrics", "channels", "previous_outputs"],
  },
  {
    value: "manual",
    label: "إدخال يدوي",
    fields: ["manual_notes", "audience", "offer", "cta"],
  },
];

export const INPUT_FIELD_OPTIONS = [
  ["product_name", "اسم المنتج"],
  ["category", "التصنيف"],
  ["price", "السعر"],
  ["product_description", "وصف المنتج"],
  ["product_media", "وسائط المنتج"],
  ["linked_assets", "الأصول المرتبطة"],
  ["selected_assets", "الأصول المختارة"],
  ["channels", "القنوات"],
  ["audience", "الجمهور"],
  ["offer", "العرض"],
  ["cta", "دعوة الإجراء"],
  ["data_source", "مصدر البيانات"],
  ["performance_metrics", "مؤشرات الأداء"],
  ["review_notes", "ملاحظات المراجعة"],
  ["campaign_content", "محتوى الحملة"],
  ["previous_outputs", "المخرجات السابقة"],
  ["store_name", "اسم المتجر"],
  ["store_category", "تصنيف المتجر"],
  ["asset_usage", "استخدام الأصل"],
  ["manual_notes", "ملاحظات يدوية"],
  ["store_url", "رابط المتجر"],
  ["workspace_id", "مساحة العمل"],
  ["language_hint", "تلميح اللغة"],
  ["social_account", "الحساب الاجتماعي"],
  ["campaign_brief", "ملخص الحملة"],
  ["store_context", "سياق المتجر"],
  ["product_context", "سياق المنتج"],
  ["product_analysis_summary", "ملخص تحليل المنتج"],
  ["product_campaign_suggestions", "اقتراحات الحملات"],
  ["product_candidates", "منتجات مرشحة"],
  ["asset_context", "سياق الأصول"],
  ["approved_assets", "أصول تمت مراجعتها"],
  ["channel_specs", "مواصفات القناة"],
  ["governance_context", "سياق الحوكمة"],
  ["analytics_metrics", "مؤشرات التحليلات"],
  ["content_id", "مرجع المحتوى"],
  ["manual_input", "إدخال يدوي"],
  ["previous_step_output", "مخرج الخطوة السابقة"],
  ["brand_insights", "إشارات العلامة"],
  ["selected_channels", "القنوات المختارة"],
  ["content_context", "سياق المحتوى"],
  ["customer_video_brief", "شرح فيديو للعميل"],
  ["internal_video_prompt", "مطالبة داخلية محجوبة"],
  ["risk_clearance", "نتيجة مراجعة المخاطر"],
  ["brand_rules", "قواعد العلامة"],
];

export const OUTPUT_TYPE_OPTIONS = [
  ["content_draft", "نص حملة"],
  ["generated_asset", "أصل بصري"],
  ["customer_visible_brief", "سيناريو فيديو"],
  ["analytics_recommendation", "ملخص تحليلي"],
  ["campaign_strategy", "توصية"],
  ["brand_insights", "بيانات منظمة"],
  ["product_candidates", "قائمة مهام"],
  ["product_analysis_summary", "ملخص تحليل المنتج"],
  ["product_campaign_suggestions", "اقتراحات الحملات"],
  ["risk_report", "قرار مراجعة"],
  ["asset_candidates", "أصول مرشحة"],
  ["raw_store_snapshot", "لقطة بيانات"],
  ["audience_insights", "تحليل جمهور"],
  ["internal_prompt", "مخرج داخلي محجوب"],
  ["publishing_item", "عنصر جاهزية نشر"],
];

export const OUTPUT_FORMATS = [
  ["text", "نص"],
  ["json", "JSON"],
  ["preview_card", "بطاقة معاينة"],
  ["image", "صورة"],
  ["video", "فيديو"],
  ["table", "جدول"],
  ["list", "قائمة"],
];

export const DESTINATION_OPTIONS = [
  ["store_setup", "إعداد المتجر"],
  ["store_profile", "ملف المتجر"],
  ["data_sources", "مصادر البيانات"],
  ["product_catalog", "كتالوج المنتجات"],
  ["asset_library", "مكتبة الأصول"],
  ["campaign_detail", "تفاصيل الحملة"],
  ["content_studio", "استوديو المحتوى"],
  ["review", "المراجعة والمعاينة"],
  ["publishing_queue", "جاهزية النشر"],
  ["analytics", "التحليلات"],
  ["workflow_runs", "تشغيلات النظام"],
  ["audit_log", "سجل المراجعة"],
];

export const TRANSITION_CONDITIONS = [
  ["always", "دائمًا"],
  ["after_review", "بعد المراجعة"],
  ["no_warnings", "عند عدم وجود تحذيرات"],
  ["user_approved", "عند اعتماد المستخدم"],
  ["valid_output", "عند وجود مخرج صالح"],
];

export const TRIGGER_TYPES = [
  ["manual", "تشغيل يدوي"],
  ["campaign_created", "عند إنشاء حملة"],
  ["content_approved", "عند اعتماد محتوى"],
  ["new_data_arrived", "عند وصول بيانات جديدة"],
  ["previous_workflow_completed", "عند اكتمال مسار سابق"],
  ["publish_scheduled", "عند جدولة نشر"],
  ["performance_threshold", "عند تجاوز مؤشر أداء"],
  ["review_requested", "عند طلب مراجعة"],
];

export const START_CONDITIONS = [
  ["manual_always", "دائمًا عند التشغيل اليدوي"],
  ["required_data_complete", "عند اكتمال البيانات المطلوبة"],
  ["user_approved", "بعد اعتماد المستخدم"],
  ["valid_previous_output", "عند وجود مخرج صالح من مسار سابق"],
  ["data_source_event", "عند وصول حدث من مصدر بيانات"],
  ["performance_limit", "عند تجاوز حد أداء"],
];

export const EVENT_SOURCES = [
  ["manual", "إدخال يدوي"],
  ["store_setup", "إعداد المتجر"],
  ["campaign_wizard", "معالج الحملة"],
  ["content_studio", "استوديو المحتوى"],
  ["review_preview", "المراجعة والمعاينة"],
  ["data_sources", "مصادر البيانات"],
  ["analytics", "التحليلات"],
  ["previous_workflow", "مسار سابق"],
];

export const TRIGGER_START_WHEN_OPTIONS = [
  ["required_data_complete", "عند اكتمال البيانات المطلوبة"],
  ["always", "دائمًا عند التشغيل"],
  ["after_previous_approved", "بعد اعتماد المسار السابق"],
  ["new_event_received", "عند وصول حدث جديد"],
  ["manual_by_user", "عند تشغيل يدوي بواسطة المستخدم"],
  ["performance_threshold_exceeded", "عند تجاوز مؤشر الأداء"],
  ["campaign_status_changed", "عند تغيير حالة الحملة"],
  ["scheduled_time", "في وقت مجدول"],
];

export const TRIGGER_UPDATE_POLICIES = [
  ["", "لا توجد سياسة تحديث محددة"],
  ["replace_previous_output", "استبدال المخرج السابق"],
  ["append_to_previous", "إضافة إلى المخرج السابق"],
  ["create_new_version", "إنشاء نسخة جديدة"],
  ["merge_with_existing", "دمج مع البيانات القائمة"],
  ["skip_if_unchanged", "تخطي إذا لم تتغير البيانات"],
];

export const DESTINATION_FIELD_MAP = {
  store_setup: [
    ["store_name", "اسم المتجر"],
    ["store_category", "تصنيف المتجر"],
    ["channels", "القنوات"],
    ["audience", "الجمهور"],
    ["offer", "العرض"],
  ],
  store_profile: [
    ["store_description", "وصف المتجر"],
    ["brand_voice", "نبرة العلامة"],
    ["competitor_analysis", "تحليل المنافسين"],
  ],
  data_sources: [
    ["data_source", "مصدر البيانات"],
    ["performance_metrics", "مؤشرات الأداء"],
    ["analytics_metrics", "مؤشرات التحليلات"],
  ],
  product_catalog: [
    ["product_name", "اسم المنتج"],
    ["product_description", "وصف المنتج"],
    ["product_media", "وسائط المنتج"],
    ["category", "التصنيف"],
    ["price", "السعر"],
  ],
  asset_library: [
    ["selected_assets", "الأصول المختارة"],
    ["linked_assets", "الأصول المرتبطة"],
    ["asset_usage", "استخدام الأصل"],
  ],
  campaign_detail: [
    ["campaign_brief", "ملخص الحملة"],
    ["audience", "الجمهور المستهدف"],
    ["channels", "القنوات"],
    ["cta", "دعوة الإجراء"],
    ["offer", "العرض"],
  ],
  content_studio: [
    ["campaign_content", "محتوى الحملة"],
    ["content_draft", "مسودة المحتوى"],
    ["previous_outputs", "المخرجات السابقة"],
    ["cta", "دعوة الإجراء"],
  ],
  review: [
    ["review_notes", "ملاحظات المراجعة"],
    ["campaign_content", "محتوى الحملة"],
    ["previous_outputs", "المخرجات السابقة"],
  ],
  publishing_queue: [
    ["publishing_item", "عنصر جاهزية النشر"],
    ["scheduled_date", "تاريخ الجدولة"],
    ["channel_specs", "مواصفات القناة"],
  ],
  analytics: [
    ["performance_metrics", "مؤشرات الأداء"],
    ["analytics_metrics", "مؤشرات التحليلات"],
    ["previous_outputs", "المخرجات السابقة"],
  ],
  workflow_runs: [
    ["run_result", "نتيجة التشغيل"],
    ["run_log", "سجل التشغيل"],
  ],
  audit_log: [
    ["audit_entry", "سجل المراجعة"],
    ["risk_report", "تقرير المخاطر"],
  ],
};

export const TABS = [
  ["builder", "مصمم مسارات التشغيل"],
  ["map", "خريطة تدفق البيانات"],
  ["contracts", "ضوابط المخرجات"],
  ["runs", "مراقبة التشغيلات"],
  ["test", "اختبار المسار"],
];

function makeRoute(taskLabel, primaryModel, fallback, maxCostPerRun, approvalAbove) {
  return { taskLabel, primaryModel, fallback, maxCostPerRun, approvalAbove, humanReviewRequired: true, blockAutoPublish: true, status: "linked" };
}

export const MODEL_ROUTE_CATALOG = {
  store_reading: makeRoute("قراءة المتجر وتحليل صفحاته", "Gemini Store Reader", ["GPT Analysis"], "0.35", "1.00"),
  product_extraction: makeRoute("استخراج المنتجات والتصنيفات", "Gemini Store Reader", ["GPT Analysis"], "0.20", "0.75"),
  product_analysis: makeRoute("تحليل المنتج", "GPT Analysis", ["Gemini Store Reader"], "0.30", "1.00"),
  campaign_strategy: makeRoute("تحليل وتخطيط الحملة", "GPT Analysis", ["Claude Risk Reviewer"], "0.50", "1.50"),
  ad_copy_generation: makeRoute("توليد النصوص الإعلانية", "GPT Campaign Writer", ["Claude Risk Reviewer"], "0.25", "1.00"),
  content_rewrite: makeRoute("إعادة صياغة المحتوى", "GPT Campaign Writer", ["Claude Risk Reviewer"], "0.25", "1.00"),
  video_script_generation: makeRoute("كتابة سكربت الفيديو", "GPT Campaign Writer", ["Claude Risk Reviewer"], "0.40", "1.00"),
  video_generation: makeRoute("توليد الفيديو", "Runway Video", ["Flux Image"], "8.00", "3.00"),
  risk_review: makeRoute("مراجعة المخاطر والادعاءات", "Claude Risk Reviewer", ["GPT Analysis"], "0.40", "1.00"),
  image_generation: makeRoute("توليد الصور", "Flux Image", ["Gemini Store Reader"], "1.50", "1.00"),
  ai_recommendations: makeRoute("توصيات التحسين", "GPT Analysis", ["Gemini Store Reader"], "0.30", "1.00"),
};

function makeRun(id, workflowType, title, status, currentStep, modelUsed, cost, duration, owner, source, createdAt, inputSummary, outputSummary, warnings, error, steps) {
  return { id, workflowType, title, status, currentStep, modelUsed, cost, duration, owner, source, createdAt, inputSummary, outputSummary, warnings, error, steps };
}

export const RUNS = [
  makeRun("wf-001", "store_intelligence", "فحص متجر النمو", "completed", "user_review",
    "Gemini Store Reader", 0.18, "38s", "System", "Store Setup", "منذ 12 دقيقة",
    "store_url + workspace_id + language_hint", "store_profile + product_catalog + asset_library",
    ["حقوق بعض الصور تحتاج مراجعة", "تم إخفاء أي بيانات حساسة من العرض"], "",
    [["queued", "إدخال المهمة للطابور", "0s", "completed"],
     ["crawl_store_pages", "زحف صفحات المتجر", "6s", "completed"],
     ["extract_products", "استخراج المنتجات", "14s", "completed"],
     ["detect_assets", "رصد الأصول والصور", "9s", "completed"],
     ["user_review", "بوابة مراجعة بشرية", "9s", "waiting_for_review"]]),
  makeRun("wf-002", "campaign_generation", "توليد حملة عطر X", "running", "content_plan",
    "GPT Campaign Writer", 0.32, "1m 12s", "أحمد", "Campaign Wizard", "منذ 6 دقائق",
    "campaign_brief + selected_products + channels + cta", "قيد توليد content_plan وchannel_variants",
    [], "",
    [["queued", "إدخال المهمة للطابور", "0s", "completed"],
     ["build_prompt", "بناء Prompt داخلي", "8s", "completed"],
     ["content_plan", "بناء خطة المحتوى", "55s", "running"],
     ["risk_review", "مراجعة المخاطر", "—", "waiting_for_review"]]),
  makeRun("wf-003", "video_generation", "فيديو Reel قصير", "waiting_for_review", "risk_review",
    "Runway Video", 3.7, "2m 40s", "محمد", "Content Studio", "منذ 22 دقيقة",
    "video_script + product_image + duration=15s", "video_draft يحتاج مراجعة قبل الجدولة",
    ["تكلفة التشغيل مرتفعة", "النشر التلقائي غير مسموح"], "",
    [["queued", "إدخال المهمة للطابور", "0s", "completed"],
     ["validate_assets", "فحص الأصول", "10s", "completed"],
     ["submit_video_job", "إرسال طلب التوليد", "38s", "completed"],
     ["risk_review", "مراجعة المخاطر", "1m 52s", "waiting_for_review"]]),
  makeRun("wf-004", "asset_analysis", "تحليل أصول حملة العيد", "failed", "rights_review",
    "Gemini Store Reader", 0.22, "44s", "System", "Asset Library", "منذ 45 دقيقة",
    "4 images + brand_logo + product_description", "فشل بسبب أصل يحتاج مراجعة حقوق",
    ["صورة تحتوي شخصًا واضحًا وقد تحتاج موافقة"], "ASSET_RIGHTS_REVIEW_REQUIRED",
    [["queued", "إدخال المهمة للطابور", "0s", "completed"],
     ["detect_dimensions", "قراءة المقاسات", "9s", "completed"],
     ["quality_check", "فحص الجودة", "16s", "completed"],
     ["rights_review", "مراجعة حقوق الاستخدام", "19s", "failed"]]),
];

export const STATUS_META = {
  running: ["قيد التشغيل", "blue"],
  waiting_for_review: ["بانتظار مراجعة", "amber"],
  completed: ["مكتمل", "green"],
  failed: ["فشل", "red"],
  cancelled: ["ملغي", "slate"],
};

function makePipeline(name, status, input, output, layer, tool, blocked, warnings) {
  return { name, status, input, output, layer, tool, blocked, warnings };
}

export const DATA_PROCESSING_PIPELINE = [
  makePipeline("تحديد مصدر البيانات", "جاهز للتصميم", "نوع المتجر وقناة البيع الأساسية", "خطة جمع البيانات", "إعداد المتجر", "اختيار واجهي", "لا يوجد حظر في النموذج الأولي", "تحتاج مراجعة قبل التنفيذ الحقيقي"),
  makePipeline("تشغيل الموصل", "غير منفذ", "إعداد الموصل ومرجع السر", "تشغيل مجدول أو يدوي لاحقًا", "Data Sources Hub", "Official API / Firecrawl / Browserless / Apify", "Backend مطلوب", "لا توجد موصلات نشطة من الواجهة"),
  makePipeline("حفظ البيانات الخام", "غير منفذ", "نتيجة الموصل", "Raw Payload", "طبقة التخزين لاحقًا", "Queue + Storage", "لا يوجد تخزين إنتاجي", "يلزم تحديد سياسة الاحتفاظ"),
  makePipeline("تطبيع البيانات", "جاهز للتصميم", "Raw Payload", "Normalized Signals", "Processing Pipeline", "Rule engine + classifiers", "لا يوجد Backend للمعالجة", "الخرائط الحالية واجهية فقط"),
  makePipeline("بناء حزمة أدلة للتحليل", "جاهز للتصميم", "البيانات المنظمة", "Evidence Pack", "AI preparation", "Evidence builder", "لا يوجد إنشاء حقيقي للحزمة", "يجب فصل الحقائق عن الاستنتاجات"),
  makePipeline("إرسال مهمة الذكاء الاصطناعي", "غير منفذ", "Evidence Pack + مخطط الإخراج", "Structured AI result", "AI orchestration", "Model Route + Prompt Governance", "لا يوجد استدعاء نموذج حقيقي", "تحتاج مطالبة معتمدة وحد تكلفة"),
  makePipeline("مراجعة المخرجات", "مطلوبة", "Structured AI result", "ReviewFinding", "Review Preview", "Human review", "لا يعتمد أي مخرج ظاهر دون مراجعة", "النشر التلقائي غير مسموح"),
  makePipeline("إعادة استخدام النتائج", "جاهز للتصميم", "مخرجات معتمدة", "Strategy / Brief / Readiness", "Commercial journey", "Shared contracts", "لا يوجد حفظ إنتاجي", "إعادة الاستخدام يجب أن تحفظ المصدر والقيود"),
];

export const PROCESSING_READINESS_CHECKS = [
  ["نوع المتجر محدد", "مخطط من إعداد المتجر"],
  ["خطة جمع البيانات موجودة", "متوفرة كتصميم واجهي"],
  ["الموصل مهيأ", "مهيأ فقط"],
  ["مرجع السر موجود", "اسم مرجع لاحقًا فقط"],
  ["Backend مطلوب", "نعم"],
  ["مخطط المخرجات محدد", "محدد كعقد واجهي"],
  ["مراجعة بشرية مطلوبة", "نعم"],
  ["النشر التلقائي غير مسموح", "نعم"],
];

export const EVIDENCE_PACK_ITEMS = [
  "ملخص المتجر",
  "المنتجات",
  "الأصول",
  "القنوات",
  "السياسات",
  "إشارات اجتماعية عند توفر موصل مصرح",
  "حدود البيانات",
  "مستوى الثقة",
  "نوع المهمة",
  "مخطط الإخراج",
];

export const REUSABLE_OUTPUTS = [
  ["StoreStrategicPlan", "إعداد المتجر، Dashboard، معالج الحملة"],
  ["SocialStoreIntelligenceReport", "إعداد المتجر، Dashboard، معالج الحملة، استوديو المحتوى"],
  ["ProductMarketingPriority", "كتالوج المنتجات، معالج الحملة"],
  ["AssetGapReport", "مكتبة الأصول، استوديو المحتوى"],
  ["CampaignBrief", "معالج الحملة، استوديو المحتوى"],
  ["CampaignContentOutput", "استوديو المحتوى، المراجعة والمعاينة"],
  ["ReviewFinding", "المراجعة والمعاينة، جدولة النشر"],
  ["PublishingReadiness", "جدولة النشر، Dashboard"],
];
