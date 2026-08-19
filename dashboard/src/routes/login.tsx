import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { ClassificationBar } from "@/components/classification-bar";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) return <Navigate to="/ops" />;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <ClassificationBar label="CUI // ACCESS CONTROL" />
      <main className="grid flex-1 place-items-center px-6 py-16">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtle">SwarmKillChain</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight">Request access</h1>
          <p className="mt-3 text-sm text-muted">
            Cases, evidence, and audit chains are scoped to your operator identity. Sign in to dispatch the swarm.
          </p>
          <div className="mt-8 space-y-3">
            {authEnabled ? (
              GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  className="w-full"
                  onClick={() => void signIn(p.providerId, { callbackURL: "/ops" })}
                >
                  Continue with {p.label}
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted">Sign-in is disabled.</p>
            )}
          </div>
          <p className="mt-6 text-center text-xs text-subtle">
            <Link to="/" className="underline-offset-4 hover:underline">
              Return to briefing
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
