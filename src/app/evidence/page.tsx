import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EvidenceCenter } from "@/components/evidence/evidence-center";
import { evidenceRecords } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Evidence Center" };

export default function EvidencePage() {
  const records = evidenceRecords(12);
  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="Evidence Center"
        description="Verify geotagged photographs and documents. Compare timestamps, geolocation and image similarity to surface potential reuse or mismatched evidence — all for human confirmation."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Evidence", href: "/evidence" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/evidence.jpg"
          alt="Two completion photographs matched by perceptual hash"
          className="mb-8 w-full rounded-2xl plate"
          loading="lazy"
        />
        <EvidenceCenter records={records} />
      </div>
    </>
  );
}
