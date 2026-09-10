import { Reveal } from "@/components/ui/reveal";
import { RiskExplainer } from "@/components/risk/risk-explainer";
import { RISK_WEIGHTS, RISK_THRESHOLDS, RISK_META } from "@/lib/risk/config";
import { topFlagged } from "@/lib/data/queries";
import { formatINR } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { DIMENSION_LABELS } from "@/lib/risk/config";
import type { RiskDimension } from "@/lib/risk/config";
import { getT } from "@/lib/i18n/server";
import { ArrowRight } from "lucide-react";

export function RiskScoring() {
  const { t } = getT();
  const sample = topFlagged(1)[0];

  return (
    <section id="risk-scoring" className="scroll-mt-20 border-y border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-2">
            {t("risk.eyebrow")}
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {t("risk.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {t("risk.body")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="plate p-6">
              <h3 className="font-display text-base font-semibold text-fg">
                {t("risk.model")}
              </h3>
              <p className="mt-1 text-xs text-muted">{t("risk.modelNote")}</p>
              <div className="mt-5 space-y-3">
                {(Object.keys(RISK_WEIGHTS) as RiskDimension[]).map((k) => (
                  <div key={k}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted">{DIMENSION_LABELS[k]}</span>
                      <span className="tabular font-semibold text-fg">
                        {(RISK_WEIGHTS[k] * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${RISK_WEIGHTS[k] * 100 * 3}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {RISK_THRESHOLDS.map((th) => (
                  <div
                    key={th.level}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs"
                  >
                    <span className={`font-semibold ${RISK_META[th.level].text}`}>
                      {RISK_META[th.level].symbol} {t(`riskLevels.${th.level}`)}
                    </span>
                    <span className="tabular text-faint">
                      {th.min}–{th.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="plate p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-faint">
                    {t("risk.sampleLabel")}
                  </div>
                  <h3 className="mt-1 max-w-md font-display text-base font-semibold text-fg">
                    {sample.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">
                    #{sample.id} · {sample.district}, {sample.stateName} ·{" "}
                    {formatINR(sample.sanctionedAmount, { compact: true })}
                  </p>
                </div>
                <ButtonLink href={`/projects/${sample.id}`} variant="secondary" size="sm">
                  {t("risk.openDossier")} <ArrowRight className="h-3.5 w-3.5" />
                </ButtonLink>
              </div>
              <RiskExplainer risk={sample.risk} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
