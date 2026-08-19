import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FindingCard } from "@/components/finding-card";
import { SwarmTimeline } from "@/components/swarm-timeline";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ATTACKS } from "@/lib/catalog";
import { dispatchDisrupt, loadWorkspace, type RunRow } from "@/lib/server/ops";
import type { EngineFinding, EngineStep, GateResult } from "@/lib/swarm-types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/disruptor")({ component: DisruptorPage });

type LocalResult = {
  outcome: "contained" | "partial" | "breach";
  steps: EngineStep[];
  finding: EngineFinding;
  gates: GateResult[];
};

function DisruptorPage() {
  const [selected, setSelected] = useState(ATTACKS[0].id);
  const [result, setResult] = useState<LocalResult | null>(null);
  const [visible, setVisible] = useState(0);
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<RunRow[]>([]);

  useEffect(() => {
    void loadWorkspace().then((w) => setHistory(w.runs.filter((r) => r.mode === "disrupt")));
  }, [result]);

  useEffect(() => {
    if (!result || visible >= result.steps.length) return;
    const t = window.setTimeout(() => setVisible((v) => v + 1), 650);
    return () => window.clearTimeout(t);
  }, [result, visible]);

  const attack = ATTACKS.find((a) => a.id === selected) ?? ATTACKS[0];
  const contained = history.filter((h) => h.status === "contained").length;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-5 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">Lab</p>
            <h1 className="mt-1 font-display text-4xl tracking-tight">Disruptor</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Fire a known swarm attack at the controller. The model does not decide containment —
              the gates do.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Contained</div>
            <div className="font-display text-3xl tabular-nums">
              {contained}/{history.length || 0}
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          <ul className="space-y-2 lg:col-span-2">
            {ATTACKS.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(a.id);
                    setResult(null);
                    setVisible(0);
                  }}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left transition-colors duration-150",
                    selected === a.id ? "border-accent/40 bg-elevated" : "border-border bg-surface hover:bg-elevated",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{a.name}</span>
                    <Badge>{a.phase}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{a.summary}</p>
                </button>
              </li>
            ))}
          </ul>

          <div className="space-y-5 lg:col-span-3">
            <article className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-2xl tracking-tight">{attack.name}</h2>
              <p className="mt-2 text-sm text-muted">{attack.mechanism}</p>
              <p className="mt-3 font-mono text-[11px] text-subtle">
                Gates: {attack.caughtBy.join(" · ")}
              </p>
              <Button
                className="mt-5"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  setVisible(0);
                  void dispatchDisrupt({ data: { attackId: attack.id } })
                    .then((r) => {
                      setResult({
                        outcome: r.outcome,
                        steps: r.steps,
                        finding: r.finding,
                        gates: r.gates,
                      });
                      toast.message(`Outcome: ${r.outcome}`);
                    })
                    .catch((e: Error) => toast.error(e.message))
                    .finally(() => setBusy(false));
                }}
              >
                {busy ? "Injecting…" : "Inject attack"}
              </Button>
            </article>

            {result && (
              <>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone(result.outcome)}>{result.outcome}</Badge>
                  <span className="text-sm text-muted">Controller verdict — not a model vote.</span>
                </div>
                <SwarmTimeline steps={result.steps} visible={visible} />
                {visible >= result.steps.length && <FindingCard finding={result.finding} />}
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
