import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { UnifiedAnalysis, type UnifiedReport } from "@/components/unified/unified-analysis";
import {
  platformStats,
  riskDistribution,
  anomaliesByCategory,
  projectsBySector,
  topFlagged,
} from "@/lib/data/queries";
import { getProvider } from "@/lib/mplads/provider";
import { NATIONAL } from "@/lib/data/national";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Unified Analysis" };

export default function UnifiedPage() {
  const { t } = getT();
  const stats = platformStats();
  const report: UnifiedReport = {
    generatedAt: new Date().toISOString(),
    national: {
      annualAllocationCr: NATIONAL.annualAllocationCr,
      totalMps: NATIONAL.totalMps,
      statesUts: NATIONAL.statesUts,
      releasedSince1993Cr: NATIONAL.releasedSince1993Cr,
      source: NATIONAL.source,
    },
    stats: {
      totalProjects: stats.totalProjects,
      totalSanctioned: stats.totalSanctioned,
      totalExpenditure: stats.totalExpenditure,
      utilizationPct: stats.utilizationPct,
      highRisk: stats.highRisk,
      criticalRisk: stats.criticalRisk,
      anomalies: stats.anomalies,
      statesMonitored: stats.statesMonitored,
    },
    dist: riskDistribution(),
    anomalies: anomaliesByCategory(),
    sectors: projectsBySector(),
    agencies: getProvider()
      .getAgencies()
      .filter((a) => a.projectsCount > 0)
      .sort((a, b) => b.anomalies - a.anomalies)
      .slice(0, 6)
      .map((a) => ({
        name: a.name,
        anomalies: a.anomalies,
        projectsCount: a.projectsCount,
        riskLevel: a.riskLevel,
      })),
    flagged: topFlagged(10).map((p) => ({
      id: p.id,
      name: p.name,
      district: p.district,
      stateName: p.stateName,
      score: p.risk.totalScore,
      level: p.risk.riskLevel,
      sanctioned: p.financial.sanctionedAmount,
    })),
  };

  return (
    <>
      <PageHeader
        eyebrow={t("nav.platform")}
        title={t("nav.unified")}
        description="One cross-signal view combining every detector, agency and priority work — with a downloadable detailed analysis report (PDF/JSON)."
        breadcrumb={[
          { label: t("common.home"), href: "/" },
          { label: t("nav.unified"), href: "/unified" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <UnifiedAnalysis report={report} />
      </div>
    </>
  );
}
