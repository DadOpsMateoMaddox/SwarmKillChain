import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FindingCard } from "@/components/finding-card";
import { SwarmTimeline } from "@/components/swarm-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  addEvidence,
  dispatchInvestigate,
  loadCase,
  type AuditRow,
  type CaseRow,
  type EvidenceRow,
  type FindingRow,
} from "@/lib/server/ops";
import type { EngineStep } from "@/lib/swarm-types";
import { formatWhen, shortHash } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/cases/$caseId")({ component: CasePage });

function CasePage() {
  const { caseId } = Route.useParams();
  const [kase, setKase] = useState<CaseRow | null>(null);
  const [evidence, setEvidence] = useState<EvidenceRow[]>([]);
  const [findings, setFindings] = useState<FindingRow[]>([]);
  const [audits, setAudits] = useState<AuditRow[]>([]);
  const [steps, setSteps] = useState<EngineStep[]>([]);
  const [visible, setVisible] = useState(0);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState("note");
  const [note, setNote] = useState("");

  const refresh = () =>
    loadCase({ data: caseId }).then((row) => {
      if (!row) return;
      setKase(row.case);
      setEvidence(row.evidence);
      setFindings(row.findings);
      setAudits(row.audits);
    });

  useEffect(() => {
    void refresh().catch((e: Error) => toast.error(e.message));
  }, [caseId]);

  useEffect(() => {
    if (!steps.length || visible >= steps.length) return;
    const t = window.setTimeout(() => setVisible((v) => v + 1), 700);
    return () => window.clearTimeout(t);
  }, [steps, visible]);

  if (!kase) {
    return (
      <AppShell>
        <div className="grid min-h-[50vh] place-items-center text-sm text-muted">Loading case…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-5 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">Case</p>
            <h1 className="mt-1 font-display text-4xl tracking-tight">{kase.title}</h1>
            <p className="mt-3 max-w-3xl text-sm text-muted">{kase.summary}</p>
          </div>
          <Button
            disabled={busy || evidence.length === 0}
            onClick={() => {
              setBusy(true);
              setVisible(0);
              void dispatchInvestigate({ data: caseId })
                .then((r) => {
                  setSteps(r.steps);
                  toast.success(`${r.findings.length} finding${r.findings.length === 1 ? "" : "s"} adjudicated`);
                  return refresh();
                })
                .catch((e: Error) => toast.error(e.message))
                .finally(() => setBusy(false));
            }}
          >
            {busy ? "Dispatching…" : "Dispatch swarm"}
          </Button>
        </header>

        {steps.length > 0 && (
          <section>
            <h2 className="mb-3 font-display text-2xl tracking-tight">Run</h2>
            <SwarmTimeline steps={steps} visible={visible} />
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl tracking-tight">Evidence locker</h2>
            <ul className="mt-4 space-y-2">
              {evidence.map((e) => (
                <li key={e.id} className="rounded-lg border border-border bg-surface px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm">{e.name}</span>
                    <Badge>{e.kind}</Badge>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-subtle">{shortHash(e.sha256, 10)}</p>
                </li>
              ))}
            </ul>
            <form
              className="mt-4 space-y-3 rounded-xl border border-border bg-surface p-4"
              onSubmit={(e) => {
                e.preventDefault();
                void addEvidence({ data: { caseId, name, kind, note } })
                  .then(() => {
                    setName("");
                    setNote("");
                    toast.success("Artifact hashed into locker");
                    return refresh();
                  })
                  .catch((err: Error) => toast.error(err.message));
              }}
            >
              <h3 className="text-sm font-medium">Ingest artifact</h3>
              <Input placeholder="Name" value={name} onChange={(ev) => setName(ev.target.value)} required />
              <Input placeholder="Kind (auth_log, file_event, net…)" value={kind} onChange={(ev) => setKind(ev.target.value)} />
              <Textarea placeholder="Note / payload" value={note} onChange={(ev) => setNote(ev.target.value)} />
              <Button type="submit" variant="outline" size="sm">
                Hash and store
              </Button>
            </form>
          </div>
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl tracking-tight">Audit</h2>
            <ul className="mt-4 space-y-2">
              {audits.map((a) => (
                <li key={a.id} className="rounded-lg border border-border bg-elevated px-3 py-2">
                  <div className="font-mono text-xs">{a.action}</div>
                  <div className="font-mono text-[10px] text-subtle">
                    {shortHash(a.event_hash)} · {formatWhen(a.created_at)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-tight">Findings</h2>
          {findings.length === 0 && <p className="text-sm text-muted">Dispatch the swarm to adjudicate this locker.</p>}
          {findings.map((f) => (
            <FindingCard key={f.id} finding={f} createdAt={formatWhen(f.created_at)} />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
