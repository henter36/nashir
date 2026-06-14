export default function KpiGrid({ kpis = [], period = "" }) {
  return (
    <section className="kpi-grid">
      {kpis.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.title} className={`kpi-card ${item.tone}`}>
            <div className="kpi-icon">
              <Icon size={18} />
            </div>
            <div>
              <span>{item.title}</span>
              <strong>{item.value}</strong>
              <small>{item.subtitle} · {period}</small>
            </div>
          </article>
        );
      })}
    </section>
  );
}
