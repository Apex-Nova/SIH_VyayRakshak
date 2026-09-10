import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";
import { RISK_META } from "@/lib/risk/config";

const RISK_CLASSES: Record<RiskLevel, string> = {
  LOW: "bg-low/15 text-low ring-low/30",
  MEDIUM: "bg-medium/15 text-medium ring-medium/30",
  HIGH: "bg-high/15 text-high ring-high/30",
  CRITICAL: "bg-critical/15 text-critical ring-critical/30",
};

export function RiskBadge({
  level,
  score,
  className,
  showSymbol = true,
}: {
  level: RiskLevel;
  score?: number;
  className?: string;
  showSymbol?: boolean;
}) {
  const meta = RISK_META[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 tabular",
        RISK_CLASSES[level],
        className
      )}
    >
      {showSymbol && <span aria-hidden>{meta.symbol}</span>}
      <span>{meta.label}</span>
      {score !== undefined && <span className="opacity-80">· {score}</span>}
    </span>
  );
}

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted ring-1 ring-border",
        className
      )}
    >
      {children}
    </span>
  );
}
