# Nashir Product Catalog UI Adapter Implementation Review Gate

| Field | Value |
|---|---|
| Gate type | UI adapter implementation review gate |
| Status | REVIEW |
| Repository | `henter36/nashir` |
| PR under review | `henter36/nashir` PR #189 |
| Authorization source | `henter36/nashir-backend` PR #141 |
| Gap-resolution source | `henter36/nashir` PR #140 |
| Backend runtime changes | NO |
| OpenAPI/generated changes | NO |
| SQL/migration changes | NO |
| Production readiness claimed | NO |

## Purpose

Review whether the Product Catalog UI adapter implementation delivered in PR #189
conforms to the scope authorized by backend PR #141 and the gap-resolution
decisions from PR #140. Determine whether to GO to the Acceptance Gate or NO-GO
with required corrections.

---

## 1. Changed Files Inventory

PR #189 landed five commits (`ad19efd` → `cb5b1ad`) across four files:

```text
src/pages/ProductCatalogPage.jsx
src/utils/productCatalogApi.js
src/utils/productCatalogStore.js
docs/nashir_product_catalog_ui_adapter_implementation_execution_gate.md
```

**Finding:** All changed files are within the authorized ProductCatalogPage
adapter scope. No backend source, OpenAPI, generated types, SQL, package,
lockfile, CI/CD, or alias files are touched. ✅

---

## 2. Adapter Route Usage Review

`productCatalogApi.js` declares exactly four exported async functions that reach
the backend:

| Function | Method | Path template |
|---|---|---|
| `listProducts` | GET | `/workspaces/{workspaceId}/products?limit=50&sort=updatedAt:desc[&cursor=…]` |
| `createProduct` | POST | `/workspaces/{workspaceId}/products` |
| `getProduct` | GET | `/workspaces/{workspaceId}/products/{productId}` |
| `updateProduct` | PUT | `/workspaces/{workspaceId}/products/{productId}` |

`workspaceId` and `productId` are both `encodeURIComponent`-encoded before
inclusion in the path.

**Finding:** Routes match the four accepted routes exactly. No DELETE, no status
mutation route, no archive route, no `/nashir-products` alias, no Store/Campaign/
Publishing/Analytics/Evidence/Readiness/Agents route is present. ✅

---

## 3. Request Allowlist Review

`CREATE_FIELDS` is the single field allowlist used for both create and update:

```js
["name", "category", "price", "sku", "stockStatus", "imageUrl", "videoUrl", "description"]
```

`allowlistedBody` applies three successive filters:
1. Only fields in `CREATE_FIELDS` that are present on the input.
2. Excludes empty-string and `undefined` values.
3. Excludes `imageUrl` / `videoUrl` values that start with `"إرفاق تجريبي:"` to
   prevent prototype placeholder URLs from reaching the backend.

`updateProductRequestBody` applies a further diff filter: only fields whose value
differs from the original are sent. An empty diff prevents the PUT from being
issued at all.

**Finding:** Allowlist is narrow, correctly enforced, and free of leakage to
fields outside the schema (e.g., `workspaceId`, `status`, `version`, `flags`,
`claims`, `readiness`, `assets`). ✅

---

## 4. ProductListResponse / ProductResponse Envelope Handling

`listProducts` extracts:
- `payload.products` — defaults to `[]` if not an array
- `payload.count` — coerced via `Number()`, defaults to `0`
- `payload.hasMore` — strict `=== true` check, defaults to `false`
- `payload.nextCursor` — string-typed check, defaults to `null`

`createProduct`, `getProduct`, and `updateProduct` each extract `payload.product`
and pass it through `normalizeCatalogProduct(…, "backend")` before use.

**Finding:** Envelope unwrapping is defensive and handles partial/missing backend
payloads without throwing or exposing raw backend data. ✅

---

## 5. productId / id Mapping Review

`normalizeCatalogProduct` resolves identity with consistent priority:

```js
const id = product.productId || product.id || createFallbackProductId();
// …
productId: product.productId || product.id || id,
```

Both `id` and `productId` use the same resolution chain, so they are always
identical or consistently aliased. `mergeBackendProducts` keys its Map on the
same chain:

```js
const merged = new Map(current.map((p) => [p.productId || p.id, p]));
normalizeBackendProducts(incoming).forEach((p) => {
  merged.set(p.productId || p.id, p);
});
```

**Finding:** Identity key is consistent across normalization and merge. Backend
products with only a `productId` field, only an `id` field, or both are handled
without silent mismatches or duplicate entries. ✅

---

## 6. draft / active / archived Status Handling Review

`statusMap` maps the three accepted statuses to display labels only:

```js
const statusMap = {
  draft: ["مسودة", "slate"],
  active: ["نشط", "green"],
  archived: ["مؤرشف", "amber"],
};
```

Status comes directly from the backend response, passed through
`normalizeCatalogProduct` as `product.status || "draft"`. No status mutation is
sent at any point. The edit button is disabled for archived products:

```jsx
disabled={product.status === "archived" || mode !== "backend"}
```

**Finding:** Status is display-only and correctly limited to draft/active/archived
rendering. No mutation, no additional status values, no status field in the update
allowlist. ✅

---

## 7. Pagination / Load-More Behavior Review

- `listProducts` always sends `limit=50` and `sort=updatedAt:desc`.
- First-page load is triggered by `useEffect` on mount via `loadFirstPage`.
- `applyFirstPage` replaces the product list with the first page and stores
  `hasMore` and `nextCursor`.
- `loadMore` is available only when `hasMore === true` and a non-null `nextCursor`
  exists. It appends via `mergeBackendProducts(current, response.products)`.
- Product list is never cleared during load-more; only new pages are merged.
- Concurrent load-more calls are blocked by the `loading` state guard.

**Finding:** Pagination follows the `ProductListResponse` contract exactly. No
client-side pagination that could diverge from the backend cursor. ✅

---

## 8. Idempotency-Key Lifecycle Review

`createIntent.current` holds `{ fingerprint, key }`:

- `fingerprint` is `JSON.stringify(body)` of the create request body.
- A new key is generated only when the fingerprint changes
  (`createIntent.current?.fingerprint !== fingerprint`).
- The same key is reused for retries on the same body, satisfying idempotency.
- `resetDraft()` and `editProduct()` both clear `createIntent.current = null`,
  ensuring a fresh key on the next distinct create intent.
- Keys prefer `crypto.randomUUID()` and fall back to a module-level monotonic
  counter (`_idSeq`) combined with `Date.now()`.

**Finding:** Idempotency-key lifecycle is correct: stable across retries of the
same body, invalidated on body change or intent reset, and free of `Math.random`
entropy dependency. ✅

---

## 9. If-Match / Version Concurrency Review

`updateProduct` validates the version before constructing the request:

```js
if (version === null || version === undefined || version === "") {
  throw new ProductCatalogApiError(400);
}
```

The `If-Match: String(version)` header is then sent unconditionally. The version
value comes from `original.version` which is set by `normalizeCatalogProduct` as
`product.version ?? null`. If the backend omits the field, `version` is `null`
and the guard throws before issuing any PUT — preventing `If-Match: "null"` from
reaching the backend.

**Finding:** Concurrency guard is complete. If-Match is required, validated, and
cannot be skipped or sent with a stringified null/undefined value. ✅

---

## 10. 409 Conflict Flow Review

When `updateProduct` returns a 409, the catch block in `saveProduct` branches:

```js
if (editingId && error instanceof ProductCatalogApiError && error?.status === 409) {
  setConflict({ draft: { ...draft }, productId: editingId });
}
setNotice(errorNotice(error));
```

The conflict notice presents a "تحديث للمراجعة" action. `refreshConflict`:
1. Calls `getProduct(conflict.productId)` to fetch the latest version.
2. Updates the product in the local list.
3. Restores the draft the user was editing.
4. Clears the conflict state.
5. Prompts the user to review and re-save.

The user must manually re-submit; no automatic retry or silent merge occurs.

**Finding:** 409 conflict resolution follows the safe review-then-resubmit
pattern. No silent overwrite or automatic field merge. ✅

---

## 11. Non-Disclosing Error Handling Review

`publicMessage(status)` maps HTTP status codes to Arabic user-facing strings:

| Status | Message |
|---|---|
| 401 | انتهت الجلسة أو يلزم تسجيل الدخول. |
| 403 | لا تملك الصلاحية المطلوبة. |
| 404 | المنتج غير متاح أو غير موجود. |
| 409 | تعارضت العملية مع نسخة أحدث. راجع البيانات وحاول مجددًا. |
| 400/422 | تعذر قبول بيانات المنتج. راجع الحقول وحاول مجددًا. |
| 0 / other | تعذر الاتصال بخدمة المنتجات. حاول مجددًا. |

`requestId` from the backend payload is surfaced only as an opaque reference
string when present; it does not expose internal path or request detail.
Network/timeout errors (`catch` on `fetch`) throw status 0, mapping to the
generic connectivity message.

**Finding:** No internal URL, path, stack trace, or backend detail is surfaced to
the UI. Error messages are user-facing, Arabic, and non-disclosing. ✅

---

## 12. Fallback / Mock Boundary Review

`config.configured = Boolean(baseUrl && workspaceId)`. When false:

- `listProducts` returns `null` (no throw, no mock data returned).
- `createProduct`, `getProduct`, and `updateProduct` throw
  `ProductCatalogApiError(0)` via `requireConfigured(config)`.
- The UI mode displays a prominent fallback indicator and disables save/edit.
- Fallback data lives in `localStorage` under `nashir_mock_product_catalog` with
  fallback IDs prefixed `p-` or literal `mock-`, structurally distinct from
  backend UUIDs.
- `deleteProduct` and `upsertProduct` exist in the store module for future local
  use but are not connected to any backend route or UI action.

**Finding:** Fallback and backend paths are cleanly separated. Unconfigured mode
cannot accidentally send malformed requests. ✅

---

## 13. Sonar / Gemini / CodeRabbit Findings Closure Review

All findings raised during PR #189 review are resolved across commits
`8f63a3f`, `0b14651`, and `cb5b1ad`:

| Finding | Resolution |
|---|---|
| `mergeBackendProducts` keyed on `productId` only | Fixed: key on `productId \|\| id` for both current and incoming |
| `productId: product.productId \|\| null` emits null when id is available | Fixed: `productId \|\| product.id \|\| id` |
| `Number(product.readiness) \|\| 35` truncates explicit 0 | Fixed: `normalizedReadiness()` helper preserves 0 |
| Fallback source `"Mock"` (English) | Fixed: `"تجريبي"` |
| `typeof globalThis.window === "undefined"` Sonar undefined comparison | Fixed: `globalThis.window === undefined` |
| `setTimeout(loadFirstPage, 0)` indirect scheduling | Fixed: direct `loadFirstPage()` in `useEffect` |
| `If-Match: "null"` or `"undefined"` possible on missing version | Fixed: version guard throws before PUT |
| `createProduct`/`getProduct`/`updateProduct` had no config guard | Fixed: `requireConfigured(config)` added |
| No request timeout | Fixed: `AbortController` with 30 s timeout in `request()` |
| `Math.random()` in idempotency key fallback | Fixed: module-level `_idSeq` monotonic counter |
| `Math.random()` in fallback product ID generation | Fixed: `createFallbackProductId()` with `_productSeq` counter |
| Regex `/\/+$/` security hotspot | Fixed: `trimTrailingSlashes()` deterministic helper |
| Nested ternary on `readiness` (Sonar S3358) | Fixed: extracted to `normalizedReadiness()` |
| `!createIntent.current \|\| createIntent.current.fingerprint` eligible for optional chaining | Fixed: `createIntent.current?.fingerprint` |
| Missing notice on early return when original product is absent | Fixed: `setNotice("المنتج المحدد غير متاح.")` added before return |

**Finding:** All 15 review findings are closed. Lint and build pass cleanly
against the final state. ✅

---

## 14. Remaining Gaps

The following gaps are known, accepted, and do not block acceptance:

- **Environment wiring.** Backend base URL and workspace ID must be externally
  provided at deploy time. This execution does not establish production workspace
  context.
- **Auth token.** An optional environment-provided access token is used. No
  approved application session integration exists yet.
- **UI-only fields.** `readiness`, `assets`, `source`, `flags`, `claims`,
  `description`, and `marketing priority` are either null for backend products or
  prototype-only and are not persisted through the backend.
- **Delete and store-pull.** Both remain disabled and unwired. A separate
  authorization gate is required to enable either.
- **No E2E/integration test layer.** Adapter correctness is verified at the
  build/lint level only; no automated integration test exists for this layer.

---

## 15. Decision

```text
GO:    ProductCatalogPage adapter implementation conforms to the authorized scope.
GO:    All accepted routes (GET list, POST create, GET item, PUT update) correctly implemented.
GO:    All review findings from PR #189 resolved without scope expansion.
GO:    Proceed to Product Catalog UI Adapter Implementation Acceptance Gate.

NO-GO: Production or pilot readiness.
NO-GO: Any backend runtime, contract, database, or CI/CD change.
NO-GO: Delete, archive, store-pull, or status mutation.
NO-GO: Store, Campaign, Publishing, Analytics, Evidence, Readiness, or Agents runtime.
NO-GO: Any broader scope expansion beyond the four accepted product routes.
```
