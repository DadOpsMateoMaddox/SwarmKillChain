export function ClassificationBar({ label = "CUI // DEMO" }: { label?: string }) {
  return (
    <div className="flex h-6 items-center justify-center bg-elevated text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
      {label}
    </div>
  );
}
