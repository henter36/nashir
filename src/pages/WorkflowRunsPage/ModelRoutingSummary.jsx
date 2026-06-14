import { CircleAlert, GitBranch } from "lucide-react";
import {
  buildStepReadiness,
  getModelRouteSummary,
  getModelRouteWarnings,
  getCostLimitLabel,
} from "./helpers.js";

export default function ModelRoutingSummary({ step, readinessContext = {}, compact = false }) {
  if (!step || step.processorType !== "model_call") return null;

  const readiness = buildStepReadiness(step, readinessContext);
  const route = getModelRouteSummary(step.processor);
  const warnings = Array.from(new Set([
    ...getModelRouteWarnings(step, route),
    ...readiness.warnings,
    ...readiness.blockedReasons,
  ]));

  const statusClass = !route ? "missing" : warnings.length ? "has-warning" : "safe";
  const TitleIcon = route ? GitBranch : CircleAlert;

  return (
    <div className={`model-route-summary ${statusClass} ${compact ? "compact" : ""}`}>
      <div className="model-route-title">
        <TitleIcon size={15} />
        <strong>مسار النموذج</strong>
      </div>

      {route ? (
        <>
          <div className="model-route-lines">
            <span>المسار الأساسي: <b>{route.primaryModel}</b></span>
            <span>المسار البديل: <b>{route.fallback.length ? route.fallback.join(" → ") : "لا يوجد"}</b></span>
            <span>حد التكلفة: <b>{getCostLimitLabel(readiness.route, readiness.costRow) || `$${route.maxCostPerRun}`}</b></span>
            <span>المراجعة: <b>{route.humanReviewRequired ? "مطلوبة" : "غير مطلوبة"}</b></span>
          </div>

          {warnings.length ? (
            <div className="model-route-warnings">
              {warnings.map((warning) => (
                <span key={warning}>{warning}</span>
              ))}
            </div>
          ) : (
            <p className="model-route-safe-note">المسار مرتبط ومحكوم كقراءة فقط من شاشة توجيه النماذج.</p>
          )}
        </>
      ) : (
        <p>لا يوجد مسار نموذج مطابق لهذه الخطوة. يجب ربطها قبل التشغيل عند التنفيذ.</p>
      )}
    </div>
  );
}
