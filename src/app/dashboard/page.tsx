import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatTile, Card, CardHeader } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { RiskDonut, HBarChart, VBarChart, TrendLine } from "@/components/charts/charts";
import { Reveal } from "@/components/ui/reveal";
import {
  platformStats,
  riskDistribution,
  projectsByState,
  projectsBySector,
  anomaliesByCategory,
  riskOverTime,
  topFlagged,
} from "@/lib/data/queries";
import { formatINR, formatIndianNumber } from "@/lib/utils";
import { RISK_META } from "@/lib/risk/config";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Intelligence Dashboard" };

export default function DashboardPage() {
  const stats = platformStats();
  const dist = riskDistribution();
  const byState = projectsByState().map((s) => ({
    ...s,
    sanctionedCr: Math.round(s.sanctioned / 1e7),
  }));
  const bySector = projectsBySector();
  const anomalies = anomaliesByCategory().slice(0, 7);
  const trend = riskOverTime();
  const flagged = topFlagged(6);

  const tiles = [
    { label: "Total Projects", value: formatIndianNumber(stats.totalProjects) },
    { label: "Total Sanctioned", value: formatINR(stats.totalSanctioned, { compact: true }) },
    { label: "Total Utilized", value: formatINR(stats.totalExpenditure, { compact: true }) },
    { label: "Utilization", value: `${stats.utilizationPct.toFixed(0)}%`, tone: "accent" as const },
    { label: "High Risk", value: formatIndianNumber(stats.highRisk), tone: "high" as const },
    { label: "Critical Risk", value: formatIndianNumber(stats.criticalRisk), tone: "critical" as const },
    { label: "Anomalies", value: formatIndianNumber(stats.anomalies), tone: "high" as const },
    { label: "Pending Verification", value: formatIndianNumber(stats.pendingVerification) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Intelligence Console"
        title="MPLADS Risk Dashboard"
        description="A live overview of monitored works, fund utilisation, risk distribution and detected anomalies across the platform's demo dataset."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
        ]}
        action={
          <ButtonLink href="/projects" variant="secondary" size="sm">
            Open Project Explorer <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Metric tiles */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.03}>
              <StatTile label={t.label} value={t.value} tone={t.tone} />
            </Reveal>
          ))}
        </div>

        {/* Charts grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader title="Risk Distribution" subtitle="Works by risk level" />
            <div className="px-4 pb-4">
              <RiskDonut data={dist} />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {dist.map((d) => (
                  <div key={d.level} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className={`${RISK_META[d.level].text}`}>
                        {RISK_META[d.level].symbol}
                      </span>
                      {RISK_META[d.level].label}
                    </span>
                    <span className="tabular font-semibold text-fg">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader
              title="Projects by State"
              subtitle="Top states by number of monitored works"
            />
            <div className="px-2 pb-4">
              <HBarChart data={byState} dataKey="count" categoryKey="state" />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader title="Projects by Sector" subtitle="Sector composition" />
            <div className="px-2 pb-4">
              <VBarChart
                data={bySector}
                bars={[{ key: "count", name: "Projects" }]}
                categoryKey="sector"
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Average Risk Over Time" subtitle="By financial year" />
            <div className="px-2 pb-4">
              <TrendLine data={trend} dataKey="avgRisk" categoryKey="fy" />
            </div>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader
              title="Anomalies by Category"
              subtitle="Detected flags across all works"
            />
            <div className="px-2 pb-4">
              <VBarChart
                data={anomalies}
                bars={[{ key: "count", name: "Flags", color: "hsl(24 94% 56%)" }]}
                categoryKey="category"
                height={260}
              />
            </div>
          </Card>
        </div>

        {/* Top flagged */}
        <Card className="mt-6">
          <CardHeader
            title="Priority Works for Verification"
            subtitle="Highest composite risk scores"
            action={
              <ButtonLink href="/investigation" variant="ghost" size="sm">
                Investigation Center <ArrowRight className="h-3.5 w-3.5" />
              </ButtonLink>
            }
          />
          <div className="divide-y divide-border border-t border-border">
            {flagged.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-surface-2/50"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-fg">{p.name}</div>
                  <div className="truncate text-xs text-faint">
                    #{p.id} · {p.district}, {p.stateName} · {p.sector}
                  </div>
                </div>
                <RiskBadge level={p.risk.riskLevel} score={p.risk.totalScore} />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
