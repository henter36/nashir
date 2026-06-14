import { ImageIcon, Megaphone } from "lucide-react";
import { CardHeader, Status } from "./components.jsx";
import { formatCampaignStatus, getCampaignProductName } from "./helpers.js";

export default function CampaignsCard({ recentCampaigns, onOpenCampaigns }) {
  return (
    <article className="card campaigns-card">
      <CardHeader
        title="الحملات القريبة"
        description="حالة مختصرة للجاهزية والقناة والتحديث الأخير."
        icon={Megaphone}
        action={
          <button type="button" className="mini-button" onClick={onOpenCampaigns}>
            عرض الكل
          </button>
        }
      />

      <div className="campaign-table">
        {recentCampaigns.map((campaign) => (
          <button
            key={campaign.id || campaign.name}
            type="button"
            className="campaign-row"
            onClick={onOpenCampaigns}
          >
            <div className="campaign-main">
              <div className="campaign-thumb">
                <ImageIcon size={17} />
              </div>
              <div>
                <strong>{campaign.name}</strong>
                <span>{getCampaignProductName(campaign)}</span>
              </div>
            </div>

            <Status tone={campaign.tone}>{formatCampaignStatus(campaign.status)}</Status>

            <div className="readiness-cell">
              <i>
                <b style={{ width: `${campaign.readiness}%` }} />
              </i>
              <small>{campaign.readiness}%</small>
            </div>

            <span className="channel-pill">{campaign.channel || campaign.channels?.[0] || "عام"}</span>
            <small className="muted">{campaign.updatedAt || campaign.updated}</small>
          </button>
        ))}
      </div>
    </article>
  );
}
