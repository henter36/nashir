# Nashir Product Catalog End-to-End Acceptance Gate

| Field | Value |
|---|---|
| Gate ID | `NASHIR-PRODUCT-CATALOG-E2E-ACCEPTANCE-2026-06-22` |
| Gate type | local end-to-end validation gate — documentation only |
| Status date | 2026-06-22 |
| Predecessor gate ID | `NASHIR-PRODUCT-API-DB-VALIDATION-FINAL-2026-06-22` |
| Predecessor file | `docs/nashir_product_api_db_backed_validation_final_review_gate.md` |
| Implementation approved | NO |
| Validation execution approved | YES |
| Production/pilot/deployment readiness approved | NO |

---

## 1. Decision

- **GO:** this gate authorizes running the existing Product Catalog UI, Backend/API, and an isolated local PostgreSQL test/development database together, to collect end-to-end validation evidence.
- **NO-GO:** this gate does not accept the Product Catalog. Acceptance requires a separate evidence review performed after the validation run defined here.
- **NO-GO:** no Product Catalog end-to-end acceptance until all mandatory evidence in this document passes.
- **NO-GO:** no implementation fixes are made through this documentation gate. Any discovered defect requiring a code change must be handled by a separate implementation authorization or corrective PR.
- **NO-GO:** no production, pilot, deployment, or broader backend readiness is claimed or authorized.
- **NO-GO:** no new route families or new backend slices are authorized.
- **NO-GO:** no OpenAPI, generated client, migration, schema, Auth/RBAC, or unrelated UI expansion is authorized through this gate.

---

## 2. Scope under validation

Only the existing Product Catalog slice is in scope. No functionality is to be expanded.

**Frontend:**

- `src/pages/ProductCatalogPage.jsx`
- `src/utils/productCatalogApi.js` — Product Catalog API adapter and runtime configuration utilities used by the page.
- `src/utils/productCatalogStore.js` — Product Catalog normalization, merge, and local-store utilities used by the page.

**Backend:**

- `apps/api`
- Accepted `/workspaces/{workspaceId}/products` route family
- ProductRepository
- IdempotencyRepository
- AuditRepository
- Existing auth, workspace context, and permission guards

**Database:**

- Isolated local PostgreSQL database
- Existing accepted migration only

---

## 3. Preconditions

Validation must record evidence that:

- Current branch starts from updated `main`.
- Working tree is clean before validation.
- Node version satisfies the repository requirement.
- Dependencies install without unauthorized lockfile changes.
- PostgreSQL is running.
- A dedicated non-production database is used.
- `DATABASE_URL`, `TEST_DATABASE_URL`, and migration variables are explicitly controlled.
- The migration is applied successfully.
- Product tables exist.
- The local Product runtime is enabled only using `NASHIR_ENABLE_LOCAL_PRODUCT_RUNTIME=1`.
- `NODE_ENV` is not `production`.
- Backend runtime and UI runtime ports are recorded.
- No production credentials or secrets are used.

---

## 4. Required execution topology

The validation must exercise the full local flow:

```
Browser
  → Product Catalog UI
  → Product Catalog API adapter
  → real HTTP request
  → Fastify backend
  → auth/request context/workspace/permission boundary
  → Product route handler
  → PostgreSQL repository
  → audit/idempotency persistence
  → HTTP response
  → rendered UI state
```

Fastify injection tests alone are insufficient for this gate. The flow above must be exercised through a real browser-to-backend HTTP path.

---

## 5. Authentication boundary

The validation must record exactly how authentication is supplied. This gate must not assume that a real Auth0 tenant is available.

**A. Real Auth0 mode:**

- real locally authorized test token,
- expected issuer/audience recorded,
- no secrets recorded,
- token validity and workspace context confirmed.

**B. Existing approved local validation mode:**

- only if already supported by the current code and previously authorized,
- must not bypass production security silently,
- must be visibly local/dev-only,
- must not change production defaults.

If neither mode can support a browser-to-backend authenticated Product flow, the result is **NO-GO** and the blocker must be documented. This gate does not invent a new auth bypass.

---

## 6. Mandatory functional scenarios

### 6.1 Health and route registration

- `/health` returns 200.
- Canonical Product route exists.
- `/nashir-products` remains 404.
- Missing or invalid authentication does not produce route-not-found.

### 6.2 Initial list

- Product Catalog loads from the live backend.
- Empty database shows a valid empty state.
- No mock records are displayed as live backend records.
- Loading state is visible while the request is pending.

### 6.3 Create

- Create one product through the UI.
- Verify the HTTP request and response.
- Verify the row exists in PostgreSQL.
- Verify one `product.created` audit event.
- Verify the UI displays the created record without requiring mock data.

### 6.4 Idempotent create

- Repeat the create request using the same idempotency key.
- Confirm no duplicate product is created.
- Confirm replay behavior matches the accepted contract.
- Confirm audit events are not duplicated on replay.

### 6.5 List after create

- Reload the browser.
- Confirm the created product is retrieved from PostgreSQL.
- Confirm count, pagination metadata, and cursor behavior are contract-aligned.

### 6.6 Read

- Open/read a specific product through the supported UI, or direct canonical HTTP flow where the UI has no dedicated detail action.
- Confirm workspace-scoped retrieval.
- Confirm unknown Product ID returns the accepted non-disclosing response.

### 6.7 Update

- Update an accepted editable field through the UI.
- Confirm PostgreSQL state changes.
- Confirm one `product.updated` audit event.
- Confirm version/optimistic-concurrency behavior if exposed by the accepted implementation.
- Confirm a page reload preserves the update.

### 6.8 Null/clear-field behavior

- Validate one accepted nullable field clear operation if supported by the existing UI and contract.
- Do not add a new UI control solely for this gate.
- Record as "not exercised through UI" when the current UI cannot perform it, and determine whether direct HTTP evidence is sufficient or whether this remains a blocker.

### 6.9 Filters, sorting, and pagination

Validate only behavior currently exposed and accepted:

- required `limit`,
- cursor,
- status filter,
- `updatedAfter`,
- sort.

Do not invent additional query behavior.

---

## 7. Failure and recovery scenarios

Require evidence for:

- Backend unavailable when the page loads.
- Backend stops after a successful load.
- Database unavailable.
- Unauthorized request.
- Invalid/expired token.
- Permission denied.
- Workspace membership denied.
- Unknown workspace or resource.
- Malformed identifier.
- 500 or unexpected backend response.
- Network timeout or aborted request where supported.

For every scenario verify:

- no silent fallback to mock data,
- no false success message,
- no stale data presented as newly saved,
- user-visible error or recovery state,
- retry behavior where implemented,
- non-disclosing security response preserved.

---

## 8. Mock and fallback policy

This section is mandatory.

Require confirmation that:

- Explicit mock mode may continue to use mock data.
- Live/backend mode must not silently fall back to mock data.
- Backend failures remain visible as failures.
- Data from mock mode and backend mode is not merged in a way that creates false persistence.
- The UI visibly distinguishes any development/mock mode if such mode is selectable.
- Existing local storage does not override or duplicate the backend source of truth in live mode.

Any silent mock fallback in live/backend mode is an acceptance blocker.

---

## 9. Workspace isolation scenarios

Require at minimum:

- Product created under workspace A cannot be listed/read/updated from workspace B.
- A Product ID from workspace A does not disclose existence through workspace B.
- Audit events preserve the correct workspace/resource relationship.
- The local membership shim is identified as local/dev-only evidence and not treated as production membership proof.

If two-workspace browser execution is impossible with current local setup, direct HTTP evidence may supplement it, but the limitation must be recorded and production workspace acceptance remains NO-GO.

---

## 10. Persistence evidence

For each successful mutation capture:

- HTTP status,
- response envelope,
- workspace ID,
- product ID,
- idempotency key where applicable,
- database row,
- audit event,
- resulting UI state.

Do not record tokens, secrets, passwords, or full sensitive headers.

---

## 11. Contract evidence

Verify:

- Canonical `/workspaces/{workspaceId}/products` route family only, including `/workspaces/{workspaceId}/products/{productId}` where applicable.
- Request/response envelopes match the accepted OpenAPI contract.
- Product public version type is contract-aligned.
- `nextCursor` behavior is present and nullable as accepted.
- Error responses use the accepted flat ErrorModel.
- No undocumented alias routes are used.
- No generated client claim is made unless the UI actually uses an authorized generated client.

---

## 12. Evidence format

The validation report must contain:

- environment summary,
- exact commit SHA,
- exact commands,
- sanitized configuration,
- scenario matrix,
- PASS/FAIL/BLOCKED per scenario,
- HTTP evidence,
- database evidence,
- UI evidence or screenshots where useful,
- discovered defects,
- residual risks,
- final GO/NO-GO recommendation.

Screenshots must not contain tokens or secrets.

---

## 13. Acceptance blockers

Any of the following requires NO-GO:

- silent mock fallback in backend mode,
- UI reports success while persistence failed,
- duplicate product on idempotency replay,
- missing or duplicate audit event,
- cross-workspace disclosure or mutation,
- canonical route mismatch,
- contract envelope mismatch,
- inability to recover from backend failure without misleading state,
- Product data lost after reload,
- authentication bypass not previously authorized,
- use of production credentials/database,
- required scenario not executed without an explicit justified disposition.

---

## 14. Acceptance decision rules

**PASS:**

- All mandatory scenarios pass.
- No security, persistence, contract, or mock-fallback blocker remains.
- Any non-blocking UI issue is documented separately.

**BLOCKED:**

- Environment or missing existing capability prevents evidence collection.
- No implementation change is allowed through this gate.

**FAIL:**

- A mandatory scenario executes and violates accepted behavior.

**Overall GO:**

- only after a separate evidence review records all blockers closed.

**Overall NO-GO:**

- if any mandatory blocker remains.

---

## 15. What this gate does not prove

This gate does not prove:

- production Auth0 readiness,
- production membership and permission model readiness,
- production database readiness,
- load/performance readiness,
- backup/restore,
- high availability,
- production deployment,
- observability,
- incident response,
- rate limiting,
- real integrations,
- all other Nashir screens,
- new backend slices.

---

## 16. Explicit non-go decisions

This gate does not authorize:

- production readiness,
- pilot readiness,
- deployment readiness or deployment configuration changes,
- new backend slice implementation,
- additional route families,
- OpenAPI changes,
- generated client changes,
- schema or migration changes,
- Auth/RBAC expansion,
- frontend expansion beyond the existing Product Catalog UI adapter,
- CI, package, or lockfile changes,
- repository setting changes,
- any implementation fix discovered during validation execution — those require a separate corrective authorization.

---

## 17. Next step after this gate

After this gate is merged:

1. Execute the defined validation against the current code.
2. Create a documentation-only Product Catalog End-to-End Validation Review report.
3. If blockers are found, create a separate corrective implementation authorization.
4. Do not proceed to Store Setup or another backend slice until Product Catalog receives an explicit end-to-end acceptance decision.

---

## 18. Acceptance criteria for this documentation PR

- Validation scope is complete and unambiguous.
- No implementation is performed.
- Evidence requirements cover UI, HTTP, database, idempotency, audit, workspace, and failure states.
- Mock fallback is explicitly governed.
- Auth limitations are not concealed.
- Production and pilot readiness remain NO-GO.
- No new slice is authorized.
