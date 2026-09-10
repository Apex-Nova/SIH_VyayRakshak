"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DossierGenerator } from "./dossier-generator";
import { formatINR, cn } from "@/lib/utils";
import {
  Search,
  FileSearch,
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Truck,
} from "lucide-react";

const WORKFLOW = [
  { icon: Search, label: "Detect", desc: "Anomalies surfaced" },
  { icon: FileSearch, label: "Explain", desc: "Factors decomposed" },
  { icon: ClipboardList, label: "Review", desc: "Analyst triage" },
  { icon: ShieldCheck, label: "Verify", desc: "Field inspection" },
  { icon: CheckCircle2, label: "Resolve", desc: "Outcome recorded" },
];

type CaseState = "OPEN" | "DISPATCHED";

export function InvestigationCenter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const [states, setStates] = useState<Record<string, CaseState>>({});

  return (
    <div className="space-y-8">
      {/* Workflow rail */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-fg">
          From Detection to Investigation
        </h2>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          {WORKFLOW.map((w, i) => (
            <div key={w.label} className="flex flex-1 items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/30">
                  <w.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-fg">{w.label}</div>
                  <div className="text-[11px] text-faint">{w.desc}</div>
                </div>
              </div>
              {i < WORKFLOW.length - 1 && (
                <div className="hidden h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Flagged cases */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-fg">Flagged Works</h2>
          <span className="text-xs text-faint">{projects.length} priority cases</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-faint">{p.projectCode}</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-fg">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    ID: {p.id} · {p.district}, {p.stateName} ·{" "}
                    {formatINR(p.sanctionedAmount, { compact: true })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="tabular text-2xl font-bold text-critical">
                    {p.risk.totalScore}
                    <span className="text-sm text-faint">/100</span>
                  </span>
                  <RiskBadge level={p.risk.riskLevel} showSymbol={false} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.risk.anomalies.slice(0, 3).map((a) => (
                  <span
                    key={a.category}
                    className="rounded-md bg-high/10 px-2 py-0.5 text-[11px] font-medium text-high ring-1 ring-high/20"
                  >
                    {a.label}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setActive(p)}>
                  <Sparkles className="h-3.5 w-3.5" /> Generate Dossier
                </Button>
                <Button
                  size="sm"
                  variant={states[p.id] === "DISPATCHED" ? "outline" : "secondary"}
                  onClick={() =>
                    setStates((s) => ({ ...s, [p.id]: "DISPATCHED" }))
                  }
                  disabled={states[p.id] === "DISPATCHED"}
                >
                  <Truck className="h-3.5 w-3.5" />
                  {states[p.id] === "DISPATCHED"
                    ? "Team Dispatched"
                    : "Dispatch Field Team"}
                </Button>
              </div>
              {states[p.id] === "DISPATCHED" && (
                <p className={cn("mt-2 text-xs text-low")}>
                  ✓ District field inspection team assigned. Case moved to VERIFY.
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {active && (
        <DossierGenerator
          project={active}
          open={!!active}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
