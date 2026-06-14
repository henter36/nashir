import { Store } from "lucide-react";
import { CardHeader, InfoRow } from "./components.jsx";

export default function OperationalReadinessCard({
  avgReadiness = 0,
  latestStrategicPlan = null,
  products = [],
  campaignList = [],
  assets = [],
  unconfirmedAssets = 0,
  onOpenStoreSetup = () => {},
  onOpenDataSources = () => {},
}) {
  const readinessItems = [
    [
      "الخطة الاستراتيجية",
      latestStrategicPlan
        ? (latestStrategicPlan.status === "ready_for_review" ? "جاهزة للمراجعة" : "مسودة")
        : "لا توجد خطة استراتيجية محفوظة بعد",
      latestStrategicPlan ? "green" : "amber",
    ],
    [
      "كتالوج المنتجات",
      products.length ? `${products.length} عناصر` : "لا توجد منتجات محفوظة بعد",
      products.length ? "green" : "amber",
    ],
    [
      "الحملات",
      campaignList.length ? `${campaignList.length} حملات` : "لا توجد حملات محفوظة بعد.",
      campaignList.length ? "green" : "amber",
    ],
    [
      "الأصول",
      assets.length ? `${unconfirmedAssets} تحتاج مراجعة` : "لا توجد أصول محفوظة بعد",
      assets.length && !unconfirmedAssets ? "green" : "amber",
    ],
  ];

  return (
    <article className="card readiness-card">
      <CardHeader
        title="جاهزية التشغيل"
        description="العناصر التي تغذي الحملات قبل التوليد أو النشر."
        icon={Store}
      />

      <div className="readiness-summary">
        <div className="ring">{avgReadiness}%</div>
        <div>
          <strong>{avgReadiness >= 70 ? "جيد، لكن غير مكتمل" : "يحتاج استكمال"}</strong>
          <span>المنتجات والمصادر جاهزة مبدئيًا، والأصول تحتاج مراجعة حقوق.</span>
        </div>
      </div>

      <div className="compact-list">
        {readinessItems.map(([label, value, tone]) => (
          <InfoRow key={label} label={label} value={value} tone={tone} />
        ))}
      </div>

      <div className="split-buttons">
        <button type="button" className="secondary-button" onClick={onOpenStoreSetup}>إعداد المتجر</button>
        <button type="button" className="secondary-button" onClick={onOpenDataSources}>مصادر البيانات</button>
      </div>
    </article>
  );
}
