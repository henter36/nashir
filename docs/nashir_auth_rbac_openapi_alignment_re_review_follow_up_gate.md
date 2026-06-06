# Nashir Auth/RBAC/OpenAPI Alignment Re-Review Follow-up Gate

| Field | Value |
|---|---|
| Gate type | Auth/RBAC/OpenAPI alignment re-review follow-up correction |
| Scope | OpenAPI prose qualification and documentation-only correction record |
| Previous decision | Decision: NO-GO until remaining Auth/RBAC/OpenAPI alignment defects are corrected. |
| Correction result | All actual unqualified permission-code prose references corrected |

---

## 1. Gate Purpose

This gate resolves the remaining FAIL-02 alignment blocker identified by the
Auth/RBAC/OpenAPI Alignment Re-Review Gate: 40 OpenAPI description references
used logical permission names instead of canonical fully qualified `nashir.*`
permission codes.

## 2. Inputs Reviewed

- `docs/nashir_auth_rbac_openapi_alignment_re_review_gate.md`
- `docs/nashir_v1_openapi.yaml`
- `docs/nashir_auth_rbac_workspace_identity_gate.md`

## 3. Previous NO-GO Basis

The previous re-review confirmed FAIL-01, FAIL-03, FAIL-04, FAIL-05, and FAIL-06
RESOLVED. FAIL-02 Creator Studio and deferred route-family mappings were also
resolved, but 40 unqualified permission-code references remained in OpenAPI
descriptions.

That prose inconsistency kept alignment PENDING ALIGNMENT and produced:

Decision: NO-GO until remaining Auth/RBAC/OpenAPI alignment defects are
corrected.

## 4. Follow-up Correction Scope

This correction changes OpenAPI prose/description text only. It:

- qualifies existing permission references with the canonical `nashir.` prefix
- uses only codes already established by Auth/RBAC authority and OpenAPI
  `x-permission` values
- preserves every path, operation, operationId, schema, `x-permission`, and
  route-family decision
- leaves established error and action codes unchanged

## 5. OpenAPI Permission Reference Corrections

Exactly 40 description references were qualified. Representative corrections
include:

| Previous prose reference | Canonical corrected reference |
|---|---|
| `workspace.read` / `workspace.update` | `nashir.workspace.read` / `nashir.workspace.update` |
| `members.manage` | `nashir.members.manage` |
| `store_profile.read` / `store_profile.update` | `nashir.store_profile.read` / `nashir.store_profile.update` |
| `data_sources.read` / `data_sources.manage` | `nashir.data_sources.read` / `nashir.data_sources.manage` |
| `channel_connections.read` / `channel_connections.manage` | `nashir.channel_connections.read` / `nashir.channel_connections.manage` |
| `integration_credentials.manage` | `nashir.integration_credentials.manage` |
| `campaigns.read` / `campaigns.manage` | `nashir.campaigns.read` / `nashir.campaigns.manage` |
| `publishing.read` / `publishing.manage` | `nashir.publishing.read` / `nashir.publishing.manage` |
| `analytics.read` | `nashir.analytics.read` |
| `audit_events.read` | `nashir.audit_events.read` |

Previously corrected content, Creator Studio, workflow, model-routing, and
prompt-governance permission references remain fully qualified.

## 6. Route and Operation Preservation Review

| Verification | Result |
|---|---|
| Paths | PASS: 62 paths preserved |
| Operations | PASS: 90 operations preserved |
| Removed paths | None |
| Added paths | None |
| Removed operations or operationIds | None |
| Added operations or operationIds | None |
| Route-family decisions | Unchanged |
| Schemas | Unchanged |
| `x-permission` values | Unchanged |

## 7. Permission Qualification Verification

A context-aware scan of operation summaries and descriptions confirms:

`PASS: no unqualified operation-description permission references remain`.

The supplied broad permission-like token detector still reports 25 established
non-permission error/action codes, including `workspace.not_found`,
`campaign.archived`, `review.required`, `publishing.blocked`, and
`creator_studio.session.expired`. These are not permission references and must
not be rewritten as `nashir.*` permissions. Preserving them avoids inventing
permission codes or changing error-contract schemas.

Therefore, the remaining unqualified permission-reference count is zero even
though the intentionally broad token detector continues to match non-permission
contract values.

## 8. Residual WATCH/DEFERRED Items

- WATCH: the follow-up review must confirm the distinction between canonical
  permission codes and established error/action codes.
- WATCH: future generated-client planning must preserve the content
  compatibility-alias boundary.
- DEFERRED: backend implementation, product and workspace-scoped route
  implementation, permission enforcement, and auth implementation.
- DEFERRED: generated clients, SQL migrations, ORM/query layer, deployment,
  CI, production readiness, and pilot readiness.

No unqualified permission-reference alignment blocker remains.

## 9. Explicit Non-Authorization Boundary

This follow-up gate does not authorize, and must NOT modify or add:

- `henter36/nashir-backend` or backend implementation
- Auth/RBAC documents or SQL contracts
- product API route implementation or workspace-scoped route implementation
- permission enforcement implementation or auth implementation
- generated clients
- SQL migrations, migration runner setup, database config, or ORM/query layer
- environment/secrets config with real values
- deployment config or CI workflows
- production readiness or pilot readiness

## 10. Risk Assessment

| Risk | Finding | Control |
|---|---|---|
| Permission vocabulary drift | Corrected: all actual prose references use canonical `nashir.*` codes | Review context-aware qualification scan |
| Error-code corruption | Broad detector matches non-permission codes | Preserve established error/action values unchanged |
| Route or operation regression | No structural OpenAPI changes | Require 62 paths and 90 operations |
| Premature implementation | Alignment correction only | Preserve consolidated non-authorization boundary |

## 11. Verification Results

- YAML parsing: PASS.
- Actual unqualified operation-description permission references: zero.
- OpenAPI prose permission replacements: 40.
- Paths: 62.
- Operations: 90.
- Structural route, operation, schema, and permission metadata changes: none.
- Broad detector residuals: 25 established non-permission error/action codes.
- `git diff --check`: PASS.

## 12. GO / NO-GO Decision

Decision: GO to Auth/RBAC/OpenAPI Alignment Re-Review Follow-up Review Gate, correction-only.

All actual unqualified OpenAPI permission-code references are corrected without
changing paths, operations, operationIds, schemas, permissions, or route-family
decisions. This decision does not authorize implementation.

## 13. Recommended Next Gate

Recommended Next Gate: Auth/RBAC/OpenAPI Alignment Re-Review Follow-up Review Gate.

## 14. Verification Commands

```bash
git status --short
git diff --stat
ruby route-and-operation-preservation-check.rb
ruby context-aware-permission-qualification-check.rb
ruby broad-permission-like-token-audit.rb
grep -E -n 'Decision:|Recommended Next Gate|Follow-up Review Gate|NO-GO|unqualified|nashir\.content\.read|nashir\.content\.manage|nashir\.content\.approve|nashir\.creator_studio\.use|nashir\.creator_studio\.transfer\.create|nashir\.workflow\.read|nashir\.model_routing\.read|nashir\.prompt_governance\.read|62 paths|90 operations|does not authorize|must NOT modify|generated clients|SQL migrations|backend implementation|production|pilot' docs/nashir_auth_rbac_openapi_alignment_re_review_follow_up_gate.md
git diff --check
```
