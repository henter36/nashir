# Nashir Product Catalog UI — Local Backend Wiring Setup

## Purpose

Practical steps to run the Product Catalog UI against a local instance of the
Nashir backend (`apps/api`). This documents an existing capability; it does
not introduce any new backend or frontend behavior.

This is documentation only. It does not change `src/pages/ProductCatalogPage.jsx`,
`src/utils/productCatalogApi.js`, or `src/utils/productCatalogStore.js`.

## Backend wiring status

The Product Catalog UI Adapter (`src/utils/productCatalogApi.js`) already
reads:

- `VITE_NASHIR_BACKEND_URL`
- `VITE_NASHIR_WORKSPACE_ID`
- `VITE_NASHIR_ACCESS_TOKEN` (optional)

and already calls only the four accepted Product API routes:

- `GET /workspaces/{workspaceId}/products`
- `POST /workspaces/{workspaceId}/products`
- `GET /workspaces/{workspaceId}/products/{productId}`
- `PUT /workspaces/{workspaceId}/products/{productId}`

If `VITE_NASHIR_BACKEND_URL` or `VITE_NASHIR_WORKSPACE_ID` is missing, the UI
stays in fallback/mock mode and never sends a backend request.

## Run the backend locally

```bash
cd apps/api
cp .env.example .env
# Edit .env: set DATABASE_URL to a local PostgreSQL instance.
pnpm install --frozen-lockfile
pnpm run db:migrate
pnpm run dev
```

The backend listens on `HOST`/`PORT` from `.env` (defaults to
`127.0.0.1:5000`).

## Run the Product Catalog UI against it

Create `.env.local` in the repository root (this file is already
git-ignored):

```bash
VITE_NASHIR_BACKEND_URL=http://127.0.0.1:5000
VITE_NASHIR_WORKSPACE_ID=<your-local-workspace-id>
# Optional, only if the backend session requires it locally:
# VITE_NASHIR_ACCESS_TOKEN=<token>
```

Then:

```bash
npm run dev
```

Open the Product Catalog page. The mode badge shows **Backend** when
configuration is present and reachable, or **Fallback mock** otherwise.

## Notes

- Delete, archive, store-pull, and status mutation remain disabled and
  unwired in the UI adapter; this setup does not enable them.
- Without `VITE_NASHIR_BACKEND_URL` or `VITE_NASHIR_WORKSPACE_ID`, the UI
  never sends a backend request and stays on local mock data.
