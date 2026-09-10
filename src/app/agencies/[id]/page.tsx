import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { StatTile, Card, CardHeader } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { VBarChart } from "@/components/charts/charts";
import { getProvider } from "@/lib/mplads/provider";
import { allProjects } from "@/lib/data/queries";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = { title: "Agency Profile" };

export default function AgencyProfilePage({ params }: { params: { id: string } }) {
  const agency = getProvider()
    .getAgencies()
    .find((a) => slugify(a.id) === params.id);
  if (!agency) notFound();

  const projects = allProjects().filter((p) => p.agencyId === agency.id);
  const sectorCounts = new Map<string, number>();
  projects.forEach((p) => sectorCounts.set(p.sector, (sectorCounts.get(p.sector) ?? 0) + 1));
  const sectorData = Array.from(sectorCounts.entries()).map(([sector, count]) => ({
    sector,
    count,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Agency Profile"
        title={agency.name}
        description={`${agency.type} · implementing ${agency.projectsCount} monitored works.`}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Agencies", href: "/agencies" },
          { label: agency.name, href: `/agencies/${params.id}` },
        ]}
        action={<RiskBadge level={agency.riskLevel} />}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatTile label="Projects" value={agency.projectsCount} />
          <StatTile label="Completed" value={agency.completed} tone="low" />
          <StatTile label="Delayed" value={agency.delayed} tone="high" />
          <StatTile label="Avg. Completion" value={`${agency.avgCompletionDays}d`} />
          <StatTile label="Anomalies" value={agency.anomalies} tone="high" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Portfolio by Sector" subtitle="Works implemented" />
            <div className="px-2 pb-4">
              <VBarChart data={sectorData} bars={[{ key: "count", name: "Works" }]} categoryKey="sector" />
            </div>
          </Card>
          <Card>
            <CardHeader title="Highest-Risk Works" subtitle="Prioritised for verification" />
            <div className="divide-y divide-border border-t border-border">
              {[...projects]
                .sort((a, b) => b.risk.totalScore - a.risk.totalScore)
                .slice(0, 6)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-surface-2/40"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm text-fg">{p.name}</div>
                      <div className="text-[11px] text-faint">
                        #{p.id} · {p.district}
                      </div>
                    </div>
                    <RiskBadge level={p.risk.riskLevel} score={p.risk.totalScore} showSymbol={false} />
                  </Link>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
