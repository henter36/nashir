# Nashir AI Agent Runtime Selection Planning Gate

| Field | Value |
|---|---|
| Gate type | AI Agent Runtime selection planning |
| Scope | Documentation-only planning; no runtime, dependency, OpenAPI, SQL, backend, or generated-client authorization |
| Tracking issue | #179 |
| Source input | Uploaded `nashir-agent-architecture-v2.md` review artifact |
| Existing AI Ops authority context | `docs/ai_ops_backend_contract_planning.md`, `docs/ai_ops_backend_contract_review.md` |
| Current backend path context | Backend Slice 0 contract-safe infrastructure validation path remains separate and unaffected |

---

## 1. Executive Decision

Decision: GO to track AI Agent Runtime as a future governed planning path.

Runtime implementation = NO-GO.

Runtime dependency selection = NO-GO.

OpenAPI YAML patch = NO-GO.

SQL/schema/migration = NO-GO.

Backend implementation = NO-GO.

Generated clients = NO-GO.

Provider/model/prompt/tool execution = NO-GO.

Publishing integration = NO-GO.

This gate converts the uploaded Agent Runtime architecture review artifact into a concise official planning gate. It does not authorize implementation or selection of Mastra, LangGraph, OpenAI Agents SDK, or any other runtime.

---

## 2. Gate Purpose

This gate ensures that Nashir's future AI Agent Runtime path is recorded before the project reaches AI Ops implementation pressure.

It exists to prevent the Agent Runtime topic from being treated as an incidental library choice later. It establishes required future planning coverage for:

- Agent Runtime abstraction
- Tool Registry and tool authorization boundaries
- Agent memory and workspace-scoped context boundaries
- Interrupt / human approval model
- Mastra versus LangGraph proof-of-concept criteria
- failure modes and recovery decisions
- future OpenAPI planning implications
- execution sequencing and non-authorization boundaries

This gate does not change the current backend implementation sequence. Backend Slice 0 contract-safe infrastructure validation remains a separate path and must not expand into AI runtime behavior.

---

## 3. Inputs Reviewed

| Input | Planning use |
|---|---|
| Uploaded `nashir-agent-architecture-v2.md` | Source architecture artifact containing ADR, SPEC, EVAL, RISK, API, and PLAN sections |
| #179 | Tracking issue for preserving the AI Agent Runtime path in Nashir development |
| `docs/ai_ops_backend_contract_planning.md` | Existing AI Ops backend contract planning and non-execution boundary |
| `docs/ai_ops_backend_contract_review.md` | Existing AI Ops planning review and explicit NO-GO boundaries |
| `docs/nashir_auth_rbac_openapi_alignment_final_re_review_gate.md` | Confirms Auth/RBAC/OpenAPI alignment is reviewed for planning only |
| `docs/nashir_backend_implementation_slice_planning_review_gate.md` | Confirms Backend Slice 0 planning remains contract-safe validation only |
| `docs/nashir_backend_slice_0_contract_safe_infrastructure_validation_action_gate.md` | Confirms later action work remains NO-GO until direct user decisions |
| `AGENTS.md` | Confirms governance-first, human-in-the-loop, cost control, workspace/RBAC, and auditability principles |

---

## 4. Existing AI Ops Boundary Confirmation

This gate preserves the existing AI Ops contract boundary:

- AI Ops planning may define future contract concepts.
- Dry-run planning may exist before real execution.
- Human review remains required before publishing or sensitive output.
- Cost and policy checks must be evaluated before execution.
- Runtime execution, provider calls, prompt execution, connector execution, and publishing remain out of scope until later explicit gates.

This gate must not weaken any prior AI Ops NO-GO boundary.

---

## 5. Scope Coverage Matrix

| Scope area from uploaded architecture | Gate treatment | Current status |
|---|---|---|
| Agent Runtime abstraction | Accepted for future planning | Required before any runtime dependency selection |
| `NashirAgentRuntimeAdapter` | Accepted as planning concept | No code, schema, or interface authorized |
| Agent Runtime candidates | Mastra and LangGraph only for first PoC planning comparison | No dependency selected |
| Tool Registry | Accepted as mandatory future boundary | No tool implementation authorized |
| Tool contracts | Must include permission, workspace scope, schema, idempotency, audit, cost, and approval requirements | Planning only |
| Agent memory | Accepted only as workspace-scoped, redacted, auditable context planning | No memory persistence authorized |
| Interrupt / human approval | Accepted as structural requirement for sensitive actions | Planning only |
| Silence equals rejection | Accepted as default approval principle for future planning | Not implemented |
| Checkpoint / resume | Accepted as future runtime requirement | No checkpoint store authorized |
| Failure modes register | Accepted as required future review input | Planning only |
| OpenAPI field changes | Accepted as future OpenAPI planning candidates only | No YAML patch authorized |
| RAG / knowledge layer | Deferred to a later RAG/context boundary gate | Not part of current authorization |
| Vercel AI SDK | Deferred to future UI/streaming planning only | Not an orchestrator decision |
| MCP | Deferred; internal, read-only, workspace-scoped only if later approved | No public MCP servers in V1 |
| Publishing integration | V2 or later only after prior gates prove safe behavior | Explicitly blocked |

---

## 6. Planning Decisions

### Decision 1 — Runtime abstraction required

Nashir must not bind business workflows directly to any third-party agent runtime.

Future runtime behavior must pass through a Nashir-owned abstraction, currently named for planning purposes as:

- `NashirAgentRuntimeAdapter`
- `AgentRuntime`
- `AgentSession`
- `AgentCheckpoint`
- `AgentInterrupt`
- `AgentToolBinding`

These names are planning concepts only. They are not authorized as database tables, OpenAPI schemas, TypeScript interfaces, or implementation classes in this gate.

### Decision 2 — Tool Registry required before runtime execution

Future agent tools must be registered in a Nashir-owned Tool Registry before any runtime can call them.

Every future tool entry must plan at least:

- permission guard
- workspace scope
- input schema
- output schema
- idempotency rule
- audit event family
- cost policy linkage
- approval requirement
- failure behavior

No free-form runtime tool execution is acceptable.

### Decision 3 — Human approval is structural, not optional

Any future sensitive action must require an interrupt and human review. Sensitive actions include at least:

- publishing or sending content externally
- spending or exceeding budget thresholds
- changing ModelRoute or PromptVersion governance state
- transferring customer data outside the workspace boundary
- enabling a connector not previously approved
- writing canonical merchant/product/campaign data

Silence must not advance the workflow. Future planning should treat timeout as rejection or suspension according to the approved action policy.

### Decision 4 — Memory must not become a hidden source of truth

Future memory planning must distinguish:

- run-scoped context snapshots
- campaign-scoped context snapshots
- workspace-level summaries

Agent memory must not store raw credentials, API keys, client secrets, or unredacted sensitive customer data. It must not overwrite canonical Store, Product, Campaign, Content, Prompt, Route, CostPolicy, or Audit authorities.

### Decision 5 — Mastra is a candidate, not a decision

Mastra may be the first candidate to evaluate because the backend stack is TypeScript/Node-oriented. That does not authorize installing or importing Mastra.

LangGraph remains the comparison candidate because of its stateful workflow, checkpoint, and human-in-the-loop maturity. That does not authorize adding a Python runtime.

Runtime selection must be decided only after a later PoC planning and review sequence.

---

## 7. Candidate Runtime Evaluation Boundary

The future PoC must use the same scenario for every candidate:

1. Read workspace-scoped product context.
2. Generate a draft campaign artifact.
3. Trigger a mandatory human approval interrupt.
4. Persist or simulate a checkpoint.
5. Resume only after approval.
6. Simulate timeout, tool failure, provider failure, and cost exceeded cases.

Future scoring must cover:

| Criterion | Required review focus |
|---|---|
| RBAC integration | Workspace isolation and permission checks are enforceable outside the runtime library |
| Human-in-the-loop | Interrupt, timeout, reject, approve, and resume behavior are real, not UI-only |
| Checkpoint / resume | Long workflow state can be persisted and recovered safely |
| Observability | Steps, tool requests, model requests, interrupts, and outcomes are auditable |
| Developer experience | The team can understand, test, and operate the runtime without bypassing governance |
| Multi-tenant safety | No cross-workspace context leakage or shared state ambiguity |
| Cost control | Token, tool-call, provider, and run-duration limits can be enforced outside prompts |

No PoC may call real providers, execute real publishing, write canonical data, or bypass OpenAPI-aligned service boundaries unless a later gate explicitly authorizes those behaviors.

---

## 8. Future OpenAPI Planning Implications

The uploaded architecture identified possible OpenAPI implications. This gate accepts them only as future planning candidates.

Future OpenAPI planning may consider:

- `WorkflowDefinition.runtimeType`
- `WorkflowDefinition.agentRuntimeRef`
- runtime-compatible step kinds
- `WorkflowRun.interruptState`
- `WorkflowRun.approvalState`
- `WorkflowRun.checkpointRef`
- resume token semantics
- agent trace artifact kinds
- agent audit event families
- CostPolicy token/tool/duration/approval thresholds
- ModelRoute tool-use and fallback strategy fields
- PromptVersion allowed-tools and output-schema references

This gate does not patch `docs/nashir_v1_openapi.yaml` and does not authorize any executable OpenAPI schema or generated-client change.

---

## 9. Required Prerequisites Before Any Runtime Implementation

Before any future Agent Runtime implementation gate, these prerequisites must be planned, reviewed, and accepted by separate gates:

- Auth implementation boundary
- workspace membership enforcement
- RBAC permission enforcement
- tenant isolation and non-disclosing behavior
- immutable audit log
- secret vault and provider credential reference handling
- model provider registry
- model route policy persistence
- prompt template and prompt version governance
- cost policy persistence and enforcement
- dry-run evaluator
- run artifact persistence
- review decision persistence
- output contract validation
- idempotency and concurrency controls
- failure-mode and recovery behavior
- security and privacy threat model
- test strategy for tenant isolation, tool calls, approvals, and failures

Without these prerequisites, Agent Runtime implementation remains blocked.

---

## 10. Execution Path Placement

The Agent Runtime path must be placed after core backend safety foundations and before any real AI execution.

Target future sequence:

```text
Core backend foundations
→ Auth/RBAC/OpenAPI alignment
→ Audit / CostPolicy / PromptGovernance planning
→ AI Agent Runtime Selection Planning Gate
→ AI Agent Runtime Selection Planning Review Gate
→ AI Threat Modeling Gate
→ Mastra vs LangGraph PoC Planning Gate
→ Mastra vs LangGraph PoC Review Gate
→ AI Ops Read-Only / Dry-Run Planning Gate
→ AI Ops Limited Generation Planning Gate
→ Publishing integration only in a later V2 path
```

This path must not interrupt or expand Backend Slice 0 contract-safe infrastructure validation. Backend Slice 0 remains validation-only unless a separate explicit gate authorizes otherwise.

---

## 11. Failure Modes That Must Be Carried Forward

Future Agent Runtime gates must address at least these failure modes:

| Failure mode | Required planning decision |
|---|---|
| Tool call fails mid-run | Suspend safely, audit, and resume from last safe checkpoint if allowed |
| Approval session expires | Approval remains tied to workflow run, not browser/session state |
| Cost limit exceeded | Stop after safe step boundary, trigger cost interrupt, and do not continue silently |
| Reviewer timeout | Silence does not approve; timeout produces audit event and cancellation or suspension |
| Provider failure | Retry policy and fallback strategy must be explicit and auditable |
| Cross-workspace memory leakage | Operation must be denied and security-audited |
| Checkpoint corruption | Runtime must fall back to prior valid checkpoint or fail closed |
| Prompt/tool injection | Tool boundary must validate requested actions against registry and permission guards |
| Audit unavailable | Sensitive action must be blocked |

---

## 12. Explicit Non-Authorization Boundary

This planning gate does not authorize, and must NOT modify, add, install, select, approve, or implement:

- runtime dependencies such as Mastra, LangGraph, OpenAI Agents SDK, PydanticAI, CrewAI, AutoGen, Google ADK, Microsoft Agent Framework, Vercel AI SDK, LlamaIndex, Haystack, or MCP servers
- `henter36/nashir-backend` implementation
- backend routes beyond `/health`
- product API routes or workspace-scoped route implementation
- auth implementation or permission enforcement implementation
- services, controllers, repositories, workers, schedulers, or runtime adapters
- model provider calls
- prompt execution
- agent tool execution
- connector execution
- publishing or campaign sending
- RAG/vector database/indexing implementation
- OpenAPI YAML patch
- SQL schema, migrations, migration runner, database config, or ORM/query layer
- environment/secrets config with real values
- generated clients or generated types
- validation scripts, package scripts, lockfile changes, or CI workflows
- deployment config
- production readiness or pilot readiness

This gate is a tracking and planning gate only.

---

## 13. Risk Assessment

| Risk | Planning finding | Required control |
|---|---|---|
| Premature runtime lock-in | Directly adopting Mastra or LangGraph would bind Nashir before governance is ready | Require Nashir-owned adapter and later PoC review |
| Governance bypass | Agent runtime could call tools or services outside RBAC/audit boundaries | Require Tool Registry and service-boundary enforcement |
| Cross-workspace leakage | Memory or runtime context could mix tenant data | Require workspace-scoped memory and query-layer checks |
| Hidden source of truth | Agent memory could override canonical data | Keep canonical entities authoritative and memory advisory only |
| Approval bypass | Runtime could proceed after timeout or missing reviewer action | Treat silence as rejection or suspension; require audit |
| Cost abuse | Agent loops or repeated tool calls could exceed budget | Require CostPolicy limits before execution |
| Prompt/tool injection | Model output could request unauthorized tool use | Validate every tool call against registry, schema, permissions, and approval requirements |
| False implementation readiness | Merging this doc could be mistaken for permission to install runtime dependencies | Preserve explicit NO-GO boundary and require review gates |
| Publishing liability | Automated publishing could create legal, brand, or financial harm | Keep publishing integration V2 or later only |

---

## 14. Review Findings

| Review criterion | Finding |
|---|---|
| Uploaded architecture converted into gate form | PASS |
| Documentation-only scope preserved | PASS |
| Issue #179 linked | PASS |
| Agent Runtime abstraction covered | PASS |
| Tool Registry covered | PASS |
| Memory boundary covered | PASS |
| Approval interrupt model covered | PASS |
| PoC Mastra versus LangGraph covered | PASS |
| Failure modes covered | PASS |
| OpenAPI implications limited to future planning | PASS |
| RAG and MCP deferred safely | PASS |
| Publishing kept out of V1 | PASS |
| Backend Slice 0 path left unaffected | PASS |
| Runtime/dependency/backend implementation authorization | NO |

---

## 15. GO / NO-GO Decision

Decision: GO to AI Agent Runtime Selection Planning Review Gate when the project reaches the AI Ops planning path.

This decision records the path now but does not require immediate execution of the review gate while Backend Slice 0 and other prerequisite gates remain active.

This gate does not authorize runtime implementation, dependency installation, OpenAPI patching, SQL/schema/migration work, generated clients, provider calls, prompt execution, tool execution, connector execution, publishing, CI workflows, deployment, production readiness, or pilot readiness.

---

## 16. Recommended Next Step

Merge this documentation-only planning gate if reviewed and accepted.

Then keep #179 available as the tracking reference for future AI Agent Runtime planning.

When Nashir reaches the AI Ops planning point, open:

```text
Nashir AI Agent Runtime Selection Planning Review Gate
```

Do not open implementation, dependency, PoC, OpenAPI YAML, or backend runtime work from this gate alone.

---

## 17. Verification Commands

```bash
git status --short
git diff --stat
grep -E -n 'Decision:|Recommended Next Step|#179|documentation-only|NO-GO|Agent Runtime|NashirAgentRuntimeAdapter|Tool Registry|memory|Interrupt|approval|Mastra|LangGraph|PoC|failure modes|OpenAPI|MCP|RAG|publishing|Backend Slice 0|does not authorize|must NOT modify|runtime dependencies|backend implementation|provider calls|prompt execution|tool execution|connector execution|generated clients|SQL|migrations|CI workflows|production|pilot' docs/nashir_ai_agent_runtime_selection_planning_gate.md
git diff --check
```