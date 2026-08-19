import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { KillChain } from "@/components/kill-chain";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loadWorkspace, type Workspace } from "@/lib/server/ops";
import { PROVIDERS, type KillPhase } from "@/lib/catalog";
import { formatWhen, shortHash } from "@/lib/utils";

export const Route = createFileRoute("/ops")({ component: OpsPage });

function OpsPage() {
  const [data, setData] = useState<Workspace | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void loadWorkspace()
      .then(setData)
      .catch((e: Error) => setErr(e.message));
  }, []);

  const counts = useMemo(() => {
    const c: Partial<Record<KillPhase, number>> = {};
    for (const f of data?.findings ?? []) {
      const p = f.phase as KillPhase;
      c[p] = (c[p] ?? 0) + 1;
    }
    return c;
  }, [data]);

  const contained = (data?.runs ?? []).filter((r) => r.status === "contained").length;
  const breach = (data?.runs ?? []).filter((r) => r.status === "breach").length;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-5 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">Command</p>
            <h1 className="mt-1 font-display text-4xl tracking-tight">Operations</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/lineup">Lineup</Link>
            </Button>
            <Button asChild>
              <Link to="/disruptor">Run disruptor</Link>
            </Button>
          </div>
        </header>

        {err && <p className="text-sm text-danger">{err}</p>}
        {!data && !err && <p className="text-sm text-muted">Loading workspace…</p>}

        {data && (
          <>
            <section className="grid gap-3 sm:grid-cols-4">
              {PROVIDERS.map((p) => (
                <div key={p.id} className="rounded-xl border border-border bg-surface px-5 py-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{p.role}</div>
                  <div className="mt-2 font-display text-2xl tracking-tight">{p.label}</div>
                  <p className="mt-2 text-xs text-muted">{p.via}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-3 sm:grid-cols-4">
              {[
                { k: "Open cases", v: data.cases.filter((c) => c.status === "open").length },
                { k: "Findings", v: data.findings.length },
                { k: "Contained", v: contained },
                { k: "Breaches", v: breach },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-border bg-surface px-5 py-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{s.k}</div>
                  <div className="mt-2 font-display text-3xl tabular-nums">{s.v}</div>
                </div>
              ))}
            </section>

            <KillChain
              active={(Object.keys(counts) as KillPhase[]).filter((k) => (counts[k] ?? 0) > 0)}
              counts={counts}
            />

            <section className="grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-2xl tracking-tight">Cases</h2>
                <ul className="mt-4 space-y-2">
                  {data.cases.map((c) => (
                    <li key={c.id}>
                      <Link
                        to="/cases/$caseId"
                        params={{ caseId: c.id }}
                        className="block rounded-lg border border-border bg-surface px-4 py-3 hover:bg-elevated"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium">{c.title}</span>
                          <Badge>{c.classification}</Badge>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted">{c.summary}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-2xl tracking-tight">Latest audit</h2>
                <ul className="mt-4 space-y-2">
                  {data.audits.slice(0, 8).map((a) => (
                    <li key={a.id} className="rounded-lg border border-border bg-surface px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-fg">{a.action}</span>
                        <Badge tone={statusTone(a.actor)}>{a.actor}</Badge>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-subtle">
                        {shortHash(a.event_hash)} · {formatWhen(a.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
