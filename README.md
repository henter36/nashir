# Nashir

> **Repository status:** هذا المستودع هو المصدر المعتمد لواجهة منتج Nashir، ويحتوي الآن أيضًا على Backend/API داخل `apps/api` ضمن نطاق تنفيذ مضبوط عبر بوابات مراجعة. الواجهة المعتمدة لا تزال 23 صفحة عربية نشطة فقط، معرفة في `src/App.jsx` ومنفذة في `src/pages`. المستودع ليس جاهزًا للإنتاج بعد.
>
> **Repository status (English):** This repository is the approved Nashir Product UI source and now also contains a governed Backend/API implementation under `apps/api`. The approved Product UI is still exactly the 23 active Arabic screens defined in `src/App.jsx` and implemented in `src/pages`. It is not production-ready yet.

واجهة React/Vite تجريبية لمنصة **ناشر** ضمن تصور Marketing OS، مع Backend/API قيد التأسيس داخل `apps/api`.

هذا المستودع لم يعد UI-only. يحتوي الآن على Backend/API foundations، وBackend CI، وDB-backed CI baseline. مع ذلك، لا يعني هذا أن Product API runtime مقبول بالكامل أو أن النظام جاهز للإنتاج.

## الحالة الحالية

**Status:** Governed monorepo baseline — UI approved, Backend/API foundations in progress  
**Frontend:** React + Vite  
**Backend:** Fastify/TypeScript under `apps/api`  
**Database:** PostgreSQL-backed migration validation exists in CI; production database readiness is not accepted  
**Routing:** Local UI screen state داخل `App.jsx`، وليس React Router  
**Latest stabilization:** An opt-in local Product runtime is available for the accepted `/workspaces/{workspaceId}/products` route family. It is enabled with `NASHIR_ENABLE_LOCAL_PRODUCT_RUNTIME=1` or `true`, requires a valid `DATABASE_URL`, and cannot be enabled when `NODE_ENV=production`. Production readiness, pilot readiness, and general backend completion remain NO-GO.

## القيود الصريحة

- يوجد Backend/API داخل `apps/api`، لكنه لا يمثل قبولًا إنتاجيًا كاملًا.
- Product API runtime acceptance لا يزال NO-GO حتى اكتمال Node runtime alignment وتوسيع DB-backed Product API coverage.
- توجد Database migration validation في CI، لكن لا توجد production database readiness.
- لا يوجد Auth/RBAC production rollout مقبول.
- لا يوجد توليد AI حقيقي أو provider execution فعلي.
- لا يوجد نشر فعلي لأي قناة.
- لا يوجد إرسال WhatsApp أو Email أو تكامل Social حقيقي.
- بيانات الواجهة الحالية لا تزال Mock/Seed داخل ملفات الواجهة ما لم يتم ربط شاشة محددة بعقد Backend مصرح.
- أي أزرار فحص، توليد، نشر، اعتماد، أو تشغيل في الواجهة تبقى محاكاة محلية ما لم توجد بوابة تنفيذ تقبل غير ذلك صراحة.

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

الخطوات التالية الحالية:
1. Backend Database CI Implementation Review Gate.
2. Backend CI Node Runtime Alignment Fix.
3. Product API DB-backed Coverage Authorization.
4. Product API Runtime Acceptance Re-Review.
5. Product Catalog UI integration only after the required backend/runtime acceptance gates.

أي توسعة Backend/API/Database أو UI integration يجب أن تمر عبر بوابة صريحة، ولا تُستنتج من وجود `apps/api` وحده.
