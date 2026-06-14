export function SectionTitle({ title, description }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function CardHeader({ title, description, icon: Icon, action }) {
  return (
    <div className="card-header">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action ?? (Icon ? (
        <div className="header-icon">
          <Icon size={20} />
        </div>
      ) : null)}
    </div>
  );
}

export function InfoRow({ label, value, tone }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
    </div>
  );
}

export function Status({ tone, children }) {
  return <span className={`status ${tone}`}>{children}</span>;
}

export function Mini({ title, value }) {
  return (
    <div className="metric-box">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}
