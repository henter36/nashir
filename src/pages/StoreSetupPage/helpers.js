import { channelUrlLabels, legacyChannelMap, oauthProviderMeta } from "./constants.js";

export function normalizeSalesChannelName(channel) {
  return legacyChannelMap[channel] || channel;
}

export function getSelectedSalesChannels(form) {
  let raw = [];

  if (Array.isArray(form?.salesChannels) && form.salesChannels.length) {
    raw = form.salesChannels;
  } else if (Array.isArray(form?.preferredChannels) && form.preferredChannels.length) {
    raw = form.preferredChannels;
  } else if (form?.primarySalesChannel) {
    raw = [form.primarySalesChannel];
  }

  return Array.from(
    new Set(
      raw
        .map((channel) => normalizeSalesChannelName(String(channel || "").trim()))
        .filter(Boolean)
        .filter((channel) => channel !== ["قنوات", "متعددة"].join(" "))
    )
  );
}

export function getChannelUrlLabel(channel) {
  return channelUrlLabels[channel] || "رابط القناة";
}

export function channelNeedsUrl(channel) {
  return channel !== "نقطة بيع فعلية";
}

export function normalizeProviderKey(channel) {
  return (oauthProviderMeta[channel]?.id || String(channel))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
}

export function snapshotToStoreSource(snapshot) {
  if (!snapshot) {
    return {
      status: "manual",
      confidence: 35,
      message: "رابط قناة البيع مُدخل يدويًا ولم يتم فحصه بعد.",
    };
  }

  return {
    status: snapshot.status || "manual",
    confidence: snapshot.confidence || 35,
    message: snapshot.message || "رابط قناة البيع مُدخل يدويًا ولم يتم فحصه بعد.",
  };
}

export function snapshotToCollectedData(snapshot) {
  if (!snapshot) {
    return {
      detectedPlatform: "",
      detectedCategories: [],
      detectedProducts: [],
      brandKeywords: [],
      detectedTone: [],
      suggestedChannels: [],
      assetsNeedingReview: [],
    };
  }

  return {
    detectedPlatform: snapshot.detectedPlatform || "",
    detectedCategories: Array.isArray(snapshot.detectedCategories) ? snapshot.detectedCategories : [],
    detectedProducts: Array.isArray(snapshot.detectedProducts) ? snapshot.detectedProducts : [],
    brandKeywords: Array.isArray(snapshot.brandKeywords) ? snapshot.brandKeywords : [],
    detectedTone: Array.isArray(snapshot.detectedTone) ? snapshot.detectedTone : [],
    suggestedChannels: Array.isArray(snapshot.suggestedChannels) ? snapshot.suggestedChannels : [],
    assetsNeedingReview: Array.isArray(snapshot.assetsNeedingReview) ? snapshot.assetsNeedingReview : [],
  };
}
