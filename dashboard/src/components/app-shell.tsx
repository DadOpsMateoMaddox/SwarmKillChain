import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Crosshair, FileSearch, GitBranch, LayoutGrid, ScrollText, Shield } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton, RedirectToSignIn } from "@/lib/auth/gates";
import { ClassificationBar } from "./classification-bar";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/ops", label: "Command", icon: LayoutGrid },
  { to: "/cases", label: "Cases", icon: FileSearch },
  { to: "/disruptor", label: "Disruptor", icon: Crosshair },
  { to: "/lineup", label: "Lineup", icon: GitBranch },
  { to: "/intel", label: "Intel", icon: Shield },
  { to: "/audit", label: "Audit", icon: ScrollText },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) {
    return (
      <div className="flex min-h-dvh flex-col bg-bg">
        <ClassificationBar />
        <div className="grid flex-1 place-items-center text-sm text-muted">Resolving session</div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <ClassificationBar label="CUI // SWARMKILLCHAIN // OPERATOR" />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
          <Link to="/ops" className="flex items-center gap-2 px-5 py-5">
            <Activity className="size-4 text-muted" />
            <span className="font-display text-lg tracking-tight">SwarmKillChain</span>
          </Link>
          <nav className="flex flex-1 flex-col gap-1 px-3">
            {NAV.map((item) => {
              const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                    active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated hover:text-fg",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-4">
            <UserButton />
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-border px-4 md:hidden">
            <span className="font-display text-base">SwarmKillChain</span>
            <UserButton />
          </header>
          <main className="min-h-0 flex-1 overflow-auto pb-20 md:pb-0">{children}</main>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-6 border-t border-border bg-surface md:hidden">
        {NAV.map((item) => {
          const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex h-16 flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-[0.08em]",
                active ? "text-fg" : "text-subtle",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
