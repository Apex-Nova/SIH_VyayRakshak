import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InspectionMode } from "@/components/inspection/inspection-mode";
import { topFlagged } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Field Inspection Mode" };

export default function InspectionPage() {
  const assigned = topFlagged(1)[0];
  return (
    <>
      <PageHeader
        eyebrow="Field Inspector"
        title="Field Inspection Mode"
        description="A mobile-first verification workflow for the assigned work. Complete the checklist and record a verdict."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Inspection", href: "/inspection" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <InspectionMode project={assigned} />
      </div>
    </>
  );
}
