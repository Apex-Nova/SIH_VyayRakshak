import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatTile, Card, CardHeader } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { progressBuckets, mismatchedProjects } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Progress Intelligence" };

export default function ProgressPage() {
  const b = progressBuckets();
  const mismatched = mismatchedProjects(12);

  return (
    <>
      <PageHeader
        eyebrow="Data"
        title="Progress Intelligence"
        description="Financial completion compared against verified physical progress, with delayed and at-risk works surfaced."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Progress", href: "/progress" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="On Track" value={b.onTrack} tone="low" />
          <StatTile label="At Risk (mismatch)" value={b.atRisk} tone="high" />
          <StatTile label="Delayed" value={b.delayed} tone="critical" />
          <StatTile label="Completed" value={b.completed} tone="accent" />
        </div>

        <Card className="mt-6">
          <CardHeader
            title="Financial vs Physical Progress Mismatches"
            subtitle="Works where reported financial completion outpaces verified physical progress"
          />
          <div className="divide-y divide-border border-t border-border">
            {mismatched.map((p) => {
              const gap = p.progress.reportedProgress - p.progress.physicalProgress;
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="block px-4 py-3 transition-colors hover:bg-surface-2/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-fg">{p.name}</div>
                      <div className="truncate text-xs text-faint">
                        #{p.id} · {p.district}, {p.stateName}
                      </div>
                    </div>
                    <RiskBadge level={p.risk.riskLevel} score={p.risk.totalScore} showSymbol={false} />
                  </div>
                  <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="space-y-1.5">
                      <ProgressRow label="Financial" value={p.progress.reportedProgress} color="bg-accent-2" />
                      <ProgressRow label="Physical" value={p.progress.physicalProgress} color="bg-accent" />
                    </div>
                    <div className="rounded-lg bg-high/10 px-2.5 py-1 text-xs font-semibold text-high">
                      +{gap} gap
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

function ProgressRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-[11px] text-faint">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 text-right text-[11px] tabular text-muted">{value}%</span>
    </div>
  );
}
