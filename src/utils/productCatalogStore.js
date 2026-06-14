export const PRODUCT_CATALOG_KEY = "nashir_mock_product_catalog";

export function normalizeCatalogProduct(product = {}, source = "fallback") {
  const id = product.productId || product.id || `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const backendProduct = source === "backend";

  return {
    id,
    productId: product.productId || null,
    workspaceId: product.workspaceId || null,
    name: product.name || "",
    category: product.category || "غير مصنف",
    imageUrl: product.imageUrl || "",
    videoUrl: product.videoUrl || "",
    price: product.price ?? "",
    sku: product.sku || "",
    stockStatus: product.stockStatus || "unknown",
    currency: product.currency || "SAR",
    url: product.url || "",
    status: product.status || "draft",
    version: product.version ?? null,
    createdAt: product.createdAt || null,
    updatedAt: product.updatedAt || null,
    dataSource: backendProduct ? "backend" : "fallback",
    readiness: backendProduct ? null : Number(product.readiness) || 35,
    assets: backendProduct ? null : Number(product.assets) || 0,
    source: backendProduct ? "غير متاح في عقد المنتجات" : product.source || "Mock",
    flags: Array.isArray(product.flags) ? product.flags : [],
    claims: Array.isArray(product.claims)
      ? product.claims
      : ["يحتاج مراجعة وصف المنتج قبل استخدامه في حملة"],
    description: product.description || "منتج يحتاج استكمال التفاصيل قبل استخدامه في الحملات.",
  };
}

export function readProductCatalog(seed = []) {
  if (typeof window === "undefined") return seed.map((item) => normalizeCatalogProduct(item));

  try {
    const raw = window.localStorage.getItem(PRODUCT_CATALOG_KEY);

    if (!raw) {
      const normalizedSeed = seed.map((item) => normalizeCatalogProduct(item));
      writeProductCatalog(normalizedSeed);
      return normalizedSeed;
    }

    const parsed = JSON.parse(raw);
    const products = Array.isArray(parsed) ? parsed : parsed?.products;

    if (!Array.isArray(products) || !products.length) {
      const normalizedSeed = seed.map((item) => normalizeCatalogProduct(item));
      writeProductCatalog(normalizedSeed);
      return normalizedSeed;
    }

    return products.map((item) => normalizeCatalogProduct(item));
  } catch {
    return seed.map((item) => normalizeCatalogProduct(item));
  }
}

export function writeProductCatalog(products = []) {
  if (typeof window === "undefined") return products.map((item) => normalizeCatalogProduct(item));

  const normalized = products.map((item) => normalizeCatalogProduct(item));

  window.localStorage.setItem(
    PRODUCT_CATALOG_KEY,
    JSON.stringify({
      version: 1,
      source: "nashir_ui_prototype_product_catalog",
      updatedAt: new Date().toISOString(),
      products: normalized,
    })
  );

  window.dispatchEvent(new Event("nashir-product-catalog-updated"));

  return normalized;
}

export function upsertProduct(product, seed = []) {
  const current = readProductCatalog(seed);
  const normalized = normalizeCatalogProduct(product);
  const exists = current.some((item) => item.id === normalized.id);
  const next = exists
    ? current.map((item) => (item.id === normalized.id ? normalized : item))
    : [normalized, ...current];

  return writeProductCatalog(next);
}

export function deleteProduct(id, seed = []) {
  const current = readProductCatalog(seed);
  const next = current.filter((item) => item.id !== id);
  return writeProductCatalog(next.length ? next : seed.map((item) => normalizeCatalogProduct(item)));
}

export function normalizeBackendProducts(products = []) {
  return products.map((product) => normalizeCatalogProduct(product, "backend"));
}

export function mergeBackendProducts(current = [], incoming = []) {
  const merged = new Map(current.map((product) => [product.productId || product.id, product]));
  normalizeBackendProducts(incoming).forEach((product) => {
    merged.set(product.productId, product);
  });
  return [...merged.values()];
}
