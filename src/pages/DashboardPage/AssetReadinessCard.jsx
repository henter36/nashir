import { FolderOpen } from "lucide-react";
import { CardHeader } from "./components.jsx";

export default function AssetReadinessCard({ assetMetrics = [], onOpenAssets = () => {} }) {
  return (
    <article className="card small-card">
      <CardHeader
        title="جاهزية الأصول"
        description="ما يؤثر على قرار استخدام الأصول."
        icon={FolderOpen}
      />

      <div className="box-grid">
        {assetMetrics.map(([label, value, tone]) => (
          <div key={label} className={`metric-box ${tone}`}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <button type="button" className="secondary-button wide" onClick={onOpenAssets}>
        إدارة مكتبة الأصول
      </button>
    </article>
  );
}
