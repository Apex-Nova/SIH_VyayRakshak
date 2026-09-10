import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { getT } from "@/lib/i18n/server";
import { NATIONAL, SYSTEM_INFO } from "@/lib/data/national";
import { platformStats } from "@/lib/data/queries";
import { formatINR, formatIndianNumber } from "@/lib/utils";
import { BadgeCheck, FlaskConical, Lock, Info } from "lucide-react";

export const metadata: Metadata = { title: "Data & Sourcing" };

export default function DataSourcingPage() {
  const { t } = getT();
  const stats = platformStats();

  const real = [
    { v: `₹${formatIndianNumber(NATIONAL.annualAllocationCr)} Cr`, l: t("metrics.allocation") },
    { v: `${NATIONAL.totalMps}`, l: `${t("metrics.mps")} (${NATIONAL.lokSabha}+${NATIONAL.rajyaSabha})` },
    { v: `${NATIONAL.statesUts}`, l: t("metrics.states") },
    { v: `₹${formatIndianNumber(NATIONAL.releasedSince1993Cr)} Cr`, l: t("metrics.released") },
  ];
  const synth = [
    { v: formatIndianNumber(stats.totalProjects), l: t("metrics.analysed") },
    { v: formatIndianNumber(stats.highRisk + stats.criticalRisk), l: t("metrics.flagged") },
    { v: `${stats.statesMonitored}`, l: t("metrics.states") },
    { v: formatINR(stats.totalSanctioned, { compact: true }), l: t("metrics.sanctioned") },
  ];

  return (
    <div data-accent="terracotta">
      <PageHeader
        eyebrow={t("data.eyebrow")}
        title={t("data.title")}
        breadcrumb={[
          { label: t("common.home"), href: "/" },
          { label: t("data.title"), href: "/data-sourcing" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Real */}
          <div className="plate p-6">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-low/10 px-2.5 py-1 text-xs font-semibold text-low ring-1 ring-low/25">
              <BadgeCheck className="h-4 w-4" /> {t("data.realTitle")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {real.map((m) => (
                <div key={m.l} className="border-l-2 border-accent/40 pl-3">
                  <div className="font-display text-2xl font-bold tabular text-fg">{m.v}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wide text-faint">{m.l}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">{t("data.realNote")}</p>
            <p className="mt-2 text-[11px] text-faint">Source: {NATIONAL.source}</p>
          </div>

          {/* Synthetic */}
          <div className="plate p-6">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-medium/10 px-2.5 py-1 text-xs font-semibold text-medium ring-1 ring-medium/25">
              <FlaskConical className="h-4 w-4" /> {t("data.synthTitle")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {synth.map((m) => (
                <div key={m.l} className="border-l-2 border-accent/40 pl-3">
                  <div className="font-display text-2xl font-bold tabular text-fg">{m.v}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wide text-faint">{m.l}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">{t("data.synthNote")}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="plate p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-fg">
              <Info className="h-4 w-4 text-accent" /> {t("data.whyTitle")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t("data.whyBody")}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-md bg-surface-2 px-2 py-1 text-muted ring-1 ring-border">
                Scheme since {NATIONAL.schemeSince}
              </span>
              <span className="rounded-md bg-surface-2 px-2 py-1 text-muted ring-1 ring-border">
                eSAKSHI live {NATIONAL.esakshiLive}
              </span>
              <span className="rounded-md bg-surface-2 px-2 py-1 text-muted ring-1 ring-border">
                {NATIONAL.utilisationSince1993Pct}% utilised since 1993
              </span>
            </div>
          </div>

          <div className="plate p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-fg">
              <Lock className="h-4 w-4 text-accent" /> {t("data.archTitle")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t("data.archBody")}</p>
            <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-2/50 p-3 font-mono text-[11px] text-muted">
              <div>mode: <span className="text-accent-2">{SYSTEM_INFO.mode}</span></div>
              <div>provider: {SYSTEM_INFO.provider}</div>
              <div>last_sync: {SYSTEM_INFO.lastSync}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
