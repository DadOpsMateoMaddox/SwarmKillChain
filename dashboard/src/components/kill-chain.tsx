import { PHASES, type KillPhase } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function KillChain({ active = [], counts }: { active?: KillPhase[]; counts?: Partial<Record<KillPhase, number>> }) {
  return (
    <ol className="grid grid-cols-4 gap-2 lg:grid-cols-8">
      {PHASES.map((p) => {
        const on = active.includes(p.id);
        const n = counts?.[p.id] ?? 0;
        return (
          <li
            key={p.id}
            className={cn(
              "rounded-md border px-2 py-3 text-center",
              on ? "border-accent/40 bg-elevated" : "border-border bg-surface",
            )}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{p.label}</div>
            <div className="mt-1 font-mono text-sm tabular-nums text-fg">{n}</div>
          </li>
        );
      })}
    </ol>
  );
}
