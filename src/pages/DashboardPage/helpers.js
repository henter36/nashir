export function strategicPlanNextAction(plan) {
  return plan?.planJson?.nextAction || "راجع آخر خطة استراتيجية محفوظة قبل إنشاء حملة.";
}

export function getCampaignProductName(campaign) {
  return campaign?.productSnapshot?.name || campaign?.product || "منتج غير محدد";
}

export function formatCampaignStatus(status) {
  const map = {
    active: "نشطة",
    review: "تحتاج مراجعة",
    draft: "مسودة",
    approved: "معتمدة",
  };
  return map[status] || "حالة غير معروفة";
}

export function normalizePercent(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

export function formatPlanStatus(plan) {
  if (!plan) return "لا توجد خطة استراتيجية محفوظة بعد";
  return plan.status === "ready_for_review" ? "جاهزة للمراجعة" : "مسودة";
}
