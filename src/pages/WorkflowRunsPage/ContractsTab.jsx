import { CheckCircle2 } from "lucide-react";
import { Info, ContractKpi, CardHeader } from "./components.jsx";
import { VISIBILITY, OUTPUT_TYPE_OPTIONS, OUTPUT_FORMATS, DESTINATION_OPTIONS } from "./constants.js";
import { getOptionLabel, getWorkflowLabel, getConsumerLabel } from "./helpers.js";
import {
  getContractSchema,
  getAllowedConsumers,
  isSensitiveOutput,
  getRetentionPolicy,
  getContractRiskFlags,
} from "./contractHelpers.js";

export default function ContractsTab({ workflowDraft }) {
  return (
    <section className="contracts-enhanced-layout">
      <article className="contracts-overview-card wf-card">
        <CardHeader title="ضوابط المخرجات" subtitle="تحدد قواعد الظهور والمراجعة قبل استخدام المخرجات أو نشرها.">
          <span className="contracts-count">{workflowDraft.steps.length} عقود</span>
        </CardHeader>

        <div className="contracts-kpi-grid">
          <ContractKpi title="ظاهر للعميل" value={workflowDraft.steps.filter((step) => step.visibility === "customer_visible").length} />
          <ContractKpi title="يحتاج مراجعة" value={workflowDraft.steps.filter((step) => step.reviewRequired).length} />
          <ContractKpi title="يفتح مسارًا آخر" value={workflowDraft.steps.filter((step) => step.feedsNextWorkflow).length} />
          <ContractKpi title="داخلي فقط أو حساس" value={workflowDraft.steps.filter((step) => isSensitiveOutput(step)).length} />
        </div>
      </article>

      <section className="contracts-grid enhanced-contracts-grid">
        {workflowDraft.steps.map((step) => {
          const schema = getContractSchema(step);
          const allowedConsumers = getAllowedConsumers(step);
          const riskFlags = getContractRiskFlags(step);
          const sensitive = isSensitiveOutput(step);

          return (
            <article key={`${step.id}-contract`} className={`contract-card enhanced-contract-card wf-card ${riskFlags.length ? "has-risk" : ""}`}>
              <div className="contract-card-head">
                <div>
                  <h3>{step.name}</h3>
                  <p>{step.outputKey}</p>
                </div>
                <span className={`visibility-pill ${step.visibility}`}>
                  {VISIBILITY.find(([id]) => id === step.visibility)?.[1] || step.visibility}
                </span>
              </div>

              <div className="contract-info-grid">
                <Info label="نوع المخرج" value={getOptionLabel(OUTPUT_TYPE_OPTIONS, step.outputType)} />
                <Info label="صيغة المخرج" value={getOptionLabel(OUTPUT_FORMATS, step.outputFormat || "text")} />
                <Info label="وجهة المخرج" value={getOptionLabel(DESTINATION_OPTIONS, step.destination)} />
                <Info label="مراجعة قبل النشر" value={step.reviewRequired ? "نعم" : "لا"} />
                <Info label="يفتح مسارًا آخر" value={step.feedsNextWorkflow ? getWorkflowLabel(step.nextWorkflowType) : "لا"} />
                <Info label="حساس أو داخلي فقط" value={sensitive ? "نعم" : "لا"} />
                <Info label="مدة الاحتفاظ" value={getRetentionPolicy(step)} />
              </div>

              <div className="schema-preview">
                <strong>قواعد الظهور</strong>
                <div className="schema-fields">
                  {schema.required.map((field) => (
                    <span key={field}>{field}</span>
                  ))}
                </div>
              </div>

              <div className="allowed-consumers">
                <strong>وجهة المخرج</strong>
                <div>
                  {allowedConsumers.map((consumer) => (
                    <span key={consumer}>{getConsumerLabel(consumer)}</span>
                  ))}
                </div>
              </div>

              {riskFlags.length ? (
                <div className="contract-risk-box">
                  <strong>ضوابط مطلوبة</strong>
                  {riskFlags.map((risk) => (
                    <p key={risk}>{risk}</p>
                  ))}
                </div>
              ) : (
                <div className="contract-safe-box">
                  <CheckCircle2 size={16} />
                  لا توجد ملاحظات حرجة على هذا العقد.
                </div>
              )}
            </article>
          );
        })}
      </section>
    </section>
  );
}
