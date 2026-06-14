import { Plus, Sparkles } from "lucide-react";

const periodLabels = ["اليوم", "آخر 7 أيام", "هذا الشهر"];

export default function DashboardHero({ period = "آخر 7 أيام", onPeriodChange = () => {}, onCreateCampaign = () => {} }) {
  return (
    <section className="hero">
      <div>
        <div className="kicker">
          <Sparkles size={15} />
          مركز قيادة ناشر
        </div>
        <h1>مرحبًا، أحمد 👋</h1>
        <p>ملخص تنفيذي سريع للحملات، المحتوى، جاهزية النشر، والتنبيهات التي تحتاج قرارًا.</p>
      </div>

      <div className="hero-actions">
        <div className="period-switch" aria-label="فلتر الفترة التجريبي">
          {periodLabels.map((item) => (
            <button
              key={item}
              type="button"
              className={period === item ? "active" : ""}
              onClick={() => onPeriodChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button type="button" className="primary-button" onClick={onCreateCampaign}>
          <Plus size={17} />
          إنشاء حملة
        </button>
      </div>
    </section>
  );
}
