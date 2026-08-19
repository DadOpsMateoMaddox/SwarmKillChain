import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LINEUP_CONTRACT, PROVIDERS } from "@/lib/catalog";
import { CLAUDE_BRIEF, LOCAL_BUILD_ORDER } from "@/lib/handoff";

export const Route = createFileRoute("/lineup")({ component: LineupPage });

function LineupPage() {
  const [copied, setCopied] = useState(false);

  async function copyBrief() {
    await navigator.clipboard.writeText(CLAUDE_BRIEF);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-5 py-8">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">
            {LINEUP_CONTRACT.gateway} · {LINEUP_CONTRACT.surface}
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-tight">Lineup</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">{LINEUP_CONTRACT.rule}</p>
        </header>

        <ul className="grid gap-3 md:grid-cols-2">
          {PROVIDERS.map((p) => (
            <li key={p.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl tracking-tight">{p.label}</h2>
                <Badge>{p.role}</Badge>
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{p.via}</p>
              <p className="mt-4 text-sm text-fg">{p.mandate}</p>
              <p className="mt-3 text-sm text-muted">
                <span className="text-subtle">Must not. </span>
                {p.mustNot}
              </p>
            </li>
          ))}
        </ul>

        <section>
          <h2 className="font-display text-2xl tracking-tight">Local build order</h2>
          <ol className="mt-4 space-y-3">
            {LOCAL_BUILD_ORDER.map((s) => (
              <li key={s.n} className="rounded-lg border border-border bg-surface px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
                  {s.n} · {s.title}
                </div>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-border bg-elevated p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl tracking-tight">Give this to Claude</h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Paste into the VS Code Claude seat. Do not put it in the public repo. Controller first, UI last.
              </p>
            </div>
            <Button type="button" onClick={() => void copyBrief()}>
              {copied ? "Copied" : "Copy brief"}
            </Button>
          </div>
          <pre className="mt-5 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-bg p-4 font-mono text-[11px] leading-relaxed text-muted">
            {CLAUDE_BRIEF}
          </pre>
        </section>
      </div>
    </AppShell>
  );
}
