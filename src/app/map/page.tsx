import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { IndiaMap } from "@/components/maps/india-map";
import { allProjects, districtIntel } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Geospatial Intelligence" };

export default function MapPage() {
  const districts = districtIntel();
  const projectPoints = allProjects().map((p) => ({
    id: p.id,
    mapX: p.mapX,
    mapY: p.mapY,
    level: p.risk.riskLevel,
    name: p.name,
    score: p.risk.totalScore,
    district: p.district,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Geospatial Intelligence"
        title="See Risk Across the Map"
        description="Districts, works and risk clusters on a stylised national canvas. Filter by risk, toggle individual works, and drill into any district for its intelligence panel."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Geospatial", href: "/map" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <IndiaMap districts={districts} projectPoints={projectPoints} />
      </div>
    </>
  );
}
