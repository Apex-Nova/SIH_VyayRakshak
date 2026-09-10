"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

const NODES: { key: string; x: number; y: number }[] = [
  { key: "sources.project", x: 12, y: 22 },
  { key: "sources.financial", x: 8, y: 62 },
  { key: "sources.progress", x: 88, y: 20 },
  { key: "sources.evidence", x: 90, y: 60 },
  { key: "sources.geospatial", x: 50, y: 90 },
];
const CENTER = { x: 50, y: 46 };

export function Hero() {
  const reduce = useReducedMotion();
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      {/* Generated topographic texture backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.28] mix-blend-multiply"
        style={{ backgroundImage: "url(/images/hero-texture.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" aria-hidden />
      <div className="absolute inset-0 bg-radial-accent" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        {/* Copy */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t("hero.eyebrow")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-4xl font-semibold leading-[1.06] tracking-tight text-fg sm:text-5xl lg:text-[3.9rem]"
          >
            {t("hero.titleA")}{" "}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text italic text-transparent">
              {t("hero.titleHi")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="/dashboard" size="lg" className="btn-3d">
              {t("actions.exploreDashboard")} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/#process" variant="outline" size="lg">
              <Play className="h-4 w-4" /> {t("actions.seeHow")}
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-faint"
          >
            <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-accent-2 ring-1 ring-border">
              <Lock className="h-3 w-3" /> {t("hero.readonly")}
            </span>
            <span className="text-muted">{t("hero.pills")}</span>
          </motion.div>
        </div>

        {/* Animated intelligence network */}
        <div className="relative flex items-center justify-center">
          <IntelligenceGraph reduce={!!reduce} t={t} />
        </div>
      </div>
    </section>
  );
}

function IntelligenceGraph({
  reduce,
  t,
}: {
  reduce: boolean;
  t: (k: string) => string;
}) {
  const accent = "hsl(var(--accent))";
  const accent2 = "hsl(var(--accent-2))";
  return (
    <div className="relative aspect-square w-full max-w-lg">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        role="img"
        aria-label="Data sources flowing into the VyayRakshak intelligence layer"
      >
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={accent2} stopOpacity="0.12" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.1" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {NODES.map((n, i) => (
          <g key={n.key}>
            <line
              x1={n.x}
              y1={n.y}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke={accent}
              strokeOpacity="0.3"
              strokeWidth="0.5"
            />
            {!reduce && (
              <motion.circle
                r="0.9"
                fill={accent}
                filter="url(#glow)"
                initial={{ cx: n.x, cy: n.y }}
                animate={{ cx: [n.x, CENTER.x], cy: [n.y, CENTER.y] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeIn",
                }}
              />
            )}
          </g>
        ))}

        {NODES.map((n) => (
          <g key={`node-${n.key}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r="2.4"
              fill="hsl(var(--surface))"
              stroke={accent2}
              strokeOpacity="0.6"
              strokeWidth="0.5"
            />
            <circle cx={n.x} cy={n.y} r="1" fill={accent} />
          </g>
        ))}

        <circle cx={CENTER.x} cy={CENTER.y} r="14" fill="url(#coreGrad)" opacity="0.6" />
        {!reduce && (
          <motion.circle
            cx={CENTER.x}
            cy={CENTER.y}
            r="9"
            fill="none"
            stroke={accent}
            strokeOpacity="0.5"
            strokeWidth="0.4"
            animate={{ r: [8, 13, 8], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="7.5"
          fill="hsl(var(--surface))"
          stroke={accent}
          strokeWidth="0.6"
          filter="url(#glow)"
        />
      </svg>

      {NODES.map((n) => (
        <span
          key={`lbl-${n.key}`}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-faint"
          style={{ left: `${n.x}%`, top: `${n.y + 6}%` }}
        >
          {t(n.key)}
        </span>
      ))}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
      >
        <div className="font-display text-[11px] font-bold uppercase tracking-widest text-accent-2">
          {t("hero.coreLabel")}
        </div>
        <div className="text-[9px] font-medium uppercase tracking-widest text-muted">
          {t("hero.coreSub")}
        </div>
      </div>
    </div>
  );
}
