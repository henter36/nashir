# Nashir

> **Repository status:** هذا المستودع هو المصدر الوحيد المعتمد لواجهة منتج Nashir. الواجهة المعتمدة هي 23 صفحة عربية نشطة فقط، معرفة في `src/App.jsx` ومنفذة في `src/pages`. وهو ليس جاهزًا للإنتاج بعد.
>
> **Repository status (English):** This repository is the only approved Nashir Product UI source. The approved Product UI is exactly the 23 active Arabic screens defined in `src/App.jsx` and implemented in `src/pages`. It is not production-ready yet.

واجهة React/Vite تجريبية لمنصة **ناشر** ضمن تصور Marketing OS.

هذا المستودع مخصص حاليًا لتثبيت واجهات المنتج ومساراته فقط قبل أي تنفيذ حقيقي. لا يمثل Backend أو API أو Database أو نظام صلاحيات فعلي.

## الحالة الحالية

**Status:** UI Prototype / Mock Only  
**Framework:** React + Vite  
**Routing:** Local screen state داخل `App.jsx`، وليس React Router  
**Latest stabilization:** إزالة الصفحات المستقلة القديمة وتثبيت خريطة الشاشات الحالية.

## القيود الصريحة

- لا يوجد Backend.
- لا يوجد API.
- لا يوجد Database.
- لا يوجد Auth أو RBAC حقيقي.
- لا يوجد توليد AI حقيقي.
- لا يوجد نشر فعلي لأي قناة.
- لا يوجد إرسال WhatsApp أو Email أو تكامل Social حقيقي.
- البيانات الحالية Mock/Seed داخل ملفات الواجهة.
- أي أزرار فحص، توليد، نشر، اعتماد، أو تشغيل هي محاكاة محلية فقط.

## الشاشات الحالية المعتمدة (23 شاشة)

تم اعتماد التصنيف الآتي في [Nashir V1 Scope Decision Gate](docs/nashir_v1_scope_decision_gate.md).

لا توجد واجهة منتج Nashir معتمدة في `marketing-os` أو `nashir-backend`. الشاشات `productIntelligence` و`creatorStudio` و`contentReview` أجزاء مقصودة من قائمة الصفحات الـ23، وليست شاشات عرضية أو مهجورة.

### V1 Core — المسار الأساسي للتاجر

| Screen ID | الصفحة | الملف | الدور |
|---|---|---|---|
| `dashboard` | لوحة التحكم | `src/pages/DashboardPage.jsx` | نقطة دخول ومتابعة عامة |
| `storeSetup` | إعداد المتجر | `src/pages/StoreSetupPage.jsx` | تأسيس بيانات المتجر والهوية التشغيلية |
| `productCatalog` | كتالوج المنتجات | `src/pages/ProductCatalogPage.jsx` | إدارة منتجات/خدمات Mock لاستخدامها في الحملات |
| `dataSourcesHub` | مركز المصادر البياناتية | `src/pages/DataSourcesHubPage.jsx` | عرض وفحص مصادر البيانات والتكاملات كمحاكاة |
| `assetLibrary` | مكتبة الأصول | `src/pages/AssetLibraryPage.jsx` | إدارة أصول المحتوى التجريبية |
| `campaigns` | معالج الحملات | `src/pages/CampaignWizardPage.jsx` | إنشاء حملة عبر معالج موحد |
| `campaignsList` | الحملات | `src/pages/CampaignsUnifiedPage.jsx` | قائمة الحملات وتفاصيلها بشكل موحد |
| `content` | المحتوى | `src/pages/ContentStudioPage.jsx` | إنشاء/تحرير المحتوى داخل شاشة موحدة |
| `publishingQueue` | جدولة النشر | `src/pages/PublishingQueuePage.jsx` | إدارة جدول نشر تجريبي |
| `analytics` | التحليلات | `src/pages/AnalyticsUnifiedPage.jsx` | التحليلات والتحليلات الذكية في شاشة موحدة |

### V1 Support — دعم المسار الأساسي

| Screen ID | الصفحة | الملف | الدور |
|---|---|---|---|
| `multiPlatform` | متعدد القنوات | `src/pages/MultiPlatformPage.jsx` | جاهزية النشر متعدد القنوات كمحاكاة |
| `teamCollaboration` | تعاون الفريق | `src/pages/TeamCollaborationPage.jsx` | أدوار وتعليقات وسجل تغييرات Mock |

### V1 Admin/Governance — الإدارة والحوكمة

| Screen ID | الصفحة | الملف | الدور |
|---|---|---|---|
| `templateEngine` | محرك القوالب | `src/pages/TemplateEnginePage.jsx` | إدارة قوالب المحتوى محليًا |
| `workflowRuns` | تشغيلات النظام | `src/pages/WorkflowRunsPage.jsx` | عرض تشغيلات Workflows كمحاكاة |
| `systemAdmin` | إدارة النظام | `src/pages/SystemAdminPage.jsx` | إعدادات إدارية Mock |
| `secrets` | الأسرار والمفاتيح | `src/pages/SecretsAndKeysPage.jsx` | واجهة شكلية لإدارة الأسرار دون تخزين فعلي |
| `modelRouting` | توجيه النماذج | `src/pages/ModelRoutingPage.jsx` | محاكاة سياسات اختيار مزودي AI |
| `promptGovernance` | حوكمة المطالبات | `src/pages/PromptGovernancePage.jsx` | محاكاة إدارة المطالبات ومخاطرها |
| `costMonitor` | مراقبة التكلفة | `src/pages/CostMonitorPage.jsx` | محاكاة تكلفة تشغيل AI وحدود الميزانية |
| `settings` | الإعدادات | `src/pages/SettingsPage.jsx` | إعدادات عامة محلية |

### Extended V1 — شاشات نشطة مؤجلة التنفيذ

هذه الشاشات نشطة وجزء من المنتج، وليست محذوفة أو مهجورة. تنفيذها Backend مؤجل إلى مرحلة لاحقة.

| Screen ID | الصفحة | الملف | الدور |
|---|---|---|---|
| `productIntelligence` | استوديو تحليل المنتج | `src/pages/ProductIntelligencePage.jsx` | تحليل المنتج وربطه بإنشاء الحملات |
| `creatorStudio` | استوديو صانع المحتوى | `src/pages/CreatorStudioPage.jsx` | أداة إنشاء المحتوى بدعم AI — بنية تحتية جاهزة |
| `contentReview` | المراجعة والمعاينة | `src/pages/ContentReviewPreviewUnifiedPage.jsx` | مراجعة ومعاينة المحتوى كشاشة مستقلة |

## الصفحات التي أزيلت من المسار

هذه الصفحات لم تعد جزءًا من خريطة التنقل الحالية ولا يجب إعادتها كصفحات مستقلة دون قرار جديد:

- `OnboardingFlowPage`
- `CampaignIntakePage`
- `DualGuidedIntakePage`
- `ReviewPage`
- `LivePreviewPage`
- `SmartAnalyticsPage`
- `CampaignDetailPage`

سبب الإزالة: دمج أو نقل وظائفها داخل صفحات موحدة لتقليل التكرار وتثبيت رحلة المستخدم.

## الرحلة الأساسية المعتمدة (V1 Core)

```text
Dashboard
→ Store Setup
→ Product Catalog
→ Data Sources Hub
→ Asset Library
→ Campaign Wizard
→ Campaigns
→ Content Studio
→ Publishing Queue
→ Analytics
```

هذا هو الحد الأدنى لحلقة القيمة التجارية لـ Nashir. شاشات الإدارة والحوكمة تدعم الرحلة لكنها ليست المسار الرئيسي. شاشات Extended V1 مؤجلة لمرحلة تنفيذ منفصلة.

## خريطة الشاشات

راجع:

```text
docs/screen_map.md
```

يحتوي الملف على تعريف كل شاشة، دورها، نوعها، حالتها، وملاحظات الحوكمة المرتبطة بها.

## التشغيل المحلي

```bash
npm install
npm run dev
```

للتأكد من سلامة البناء:

```bash
npm run build
```

ولفحص الكود:

```bash
npm run lint
```

## قرار نطاق V1

تم اعتماد تصنيف نطاق V1 عبر بوابات:
- **PR #62** Nashir Product Scope Reconciliation Gate
- **PR #64** Nashir V1 Scope Decision Gate
- **PR #65** Nashir V1 Scope Decision Review Gate

الخطوات التالية المعتمدة:
1. Nashir V1 Scope Documentation Update Gate (هذا PR).
2. Nashir Productization Roadmap Gate.
3. Nashir Backend/API Strategy Gate — يتبع نطاق V1 Core، لا يقوده.
4. Marketing OS Knowledge Extraction Gate — يأتي بعد توثيق نطاق Nashir.

لا يُطلب Backend/API/Database قبل إغلاق Nashir Productization Roadmap Gate.
