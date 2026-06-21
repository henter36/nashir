# Nashir Backend

This directory contains the governed Nashir Backend/API implementation inside the approved Nashir monorepo.

## Governance Status

This directory contains the Nashir backend runtime foundation. The canonical
`/workspaces/{workspaceId}/products` route family is the first governed
backend slice with an opt-in local Product runtime and DB-backed validation
evidence.

The opt-in local Product runtime is disabled by default. It is enabled only
when `NASHIR_ENABLE_LOCAL_PRODUCT_RUNTIME` is set to `1` or `true`, requires a
valid `DATABASE_URL`, and cannot be enabled when `NODE_ENV=production`.

This local capability does not authorize production readiness, pilot readiness,
deployment readiness, general backend completion, or expansion of the accepted
Product route family.

The selected stack is TypeScript, Node.js LTS, Fastify, pnpm, Zod,
PostgreSQL, and node-postgres / `pg`. When enabled, the opt-in local Product
runtime initializes a PostgreSQL connection pool and instantiates the Product,
idempotency, and audit repository classes against that pool.

It does not create database tables or schemas at application startup. Database
objects are created and updated only through the approved SQL migrations.

Database connectivity is not enabled globally or by default. Production
database readiness, production connection configuration, operational backup
and restore, deployment configuration, and production migration acceptance
remain outside the currently accepted scope.

The `/health` endpoint is an infrastructure smoke check only. It is not a
product, business, or workspace-scoped API route.

No changes to the accepted product routes, additional business route families,
SQL/migrations, auth/runtime behavior, generated clients, deployment
configuration, or CI workflows are authorized by the current Product Catalog
integration planning gate.

Generated clients remain blocked until a later explicit generated-client gate.

No production or pilot readiness is claimed.

`.env.example` contains placeholder variable names and values only. It contains
no real secrets, production URLs, or credentials. Auth0 values must be taken
from the real tenant, `NASHIR_AUTHORITY_REPO` is for local validation against
the authority checkout, and database URLs are needed only for DB-backed checks
or routes. `MIGRATION_DATABASE_URL` is optional and commented out by default to
avoid running test migrations against the development database.

## Contract Authority

The authoritative source for OpenAPI, Auth/RBAC, Workspace Identity, and SQL draft contracts remains:

- Repository: henter36/nashir
- Contract reference: cbf78f96eef3e8ccf73247bd536a9ed1d7c068a8

The OpenAPI authority location in henter36/nashir is:

- docs/nashir_v1_openapi.yaml

OpenAPI/Auth/RBAC/Workspace Identity alignment remains PENDING ALIGNMENT.

The OpenAPI contract must not be used as an active downstream synchronization authority for backend implementation, generated clients, route implementation, permission enforcement, migration/runtime work, or deployment decisions until a later explicit Auth/RBAC/OpenAPI alignment gate authorizes it.
