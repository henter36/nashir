import { useState } from "react";
import { SelectField, Toggle } from "./components.jsx";
import {
  STRUCTURED_INPUT_SOURCES,
  PROCESSOR_TYPES,
  PROCESSORS,
  VISIBILITY,
  NEXT_WORKFLOWS,
  TRANSITION_CONDITIONS,
  OUTPUT_TYPE_OPTIONS,
  OUTPUT_FORMATS,
  DESTINATION_OPTIONS,
  DESTINATION_FIELD_MAP,
} from "./constants.js";
import {
  normalizeInputRefs,
  inferInputDomain,
  getFieldsForSource,
  getInputFieldLabel,
  getInputRefLabel,
  getStepOutputName,
  getPromptStatusLabel,
} from "./helpers.js";
import StepReadinessPanel from "./StepReadinessPanel.jsx";
import ModelRoutingSummary from "./ModelRoutingSummary.jsx";

export default function StepEditor({ step, index, onChange, onChangeInputs, onDelete, readinessContext }) {
  const promptRegistry = readinessContext?.promptRegistry || [];
  const inputDomain = step.inputDomain || inferInputDomain(step);
  const [fieldToAdd, setFieldToAdd] = useState("");
  const selectedInputRefs = normalizeInputRefs(step);
  const selectedFields = selectedInputRefs.map((ref) => ref.field);
  const availableFields = getFieldsForSource(inputDomain);
  const nextInputs = Array.isArray(step.nextInputs) ? step.nextInputs : selectedFields;
  const selectedPrompt = step.nextPromptName
    ? promptRegistry.find((prompt) => prompt.name === step.nextPromptName)
    : null;

  const setInputDomain = (value) => {
    onChange(index, "inputDomain", value);
    setFieldToAdd("");
  };

  const addInputRef = () => {
    if (!fieldToAdd) return;
    const nextRef = { domain: inputDomain, field: fieldToAdd };
    const exists = selectedInputRefs.some((ref) => ref.domain === nextRef.domain && ref.field === nextRef.field);
    if (exists) return;
    onChangeInputs(index, [...selectedInputRefs, nextRef]);
  };

  const removeInputRef = (refToRemove) => {
    onChangeInputs(
      index,
      selectedInputRefs.filter((ref) => !(ref.domain === refToRemove.domain && ref.field === refToRemove.field))
    );
  };

  const toggleNextInput = (field) => {
    const safeNextInputs = nextInputs.includes(field)
      ? nextInputs.filter((item) => item !== field)
      : [...nextInputs, field];
    onChange(index, "nextInputs", safeNextInputs);
  };

  return (
    <div className="step-editor">
      <label className="field">
        <span>اسم الخطوة</span>
        <input value={step.name} onChange={(e) => onChange(index, "name", e.target.value)} />
      </label>

      <section className="io-designer-card">
        <div className="io-designer-head">
          <strong>مصدر الإدخال</strong>
          <span>اختيار متعدد للحقول</span>
        </div>

        <SelectField
          label="الصفحة أو المجال"
          value={inputDomain}
          options={STRUCTURED_INPUT_SOURCES.map((source) => [source.value, source.label])}
          onChange={setInputDomain}
        />

        <SelectField
          label="الحقل المطلوب"
          value={fieldToAdd}
          options={[["", "اختر حقلًا لإضافته"], ...availableFields.map((field) => [field, getInputFieldLabel(field)])]}
          onChange={setFieldToAdd}
        />

        <button type="button" className="secondary-button compact-action" onClick={addInputRef}>
          إضافة الحقل إلى المدخلات
        </button>

        <div className="input-source-box structured-inputs">
          <strong>المدخلات المختارة</strong>
          <span className="input-count">عدد المدخلات المختارة: {selectedInputRefs.length}</span>
          <div className="selected-input-grid">
            {selectedInputRefs.map((ref) => (
              <button
                key={`${ref.domain}-${ref.field}`}
                type="button"
                className="selected removable-chip"
                onClick={() => removeInputRef(ref)}
              >
                {getInputRefLabel(ref)}
                <small>إزالة</small>
              </button>
            ))}
          </div>
          {!selectedInputRefs.length ? (
            <p className="inline-warning">لم يتم اختيار مدخلات لهذه الخطوة.</p>
          ) : null}
        </div>
      </section>

      <SelectField
        label="نوع المعالجة"
        value={step.processorType}
        options={PROCESSOR_TYPES}
        onChange={(value) => onChange(index, "processorType", value)}
      />

      <SelectField
        label="المعالج / مسار النموذج"
        value={step.processor}
        options={PROCESSORS}
        onChange={(value) => onChange(index, "processor", value)}
      />

      <StepReadinessPanel step={step} readinessContext={readinessContext} />

      <ModelRoutingSummary step={step} readinessContext={readinessContext} />

      <section className="io-designer-card output-designer">
        <div className="io-designer-head">
          <strong>مراجعة المخرج</strong>
          <span>لا يتم تنفيذ أي مسار من هذه الإعدادات.</span>
        </div>

        <label className="field">
          <span>اسم المخرج</span>
          <input value={step.outputKey} onChange={(e) => onChange(index, "outputKey", e.target.value)} />
        </label>

        <SelectField
          label="نوع المخرج"
          value={step.outputType}
          options={OUTPUT_TYPE_OPTIONS}
          onChange={(value) => onChange(index, "outputType", value)}
        />

        <SelectField
          label="صيغة المخرج"
          value={step.outputFormat || "text"}
          options={OUTPUT_FORMATS}
          onChange={(value) => onChange(index, "outputFormat", value)}
        />

        <SelectField
          label="الصفحة المستهدفة"
          value={step.destination}
          options={DESTINATION_OPTIONS}
          onChange={(value) => {
            onChange(index, "destination", value);
            onChange(index, "destinationField", "");
          }}
        />

        {step.destination ? (
          <>
            <SelectField
              label="الحقل أو القسم المستهدف"
              value={step.destinationField || ""}
              options={[
                ["", "اختر الحقل أو القسم المستهدف"],
                ...(DESTINATION_FIELD_MAP[step.destination] || []),
              ]}
              onChange={(value) => onChange(index, "destinationField", value)}
            />
            {!step.destinationField && (
              <p className="inline-warning">حدد الحقل أو القسم الذي سيستقبل المخرج داخل الصفحة المستهدفة.</p>
            )}
          </>
        ) : null}
      </section>

      <SelectField
        label="مستوى الظهور"
        value={step.visibility}
        options={VISIBILITY}
        onChange={(value) => onChange(index, "visibility", value)}
      />

      <Toggle
        label="يحتاج مراجعة"
        checked={step.reviewRequired}
        onChange={(value) => onChange(index, "reviewRequired", value)}
      />

      <Toggle
        label="يصلح كمدخل لخطوة لاحقة؟"
        checked={step.feedsNextWorkflow}
        onChange={(value) => onChange(index, "feedsNextWorkflow", value)}
      />

      {step.feedsNextWorkflow ? (
        <section className="io-designer-card chaining-card">
          <div className="io-designer-head">
            <strong>يفتح مسارًا تاليًا</strong>
            <span>ترسل مع المخرج إلى المسار التالي</span>
          </div>

          <SelectField
            label="المسار التالي"
            value={step.nextWorkflowType}
            options={NEXT_WORKFLOWS}
            onChange={(value) => onChange(index, "nextWorkflowType", value)}
          />

          <label className="field">
            <span>الخطوة التالية</span>
            <input
              value={step.nextStepName || ""}
              onChange={(e) => onChange(index, "nextStepName", e.target.value)}
              placeholder="مثال: مراجعة المحتوى"
            />
          </label>

          <SelectField
            label="شرط الانتقال"
            value={step.transitionCondition || "after_review"}
            options={TRANSITION_CONDITIONS}
            onChange={(value) => onChange(index, "transitionCondition", value)}
          />

          <div className="input-source-box structured-inputs">
            <strong>المدخلات المرسلة للمسار التالي</strong>
            <div>
              {selectedFields.map((field) => (
                <button
                  key={field}
                  type="button"
                  className={nextInputs.includes(field) ? "selected" : ""}
                  onClick={() => toggleNextInput(field)}
                >
                  {getInputFieldLabel(field)}
                </button>
              ))}
              <button
                type="button"
                className={nextInputs.includes(step.outputKey) ? "selected" : ""}
                onClick={() => toggleNextInput(step.outputKey)}
              >
                {getStepOutputName(step)}
              </button>
            </div>
          </div>

          <SelectField
            label="المطالبة المرسلة مع المخرج"
            value={step.nextPromptName || ""}
            options={[
              ["", "لا توجد مطالبة مرتبطة"],
              ...promptRegistry.map((prompt) => [prompt.name, `${prompt.name} · ${getPromptStatusLabel(prompt)}`]),
            ]}
            onChange={(value) => onChange(index, "nextPromptName", value)}
          />

          {!promptRegistry.length ? (
            <p className="inline-warning">لا توجد مطالبات متاحة. أضف المطالبات من حوكمة المطالبات.</p>
          ) : selectedPrompt ? (
            <p className="inline-note">{getPromptStatusLabel(selectedPrompt)}</p>
          ) : null}
        </section>
      ) : null}

      <button type="button" className="danger-button" onClick={() => onDelete(index)}>
        حذف الخطوة
      </button>
    </div>
  );
}
