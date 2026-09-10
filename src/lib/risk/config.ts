// ─── Configurable risk-scoring model ────────────────────────────────────────
// Weights are intentionally externalised. The UI reads these values rather than
// hard-coding percentages, so the scoring model can be re-tuned centrally.

import type { RiskLevel } from "../types";

export const RISK_WEIGHTS = {
  financial: 0.25,
  progress: 0.2,
  cost: 0.15,
  timeline: 0.15,
  evidence: 0.1,
  agency: 0.1,
  geospatial: 0.05,
} as const;

export type RiskDimension = keyof typeof RISK_WEIGHTS;

export const RISK_THRESHOLDS: { level: RiskLevel; min: number; max: number }[] = [
  { level: "LOW", min: 0, max: 24 },
  { level: "MEDIUM", min: 25, max: 49 },
  { level: "HIGH", min: 50, max: 74 },
  { level: "CRITICAL", min: 75, max: 100 },
];

export function levelForScore(score: number): RiskLevel {
  const s = Math.round(score);
  for (const t of RISK_THRESHOLDS) {
    if (s >= t.min && s <= t.max) return t.level;
  }
  return "CRITICAL";
}

export const RISK_META: Record<
  RiskLevel,
  { label: string; token: string; symbol: string; ring: string; text: string }
> = {
  LOW: {
    label: "Low",
    token: "low",
    symbol: "●",
    ring: "ring-low/40",
    text: "text-low",
  },
  MEDIUM: {
    label: "Medium",
    token: "medium",
    symbol: "◆",
    ring: "ring-medium/40",
    text: "text-medium",
  },
  HIGH: {
    label: "High",
    token: "high",
    symbol: "▲",
    ring: "ring-high/40",
    text: "text-high",
  },
  CRITICAL: {
    label: "Critical",
    token: "critical",
    symbol: "■",
    ring: "ring-critical/40",
    text: "text-critical",
  },
};

export const DIMENSION_LABELS: Record<RiskDimension, string> = {
  financial: "Financial anomaly",
  progress: "Progress mismatch",
  cost: "Cost outlier",
  timeline: "Timeline delay",
  evidence: "Evidence inconsistency",
  agency: "Agency history",
  geospatial: "Geospatial signal",
};
