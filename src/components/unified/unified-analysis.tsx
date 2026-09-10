"use client";

import Link from "next/link";
import { StatTile, Card, CardHeader } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskDonut, VBarChart } from "@/components/charts/charts";
import { RISK_META } from "@/lib/risk/config";
import { formatINR, formatIndianNumber } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";
import { FileDown, FileJson } from "lucide-react";

export interface UnifiedReport {
  generatedAt: string;
  national: {
    annualAllocationCr: number;
    totalMps: number;
    statesUts: number;
    releasedSince1993Cr: number;
    source: string;
  };
  stats: {
    totalProjects: number;
    totalSanctioned: number;
    totalExpenditure: number;
    utilizationPct: number;
    highRisk: number;
    criticalRisk: number;
    anomalies: number;
    statesMonitored: number;
  };
  dist: { level: RiskLevel; count: number }[];
  anomalies: { category: string; count: number }[];
  sectors: { sector: string; count: number }[];
  agencies: { name: string; anomalies: number; projectsCount: number; riskLevel: RiskLevel }[];
  flagged: { id: string; name: string; district: string; stateName: string; score: number; level: RiskLevel; sanctioned: number }[];
}

export function UnifiedAnalysis({ report }: { report: UnifiedReport }) {
  function exportJson() {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vyayrakshak-analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const w = window.open("", "_blank");
    if (!w) return;
    const r = report;
    const row = (cells: string[]) => `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>VyayRakshak — Analysis Report</title>
<style>
  @page { margin: 22mm 16mm; }
  * { font-family: Georgia, 'Times New Roman', serif; color: #24303a; }
  body { max-width: 800px; margin: 0 auto; }
  h1 { font-size: 24px; margin: 0 0 2px; }
  h2 { font-size: 15px; border-bottom: 2px solid #F5900A; padding-bottom: 4px; margin: 26px 0 10px; }
  .sub { color: #6b5a4d; font-size: 12px; margin-bottom: 4px; }
  .grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin: 10px 0; }
  .tile { border: 1px solid #d8ccb2; border-radius: 8px; padding: 8px 10px; }
  .tile .k { font-size: 10px; text-transform: uppercase; letter-spacing: .04em; color: #6b5a4d; }
  .tile .v { font-size: 18px; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 6px; }
  th, td { border: 1px solid #d8ccb2; padding: 5px 8px; text-align: left; }
  th { background: #f3ecd9; font-size: 10px; text-transform: uppercase; letter-spacing: .03em; }
  .disc { margin-top: 24px; font-size: 10px; color: #6b5a4d; font-style: italic; border-top: 1px solid #d8ccb2; padding-top: 8px; }
  .badge { display:inline-block; background:#1F5D66; color:#fff; font-size:10px; padding:1px 6px; border-radius:4px; font-family: Arial; }
</style></head><body>
  <div class="badge">VYAYRAKSHAK · TEAM SYNAPTIX · SIH26102</div>
  <h1>Unified Risk Analysis Report</h1>
  <div class="sub">Generated ${new Date(r.generatedAt).toLocaleString("en-IN")} · Read-only analytics over an eSAKSHI-shaped export</div>

  <h2>Real National Context (cited to MoSPI / eSAKSHI)</h2>
  <div class="grid">
    <div class="tile"><div class="k">Annual allocation</div><div class="v">₹${formatIndianNumber(r.national.annualAllocationCr)} Cr</div></div>
    <div class="tile"><div class="k">Members of Parliament</div><div class="v">${r.national.totalMps}</div></div>
    <div class="tile"><div class="k">States / UTs</div><div class="v">${r.national.statesUts}</div></div>
    <div class="tile"><div class="k">Released since 1993</div><div class="v">₹${formatIndianNumber(r.national.releasedSince1993Cr)} Cr</div></div>
  </div>

  <h2>Analysed Set (synthetic — eSAKSHI schema)</h2>
  <div class="grid">
    <div class="tile"><div class="k">Works analysed</div><div class="v">${formatIndianNumber(r.stats.totalProjects)}</div></div>
    <div class="tile"><div class="k">High risk</div><div class="v">${r.stats.highRisk}</div></div>
    <div class="tile"><div class="k">Critical risk</div><div class="v">${r.stats.criticalRisk}</div></div>
    <div class="tile"><div class="k">Anomalies</div><div class="v">${formatIndianNumber(r.stats.anomalies)}</div></div>
    <div class="tile"><div class="k">Sanctioned</div><div class="v">${formatINR(r.stats.totalSanctioned, { compact: true })}</div></div>
    <div class="tile"><div class="k">Expenditure</div><div class="v">${formatINR(r.stats.totalExpenditure, { compact: true })}</div></div>
    <div class="tile"><div class="k">Utilisation</div><div class="v">${r.stats.utilizationPct.toFixed(0)}%</div></div>
    <div class="tile"><div class="k">States monitored</div><div class="v">${r.stats.statesMonitored}</div></div>
  </div>

  <h2>Anomalies by Category</h2>
  <table><thead><tr><th>Signal</th><th>Count</th></tr></thead><tbody>
  ${r.anomalies.map((a) => row([a.category, String(a.count)])).join("")}
  </tbody></table>

  <h2>Highest-Risk Agencies</h2>
  <table><thead><tr><th>Agency</th><th>Anomalies</th><th>Works</th><th>Risk</th></tr></thead><tbody>
  ${r.agencies.map((a) => row([a.name, String(a.anomalies), String(a.projectsCount), a.riskLevel])).join("")}
  </tbody></table>

  <h2>Priority Works for Verification</h2>
  <table><thead><tr><th>ID</th><th>Work</th><th>District</th><th>Score</th><th>Sanctioned</th></tr></thead><tbody>
  ${r.flagged.map((p) => row([p.id, p.name, `${p.district}, ${p.stateName}`, `${p.score}/100 ${p.level}`, formatINR(p.sanctioned, { compact: true })])).join("")}
  </tbody></table>

  <div class="disc">VyayRakshak is a decision-support system. AI-generated risk indicators are decision-support signals and do not establish fraud or wrongdoing. All flagged cases require human verification. National figures are real and cited; per-work rows are synthetic (eSAKSHI schema). Source: ${r.national.source}.</div>
  <script>window.onload=()=>{setTimeout(()=>window.print(),350)}</script>
</body></html>`);
    w.document.close();
  }

  const r = report;
  return (
    <div className="space-y-6">
      {/* Export bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl plate p-4">
        <div>
          <div className="text-sm font-semibold text-fg">Detailed analysis report</div>
          <div className="text-xs text-muted">
            One cross-signal view of every detector, agency and priority work — exportable.
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportPdf} className="btn-3d">
            <FileDown className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="secondary" onClick={exportJson}>
            <FileJson className="h-4 w-4" /> JSON
          </Button>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Works analysed" value={formatIndianNumber(r.stats.totalProjects)} />
        <StatTile label="High risk" value={r.stats.highRisk} tone="high" />
        <StatTile label="Critical" value={r.stats.criticalRisk} tone="critical" />
        <StatTile label="Anomalies" value={formatIndianNumber(r.stats.anomalies)} tone="high" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Risk Distribution" subtitle="Works by level" />
          <div className="px-4 pb-4">
            <RiskDonut data={r.dist} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {r.dist.map((d) => (
                <div key={d.level} className="flex items-center justify-between text-xs">
                  <span className={RISK_META[d.level].text}>
                    {RISK_META[d.level].symbol} {RISK_META[d.level].label}
                  </span>
                  <span className="tabular font-semibold text-fg">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Anomalies by Category" subtitle="Cross-detector coverage" />
          <div className="px-2 pb-4">
            <VBarChart
              data={r.anomalies.slice(0, 8)}
              bars={[{ key: "count", name: "Flags", color: "hsl(24 88% 50%)" }]}
              categoryKey="category"
              height={280}
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Priority Works for Verification" subtitle="Highest composite risk" />
        <div className="divide-y divide-border border-t border-border">
          {r.flagged.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-surface-2/50"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-fg">{p.name}</div>
                <div className="truncate text-xs text-faint">
                  #{p.id} · {p.district}, {p.stateName}
                </div>
              </div>
              <RiskBadge level={p.level} score={p.score} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
