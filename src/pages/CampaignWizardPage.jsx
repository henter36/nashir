import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Megaphone,
  Plus,
  RefreshCw,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

import {
  readProductCatalog,
  upsertProduct,
} from "../utils/productCatalogStore.js";

import {
  deriveMetricsFromCampaigns,
  refreshDashboardSummary,
  upsertCampaign,
  writeCampaignMetrics,
} from "../utils/campaignAnalyticsStore.js";

import {
  readAssetLibrary,
  upsertAsset,
} from "../utils/assetLibraryStore.js";

import {
  upsertCampaignContentItem,
} from "../utils/campaignContentStore.js";

import {
  readLatestStoreStrategicPlan,
} from "../utils/storeStrategicPlanStore.js";

import {
  readPromptRegistry,
} from "../utils/promptTemplateStore.js";

import {
  readModelRoutes,
} from "../utils/modelCostStore.js";

import {
  goals,
  occasions,
  languageOptions,
  ageGroupOptions,
  genderOptions,
  ctaOptions,
  channelOptions,
  outputOptions,
  initialProducts,
  assetFallbackSeed,
  steps,
  productRefKey,
  assetRefKey,
} from "./CampaignWizardPage/constants.js";

import {
  toggleValue,
  buildAssetSnapshot,
  makeCustomerText,
  makeInternalPrompt,
  buildSuggestedCampaignText,
  getApprovalLabel,
  getOutputTypeLabel,
  resolvePromptForOutput,
  resolveRouteForOutput,
  checkOutputFieldsReadiness,
  getPromptStatusArabicLabel,
  buildOutputMockContent,
} from "./CampaignWizardPage/helpers.js";

import { styles } from "./CampaignWizardPage/styles.js";

import {
  PageTitle,
  Card,
  Badge,
  Info,
  AssetSelectionGroup,
  SectionHeader,
  StepTabs,
  Field,
  FileField,
  TextArea,
  ChoiceGroup,
  MultiChoice,
  Metric,
  BriefRow,
  Notice,
  SmartBox,
  Footer,
} from "./CampaignWizardPage/components.jsx";

export default function CampaignWizardPage({
  onOpenCampaign = () => {},
  onOpenContentStudio = () => {},
  onOpenReviewPreview = () => {},
  campaignOrigin = null,
  onNavigate = null,
} = {}) {
  const [step, setStep] = useState(1);
  const [starterNotice, setStarterNotice] = useState("");
  const [showStarterPanel, setShowStarterPanel] = useState(true);

  const [campaignName, setCampaignName] = useState("حملة عطر X - مارس");
  const [goal, setGoal] = useState("زيادة المبيعات");
  const [occasion, setOccasion] = useState("إطلاق منتج");
  const [startDate, setStartDate] = useState("2025-03-10");
  const [endDate, setEndDate] = useState("2025-03-15");
  const [budget, setBudget] = useState("5,000 ريال");

  const [products, setProducts] = useState(() => readProductCatalog(initialProducts));
  const [selectedProductKey, setSelectedProductKey] = useState("p-1");
  const [showQuickProduct, setShowQuickProduct] = useState(false);
  const [quickProduct, setQuickProduct] = useState({
    name: "",
    category: "",
    url: "",
    price: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [availableAssets, setAvailableAssets] = useState(() => {
    const sharedAssets = readAssetLibrary([]);
    return sharedAssets.length ? sharedAssets : assetFallbackSeed;
  });
  const [selectedAssetKeys, setSelectedAssetKeys] = useState([]);
  const [assetDraft, setAssetDraft] = useState({
    name: "",
    type: "image",
    url: "",
  });
  const [assetNotice, setAssetNotice] = useState("");

  const [offer, setOffer] = useState("خصم");
  const [cta, setCta] = useState("اطلب الآن");

  const [ageGroup, setAgeGroup] = useState("25–34");
  const [gender, setGender] = useState("الكل");
  const [language, setLanguage] = useState("العربية");
  const [channels, setChannels] = useState(["Instagram", "TikTok", "Email"]);

  const [outputs, setOutputs] = useState(["Caption", "Story", "Carousel", "Reel قصير"]);
  const [copies, setCopies] = useState("3 نسخ");
  const [videoDuration, setVideoDuration] = useState("15 ثانية");
  const [style, setStyle] = useState("مباشر");

  const [generatedTexts, setGeneratedTexts] = useState({});
  const [textApprovalStatus, setTextApprovalStatus] = useState("unapproved");
  const [, setOutputApprovalStatus] = useState({});
  const [outputGenerationState, setOutputGenerationState] = useState({});
  const [generatedOutputContent, setGeneratedOutputContent] = useState({});
  const [selectedOutputPrompts, setSelectedOutputPrompts] = useState({});
  const [promptRegistry, setPromptRegistry] = useState([]);
  const [modelRoutes, setModelRoutes] = useState([]);
  const [campaignGenerated, setCampaignGenerated] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");
  const [latestStrategicPlan, setLatestStrategicPlan] = useState(() =>
    readLatestStoreStrategicPlan(null)
  );

  useEffect(() => {
    const refreshProducts = () => {
      setProducts(readProductCatalog(initialProducts));
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
    const refreshAssets = () => {
      const sharedAssets = readAssetLibrary([]);
      setAvailableAssets(sharedAssets.length ? sharedAssets : assetFallbackSeed);
    };

    window.addEventListener("focus", refreshAssets);
    window.addEventListener("storage", refreshAssets);
    window.addEventListener("nashir-asset-library-updated", refreshAssets);

    return () => {
      window.removeEventListener("focus", refreshAssets);
      window.removeEventListener("storage", refreshAssets);
      window.removeEventListener("nashir-asset-library-updated", refreshAssets);
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

  useEffect(() => {
    const refresh = () => {
      try { setPromptRegistry(readPromptRegistry([])); } catch { setPromptRegistry([]); }
      try { setModelRoutes(readModelRoutes([])); } catch { setModelRoutes([]); }
    };
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("nashir-prompt-governance-updated", refresh);
    window.addEventListener("nashir-model-routing-updated", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("nashir-prompt-governance-updated", refresh);
      window.removeEventListener("nashir-model-routing-updated", refresh);
    };
  }, []);

  const selectedProduct = products.find((product) => product.id === selectedProductKey) || products[0];

  const selectedAssets = useMemo(
    () => availableAssets.filter((asset) => selectedAssetKeys.includes(asset.id)),
    [availableAssets, selectedAssetKeys]
  );

  const productLinkedAssets = useMemo(
    () => availableAssets.filter((asset) => asset.linkedType === "product" && asset.linkedName === selectedProduct?.name),
    [availableAssets, selectedProduct?.name]
  );

  const generalAssets = useMemo(
    () => availableAssets.filter((asset) => !(asset.linkedType === "product" && asset.linkedName === selectedProduct?.name)),
    [availableAssets, selectedProduct?.name]
  );

  const selectedHasImage = selectedAssets.some((asset) => asset.type === "image");
  const selectedHasVideo = selectedAssets.some((asset) => asset.type === "video");
  const storePlanSuggestions = useMemo(() => {
    const planJson = latestStrategicPlan?.planJson || {};
    const planPriorityProducts = Array.isArray(planJson.priorityProducts) ? planJson.priorityProducts : [];
    const planMessaging = Array.isArray(planJson.messaging) ? planJson.messaging : [];
    const planChannels = planJson.channels || {};
    const planTopProduct = planPriorityProducts[0];
    const planProductMatch = planPriorityProducts.find((product) => product.name === selectedProduct?.name) || planTopProduct;
    const planCta = planMessaging.find((row) => Array.isArray(row) && row[0] === "CTA مقترح")?.[1];
    const flags = selectedProduct?.flags || [];
    const productAssets = availableAssets.filter(
      (asset) => asset.linkedType === "product" && asset.linkedName === selectedProduct?.name
    );
    const hasImageAsset = productAssets.some((asset) => asset.type === "image");
    const hasVideoAsset = productAssets.some((asset) => asset.type === "video");
    const videoReady = flags.includes("يصلح للفيديو") || Boolean(selectedProduct?.videoUrl) || hasVideoAsset;
    const giftReady = flags.includes("مناسب للهدايا") || flags.includes("موسمي");
    const suggestedChannel = videoReady
      ? "Instagram / TikTok"
      : giftReady
        ? "WhatsApp Business / Email"
        : channels[0] || "Instagram";
    const suggestedContentType = videoReady
      ? "فيديو قصير / Reel"
      : giftReady
        ? "منشور عرض أو رسالة مباشرة"
        : "منشور تعريفي";
    const suggestedCta = channels.includes("WhatsApp Business") ? "تواصل معنا" : cta || "تسوق الآن";
    const assetGap = !selectedProduct
      ? "اختر المنتج أولًا لرؤية تنبيه الأصول."
      : !hasImageAsset
        ? "يحتاج صورة منتج واضحة قبل الحملة."
        : !hasVideoAsset && videoReady
          ? "يفضل إضافة أصل فيديو لهذا المنتج."
          : "لا يوجد نقص أصول واضح كبداية.";

    return {
      product: planProductMatch?.name || selectedProduct?.name || "غير محدد",
      channel: planProductMatch?.bestChannel || planChannels.primary?.[0] || suggestedChannel,
      contentType: planProductMatch?.contentType || suggestedContentType,
      cta: planCta || suggestedCta,
      assetGap: planProductMatch?.gap && planProductMatch.gap !== "لا يوجد نقص واضح" ? planProductMatch.gap : assetGap,
      hasSavedPlan: Boolean(latestStrategicPlan),
    };
  }, [availableAssets, channels, cta, latestStrategicPlan, selectedProduct]);

  const readiness = useMemo(() => {
    const checks = [
      campaignName,
      goal,
      selectedProductKey,
      startDate,
      endDate,
      budget,
      offer,
      cta,
      ageGroup,
      gender,
      language,
      channels.length,
      outputs.length,
      copies,
      style,
    ];

    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [
    ageGroup,
    budget,
    campaignName,
    channels.length,
    copies,
    cta,
    endDate,
    gender,
    goal,
    language,
    offer,
    outputs.length,
    selectedProductKey,
    startDate,
    style,
  ]);

  const briefRows = [
    ["اسم الحملة", campaignName],
    ["الهدف", goal],
    ["المنتج", selectedProduct?.name || "غير محدد"],
    ["الفئة العمرية", ageGroup],
    ["الجنس", gender],
    ["القنوات", channels.join("، ")],
    ["العرض", offer],
    ["دعوة الإجراء", cta],
    ["الميزانية", budget],
    ["التواريخ", `${startDate} → ${endDate}`],
    ["المخرجات", outputs.join("، ")],
    ["الأصول المتاحة", selectedAssets.length ? selectedAssets.map((asset) => asset.name).join("، ") : "لم يتم اختيار أصول"],
  ];

  const canGenerate = readiness >= 60;
  const suggestedCampaignText = useMemo(
    () =>
      buildSuggestedCampaignText({
        productName: selectedProduct?.name,
        goal,
        offer,
        audience: `${ageGroup || "غير محدد"} · ${gender || "الكل"}`,
        cta,
        channels,
        assets: selectedAssets,
      }),
    [ageGroup, channels, cta, gender, goal, offer, selectedAssets, selectedProduct?.name]
  );
  const textApproved = textApprovalStatus === "approved";
  const generatedOutputCount = outputs.filter((output) => {
    const s = outputGenerationState[output];
    return s === "generated" || s === "approved" || s === "needs_edit";
  }).length;
  const approvedOutputCount = outputs.filter((output) => outputGenerationState[output] === "approved").length;
  const outputsNeedingEditCount = outputs.filter((output) => outputGenerationState[output] === "needs_edit").length;
  const allRequiredGenerated = outputs.length > 0 && generatedOutputCount === outputs.length;
  const allRequiredApproved = outputs.length > 0 && approvedOutputCount === outputs.length;
  const campaignFullyReady = textApproved && allRequiredGenerated && allRequiredApproved;
  const campaignOutputReadiness = !textApproved
    ? "النص الأساسي لم يعتمد بعد."
    : !allRequiredGenerated
      ? `الحملة غير جاهزة — ${outputs.length - generatedOutputCount} مخرج لم يُولَّد بعد.`
      : !allRequiredApproved
        ? "الحملة غير جاهزة — توجد مخرجات غير معتمدة."
        : "الحملة جاهزة للمراجعة النهائية.";

  const addQuickProduct = () => {
    if (!quickProduct.name.trim()) return;

    const product = {
      id: `p-${Date.now()}`,
      name: quickProduct.name,
      category: quickProduct.category,
      url: quickProduct.url,
      price: quickProduct.price,
      description: quickProduct.description,
      imageUrl: quickProduct.imageUrl,
      videoUrl: quickProduct.videoUrl,
    };

    const nextProducts = upsertProduct(product, initialProducts);
    setProducts(nextProducts);
    setSelectedProductKey(product.id);
    setQuickProduct({ name: "", category: "", url: "", price: "", description: "", imageUrl: "", videoUrl: "" });
    setShowQuickProduct(false);
  };

  const toggleAssetSelection = (asset) => {
    setSelectedAssetKeys((prev) => toggleValue(prev, asset.id));
  };

  const addWizardAsset = () => {
    if (!selectedProduct) {
      setAssetNotice("اختر المنتج أولًا حتى يتم ربط الأصل بالحملة بشكل صحيح.");
      return;
    }

    if (!assetDraft.name.trim()) return;

    const asset = {
      id: `wiz-asset-${Date.now()}`,
      [assetRefKey]: `wiz-asset-${Date.now()}`,
      name: assetDraft.name.trim(),
      type: assetDraft.type,
      url: assetDraft.url,
      thumbnailUrl: "",
      linkedType: "product",
      linkedName: selectedProduct.name,
      channel: channels[0] || "",
      status: "review",
      rightsStatus: "needs_check",
      quality: "medium",
      tags: ["حملة", selectedProduct.name],
      notes: "أصل أضيف من معالج الحملة ويحتاج مراجعة قبل الاستخدام.",
    };

    const nextAssets = upsertAsset(asset, []);
    setAvailableAssets(nextAssets);
    setSelectedAssetKeys((prev) => Array.from(new Set([...prev, asset.id])));
    setAssetDraft({ name: "", type: "image", url: "" });
    setAssetNotice("تمت إضافة الأصل وربطه بالمنتج الحالي.");
  };

  const regenerateOutputText = (output) => {
    const customerText = makeCustomerText({
      output,
      productName: selectedProduct?.name || "المنتج",
      goal,
      offer,
      cta,
      ageGroup,
      gender,
      style,
      videoDuration,
    });

    const internalPrompt = makeInternalPrompt({
      output,
      productName: selectedProduct?.name || "المنتج",
      goal,
      offer,
      cta,
      ageGroup,
      gender,
      style,
    });

    setGeneratedTexts((prev) => ({
      ...prev,
      [output]: {
        customerText,
        internalPrompt,
        regeneratedAt: new Date().toLocaleTimeString("ar-SA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    }));
  };

  const regenerateAllOutputs = () => {
    outputs.forEach((output) => regenerateOutputText(output));
    setCampaignGenerated(true);
  };

  const next = () => {
    if (step < 5) setStep((current) => current + 1);
  };

  const back = () => {
    if (step > 1) setStep((current) => current - 1);
  };

  const saveCampaignDraft = () => {
    if (!canGenerate) return;
    setCampaignGenerated(true);

    const campaignId = `campaign_${Date.now()}`;
    const productSnapshot = selectedProduct
      ? {
          name: selectedProduct.name || "غير محدد",
          price: selectedProduct.price || "",
          category: selectedProduct.category || "",
          imageUrl: selectedProduct.imageUrl || "",
          readiness: selectedProduct.readiness ?? "",
        }
      : null;
    const campaignSnapshot = {
      name: campaignName,
      goal,
      status: "draft",
      product: productSnapshot?.name || selectedProduct?.name || "غير محدد",
    };
    const campaignOutputs = outputs.map((output) => {
      const generated = generatedTexts[output];

      return [
        output,
        "مسودة",
        channels[0] || "عام",
        generated?.customerText || makeCustomerText({
          output,
          productName: selectedProduct?.name || "المنتج",
          goal,
          offer,
          cta,
          ageGroup,
          gender,
          style,
          videoDuration,
        }),
      ];
    });

    const numericBudget = Number(String(budget).replace(/[^0-9.]/g, "")) || 0;

    const campaign = {
      id: campaignId,
      campaignId,
      name: campaignName,
      product: selectedProduct?.name || "غير محدد",
      [productRefKey]: selectedProduct?.id || "",
      productSnapshot,
      goal,
      status: "draft",
      stage: "مخرجات أولية قابلة للمراجعة",
      owner: "أنت",
      budget,
      budgetValue: numericBudget,
      readiness,
      offer,
      cta,
      ageGroup,
      gender,
      selectedAssetCount: selectedAssets.length,
      selectedAssets: selectedAssets.map((asset) => ({
        [assetRefKey]: asset[assetRefKey] || asset.id || "",
        assetSnapshot: buildAssetSnapshot(asset),
        name: asset.name,
        type: asset.type,
        linkedName: asset.linkedName,
      })),
      strategicPlanSnapshot: latestStrategicPlan
        ? {
            version: latestStrategicPlan.version,
            recommendations: {
              channel: storePlanSuggestions.channel,
              contentType: storePlanSuggestions.contentType,
              cta: storePlanSuggestions.cta,
              assetGap: storePlanSuggestions.assetGap,
            },
          }
        : null,
      channels,
      channel: channels[0] || "عام",
      outputs: campaignOutputs,
      edits: [["تم إنشاء الحملة من معالج إنشاء الحملة", "أنت", "الآن"]],
      updatedAt: "الآن",
    };

    const nextCampaigns = upsertCampaign(campaign);
    campaignOutputs.forEach(([output, , channel, content], index) => {
      upsertCampaignContentItem(
        {
          id: `${campaignId}_content_${index}`,
          contentId: `${campaignId}_content_${index}`,
          title: `${output} - ${campaignName}`,
          type: output,
          channel: channel || channels[0] || "عام",
          status: "needs_review",
          content,
          campaign: campaignName,
          campaignId,
          campaignSnapshot,
          [productRefKey]: selectedProduct?.id || "",
          productSnapshot,
          approval: "needs_review",
          risk: "medium",
          metadata: {
            campaignId,
            [productRefKey]: selectedProduct?.id || "",
            campaignSnapshot,
            productSnapshot,
            selectedAssets: selectedAssets.map((asset) => ({
              [assetRefKey]: asset[assetRefKey] || asset.id || "",
              assetSnapshot: buildAssetSnapshot(asset),
            })),
            product: selectedProduct?.name || "غير محدد",
          },
        },
        []
      );
    });
    const nextMetrics = deriveMetricsFromCampaigns(nextCampaigns);
    writeCampaignMetrics(nextMetrics);
    refreshDashboardSummary(nextCampaigns, nextMetrics);

    setSaveNotice("تم حفظ الحملة كحالة واجهية تجريبية، وتم تجهيز مخرجات أولية قابلة للمراجعة.");
  };

  return (
    <main className="campaign-wizard-page" dir="rtl">
      <style>{styles}</style>

      <PageTitle
        title="معالج إنشاء الحملة"
        description="معالج محكوم لإنشاء الحملة وتجهيز مخرجاتها قبل المراجعة والنشر."
        status="معتمد"
      />

      <section className="screen-guidance-card">
        <div><span>هدف الشاشة</span><strong>تحويل خطة المتجر والمنتج المختار إلى حملة قابلة للمراجعة.</strong></div>
        <div><span>المدخلات</span><strong>المنتج، الهدف، القناة، الأصول، العرض، الاقتراحات الاستراتيجية والاجتماعية.</strong></div>
        <div><span>المخرجات</span><strong>CampaignBrief ومخرجات أولية قابلة للمراجعة.</strong></div>
        <div><span>الإجراء التالي</span><strong>فتح الحملة أو استوديو المحتوى أو المراجعة والمعاينة.</strong></div>
        <div><span>ما لا يحدث هنا</span><strong>لا يتم نشر الحملة أو توليد AI حقيقي.</strong></div>
      </section>

      {campaignOrigin === "product-intelligence" && showStarterPanel ? (
        <section className="product-intelligence-context-panel">
          <div className="section-title-row">
            <div>
              <h2>بداية حملة من تحليل المنتج</h2>
              <p>
                هذه بطاقة تجريبية توضّح كيف يمكن لاحقًا تحويل تحليل المنتج إلى مدخلات حملة.
                لا يتم إنشاء حملة فعلية أو تمرير بيانات محفوظة في هذا النموذج.
              </p>
            </div>
            <div className="context-badges">
              <Badge tone="blue">Prototype</Badge>
              <Badge tone="neutral">لا يوجد إنشاء فعلي</Badge>
              <Badge tone="neutral">لا يوجد تمرير بيانات</Badge>
            </div>
          </div>

          <div className="starter-section">
            <h3>ملخص المنتج المصغر</h3>
            <div className="starter-summary-grid">
              <div><span>المنتج التجريبي</span><strong>هدية نباتية مكتبية</strong></div>
              <div><span>الفئة</span><strong>هدايا / ديكور مكتبي</strong></div>
              <div><span>نقطة البيع</span><strong>منتج جاهز للإهداء والاستخدام اليومي</strong></div>
              <div><span>حالة البيانات</span><strong>Demo فقط</strong></div>
            </div>
          </div>

          <div className="starter-section">
            <h3>اتجاه الحملة المقترح</h3>
            <div className="context-preview-grid">
              <div><span>هدف مقترح</span><strong>اختبار قابلية بيع المنتج</strong></div>
              <div><span>جمهور مقترح</span><strong>المهتمون بالهدايا والمنتجات العملية</strong></div>
              <div><span>زاوية رسالة</span><strong>هدية بسيطة تبقى على المكتب</strong></div>
              <div><span>مخاطرة يجب اختبارها</span><strong>وضوح الخامة والسعر قبل الإعلان</strong></div>
            </div>
          </div>

          <div className="starter-lists-grid">
            <div className="starter-list-card">
              <h3>ما الذي سيُستخدم لاحقًا؟</h3>
              <ul>
                <li>ملخص المنتج</li>
                <li>زوايا الإعلان</li>
                <li>توصيات التطوير</li>
                <li>تقويم 7 أيام</li>
                <li>مصفوفة المخاطر والفرص</li>
              </ul>
            </div>
            <div className="starter-list-card muted">
              <h3>ما الذي لا يحدث الآن؟</h3>
              <ul>
                <li>لا إنشاء حملة فعلية</li>
                <li>لا حفظ بيانات</li>
                <li>لا تمرير بيانات حقيقية</li>
                <li>لا اتصال API</li>
                <li>لا اعتماد توصيات الموردين</li>
              </ul>
            </div>
          </div>

          <div className="starter-actions">
            <button
              type="button"
              className="button primary"
              onClick={() => {
                setShowStarterPanel(false);
                setStarterNotice("يمكنك متابعة إعداد الحملة يدويًا في النموذج التجريبي.");
              }}
            >
              متابعة إعداد الحملة
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                if (typeof onNavigate === "function") {
                  onNavigate("productIntelligence");
                  return;
                }
                setStarterNotice("العودة لتحليل المنتج غير متاحة من هذه الصفحة حاليًا.");
              }}
            >
              العودة لتحليل المنتج
            </button>
          </div>
        </section>
      ) : null}

      {starterNotice ? <p className="context-demo-note starter-notice-outside">{starterNotice}</p> : null}

      <StepTabs steps={steps} step={step} setStep={setStep} />

      <div className="wizard-layout">
        <section className="wizard-main">
          {step === 1 && (
            <Card>
              <SectionHeader
                icon={Megaphone}
                title="الخطوة 1: أساسيات الحملة"
                description="تم حذف نوع الحملة وأولوية الحملة لتخفيف الإدخال، مع إضافة اختصار لإضافة منتج من اختيار المنتجات."
              />

              <div className="form-grid">
                <Field label="اسم الحملة" value={campaignName} onChange={setCampaignName} />

                <ChoiceGroup title="هدف الحملة" options={goals} selected={goal} setSelected={setGoal} />

                <div className="field product-picker-field">
                  <span>المنتج / المنتجات المستهدفة</span>
                  <div className="product-picker-row">
                    <select
                      value={selectedProductKey}
                      onChange={(event) => setSelectedProductKey(event.target.value)}
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} — {product.price || "السعر غير محدد"}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="button secondary compact"
                      onClick={() => setShowQuickProduct((value) => !value)}
                    >
                      <Plus size={16} />
                      إضافة منتج سريع
                    </button>
                  </div>

                  <small>
                    Picker من قائمة المتجر — ويمكن إضافة منتج سريعًا دون مغادرة المعالج.
                  </small>
                </div>

                {showQuickProduct && (
                  <div className="quick-product-box">
                    <div className="quick-product-header">
                      <strong>إضافة بيانات منتج سريعًا</strong>
                      <button type="button" onClick={() => setShowQuickProduct(false)}>
                        <X size={16} />
                      </button>
                    </div>

                    <div className="form-grid compact-grid">
                      <Field
                        label="اسم المنتج"
                        value={quickProduct.name}
                        onChange={(value) => setQuickProduct((prev) => ({ ...prev, name: value }))}
                      />
                      <Field
                        label="التصنيف"
                        value={quickProduct.category}
                        onChange={(value) => setQuickProduct((prev) => ({ ...prev, category: value }))}
                      />
                      <Field
                        label="رابط المنتج"
                        value={quickProduct.url}
                        onChange={(value) => setQuickProduct((prev) => ({ ...prev, url: value }))}
                      />
                      <Field
                        label="السعر"
                        value={quickProduct.price}
                        onChange={(value) => setQuickProduct((prev) => ({ ...prev, price: value }))}
                      />
                      <FileField
                        label="إرفاق صورة"
                        accept="image/*"
                        value={quickProduct.imageUrl}
                        onFile={(file) => setQuickProduct((prev) => ({ ...prev, imageUrl: file ? `إرفاق تجريبي: ${file.name}` : prev.imageUrl }))}
                      />
                      <FileField
                        label="إرفاق فيديو"
                        accept="video/*"
                        value={quickProduct.videoUrl}
                        onFile={(file) => setQuickProduct((prev) => ({ ...prev, videoUrl: file ? `إرفاق تجريبي: ${file.name}` : prev.videoUrl }))}
                      />
                      <TextArea
                        label="وصف مختصر"
                        value={quickProduct.description}
                        onChange={(value) => setQuickProduct((prev) => ({ ...prev, description: value }))}
                      />
                    </div>

                    <button type="button" className="button primary" onClick={addQuickProduct}>
                      حفظ المنتج واختياره
                    </button>
                  </div>
                )}

                <div className="store-plan-suggestions">
                  <div className="suggestion-head">
                    <div>
                      <h3>اقتراحات مبنية على خطة المتجر</h3>
                      <p>{storePlanSuggestions.hasSavedPlan ? "هذه اقتراحات من آخر خطة استراتيجية محفوظة. يمكن تعديلها داخل الحملة، ولا يتم تعديل الخطة تلقائيًا." : "لا توجد خطة استراتيجية محفوظة؛ يمكن إنشاء الحملة يدويًا."}</p>
                    </div>
                    <Badge tone="blue">{storePlanSuggestions.hasSavedPlan ? "آخر خطة استراتيجية محفوظة" : "اقتراحات فقط"}</Badge>
                  </div>
                  <div className="asset-readiness-summary compact">
                    <Info label="المنتج المقترح" value={storePlanSuggestions.product} />
                    <Info label="القناة المقترحة" value={storePlanSuggestions.channel} />
                    <Info label="نوع المحتوى المقترح" value={storePlanSuggestions.contentType} />
                    <Info label="CTA مقترح" value={storePlanSuggestions.cta} />
                    <Info label="تنبيه نقص الأصول إن وجد" value={storePlanSuggestions.assetGap} />
                  </div>
                  <small>لا تعدل الحملات الخطة تلقائيًا. عند إنشاء الحملة لاحقًا، يجب حفظ نسخة من توصيات الخطة وقت الإنشاء.</small>
                  <small>تحفظ الحملة معرف المنتج ونسخة من بيانات المنتج وقت الإنشاء كمرجع واجهي. لا يتم تعديل المنتج أو الخطة تلقائيًا.</small>
                  <small>عند استخدام الأصل في حملة، تحفظ الحملة نسخة من بيانات الأصل وقت الاختيار.</small>
                </div>

                <div className="store-plan-suggestions social-campaign-suggestions">
                  <div className="suggestion-head">
                    <div>
                      <h3>اقتراحات اجتماعية للحملة</h3>
                      <p>هذه اقتراحات قابلة للتعديل ولا تعني سحب بيانات أو نشرًا تلقائيًا.</p>
                    </div>
                    <Badge tone="blue">UI فقط</Badge>
                  </div>
                  <div className="asset-readiness-summary compact">
                    <Info label="القناة الاجتماعية المقترحة" value={storePlanSuggestions.channel} />
                    <Info label="صيغة المحتوى المقترحة" value={storePlanSuggestions.contentType} />
                    <Info label="Hook مقترح" value={`ابدأ بسؤال قصير عن ${selectedProduct?.name || "المنتج"}.`} />
                    <Info label="CTA اجتماعي مقترح" value={storePlanSuggestions.cta} />
                    <Info label="تنبيه نقص الأصول الاجتماعية" value={storePlanSuggestions.assetGap} />
                  </div>
                </div>

                <Field label="تاريخ البداية" value={startDate} onChange={setStartDate} />
                <Field label="تاريخ النهاية" value={endDate} onChange={setEndDate} />
                <Field label="الميزانية" value={budget} onChange={setBudget} />

                <ChoiceGroup
                  title="هل توجد مناسبة مرتبطة؟"
                  options={occasions}
                  selected={occasion}
                  setSelected={setOccasion}
                />
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <SectionHeader
                icon={UploadCloud}
                title="الخطوة 2: الأصول المتاحة"
                description="المخرجات يجب أن تُبنى على ما هو متاح فعليًا من صور وفيديو وهوية."
              />

              <Notice tone="neutral">
                اختر الأصول التي ستُستخدم في هذه الحملة. الأصول المرتبطة بالمنتج تظهر أولًا.
                معالج الحملة يختار من الأصول المتاحة ولا يصبح مالكًا للكتالوج.
              </Notice>

              <div className="asset-step-header">
                <Badge tone="blue">{selectedAssets.length} أصل مختار</Badge>
                <span>المنتج المحدد: {selectedProduct?.name || "غير محدد"}</span>
              </div>

              <div className="asset-readiness-summary">
                <Info label="المنتج المحدد" value={selectedProduct?.name || "غير محدد"} />
                <Info label="عدد الأصول المرتبطة بالمنتج" value={String(productLinkedAssets.length)} />
                <Info label="عدد الأصول المختارة" value={String(selectedAssets.length)} />
                <Info label="هل يوجد أصل صورة؟" value={selectedHasImage ? "نعم" : "لا"} />
                <Info label="هل يوجد أصل فيديو؟" value={selectedHasVideo ? "نعم" : "لا"} />
              </div>

              {!productLinkedAssets.length ? (
                <Notice tone="amber">لا توجد أصول مرتبطة بهذا المنتج. يمكنك رفع أصل جديد وسيتم ربطه بالمنتج الحالي.</Notice>
              ) : null}

              <AssetSelectionGroup
                title="أصول مرتبطة بالمنتج الحالي"
                assets={productLinkedAssets}
                selectedAssetKeys={selectedAssetKeys}
                selectedProduct={selectedProduct}
                onToggle={toggleAssetSelection}
              />

              <AssetSelectionGroup
                title="أصول عامة أو غير مرتبطة"
                assets={generalAssets}
                selectedAssetKeys={selectedAssetKeys}
                selectedProduct={selectedProduct}
                onToggle={toggleAssetSelection}
              />

              <div className="form-grid">
                <Field
                  label="اسم الأصل"
                  value={assetDraft.name}
                  onChange={(value) => setAssetDraft((prev) => ({ ...prev, name: value }))}
                  placeholder="مثال: صورة المنتج الرئيسية"
                />
                <label className="field">
                  <span>نوع الأصل</span>
                  <select
                    value={assetDraft.type}
                    onChange={(event) => setAssetDraft((prev) => ({ ...prev, type: event.target.value }))}
                  >
                    <option value="image">صورة</option>
                    <option value="video">فيديو</option>
                    <option value="logo">شعار</option>
                    <option value="document">مستند</option>
                    <option value="design">تصميم</option>
                  </select>
                </label>
                <Field
                  label="رابط الأصل"
                  value={assetDraft.url}
                  onChange={(value) => setAssetDraft((prev) => ({ ...prev, url: value }))}
                  placeholder="https://example.com/asset"
                />
                <FileField
                  label={assetDraft.type === "video" ? "إرفاق فيديو" : "إرفاق صورة"}
                  accept={assetDraft.type === "video" ? "video/*" : "image/*"}
                  value={assetDraft.url}
                  onFile={(file) => setAssetDraft((prev) => ({ ...prev, url: file ? `إرفاق تجريبي: ${file.name}` : prev.url }))}
                />
                <div className="field">
                  <span>إضافة أصل</span>
                  <button type="button" className="button primary" onClick={addWizardAsset}>
                    <Plus size={16} />
                    إضافة وربط بالمنتج
                  </button>
                </div>
              </div>

              {assetNotice ? <Notice tone="amber">{assetNotice}</Notice> : null}
            </Card>
          )}

          {step === 3 && (
            <Card>
              <SectionHeader
                icon={Sparkles}
                title="الخطوة 3: العرض والجمهور"
                description="العرض ودعوة الإجراء والفئة والعمر. القنوات جزء من المخرجات المطلوبة وليست من تعريف الجمهور."
              />

              <div className="form-grid">
                <ChoiceGroup
                  title="العرض"
                  options={["خصم", "شحن مجاني", "باقة", "هدية", "بدون عرض", "عرض مخصص"]}
                  selected={offer}
                  setSelected={setOffer}
                />

                <ChoiceGroup
                  title="دعوة الإجراء"
                  options={ctaOptions}
                  selected={cta}
                  setSelected={setCta}
                />

                <ChoiceGroup
                  title="الفئة العمرية"
                  options={ageGroupOptions}
                  selected={ageGroup}
                  setSelected={setAgeGroup}
                />

                <ChoiceGroup
                  title="الجنس"
                  options={genderOptions}
                  selected={gender}
                  setSelected={setGender}
                />

                <ChoiceGroup
                  title="لغة الحملة"
                  options={languageOptions}
                  selected={language}
                  setSelected={setLanguage}
                />
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <SectionHeader
                icon={FileText}
                title="الخطوة 4: المخرجات المطلوبة"
                description="القنوات جزء من المخرجات المطلوبة وليست من تعريف الجمهور."
              />

              <MultiChoice
                title="المخرجات المطلوبة"
                options={outputOptions}
                selected={outputs}
                setSelected={setOutputs}
              />
              <MultiChoice
                title="القنوات"
                options={channelOptions}
                selected={channels}
                setSelected={setChannels}
              />

              <div className="form-grid">
                <Info label="نوع المخرج" value={outputs.join("، ") || "غير محدد"} />
                <Info label="القنوات" value={channels.join("، ") || "غير محدد"} />
                <ChoiceGroup
                  title="الصيغة / التنسيق إن وجد"
                  options={["نسخة واحدة", "3 نسخ", "5 نسخ"]}
                  selected={copies}
                  setSelected={setCopies}
                />
                <ChoiceGroup
                  title="مدة الفيديو"
                  options={["10 ثواني", "15 ثانية", "30 ثانية", "45 ثانية"]}
                  selected={videoDuration}
                  setSelected={setVideoDuration}
                />
                <Info label="CTA إن وجد" value={cta || "غير محدد"} />
                <ChoiceGroup
                  title="أسلوب المخرج"
                  options={["مباشر", "قصصي", "فاخر", "تعليمي", "ترندي", "هادئ"]}
                  selected={style}
                  setSelected={setStyle}
                />
              </div>
            </Card>
          )}

          {step === 5 && (
            <div className="readiness-layout">
              <Card>
                <SectionHeader
                  icon={CheckCircle2}
                  title="الخطوة 5: Brief + الجاهزية"
                  description="ملخص الحملة مع مخرجات للعميل ومخرجات داخلية للنموذج."
                />

                <div className="metrics-grid">
                  <Metric title="جاهزية الحملة" value={`${readiness}%`} tone={readiness >= 60 ? "green" : "amber"} />
                  <Metric title="المخرجات المطلوبة" value={String(outputs.length)} />
                  <Metric title="القنوات" value={String(channels.length)} />
                  <Metric title="المنتجات" value={String(products.length)} />
                </div>

                <div className="approval-sequence-strip">
                  <span>1. اعتماد النص الأساسي</span>
                  <span>2. توليد المخرجات المطلوبة</span>
                  <span>3. مراجعة المخرجات</span>
                </div>

                <div className="suggested-text-approval-card">
                  <div className="approval-card-head">
                    <div>
                      <h3>اعتماد النص الأساسي</h3>
                      <p>الاعتماد هنا واجهي فقط، ولا يرسل الحملة للنشر.</p>
                    </div>
                    <Badge tone={textApproved ? "green" : textApprovalStatus === "needs_edit" ? "amber" : "neutral"}>
                      {getApprovalLabel(textApprovalStatus)}
                    </Badge>
                  </div>
                  <div className="suggested-campaign-text">
                    <span>النص الأساسي للحملة</span>
                    <strong>{suggestedCampaignText}</strong>
                  </div>
                  <div className="asset-readiness-summary compact">
                    <Info label="حالة اعتماد النص الأساسي" value={getApprovalLabel(textApprovalStatus)} />
                    <Info label="تأثير الجاهزية" value={textApproved ? "النص الأساسي معتمد." : "النص الأساسي لم يعتمد بعد."} />
                  </div>
                  <div className="button-row compact">
                    <button type="button" className="button primary" onClick={() => setTextApprovalStatus("approved")}>
                      اعتماد النص الأساسي
                    </button>
                    <button type="button" className="button secondary" onClick={() => setTextApprovalStatus("needs_edit")}>
                      طلب تعديل النص
                    </button>
                  </div>
                  {!textApproved ? (
                    <Notice tone="amber">النص الأساسي لم يعتمد بعد. اعتماد النص الأساسي مطلوب قبل اعتبار المخرجات جاهزة.</Notice>
                  ) : (
                    <Notice tone="neutral">النص الأساسي معتمد.</Notice>
                  )}
                </div>

                <div className="output-approval-summary-card">
                  <h3>مراجعة مخرجات الحملة</h3>
                  <p>اعتماد النص الأساسي لا يعني اعتماد كل المخرجات. يجب مراجعة كل مخرج مطلوب قبل اعتبار الحملة جاهزة.</p>
                  <div className="asset-readiness-summary compact">
                    <Info label="النص الأساسي معتمد؟" value={textApproved ? "نعم" : "لا"} />
                    <Info label="عدد المخرجات المطلوبة" value={String(outputs.length)} />
                    <Info label="عدد المخرجات المولدة" value={String(generatedOutputCount)} />
                    <Info label="عدد المخرجات المعتمدة" value={String(approvedOutputCount)} />
                    <Info label="عدد المخرجات التي تحتاج تعديل" value={String(outputsNeedingEditCount)} />
                  </div>
                  <Notice tone={campaignFullyReady ? "neutral" : "amber"}>
                    {campaignFullyReady ? "الحملة جاهزة للمراجعة النهائية." : campaignOutputReadiness}
                  </Notice>
                </div>

                <div className="output-generation-readiness-block">
                  <div className="readiness-block-head">
                    <div>
                      <h3>جاهزية توليد المخرجات</h3>
                      <p>بعد اعتماد النص الأساسي، يمكن توليد كل مخرج تجريبيًا حسب نوع المخرج والمطالبة والحقول ومسار النموذج المرتبط.</p>
                    </div>
                    <Badge tone={campaignFullyReady ? "green" : textApproved ? "blue" : "amber"}>
                      {campaignFullyReady ? "جاهز للمراجعة النهائية" : textApproved ? "النص الأساسي معتمد" : "في الانتظار"}
                    </Badge>
                  </div>
                  <div className="asset-readiness-summary compact">
                    <Info label="النص الأساسي معتمد؟" value={textApproved ? "نعم ✓" : "لا"} />
                    <Info label="عدد المخرجات المطلوبة" value={String(outputs.length)} />
                    <Info label="عدد المخرجات المولدة" value={`${generatedOutputCount} / ${outputs.length}`} />
                    <Info label="عدد المخرجات المعتمدة" value={`${approvedOutputCount} / ${outputs.length}`} />
                    <Info label="هل الحملة جاهزة للمراجعة النهائية؟" value={campaignFullyReady ? "نعم" : "لا"} />
                  </div>
                  <div className="readiness-disclaimer-strip">
                    <span>توليد تجريبي</span>
                    <span>لا يوجد استدعاء فعلي للنماذج</span>
                    <span>لا يوجد نشر فعلي</span>
                  </div>
                  <small>يعرض هذا القسم الربط المتوقع بين نوع المخرج والمطالبة والحقول ومسار النموذج.</small>
                </div>

                <div className="brief-grid">
                  {briefRows.map(([label, value]) => (
                    <BriefRow key={label} label={label} value={value} />
                  ))}
                </div>

                <Notice tone="amber">
                  مخرجات تجريبية — لا يوجد استدعاء نموذج ذكاء اصطناعي حقيقي. تظهر هنا نتيجة التوليد الواجهية حتى لا تبدو الحملة محفوظة بصمت.
                </Notice>

                <div className="asset-readiness-summary compact">
                  <Info label="المنتج" value={selectedProduct?.name || "غير محدد"} />
                  <Info label="القنوات" value={channels.join("، ") || "غير محدد"} />
                  <Info label="الأصول المختارة" value={selectedAssets.length ? selectedAssets.map((asset) => asset.name).join("، ") : "لم يتم اختيار أصول"} />
                  <Info label="المخرجات المطلوبة" value={outputs.join("، ") || "غير محدد"} />
                </div>

                <div className="button-row">
                  <button type="button" className="button primary" onClick={regenerateAllOutputs}>
                    <RefreshCw size={16} />
                    توليد/إعادة توليد كل النصوص
                  </button>
                  <button type="button" className="button secondary" disabled={!canGenerate} onClick={saveCampaignDraft}>
                    توليد الحملة
                  </button>
                </div>

                {saveNotice && (
                  <div className="saved-flow-card">
                    <Notice tone="amber">
                      {saveNotice}
                    </Notice>
                    <div className="saved-flow-actions">
                      <button type="button" className="button secondary" onClick={onOpenCampaign}>
                        فتح الحملة
                      </button>
                      <button type="button" className="button secondary" onClick={onOpenContentStudio}>
                        فتح استوديو المحتوى
                      </button>
                      <button type="button" className="button secondary" onClick={onOpenReviewPreview}>
                        فتح المراجعة والمعاينة
                      </button>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <h3 className="section-mini-title">مراجعة مخرجات الحملة</h3>
                <Notice tone="amber">مخرجات تجريبية — لا يوجد استدعاء نموذج ذكاء اصطناعي حقيقي. لا يوجد نشر فعلي.</Notice>
                <Badge tone={campaignGenerated ? "green" : "neutral"}>
                  {campaignGenerated ? "تم عرض مخرجات تجريبية" : "مسودات قابلة للمراجعة"}
                </Badge>

                <div className="output-explanation-list">
                  {!outputs.length ? (
                    <Notice tone="amber">لم يتم اختيار مخرجات مطلوبة بعد. أضف مخرجًا واحدًا على الأقل لمراجعة الجاهزية.</Notice>
                  ) : null}

                  {outputs.map((output) => {
                    const genState = outputGenerationState[output] || "ungenerated";
                    const isGenerated = genState === "generated" || genState === "approved" || genState === "needs_edit";
                    const typeLabel = getOutputTypeLabel(output);

                    const selectedPromptId = selectedOutputPrompts[output];
                    const resolvedPrompt = selectedPromptId
                      ? promptRegistry.find((p) => p.id === selectedPromptId)
                      : resolvePromptForOutput(output, promptRegistry);

                    const resolvedRoute = resolveRouteForOutput(output, modelRoutes);

                    const fieldCheck = checkOutputFieldsReadiness({
                      output,
                      productName: selectedProduct?.name,
                      offer,
                      audience: `${ageGroup || "عام"} · ${gender || "الكل"}`,
                      channels,
                      selectedAssets,
                      cta,
                      videoDuration,
                    });

                    const hasPrompt = Boolean(resolvedPrompt);
                    const hasRoute = Boolean(resolvedRoute);
                    const hasAllFields = fieldCheck.missing.length === 0;
                    const linkageReady = hasPrompt && hasRoute && hasAllFields;
                    const overallLinkageReady = textApproved && linkageReady;

                    const readinessReasons = [];
                    if (!textApproved) readinessReasons.push("اعتمد النص الأساسي قبل توليد المخرجات.");
                    if (!hasPrompt) readinessReasons.push("لا توجد مطالبة مرتبطة بهذا المخرج");
                    if (!hasRoute) readinessReasons.push("لم يتم تحديد نموذج مناسب لهذا النوع من المخرجات");
                    if (!hasAllFields) readinessReasons.push("الحقول المطلوبة غير مكتملة");

                    const readinessLabel = overallLinkageReady ? "جاهز للتوليد التجريبي" : readinessReasons[0] || "غير جاهز";

                    const genStatusLabel = genState === "approved" ? "معتمد" : genState === "generated" ? "مولد" : genState === "needs_edit" ? "يحتاج تعديل" : "غير مولد";
                    const genStatusTone = genState === "approved" ? "green" : genState === "generated" ? "blue" : genState === "needs_edit" ? "amber" : "neutral";

                    const generatedContent = generatedOutputContent[output] || null;

                    const item = generatedTexts[output] || {
                      customerText: makeCustomerText({
                        output,
                        productName: selectedProduct?.name || "المنتج",
                        goal,
                        offer,
                        cta,
                        ageGroup,
                        gender,
                        style,
                        videoDuration,
                      }),
                      internalPrompt: makeInternalPrompt({
                        output,
                        productName: selectedProduct?.name || "المنتج",
                        goal,
                        offer,
                        cta,
                        ageGroup,
                        gender,
                        style,
                      }),
                      regeneratedAt: "مبدئي",
                    };

                    return (
                      <div key={output} className="output-card">
                        <div className="output-card-header">
                          <div>
                            <strong>{typeLabel}</strong>
                            <span>{output}</span>
                          </div>
                          <Badge tone={genStatusTone}>{genStatusLabel}</Badge>
                          <button
                            type="button"
                            className="button secondary compact"
                            onClick={() => regenerateOutputText(output)}
                          >
                            <RefreshCw size={14} />
                            إعادة توليد النص
                          </button>
                        </div>

                        <div className="output-linkage-panel">
                          <div className="linkage-panel-title">
                            <span>ربط التوليد</span>
                            <Badge tone={overallLinkageReady ? "green" : "amber"}>
                              {overallLinkageReady ? "جاهز للتوليد التجريبي" : "غير جاهز"}
                            </Badge>
                          </div>

                          <div className="linkage-info-grid">
                            <Info label="نوع المخرج" value={typeLabel} />
                            <Info
                              label="المطالبة المرتبطة"
                              value={resolvedPrompt ? resolvedPrompt.name : "لا توجد مطالبة مرتبطة بهذا المخرج"}
                            />
                            {resolvedPrompt ? (
                              <Info label="حالة المطالبة" value={getPromptStatusArabicLabel(resolvedPrompt.status)} />
                            ) : null}
                            <Info
                              label="النموذج المستخدم"
                              value={resolvedRoute ? (resolvedRoute.taskType || "مسار توليد عام") : "لم يتم تحديد نموذج مناسب لهذا النوع من المخرجات"}
                            />
                            <Info
                              label="مسار النموذج"
                              value={resolvedRoute ? resolvedRoute.taskType : "—"}
                            />
                            <Info
                              label="حالة المسار"
                              value={resolvedRoute ? (resolvedRoute.governance?.humanReviewRequired ? "يتطلب مراجعة" : "جاهز") : "غير متاح"}
                            />
                          </div>

                          {!resolvedPrompt && promptRegistry.length > 0 ? (
                            <div className="linkage-prompt-select">
                              <span>اختر مطالبة من القائمة:</span>
                              <select
                                value={selectedOutputPrompts[output] || ""}
                                onChange={(e) => setSelectedOutputPrompts((prev) => ({ ...prev, [output]: e.target.value }))}
                              >
                                <option value="">— اختر مطالبة —</option>
                                {promptRegistry.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name} ({getPromptStatusArabicLabel(p.status)})
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null}

                          {!promptRegistry.length ? (
                            <div className="linkage-empty-notice">لا توجد مطالبات متاحة. أضف المطالبات من حوكمة المطالبات.</div>
                          ) : null}

                          <div className="fields-readiness-grid">
                            <div className="fields-group">
                              <span>الحقول الجاهزة</span>
                              <div className="fields-chip-row">
                                {fieldCheck.ready.length ? fieldCheck.ready.map((f) => (
                                  <span key={f} className="field-chip ready">{f}</span>
                                )) : <span className="field-chip missing">لا توجد حقول جاهزة</span>}
                              </div>
                            </div>
                            {fieldCheck.missing.length > 0 ? (
                              <div className="fields-group">
                                <span>الحقول الناقصة</span>
                                <div className="fields-chip-row">
                                  {fieldCheck.missing.map((f) => (
                                    <span key={f} className="field-chip missing">{f}</span>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>

                          <div className="linkage-readiness-row">
                            <Info label="حالة الجاهزية" value={readinessLabel} />
                            {readinessReasons.length > 0 ? (
                              <Info label="سبب عدم الجاهزية" value={readinessReasons.join(" — ")} />
                            ) : null}
                          </div>

                          <div className="linkage-generate-action">
                            <button
                              type="button"
                              className="button primary compact"
                              disabled={!overallLinkageReady}
                              onClick={() => {
                                if (!overallLinkageReady) return;
                                const content = buildOutputMockContent({
                                  output,
                                  productName: selectedProduct?.name || "المنتج",
                                  goal,
                                  offer,
                                  cta,
                                  channels,
                                  selectedAssets,
                                  videoDuration,
                                  ageGroup,
                                  gender,
                                  style,
                                });
                                setGeneratedOutputContent((prev) => ({ ...prev, [output]: content }));
                                setOutputGenerationState((prev) => ({ ...prev, [output]: "generated" }));
                              }}
                            >
                              <Sparkles size={14} />
                              توليد هذا المخرج
                            </button>
                            {!textApproved ? (
                              <div className="linkage-warn">اعتمد النص الأساسي قبل توليد المخرجات.</div>
                            ) : !overallLinkageReady ? (
                              <div className="linkage-warn">
                                {readinessReasons.filter((r) => r !== "اعتمد النص الأساسي قبل توليد المخرجات.").join(" — ") || "المخرج غير جاهز للتوليد."}
                              </div>
                            ) : null}
                          </div>

                          <small className="linkage-prototype-note">
                            يعرض هذا القسم الربط المتوقع بين نوع المخرج والمطالبة والحقول ومسار النموذج. توليد تجريبي — لا يوجد استدعاء فعلي للنماذج.
                          </small>
                        </div>

                        {isGenerated && generatedContent ? (
                          <div className="generated-output-display">
                            <div className="generated-output-display-header">
                              <strong>المخرج التجريبي</strong>
                              <Badge tone={genStatusTone}>{genStatusLabel}</Badge>
                            </div>
                            <div className="generated-content-body">
                              <pre>{generatedContent}</pre>
                            </div>
                            <div className="generated-output-helper">
                              هذا مخرج تجريبي داخل النموذج الأولي، ولم يتم استدعاء أي نموذج ذكاء اصطناعي.
                            </div>
                            <div className="output-approval-actions">
                              <Info label="حالة اعتماد المخرج" value={genStatusLabel} />
                              <button
                                type="button"
                                className="button primary compact"
                                onClick={() => {
                                  setOutputGenerationState((prev) => ({ ...prev, [output]: "approved" }));
                                  setOutputApprovalStatus((prev) => ({ ...prev, [output]: "approved" }));
                                }}
                              >
                                اعتماد هذا المخرج
                              </button>
                              <button
                                type="button"
                                className="button secondary compact"
                                onClick={() => {
                                  setOutputGenerationState((prev) => ({ ...prev, [output]: "needs_edit" }));
                                  setOutputApprovalStatus((prev) => ({ ...prev, [output]: "needs_edit" }));
                                }}
                              >
                                طلب تعديل هذا المخرج
                              </button>
                            </div>
                          </div>
                        ) : null}

                        <div className="customer-output">
                          <h4>المخرج الظاهر للعميل (مسودة)</h4>
                          <p>{item.customerText}</p>
                        </div>

                        <div className="internal-output">
                          <h4>المخرج الداخلي للنموذج</h4>
                          <p>{item.internalPrompt.replace(/./g, "•").slice(0, 140)}</p>
                          <small>
                            محفوظ كنص داخلي للنظام — لا يظهر للعميل ولا يُنسخ في التقارير.
                          </small>
                        </div>

                        <div className="output-footer">
                          آخر توليد: {item.regeneratedAt}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          <Footer
            step={step}
            total={5}
            back={back}
            next={next}
            nextLabel={step < 5 ? "التالي" : "إنهاء"}
          />
        </section>

        <aside className="smart-panel">
          <SmartBox step={step} readiness={readiness} productName={selectedProduct?.name} />
        </aside>
      </div>
    </main>
  );
}
