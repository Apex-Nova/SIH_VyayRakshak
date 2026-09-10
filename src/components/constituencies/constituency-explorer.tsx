"use client";

import { useMemo, useState } from "react";
import { RiskBadge } from "@/components/ui/badge";
import { StatTile } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";
import { levelForScore } from "@/lib/risk/config";

interface Row {
  constituency: string;
  stateName: string;
  stateId: string;
  projects: number;
  sanctioned: number;
  expenditure: number;
  completed: number;
  delayed: number;
  anomalies: number;
  avgRisk: number;
  utilizationPct: number;
}

export function ConstituencyExplorer({
  rows,
  states,
}: {
  rows: Row[];
  states: { id: string; name: string }[];
}) {
  const [stateId, setStateId] = useState(states[0]?.id ?? "");
  const inState = useMemo(
    () => rows.filter((r) => r.stateId === stateId).sort((a, b) => b.avgRisk - a.avgRisk),
    [rows, stateId]
  );
  const [selected, setSelected] = useState<string>("");
  const current = inState.find((r) => r.constituency === selected) ?? inState[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-xl border border-border bg-surface/60 p-4">
          <label className="mb-1 block text-xs font-medium text-muted">State</label>
          <select
            value={stateId}
            onChange={(e) => {
              setStateId(e.target.value);
              setSelected("");
            }}
            className="h-9 w-full rounded-lg border border-border bg-surface-2 px-2.5 text-sm text-fg focus:border-accent focus:outline-none"
          >
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="mt-4 max-h-[420px] space-y-1 overflow-y-auto scroll-thin">
            {inState.map((r) => {
              const level = levelForScore(r.avgRisk) as RiskLevel;
              const isActive = current?.constituency === r.constituency;
              return (
                <button
                  key={r.constituency}
                  onClick={() => setSelected(r.constituency)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isActive ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2/50"
                  }`}
                >
                  <span className="truncate">{r.constituency}</span>
                  <RiskBadge level={level} showSymbol={false} />
                </button>
              );
            })}
            {inState.length === 0 && (
              <p className="px-3 py-4 text-xs text-faint">
                No constituencies in this state.
              </p>
            )}
          </div>
        </div>
      </aside>

      <div>
        {current ? (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-fg">{current.constituency}</h2>
                <p className="text-sm text-muted">{current.stateName}</p>
              </div>
              <RiskBadge level={levelForScore(current.avgRisk) as RiskLevel} score={current.avgRisk} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Projects" value={current.projects} />
              <StatTile label="Sanctioned" value={formatINR(current.sanctioned, { compact: true })} />
              <StatTile label="Utilization" value={`${current.utilizationPct}%`} tone="accent" />
              <StatTile label="Anomalies" value={current.anomalies} tone="high" />
              <StatTile label="Completed" value={current.completed} tone="low" />
              <StatTile label="Delayed" value={current.delayed} tone="high" />
              <StatTile label="Avg Risk" value={`${current.avgRisk}/100`} />
              <StatTile
                label="Expenditure"
                value={formatINR(current.expenditure, { compact: true })}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted">
            Select a constituency to view its intelligence.
          </div>
        )}
      </div>
    </div>
  );
}
