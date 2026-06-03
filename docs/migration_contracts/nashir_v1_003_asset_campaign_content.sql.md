# Migration Draft Contract — nashir_v1_003_asset_campaign_content

**Status:** Draft only — not executable  
**Future filename candidate:** `YYYYMMDDHHMM__nashir_v1_003_asset_campaign_content.sql`  
**Path:** `docs/migration_contracts/` — documentation-only; no runner; not applied to any database  
**Sequence group:** 3 — Asset/campaign/content  
**Dependency:** Group 1 (foundation) and Group 2 (store/product/source) must precede this group  
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

- `assets`
- `campaigns`
- `campaign_briefs`
- `campaign_content_items`
- `content_drafts`
- `content_approvals`

---

## Draft — UP

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

-- ============================================================
-- assets
-- ============================================================
-- Workspace-owned. Optional link to product within same workspace.
-- Soft archive via archived_at.
-- OpenAPI: Asset
-- assets.status: SQL-only TEXT + CHECK candidate.
--
-- assets.product_id uses a same-workspace composite FK:
--   (workspace_id, product_id) REFERENCES products (workspace_id, id)
-- MATCH SIMPLE (default): if product_id IS NULL, FK is not checked.
-- Requires products UNIQUE (workspace_id, id).

CREATE TABLE assets (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    product_id   UUID,
    -- Optional link to product; same-workspace composite FK below.
    title        TEXT NOT NULL,
    asset_type   TEXT NOT NULL,
    source       TEXT,
    storage_ref  TEXT NOT NULL, -- opaque storage reference; no raw file data
    status       TEXT NOT NULL CHECK (status IN ('active', 'archived')),
    -- status is SQL-only; values subject to review.
    archived_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Same-workspace composite FK for optional product_id.
    CONSTRAINT fk_assets_product
        FOREIGN KEY (workspace_id, product_id)
        REFERENCES products (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_assets_workspace_id ON assets (workspace_id);
CREATE INDEX idx_assets_workspace_status ON assets (workspace_id, status);

-- ============================================================
-- campaigns
-- ============================================================
-- Workspace-owned. Optional primary product FK within same workspace.
-- Optimistic concurrency via resource version field.
-- Soft archive via archived_at.
-- OpenAPI: Campaign / CampaignStatus (OpenAPI-approved enum candidate).
--
-- UNIQUE (workspace_id, id): required for same-workspace composite FKs
-- from campaign_briefs, campaign_content_items, and publishing_jobs.
--
-- primary_product_id uses a same-workspace composite FK:
--   (workspace_id, primary_product_id) REFERENCES products (workspace_id, id)
-- MATCH SIMPLE: if primary_product_id IS NULL, FK is not checked.

CREATE TABLE campaigns (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id       UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    primary_product_id UUID,
    -- Optional link to product; same-workspace composite FK below.
    name               TEXT NOT NULL,
    objective          TEXT,
    status             TEXT NOT NULL CHECK (status IN (
        'draft', 'active', 'paused', 'completed', 'archived'
    )),
    -- CampaignStatus: OpenAPI-approved enum candidate; values must match OpenAPI.
    version            INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency
    archived_at        TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Composite unique on (workspace_id, id): required for composite FK references
    -- from campaign_briefs, campaign_content_items, and publishing_jobs.
    CONSTRAINT uq_campaigns_workspace_id UNIQUE (workspace_id, id),
    -- Same-workspace composite FK for optional primary_product_id.
    CONSTRAINT fk_campaigns_primary_product
        FOREIGN KEY (workspace_id, primary_product_id)
        REFERENCES products (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_campaigns_workspace_id ON campaigns (workspace_id);
CREATE INDEX idx_campaigns_workspace_status ON campaigns (workspace_id, status);

-- ============================================================
-- campaign_briefs
-- ============================================================
-- Workspace-owned. One brief per campaign.
-- OpenAPI: CampaignBrief
--
-- campaign_id uses a same-workspace composite FK:
--   (workspace_id, campaign_id) REFERENCES campaigns (workspace_id, id)

CREATE TABLE campaign_briefs (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    campaign_id  UUID NOT NULL,
    objective    TEXT,
    audience     TEXT,
    channel      TEXT,
    tone         TEXT,
    constraints  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_campaign_briefs_campaign UNIQUE (campaign_id),
    -- Same-workspace composite FK for campaign_id.
    CONSTRAINT fk_campaign_briefs_campaign
        FOREIGN KEY (workspace_id, campaign_id)
        REFERENCES campaigns (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_campaign_briefs_workspace_id ON campaign_briefs (workspace_id);

-- ============================================================
-- campaign_content_items
-- ============================================================
-- Workspace-owned. Canonical table name: campaign_content_items.
-- Optional current_draft_id FK (deferred; set after content_drafts is created).
-- Soft archive via archived_at.
-- OpenAPI: CampaignContentItem / CampaignContentItemStatus (OpenAPI-approved enum candidate).
--
-- UNIQUE (workspace_id, id): required for same-workspace composite FKs
-- from content_drafts and publishing_jobs.
--
-- campaign_id uses a same-workspace composite FK:
--   (workspace_id, campaign_id) REFERENCES campaigns (workspace_id, id)

CREATE TABLE campaign_content_items (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id     UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    campaign_id      UUID NOT NULL,
    current_draft_id UUID,
    -- Deferred FK; same-workspace composite FK added via ALTER TABLE below,
    -- after content_drafts is created. MATCH SIMPLE: NULL when no draft yet.
    content_type     TEXT NOT NULL,
    channel          TEXT NOT NULL,
    status           TEXT NOT NULL CHECK (status IN (
        'draft', 'in_review', 'approved', 'rejected', 'published', 'archived'
    )),
    -- CampaignContentItemStatus: OpenAPI-approved enum candidate; values must match OpenAPI.
    version          INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency
    archived_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Composite unique on (workspace_id, id): required for composite FK references
    -- from content_drafts and publishing_jobs.
    CONSTRAINT uq_campaign_content_items_workspace_id UNIQUE (workspace_id, id),
    -- Same-workspace composite FK for campaign_id.
    CONSTRAINT fk_campaign_content_items_campaign
        FOREIGN KEY (workspace_id, campaign_id)
        REFERENCES campaigns (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_campaign_content_items_workspace_id ON campaign_content_items (workspace_id);
CREATE INDEX idx_campaign_content_items_campaign ON campaign_content_items (workspace_id, campaign_id);
CREATE INDEX idx_campaign_content_items_status ON campaign_content_items (workspace_id, status);

-- ============================================================
-- content_drafts
-- ============================================================
-- Workspace-owned. Content item FK (same-workspace composite).
-- Creator user FK: users is global; simple FK to users (id) is correct.
-- Soft archive via archived_at.
-- Immutable once approved: content_approvals reference draft as decision record.
-- OpenAPI: ContentDraft / ContentDraftStatus (OpenAPI-approved enum candidate).
--
-- UNIQUE (workspace_id, id): required for same-workspace composite FK
-- from content_approvals and from the deferred current_draft_id FK.
--
-- content_item_id uses a same-workspace composite FK:
--   (workspace_id, content_item_id) REFERENCES campaign_content_items (workspace_id, id)

CREATE TABLE content_drafts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    content_item_id UUID NOT NULL,
    creator_user_id UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    -- creator_user_id references global users table; simple FK is correct.
    body            TEXT NOT NULL,
    language        TEXT NOT NULL DEFAULT 'en',
    draft_version   INTEGER NOT NULL DEFAULT 1,
    status          TEXT NOT NULL CHECK (status IN (
        'draft', 'submitted', 'approved', 'rejected', 'withdrawn'
    )),
    -- ContentDraftStatus: OpenAPI-approved enum candidate; values must match OpenAPI.
    version         INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency
    archived_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Composite unique on (workspace_id, id): required for composite FK references
    -- from content_approvals and from the deferred current_draft_id FK.
    CONSTRAINT uq_content_drafts_workspace_id UNIQUE (workspace_id, id),
    -- Same-workspace composite FK for content_item_id.
    CONSTRAINT fk_content_drafts_content_item
        FOREIGN KEY (workspace_id, content_item_id)
        REFERENCES campaign_content_items (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_content_drafts_workspace_id ON content_drafts (workspace_id);
CREATE INDEX idx_content_drafts_content_item ON content_drafts (workspace_id, content_item_id);
CREATE INDEX idx_content_drafts_creator ON content_drafts (workspace_id, creator_user_id);
CREATE INDEX idx_content_drafts_status ON content_drafts (workspace_id, status);

-- Add deferred same-workspace composite FK from campaign_content_items to content_drafts.
-- Circular FK strategy: campaign_content_items references content_drafts and vice versa.
-- The deferred FK is added after both tables exist to break the creation dependency.
-- MATCH SIMPLE: if current_draft_id IS NULL, FK is not checked.
-- ON DELETE SET NULL: when a draft is deleted, current_draft_id reverts to NULL.
-- Requires content_drafts UNIQUE (workspace_id, id).
ALTER TABLE campaign_content_items
    ADD CONSTRAINT fk_current_draft
    FOREIGN KEY (workspace_id, current_draft_id)
    REFERENCES content_drafts (workspace_id, id) ON DELETE SET NULL;

-- ============================================================
-- content_approvals
-- ============================================================
-- Workspace-owned. Immutable decision records — append-only.
-- Reviewer user FK: users is global; simple FK to users (id) is correct.
-- OpenAPI: ContentApproval / ContentApprovalDecision (OpenAPI-approved enum candidate).
-- Server-derived decision: derived from endpoint path, not arbitrary client body.
--
-- content_draft_id uses a same-workspace composite FK:
--   (workspace_id, content_draft_id) REFERENCES content_drafts (workspace_id, id)

CREATE TABLE content_approvals (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id     UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    content_draft_id UUID NOT NULL,
    reviewer_user_id UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    -- reviewer_user_id references global users table; simple FK is correct.
    decision         TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
    -- ContentApprovalDecision: OpenAPI-approved enum candidate; server-owned.
    note             TEXT,
    rejection_reason TEXT,
    required_changes TEXT,
    decided_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- No updated_at: approval records are immutable.
    -- No archived_at: approval records are not hard-deleted in V1 planning.
    -- Same-workspace composite FK for content_draft_id.
    CONSTRAINT fk_content_approvals_draft
        FOREIGN KEY (workspace_id, content_draft_id)
        REFERENCES content_drafts (workspace_id, id) ON DELETE RESTRICT
);

CREATE INDEX idx_content_approvals_workspace_id ON content_approvals (workspace_id);
CREATE INDEX idx_content_approvals_draft ON content_approvals (workspace_id, content_draft_id);
CREATE INDEX idx_content_approvals_reviewer ON content_approvals (workspace_id, reviewer_user_id);
```

---

## Draft — DOWN

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

-- Remove deferred composite FK before dropping campaign_content_items.
ALTER TABLE campaign_content_items DROP CONSTRAINT IF EXISTS fk_current_draft;

DROP TABLE IF EXISTS content_approvals;
DROP TABLE IF EXISTS content_drafts;
DROP TABLE IF EXISTS campaign_content_items;
DROP TABLE IF EXISTS campaign_briefs;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS assets;
```

---

## Rollback notes

Removing the circular composite FK (`fk_current_draft`) before dropping
`campaign_content_items` is required because `content_drafts` references
`campaign_content_items` and vice versa.

Down section rollback is safe only if no publishing or analytics data
references these tables.

---

## Constraints checklist

| Constraint | Status |
|---|---|
| `assets` workspace scoping | PLANNED |
| `assets` same-workspace composite FK for optional `product_id` | PLANNED |
| `campaigns` workspace scoping + version field | PLANNED |
| `campaigns` `UNIQUE (workspace_id, id)` for composite FK references | PLANNED |
| `campaigns` same-workspace composite FK for optional `primary_product_id` | PLANNED |
| `campaign_briefs` campaign uniqueness | PLANNED |
| `campaign_briefs` same-workspace composite FK for `campaign_id` | PLANNED |
| `campaign_content_items` workspace + campaign scoping + version field | PLANNED |
| `campaign_content_items` `UNIQUE (workspace_id, id)` for composite FK references | PLANNED |
| `campaign_content_items` same-workspace composite FK for `campaign_id` | PLANNED |
| `content_drafts` workspace + content item scoping + version field | PLANNED |
| `content_drafts` `UNIQUE (workspace_id, id)` for composite FK references | PLANNED |
| `content_drafts` same-workspace composite FK for `content_item_id` | PLANNED |
| `content_drafts` global-user simple FK for `creator_user_id` | PLANNED — users is global |
| `content_approvals` immutable (no `updated_at`) | PLANNED |
| `content_approvals` same-workspace composite FK for `content_draft_id` | PLANNED |
| `content_approvals` global-user simple FK for `reviewer_user_id` | PLANNED — users is global |
| Deferred circular FK `fk_current_draft` as same-workspace composite FK | PLANNED |
| Self-approval prevention references (creator/reviewer) | PLANNED via creator_user_id + reviewer_user_id |
| No cross-workspace leakage | PLANNED via workspace_id on all tables |
| No plaintext secrets | N/A — no credential columns |
| `decision` server-derived enum | PLANNED |

---

## Open items for SQL Migration Draft Authoring Review Gate

- Confirm `CampaignStatus` enum values match current OpenAPI.
- Confirm `ContentDraftStatus` enum values match current OpenAPI.
- Confirm `CampaignContentItemStatus` enum values match current OpenAPI.
- Confirm `ContentApprovalDecision` enum values match current OpenAPI.
- Confirm circular composite FK strategy for `campaign_content_items.current_draft_id`
  (SET NULL on delete; MATCH SIMPLE when NULL; requires review).
- Confirm `content_drafts.language` default and allowed values.
- Confirm `assets.storage_ref` is an opaque reference and no sensitive data leaks through it.
- Confirm `campaign_briefs` columns cover all required OpenAPI brief fields.
