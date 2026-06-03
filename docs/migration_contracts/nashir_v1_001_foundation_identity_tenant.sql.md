# Migration Draft Contract — nashir_v1_001_foundation_identity_tenant

**Status:** Draft only — not executable  
**Future filename candidate:** `YYYYMMDDHHMM__nashir_v1_001_foundation_identity_tenant.sql`  
**Path:** `docs/migration_contracts/` — documentation-only; no runner; not applied to any database  
**Sequence group:** 1 — Foundation identity/tenant  
**Dependency:** None; must be applied before all other groups  
**V1 required:** YES

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

- `workspaces`
- `users`
- `workspace_members`

---

## Draft — UP

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

-- ============================================================
-- workspaces
-- ============================================================
-- Root tenant boundary.
-- Global table; not workspace-scoped itself.
-- OpenAPI: Workspace / WorkspaceStatus

CREATE TABLE workspaces (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    status      TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'archived')),
    -- WorkspaceStatus: OpenAPI-approved enum candidate
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Soft archive: no hard delete for workspaces in V1.
-- Index for workspace status filtering.
CREATE INDEX idx_workspaces_status ON workspaces (status);

-- ============================================================
-- users
-- ============================================================
-- Global identity table; not workspace-scoped.
-- Auth/RBAC authority. Not exposed as a direct CRUD resource.
-- email uniqueness: LOWER(email) functional unique index (approved candidate).
-- users.status: SQL-only planning proposal; TEXT + CHECK candidate.

CREATE TABLE users (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email        TEXT NOT NULL,
    display_name TEXT,
    status       TEXT NOT NULL CHECK (status IN ('active', 'invited', 'suspended')),
    -- users.status is a SQL-only planning proposal; not an OpenAPI-approved enum.
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- LOWER(email) functional unique index — approved mechanism from follow-up gate.
-- Future backend lookup requirement:
--   preferred: app pre-lowercases email, then WHERE LOWER(email) = $1
--   acceptable: WHERE LOWER(email) = LOWER($1)
--   NOT recommended: WHERE email = $1 (may not use this index)
CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));

-- ============================================================
-- workspace_members
-- ============================================================
-- Authorization binding: user + workspace + role + status.
-- OpenAPI: WorkspaceMember / WorkspaceMemberStatus
-- WorkspaceMemberStatus values: active, invited, suspended (OpenAPI-approved).
--
-- UNIQUE (workspace_id, id): required for same-workspace composite FKs
-- from audit_events and idempotency_keys referencing workspace_members.

CREATE TABLE workspace_members (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    user_id      UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    role_code    TEXT NOT NULL,
    status       TEXT NOT NULL CHECK (status IN ('active', 'invited', 'suspended')),
    joined_at    TIMESTAMPTZ,
    archived_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- One membership per user per workspace.
    CONSTRAINT uq_workspace_members_workspace_user UNIQUE (workspace_id, user_id),
    -- Composite unique on (workspace_id, id): required for composite FK references
    -- from child tables that include workspace_id in the FK column set.
    CONSTRAINT uq_workspace_members_workspace_id UNIQUE (workspace_id, id)
);

CREATE INDEX idx_workspace_members_workspace_id ON workspace_members (workspace_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members (user_id);
CREATE INDEX idx_workspace_members_status ON workspace_members (workspace_id, status);
```

---

## Draft — DOWN

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

DROP TABLE IF EXISTS workspace_members;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS workspaces;
```

---

## Rollback notes

Dropping `workspaces` and `users` is destructive if any child tables have been
applied. The down section is valid only in an empty or test database where no
downstream tables were applied.

Down section rollback must be confirmed in the SQL Migration Draft Authoring
Review Gate.

---

## Constraints checklist

| Constraint | Status |
|---|---|
| `workspaces` soft archive only | PLANNED |
| `users.email` case-insensitive uniqueness via `LOWER(email)` functional index | PLANNED |
| `workspace_members` user/workspace uniqueness | PLANNED |
| `workspace_members` `UNIQUE (workspace_id, id)` for composite FK references | PLANNED |
| `workspace_members` restrict on delete | PLANNED |
| No hard delete for workspaces | PLANNED |
| No cross-workspace leakage (foundation; no merchant-owned rows yet) | N/A |
| No plaintext secrets | N/A — no credential columns |
| `users.status` SQL-only proposal; not OpenAPI-approved | DOCUMENTED |

---

## Open items for SQL Migration Draft Authoring Review Gate

- Confirm `users.status` TEXT + CHECK values are correct or defer.
- Confirm `workspaces.status` enum values match OpenAPI `WorkspaceStatus`.
- Confirm `gen_random_uuid()` is available on target PostgreSQL (requires `pgcrypto` or PostgreSQL ≥ 13).
- Confirm `workspace_members.role_code` representation (text code vs FK to roles table).
- Confirm no additional workspace columns are required (slug, locale, etc.).
