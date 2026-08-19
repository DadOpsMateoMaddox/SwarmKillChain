import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
  {
    variants: {
      tone: {
        default: "bg-elevated text-muted",
        ok: "bg-ok/15 text-ok",
        warn: "bg-warn/15 text-warn",
        danger: "bg-danger/15 text-danger",
        info: "bg-info/15 text-info",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}

export function statusTone(status: string) {
  if (status === "supported" || status === "contained" || status === "complete" || status === "open") return "ok" as const;
  if (status === "partially_supported" || status === "partial" || status === "uncertain") return "warn" as const;
  if (status === "disputed" || status === "unsupported" || status === "breach") return "danger" as const;
  return "default" as const;
}
