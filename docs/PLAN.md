# SANS Swarm Implementation Plan

## Goal

Build a local-first DFIR swarm that can investigate static evidence through
typed read-only tools, retain defensible provenance, and use independent model
roles to challenge unsupported findings.

## Phase 0: Contract and boundaries

Deliverables:

- Case directory contract for evidence, reports, and audit data.
- Threat model covering prompt injection, path traversal, evidence spoliation,
  fabricated citations, tool abuse, credential leakage, and model collusion.
- Provider contract for Claude, GPT/Codex, and Gwen.
- Explicit `UNCERTAIN` terminal state.

Exit criteria:

- No agent receives a generic shell.
- Evidence paths and writable paths are disjoint.
- Every provider has an explicit identity and role.

## Phase 1: Audit and evidence guard

Deliverables:

- `EvidenceGuard` with canonical path checks.
- SHA-256 evidence fingerprint before and after each tool call.
- Append-only JSONL audit records.
- Hash-chain verification command.
- Bounded subprocess runner with fixed argv, timeout, and output caps.

Tests:

- Path traversal and symlink escape rejection.
- Evidence mutation detection.
- Timeout and output-limit enforcement.
- Audit-chain tamper detection.

Exit criteria:

- A simulated write attempt fails before execution.
- A modified audit record fails verification at the exact record.

## Phase 2: Typed forensic tools

Start narrow. Implement only tools needed for one complete investigation:

- Evidence inventory.
- Linux authentication and persistence artifacts.
- Windows event and memory inventory where available.
- IOC extraction.
- Timeline search and cross-source correlation.

Each tool must define:

- Typed input schema.
- Allowed evidence roots.
- Fixed executable and argv construction.
- Structured output schema.
- Audit metadata and output hash.

Exit criteria:

- Tools can run against synthetic fixtures without a model.
- Tool outputs are reproducible and independently testable.

## Phase 3: Investigation state machine

Implement the Mulder-inspired phases:

1. Catalog evidence.
2. Extract and index artifacts.
3. Correlate across sources and systems.
4. Challenge with an alternative narrative.
5. Generate a gated report.

Add structural gates for minimum evidence coverage, valid citations, required
MITRE mapping where applicable, and audit completeness. Failed gates retry with
a fixed budget and gap-specific instructions.

## Phase 4: Model roles

Wire the providers only through the provider contract:

- Claude: primary investigator and tool planner.
- GPT/Codex: independent skeptic that re-runs or requests evidence checks.
- Gwen: alternative-narrative reviewer once its CLI or endpoint is identified.

Model outputs must be structured. The controller, not the model, owns state
transitions, retry limits, finding status, and report acceptance.

Minimum finding schema:

```json
{
  "claim": "...",
  "status": "confirmed|inferred|refuted|uncertain",
  "confidence": 0.0,
  "evidence_refs": ["tool-call-id"],
  "output_hashes": ["sha256"],
  "mitre_attack": [],
  "review_notes": []
}
```

## Phase 5: Consensus and adversarial evaluation

Add independent result comparison:

- Agreement does not override missing evidence.
- Disagreement creates a review task.
- Refutation takes precedence over majority vote when supported by evidence.
- Maximum three correction iterations.
- Unresolved claims become `uncertain`.

Use the SANS project patterns for test fixtures:

- Prompt-injected evidence fixture.
- Fabricated citation fixture.
- Tool-output poisoning fixture.
- False-positive alternative narrative fixture.
- Evidence mutation fixture.

## Phase 6: Provider and cost operations

- Keep Claude/GPT/Gwen routing configurable.
- Use cheaper models for mechanical extraction and formatting.
- Reserve stronger reasoning models for hypotheses and adversarial review.
- Record token and latency metadata without recording secrets.
- Add provider health checks and explicit unavailable-provider behavior.

## Phase 7: ClawdianShield integration

Integrate through a narrow adapter only after the standalone swarm passes its
security tests. The adapter should consume ClawdianShield evidence schemas and
return structured findings. It must not import or modify ClawdianShield's
execution engine or expose swarm internals to the public SUDO repository.

## First executable milestone

Build one complete synthetic Linux case:

```text
fixture evidence -> typed inventory/auth/persistence tools
                 -> Claude investigator
                 -> GPT skeptic
                 -> alternative narrative review
                 -> gated JSON + Markdown report
                 -> verified audit chain
```

Do not add a dashboard, live response, broad tool catalog, or public remote
until this vertical slice passes the boundary and adversarial tests.

