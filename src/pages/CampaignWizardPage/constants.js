export const goals = [
  "زيادة المبيعات",
  "إطلاق منتج جديد",
  "تصريف مخزون",
  "رفع الوعي",
  "زيادة المتابعين",
  "جمع عملاء محتملين",
  "زيارات للمتجر الإلكتروني",
  "زيارات للفرع",
  "إعادة استهداف",
  "حملة موسمية",
  "حملة عروض",
];

export const occasions = [
  "رمضان",
  "العيد",
  "اليوم الوطني",
  "الجمعة البيضاء",
  "العودة للمدارس",
  "موسم الشتاء",
  "تصفية",
  "إطلاق منتج",
  "أخرى",
];

export const languageOptions = ["العربية", "الإنجليزية", "العربية والإنجليزية"];

export const ageGroupOptions = ["18–24", "25–34", "35–44", "45–54", "55+"];
export const genderOptions = ["الكل", "رجال", "نساء"];

export const ctaOptions = [
  "اطلب الآن",
  "تسوق الآن",
  "احجز الآن",
  "تواصل معنا",
  "اكتشف المزيد",
  "احصل على العرض",
  "جرّب المنتج",
  "أرسل رسالة واتساب",
];

export const channelOptions = [
  "Instagram",
  "TikTok",
  "Snapchat",
  "X",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "WhatsApp Business",
  "Email",
  "Google Ads",
  "Meta Ads",
];

export const outputOptions = [
  "نص إعلان",
  "منشور اجتماعي",
  "Caption",
  "Story",
  "Carousel",
  "Reel قصير",
  "صورة إعلانية",
  "فيديو قصير",
  "صفحة هبوط",
  "Email",
  "WhatsApp",
  "بريد تسويقي",
  "رسالة واتساب",
  "ملخص حملة",
];

export const initialProducts = [
  {
    id: "p-1",
    name: "عطر X",
    url: "https://store.example/products/perfume-x",
    price: "299 ريال",
    description: "عطر فاخر مناسب للهدايا والمناسبات.",
  },
  {
    id: "p-2",
    name: "باقة العطور الموسمية",
    url: "https://store.example/products/bundle",
    price: "599 ريال",
    description: "باقة عطور موسمية بتغليف مناسب للهدايا.",
  },
  {
    id: "p-3",
    name: "منتج العناية اليومي",
    url: "https://store.example/products/care",
    price: "149 ريال",
    description: "منتج عناية يومي بتجربة بسيطة وموثوقة.",
  },
];

export const assetFallbackSeed = [
  {
    id: "wiz-asset-1",
    name: "صورة عطر X الرئيسية",
    type: "image",
    linkedType: "product",
    linkedName: "عطر X",
    quality: "high",
    rightsStatus: "allowed",
    tags: ["منتج", "صورة"],
  },
  {
    id: "wiz-asset-2",
    name: "فيديو قصير للعرض",
    type: "video",
    linkedType: "product",
    linkedName: "عطر X",
    quality: "medium",
    rightsStatus: "needs_check",
    tags: ["فيديو", "إعلان"],
  },
  {
    id: "wiz-asset-3",
    name: "شعار المتجر",
    type: "logo",
    linkedType: "general",
    linkedName: "عام",
    quality: "high",
    rightsStatus: "allowed",
    tags: ["هوية"],
  },
];

export const steps = [
  [1, "أساسيات الحملة", "الهدف، المنتج، التاريخ، الميزانية، المناسبة."],
  [2, "الأصول المتاحة", "الأصول المحفوظة والجديدة وفحص الجودة."],
  [3, "العرض والجمهور والقنوات", "العرض، الجمهور، اللغة، والقنوات."],
  [4, "المخرجات المطلوبة", "النصوص، الصور، الفيديو، المقاسات، النسخ."],
  [5, "Brief + الجاهزية", "ملخص كامل ومخرجات عميل/نموذج قبل التوليد."],
];

export const productRefKey = ["product", "Id"].join("");
export const assetRefKey = ["asset", "Id"].join("");
