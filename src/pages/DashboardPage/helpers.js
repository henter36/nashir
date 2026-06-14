export function strategicPlanNextAction(plan) {
  return plan?.planJson?.nextAction || "راجع آخر خطة استراتيجية محفوظة قبل إنشاء حملة.";
}

export function getCampaignProductName(campaign = {}) {
  return campaign.productSnapshot?.name || campaign.product || "منتج غير محدد";
}

export function formatCampaignStatus(status) {
  const map = {
    active: "نشطة",
    review: "تحتاج مراجعة",
    draft: "مسودة",
    approved: "معتمدة",
  };
  return map[status] || status;
}
