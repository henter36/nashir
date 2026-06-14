import { Layers } from "lucide-react";
import { CardHeader, Mini } from "./components.jsx";

export default function PublishingCard({
  channelSetSize = 0,
  campaignListLength = 0,
  avgReadiness = 0,
  readyContent = 0,
  contentItemsCount = 0,
  needsReviewContent = 0,
  onOpenPublishingQueue = () => {},
  onOpenMultiPlatform = () => {},
}) {
  return (
    <article className="card small-card">
      <CardHeader
        title="النشر والقنوات"
        description="ما قبل الجدولة والتحقق متعدد القنوات."
        icon={Layers}
      />

      <div className="box-grid">
        <Mini title="قنوات مستخدمة" value={channelSetSize ? String(channelSetSize) : "لا توجد حملات محفوظة بعد."} />
        <Mini title="جاهزية القنوات" value={campaignListLength ? `${Math.min(100, Math.max(35, avgReadiness))}%` : "لا توجد حملات محفوظة بعد."} />
        <Mini title="مخرجات جاهزة" value={contentItemsCount ? `${readyContent}/${contentItemsCount}` : "لا توجد مخرجات محفوظة بعد"} />
        <Mini title="تحتاج موافقة" value={String(needsReviewContent)} />
      </div>

      <div className="split-buttons">
        <button type="button" className="secondary-button" onClick={onOpenPublishingQueue}>جدولة النشر</button>
        <button type="button" className="secondary-button" onClick={onOpenMultiPlatform}>متعدد القنوات</button>
      </div>
    </article>
  );
}
