# Migration Draft Contract — nashir_v1_002_store_product_source

**Status:** Draft only — not executable  
**Future filename candidate:** `YYYYMMDDHHMM__nashir_v1_002_store_product_source.sql`  
**Path:** `docs/migration_contracts/` — documentation-only; no runner; not applied to any database  
**Sequence group:** 2 — Store/product/source  
**Dependency:** Group 1 (foundation identity/tenant) must precede this group  
**V1 required:** YES (provider implementation deferred)

---

## Draft boundary

This file is a documentation-only migration contract draft.

It is not executable SQL.

No migration runner exists in this repository.

No database connection exists in this repository.

This draft must be reviewed in the SQL Migration Draft Authoring Review Gate
before any executable migration artifact is created.

---

## Tables covered

- `store_profiles`
- `products`
- `data_sources`
- `channel_connections`
- `integration_credentials`

---

## Draft — UP

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

-- ============================================================
-- store_profiles
-- ============================================================
-- One store profile per workspace. workspace_id FK + unique constraint.
-- OpenAPI: StoreProfile
-- store_profiles.status: SQL-only TEXT + CHECK candidate.

CREATE TABLE store_profiles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    name         TEXT NOT NULL,
    description  TEXT,
    status       TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'archived')),
    -- status is a SQL-only planning proposal; values subject to review.
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_store_profiles_workspace UNIQUE (workspace_id)
);

-- ============================================================
-- products
-- ============================================================
-- Workspace-owned. Soft archive via archived_at.
-- OpenAPI: Product
-- products.status: SQL-only TEXT + CHECK candidate.

CREATE TABLE products (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    name         TEXT NOT NULL,
    description  TEXT,
    sku          TEXT,
    status       TEXT NOT NULL CHECK (status IN ('active', 'draft', 'archived')),
    -- status is a SQL-only planning proposal; values subject to review.
    archived_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_workspace_id ON products (workspace_id);
CREATE INDEX idx_products_workspace_status ON products (workspace_id, status);

-- ============================================================
-- data_sources
-- ============================================================
-- Workspace-owned. Provider/source metadata. No credential columns.
-- OpenAPI: DataSource
-- data_sources.status: SQL-only TEXT + CHECK candidate.
-- UNIQUE (workspace_id, id): required for composite FK from integration_credentials.

CREATE TABLE data_sources (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    source_type     TEXT NOT NULL,
    provider        TEXT,
    display_name    TEXT NOT NULL,
    connection_status TEXT NOT NULL CHECK (connection_status IN (
        'connected', 'disconnected', 'error', 'pending'
    )),
    -- connection_status is SQL-only; values subject to review.
    sync_status     TEXT,
    last_synced_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Composite unique required for same-workspace composite FK from integration_credentials.
    CONSTRAINT uq_data_sources_workspace_id UNIQUE (workspace_id, id)
);

CREATE INDEX idx_data_sources_workspace_id ON data_sources (workspace_id);

-- ============================================================
-- channel_connections
-- ============================================================
-- Workspace-owned. Provider/channel metadata. No credential columns.
-- OpenAPI: ChannelConnection
-- channel_connections.status: SQL-only TEXT + CHECK candidate.
-- UNIQUE (workspace_id, id): required for composite FK from integration_credentials.

CREATE TABLE channel_connections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    data_source_id  UUID REFERENCES data_sources (id) ON DELETE RESTRICT,
    -- data_source_id is an optional link; does not carry credentials.
    provider        TEXT NOT NULL,
    channel_type    TEXT NOT NULL,
    display_name    TEXT NOT NULL,
    connection_status TEXT NOT NULL CHECK (connection_status IN (
        'connected', 'disconnected', 'error', 'pending'
    )),
    -- connection_status is SQL-only; values subject to review.
    capability_metadata JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Composite unique required for same-workspace composite FK from integration_credentials.
    CONSTRAINT uq_channel_connections_workspace_id UNIQUE (workspace_id, id)
);

CREATE INDEX idx_channel_connections_workspace_id ON channel_connections (workspace_id);

-- ============================================================
-- integration_credentials
-- ============================================================
-- Workspace-owned. Credential boundary: no plaintext secrets.
-- XOR target model: exactly one of channel_connection_id or data_source_id is non-null.
-- Same-workspace composite FKs include workspace_id to prevent cross-workspace linkage.
-- credential_ref / vault_ref only; no raw API keys, tokens, or secrets.
-- Credential mutation audit requirement: create/revoke/rotate/remove events must be auditable.
-- Vault/encryption provider implementation deferred.
-- OpenAPI: IntegrationCredential (if exposed) or internal only.

CREATE TABLE integration_credentials (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id          UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    credential_type       TEXT NOT NULL,
    credential_ref        TEXT,          -- opaque vault reference; no plaintext secret
    vault_ref             TEXT,          -- alternative vault reference field
    channel_connection_id UUID,
    data_source_id        UUID,
    revoked_at            TIMESTAMPTZ,
    archived_at           TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- XOR constraint: exactly one target must be non-null.
    CONSTRAINT chk_credential_target_xor CHECK (
        (channel_connection_id IS NOT NULL AND data_source_id IS NULL)
        OR
        (channel_connection_id IS NULL AND data_source_id IS NOT NULL)
    ),

    -- Same-workspace composite FK for channel_connection_id.
    -- Requires channel_connections UNIQUE (workspace_id, id).
    CONSTRAINT fk_credentials_channel_connection FOREIGN KEY (workspace_id, channel_connection_id)
        REFERENCES channel_connections (workspace_id, id) ON DELETE RESTRICT,

    -- Same-workspace composite FK for data_source_id.
    -- Requires data_sources UNIQUE (workspace_id, id).
    CONSTRAINT fk_credentials_data_source FOREIGN KEY (workspace_id, data_source_id)
        REFERENCES data_sources (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_integration_credentials_workspace_id ON integration_credentials (workspace_id);
CREATE INDEX idx_integration_credentials_channel ON integration_credentials (workspace_id, channel_connection_id);
CREATE INDEX idx_integration_credentials_source ON integration_credentials (workspace_id, data_source_id);
```

---

## Draft — DOWN

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

DROP TABLE IF EXISTS integration_credentials;
DROP TABLE IF EXISTS channel_connections;
DROP TABLE IF EXISTS data_sources;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS store_profiles;
```

---

## Rollback notes

Dropping these tables is safe only in an environment where no downstream
campaign/content/asset tables have been applied.

Down section rollback in production requires careful sequencing and a
corrective migration strategy.

---

## Constraints checklist

| Constraint | Status |
|---|---|
| `store_profiles` workspace uniqueness | PLANNED |
| `products` workspace scoping | PLANNED |
| `data_sources` `UNIQUE (workspace_id, id)` for composite FK | PLANNED |
| `channel_connections` `UNIQUE (workspace_id, id)` for composite FK | PLANNED |
| `integration_credentials` XOR target constraint | PLANNED |
| `integration_credentials` same-workspace composite FKs | PLANNED |
| No plaintext credential columns | PLANNED |
| `credential_ref` / `vault_ref` only | PLANNED |
| No cross-workspace leakage via credential FKs | PLANNED |
| Credential mutation audit requirement | DOCUMENTED — audit events table in group 4 |

---

## Open items for SQL Migration Draft Authoring Review Gate

- Confirm `data_sources.connection_status` and `channel_connections.connection_status` values align with OpenAPI or remain SQL-only.
- Confirm `products.status` values.
- Confirm `store_profiles.status` values.
- Confirm whether `credential_ref` and `vault_ref` are both needed or one is sufficient.
- Confirm `channel_connections.data_source_id` FK behavior (nullable; RESTRICT is safe default).
- Confirm `gen_random_uuid()` extension availability.
- Confirm `capability_metadata` JSONB column is appropriate or needs a more structured form.
