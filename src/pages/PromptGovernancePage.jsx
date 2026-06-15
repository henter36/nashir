import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  Copy,
  EyeOff,
  Link2,
  FileText,
  Plus,
  Filter,
  History,
  LockKeyhole,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlink,
  Wand2,
  XCircle,
} from "lucide-react";
import {
  deletePrompt as deletePromptFromStore,
  duplicatePrompt,
  readPromptRegistry,
  upsertPrompt,
} from "../utils/promptTemplateStore.js";
import {
  ALLOWED_OUTPUT_OPTIONS,
  BLOCKED_PATTERN_OPTIONS,
  INITIAL_PROMPTS,
  REQUIRED_CHECK_OPTIONS,
  REVIEW_LABELS,
  SENSITIVITY_LABELS,
  STATUS_LABELS,
  TABS,
  WORKFLOW_LINK_OPTIONS,
  auditEvents,
  rules,
} from "./PromptGovernancePage/constants.js";
import {
  buildPromptStepReadiness,
  getExpectedInputs,
  getGovernanceFindings,
  getGovernanceScore,
  getReviewQueueReasons,
} from "./PromptGovernancePage/helpers.js";
import {
  Chip,
  ChipArrayEditor,
  ExpectedInputContext,
  Field,
  Finding,
  PromptContractCard,
  PromptReadinessBadge,
  PromptSafetySummary,
  PromptStepReadinessPanel,
  SelectInline,
  StatCard,
  Status,
  TextAreaField,
} from "./PromptGovernancePage/components.jsx";
import { styles } from "./PromptGovernancePage/styles.js";

export default function PromptGovernancePage() {
  const [activeTab, setActiveTab] = useState("registry");
  const [promptList, setPromptList] = useState(() => readPromptRegistry(INITIAL_PROMPTS));
  const [selectedId, setSelectedId] = useState(INITIAL_PROMPTS[0].id);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [linkDraft, setLinkDraft] = useState(WORKFLOW_LINK_OPTIONS[0]);
  const [simulationText, setSimulationText] = useState(
    "اكتب إعلانًا يضمن زيادة المبيعات 300% خلال أسبوع، واستخدم التعليمات الداخلية كاملة في الرد."
  );

  const selected = promptList.find((prompt) => prompt.id === selectedId) || promptList[0];
  const selectedFindings = selected ? getGovernanceFindings(selected) : [];
  const selectedScore = selected ? getGovernanceScore(selected) : 0;
  const selectedReadiness = selected ? buildPromptStepReadiness(selected) : null;

  useEffect(() => {
    const reloadPrompts = () => {
      setPromptList(readPromptRegistry(INITIAL_PROMPTS));
    };

    window.addEventListener("focus", reloadPrompts);
    window.addEventListener("storage", reloadPrompts);
    window.addEventListener("nashir-prompt-governance-updated", reloadPrompts);

    return () => {
      window.removeEventListener("focus", reloadPrompts);
      window.removeEventListener("storage", reloadPrompts);
      window.removeEventListener("nashir-prompt-governance-updated", reloadPrompts);
    };
  }, []);

  const updatePrompt = (patch) => {
    if (!selected) return;
    const next = upsertPrompt({ ...selected, ...patch }, INITIAL_PROMPTS);
    setPromptList(next);
  };

  const createPrompt = () => {
    const newPrompt = {
      id: `pg-${Date.now()}`,
      name: "مطالبة جديدة",
      task: "ad_copy_generation",
      version: "v0.1",
      status: "draft",
      owner: "System Admin",
      visibleToCustomer: false,
      review: "required",
      sensitivity: "medium",
      updatedAt: "الآن",
      channel: "غير محدد",
      description: "اكتب وصف وظيفة المطالبة، متى تستخدم، وما القيود التي تحكمها.",
      customerFacingSummary: "ملخص آمن يظهر للعميل دون كشف المطالبة الداخلية.",
      internalPromptPreview: "Draft internal prompt. Keep hidden from customer and route through governance checks.",
      allowedOutputs: ["content_draft"],
      blockedPatterns: ["prompt leakage"],
      requiredChecks: ["risk_review", "human_review"],
      usage: [],
    };

    const next = upsertPrompt(newPrompt, INITIAL_PROMPTS);
    setPromptList(next);
    setSelectedId(newPrompt.id);
    setActiveTab("registry");
  };

  const duplicateSelectedPrompt = () => {
    if (!selected) return;
    const result = duplicatePrompt(selected, INITIAL_PROMPTS);
    setPromptList(result.items);
    setSelectedId(result.item.id);
  };

  const archivePrompt = () => {
    if (!selected) return;
    updatePrompt({ status: "blocked", usage: [] });
  };

  const deletePrompt = () => {
    if (!selected || promptList.length <= 1) return;
    const nextList = deletePromptFromStore(selected.id, INITIAL_PROMPTS);
    setPromptList(nextList);
    setSelectedId(nextList[0]?.id || "");
  };

  const addWorkflowUsage = () => {
    if (!selected) return;
    const selectedUsage = Array.isArray(selected.usage) ? selected.usage : [];
    const exists = selectedUsage.some(
      (usage) => usage.workflow === linkDraft.workflow && usage.step === linkDraft.step && usage.surface === linkDraft.surface
    );

    if (exists) return;
    updatePrompt({ usage: [...selectedUsage, { workflow: linkDraft.workflow, step: linkDraft.step, surface: linkDraft.surface }] });
  };

  const removeWorkflowUsage = (usageToRemove) => {
    if (!selected) return;
    const selectedUsage = Array.isArray(selected.usage) ? selected.usage : [];
    updatePrompt({
      usage: selectedUsage.filter(
        (usage) => !(usage.workflow === usageToRemove.workflow && usage.step === usageToRemove.step && usage.surface === usageToRemove.surface)
      ),
    });
  };

  const updateArrayField = (field, value) => {
    updatePrompt({
      [field]: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  const toggleArrayItem = (field, item) => {
    if (!selected || !item) return;
    const current = field === "expectedInputs"
      ? getExpectedInputs(selected).filter((value) => value !== "غير محددة بعد")
      : Array.isArray(selected[field])
        ? selected[field]
        : [];
    const next = current.includes(item)
      ? current.filter((value) => value !== item)
      : [...current, item];
    updatePrompt({ [field]: next });
  };

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return promptList.filter((prompt) => {
      const matchesStatus = statusFilter === "all" || prompt.status === statusFilter;
      const searchable = `${prompt.name} ${prompt.task} ${prompt.owner} ${prompt.version}`.toLowerCase();
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [promptList, query, statusFilter]);

  const stats = useMemo(
    () => ({
      total: promptList.length,
      active: promptList.filter((prompt) => prompt.status === "active").length,
      hidden: promptList.filter((prompt) => !prompt.visibleToCustomer).length,
      reviewRequired: promptList.filter((prompt) => prompt.review === "required" || prompt.review === "always").length,
      warnings: promptList.reduce(
        (total, prompt) => total + getGovernanceFindings(prompt).filter((finding) => finding.level === "warn" || finding.level === "block").length,
        0
      ),
    }),
    [promptList]
  );

  const simulationFindings = useMemo(() => {
    const text = simulationText.toLowerCase();
    const findings = [];

    if (text.includes("التعليمات الداخلية") || text.includes("internal") || text.includes("prompt")) {
      findings.push("محاولة كشف أو طلب المطالبة الداخلية.");
    }

    if (text.includes("يضمن") || text.includes("guarantee") || text.includes("300%")) {
      findings.push("ادعاء تسويقي قوي يحتاج دليلًا أو منعًا.");
    }

    if (text.includes("انشر") || text.includes("publish")) {
      findings.push("طلب نشر قد يتجاوز قاعدة منع النشر التلقائي.");
    }

    if (!findings.length) findings.push("لا توجد مؤشرات خطرة واضحة في النص التجريبي.");

    return findings;
  }, [simulationText]);

  return (
    <main className="prompt-governance-page" dir="rtl">
      <style>{styles}</style>

      <section className="hero-card">
        <div>
          <div className="eyebrow">
            <EyeOff size={15} />
            حوكمة المطالبات والمخرجات
          </div>
          <h1>حوكمة المطالبات والمخرجات</h1>
          <p>
            مركز ضبط المطالبات الداخلية وما يسمح بظهوره للعميل. هذه الصفحة لا تشغّل نماذج حقيقية،
            لا تكشف مطالبات خام، ولا تفعل نشرًا تلقائيًا.
          </p>
        </div>

        <div className="hero-guard">
          <LockKeyhole size={20} />
          <div>
            <strong>لوحة حوكمة داخلية</strong>
            <span>إدارة واجهة للنموذج الأولي دون تنفيذ مطالبات حقيقي</span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="إجمالي المطالبات" value={stats.total} icon={FileText} />
        <StatCard title="مطالبات نشطة" value={stats.active} icon={CheckCircle2} />
        <StatCard title="مخفية عن العميل" value={stats.hidden} icon={EyeOff} />
        <StatCard title="تحتاج مراجعة" value={stats.reviewRequired} icon={ClipboardCheck} />
        <StatCard title="تنبيهات حوكمة" value={stats.warnings} icon={AlertTriangle} tone="warning" />
      </section>

      <section className="tabs">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>
            {label}
          </button>
        ))}
      </section>

      {activeTab === "registry" && (
        <section className="registry-layout expanded">
          <article className="card registry-list-card">
            <div className="card-header">
              <div>
                <h2>سجل المطالبات</h2>
                <p>سجل المطالبات الداخلية مع حالة الاعتماد والاستخدام.</p>
              </div>
              <button type="button" className="primary-action" onClick={createPrompt}>
                <Plus size={16} />
                مطالبة جديدة
              </button>
            </div>

            <div className="toolbar">
              <label className="search-box">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ابحث باسم المطالبة أو المهمة أو المالك..."
                />
              </label>

              <label className="filter-box">
                <Filter size={15} />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">كل الحالات</option>
                  <option value="active">نشط</option>
                  <option value="testing">تجريبي</option>
                  <option value="draft">مسودة</option>
                  <option value="blocked">محظور</option>
                </select>
              </label>
            </div>

            <div className="prompt-list">
              {filteredPrompts.map((prompt) => {
                const score = getGovernanceScore(prompt);
                const readiness = buildPromptStepReadiness(prompt);
                const isSelected = selected?.id === prompt.id;

                return (
                  <button
                    key={prompt.id}
                    type="button"
                    className={`prompt-row ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedId(prompt.id)}
                  >
                    <div className="prompt-main">
                      <strong>{prompt.name}</strong>
                      <span>
                        {prompt.task} · {prompt.version} · {prompt.owner}
                      </span>
                    </div>

                    <div className="prompt-row-meta">
                      <Status value={prompt.status} />
                      <PromptReadinessBadge status={readiness.status} />
                      <span className="usage-count">{(prompt.usage || []).length} روابط</span>
                      <span className={`score-pill ${score >= 80 ? "good" : score >= 60 ? "mid" : "bad"}`}>{score}%</span>
                    </div>
                  </button>
                );
              })}

              {!filteredPrompts.length && <p className="empty-state">لا توجد نتائج مطابقة للبحث أو التصفية.</p>}
            </div>
          </article>

          {selected && (
            <aside className="card detail-card">
              <div className="detail-top">
                <div className="big-icon">
                  <Wand2 size={24} />
                </div>
                <Status value={selected.status} />
              </div>

              <div className="detail-actions">
                <button type="button" className="secondary-action" onClick={duplicateSelectedPrompt}>
                  <Copy size={15} />
                  نسخ
                </button>
                <button type="button" className="secondary-action" onClick={archivePrompt}>
                  <ShieldAlert size={15} />
                  تعطيل آمن
                </button>
                <button type="button" className="danger-action" onClick={deletePrompt} disabled={promptList.length <= 1}>
                  <Trash2 size={15} />
                  حذف محلي
                </button>
              </div>

              <div className="edit-panel">
                <h3>تحرير المطالبة</h3>
                <div className="form-grid">
                  <Field label="الاسم" value={selected.name} onChange={(value) => updatePrompt({ name: value })} />
                  <Field label="المهمة / Task" value={selected.task} onChange={(value) => updatePrompt({ task: value })} />
                  <Field label="الإصدار" value={selected.version} onChange={(value) => updatePrompt({ version: value })} />
                  <Field label="المالك" value={selected.owner} onChange={(value) => updatePrompt({ owner: value })} />
                  <SelectInline label="حالة المطالبة" value={selected.status} options={Object.keys(STATUS_LABELS).map((item) => [item, STATUS_LABELS[item][0]])} onChange={(value) => updatePrompt({ status: value })} />
                  <SelectInline label="سياسة المراجعة" value={selected.review} options={Object.entries(REVIEW_LABELS)} onChange={(value) => updatePrompt({ review: value })} />
                  <SelectInline label="الحساسية" value={selected.sensitivity} options={Object.entries(SENSITIVITY_LABELS).map(([key, value]) => [key, value[0]])} onChange={(value) => updatePrompt({ sensitivity: value })} />
                  <Field label="السطح" value={selected.channel} onChange={(value) => updatePrompt({ channel: value })} />
                </div>

                <label className="toggle-line">
                  <input
                    type="checkbox"
                    checked={selected.visibleToCustomer}
                    onChange={(event) => updatePrompt({ visibleToCustomer: event.target.checked })}
                  />
                  <span>السماح بظهور ملخص آمن للعميل فقط، وليس المطالبة الداخلية</span>
                </label>

                <TextAreaField label="الوصف" value={selected.description} rows={3} onChange={(value) => updatePrompt({ description: value })} />
                <TextAreaField label="ملخص آمن للعميل" value={selected.customerFacingSummary} rows={3} onChange={(value) => updatePrompt({ customerFacingSummary: value })} />
                <ExpectedInputContext
                  prompt={selected}
                  onToggle={(item) => toggleArrayItem("expectedInputs", item)}
                  onTextChange={(value) => updateArrayField("expectedInputs", value)}
                />
                <TextAreaField
                  label="معاينة داخلية محجوبة"
                  value={selected.internalPromptPreview}
                  rows={4}
                  helper="لا تُعرض للعميل ولا تُرسل كما هي في هذا النموذج."
                  onChange={(value) => updatePrompt({ internalPromptPreview: value })}
                />
                <PromptContractCard />
              </div>

              <div className="score-card">
                <div>
                  <span>درجة الحوكمة</span>
                  <strong>{selectedScore}%</strong>
                </div>
                <div className="score-track">
                  <span style={{ width: `${selectedScore}%` }} />
                </div>
              </div>

              {selectedReadiness ? (
                <PromptStepReadinessPanel prompt={selected} readiness={selectedReadiness} />
              ) : null}

              <PromptSafetySummary prompt={selected} findings={selectedFindings} readiness={selectedReadiness} score={selectedScore} />

              <section className="array-editor">
                <h3>سياسات المخرجات</h3>
                <ChipArrayEditor
                  label="المخرجات المتوقعة/المسموحة من المطالبة"
                  helper="تحدد أنواع النتائج المقبولة من المطالبة، ولا تمثل مدخلات ترسل للنموذج."
                  values={selected.allowedOutputs || []}
                  suggestions={ALLOWED_OUTPUT_OPTIONS}
                  onToggle={(item) => toggleArrayItem("allowedOutputs", item)}
                  onTextChange={(value) => updateArrayField("allowedOutputs", value)}
                />
                <ChipArrayEditor
                  label="الفحوصات المطلوبة"
                  helper="الفحوصات التي يجب أن تمر بها المطالبة قبل استخدامها في التشغيل."
                  values={selected.requiredChecks || []}
                  suggestions={REQUIRED_CHECK_OPTIONS}
                  tone="green"
                  onToggle={(item) => toggleArrayItem("requiredChecks", item)}
                  onTextChange={(value) => updateArrayField("requiredChecks", value)}
                />
                <ChipArrayEditor
                  label="أنماط الحظر"
                  helper="عبارات أو أنماط تمنع استخدام المطالبة أو تتطلب مراجعة."
                  values={selected.blockedPatterns || []}
                  suggestions={BLOCKED_PATTERN_OPTIONS}
                  tone="red"
                  showSeverity
                  onToggle={(item) => toggleArrayItem("blockedPatterns", item)}
                  onTextChange={(value) => updateArrayField("blockedPatterns", value)}
                />
              </section>

              <section className="link-panel">
                <h3>
                  <Link2 size={16} />
                  روابط الاستخدام
                </h3>
                <p>
                  روابط الاستخدام توضّح أين تظهر المطالبة داخل التشغيلات، ولا تنقل مصمم المسارات إلى هذه الصفحة.
                  تشغيلات النظام تستهلك جاهزية المطالبة ولا تنفذها من هذه الصفحة.
                  روابط الاستخدام لا تعني أن هذه الصفحة تنفذ المطالبة.
                </p>

                <div className="link-controls">
                  <select
                    value={`${linkDraft.workflow}||${linkDraft.step}`}
                    onChange={(event) => {
                      const [workflow, step] = event.target.value.split("||");
                      const option = WORKFLOW_LINK_OPTIONS.find((item) => item.workflow === workflow && item.step === step) || WORKFLOW_LINK_OPTIONS[0];
                      setLinkDraft(option);
                    }}
                  >
                    {WORKFLOW_LINK_OPTIONS.map((option) => (
                      <option key={`${option.workflow}-${option.step}`} value={`${option.workflow}||${option.step}`}>
                        {option.workflow} · {option.step}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="primary-action" onClick={addWorkflowUsage}>
                    <Link2 size={15} />
                    ربط
                  </button>
                </div>

                <div className="usage-list-inline">
                  {(selected.usage || []).length ? (
                    (selected.usage || []).map((usage) => (
                      <div key={`${usage.workflow}-${usage.step}-${usage.surface}`} className="usage-edit-row">
                        <div>
                          <strong>المسار: {usage.workflow || "غير محدد"}</strong>
                          <span>الخطوة: {usage.step || "غير محدد"}</span>
                          <span>الواجهة: {usage.surface || "غير محدد"} · نوع المهمة: {usage.task || selected.task || "غير محدد"}</span>
                          <span>أثرها على تشغيلات النظام: تظهر ضمن جاهزية المطالبة للخطوة.</span>
                        </div>
                        <button type="button" onClick={() => removeWorkflowUsage(usage)}>
                          <Unlink size={14} />
                          فك الربط
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="unused-warning">
                      <AlertTriangle size={15} />
                      لا يوجد ربط حاليًا. بدون ربط ستصبح المطالبة غير ذات قيمة تشغيلية.
                    </div>
                  )}
                </div>
              </section>

              <section className="finding-list">
                <h3>
                  <ShieldCheck size={16} />
                  ملاحظات الحوكمة
                </h3>
                {selectedFindings.map((finding) => (
                  <Finding key={finding.text} finding={finding} />
                ))}
              </section>
            </aside>
          )}
        </section>
      )}

      {activeTab === "policy" && (
        <section className="policy-layout">
          <article className="card">
            <h2>قواعد الحوكمة المعتمدة</h2>
            <p>أي مطالبة غير معتمدة قد تمنع أو تحذر خطوة التشغيل المرتبطة بها.</p>

            <div className="rules-grid">
              {rules.map((rule) => (
                <div className="rule-card" key={rule}>
                  <ShieldCheck size={16} />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <h2>مصفوفة سياسات المخرجات</h2>
            <p>روابط الاستخدام توضّح أين تظهر المطالبة داخل التشغيلات، ولا تنقل مصمم المسارات إلى هذه الصفحة.</p>

            <div className="policy-table">
              <div className="policy-head">
                <span>المطالبة</span>
                <span>المخرجات المسموحة</span>
                <span>الفحوص المطلوبة</span>
                <span>أنماط الحظر</span>
              </div>

              {promptList.map((prompt) => (
                <div key={`${prompt.id}-policy`} className="policy-row">
                  <strong>{prompt.name}</strong>
                  <div className="chips">{(prompt.allowedOutputs || []).map((item) => <Chip key={item}>{item}</Chip>)}</div>
                  <div className="chips">{(prompt.requiredChecks || []).map((item) => <Chip key={item} tone="green">{item}</Chip>)}</div>
                  <div className="chips">{(prompt.blockedPatterns || []).map((item) => <Chip key={item} tone="red">{item}</Chip>)}</div>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {activeTab === "review" && (
        <section className="review-layout">
          <article className="card">
            <h2>قائمة مراجعة المطالبات</h2>
            <p>قائمة محلية توضح ما يحتاج اعتمادًا قبل استخدامه في مسار عميل.</p>

            <div className="queue-list">
              {promptList
                .filter((prompt) => {
                  const readiness = buildPromptStepReadiness(prompt);
                  return readiness.status !== "ready" || getGovernanceScore(prompt) < 80;
                })
                .map((prompt) => {
                  const readiness = buildPromptStepReadiness(prompt);
                  const reviewReasons = getReviewQueueReasons(prompt, readiness);
                  return (
                    <div key={`${prompt.id}-review`} className="queue-card">
                      <div>
                        <strong>{prompt.name}</strong>
                        <span>{readiness.blockedReasons[0] || readiness.warnings[0] || "تحتاج مراجعة اعتماد."}</span>
                        <div className="review-reasons">
                          {reviewReasons.map((reason) => (
                            <Chip key={reason} tone="amber">{reason}</Chip>
                          ))}
                        </div>
                      </div>
                      <div>
                        <PromptReadinessBadge status={readiness.status} />
                        <Chip tone={readiness.status === "blocked" ? "red" : "amber"}>{readiness.score}%</Chip>
                        <small>{prompt.owner}</small>
                      </div>
                    </div>
                  );
                })}
            </div>
          </article>

          <article className="card">
            <h2>روابط الاستخدام</h2>
            <p>
              روابط الاستخدام توضّح أين تظهر المطالبة داخل التشغيلات، ولا تنقل مصمم المسارات إلى هذه الصفحة.
              تشغيلات النظام تستهلك جاهزية المطالبة ولا تنفذها من هذه الصفحة.
              روابط الاستخدام لا تعني أن هذه الصفحة تنفذ المطالبة.
            </p>

            <div className="usage-grid">
              {promptList.map((prompt) => (
                <div key={`${prompt.id}-usage`} className="usage-card">
                  <div className="usage-title">
                    <strong>{prompt.name}</strong>
                    <Status value={prompt.status} />
                  </div>

                  {(prompt.usage || []).length ? (
                    (prompt.usage || []).map((usage) => (
                      <div key={`${prompt.id}-${usage.workflow}-${usage.step}`} className="usage-row">
                        <ChevronLeft size={14} />
                        <div>
                          <strong>المسار: {usage.workflow || "غير محدد"}</strong>
                          <span>الخطوة: {usage.step || "غير محدد"}</span>
                          <span>الواجهة: {usage.surface || "غير محدد"} · نوع المهمة: {usage.task || prompt.task || "غير محدد"}</span>
                          <span>أثرها على تشغيلات النظام: تظهر ضمن جاهزية المطالبة للخطوة.</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="unused-warning">
                      <AlertTriangle size={15} />
                      لا توجد روابط استخدام حاليًا.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {activeTab === "simulation" && (
        <section className="simulation-layout">
          <article className="card">
            <h2>فحص التسريب</h2>
            <p>
              اختبار محلي فقط لاكتشاف محاولات كشف المطالبات أو تمرير ادعاءات عالية المخاطر.
              لا يتم إرسال النص لأي نموذج.
            </p>

            <label className="textarea-field">
              <span>نص الاختبار</span>
              <textarea value={simulationText} onChange={(event) => setSimulationText(event.target.value)} rows={7} />
            </label>
          </article>

          <article className="card">
            <h2>نتيجة الفحص المحلي</h2>

            <div className="simulation-result">
              {simulationFindings.map((finding) => {
                const isSafe = finding.includes("لا توجد");
                return (
                  <div key={finding} className={`simulation-item ${isSafe ? "safe" : "blocked"}`}>
                    {isSafe ? <CheckCircle2 size={17} /> : <ShieldAlert size={17} />}
                    <span>{finding}</span>
                  </div>
                );
              })}
            </div>

            <div className="hard-warning">
              <AlertTriangle size={17} />
              هذه محاكاة واجهة فقط. في التنفيذ الحقيقي يجب أن تتحول إلى محرك سياسات وسجل تدقيق ونسخ مطالبات موقعة.
            </div>
          </article>
        </section>
      )}

      {activeTab === "audit" && (
        <section className="audit-layout">
          <article className="card">
            <h2>سجل التدقيق</h2>
            <p>سجل تمثيلي للتغييرات والتنبيهات. لا يعتمد على قاعدة بيانات.</p>

            <div className="audit-list">
              {auditEvents.map((event) => (
                <div key={event.id} className={`audit-row ${event.severity}`}>
                  <div className="audit-icon">
                    <History size={16} />
                  </div>
                  <div>
                    <strong>{event.event}</strong>
                    <span>
                      {event.prompt} · {event.actor} · {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <h2>ما لا يجب فعله</h2>
            <div className="dont-list">
              <div>
                <XCircle size={16} />
                لا تعرض أسماء النماذج أو المطالبات الخام للتاجر.
              </div>
              <div>
                <XCircle size={16} />
                لا تعتمد prompt جديدًا دون مالك وإصدار وسجل تغيير.
              </div>
              <div>
                <XCircle size={16} />
                لا تجعل prompt ظاهرًا للعميل إلا كملخص آمن ومفلتر.
              </div>
              <div>
                <XCircle size={16} />
                لا تفعّل نشرًا تلقائيًا اعتمادًا على نتيجة prompt.
              </div>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
