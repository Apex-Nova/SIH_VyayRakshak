// ─── Domain types for the MPLADS intelligence platform ──────────────────────

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type WorkStatus =
  | "RECOMMENDED"
  | "SANCTIONED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED"
  | "STALLED";

export type Sector =
  | "Roads & Bridges"
  | "Drinking Water"
  | "Education"
  | "Health & Sanitation"
  | "Electricity"
  | "Public Infrastructure"
  | "Irrigation"
  | "Sports & Culture"
  | "Rural Development"
  | "Transport";

export type AnomalyCategory =
  | "OVER_DISBURSEMENT"
  | "PROGRESS_MISMATCH"
  | "COST_OUTLIER"
  | "TIMELINE_DELAY"
  | "EVIDENCE_MISMATCH"
  | "POTENTIAL_DUPLICATE"
  | "MARCH_RUSH"
  | "ISOLATION_FOREST"
  | "AGENCY_HISTORY";

export type EvidenceStatus =
  | "VERIFIED"
  | "REVIEW_REQUIRED"
  | "POSSIBLE_REUSE"
  | "LOCATION_MISMATCH"
  | "TIMESTAMP_MISMATCH";

export type Role =
  | "ADMIN"
  | "DISTRICT_AUTHORITY"
  | "AUDITOR"
  | "FIELD_INSPECTOR"
  | "ANALYST"
  | "CITIZEN";

export interface StateInfo {
  id: string;
  name: string;
  code: string;
  // Normalised centroid on a 0..100 SVG canvas (see india-map).
  cx: number;
  cy: number;
}

export interface Agency {
  id: string;
  name: string;
  type: string;
  projectsCount: number;
  completed: number;
  delayed: number;
  avgCompletionDays: number;
  avgCostVariance: number; // %
  anomalies: number;
  riskLevel: RiskLevel;
}

export interface Financial {
  sanctionedAmount: number;
  releasedAmount: number;
  expenditure: number;
  unspentAmount: number;
  interest: number;
  utilizationPercentage: number;
  marchSharePct: number; // share of annual expenditure in March
  financialYear: string;
}

export interface Progress {
  physicalProgress: number; // %
  reportedProgress: number; // financial completion %
  milestone: string;
  delayDays: number;
}

export interface Evidence {
  id: string;
  label: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  hash: string;
  similarityScore: number; // to nearest other evidence
  status: EvidenceStatus;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  present: boolean;
  note?: string;
}

export interface AnomalyFlag {
  category: AnomalyCategory;
  label: string;
  detail: string;
  severity: RiskLevel;
}

export interface RiskFactor {
  key:
    | "financial"
    | "progress"
    | "cost"
    | "timeline"
    | "evidence"
    | "agency"
    | "geospatial";
  label: string;
  contribution: number; // points added to total
  weight: number; // configured weight 0..1
  detail: string;
}

export interface RiskAssessment {
  totalScore: number; // 0..100
  riskLevel: RiskLevel;
  financialRisk: number;
  progressRisk: number;
  costRisk: number;
  timelineRisk: number;
  evidenceRisk: number;
  agencyRisk: number;
  geospatialRisk: number;
  factors: RiskFactor[];
  anomalies: AnomalyFlag[];
  recommendation: string;
  confidence: number; // 0..1
}

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  description: string;
  sector: Sector;
  subSector: string;
  stateId: string;
  stateName: string;
  district: string;
  constituency: string;
  mpName: string;
  block: string;
  village: string;
  agencyId: string;
  agencyName: string;
  status: WorkStatus;
  sanctionedAmount: number;
  recommendedAmount: number;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate: string | null;
  latitude: number;
  longitude: number;
  // Normalised map position on the 0..100 canvas.
  mapX: number;
  mapY: number;
  financial: Financial;
  progress: Progress;
  evidence: Evidence[];
  documents: DocumentRecord[];
  risk: RiskAssessment;
  financialYear: string;
}

export interface DistrictIntel {
  district: string;
  stateName: string;
  stateId: string;
  projects: number;
  sanctioned: number;
  anomalies: number;
  riskLevel: RiskLevel;
  avgRiskScore: number;
  mapX: number;
  mapY: number;
}
