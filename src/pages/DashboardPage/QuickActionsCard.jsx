import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CardHeader } from "./components.jsx";

export default function QuickActionsCard({ quickActions }) {
  return (
    <section className="quick-actions-card">
      <CardHeader
        title="اختصارات الرحلة الأساسية"
        description="روابط مباشرة لأكثر الشاشات استخدامًا."
        icon={ShieldCheck}
      />
      <div className="quick-actions-grid">
        {quickActions.map(([title, description, Icon, onClick]) => (
          <button key={title} type="button" className="quick-action" onClick={onClick}>
            <span className="quick-icon"><Icon size={18} /></span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <ArrowLeft size={15} />
          </button>
        ))}
      </div>
    </section>
  );
}
