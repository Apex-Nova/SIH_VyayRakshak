// ─── Deterministic intelligence layer for "Ask VyayRakshak" ─────────────────
// Answers natural-language questions from the app's own data. Rule-based so it
// works with no API key. When it cannot answer confidently, the API route may
// fall back to a configured LLM (Gemini) — see src/app/api/assistant/route.ts.

import { allProjects, projectById, topFlagged, platformStats } from "../data/queries";
import { getProvider } from "../mplads/provider";
import { NATIONAL } from "../data/national";
import { formatINR, formatIndianNumber } from "../utils";
import type { Project, Sector } from "../types";

export interface AssistantAnswer {
  text: string;
  projects?: Project[];
  kind: "list" | "explain" | "stat" | "help" | "info";
  confident: boolean;
}

const STATE_ALIASES: Record<string, string> = {
  chhattisgarh: "cg", "uttar pradesh": "up", "madhya pradesh": "mp",
  maharashtra: "mh", bihar: "br", jharkhand: "jh", rajasthan: "rj",
  karnataka: "ka", "tamil nadu": "tn", gujarat: "gj", odisha: "od",
  telangana: "ts", "andhra pradesh": "ap", punjab: "pb", haryana: "hr",
  kerala: "kl", assam: "as", "west bengal": "wb",
};

const SECTOR_KEYWORDS: [string, Sector][] = [
  ["road", "Roads & Bridges"], ["bridge", "Roads & Bridges"],
  ["water", "Drinking Water"], ["school", "Education"], ["educat", "Education"],
  ["health", "Health & Sanitation"], ["sanitation", "Health & Sanitation"],
  ["electric", "Electricity"], ["light", "Electricity"],
  ["irrigation", "Irrigation"], ["sport", "Sports & Culture"],
  ["rural", "Rural Development"], ["transport", "Transport"], ["bus", "Transport"],
];

function byScore(list: Project[], n = 6) {
  return [...list].sort((a, b) => b.risk.totalScore - a.risk.totalScore).slice(0, n);
}

export function askVyayRakshak(rawQuery: string): AssistantAnswer {
  const q = rawQuery.toLowerCase().trim();
  const projects = allProjects();
  const stats = platformStats();

  // Greetings
  if (/^(hi|hello|hey|namaste|namaskar|hii)\b/.test(q)) {
    return {
      kind: "info",
      confident: true,
      text: "Namaste! I'm VyayRakshak. Ask me about works, risk, agencies, financials or a specific detector — e.g. “highest risk works”, “worst agency”, “show duplicate works”, “what is March Rush?”, or “why is work 100005 high risk?”.",
    };
  }

  // Explain a specific work
  const idMatch = q.match(/(?:mpl-|mplads-|work\s*#?|project\s*#?)?(\d{6})/) || q.match(/\b(\d{6})\b/);
  if ((q.includes("why") || q.includes("explain") || q.includes("score")) && idMatch) {
    const p = projectById(idMatch[1]);
    if (p) return explainProject(p);
  }

  // Detector definitions
  if (q.includes("march rush") || (q.includes("march") && q.includes("what"))) {
    return {
      kind: "info", confident: true,
      text: "March Rush is our own fiscal year-end detector. It flags works where a disproportionate share of the funds (over 60%) is spent in March — a known indicator of rushed, low-scrutiny disbursement before the financial year closes.",
    };
  }
  if (q.includes("isolation forest") || (q.includes("cost") && q.includes("how"))) {
    return {
      kind: "info", confident: true,
      text: "Cost Benchmarking uses an unsupervised IsolationForest to find works whose cost/timeline pattern is an outlier versus genuinely comparable works (same category, geography and characteristics). It needs no labelled fraud data.",
    };
  }
  if ((q.includes("evidence") || q.includes("photo")) && (q.includes("how") || q.includes("what") || q.includes("verif"))) {
    return {
      kind: "info", confident: true,
      text: "Evidence Verification compares a perceptual hash (imagehash/dHash) of completion photographs across works to catch the same photo reused for two different works — even if cropped, rotated or colour-shifted.",
    };
  }

  // Data sourcing / architecture
  if (q.includes("real data") || q.includes("synthetic") || q.includes("source") || q.includes("esakshi") || q.includes("read-only") || q.includes("read only")) {
    return {
      kind: "info", confident: true,
      text: `VyayRakshak is a read-only layer on eSAKSHI — it appends risk/flags/reasons and never writes back. National figures are real (₹${formatIndianNumber(NATIONAL.annualAllocationCr)} Cr/yr, ${NATIONAL.totalMps} MPs, ${NATIONAL.statesUts} States/UTs, cited to MoSPI/eSAKSHI). Per-work rows here are synthetic, built in the real eSAKSHI schema. See the Data & Sourcing page.`,
    };
  }

  // Worst agency / agency intelligence
  if (q.includes("agenc") || q.includes("contractor")) {
    const agencies = getProvider().getAgencies().filter((a) => a.projectsCount > 0);
    const worst = [...agencies].sort((a, b) => b.anomalies / Math.max(1, b.projectsCount) - a.anomalies / Math.max(1, a.projectsCount))[0];
    const list = byScore(projects.filter((p) => p.agencyId === worst.id));
    return {
      kind: "list", confident: true,
      projects: list,
      text: `The highest-risk implementing agency is ${worst.name} (${worst.type}) — ${worst.anomalies} anomalies across ${worst.projectsCount} works, risk ${worst.riskLevel}. Its most-flagged works are below.`,
    };
  }

  // Duplicate works
  if (q.includes("duplicate") || q.includes("double") || q.includes("split")) {
    const list = byScore(projects.filter((p) => p.risk.anomalies.some((a) => a.category === "POTENTIAL_DUPLICATE")));
    return { kind: "list", confident: true, projects: list, text: `${list.length} works carry a potential-duplicate signal (near-identical work in close geographic proximity).` };
  }
  // Evidence reuse
  if (q.includes("evidence") || q.includes("photo") || q.includes("reuse")) {
    const list = byScore(projects.filter((p) => p.risk.anomalies.some((a) => a.category === "EVIDENCE_MISMATCH")));
    return { kind: "list", confident: true, projects: list, text: `${list.length} works show an evidence mismatch / possible photo reuse.` };
  }
  // March-heavy works
  if (q.includes("march")) {
    const list = byScore(projects.filter((p) => p.financial.marchSharePct > 55));
    return { kind: "list", confident: true, projects: list, text: `${list.length} works concentrate over 55% of spend in March (March Rush).` };
  }
  // Delays
  if (q.includes("delay") || q.includes("overdue") || q.includes("late")) {
    const list = [...projects].filter((p) => p.progress.delayDays > 0).sort((a, b) => b.progress.delayDays - a.progress.delayDays).slice(0, 6);
    return { kind: "list", confident: true, projects: list, text: `The most-delayed works (top by days overdue) are below.` };
  }
  // Cost outliers
  if (q.includes("cost") && (q.includes("outlier") || q.includes("overrun") || q.includes("high"))) {
    const list = byScore(projects.filter((p) => p.risk.anomalies.some((a) => a.category === "COST_OUTLIER")));
    return { kind: "list", confident: true, projects: list, text: `${list.length} works are cost outliers versus comparable works.` };
  }
  // Progress mismatch
  if ((q.includes("financial") && q.includes("physical")) || q.includes("progress mismatch") || q.includes("above physical")) {
    const list = [...projects].filter((p) => p.progress.reportedProgress - p.progress.physicalProgress > 20)
      .sort((a, b) => (b.progress.reportedProgress - b.progress.physicalProgress) - (a.progress.reportedProgress - a.progress.physicalProgress)).slice(0, 6);
    return { kind: "list", confident: true, projects: list, text: `${list.length} works where reported financial completion exceeds verified physical progress by 20+ points.` };
  }
  // Financial risk
  if (q.includes("financial") && (q.includes("risk") || q.includes("highest") || q.includes("top"))) {
    const list = [...projects].sort((a, b) => b.risk.financialRisk - a.risk.financialRisk).slice(0, 6);
    return { kind: "list", confident: true, projects: list, text: `Top works by financial-risk sub-score (over-disbursement / March concentration).` };
  }

  // Sector filter
  for (const [kw, sector] of SECTOR_KEYWORDS) {
    if (q.includes(kw)) {
      const list = byScore(projects.filter((p) => p.sector === sector));
      return { kind: "list", confident: true, projects: list, text: `Highest-risk works in ${sector}.` };
    }
  }

  // State filter
  for (const [alias, code] of Object.entries(STATE_ALIASES)) {
    if (q.includes(alias)) {
      let list = projects.filter((p) => p.stateId === code);
      if (q.includes("high") || q.includes("critical") || q.includes("risk"))
        list = list.filter((p) => p.risk.riskLevel === "HIGH" || p.risk.riskLevel === "CRITICAL");
      list = byScore(list);
      return { kind: "list", confident: true, projects: list, text: `${list.length} work(s) matched in that state, ordered by risk score.` };
    }
  }

  // Counts / stats
  if (q.includes("how many") || q.includes("count") || q.includes("total") || q.includes("number of")) {
    if (q.includes("agenc")) {
      const n = getProvider().getAgencies().filter((a) => a.projectsCount > 0).length;
      return { kind: "stat", confident: true, text: `${n} implementing agencies are monitored in this dataset.` };
    }
    return {
      kind: "stat", confident: true,
      text: `Across ${formatIndianNumber(stats.totalProjects)} monitored works: ${formatIndianNumber(stats.highRisk)} high-risk, ${formatIndianNumber(stats.criticalRisk)} critical, ${formatIndianNumber(stats.anomalies)} anomalies. Total sanctioned ${formatINR(stats.totalSanctioned, { compact: true })}, expenditure ${formatINR(stats.totalExpenditure, { compact: true })} (${stats.utilizationPct.toFixed(0)}% utilisation).`,
    };
  }

  // Highest / critical overall
  if (q.includes("highest") || q.includes("top") || q.includes("critical") || q.includes("riskiest") || q.includes("worst work") || q.includes("flagged")) {
    const list = topFlagged(6);
    return { kind: "list", confident: true, projects: list, text: `The ${list.length} highest-risk works across the platform.` };
  }

  // Help / low-confidence fallback (route may escalate to Gemini)
  return {
    kind: "help",
    confident: false,
    text: "I can query the platform data. Try: “highest-risk works”, “worst agency”, “show duplicate works”, “projects with progress mismatch”, “high-risk works in Bihar”, “what is March Rush?”, or “why is work 100005 high risk?”. VyayRakshak identifies anomalies for human verification — it does not determine fraud.",
  };
}

function explainProject(p: Project): AssistantAnswer {
  const top = p.risk.factors.slice(0, 3).map((f) => `${f.label} (+${f.contribution})`);
  return {
    kind: "explain", confident: true, projects: [p],
    text: `Work ${p.id} — “${p.name}” in ${p.district}, ${p.stateName} — scores ${p.risk.totalScore}/100 (${p.risk.riskLevel}). Largest contributions: ${top.join(", ")}. ${p.risk.recommendation} This is a decision-support signal for human verification, not a finding of wrongdoing.`,
  };
}

/** Compact factual context handed to an LLM fallback so it stays grounded. */
export function buildContext(): string {
  const s = platformStats();
  const flagged = topFlagged(8).map(
    (p) => `#${p.id} "${p.name}" ${p.district},${p.stateName} score=${p.risk.totalScore}/${p.risk.riskLevel} agency="${p.agencyName}"`
  );
  const agencies = getProvider().getAgencies().filter((a) => a.projectsCount > 0)
    .sort((a, b) => b.anomalies - a.anomalies).slice(0, 4)
    .map((a) => `${a.name}: ${a.anomalies} anomalies / ${a.projectsCount} works (${a.riskLevel})`);
  return [
    `VyayRakshak is a read-only AI analytics layer on MPLADS/eSAKSHI (SIH26102, Team Synaptix). It never writes to the source. It flags anomalies for human verification and does NOT determine fraud.`,
    `Real national context (cited to MoSPI/eSAKSHI): ₹${NATIONAL.annualAllocationCr} Cr/yr allocation, ${NATIONAL.totalMps} MPs (${NATIONAL.lokSabha} Lok Sabha + ${NATIONAL.rajyaSabha} Rajya Sabha), ${NATIONAL.statesUts} States/UTs, ₹${NATIONAL.releasedSince1993Cr} Cr released since 1993.`,
    `Per-work rows are SYNTHETIC (eSAKSHI schema). Dataset now: ${s.totalProjects} works, ${s.highRisk} high-risk, ${s.criticalRisk} critical, ${s.anomalies} anomalies, sanctioned ${formatINR(s.totalSanctioned, { compact: true })}, utilisation ${s.utilizationPct.toFixed(0)}%.`,
    `Nine detectors: Financial, Progress, Cost Benchmarking (IsolationForest), Duplicate (TF-IDF), Delay, Evidence (perceptual hash), Agency, Geospatial, and our own March Rush (fiscal year-end).`,
    `Top flagged works: ${flagged.join(" | ")}.`,
    `Highest-risk agencies: ${agencies.join(" | ")}.`,
  ].join("\n");
}
