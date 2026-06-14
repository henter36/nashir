import { PlayCircle, CircleAlert } from "lucide-react";
import { DESTINATION_OPTIONS, OUTPUT_TYPE_OPTIONS, VISIBILITY } from "./constants.js";
import { getStepOutputName, getOptionLabel } from "./helpers.js";

export default function TestTab({
  testInput,
  setTestInput,
  runLocalTest,
  dryRunResult,
  testLog,
}) {
  return (
    <section className="enhanced-test-layout">
      <article className="test-card">
        <div className="card-header">
          <div>
            <h2>اختبار المسار</h2>
            <p>
              يوضح كيف سيتم فحص المسار قبل التشغيل الفعلي.
            </p>
          </div>
        </div>

        <label className="field">
          <span>مصدر الاختبار</span>
          <select
            value={testInput.sourceScreen}
            onChange={(event) =>
              setTestInput((prev) => ({
                ...prev,
                sourceScreen: event.target.value,
              }))
            }
          >
            <option>Store Setup</option>
            <option>Campaign Wizard</option>
            <option>Asset Library</option>
            <option>Content Studio</option>
            <option>Review</option>
            <option>Analytics</option>
          </select>
        </label>

        <label className="field">
          <span>عينة المدخلات</span>
          <textarea
            value={testInput.samplePayload}
            onChange={(event) =>
              setTestInput((prev) => ({
                ...prev,
                samplePayload: event.target.value,
              }))
            }
          />
        </label>

        <div className="dry-run-mode">
          <strong>المتطلبات قبل التشغيل</strong>
          <span>يجب التحقق من المدخلات، ضوابط المخرجات، والتكلفة قبل الانتقال للتنفيذ.</span>
        </div>

        <button type="button" className="primary-button" onClick={runLocalTest}>
          <PlayCircle size={16} />
          اختبار المسار
        </button>
      </article>

      <article className="test-card">
        <div className="card-header">
          <div>
            <h2>نتيجة الاختبار</h2>
            <p>نتيجة التحقق من المدخلات والسياسات قبل التشغيل.</p>
          </div>
        </div>

        {dryRunResult ? (
          <div
            className={
              dryRunResult.status === "passed"
                ? "dry-result passed"
                : "dry-result blocked"
            }
          >
            <strong>
              {dryRunResult.status === "passed"
                ? "نجح الاختبار"
                : "تم حظر الاختبار"}
            </strong>

            <span>
              التكلفة التقديرية: ${dryRunResult.estimatedCost} · الزمن التقديري:{" "}
              {dryRunResult.estimatedDuration}s
            </span>
            <span>مشغل المسار: {dryRunResult.triggerSummary}</span>

            {dryRunResult.blockedReasons.length ? (
              <div className="blocked-list">
                <strong>أسباب الحظر</strong>
                {dryRunResult.blockedReasons.map((reason) => (
                  <div key={reason}>
                    <CircleAlert size={16} />
                    {reason}
                  </div>
                ))}
              </div>
            ) : (
              <p>لا توجد أسباب حظر. يمكن الانتقال للتشغيل لاحقًا بعد توفر الصلاحيات المطلوبة.</p>
            )}
          </div>
        ) : (
          <p className="empty">لم يتم تنفيذ أي اختبار بعد.</p>
        )}
      </article>

      <article className="test-card wide-test-card">
        <h2>تسلسل فحص الخطوات</h2>

        {dryRunResult ? (
          <div className="simulation-table">
            <div className="simulation-head">
              <span>#</span>
              <span>الخطوة</span>
              <span>المعالج</span>
              <span>مسار النموذج</span>
              <span>المدخل</span>
              <span>المخرج</span>
              <span>الوجهة</span>
              <span>الحالة</span>
            </div>

            {dryRunResult.simulatedSteps.map((step) => (
              <div key={step.index} className="simulation-row">
                <span>{step.index}</span>
                <strong>{step.name}</strong>
                <span>{step.processor}</span>
                <span>{step.modelRoute ? step.modelRoute.primaryModel : "—"}</span>
                <span>{(step.inputFrom || []).join(" + ")}</span>
                <span>{getStepOutputName(step)}</span>
                <span>{getOptionLabel(DESTINATION_OPTIONS, step.destination)}</span>
                <span className={step.result === "passed" ? "sim-ok" : "sim-blocked"}>
                  {step.result}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">شغّل اختبار المسار لرؤية فحص الخطوات.</p>
        )}
      </article>

      <article className="test-card wide-test-card">
        <h2>المخرجات المتوقعة</h2>

        {dryRunResult ? (
          <div className="expected-grid">
            {dryRunResult.expectedOutputs.map((output) => (
              <div key={output.outputKey} className={`expected-card ${output.visibility}`}>
                <strong>{output.outputKey}</strong>
                <span>{getOptionLabel(OUTPUT_TYPE_OPTIONS, output.outputType)}</span>
                <small>{getOptionLabel(DESTINATION_OPTIONS, output.destination)}</small>
                <em>{VISIBILITY.find(([id]) => id === output.visibility)?.[1] || output.visibility}</em>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">لا توجد مخرجات متوقعة قبل تشغيل الاختبار.</p>
        )}
      </article>

      <article className="test-card wide-test-card">
        <h2>سجل الاختبار</h2>
        <div className="test-log">
          {testLog.length ? (
            testLog.map((log) => (
              <div key={log.id} className="test-row">
                <strong>{log.workflow}</strong>
                <span>{log.message}</span>
                <small>{log.time}</small>
              </div>
            ))
          ) : (
            <p className="empty">لم يتم تنفيذ أي اختبار بعد.</p>
          )}
        </div>
      </article>
    </section>
  );
}
