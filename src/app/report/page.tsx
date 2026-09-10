import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ReportForm } from "@/components/report/report-form";

export const metadata: Metadata = { title: "Report Anonymously" };

export default function ReportPage() {
  return (
    <>
      <PageHeader
        eyebrow="Citizen Participation"
        title="Report Anonymously"
        description="Flag a concern about any MPLADS work. Your identity is not required. Reports feed into the human review workflow."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Report", href: "/report" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <ReportForm />
      </div>
    </>
  );
}
