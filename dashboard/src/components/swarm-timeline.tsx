import type { EngineStep } from "@/lib/swarm-types";
import { providerForRole, type SwarmRole } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function SwarmTimeline({ steps, visible }: { steps: EngineStep[]; visible: number }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const show = i < visible;
        const seat = providerForRole(s.role as SwarmRole);
        return (
          <li
            key={`${s.role}-${i}`}
            className={cn(
              "rounded-lg border border-border bg-elevated px-4 py-3 transition-opacity duration-300",
              show ? "opacity-100" : "opacity-30",
            )}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
              {seat ? `${seat.label} · ${s.role}` : s.role}
            </div>
            <div className="mt-1 text-sm font-medium">{s.title}</div>
            {show && <p className="mt-1 text-sm text-muted">{s.body}</p>}
          </li>
        );
      })}
    </ol>
  );
}
