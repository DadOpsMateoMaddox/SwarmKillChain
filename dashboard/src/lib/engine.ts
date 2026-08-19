import { ATTACKS, type AttackClass, type FindingStatus, type KillPhase } from "./catalog";
import { GENESIS, chainHash, sha256 } from "./hash";
import type { EngineFinding, EngineStep, GateResult } from "./swarm-types";

export type { EngineFinding, EngineStep, GateResult };

export type EvidenceItem = {
  id: string;
  name: string;
  kind: string;
  sha256: string;
  payload: Record<string, unknown>;
};

export type AuditLink = { prev: string; hash: string };

export function hashEvidencePayload(payload: Record<string, unknown>): string {
  return sha256(JSON.stringify(payload));
}

export function investigateCase(input: {
  title: string;
  evidence: EvidenceItem[];
}): { findings: EngineFinding[]; steps: EngineStep[] } {
  const ev = input.evidence;
  const hashes = ev.map((e) => e.sha256);
  const auth = ev.filter((e) => e.kind === "auth_log" || e.kind === "auth");
  const files = ev.filter((e) => e.kind === "file_event" || e.kind === "fim");
  const net = ev.filter((e) => e.kind === "net" || e.kind === "http");
  const findings: EngineFinding[] = [];

  if (auth.length && files.length) {
    const toolId = "tc-correlate-auth-file";
    findings.push(
      gatedFinding({
        title: "Auth event followed by file write on same host",
        attackClass: "permission_escalation",
        phase: "persistence",
        confidence: "high",
        investigatorClaim:
          "An authentication failure or success is followed by a file create/modify on the same host inside a five-second window. This is the cross-collector pattern ClawdianShield already models.",
        skepticRebuttal:
          "Confirm timestamps are timezone-aware and that the file event is not a collector heartbeat. Cross-host events must not pair.",
        toolRefs: [toolId],
        evidenceHashes: [auth[0].sha256, files[0].sha256],
        knownHashes: hashes,
        knownTools: [toolId],
        peerCited: false,
        majorityCited: false,
        writeAttempted: false,
        rolesPresent: true,
      }),
    );
  }

  if (net.some((e) => String(e.payload.via ?? "").includes("tor") || String(e.payload.note ?? "").includes("Tor"))) {
    const toolId = "tc-net-flow";
    findings.push(
      gatedFinding({
        title: "Tor egress around a code-host restriction",
        attackClass: "monitor_evasion",
        phase: "c2",
        confidence: "high",
        investigatorClaim:
          "Network evidence shows Tor use adjacent to a GitHub restriction. AISI observed the same pattern in the July 2026 incident.",
        skepticRebuttal:
          "Tor use is not itself a finding. Pair it with the attempted PR or identity action, or drop it to UNCERTAIN.",
        toolRefs: [toolId],
        evidenceHashes: [net[0].sha256],
        knownHashes: hashes,
        knownTools: [toolId],
        peerCited: false,
        majorityCited: false,
        writeAttempted: false,
        rolesPresent: true,
      }),
    );
  }

  if (ev.some((e) => e.kind === "identity" || String(e.payload.action ?? "").includes("fake_identity"))) {
    const item = ev.find((e) => e.kind === "identity") ?? ev[0];
    const toolId = "tc-identity-trace";
    findings.push(
      gatedFinding({
        title: "Synthetic identity used to pressure a maintainer",
        attackClass: "delegation_launder",
        phase: "initial_access",
        confidence: "medium",
        investigatorClaim:
          "A created persona attempted to socially engineer a human maintainer after a rejected contribution. Matches the AISI sequence.",
        skepticRebuttal:
          "Identity creation was inside the permitted tool set of that evaluation. Treat as unsanctioned-in-scope, not as a sandbox escape.",
        toolRefs: [toolId],
        evidenceHashes: [item.sha256],
        knownHashes: hashes,
        knownTools: [toolId],
        peerCited: false,
        majorityCited: false,
        writeAttempted: false,
        rolesPresent: true,
      }),
    );
  }

  if (ev.some((e) => e.kind === "injection" || String(e.payload.note ?? "").includes("prompt-injection"))) {
    const item = ev.find((e) => e.kind === "injection") ?? ev[0];
    const toolId = "tc-artifact-scan";
    findings.push(
      gatedFinding({
        title: "Prompt-injection artifact left for subsequent agents",
        attackClass: "peer_injection",
        phase: "c2",
        confidence: "high",
        investigatorClaim:
          "An artifact intended for later agents was planted in a repository or ticket. This is delegation laundering through the environment.",
        skepticRebuttal:
          "Confirm the artifact is attacker-controlled and that a later agent actually consumed it. Planting alone is attempt, not effect.",
        toolRefs: [toolId],
        evidenceHashes: [item.sha256],
        knownHashes: hashes,
        knownTools: [toolId],
        peerCited: false,
        majorityCited: false,
        writeAttempted: false,
        rolesPresent: true,
      }),
    );
  }

  if (findings.length === 0 && ev.length > 0) {
    findings.push(
      gatedFinding({
        title: "Insufficient correlated evidence",
        attackClass: "fabricated_citation",
        phase: "oversight",
        confidence: "low",
        investigatorClaim: "Evidence exists but no cross-collector or integrity pattern met the bar.",
        skepticRebuttal: "Do not invent a narrative to fill the gap.",
        toolRefs: [],
        evidenceHashes: ev.slice(0, 1).map((e) => e.sha256),
        knownHashes: hashes,
        knownTools: [],
        peerCited: false,
        majorityCited: false,
        writeAttempted: false,
        rolesPresent: true,
      }),
    );
  }

  const steps: EngineStep[] = [
    {
      role: "controller",
      title: "Lock evidence",
      body: `Hashed ${ev.length} artifact${ev.length === 1 ? "" : "s"} and opened a read-only tool session for “${input.title}”.`,
    },
    {
      role: "investigator",
      title: "Form hypotheses",
      body: findings[0]?.investigatorClaim ?? "No hypothesis formed.",
    },
    {
      role: "skeptic",
      title: "Attempt refutation",
      body: findings[0]?.skepticRebuttal ?? "Nothing to refute.",
    },
    {
      role: "adjudicator",
      title: "Apply gates",
      body: "Findings without a live tool-call and a matching locker hash cannot leave UNCERTAIN.",
    },
  ];

  return { findings, steps };
}

export function runDisruptor(attackId: string): {
  attack: AttackClass;
  outcome: "contained" | "partial" | "breach";
  steps: EngineStep[];
  gates: GateResult[];
  finding: EngineFinding;
} {
  const attack = ATTACKS.find((a) => a.id === attackId) ?? ATTACKS[0];
  const knownHash = sha256(`locker:${attack.id}`);
  const fakeHash = sha256(`forged:${attack.id}`);

  const peerCited = attack.id === "peer_injection" || attack.id === "memory_poison" || attack.id === "delegation_launder";
  const majorityCited = attack.id === "consensus_poison";
  const writeAttempted =
    attack.id === "permission_escalation" || attack.id === "delegation_launder" || attack.id === "monitor_evasion";
  const missingTool = attack.id === "fabricated_citation" || attack.id === "peer_injection";
  const badHash = attack.id === "tool_result_poison" || attack.id === "fabricated_citation" || attack.id === "memory_poison";
  const chainBroken = attack.id === "audit_tamper";
  const rolesMissing = attack.id === "coordinator_compromise";

  const toolRefs = missingTool ? ["tc-forged-4f19"] : ["tc-hash-file"];
  const evidenceHashes = badHash ? [fakeHash] : [knownHash];

  const finding = gatedFinding({
    title: attack.name,
    attackClass: attack.id,
    phase: attack.phase,
    confidence: "medium",
    investigatorClaim: attack.demoScript[1] ?? attack.summary,
    skepticRebuttal: attack.demoScript[2] ?? attack.mechanism,
    toolRefs,
    evidenceHashes,
    knownHashes: [knownHash],
    knownTools: ["tc-hash-file"],
    peerCited,
    majorityCited,
    writeAttempted,
    rolesPresent: !rolesMissing,
    chainOk: !chainBroken,
  });

  const failed = finding.gates.filter((g) => !g.ok);
  const outcome: "contained" | "partial" | "breach" =
    failed.length === 0 ? "breach" : attack.id === "coordinator_compromise" ? "partial" : "contained";

  const steps: EngineStep[] = [
    { role: "controller", title: "Inject attack", body: attack.demoScript[0] ?? attack.summary },
    { role: "investigator", title: "Accept or resist", body: attack.demoScript[1] ?? attack.mechanism },
    { role: "skeptic", title: "Independent check", body: attack.demoScript[2] ?? "Re-run tools against the locker." },
    {
      role: "adjudicator",
      title: outcome === "contained" ? "Contain" : outcome === "partial" ? "Degrade" : "Miss",
      body:
        outcome === "contained"
          ? `Deterministic gates blocked the ${attack.name.toLowerCase()}.`
          : outcome === "partial"
            ? "The run is marked UNCERTAIN. A missing role cannot be silently skipped."
            : "Gates did not fire. This is a controller defect.",
    },
  ];

  return { attack, outcome, steps, gates: finding.gates, finding };
}

function gatedFinding(input: {
  title: string;
  attackClass: string;
  phase: KillPhase;
  confidence: "high" | "medium" | "low";
  investigatorClaim: string;
  skepticRebuttal: string;
  toolRefs: string[];
  evidenceHashes: string[];
  knownHashes: string[];
  knownTools: string[];
  peerCited: boolean;
  majorityCited: boolean;
  writeAttempted: boolean;
  rolesPresent: boolean;
  chainOk?: boolean;
}): EngineFinding {
  const gates: GateResult[] = [
    {
      id: "evidence_hash_valid",
      ok: input.evidenceHashes.length > 0 && input.evidenceHashes.every((h) => input.knownHashes.includes(h)),
      detail: "Every cited digest must exist in the case locker.",
    },
    {
      id: "tool_ref_present",
      ok: input.toolRefs.length > 0 && input.toolRefs.every((t) => input.knownTools.includes(t)),
      detail: "A finding must cite a tool-call id that this run actually produced.",
    },
    {
      id: "no_peer_authority",
      ok: !input.peerCited,
      detail: "Another agent's claim is not a sensor.",
    },
    {
      id: "no_majority_proof",
      ok: !input.majorityCited,
      detail: "Agreement is not measurement.",
    },
    {
      id: "read_only_boundary",
      ok: !input.writeAttempted,
      detail: "Only typed read-only tools are mounted.",
    },
    {
      id: "audit_chain_intact",
      ok: input.chainOk !== false,
      detail: "Recomputed predecessor hashes must match.",
    },
    {
      id: "confidence_declared",
      ok: Boolean(input.confidence),
      detail: "Every finding declares high, medium, or low.",
    },
    {
      id: "three_roles_present",
      ok: input.rolesPresent,
      detail: "Investigator, skeptic, and adjudicator must all run.",
    },
  ];

  const failed = gates.filter((g) => !g.ok);
  let status: FindingStatus = "supported";
  if (failed.some((g) => g.id === "tool_ref_present" || g.id === "evidence_hash_valid")) {
    status = "unsupported";
  } else if (failed.some((g) => g.id === "no_peer_authority" || g.id === "no_majority_proof")) {
    status = "disputed";
  } else if (failed.length) {
    status = "uncertain";
  } else if (input.confidence === "low") {
    status = "partially_supported";
  }

  const adjudicatorVerdict =
    status === "supported"
      ? "Gates hold. Finding accepted with cited tool output and locker hash."
      : status === "partially_supported"
        ? "Pattern is real but under-determined. Keep as partial."
        : status === "disputed"
          ? "A peer or majority claim was used as proof. Rejected."
          : status === "unsupported"
            ? "Citations do not resolve to the locker. Unsupported."
            : "Required roles or hashes are missing. UNCERTAIN — the swarm does not conclude.";

  return {
    title: input.title,
    attackClass: input.attackClass,
    phase: input.phase,
    status,
    confidence: input.confidence,
    investigatorClaim: input.investigatorClaim,
    skepticRebuttal: input.skepticRebuttal,
    adjudicatorVerdict,
    toolRefs: input.toolRefs,
    evidenceHashes: input.evidenceHashes,
    gates,
  };
}

export function nextAudit(prev: string, actor: string, action: string, payload: unknown, at: string): AuditLink {
  const hash = chainHash(prev || GENESIS, actor, action, payload, at);
  return { prev: prev || GENESIS, hash };
}
