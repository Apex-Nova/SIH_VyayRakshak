import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import {
  ProjectExplorer,
  type ProjectRow,
} from "@/components/projects/project-explorer";
import { allProjects } from "@/lib/data/queries";
import { getProvider } from "@/lib/mplads/provider";
import type { RiskLevel } from "@/lib/types";

export const metadata: Metadata = { title: "Project Explorer" };

function toRow(p: ReturnType<typeof allProjects>[number]): ProjectRow {
  return {
    id: p.id,
    name: p.name,
    district: p.district,
    stateName: p.stateName,
    stateId: p.stateId,
    sector: p.sector,
    status: p.status,
    sanctioned: p.financial.sanctionedAmount,
    expenditure: p.financial.expenditure,
    physical: p.progress.physicalProgress,
    score: p.risk.totalScore,
    level: p.risk.riskLevel,
  };
}

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const projects = allProjects();
  const rows = projects.map(toRow);
  const states = getProvider()
    .getStates()
    .filter((s) => projects.some((p) => p.stateId === s.id))
    .map((s) => ({ id: s.id, name: s.name }));
  const sectors = Array.from(new Set(projects.map((p) => p.sector))).sort();
  const statuses = Array.from(new Set(projects.map((p) => p.status)));
  const initialLevel = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(
    (searchParams.level ?? "").toUpperCase()
  )
    ? (searchParams.level!.toUpperCase() as RiskLevel)
    : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Data"
        title="Project Explorer"
        description="Search, filter and sort all monitored MPLADS works. Click any row to open its full risk dossier."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ProjectExplorer
          rows={rows}
          states={states}
          sectors={sectors}
          statuses={statuses}
          initialLevel={initialLevel}
        />
      </div>
    </>
  );
}
