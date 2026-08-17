# Architecture

## Roles

1. **Investigator** forms hypotheses and requests typed read-only tools.
2. **Skeptic** independently checks the cited evidence and tries to refute each
   finding.
3. **Alternative narrative** searches for competing explanations and coverage
   gaps.
4. **Report gate** accepts only findings with valid tool-call references,
   evidence hashes, confidence, and review status.

The three model providers are replaceable. Provider identity is recorded in the
audit trail; outputs are never treated as evidence merely because a model said
so.

## Enforced boundary

- No generic shell is exposed to agents.
- Tool names and arguments are typed and allow-listed.
- Evidence paths are canonicalized and read-only.
- External tool calls have timeouts and bounded output.
- Evidence and tool output hashes are recorded before a finding is accepted.
- A finding must reference an existing audit event. Fabricated references are
  rejected at the report boundary.
- Review outcomes are `confirmed`, `inferred`, `refuted`, or `uncertain`.
- Exhausted disagreement remains `uncertain`; it is never silently promoted.

## First implementation slice

The first code slice is provider discovery and health reporting. This lets the
swarm identify which of Claude, GPT/Codex, and Gwen are actually callable before
any evidence workflow is enabled.

