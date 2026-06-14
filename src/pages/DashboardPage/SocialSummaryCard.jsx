import { Megaphone } from "lucide-react";
import { CardHeader, Mini } from "./components.jsx";

export default function SocialSummaryCard({ topChannel }) {
  return (
    <article className="card social-summary-card">
      <CardHeader
        title="ملخص التحليل الاجتماعي"
        description="مؤشرات واجهية خفيفة مرتبطة بتصميم موصلات Instagram وTikTok."
        icon={Megaphone}
        action={<span className="prototype-note">لا يتم سحب بيانات فعلية</span>}
      />
      <div className="strategy-summary-grid">
        <Mini title="أقوى قناة اجتماعية" value={topChannel || "Instagram"} />
        <Mini title="أهم فرصة اجتماعية" value="تحويل المنتج الأعلى جاهزية إلى Reel أو TikTok قصير." />
        <Mini title="أهم خطر اجتماعي" value="الاعتماد على بيانات اجتماعية دون موصل مصرح." />
        <Mini title="الإجراء التالي" value="تجهيز موصل مصرح قبل استخدام التحليل الاجتماعي." />
      </div>
    </article>
  );
}
