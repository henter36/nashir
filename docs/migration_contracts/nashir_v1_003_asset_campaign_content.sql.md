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
-- Workspace-owned. Optional links to products and content items.
-- Soft archive via archived_at.
-- OpenAPI: Asset
-- assets.status: SQL-only TEXT + CHECK candidate.

CREATE TABLE assets (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id             UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    product_id               UUID REFERENCES products (id) ON DELETE RESTRICT,
    title                    TEXT NOT NULL,
    asset_type               TEXT NOT NULL,
    source                   TEXT,
    storage_ref              TEXT NOT NULL, -- opaque storage reference; no raw file data
    status                   TEXT NOT NULL CHECK (status IN ('active', 'archived')),
    -- status is SQL-only; values subject to review.
    archived_at              TIMESTAMPTZ,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assets_workspace_id ON assets (workspace_id);
CREATE INDEX idx_assets_workspace_status ON assets (workspace_id, status);

-- ============================================================
-- campaigns
-- ============================================================
-- Workspace-owned. Optional primary product FK.
-- Optimistic concurrency via resource version field.
-- Soft archive via archived_at.
-- OpenAPI: Campaign / CampaignStatus (OpenAPI-approved enum candidate).

CREATE TABLE campaigns (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id      UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    primary_product_id UUID REFERENCES products (id) ON DELETE RESTRICT,
    name              TEXT NOT NULL,
    objective         TEXT,
    status            TEXT NOT NULL CHECK (status IN (
        'draft', 'active', 'paused', 'completed', 'archived'
    )),
    -- CampaignStatus: OpenAPI-approved enum candidate; values must match OpenAPI.
    version           INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency
    archived_at       TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaigns_workspace_id ON campaigns (workspace_id);
CREATE INDEX idx_campaigns_workspace_status ON campaigns (workspace_id, status);

-- ============================================================
-- campaign_briefs
-- ============================================================
-- Workspace-owned. One brief per campaign.
-- OpenAPI: CampaignBrief

CREATE TABLE campaign_briefs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id  UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    campaign_id   UUID NOT NULL REFERENCES campaigns (id) ON DELETE RESTRICT,
    objective     TEXT,
    audience      TEXT,
    channel       TEXT,
    tone          TEXT,
    constraints   TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_campaign_briefs_campaign UNIQUE (campaign_id)
);

CREATE INDEX idx_campaign_briefs_workspace_id ON campaign_briefs (workspace_id);

-- ============================================================
-- campaign_content_items
-- ============================================================
-- Workspace-owned. Canonical table name: campaign_content_items.
-- Optional current draft FK (set after first content_draft is created).
-- Soft archive via archived_at.
-- OpenAPI: CampaignContentItem / CampaignContentItemStatus (OpenAPI-approved enum candidate).

CREATE TABLE campaign_content_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    campaign_id         UUID NOT NULL REFERENCES campaigns (id) ON DELETE RESTRICT,
    current_draft_id    UUID, -- FK to content_drafts; set after drafts table is created
    content_type        TEXT NOT NULL,
    channel             TEXT NOT NULL,
    status              TEXT NOT NULL CHECK (status IN (
        'draft', 'in_review', 'approved', 'rejected', 'published', 'archived'
    )),
    -- CampaignContentItemStatus: OpenAPI-approved enum candidate; values must match OpenAPI.
    version             INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency
    archived_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaign_content_items_workspace_id ON campaign_content_items (workspace_id);
CREATE INDEX idx_campaign_content_items_campaign ON campaign_content_items (workspace_id, campaign_id);
CREATE INDEX idx_campaign_content_items_status ON campaign_content_items (workspace_id, status);

-- ============================================================
-- content_drafts
-- ============================================================
-- Workspace-owned. Content item FK. Creator user FK (not workspace-scoped user).
-- Soft archive via archived_at.
-- Immutable once approved: content_approvals reference draft as decision record.
-- OpenAPI: ContentDraft / ContentDraftStatus (OpenAPI-approved enum candidate).

CREATE TABLE content_drafts (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id     UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    content_item_id  UUID NOT NULL REFERENCES campaign_content_items (id) ON DELETE RESTRICT,
    creator_user_id  UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    body             TEXT NOT NULL,
    language         TEXT NOT NULL DEFAULT 'en',
    draft_version    INTEGER NOT NULL DEFAULT 1,
    status           TEXT NOT NULL CHECK (status IN (
        'draft', 'submitted', 'approved', 'rejected', 'withdrawn'
    )),
    -- ContentDraftStatus: OpenAPI-approved enum candidate; values must match OpenAPI.
    version          INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency
    archived_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_drafts_workspace_id ON content_drafts (workspace_id);
CREATE INDEX idx_content_drafts_content_item ON content_drafts (workspace_id, content_item_id);
CREATE INDEX idx_content_drafts_creator ON content_drafts (workspace_id, creator_user_id);
CREATE INDEX idx_content_drafts_status ON content_drafts (workspace_id, status);

-- Add deferred FK from campaign_content_items to content_drafts.
ALTER TABLE campaign_content_items
    ADD CONSTRAINT fk_current_draft
    FOREIGN KEY (current_draft_id) REFERENCES content_drafts (id) ON DELETE SET NULL;

-- ============================================================
-- content_approvals
-- ============================================================
-- Workspace-owned. Immutable decision records — append-only.
-- Reviewer user FK (for self-approval prevention at service layer).
-- OpenAPI: ContentApproval / ContentApprovalDecision (OpenAPI-approved enum candidate).
-- Server-derived decision: derived from endpoint path, not arbitrary client body.

CREATE TABLE content_approvals (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id      UUID NOT NULL REFERENCES workspaces (id) ON DELETE RESTRICT,
    content_draft_id  UUID NOT NULL REFERENCES content_drafts (id) ON DELETE RESTRICT,
    reviewer_user_id  UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    decision          TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
    -- ContentApprovalDecision: OpenAPI-approved enum candidate; server-owned.
    note              TEXT,
    rejection_reason  TEXT,
    required_changes  TEXT,
    decided_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    -- No updated_at: approval records are immutable.
    -- No archived_at: approval records are not hard-deleted in V1 planning.
);

CREATE INDEX idx_content_approvals_workspace_id ON content_approvals (workspace_id);
CREATE INDEX idx_content_approvals_draft ON content_approvals (workspace_id, content_draft_id);
CREATE INDEX idx_content_approvals_reviewer ON content_approvals (workspace_id, reviewer_user_id);
```

---

## Draft — DOWN

```sql
-- DRAFT ONLY — NOT EXECUTABLE — review required before any database application

-- Remove deferred FK before dropping campaign_content_items.
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

Removing the circular FK (`fk_current_draft`) before dropping
`campaign_content_items` is required because `content_drafts` references
`campaign_content_items` and vice versa.

Down section rollback is safe only if no publishing or analytics data
references these tables.

---

## Constraints checklist

| Constraint | Status |
|---|---|
| `assets` workspace scoping | PLANNED |
| `campaigns` workspace scoping + version field | PLANNED |
| `campaign_briefs` campaign uniqueness | PLANNED |
| `campaign_content_items` workspace + campaign scoping + version field | PLANNED |
| `content_drafts` workspace + content item scoping + version field | PLANNED |
| `content_approvals` immutable (no `updated_at`) | PLANNED |
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
- Confirm circular FK strategy for `campaign_content_items.current_draft_id`
  (SET NULL on delete is safe but requires review).
- Confirm `content_drafts.language` default and allowed values.
- Confirm `assets.storage_ref` is an opaque reference and no sensitive data
  leaks through it.
- Confirm `campaign_briefs` columns cover all required OpenAPI brief fields.
