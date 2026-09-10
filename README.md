# VyayRakshak — MPLADS Risk Intelligence & Governance Platform

**SIH26102 Prototype · Decision-Support System · Demo Data**

An AI-powered decision-support platform for monitoring MPLADS development works.
VyayRakshak analyses project, financial, progress and evidence data to identify
**anomalies**, assign an **explainable risk score**, and help authorities
**prioritise the works that require human verification**.

> VyayRakshak is a decision-support system. AI-generated risk indicators are
> decision-support signals and **do not establish fraud or wrongdoing**. All
> flagged cases require human verification. Demo data is illustrative and is not
> connected to an authoritative Government data source. This is not an official
> Government of India platform.

> 👩‍💻 **Teammates — start with [ARCHITECTURE.md](./ARCHITECTURE.md).** It's a
> full code walkthrough: how the app fits together, the risk engine, the data
> layer, i18n, the chatbot, the design system, and "how do I…" recipes.

**Live:** https://vyayrakshak.vercel.app · **Team Synaptix · SIH26102**

---

## Highlights

- **Runs with zero external dependencies** — `npm install && npm run dev`. No
  database, API keys or seeding required for the demo. The app runs on a
  deterministic, clearly-labelled synthetic dataset (560+ works).
- **Real risk engine** — an explainable, weighted 0–100 scoring service
  (`src/lib/risk/engine.ts`) with configurable weights and per-factor,
  human-readable reasons.
- **Real anomaly detection** — rule-based + statistical detectors
  (over-disbursement, progress mismatch, cost outliers, March-rush,
  duplicate-proximity, evidence reuse, isolation-forest-style multivariate).
- **Deterministic AI assistant** — answers natural-language questions from the
  app's own data with **no external calls faked**. Swaps to a real LLM via a
  provider abstraction when a key is configured.
- **Extensible data architecture** — an `MPLADSDataProvider` interface (mock
  today, official later) and a full Prisma schema for the "scale to real data"
  story.

## The workflow

```
MPLADS DATA → AI ANALYSIS → ANOMALY DETECTION → RISK SCORING
→ EXPLAINABLE EVIDENCE → INVESTIGATION PRIORITY → FIELD VERIFICATION → RESOLUTION
```

## Tech stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS** (CSS-variable theming) · **Framer Motion** · **Lucide** icons
- **Recharts** for data visualisation
- Custom SVG geospatial canvas (replaceable with MapLibre/Mapbox later)
- **Prisma** schema included (PostgreSQL) — not required for the demo

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

Optional configuration lives in `.env.example` (copy to `.env`). Everything is
optional — the app runs fully in **Demo Mode** with no configuration.

```bash
npm run build      # production build (type-checked)
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing: hero, metrics, problem, process, 9 AI detectors, explainable risk, motion band, roadmap, FAQ, embedded explainer |
| `/dashboard` | Intelligence console: KPIs + charts + priority works |
| `/projects` · `/projects/[id]` | Project Explorer + risk dossier (7 tabs) |
| `/unified` | Cross-signal analysis + **downloadable PDF/JSON report** |
| `/map` | Geospatial risk map with district drill-down |
| `/investigation` | Detect → Verify → Resolve + AI dossier generation |
| `/test` | Live "Test a Work" scoring through the real engine |
| `/evidence` | Evidence verification: demo upload + hash comparison |
| `/financial` · `/progress` | Financial & progress intelligence |
| `/agencies` · `/agencies/[id]` | Agency intelligence + profiles |
| `/constituencies` · `/compare` | Constituency intel · compare two works |
| `/data-sourcing` | The "real vs synthetic" honesty page |
| `/showcase` | Full-screen interactive explainer |
| `/report` · `/login` · `/inspection` | Anonymous report · demo login · field mode |

The **"Ask VyayRakshak"** assistant is available on every page.

## Project structure

```
src/
  app/                # routes (App Router) + API routes + robots/sitemap
  components/
    home/             # landing sections
    layout/           # nav, footer, page header, demo banner, chrome
    charts/           # themed Recharts wrappers
    risk/             # RiskExplainer + gauge
    projects/ maps/ investigation/ evidence/ …
  lib/
    ai/               # provider abstraction + deterministic assistant
    data/             # dataset generator + aggregation queries + geo
    mplads/           # MPLADSDataProvider interface (mock / official)
    risk/             # configurable weights + scoring engine
    types.ts, utils.ts
prisma/schema.prisma  # domain model for real-data integration
```

## Scoring model (configurable)

| Dimension | Weight |
|-----------|--------|
| Financial | 25% |
| Progress | 20% |
| Cost benchmark | 15% |
| Timeline | 15% |
| Evidence | 10% |
| Agency history | 10% |
| Geospatial / duplicate | 5% |

Levels: `LOW 0–24 · MEDIUM 25–49 · HIGH 50–74 · CRITICAL 75–100`.
Weights and thresholds live in `src/lib/risk/config.ts`.

## Integrating real MPLADS data

1. Implement `OfficialMPLADSProvider` against the `MPLADSDataProvider` interface
   in `src/lib/mplads/provider.ts`.
2. Provision PostgreSQL and run Prisma migrations from `prisma/schema.prisma`.
3. Point `NEXT_PUBLIC_DATA_PROVIDER=official` and wire the provider.

The UI reads from the provider and the risk config only — no page hard-codes the
demo data or the weights.

## Accessibility & performance

- Keyboard-navigable, ARIA-labelled controls, visible focus rings.
- Risk levels are never colour-only (symbol + label + colour).
- `prefers-reduced-motion` disables heavy particle/graph animation.
- Static generation where possible; charts and maps are client-lazy.

## Deployment

Vercel-friendly. Environment variables are documented in `.env.example`; none are
required for the demo build.
