import { Globe2, Mail, MessageCircle, PlayCircle, Sparkles, Store } from "lucide-react";

function createOAuthProvider(id, name, description, authUrl, scopes, owner, icon) {
  return { id, name, description, authUrl, scopes, owner, icon };
}

export const OAUTH_PROVIDERS = Object.fromEntries([
  createOAuthProvider("instagram", "Instagram", "ربط حساب Instagram لاستخدامه في تجهيز المحتوى والرؤى لاحقًا.", "https://www.instagram.com/accounts/login/", ["profile", "content_read_later", "insights_later"], "Marketing", Globe2),
  createOAuthProvider("tiktok", "TikTok", "ربط TikTok لتجهيز فيديوهات قصيرة ومراجعة جاهزية القناة.", "https://www.tiktok.com/login", ["profile", "video_read_later", "content_planning"], "Content", PlayCircle),
  createOAuthProvider("snapchat", "Snapchat", "ربط Snapchat كقناة مستقبلية للحملات والرسائل القصيرة.", "https://accounts.snapchat.com/", ["profile", "ads_later"], "Marketing", Sparkles),
  createOAuthProvider("whatsapp", "WhatsApp Business", "ربط WhatsApp Business لاستخدامه لاحقًا في حملات الرسائل.", "https://business.facebook.com/", ["business_profile", "message_templates_later"], "Sales", MessageCircle),
  createOAuthProvider("email", "Email", "ربط البريد/مزود الرسائل لاستخدامه في الحملات البريدية لاحقًا.", "https://accounts.google.com/", ["sender_profile", "drafts_later"], "CRM", Mail),
  createOAuthProvider("youtube", "YouTube", "ربط قناة YouTube لتجهيز المحتوى المرئي لاحقًا.", "https://accounts.google.com/", ["channel_profile", "video_planning"], "Content", PlayCircle),
  createOAuthProvider("google_ads", "Google Ads", "ربط Google Ads لاحقًا للقراءة والتحليلات وليس للنشر التلقائي.", "https://accounts.google.com/", ["ads_profile_later", "reporting_later"], "Ads", Globe2),
  createOAuthProvider("meta_ads", "Meta Ads", "ربط Meta Ads لاحقًا للقراءة والتحليلات وليس للنشر التلقائي.", "https://business.facebook.com/", ["ads_profile_later", "reporting_later"], "Ads", Globe2),
  createOAuthProvider("salla", "Salla", "ربط المتجر لاحقًا لجلب المنتجات وبيانات التجارة بطريقة آمنة.", "https://s.salla.sa/", ["store_profile", "products_read_later"], "Store", Store),
].map((provider) => [provider.id, provider]));

export const DEFAULT_WORKSPACE = {
  workspaceName: "ناشر",
  ownerName: "أحمد السعيد",
  defaultMarket: "السعودية",
  businessMode: "متجر إلكتروني",
};

export const DEFAULT_OUTPUT_SETTINGS = {
  defaultLanguage: "العربية",
  defaultTone: "ودية",
  textLength: "متوسط",
  includeHashtags: true,
  includeCTA: true,
  generateVariants: true,
  requireCustomerSafeSummary: true,
};

export const toneOptions = ["ودية", "رسمية", "فاخرة", "شبابية", "عملية", "جريئة", "هادئة"];
export const languageOptions = ["العربية", "الإنجليزية", "العربية والإنجليزية"];

export const TABS = [
  ["overview", "نظرة عامة"],
  ["workspace", "مساحة العمل"],
  ["channels", "القنوات"],
  ["ai", "ملخص الذكاء الاصطناعي"],
  ["governance", "ملخص الحوكمة"],
  ["outputs", "المخرجات"],
  ["audit", "سجل الإعدادات"],
];

export const OWNERSHIP_MAP = [
  ["المزودون والأسرار", "يُدار من الأسرار والمفاتيح"],
  ["توجيه النماذج", "يُدار من توجيه النماذج"],
  ["التكلفة والاعتماد", "يُدار من مراقبة التكلفة"],
  ["الحوكمة والسياسات العامة", "تُدار من إدارة النظام"],
  ["حوكمة المطالبات", "تُدار من حوكمة المطالبات"],
  ["التشغيلات والجاهزية", "تُعرض في تشغيلات النظام"],
  ["القنوات ومصادر البيانات", "تُدار من القنوات أو مصادر البيانات"],
];
