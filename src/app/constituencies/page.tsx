import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ConstituencyExplorer } from "@/components/constituencies/constituency-explorer";
import { constituencyIntel } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Constituency Intelligence" };

export default function ConstituenciesPage() {
  const rows = constituencyIntel();
  const states = Array.from(
    new Map(rows.map((r) => [r.stateId, r.stateName])).entries()
  )
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHeader
        eyebrow="Data"
        title="Constituency Intelligence"
        description="Select a state and constituency to view its works, funds, utilisation, completion and risk profile."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Constituencies", href: "/constituencies" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ConstituencyExplorer rows={rows} states={states} />
      </div>
    </>
  );
}
