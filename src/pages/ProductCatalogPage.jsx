import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Edit3, ImageIcon, Package, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

import {
  createIdempotencyKey,
  createProduct,
  createProductRequestBody,
  getProduct,
  getProductCatalogApiConfig,
  listProducts,
  ProductCatalogApiError,
  updateProduct,
  updateProductRequestBody,
} from "../utils/productCatalogApi.js";
import {
  mergeBackendProducts,
  normalizeCatalogProduct,
  readProductCatalog,
} from "../utils/productCatalogStore.js";

const initialProducts = [
  { id: "mock-001", name: "عطر أرابيان أود", category: "عطور", price: 599, status: "draft", description: "بيانات تجريبية محلية." },
  { id: "mock-002", name: "باقة هدايا فاخرة", category: "هدايا", price: 349, status: "draft", description: "بيانات تجريبية محلية." },
];

const emptyDraft = {
  name: "",
  category: "",
  price: "",
  sku: "",
  stockStatus: "unknown",
  imageUrl: "",
  videoUrl: "",
  description: "",
};

const statusMap = {
  draft: ["مسودة", "slate"],
  active: ["نشط", "green"],
  archived: ["مؤرشف", "amber"],
};

const stockOptions = [
  ["unknown", "غير محدد"],
  ["available", "متاح"],
  ["limited", "محدود"],
  ["out_of_stock", "نفد المخزون"],
];

function errorNotice(error) {
  if (error instanceof ProductCatalogApiError) {
    return `${error.message}${error.requestId ? ` (مرجع: ${error.requestId})` : ""}`;
  }
  return "تعذر إكمال العملية. حاول مجددًا.";
}

function draftFromProduct(product) {
  return {
    name: product.name || "",
    category: product.category || "",
    price: product.price ?? "",
    sku: product.sku || "",
    stockStatus: product.stockStatus || "unknown",
    imageUrl: product.imageUrl || "",
    videoUrl: product.videoUrl || "",
    description: product.description || "",
  };
}

export default function ProductCatalogPage() {
  const config = useMemo(() => getProductCatalogApiConfig(), []);
  const [mode, setMode] = useState(config.configured ? "backend" : "fallback");
  const [products, setProducts] = useState(() => (config.configured ? [] : readProductCatalog(initialProducts)));
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(config.configured);
  const [saving, setSaving] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [conflict, setConflict] = useState(null);
  const createIntent = useRef(null);

  const applyFirstPage = useCallback((response) => {
    const next = mergeBackendProducts([], response.products);
    setProducts(next);
    setHasMore(response.hasMore);
    setNextCursor(response.nextCursor);
    setPageCount(response.count);
    setSelectedId((current) => (next.some((product) => product.id === current) ? current : next[0]?.id ?? null));
  }, []);

  const loadFirstPage = useCallback(async () => {
    if (!config.configured) return;
    setLoading(true);
    setNotice("");
    try {
      applyFirstPage(await listProducts());
      setMode("backend");
    } catch (error) {
      setNotice(errorNotice(error));
    } finally {
      setLoading(false);
    }
  }, [applyFirstPage, config.configured]);

  useEffect(() => {
    const timer = window.setTimeout(loadFirstPage, 0);
    return () => window.clearTimeout(timer);
  }, [loadFirstPage]);

  const selectedProduct = products.find((product) => product.id === selectedId) || products[0] || null;
  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) => `${product.name} ${product.category} ${product.sku}`.toLowerCase().includes(needle));
  }, [products, query]);

  const stats = useMemo(() => ({
    loaded: products.length,
    draft: products.filter((product) => product.status === "draft").length,
    active: products.filter((product) => product.status === "active").length,
    archived: products.filter((product) => product.status === "archived").length,
  }), [products]);

  const resetDraft = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setConflict(null);
    createIntent.current = null;
  };

  const editProduct = (product) => {
    if (mode !== "backend" || product.status === "archived") return;
    setEditingId(product.id);
    setSelectedId(product.id);
    setDraft(draftFromProduct(product));
    setConflict(null);
    createIntent.current = null;
  };

  const saveProduct = async () => {
    if (!config.configured) {
      setNotice("وضع fallback التجريبي للعرض فقط. يتطلب الحفظ إعداد backend وworkspace.");
      return;
    }
    if (!draft.name.trim()) {
      setNotice("اسم المنتج مطلوب.");
      return;
    }

    setSaving(true);
    setNotice("");
    try {
      if (editingId) {
        const original = products.find((product) => product.id === editingId);
        if (!original) return;
        const body = updateProductRequestBody(draft, original);
        if (!Object.keys(body).length) {
          setNotice("لا توجد تغييرات مسموحة للحفظ.");
          return;
        }
        const saved = normalizeCatalogProduct(
          await updateProduct(original.productId, original.version, body),
          "backend"
        );
        setProducts((current) => current.map((product) => (product.id === saved.id ? saved : product)));
        setSelectedId(saved.id);
        setNotice("تم تحديث بيانات المنتج.");
        resetDraft();
        return;
      }

      const body = createProductRequestBody(draft);
      const fingerprint = JSON.stringify(body);
      if (!createIntent.current || createIntent.current.fingerprint !== fingerprint) {
        createIntent.current = { fingerprint, key: createIdempotencyKey() };
      }
      const saved = normalizeCatalogProduct(
        await createProduct(body, createIntent.current.key),
        "backend"
      );
      setProducts((current) => mergeBackendProducts([saved], current));
      setSelectedId(saved.id);
      setNotice("تمت إضافة المنتج.");
      resetDraft();
    } catch (error) {
      if (editingId && error instanceof ProductCatalogApiError && error.status === 409) {
        setConflict({ draft: { ...draft }, productId: editingId });
      }
      setNotice(errorNotice(error));
    } finally {
      setSaving(false);
    }
  };

  const refreshConflict = async () => {
    if (!conflict) return;
    setLoading(true);
    try {
      const refreshed = normalizeCatalogProduct(await getProduct(conflict.productId), "backend");
      setProducts((current) => current.map((product) => (product.id === refreshed.id ? refreshed : product)));
      setEditingId(refreshed.id);
      setSelectedId(refreshed.id);
      setDraft(conflict.draft);
      setConflict(null);
      setNotice("تم تحديث النسخة. راجع تعديلاتك ثم أعد الحفظ.");
    } catch (error) {
      setNotice(errorNotice(error));
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    try {
      const response = await listProducts({ cursor: nextCursor });
      setProducts((current) => mergeBackendProducts(current, response.products));
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
      setPageCount(response.count);
    } catch (error) {
      setNotice(errorNotice(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="product-catalog-page" dir="rtl">
      <style>{styles}</style>

      <section className="page-title">
        <div>
          <div className="eyebrow"><Package size={15} /> Product Catalog</div>
          <h1>كتالوج المنتجات</h1>
          <p>استهلاك محدود لمسارات المنتجات المقبولة مع الحفاظ على حدود الصلاحيات ومساحة العمل.</p>
          <div className={`mode ${mode}`}>
            {mode === "backend"
              ? "بيانات backend ضمن مساحة العمل المحددة"
              : "Fallback تجريبي منفصل: إعداد VITE_NASHIR_BACKEND_URL وVITE_NASHIR_WORKSPACE_ID مطلوب للتكامل"}
          </div>
        </div>
        <div className="title-actions">
          <button type="button" className="secondary-button" disabled title="Store runtime غير مصرح">
            سحب من رابط المتجر (غير متاح)
          </button>
          <button type="button" className="secondary-button" onClick={loadFirstPage} disabled={!config.configured || loading}>
            <RefreshCw size={16} /> تحديث
          </button>
          <button type="button" className="primary-button" onClick={saveProduct} disabled={saving || mode !== "backend"}>
            <Plus size={16} /> {editingId ? "حفظ التعديل" : "إضافة المنتج"}
          </button>
        </div>
      </section>

      {notice ? <div className="notice">{notice}</div> : null}
      {conflict ? (
        <div className="notice conflict">
          توجد نسخة أحدث. تم الاحتفاظ بمسودتك؛ حدّث المنتج وراجع التغييرات قبل إعادة الحفظ.
          <button type="button" onClick={refreshConflict}>تحديث للمراجعة</button>
        </div>
      ) : null}

      <section className="stats-grid">
        <Stat title="المنتجات المحملة فقط" value={stats.loaded} />
        <Stat title="مسودة ضمن المحمل" value={stats.draft} />
        <Stat title="نشط ضمن المحمل" value={stats.active} />
        <Stat title="مؤرشف ضمن المحمل" value={stats.archived} />
      </section>

      <section className="add-card">
        <Field label="اسم المنتج" value={draft.name} onChange={(name) => setDraft((prev) => ({ ...prev, name }))} />
        <Field label="التصنيف" value={draft.category} onChange={(category) => setDraft((prev) => ({ ...prev, category }))} />
        <Field label="السعر" value={draft.price} type="number" onChange={(value) => setDraft((prev) => ({ ...prev, price: value === "" ? "" : Number(value) }))} />
        <Field label="SKU" value={draft.sku} onChange={(sku) => setDraft((prev) => ({ ...prev, sku }))} />
        <label className="field"><span>حالة المخزون</span><select value={draft.stockStatus} onChange={(event) => setDraft((prev) => ({ ...prev, stockStatus: event.target.value }))}>{stockOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <Field label="رابط الصورة" value={draft.imageUrl} onChange={(imageUrl) => setDraft((prev) => ({ ...prev, imageUrl }))} />
        <Field label="رابط الفيديو" value={draft.videoUrl} onChange={(videoUrl) => setDraft((prev) => ({ ...prev, videoUrl }))} />
        <label className="field wide"><span>الوصف</span><textarea value={draft.description} onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))} /></label>
        {editingId ? <button type="button" className="secondary-button" onClick={resetDraft}>إلغاء التعديل</button> : null}
      </section>

      <section className="toolbar">
        <div className="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="بحث ضمن المنتجات المحملة فقط..." /></div>
        <span>{filteredProducts.length} من {products.length} محمل | آخر صفحة: {pageCount}</span>
      </section>

      <section className="layout">
        <article className="table-card">
          <div className="table">
            <div className="head"><span>المنتج</span><span>الحالة</span><span>التصنيف</span><span>المخزون</span><span>المصدر</span><span>إجراء</span></div>
            {filteredProducts.map((product) => (
              <button type="button" key={product.id} className={`row ${selectedId === product.id ? "selected" : ""}`} onClick={() => setSelectedId(product.id)}>
                <div className="product-main"><div className="thumb"><ImageIcon size={17} /></div><div><strong>{product.name}</strong><small>{product.price === "" ? "سعر غير متاح" : `${product.price} ر.س`}</small></div></div>
                <Status value={product.status} />
                <span>{product.category || "غير مصنف"}</span>
                <span>{stockOptions.find(([value]) => value === product.stockStatus)?.[1] || "غير محدد"}</span>
                <span className="source-pill">{product.dataSource === "backend" ? "Backend" : "Fallback mock"}</span>
                <div className="actions">
                  <span className={product.status === "archived" || mode !== "backend" ? "disabled" : ""} onClick={(event) => { event.stopPropagation(); editProduct(product); }}><Edit3 size={14} /> تعديل</span>
                  <span className="danger disabled" title="لا يوجد مسار حذف مصرح"><Trash2 size={14} /> حذف غير متاح</span>
                </div>
              </button>
            ))}
          </div>
          {hasMore ? <button type="button" className="load-more" onClick={loadMore} disabled={loading}>تحميل المزيد</button> : null}
        </article>

        <aside className="detail-card">
          {selectedProduct ? (
            <>
              <div className="detail-icon"><Package size={24} /></div>
              <h2>{selectedProduct.name}</h2>
              <Info label="المعرّف" value={selectedProduct.productId || "Fallback محلي"} />
              <Info label="الحالة" value={statusMap[selectedProduct.status]?.[0] || "غير محدد"} />
              <Info label="الإصدار" value={selectedProduct.version == null ? "غير متاح" : String(selectedProduct.version)} />
              <Info label="آخر تحديث" value={selectedProduct.updatedAt || "غير متاح"} />
              <Info label="الجاهزية" value="غير متاحة في هذا التكامل" />
              <Info label="الأصول" value="غير متاحة في هذا التكامل" />
              <Info label="المصدر/الخصائص/الادعاءات" value="UI-only أو غير متاحة؛ ليست بيانات backend محفوظة" />
            </>
          ) : <p>لا توجد منتجات محملة.</p>}
        </aside>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Stat({ title, value }) {
  return <article className="stat"><span>{title}</span><strong>{value}</strong></article>;
}

function Status({ value }) {
  const [label, tone] = statusMap[value] || ["غير محدد", "slate"];
  return <span className={`status ${tone}`}>{label}</span>;
}

function Info({ label, value }) {
  return <div className="info"><span>{label}</span><strong>{value}</strong></div>;
}

const styles = `
.product-catalog-page{min-height:calc(100vh - 80px);padding:24px;background:#f7f8f4;color:#1f241d;font-family:Inter,"Segoe UI",Tahoma,Arial,sans-serif}
.page-title,.stat,.add-card,.toolbar,.table-card,.detail-card,.notice{background:#fff;border:1px solid #e4e7df;border-radius:24px;box-shadow:0 8px 26px rgba(24,38,18,.035)}
.page-title{padding:20px;display:flex;justify-content:space-between;gap:16px;margin-bottom:16px}.eyebrow{width:fit-content;padding:8px 11px;border-radius:999px;display:flex;gap:7px;color:#176b2c;background:#eef7e9;font-size:12px;font-weight:900}.page-title h1{margin:10px 0 0;font-size:34px}.page-title p{color:#6f746b}.mode{display:inline-block;margin-top:10px;padding:7px 10px;border-radius:999px;font-size:11px;font-weight:900}.mode.backend{background:#eef7e9;color:#176b2c}.mode.fallback{background:#fff7ed;color:#9a3412}
.title-actions{display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap}.primary-button,.secondary-button,.load-more,.notice button{min-height:42px;border-radius:16px;padding:0 16px;font-family:inherit;font-weight:900;cursor:pointer}.primary-button{border:0;background:#176b2c;color:#fff}.secondary-button,.load-more,.notice button{border:1px solid #e4e7df;background:#fff;color:#1f241d}button:disabled{cursor:not-allowed;opacity:.55}
.notice{padding:14px;margin-bottom:16px;color:#475569}.notice.conflict{border-color:#f59e0b;background:#fffbeb}.notice button{margin-inline-start:12px;min-height:34px}
.stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:16px}.stat{padding:16px}.stat span{display:block;color:#6f746b;font-size:12px;font-weight:900}.stat strong{display:block;margin-top:8px;font-size:30px}
.add-card{padding:16px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}.field{display:grid;gap:7px}.field.wide{grid-column:1/-1}.field span{font-size:12px;font-weight:900}.field input,.field select,.field textarea{width:100%;box-sizing:border-box;border:1px solid #e4e7df;border-radius:14px;padding:0 12px;font-family:inherit}.field input,.field select{height:42px}.field textarea{min-height:90px;padding:12px}
.toolbar{padding:14px;margin-bottom:16px;display:flex;justify-content:space-between;gap:12px;align-items:center}.search{height:42px;border:1px solid #e4e7df;border-radius:999px;display:flex;align-items:center;gap:8px;padding:0 12px;flex:1;color:#94a3b8}.search input{border:0;outline:0;background:transparent;width:100%;font-family:inherit}
.layout{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:16px}.table-card,.detail-card{padding:18px}.table{border:1px solid #e4e7df;border-radius:18px;overflow:hidden}.head,.row{display:grid;grid-template-columns:minmax(190px,1.4fr) .7fr .7fr .7fr .7fr 1fr;gap:10px;align-items:center;padding:13px 14px}.head{background:#f7f8f4;color:#6f746b;font-size:12px;font-weight:900}.row{width:100%;border:0;border-top:1px solid #e4e7df;background:#fff;text-align:right;font-family:inherit;cursor:pointer}.row.selected{background:#fbfdf9}.product-main{display:flex;align-items:center;gap:11px}.thumb{width:42px;height:40px;border-radius:14px;background:#eef7e9;color:#176b2c;display:grid;place-items:center}.product-main strong,.product-main small{display:block}.product-main small{color:#6f746b}.status,.source-pill,.actions span{border-radius:999px;padding:6px 10px;font-size:11px;font-weight:900;width:fit-content}.status.green{background:#f0fdf4;color:#166534}.status.amber{background:#fffbeb;color:#92400e}.status.slate{background:#f8fafc;color:#475569}.source-pill,.actions span{border:1px solid #e4e7df}.actions{display:flex;gap:6px;flex-wrap:wrap}.actions span{display:flex;gap:4px;align-items:center}.actions .danger{color:#991b1b;background:#fef2f2}.actions .disabled{cursor:not-allowed;opacity:.55}.load-more{display:block;margin:16px auto 0}
.detail-icon{width:54px;height:54px;background:#176b2c;color:#fff;border-radius:18px;display:grid;place-items:center}.info{min-height:46px;border-bottom:1px solid #e4e7df;display:flex;justify-content:space-between;align-items:center;gap:12px}.info span{color:#6f746b;font-size:12px;font-weight:900}.info strong{font-size:12px;text-align:left;word-break:break-word}
@media(max-width:1050px){.layout{grid-template-columns:1fr}.stats-grid,.add-card{grid-template-columns:repeat(2,minmax(0,1fr))}.head,.row{grid-template-columns:1.4fr .7fr .7fr 1fr}.head span:nth-child(4),.head span:nth-child(5),.row>span:nth-child(4),.row>span:nth-child(5){display:none}}
@media(max-width:720px){.product-catalog-page{padding:14px}.page-title{display:grid}.stats-grid,.add-card{grid-template-columns:1fr}.field.wide{grid-column:auto}.table{overflow-x:auto}.head,.row{min-width:820px}}
`;
