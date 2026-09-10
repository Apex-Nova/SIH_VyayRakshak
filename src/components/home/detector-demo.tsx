"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type DetectorKey =
  | "financial"
  | "progress"
  | "cost"
  | "duplicate"
  | "delay"
  | "evidence"
  | "agency"
  | "geospatial"
  | "march";

interface Field {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
}

interface DetectorSpec {
  fields: Field[];
  evaluate: (v: Record<string, number>) => {
    triggered: boolean;
    score: number;
    verdict: string;
    detail: string;
  };
}

const SPECS: Record<DetectorKey, DetectorSpec> = {
  financial: {
    fields: [
      { key: "util", label: "Utilization (expenditure / sanctioned)", min: 40, max: 180, step: 1, default: 128, unit: "%" },
      { key: "march", label: "Share of annual spend in March", min: 0, max: 100, step: 1, default: 62, unit: "%" },
    ],
    evaluate: (v) => {
      const score = Math.min(100, Math.max(0, (v.util - 100) * 2 + (v.march - 40) * 0.9));
      return {
        triggered: v.util > 120 || v.march > 55,
        score: Math.round(score),
        verdict: v.util > 120 ? "OVER_DISBURSEMENT" : v.march > 55 ? "MARCH_RUSH" : "WITHIN_BOUNDS",
        detail:
          v.util > 120
            ? `Expenditure at ${v.util}% of sanctioned exceeds the 120% threshold.`
            : v.march > 55
            ? `${v.march}% of the year's spend concentrated in March.`
            : "Expenditure pattern within expected bounds.",
      };
    },
  },
  progress: {
    fields: [
      { key: "fin", label: "Reported financial completion", min: 0, max: 100, step: 1, default: 82, unit: "%" },
      { key: "phys", label: "Verified physical progress", min: 0, max: 100, step: 1, default: 43, unit: "%" },
    ],
    evaluate: (v) => {
      const gap = v.fin - v.phys;
      return {
        triggered: gap > 20,
        score: Math.round(Math.min(100, Math.max(0, gap * 1.6))),
        verdict: gap > 20 ? "PROGRESS_MISMATCH" : "ALIGNED",
        detail:
          gap > 20
            ? `Financial ${v.fin}% vs physical ${v.phys}% → ${gap}-point mismatch.`
            : "Financial and physical progress broadly aligned.",
      };
    },
  },
  cost: {
    fields: [
      { key: "cost", label: "Unit cost vs peer median", min: 40, max: 260, step: 1, default: 168, unit: "%" },
    ],
    evaluate: (v) => {
      const dev = Math.abs(v.cost - 100);
      return {
        triggered: dev > 40,
        score: Math.round(Math.min(100, Math.max(0, (dev - 15) * 1.4))),
        verdict: dev > 40 ? "COST_OUTLIER" : "AT_PAR",
        detail:
          dev > 40
            ? `Cost is ${v.cost}% of the comparable-works median — outlier.`
            : "Cost consistent with comparable works.",
      };
    },
  },
  duplicate: {
    fields: [
      { key: "sim", label: "Description similarity", min: 0, max: 100, step: 1, default: 92, unit: "%" },
      { key: "dist", label: "Distance to nearest similar work", min: 0, max: 5000, step: 50, default: 120, unit: " m" },
    ],
    evaluate: (v) => {
      const trig = v.sim > 80 && v.dist < 300;
      return {
        triggered: trig,
        score: Math.round(Math.min(100, v.sim - v.dist / 30)),
        verdict: trig ? "POTENTIAL_DUPLICATE" : "DISTINCT",
        detail: trig
          ? `${v.sim}% text similarity within ${v.dist} m — potential duplicate work.`
          : "No duplicate-work signal from text + proximity.",
      };
    },
  },
  delay: {
    fields: [
      { key: "delay", label: "Days behind schedule", min: 0, max: 800, step: 10, default: 320 },
      { key: "dur", label: "Planned duration (days)", min: 90, max: 900, step: 10, default: 365 },
    ],
    evaluate: (v) => {
      const ratio = v.delay / v.dur;
      const score = Math.round(Math.min(100, ratio * 130));
      const level = score > 75 ? "CRITICAL" : score > 50 ? "HIGH" : score > 25 ? "MEDIUM" : "LOW";
      return {
        triggered: score > 50,
        score,
        verdict: `DELAY_RISK: ${level}`,
        detail: `${v.delay} days behind on a ${v.dur}-day plan (${Math.round(ratio * 100)}% overrun).`,
      };
    },
  },
  evidence: {
    fields: [
      { key: "sim", label: "Image similarity to another submission", min: 0, max: 100, step: 1, default: 91, unit: "%" },
    ],
    evaluate: (v) => ({
      triggered: v.sim > 85,
      score: Math.round(Math.min(100, Math.max(0, (v.sim - 60) * 2))),
      verdict: v.sim > 85 ? "POSSIBLE_REUSE" : "DISTINCT_EVIDENCE",
      detail:
        v.sim > 85
          ? `${v.sim}% similarity flags potential photo reuse across works.`
          : "Evidence appears distinct.",
    }),
  },
  agency: {
    fields: [
      { key: "rate", label: "Historical anomaly rate", min: 0, max: 100, step: 1, default: 48, unit: "%" },
      { key: "delayed", label: "Share of delayed projects", min: 0, max: 100, step: 1, default: 44, unit: "%" },
    ],
    evaluate: (v) => {
      const score = Math.round((v.rate * 0.6 + v.delayed * 0.4));
      return {
        triggered: score > 40,
        score,
        verdict: score > 40 ? "ELEVATED_AGENCY_RISK" : "WITHIN_NORMS",
        detail: `${v.rate}% anomaly rate and ${v.delayed}% delayed works across the agency's portfolio.`,
      };
    },
  },
  geospatial: {
    fields: [
      { key: "cluster", label: "Risk density in 10 km cell", min: 0, max: 100, step: 1, default: 71, unit: "%" },
    ],
    evaluate: (v) => ({
      triggered: v.cluster > 60,
      score: v.cluster,
      verdict: v.cluster > 60 ? "RISK_CLUSTER" : "DISPERSED",
      detail:
        v.cluster > 60
          ? `${v.cluster}% of works in this cell are flagged — geographic risk cluster.`
          : "Risk is geographically dispersed.",
    }),
  },
  march: {
    fields: [
      { key: "march", label: "Share of annual spend in March", min: 0, max: 100, step: 1, default: 78, unit: "%" },
    ],
    evaluate: (v) => ({
      triggered: v.march > 60,
      score: Math.round(Math.min(100, Math.max(0, (v.march - 30) * 1.4))),
      verdict: v.march > 60 ? "MARCH_RUSH" : "STEADY_SPEND",
      detail:
        v.march > 60
          ? `${v.march}% of the year's spend concentrated in March — fiscal year-end rush (our own signal).`
          : "Spend is distributed across the year.",
    }),
  },
};

export function DetectorDemo({ detector }: { detector: DetectorKey }) {
  const spec = SPECS[detector];
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(spec.fields.map((f) => [f.key, f.default]))
  );
  const result = useMemo(() => spec.evaluate(values), [spec, values]);

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {spec.fields.map((f) => (
          <div key={f.key}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <label className="font-medium text-muted">{f.label}</label>
              <span className="tabular font-semibold text-fg">
                {values[f.key]}
                {f.unit ?? ""}
              </span>
            </div>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={values[f.key]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))
              }
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-accent"
              aria-label={f.label}
            />
          </div>
        ))}
      </div>

      <motion.div
        key={result.triggered ? "flag" : "ok"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-xl border p-4",
          result.triggered
            ? "border-high/40 bg-high/10"
            : "border-low/40 bg-low/10"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {result.triggered ? (
              <AlertTriangle className="h-4 w-4 text-high" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-low" />
            )}
            <span
              className={cn(
                "font-mono text-xs font-semibold",
                result.triggered ? "text-high" : "text-low"
              )}
            >
              {result.verdict}
            </span>
          </div>
          <span className="tabular text-sm font-bold text-fg">
            {result.score}/100
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className={cn(
              "h-full rounded-full",
              result.triggered ? "bg-high" : "bg-low"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${result.score}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-muted">
          {result.detail}
        </p>
      </motion.div>

      <p className="text-[11px] leading-relaxed text-faint">
        This detector produces a decision-support signal for human verification.
        It does not determine fraud.
      </p>
    </div>
  );
}
