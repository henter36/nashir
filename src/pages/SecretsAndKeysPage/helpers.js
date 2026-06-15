import {
  DEFAULT_CAPABILITIES,
  DEFAULT_OPERATIONAL_SUPPORT,
  PROVIDER_PRESETS,
  ROUTING_COMPAT_MODEL_FIELD,
} from "./constants.js";

export function createProviderFromPreset(type, override = {}) {
  const preset = PROVIDER_PRESETS[type] || PROVIDER_PRESETS.custom;
  const legacyCapabilities = preset.capabilities || {};
  const capabilities = {
    ...DEFAULT_CAPABILITIES,
    textGeneration: Boolean(legacyCapabilities.textGeneration),
    structuredOutput: Boolean(legacyCapabilities.structuredOutput),
    visionInput: Boolean(legacyCapabilities.visionInput || legacyCapabilities.vision),
    imageGeneration: Boolean(legacyCapabilities.imageGeneration),
    videoGeneration: Boolean(legacyCapabilities.videoGeneration),
    embeddings: Boolean(legacyCapabilities.embeddings),
    toolCalling: Boolean(legacyCapabilities.toolCalling || legacyCapabilities.functionCalling),
    streaming: Boolean(legacyCapabilities.streaming || legacyCapabilities.textGeneration),
    batch: Boolean(legacyCapabilities.batch),
    files: Boolean(legacyCapabilities.files),
    webhooks: Boolean(legacyCapabilities.webhooks || preset.webhooks?.enabled),
  };
  const operationalSupport = {
    ...DEFAULT_OPERATIONAL_SUPPORT,
    ...(preset.operationalSupport || {}),
    requestIdSupport: preset.operationalSupport?.requestIdSupport ?? true,
    rateLimitHeadersSupport: preset.operationalSupport?.rateLimitHeadersSupport ?? true,
    usageHeadersSupport: preset.operationalSupport?.usageHeadersSupport ?? Boolean(capabilities.textGeneration || capabilities.embeddings),
    tokenCountingSupport: preset.operationalSupport?.tokenCountingSupport ?? Boolean(capabilities.textGeneration || capabilities.embeddings),
  };

  return {
    id: `${type}-${Date.now()}`,
    providerType: preset.providerType,
    displayName: preset.displayName,
    category: preset.category,
    status: "draft",
    deliveryChannel: preset.deliveryChannel || (preset.providerType === "gemini" ? "cloud_platform" : "direct_api"),
    environment: preset.environment || "sandbox",
    authType: preset.providerType === "gemini" ? "workload_identity" : preset.authType,
    headerName: preset.headerName,
    tokenPrefix: preset.tokenPrefix,
    secretName: preset.secretName,
    baseUrl: preset.baseUrl,
    apiVersion: preset.apiVersion || "",
    organizationId: preset.organizationId || "",
    projectId: preset.projectId || preset.googleCloudProject || "",
    workspaceId: preset.workspaceId || "",
    serviceAccountRef: preset.serviceAccountRef || (preset.providerType === "gemini" ? "GCP_AI_SERVICE_ACCOUNT" : ""),
    googleCloudProject: preset.googleCloudProject || "",
    region: preset.region || "",
    location: preset.location || preset.region || "",
    deploymentName: preset.deploymentName || "",
    textModel: preset.textModel || "",
    imageModel: preset.imageModel || "",
    videoModel: preset.videoModel || "",
    embeddingModel: preset.embeddingModel || "",
    [ROUTING_COMPAT_MODEL_FIELD]: preset[ROUTING_COMPAT_MODEL_FIELD] || "",
    customHeaders: preset.customHeaders || "",
    capabilities,
    operationalSupport,
    limits: { ...preset.limits },
    governance: {
      humanReviewRequired: true,
      autoPublishAllowed: false,
      allowSensitiveContentGeneration: false,
      logAllRequests: true,
      redactInputs: true,
    },
    webhooks: {
      enabled: false,
      secretName: "",
      callbackUrl: "",
      eventTypes: "",
      lastDeliveryStatus: "",
      ...preset.webhooks,
    },
    metadata: {
      createdAt: "اليوم",
      updatedAt: "الآن",
      lastTestedAt: "",
      lastRotationAt: "",
      ownerRole: "System Admin",
    },
    requiredFields: [...preset.requiredFields],
    ...override,
  };
}

export const initialProviders = [
  createProviderFromPreset("openai", {
    id: "openai-main",
    displayName: "OpenAI - Production",
    environment: "production",
    status: "connected",
    metadata: {
      createdAt: "2026-05-01",
      updatedAt: "اليوم",
      lastTestedAt: "منذ ساعة",
      lastRotationAt: "قبل 12 يوم",
      ownerRole: "System Admin",
    },
  }),
  createProviderFromPreset("anthropic", {
    id: "anthropic-review",
    environment: "production",
    status: "missing_required_fields",
  }),
  createProviderFromPreset("replicate", {
    id: "replicate-images",
    displayName: "Replicate - Image/Video",
    environment: "production",
    status: "pending_test",
  }),
];

export function getReadinessLabel(status) {
  const labels = {
    ready: "جاهز",
    warning: "يحتاج ضبط",
    blocked: "محظور",
  };

  return labels[status] || "يحتاج ضبط";
}

export function getRequiredFieldLabel(field) {
  const labels = {
    secretName: "مرجع السر",
    baseUrl: "العنوان الأساسي",
    textModel: "نموذج النصوص",
    imageModel: "نموذج الصور",
    videoModel: "نموذج الفيديو",
    embeddingModel: "نموذج التضمين",
    webhookSecretName: "سر Webhook",
    apiVersion: "إصدار API",
    organizationId: "معرف المنظمة",
    projectId: "معرف المشروع",
    workspaceId: "معرف مساحة العمل",
    serviceAccountRef: "مرجع حساب الخدمة",
    region: "المنطقة",
    location: "الموقع",
    deploymentName: "اسم النشر",
    googleCloudProject: "معرف المشروع",
  };

  return labels[field] || field;
}

export function getOptionLabel(options, value) {
  return options.find(([id]) => id === value)?.[1] || value || "غير محدد";
}

export function normalizeCapabilities(capabilities = {}) {
  const safeCapabilities = capabilities || {};
  return {
    ...DEFAULT_CAPABILITIES,
    textGeneration: Boolean(safeCapabilities.textGeneration),
    structuredOutput: Boolean(safeCapabilities.structuredOutput),
    visionInput: Boolean(safeCapabilities.visionInput || safeCapabilities.vision),
    imageGeneration: Boolean(safeCapabilities.imageGeneration),
    videoGeneration: Boolean(safeCapabilities.videoGeneration),
    embeddings: Boolean(safeCapabilities.embeddings),
    toolCalling: Boolean(safeCapabilities.toolCalling || safeCapabilities.functionCalling),
    streaming: Boolean(safeCapabilities.streaming),
    batch: Boolean(safeCapabilities.batch),
    files: Boolean(safeCapabilities.files),
    webhooks: Boolean(safeCapabilities.webhooks),
  };
}

export function getCredentialScope(provider = {}) {
  const safeProvider = provider || {};
  const values = [
    safeProvider.organizationId ? "معرف المنظمة" : "",
    safeProvider.projectId || safeProvider.googleCloudProject ? "معرف المشروع" : "",
    safeProvider.workspaceId ? "معرف مساحة العمل" : "",
    safeProvider.serviceAccountRef ? "مرجع حساب الخدمة" : "",
  ].filter(Boolean);

  return values.length ? values.join("، ") : "غير محدد";
}

export function authRequiresSecret(authType) {
  return ["bearer_token", "api_key_header", "oauth_bearer", "custom_headers"].includes(authType);
}

export function isCloudStyleProvider(provider = {}) {
  const providerType = String(provider.providerType || "").toLowerCase();
  return ["google", "vertex", "gemini", "google_vertex"].includes(providerType);
}

export function getProviderContext(provider = {}) {
  const safeProvider = provider || {};
  const providerType = String(safeProvider.providerType || "").toLowerCase();
  const deliveryChannel = safeProvider.deliveryChannel || "";
  const authType = safeProvider.authType || "";

  return {
    providerType,
    deliveryChannel,
    authType,
    isOpenAiStyle: providerType.includes("openai") || deliveryChannel === "openai_compatible",
    isAnthropicStyle: providerType.includes("anthropic"),
    isCloudStyle:
      providerType.includes("google") ||
      providerType.includes("vertex") ||
      providerType.includes("gemini") ||
      deliveryChannel === "cloud_platform",
    isAzureStyle: providerType.includes("azure") || deliveryChannel === "openai_compatible",
    isGatewayProxy: deliveryChannel === "gateway" || deliveryChannel === "proxy",
    usesServiceAccount: authType === "service_account" || authType === "workload_identity",
  };
}

export function getAdvancedScopeFields(provider = {}) {
  const safeProvider = provider || {};
  const context = getProviderContext(safeProvider);
  const requiredFields = Array.isArray(safeProvider.requiredFields) ? safeProvider.requiredFields : [];
  const fields = [];
  const addField = (key, label, required = false, show = true) => {
    if (!show || fields.some((field) => field.key === key)) return;
    fields.push({
      key,
      label,
      required,
      helper: required ? "مطلوب لهذا النوع من المزود" : "اختياري",
    });
  };

  if (context.isOpenAiStyle) {
    addField("organizationId", "معرف المنظمة");
    addField("projectId", "معرف المشروع");
    addField("deploymentName", "اسم النشر", context.isAzureStyle, context.deliveryChannel === "openai_compatible" || Boolean(safeProvider.deploymentName));
    addField("apiVersion", "إصدار API", context.isAzureStyle, Boolean(safeProvider.apiVersion) || ["gateway", "openai_compatible"].includes(context.deliveryChannel));
  }

  if (context.isAnthropicStyle) {
    addField("apiVersion", "إصدار API", true);
    addField("workspaceId", "معرف مساحة العمل");
  }

  if (context.isCloudStyle) {
    addField("projectId", "معرف المشروع", true);
    addField("location", "الموقع", true);
    addField("region", "المنطقة");
    addField("serviceAccountRef", "مرجع حساب الخدمة", true, context.usesServiceAccount);
  }

  if (context.isAzureStyle) {
    addField("deploymentName", "اسم النشر", true);
    addField("apiVersion", "إصدار API", true);
    addField("region", "المنطقة");
  }

  if (context.isGatewayProxy) {
    addField("projectId", "معرف المشروع");
    addField("workspaceId", "معرف مساحة العمل");
    addField("apiVersion", "إصدار API", requiredFields.includes("apiVersion"), Boolean(safeProvider.apiVersion) || requiredFields.includes("apiVersion"));
    addField("deploymentName", "اسم النشر", false, Boolean(safeProvider.deploymentName));
  }

  if (context.usesServiceAccount) {
    addField("serviceAccountRef", "مرجع حساب الخدمة", true);
  }

  return fields;
}

export function getAvailableModelFields(provider = {}) {
  const safeProvider = provider || {};
  const capabilities = normalizeCapabilities(safeProvider.capabilities);
  const requiredFields = Array.isArray(safeProvider.requiredFields) ? safeProvider.requiredFields : [];
  const fields = [
    {
      key: "textModel",
      label: "نموذج النصوص",
      show: capabilities.textGeneration || requiredFields.includes("textModel") || Boolean(safeProvider.textModel),
      required: capabilities.textGeneration || requiredFields.includes("textModel"),
    },
    {
      key: "imageModel",
      label: "نموذج الصور",
      show: capabilities.imageGeneration || capabilities.visionInput || requiredFields.includes("imageModel") || Boolean(safeProvider.imageModel),
      required: capabilities.imageGeneration || requiredFields.includes("imageModel"),
    },
    {
      key: "videoModel",
      label: "نموذج الفيديو",
      show: capabilities.videoGeneration || requiredFields.includes("videoModel") || Boolean(safeProvider.videoModel),
      required: capabilities.videoGeneration || requiredFields.includes("videoModel"),
    },
    {
      key: "embeddingModel",
      label: "نموذج التضمين",
      show: capabilities.embeddings || requiredFields.includes("embeddingModel") || Boolean(safeProvider.embeddingModel),
      required: capabilities.embeddings || requiredFields.includes("embeddingModel"),
    },
  ];

  return fields.filter((field) => field.show);
}

export function getConfiguredModels(provider = {}) {
  const safeProvider = provider || {};
  return [
    safeProvider.textModel,
    safeProvider.imageModel,
    safeProvider.videoModel,
    safeProvider.embeddingModel,
    safeProvider[ROUTING_COMPAT_MODEL_FIELD],
  ].filter(Boolean);
}

export function buildProviderReadiness(provider) {
  const checks = [];
  const warnings = [];
  const blockedReasons = [];

  if (!provider) {
    return {
      status: "blocked",
      score: 0,
      checks: [],
      warnings: [],
      blockedReasons: ["لا يوجد مزود محدد."],
    };
  }

  const capabilities = normalizeCapabilities(provider.capabilities);
  const governance = provider.governance || {};
  const webhooks = provider.webhooks || {};
  const requiredFields = Array.isArray(provider.requiredFields) ? provider.requiredFields : [];
  const enabledCapabilities = Object.entries(capabilities).filter(([, enabled]) => Boolean(enabled));
  const configuredModels = getConfiguredModels(provider);

  checks.push("المزود موجود.");

  if (provider.providerType) checks.push("نوع المزود محدد.");
  else blockedReasons.push("نوع المزود غير محدد.");

  if (provider.deliveryChannel) checks.push("قناة الوصول محددة.");
  else blockedReasons.push("قناة الوصول غير محددة.");

  if (provider.environment) checks.push("البيئة محددة.");
  else blockedReasons.push("البيئة غير محددة.");

  if (provider.authType) checks.push("طريقة المصادقة محددة.");
  else blockedReasons.push("طريقة المصادقة غير محددة.");

  if (authRequiresSecret(provider.authType)) {
    if (String(provider.secretName || "").trim()) checks.push("مرجع السر محدد.");
    else blockedReasons.push("مرجع السر مطلوب.");
  } else {
    checks.push("طريقة المصادقة لا تتطلب مرجع سر مباشر.");
  }

  if (requiredFields.includes("baseUrl")) {
    if (String(provider.baseUrl || "").trim()) checks.push("العنوان الأساسي محدد.");
    else blockedReasons.push("العنوان الأساسي مطلوب.");
  } else if (!String(provider.baseUrl || "").trim()) {
    warnings.push("العنوان الأساسي غير محدد.");
  }

  if (requiredFields.includes("apiVersion")) {
    if (String(provider.apiVersion || "").trim()) checks.push("إصدار API محدد.");
    else blockedReasons.push("إصدار API مطلوب لهذا المزود.");
  }

  if (provider.deliveryChannel === "cloud_platform" && isCloudStyleProvider(provider)) {
    if (String(provider.projectId || provider.googleCloudProject || "").trim()) checks.push("معرف المشروع محدد.");
    else blockedReasons.push("معرف المشروع مطلوب لقناة المنصة السحابية.");

    if (String(provider.location || provider.region || "").trim()) checks.push("الموقع أو المنطقة محددة.");
    else blockedReasons.push("الموقع مطلوب لقناة المنصة السحابية.");
  }

  if (["service_account", "workload_identity"].includes(provider.authType)) {
    if (String(provider.serviceAccountRef || "").trim()) checks.push("مرجع حساب الخدمة محدد.");
    else blockedReasons.push("مرجع حساب الخدمة مطلوب لطريقة المصادقة الحالية.");
  }

  if (provider.providerType === "openai" && provider.environment === "production" && !String(provider.projectId || "").trim()) {
    warnings.push("يفضل تحديد معرف المشروع لمزود OpenAI في بيئة الإنتاج.");
  }

  if (provider.providerType === "anthropic" && provider.environment === "production" && !String(provider.workspaceId || "").trim()) {
    warnings.push("يفضل تحديد معرف مساحة العمل لمزود Anthropic في بيئة الإنتاج.");
  }

  const modelRequirements = [
    ["textModel", "textGeneration", "نموذج النصوص"],
    ["imageModel", "imageGeneration", "نموذج الصور"],
    ["videoModel", "videoGeneration", "نموذج الفيديو"],
    ["embeddingModel", "embeddings", "نموذج التضمين"],
  ];

  modelRequirements.forEach(([field, capability, label]) => {
    const required = requiredFields.includes(field) || capabilities[capability];
    if (!required) return;
    if (String(provider[field] || "").trim()) checks.push(`${label} مهيأ.`);
    else blockedReasons.push(`${label} مطلوب عند تفعيل القدرة المرتبطة.`);
  });

  if (configuredModels.length) checks.push("يوجد نموذج واحد مهيأ على الأقل.");
  else blockedReasons.push("يجب تهيئة نموذج واحد على الأقل لاستخدامه في التوجيه.");

  if (webhooks.enabled || requiredFields.includes("webhookSecretName")) {
    if (String(webhooks.secretName || "").trim()) checks.push("سر Webhook محدد.");
    else blockedReasons.push("سر Webhook مطلوب عند تفعيل Webhook.");
  }

  if (enabledCapabilities.length) checks.push("يوجد على الأقل قدرة مفعلة.");
  else blockedReasons.push("لا توجد قدرات مفعلة للمزود.");

  if (governance.autoPublishAllowed) {
    blockedReasons.push("النشر التلقائي غير آمن لهذا المزود.");
  } else {
    checks.push("النشر التلقائي غير مفعل.");
  }

  if (provider.metadata?.lastTestedAt) {
    checks.push("آخر اختبار موجود.");
  } else if (provider.environment === "production") {
    warnings.push("مزود الإنتاج يحتاج تسجيل اختبار قبل الاعتماد.");
  } else {
    warnings.push("لم يتم تسجيل آخر اختبار بعد.");
  }

  if (provider.status === "disabled") {
    blockedReasons.push("المزود معطل.");
  } else if (provider.status === "failed") {
    blockedReasons.push("آخر اختبار للمزود فشل.");
  } else if (provider.status === "pending_test" || provider.status === "draft") {
    warnings.push("المزود يحتاج اختبارًا أو استكمال ضبط.");
  } else if (provider.status === "missing_required_fields") {
    warnings.push("هناك حقول مطلوبة تحتاج استكمالًا.");
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

export function capabilityLabel(key) {
  const labels = {
    textGeneration: "توليد النصوص",
    structuredOutput: "مخرجات منظمة",
    visionInput: "إدخال بصري",
    imageGeneration: "توليد الصور",
    videoGeneration: "توليد الفيديو",
    embeddings: "التضمين",
    toolCalling: "استدعاء الأدوات",
    streaming: "البث",
    batch: "المعالجة الدُفعية",
    files: "الملفات",
    webhooks: "Webhooks",
  };
  return labels[key] || key;
}

export function formatKey(key) {
  const labels = {
    textGeneration: "توليد النصوص",
    structuredOutput: "مخرجات منظمة",
    visionInput: "إدخال بصري",
    imageGeneration: "توليد الصور",
    videoGeneration: "توليد الفيديو",
    embeddings: "التضمين",
    toolCalling: "استدعاء الأدوات",
    streaming: "البث",
    batch: "المعالجة الدُفعية",
    files: "الملفات",
    webhooks: "Webhooks",
    requestIdSupport: "يدعم معرف الطلب",
    rateLimitHeadersSupport: "يدعم ترويسات حدود الاستخدام",
    usageHeadersSupport: "يدعم ترويسات الاستهلاك",
    tokenCountingSupport: "يدعم حساب الرموز",
    humanReviewRequired: "مراجعة بشرية",
    autoPublishAllowed: "السماح بالنشر التلقائي",
    allowSensitiveContentGeneration: "السماح بالمحتوى الحساس",
    logAllRequests: "تسجيل الطلبات",
    redactInputs: "إخفاء المدخلات الحساسة",
  };

  return labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}
