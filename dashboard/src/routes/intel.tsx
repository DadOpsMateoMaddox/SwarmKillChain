import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ClassificationBar } from "@/components/classification-bar";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CROSS_REVIEW, INTEL } from "@/lib/catalog";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/intel")({ component: IntelPage });

function IntelBody() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-5 py-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">Blind review</p>
        <h1 className="mt-1 font-display text-4xl tracking-tight">Intel</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">{CROSS_REVIEW.headline}</p>
      </header>

      <section>
        <h2 className="font-display text-2xl tracking-tight">Agreed</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {CROSS_REVIEW.agreements.map((a) => (
            <li key={a} className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">Tensions</h2>
        <div className="mt-4 space-y-4">
          {CROSS_REVIEW.tensions.map((t) => (
            <article key={t.claim} className="rounded-xl border border-border bg-surface p-5">
              <Badge tone={statusTone(t.status)}>{t.status.replaceAll("_", " ")}</Badge>
              <p className="mt-3 text-sm text-fg">{t.claim}</p>
              <p className="mt-2 text-sm text-muted">{t.counter}</p>
              <p className="mt-3 text-sm text-muted">
                <span className="text-subtle">Resolution. </span>
                {t.resolution}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">Design requirements</h2>
        <ol className="mt-4 space-y-2">
          {CROSS_REVIEW.requirements.map((r, i) => (
            <li key={r} className="flex gap-3 rounded-lg border border-border bg-elevated px-4 py-3 text-sm">
              <span className="font-mono text-subtle">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-muted">{r}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">Evidence records</h2>
        <div className="mt-4 space-y-3">
          {INTEL.map((r) => (
            <article key={r.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl tracking-tight">{r.title}</h3>
                <Badge>{r.sourceType}</Badge>
                <Badge tone={statusTone(r.confidence)}>{r.confidence}</Badge>
                <Badge tone="info">Report {r.report}</Badge>
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                {r.provider} · {r.model} · {r.attackClass}
              </p>
              <p className="mt-3 text-sm text-muted">{r.observed}</p>
              <p className="mt-3 text-sm text-fg">{r.implication}</p>
              {r.evidenceUrl && (
                <a
                  href={r.evidenceUrl}
                  className="mt-3 inline-block text-xs text-muted underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Primary source
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function IntelPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="flex min-h-dvh flex-col bg-bg">
        <ClassificationBar />
        <div className="grid flex-1 place-items-center text-sm text-muted">Resolving session</div>
      </div>
    );
  }
  if (user) {
    return (
      <AppShell>
        <IntelBody />
      </AppShell>
    );
  }
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ClassificationBar label="CUI // OPEN BRIEFING" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-lg tracking-tight">
          SwarmKillChain
        </Link>
        <Button asChild size="sm">
          <Link to="/login">Sign in</Link>
        </Button>
      </header>
      <IntelBody />
    </div>
  );
}
