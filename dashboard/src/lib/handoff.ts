export const LOCAL_BUILD_ORDER = [
  {
    n: "01",
    title: "Health the pipe",
    body: "Point SwarmKillChain at your existing LiteLLM base URL. Prove Claude, GPT-5.6, and Grok each return a one-line pong. Do not give the gateway any tools.",
  },
  {
    n: "02",
    title: "Controller first",
    body: "Python outside LiteLLM owns the locker, tools, audit chain, and gates. Models only emit JSON claims. If LiteLLM is down, status is UNCERTAIN — never approved.",
  },
  {
    n: "03",
    title: "Seat the three roles",
    body: "Claude investigates. GPT-5.6 skeptics. Grok adjudicates blind — no vendor labels in its prompt. A missing skeptic turn is coordinator compromise.",
  },
  {
    n: "04",
    title: "First live case",
    body: "Run the existing temporal correlation goal or AISI-0726 against hashed evidence. pytest must reject fabricated citations and peer-as-proof.",
  },
  {
    n: "05",
    title: "UI last",
    body: "Do not rebuild this preview. After tests pass, optionally serve a local adapter the console can call. The design here is the spec, not the runtime.",
  },
];

export const CLAUDE_BRIEF = `You are implementing SwarmKillChain locally. This is a controller + LiteLLM adapter, not a UI rebuild.

## Repos and boundaries
- Work in the private SwarmKillChain repo only (D:\\\\MasterVault\\\\SwarmKillChain or current root).
- Do not merge this into the public SUDO / ClawdianShield repo.
- Do not commit keys, evidence, research prompts, PDFs, or model transcripts.
- Reuse ClawdianShield's correlate_auth_and_file as a pure function (import or copy). Do not pull the rest of that tree.

## Existing pipe
The operator already has LiteLLM in VS Code routing:
- Claude  → investigator
- GPT-5.6 → skeptic
- Grok    → adjudicator
LiteLLM is a token pipe. It must not authorize tools, findings, or state. Do not register extra MCP / shell / write tools on the gateway for this project.

## Build order (stop after each step if tests fail)

### 1. Provider health
config.toml (or yaml) with:
  litellm.base_url  from env
  litellm.api_key   from env (LITELLM_API_KEY)
  seats:
    investigator.model
    skeptic.model
    adjudicator.model
Add providers.health_report() that pings each seat with a 1-token prompt.
Windows: resolve the python/cli with shutil.which; send prompts via stdin or a temp file — never argv (8KB limit).

### 2. Evidence locker + audit
- ingest(payload) → sha256, store, return EvidenceItem
- append-only audit: event_hash = sha256(prev_hash || canonical_json(event))
- genesis = 64 zero hex chars
- no UPDATE/DELETE on audit rows

### 3. Typed read-only tools (controller-mounted only)
Allow-list:
  hash_file
  read_evidence
  list_evidence
  correlate_auth_file
Every tool result is:
  { "tool_call_id": "...", "sha256": "...", "ts": "...", "payload": {} }
Refuse: write, shell, network, identity, git, MCP, anything not on the list.
Models never call tools directly. They request a tool name + args; the controller executes and returns the signed result.

### 4. Role loop
investigator → (optional tool requests) → skeptic → adjudicator → controller.gates
- Each role gets its own system prompt and must return JSON only.
- Adjudicator prompt is blind: no vendor names, no "Claude said / GPT said".
- Peer messages are labeled untrusted_principal, never "tool_result".
- Shared memory notes are not evidence.
- Raw chain-of-thought, if captured, stays off the locker and off the gates.
- <<NEEDS_HUMAN>> stops the loop.
- Missing skeptic turn ⇒ attack class coordinator_compromise, finding UNCERTAIN.

Required JSON shape from each role:
{
  "role": "investigator|skeptic|adjudicator",
  "claims": [{ "title": "", "attack_class": "", "phase": "", "confidence": "high|medium|low", "text": "" }],
  "tool_requests": [{ "name": "", "args": {} }],
  "cited_tool_ids": [],
  "cited_evidence_hashes": [],
  "peer_cited": false,
  "majority_cited": false,
  "needs_human": false
}

### 5. Deterministic gates (Python, not a model)
A finding may only become supported if ALL of these pass:
  evidence_hash_valid   — every cited digest exists in the locker
  tool_ref_present      — every cited tool_call_id was produced this run
  no_peer_authority     — peer_cited is false
  no_majority_proof     — majority_cited is false
  read_only_boundary    — no write/shell attempted
  audit_chain_intact    — recomputed prev hashes match
  three_roles_present   — investigator, skeptic, adjudicator all ran
  confidence_declared   — high|medium|low
Otherwise: unsupported (bad citations), disputed (peer/majority), or UNCERTAIN.
Models cannot set status. The controller sets status.

### 6. First live case
Use the existing temporal-correlation GOAL if present, else seed AISI-0726-CYBER:
  auth log + file event on same host inside 5s → correlate_auth_file
  fabricated citation → unsupported
  forged "peer already approved" → disputed
Write logs/<utc>/turn-NN-<role>.json and a findings.md the operator can read.
pytest -q must cover: empty evidence, same-host pair, cross-host reject, fabricated citation, missing skeptic, hash-chain break.

### 7. Do not do yet
- Do not rebuild the Grok preview (TanStack) UI.
- Do not add a fourth model.
- Do not let LiteLLM see write tools "just for the orchestrator".
- Do not treat consensus as evidence.

## Done when
You report:
1. health_report() for all three seats
2. pytest output
3. one run directory with hashes and gate results
4. the exact LiteLLM model ids you bound to each seat
Then stop. UI adapter is a later task.`;
