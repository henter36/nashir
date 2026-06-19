# Nashir Product Catalog UI Adapter Backend Wiring Readiness / Authorization Gate

## Decision

Decision: GO to Product Catalog UI Adapter Backend Wiring Implementation.

This is an authorization gate only.

This gate authorizes a narrow frontend wiring PR for Product Catalog UI Adapter backend connectivity.

This gate does not authorize backend runtime changes, OpenAPI edits, generated client updates, new routes, database changes, auth model changes, or production deployment readiness.

## Inputs

Previously accepted facts:

- Product Catalog UI Adapter implementation exists.
- Product Catalog UI Adapter uses only the four accepted Product API routes:
  - `GET /workspaces/{workspaceId}/products`
  - `POST /workspaces/{workspaceId}/products`
  - `GET /workspaces/{workspaceId}/products/{productId}`
  - `PUT /workspaces/{workspaceId}/products/{productId}`
- Product Catalog UI Adapter does not authorize:
  - DELETE
  - archive
  - store-pull
  - status mutation
  - `/nashir-products`
  - Store/Campaign/Publishing/Analytics/Evidence/Readiness/Agents runtime routes
- Product API runtime is partial GO only for covered DB-backed Product API behavior after the Product API DB-backed coverage review.
- Existing remaining gaps include:
  - environment-provided backend base URL
  - environment-provided workspace ID
  - optional access token wiring
  - no approved full application session integration
  - no E2E/integration layer for this UI adapter yet

## Purpose

Authorize a narrow implementation PR that wires the already implemented Product Catalog UI Adapter to backend runtime configuration in a controlled way.

The implementation must preserve the accepted UI adapter boundaries and must not expand Product API scope.

## Authorized Implementation Scope

The next implementation PR may change only frontend-side wiring needed for Product Catalog backend connectivity.

Allowed scope:

- Product Catalog page wiring.
- Product Catalog adapter configuration.
- Frontend environment variable consumption for backend base URL.
- Frontend environment variable consumption for workspace ID.
- Frontend environment variable consumption for an optional access token, if an existing adapter path already supports it.
- Product Catalog-specific tests or lightweight validation if already supported by the current test stack.
- Documentation update for how to run the Product Catalog UI against the backend locally.

Allowed file areas, subject to actual repository paths:

- `src/pages/ProductCatalogPage.jsx`
- `src/utils/productCatalogApi.js`
- `src/utils/productCatalogStore.js`
- Product Catalog-specific tests if present or required
- Product Catalog-specific documentation under `docs/`
- frontend environment example documentation if already used by the repository

The implementation PR must list exact changed files in its PR description.

## Required Implementation Behavior

The implementation must preserve:

- existing route set only
- existing request allowlist
- existing non-disclosing error handling
- existing idempotency-key behavior for create
- existing If-Match/version behavior for update
- existing fallback/mock separation
- existing disabled behavior for unavailable backend configuration

The UI must not silently send backend requests when required backend configuration is missing.

## Blocked Scope

This gate does not authorize:

- backend runtime changes
- new backend routes
- route aliases
- `/nashir-products`
- OpenAPI edits
- generated client updates
- SQL/schema changes
- migration changes
- migration runner changes
- Auth/RBAC model changes
- workspace context model changes
- permission guard changes
- Product API contract changes
- Product Catalog delete wiring
- Product Catalog archive wiring
- Product Catalog store-pull wiring
- Product status mutation
- broad app-wide session integration
- production deployment readiness
- secrets policy changes
- unrelated UI page changes
- dashboard/product intelligence/campaign/publishing/analytics integration

## Required PR Evidence

The next implementation PR must include this checklist in its PR description:

```text
Changed files reviewed: YES
All changed files are inside the authorized Product Catalog wiring scope: YES/NO
Backend runtime files changed: YES/NO
OpenAPI or generated client files changed: YES/NO
Schema or migration files changed: YES/NO
Auth/RBAC/workspace/permission model changed: YES/NO
Routes added or changed: YES/NO
/nashir-products introduced: YES/NO
Delete/archive/store-pull/status mutation introduced: YES/NO
Fallback/mock separation preserved: YES/NO
Acceptance Criteria for the Next PR

The next implementation PR can be accepted only if:

Frontend CI passes.
Backend CI remains unaffected.
Product Catalog UI can be configured to use the existing Product API adapter.
Missing backend configuration keeps the UI in safe fallback/unconfigured mode.
No request is sent without required workspace/backend configuration.
Only the accepted four Product API routes are used.
No new backend behavior is required.
No OpenAPI, generated client, schema, migration, auth, workspace, or permission model files change.
Product API runtime acceptance remains partial and limited to covered DB-backed Product API behavior.
Next Step After Implementation

After the Product Catalog UI Adapter Backend Wiring Implementation PR is merged, open:

Product Catalog UI Adapter Backend Wiring Implementation Review Gate

That review gate must decide whether the Product Catalog UI backend wiring is accepted for local/pilot validation, or whether additional UI-side tests, environment documentation, or session/auth wiring gates are required.
