import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Explainer Showcase" };

export default function ShowcasePage() {
  const { t } = getT();
  return (
    <>
      <PageHeader
        eyebrow="Team Synaptix · SIH26102"
        title="Interactive Explainer"
        description="A six-scene motion walkthrough of the VyayRakshak pipeline — problem, conveyor transformation, the nine detectors, evidence hashing, the competitive edge, and the pitch."
        breadcrumb={[
          { label: t("common.home"), href: "/" },
          { label: "Explainer", href: "/showcase" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <iframe
          src="/explainer-embed.html"
          title="VyayRakshak interactive explainer"
          className="aspect-video min-h-[440px] w-full border-0 bg-transparent"
          style={{ background: "transparent" }}
          loading="lazy"
        />
        <p className="mt-3 text-center text-xs text-faint">
          Built by Team Synaptix for Smart India Hackathon 2026 · Problem Statement
          SIH26102.
        </p>
      </div>
    </>
  );
}
