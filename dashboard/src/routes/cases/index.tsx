import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createCase, loadWorkspace, type CaseRow } from "@/lib/server/ops";
import { formatWhen } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/cases/")({ component: CasesPage });

function CasesPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () =>
    loadWorkspace()
      .then((w) => setCases(w.cases))
      .catch((e: Error) => toast.error(e.message));

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-5 py-8">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">Locker</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight">Cases</h1>
        </header>

        <form
          className="rounded-xl border border-border bg-surface p-5"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            void createCase({ data: { title, summary } })
              .then(() => {
                setTitle("");
                setSummary("");
                toast.success("Case opened");
                return refresh();
              })
              .catch((err: Error) => toast.error(err.message))
              .finally(() => setBusy(false));
          }}
        >
          <h2 className="font-display text-xl">Open a case</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea
              placeholder="What is in scope — and what is not."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <Button className="mt-4" disabled={busy} type="submit">
            {busy ? "Opening…" : "Create case"}
          </Button>
        </form>

        <ul className="grid gap-3 md:grid-cols-2">
          {cases.map((c) => (
            <li key={c.id}>
              <Link
                to="/cases/$caseId"
                params={{ caseId: c.id }}
                className="block h-full rounded-xl border border-border bg-surface p-5 hover:bg-elevated"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl tracking-tight">{c.title}</h3>
                  <Badge>{c.classification}</Badge>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{c.summary}</p>
                <p className="mt-4 font-mono text-[11px] text-subtle">{formatWhen(c.created_at)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
