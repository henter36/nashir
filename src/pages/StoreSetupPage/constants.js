export const steps = [
  [1, "بيانات المتجر", "البيانات الأساسية والهوية التشغيلية."],
  [2, "المنتجات", "جدول المنتجات والخدمات المستخدمة في الحملات."],
  [3, "الجمهور والقنوات", "الجمهور الافتراضي والقنوات المفضلة للحملات."],
  [4, "السياسات", "القيود والموافقات قبل التوليد."],
  [5, "الجاهزية", "ملخص النواقص وقرار الانتقال للحملة."],
];

export const channelOptions = [
  "متجر إلكتروني",
  "سلة",
  "زد",
  "شوبيفاي",
  "إنستغرام",
  "تيك توك",
  "واتساب",
  "سناب شات",
  "موقع إلكتروني",
  "سوق/Marketplace",
  "نقطة بيع فعلية",
  "أخرى",
];

export const storeTypeOptions = [
  "منتجات جاهزة",
  "أسر منتجة",
  "خدمات",
  "مطعم / مقهى",
  "متجر مختلط",
  "علامة تجارية",
  "أخرى",
];

export const marketScopeOptions = [
  "السعودية",
  "الخليج",
  "الشرق الأوسط",
  "عالمي",
  "مدينة / منطقة محددة",
  "أخرى",
];

export const acquisitionPlans = {
  "متجر إلكتروني مستقل": {
    method: "Website crawl / rendered page extraction",
    tool: "Firecrawl / Browserless",
    collects: "صفحات المنتجات، الأسعار، الوصف، الصور، السياسات",
    backend: "Backend مطلوب للتنفيذ الحقيقي وجدولة السحب وتخزين النتائج.",
    analysisInput: "صفحات منظمة، منتجات مستخرجة، صور وروابط، وسياسات واضحة.",
    readiness: "جاهز للتصميم / غير منفذ",
    nextAction: "راجع رابط قناة البيع وحدد الصفحات التي يجب تحليلها لاحقًا.",
  },
  "متجر على منصة تجارة إلكترونية": {
    method: "Official platform API first, Firecrawl fallback للصفحات العامة",
    tool: "Official platform API / Firecrawl",
    collects: "المنتجات، التصنيفات، المخزون، الأسعار، الطلبات لاحقًا",
    backend: "Backend مطلوب لربط المنصة وحفظ مراجع الأسرار وجدولة المزامنة.",
    analysisInput: "كتالوج المنتجات والتصنيفات والأسعار وحالة المخزون عند توفرها.",
    readiness: "جاهز للتصميم / غير منفذ",
    nextAction: "حدد منصة التجارة الإلكترونية قبل تصميم موصل V1.",
  },
  "Instagram-first": {
    method: "Official API عند توفر الصلاحيات، مع Apify/PhantomBuster كخيارات محكومة",
    tool: "Official API / Apify / PhantomBuster",
    collects: "البايو، الرابط، المنشورات، Reels، التعليقات، مؤشرات التفاعل المصرح بها",
    backend: "Backend مطلوب للتحقق من الصلاحيات وتشغيل الموصلات دون كشف أسرار.",
    analysisInput: "ملف الحساب، إشارات المحتوى، أسئلة الجمهور، والمنتجات الظاهرة عند توفرها.",
    readiness: "جاهز للتصميم / غير منفذ",
    nextAction: "جهز مرجع السر وسياسة الامتثال قبل أي ربط اجتماعي.",
  },
  "TikTok-first": {
    method: "TikTok API عند توفر الصلاحيات، مع Apify/PhantomBuster كخيارات محكومة",
    tool: "TikTok API / Apify / PhantomBuster",
    collects: "الحساب، الفيديوهات، التعليقات، مؤشرات الأداء المصرح بها",
    backend: "Backend مطلوب لتشغيل الموصلات ومعالجة النتائج بشكل آمن.",
    analysisInput: "فيديوهات ومنشورات منظمة، تعليقات مصنفة، وإشارات أداء مسموحة.",
    readiness: "جاهز للتصميم / غير منفذ",
    nextAction: "حدد الحساب ونطاق الصلاحيات قبل تصميم التحليل.",
  },
  "TikTok Shop": {
    method: "TikTok Shop API / governed connector",
    tool: "TikTok Shop API / governed connector",
    collects: "المنتجات، المتجر، المحتوى التجاري، المؤشرات المصرح بها",
    backend: "Backend مطلوب لربط المتجر التجاري وإدارة الصلاحيات.",
    analysisInput: "منتجات المتجر، محتوى تجاري، ومؤشرات مصرح بها للتحليل.",
    readiness: "جاهز للتصميم / غير منفذ",
    nextAction: "حدد نطاق TikTok Shop المطلوب للمنتجات والمحتوى.",
  },
  Marketplace: {
    method: "Official marketplace API عند توفرها، أو موصل خارجي محكوم إذا اعتمد",
    tool: "Official marketplace API / governed external connector",
    collects: "بيانات المتجر، المنتجات، التقييمات، الأسعار",
    backend: "Backend مطلوب لتنفيذ الربط ومراجعة الامتثال.",
    analysisInput: "بيانات منتجات وتقييمات وأسعار منظمة مع حدود البيانات.",
    readiness: "جاهز للتصميم / غير منفذ",
    nextAction: "حدد السوق وسياسة استخدام بياناته قبل الربط.",
  },
  "متعدد القنوات": {
    method: "Connector orchestration",
    tool: "Connector orchestration",
    collects: "website + social + marketplace signals",
    backend: "Backend مطلوب لتنسيق الموصلات وترتيب المعالجة.",
    analysisInput: "حزمة أدلة موحدة تجمع الموقع، القنوات الاجتماعية، والأسواق.",
    readiness: "جاهز للتصميم / غير منفذ",
    nextAction: "ابدأ بمصدر واحد موثوق ثم أضف باقي القنوات تدريجيًا.",
  },
  "بدون موقع واضح": {
    method: "Social connector / user-created store profile",
    tool: "Social connector / user-created store profile",
    collects: "بيانات الحساب الاجتماعي والمنتجات المدخلة",
    backend: "Backend مطلوب لأي جمع اجتماعي آلي مصرح به.",
    analysisInput: "ملف متجر يدوي، منتجات مدخلة، وإشارات اجتماعية عند توفر موصل مصرح.",
    readiness: "جاهز للتصميم / غير منفذ",
    nextAction: "أكمل ملف المتجر والمنتجات يدويًا قبل أي تحليل آلي.",
  },
};

export const productFlagOptions = [
  "موسمي",
  "مخزون كبير",
  "جديد",
  "الأكثر مبيعًا",
  "مناسب للهدايا",
  "يحتاج شرحًا",
  "يصلح للفيديو",
];

export const policyItems = [
  "هل توجد عبارات ممنوعة؟",
  "هل توجد ادعاءات لا يجوز استخدامها؟",
  "هل توجد منتجات مقيدة؟",
  "سياسة استخدام صور العملاء",
  "هل يسمح باستخدام وجوه أشخاص؟",
  "هل توجد حساسية ثقافية أو تنظيمية؟",
];

export const defaultForm = {
  storeName: "متجر النخبة",
  storeUrl: "https://store.example",
  storeType: "منتجات جاهزة",
  primarySalesChannel: "موقع إلكتروني",
  salesChannels: ["موقع إلكتروني", "إنستغرام", "واتساب"],
  salesChannelUrls: {
    "موقع إلكتروني": "https://store.example",
  },
  activity: "متجر إلكتروني",
  category: "عناية وجمال",
  marketScope: "السعودية",
  marketLocation: "السعودية",
  tone: ["ودية", "موثوقة", "هادئة"],
  useWords: "طبيعي، موثوق، تجربة، جودة",
  avoidWords: "علاج، مضمون، الأفضل مطلقًا",
  age: "25–34",
  gender: "نساء",
  audienceLocation: "الرياض، السعودية",
  motives: ["جودة", "تجربة", "هدية"],
  preferredChannels: ["إنستغرام", "واتساب"],
  policyAnswers: {},
};

export const defaultProducts = [
  {
    id: 1,
    name: "سيروم عناية طبيعي",
    url: "https://store.example/products/serum",
    price: "149 ر.س",
    margin: "",
    description: "منتج عناية يومي مناسب لجمهور يبحث عن بساطة وثقة وتجربة طبيعية.",
    flags: ["جديد", "مناسب للهدايا", "يصلح للفيديو"],
    source: "manual",
  },
];

export const statusLabels = {
  manual: ["إدخال يدوي", "slate"],
  pending_scan: ["قيد الفحص", "amber"],
  scan_completed: ["تم التحليل", "green"],
  approved: ["معتمد", "green"],
};

export const channelConnectionLabels = {
  disconnected: ["غير مرتبط", "slate"],
  pending_oauth: ["بانتظار موافقة OAuth", "amber"],
  connected: ["مرتبط", "green"],
  failed: ["فشل الربط", "red"],
};

export const oauthProviderMeta = {
  إنستغرام: {
    id: "instagram",
    authUrl: "https://www.instagram.com/accounts/login/",
    scopes: ["profile", "content_read", "insights_later"],
  },
  Instagram: {
    id: "instagram",
    authUrl: "https://www.instagram.com/accounts/login/",
    scopes: ["profile", "content_read", "insights_later"],
  },
  "تيك توك": {
    id: "tiktok",
    authUrl: "https://www.tiktok.com/login",
    scopes: ["profile", "video_read", "content_planning"],
  },
  TikTok: {
    id: "tiktok",
    authUrl: "https://www.tiktok.com/login",
    scopes: ["profile", "video_read", "content_planning"],
  },
  "سناب شات": {
    id: "snapchat",
    authUrl: "https://accounts.snapchat.com/",
    scopes: ["profile", "ads_later"],
  },
  Snapchat: {
    id: "snapchat",
    authUrl: "https://accounts.snapchat.com/",
    scopes: ["profile", "ads_later"],
  },
  واتساب: {
    id: "whatsapp",
    authUrl: "https://business.facebook.com/",
    scopes: ["business_profile", "message_templates_later"],
  },
  "WhatsApp Business": {
    id: "whatsapp",
    authUrl: "https://business.facebook.com/",
    scopes: ["business_profile", "message_templates_later"],
  },
  سلة: {
    id: "salla",
    authUrl: "https://s.salla.sa/",
    scopes: ["store_profile", "products_read_later"],
  },
  Email: {
    id: "email",
    authUrl: "https://accounts.google.com/",
    scopes: ["drafts_later", "sender_profile"],
  },
  YouTube: {
    id: "youtube",
    authUrl: "https://accounts.google.com/",
    scopes: ["channel_profile", "video_planning"],
  },
  "Google Ads": {
    id: "google_ads",
    authUrl: "https://accounts.google.com/",
    scopes: ["ads_profile_later", "reporting_later"],
  },
  "Meta Ads": {
    id: "meta_ads",
    authUrl: "https://business.facebook.com/",
    scopes: ["ads_profile_later", "reporting_later"],
  },
  Salla: {
    id: "salla",
    authUrl: "https://s.salla.sa/",
    scopes: ["store_profile", "products_read_later"],
  },
  زد: {
    id: "zid",
    authUrl: "https://zid.sa/",
    scopes: ["store_profile_later", "products_read_later"],
  },
  شوبيفاي: {
    id: "shopify",
    authUrl: "https://www.shopify.com/login",
    scopes: ["store_profile_later", "products_read_later"],
  },
};

export const legacyChannelMap = {
  Instagram: "إنستغرام",
  TikTok: "تيك توك",
  Snapchat: "سناب شات",
  "WhatsApp Business": "واتساب",
  Salla: "سلة",
  "الموقع الإلكتروني": "موقع إلكتروني",
  Marketplace: "سوق/Marketplace",
};

export const channelUrlLabels = {
  سلة: "رابط متجر سلة",
  زد: "رابط متجر زد",
  شوبيفاي: "رابط متجر شوبيفاي",
  إنستغرام: "رابط إنستغرام",
  واتساب: "رابط واتساب",
  "موقع إلكتروني": "رابط الموقع",
};

export const smartBoxTips = {
  1: ["أبقِ بيانات المتجر مختصرة؛ لا تحولها إلى صفحة Branding كاملة.", "فحص المتجر يولّد اقتراحات فقط، ولا يعتمدها دون مراجعة."],
  2: ["المنتجات هنا ستُستخدم كمدخلات للحملات القادمة.", "لا تجعل هامش الربح إلزاميًا في V1."],
  3: ["اجمع الجمهور والقنوات في قرار واحد قبل الانتقال للسياسات.", "الربط الذي يتم هنا ينعكس تلقائيًا في الإعدادات دون مزامنة يدوية."],
  4: ["السياسات تحمي النظام من ادعاءات أو نشر غير آمن.", "أي عنصر بحاجة مراجعة يجب أن يمنع النشر التلقائي لاحقًا."],
  5: ["لا تنتقل إلى الحملة إذا كانت المنتجات أو السياسات ناقصة.", "ابدأ بحملة منتج واحد قبل التوسع."],
};
