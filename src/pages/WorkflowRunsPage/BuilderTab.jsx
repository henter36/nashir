import { Info } from "./components.jsx";
import { WORKFLOW_TEMPLATES, PROCESSOR_TYPES, PROCESSORS, DESTINATION_OPTIONS } from "./constants.js";
import { getWorkflowTrigger, formatInputRefs, getStepOutputName, getOptionLabel } from "./helpers.js";
import WorkflowTriggerPanel from "./WorkflowTriggerPanel.jsx";
import StepEditor from "./StepEditor.jsx";

export default function BuilderTab({
  workflowDraft,
  selectedTemplateId,
  selectedStepIndex,
  readinessContext,
  selectTemplate,
  updateStep,
  updateWorkflowTrigger,
  updateStepInputRefs,
  addStep,
  removeStep,
  setSelectedStepIndex,
}) {
  return (
    <section className="builder-layout">
      <aside className="template-card">
        <h2>مصمم مسارات التشغيل</h2>
        <p className="section-purpose">يعرض طريقة تكوين المسار والخطوات المطلوبة لتنفيذه لاحقًا.</p>
        <div className="template-list">
          {WORKFLOW_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              className={selectedTemplateId === template.id ? "active" : ""}
              onClick={() => selectTemplate(template.id)}
            >
              <strong>{template.name}</strong>
              <span>{template.triggerScreen} → {template.triggerAction}</span>
            </button>
          ))}
        </div>
      </aside>

      <article className="steps-card">
        <div className="card-header">
          <div>
            <h2>{workflowDraft.name}</h2>
            <p>{workflowDraft.description}</p>
          </div>
          <button type="button" className="secondary-button" onClick={addStep}>
            + إضافة خطوة
          </button>
        </div>

        <div className="workflow-meta">
          <Info label="نقطة البدء" value={workflowDraft.triggerScreen} />
          <Info label="إجراء البدء" value={workflowDraft.triggerAction} />
          <Info label="المدخلات" value={workflowDraft.inputSources.join("، ")} />
          <Info label="وجهات المخرجات" value={workflowDraft.outputsTo.join("، ")} />
        </div>

        <WorkflowTriggerPanel
          trigger={getWorkflowTrigger(workflowDraft)}
          onChange={updateWorkflowTrigger}
          editable
        />

        <div className="steps-table">
          <div className="table-head">
            <span>#</span>
            <span>الخطوة</span>
            <span>المدخل</span>
            <span>نوع المعالجة</span>
            <span>المعالج</span>
            <span>المخرج</span>
            <span>الوجهة</span>
          </div>

          {workflowDraft.steps.map((step, index) => (
            <button
              type="button"
              key={`${step.id}-${index}`}
              className={`table-row ${selectedStepIndex === index ? "selected" : ""}`}
              onClick={() => setSelectedStepIndex(index)}
            >
              <span>{index + 1}</span>
              <strong>{step.name}</strong>
              <small>{formatInputRefs(step)}</small>
              <span>{PROCESSOR_TYPES.find(([id]) => id === step.processorType)?.[1]}</span>
              <span>{PROCESSORS.find(([id]) => id === step.processor)?.[1] || step.processor}</span>
              <span>{getStepOutputName(step)}</span>
              <span>{getOptionLabel(DESTINATION_OPTIONS, step.destination)}</span>
            </button>
          ))}
        </div>
      </article>

      <aside className="step-editor-card">
        <h2>إعداد الخطوة</h2>
        {workflowDraft.steps[selectedStepIndex] ? (
          <StepEditor
            step={workflowDraft.steps[selectedStepIndex]}
            index={selectedStepIndex}
            onChange={updateStep}
            onChangeInputs={updateStepInputRefs}
            onDelete={removeStep}
            readinessContext={readinessContext}
          />
        ) : (
          <p className="empty">لا توجد خطوة محددة.</p>
        )}
      </aside>
    </section>
  );
}
