# Migration Draft Contract — nashir_v1_004_publishing_analytics_audit

**Status:** Draft only — not executable  
**Future filename candidate:** `YYYYMMDDHHMM__nashir_v1_004_publishing_analytics_audit.sql`  
**Path:** `docs/migration_contracts/` — documentation-only; no runner; not applied to any database  
**Sequence group:** 4 — Publishing/analytics/audit  
**Dependency:** Groups 1–3 must precede this group  
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

- `publishing_jobs`
- `publishing_statuses`
- `analytics_snapshots`
- `audit_events`

---

## Draft — UP

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

-- ============================================================
-- publishing_jobs
-- ============================================================
-- Workspace-owned. Campaign/content/channel operational queue.
-- Optimistic concurrency via resource version field.
-- Soft delete via cancelled_at.
-- OpenAPI: PublishingJob / PublishingJobStatus (OpenAPI-approved enum candidate).
--
-- UNIQUE (workspace_id, id): required for same-workspace composite FK
-- from publishing_statuses.
--
-- campaign_id, content_item_id, and channel_connection_id all use
-- same-workspace composite FKs to prevent cross-workspace linkage.

CREATE TABLE publishing_jobs (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id          UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    campaign_id           UUID NOT NULL,
    content_item_id       UUID NOT NULL,
    channel_connection_id UUID NOT NULL,
    scheduled_at          TIMESTAMPTZ,
    status                TEXT NOT NULL CHECK (status IN (
        'pending', 'in_progress', 'published', 'failed', 'cancelled'
    )),
    -- PublishingJobStatus: OpenAPI-approved enum candidate; values must match OpenAPI.
    version               INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency
    cancelled_at          TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Composite unique on (workspace_id, id): required for composite FK references
    -- from publishing_statuses.
    CONSTRAINT uq_publishing_jobs_workspace_id UNIQUE (workspace_id, id),
    -- Same-workspace composite FK for campaign_id.
    -- Requires campaigns UNIQUE (workspace_id, id).
    CONSTRAINT fk_publishing_jobs_campaign
        FOREIGN KEY (workspace_id, campaign_id)
        REFERENCES campaigns (workspace_id, id) ON DELETE RESTRICT,
    -- Same-workspace composite FK for content_item_id.
    -- Requires campaign_content_items UNIQUE (workspace_id, id).
    CONSTRAINT fk_publishing_jobs_content_item
        FOREIGN KEY (workspace_id, content_item_id)
        REFERENCES campaign_content_items (workspace_id, id) ON DELETE RESTRICT,
    -- Same-workspace composite FK for channel_connection_id.
    -- Requires channel_connections UNIQUE (workspace_id, id).
    CONSTRAINT fk_publishing_jobs_channel_connection
        FOREIGN KEY (workspace_id, channel_connection_id)
        REFERENCES channel_connections (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_publishing_jobs_workspace_id ON publishing_jobs (workspace_id);
CREATE INDEX idx_publishing_jobs_workspace_status ON publishing_jobs (workspace_id, status);
CREATE INDEX idx_publishing_jobs_campaign ON publishing_jobs (workspace_id, campaign_id);
CREATE INDEX idx_publishing_jobs_scheduled ON publishing_jobs (workspace_id, scheduled_at)
    WHERE scheduled_at IS NOT NULL;

-- ============================================================
-- publishing_statuses
-- ============================================================
-- Workspace-owned. Append-only trail for publishing job status changes.
-- No UPDATE or DELETE: status records are immutable trail entries.
-- publishing_statuses.status: SQL-only TEXT candidate (trail field).
--
-- publishing_job_id uses a same-workspace composite FK:
--   (workspace_id, publishing_job_id) REFERENCES publishing_jobs (workspace_id, id)

CREATE TABLE publishing_statuses (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id      UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    publishing_job_id UUID NOT NULL,
    status            TEXT NOT NULL,
    -- status is SQL-only trail field; not an OpenAPI-approved enum.
    message           TEXT,
    occurred_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- No updated_at: append-only trail records are not updated.
    -- Same-workspace composite FK for publishing_job_id.
    -- Requires publishing_jobs UNIQUE (workspace_id, id).
    CONSTRAINT fk_publishing_statuses_job
        FOREIGN KEY (workspace_id, publishing_job_id)
        REFERENCES publishing_jobs (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_publishing_statuses_workspace_id ON publishing_statuses (workspace_id);
CREATE INDEX idx_publishing_statuses_job ON publishing_statuses (workspace_id, publishing_job_id);
CREATE INDEX idx_publishing_statuses_occurred ON publishing_statuses (workspace_id, occurred_at);

-- ============================================================
-- analytics_snapshots
-- ============================================================
-- Workspace-owned. Source summary / data lineage required.
-- OpenAPI: AnalyticsSnapshot / AnalyticsSnapshotStatus (OpenAPI-approved enum candidate).
-- AnalyticsSnapshotStatus values: available, partial, stale, unavailable.

CREATE TABLE analytics_snapshots (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id   UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    status         TEXT NOT NULL CHECK (status IN (
        'available', 'partial', 'stale', 'unavailable'
    )),
    -- AnalyticsSnapshotStatus: OpenAPI-approved enum candidate; values must match OpenAPI.
    subject_type   TEXT NOT NULL, -- e.g., 'campaign', 'content_item', 'channel'
    subject_id     UUID NOT NULL,
    metrics        JSONB,         -- metric payload; no secrets; subject to review
    source_summary JSONB NOT NULL, -- required lineage field; never null
    snapshot_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
    -- No updated_at: snapshots are immutable once created.
);

CREATE INDEX idx_analytics_snapshots_workspace_id ON analytics_snapshots (workspace_id);
CREATE INDEX idx_analytics_snapshots_subject ON analytics_snapshots (workspace_id, subject_type, subject_id);
CREATE INDEX idx_analytics_snapshots_snapshot_at ON analytics_snapshots (workspace_id, snapshot_at);

-- ============================================================
-- audit_events
-- ============================================================
-- Workspace-owned. Append-only. No UPDATE or DELETE ever.
-- Database-level enforcement: triggers + privilege restriction (combined mechanism).
--
-- Trigger enforcement (to be added in executable migration after review):
--   A trigger will raise an exception on any UPDATE or DELETE attempt.
--
-- Privilege enforcement (to be applied in database setup):
--   REVOKE UPDATE, DELETE ON audit_events FROM <application_role>;
--   audit_events must be owned by a separate migration/deployment owner role,
--   not by the application role, for privilege restriction to be effective.
--
-- No secrets in audit payload. Safe metadata JSONB only.
--
-- actor_user_id: references global users table; simple FK is correct
--   (users is not workspace-owned).
-- actor_member_id: workspace_members is workspace-owned; same-workspace
--   composite FK is used: (workspace_id, actor_member_id) REFERENCES
--   workspace_members (workspace_id, id).
-- Requires workspace_members UNIQUE (workspace_id, id).
-- MATCH SIMPLE: if actor_member_id IS NULL, FK is not checked.

CREATE TABLE audit_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    actor_user_id   UUID REFERENCES users (id) ON DELETE RESTRICT,
    -- actor_user_id references global users table; simple FK is correct.
    actor_member_id UUID,
    -- actor_member_id uses same-workspace composite FK below.
    resource_type   TEXT NOT NULL,
    resource_id     UUID NOT NULL,
    action          TEXT NOT NULL,
    request_id      TEXT,          -- correlation ID candidate
    correlation_id  TEXT,          -- alternative correlation field
    metadata        JSONB,         -- safe metadata only; no secrets; no credentials
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- No updated_at, no archived_at: audit records are never modified or deleted.
    -- Same-workspace composite FK for actor_member_id.
    -- MATCH SIMPLE: if actor_member_id IS NULL, FK is not checked.
    CONSTRAINT fk_audit_events_actor_member
        FOREIGN KEY (workspace_id, actor_member_id)
        REFERENCES workspace_members (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_audit_events_workspace_id ON audit_events (workspace_id);
CREATE INDEX idx_audit_events_resource ON audit_events (workspace_id, resource_type, resource_id);
CREATE INDEX idx_audit_events_action ON audit_events (workspace_id, action);
CREATE INDEX idx_audit_events_occurred ON audit_events (workspace_id, occurred_at);
CREATE INDEX idx_audit_events_actor ON audit_events (workspace_id, actor_user_id);

-- NOTE: Trigger to enforce append-only on audit_events is documented here but
-- cannot be written as executable SQL in this draft-only gate.
-- Future executable migration must add:
--
--   CREATE OR REPLACE FUNCTION fn_audit_events_immutable()
--   RETURNS TRIGGER LANGUAGE plpgsql AS $$
--   BEGIN
--     RAISE EXCEPTION 'audit_events rows are immutable';
--   END;
--   $$;
--
--   CREATE TRIGGER trg_audit_events_no_update
--     BEFORE UPDATE ON audit_events
--     FOR EACH ROW EXECUTE FUNCTION fn_audit_events_immutable();
--
--   CREATE TRIGGER trg_audit_events_no_delete
--     BEFORE DELETE ON audit_events
--     FOR EACH ROW EXECUTE FUNCTION fn_audit_events_immutable();
```

---

## Draft — DOWN

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

DROP TABLE IF EXISTS audit_events;
DROP TABLE IF EXISTS analytics_snapshots;
DROP TABLE IF EXISTS publishing_statuses;
DROP TABLE IF EXISTS publishing_jobs;
```

---

## Rollback notes

Dropping `audit_events` and `analytics_snapshots` destroys immutable trail
and lineage data.

Down section is safe only in test environments with no operational data.

Down rollback in production must use a forward-only corrective migration unless
no operational data was applied.

---

## Constraints checklist

| Constraint | Status |
|---|---|
| `publishing_jobs` workspace scoping + version field | PLANNED |
| `publishing_jobs` `UNIQUE (workspace_id, id)` for composite FK references | PLANNED |
| `publishing_jobs` same-workspace composite FK for `campaign_id` | PLANNED |
| `publishing_jobs` same-workspace composite FK for `content_item_id` | PLANNED |
| `publishing_jobs` same-workspace composite FK for `channel_connection_id` | PLANNED |
| `publishing_statuses` append-only trail (no `updated_at`) | PLANNED |
| `publishing_statuses` same-workspace composite FK for `publishing_job_id` | PLANNED |
| `analytics_snapshots` `source_summary` required (NOT NULL) | PLANNED |
| `analytics_snapshots` no cross-workspace aggregation | PLANNED via workspace_id scope |
| `audit_events` append-only (no `updated_at`, no `archived_at`) | PLANNED |
| `audit_events` database-level trigger enforcement | DOCUMENTED — deferred to executable migration |
| `audit_events` privilege restriction (application role must be non-owner) | DOCUMENTED |
| `audit_events` global-user simple FK for `actor_user_id` | PLANNED — users is global |
| `audit_events` same-workspace composite FK for `actor_member_id` | PLANNED |
| No secrets in `audit_events.metadata` | PLANNED |
| No cross-workspace leakage | PLANNED via workspace_id on all tables |

---

## Open items for SQL Migration Draft Authoring Review Gate

- Confirm `PublishingJobStatus` enum values match current OpenAPI.
- Confirm `AnalyticsSnapshotStatus` enum values match current OpenAPI (available, partial, stale, unavailable).
- Confirm `publishing_statuses.status` values or defer.
- Confirm `analytics_snapshots.metrics` JSONB schema or leave as open JSONB.
- Confirm both actor fields on `audit_events` are nullable (either user or member may be set, or both).
- Confirm trigger pattern for audit_events immutability and name in executable migration.
- Confirm application role name for privilege restriction on audit_events.
- Confirm snapshot period fields: is `snapshot_at` sufficient or are `period_start` / `period_end` needed?
