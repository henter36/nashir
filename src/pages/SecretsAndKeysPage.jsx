import { useCallback, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CircleAlert,
  Copy,
  KeyRound,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import { DEFAULT_OPERATIONAL_SUPPORT, PROVIDER_TYPES, statusMap } from "./SecretsAndKeysPage/constants.js";
import {
  authRequiresSecret,
  buildProviderReadiness,
  createProviderFromPreset,
  getAdvancedScopeFields,
  getAvailableModelFields,
  getRequiredFieldLabel,
  initialProviders,
  normalizeCapabilities,
} from "./SecretsAndKeysPage/helpers.js";
import { styles } from "./SecretsAndKeysPage/styles.js";
import {
  Checklist,
  EditorSection,
  Field,
  Info,
  ProviderReadinessPanel,
  ProviderReadinessSummary,
  ProviderRow,
  RoutingImpactPanel,
  SelectField,
  Stat,
  TextArea,
  Toggle,
  ToggleGrid,
} from "./SecretsAndKeysPage/components.jsx";

export default function SecretsAndKeysPage() {
  const [providers, setProviders] = useState(initialProviders);
  const [selectedProviderId, setSelectedProviderId] = useState(initialProviders[0].id);
  const [draftPreset, setDraftPreset] = useState("openai");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [testLog, setTestLog] = useState([]);

  const selectedProvider =
    providers.find((provider) => provider.id === selectedProviderId) ||
    providers[0] ||
    createProviderFromPreset("custom", { id: "empty-provider", displayName: "مزود غير محدد" });
  const advancedScopeFields = getAdvancedScopeFields(selectedProvider);
  const availableModelFields = getAvailableModelFields(selectedProvider);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) =>
      `${provider.displayName} ${provider.providerType} ${provider.category}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [providers, query]);

  const stats = useMemo(() => {
    return {
      total: providers.length,
      connected: providers.filter((p) => p.status === "connected").length,
      missing: providers.filter((p) => p.status === "missing_required_fields").length,
      autoPublishUnsafe: providers.filter((p) => p.governance?.autoPublishAllowed).length,
    };
  }, [providers]);

  const updateProvider = (id, patch) => {
    setProviders((prev) =>
      prev.map((provider) =>
        provider.id === id
          ? {
              ...provider,
              ...patch,
              metadata: {
                ...provider.metadata,
                updatedAt: "الآن",
              },
            }
          : provider
      )
    );
  };

  const updateSelected = (key, value) => {
    updateProvider(selectedProvider.id, {
      [key]: value,
      status: selectedProvider.status === "connected" ? "pending_test" : selectedProvider.status,
    });
  };

  const updateNested = (section, key, value) => {
    updateProvider(selectedProvider.id, {
      [section]: {
        ...(selectedProvider[section] || {}),
        [key]: value,
      },
      status: selectedProvider.status === "connected" ? "pending_test" : selectedProvider.status,
    });
  };

  const changeProviderType = (type) => {
    const presetProvider = createProviderFromPreset(type, {
      id: selectedProvider.id,
      status: "draft",
      metadata: {
        ...selectedProvider.metadata,
        updatedAt: "الآن",
      },
    });

    updateProvider(selectedProvider.id, presetProvider);
  };

  const addProvider = () => {
    const next = createProviderFromPreset(draftPreset);
    setProviders((prev) => [next, ...prev]);
    setSelectedProviderId(next.id);
    setViewMode("editor");
  };

  const removeProvider = (id) => {
    if (providers.length === 1) return;
    const next = providers.filter((provider) => provider.id !== id);
    setProviders(next);
    if (selectedProviderId === id) {
      setSelectedProviderId(next[0].id);
      if (viewMode === "editor") setViewMode("list");
    }
  };

  const duplicateProvider = useCallback((provider) => {
    const copy = {
      ...provider,
      id: `${provider.providerType}-${Date.now()}`,
      displayName: `${provider.displayName} نسخة`,
      status: "draft",
      metadata: {
        createdAt: "اليوم",
        updatedAt: "الآن",
        lastTestedAt: "",
        lastRotationAt: "",
        ownerRole: "System Admin",
      },
    };

    setProviders((prev) => [copy, ...prev]);
    setSelectedProviderId(copy.id);
    setViewMode("editor");
  }, []);

  const validateProvider = (provider) => {
    const missing = [];
    const requiredFields = Array.isArray(provider?.requiredFields) ? provider.requiredFields : [];
    const readiness = buildProviderReadiness(provider);

    requiredFields.forEach((field) => {
      if (field === "secretName" && !authRequiresSecret(provider.authType)) {
        return;
      }

      if (field === "webhookSecretName") {
        if (!provider.webhooks?.secretName) missing.push(getRequiredFieldLabel(field));
        return;
      }

      if (field === "googleCloudProject") {
        if (!String(provider.projectId || provider.googleCloudProject || "").trim()) {
          missing.push(getRequiredFieldLabel("projectId"));
        }
        return;
      }

      if (!String(provider[field] || "").trim()) {
        missing.push(getRequiredFieldLabel(field));
      }
    });

    return [...new Set([...missing, ...readiness.blockedReasons])];
  };

  const testConnection = (provider = selectedProvider) => {
    const readiness = buildProviderReadiness(provider);
    const missing = validateProvider(provider);

    if (readiness.status === "blocked" || missing.length) {
      updateProvider(provider.id, { status: "failed" });
      setTestLog((prev) => [
        {
          id: Date.now(),
          provider: provider.displayName,
          status: "failed",
          message: `محظور: ${readiness.blockedReasons[0] || missing.join("، ")}`,
          time: "الآن",
        },
        ...prev,
      ]);
      return;
    }

    updateProvider(provider.id, {
      status: "connected",
      metadata: {
        ...provider.metadata,
        lastTestedAt: "الآن",
        updatedAt: "الآن",
      },
    });

    setTestLog((prev) => [
      {
        id: Date.now(),
        provider: provider.displayName,
        status: readiness.status === "warning" ? "warning" : "success",
        message: readiness.status === "warning"
          ? `يحتاج ضبط: ${readiness.warnings[0] || "راجع إعدادات المزود."}`
          : "جاهز: تم فحص الإعدادات محليًا دون تنفيذ اتصال حقيقي.",
        time: "الآن",
      },
      ...prev,
    ]);
  };

  const rotateKey = (provider) => {
    updateProvider(provider.id, {
      status: "pending_test",
      metadata: {
        ...provider.metadata,
        lastRotationAt: "الآن",
        updatedAt: "الآن",
      },
    });

    setTestLog((prev) => [
      {
        id: Date.now(),
        provider: provider.displayName,
        status: "warning",
        message: "تم تحديث مرجع السر كمحاكاة. يجب اختبار المزود بعد التحديث.",
        time: "الآن",
      },
      ...prev,
    ]);
  };

  const saveLocal = () => {
    setTestLog((prev) => [
      {
        id: Date.now(),
        provider: "System",
        status: "success",
        message: "تم حفظ إعدادات الجدول في النموذج الأولي. لا توجد قيم مفاتيح محفوظة.",
        time: "الآن",
      },
      ...prev,
    ]);
  };

  return (
    <main className="secrets-unified-page" dir="rtl">
      <style>{styles}</style>

      <section className="page-title">
        <div>
          <div className="eyebrow">
            <KeyRound size={15} />
            الأسرار والمفاتيح
          </div>
          <h1>إدارة مزودي الذكاء الاصطناعي بنموذج موحّد</h1>
          <p>
            جدول موحد لكل المزودين مع إعدادات جاهزة. نفس النموذج يُستخدم
            للجميع، وتظهر الحقول المطلوبة حسب نوع المزود.
          </p>
        </div>

        <div className="title-actions">
          <button type="button" className="secondary-button" onClick={saveLocal}>
            <Save size={16} />
            حفظ محلي
          </button>
          <button type="button" className="primary-button" onClick={addProvider}>
            <Plus size={16} />
            إضافة مزود
          </button>
        </div>
      </section>

      <section className="governance-alert">
        <CircleAlert size={20} />
        <div>
          <strong>قاعدة أمان إلزامية</strong>
          <p>
            هذه الشاشة تحفظ أسماء مراجع الأسرار فقط، ولا تحفظ أو تعرض قيم المفاتيح.
            أي اختبار أو تدوير هنا محلي داخل النموذج الأولي.
          </p>
        </div>
      </section>

      {viewMode === "list" ? (
        <>
          <section className="stats-grid">
            <Stat title="إجمالي المزودين" value={stats.total} icon={Bot} tone="blue" />
            <Stat title="متصل" value={stats.connected} icon={CheckCircle2} tone="green" />
            <Stat title="حقول ناقصة" value={stats.missing} icon={AlertTriangle} tone="amber" />
            <Stat title="نشر تلقائي مخالف" value={stats.autoPublishUnsafe} icon={Lock} tone="red" />
          </section>

          <section className="toolbar-card">
            <div className="search-box">
              <Search size={17} />
              <input
                value={query}
                placeholder="ابحث باسم المزود أو النوع..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="add-provider-inline">
              <select value={draftPreset} onChange={(event) => setDraftPreset(event.target.value)}>
                {PROVIDER_TYPES.map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>

              <button type="button" className="secondary-button" onClick={addProvider}>
                <Plus size={16} />
                إضافة من إعداد جاهز
              </button>
            </div>
          </section>
        </>
      ) : null}

      <section className={`main-layout ${viewMode === "editor" ? "editor-layout" : "list-layout"}`}>
        {viewMode === "list" ? (
          <article className="providers-table-card">
          <div className="card-header">
            <div>
              <h2>قائمة المزودين</h2>
              <p>كل مزود يستخدم نفس النموذج، مع حقول مطلوبة حسب نوعه.</p>
            </div>

            <button type="button" className="secondary-button" onClick={addProvider}>
              <Plus size={16} />
              إضافة مزود
            </button>
          </div>

          <div className="providers-table">
            <div className="table-head">
              <span>المزود</span>
              <span>النوع</span>
              <span>الحالة</span>
              <span>النماذج</span>
              <span>قناة الوصول</span>
              <span>البيئة</span>
              <span>القدرات</span>
              <span>جاهزية المزود</span>
              <span>الإجراءات</span>
            </div>

            {filteredProviders.map((provider) => (
              <ProviderRow
                key={provider.id}
                provider={provider}
                selected={provider.id === selectedProvider.id}
                onSelect={() => {
                  setSelectedProviderId(provider.id);
                  setViewMode("editor");
                }}
                onTest={() => testConnection(provider)}
                onRotate={() => rotateKey(provider)}
                onDuplicate={() => duplicateProvider(provider)}
                onDelete={() => removeProvider(provider.id)}
              />
            ))}
          </div>
          </article>
        ) : null}

        {viewMode === "editor" ? (
          <aside className="drawer-card editor-card">
            <button type="button" className="back-button" onClick={() => setViewMode("list")}>
              العودة إلى قائمة المزودين
            </button>
            <div className="drawer-header">
              <div>
                <h2>{selectedProvider.status === "draft" ? "إضافة مزود" : "تعديل مزود"}</h2>
                <p>نموذج المزود الموحد · {selectedProvider.displayName}</p>
                <p className="ownership-note">
                  هذه الصفحة تضبط جاهزية المزود ومرجع السر والقدرات التي يدعمها فقط. اختيار نموذج المهمة، النماذج البديلة، وسياسات التشغيل تتم من توجيه النماذج وتشغيلات النظام.
                </p>
              </div>
            </div>

            <ProviderReadinessSummary provider={selectedProvider} />

            <EditorSection title="ملخص المزود" helper="ابدأ من الجاهزية ثم راجع الاتصال والنماذج والقدرات.">
              <div className="form-grid">
                <Field
                  label="اسم العرض"
                  value={selectedProvider.displayName}
                  onChange={(value) => updateSelected("displayName", value)}
                  required
                />
                <SelectField
                  label="نوع المزود"
                  value={selectedProvider.providerType}
                  options={PROVIDER_TYPES}
                  onChange={changeProviderType}
                />
                <Info label="الفئة" value={selectedProvider.category} />
                <Info label="الحالة" value={statusMap[selectedProvider.status]?.[0] || selectedProvider.status} />
              </div>
            </EditorSection>

            <EditorSection title="الاتصال والمصادقة" helper="لا يتم حفظ أو عرض قيمة المفتاح.">
              <div className="form-grid">
                <Field
                  label="اسم مرجع السر"
                  value={selectedProvider.secretName}
                  onChange={(value) => updateSelected("secretName", value)}
                  required
                  helper="اسم مرجع السر فقط، وليس قيمة المفتاح."
                />
                <Field
                  label="العنوان الأساسي"
                  value={selectedProvider.baseUrl}
                  onChange={(value) => updateSelected("baseUrl", value)}
                  required={(selectedProvider.requiredFields || []).includes("baseUrl")}
                />
                <Field
                  label="اسم الترويسة"
                  value={selectedProvider.headerName}
                  onChange={(value) => updateSelected("headerName", value)}
                />
                <SelectField
                  label="بادئة المصادقة"
                  value={selectedProvider.tokenPrefix}
                  options={[
                    ["Bearer", "Bearer"],
                    ["Token", "Token"],
                    ["None", "None"],
                  ]}
                  onChange={(value) => updateSelected("tokenPrefix", value)}
                />
                <TextArea
                  label="بيانات تعريف إضافية"
                  value={selectedProvider.customHeaders}
                  onChange={(value) => updateSelected("customHeaders", value)}
                  wide
                />
              </div>
            </EditorSection>

            <EditorSection title="نطاق الاعتماد والبيئة">
              <div className="form-grid">
                <SelectField
                  label="البيئة"
                  value={selectedProvider.environment || "sandbox"}
                  options={[
                    ["sandbox", "تجريبي"],
                    ["staging", "اختبار"],
                    ["production", "إنتاج"],
                  ]}
                  onChange={(value) => updateSelected("environment", value)}
                />
                <SelectField
                  label="قناة الوصول"
                  value={selectedProvider.deliveryChannel || "direct_api"}
                  options={[
                    ["direct_api", "API مباشر"],
                    ["cloud_platform", "منصة سحابية"],
                    ["openai_compatible", "متوافق مع OpenAI"],
                    ["gateway", "بوابة موحدة"],
                    ["proxy", "وسيط Proxy"],
                    ["self_hosted", "مستضاف ذاتيًا"],
                  ]}
                  onChange={(value) => updateSelected("deliveryChannel", value)}
                />
                <SelectField
                  label="طريقة المصادقة"
                  value={selectedProvider.authType || "bearer_token"}
                  options={[
                    ["bearer_token", "Bearer Token"],
                    ["api_key_header", "API Key Header"],
                    ["oauth_bearer", "OAuth Bearer"],
                    ["workload_identity", "هوية عمل / Workload Identity"],
                    ["service_account", "حساب خدمة"],
                    ["custom_headers", "ترويسات مخصصة"],
                    ["no_auth_local", "بدون مصادقة محليًا"],
                  ]}
                  onChange={(value) => updateSelected("authType", value)}
                />
              </div>

              <div className="advanced-scope-box">
                <h4>إعدادات متقدمة حسب المزود</h4>
                <p>تظهر الحقول المتقدمة حسب نوع المزود وقناة الوصول. ليست كل الحقول مطلوبة لكل مزود.</p>
                {advancedScopeFields.length ? (
                  <div className="form-grid">
                    {advancedScopeFields.map((field) => (
                      <Field
                        key={field.key}
                        label={field.label}
                        value={selectedProvider[field.key]}
                        onChange={(value) => updateSelected(field.key, value)}
                        required={field.required}
                        helper={field.helper}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="empty-helper">لا توجد إعدادات متقدمة مطلوبة لهذا المزود حاليًا.</p>
                )}
              </div>
            </EditorSection>

            <EditorSection title="نماذج يعلن المزود توفرها" helper="هذه القيم تحدد النماذج المتاحة للاختيار لاحقًا في توجيه النماذج. لا يتم هنا اختيار النموذج النهائي لأي مهمة.">
              {availableModelFields.length ? (
                <div className="form-grid">
                  {availableModelFields.map((field) => (
                    <Field
                      key={field.key}
                      label={field.label}
                      value={selectedProvider[field.key]}
                      onChange={(value) => updateSelected(field.key, value)}
                      required={field.required}
                    />
                  ))}
                </div>
              ) : (
                <p className="empty-helper">لا توجد نماذج مطلوبة لأن القدرات المناسبة غير مفعلة.</p>
              )}
            </EditorSection>

            <EditorSection title="قدرات يدعمها المزود" helper="تحديد دعم المزود لا يعني استخدام القدرة تلقائيًا؛ الاستخدام يحدد في توجيه النماذج أو تشغيلات النظام.">
              <ToggleGrid
                source={normalizeCapabilities(selectedProvider.capabilities)}
                onChange={(key, value) => updateNested("capabilities", key, value)}
              />
              <div className="section-divider" />
              <ToggleGrid
                source={{ ...DEFAULT_OPERATIONAL_SUPPORT, ...(selectedProvider.operationalSupport || {}) }}
                onChange={(key, value) => updateNested("operationalSupport", key, value)}
              />
              <div className="form-grid compact-grid">
                <Field
                  label="الحد الشهري المرن"
                  value={selectedProvider.limits?.monthlySoftLimit}
                  onChange={(value) => updateNested("limits", "monthlySoftLimit", value)}
                />
                <Field
                  label="الحد الشهري الصارم"
                  value={selectedProvider.limits?.monthlyHardLimit}
                  onChange={(value) => updateNested("limits", "monthlyHardLimit", value)}
                />
                <Field
                  label="حد الطلبات في الدقيقة"
                  value={selectedProvider.limits?.rpm}
                  onChange={(value) => updateNested("limits", "rpm", value)}
                />
                <Field
                  label="حد الرموز في الدقيقة"
                  value={selectedProvider.limits?.tpm}
                  onChange={(value) => updateNested("limits", "tpm", value)}
                />
                <Field
                  label="أقصى مدة تشغيل بالثواني"
                  value={selectedProvider.limits?.maxJobDurationSeconds}
                  onChange={(value) => updateNested("limits", "maxJobDurationSeconds", value)}
                />
              </div>
            </EditorSection>

            <EditorSection title="Webhook والعمليات">
              <div className="form-grid">
                <Toggle
                  label="Webhook مفعّل"
                  checked={Boolean(selectedProvider.webhooks?.enabled)}
                  onChange={(value) => updateNested("webhooks", "enabled", value)}
                />
                <Field
                  label="مرجع سر Webhook"
                  value={selectedProvider.webhooks?.secretName}
                  onChange={(value) => updateNested("webhooks", "secretName", value)}
                  required={(selectedProvider.requiredFields || []).includes("webhookSecretName")}
                />
                <Field
                  label="رابط الاستدعاء"
                  value={selectedProvider.webhooks?.callbackUrl}
                  onChange={(value) => updateNested("webhooks", "callbackUrl", value)}
                />
                <TextArea
                  label="أنواع الأحداث"
                  value={selectedProvider.webhooks?.eventTypes}
                  onChange={(value) => updateNested("webhooks", "eventTypes", value)}
                />
                <Field
                  label="آخر حالة تسليم"
                  value={selectedProvider.webhooks?.lastDeliveryStatus}
                  onChange={(value) => updateNested("webhooks", "lastDeliveryStatus", value)}
                />
              </div>
            </EditorSection>

            <EditorSection title="الحوكمة وقابلية الربط">
              <ToggleGrid
                source={selectedProvider.governance || {}}
                onChange={(key, value) => updateNested("governance", key, value)}
                dangerKeys={["autoPublishAllowed", "allowSensitiveContentGeneration"]}
              />
              <ProviderReadinessPanel provider={selectedProvider} />
              <RoutingImpactPanel />
            </EditorSection>

            <div className="drawer-actions">
              <button type="button" className="secondary-button" onClick={() => duplicateProvider(selectedProvider)}>
                <Copy size={16} />
                نسخ المزود
              </button>
              <button type="button" className="secondary-button" onClick={() => rotateKey(selectedProvider)}>
                <RefreshCw size={16} />
                تحديث مرجع السر
              </button>
              <button type="button" className="primary-button" onClick={() => testConnection(selectedProvider)}>
                <TestTube2 size={16} />
                اختبار الاتصال
              </button>
            </div>
          </aside>
        ) : null}
      </section>

      <section className="audit-grid">
        <article className="side-card">
          <div className="side-icon">
            <ShieldCheck size={22} />
          </div>
          <h3>قواعد الحوكمة المطبقة</h3>
          <Checklist ok label="نموذج موحد لكل المزودين" />
          <Checklist ok label="مرجع السر بدل قيمة المفتاح" />
          <Checklist ok label="النشر التلقائي مغلق افتراضيًا" />
          <Checklist ok label="مراجعة بشرية مفعلة" />
          <Checklist ok label="حدود تكلفة واستخدام" />
        </article>

        <article className="side-card">
          <div className="side-icon warning">
            <AlertTriangle size={22} />
          </div>
          <h3>ممنوعات أمان</h3>
          <ul>
            <li>لا تحفظ قيمة المفتاح داخل الواجهة.</li>
            <li>لا ترسل المفتاح مباشرة من المتصفح إلى المزود.</li>
            <li>لا تعرض المفتاح الحقيقي بعد حفظه.</li>
            <li>لا تفعّل النشر التلقائي بدون صلاحيات وحوكمة تشغيل.</li>
          </ul>
        </article>

        <article className="side-card">
          <h3>سجل الاختبار</h3>
          <div className="test-log">
            {testLog.length ? (
              testLog.map((log) => (
                <div key={log.id} className={`test-row ${log.status}`}>
                  <strong>{log.provider}</strong>
                  <span>{log.message}</span>
                  <small>{log.time}</small>
                </div>
              ))
            ) : (
              <p className="empty-log">لم يتم اختبار أي مزود بعد.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
