import { CircleAlert } from "lucide-react";
import { SelectField, Info } from "./components.jsx";
import { getDefaultTrigger, getOptionLabel } from "./helpers.js";
import {
  TRIGGER_TYPES,
  TRIGGER_START_WHEN_OPTIONS,
  START_CONDITIONS,
  EVENT_SOURCES,
  TRIGGER_UPDATE_POLICIES,
} from "./constants.js";

export default function WorkflowTriggerPanel({ trigger, onChange, editable = false }) {
  const safeTrigger = trigger || getDefaultTrigger();
  const isTriggerComplete =
    safeTrigger.type && safeTrigger.startCondition && safeTrigger.eventSource && safeTrigger.startWhen;
  const missingFields = [
    !safeTrigger.type && "نوع المشغل",
    !safeTrigger.startWhen && "متى يبدأ المسار؟",
    !safeTrigger.startCondition && "شرط البدء",
    !safeTrigger.eventSource && "مصدر الحدث",
  ].filter(Boolean);

  return (
    <section className="workflow-trigger-card">
      <div className="io-designer-head">
        <strong>مشغل المسار</strong>
        <span>هذا المشغل يوضح متى يبدأ المسار</span>
      </div>

      <div className="trigger-info-grid">
        {editable ? (
          <>
            <SelectField
              label="نوع المشغل"
              value={safeTrigger.type}
              options={TRIGGER_TYPES}
              onChange={(value) => onChange("type", value)}
            />
            <SelectField
              label="متى يبدأ المسار؟"
              value={safeTrigger.startWhen || ""}
              options={[["", "اختر حالة البدء"], ...TRIGGER_START_WHEN_OPTIONS]}
              onChange={(value) => onChange("startWhen", value)}
            />
            <SelectField
              label="شرط البدء"
              value={safeTrigger.startCondition}
              options={START_CONDITIONS}
              onChange={(value) => onChange("startCondition", value)}
            />
            <SelectField
              label="مصدر الحدث"
              value={safeTrigger.eventSource}
              options={EVENT_SOURCES}
              onChange={(value) => onChange("eventSource", value)}
            />
            <SelectField
              label="سياسة تحديث المسار"
              value={safeTrigger.updatePolicy || ""}
              options={TRIGGER_UPDATE_POLICIES}
              onChange={(value) => onChange("updatePolicy", value)}
            />
          </>
        ) : (
          <>
            <Info label="نوع المشغل" value={getOptionLabel(TRIGGER_TYPES, safeTrigger.type)} />
            <Info label="متى يبدأ المسار؟" value={getOptionLabel(TRIGGER_START_WHEN_OPTIONS, safeTrigger.startWhen) || safeTrigger.startWhen || "—"} />
            <Info label="شرط البدء" value={getOptionLabel(START_CONDITIONS, safeTrigger.startCondition)} />
            <Info label="مصدر الحدث" value={getOptionLabel(EVENT_SOURCES, safeTrigger.eventSource)} />
            <Info label="سياسة تحديث المسار" value={getOptionLabel(TRIGGER_UPDATE_POLICIES, safeTrigger.updatePolicy) || "غير محددة"} />
          </>
        )}
      </div>

      {editable && !isTriggerComplete && missingFields.length > 0 && (
        <div className="trigger-readiness-warning">
          <CircleAlert size={15} />
          <span>يحتاج المشغل إكمال: {missingFields.join("، ")}</span>
        </div>
      )}

      <p className="inline-note trigger-scope-note">
        هذا المشغل يحدد متى يبدأ المسار ومن أي مصدر يأتي الحدث. لا يتضمن ذلك إعداد مصادر البيانات، النماذج، أو الصلاحيات — تلك تُعرَّف في خطوات المسار.
        هذا مصمم تدفق واجهي فقط. لا يتم تنفيذ المشغلات أو المسارات فعليًا في هذا النموذج.
      </p>
    </section>
  );
}
