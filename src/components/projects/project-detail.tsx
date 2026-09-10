"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { RiskBadge, Chip } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskExplainer } from "@/components/risk/risk-explainer";
import { DossierGenerator } from "@/components/investigation/dossier-generator";
import { formatINR, formatDate, cn, pct } from "@/lib/utils";
import {
  FileText,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Camera,
} from "lucide-react";

const TABS = [
  "Overview",
  "Financial",
  "Progress",
  "Evidence",
  "Documents",
  "Location",
  "Risk Analysis",
] as const;
type Tab = (typeof TABS)[number];

export function ProjectDetail({ project: p }: { project: Project }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [dossier, setDossier] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Chip>#{p.id}</Chip>
                <Chip>{p.sector}</Chip>
                <Chip>{p.status.replace("_", " ")}</Chip>
              </div>
              <h1 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                {p.name}
              </h1>
              <p className="mt-1.5 font-mono text-xs text-faint">{p.projectCode}</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" /> {p.village}, {p.block}, {p.district},{" "}
                {p.stateName}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <RiskBadge level={p.risk.riskLevel} score={p.risk.totalScore} />
              <Button onClick={() => setDossier(true)}>
                <Sparkles className="h-4 w-4" /> Generate Dossier
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickStat label="Sanctioned" value={formatINR(p.sanctionedAmount, { compact: true })} />
            <QuickStat
              label="Utilization"
              value={`${p.financial.utilizationPercentage}%`}
            />
            <QuickStat label="Physical Progress" value={`${p.progress.physicalProgress}%`} />
            <QuickStat label="Delay" value={`${p.progress.delayDays} days`} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 scroll-thin sm:px-6">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors",
                  tab === t ? "text-fg" : "text-muted hover:text-fg"
                )}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {tab === "Overview" && <Overview p={p} />}
          {tab === "Financial" && <Financial p={p} />}
          {tab === "Progress" && <Progress p={p} />}
          {tab === "Evidence" && <EvidenceTab p={p} />}
          {tab === "Documents" && <Documents p={p} />}
          {tab === "Location" && <Location p={p} />}
          {tab === "Risk Analysis" && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <RiskExplainer risk={p.risk} title="Risk factor breakdown" />
            </div>
          )}
        </motion.div>
      </div>

      <DossierGenerator project={p} open={dossier} onClose={() => setDossier(false)} />
    </>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-3">
      <div className="text-[10px] uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-0.5 text-lg font-bold tabular text-fg">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="mb-4 text-sm font-semibold text-fg">{title}</h3>
      {children}
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted">{k}</span>
      <span className="tabular font-medium text-fg">{v}</span>
    </div>
  );
}

function Overview({ p }: { p: Project }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Project Metadata">
        <KV k="Project ID" v={`#${p.id}`} />
        <KV k="Sector / Sub-sector" v={`${p.sector} · ${p.subSector}`} />
        <KV k="Constituency" v={p.constituency} />
        <KV k="Member of Parliament" v={p.mpName} />
        <KV k="Implementing Agency" v={p.agencyName} />
        <KV k="Financial Year" v={p.financialYear} />
        <KV k="Status" v={p.status.replace("_", " ")} />
      </Panel>
      <div className="space-y-6">
        <Panel title="Description">
          <p className="text-sm leading-relaxed text-muted">{p.description}</p>
        </Panel>
        <Panel title="Risk Summary">
          <RiskExplainer risk={p.risk} compact />
        </Panel>
      </div>
    </div>
  );
}

function Financial({ p }: { p: Project }) {
  const f = p.financial;
  const bars = [
    { label: "Sanctioned", value: f.sanctionedAmount },
    { label: "Released", value: f.releasedAmount },
    { label: "Expenditure", value: f.expenditure },
  ];
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Funds & Expenditure">
        <KV k="Sanctioned Amount" v={formatINR(f.sanctionedAmount)} />
        <KV k="Released Amount" v={formatINR(f.releasedAmount)} />
        <KV k="Expenditure" v={formatINR(f.expenditure)} />
        <KV k="Unspent Balance" v={formatINR(f.unspentAmount)} />
        <KV k="Interest Accrued" v={formatINR(f.interest)} />
        <KV k="Utilization" v={`${f.utilizationPercentage}%`} />
        <KV k="March Share" v={`${f.marchSharePct}%`} />
      </Panel>
      <Panel title="Flow Comparison">
        <div className="space-y-4">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted">{b.label}</span>
                <span className="tabular font-medium text-fg">
                  {formatINR(b.value, { compact: true })}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-2 to-accent"
                  style={{ width: `${pct(b.value, max)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {f.utilizationPercentage > 120 && (
          <div className="mt-4 rounded-lg border border-high/30 bg-high/10 px-3 py-2 text-xs text-high">
            Over-disbursement detected: expenditure exceeds sanctioned amount.
          </div>
        )}
      </Panel>
    </div>
  );
}

function Progress({ p }: { p: Project }) {
  const events = [
    { label: "Recommended", date: p.startDate, done: true },
    { label: "Sanctioned", date: p.startDate, done: true },
    { label: "Started", date: p.startDate, done: true },
    {
      label: "Milestone: Mid execution",
      date: p.expectedCompletionDate,
      done: p.progress.physicalProgress > 40,
    },
    {
      label: "Milestone: Final stage",
      date: p.expectedCompletionDate,
      done: p.progress.physicalProgress > 75,
    },
    {
      label: "Completed",
      date: p.actualCompletionDate ?? p.expectedCompletionDate,
      done: p.status === "COMPLETED",
    },
  ];
  const gap = p.progress.reportedProgress - p.progress.physicalProgress;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Financial vs Physical Progress">
        {[
          { label: "Reported financial completion", v: p.progress.reportedProgress, c: "bg-accent-2" },
          { label: "Verified physical progress", v: p.progress.physicalProgress, c: "bg-accent" },
        ].map((row) => (
          <div key={row.label} className="mb-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted">{row.label}</span>
              <span className="tabular font-medium text-fg">{row.v}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div className={cn("h-full rounded-full", row.c)} style={{ width: `${row.v}%` }} />
            </div>
          </div>
        ))}
        <div
          className={cn(
            "mt-2 rounded-lg px-3 py-2 text-xs",
            gap > 20
              ? "border border-high/30 bg-high/10 text-high"
              : "border border-low/30 bg-low/10 text-low"
          )}
        >
          {gap > 20
            ? `Mismatch score ${gap}: reported completion outpaces verified progress.`
            : "Financial and physical progress broadly aligned."}
        </div>
      </Panel>
      <Panel title="Timeline">
        <ol className="relative ml-2 space-y-4 border-l border-border pl-5">
          {events.map((e, i) => (
            <li key={i} className="relative">
              <span
                className={cn(
                  "absolute -left-[27px] grid h-4 w-4 place-items-center rounded-full ring-2 ring-surface",
                  e.done ? "bg-accent" : "bg-surface-2"
                )}
              >
                {e.done && <CheckCircle2 className="h-3 w-3 text-on-accent" />}
              </span>
              <div className="text-sm font-medium text-fg">{e.label}</div>
              <div className="text-xs text-faint">{formatDate(e.date)}</div>
            </li>
          ))}
        </ol>
        {p.progress.delayDays > 0 && (
          <div className="mt-4 rounded-lg border border-medium/30 bg-medium/10 px-3 py-2 text-xs text-medium">
            {p.progress.delayDays} days behind the expected completion date.
          </div>
        )}
      </Panel>
    </div>
  );
}

function EvidenceTab({ p }: { p: Project }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {p.evidence.map((e) => (
        <div key={e.id} className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-surface-2 to-bg">
            <Camera className="h-8 w-8 text-faint" />
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-fg">{e.label}</span>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  e.status === "VERIFIED" ? "text-low" : "text-high"
                )}
              >
                {e.status.replace("_", " ")}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-[11px] text-faint">
              <div>Timestamp: {formatDate(e.timestamp)}</div>
              <div>
                Geo: {e.latitude.toFixed(3)}, {e.longitude.toFixed(3)}
              </div>
              <div>Similarity: {e.similarityScore}%</div>
              <div>Hash: {e.hash}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Documents({ p }: { p: Project }) {
  return (
    <Panel title="Official Records">
      <div className="grid gap-2 sm:grid-cols-2">
        {p.documents.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between rounded-lg border border-border bg-surface-2/40 px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-faint" />
              <div>
                <div className="text-sm text-fg">{d.name}</div>
                <div className="text-[11px] text-faint">{d.type}</div>
              </div>
            </div>
            {d.present ? (
              <span className="flex items-center gap-1 text-xs font-medium text-low">
                <CheckCircle2 className="h-3.5 w-3.5" /> On record
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-high">
                <XCircle className="h-3.5 w-3.5" /> Missing
              </span>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Location({ p }: { p: Project }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface bg-grid">
        <svg viewBox="0 0 100 100" className="h-full w-full" style={{ aspectRatio: "4/3" }}>
          <circle cx={p.mapX} cy={p.mapY} r="2" fill="hsl(190 95% 52%)" />
          <circle
            cx={p.mapX}
            cy={p.mapY}
            r="5"
            fill="none"
            stroke="hsl(190 95% 52% / 0.5)"
            strokeWidth="0.4"
          >
            <animate attributeName="r" values="2;7;2" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-surface/90 px-3 py-1.5 text-[11px] text-muted">
          Stylised location · illustrative
        </div>
      </div>
      <Panel title="Geographic Details">
        <KV k="State" v={p.stateName} />
        <KV k="District" v={p.district} />
        <KV k="Block" v={p.block} />
        <KV k="Village" v={p.village} />
        <KV k="Latitude" v={p.latitude.toFixed(4)} />
        <KV k="Longitude" v={p.longitude.toFixed(4)} />
      </Panel>
    </div>
  );
}
