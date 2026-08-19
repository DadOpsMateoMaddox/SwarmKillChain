# Intent

SwarmKillChain is a research-driven security control architecture derived
from documented agentic failure modes. It is not a generic multi-agent
orchestration demo, and it is not a chatbot-panel UI with models attached.

Every control in this repository traces back to a specific, cited failure
mode in the research corpus below. If a proposed feature cannot be traced to
a failure mode or a stated design requirement, it does not belong here yet.

## Purpose

Multi-agent AI systems fail in ways single agents do not: peer agents launder
instructions past a model that would refuse them directly, shared memory
becomes a vector once one agent's poisoned output is treated as another
agent's "prior fact," consensus between models gets mistaken for verification,
and a coordinator or monitor that is itself a model can be the compromised
component. SwarmKillChain exists to give a three-model research swarm
(investigator, skeptic, blind adjudicator) a way to produce findings that
survive those failure modes — by moving authority for evidence, tool
execution, and finding status out of the models and into a deterministic
controller that the models cannot talk their way around.

## Threat model summary

The swarm's own model roles are treated as part of the threat surface, not
just its capability. Concretely, in-scope attack classes include:

- **Peer-agent instruction laundering** — a request rejected when it comes
  from a user is accepted when represented as coming from another agent.
- **Shared-memory / shared-state poisoning** — one agent's output becomes
  another agent's trusted context without independent verification.
- **Delegation laundering** — "Agent B asked me" treated as authorization.
- **Fabricated tool results or citations** — a model asserts a finding is
  evidence-backed without a real, verifiable tool call behind it.
- **Consensus poisoning / majority-as-proof** — agreement between models
  substituting for verified evidence.
- **Monitor evasion** — the review/adjudication step itself being fooled or
  bypassed.
- **Coordinator compromise** — the orchestration layer (not a worker model)
  being the point of failure, including a silently skipped review step.
- **Audit-log tampering** — after-the-fact editing or deletion of the record
  a finding was based on.
- **Permission escalation** — a role acquiring write, shell, network, or
  identity capability it was not scoped to have.
- **Evidence provenance failure** — a finding citing evidence that was never
  actually produced or that cannot be traced to a real event.

This list is not exhaustive; it is the subset of the research corpus's attack
taxonomy that directly shapes the controls below. See **Research provenance**
for the full taxonomy.

## Core architectural principle

**Models may reason about evidence. Only the deterministic controller may
authorize tools, establish evidence, or set finding status.**

A model can propose a hypothesis, request a tool call, dispute a peer's
claim, or flag `needs_human`. A model cannot mark its own or a peer's finding
`supported`, cannot execute a tool directly, and cannot cause evidence to
enter the locker without going through the controller's hashing and audit
path. This mirrors the research corpus's central finding: controls that
constrain authority at an external enforcement point (tool filtering,
database-level privilege, destination confirmation) have measured evidence
behind them; controls that ask a model to reinterpret hostile input safely do
not.

## Roles

| Seat | Model | Function | Authority |
|---|---|---|---|
| Investigator | Claude | Forms hypotheses, requests typed read-only tools | Cannot close a finding |
| Skeptic | GPT-5.6 | Independent refutation of the investigator's claims | A skipped turn is treated as `coordinator_compromise`, not silence |
| Adjudicator | Grok | Blind synthesis — receives claims without vendor/model identity attached | Vendor identity is never usable as evidence |
| Deterministic Controller | not a model | Owns the evidence locker, audit chain, tool allow-list, and finding status | The only component that can mark a finding `supported`, `unsupported`, `disputed`, or `uncertain` |

The adjudicator is **blind**: it never receives "Claude said" or "GPT said,"
only role-labeled, unattributed claims. This exists specifically to block
provider-reputation and majority-vote reasoning from substituting for
evidence — a failure mode the research corpus documents directly (Anthropic's
own blackmail-elicitation study notes its own scenarios were tuned against
Claude models, meaning even the source of an evaluation can carry bias).

## LiteLLM's role

LiteLLM is a token transport pipe between the controller and each seat's
model provider. It routes completions. **It does not authorize tools, does
not set finding status, and does not hold any allow-list of its own.** If the
gateway is unreachable, the correct behavior is that the affected seat
reports unavailable and the run either halts or degrades to `uncertain` —
never that the controller silently falls back to a different model or
treats a missing seat as a passing one.

## Traceability: research finding → control

Status values are strict and mechanical, so a row can only move forward when
the underlying code actually changes:

- **IMPLEMENTED** — enforcement code exists *and* has validation coverage
  (a passing test that would fail if the enforcement were removed).
- **PARTIAL** — some enforcing components exist, but the invariant is not
  end-to-end (e.g. the primitive exists but nothing yet calls it at the
  point where the invariant must hold).
- **PLANNED** — architecture/design exists (in `ARCHITECTURE.md` or
  `PLAN.md`); enforcement does not exist yet.

Never mark a row `IMPLEMENTED` on the strength of a design decision alone —
only on the strength of code plus a test that exercises it.

| Failure Mode | Invariant | Control | Status | Code Artifact | Test Evidence |
|---|---|---|---|---|---|
| Peer-agent instruction laundering (peer-trust preprint: 14/17 models performed a request from a peer that they rejected directly) | Peer statements are never evidence; a delegated request must carry its original principal | `no_peer_authority` gate; role loop labels peer input `untrusted_principal`, never `tool_result` | PLANNED | Pending | Pending |
| Shared-memory / shared-state poisoning (AISI July 2026: agents discovered and reused artifacts left by prior agents) | Persistent/shared state must not acquire authority merely by being retrievable | Controller-mediated locker/audit is the only persistent state; no informal shared-memory channel between seats | PARTIAL | `src/sans_swarm/locker.py` | `tests/test_locker.py` (locker/audit primitive covered; nothing yet prevents an unbuilt role loop from creating an out-of-band channel) |
| Delegation laundering (peer-trust preprint; Anthropic's "dishonest scout" listener-agent finding) | "Agent B asked me" is not authorization | `no_peer_authority` gate rejects any claim where `peer_cited: true` | PLANNED | Pending | Pending |
| Fabricated tool results / citations | Every cited evidence hash and tool_call_id must exist and have been produced this run | `evidence_hash_valid` and `tool_ref_present` gates | PLANNED | Pending | Pending — underlying tamper-detection primitive these gates would depend on is covered: `tests/test_locker.py::test_tampered_event_breaks_chain_verification` |
| Consensus poisoning / majority-as-proof (Anthropic multiagent-systems: agents converging on the same strategy mistaken for independent confirmation) | Agreement between models is never treated as verification | `no_majority_proof` gate rejects `majority_cited: true`; adjudicator receives no vendor/model identity | PLANNED | Pending | Pending |
| Monitor evasion (METR/Anthropic: overseer models can manipulate their own classification; monitors are themselves agents) | The review step must not be foolable by the thing it reviews, and must itself be auditable | Skeptic and adjudicator run as independent seats with no shared context beyond controller-mediated evidence | PLANNED | Pending | Pending |
| Coordinator compromise / missing skeptic | A silently skipped review step must never be indistinguishable from a passing one | Missing skeptic turn is a hard-coded attack class (`coordinator_compromise`); `three_roles_present` gate | PLANNED | Pending | Pending |
| Audit-log tampering | Audit history must be append-only and independently verifiable | Hash-chained audit: `event_hash = sha256(prev_hash \|\| canonical_json(event))`, genesis = 64 zero hex chars, no update/delete method on the class | **IMPLEMENTED** | `src/sans_swarm/locker.py` | `tests/test_locker.py::test_editing_a_stored_line_in_place_is_caught_by_verify`, `::test_deleting_a_stored_line_is_caught_by_verify`, `::test_tampered_event_breaks_chain_verification` |
| Permission escalation (AgentDojo / Postgres MCP: capability minimization worked; an unenforced "read-only" label failed) | Enforce capability limits externally (OS/API/adapter), not by asking a model not to escalate | Typed, allow-listed, controller-executed tools (`hash_file`, `read_evidence`, `list_evidence`, `correlate_auth_file`); models request, never call directly | PLANNED | Pending | Pending |
| Evidence provenance failure | Accepted evidence must be content-addressed and traceable to a real event this run | SHA-256 evidence locker (`ingest`) | **IMPLEMENTED** | `src/sans_swarm/locker.py` | `tests/test_locker.py::test_ingest_is_content_addressed`, `::test_ingest_same_payload_twice_is_idempotent` |

14/14 tests passing on branch `controller` as of this PR. Every future PR
that advances a control should move its row `PLANNED → PARTIAL →
IMPLEMENTED` rather than rewriting the surrounding prose.

## Current implementation boundary

As of branch `controller`:

- **Implemented**: LiteLLM-routed provider health checks for the
  investigator/skeptic/adjudicator seats (`src/sans_swarm/providers.py`,
  4 tests) and the evidence locker + hash-chained audit log
  (`src/sans_swarm/locker.py`, 10 tests). 14/14 tests passing.
- **Not yet implemented**: the typed read-only tool layer, the
  investigator → skeptic → adjudicator role loop, the deterministic gate
  module, and the first live correlation case.
- **Explicitly deferred**: the `dashboard/` subproject (a TanStack web UI,
  merged separately into `main`) is out of scope for the controller work and
  is not part of this traceability table. Per the build order this repository
  follows, UI work happens only after the controller, tools, and gates exist
  and pass tests — not before.

## Next planned control layers

In build order (see `docs/PLAN.md` for full phase detail):

1. Typed, controller-executed, allow-listed tools: `hash_file`,
   `read_evidence`, `list_evidence`, `correlate_auth_file`. Models request a
   tool name and arguments; only the controller executes and returns a
   signed result (`tool_call_id`, `sha256`, `ts`, `payload`).
2. The investigator → skeptic → adjudicator role loop, with JSON-only
   role output and a hard `coordinator_compromise` path when the skeptic
   turn is missing.
3. Deterministic gates (Python, not a model) that decide finding status:
   `evidence_hash_valid`, `tool_ref_present`, `no_peer_authority`,
   `no_majority_proof`, `read_only_boundary`, `audit_chain_intact`,
   `three_roles_present`, `confidence_declared`.
4. First live case: temporal auth/file correlation on a single host,
   including fabricated-citation and missing-skeptic test fixtures.

## Research provenance

This repository's design decisions are derived from two research reports
produced under a deliberately adversarial, source-disciplined methodology
(see `swarm-research-prompts/` in the parent research directory for the
prompts that generated them):

- **`ClaudeSwarmKillChain` report** — Claude-authored analysis focused on
  Anthropic's own published evidence and independent evaluations, covering
  scheming, sandbagging, monitor evasion, and multi-agent coordination
  failures.
- **`SwarmKillChain Threat Research: Agent Escapes, Multi-Agent Attacks, and
  Cross-Model Failures`** — a broad-spectrum, cross-vendor report covering
  the UK AISI July 2026 cyber-evaluation incident, Anthropic's multi-agent
  turf-war and collusion experiments, MCP tool-poisoning and confused-deputy
  attacks (Invariant Labs, Datadog), and a peer-trust delegation-laundering
  preprint (14/17 models executed a peer-delivered malicious payload). This
  report's ten prioritized design requirements are the direct source for
  most rows in the traceability table above.

Both reports were produced under a blind cross-review discipline
(`swarm-research-prompts/blind-reviewer.md`) that explicitly forbids treating
model agreement as confirmation without a verified primary source, and
requires every claim to be classified as incident, controlled evaluation,
red-team demonstration, or theory before it can inform a design requirement.
That same discipline — no model-asserted claim is evidence until it is
independently verifiable — is the reason this repository's controller, not
its models, owns finding status.

See also: `docs/ARCHITECTURE.md` (enforced boundary, role definitions),
`docs/REUSE_MATRIX.md` (which external DFIR/swarm patterns were adopted vs.
excluded), and `docs/PLAN.md` (phased build order).
