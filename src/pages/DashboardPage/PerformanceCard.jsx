import { BarChart3 } from "lucide-react";
import { CardHeader, Mini } from "./components.jsx";
import { formatCompactNumber } from "../../utils/campaignAnalyticsStore.js";

export default function PerformanceCard({ summary = {}, activities = [], onOpenAnalytics = () => {} }) {
  return (
    <article className="card small-card">
      <CardHeader
        title="الأداء والنشاط"
        description="مؤشرات سريعة قبل فتح التحليلات."
        icon={BarChart3}
      />

      <div className="box-grid compact-metrics">
        <Mini title="الوصول" value={formatCompactNumber(summary.reach)} />
        <Mini title="التحويلات" value={formatCompactNumber(summary.conversions)} />
        <Mini title="أفضل قناة" value={summary.topChannel} />
        <Mini title="ROI تقديري" value={`${summary.roi}x`} />
      </div>

      <div className="activity-list">
        {activities.map(([title, source, time, tone]) => (
          <div key={`${title}-${time}`} className="activity-row">
            <div className={`dot ${tone}`} />
            <div>
              <strong>{title}</strong>
              <span>{source} · {time}</span>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="secondary-button wide" onClick={onOpenAnalytics}>
        عرض التحليلات
      </button>
    </article>
  );
}
