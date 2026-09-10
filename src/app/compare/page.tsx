import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CompareWorks, type CompareRow } from "@/components/compare/compare-works";
import { allProjects, topFlagged } from "@/lib/data/queries";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Compare Works" };

export default function ComparePage() {
  const { t } = getT();
  // Offer the flagged works first, then the rest, so the picker leads with signal.
  const flagged = topFlagged(40);
  const flaggedIds = new Set(flagged.map((p) => p.id));
  const rest = allProjects().filter((p) => !flaggedIds.has(p.id)).slice(0, 80);
  const rows: CompareRow[] = [...flagged, ...rest].map((p) => ({
    id: p.id,
    name: p.name,
    district: p.district,
    stateName: p.stateName,
    score: p.risk.totalScore,
    level: p.risk.riskLevel,
    sanctioned: p.financial.sanctionedAmount,
    expenditure: p.financial.expenditure,
    utilization: Math.round(p.financial.utilizationPercentage),
    physical: p.progress.physicalProgress,
    reported: p.progress.reportedProgress,
    delayDays: p.progress.delayDays,
    agencyName: p.agencyName,
    anomalies: p.risk.anomalies.length,
    topFactor: p.risk.factors[0]?.label ?? "—",
  }));

  return (
    <>
      <PageHeader
        eyebrow={t("nav.data")}
        title={t("nav.compare")}
        description="Put any two works side by side. Worse values on comparable metrics are highlighted."
        breadcrumb={[
          { label: t("common.home"), href: "/" },
          { label: t("nav.compare"), href: "/compare" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <CompareWorks rows={rows} />
      </div>
    </>
  );
}
