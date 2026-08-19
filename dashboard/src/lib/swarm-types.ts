import type { FindingStatus, KillPhase } from "./catalog";

export type GateId =
  | "evidence_hash_valid"
  | "tool_ref_present"
  | "no_peer_authority"
  | "no_majority_proof"
  | "read_only_boundary"
  | "audit_chain_intact"
  | "confidence_declared"
  | "three_roles_present";

export type GateResult = {
  id: GateId;
  ok: boolean;
  detail: string;
};

export type EngineFinding = {
  title: string;
  attackClass: string;
  phase: KillPhase;
  status: FindingStatus;
  confidence: "high" | "medium" | "low";
  investigatorClaim: string;
  skepticRebuttal: string;
  adjudicatorVerdict: string;
  toolRefs: string[];
  evidenceHashes: string[];
  gates: GateResult[];
};

export type EngineStep = {
  role: "investigator" | "skeptic" | "adjudicator" | "controller";
  title: string;
  body: string;
};

export const GENESIS_HASH = "0".repeat(64);
