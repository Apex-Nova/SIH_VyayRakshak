import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { RiskBadge } from "@/components/ui/badge";
import { getProvider } from "@/lib/mplads/provider";
import { slugify } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Agency Intelligence" };

export default function AgenciesPage() {
  const agencies = getProvider()
    .getAgencies()
    .filter((a) => a.projectsCount > 0)
    .sort((a, b) => b.anomalies - a.anomalies);

  return (
    <>
      <PageHeader
        eyebrow="Data"
        title="Agency Intelligence"
        description="Historical performance by implementing agency — completion, delays, cost variance and anomaly counts."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Agencies", href: "/agencies" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/50 text-xs uppercase tracking-wider text-faint">
                  <th className="px-4 py-2.5 font-medium">Agency</th>
                  <th className="px-3 py-2.5 text-right font-medium">Projects</th>
                  <th className="px-3 py-2.5 text-right font-medium">Completed</th>
                  <th className="px-3 py-2.5 text-right font-medium">Delayed</th>
                  <th className="px-3 py-2.5 text-right font-medium">Avg. Days</th>
                  <th className="px-3 py-2.5 text-right font-medium">Cost Var.</th>
                  <th className="px-3 py-2.5 text-right font-medium">Anomalies</th>
                  <th className="px-3 py-2.5 text-right font-medium">Risk</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {agencies.map((a) => (
                  <tr key={a.id} className="group transition-colors hover:bg-surface-2/40">
                    <td className="px-4 py-2.5">
                      <Link href={`/agencies/${slugify(a.id)}`} className="block">
                        <div className="font-medium text-fg group-hover:text-accent">
                          {a.name}
                        </div>
                        <div className="text-[11px] text-faint">{a.type}</div>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular text-muted">{a.projectsCount}</td>
                    <td className="px-3 py-2.5 text-right tabular text-low">{a.completed}</td>
                    <td className="px-3 py-2.5 text-right tabular text-high">{a.delayed}</td>
                    <td className="px-3 py-2.5 text-right tabular text-muted">{a.avgCompletionDays}</td>
                    <td className="px-3 py-2.5 text-right tabular text-muted">
                      {a.avgCostVariance > 0 ? "+" : ""}
                      {a.avgCostVariance}%
                    </td>
                    <td className="px-3 py-2.5 text-right tabular text-muted">{a.anomalies}</td>
                    <td className="px-3 py-2.5 text-right">
                      <RiskBadge level={a.riskLevel} showSymbol={false} />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Link
                        href={`/agencies/${slugify(a.id)}`}
                        className="inline-flex text-faint transition-colors group-hover:text-accent"
                        aria-label={`Open ${a.name}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
