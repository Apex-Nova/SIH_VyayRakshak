// ─── Risk scoring service ────────────────────────────────────────────────────
// Produces an explainable 0–100 risk score from multiple weighted signals.
// Each dimension yields a normalised 0–100 sub-score; the weighted blend is the
// total. Every point is attributable to a factor with a human-readable reason.

import type {
  AnomalyFlag,
  RiskAssessment,
  RiskFactor,
} from "../types";
import {
  DIMENSION_LABELS,
  RISK_WEIGHTS,
  type RiskDimension,
  levelForScore,
} from "./config";
import { clamp } from "../utils";

export interface ScoringInput {
  // Financial
  utilizationPercentage: number; // expenditure / sanctioned * 100
  marchSharePct: number; // share of annual spend in March
  // Progress
  physicalProgress: number; // %
  reportedProgress: number; // financial completion %
  // Cost
  costVsBenchmarkPct: number; // this project cost vs peer median, % (100 = at par)
  // Timeline
  delayDays: number;
  expectedDurationDays: number;
  // Evidence
  evidenceIssues: number; // count of non-verified evidence items
  evidenceCount: number;
  maxSimilarity: number; // 0..1 highest similarity to other evidence
  // Agency
  agencyAnomalyRate: number; // 0..1 historical anomaly rate of agency
  // Geospatial
  duplicateProximity: number; // 0..1, 1 = another near-identical work very close
}

function financialScore(i: ScoringInput): { score: number; detail: string } {
  // Over-disbursement (>100% utilisation) and end-of-year "March rush" are signals.
  const over = clamp((i.utilizationPercentage - 100) * 2.4, 0, 70);
  const march = clamp((i.marchSharePct - 40) * 1.1, 0, 45);
  const score = clamp(over + march, 0, 100);
  const parts: string[] = [];
  if (i.utilizationPercentage > 120)
    parts.push(`over-disbursement at ${i.utilizationPercentage.toFixed(0)}% of sanctioned`);
  if (i.marchSharePct > 55)
    parts.push(`${i.marchSharePct.toFixed(0)}% of annual spend concentrated in March`);
  return {
    score,
    detail: parts.length
      ? `Expenditure pattern flagged: ${parts.join("; ")}.`
      : "Expenditure within expected bounds.",
  };
}

function progressScore(i: ScoringInput): { score: number; detail: string } {
  const gap = i.reportedProgress - i.physicalProgress;
  const score = clamp(gap * 1.6, 0, 100);
  return {
    score,
    detail:
      gap > 15
        ? `Financial completion ${i.reportedProgress.toFixed(
            0
          )}% exceeds verified physical progress ${i.physicalProgress.toFixed(
            0
          )}% — potential progress mismatch.`
        : "Financial and physical progress broadly aligned.",
  };
}

function costScore(i: ScoringInput): { score: number; detail: string } {
  const dev = Math.abs(i.costVsBenchmarkPct - 100);
  const score = clamp((dev - 15) * 1.4, 0, 100);
  return {
    score,
    detail:
      dev > 30
        ? `Unit cost is ${i.costVsBenchmarkPct.toFixed(
            0
          )}% of the peer median for comparable works — cost outlier.`
        : "Cost consistent with comparable works.",
  };
}

function timelineScore(i: ScoringInput): { score: number; detail: string } {
  const ratio = i.expectedDurationDays
    ? i.delayDays / i.expectedDurationDays
    : 0;
  const score = clamp(ratio * 130, 0, 100);
  return {
    score,
    detail:
      i.delayDays > 60
        ? `${i.delayDays} days behind the expected completion timeline.`
        : "On or near schedule.",
  };
}

function evidenceScore(i: ScoringInput): { score: number; detail: string } {
  const issueRate = i.evidenceCount ? i.evidenceIssues / i.evidenceCount : 0;
  const reuse = clamp((i.maxSimilarity - 0.8) * 250, 0, 60);
  const score = clamp(issueRate * 70 + reuse, 0, 100);
  return {
    score,
    detail:
      i.maxSimilarity > 0.85
        ? `Photograph similarity ${(i.maxSimilarity * 100).toFixed(
            0
          )}% to another submission — potential image reuse.`
        : i.evidenceIssues > 0
        ? `${i.evidenceIssues} of ${i.evidenceCount} evidence items require review.`
        : "Evidence consistent and geotagged.",
  };
}

function agencyScore(i: ScoringInput): { score: number; detail: string } {
  const score = clamp(i.agencyAnomalyRate * 100, 0, 100);
  return {
    score,
    detail:
      i.agencyAnomalyRate > 0.35
        ? `Implementing agency has an elevated historical anomaly rate (${(
            i.agencyAnomalyRate * 100
          ).toFixed(0)}%).`
        : "Implementing agency history within norms.",
  };
}

function geospatialScore(i: ScoringInput): { score: number; detail: string } {
  const score = clamp(i.duplicateProximity * 100, 0, 100);
  return {
    score,
    detail:
      i.duplicateProximity > 0.6
        ? "A near-identical work exists within close geographic proximity — potential duplicate."
        : "No duplicate-location signal detected.",
  };
}

const SCORERS: Record<RiskDimension, (i: ScoringInput) => { score: number; detail: string }> = {
  financial: financialScore,
  progress: progressScore,
  cost: costScore,
  timeline: timelineScore,
  evidence: evidenceScore,
  agency: agencyScore,
  geospatial: geospatialScore,
};

export function calculateRiskScore(
  input: ScoringInput,
  weights: Record<RiskDimension, number> = RISK_WEIGHTS
): RiskAssessment {
  const sub: Record<RiskDimension, { score: number; detail: string }> = {
    financial: SCORERS.financial(input),
    progress: SCORERS.progress(input),
    cost: SCORERS.cost(input),
    timeline: SCORERS.timeline(input),
    evidence: SCORERS.evidence(input),
    agency: SCORERS.agency(input),
    geospatial: SCORERS.geospatial(input),
  };

  const factors: RiskFactor[] = (Object.keys(weights) as RiskDimension[]).map(
    (key) => ({
      key,
      label: DIMENSION_LABELS[key],
      weight: weights[key],
      contribution: Math.round(sub[key].score * weights[key]),
      detail: sub[key].detail,
    })
  );

  const totalScore = Math.round(
    factors.reduce((acc, f) => acc + sub[f.key].score * f.weight, 0)
  );
  const riskLevel = levelForScore(totalScore);

  const anomalies = deriveAnomalies(input, sub);

  const recommendation =
    riskLevel === "LOW"
      ? "Continue routine monitoring. No priority verification required."
      : "Recommend physical inspection and verification of bills, measurement books, project photographs and completion documents.";

  // Confidence rises with the number of corroborating high signals.
  const strongSignals = factors.filter((f) => sub[f.key].score > 55).length;
  const confidence = clamp(0.55 + strongSignals * 0.08, 0.5, 0.96);

  return {
    totalScore,
    riskLevel,
    financialRisk: Math.round(sub.financial.score),
    progressRisk: Math.round(sub.progress.score),
    costRisk: Math.round(sub.cost.score),
    timelineRisk: Math.round(sub.timeline.score),
    evidenceRisk: Math.round(sub.evidence.score),
    agencyRisk: Math.round(sub.agency.score),
    geospatialRisk: Math.round(sub.geospatial.score),
    factors: factors.sort((a, b) => b.contribution - a.contribution),
    anomalies,
    recommendation,
    confidence,
  };
}

function deriveAnomalies(
  i: ScoringInput,
  sub: Record<RiskDimension, { score: number }>
): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];
  if (i.utilizationPercentage > 120)
    flags.push({
      category: "OVER_DISBURSEMENT",
      label: "Over-disbursement > 120%",
      detail: `Expenditure at ${i.utilizationPercentage.toFixed(0)}% of sanctioned amount.`,
      severity: i.utilizationPercentage > 145 ? "CRITICAL" : "HIGH",
    });
  if (i.reportedProgress - i.physicalProgress > 20)
    flags.push({
      category: "PROGRESS_MISMATCH",
      label: "Progress mismatch",
      detail: `Financial ${i.reportedProgress.toFixed(0)}% vs physical ${i.physicalProgress.toFixed(0)}%.`,
      severity: "HIGH",
    });
  if (Math.abs(i.costVsBenchmarkPct - 100) > 40)
    flags.push({
      category: "COST_OUTLIER",
      label: "Extreme cost outlier",
      detail: `Unit cost ${i.costVsBenchmarkPct.toFixed(0)}% of peer median.`,
      severity: "HIGH",
    });
  if (sub.timeline.score > 60)
    flags.push({
      category: "TIMELINE_DELAY",
      label: "Significant timeline delay",
      detail: `${i.delayDays} days behind schedule.`,
      severity: sub.timeline.score > 85 ? "CRITICAL" : "HIGH",
    });
  if (i.marchSharePct > 55)
    flags.push({
      category: "MARCH_RUSH",
      label: "March-heavy fund utilization",
      detail: `${i.marchSharePct.toFixed(0)}% of annual expenditure in March.`,
      severity: "MEDIUM",
    });
  if (i.maxSimilarity > 0.85)
    flags.push({
      category: "EVIDENCE_MISMATCH",
      label: "Evidence mismatch / possible reuse",
      detail: `${(i.maxSimilarity * 100).toFixed(0)}% image similarity to another submission.`,
      severity: "HIGH",
    });
  if (i.duplicateProximity > 0.6)
    flags.push({
      category: "POTENTIAL_DUPLICATE",
      label: "Potential duplicate work",
      detail: "Near-identical work in close geographic proximity.",
      severity: "MEDIUM",
    });
  if (sub.financial.score > 60 && sub.progress.score > 50)
    flags.push({
      category: "ISOLATION_FOREST",
      label: "Isolation Forest anomaly",
      detail: "Multivariate outlier across financial and progress signals.",
      severity: "HIGH",
    });
  return flags;
}
