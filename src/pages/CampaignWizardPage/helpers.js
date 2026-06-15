export function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function buildAssetSnapshot(asset = {}) {
  return {
    name: asset.name || "أصل غير محدد",
    type: asset.type || "image",
    linkedProductId: asset.linkedProductId || "",
    linkedName: asset.linkedName || "عام",
    rightsStatus: asset.rightsStatus || "needs_check",
    usage: Array.isArray(asset.usage) ? asset.usage : [],
    status: asset.status || "review",
  };
}

export function makeCustomerText({
  output,
  productName,
  goal,
  offer,
  cta,
  ageGroup,
  gender,
  style,
  videoDuration,
}) {
  const audienceContext = `${ageGroup || "الفئة غير محددة"} · ${gender || "الكل"}`;

  if (output.includes("فيديو") || output.includes("Reel")) {
    return `سيناريو فيديو ${videoDuration} يعرّف بالمنتج "${productName}" ويربطه بهدف "${goal}" لفئة ${audienceContext} بأسلوب ${style}. سيظهر المنتج بوضوح، ثم يشرح الفائدة الرئيسية، ثم ينتهي بدعوة "${cta}".`;
  }

  if (output.includes("صورة") || output.includes("Story") || output.includes("Carousel")) {
    return `اتجاه بصري عام لمخرج ${output}: إبراز المنتج "${productName}" مع عرض واضح "${offer}" ودعوة "${cta}" وخلفية نظيفة تناسب الهوية. الفئة: ${audienceContext}.`;
  }

  if (output.includes("Email")) {
    return `هيكل بريد تسويقي يفتتح بمناسبة أو فائدة، ثم يعرض المنتج "${productName}" وفوائده، ثم يوضح العرض "${offer}" وينتهي بدعوة "${cta}". الفئة: ${audienceContext}.`;
  }

  if (output.includes("WhatsApp")) {
    return `صياغة قصيرة ومباشرة تناسب WhatsApp، تركز على المنتج "${productName}" والعرض "${offer}" مع دعوة "${cta}" دون إطالة.`;
  }

  return `نص تسويقي عام لمخرج ${output} يركز على المنتج "${productName}" والهدف "${goal}" والعرض "${offer}" ودعوة "${cta}" بنبرة واضحة وقابلة للمراجعة.`;
}

export function makeInternalPrompt({ output, productName, goal, offer, cta, ageGroup, gender, style }) {
  return `INTERNAL_PROMPT:: generate_${output} | product=${productName} | goal=${goal} | offer=${offer} | cta=${cta} | age=${ageGroup} | gender=${gender} | style=${style} | include_brand_rules=true | include_platform_constraints=true | hidden_from_customer=true`;
}

export function buildSuggestedCampaignText({ productName, goal, offer, audience, cta, channels, assets }) {
  if (!productName || !offer || !audience) {
    return "أكمل بيانات المنتج والعرض والجمهور لظهور نص مقترح أوضح.";
  }

  const channelText = channels.length ? channels.join("، ") : "القنوات المختارة";
  const assetText = assets.length ? ` بالاعتماد على ${assets.slice(0, 2).map((asset) => asset.name).join("، ")}` : "";

  return `اكتشف ${productName} مع ${offer} يناسب ${audience}. حملة ${goal} على ${channelText}${assetText}. ${cta || "تسوق الآن"}.`;
}

export function getApprovalLabel(status) {
  if (status === "approved") return "معتمد";
  if (status === "needs_edit") return "يحتاج تعديل";
  return "غير معتمد";
}

export function getOutputTypeLabel(output) {
  const value = String(output || "");
  if (value.includes("صفحة هبوط")) return "صفحة هبوط";
  if (value.includes("فيديو") || value.includes("Reel")) return "سيناريو فيديو";
  if (value.includes("صورة") || value.includes("Story") || value.includes("Carousel")) return "وصف صورة / أصل بصري";
  if (value.includes("WhatsApp") || value.includes("واتساب")) return "رسالة واتساب";
  if (value.includes("Email") || value.includes("بريد")) return "بريد تسويقي";
  if (value.includes("منشور") || value.includes("Caption")) return "منشور اجتماعي";
  if (value.includes("ملخص")) return "ملخص حملة";
  if (value.includes("نص")) return "نص إعلان";
  return "مخرج آخر";
}

export function getOutputTaskType(output) {
  const type = getOutputTypeLabel(output);
  if (type === "سيناريو فيديو") return "video_script";
  if (type === "وصف صورة / أصل بصري") return "image_prompt";
  if (type === "رسالة واتساب" || type === "بريد تسويقي") return "message_generation";
  if (type === "صفحة هبوط") return "landing_page_copy";
  return "ad_copy_generation";
}

export function getOutputRequiredFields(output) {
  const type = getOutputTypeLabel(output);
  if (type === "نص إعلان" || type === "منشور اجتماعي") {
    return ["المنتج", "العرض", "الجمهور", "القنوات", "CTA"];
  }
  if (type === "سيناريو فيديو") {
    return ["المنتج", "العرض", "الأصول", "مدة الفيديو", "CTA"];
  }
  if (type === "وصف صورة / أصل بصري") {
    return ["المنتج", "الأصول", "زاوية الرسالة", "القناة"];
  }
  if (type === "صفحة هبوط") {
    return ["المنتج", "الوعد الرئيسي", "العرض", "الجمهور", "CTA", "الأصول"];
  }
  if (type === "رسالة واتساب" || type === "بريد تسويقي") {
    return ["المنتج", "العرض", "الجمهور", "CTA", "النبرة"];
  }
  return ["المنتج", "العرض", "الجمهور", "CTA"];
}

export function resolvePromptForOutput(output, prompts) {
  if (!Array.isArray(prompts) || !prompts.length) return null;
  const taskType = getOutputTaskType(output);
  const typeLabel = getOutputTypeLabel(output);
  return (
    prompts.find((p) => p.task === taskType) ||
    prompts.find((p) => Array.isArray(p.allowedOutputs) && p.allowedOutputs.some((o) => typeLabel.includes(o) || o.includes(typeLabel))) ||
    prompts[0] ||
    null
  );
}

export function resolveRouteForOutput(output, routes) {
  if (!Array.isArray(routes) || !routes.length) return null;
  const taskType = getOutputTaskType(output);
  return (
    routes.find((r) => r.taskType === taskType) ||
    routes.find((r) => r.taskType === "general_task") ||
    routes[0] ||
    null
  );
}

export function checkOutputFieldsReadiness({ output, productName, offer, audience, channels, selectedAssets, cta, videoDuration }) {
  const required = getOutputRequiredFields(output);
  const fieldValues = {
    "المنتج": productName,
    "العرض": offer,
    "الجمهور": audience,
    "القنوات": channels?.length,
    "CTA": cta,
    "الأصول": selectedAssets?.length,
    "مدة الفيديو": videoDuration,
    "الوعد الرئيسي": offer,
    "زاوية الرسالة": offer,
    "القناة": channels?.[0],
    "النبرة": "مباشر",
  };
  const ready = required.filter((f) => Boolean(fieldValues[f]));
  const missing = required.filter((f) => !fieldValues[f]);
  return { required, ready, missing };
}

export function getPromptStatusArabicLabel(status) {
  const map = {
    active: "معتمدة",
    approved: "معتمدة",
    testing: "تجريبية",
    draft: "مسودة",
    blocked: "غير متاحة",
    needs_review: "تحتاج مراجعة",
  };
  return map[String(status)] || "مسودة";
}

export function buildOutputMockContent({ output, productName, goal, offer, cta, channels, selectedAssets, videoDuration, ageGroup, gender }) {
  const type = getOutputTypeLabel(output);
  const assetNames = Array.isArray(selectedAssets) && selectedAssets.length
    ? selectedAssets.map((a) => a.name).join("، ")
    : "أصول مقترحة لاحقًا";
  const channelText = Array.isArray(channels) && channels.length ? channels.join("، ") : "القنوات المختارة";
  const prod = productName || "المنتج";
  const offerText = offer || "العرض";
  const ctaText = cta || "تسوق الآن";
  const age = ageGroup || "الفئة العمرية";
  const gend = gender || "الكل";
  const dur = videoDuration || "15 ثانية";
  const goalText = goal || "هدف الحملة";

  if (type === "نص إعلان") {
    return `✦ ${prod} — ${offerText}\nاكتشف ${prod} مع عرض ${offerText} حصري. مثالي لفئة ${age}.\n👉 ${ctaText}`;
  }
  if (type === "منشور اجتماعي") {
    return `🌟 ${prod}\n${offerText} لفترة محدودة!\nمناسب لـ${gend} من ${age}.\n${ctaText} الآن على ${channelText}.`;
  }
  if (type === "سيناريو فيديو") {
    const durSec = String(dur).replace(/[^0-9]/g, "") || "15";
    return `▸ المشهد 1 (0–3 ث): لقطة مشكلة يومية تُبرز الحاجة.\n▸ المشهد 2 (3–8 ث): ظهور ${prod} كحل مع ${offerText}.\n▸ المشهد 3 (8–${durSec} ث): دعوة مباشرة — "${ctaText}".\n📎 الأصول: ${assetNames}\n🎯 الهدف: ${goalText}`;
  }
  if (type === "وصف صورة / أصل بصري") {
    return `📸 وصف الأصل البصري:\nالمنتج في مقدمة الصورة بإضاءة نظيفة ومحايدة.\nنص مدمج: "${offerText}" بخط واضح.\nالأصول المقترحة: ${assetNames}\nالقناة: ${channelText}`;
  }
  if (type === "صفحة هبوط") {
    return `🏠 عنوان الصفحة: ${prod} — ${offerText}\n✦ الوعد الرئيسي: حل بسيط مع ${offerText} حصري.\n✦ القسم 1: مميزات ${prod}\n✦ القسم 2: شهادات العملاء\n✦ القسم 3: العرض والأسئلة الشائعة\n👉 CTA: "${ctaText}" (بارز في الأعلى والأسفل)\n📎 الأصول: ${assetNames}`;
  }
  if (type === "رسالة واتساب") {
    return `السلام عليكم 👋\n${prod} متوفر الآن مع ${offerText}!\nلا تفوت الفرصة — ${ctaText} ⬇️`;
  }
  if (type === "بريد تسويقي") {
    return `الموضوع: ${offerText} حصري على ${prod}\n\nمرحبًا،\nيسعدنا نقدم لك ${prod} مع ${offerText} خاص.\n${ctaText} الآن وابدأ تجربتك.\n\nفريق المتجر`;
  }
  if (type === "ملخص حملة") {
    return `📋 ملخص الحملة:\nالمنتج: ${prod}\nالهدف: ${goalText}\nالعرض: ${offerText}\nالجمهور: ${age} — ${gend}\nالقنوات: ${channelText}\nCTA: ${ctaText}`;
  }
  return `مخرج تجريبي لـ${output}:\nالمنتج "${prod}" مع ${offerText}.\nالهدف: ${goalText}. CTA: ${ctaText}.`;
}
