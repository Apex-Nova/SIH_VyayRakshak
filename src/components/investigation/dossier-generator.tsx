"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, X, Download, FileText, Truck } from "lucide-react";
import type { Project } from "@/lib/types";
import { RiskExplainer } from "@/components/risk/risk-explainer";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, formatDate } from "@/lib/utils";

const STEPS = [
  "Analyzing project data…",
  "Financial signals analyzed",
  "Progress signals analyzed",
  "Historical patterns analyzed",
  "Geospatial signals analyzed",
  "Evidence signals analyzed",
  "Risk model completed",
  "Explanation generated",
];

export function DossierGenerator({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setStep(i);
      if (i >= STEPS.length) {
        clearInterval(timer);
        setTimeout(() => setDone(true), 350);
      }
    }, 420);
    return () => clearInterval(timer);
  }, [open]);

  function exportReport() {
    const r = project.risk;
    const lines = [
      `NIRIKSHAK AI — PROJECT RISK DOSSIER (SIH102 Prototype · Demo Data)`,
      `=============================================================`,
      ``,
      `Project: ${project.name}`,
      `Code: ${project.projectCode}`,
      `ID: ${project.id}`,
      `Location: ${project.village}, ${project.block}, ${project.district}, ${project.stateName}`,
      `Constituency: ${project.constituency}`,
      `Implementing Agency: ${project.agencyName}`,
      `Sector: ${project.sector} / ${project.subSector}`,
      `Status: ${project.status}`,
      ``,
      `FINANCIALS`,
      `  Sanctioned: ${formatINR(project.financial.sanctionedAmount)}`,
      `  Released:   ${formatINR(project.financial.releasedAmount)}`,
      `  Expenditure:${formatINR(project.financial.expenditure)}`,
      `  Utilization:${project.financial.utilizationPercentage}%`,
      ``,
      `PROGRESS`,
      `  Physical:  ${project.progress.physicalProgress}%`,
      `  Reported:  ${project.progress.reportedProgress}%`,
      `  Delay:     ${project.progress.delayDays} days`,
      ``,
      `RISK ASSESSMENT`,
      `  Total Score: ${r.totalScore}/100 (${r.riskLevel})`,
      `  Confidence:  ${(r.confidence * 100).toFixed(0)}%`,
      ``,
      `  Factor contributions:`,
      ...r.factors.map((f) => `   - ${f.label}: +${f.contribution}  (${f.detail})`),
      ``,
      `  Potential irregularities:`,
      ...(r.anomalies.length
        ? r.anomalies.map((a) => `   ! ${a.label} — ${a.detail}`)
        : ["   (none)"]),
      ``,
      `RECOMMENDED ACTION`,
      `  ${r.recommendation}`,
      ``,
      `DISCLAIMER: VyayRakshak is a decision-support system. This dossier`,
      `identifies anomalies for human verification and does not establish fraud`,
      `or wrongdoing. Demo data is illustrative.`,
      ``,
      `Generated: ${new Date().toISOString()}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dossier-${project.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-label="AI risk dossier"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-sm font-bold text-fg">AI Risk Dossier</div>
                  <div className="text-[11px] text-faint">
                    #{project.id} · {project.district}, {project.stateName}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-64px)] overflow-y-auto p-5 scroll-thin">
              {!done ? (
                <div className="space-y-2.5 py-6">
                  {STEPS.map((s, i) => {
                    const state = i < step ? "done" : i === step ? "active" : "idle";
                    return (
                      <div
                        key={s}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          state === "idle" ? "opacity-40" : ""
                        }`}
                      >
                        {state === "done" ? (
                          <CheckCircle2 className="h-4 w-4 text-low" />
                        ) : state === "active" ? (
                          <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-border" />
                        )}
                        <span className={state === "done" ? "text-muted" : "text-fg"}>
                          {s}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="max-w-md text-sm font-bold text-fg">
                        {project.name}
                      </h3>
                      <p className="text-xs text-muted">
                        {project.projectCode} ·{" "}
                        {formatINR(project.sanctionedAmount, { compact: true })}
                      </p>
                    </div>
                    <RiskBadge level={project.risk.riskLevel} score={project.risk.totalScore} />
                  </div>

                  <RiskExplainer risk={project.risk} />

                  {/* Evidence + timeline snapshot */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-surface-2/40 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-faint">
                        Evidence
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {project.evidence.map((e) => (
                          <li key={e.id} className="flex items-center justify-between text-xs">
                            <span className="text-muted">{e.label}</span>
                            <span
                              className={`font-medium ${
                                e.status === "VERIFIED" ? "text-low" : "text-high"
                              }`}
                            >
                              {e.status.replace("_", " ")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-2/40 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-faint">
                        Timeline
                      </div>
                      <dl className="mt-2 space-y-1.5 text-xs">
                        <Row label="Started" value={formatDate(project.startDate)} />
                        <Row
                          label="Expected"
                          value={formatDate(project.expectedCompletionDate)}
                        />
                        <Row
                          label="Delay"
                          value={`${project.progress.delayDays} days`}
                        />
                      </dl>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={exportReport} size="sm">
                      <Download className="h-3.5 w-3.5" /> Export Report
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Truck className="h-3.5 w-3.5" /> Dispatch Field Inspection Team
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-faint">{label}</dt>
      <dd className="tabular text-muted">{value}</dd>
    </div>
  );
}
