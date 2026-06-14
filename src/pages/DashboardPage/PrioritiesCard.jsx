import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CardHeader } from "./components.jsx";

export default function PrioritiesCard({ priorities = [] }) {
  return (
    <article className="card next-action-card">
      <CardHeader
        title="الأولويات التالية"
        description="ثلاث قرارات عملية بدل إجراء واحد قد لا يناسب كل حالة."
        icon={ShieldCheck}
      />

      <div className="priority-list">
        {priorities.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className={`priority-row ${item.tone}`}>
              <div className="action-icon">
                <Icon size={20} />
              </div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
              <button type="button" onClick={item.onClick}>
                {item.action}
                <ArrowLeft size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </article>
  );
}
