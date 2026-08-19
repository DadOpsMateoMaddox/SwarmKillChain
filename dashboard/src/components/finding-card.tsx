import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shortHash } from "@/lib/utils";
import type { EngineFinding } from "@/lib/swarm-types";
import { useState } from "react";
import { briefFinding } from "@/lib/server/ops";

type LooseFinding = EngineFinding | {
  title: string;
  attackClass?: string;
  attack_class?: string;
  phase: string;
  status: string;
  confidence: string;
  investigatorClaim?: string;
  investigator_claim?: string;
  skepticRebuttal?: string;
  skeptic_rebuttal?: string;
  adjudicatorVerdict?: string;
  adjudicator_verdict?: string;
  toolRefs?: string[];
  tool_refs?: string;
  evidenceHashes?: string[];
  evidence_hashes?: string;
  gates?: { id: string; ok: boolean; detail: string }[] | string;
};

export function FindingCard({ finding, createdAt }: { finding: LooseFinding; createdAt?: string }) {
  const title = finding.title;
  const attack = "attackClass" in finding && finding.attackClass ? finding.attackClass : (finding as { attack_class?: string }).attack_class;
  const claim =
    "investigatorClaim" in finding && finding.investigatorClaim
      ? finding.investigatorClaim
      : (finding as { investigator_claim?: string }).investigator_claim;
  const rebuttal =
    "skepticRebuttal" in finding && finding.skepticRebuttal
      ? finding.skepticRebuttal
      : (finding as { skeptic_rebuttal?: string }).skeptic_rebuttal;
  const verdict =
    "adjudicatorVerdict" in finding && finding.adjudicatorVerdict
      ? finding.adjudicatorVerdict
      : (finding as { adjudicator_verdict?: string }).adjudicator_verdict;
  const tools = Array.isArray((finding as EngineFinding).toolRefs)
    ? (finding as EngineFinding).toolRefs
    : (JSON.parse(((finding as { tool_refs?: string }).tool_refs ?? "[]") || "[]") as string[]);
  const hashes = Array.isArray((finding as EngineFinding).evidenceHashes)
    ? (finding as EngineFinding).evidenceHashes
    : (JSON.parse(((finding as { evidence_hashes?: string }).evidence_hashes ?? "[]") || "[]") as string[]);
  const gates = Array.isArray(finding.gates)
    ? finding.gates
    : (JSON.parse((typeof finding.gates === "string" ? finding.gates : "[]") || "[]") as {
        id: string;
        ok: boolean;
        detail: string;
      }[]);

  const [brief, setBrief] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <article className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl tracking-tight">{title}</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            {attack} · {finding.phase}
            {createdAt ? ` · ${createdAt}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge tone={statusTone(finding.status)}>{finding.status.replaceAll("_", " ")}</Badge>
          <Badge>{finding.confidence}</Badge>
        </div>
      </div>
      <dl className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Investigator</dt>
          <dd className="mt-1 text-sm text-muted">{claim}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Skeptic</dt>
          <dd className="mt-1 text-sm text-muted">{rebuttal}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Adjudicator</dt>
          <dd className="mt-1 text-sm text-fg">{verdict}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {tools.map((t) => (
          <Badge key={t} tone="info">
            {t}
          </Badge>
        ))}
        {hashes.map((h) => (
          <Badge key={h}>{shortHash(h)}</Badge>
        ))}
      </div>
      {gates.length > 0 && (
        <ul className="mt-4 grid gap-1 sm:grid-cols-2">
          {gates.map((g) => (
            <li key={g.id} className="flex items-start gap-2 text-xs text-muted">
              <span className={g.ok ? "text-ok" : "text-danger"}>{g.ok ? "PASS" : "FAIL"}</span>
              <span className="font-mono">{g.id}</span>
              <span className="text-subtle">{g.detail}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void briefFinding({
              data: { title, claim: claim ?? "", verdict: verdict ?? "" },
            })
              .then((r) => setBrief(r.text))
              .finally(() => setBusy(false));
          }}
        >
          {busy ? "Briefing…" : "Operator brief"}
        </Button>
        {brief && <p className="mt-3 text-sm text-muted">{brief}</p>}
      </div>
    </article>
  );
}
