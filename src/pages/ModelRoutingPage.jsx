import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ListChecks,
  Plus,
  RefreshCw,
  Route,
  Save,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import {
  deriveCostRowsFromRoutes,
  readCostRows,
  readModelRegistry,
  readModelRoutes,
  upsertModel,
  upsertModelRoute,
  writeCostRows,
} from "../utils/modelCostStore.js";
import { MODEL_REGISTRY_SEED, ROUTES_SEED, TABS, TASK_TYPES } from "./ModelRoutingPage/constants.js";
import { buildRouteHealth, findTask, getRouteHealthLabel, getWorkflowUsageLabel, modelName } from "./ModelRoutingPage/helpers.js";
import { Field, Info, RouteHealthBadge, RouteHealthPanel, Stat, Status, Toggle, WorkflowUsagePanel } from "./ModelRoutingPage/components.jsx";
import { styles } from "./ModelRoutingPage/styles.js";

export default function ModelRoutingPage() {
  const [models, setModels] = useState(() => readModelRegistry(MODEL_REGISTRY_SEED));
  const [routes, setRoutes] = useState(() => readModelRoutes(ROUTES_SEED));
  const [activeTab, setActiveTab] = useState("routes");
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES_SEED[0].id);
  const [testTask, setTestTask] = useState("store_reading");
  const [testInput, setTestInput] = useState("https://store.example.com");
  const [testLog, setTestLog] = useState([]);
  const [costRows, setCostRows] = useState(() => readCostRows([]));

  const visibleRoutes = routes.length ? routes : ROUTES_SEED;
  const selectedRoute =
    visibleRoutes.find((route) => route.id === selectedRouteId) ||
    visibleRoutes[0] ||
    ROUTES_SEED[0];

  useEffect(() => {
    const reloadRouting = () => {
      setModels(readModelRegistry(MODEL_REGISTRY_SEED));
      setRoutes(readModelRoutes(ROUTES_SEED));
      setCostRows(readCostRows([]));
    };

    window.addEventListener("focus", reloadRouting);
    window.addEventListener("storage", reloadRouting);
    window.addEventListener("nashir-model-registry-updated", reloadRouting);
    window.addEventListener("nashir-model-routing-updated", reloadRouting);
    window.addEventListener("nashir-cost-monitor-updated", reloadRouting);

    return () => {
      window.removeEventListener("focus", reloadRouting);
      window.removeEventListener("storage", reloadRouting);
      window.removeEventListener("nashir-model-registry-updated", reloadRouting);
      window.removeEventListener("nashir-model-routing-updated", reloadRouting);
      window.removeEventListener("nashir-cost-monitor-updated", reloadRouting);
    };
  }, []);

  const stats = useMemo(
    () => ({
      models: models.length,
      activeModels: models.filter((model) => model.status === "active").length,
      routes: visibleRoutes.length,
      highCostRoutes: visibleRoutes.filter((route) => Number(route.cost?.maxCostPerRun || 0) >= 1).length,
    }),
    [models, visibleRoutes]
  );

  const syncRouteCosts = (nextRoutes, nextModels = models) => {
    const currentRows = readCostRows([]);
    const derivedRows = deriveCostRowsFromRoutes(nextRoutes, currentRows, nextModels);
    writeCostRows(derivedRows);
  };

  const updateRoute = (routeId, patch) => {
    const route = routes.find((item) => item.id === routeId);

    if (!route) return;

    const updatedRoute = {
      ...route,
      ...patch,
    };
    const next = upsertModelRoute(updatedRoute, ROUTES_SEED);

    setRoutes(next);
    syncRouteCosts(next);
  };

  const updateRouteNested = (routeId, section, key, value) => {
    const route = routes.find((item) => item.id === routeId);

    if (!route) return;

    const updatedRoute = {
      ...route,
      [section]: {
        ...route[section],
        [key]: value,
      },
    };
    const next = upsertModelRoute(updatedRoute, ROUTES_SEED);

    setRoutes(next);
    syncRouteCosts(next);
  };

  const updateModelStatus = (modelId, status) => {
    const model = models.find((item) => item.id === modelId);

    if (!model) return;

    const next = upsertModel({ ...model, status }, MODEL_REGISTRY_SEED);

    setModels(next);
    syncRouteCosts(routes, next);
  };

  const addFallback = (routeId, modelId) => {
    const route = routes.find((item) => item.id === routeId);

    const fallbackModelIds = Array.isArray(route?.fallbackModelIds) ? route.fallbackModelIds : [];

    if (!route || !modelId || fallbackModelIds.includes(modelId)) return;

    const updatedRoute = {
      ...route,
      fallbackModelIds: [...fallbackModelIds, modelId],
    };
    const next = upsertModelRoute(updatedRoute, ROUTES_SEED);

    setRoutes(next);
    syncRouteCosts(next);
  };

  const removeFallback = (routeId, modelId) => {
    const route = routes.find((item) => item.id === routeId);

    if (!route) return;

    const updatedRoute = {
      ...route,
      fallbackModelIds: (route.fallbackModelIds || []).filter((id) => id !== modelId),
    };
    const next = upsertModelRoute(updatedRoute, ROUTES_SEED);

    setRoutes(next);
    syncRouteCosts(next);
  };

  const runTest = () => {
    const route = visibleRoutes.find((item) => item.taskType === testTask);
    const task = findTask(testTask);
    const routeHealth = buildRouteHealth(route, models, costRows);
    const primary = route ? modelName(models, route.primaryModelId) : "غير محدد";
    const fallback = route?.fallbackModelIds?.length
      ? route.fallbackModelIds.map((id) => modelName(models, id)).join(" → ")
      : "لا يوجد";

    const estimatedCost = route?.cost?.maxCostPerRun || "0.00";
    const routeBlocked = !route || routeHealth.status === "blocked";
    const routeNeedsTuning = routeHealth.status === "warning";

    setTestLog((prev) => [
      {
        id: Date.now(),
        task: task?.[1] || testTask,
        status: routeBlocked || routeNeedsTuning ? "warning" : "success",
        input: testInput,
        primary,
        fallback,
        estimatedCost,
        routeHealth: routeHealth.status,
        message: routeBlocked
          ? "المسار محظور بسبب جاهزية غير مكتملة."
          : routeNeedsTuning
            ? "المسار يحتاج ضبطًا قبل الاعتماد الكامل."
          : "تمت محاكاة التوجيه بنجاح. لم يتم استدعاء أي نموذج فعلي.",
        time: "الآن",
      },
      ...prev,
    ]);
  };

  return (
    <main className="model-routing-page" dir="rtl">
      <style>{styles}</style>

      <section className="page-title">
        <div>
          <div className="eyebrow">
            <Route size={15} />
            Model Routing
          </div>
          <h1>إدارة توجيه النماذج</h1>
          <p>
            هذه الصفحة لمدير النظام فقط. المستخدم النهائي لا يرى ولا يعرف النموذج
            المستخدم، بل يرى فقط: فحص المتجر، توليد حملة، تحليل أداء، أو مراجعة
            مخاطر.
          </p>
        </div>

        <div className="title-actions">
          <button type="button" className="secondary-button">
            <RefreshCw size={16} />
            تحديث السياسات
          </button>
          <button type="button" className="primary-button">
            <Save size={16} />
            حفظ محلي
          </button>
        </div>
      </section>

      <section className="admin-only-alert">
        <ShieldCheck size={20} />
        <div>
          <strong>صلاحية مدير النظام فقط</strong>
          <p>
            اختيار النماذج وتوجيه المهام يجب أن يبقى في إدارة النظام. لا يظهر
            اختيار GPT أو Claude أو Gemini للمستخدم أو التاجر داخل صفحات الحملات.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <Stat title="النماذج المسجلة" value={stats.models} icon={Bot} tone="blue" />
        <Stat title="النماذج النشطة" value={stats.activeModels} icon={CheckCircle2} tone="green" />
        <Stat title="مسارات التوجيه" value={stats.routes} icon={Route} tone="teal" />
        <Stat title="مسارات عالية التكلفة" value={stats.highCostRoutes} icon={AlertTriangle} tone="amber" />
      </section>

      <section className="tabs">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? "active" : ""}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </section>

      {activeTab === "models" && (
        <section className="card">
          <div className="card-header">
            <div>
              <h2>Model Registry</h2>
              <p>النماذج المتاحة داخليًا لمدير النظام فقط.</p>
            </div>
            <button type="button" className="secondary-button">
              <Plus size={16} />
              إضافة نموذج
            </button>
          </div>

          <div className="model-grid">
            {models.map((model) => (
              <article key={model.id} className="model-card">
                <div className="model-head">
                  <div className="model-icon">
                    <Bot size={19} />
                  </div>
                  <div>
                    <h3>{model.displayName}</h3>
                    <p>{model.provider}</p>
                  </div>
                  <Status value={model.status} />
                </div>

                <div className="capability-list">
                  {model.capabilities.map((capability) => (
                    <span key={capability}>{capability}</span>
                  ))}
                </div>

                <div className="model-meta">
                  <Info label="الجودة" value={model.qualityTier} />
                  <Info label="السرعة" value={model.speedTier} />
                  <Info label="التكلفة" value={model.costTier} />
                </div>

                <div className="model-actions">
                  <select
                    value={model.status}
                    onChange={(event) => updateModelStatus(model.id, event.target.value)}
                  >
                    <option value="active">active</option>
                    <option value="testing">testing</option>
                    <option value="disabled">disabled</option>
                    <option value="deprecated">deprecated</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "routes" && (
        <section className="routes-layout">
          <article className="card routes-table-card">
            <div className="card-header">
              <div>
                <h2>Task Routing</h2>
                <p>حدد النموذج الأساسي والبديل لكل مهمة تشغيلية.</p>
              </div>
            </div>

            <div className="routes-table">
              <div className="table-head">
                <span>المهمة</span>
                <span>المجال</span>
                <span>النموذج الأساسي</span>
                <span>Fallback</span>
                <span>الاستخدام</span>
                <span>المراجعة</span>
                <span>التكلفة</span>
                <span>جاهزية المسار</span>
              </div>

              {visibleRoutes.map((route) => {
                const task = findTask(route.taskType);
                const health = buildRouteHealth(route, models, costRows);
                return (
                  <button
                    key={route.id}
                    type="button"
                    className={`table-row ${selectedRouteId === route.id ? "selected" : ""}`}
                    onClick={() => setSelectedRouteId(route.id)}
                  >
                    <span>
                      <strong>{task?.[1] || route.taskType}</strong>
                      <small>{task?.[2] || "تشغيلي"}</small>
                    </span>
                    <span>{task?.[2] || "—"}</span>
                    <span>{modelName(models, route.primaryModelId)}</span>
                    <span>{(route.fallbackModelIds || []).length}</span>
                    <span>{getWorkflowUsageLabel(route.taskType)}</span>
                    <span>{route.governance?.humanReviewRequired ? "مطلوبة" : "غير مطلوبة"}</span>
                    <span>{route.cost?.maxCostPerRun || "—"}$ / run</span>
                    <RouteHealthBadge status={health.status} />
                  </button>
                );
              })}
            </div>
          </article>

          <aside className="card route-editor">
            <h2>تعديل مسار المهمة</h2>
            <p>{findTask(selectedRoute?.taskType)?.[1] || "مسار غير محدد"}</p>

            <label className="field">
              <span>النموذج الأساسي</span>
              <select
                value={selectedRoute?.primaryModelId || ""}
                onChange={(event) =>
                  selectedRoute && updateRoute(selectedRoute.id, { primaryModelId: event.target.value })
                }
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>{model.displayName}</option>
                ))}
              </select>
            </label>

            <div className="fallback-box">
              <strong>النماذج البديلة</strong>
              {(selectedRoute?.fallbackModelIds || []).map((modelId) => (
                <div key={modelId} className="fallback-row">
                  <span>{modelName(models, modelId)}</span>
                  <button type="button" onClick={() => selectedRoute && removeFallback(selectedRoute.id, modelId)}>حذف</button>
                </div>
              ))}
              <select onChange={(event) => selectedRoute && addFallback(selectedRoute.id, event.target.value)} value="">
                <option value="">إضافة fallback</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>{model.displayName}</option>
                ))}
              </select>
            </div>

            <WorkflowUsagePanel route={selectedRoute} />
            <RouteHealthPanel route={selectedRoute} models={models} costRows={costRows} />

            <div className="editor-grid">
              <Field
                label="عدد المحاولات"
                value={selectedRoute.policy?.maxRetries || 0}
                onChange={(value) => updateRouteNested(selectedRoute.id, "policy", "maxRetries", Number(value))}
              />
              <Field
                label="مهلة التشغيل"
                value={selectedRoute.policy?.timeoutSeconds || 0}
                onChange={(value) => updateRouteNested(selectedRoute.id, "policy", "timeoutSeconds", Number(value))}
              />
              <Field
                label="حد التكلفة لكل تشغيل"
                value={selectedRoute.cost?.maxCostPerRun || ""}
                onChange={(value) => updateRouteNested(selectedRoute.id, "cost", "maxCostPerRun", value)}
              />
              <Field
                label="الميزانية الشهرية"
                value={selectedRoute.cost?.monthlyBudgetLimit || ""}
                onChange={(value) => updateRouteNested(selectedRoute.id, "cost", "monthlyBudgetLimit", value)}
              />
            </div>

            <div className="toggle-list">
              <Toggle
                label="استخدام الأقل تكلفة أولًا"
                checked={Boolean(selectedRoute.policy?.useCheapestFirst)}
                onChange={(value) => updateRouteNested(selectedRoute.id, "policy", "useCheapestFirst", value)}
              />
              <Toggle
                label="تفضيل أعلى جودة"
                checked={Boolean(selectedRoute.policy?.useBestQuality)}
                onChange={(value) => updateRouteNested(selectedRoute.id, "policy", "useBestQuality", value)}
              />
              <Toggle
                label="إعادة المحاولة عند الفشل"
                checked={Boolean(selectedRoute.policy?.retryOnFailure)}
                onChange={(value) => updateRouteNested(selectedRoute.id, "policy", "retryOnFailure", value)}
              />
              <Toggle
                label="المراجعة البشرية مطلوبة"
                checked={Boolean(selectedRoute.governance?.humanReviewRequired)}
                onChange={(value) => updateRouteNested(selectedRoute.id, "governance", "humanReviewRequired", value)}
              />
              <Toggle
                label="منع النشر التلقائي"
                checked={Boolean(selectedRoute.governance?.blockAutoPublish)}
                onChange={(value) => updateRouteNested(selectedRoute.id, "governance", "blockAutoPublish", value)}
              />
              <Toggle
                label="إخفاء البيانات الحساسة"
                checked={Boolean(selectedRoute.governance?.redactSensitiveData)}
                onChange={(value) => updateRouteNested(selectedRoute.id, "governance", "redactSensitiveData", value)}
              />
            </div>
          </aside>
        </section>
      )}

      {activeTab === "fallback" && (
        <section className="card">
          <div className="card-header">
            <div>
              <h2>سلاسل Fallback</h2>
              <p>ترتيب استخدام النماذج عند فشل النموذج الأساسي أو تجاوز التكلفة.</p>
            </div>
          </div>

          <div className="fallback-grid">
            {routes.map((route) => {
              const task = findTask(route.taskType);
              return (
                <article key={route.id} className="fallback-card">
                  <h3>{task?.[1]}</h3>
                  <div className="fallback-chain">
                    <span>{modelName(models, route.primaryModelId)}</span>
                    {(route.fallbackModelIds || []).map((modelId) => (
                      <React.Fragment key={modelId}>
                        <b>→</b>
                        <span>{modelName(models, modelId)}</span>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="usage-mini-row">
                    <ListChecks size={14} />
                    <span>{getWorkflowUsageLabel(route.taskType)}</span>
                  </div>
                  <p>
                    {route.policy?.retryOnFailure ? "Retry مفعّل" : "Retry غير مفعّل"} ·{" "}
                    {route.cost?.maxCostPerRun || "—"}$ كحد أقصى للتشغيل
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "cost" && (
        <section className="card">
          <div className="card-header">
            <div>
              <h2>التكلفة والحدود</h2>
              <p>ضبط التكلفة حسب المهمة وليس حسب الصفحة.</p>
            </div>
          </div>

          <div className="cost-grid">
            {routes.map((route) => {
              const task = findTask(route.taskType);
              const highCost = Number(route.cost?.maxCostPerRun || 0) >= 1;
              const health = buildRouteHealth(route, models, costRows);
              return (
                <article key={route.id} className={`cost-card ${highCost ? "high" : ""}`}>
                  <div className="cost-card-head">
                    <h3>{task?.[1]}</h3>
                    <RouteHealthBadge status={health.status} />
                  </div>
                  <Info label="حد التكلفة لكل تشغيل" value={`${route.cost?.maxCostPerRun || "—"}$`} />
                  <Info label="الميزانية الشهرية" value={`${route.cost?.monthlyBudgetLimit || "—"}$`} />
                  <Info label="حد الموافقة" value={`${route.cost?.requireApprovalAboveCost || "—"}$`} />
                  <Info label="مهلة التشغيل" value={`${route.policy?.timeoutSeconds || "—"}s`} />
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "test" && (
        <section className="test-layout">
          <article className="card">
            <div className="card-header">
              <div>
                <h2>اختبار التوجيه</h2>
                <p>اختبار محلي يوضح أي نموذج سيُستخدم بدون استدعاء فعلي.</p>
              </div>
            </div>

            <div className="test-form">
              <label className="field">
                <span>نوع المهمة</span>
                <select value={testTask} onChange={(event) => setTestTask(event.target.value)}>
                  {TASK_TYPES.map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>مدخل الاختبار</span>
                <textarea value={testInput} onChange={(event) => setTestInput(event.target.value)} />
              </label>

              <button type="button" className="primary-button" onClick={runTest}>
                <TestTube2 size={16} />
                اختبار التوجيه
              </button>
            </div>
          </article>

          <article className="card">
            <h2>سجل الاختبار</h2>
            <div className="test-log">
              {testLog.length ? (
                testLog.map((log) => (
                  <div key={log.id} className={`test-row ${log.status}`}>
                    <strong>{log.task}</strong>
                    <span>{log.message}</span>
                    <small>Primary: {log.primary}</small>
                    <small>Fallback: {log.fallback}</small>
                    <small>Estimated max cost: {log.estimatedCost}$</small>
                    <small>جاهزية المسار: {getRouteHealthLabel(log.routeHealth)}</small>
                    <small>{log.time}</small>
                  </div>
                ))
              ) : (
                <p className="empty-log">لم يتم تنفيذ أي اختبار بعد.</p>
              )}
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
