// ─── Aggregation & selection helpers over the dataset ───────────────────────
import type { DistrictIntel, Project, RiskLevel } from "../types";
import { getProvider } from "../mplads/provider";
import { levelForScore } from "../risk/config";

export function allProjects(): Project[] {
  return getProvider().getProjects();
}

export function projectById(id: string): Project | undefined {
  return allProjects().find((p) => p.id === id);
}

export interface PlatformStats {
  totalProjects: number;
  totalSanctioned: number;
  totalReleased: number;
  totalExpenditure: number;
  totalUnspent: number;
  utilizationPct: number;
  highRisk: number;
  criticalRisk: number;
  anomalies: number;
  pendingVerification: number;
  verified: number;
  statesMonitored: number;
}

export function platformStats(projects = allProjects()): PlatformStats {
  let sanctioned = 0,
    released = 0,
    expenditure = 0,
    unspent = 0,
    anomalies = 0,
    highRisk = 0,
    criticalRisk = 0,
    pending = 0,
    verified = 0;
  const states = new Set<string>();

  for (const p of projects) {
    sanctioned += p.financial.sanctionedAmount;
    released += p.financial.releasedAmount;
    expenditure += p.financial.expenditure;
    unspent += p.financial.unspentAmount;
    anomalies += p.risk.anomalies.length;
    if (p.risk.riskLevel === "HIGH") highRisk++;
    if (p.risk.riskLevel === "CRITICAL") criticalRisk++;
    if (p.risk.riskLevel === "HIGH" || p.risk.riskLevel === "CRITICAL") pending++;
    else verified++;
    states.add(p.stateId);
  }

  return {
    totalProjects: projects.length,
    totalSanctioned: sanctioned,
    totalReleased: released,
    totalExpenditure: expenditure,
    totalUnspent: unspent,
    utilizationPct: sanctioned ? (expenditure / sanctioned) * 100 : 0,
    highRisk,
    criticalRisk,
    anomalies,
    pendingVerification: pending,
    verified,
    statesMonitored: states.size,
  };
}

export function riskDistribution(projects = allProjects()) {
  const counts: Record<RiskLevel, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };
  projects.forEach((p) => counts[p.risk.riskLevel]++);
  return (Object.keys(counts) as RiskLevel[]).map((level) => ({
    level,
    count: counts[level],
  }));
}

export function projectsByState(projects = allProjects()) {
  const map = new Map<string, { state: string; count: number; sanctioned: number }>();
  for (const p of projects) {
    const cur = map.get(p.stateName) ?? {
      state: p.stateName,
      count: 0,
      sanctioned: 0,
    };
    cur.count++;
    cur.sanctioned += p.financial.sanctionedAmount;
    map.set(p.stateName, cur);
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

export function projectsBySector(projects = allProjects()) {
  const map = new Map<string, number>();
  for (const p of projects) map.set(p.sector, (map.get(p.sector) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([sector, count]) => ({ sector, count }))
    .sort((a, b) => b.count - a.count);
}

export function anomaliesByCategory(projects = allProjects()) {
  const map = new Map<string, number>();
  for (const p of projects)
    for (const a of p.risk.anomalies)
      map.set(a.label, (map.get(a.label) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function riskOverTime(projects = allProjects()) {
  const map = new Map<string, { fy: string; avg: number; n: number }>();
  for (const p of projects) {
    const cur = map.get(p.financialYear) ?? { fy: p.financialYear, avg: 0, n: 0 };
    cur.avg += p.risk.totalScore;
    cur.n++;
    map.set(p.financialYear, cur);
  }
  return Array.from(map.values())
    .map((x) => ({ fy: x.fy, avgRisk: Math.round(x.avg / x.n) }))
    .sort((a, b) => a.fy.localeCompare(b.fy));
}

export function districtIntel(projects = allProjects()): DistrictIntel[] {
  const map = new Map<string, DistrictIntel & { _sum: number }>();
  for (const p of projects) {
    const key = `${p.stateId}::${p.district}`;
    const cur =
      map.get(key) ??
      ({
        district: p.district,
        stateName: p.stateName,
        stateId: p.stateId,
        projects: 0,
        sanctioned: 0,
        anomalies: 0,
        riskLevel: "LOW",
        avgRiskScore: 0,
        mapX: p.mapX,
        mapY: p.mapY,
        _sum: 0,
      } as DistrictIntel & { _sum: number });
    cur.projects++;
    cur.sanctioned += p.financial.sanctionedAmount;
    cur.anomalies += p.risk.anomalies.length;
    cur._sum += p.risk.totalScore;
    map.set(key, cur);
  }
  return Array.from(map.values()).map((d) => {
    const avg = Math.round(d._sum / d.projects);
    return {
      district: d.district,
      stateName: d.stateName,
      stateId: d.stateId,
      projects: d.projects,
      sanctioned: d.sanctioned,
      anomalies: d.anomalies,
      avgRiskScore: avg,
      riskLevel: levelForScore(avg),
      mapX: d.mapX,
      mapY: d.mapY,
    };
  });
}

export function topFlagged(n = 8, projects = allProjects()): Project[] {
  return [...projects]
    .sort((a, b) => b.risk.totalScore - a.risk.totalScore)
    .slice(0, n);
}

export function expenditureByState(projects = allProjects()) {
  const map = new Map<string, { state: string; sanctioned: number; expenditure: number }>();
  for (const p of projects) {
    const cur = map.get(p.stateName) ?? {
      state: p.stateName,
      sanctioned: 0,
      expenditure: 0,
    };
    cur.sanctioned += p.financial.sanctionedAmount;
    cur.expenditure += p.financial.expenditure;
    map.set(p.stateName, cur);
  }
  return Array.from(map.values())
    .map((x) => ({
      state: x.state,
      sanctionedCr: Math.round(x.sanctioned / 1e7),
      expenditureCr: Math.round(x.expenditure / 1e7),
    }))
    .sort((a, b) => b.expenditureCr - a.expenditureCr)
    .slice(0, 10);
}

export function expenditureByYear(projects = allProjects()) {
  const map = new Map<string, { fy: string; sanctioned: number; expenditure: number }>();
  for (const p of projects) {
    const fy = p.financial.financialYear;
    const cur = map.get(fy) ?? { fy, sanctioned: 0, expenditure: 0 };
    cur.sanctioned += p.financial.sanctionedAmount;
    cur.expenditure += p.financial.expenditure;
    map.set(fy, cur);
  }
  return Array.from(map.values())
    .map((x) => ({
      fy: x.fy,
      sanctionedCr: Math.round(x.sanctioned / 1e7),
      expenditureCr: Math.round(x.expenditure / 1e7),
    }))
    .sort((a, b) => a.fy.localeCompare(b.fy));
}

export function marchRushShare(projects = allProjects()): number {
  const avg =
    projects.reduce((a, p) => a + p.financial.marchSharePct, 0) /
    Math.max(1, projects.length);
  return Math.round(avg);
}

export function progressBuckets(projects = allProjects()) {
  const buckets = { onTrack: 0, atRisk: 0, delayed: 0, completed: 0 };
  for (const p of projects) {
    if (p.status === "COMPLETED") buckets.completed++;
    else if (p.status === "DELAYED" || p.status === "STALLED") buckets.delayed++;
    else if (p.progress.reportedProgress - p.progress.physicalProgress > 20)
      buckets.atRisk++;
    else buckets.onTrack++;
  }
  return buckets;
}

export function mismatchedProjects(n = 10, projects = allProjects()): Project[] {
  return [...projects]
    .filter((p) => p.progress.reportedProgress - p.progress.physicalProgress > 15)
    .sort(
      (a, b) =>
        b.progress.reportedProgress -
        b.progress.physicalProgress -
        (a.progress.reportedProgress - a.progress.physicalProgress)
    )
    .slice(0, n);
}

export function evidenceRecords(n = 12, projects = allProjects()) {
  const rows = projects.flatMap((p) =>
    p.evidence.map((e) => ({
      ...e,
      projectId: p.id,
      projectName: p.name,
      district: p.district,
      stateName: p.stateName,
    }))
  );
  // Surface the most interesting (non-verified first).
  return rows
    .sort((a, b) => {
      const av = a.status === "VERIFIED" ? 0 : 1;
      const bv = b.status === "VERIFIED" ? 0 : 1;
      if (av !== bv) return bv - av;
      return b.similarityScore - a.similarityScore;
    })
    .slice(0, n);
}

export function constituencyIntel(projects = allProjects()) {
  const map = new Map<
    string,
    {
      constituency: string;
      stateName: string;
      stateId: string;
      projects: number;
      sanctioned: number;
      expenditure: number;
      completed: number;
      delayed: number;
      anomalies: number;
      _risk: number;
    }
  >();
  for (const p of projects) {
    const key = `${p.stateId}::${p.constituency}`;
    const cur =
      map.get(key) ?? {
        constituency: p.constituency,
        stateName: p.stateName,
        stateId: p.stateId,
        projects: 0,
        sanctioned: 0,
        expenditure: 0,
        completed: 0,
        delayed: 0,
        anomalies: 0,
        _risk: 0,
      };
    cur.projects++;
    cur.sanctioned += p.financial.sanctionedAmount;
    cur.expenditure += p.financial.expenditure;
    if (p.status === "COMPLETED") cur.completed++;
    if (p.status === "DELAYED" || p.status === "STALLED") cur.delayed++;
    cur.anomalies += p.risk.anomalies.length;
    cur._risk += p.risk.totalScore;
    map.set(key, cur);
  }
  return Array.from(map.values()).map((c) => ({
    ...c,
    avgRisk: Math.round(c._risk / c.projects),
    utilizationPct: Math.round((c.expenditure / Math.max(1, c.sanctioned)) * 100),
  }));
}
