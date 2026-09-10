import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 p-4", className)}>
      <div>
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  tone = "default",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "default" | "accent" | "critical" | "high" | "low";
  className?: string;
}) {
  const toneText =
    tone === "accent"
      ? "text-accent"
      : tone === "critical"
      ? "text-critical"
      : tone === "high"
      ? "text-high"
      : tone === "low"
      ? "text-low"
      : "text-fg";
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface/70 p-4",
        className
      )}
    >
      <div className="text-[11px] font-medium uppercase tracking-wider text-faint">
        {label}
      </div>
      <div className={cn("mt-1.5 text-2xl font-bold tabular", toneText)}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}
