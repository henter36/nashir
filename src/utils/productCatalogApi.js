const PRODUCT_LIMIT = 50;
const CREATE_FIELDS = [
  "name",
  "category",
  "price",
  "sku",
  "stockStatus",
  "imageUrl",
  "videoUrl",
  "description",
];

function configuredValue(name) {
  const value = import.meta.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function apiConfig() {
  const baseUrl = configuredValue("VITE_NASHIR_BACKEND_URL").replace(/\/+$/, "");
  const workspaceId = configuredValue("VITE_NASHIR_WORKSPACE_ID");
  const accessToken = configuredValue("VITE_NASHIR_ACCESS_TOKEN");

  return {
    accessToken,
    baseUrl,
    configured: Boolean(baseUrl && workspaceId),
    workspaceId,
  };
}

function productPath(config, productId = "") {
  const workspace = encodeURIComponent(config.workspaceId);
  const suffix = productId ? `/${encodeURIComponent(productId)}` : "";
  return `${config.baseUrl}/workspaces/${workspace}/products${suffix}`;
}

function publicMessage(status) {
  if (status === 401) return "انتهت الجلسة أو يلزم تسجيل الدخول.";
  if (status === 403) return "لا تملك الصلاحية المطلوبة.";
  if (status === 404) return "المنتج غير متاح أو غير موجود.";
  if (status === 409) return "تعارضت العملية مع نسخة أحدث. راجع البيانات وحاول مجددًا.";
  if (status === 400 || status === 422) return "تعذر قبول بيانات المنتج. راجع الحقول وحاول مجددًا.";
  return "تعذر الاتصال بخدمة المنتجات. حاول مجددًا.";
}

export class ProductCatalogApiError extends Error {
  constructor(status, requestId = "") {
    super(publicMessage(status));
    this.name = "ProductCatalogApiError";
    this.status = status;
    this.requestId = requestId;
  }
}

async function request(config, path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (config.accessToken) headers.Authorization = `Bearer ${config.accessToken}`;

  let response;
  try {
    response = await fetch(path, { ...options, headers });
  } catch {
    throw new ProductCatalogApiError(0);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ProductCatalogApiError(response.status, payload?.requestId);
  }
  return payload;
}

function allowlistedBody(input, fields = CREATE_FIELDS) {
  return Object.fromEntries(
    fields
      .filter((field) => Object.hasOwn(input, field))
      .filter((field) => input[field] !== "" && input[field] !== undefined)
      .filter((field) => !["imageUrl", "videoUrl"].includes(field) || !String(input[field]).startsWith("إرفاق تجريبي:"))
      .map((field) => [field, input[field]])
  );
}

export function getProductCatalogApiConfig() {
  return apiConfig();
}

export function createProductRequestBody(input) {
  return allowlistedBody(input);
}

export function updateProductRequestBody(input, original) {
  const next = allowlistedBody(input);
  return Object.fromEntries(
    Object.entries(next).filter(([field, value]) => value !== original[field])
  );
}

export function createIdempotencyKey() {
  return globalThis.crypto?.randomUUID?.() ?? `product-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function listProducts({ cursor = null } = {}) {
  const config = apiConfig();
  if (!config.configured) return null;

  const query = new URLSearchParams({
    limit: String(PRODUCT_LIMIT),
    sort: "updatedAt:desc",
  });
  if (cursor) query.set("cursor", cursor);

  const payload = await request(config, `${productPath(config)}?${query}`);
  return {
    products: Array.isArray(payload.products) ? payload.products : [],
    count: Number(payload.count) || 0,
    hasMore: payload.hasMore === true,
    nextCursor: typeof payload.nextCursor === "string" ? payload.nextCursor : null,
  };
}

export async function createProduct(body, idempotencyKey) {
  const config = apiConfig();
  const payload = await request(config, productPath(config), {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(body),
  });
  return payload.product;
}

export async function getProduct(productId) {
  const config = apiConfig();
  const payload = await request(config, productPath(config, productId));
  return payload.product;
}

export async function updateProduct(productId, version, body) {
  const config = apiConfig();
  const payload = await request(config, productPath(config, productId), {
    method: "PUT",
    headers: { "If-Match": String(version) },
    body: JSON.stringify(body),
  });
  return payload.product;
}
