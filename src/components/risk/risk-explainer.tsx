"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import type { RiskAssessment } from "@/lib/types";
import { RISK_META } from "@/lib/risk/config";
import { RiskBadge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function RiskGauge({
  score,
  level,
  size = 160,
}: {
  score: number;
  level: keyof typeof RISK_META;
  size?: number;
}) {
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const token = RISK_META[level].token;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--surface-2))"
          strokeWidth="10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`hsl(var(--${token}))`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * score) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold tabular", RISK_META[level].text)}>
          {score}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-faint">
          / 100
        </span>
      </div>
    </div>
  );
}

export function RiskExplainer({
  risk,
  title,
  compact = false,
}: {
  risk: RiskAssessment;
  title?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const maxContribution = Math.max(...risk.factors.map((f) => f.contribution), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      {/* Gauge */}
      <div className="flex flex-col items-center gap-3">
        <RiskGauge score={risk.totalScore} level={risk.riskLevel} />
        <RiskBadge level={risk.riskLevel} />
        <div className="text-[11px] text-faint">
          {t("risk.confidence")} {(risk.confidence * 100).toFixed(0)}%
        </div>
      </div>

      {/* Factor breakdown */}
      <div>
        {title && (
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">
            {title}
          </h4>
        )}
        <div className="space-y-2.5">
          {risk.factors.map((f, i) => (
            <div key={f.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-fg">{f.label}</span>
                <span className="tabular font-semibold text-accent">
                  +{f.contribution}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-2 to-accent"
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${(f.contribution / maxContribution) * 100}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />
              </div>
              {!compact && (
                <p className="mt-1 text-[11px] leading-relaxed text-faint">
                  {f.detail}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Anomalies */}
        {risk.anomalies.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">
              {t("risk.irregularities")}
            </h4>
            <ul className="space-y-1.5">
              {risk.anomalies.map((a) => (
                <li
                  key={a.category}
                  className="flex items-start gap-2 rounded-lg border border-high/20 bg-high/5 px-3 py-2 text-xs"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-high" />
                  <span>
                    <span className="font-semibold text-fg">{a.label}</span>
                    <span className="text-muted"> — {a.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-accent/30 bg-accent/5 p-4">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div>
            <div className="text-xs font-semibold text-fg">{t("risk.recommended")}</div>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {risk.recommendation}
            </p>
            <p className="mt-2 text-[11px] italic text-faint">{t("risk.disclaimer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
