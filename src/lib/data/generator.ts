// ─── Synthetic MPLADS dataset generator ─────────────────────────────────────
// Produces a deterministic, clearly-fictional dataset (500+ works) modelled on
// real MPLADS fields. NOT official data. See DEMO MODE labelling in the UI.

import type {
  Agency,
  DocumentRecord,
  Evidence,
  Project,
  Sector,
  WorkStatus,
} from "../types";
import { calculateRiskScore, type ScoringInput } from "../risk/engine";
import { seededRandom, pick, slugify } from "../utils";
import { STATES, districtsFor } from "./geo";

const SECTORS: Sector[] = [
  "Roads & Bridges",
  "Drinking Water",
  "Education",
  "Health & Sanitation",
  "Electricity",
  "Public Infrastructure",
  "Irrigation",
  "Sports & Culture",
  "Rural Development",
  "Transport",
];

const SUB_SECTORS: Record<Sector, string[]> = {
  "Roads & Bridges": ["Link roads", "Culverts", "Pathways with drainage", "Bridges"],
  "Drinking Water": ["Bore wells", "Overhead tanks", "Pipeline extension", "Hand pumps"],
  Education: ["School buildings", "Classrooms", "Library", "Furniture supply"],
  "Health & Sanitation": ["PHC building", "Toilets", "Drainage", "Waste management"],
  Electricity: ["Street lighting", "Solar lighting", "Transformers"],
  "Public Infrastructure": ["Community hall", "Government office buildings", "Bus shelters"],
  Irrigation: ["Check dams", "Canal lining", "Farm ponds"],
  "Sports & Culture": ["Playgrounds", "Gymnasium", "Community stage"],
  "Rural Development": ["Anganwadi", "Skill centre", "Market yard"],
  Transport: ["Purchase & supply of buses", "Ambulance supply", "Utility vehicles"],
};

const WORK_TEMPLATES: Record<Sector, string[]> = {
  "Roads & Bridges": [
    "Construction of roads, link roads, pathways or any other road with or without drainage system",
    "Construction of concrete road with side drains",
  ],
  "Drinking Water": ["Installation of overhead drinking water tank", "Extension of drinking water pipeline"],
  Education: ["Construction of additional classrooms in Government school", "Supply of furniture to Government school"],
  "Health & Sanitation": ["Construction of public toilet complex", "Construction of drainage system"],
  Electricity: ["Installation of solar street lighting system", "Supply and installation of high-mast lighting"],
  "Public Infrastructure": ["Construction of Government office buildings", "Construction of community hall"],
  Irrigation: ["Construction of check dam", "Lining of irrigation canal"],
  "Sports & Culture": ["Development of playground", "Construction of community gymnasium"],
  "Rural Development": ["Construction of Anganwadi centre", "Construction of rural market yard"],
  Transport: ["Purchase & Supply of 02 Nos. Buses", "Supply of ambulance for PHC"],
};

const AGENCY_TEMPLATES = [
  { suffix: "Public Works Department", type: "State PWD" },
  { suffix: "Rural Engineering Service", type: "Rural Engineering" },
  { suffix: "Municipal Corporation", type: "Urban Local Body" },
  { suffix: "Zilla Parishad", type: "District Body" },
  { suffix: "Jal Nigam", type: "Water Utility" },
  { suffix: "Housing Board", type: "State Board" },
  { suffix: "Electricity Board", type: "Power Utility" },
  { suffix: "District Rural Development Agency", type: "DRDA" },
];

const MP_NAMES = [
  "Hon'ble Member (LS-01)", "Hon'ble Member (LS-02)", "Hon'ble Member (RS-01)",
  "Hon'ble Member (LS-03)", "Hon'ble Member (LS-04)", "Hon'ble Member (RS-02)",
  "Hon'ble Member (LS-05)", "Hon'ble Member (LS-06)", "Hon'ble Member (RS-03)",
];

const FINANCIAL_YEARS = ["2021-2022", "2022-2023", "2023-2024", "2024-2025"];

export interface Dataset {
  projects: Project[];
  agencies: Agency[];
}

let CACHE: Dataset | null = null;

export function getDataset(): Dataset {
  if (CACHE) return CACHE;
  CACHE = generate(560);
  return CACHE;
}

function generate(count: number): Dataset {
  const rand = seededRandom(20260909);

  // ── Agencies ──
  const agencies: Agency[] = [];
  for (const st of STATES.slice(0, 24)) {
    const t = AGENCY_TEMPLATES[Math.floor(rand() * AGENCY_TEMPLATES.length)];
    const anomalyRate = Math.round(rand() * 60) / 100; // 0..0.6
    agencies.push({
      id: `${st.id}-${slugify(t.suffix)}`,
      name: `${st.name} ${t.suffix}`,
      type: t.type,
      projectsCount: 0,
      completed: 0,
      delayed: 0,
      avgCompletionDays: 180 + Math.floor(rand() * 420),
      avgCostVariance: Math.round((rand() * 40 - 8) * 10) / 10,
      anomalies: 0,
      riskLevel: "LOW",
    });
  }
  // Planted "bad actor" agency — concentrates a high share of flags, mirroring
  // the real MPLADS pattern of a repeat-offender contractor.
  const BAD_ACTOR_ID = "national-rapid-infra-developers";
  agencies.push({
    id: BAD_ACTOR_ID,
    name: "Rapid Infra Developers Pvt Ltd",
    type: "Private Contractor",
    projectsCount: 0,
    completed: 0,
    delayed: 0,
    avgCompletionDays: 540 + Math.floor(rand() * 180),
    avgCostVariance: 62,
    anomalies: 0,
    riskLevel: "CRITICAL",
  });

  const agencyAnomalyRate = new Map<string, number>();
  agencies.forEach((a) => agencyAnomalyRate.set(a.id, Math.round(rand() * 55) / 100));
  agencyAnomalyRate.set(BAD_ACTOR_ID, 0.92); // ~5x national average

  // ── Benchmarks per (sector) median cost, to compute cost outliers ──
  const sectorMedian: Record<string, number> = {};
  SECTORS.forEach((s) => {
    sectorMedian[s] = 1500000 + Math.floor(rand() * 6000000);
  });

  const projects: Project[] = [];

  for (let n = 0; n < count; n++) {
    const state = pick(rand, STATES.slice(0, 30));
    const districts = districtsFor(state.id);
    const district = pick(rand, districts);
    const sector = pick(rand, SECTORS);
    const subSector = pick(rand, SUB_SECTORS[sector]);
    const name = pick(rand, WORK_TEMPLATES[sector]);

    // A small set of "showcase" works are forced to be severe so the demo
    // storyline always has clear high/critical cases to investigate.
    const showcase = n < 14;

    // Assign the first 12 works to the planted bad-actor agency so its
    // flagged-work rate lands ~11/12 (≈92%, ~5x the national average).
    const badActor = agencies.find((a) => a.id === BAD_ACTOR_ID)!;
    const agency =
      n < 12
        ? badActor
        : pick(
            rand,
            agencies.filter((a) => a.id.startsWith(state.id)).length
              ? agencies.filter((a) => a.id.startsWith(state.id))
              : agencies.filter((a) => a.id !== BAD_ACTOR_ID)
          );

    // Financials
    const base = sectorMedian[sector];
    const sanctioned = Math.round((base * (0.55 + rand() * 1.4)) / 1000) * 1000;
    const recommended = Math.round(sanctioned * (0.9 + rand() * 0.2));
    const released = Math.round(sanctioned * (0.6 + rand() * 0.45));

    // Introduce anomalies in a controlled fraction of projects.
    const anomalyRoll = rand();
    const overSpend = showcase || anomalyRoll > 0.68;
    const expenditure = overSpend
      ? Math.round(released * (1.25 + rand() * 0.55))
      : Math.round(released * (0.4 + rand() * 0.55));
    const unspent = Math.max(0, sanctioned - expenditure);
    const utilizationPercentage = (expenditure / sanctioned) * 100;
    const interest = Math.round(unspent * 0.03 * rand());
    const marchSharePct = showcase
      ? 62 + rand() * 33
      : 20 + rand() * (anomalyRoll > 0.6 ? 65 : 30);

    // Progress
    const physical = showcase ? Math.round(rand() * 45) : Math.round(rand() * 100);
    const mismatch = showcase
      ? 35 + rand() * 45
      : rand() > 0.68
      ? 18 + rand() * 45
      : rand() * 12;
    const reported = Math.min(100, Math.round(physical + mismatch));

    // Timeline
    const startDate = new Date(2021, 3, 1);
    startDate.setDate(startDate.getDate() + Math.floor(rand() * 900));
    const expectedDurationDays = 180 + Math.floor(rand() * 540);
    const expected = new Date(startDate);
    expected.setDate(expected.getDate() + expectedDurationDays);
    const delayDays = showcase
      ? 260 + Math.floor(rand() * 340)
      : rand() > 0.5
      ? Math.floor(rand() * 520)
      : 0;

    let status: WorkStatus;
    if (physical >= 100) status = "COMPLETED";
    else if (delayDays > 250) status = "STALLED";
    else if (delayDays > 60) status = "DELAYED";
    else if (physical > 5) status = "IN_PROGRESS";
    else if (rand() > 0.5) status = "SANCTIONED";
    else status = "RECOMMENDED";

    const actualCompletion =
      status === "COMPLETED"
        ? (() => {
            const d = new Date(expected);
            d.setDate(d.getDate() + delayDays);
            return d.toISOString();
          })()
        : null;

    // Cost benchmark deviation
    const unitCost = showcase ? sanctioned * (1.5 + rand()) : sanctioned;
    const costVsBenchmarkPct = (unitCost / base) * 100;

    // Geospatial: duplicate proximity signal in a small fraction.
    const duplicateProximity = showcase
      ? 0.7 + rand() * 0.3
      : rand() > 0.85
      ? 0.6 + rand() * 0.4
      : rand() * 0.4;

    // Evidence
    const evidenceCount = 1 + Math.floor(rand() * 4);
    const evidence: Evidence[] = [];
    let maxSim = 0;
    let issues = 0;
    for (let e = 0; e < evidenceCount; e++) {
      const sim =
        showcase || rand() > 0.8 ? 0.82 + rand() * 0.15 : 0.2 + rand() * 0.5;
      maxSim = Math.max(maxSim, sim);
      const statuses = [
        "VERIFIED",
        "VERIFIED",
        "REVIEW_REQUIRED",
        "POSSIBLE_REUSE",
        "LOCATION_MISMATCH",
        "TIMESTAMP_MISMATCH",
      ] as const;
      const st = sim > 0.85 ? "POSSIBLE_REUSE" : pick(rand, statuses);
      if (st !== "VERIFIED") issues++;
      const ts = new Date(startDate);
      ts.setDate(ts.getDate() + Math.floor(rand() * expectedDurationDays));
      evidence.push({
        id: `EV-${n}-${e}`,
        label: `Site photograph ${e + 1}`,
        timestamp: ts.toISOString(),
        latitude: 20 + rand() * 8,
        longitude: 77 + rand() * 8,
        hash: Math.floor(rand() * 1e9).toString(16).padStart(8, "0"),
        similarityScore: Math.round(sim * 100),
        status: st,
      });
    }

    // Documents
    const docDefs: [string, string][] = [
      ["Administrative Approval", "Approval"],
      ["Technical Sanction", "Sanction"],
      ["Measurement Book", "Measurement"],
      ["Utilization Certificate (UC)", "Certificate"],
      ["Completion Report", "Report"],
      ["Contractor Agreement", "Agreement"],
      ["Audit Certificate (AC)", "Certificate"],
    ];
    const documents: DocumentRecord[] = docDefs.map(([nm, tp]) => {
      const present = rand() > (overSpend ? 0.4 : 0.15);
      return {
        id: `DOC-${n}-${slugify(nm)}`,
        name: nm,
        type: tp,
        present,
        note: present ? undefined : "Not on record",
      };
    });

    const scoringInput: ScoringInput = {
      utilizationPercentage,
      marchSharePct,
      physicalProgress: physical,
      reportedProgress: reported,
      costVsBenchmarkPct,
      delayDays,
      expectedDurationDays,
      evidenceIssues: issues,
      evidenceCount,
      maxSimilarity: maxSim,
      agencyAnomalyRate: agencyAnomalyRate.get(agency.id) ?? 0.2,
      duplicateProximity,
    };

    const risk = calculateRiskScore(scoringInput);

    const mp = MP_NAMES[Math.floor(rand() * MP_NAMES.length)];
    const jitterX = (rand() - 0.5) * 6;
    const jitterY = (rand() - 0.5) * 6;

    const projectCode = `WS/MP${100 + Math.floor(rand() * 900)}/${
      pick(rand, FINANCIAL_YEARS)
    }/${100000 + n}`;

    projects.push({
      id: String(100000 + n),
      projectCode,
      name,
      description: `${name} at ${district}, ${state.name}. Sub-sector: ${subSector}.`,
      sector,
      subSector,
      stateId: state.id,
      stateName: state.name,
      district,
      constituency: `${district} Constituency`,
      mpName: mp,
      block: `Block ${1 + Math.floor(rand() * 12)}`,
      village: `Village ${1 + Math.floor(rand() * 40)}`,
      agencyId: agency.id,
      agencyName: agency.name,
      status,
      sanctionedAmount: sanctioned,
      recommendedAmount: recommended,
      startDate: startDate.toISOString(),
      expectedCompletionDate: expected.toISOString(),
      actualCompletionDate: actualCompletion,
      latitude: Math.round((20 + rand() * 8) * 1e4) / 1e4,
      longitude: Math.round((77 + rand() * 8) * 1e4) / 1e4,
      mapX: Math.max(4, Math.min(96, state.cx + jitterX)),
      mapY: Math.max(4, Math.min(96, state.cy + jitterY)),
      financial: {
        sanctionedAmount: sanctioned,
        releasedAmount: released,
        expenditure,
        unspentAmount: unspent,
        interest,
        utilizationPercentage: Math.round(utilizationPercentage * 10) / 10,
        marchSharePct: Math.round(marchSharePct),
        financialYear: pick(rand, FINANCIAL_YEARS),
      },
      progress: {
        physicalProgress: physical,
        reportedProgress: reported,
        milestone:
          physical >= 100
            ? "Completed"
            : physical > 60
            ? "Final stage"
            : physical > 25
            ? "Mid execution"
            : "Foundation",
        delayDays,
      },
      evidence,
      documents,
      risk,
      financialYear: pick(rand, FINANCIAL_YEARS),
    });

    // Roll up agency stats.
    const ag = agencies.find((a) => a.id === agency.id)!;
    ag.projectsCount++;
    if (status === "COMPLETED") ag.completed++;
    if (status === "DELAYED" || status === "STALLED") ag.delayed++;
    ag.anomalies += risk.anomalies.length;
  }

  // Finalise agency risk levels.
  agencies.forEach((a) => {
    const rate = a.projectsCount ? a.anomalies / (a.projectsCount * 2) : 0;
    a.riskLevel =
      rate > 0.6 ? "CRITICAL" : rate > 0.4 ? "HIGH" : rate > 0.2 ? "MEDIUM" : "LOW";
  });

  return { projects, agencies };
}
