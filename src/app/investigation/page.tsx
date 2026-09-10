import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InvestigationCenter } from "@/components/investigation/investigation-center";
import { topFlagged } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Investigation Center" };

export default function InvestigationPage() {
  const flagged = topFlagged(16);
  return (
    <>
      <PageHeader
        eyebrow="Investigation Center"
        title="Prioritised cases for verification"
        description="Every case here is a decision-support signal for human review. Generate an AI dossier, dispatch a field team, and move cases through detect → explain → review → verify → resolve."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Investigation", href: "/investigation" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <InvestigationCenter projects={flagged} />
      </div>
    </>
  );
}
