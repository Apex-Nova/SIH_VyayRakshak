"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskExplainer } from "@/components/risk/risk-explainer";
import { calculateRiskScore, type ScoringInput } from "@/lib/risk/engine";
import { useI18n } from "@/lib/i18n/provider";

interface Form {
  sanctioned: number;
  expenditure: number;
  physical: number;
  delay: number;
  march: number;
  benchmark: number;
  photoReuse: boolean;
}

const CLEAN: Form = { sanctioned: 40, expenditure: 22, physical: 55, delay: 0, march: 20, benchmark: 105, photoReuse: false };
const FRAUD: Form = { sanctioned: 60, expenditure: 138, physical: 20, delay: 320, march: 82, benchmark: 265, photoReuse: true };
const DUP: Form = { sanctioned: 45, expenditure: 40, physical: 60, delay: 40, march: 35, benchmark: 118, photoReuse: true };

export function TestWork() {
  const { t } = useI18n();
  const [form, setForm] = useState<Form>(CLEAN);

  const risk = useMemo(() => {
    const input: ScoringInput = {
      utilizationPercentage: (form.expenditure / Math.max(1, form.sanctioned)) * 100,
      marchSharePct: form.march,
      physicalProgress: form.physical,
      reportedProgress: Math.min(100, (form.expenditure / Math.max(1, form.sanctioned)) * 100),
      costVsBenchmarkPct: form.benchmark,
      delayDays: form.delay,
      expectedDurationDays: 365,
      evidenceIssues: form.photoReuse ? 1 : 0,
      evidenceCount: 2,
      maxSimilarity: form.photoReuse ? 0.94 : 0.4,
      agencyAnomalyRate: 0.25,
      duplicateProximity: form.photoReuse ? 0.7 : 0.2,
    };
    return calculateRiskScore(input);
  }, [form]);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const sliders: { k: keyof Form; label: string; min: number; max: number; step: number; unit?: string }[] = [
    { k: "sanctioned", label: t("test.sanctioned"), min: 1, max: 200, step: 1 },
    { k: "expenditure", label: t("test.expenditure"), min: 0, max: 300, step: 1 },
    { k: "physical", label: t("test.physical"), min: 0, max: 100, step: 1, unit: "%" },
    { k: "delay", label: t("test.delay"), min: 0, max: 800, step: 10 },
    { k: "march", label: t("test.march"), min: 0, max: 100, step: 1, unit: "%" },
    { k: "benchmark", label: t("test.benchmark"), min: 40, max: 300, step: 1, unit: "%" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inputs */}
      <div className="plate p-6">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setForm(CLEAN)}>
            <RotateCcw className="h-3.5 w-3.5" /> {t("test.loadClean")}
          </Button>
          <Button size="sm" onClick={() => setForm(FRAUD)}>
            <Zap className="h-3.5 w-3.5" /> {t("test.loadFraud")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setForm(DUP)}>
            <Copy className="h-3.5 w-3.5" /> {t("test.loadDup")}
          </Button>
        </div>

        <h3 className="mt-6 font-display text-base font-semibold text-fg">
          {t("test.inputs")}
        </h3>
        <div className="mt-4 space-y-4">
          {sliders.map((s) => (
            <div key={s.k}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <label className="font-medium text-muted">{s.label}</label>
                <span className="tabular font-semibold text-fg">
                  {form[s.k] as number}
                  {s.unit ?? ""}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={form[s.k] as number}
                onChange={(e) => set(s.k, Number(e.target.value) as never)}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-accent"
                aria-label={s.label}
              />
            </div>
          ))}
          <label className="flex items-center gap-2 pt-1 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.photoReuse}
              onChange={(e) => set("photoReuse", e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            {t("test.photoReuse")}
          </label>
        </div>
      </div>

      {/* Live result */}
      <motion.div
        key={risk.totalScore}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="plate p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h3 className="font-display text-base font-semibold text-fg">
            {t("test.resultTitle")}
          </h3>
        </div>
        <RiskExplainer risk={risk} />
      </motion.div>
    </div>
  );
}
