import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Database,
  FileCheck2,
  FolderOpen,
  Layers,
  Megaphone,
  Store,
} from "lucide-react";
import {
  deriveDashboardSummary,
  readCampaignMetrics,
  readCampaigns,
  refreshDashboardSummary,
} from "../utils/campaignAnalyticsStore.js";
import { readLatestStoreStrategicPlan } from "../utils/storeStrategicPlanStore.js";
import { readProductCatalog } from "../utils/productCatalogStore.js";
import { readAssetLibrary } from "../utils/assetLibraryStore.js";
import { readCampaignContent } from "../utils/campaignContentStore.js";

import { styles } from "./DashboardPage/styles.js";
import { strategicPlanNextAction } from "./DashboardPage/helpers.js";
import { SectionTitle } from "./DashboardPage/components.jsx";
import DashboardHero from "./DashboardPage/DashboardHero.jsx";
import GuidanceCard from "./DashboardPage/GuidanceCard.jsx";
import KpiGrid from "./DashboardPage/KpiGrid.jsx";
import StrategicSummaryCard from "./DashboardPage/StrategicSummaryCard.jsx";
import SocialSummaryCard from "./DashboardPage/SocialSummaryCard.jsx";
import CampaignsCard from "./DashboardPage/CampaignsCard.jsx";
import AssetReadinessCard from "./DashboardPage/AssetReadinessCard.jsx";
import PublishingCard from "./DashboardPage/PublishingCard.jsx";
import PerformanceCard from "./DashboardPage/PerformanceCard.jsx";
import OperationalReadinessCard from "./DashboardPage/OperationalReadinessCard.jsx";
import PrioritiesCard from "./DashboardPage/PrioritiesCard.jsx";
import QuickActionsCard from "./DashboardPage/QuickActionsCard.jsx";

export default function DashboardPage({
  onCreateCampaign = () => {},
  onOpenStoreSetup = () => {},
  onOpenProductCatalog = () => {},
  onOpenDataSources = () => {},
  onOpenCampaigns = () => {},
  onOpenAssets = () => {},
  onOpenAnalytics = () => {},
  onOpenReview = () => {},
  onOpenPublishingQueue = () => {},
  onOpenMultiPlatform = () => {},
}) {
  const [period, setPeriod] = useState("آخر 7 أيام");
  const [campaignList, setCampaignList] = useState(() => readCampaigns([]));
  const [campaignMetrics, setCampaignMetrics] = useState(() => readCampaignMetrics([]));
  const [products, setProducts] = useState(() => readProductCatalog([]));
  const [assets, setAssets] = useState(() => readAssetLibrary([]));
  const [contentItems, setContentItems] = useState(() => readCampaignContent([]));
  const [latestStrategicPlan, setLatestStrategicPlan] = useState(() =>
    readLatestStoreStrategicPlan(null)
  );

  useEffect(() => {
    const reloadDashboard = () => {
      const nextCampaigns = readCampaigns([]);
      const nextMetrics = readCampaignMetrics([]);

      refreshDashboardSummary(nextCampaigns, nextMetrics);
      setCampaignList(nextCampaigns);
      setCampaignMetrics(nextMetrics);
      setProducts(readProductCatalog([]));
      setAssets(readAssetLibrary([]));
      setContentItems(readCampaignContent([]));
      setLatestStrategicPlan(readLatestStoreStrategicPlan(null));
    };

    window.addEventListener("focus", reloadDashboard);
    window.addEventListener("storage", reloadDashboard);
    window.addEventListener("nashir-campaigns-updated", reloadDashboard);
    window.addEventListener("nashir-campaign-metrics-updated", reloadDashboard);
    window.addEventListener("nashir-dashboard-summary-updated", reloadDashboard);
    window.addEventListener("nashir-store-strategic-plan-updated", reloadDashboard);
    window.addEventListener("nashir-product-catalog-updated", reloadDashboard);
    window.addEventListener("nashir-asset-library-updated", reloadDashboard);
    window.addEventListener("nashir-campaign-content-updated", reloadDashboard);

    return () => {
      window.removeEventListener("focus", reloadDashboard);
      window.removeEventListener("storage", reloadDashboard);
      window.removeEventListener("nashir-campaigns-updated", reloadDashboard);
      window.removeEventListener("nashir-campaign-metrics-updated", reloadDashboard);
      window.removeEventListener("nashir-dashboard-summary-updated", reloadDashboard);
      window.removeEventListener("nashir-store-strategic-plan-updated", reloadDashboard);
      window.removeEventListener("nashir-product-catalog-updated", reloadDashboard);
      window.removeEventListener("nashir-asset-library-updated", reloadDashboard);
      window.removeEventListener("nashir-campaign-content-updated", reloadDashboard);
    };
  }, []);

  const quickActions = useMemo(
    () => [
      ["إعداد المتجر", "أكمل بيانات المتجر والهوية", Store, onOpenStoreSetup],
      ["كتالوج المنتجات", "راجع المنتجات قبل الحملة", Store, onOpenProductCatalog],
      ["مصادر البيانات", "افحص الروابط والتكاملات", Database, onOpenDataSources],
      ["إنشاء حملة", "ابدأ من المعالج الرسمي", Megaphone, onCreateCampaign],
      ["المحتوى والمراجعة", "راجع النصوص والمخرجات", FileCheck2, onOpenReview],
      ["جدولة النشر", "جهّز خطة النشر", CalendarDays, onOpenPublishingQueue],
      ["متعدد القنوات", "تحقق من جاهزية القنوات", Layers, onOpenMultiPlatform],
      ["التحليلات", "راجع الأداء والمؤشرات", BarChart3, onOpenAnalytics],
    ],
    [
      onCreateCampaign,
      onOpenAnalytics,
      onOpenDataSources,
      onOpenMultiPlatform,
      onOpenProductCatalog,
      onOpenPublishingQueue,
      onOpenReview,
      onOpenStoreSetup,
    ]
  );

  const summary = useMemo(
    () => deriveDashboardSummary(campaignList, campaignMetrics),
    [campaignList, campaignMetrics]
  );

  const recentCampaigns = campaignList.slice(0, 4);
  const needsReviewContent = contentItems.filter((item) =>
    ["needs_review", "review", "ready"].includes(item.status) || item.approval === "needs_review"
  ).length;
  const unconfirmedAssets = assets.filter((asset) => asset.rightsStatus !== "allowed").length;
  const readyAssets = assets.filter((asset) => asset.status === "ready").length;
  const videoAssets = assets.filter((asset) => asset.type === "video").length;
  const imageAssets = assets.filter((asset) => asset.type === "image").length;
  const avgProductReadiness = products.length
    ? Math.round(products.reduce((sum, product) => sum + Number(product.readiness || 0), 0) / products.length)
    : 0;
  const planReadiness = latestStrategicPlan ? Number(latestStrategicPlan.confidence || 0) : 0;
  const operationalReadiness = Math.round(
    [summary.avgReadiness, avgProductReadiness, planReadiness].filter((value) => Number.isFinite(value) && value > 0)
      .reduce((sum, value, _index, list) => sum + value / list.length, 0)
  );
  const assetMetrics = [
    ["صور محفوظة", products.length || assets.length ? String(imageAssets) : "لا توجد أصول محفوظة بعد", imageAssets ? "green" : "amber"],
    ["حقوق غير مؤكدة", assets.length ? String(unconfirmedAssets) : "لا توجد أصول محفوظة بعد", unconfirmedAssets ? "amber" : "green"],
    ["فيديوهات محفوظة", assets.length ? String(videoAssets) : "لا توجد أصول محفوظة بعد", videoAssets ? "green" : "amber"],
    ["أصول قابلة للمراجعة", assets.length ? String(readyAssets) : "لا توجد أصول محفوظة بعد", readyAssets ? "green" : "amber"],
  ];
  const channelSet = new Set(campaignList.flatMap((campaign) => campaign.channels || (campaign.channel ? [campaign.channel] : [])));
  const readyContent = contentItems.filter((item) => item.status === "ready" || item.approval === "approved").length;
  const priorityGaps = [
    !latestStrategicPlan ? "لا توجد خطة استراتيجية محفوظة بعد." : "",
    !campaignList.length ? "لا توجد حملات محفوظة بعد." : "",
    !products.length ? "لا توجد منتجات محفوظة بعد." : "",
    !assets.length ? "لا توجد أصول محفوظة بعد." : "",
  ].filter(Boolean);
  const priorities = [
    {
      title: latestStrategicPlan ? "راجع الخطة والحملة التالية" : "استكمل خطة المتجر",
      body: latestStrategicPlan
        ? strategicPlanNextAction(latestStrategicPlan)
        : "لا توجد خطة استراتيجية محفوظة بعد. ابدأ من إعداد المتجر لحفظ خطة واجهية.",
      action: "فتح إعداد المتجر",
      icon: Database,
      tone: latestStrategicPlan ? "green" : "amber",
      onClick: onOpenStoreSetup,
    },
    {
      title: assets.length ? "راجع الأصول غير المؤكدة" : "استكمل مكتبة الأصول",
      body: assets.length
        ? `${unconfirmedAssets} أصل يحتاج مراجعة حقوق قبل استخدامه في الحملات.`
        : "لا توجد أصول محفوظة بعد.",
      action: "فتح مكتبة الأصول",
      icon: FolderOpen,
      tone: unconfirmedAssets || !assets.length ? "amber" : "green",
      onClick: onOpenAssets,
    },
    {
      title: contentItems.length ? "جهّز المخرجات للمراجعة" : "أنشئ مخرجات حملة",
      body: contentItems.length
        ? `${needsReviewContent} مخرج يحتاج مراجعة أو اعتمادًا واجهيًا.`
        : "لا توجد مخرجات حملة محفوظة بعد.",
      action: contentItems.length ? "فتح المراجعة" : "إنشاء حملة",
      icon: Layers,
      tone: needsReviewContent ? "blue" : "amber",
      onClick: contentItems.length ? onOpenReview : onCreateCampaign,
    },
  ];
  const activities = useMemo(() => {
    const rows = [];

    if (latestStrategicPlan) {
      rows.push(["آخر خطة استراتيجية محفوظة", "إعداد المتجر", latestStrategicPlan.updatedAt ? new Date(latestStrategicPlan.updatedAt).toLocaleDateString("ar-SA") : "محفوظة محليًا", "green"]);
    }
    if (campaignList[0]) {
      rows.push([campaignList[0].name, "الحملات", campaignList[0].updatedAt || "محفوظة محليًا", "blue"]);
    }
    if (contentItems[0]) {
      rows.push([contentItems[0].title, "استوديو المحتوى", contentItems[0].updatedAt ? new Date(contentItems[0].updatedAt).toLocaleDateString("ar-SA") : "محفوظ محليًا", "amber"]);
    }

    return rows.length ? rows : [["لا توجد بيانات محفوظة بعد", "بيانات النموذج الأولي", "ابدأ من إعداد المتجر", "amber"]];
  }, [campaignList, contentItems, latestStrategicPlan]);

  const dashboardKpis = [
    {
      title: "الحملات النشطة",
      value: String(campaignList.length),
      subtitle: campaignList.length ? `${summary.reviewCampaigns} تحتاج متابعة` : "لا توجد حملات محفوظة بعد.",
      tone: "green",
      icon: Megaphone,
    },
    {
      title: "محتوى ينتظر اعتمادًا",
      value: String(needsReviewContent),
      subtitle: contentItems.length ? "راجع قبل الجدولة" : "لا توجد مخرجات محفوظة بعد",
      tone: "amber",
      icon: AlertTriangle,
    },
    {
      title: "أصول غير مؤكدة",
      value: String(unconfirmedAssets),
      subtitle: assets.length ? "حقوق استخدام تحتاج مراجعة" : "لا توجد أصول محفوظة بعد",
      tone: "blue",
      icon: FolderOpen,
    },
    {
      title: "جاهزية التشغيل",
      value: `${operationalReadiness || 0}%`,
      subtitle: latestStrategicPlan ? "من بيانات النموذج الأولي" : "لا توجد خطة استراتيجية محفوظة بعد.",
      tone: "green",
      icon: Store,
    },
  ];

  const strategicSummary = useMemo(() => {
    const planJson = latestStrategicPlan?.planJson || {};
    const findFact = (rows, label) => {
      const found = Array.isArray(rows)
        ? rows.find(([candidate]) => candidate === label)
        : null;
      return found?.[1] || "";
    };
    const topProduct = Array.isArray(planJson.priorityProducts)
      ? planJson.priorityProducts[0]
      : null;
    const risks = Array.isArray(planJson.risks) ? planJson.risks : [];

    if (latestStrategicPlan) {
      return {
        growthReadiness: findFact(planJson.summary, "مرحلة جاهزية المتجر") || "آخر خطة استراتيجية محفوظة",
        opportunity: topProduct?.name
          ? `تحويل ${topProduct.name} إلى حملة اختبارية مركزة.`
          : "آخر خطة استراتيجية محفوظة متاحة للمراجعة.",
        risk: risks[0] || "لا توجد فجوة حرجة في آخر خطة محفوظة.",
        nextAction: planJson.nextAction || "راجع آخر خطة استراتيجية محفوظة قبل إنشاء حملة.",
        status: latestStrategicPlan.status === "ready_for_review" ? "جاهزة للمراجعة" : "مسودة",
      };
    }

    return {
      growthReadiness: summary.avgReadiness >= 80 ? "مرتفعة" : summary.avgReadiness >= 65 ? "متوسطة" : "تحتاج استكمال",
      opportunity: products[0]?.name
        ? `تحويل ${products[0].name} إلى حملة اختبارية مركزة.`
        : "لا توجد خطة استراتيجية محفوظة بعد.",
      risk: Number(summary.reviewCampaigns || 0) > 0
        ? "وجود محتوى أو حملات تحتاج مراجعة قبل التوسع."
        : priorityGaps[0] || "الأصول والقنوات تحتاج متابعة قبل زيادة النشر.",
      nextAction: Number(summary.reviewCampaigns || 0) > 0
        ? "راجع المحتوى المنتظر قبل الجدولة."
        : "ابدأ من إعداد المتجر لحفظ خطة استراتيجية.",
      status: "لا توجد خطة استراتيجية محفوظة بعد.",
    };
  }, [latestStrategicPlan, priorityGaps, products, summary.avgReadiness, summary.reviewCampaigns]);

  return (
    <main className="dashboard-grid-page" dir="rtl">
      <style>{styles}</style>

      <DashboardHero period={period} onPeriodChange={setPeriod} onCreateCampaign={onCreateCampaign} />
      <GuidanceCard />
      <KpiGrid kpis={dashboardKpis} period={period} />
      <StrategicSummaryCard strategicSummary={strategicSummary} latestStrategicPlan={latestStrategicPlan} />
      <SocialSummaryCard topChannel={summary.topChannel} />

      <SectionTitle title="أداء الحملات" description="آخر الحملات التي تحتاج متابعة أو قرار." />
      <section className="middle-row">
        <CampaignsCard recentCampaigns={recentCampaigns} onOpenCampaigns={onOpenCampaigns} />
      </section>

      <SectionTitle title="المحتوى والنشر" description="جاهزية الأصول والقنوات قبل الانتقال إلى النشر والتحليلات." />
      <section className="bottom-row">
        <AssetReadinessCard assetMetrics={assetMetrics} onOpenAssets={onOpenAssets} />
        <PublishingCard
          channelSetSize={channelSet.size}
          campaignListLength={campaignList.length}
          avgReadiness={summary.avgReadiness}
          readyContent={readyContent}
          contentItemsCount={contentItems.length}
          needsReviewContent={needsReviewContent}
          onOpenPublishingQueue={onOpenPublishingQueue}
          onOpenMultiPlatform={onOpenMultiPlatform}
        />
        <PerformanceCard summary={summary} activities={activities} onOpenAnalytics={onOpenAnalytics} />
      </section>

      <SectionTitle title="التنبيهات والتوصيات" description="قرارات تشغيلية تحتاج مراجعة قبل توسيع الحملات." />
      <section className="support-row">
        <OperationalReadinessCard
          avgReadiness={summary.avgReadiness}
          latestStrategicPlan={latestStrategicPlan}
          products={products}
          campaignList={campaignList}
          assets={assets}
          unconfirmedAssets={unconfirmedAssets}
          onOpenStoreSetup={onOpenStoreSetup}
          onOpenDataSources={onOpenDataSources}
        />
        <PrioritiesCard priorities={priorities} />
      </section>

      <QuickActionsCard quickActions={quickActions} />
    </main>
  );
}
