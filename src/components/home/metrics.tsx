import { AnimatedCounter } from "@/components/ui/counter";
import { formatIndianNumber } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { NATIONAL } from "@/lib/data/national";
import { platformStats } from "@/lib/data/queries";
import { getT } from "@/lib/i18n/server";
import { BadgeCheck, FlaskConical } from "lucide-react";

export function Metrics() {
  const { t } = getT();
  const stats = platformStats();
  const sanctionedCr = Math.round(stats.totalSanctioned / 1e7);

  const real = [
    { value: NATIONAL.annualAllocationCr, label: t("metrics.allocation"), kind: "rupee" as const },
    { value: NATIONAL.totalMps, label: t("metrics.mps"), kind: "number" as const },
    { value: NATIONAL.statesUts, label: t("metrics.states"), kind: "number" as const },
    { value: Math.round(NATIONAL.releasedSince1993Cr), label: t("metrics.released"), kind: "rupee" as const },
  ];
  const synth = [
    { value: stats.totalProjects, label: t("metrics.analysed"), kind: "number" as const, tone: "" },
    { value: stats.highRisk + stats.criticalRisk, label: t("metrics.flagged"), kind: "number" as const, tone: "text-high" },
    { value: stats.anomalies, label: t("nav.aiIntelligence"), kind: "number" as const, tone: "text-medium" },
    { value: sanctionedCr, label: t("metrics.sanctioned"), kind: "rupee" as const, tone: "" },
  ];

  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl font-semibold text-fg">
            {t("metrics.title")}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {/* Real national context */}
          <Reveal>
            <div className="plate h-full p-6" data-accent="terracotta">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-low/10 px-2.5 py-1 text-[11px] font-semibold text-low ring-1 ring-low/25">
                <BadgeCheck className="h-3.5 w-3.5" /> {t("metrics.realBadge")}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                {real.map((m) => (
                  <div key={m.label} className="border-l-2 border-accent/40 pl-3">
                    <div className="font-display text-2xl font-bold tabular text-fg sm:text-3xl">
                      <AnimatedCounter value={m.value} kind={m.kind} />
                    </div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-faint">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Synthetic analysed set */}
          <Reveal delay={0.08}>
            <div className="plate h-full p-6">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-medium/10 px-2.5 py-1 text-[11px] font-semibold text-medium ring-1 ring-medium/25">
                <FlaskConical className="h-3.5 w-3.5" /> {t("metrics.synthBadge")}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                {synth.map((m) => (
                  <div key={m.label} className="border-l-2 border-accent/40 pl-3">
                    <div className={`font-display text-2xl font-bold tabular sm:text-3xl ${m.tone || "text-fg"}`}>
                      <AnimatedCounter value={m.value} kind={m.kind} />
                    </div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-faint">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-faint">
          {t("metrics.note")}
        </p>
      </div>
    </section>
  );
}
