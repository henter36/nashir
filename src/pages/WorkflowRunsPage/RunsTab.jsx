import { AlertTriangle, Clock3, RefreshCw, XCircle, ShieldCheck, FileSearch } from "lucide-react";
import { Info, Status } from "./components.jsx";
import { RUNS, STATUS_META } from "./constants.js";

export default function RunsTab({
  selectedRun,
  setSelectedRunId,
  runActionLog,
  retrySelectedRun,
  cancelSelectedRun,
  sendSelectedRunToReview,
  copySelectedRunId,
}) {
  return (
    <section className="runs-layout enhanced-runs-layout">
      <article className="runs-card">
        <div className="card-header">
          <div>
            <h2>مراقبة التشغيلات</h2>
            <p>تعرض حالات التشغيل والأخطاء والمراجعات المطلوبة كما يجب أن تظهر عند التنفيذ.</p>
          </div>
          <span className="runs-count">{RUNS.length} تشغيلات</span>
        </div>

        <div className="runs-list">
          {RUNS.map((run) => (
            <button
              key={run.id}
              type="button"
              className={`run-row ${selectedRun.id === run.id ? "selected" : ""}`}
              onClick={() => setSelectedRunId(run.id)}
            >
              <div>
                <strong>{run.title}</strong>
                <span>{run.workflowType} · {run.createdAt}</span>
                <small>{run.modelUsed}</small>
              </div>
              <Status value={run.status} />
            </button>
          ))}
        </div>
      </article>

      <article className="run-detail-card">
        <div className="card-header">
          <div>
            <h2>{selectedRun.title}</h2>
            <p>حالة التشغيل: {STATUS_META[selectedRun.status]?.[0] || selectedRun.status}</p>
          </div>
          <Status value={selectedRun.status} />
        </div>

        <div className="run-info-grid">
          <Info label="نوع المسار" value={selectedRun.workflowType} />
          <Info label="الخطوة الحالية" value={selectedRun.currentStep} />
          <Info label="المعالج المستخدم" value={selectedRun.modelUsed} />
          <Info label="مصدر الطلب" value={selectedRun.source} />
          <Info label="مدة التشغيل" value={selectedRun.duration} />
          <Info label="تقدير التكلفة" value={`$${selectedRun.cost}`} />
          <Info label="المسؤول" value={selectedRun.owner} />
          <Info label="آخر تشغيل" value={selectedRun.createdAt} />
          <Info label="سبب التعطل" value={selectedRun.error || (selectedRun.status === "waiting_for_review" ? "يحتاج مراجعة" : "—")} />
          <Info label="جاهز للاستكمال" value={selectedRun.status === "waiting_for_review" ? "بعد المراجعة" : "حسب الحالة"} />
        </div>

        <div className="run-actions">
          <button type="button" onClick={retrySelectedRun}>
            <RefreshCw size={15} />
            إعادة تشغيل المسار
          </button>
          <button type="button" onClick={cancelSelectedRun}>
            <XCircle size={15} />
            إلغاء التشغيل
          </button>
          <button type="button" onClick={sendSelectedRunToReview}>
            <ShieldCheck size={15} />
            إرسال التشغيل للمراجعة
          </button>
          <button type="button" onClick={copySelectedRunId}>
            <FileSearch size={15} />
            نسخ اسم التشغيل
          </button>
        </div>

        <div className="safe-preview-grid">
          <div className="safe-preview">
            <strong>ملخص المدخل</strong>
            <p>{selectedRun.inputSummary}</p>
          </div>
          <div className="safe-preview">
            <strong>ملخص المخرج</strong>
            <p>{selectedRun.outputSummary}</p>
          </div>
        </div>

        {selectedRun.error ? (
          <div className="run-error">
            <strong>سبب التعطل</strong>
            <code>{selectedRun.error}</code>
          </div>
        ) : null}

        <div className="governance-alert compact-alert">
          <ShieldCheck size={18} />
          <div>
            <strong>عرض آمن للتشغيل</strong>
            <p>لا يتم عرض أسرار، Tokens، أو بيانات عملاء خام داخل هذه اللوحة.</p>
          </div>
        </div>
      </article>

      <article className="run-timeline-card">
        <h2>Step Timeline</h2>
        <div className="run-timeline">
          {(selectedRun.steps || []).map(([id, label, duration, status]) => (
            <div key={`${selectedRun.id}-${id}`} className={`run-step ${status}`}>
              <div className="run-dot" />
              <div>
                <strong>{label}</strong>
                <span>{duration}</span>
              </div>
              <Status value={status} />
            </div>
          ))}
        </div>
      </article>

      <article className="run-warnings-card">
        <h2>التحذيرات والإجراءات</h2>

        <div className="warnings-list">
          {selectedRun.warnings?.length ? (
            selectedRun.warnings.map((warning) => (
              <div key={warning} className="warning-row">
                <AlertTriangle size={15} />
                <span>{warning}</span>
              </div>
            ))
          ) : (
            <p className="empty">لا توجد تحذيرات لهذا التشغيل.</p>
          )}
        </div>

        <div className="actions-log">
          {runActionLog.length ? (
            runActionLog.map((item) => (
              <div key={item.id} className={`action-row ${item.tone}`}>
                <Clock3 size={15} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail} · {item.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty">لم يتم تنفيذ إجراء بعد.</p>
          )}
        </div>
      </article>
    </section>
  );
}
