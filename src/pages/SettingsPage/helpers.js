import { getChannelConnectionStatus } from "../../utils/integrationConnectionsStore.js";
import { OAUTH_PROVIDERS } from "./constants.js";

export function safeNormalize(value = "") {
  const normalized = String(value)
    .toLowerCase()
    .replace("whatsapp business", "whatsapp")
    .replace("googleads", "google_ads")
    .replace("metaads", "meta_ads");
  let result = "";

  for (const character of normalized) {
    const code = character.charCodeAt(0);
    const isLowercaseLetter = code >= 97 && code <= 122;
    const isNumber = code >= 48 && code <= 57;

    if (isLowercaseLetter || isNumber) {
      result += character;
    } else if (result && !result.endsWith("_")) {
      result += "_";
    }
  }

  return result.endsWith("_") ? result.slice(0, -1) : result;
}

export function getProviderKey(channel) {
  if (!channel) return "";
  if (typeof channel === "string") return safeNormalize(channel);
  return safeNormalize(channel.providerId || channel.id || channel.name || "");
}

export function buildDefaultChannels(sharedConnections = {}) {
  const safeConnections = sharedConnections && typeof sharedConnections === "object" ? sharedConnections : {};
  return Object.values(OAUTH_PROVIDERS).map((provider) => {
    const existing = safeConnections[provider.id] || {};
    const status = getChannelConnectionStatus(existing);

    return {
      ...provider,
      enabled: status !== "disconnected" || ["instagram", "whatsapp", "email"].includes(provider.id),
      status,
      accountName: existing.accountName || "",
      authorizationUrl: existing.authorizationUrl || provider.authUrl,
      requestedScopes: existing.requestedScopes || provider.scopes,
      updatedAt: existing.updatedAt || "",
      lastAction: existing.lastAction || "",
      fromSharedConnection: Boolean(safeConnections[provider.id]),
    };
  });
}

export function applySharedConnections(channels, sharedConnections = {}) {
  const safeChannels = Array.isArray(channels) ? channels : [];
  const safeConnections = sharedConnections && typeof sharedConnections === "object" ? sharedConnections : {};
  return safeChannels.map((channel) => {
    const key = getProviderKey(channel);
    const shared = safeConnections[key] || {};
    const provider = OAUTH_PROVIDERS[key] || channel;
    const status = getChannelConnectionStatus(shared);

    return {
      ...channel,
      ...provider,
      enabled: channel.enabled || status !== "disconnected",
      status,
      accountName: shared.accountName || "",
      authorizationUrl: shared.authorizationUrl || provider.authUrl || channel.authorizationUrl,
      requestedScopes: shared.requestedScopes || provider.scopes || channel.requestedScopes || [],
      updatedAt: shared.updatedAt || "",
      lastAction: shared.lastAction || "",
      fromSharedConnection: Boolean(safeConnections[key]),
    };
  });
}

export function buildWarnings({ channels, outputSettings, workspace, sharedConnections } = {}) {
  const safeChannels = Array.isArray(channels) ? channels : [];
  const safeOutputSettings = outputSettings || {};
  const safeWorkspace = workspace || {};
  const safeConnections = sharedConnections && typeof sharedConnections === "object" ? sharedConnections : {};
  const warnings = [];

  if (!String(safeWorkspace.workspaceName || "").trim()) {
    warnings.push({
      id: "workspace_name_missing",
      tone: "red",
      title: "اسم مساحة العمل فارغ",
      message: "غياب اسم مساحة العمل يضعف وضوح الإعدادات والتقارير.",
    });
  }

  if (!String(safeWorkspace.ownerName || "").trim()) {
    warnings.push({
      id: "owner_missing",
      tone: "amber",
      title: "مالك الإعدادات غير محدد",
      message: "يجب وجود مسؤول واضح عن تغيير الإعدادات قبل التنفيذ الحقيقي.",
    });
  }

  if (!safeChannels.some((channel) => channel.enabled)) {
    warnings.push({
      id: "no_channels",
      tone: "red",
      title: "لا توجد قناة مفعلة",
      message: "لن تكون مخرجات الحملة ذات معنى تشغيلي إذا لم توجد قناة مستهدفة.",
    });
  }

  if (safeChannels.some((channel) => channel.status === "pending_oauth")) {
    warnings.push({
      id: "pending_oauth",
      tone: "amber",
      title: "يوجد ربط تجريبي بانتظار الإكمال",
      message: "حالة الربط هنا ملخص فقط. إدارة القنوات التفصيلية تتم من صفحة القنوات أو مصادر البيانات.",
    });
  }

  if (safeChannels.some((channel) => channel.status === "connected")) {
    warnings.push({
      id: "mock_connections",
      tone: "amber",
      title: "يوجد ربط تجريبي",
      message: "محاكاة فقط — لا يوجد اتصال فعلي في هذا النموذج.",
    });
  }

  const sharedConnectionCount = Object.keys(safeConnections).length;
  const reflectedCount = safeChannels.filter((channel) => channel.fromSharedConnection).length;

  if (sharedConnectionCount > 0 && reflectedCount === 0) {
    warnings.push({
      id: "shared_connections_not_reflected",
      tone: "amber",
      title: "حالة الربط لا تظهر في القنوات",
      message: "راجع مفاتيح القنوات حتى تطابق Provider IDs المعتمدة.",
    });
  }

  if (!safeOutputSettings.requireCustomerSafeSummary) {
    warnings.push({
      id: "customer_summary_disabled",
      tone: "amber",
      title: "ملخص العميل الآمن غير مفعل",
      message: "يجب فصل المطالبة الداخلية عن النص المرئي للعميل.",
    });
  }

  return warnings;
}

export function calculateScore(warnings) {
  const safeWarnings = Array.isArray(warnings) ? warnings : [];
  const red = safeWarnings.filter((warning) => warning.tone === "red").length;
  const amber = safeWarnings.filter((warning) => warning.tone === "amber").length;
  return Math.max(0, Math.min(100, 100 - red * 18 - amber * 8));
}
