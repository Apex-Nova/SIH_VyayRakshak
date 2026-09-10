"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";

export interface ProjectRow {
  id: string;
  name: string;
  district: string;
  stateName: string;
  stateId: string;
  sector: string;
  status: string;
  sanctioned: number;
  expenditure: number;
  physical: number;
  score: number;
  level: RiskLevel;
}

type SortKey = "name" | "sanctioned" | "physical" | "score";

const RISK_ORDER: RiskLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const PAGE_SIZE = 12;

export function ProjectExplorer({
  rows,
  states,
  sectors,
  statuses,
  initialLevel,
}: {
  rows: ProjectRow[];
  states: { id: string; name: string }[];
  sectors: string[];
  statuses: string[];
  initialLevel?: RiskLevel;
}) {
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState<RiskLevel | "">(initialLevel ?? "");
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<SortKey>("score");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let r = rows.filter((row) => {
      if (q && !`${row.name} ${row.id} ${row.district}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (state && row.stateId !== state) return false;
      if (sector && row.sector !== sector) return false;
      if (status && row.status !== status) return false;
      if (level && row.level !== level) return false;
      if (row.score < minScore) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      let d = 0;
      if (sort === "name") d = a.name.localeCompare(b.name);
      else if (sort === "sanctioned") d = a.sanctioned - b.sanctioned;
      else if (sort === "physical") d = a.physical - b.physical;
      else d = a.score - b.score;
      return asc ? d : -d;
    });
    return r;
  }, [rows, q, state, sector, status, level, minScore, sort, asc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE
  );

  function resetFilters() {
    setQ("");
    setState("");
    setSector("");
    setStatus("");
    setLevel("");
    setMinScore(0);
    setPage(1);
  }

  function toggleSort(key: SortKey) {
    if (sort === key) setAsc((a) => !a);
    else {
      setSort(key);
      setAsc(false);
    }
  }

  const hasFilters = q || state || sector || status || level || minScore > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Filters */}
      <aside className="space-y-4">
        <div className="rounded-xl border border-border bg-surface/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-faint">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, ID, district…"
              className="h-9 w-full rounded-lg border border-border bg-surface-2 pl-8 pr-3 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none"
            />
          </div>

          <FilterSelect
            label="State"
            value={state}
            onChange={(v) => {
              setState(v);
              setPage(1);
            }}
            options={states.map((s) => ({ value: s.id, label: s.name }))}
          />
          <FilterSelect
            label="Sector"
            value={sector}
            onChange={(v) => {
              setSector(v);
              setPage(1);
            }}
            options={sectors.map((s) => ({ value: s, label: s }))}
          />
          <FilterSelect
            label="Work Status"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={statuses.map((s) => ({ value: s, label: s.replace("_", " ") }))}
          />
          <FilterSelect
            label="Risk Level"
            value={level}
            onChange={(v) => {
              setLevel(v as RiskLevel | "");
              setPage(1);
            }}
            options={RISK_ORDER.map((l) => ({ value: l, label: l }))}
          />

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <label className="font-medium text-muted">Min. risk score</label>
              <span className="tabular font-semibold text-fg">{minScore}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => {
                setMinScore(Number(e.target.value));
                setPage(1);
              }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-accent"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={resetFilters}
            disabled={!hasFilters}
          >
            Reset Filters
          </Button>
        </div>
        <div className="px-1 text-xs text-faint">
          {filtered.length} of {rows.length} works match.
        </div>
      </aside>

      {/* Table */}
      <div className="min-w-0">
        {pageRows.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto scroll-thin">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/50 text-xs uppercase tracking-wider text-faint">
                    <Th onClick={() => toggleSort("name")}>Project</Th>
                    <th className="px-3 py-2.5 font-medium">District</th>
                    <th className="px-3 py-2.5 font-medium">Sector</th>
                    <Th onClick={() => toggleSort("sanctioned")} className="text-right">
                      Sanctioned
                    </Th>
                    <Th onClick={() => toggleSort("physical")} className="text-right">
                      Progress
                    </Th>
                    <Th onClick={() => toggleSort("score")} className="text-right">
                      Risk
                    </Th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageRows.map((r) => (
                    <tr
                      key={r.id}
                      className="group transition-colors hover:bg-surface-2/40"
                    >
                      <td className="max-w-[240px] px-3 py-2.5">
                        <Link href={`/projects/${r.id}`} className="block">
                          <div className="truncate font-medium text-fg group-hover:text-accent">
                            {r.name}
                          </div>
                          <div className="text-[11px] text-faint">#{r.id}</div>
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-muted">
                        <div className="text-xs">{r.district}</div>
                        <div className="text-[11px] text-faint">{r.stateName}</div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted">{r.sector}</td>
                      <td className="px-3 py-2.5 text-right tabular text-muted">
                        {formatINR(r.sanctioned, { compact: true })}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="ml-auto flex w-24 items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${r.physical}%` }}
                            />
                          </div>
                          <span className="tabular text-xs text-muted">{r.physical}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <RiskBadge level={r.level} score={r.score} showSymbol={false} />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Link
                          href={`/projects/${r.id}`}
                          className="inline-flex text-faint transition-colors group-hover:text-accent"
                          aria-label={`Open ${r.name}`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-faint">
              Page {clampedPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={clampedPage <= 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={clampedPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <th className={`px-3 py-2.5 font-medium ${className ?? ""}`}>
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1 hover:text-fg"
      >
        {children}
        <ArrowUpDown className="h-3 w-3 opacity-60" />
      </button>
    </th>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mt-3">
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-border bg-surface-2 px-2.5 text-sm text-fg focus:border-accent focus:outline-none"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 py-20 text-center">
      <Inbox className="h-8 w-8 text-faint" />
      <p className="mt-3 text-sm font-medium text-fg">No projects match these filters.</p>
      <p className="mt-1 text-xs text-muted">Try widening your criteria.</p>
      <Button variant="secondary" size="sm" className="mt-4" onClick={onReset}>
        Clear Filters
      </Button>
    </div>
  );
}
