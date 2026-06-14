import { Sparkles } from "lucide-react";
import { CardHeader, Mini } from "./components.jsx";

export default function StrategicSummaryCard({ strategicSummary = {}, latestStrategicPlan = null }) {
  return (
    <article className="card strategic-summary-card">
      <CardHeader
        title="ملخص الخطة الاستراتيجية"
        description={latestStrategicPlan ? "يعرض أهم نتيجة من آخر خطة استراتيجية محفوظة، والتفاصيل الكاملة تبقى في إعداد المتجر." : "لا توجد خطة استراتيجية محفوظة بعد."}
        icon={Sparkles}
        action={<span className="prototype-note">{latestStrategicPlan ? "آخر خطة استراتيجية محفوظة" : "بدون خطة محفوظة"}</span>}
      />
      <p className="strategy-note">هذه توصيات واجهية مشتقة من بيانات الإعداد الحالية، وليست تحليلًا إنتاجيًا.</p>
      <div className="strategy-summary-grid">
        <Mini title="درجة جاهزية النمو" value={strategicSummary.growthReadiness} />
        <Mini title="أهم فرصة" value={strategicSummary.opportunity} />
        <Mini title="أهم خطر" value={strategicSummary.risk} />
        <Mini title="الإجراء التالي" value={strategicSummary.nextAction} />
        <Mini title="حالة الخطة" value={strategicSummary.status} />
      </div>
    </article>
  );
}
