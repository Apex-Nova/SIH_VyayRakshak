// ─── Real, citable national MPLADS context ──────────────────────────────────
// These figures are REAL and sourced to MoSPI / eSAKSHI and public records.
// They are shown clearly separated from the synthetic per-work analysis set.
// (See the Data & Sourcing page.)

export const NATIONAL = {
  perMpPerYearCr: 5, // ₹5 Cr per MP per year
  annualAllocationCr: 3940, // ~₹3,940 Cr/yr
  totalMps: 788,
  lokSabha: 543,
  rajyaSabha: 245,
  statesUts: 36,
  releasedSince1993Cr: 47572.75, // as on 2 Jul 2018
  utilisationSince1993Pct: 94.99,
  schemeSince: "23 Dec 1993",
  esakshiLive: "1 Apr 2023",
  source: "MoSPI / eSAKSHI (mplads.mospi.gov.in) & public records",
} as const;

export const SYSTEM_INFO = {
  mode: "READ_ONLY" as const,
  posture:
    "eSAKSHI-shaped export, read-only — appends derived columns only, never writes back to the source.",
  lastSync: "2026-09-10T02:30:00+05:30",
  provider: "MockMPLADSProvider (synthetic, eSAKSHI schema)",
};
