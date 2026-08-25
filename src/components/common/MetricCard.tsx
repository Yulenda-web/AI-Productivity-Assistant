import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "navy",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "navy" | "green" | "amber" | "red" | "info";
  className?: string;
}) {
  const toneClass = {
    navy: "bg-primary/10 text-primary",
    green: "bg-success/12 text-success",
    amber: "bg-warning/20 text-[oklch(0.5_0.13_70)]",
    red: "bg-destructive/12 text-destructive",
    info: "bg-info/12 text-info",
  }[tone];

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="bh-metric-label truncate">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", toneClass)}>
            <Icon className="h-4.5 w-4.5" size={18} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
