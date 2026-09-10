"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DistrictIntel, RiskLevel } from "@/lib/types";
import { RISK_META } from "@/lib/risk/config";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { MapPin, X } from "lucide-react";

const RISK_HSL: Record<RiskLevel, string> = {
  LOW: "hsl(152 62% 45%)",
  MEDIUM: "hsl(42 96% 55%)",
  HIGH: "hsl(24 94% 56%)",
  CRITICAL: "hsl(0 84% 60%)",
};

// Approximate, stylised India outline on a 0..100 canvas. Not geographically
// precise — used as a recognisable backdrop for the data layer.
const INDIA_PATH =
  "M34,6 L38,5 L41,9 L39,14 L44,17 L47,22 L45,27 L52,26 L58,29 L63,26 L69,28 L67,33 L72,31 L79,25 L80,29 L76,34 L71,35 L66,35 L63,40 L60,45 L57,49 L52,54 L48,60 L44,66 L41,74 L39,80 L37,74 L35,66 L32,60 L30,54 L27,48 L23,44 L18,40 L15,38 L18,34 L22,32 L24,30 L23,26 L26,22 L28,18 L30,13 L31,9 Z";

export function IndiaMap({
  districts,
  projectPoints,
}: {
  districts: DistrictIntel[];
  projectPoints: {
    id: string;
    mapX: number;
    mapY: number;
    level: RiskLevel;
    name: string;
    score: number;
    district: string;
  }[];
}) {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [showProjects, setShowProjects] = useState(false);
  const [selected, setSelected] = useState<DistrictIntel | null>(null);
  const [hover, setHover] = useState<{ d: DistrictIntel; x: number; y: number } | null>(
    null
  );

  const visibleDistricts = useMemo(
    () =>
      districts.filter((d) => riskFilter === "ALL" || d.riskLevel === riskFilter),
    [districts, riskFilter]
  );
  const visiblePoints = useMemo(
    () =>
      showProjects
        ? projectPoints.filter((p) => riskFilter === "ALL" || p.level === riskFilter)
        : [],
    [projectPoints, showProjects, riskFilter]
  );

  const maxProjects = Math.max(...districts.map((d) => d.projects), 1);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      {/* Map canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Controls */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {(["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                riskFilter === r
                  ? "bg-accent text-on-accent"
                  : "bg-surface-2 text-muted ring-1 ring-border hover:text-fg"
              }`}
            >
              {r === "ALL" ? "All" : RISK_META[r].label}
            </button>
          ))}
        </div>
        <div className="absolute right-3 top-3 z-10 flex gap-1.5">
          <button
            onClick={() => setShowProjects((s) => !s)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              showProjects
                ? "bg-accent text-on-accent"
                : "bg-surface-2 text-muted ring-1 ring-border hover:text-fg"
            }`}
          >
            {showProjects ? "Hide" : "View"} Projects
          </button>
          <button
            onClick={() => {
              setRiskFilter("ALL");
              setShowProjects(false);
              setSelected(null);
            }}
            className="rounded-md bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted ring-1 ring-border hover:text-fg"
          >
            Reset
          </button>
        </div>

        <div className="bg-grid">
          <svg viewBox="0 0 100 100" className="h-full w-full" style={{ aspectRatio: "1 / 1" }}>
            <defs>
              <radialGradient id="indiaFill" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="hsl(30 96% 50% / 0.10)" />
                <stop offset="100%" stopColor="hsl(186 58% 32% / 0.05)" />
              </radialGradient>
            </defs>
            <path
              d={INDIA_PATH}
              fill="url(#indiaFill)"
              stroke="hsl(186 58% 32% / 0.4)"
              strokeWidth="0.4"
            />

            {/* District risk bubbles */}
            {visibleDistricts.map((d) => {
              const r = 1.4 + (d.projects / maxProjects) * 3.4;
              return (
                <g key={`${d.stateId}-${d.district}`}>
                  <motion.circle
                    cx={d.mapX}
                    cy={d.mapY}
                    r={r}
                    fill={RISK_HSL[d.riskLevel]}
                    fillOpacity={0.22}
                    stroke={RISK_HSL[d.riskLevel]}
                    strokeWidth="0.4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ cursor: "pointer", transformOrigin: `${d.mapX}px ${d.mapY}px` }}
                    onMouseEnter={() => setHover({ d, x: d.mapX, y: d.mapY })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setSelected(d)}
                  />
                  {(d.riskLevel === "CRITICAL" || d.riskLevel === "HIGH") && (
                    <motion.circle
                      cx={d.mapX}
                      cy={d.mapY}
                      r={r}
                      fill="none"
                      stroke={RISK_HSL[d.riskLevel]}
                      strokeWidth="0.3"
                      initial={{ opacity: 0.6, scale: 1 }}
                      animate={{ opacity: 0, scale: 2 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ transformOrigin: `${d.mapX}px ${d.mapY}px` }}
                    />
                  )}
                </g>
              );
            })}

            {/* Individual project points */}
            {visiblePoints.map((p) => (
              <circle
                key={p.id}
                cx={p.mapX}
                cy={p.mapY}
                r={0.7}
                fill={RISK_HSL[p.level]}
                fillOpacity={0.9}
              />
            ))}
          </svg>
        </div>

        {/* Hover tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-xl"
            style={{ left: `${hover.x}%`, top: `${hover.y - 2}%` }}
          >
            <div className="font-semibold text-fg">{hover.d.district}</div>
            <div className="text-faint">{hover.d.stateName}</div>
            <div className="mt-1 flex items-center gap-2">
              <RiskBadge level={hover.d.riskLevel} showSymbol={false} />
              <span className="tabular text-muted">{hover.d.projects} works</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-faint">
          <div className="flex items-center gap-3">
            {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as RiskLevel[]).map((l) => (
              <span key={l} className="flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: RISK_HSL[l] }}
                />
                {RISK_META[l].label}
              </span>
            ))}
          </div>
          <span>Stylised map · positions illustrative</span>
        </div>
      </div>

      {/* District panel */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        {selected ? (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-faint">
                  <MapPin className="h-3.5 w-3.5" /> District Intelligence
                </div>
                <h3 className="mt-1 text-lg font-bold text-fg">{selected.district}</h3>
                <p className="text-xs text-muted">{selected.stateName}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-surface-2"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Metric label="Projects" value={selected.projects.toLocaleString("en-IN")} />
              <Metric
                label="Sanctioned"
                value={formatINR(selected.sanctioned, { compact: true })}
              />
              <Metric label="Anomalies" value={selected.anomalies.toLocaleString("en-IN")} />
              <Metric label="Avg Risk" value={`${selected.avgRiskScore}/100`} />
            </div>
            <div className="mt-3">
              <RiskBadge level={selected.riskLevel} score={selected.avgRiskScore} />
            </div>
            <Link
              href={`/projects?level=${selected.riskLevel}`}
              className="mt-4 inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-surface-2 text-xs font-semibold text-fg ring-1 ring-border transition-colors hover:bg-surface-2/70"
            >
              View works in this risk band
            </Link>
          </div>
        ) : (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center">
            <MapPin className="h-7 w-7 text-faint" />
            <p className="mt-3 text-sm font-medium text-fg">
              Select a district on the map
            </p>
            <p className="mt-1 text-xs text-muted">
              Bubble size reflects project count; colour reflects risk level.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/40 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-0.5 text-sm font-bold tabular text-fg">{value}</div>
    </div>
  );
}
