"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, cn } from "@/lib/utils";
import { MapPin, CheckCircle2, Camera } from "lucide-react";

const CHECKS = [
  "Project exists",
  "Location matches records",
  "Work completed as reported",
  "Quality acceptable",
  "Expenditure verified against bills",
  "Documents verified",
  "Photographs captured on site",
];

type Verdict = "PASS" | "FAIL" | "REVIEW" | null;

export function InspectionMode({ project: p }: { project: Project }) {
  const [checked, setChecked] = useState<boolean[]>(CHECKS.map(() => false));
  const [verdict, setVerdict] = useState<Verdict>(null);

  const doneCount = checked.filter(Boolean).length;

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* Assignment card */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Assigned Inspection
          </span>
          <RiskBadge level={p.risk.riskLevel} score={p.risk.totalScore} showSymbol={false} />
        </div>
        <h2 className="mt-2 text-base font-bold text-fg">{p.name}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5" /> {p.village}, {p.district}, {p.stateName}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-surface-2/50 p-2">
            <div className="text-faint">Sanctioned</div>
            <div className="font-semibold text-fg">
              {formatINR(p.sanctionedAmount, { compact: true })}
            </div>
          </div>
          <div className="rounded-lg bg-surface-2/50 p-2">
            <div className="text-faint">Agency</div>
            <div className="truncate font-semibold text-fg">{p.agencyName}</div>
          </div>
        </div>
      </div>

      {/* Risk factors */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
          Why this was flagged
        </h3>
        <ul className="mt-2 space-y-1.5">
          {p.risk.anomalies.slice(0, 4).map((a) => (
            <li key={a.category} className="text-xs text-muted">
              <span className="font-semibold text-high">• {a.label}</span> — {a.detail}
            </li>
          ))}
        </ul>
      </div>

      {/* Evidence */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
          Existing Evidence
        </h3>
        <div className="mt-2 flex gap-2 overflow-x-auto scroll-thin">
          {p.evidence.map((e) => (
            <div key={e.id} className="shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-surface-2 to-bg">
                <Camera className="h-5 w-5 text-faint" />
              </div>
              <div
                className={cn(
                  "mt-1 text-center text-[9px] font-medium",
                  e.status === "VERIFIED" ? "text-low" : "text-high"
                )}
              >
                {e.status.replace("_", " ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
            Verification Checklist
          </h3>
          <span className="text-xs text-muted">
            {doneCount}/{CHECKS.length}
          </span>
        </div>
        <div className="mt-3 space-y-1">
          {CHECKS.map((c, i) => (
            <button
              key={c}
              onClick={() =>
                setChecked((arr) => arr.map((v, idx) => (idx === i ? !v : v)))
              }
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-2/50"
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                  checked[i] ? "border-accent bg-accent" : "border-border"
                )}
              >
                {checked[i] && <CheckCircle2 className="h-3.5 w-3.5 text-on-accent" />}
              </span>
              <span className={cn("text-sm", checked[i] ? "text-fg" : "text-muted")}>
                {c}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Verdict */}
      {verdict ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "rounded-2xl border p-5 text-center",
            verdict === "PASS"
              ? "border-low/30 bg-low/10"
              : verdict === "FAIL"
              ? "border-critical/30 bg-critical/10"
              : "border-medium/30 bg-medium/10"
          )}
        >
          <div
            className={cn(
              "text-lg font-bold",
              verdict === "PASS"
                ? "text-low"
                : verdict === "FAIL"
                ? "text-critical"
                : "text-medium"
            )}
          >
            {verdict === "PASS"
              ? "Inspection Passed"
              : verdict === "FAIL"
              ? "Inspection Failed"
              : "Marked for Further Review"}
          </div>
          <p className="mt-1 text-xs text-muted">
            Verdict recorded with {doneCount}/{CHECKS.length} checklist items. Case
            moved to RESOLVE. (Demo — not persisted.)
          </p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => setVerdict(null)}>
            Re-open inspection
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => setVerdict("PASS")} className="bg-low text-[#04140c] hover:bg-low/90">
            PASS
          </Button>
          <Button variant="danger" onClick={() => setVerdict("FAIL")}>
            FAIL
          </Button>
          <Button
            onClick={() => setVerdict("REVIEW")}
            className="bg-medium text-[#1a1200] hover:bg-medium/90"
          >
            REVIEW
          </Button>
        </div>
      )}
    </div>
  );
}
