// ─── MPLADS data provider abstraction ───────────────────────────────────────
// The application is architected so a real MPLADS integration can replace the
// mock provider without touching the UI. Only MockMPLADSProvider is wired today.

import type { Agency, Project, StateInfo } from "../types";
import { getDataset } from "../data/generator";
import { STATES } from "../data/geo";

export interface MPLADSDataProvider {
  readonly source: "mock" | "official";
  getProjects(): Project[];
  getAgencies(): Agency[];
  getStates(): StateInfo[];
  getDistricts(): string[];
  getConstituencies(): string[];
}

class MockMPLADSProvider implements MPLADSDataProvider {
  readonly source = "mock" as const;
  getProjects() {
    return getDataset().projects;
  }
  getAgencies() {
    return getDataset().agencies;
  }
  getStates() {
    return STATES;
  }
  getDistricts() {
    return Array.from(new Set(getDataset().projects.map((p) => p.district))).sort();
  }
  getConstituencies() {
    return Array.from(
      new Set(getDataset().projects.map((p) => p.constituency))
    ).sort();
  }
}

// Placeholder for the real integration — intentionally not implemented.
// class OfficialMPLADSProvider implements MPLADSDataProvider { ... }

export function getProvider(): MPLADSDataProvider {
  // Reads NEXT_PUBLIC_DATA_PROVIDER but only the mock is available today.
  return new MockMPLADSProvider();
}

export const IS_DEMO =
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false"; // demo by default
