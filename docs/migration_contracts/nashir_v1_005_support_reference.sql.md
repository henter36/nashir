# Migration Draft Contract — nashir_v1_005_support_reference

**Status:** Draft only — not executable  
**Future filename candidate:** `YYYYMMDDHHMM__nashir_v1_005_support_reference.sql`  
**Path:** `docs/migration_contracts/` — documentation-only; no runner; not applied to any database  
**Sequence group:** 5 — Support/reference  
**Dependency:** Group 1 (foundation) must precede this group; groups 2–4 informative  
**V1 required:** `idempotency_keys` — V1 candidate; `roles`, `permissions`, `role_permissions` — reference candidates only; no seed files

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

- `idempotency_keys`
- `roles` (reference candidate only — no seed file)
- `permissions` (reference candidate only — no seed file)
- `role_permissions` (reference candidate only — no seed file)

---

## Draft — UP

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

-- ============================================================
-- idempotency_keys
-- ============================================================
-- Workspace-owned. Lifecycle POST support.
-- Key scope: workspace + operation family + actor/member + idempotency key.
-- Request hash for replay validation.
-- Response replay metadata if approved.
-- Expiry and retention required.
-- idempotency_keys.status: SQL-only TEXT + CHECK candidate.
-- 409 conflict alignment: stale version and in-progress idempotency conflicts.

CREATE TABLE idempotency_keys (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id      UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    operation_family  TEXT NOT NULL,   -- e.g., 'campaign.publish', 'content.submit_review'
    actor_user_id     UUID REFERENCES users (id) ON DELETE RESTRICT,
    actor_member_id   UUID REFERENCES workspace_members (id) ON DELETE RESTRICT,
    idempotency_key   TEXT NOT NULL,
    request_hash      TEXT,            -- hash of request body for replay validation
    response_status   INTEGER,         -- HTTP status for completed replay
    response_body     JSONB,           -- response payload for completed replay (no secrets)
    status            TEXT NOT NULL CHECK (status IN (
        'in_progress', 'completed', 'failed', 'expired'
    )),
    -- status is SQL-only; values subject to review.
    expires_at        TIMESTAMPTZ NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Unique idempotency scope: workspace + operation + actor + key.
    CONSTRAINT uq_idempotency_keys_scope UNIQUE (
        workspace_id, operation_family, idempotency_key
    )
    -- Note: actor_user_id / actor_member_id not in unique constraint here
    -- to allow key lookup without knowing which actor field is set;
    -- uniqueness enforced at operation+key level; actor validated in service layer.
    -- Confirm with review gate whether actor should be in the constraint.
);

CREATE INDEX idx_idempotency_keys_workspace_id ON idempotency_keys (workspace_id);
CREATE INDEX idx_idempotency_keys_scope ON idempotency_keys (workspace_id, operation_family, idempotency_key);
CREATE INDEX idx_idempotency_keys_expires ON idempotency_keys (expires_at);

-- ============================================================
-- roles (reference candidate only)
-- ============================================================
-- Global reference table. No workspace_id — roles are global.
-- No seed file in this gate. Seed data is unauthorized.
-- role_code is the stable identifier used in workspace_members.role_code.

CREATE TABLE roles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_code    TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- permissions (reference candidate only)
-- ============================================================
-- Global reference table. No workspace_id — permissions are global.
-- No seed file in this gate. Seed data is unauthorized.

CREATE TABLE permissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_code TEXT NOT NULL UNIQUE,
    display_name    TEXT NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- role_permissions (reference mapping candidate only)
-- ============================================================
-- Global reference mapping. No workspace_id.
-- No seed file in this gate. Seed data is unauthorized.

CREATE TABLE role_permissions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id       UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_role_permissions UNIQUE (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id);
```

---

## Draft — DOWN

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS idempotency_keys;
```

---

## Rollback notes

Dropping `idempotency_keys` removes in-flight replay protection.

Dropping `roles`, `permissions`, and `role_permissions` removes RBAC reference
data.

Down section is safe only in test environments with no operational data.

---

## Constraints checklist

| Constraint | Status |
|---|---|
| `idempotency_keys` unique scope (workspace + operation + key) | PLANNED |
| `idempotency_keys` expiry field | PLANNED |
| `idempotency_keys` actor reference fields (nullable; either user or member) | PLANNED |
| `roles` global scope (no workspace_id) | PLANNED |
| `permissions` global scope (no workspace_id) | PLANNED |
| `role_permissions` composite uniqueness | PLANNED |
| No seed files in this gate | CONFIRMED |
| No runtime RBAC implementation authorized | CONFIRMED |
| `idempotency_keys.response_body` JSONB — no secrets | DOCUMENTED |

---

## Open items for SQL Migration Draft Authoring Review Gate

- Confirm whether actor should be included in the `idempotency_keys` unique constraint or remain service-layer validated only.
- Confirm `idempotency_keys.status` values.
- Confirm `response_body` JSONB is safe (no credential values, no raw tokens).
- Confirm retention / cleanup strategy for expired idempotency keys.
- Confirm `roles` and `permissions` tables are needed in V1 migrations or remain deferred.
- Confirm `workspace_members.role_code` referential integrity strategy (text code vs FK to `roles.role_code`).
- Confirm `CASCADE` on `role_permissions` references is appropriate (role/permission delete cascades to mapping; typically safe for reference data).
