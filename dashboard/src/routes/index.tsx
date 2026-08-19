import { createFileRoute, Link } from "@tanstack/react-router";
import { ClassificationBar } from "@/components/classification-bar";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { CROSS_REVIEW, LINEUP_CONTRACT, PROVIDERS } from "@/lib/catalog";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const seats = PROVIDERS.filter((p) => p.role !== "controller");
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ClassificationBar label="CONTROLLED UNCLASSIFIED // SWARMKILLCHAIN BRIEFING" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-lg tracking-tight">SwarmKillChain</span>
        <SignedOut>
          <Button asChild size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button asChild size="sm">
            <Link to="/ops">Open console</Link>
          </Button>
        </SignedIn>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
          LiteLLM · Claude · GPT-5.6 · Grok · Consensus is not evidence
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          Detect when a swarm’s reasoning, tools, and effects diverge.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted md:text-lg">
          Your VS Code orchestration already seats three models. This console is the control plane in
          front of that pipe: typed read-only tools, a hash-chained audit, and gates no model may skip.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SignedOut>
            <Button asChild size="lg">
              <Link to="/login">
                Enter the console <ArrowRight className="size-4" />
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild size="lg">
              <Link to="/ops">
                Enter the console <ArrowRight className="size-4" />
              </Link>
            </Button>
          </SignedIn>
          <Button asChild variant="outline" size="lg">
            <Link to="/intel">Read the cross-review</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-px bg-border md:grid-cols-3">
          {seats.map((c) => (
            <article key={c.id} className="bg-surface px-8 py-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">{c.role}</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight">{c.label}</h2>
              <p className="mt-3 text-sm text-muted">{c.mandate}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">{LINEUP_CONTRACT.gateway}</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl tracking-tight md:text-4xl">
          {LINEUP_CONTRACT.rule}
        </h2>
        <p className="mt-6 max-w-2xl text-sm text-muted">{CROSS_REVIEW.headline}</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {CROSS_REVIEW.agreements.map((a) => (
            <li key={a} className="rounded-lg border border-border bg-surface px-5 py-4 text-sm text-muted">
              {a}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
