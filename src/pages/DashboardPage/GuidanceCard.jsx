import { Database } from "lucide-react";

export default function GuidanceCard() {
  return (
    <>
      <section className="screen-guidance-card">
        <div><span>هدف الشاشة</span><strong>عرض ملخص تنفيذي لحالة المتجر والحملات والخطة.</strong></div>
        <div><span>المدخلات</span><strong>ملخصات المتجر، الخطة، الحملات، الجاهزية.</strong></div>
        <div><span>المخرجات</span><strong>أهم فرصة، أهم خطر، والإجراء التالي.</strong></div>
        <div><span>الإجراء التالي</span><strong>الانتقال للشاشة التي تحتاج استكمالًا.</strong></div>
        <div><span>ما لا يحدث هنا</span><strong>الأرقام والمؤشرات هنا نموذجية وليست تشغيلًا إنتاجيًا.</strong></div>
      </section>

      <section className="prototype-data-note">
        <Database size={17} />
        <span>تعكس هذه اللوحة بيانات النموذج الأولي المحفوظة محليًا، وليست أرقامًا تشغيلية أو تحليلات إنتاجية.</span>
      </section>
    </>
  );
}
