import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { loadWorkspace, type AuditRow } from "@/lib/server/ops";
import { formatWhen, shortHash } from "@/lib/utils";

export const Route = createFileRoute("/audit")({ component: AuditPage });

function AuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);

  useEffect(() => {
    void loadWorkspace().then((w) => setRows([...w.audits].reverse()));
  }, []);

  const brokenAt = useMemo(() => {
    for (let i = 1; i < rows.length; i += 1) {
      if (rows[i].prev_hash !== rows[i - 1].event_hash) return i;
    }
    return -1;
  }, [rows]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-5 py-8">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">Chain of custody</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight">Audit</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Append-only. Each event hashes its predecessor. A missing or rewritten row breaks the chain
            and is treated as tamper.
          </p>
        </header>

        <div className="rounded-xl border border-border bg-surface px-5 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Integrity</div>
          <div className="mt-1 font-display text-2xl">
            {rows.length === 0 ? "No events" : brokenAt === -1 ? "Chain intact" : `Break at index ${brokenAt}`}
          </div>
        </div>

        <ol className="space-y-2">
          {rows.map((a, i) => (
            <li key={a.id} className="rounded-lg border border-border bg-surface px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs tabular-nums text-subtle">{String(i + 1).padStart(3, "0")}</span>
                <span className="text-sm">{a.action}</span>
                <Badge>{a.actor}</Badge>
              </div>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-subtle">
                prev {shortHash(a.prev_hash, 10)}
                <br />
                hash {shortHash(a.event_hash, 10)} · {formatWhen(a.created_at)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
}
