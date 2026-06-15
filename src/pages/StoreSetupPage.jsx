import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Globe2,
  Link2,
  Package,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  Users,
} from "lucide-react";

import {
  readProductCatalog,
  upsertProduct,
  deleteProduct as deleteCatalogProduct,
} from "../utils/productCatalogStore.js";

import {
  readStoreScanSnapshot,
  markStoreScanPending,
  runMockStoreScan,
  writeStoreScanSnapshot,
} from "../utils/dataSourcesStore.js";

import {
  getChannelConnectionStatus,
  readIntegrationConnections,
  upsertIntegrationConnection,
} from "../utils/integrationConnectionsStore.js";

import {
  readLatestStoreStrategicPlan,
  upsertStoreStrategicPlan,
} from "../utils/storeStrategicPlanStore.js";

import {
  acquisitionPlans,
  channelOptions,
  defaultForm,
  defaultProducts,
  marketScopeOptions,
  oauthProviderMeta,
  policyItems,
  productFlagOptions,
  steps,
  storeTypeOptions,
} from "./StoreSetupPage/constants.js";

import {
  channelNeedsUrl,
  getAcquisitionPlanKey,
  getChannelUrlLabel,
  getSelectedSalesChannels,
  normalizeSalesChannelName,
  normalizeProviderKey,
  snapshotToCollectedData,
  snapshotToStoreSource,
} from "./StoreSetupPage/helpers.js";

import {
  Badge,
  Button,
  Card,
  ChannelConnectionStatus,
  ChannelPlan,
  ChoiceGroup,
  Field,
  FieldSelect,
  Footer,
  Info,
  Metric,
  MultiChoice,
  Notice,
  PolicyRow,
  SectionHeader,
  SmartBox,
  SourceStatus,
  StepTabs,
  TextArea,
  TimelineCard,
  UploadBox,
} from "./StoreSetupPage/components.jsx";

import { styles } from "./StoreSetupPage/styles.js";

export default function StoreSetupPage({ onCreateCampaign = () => {} }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [products, setProducts] = useState(() => readProductCatalog(defaultProducts));
  const [saved, setSaved] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [productDraft, setProductDraft] = useState({
    name: "",
    category: "",
    url: "",
    price: "",
    margin: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    flags: [],
    source: "manual",
  });
  const [storeSource, setStoreSource] = useState(() =>
    snapshotToStoreSource(readStoreScanSnapshot())
  );
  const [channelConnections, setChannelConnections] = useState(() => readIntegrationConnections());
  const [collectedData, setCollectedData] = useState(() =>
    snapshotToCollectedData(readStoreScanSnapshot())
  );
  const [recommendations, setRecommendations] = useState([
    "ابدأ بفحص المتجر لتحويل الرابط إلى منتجات وتصنيف ونبرة مبدئية.",
    "راجع المنتجات المسحوبة قبل استخدامها في أي حملة.",
    "أي أصل مكتشف من المتجر يحتاج تأكيد حقوق قبل النشر.",
  ]);
  const [latestStrategicPlan, setLatestStrategicPlan] = useState(() =>
    readLatestStoreStrategicPlan(null)
  );

  useEffect(() => {
    const refreshProducts = () => {
      setProducts(readProductCatalog(defaultProducts));
    };

    window.addEventListener("focus", refreshProducts);
    window.addEventListener("storage", refreshProducts);
    window.addEventListener("nashir-product-catalog-updated", refreshProducts);

    return () => {
      window.removeEventListener("focus", refreshProducts);
      window.removeEventListener("storage", refreshProducts);
      window.removeEventListener("nashir-product-catalog-updated", refreshProducts);
    };
  }, []);

  useEffect(() => {
    const refreshStoreScan = () => {
      const snapshot = readStoreScanSnapshot();
      setStoreSource(snapshotToStoreSource(snapshot));
      setCollectedData(snapshotToCollectedData(snapshot));
    };

    window.addEventListener("focus", refreshStoreScan);
    window.addEventListener("storage", refreshStoreScan);
    window.addEventListener("nashir-store-scan-updated", refreshStoreScan);
    window.addEventListener("nashir-data-sources-updated", refreshStoreScan);

    return () => {
      window.removeEventListener("focus", refreshStoreScan);
      window.removeEventListener("storage", refreshStoreScan);
      window.removeEventListener("nashir-store-scan-updated", refreshStoreScan);
      window.removeEventListener("nashir-data-sources-updated", refreshStoreScan);
    };
  }, []);

  useEffect(() => {
    const refreshConnections = () => {
      setChannelConnections(readIntegrationConnections());
    };

    window.addEventListener("focus", refreshConnections);
    window.addEventListener("storage", refreshConnections);
    window.addEventListener("nashir-integration-connections-updated", refreshConnections);

    return () => {
      window.removeEventListener("focus", refreshConnections);
      window.removeEventListener("storage", refreshConnections);
      window.removeEventListener("nashir-integration-connections-updated", refreshConnections);
    };
  }, []);

  useEffect(() => {
    const refreshStrategicPlan = () => {
      setLatestStrategicPlan(readLatestStoreStrategicPlan(null));
    };

    window.addEventListener("focus", refreshStrategicPlan);
    window.addEventListener("storage", refreshStrategicPlan);
    window.addEventListener("nashir-store-strategic-plan-updated", refreshStrategicPlan);

    return () => {
      window.removeEventListener("focus", refreshStrategicPlan);
      window.removeEventListener("storage", refreshStrategicPlan);
      window.removeEventListener("nashir-store-strategic-plan-updated", refreshStrategicPlan);
    };
  }, []);

  const selectedSalesChannels = useMemo(() => getSelectedSalesChannels(form), [form]);
  const salesChannelUrls = form.salesChannelUrls || {};
  const primarySalesChannelUrl = (
    salesChannelUrls["موقع إلكتروني"] ||
    salesChannelUrls[selectedSalesChannels[0]] ||
    form.storeUrl ||
    ""
  ).trim();
  const channelsMissingUrls = selectedSalesChannels.filter(
    (channel) => channelNeedsUrl(channel) && !String(salesChannelUrls[channel] || "").trim()
  );
  const productAnalysisSummary = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const productsWithNames = safeProducts.filter((product) => String(product?.name || "").trim());
    const needsImage = productsWithNames.filter((product) => !String(product?.imageUrl || "").trim());
    const needsVideo = productsWithNames.filter((product) => !String(product?.videoUrl || "").trim());
    const campaignReady = productsWithNames.filter(
      (product) =>
        String(product?.name || "").trim() &&
        String(product?.price || "").trim() &&
        String(product?.description || "").trim() &&
        (String(product?.imageUrl || "").trim() || String(product?.videoUrl || "").trim())
    );
    const categories = Array.from(
      new Set(productsWithNames.map((product) => String(product?.category || "").trim()).filter(Boolean))
    );
    const notes = [];

    if (!productsWithNames.length) notes.push("أضف منتجًا واحدًا على الأقل قبل تجهيز حملة.");
    if (needsImage.length) notes.push("بعض المنتجات تحتاج صورة واضحة قبل الإعلان.");
    if (needsVideo.length) notes.push("الفيديو اختياري لكنه يساعد على اختبار قنوات الفيديو.");
    if (!categories.length) notes.push("أضف تصنيفًا للمنتجات لتسهيل تنظيم الحملات.");
    if (!notes.length) notes.push("بيانات المنتجات كافية كبداية لحملة اختبارية.");

    return {
      count: productsWithNames.length,
      campaignReady: campaignReady.length,
      needsImage: needsImage.length,
      needsVideo: needsVideo.length,
      categories,
      notes,
    };
  }, [products]);

  const completion = useMemo(() => {
    const checks = [
      form.storeName,
      primarySalesChannelUrl,
      form.storeType,
      form.activity,
      form.category,
      form.marketScope,
      form.marketLocation,
      form.tone.length,
      form.useWords,
      form.avoidWords,
      products.some((product) => String(product?.name || "").trim()),
      productAnalysisSummary.campaignReady,
      products.some((product) => (product?.flags || []).length),
      form.age,
      form.gender,
      form.motives.length,
      selectedSalesChannels.length,
      selectedSalesChannels.length && channelsMissingUrls.length === 0,
      Object.keys(form.policyAnswers).length >= 4,
      storeSource.status === "scan_completed" || storeSource.status === "approved",
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [channelsMissingUrls.length, form, primarySalesChannelUrl, productAnalysisSummary.campaignReady, products, selectedSalesChannels.length, storeSource.status]);

  const readinessIssues = useMemo(() => {
    const issues = [];
    if (!form.storeName.trim()) issues.push("اسم المتجر غير مكتمل.");
    if (!primarySalesChannelUrl) issues.push("رابط قناة البيع غير مدخل.");
    if (!form.storeType) issues.push("نوع المتجر غير محدد.");
    if (!selectedSalesChannels.length) issues.push("لم يتم تحديد قنوات البيع.");
    if (channelsMissingUrls.length) issues.push("أضف رابط القناة لتسهيل الربط والتحليل لاحقًا.");
    if (!form.marketScope || !form.marketLocation.trim()) issues.push("السوق / الموقع الجغرافي غير مكتمل.");
    if (storeSource.status !== "scan_completed" && storeSource.status !== "approved") {
      issues.push("رابط قناة البيع لم يتم فحصه أو اعتماد نتائجه بعد.");
    }
    if (!products.some((product) => String(product?.name || "").trim())) issues.push("لا يوجد منتج صالح للاستخدام.");
    if (productAnalysisSummary.needsImage) issues.push("بعض المنتجات تحتاج صورة قبل الحملات.");
    if (productAnalysisSummary.needsVideo) issues.push("بعض المنتجات تحتاج فيديو أو بديل مرئي.");
    if (!form.tone.length) issues.push("نبرة العلامة غير محددة.");
    if (Object.keys(form.policyAnswers).length < 4) issues.push("السياسات والقيود غير مكتملة.");
    return issues;
  }, [channelsMissingUrls.length, form, primarySalesChannelUrl, productAnalysisSummary.needsImage, productAnalysisSummary.needsVideo, products, selectedSalesChannels.length, storeSource.status]);

  const connectedChannelsCount = selectedSalesChannels.filter((channel) => {
    const key = normalizeProviderKey(channel);
    const status = getChannelConnectionStatus(channelConnections[key]);
    return status === "connected" || status === "pending_oauth";
  }).length;

  const acquisitionPlan = useMemo(() => {
    const plan = acquisitionPlans[getAcquisitionPlanKey(form.storeType)];
    return {
      ...plan,
      statusItems: [
        ["نوع المتجر محدد", form.storeType || "غير محدد"],
        ["قنوات البيع محددة", selectedSalesChannels.length ? selectedSalesChannels.join("، ") : "غير محدد"],
        ["أداة الجمع المقترحة محددة", plan.tool],
        ["Backend مطلوب", "نعم"],
        ["موصل البيانات غير مفعّل", "غير مفعّل"],
        ["حالة الجاهزية", plan.readiness],
      ],
      analysisPackage: [
        "ملخص المتجر",
        "المنتجات",
        "الأصول",
        "القنوات",
        "السياسات",
        "إشارات اجتماعية عند توفر موصل مصرح",
        "حدود البيانات",
        "مستوى الثقة",
        "المطلوب من النموذج",
        "مخطط الإخراج المطلوب",
      ],
    };
  }, [form.storeType, selectedSalesChannels]);

  const strategicPlan = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const preferredChannels = selectedSalesChannels;
    const policyAnswers = form.policyAnswers || {};
    const policyCount = Object.keys(policyAnswers).length;
    const hasStoreScan = storeSource.status === "scan_completed" || storeSource.status === "approved";
    const connectedPreferredChannels = preferredChannels.filter((channel) => {
      const status = getChannelConnectionStatus(channelConnections[normalizeProviderKey(channel)]);
      return status === "connected" || status === "pending_oauth";
    });
    const secondaryChannels = preferredChannels.filter((channel) => !connectedPreferredChannels.includes(channel));
    const detectedSuggestedChannels = collectedData?.suggestedChannels || [];
    const deferredChannels = channelOptions
      .filter((channel) => !preferredChannels.includes(channel))
      .filter((channel) => detectedSuggestedChannels.includes(channel) || ["إنستغرام", "تيك توك", "سلة", "موقع إلكتروني"].includes(channel))
      .slice(0, 4);
    const productsMissingDescription = safeProducts.filter((product) => !String(product.description || "").trim());
    const productsMissingPrice = safeProducts.filter((product) => !String(product.price || "").trim());
    const videoReadyProducts = safeProducts.filter((product) => (product.flags || []).includes("يصلح للفيديو") || product.videoUrl);
    const identityStrength = form.storeName && form.category && form.tone?.length && form.useWords ? "واضحة" : "تحتاج ضبط";
    const productClarity = safeProducts.length && !productsMissingDescription.length ? "واضحة" : safeProducts.length ? "متوسطة" : "ضعيفة";
    const assetReadiness = safeProducts.some((product) => product.imageUrl || product.videoUrl || (product.flags || []).includes("يصلح للفيديو"))
      ? "قابلة للبدء"
      : "تحتاج أصول";
    const channelReadiness = connectedPreferredChannels.length
      ? "جاهزة جزئيًا"
      : preferredChannels.length
        ? "محددة وغير مرتبطة"
        : "غير محددة";
    const riskLevel = readinessIssues.length >= 4 || completion < 55
      ? "مرتفع"
      : readinessIssues.length || completion < 80
        ? "متوسط"
        : "منخفض";
    const readinessStage = completion >= 85
      ? "جاهز لحملة اختبارية"
      : completion >= 65
        ? "قابل للتحسين قبل الحملة"
        : "مرحلة استكمال البيانات";
    const strategicAudienceNotes = [
      (form.motives || []).length ? `الدوافع الأقوى: ${form.motives.join("، ")}` : "الدوافع غير مكتملة.",
      form.tone?.length ? `النبرة الأنسب: ${form.tone.join("، ")}` : "نبرة الخطاب تحتاج تحديدًا.",
      policyCount < 4 ? "السياسات غير مكتملة وقد تحد من رسائل الحملة." : "السياسات كافية كبداية للمراجعة.",
    ];
    const priorityProducts = safeProducts.slice(0, 4).map((product, index) => {
      const flags = product.flags || [];
      const gaps = [];
      if (!String(product.description || "").trim()) gaps.push("وصف المنتج");
      if (!String(product.price || "").trim()) gaps.push("السعر");
      if (!product.imageUrl && !product.videoUrl) gaps.push("وسائط المنتج");
      if (!flags.length) gaps.push("خصائص المنتج");
      const isVideoReady = flags.includes("يصلح للفيديو") || product.videoUrl;
      const isGift = flags.includes("مناسب للهدايا") || flags.includes("موسمي");
      const bestChannel = isVideoReady
        ? (preferredChannels.includes("تيك توك") ? "تيك توك" : preferredChannels.includes("إنستغرام") ? "إنستغرام" : "إنستغرام")
        : isGift
          ? (preferredChannels.includes("واتساب") ? "واتساب" : preferredChannels[0] || "واتساب")
          : preferredChannels[0] || "إنستغرام";
      const contentType = isVideoReady ? "فيديو قصير" : isGift ? "حملة اجتماعية / بريدية" : "منشور تعريفي";
      const reason = index === 0
        ? "أول منتج مناسب كبداية لحملة اختبارية."
        : isVideoReady
          ? "جاهز لفكرة محتوى مرئي."
          : isGift
            ? "مناسب للمناسبات والعروض."
            : "يمكن اختباره بعد استكمال البيانات.";

      return {
        name: product.name || `منتج ${index + 1}`,
        reason,
        bestChannel,
        contentType,
        gap: gaps.length ? gaps.join("، ") : "لا يوجد نقص واضح",
      };
    });
    const risks = [];
    if (!safeProducts.length) risks.push("لا توجد منتجات كافية لبناء أولوية تسويقية.");
    if (!preferredChannels.length) risks.push("لا توجد قنوات مفضلة للحملات.");
    if (policyCount < 4) risks.push("إجابات السياسات غير مكتملة.");
    if (productsMissingDescription.length) risks.push("بعض المنتجات بلا وصف كاف.");
    if (!videoReadyProducts.length) risks.push("لا يوجد منتج جاهز لفيديو قصير.");
    if (!hasStoreScan) risks.push("فحص المتجر لم يكتمل بعد.");
    if (completion < 70) risks.push("اكتمال الإعداد منخفض ويحتاج تحسينًا قبل الحملة.");

    let nextAction = "ابدأ إنشاء حملة اختبارية من المنتج الأعلى أولوية.";
    if (!safeProducts.length || productsMissingDescription.length || productsMissingPrice.length) {
      nextAction = "أكمل بيانات المنتجات قبل إنشاء حملة.";
    } else if (!preferredChannels.length || !connectedPreferredChannels.length) {
      nextAction = "اربط قناة واحدة على الأقل قبل الجدولة.";
    } else if (!videoReadyProducts.length) {
      nextAction = "أضف أصل فيديو للمنتج الأعلى أولوية.";
    } else if (policyCount < 4) {
      nextAction = "راجع سياسات الادعاءات قبل إطلاق الحملات.";
    }

    return {
      summary: [
        ["مرحلة جاهزية المتجر", readinessStage],
        ["قوة الهوية", identityStrength],
        ["وضوح المنتجات", productClarity],
        ["جاهزية الأصول", assetReadiness],
        ["جاهزية القنوات", channelReadiness],
        ["مستوى المخاطر", riskLevel],
      ],
      audience: [
        ["الفئة العمرية", form.age || "غير محدد"],
        ["الجنس", form.gender || "غير محدد"],
        ["السوق", form.marketLocation || form.marketScope || "غير محدد"],
        ["الدافع الشرائي", (form.motives || []).join("، ") || "غير محدد"],
        ["الألم الشرائي", riskLevel === "مرتفع" ? "ثقة ووضوح قبل الشراء" : "اختيار المنتج المناسب بسرعة"],
        ["ملاحظات الجمهور", strategicAudienceNotes.join(" ")],
      ],
      priorityProducts,
      channels: {
        primary: connectedPreferredChannels.length ? connectedPreferredChannels : preferredChannels.slice(0, 2),
        secondary: secondaryChannels.length ? secondaryChannels : detectedSuggestedChannels.filter((channel) => !preferredChannels.includes(channel)).slice(0, 3),
        deferred: deferredChannels.length ? deferredChannels : channelOptions.filter((channel) => !preferredChannels.includes(channel)).slice(0, 3),
      },
      messaging: [
        ["الرسالة الرئيسية المقترحة", `${form.storeName || "المتجر"} يقدم ${form.category || "منتجات"} مناسبة لجمهور يبحث عن ${(form.motives || ["جودة"])[0] || "جودة"} وثقة.`],
        ["نبرة الخطاب", (form.tone || []).join("، ") || "هادئة وموثوقة"],
        ["كلمات مقترحة", form.useWords || "جودة، تجربة، ثقة"],
        ["كلمات يجب تجنبها", form.avoidWords || "ادعاءات مطلقة أو غير مثبتة"],
        ["CTA مقترح", preferredChannels.includes("واتساب") ? "تواصل معنا" : "تسوق الآن"],
      ],
      risks,
      nextAction,
    };
  }, [channelConnections, collectedData, completion, form, products, readinessIssues.length, selectedSalesChannels, storeSource.status]);

  const setChannelOAuthState = (channel, status, extra = {}) => {
    const key = normalizeProviderKey(channel);
    const provider = oauthProviderMeta[channel] || {
      id: key,
      authUrl: "about:blank",
      scopes: ["profile_later"],
    };

    const next = upsertIntegrationConnection(
      {
        providerId: provider.id,
        providerName: channel,
        status,
        authorizationUrl: provider.authUrl,
        requestedScopes: provider.scopes,
        accountName: extra.accountName || channelConnections[key]?.accountName || "",
        updatedAt: new Date().toISOString(),
        ...extra,
      },
      selectedSalesChannels
    );

    setChannelConnections(next);
    setSaved(false);
  };

  const startOAuthConnection = (channel) => {
    const provider = oauthProviderMeta[channel];
    setChannelOAuthState(channel, "pending_oauth", {
      lastAction: "oauth_started",
    });

    if (provider?.authUrl && provider.authUrl !== "about:blank") {
      window.open(provider.authUrl, "_blank", "noopener,noreferrer");
    }
  };

  const mockOAuthSuccess = (channel) => {
    const key = normalizeProviderKey(channel);
    const safeName = String(channel).replace(/\s+Business/i, "");
    setChannelOAuthState(channel, "connected", {
      lastAction: "oauth_callback_mocked",
      accountName: channelConnections[key]?.accountName || `@${safeName.toLowerCase().replace(/\s+/g, "_")}_account`,
    });
  };

  const disconnectOAuth = (channel) => {
    setChannelOAuthState(channel, "disconnected", {
      lastAction: "oauth_disconnected",
      accountName: "",
    });
  };

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setActionNotice("");
    setSaved(false);
  };

  const updateSalesChannels = (channels) => {
    const nextChannels = Array.from(
      new Set((Array.isArray(channels) ? channels : []).map((channel) => normalizeSalesChannelName(channel)).filter(Boolean))
    );

    setForm((prev) => {
      const nextUrls = Object.fromEntries(
        Object.entries(prev.salesChannelUrls || {}).filter(([channel]) => nextChannels.includes(channel))
      );
      return {
        ...prev,
        salesChannels: nextChannels,
        preferredChannels: nextChannels,
        primarySalesChannel: nextChannels[0] || "",
        salesChannelUrls: nextUrls,
      };
    });
    setActionNotice("");
    setSaved(false);
  };

  const updateSalesChannelUrl = (channel, value) => {
    setForm((prev) => ({
      ...prev,
      salesChannelUrls: {
        ...(prev.salesChannelUrls || {}),
        [channel]: value,
      },
      storeUrl: channel === "موقع إلكتروني" || !prev.storeUrl ? value : prev.storeUrl,
    }));
    setActionNotice("");
    setSaved(false);
  };

  const updatePolicy = (title, value) => {
    setForm((prev) => ({
      ...prev,
      policyAnswers: {
        ...prev.policyAnswers,
        [title]: value,
      },
    }));
    setActionNotice("");
    setSaved(false);
  };

  const updateProductDraft = (key, value) => {
    setProductDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const resetProductDraft = () => {
    setEditingProductId(null);
    setProductDraft({
      name: "",
      category: "",
      url: "",
      price: "",
      margin: "",
      description: "",
      imageUrl: "",
      videoUrl: "",
      flags: [],
      source: "manual",
    });
  };

  const toggleDraftFlag = (flag) => {
    setProductDraft((prev) => {
      const exists = prev.flags.includes(flag);
      return {
        ...prev,
        flags: exists ? prev.flags.filter((item) => item !== flag) : [...prev.flags, flag],
      };
    });
    setSaved(false);
  };

  const saveProductDraft = () => {
    const cleanName = productDraft.name.trim();
    if (!cleanName) {
      setRecommendations((prev) => [
        "أدخل اسم المنتج قبل إضافته إلى جدول المنتجات.",
        ...prev.filter((item) => item !== "أدخل اسم المنتج قبل إضافته إلى جدول المنتجات."),
      ]);
      return;
    }

    const next = upsertProduct(
      {
        ...productDraft,
        id: editingProductId || productDraft.id || Date.now(),
        source: productDraft.source || "store_setup",
      },
      defaultProducts
    );

    setProducts(next);
    resetProductDraft();
    setSaved(false);
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name || "",
      category: product.category || "",
      url: product.url || "",
      price: product.price || "",
      margin: product.margin || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      videoUrl: product.videoUrl || "",
      flags: product.flags || [],
      source: product.source || "manual",
    });
  };

  const removeProduct = (id) => {
    const next = deleteCatalogProduct(id, defaultProducts);
    setProducts(next);
    if (editingProductId === id) resetProductDraft();
    setSaved(false);
  };

  const addDetectedProduct = (name, index = 0) => {
    const current = readProductCatalog(defaultProducts);
    const exists = current.some((product) => product.name === name);
    if (exists) return;

    const next = upsertProduct(
      {
        id: Date.now() + index,
        name,
        url: `${primarySalesChannelUrl.replace(/\/$/, "")}/products/${encodeURIComponent(name)}`,
        price: "",
        margin: "",
        description: "منتج مسحوب من رابط قناة البيع ويحتاج مراجعة التفاصيل قبل استخدامه في الحملات.",
        flags: ["مناسب للهدايا", "يصلح للفيديو"],
        source: "store_scan",
      },
      defaultProducts
    );

    setProducts(next);
  };

  const scanStore = () => {
    if (!primarySalesChannelUrl) {
      setRecommendations((prev) => [
        "أضف رابط القناة أولًا حتى يمكن فحصها.",
        ...prev.filter((item) => item !== "أضف رابط القناة أولًا حتى يمكن فحصها."),
      ]);
      return;
    }

    const pending = markStoreScanPending({ storeUrl: primarySalesChannelUrl });
    setStoreSource(snapshotToStoreSource(pending.snapshot));
    setCollectedData(snapshotToCollectedData(pending.snapshot));

    window.setTimeout(() => {
      const { snapshot } = runMockStoreScan({ storeUrl: primarySalesChannelUrl });
      const result = snapshotToCollectedData(snapshot);

      setCollectedData(result);
      setStoreSource(snapshotToStoreSource(snapshot));

      setForm((prev) => ({
        ...prev,
        category: prev.category || result.detectedCategories[0],
        tone: prev.tone.length ? prev.tone : result.detectedTone,
        useWords: prev.useWords || result.brandKeywords.join("، "),
        salesChannels: Array.from(new Set([...getSelectedSalesChannels(prev), ...result.suggestedChannels.map(normalizeSalesChannelName)])),
        preferredChannels: Array.from(new Set([...getSelectedSalesChannels(prev), ...result.suggestedChannels.map(normalizeSalesChannelName)])),
      }));

      const currentProducts = readProductCatalog(defaultProducts);
      const existingNames = new Set(currentProducts.map((product) => product.name).filter(Boolean));
      let nextProducts = currentProducts;

      result.detectedProducts
        .filter((name) => !existingNames.has(name))
        .forEach((name, index) => {
          nextProducts = upsertProduct(
            {
              id: Date.now() + index,
              name,
              url: `${primarySalesChannelUrl.replace(/\/$/, "")}/products/${encodeURIComponent(name)}`,
              price: "",
              margin: "",
              description: "منتج مكتشف من رابط قناة البيع ويحتاج مراجعة التفاصيل قبل استخدامه في حملة.",
              flags: ["مناسب للهدايا", "يصلح للفيديو"],
              source: "store_scan",
            },
            defaultProducts
          );
        });

      setProducts(nextProducts);

      setRecommendations([
        "تم عكس نتائج فحص المتجر على نفس مصدر بيانات DataSourcesHub.",
        "تمت إضافة المنتجات المكتشفة إلى كتالوج المنتجات المشترك.",
        "أصول المتجر المكتشفة يجب مراجعة حقوقها في مكتبة الأصول.",
        "ابدأ بقناتين فقط في أول حملة قبل التوسع.",
      ]);
    }, 700);
  };

  const approveStoreScan = () => {
    const currentSnapshot = readStoreScanSnapshot();
    if (currentSnapshot?.status === "scan_completed") {
      const approvedSnapshot = writeStoreScanSnapshot({
        ...currentSnapshot,
        status: "approved",
        message: "تم اعتماد بيانات فحص المتجر كمصدر مساعد للحملات.",
      });
      setStoreSource(snapshotToStoreSource(approvedSnapshot));
      setCollectedData(snapshotToCollectedData(approvedSnapshot));
    }

    setRecommendations((prev) => [
      "تم اعتماد بيانات فحص المتجر كمصدر مساعد للحملات القادمة.",
      ...prev,
    ]);
  };

  const saveStrategicPlanDraft = () => {
    const currentVersion = Number(latestStrategicPlan?.version || 0);
    const sourceInputs = [
      "بيانات المتجر",
      "المنتجات",
      "الأصول",
      "السياسات",
      "القنوات",
      storeSource.status === "scan_completed" || storeSource.status === "approved"
        ? "محاكاة فحص المتجر"
        : "بيانات إعداد يدوية",
    ];
    const nextPlans = upsertStoreStrategicPlan({
      id: latestStrategicPlan?.id,
      storeRef: form.storeName || "prototype_store_profile",
      workspaceRef: "prototype_workspace",
      version: currentVersion + 1,
      status: readinessIssues.length ? "draft" : "ready_for_review",
      planJson: strategicPlan,
      sourceInputs,
      confidence: Math.min(95, Math.max(35, completion)),
      limitations: [
        "حفظ واجهي تجريبي داخل المتصفح.",
        "الخطة مبنية على بيانات الإعداد الحالية ومحاكاة فحص المتجر.",
        "تحتاج Backend لاحقًا قبل الاعتماد التشغيلي.",
      ],
    });

    setLatestStrategicPlan(nextPlans.find((plan) => plan.id === (latestStrategicPlan?.id || nextPlans[0]?.id)) || nextPlans[0]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const saveDraft = () => {
    setActionNotice("تم حفظ إعداد المتجر في النموذج الأولي.");
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleCreateCampaign = () => {
    setActionNotice("تم تجهيز بيانات الحملة الأولية. انتقل إلى معالج إنشاء الحملة لإكمالها.");
    if (typeof onCreateCampaign === "function") onCreateCampaign();
  };

  const next = () => {
    if (step < steps.length) {
      setStep((current) => current + 1);
      return;
    }

    setActionNotice("تم حفظ إعداد المتجر في النموذج الأولي.");
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const back = () => {
    if (step > 1) setStep((current) => current - 1);
  };

  return (
    <main className="store-page" dir="rtl">
      <style>{styles}</style>

      <section className="page-title">
        <div>
          <div className="eyebrow">
            <Store size={15} />
            Store Setup
          </div>
          <h1>إعداد المتجر</h1>
          <p>
            إعداد مختصر ومباشر لبيانات المتجر والمنتجات والجمهور والقنوات.
            إعداد المتجر يعرّف بيانات المتجر والمنتجات الأساسية. سياسات الاعتماد والحوكمة تُدار من صفحاتها المتخصصة.
            والسياسات قبل إنشاء الحملات. هذا إعداد واجهي في النموذج الأولي، ولا يوجد حفظ خلفي أو ربط فعلي.
          </p>
        </div>
        <Badge tone="blue">Prototype</Badge>
      </section>

      <section className="screen-guidance-card">
        <div><span>هدف الشاشة</span><strong>تجهيز بيانات المتجر وتحديد مصدر البيانات وبناء الخطة الاستراتيجية.</strong></div>
        <div><span>المدخلات</span><strong>نوع المتجر، قنوات البيع، روابط القنوات، المنتجات، الأصول.</strong></div>
        <div><span>المخرجات</span><strong>خطة جمع البيانات، خطة استراتيجية، أولويات المنتجات، فجوات الأصول.</strong></div>
        <div><span>الإجراء التالي</span><strong>استكمال البيانات أو الانتقال إلى مركز مصادر البيانات أو إنشاء حملة.</strong></div>
        <div><span>ما لا يحدث هنا</span><strong>لا يتم سحب بيانات فعلية من هذه الصفحة.</strong></div>
      </section>

      <section className="guardrail">
        <ShieldCheck size={19} />
        <div>
          <strong>Scope Guardrail</strong>
          <span>
            لا يوجد Backend أو API حقيقي. زر فحص المتجر هنا اختصار فقط؛ نتيجة الفحص
            تُحفظ في نفس مصدر بيانات DataSourcesHub، وليست حالة مستقلة داخل إعداد المتجر.
          </span>
        </div>
      </section>

      <section className="overview-grid">
        <Card className="score-card">
          <div className="score-ring">{completion}%</div>
          <div>
            <h3>اكتمال إعداد المتجر</h3>
            <p>كل عنصر مكتمل يقلل التخمين داخل معالج الحملة.</p>
          </div>
        </Card>

        <Card className="source-card">
          <div>
            <h3>مصدر المتجر</h3>
            <p>{storeSource.message}</p>
          </div>
          <SourceStatus status={storeSource.status} confidence={storeSource.confidence} />
        </Card>

        <Card className="quick-card">
          <Package size={22} />
          <div>
            <strong>{products.length}</strong>
            <span>منتجات/خدمات في الجدول</span>
          </div>
        </Card>
      </section>

      <section className="steps-panel">
        <StepTabs steps={steps} step={step} setStep={setStep} />
      </section>

      <section className="layout">
        <div className="main-panel">
          {step === 1 && (
            <Card>
              <SectionHeader
                icon={Store}
                title="الخطوة 1: بيانات المتجر والهوية التشغيلية"
                description="تم دمج ما يلزم من هوية العلامة داخل بيانات المتجر بدل إبقاء خطوة مستقلة."
              />

              <div className="form-grid">
                <Field label="اسم المتجر" value={form.storeName} onChange={(value) => update("storeName", value)} />
                <FieldSelect label="نوع المتجر" value={form.storeType} options={storeTypeOptions} onChange={(value) => update("storeType", value)} />
                <FieldSelect
                  label="السوق / الموقع الجغرافي"
                  value={form.marketScope || "السعودية"}
                  options={marketScopeOptions}
                  onChange={(value) => {
                    update("marketScope", value);
                    if (value !== "مدينة / منطقة محددة" && value !== "أخرى") update("marketLocation", value);
                  }}
                />
                {(form.marketScope === "مدينة / منطقة محددة" || form.marketScope === "أخرى") ? (
                  <Field label="حدد السوق أو المنطقة" value={form.marketLocation} onChange={(value) => update("marketLocation", value)} />
                ) : null}
                <ChoiceGroup
                  title="نوع النشاط"
                  options={["متجر إلكتروني", "خدمة", "مطعم/كافيه", "تعليم", "أزياء", "تجميل", "عطور", "هدايا"]}
                  selected={form.activity}
                  setSelected={(value) => update("activity", value)}
                />
                <ChoiceGroup
                  title="تصنيف النشاط الرئيسي"
                  options={["عناية وجمال", "أزياء", "عطور", "أغذية", "إلكترونيات", "خدمات", "تعليم", "هدايا"]}
                  selected={form.category}
                  setSelected={(value) => update("category", value)}
                />
              </div>

              <Notice>نوع المتجر يصف طبيعة النشاط، بينما قنوات البيع تحدد أين يتم البيع فعليًا.</Notice>
              <Notice>روابط المتجر تُدار حسب قناة البيع، لأن كل قناة قد يكون لها رابط مختلف.</Notice>

              <MultiChoice
                title="قنوات البيع"
                options={channelOptions}
                selected={selectedSalesChannels}
                setSelected={updateSalesChannels}
              />

              {selectedSalesChannels.length ? (
                <div className="sales-channel-url-grid">
                  {selectedSalesChannels.map((channel) => (
                    <div key={channel} className="channel-url-card">
                      <Field
                        label={getChannelUrlLabel(channel)}
                        value={salesChannelUrls[channel] || ""}
                        placeholder="https://..."
                        onChange={(value) => updateSalesChannelUrl(channel, value)}
                      />
                      {!String(salesChannelUrls[channel] || "").trim() && channelNeedsUrl(channel) ? (
                        <div className="channel-url-warning">
                          <AlertTriangle size={14} />
                          <span>أضف رابط القناة لتسهيل الربط والتحليل لاحقًا.</span>
                        </div>
                      ) : (
                        <Badge tone="neutral">قناة بيع مختارة</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Notice>اختر قناة بيع واحدة على الأقل لإظهار رابط القناة.</Notice>
              )}

              <MultiChoice
                title="نبرة العلامة"
                options={["رسمية", "ودية", "فاخرة", "شبابية", "جريئة", "هادئة", "تعليمية", "محلية", "عالمية", "موثوقة"]}
                selected={form.tone}
                setSelected={(value) => update("tone", value)}
              />

              <div className="form-grid">
                <TextArea label="كلمات يجب استخدامها" value={form.useWords} onChange={(value) => update("useWords", value)} />
                <TextArea label="كلمات يجب تجنبها" value={form.avoidWords} onChange={(value) => update("avoidWords", value)} />
              </div>

              <div className="scan-card acquisition-card">
                <div className="scan-head">
                  <div>
                    <h3>مصدر المتجر وجمع البيانات</h3>
                    <p>هذه خطة جمع بيانات واجهية. التنفيذ الحقيقي يحتاج Backend وموصلات مصرح بها وتخزين أسرار آمن.</p>
                  </div>
                  <Badge tone="amber">جاهز للتصميم / غير منفذ</Badge>
                </div>
                <Notice>لا يتم سحب بيانات فعلية من هذه الصفحة.</Notice>
                <div className="strategy-grid">
                  <div className="strategy-section">
                    <h3>طريقة جمع البيانات المقترحة</h3>
                    <div className="strategy-facts compact">
                      <Info label="طريقة جمع البيانات المقترحة" value={acquisitionPlan.method} />
                      <Info label="الأداة المناسبة" value={acquisitionPlan.tool} />
                      <Info label="ما سيتم جمعه" value={acquisitionPlan.collects} />
                      <Info label="ما يحتاج Backend" value={acquisitionPlan.backend} />
                      <Info label="ما سيرسل للتحليل لاحقًا" value={acquisitionPlan.analysisInput} />
                      <Info label="الإجراء التالي" value={acquisitionPlan.nextAction} />
                    </div>
                  </div>

                  <div className="strategy-section">
                    <h3>حالة الجاهزية</h3>
                    <div className="strategy-facts compact">
                      {acquisitionPlan.statusItems.map(([label, value]) => (
                        <Info key={label} label={label} value={value} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="strategy-section">
                  <h3>خطة جمع البيانات المقترحة</h3>
                  <div className="pipeline-list">
                    {[
                      "تحديد المصدر",
                      "تشغيل الموصل",
                      "حفظ البيانات الخام",
                      "تطبيع البيانات",
                      "بناء حزمة أدلة للتحليل",
                      "إرسالها لمهمة ذكاء اصطناعي",
                      "حفظ المخرجات المنظمة",
                      "إعادة استخدامها في الخطة والحملة والمحتوى",
                    ].map((item, index) => (
                      <div key={item} className="pipeline-step">
                        <span>{index + 1}</span>
                        <strong>{item}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="strategy-grid">
                  <div className="strategy-section">
                    <h3>ما سيرسل للتحليل لاحقًا</h3>
                    <div className="analysis-chip-list">
                      {acquisitionPlan.analysisPackage.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="strategy-section">
                    <h3>مطالبة التحليل المقترحة</h3>
                    <p className="strategy-helper">
                      حلل المتجر بناءً على البيانات المنظمة فقط، فرّق بين الحقائق والاستنتاجات، اذكر حدود البيانات، وأخرج خطة استراتيجية قابلة للمراجعة.
                    </p>
                  </div>
                </div>
              </div>

              <div className="scan-card">
                <div className="scan-head">
                  <div>
                    <h3>فحص المتجر</h3>
                    <p>محاكاة فحص الرابط لاستخراج منتجات وتصنيف ونبرة وقنوات مقترحة.</p>
                  </div>
                  <SourceStatus status={storeSource.status} confidence={storeSource.confidence} />
                </div>
                <div className="scan-actions">
                  <Button onClick={scanStore}><RefreshCw size={16} /> فحص المتجر</Button>
                  <Button variant="secondary" onClick={approveStoreScan}><CheckCircle2 size={16} /> اعتماد نتيجة الفحص</Button>
                </div>
                {collectedData.detectedProducts.length ? (
                  <div className="scan-summary">
                    <Info label="المنصة المكتشفة" value={collectedData.detectedPlatform} />
                    <Info label="تصنيف مكتشف" value={collectedData.detectedCategories.join("، ")} />
                    <Info label="منتجات مقترحة" value={collectedData.detectedProducts.join("، ")} />
                    <Info label="قنوات مقترحة" value={collectedData.suggestedChannels.join("، ")} />
                  </div>
                ) : null}
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <div className="products-head">
                <SectionHeader icon={Package} title="الخطوة 2: المنتجات والخدمات" description="كل منتج يدخل هنا يصبح مرجعًا لمعالج الحملات." />
                <Button onClick={() => {
                  const fallback = collectedData.detectedProducts.length ? collectedData.detectedProducts : ["باقة هدايا طبيعية", "كريم مرطب نيفيا", "عطر مناسبات"];
                  fallback.forEach((name, index) => addDetectedProduct(name, index));
                }}><Plus size={16} /> سحب منتجات مقترحة</Button>
              </div>
              <Notice>المنتجات المدخلة هنا تظهر في كتالوج المنتجات ومعالج إنشاء الحملة. التصنيف والوسائط تساعد في اقتراح الأصول المناسبة للحملة.</Notice>
              <Notice>هامش الربح اختياري وحساس ولا يجب جعله إلزاميًا في V1. المنتجات المسحوبة من المتجر تحتاج مراجعة قبل استخدامها في الحملات.</Notice>
              <div className="product-manager-grid">
                <div className="product-form-card">
                  <div className="product-form-head">
                    <div><h3>{editingProductId ? "تعديل منتج" : "إضافة منتج جديد"}</h3><p>أدخل بيانات المنتج ثم احفظه ليظهر في جدول المنتجات وكتالوج المنتجات.</p></div>
                    <Badge tone={editingProductId ? "blue" : "green"}>{editingProductId ? "تعديل" : "جديد"}</Badge>
                  </div>
                  <div className="form-grid">
                    <Field label="اسم المنتج" value={productDraft.name} placeholder="مثال: سيروم عناية طبيعي" onChange={(value) => updateProductDraft("name", value)} />
                    <Field label="التصنيف" value={productDraft.category} placeholder="مثال: عناية وجمال" onChange={(value) => updateProductDraft("category", value)} />
                    <Field label="رابط المنتج" value={productDraft.url} placeholder="https://store.example/products/..." onChange={(value) => updateProductDraft("url", value)} />
                    <Field label="السعر" value={productDraft.price} placeholder="149 ر.س" onChange={(value) => updateProductDraft("price", value)} />
                    <Field label="هامش الربح التقريبي - اختياري" value={productDraft.margin} placeholder="اختياري" onChange={(value) => updateProductDraft("margin", value)} />
                    <TextArea label="وصف مختصر" value={productDraft.description} placeholder="اكتب وصف المنتج، فوائده، ولماذا يشتريه العميل..." onChange={(value) => updateProductDraft("description", value)} />
                    <UploadBox title="إرفاق صورة" accept="image/*" onFile={(file) => updateProductDraft("imageUrl", file ? `إرفاق تجريبي: ${file.name}` : productDraft.imageUrl)} value={productDraft.imageUrl} />
                    <UploadBox title="إرفاق فيديو" accept="video/*" onFile={(file) => updateProductDraft("videoUrl", file ? `إرفاق تجريبي: ${file.name}` : productDraft.videoUrl)} value={productDraft.videoUrl} />
                  </div>
                  <div className="product-flags-section"><h4>خصائص المنتج</h4><div className="choice-list">{productFlagOptions.map((flag) => (<button key={flag} type="button" onClick={() => toggleDraftFlag(flag)} className={`choice ${productDraft.flags.includes(flag) ? "selected" : ""}`}>{flag}</button>))}</div></div>
                  <div className="product-form-actions"><Button onClick={saveProductDraft}>{editingProductId ? "حفظ التعديل" : "إضافة إلى الجدول"}</Button><Button variant="secondary" onClick={resetProductDraft}>تفريغ النموذج</Button></div>
                </div>
                <div className="product-table-card">
                  <div className="product-table-headline"><div><h3>جدول المنتجات</h3><p>كل المنتجات اليدوية أو المقترحة تظهر هنا وفي كتالوج المنتجات من نفس المصدر.</p></div><Badge tone="neutral">{products.length} منتج</Badge></div>
                  <div className="product-table">
                    <div className="product-table-header"><span>المنتج</span><span>السعر</span><span>المصدر</span><span>الخصائص</span><span>إجراء</span></div>
                    {products.map((product, index) => (
                      <div key={product.id} className="product-table-row">
                        <div><strong>{product.name || `منتج بدون اسم ${index + 1}`}</strong><small>{product.url || "لا يوجد رابط"}</small></div>
                        <span>{product.price || "—"}</span>
                        <Badge tone={product.source === "store_scan" ? "blue" : "neutral"}>{product.source === "store_scan" ? "فحص المتجر" : "يدوي"}</Badge>
                        <div className="product-flags-preview">{(product.flags || []).slice(0, 2).map((flag) => (<span key={flag}>{flag}</span>))}{product.flags?.length > 2 ? <span>+{product.flags.length - 2}</span> : null}</div>
                        <div className="product-row-actions"><button type="button" onClick={() => startEditProduct(product)}>تعديل</button><button type="button" className="danger" onClick={() => removeProduct(product.id)} disabled={products.length === 1}><Trash2 size={14} /> حذف</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {collectedData.detectedProducts.length ? (
                <div className="scan-card">
                  <div className="scan-head"><div><h3>اقتراحات من فحص المتجر</h3><p>اضغط على أي منتج لإضافته إلى الجدول إن لم يكن موجودًا.</p></div><Badge tone="blue">store_scan</Badge></div>
                  <div className="suggestion-list">{collectedData.detectedProducts.map((product, index) => (<button key={product} type="button" onClick={() => addDetectedProduct(product, index)}>+ {product}</button>))}</div>
                  {collectedData.assetsNeedingReview.length ? (<Notice>أصول تحتاج مراجعة حقوق: {collectedData.assetsNeedingReview.join("، ")}</Notice>) : null}
                </div>
              ) : null}
            </Card>
          )}

          {step === 3 && (
            <Card>
              <SectionHeader
                icon={Users}
                title="الخطوة 3: الجمهور والقنوات"
                description="بيانات الجمهور الافتراضية والقنوات المفضلة، مع اختصار لبدء ربط القنوات."
              />
              <div className="form-grid three">
                <ChoiceGroup title="الفئة العمرية" options={["13–17", "18–24", "25–34", "35–44", "45–54", "55+"]} selected={form.age} setSelected={(value) => update("age", value)} />
                <ChoiceGroup title="الجنس" options={["رجال", "نساء", "الجميع"]} selected={form.gender} setSelected={(value) => update("gender", value)} />
              </div>
              <MultiChoice
                title="دوافع الشراء"
                options={["سعر", "جودة", "سرعة", "هدية", "مناسبة", "رفاهية", "ضرورة", "تجربة"]}
                selected={form.motives}
                setSelected={(value) => update("motives", value)}
              />
              <Notice>
                هذا OAuth Mock داخل البروتوتايب: زر الربط يفتح صفحة حساب/موافقة المنصة كتصور للتجربة، لكن التنفيذ الحقيقي لاحقًا يجب أن يبدأ من Backend آمن يحفظ Tokens مشفرة. لا يوجد client_secret أو access_token داخل React.
              </Notice>
              <MultiChoice title="قنوات البيع المستخدمة للحملات" options={channelOptions} selected={selectedSalesChannels} setSelected={updateSalesChannels} />

              <div className="settings-sync-card">
                <Link2 size={18} />
                <div>
                  <strong>ربط القنوات</strong>
                  <span>الربط الذي يتم هنا ينعكس تلقائيًا في الإعدادات دون مزامنة يدوية.</span>
                </div>
                <Badge tone={connectedChannelsCount ? "green" : "neutral"}>{connectedChannelsCount} قناة مرتبطة/بانتظار</Badge>
              </div>

              <div className="channel-grid">
                {selectedSalesChannels.map((channel) => {
                  const key = normalizeProviderKey(channel);
                  const connection = channelConnections[key] || {};
                  const connectionStatus = getChannelConnectionStatus(connection);
                  return (
                    <div key={channel} className="channel-card">
                      <Globe2 size={20} />
                      <div>
                        <strong>{channel}</strong>
                        <span>زر الربط يبدأ مسار OAuth Mock ويظهر نفس السجل في الإعدادات.</span>
                        <ChannelConnectionStatus status={connectionStatus} />
                        {connection.accountName ? <small className="channel-account">{connection.accountName}</small> : null}
                        <div className="channel-actions">
                          <button type="button" onClick={() => startOAuthConnection(channel)}>ربط OAuth</button>
                          <button type="button" onClick={() => mockOAuthSuccess(channel)}>محاكاة إتمام الموافقة</button>
                          <button type="button" onClick={() => disconnectOAuth(channel)}>قطع الربط</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <SectionHeader icon={ShieldCheck} title="الخطوة 4: السياسات والقيود" description="تثبيت قيود الادعاءات والموافقات وحدود النشر قبل التوليد." />
              <div className="policy-grid">{policyItems.map((item) => (<PolicyRow key={item} title={item} value={form.policyAnswers[item] || "بحاجة مراجعة"} onChange={(value) => updatePolicy(item, value)} />))}</div>
            </Card>
          )}

          {step === 5 && (
            <div className="final-summary">
              <div className="readiness-grid">
                <Card>
                  <SectionHeader icon={FileCheck2} title="الخطوة 5: ملخص جاهزية المتجر" description="قرار واضح قبل الانتقال إلى معالج الحملات." />
                  <div className="metrics-grid">
                    <Metric title="اكتمال الملف" value={`${completion}%`} />
                    <Metric title="المنتجات" value={String(products.length)} />
                    <Metric title="القنوات" value={`${connectedChannelsCount}/${selectedSalesChannels.length}`} />
                    <Metric title="السياسات" value={`${Object.keys(form.policyAnswers).length}/${policyItems.length}`} />
                    <Metric title="فحص المتجر" value={storeSource.status === "approved" ? "معتمد" : storeSource.status === "scan_completed" ? "تم التحليل" : "ناقص"} tone={storeSource.status === "approved" || storeSource.status === "scan_completed" ? "green" : "amber"} />
                    <Metric title="جاهزية الحملات" value={readinessIssues.length ? "تحتاج استكمال" : "جاهزة"} tone={readinessIssues.length ? "amber" : "green"} />
                  </div>
                  <div className="issues-card">
                    <h3>النواقص</h3>
                    {readinessIssues.length ? readinessIssues.map((issue) => (
                      <div key={issue} className="issue-row"><AlertTriangle size={16} /><span>{issue}</span></div>
                    )) : (
                      <div className="issue-row ok"><CheckCircle2 size={16} /><span>لا توجد نواقص حرجة قبل إنشاء الحملة.</span></div>
                    )}
                  </div>
                </Card>
                <Card className="recommendation-card"><h3>توصيات قبل البدء</h3><div className="recommendation-list">{recommendations.map((item) => (<div key={item}>{item}</div>))}</div><Button onClick={handleCreateCampaign}><Sparkles size={16} /> إنشاء أول حملة</Button><Notice>إذا لم ينتقل النموذج تلقائيًا، فهذا زر واجهي تجريبي ويعتمد على ربط التنقل في التطبيق.</Notice></Card>
              </div>

              <Card className="product-analysis-card">
                <SectionHeader
                  icon={Package}
                  title="تحليل المنتجات"
                  description="ملخص جاهزية المنتجات الحالية قبل الانتقال للحملات."
                />
                <Notice>يعكس هذا الملخص بيانات المنتجات الحالية، وليس تحليل ذكاء اصطناعي فعلي.</Notice>
                <div className="strategy-facts">
                  <Info label="عدد المنتجات" value={String(productAnalysisSummary.count)} />
                  <Info label="المنتجات الجاهزة للحملات" value={String(productAnalysisSummary.campaignReady)} />
                  <Info label="المنتجات التي تحتاج صورة" value={String(productAnalysisSummary.needsImage)} />
                  <Info label="المنتجات التي تحتاج فيديو" value={String(productAnalysisSummary.needsVideo)} />
                  <Info label="التصنيفات المتوفرة" value={productAnalysisSummary.categories.join("، ") || "غير محددة"} />
                  <Info label="ملاحظات تحسين المنتجات" value={productAnalysisSummary.notes.join(" ")} />
                </div>
              </Card>

              <Card className="strategy-card">
                <SectionHeader
                  icon={Sparkles}
                  title="الخطة الاستراتيجية للمتجر"
                  description="تستخدم لاحقًا كاقتراحات في معالج الحملة ولا تعدل الحملات ملف المتجر تلقائيًا."
                />
                <Notice>
                  هذه الخطة مخرج واجهي مبني على بيانات الإعداد الحالية ومحاكاة فحص المتجر. التنفيذ الفعلي لاحقًا يحتاج Backend وتحليل بيانات حقيقي.
                </Notice>

                <div className="strategy-section plan-status-section">
                  <div className="strategy-section-head">
                    <div>
                      <h3>حالة الخطة الاستراتيجية</h3>
                      <p className="strategy-helper">حفظ واجهي تجريبي؛ تستخدمها الصفحات الأخرى كمرجع واجهي. لا تعدل الحملات الخطة تلقائيًا.</p>
                    </div>
                    <Badge tone={latestStrategicPlan ? "green" : "amber"}>
                      {latestStrategicPlan ? "محفوظ كمسودة واجهية" : "غير محفوظة"}
                    </Badge>
                  </div>
                  <div className="strategy-facts">
                    <Info label="حالة الخطة" value={latestStrategicPlan?.status === "ready_for_review" ? "جاهزة للمراجعة" : latestStrategicPlan ? "مسودة" : "غير محفوظة"} />
                    <Info label="رقم النسخة" value={latestStrategicPlan ? `V${latestStrategicPlan.version}` : "V0"} />
                    <Info label="آخر تحديث" value={latestStrategicPlan?.updatedAt ? new Date(latestStrategicPlan.updatedAt).toLocaleString("ar-SA") : "لا يوجد"} />
                    <Info label="مصدر البيانات المستخدمة" value={(latestStrategicPlan?.sourceInputs || ["بيانات الإعداد الحالية"]).join("، ")} />
                    <Info label="الإجراء التالي" value={readinessIssues.length ? "استكمال النواقص ثم حفظ الخطة كمسودة." : "حفظ الخطة كمسودة ثم استخدامها في الحملة."} />
                  </div>
                  <div className="plan-status-actions">
                    <Button onClick={saveStrategicPlanDraft}><Save size={16} /> حفظ الخطة كمسودة</Button>
                  </div>
                </div>

                <div className="strategy-section">
                  <div className="strategy-section-head">
                    <h3>ملخص التشخيص</h3>
                    <Badge tone={readinessIssues.length ? "amber" : "green"}>{readinessIssues.length ? "تحتاج تحسين" : "جاهزة كبداية"}</Badge>
                  </div>
                  <div className="strategy-facts">
                    {strategicPlan.summary.map(([label, value]) => (
                      <Info key={label} label={label} value={value} />
                    ))}
                  </div>
                </div>

                <div className="strategy-grid">
                  <div className="strategy-section">
                    <h3>الجمهور الاستراتيجي</h3>
                    <div className="strategy-facts compact">
                      {strategicPlan.audience.map(([label, value]) => (
                        <Info key={label} label={label} value={value} />
                      ))}
                    </div>
                  </div>

                  <div className="strategy-section">
                    <h3>الرسائل التسويقية</h3>
                    <div className="strategy-facts compact">
                      {strategicPlan.messaging.map(([label, value]) => (
                        <Info key={label} label={label} value={value} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="strategy-section social-signal-section">
                  <h3>إشارات التحليل الاجتماعي</h3>
                  <p className="strategy-helper">هذه إشارات واجهية مرتبطة بتصميم موصلات التحليل الاجتماعي. لا يتم سحب بيانات فعلية دون Backend وتكاملات مصرح بها.</p>
                  <div className="strategy-facts">
                    <Info label="أقوى قناة اجتماعية" value={strategicPlan.channels.primary[0] || "Instagram"} />
                    <Info label="فرصة محتوى اجتماعي" value="Reels أو TikTok قصير للمنتج الأعلى أولوية." />
                    <Info label="خطر اجتماعي" value="استخدام مؤشرات اجتماعية دون موافقة أو مراجعة امتثال." />
                    <Info label="فجوة أصول اجتماعية" value="فيديو قصير وصورة استخدام للمنتج." />
                    <Info label="الإجراء التالي" value="تجهيز موصل مصرح به قبل الاعتماد على أي تحليل اجتماعي." />
                  </div>
                </div>

                <div className="strategy-section">
                  <div className="strategy-section-head">
                    <h3>المنتجات ذات الأولوية</h3>
                    <Badge tone="neutral">{strategicPlan.priorityProducts.length} منتج</Badge>
                  </div>
                  {strategicPlan.priorityProducts.length ? (
                    <div className="priority-product-grid">
                      {strategicPlan.priorityProducts.map((product) => (
                        <div key={product.name} className="priority-product-card">
                          <strong>{product.name}</strong>
                          <span>سبب الأولوية: {product.reason}</span>
                          <span>القناة الأنسب: {product.bestChannel}</span>
                          <span>نوع المحتوى المقترح: {product.contentType}</span>
                          <span>النقص المطلوب استكماله: {product.gap}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-strategy">لا توجد منتجات كافية لبناء أولوية تسويقية.</div>
                  )}
                </div>

                <div className="strategy-section">
                  <h3>استراتيجية القنوات</h3>
                  <p className="strategy-helper">اختيار القنوات هنا لا يعني نشرًا تلقائيًا؛ القنوات تستخدم لاحقًا داخل الحملات بعد المراجعة.</p>
                  <div className="channel-strategy-grid">
                    <ChannelPlan title="قنوات أساسية" channels={strategicPlan.channels.primary} />
                    <ChannelPlan title="قنوات ثانوية" channels={strategicPlan.channels.secondary} />
                    <ChannelPlan title="قنوات مؤجلة" channels={strategicPlan.channels.deferred} />
                  </div>
                </div>

                <div className="strategy-section">
                  <h3>خطة 30 / 60 / 90 يوم</h3>
                  <div className="timeline-grid">
                    <TimelineCard title="أول 30 يوم" text="تجهيز وتحسين البيانات والأصول، ومراجعة السياسات والقنوات الأساسية." />
                    <TimelineCard title="60 يوم" text="حملات اختبار على المنتجات ذات الأولوية مع قياس الرسائل والقنوات." />
                    <TimelineCard title="90 يوم" text="توسع وتحسين بناءً على الأداء والنتائج المتراكمة من الحملات." />
                  </div>
                </div>

                <div className="strategy-grid">
                  <div className="strategy-section">
                    <h3>المخاطر والفجوات</h3>
                    {strategicPlan.risks.length ? strategicPlan.risks.map((risk) => (
                      <div key={risk} className="issue-row"><AlertTriangle size={16} /><span>{risk}</span></div>
                    )) : (
                      <div className="issue-row ok"><CheckCircle2 size={16} /><span>لا توجد فجوات حرجة في الخطة الحالية.</span></div>
                    )}
                  </div>
                  <div className="strategy-section next-action-card">
                    <h3>الإجراء التالي</h3>
                    <strong>{strategicPlan.nextAction}</strong>
                    <p>كتالوج المنتجات يعرّف المنتج ووسائطه. مكتبة الأصول تحفظ الصور والفيديوهات القابلة للاستخدام. معالج الحملة يختار من الأصول المتاحة ولا يصبح مالكًا للكتالوج.</p>
                    <Button onClick={handleCreateCampaign}><Sparkles size={16} /> إنشاء حملة اختبارية</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <aside className="smart-panel"><SmartBox step={step} /></aside>
      </section>

      <Footer step={step} total={steps.length} back={back} next={next} nextLabel={step < steps.length ? "التالي" : "إنهاء الإعداد"} saveDraft={saveDraft} />

      {actionNotice ? (<div className="action-notice"><CheckCircle2 size={18} /> {actionNotice}</div>) : null}
      {saved && (<div className="saved-toast"><CheckCircle2 size={18} /> تم حفظ المسودة محليًا داخل الواجهة فقط.</div>)}
    </main>
  );
}
