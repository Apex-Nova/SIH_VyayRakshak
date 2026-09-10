// Navigation config. Labels are i18n keys resolved at render time.
export interface NavLink {
  key: string; // i18n key under nav.*
  href: string;
  descKey?: string;
}

export interface NavGroup {
  key: string; // i18n key under nav.*
  links: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "nav.platform",
    links: [
      { key: "nav.aiIntelligence", href: "/#ai-intelligence" },
      { key: "nav.riskScoring", href: "/#risk-scoring" },
      { key: "nav.geospatial", href: "/map" },
      { key: "nav.evidence", href: "/evidence" },
      { key: "nav.investigation", href: "/investigation" },
      { key: "nav.unified", href: "/unified" },
      { key: "nav.testWork", href: "/test" },
    ],
  },
  {
    key: "nav.data",
    links: [
      { key: "nav.projects", href: "/projects" },
      { key: "nav.financial", href: "/financial" },
      { key: "nav.progress", href: "/progress" },
      { key: "nav.agencies", href: "/agencies" },
      { key: "nav.constituencies", href: "/constituencies" },
      { key: "nav.compare", href: "/compare" },
    ],
  },
  {
    key: "nav.resources",
    links: [
      { key: "nav.problem", href: "/#problem" },
      { key: "nav.solution", href: "/#process" },
      { key: "nav.methodology", href: "/#risk-scoring" },
      { key: "nav.dataSourcing", href: "/data-sourcing" },
      { key: "nav.explainer", href: "/showcase" },
      { key: "nav.faqs", href: "/#faq" },
      { key: "nav.dashboard", href: "/dashboard" },
    ],
  },
];
