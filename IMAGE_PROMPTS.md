# VyayRakshak — Image & Animation Generation Prompts

Generate these, drop the files into `public/images/` with the **exact filenames**
below, and tell me — I'll wire each into the right slot (they're referenced but
optional; the site works without them). Keep the palette consistent:

- **Cream / parchment** background `#F3ECD9`
- **Saffron** accent `#F5900A`
- **Deep teal ink** `#1F5D66`
- **Espresso** `#3A2A1E` (editorial pages)
- Style words to reuse: *warm, editorial, premium Indian GovTech, matte, subtle
  paper grain, soft long shadows, flat-3D isometric, not neon, not corporate-blue*

> Style tip: add `--ar 16:9 --style raw` (Midjourney) or set the aspect ratio in
> your tool. Ask for **transparent PNG** where noted.

---

## 1. Hero backdrop (optional, behind the animated graph)
**File:** `public/images/hero-texture.png` · **AR:** 16:9 · transparent-ish PNG
> A soft abstract data-intelligence texture on a warm cream background: faint
> concentric contour lines like a topographic map, a few glowing saffron nodes
> connected by thin teal lines, subtle paper grain, generous negative space,
> matte finish, no text, editorial GovTech aesthetic, muted.

## 2. "The Problem" section illustration
**File:** `public/images/problem-desk.png` · **AR:** 4:3 · transparent PNG
> Flat-3D isometric illustration of a government audit desk: stacks of sanction
> files, a magnifying glass over a ledger, small map pins, a rupee coin stack,
> rendered in cream + saffron + teal, soft long shadows, matte clay style, no
> text, warm and trustworthy.

## 3. Solution-process / "how it works" motif
**File:** `public/images/process-flow.png` · **AR:** 16:9 · transparent PNG
> Isometric conveyor of documents transforming into a glowing risk-score gauge:
> raw paper records on the left flowing through a lens into a 0–100 dial on the
> right, saffron-and-teal on cream, flat-3D, matte, subtle grain, no text.

## 4. Detector / "AI intelligence" icon set (9 tiles)
**File:** `public/images/detectors-sprite.png` (or 9 separate PNGs
`detector-financial.png` … `detector-march.png`) · square · transparent PNG
> A set of 9 matching flat-3D isometric icons on transparent background, saffron
> + teal on cream, matte clay style, thin outlines: (1) rupee with warning, (2)
> progress bars mismatched, (3) balance scale, (4) two identical documents, (5)
> stopwatch, (6) duplicated photograph, (7) office building with a flag, (8) map
> with clustered pins, (9) a March calendar page with a spike. Consistent
> lighting and proportions across all nine.

## 5. Geospatial / map hero
**File:** `public/images/india-abstract.png` · **AR:** 1:1 · transparent PNG
> Stylised abstract map of India as a soft cream silhouette with a scattering of
> glowing saffron and teal risk dots and faint district cells, topographic
> contour texture, matte, premium data-intelligence look, no labels, no text.

## 6. Investigation / dossier motif
**File:** `public/images/dossier.png` · **AR:** 4:3 · transparent PNG
> Flat-3D isometric case dossier folder opening to reveal a risk gauge, a photo
> with a magnifier, and a checklist, saffron + teal on cream, matte, soft
> shadows, trustworthy governance feel, no text.

## 7. Evidence / photo-verification motif
**File:** `public/images/evidence.png` · **AR:** 4:3 · transparent PNG
> Two overlapping site-photograph frames with a perceptual-hash grid overlay and
> a "match" indicator between them, isometric flat-3D, cream + saffron + teal,
> matte, no text — conveys "same photo reused for two works".

## 8. Open-Graph / social share card
**File:** `public/images/og.png` · **AR:** 1200×630 (exact)
> A share card on cream: left side the word "VyayRakshak" in an elegant serif
> (Fraunces-like) deep-teal wordmark with a small saffron shield mark, tagline
> "AI risk intelligence for MPLADS — a read-only layer", right side the abstract
> India risk-dot map from #5. Balanced, premium, government-grade, matte.

## 9. Favicon / app mark (already have an SVG — optional richer version)
**File:** `public/images/mark-512.png` · 512×512 · transparent PNG
> A minimal shield containing a subtle magnifying-lens + upward data node, saffron
> on deep-teal, flat, crisp at small sizes, no text.

---

## Animations already built in (no assets needed)
- Hero **data-flow graph** (particles flowing into the AI core) — saffron/teal SVG.
- **3D "plate" cards** that lift on hover; **raised saffron buttons** with press depth.
- **Scroll-reveal** on every section; **scroll-driven** process rail fill.
- **Animated counters** on the metrics band.
- **Risk gauge** sweep + factor bars animate in the dossier.
- **Map** pulsing rings on high/critical districts.
- Dossier **generation sequence** (checklist → reveal).

### Optional richer animations you could generate (video/Lottie)
- A 4–6s **looping hero video** (`public/images/hero-loop.mp4`, ~1–2 MB, muted):
  > Slow abstract loop of paper records flowing into a glowing saffron risk gauge
  > on cream, topographic lines drifting, matte, seamless loop, no text.
- A **Lottie** JSON of the 9-detector radial (drop as `public/images/detectors.json`).

Tell me which files you've generated and I'll wire them in and adjust layouts to
frame them.
