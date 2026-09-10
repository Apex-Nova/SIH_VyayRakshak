"use client";

import { useState } from "react";
import Link from "next/link";
import { RiskBadge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export interface CompareRow {
  id: string;
  name: string;
  district: string;
  stateName: string;
  score: number;
  level: RiskLevel;
  sanctioned: number;
  expenditure: number;
  utilization: number;
  physical: number;
  reported: number;
  delayDays: number;
  agencyName: string;
  anomalies: number;
  topFactor: string;
}

export function CompareWorks({ rows }: { rows: CompareRow[] }) {
  const [a, setA] = useState(rows[0]?.id ?? "");
  const [b, setB] = useState(rows[1]?.id ?? "");
  const left = rows.find((r) => r.id === a);
  const right = rows.find((r) => r.id === b);

  const metrics: { label: string; get: (r: CompareRow) => string; higherWorse?: (r: CompareRow) => number }[] = [
    { label: "Risk score", get: (r) => `${r.score}/100`, higherWorse: (r) => r.score },
    { label: "Sanctioned", get: (r) => formatINR(r.sanctioned, { compact: true }) },
    { label: "Expenditure", get: (r) => formatINR(r.expenditure, { compact: true }) },
    { label: "Utilization", get: (r) => `${r.utilization}%`, higherWorse: (r) => Math.abs(r.utilization - 100) },
    { label: "Physical progress", get: (r) => `${r.physical}%` },
    { label: "Reported completion", get: (r) => `${r.reported}%` },
    { label: "Progress gap", get: (r) => `${Math.max(0, r.reported - r.physical)}`, higherWorse: (r) => r.reported - r.physical },
    { label: "Delay (days)", get: (r) => `${r.delayDays}`, higherWorse: (r) => r.delayDays },
    { label: "Anomalies", get: (r) => `${r.anomalies}`, higherWorse: (r) => r.anomalies },
    { label: "Agency", get: (r) => r.agencyName },
    { label: "Top factor", get: (r) => r.topFactor },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Picker label="Work A" value={a} onChange={setA} rows={rows} />
        <Picker label="Work B" value={b} onChange={setB} rows={rows} />
      </div>

      {left && right && (
        <div className="mt-6 overflow-hidden rounded-xl plate">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border bg-surface-2/50 text-sm">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-faint">
              Metric
            </div>
            {[left, right].map((r, i) => (
              <div key={i} className="px-4 py-3">
                <div className="truncate text-sm font-semibold text-fg">{r.name}</div>
                <div className="text-[11px] text-faint">
                  #{r.id} · {r.district}
                </div>
              </div>
            ))}
          </div>
          <div className="divide-y divide-border">
            {metrics.map((m) => {
              const lv = m.higherWorse?.(left);
              const rv = m.higherWorse?.(right);
              const worseLeft = lv !== undefined && rv !== undefined && lv > rv;
              const worseRight = lv !== undefined && rv !== undefined && rv > lv;
              return (
                <div key={m.label} className="grid grid-cols-[1.2fr_1fr_1fr] text-sm">
                  <div className="px-4 py-2.5 text-muted">{m.label}</div>
                  <div className={`px-4 py-2.5 tabular ${worseLeft ? "font-semibold text-high" : "text-fg"}`}>
                    {m.get(left)}
                  </div>
                  <div className={`px-4 py-2.5 tabular ${worseRight ? "font-semibold text-high" : "text-fg"}`}>
                    {m.get(right)}
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-[1.2fr_1fr_1fr]">
              <div className="px-4 py-3 text-muted" />
              {[left, right].map((r, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={r.level} score={r.score} showSymbol={false} />
                    <Link
                      href={`/projects/${r.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent-2 hover:underline"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Picker({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: CompareRow[];
}) {
  return (
    <div className="plate p-4">
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-fg focus:border-accent focus:outline-none"
      >
        {rows.map((r) => (
          <option key={r.id} value={r.id}>
            #{r.id} · {r.name.slice(0, 42)} — {r.district}
          </option>
        ))}
      </select>
    </div>
  );
}
