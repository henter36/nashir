import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CircleAlert,
  FileText,
  Globe2,
  KeyRound,
  Lock,
  RefreshCw,
  Save,
  Settings,
  Shield,
  SlidersHorizontal,
  Store,
  Users,
} from "lucide-react";
import { getModelRoutingSummary } from "../utils/modelCostStore.js";
import { getWorkspaceTeamSummary } from "../utils/teamAccessStore.js";
import { readIntegrationConnections, upsertIntegrationConnection } from "../utils/integrationConnectionsStore.js";
import { DEFAULT_OUTPUT_SETTINGS, DEFAULT_WORKSPACE, languageOptions, OAUTH_PROVIDERS, OWNERSHIP_MAP, TABS, toneOptions } from "./SettingsPage/constants.js";
import { applySharedConnections, buildDefaultChannels, buildWarnings, calculateScore } from "./SettingsPage/helpers.js";
import { ConnectionBadge, Field, Metric, OwnershipNote, SelectField, SettingsCard, SharedConnectionSummary, SummaryRow, Switch, ToggleRow, WarningsList } from "./SettingsPage/components.jsx";
import { styles } from "./SettingsPage/styles.js";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sharedConnections, setSharedConnections] = useState(() => readIntegrationConnections());
  const [channels, setChannels] = useState(() =>
    buildDefaultChannels(readIntegrationConnections())
  );
  const [modelRoutingSummary, setModelRoutingSummary] = useState(() => getModelRoutingSummary());
  const [workspaceTeamSummary, setWorkspaceTeamSummary] = useState(() => getWorkspaceTeamSummary());
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [auditLog, setAuditLog] = useState([
    {
      id: "audit-001",
      event: "تحميل الإعدادات الافتراضية",
      actor: "Prototype",
      time: "الآن",
      severity: "info",
    },
  ]);

  const [workspace, setWorkspace] = useState(DEFAULT_WORKSPACE);
  const [outputSettings, setOutputSettings] = useState(DEFAULT_OUTPUT_SETTINGS);

  useEffect(() => {
    const refreshSharedConnections = () => {
      const latest = readIntegrationConnections();
      setSharedConnections(latest);
      setChannels((prev) => applySharedConnections(prev, latest));
    };

    const handleRefresh = () => refreshSharedConnections();
    const handleVisibility = () => {
      if (!document.hidden) refreshSharedConnections();
    };
    const handleStorage = () => refreshSharedConnections();

    window.addEventListener("focus", handleRefresh);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("nashir-integration-connections-updated", handleRefresh);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("nashir-integration-connections-updated", handleRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const refreshWorkspaceTeamSummary = () => {
      setWorkspaceTeamSummary(getWorkspaceTeamSummary());
    };

    window.addEventListener("focus", refreshWorkspaceTeamSummary);
    window.addEventListener("storage", refreshWorkspaceTeamSummary);
    window.addEventListener("nashir-workspace-members-updated", refreshWorkspaceTeamSummary);
    window.addEventListener("nashir-workspace-roles-updated", refreshWorkspaceTeamSummary);
    window.addEventListener("nashir-collaboration-comments-updated", refreshWorkspaceTeamSummary);
    window.addEventListener("nashir-activity-log-updated", refreshWorkspaceTeamSummary);

    return () => {
      window.removeEventListener("focus", refreshWorkspaceTeamSummary);
      window.removeEventListener("storage", refreshWorkspaceTeamSummary);
      window.removeEventListener("nashir-workspace-members-updated", refreshWorkspaceTeamSummary);
      window.removeEventListener("nashir-workspace-roles-updated", refreshWorkspaceTeamSummary);
      window.removeEventListener("nashir-collaboration-comments-updated", refreshWorkspaceTeamSummary);
      window.removeEventListener("nashir-activity-log-updated", refreshWorkspaceTeamSummary);
    };
  }, []);

  useEffect(() => {
    const refreshModelRoutingSummary = () => {
      setModelRoutingSummary(getModelRoutingSummary());
    };

    window.addEventListener("focus", refreshModelRoutingSummary);
    window.addEventListener("storage", refreshModelRoutingSummary);
    window.addEventListener("nashir-model-registry-updated", refreshModelRoutingSummary);
    window.addEventListener("nashir-model-routing-updated", refreshModelRoutingSummary);
    window.addEventListener("nashir-cost-monitor-updated", refreshModelRoutingSummary);

    return () => {
      window.removeEventListener("focus", refreshModelRoutingSummary);
      window.removeEventListener("storage", refreshModelRoutingSummary);
      window.removeEventListener("nashir-model-registry-updated", refreshModelRoutingSummary);
      window.removeEventListener("nashir-model-routing-updated", refreshModelRoutingSummary);
      window.removeEventListener("nashir-cost-monitor-updated", refreshModelRoutingSummary);
    };
  }, []);

  const sharedConnectionCount = useMemo(
    () => Object.keys(sharedConnections || {}).length,
    [sharedConnections]
  );

  const warnings = useMemo(
    () => buildWarnings({ channels, outputSettings, workspace, sharedConnections }),
    [channels, outputSettings, workspace, sharedConnections]
  );

  const governanceScore = useMemo(() => calculateScore(warnings), [warnings]);

  const enabledChannelsCount = useMemo(
    () => channels.filter((channel) => channel.enabled).length,
    [channels]
  );

  const connectedOAuthCount = useMemo(
    () => channels.filter((channel) => channel.status === "connected").length,
    [channels]
  );

  const pendingOAuthCount = useMemo(
    () => channels.filter((channel) => channel.status === "pending_oauth").length,
    [channels]
  );

  const reflectedConnectionCount = useMemo(
    () => channels.filter((channel) => channel.fromSharedConnection).length,
    [channels]
  );

  const activeWarnings = useMemo(
    () => ({
      red: warnings.filter((warning) => warning.tone === "red").length,
      amber: warnings.filter((warning) => warning.tone === "amber").length,
    }),
    [warnings]
  );

  const recordChange = (event, severity = "info") => {
    setDirty(true);
    setSaved(false);
    setAuditLog((prev) => [
      {
        id: `audit-${Date.now()}`,
        event,
        actor: "مدير البروتوتايب",
        time: "الآن",
        severity,
      },
      ...prev.slice(0, 9),
    ]);
  };

  const updateWorkspace = (key, value) => {
    setWorkspace((prev) => ({ ...prev, [key]: value }));
    recordChange(`تعديل إعداد مساحة العمل: ${key}`);
  };

  const updateOutput = (key, value) => {
    setOutputSettings((prev) => ({ ...prev, [key]: value }));
    recordChange(`تعديل إعداد المخرجات: ${key}`);
  };

  const updateChannelEnabled = (id, enabled) => {
    setChannels((prev) =>
      prev.map((channel) => (channel.id === id ? { ...channel, enabled } : channel))
    );
    recordChange(`${enabled ? "إظهار" : "إخفاء"} قناة ${OAUTH_PROVIDERS[id]?.name || id} في ملخص الإعدادات`);
  };

  const persistSharedConnection = (providerId, status, extra = {}) => {
    const provider = OAUTH_PROVIDERS[providerId];

    if (!provider) return;

    const nextConnections = upsertIntegrationConnection({
      providerId,
      providerName: provider.name,
      status,
      authorizationUrl: provider.authUrl,
      requestedScopes: provider.scopes,
      accountName:
        extra.accountName ||
        sharedConnections[providerId]?.accountName ||
        "",
      updatedAt: new Date().toISOString(),
      ...extra,
    });

    setSharedConnections(nextConnections);
    setChannels((prev) => applySharedConnections(prev, nextConnections));
  };

  const startOAuthConnection = (channel) => {
    const provider = OAUTH_PROVIDERS[channel.id];
    if (!provider) return;

    persistSharedConnection(channel.id, "pending_oauth", {
      lastAction: "oauth_started",
    });
    recordChange(`محاكاة بدء ربط قناة ${provider.name}`, "info");
  };

  const mockOAuthSuccess = (channel) => {
    const provider = OAUTH_PROVIDERS[channel.id];
    if (!provider) return;

    const accountName =
      sharedConnections[channel.id]?.accountName ||
      `@${provider.name.toLowerCase().replace(/\s+/g, "_")}_account`;

    persistSharedConnection(channel.id, "connected", {
      accountName,
      lastAction: "oauth_callback_mocked",
    });

    recordChange(`اكتملت محاكاة ربط قناة ${provider.name}`, "info");
  };

  const disconnectOAuth = (channel) => {
    const provider = OAUTH_PROVIDERS[channel.id];
    if (!provider) return;

    persistSharedConnection(channel.id, "disconnected", {
      accountName: "",
      lastAction: "oauth_disconnected",
    });

    recordChange(`تم قطع ربط قناة ${provider.name}`, "warning");
  };

  const saveLocalSettings = () => {
    setSaved(true);
    setDirty(false);
    setAuditLog((prev) => [
      {
        id: `audit-${Date.now()}`,
        event: "حفظ الإعدادات محليًا داخل الواجهة",
        actor: "مدير البروتوتايب",
        time: "الآن",
        severity: "success",
      },
      ...prev.slice(0, 9),
    ]);
    setTimeout(() => setSaved(false), 2400);
  };

  const resetSettings = () => {
    const latest = readIntegrationConnections();
    setSharedConnections(latest);
    setChannels(buildDefaultChannels(latest));
    setWorkspace(DEFAULT_WORKSPACE);
    setOutputSettings(DEFAULT_OUTPUT_SETTINGS);
    setSaved(false);
    setDirty(false);
    setAuditLog((prev) => [
      {
        id: `audit-${Date.now()}`,
        event: "إعادة الإعدادات إلى القيم الافتراضية مع إبقاء حالة الربط المحفوظة",
        actor: "مدير البروتوتايب",
        time: "الآن",
        severity: "warning",
      },
      ...prev.slice(0, 9),
    ]);
  };

  return (
    <main className="settings-page" dir="rtl">
      <style>{styles}</style>

      <section className="settings-hero">
        <div className="hero-content">
          <div className="eyebrow">
            <Settings size={16} />
            إعدادات المنصة
          </div>

          <h1>مركز إعدادات ناشر قبل التشغيل الحقيقي</h1>

          <p>
            هذه الصفحة تضبط افتراضات مساحة العمل والمخرجات وتعرض ملخصات عالية
            المستوى. إعدادات المزودين، التوجيه، التكلفة، الحوكمة، والسياسات
            تُدار من صفحاتها المتخصصة.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={saveLocalSettings}>
              <Save size={17} />
              حفظ محلي
            </button>

            <button type="button" className="secondary-button" onClick={resetSettings}>
              <RefreshCw size={17} />
              إعادة الضبط
            </button>
          </div>

          <div className="hero-alert">
            <CircleAlert size={18} />
            <span>
              هذه الشاشة تحفظ أسماء مراجع وإعدادات واجهية عامة فقط. لا يتم حفظ
              مفاتيح أو أسرار في الواجهة، وأي ربط قناة هنا محاكاة فقط — لا يوجد
              اتصال فعلي في هذا النموذج.
            </span>
          </div>
        </div>

        <div className="settings-score-card">
          <div className="score-icon">
            <Shield size={26} />
          </div>

          <span>جاهزية الإعدادات</span>
          <strong>{governanceScore}%</strong>

          <div className="mini-progress">
            <div style={{ width: `${governanceScore}%` }} />
          </div>

          <p>
            {activeWarnings.red
              ? "يوجد خطر حوكمة يجب إصلاحه قبل اعتماد التصور."
              : activeWarnings.amber
                ? "الإعدادات قابلة للمراجعة مع وجود ملاحظات متوسطة."
                : "الإعدادات الحالية آمنة كبروتوتايب."}
          </p>

          <div className="score-meta">
            <span>تحذيرات عالية: {activeWarnings.red}</span>
            <span>تحذيرات متوسطة: {activeWarnings.amber}</span>
          </div>
        </div>
      </section>

      <section className="settings-card boundary-card">
        <div className="card-header compact">
          <div className="card-title">
            <div className="card-icon">
              <Shield size={20} />
            </div>

            <div>
              <h2>حدود الإعدادات العامة</h2>
              <p>
                هذه الصفحة تضبط الإعدادات العامة لمساحة العمل فقط. إعدادات
                الذكاء الاصطناعي، الحوكمة، التكلفة، والمزودين تُدار من صفحاتها
                المتخصصة.
              </p>
            </div>
          </div>
        </div>

        <div className="ownership-map">
          {OWNERSHIP_MAP.map(([label, value]) => (
            <div key={label} className="ownership-row">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="settings-tabs" aria-label="تبويبات الإعدادات">
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

      <section className="settings-layout">
        <section className="settings-main">
          {activeTab === "overview" && (
            <>
              <section className="metrics-grid">
                <Metric title="القنوات المفعلة" value={enabledChannelsCount} note={`من أصل ${channels.length}`} />
                <Metric title="مرتبط تجريبي" value={connectedOAuthCount} note={`${pendingOAuthCount} بانتظار محاكاة`} />
                <Metric title="حالة ربط محفوظة" value={reflectedConnectionCount} note={`${sharedConnectionCount} سجل محفوظ`} />
                <Metric title="حالة التغييرات" value={dirty ? "غير محفوظة" : "محفوظة"} note="داخل الواجهة فقط" />
              </section>

              <SettingsCard
                icon={Globe2}
                title="حالة ربط القنوات المشتركة"
                description="حالة الربط هنا ملخص فقط. إدارة القنوات التفصيلية تتم من صفحة القنوات أو مصادر البيانات."
              >
                <SharedConnectionSummary channels={channels} sharedConnectionCount={sharedConnectionCount} />
              </SettingsCard>

              <SettingsCard
                icon={AlertTriangle}
                title="تنبيهات الحوكمة"
                description="هذه التنبيهات تمنع أن تصبح الإعدادات شكلية أو مضللة عند الانتقال للتنفيذ الحقيقي."
              >
                <WarningsList warnings={warnings} />
              </SettingsCard>

              <SettingsCard
                icon={SlidersHorizontal}
                title="ملخص التشغيل"
                description="قراءة عامة لا تجعل هذه الصفحة مالكة لسياسات الذكاء الاصطناعي أو الحوكمة."
              >
                <div className="summary-list inline">
                  <SummaryRow label="مساحة العمل" value={workspace.workspaceName || "غير محدد"} />
                  <SummaryRow label="السوق الافتراضي" value={workspace.defaultMarket || "غير محدد"} />
                  <SummaryRow label="اللغة والنبرة" value={`${outputSettings.defaultLanguage} · ${outputSettings.defaultTone}`} />
                  <SummaryRow label="القنوات المفعلة" value={`${enabledChannelsCount} ملخص فقط`} />
                  <SummaryRow label="إعدادات AI" value="تُدار من الصفحات المتخصصة" />
                  <SummaryRow label="السياسات" value="تُدار من إدارة النظام" />
                  <SummaryRow label="مسارات الذكاء الاصطناعي" value={`${modelRoutingSummary.routes || 0} ملخص فقط`} />
                  <SummaryRow label="استهلاك التكلفة" value={`${modelRoutingSummary.usage || 0}% ملخص فقط`} />
                  <SummaryRow label="أعضاء الفريق" value={workspaceTeamSummary.members || 0} />
                  <SummaryRow label="تعليقات مفتوحة" value={workspaceTeamSummary.openComments || 0} />
                </div>
              </SettingsCard>
            </>
          )}

          {activeTab === "workspace" && (
            <SettingsCard
              icon={Store}
              title="إعدادات مساحة العمل"
              description="بيانات عامة تؤثر على الافتراضات داخل النظام."
            >
              <div className="form-grid">
                <Field
                  label="اسم مساحة العمل"
                  value={workspace.workspaceName}
                  onChange={(value) => updateWorkspace("workspaceName", value)}
                />

                <Field
                  label="اسم المسؤول"
                  value={workspace.ownerName}
                  onChange={(value) => updateWorkspace("ownerName", value)}
                />

                <Field
                  label="السوق الافتراضي"
                  value={workspace.defaultMarket}
                  onChange={(value) => updateWorkspace("defaultMarket", value)}
                />

                <Field
                  label="نمط النشاط"
                  value={workspace.businessMode}
                  onChange={(value) => updateWorkspace("businessMode", value)}
                />
              </div>
            </SettingsCard>
          )}

          {activeTab === "channels" && (
            <SettingsCard
              icon={Globe2}
              title="ملخص القنوات"
              description="حالة الربط هنا ملخص فقط. إدارة القنوات التفصيلية تتم من صفحة القنوات أو مصادر البيانات."
            >
              <div className="source-note">
                <Store size={18} />
                <div>
                  <strong>ملخص فقط</strong>
                  <span>
                    محاكاة فقط — لا يوجد اتصال فعلي في هذا النموذج. هذه الصفحة
                    لا تدير دورة الربط التفصيلية أو الصلاحيات.
                  </span>
                </div>
              </div>

              <div className="channels-grid">
                {channels.map((channel) => {
                  const Icon = channel.icon || Globe2;
                  const isConnected = channel.status === "connected";
                  const isPending = channel.status === "pending_oauth";

                  return (
                    <div
                      key={channel.id}
                      className={channel.fromSharedConnection ? "channel-card from-shared" : "channel-card"}
                    >
                      <div className="channel-header">
                        <div className="channel-title">
                          <div className="channel-icon">
                            <Icon size={21} />
                          </div>

                          <div>
                            <h3>{channel.name}</h3>
                            <p>{channel.description}</p>
                          </div>
                        </div>

                        <Switch
                          checked={channel.enabled}
                          onChange={(value) => updateChannelEnabled(channel.id, value)}
                        />
                      </div>

                      <div className="connection-badges">
                        <ConnectionBadge status={channel.status} />
                        {channel.fromSharedConnection && (
                          <span className="shared-badge">ملخص فقط</span>
                        )}
                      </div>

                      <div className="oauth-summary">
                        <SummaryRow
                          label="الحالة"
                          value={
                            isConnected
                              ? "مرتبط تجريبي"
                              : isPending
                                ? "بانتظار محاكاة الموافقة"
                                : channel.status === "failed"
                                  ? "فشل الربط"
                                  : "غير مرتبط"
                          }
                        />
                        <SummaryRow
                          label="الحساب"
                          value={channel.accountName || "لم يتم إكمال الربط"}
                        />
                        <SummaryRow
                          label="المالك التشغيلي"
                          value={channel.owner || "غير محدد"}
                        />
                        <SummaryRow
                          label="آخر تحديث"
                          value={channel.updatedAt || "لا يوجد"}
                        />
                      </div>

                      <div className="scope-list">
                        <strong>الصلاحيات المتوقعة لاحقًا</strong>
                        <div>
                          {(channel.requestedScopes || []).map((scope) => (
                            <span key={scope}>{scope}</span>
                          ))}
                        </div>
                      </div>

                      <div className="oauth-actions">
                        <button
                          type="button"
                          onClick={() => startOAuthConnection(channel)}
                        >
                          محاكاة بدء الربط
                        </button>

                        <button
                          type="button"
                          onClick={() => mockOAuthSuccess(channel)}
                        >
                          محاكاة إتمام الموافقة
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => disconnectOAuth(channel)}
                        >
                          قطع الربط
                        </button>
                      </div>

                      <div className="connection-state">
                        <Lock size={16} />
                        <span>
                          {isConnected
                            ? "مرتبط كمحاكاة داخل البروتوتايب."
                            : isPending
                              ? "تم بدء مسار محاكاة الربط وينتظر إتمام الموافقة."
                              : "غير مرتبط. استخدم المحاكاة فقط من هذه الصفحة."}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SettingsCard>
          )}

          {activeTab === "ai" && (
            <SettingsCard
              icon={Bot}
              title="ملخص الذكاء الاصطناعي والتكلفة"
              description="ملخص فقط. المزودون، التوجيه، النماذج البديلة، والتكلفة لا تُدار من هذه الصفحة."
            >
              <OwnershipNote
                title="إعدادات AI لا تُحفظ هنا"
                text="المزودون والأسرار: يُدار من الأسرار والمفاتيح. توجيه النماذج: يُدار من توجيه النماذج. التكلفة والاعتماد: يُدار من مراقبة التكلفة."
              />

              <div className="summary-list inline readonly-summary">
                <SummaryRow label="المزودون والأسرار" value="يُدار من الأسرار والمفاتيح" />
                <SummaryRow label="توجيه النماذج" value="يُدار من توجيه النماذج" />
                <SummaryRow label="التكلفة والاعتماد" value="يُدار من مراقبة التكلفة" />
                <SummaryRow label="النماذج النشطة" value={`${modelRoutingSummary.activeModels || 0} ملخص فقط`} />
                <SummaryRow label="مسارات المراجعة" value={`${modelRoutingSummary.reviewRoutes || 0} ملخص فقط`} />
                <SummaryRow label="توقع التكلفة" value={`${modelRoutingSummary.forecastUsage || 0}% ملخص فقط`} />
                <SummaryRow label="النماذج البديلة" value="تُدار من توجيه النماذج" />
                <SummaryRow label="مرجع السر" value="يُدار من الأسرار والمفاتيح" />
              </div>
            </SettingsCard>
          )}

          {activeTab === "governance" && (
            <SettingsCard
              icon={Shield}
              title="ملخص الحوكمة والسياسات"
              description="ملخص فقط. السياسات العامة والاعتمادات النهائية تُدار من إدارة النظام والصفحات المتخصصة."
            >
              <OwnershipNote
                title="السياسات النهائية ليست في الإعدادات العامة"
                text="الحوكمة والسياسات العامة: تُدار من إدارة النظام. حوكمة المطالبات: تُدار من حوكمة المطالبات. التشغيلات والجاهزية: تُعرض في تشغيلات النظام."
              />

              <div className="summary-list inline readonly-summary">
                <SummaryRow label="الحوكمة والسياسات العامة" value="تُدار من إدارة النظام" />
                <SummaryRow label="حوكمة المطالبات" value="تُدار من حوكمة المطالبات" />
                <SummaryRow label="التشغيلات والجاهزية" value="تُعرض في تشغيلات النظام" />
                <SummaryRow label="النشر التلقائي" value="تُدار من إدارة النظام" />
                <SummaryRow label="الاعتماد قبل الإرسال" value="يُدار من مراقبة التكلفة وإدارة النظام" />
                <SummaryRow label="سجل التدقيق" value="تُدار من إدارة النظام" />
              </div>
            </SettingsCard>
          )}

          {activeTab === "outputs" && (
            <SettingsCard
              icon={FileText}
              title="إعدادات المخرجات"
              description="افتراضات المحتوى التي ترثها الشاشات الأخرى."
            >
              <div className="form-grid">
                <SelectField
                  label="اللغة الافتراضية"
                  value={outputSettings.defaultLanguage}
                  options={languageOptions}
                  onChange={(value) => updateOutput("defaultLanguage", value)}
                />

                <SelectField
                  label="النبرة الافتراضية"
                  value={outputSettings.defaultTone}
                  options={toneOptions}
                  onChange={(value) => updateOutput("defaultTone", value)}
                />

                <SelectField
                  label="طول النص"
                  value={outputSettings.textLength}
                  options={["قصير", "متوسط", "طويل"]}
                  onChange={(value) => updateOutput("textLength", value)}
                />
              </div>

              <div className="toggle-grid">
                <ToggleRow
                  title="إضافة Hashtags"
                  description="إضافة وسوم عند الحاجة."
                  checked={outputSettings.includeHashtags}
                  onChange={(value) => updateOutput("includeHashtags", value)}
                />

                <ToggleRow
                  title="إضافة CTA"
                  description="تضمين دعوة للفعل في المخرجات."
                  checked={outputSettings.includeCTA}
                  onChange={(value) => updateOutput("includeCTA", value)}
                />

                <ToggleRow
                  title="توليد بدائل متعددة"
                  description="يساعد في A/B Testing لاحقًا."
                  checked={outputSettings.generateVariants}
                  onChange={(value) => updateOutput("generateVariants", value)}
                />

                <ToggleRow
                  title="ملخص آمن للعميل"
                  description="يفصل المنطق الداخلي عن النص المرئي للعميل."
                  checked={outputSettings.requireCustomerSafeSummary}
                  onChange={(value) => updateOutput("requireCustomerSafeSummary", value)}
                />
              </div>
            </SettingsCard>
          )}

          {activeTab === "audit" && (
            <SettingsCard
              icon={KeyRound}
              title="سجل الإعدادات"
              description="سجل محلي غير ملزم، ولا يمثل Audit Log حقيقيًا."
            >
              <div className="audit-list">
                {auditLog.map((item) => (
                  <div key={item.id} className={`audit-row ${item.severity}`}>
                    <div className="audit-icon">
                      {item.severity === "success" ? <CheckCircle2 size={16} /> : <KeyRound size={16} />}
                    </div>

                    <div>
                      <strong>{item.event}</strong>
                      <span>{item.actor} · {item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SettingsCard>
          )}
        </section>

        <aside className="settings-side">
          <SettingsCard
            icon={Shield}
            title="قرار الإعدادات العامة"
            description="ملخص سريع لافتراضات مساحة العمل والمخرجات فقط."
          >
            <div className="decision-box">
              <strong>
                {governanceScore >= 80
                  ? "GO كبروتوتايب"
                  : governanceScore >= 55
                    ? "GO مشروط"
                    : "NO-GO"}
              </strong>
              <span>
                {governanceScore >= 80
                  ? "الإعدادات مناسبة كتصور واجهة."
                  : governanceScore >= 55
                    ? "توجد ملاحظات في الإعدادات العامة."
                    : "الإعدادات العامة تحتاج ضبطًا قبل استخدامها كمرجع."}
              </span>
            </div>
          </SettingsCard>

          <SettingsCard
            icon={Globe2}
            title="حالة ربط القنوات"
            description="ملخص فقط. إدارة القنوات التفصيلية تتم من صفحة القنوات أو مصادر البيانات."
          >
            <div className="summary-list">
              <SummaryRow label="سجلات الربط" value={sharedConnectionCount} />
              <SummaryRow label="ظاهرة في الإعدادات" value={reflectedConnectionCount} />
              <SummaryRow label="مرتبطة" value={connectedOAuthCount} />
              <SummaryRow label="بانتظار محاكاة" value={pendingOAuthCount} />
            </div>
          </SettingsCard>

          <SettingsCard
            icon={SlidersHorizontal}
            title="ملخص التخصصات"
            description="هذه الصفحة تعرض مؤشرات فقط ولا تملك قرارات الذكاء الاصطناعي أو التكلفة."
          >
            <div className="summary-list">
              <SummaryRow label="إعدادات AI" value="تُدار من الصفحات المتخصصة" />
              <SummaryRow label="السياسات" value="تُدار من إدارة النظام" />
              <SummaryRow label="النماذج النشطة" value={`${modelRoutingSummary.activeModels || 0} ملخص فقط`} />
              <SummaryRow label="مسارات المراجعة" value={`${modelRoutingSummary.reviewRoutes || 0} ملخص فقط`} />
              <SummaryRow label="توقع التكلفة" value={`${modelRoutingSummary.forecastUsage || 0}% ملخص فقط`} />
            </div>
          </SettingsCard>

          <SettingsCard
            icon={Users}
            title="الفريق"
            description="ملخص قراءة فقط لحالة الأعضاء والتعليقات."
          >
            <div className="summary-list">
              <SummaryRow label="الأعضاء النشطون" value={workspaceTeamSummary.activeMembers || 0} />
              <SummaryRow label="الدعوات المعلقة" value={workspaceTeamSummary.invitedMembers || 0} />
              <SummaryRow label="الأدوار" value={workspaceTeamSummary.roles || 0} />
              <SummaryRow label="تعليقات مفتوحة" value={workspaceTeamSummary.openComments || 0} />
            </div>
          </SettingsCard>
        </aside>
      </section>

      {saved && (
        <div className="settings-toast">
          <CheckCircle2 size={18} />
          تم حفظ الإعدادات محليًا داخل الواجهة فقط.
        </div>
      )}
    </main>
  );
}
