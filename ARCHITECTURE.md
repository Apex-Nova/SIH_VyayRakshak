# VyayRakshak — Developer Guide & Code Walkthrough

> Read this first. It explains **how the whole codebase fits together** so any
> teammate can find their way around, make changes safely, and extend it.
> SIH26102 · Team Synaptix.

---

## 1. The one-paragraph mental model

VyayRakshak is a **read-only analytics layer on top of MPLADS/eSAKSHI**. It never
writes back to the source — it just *reads* work records and *appends* its own
derived columns (a risk score, flags and plain-language reasons). The whole thing
is a **Next.js 14 (App Router) app in TypeScript**. There is **no database and no
required API key**: a deterministic generator builds a realistic **synthetic
dataset** in memory (in the real eSAKSHI schema), a **risk engine** scores every
work across 9 detectors, and the pages render that data. Real national numbers
(₹/MPs/states) are shown separately and are **cited as real**; the per-work rows
are **clearly labelled synthetic**.

```
 generator.ts  ──►  risk/engine.ts  ──►  data/queries.ts  ──►  pages + components
 (synthetic       (9 detectors →       (aggregations:        (dashboard, map,
  eSAKSHI rows)    0–100 score +        stats, charts,        dossiers, chatbot,
                   reasons)             top-flagged, etc.)     unified report…)
```

Everything downstream reads from one in-memory dataset, so the app is fast and
works offline. Swapping in **real MPLADS data later** means implementing one
interface (`MPLADSDataProvider`) — nothing else changes.

---

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 14** (App Router, React Server Components) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** with CSS-variable design tokens |
| Fonts | **Fraunces** (serif display) + Inter (UI) + IBM Plex Mono |
| Charts | **Recharts** |
| Animation | **Framer Motion** |
| Icons | **Lucide** |
| Maps | Custom **SVG** (no external tiles) |
| i18n | Custom cookie-based EN/हिंदी layer (no library) |
| DB (optional/future) | **Prisma** schema in `prisma/schema.prisma` (not used at runtime) |
| Deploy | **Vercel** (auto-deploys from GitHub `main`) |

---

## 3. Running it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

That's it — no `.env` needed. Other scripts:

```bash
npm run build      # production build (also type-checks)
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

Optional: copy `.env.example` → `.env` and set `GEMINI_API_KEY` to enable the
chatbot's LLM fallback. Everything works without it.

---

## 4. Folder map (what lives where)

```
src/
├── app/                      # ROUTES (each folder = a URL)
│   ├── layout.tsx            # root layout: fonts, <SiteChrome>, i18n provider
│   ├── page.tsx              # the landing page (composes home/* sections)
│   ├── dashboard/            # charts + KPIs console
│   ├── projects/             #   /projects (explorer)  + /projects/[id] (dossier)
│   ├── map/                  # geospatial risk map
│   ├── investigation/        # detect→verify→resolve + AI dossier generation
│   ├── unified/              # cross-signal analysis + PDF/JSON export
│   ├── financial/ progress/ evidence/ agencies/ constituencies/ compare/
│   ├── data-sourcing/        # the "real vs synthetic" honesty page
│   ├── test/                 # live "Test a Work" scoring through the real engine
│   ├── showcase/             # full-screen interactive explainer
│   ├── report/ login/ inspection/
│   └── api/
│       ├── assistant/route.ts  # chatbot endpoint (deterministic + Gemini)
│       └── report/route.ts     # anonymous report intake (rate-limited)
│
├── lib/                      # ALL LOGIC (no JSX here)
│   ├── types.ts              # every domain type (Project, RiskAssessment, …)
│   ├── utils.ts              # formatINR, seededRandom, cn(), etc.
│   ├── data/
│   │   ├── generator.ts      # ⭐ builds the synthetic dataset (560 works)
│   │   ├── geo.ts            # states + district lists + map coordinates
│   │   ├── national.ts       # REAL cited national numbers + system-info
│   │   └── queries.ts        # ⭐ all aggregations the UI reads
│   ├── risk/
│   │   ├── config.ts         # weights, thresholds, tier labels/colours
│   │   └── engine.ts         # ⭐ calculateRiskScore() — the 9 detectors
│   ├── mplads/provider.ts    # MPLADSDataProvider interface (mock ↔ official)
│   ├── ai/
│   │   ├── assistant.ts      # ⭐ deterministic chatbot brain
│   │   └── provider.ts       # LLM provider abstraction
│   ├── i18n/
│   │   ├── dictionary.ts     # every string, EN + हिंदी
│   │   ├── server.ts         # getT() for Server Components
│   │   └── provider.tsx      # useI18n() + language toggle for Client Components
│   └── nav.ts                # the navigation menu structure
│
└── components/               # UI (React components)
    ├── ui/                   # primitives: button, card, badge, counter, reveal
    ├── layout/               # navbar, footer, site-chrome, page-header, demo-banner
    ├── home/                 # every landing-page section (hero, metrics, …)
    ├── charts/charts.tsx     # themed Recharts wrappers
    ├── risk/risk-explainer.tsx  # the reusable "why this score" breakdown + gauge
    ├── maps/india-map.tsx    # interactive SVG map
    ├── projects/ investigation/ evidence/ compare/ unified/ … (feature UIs)
    └── ai/assistant-drawer.tsx  # the floating "Ask VyayRakshak" chat panel

public/
├── images/                   # generated illustrations (+ detectors/ = 9 icons)
├── media/loop.mp4            # looped hero video
├── explainer.html            # full interactive explainer (standalone)
└── explainer-embed.html      # cleaned, chrome-stripped version embedded on the site

prisma/schema.prisma          # DB model for the "scale to real data" story (unused at runtime)
```

The ⭐ files are the ones to read first — they hold the core logic.

---

## 5. The core: how a risk score is produced

Everything hinges on **`src/lib/risk/engine.ts` → `calculateRiskScore(input)`**.

It takes a `ScoringInput` (the raw signals for one work) and returns a
`RiskAssessment`:

```ts
{
  totalScore,          // 0–100
  riskLevel,           // LOW | MEDIUM | HIGH | CRITICAL
  financialRisk, progressRisk, costRisk, timelineRisk,
  evidenceRisk, agencyRisk, geospatialRisk,   // per-dimension sub-scores
  factors,             // [{ label, contribution, weight, detail }]  ← the "why"
  anomalies,           // [{ category, label, detail, severity }]    ← the flags
  recommendation,      // plain-language next step
  confidence,          // 0–1
}
```

**How it works:** each of 7 weighted dimensions has its own scorer function
(`financialScore`, `progressScore`, …). Each returns a 0–100 sub-score **plus a
human-readable `detail` sentence**. The dimensions are blended using the weights
in `src/lib/risk/config.ts`:

| Dimension | Weight |
|---|---|
| Financial | 25% |
| Progress | 20% |
| Cost benchmark | 15% |
| Timeline | 15% |
| Evidence | 10% |
| Agency history | 10% |
| Geospatial / duplicate | 5% |

Tiers: `LOW 0–24 · MEDIUM 25–49 · HIGH 50–74 · CRITICAL 75–100`.

The 9 named **detectors** the product talks about map onto this: the 7 weighted
dimensions **plus** two named signals surfaced as anomalies — **Duplicate Works**
and our own **March Rush** (fiscal year-end spend concentration). `deriveAnomalies()`
turns threshold breaches into the ⚠ flags you see in the dossier.

> **Key idea for the demo:** the score is never a black box. Every point traces
> to a `factor` with a `detail` sentence, rendered by
> `components/risk/risk-explainer.tsx` (the gauge + factor bars + anomaly chips).

**To re-tune the model:** edit weights/thresholds in `risk/config.ts`. Nothing in
the UI hard-codes them — it reads from config.

---

## 6. The data: synthetic but realistic

**`src/lib/data/generator.ts`** builds 560 works with a **seeded RNG** (so the
data is identical on every run — stable for demos). Each work has the real
eSAKSHI-style fields (see `types.ts › Project`): code, MP, constituency, state,
district, sector, sanctioned/expenditure, dates, `photo_hash`-style evidence,
`progress_pct`, `marchSharePct`, etc.

Two things are deliberately planted so the demo always has a story:
- **Showcase works** (`n < 14`) are forced severe → guaranteed CRITICAL cases.
- **A bad-actor agency** — *Rapid Infra Developers Pvt Ltd* — gets the first 12
  works and a ~92% anomaly rate (≈5× the national average), mirroring a repeat-
  offender contractor.

The generator runs `calculateRiskScore()` on every work as it creates it, so the
risk data is baked into the dataset. `getDataset()` memoises it (built once).

**`src/lib/data/queries.ts`** is the read layer every page uses:
`platformStats()`, `riskDistribution()`, `topFlagged()`, `districtIntel()`,
`anomaliesByCategory()`, `constituencyIntel()`, etc. If a page needs an aggregate,
it should live here (not inline in the component).

**`src/lib/data/national.ts`** holds the **real, cited** numbers (₹3,940 Cr/yr,
788 MPs, ₹47,572.75 Cr since 1993, eSAKSHI live 1 Apr 2023) shown separately from
the synthetic set. Never mix these two — the honesty split is a core selling point
(see the `/data-sourcing` page).

---

## 7. The provider abstraction (how real data plugs in)

**`src/lib/mplads/provider.ts`** defines `MPLADSDataProvider` — the seam between
the app and its data source:

```ts
interface MPLADSDataProvider {
  getProjects(); getAgencies(); getStates(); getDistricts(); getConstituencies();
}
```

Today only `MockMPLADSProvider` (backed by the generator) is wired. To go live
with real MPLADS data, implement `OfficialMPLADSProvider` against the same
interface and return it from `getProvider()`. **No page or component changes** —
they all read through this and through `queries.ts`.

---

## 8. Internationalisation (EN / हिंदी)

Custom, no library. Three files in `src/lib/i18n/`:

- **`dictionary.ts`** — every user-facing string under nested keys, for both `en`
  and `hi`. `resolve(locale, key)` looks a key up (falls back to English before
  ever showing a raw key).
- **`server.ts`** — `getT()` reads the `vr_lang` cookie and returns a `t()` for
  **Server Components** (most pages).
- **`provider.tsx`** — `useI18n()` gives `t`, `locale`, `toggle()` to **Client
  Components**. The navbar's language button sets the cookie and calls
  `router.refresh()` so server-rendered text re-renders in the new language.

**To add/þchange a string:** add the key to *both* `en` and `hi` in
`dictionary.ts`, then use `t("your.key")`. In a server component:
`const { t } = getT();`. In a client component: `const { t } = useI18n();`.

> Coverage note: the landing page, chrome (nav/footer), and the newer pages are
> fully bilingual. Some interior data-page labels and the AI-generated risk
> *reason sentences* are still English — a good "good-first-issue" for a teammate.

---

## 9. The chatbot ("Ask VyayRakshak")

Two layers, in `src/lib/ai/assistant.ts` and `src/app/api/assistant/route.ts`:

1. **Deterministic brain** (`askVyayRakshak`) — rule-based intent matching over
   the real dataset. Handles greetings, "highest-risk works", "worst agency",
   "duplicate works", "what is March Rush?", sector/state filters, counts,
   "why is work 100005 high risk?", etc. It returns `confident: true` for these.
   Because it reads the actual data, **it can't invent numbers**.
2. **Gemini fallback** — only when the deterministic layer returns
   `confident: false` **and** `GEMINI_API_KEY` is set. The route calls Gemini with
   a grounded context (`buildContext()`) and a strict system prompt. No key → it
   simply returns the deterministic help text. It **never** calls the LLM unless
   needed.

The floating panel UI is `components/ai/assistant-drawer.tsx`.

---

## 10. The design system

All theming is **CSS variables** in `src/app/globals.css`, mapped to Tailwind
tokens in `tailwind.config.ts`. Never hard-code hex colours in components — use
tokens like `text-fg`, `bg-surface`, `text-accent`, `text-low/medium/high/critical`.

- **Cream editorial theme**: deep matte parchment background (`--bg`) with a fine
  grain texture; near-white cards (`--surface`) so they pop.
- **Dual accents**: default is **Saffron (`--accent`) + Teal (`--accent-2`)**.
  Editorial pages can set `data-accent="terracotta"` on a wrapper to switch the
  accent family (used on `/data-sourcing`).
- **3D "plate" cards**: the `.plate` / `.plate-raised` / `.btn-3d` utility classes
  give the layered-shadow, lift-on-hover look.
- **Type**: headings use Fraunces (`font-display`), body uses Inter.

Reusable primitives live in `components/ui/`: `Button`/`ButtonLink`, `Card`/
`StatTile`, `RiskBadge`, `AnimatedCounter`, `Reveal`/`Stagger` (scroll animations).

---

## 11. Common "how do I…" recipes

**Add a new page** → create `src/app/<name>/page.tsx` (a Server Component). Use
`<PageHeader …/>`, pull data from `queries.ts`, and add a link in `src/lib/nav.ts`
(+ its label to `dictionary.ts`).

**Add a chart** → use the wrappers in `components/charts/charts.tsx`
(`RiskDonut`, `VBarChart`, `HBarChart`, `TrendLine`) — they're already themed.

**Add a detector / change scoring** → edit `src/lib/risk/engine.ts` (add a scorer
+ weight in `config.ts`, and a flag in `deriveAnomalies`). The dossier UI updates
automatically because it renders whatever `factors`/`anomalies` come back.

**Teach the chatbot a new question** → add an intent branch in
`askVyayRakshak()` in `src/lib/ai/assistant.ts`.

**Connect real MPLADS data** → implement `OfficialMPLADSProvider` in
`src/lib/mplads/provider.ts`; optionally provision Postgres with
`prisma/schema.prisma`.

**Server vs Client components** → default is Server (can read cookies, run
`getT()`, query data directly). Add `"use client"` only when you need state,
effects, or browser APIs (forms, the chatbot, the map interactions, charts).

---

## 12. Deployment

- Hosted on **Vercel**, project `apex-nova-s-projects/vyayrakshak`, connected to
  the GitHub repo. **Every push to `main` auto-deploys to production.**
- Live URL: **https://vyayrakshak.vercel.app**
- To enable the chatbot LLM in prod: add `GEMINI_API_KEY` in Vercel → Settings →
  Environment Variables, then redeploy.

---

## 13. Important honesty rules (please keep these)

VyayRakshak is a **decision-support** system. Throughout the app we state:
- It **flags anomalies for human verification** — it does **not** determine fraud.
- **National figures are real & cited**; **per-work rows are synthetic** (eSAKSHI
  schema). Never present synthetic rows as real government records.
- It's a **read-only** layer that never writes to the source.

These lines appear in the footer, the demo banner, the dossiers and the
`/data-sourcing` page. Keep them intact — they're central to the pitch.
```
