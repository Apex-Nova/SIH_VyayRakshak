import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { StatTile, Card, CardHeader } from "@/components/ui/card";
import { VBarChart, TrendLine } from "@/components/charts/charts";
import { Reveal } from "@/components/ui/reveal";
import {
  platformStats,
  expenditureByState,
  expenditureByYear,
  marchRushShare,
} from "@/lib/data/queries";
import { formatINR } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Financial Intelligence" };

export default function FinancialPage() {
  const stats = platformStats();
  const byState = expenditureByState();
  const byYear = expenditureByYear();
  const march = marchRushShare();

  return (
    <>
      <PageHeader
        eyebrow="Data"
        title="Financial Intelligence"
        description="Sanctions, releases, expenditure and utilisation across the platform — with end-of-year spend concentration surfaced."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Financial", href: "/financial" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatTile label="Sanctioned" value={formatINR(stats.totalSanctioned, { compact: true })} />
          <StatTile label="Released" value={formatINR(stats.totalReleased, { compact: true })} />
          <StatTile label="Expenditure" value={formatINR(stats.totalExpenditure, { compact: true })} />
          <StatTile label="Unspent" value={formatINR(stats.totalUnspent, { compact: true })} />
          <StatTile label="Utilization" value={`${stats.utilizationPct.toFixed(0)}%`} tone="accent" />
        </div>

        {march > 45 && (
          <Reveal>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-medium/30 bg-medium/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-medium" />
              <div>
                <div className="text-sm font-semibold text-medium">March Rush Indicator</div>
                <p className="mt-0.5 text-xs text-muted">
                  On average <strong className="text-fg">{march}%</strong> of annual
                  expenditure is concentrated in March across monitored works —
                  a pattern worth reviewing for end-of-year fund utilisation.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Sanction vs Expenditure by State" subtitle="Top states (₹ Cr)" />
            <div className="px-2 pb-4">
              <VBarChart
                data={byState}
                bars={[
                  { key: "sanctionedCr", name: "Sanctioned", color: "hsl(214 92% 60%)" },
                  { key: "expenditureCr", name: "Expenditure", color: "hsl(190 95% 52%)" },
                ]}
                categoryKey="state"
                height={320}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Yearly Expenditure Trend" subtitle="By financial year (₹ Cr)" />
            <div className="px-2 pb-4">
              <TrendLine data={byYear} dataKey="expenditureCr" categoryKey="fy" height={320} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
