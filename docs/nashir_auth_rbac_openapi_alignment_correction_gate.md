# Nashir Auth/RBAC/OpenAPI Alignment Correction Gate

| Field | Value |
|---|---|
| Gate type | Reduced safe Auth/RBAC/OpenAPI alignment correction |
| Scope | Documentation and OpenAPI correction-only; no backend implementation authorization |
| Previous broad correction audit | NO-GO; unsafe broad deletion was not committed |
| Auth/RBAC authority | `docs/nashir_auth_rbac_workspace_identity_gate.md` |
| OpenAPI authority | `docs/nashir_v1_openapi.yaml` |
| Alignment readiness | PENDING ALIGNMENT |

---

## 1. Gate Purpose

This gate applies a reduced safe correction slice after the previous broad
correction was audited as unsafe and was not committed.

The safe slice preserves all route families, Creator Studio, V1 Core Content
Studio CRUD, and preview-artifact capability. It applies only non-destructive
corrections and explicitly carries unresolved FAIL-02 and FAIL-03 items forward.

---

## 2. Inputs Reviewed

- `docs/nashir_auth_rbac_openapi_alignment_gate.md`
- `docs/nashir_auth_rbac_openapi_alignment_correction_planning_gate.md`
- `docs/nashir_auth_rbac_openapi_alignment_correction_planning_review_gate.md`
- `docs/nashir_auth_rbac_workspace_identity_gate.md`
- `docs/nashir_v1_openapi.yaml`

---

## 3. Unsafe Broad Correction Audit Result

The previous attempted correction removed 22 OpenAPI paths and 25 operations.
The pre-commit audit found suspicious/unjustified deletion of Creator Studio
routes, V1 Core Content Studio get/update capability, and preview-artifact
capability.

Audit decision: NO-GO. The unsafe broad correction was not committed.

This reduced safe slice restores and preserves every HEAD path and operationId.

---

## 4. Reduced Safe Correction Scope

This slice:

- neutralizes premature JWT/provider-specific assumptions without removing
  routes
- establishes and reflects explicit 401/403/non-disclosing 404 behavior using
  `ErrorModel`
- removes `vaultRef` from credential responses without deleting credential
  routes
- applies only direct, unambiguous canonical permission renames
- preserves Creator Studio sessions, context drafts, readiness assessments, and
  transfer draft routes
- preserves Content Studio CRUD and preview-artifact capability
- preserves unresolved route families and records their permission or overlap
  decisions as follow-up blockers

---

## 5. Six FAIL Findings Status

| FAIL | Status | Safe-slice finding |
|---|---|---|
| FAIL-01 / Authentication mechanism over-specification | Corrected | Provider/JWT/token-membership assertions neutralized |
| FAIL-02 / Permission vocabulary conflict | Partially corrected; remaining FAIL | Direct approved mappings normalized; permissions for Creator Studio, readiness, model routing, prompt governance, and other unmapped families remain unresolved |
| FAIL-03 / Overlapping content contract families | Remaining FAIL | Both families and unique capabilities preserved; authoritative route-family decision remains unresolved |
| FAIL-04 / Incomplete authorization error representation | Corrected | Every protected workspace operation explicitly represents 401 and 403 |
| FAIL-05 / Inconsistent non-disclosing behavior | Corrected | Auth/RBAC policy established and every protected workspace operation reflects non-disclosing metadata and explicit 404 |
| FAIL-06 / Credential response contradiction | Corrected | Credential response now excludes `vaultRef` |

Exactly the six original FAIL findings remain the correction scope. No new FAIL
is invented and no unresolved FAIL is silently downgraded.

---

## 6. Auth/RBAC Authority Corrections

`docs/nashir_auth_rbac_workspace_identity_gate.md` now establishes:

- canonical direct mappings for products, assets, store profile, and content
  actions without inventing permissions
- the approved 24 permission groups remain authoritative
- unmapped Creator Studio and deferred route-family permissions remain
  unresolved and require follow-up
- content authorization semantics independent of unresolved route-family
  selection
- preservation of both content route families, Content Studio CRUD, and
  preview-artifact capability pending a route-family decision
- an operation-level non-disclosing 401/403/404 policy using `ErrorModel`

These security expectations are established before or alongside OpenAPI
reflection.

---

## 7. OpenAPI Reflection Corrections

`docs/nashir_v1_openapi.yaml` now:

- preserves all 62 HEAD paths and all 90 HEAD operations
- preserves every Creator Studio and Content Studio route
- uses direct canonical approved permission mappings where unambiguous
- leaves unresolved permission strings present for follow-up rather than
  deleting their routes
- explicitly represents 401, 403, and non-disclosing 404 on all protected
  workspace operations
- declares non-disclosing membership metadata and guard behavior on all
  protected workspace operations
- preserves shared `ErrorModel`
- uses a provider-neutral bearer placeholder
- returns safe IntegrationCredential metadata without `vaultRef`

---

## 8. Route Preservation Review

| Coverage area | Result |
|---|---|
| HEAD versus worktree paths | Preserved: 62 / 62 |
| HEAD versus worktree operationIds | Preserved: 90 / 90 |
| Removed paths | None |
| Added paths | None |
| Creator Studio routes | Preserved |
| Creator Studio sessions/context/readiness/transfer drafts | Preserved |
| V1 Core Content Studio CRUD | Preserved |
| Preview-artifact capability | Preserved |
| Credential route families | Preserved |

No V1 screen/API coverage is silently reduced.

---

## 9. Correction Matrix

| FAIL | Auth/RBAC authority correction | OpenAPI reflection | Result | Remaining risk |
|---|---|---|---|---|
| FAIL-01 | Existing auth provider/token deferral preserved | Removed premature JWT/provider/token-membership assertions | Corrected | Auth implementation remains deferred |
| FAIL-02 | Established direct canonical mappings; explicitly retained unresolved families | Renamed only unambiguous permissions; preserved unresolved routes | Partial / remaining FAIL | Unmapped permission strings still block alignment |
| FAIL-03 | Established content action authorization; preserved both families pending decision | Preserved both families, CRUD, lifecycle, and preview artifacts | Remaining FAIL | Overlap may create conflicting implementation/client models |
| FAIL-04 | Required explicit protected-operation 401/403 | Added explicit 401/403 using shared responses | Corrected | Runtime behavior remains deferred |
| FAIL-05 | Established operation-level non-disclosing policy | Added metadata/guard and explicit 404 consistently | Corrected | Runtime tenant isolation remains deferred |
| FAIL-06 | Existing no-vault-reference response rule preserved | Safe response metadata excludes `vaultRef` | Corrected | Credential storage remains deferred |

---

## 10. Remaining Blocking Items

- FAIL-02 remains unresolved for route families without approved permission
  mappings, including Creator Studio and deferred readiness/governance families.
- FAIL-03 remains unresolved because the overlapping content route families
  require a separate authoritative route-family decision or explicit
  segregation.
- Generated clients must not be regenerated from the partially aligned
  contract.
- Backend implementation and permission enforcement remain blocked.

---

## 11. Residual Watch Items

- The direct content permission renames require review against the eventual
  route-family decision.
- Explicit non-disclosing contract metadata still requires future runtime
  enforcement tests.
- Credential safe metadata requires future response serialization tests.
- The provider-neutral bearer placeholder requires a later authorized auth
  mechanism decision.

---

## 12. Deferred Items

- backend implementation
- product API routes and workspace-scoped route implementation
- permission enforcement and auth implementation
- generated clients
- SQL migrations, migration runner setup, and ORM/query layer
- database/runtime configuration
- deployment config and CI workflows
- production and pilot readiness

---

## 13. Explicit Non-Authorization Boundary

This reduced safe correction gate does not authorize, and must NOT modify or
add:

- `henter36/nashir-backend` or backend implementation
- product API routes or workspace-scoped route implementation
- permission enforcement implementation or auth implementation
- generated clients
- SQL migrations, migration runner setup, database config, or ORM/query layer
- environment/secrets config with real values
- deployment config or CI workflows
- production readiness or pilot readiness

Alignment readiness remains PENDING ALIGNMENT and the active downstream
synchronization authority restriction remains in effect.

---

## 14. Risk Assessment

| Risk | Finding | Control |
|---|---|---|
| Suspicious route deletion | Eliminated in reduced slice | Require zero removed paths/operations |
| Creator Studio regression | Routes preserved | Carry permission mapping to follow-up |
| Content Studio capability regression | CRUD and preview artifacts preserved | Resolve overlap without deletion |
| Permission drift | Direct mappings corrected; unresolved families remain | Keep FAIL-02 open |
| Duplicate content model | Unresolved overlap remains | Keep FAIL-03 open |
| Tenant isolation | Contract corrected; runtime absent | Keep implementation blocked |
| Partial correction mistaken for readiness | Alignment remains pending | Preserve NO-GO and non-authorization boundary |

---

## 15. Verification Results

| Verification | Result |
|---|---|
| HEAD paths | 62 |
| Worktree paths | 62 |
| Removed paths | None |
| Added paths | None |
| HEAD operations | 90 |
| Worktree operations | 90 |
| Protected workspace operations | 89 |
| Explicit protected-operation 401/403/404 | 89 / 89 / 89 |
| Non-disclosing metadata | 89 / 89 |
| Creator Studio coverage | Preserved |
| Content Studio CRUD and preview artifacts | Preserved |
| YAML structural load | PASS |
| `git diff --check` | PASS |

---

## 16. GO / NO-GO Decision

Decision: NO-GO until remaining Auth/RBAC/OpenAPI correction defects are resolved.

FAIL-02 and FAIL-03 remain partially unresolved because safe correction requires
separate permission and route-family decisions. This reduced safe slice must not
be treated as alignment or implementation readiness.

---

## 17. Recommended Next Gate

Recommended Next Gate: Auth/RBAC/OpenAPI Alignment Correction Follow-up Gate.

The follow-up gate should resolve remaining permission mappings and the
overlapping content route-family decision without deleting Creator Studio,
Content Studio CRUD, preview-artifact capability, or other preserved routes.

---

## 18. Verification Commands

```bash
git status --short
git diff --stat
python3 - <<'PY'
import subprocess, yaml
from pathlib import Path

head = yaml.safe_load(subprocess.check_output(
    ['git', 'show', 'HEAD:docs/nashir_v1_openapi.yaml'], text=True
))
cur = yaml.safe_load(Path('docs/nashir_v1_openapi.yaml').read_text())

old = set(head.get('paths', {}).keys())
new = set(cur.get('paths', {}).keys())

print('HEAD paths', len(old))
print('WORKTREE paths', len(new))
print('REMOVED paths')
for p in sorted(old - new):
    print('-', p)
print('ADDED paths')
for p in sorted(new - old):
    print('+', p)
PY
grep -E -n 'Decision:|Recommended Next Gate|NO-GO|GO|FAIL-01|FAIL-02|FAIL-03|FAIL-04|FAIL-05|FAIL-06|Creator Studio|Content Studio|preview-artifact|unsafe|not committed|remaining|PENDING ALIGNMENT|does not authorize|must NOT modify|generated clients|SQL migrations|backend implementation|production|pilot' docs/nashir_auth_rbac_openapi_alignment_correction_gate.md
git diff --check
```
