"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RiskLevel } from "@/lib/types";

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: "hsl(152 55% 38%)",
  MEDIUM: "hsl(36 92% 48%)",
  HIGH: "hsl(22 88% 50%)",
  CRITICAL: "hsl(0 70% 50%)",
};
const ACCENT = "hsl(30 96% 50%)"; // saffron
const ACCENT2 = "hsl(186 58% 32%)"; // teal
const GRID = "hsl(36 26% 82%)";
const AXIS = "hsl(200 14% 40%)";

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-xl">
      {label !== undefined && (
        <div className="mb-1 font-semibold text-fg">{label}</div>
      )}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color || p.fill || ACCENT }}
          />
          <span>{p.name}:</span>
          <span className="tabular font-semibold text-fg">
            {typeof p.value === "number"
              ? p.value.toLocaleString("en-IN")
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RiskDonut({
  data,
}: {
  data: { level: RiskLevel; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="level"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((d) => (
            <Cell key={d.level} fill={RISK_COLORS[d.level]} />
          ))}
        </Pie>
        <Tooltip content={<TooltipBox />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HBarChart({
  data,
  dataKey,
  categoryKey,
  color = ACCENT,
  height = 300,
}: {
  data: any[];
  dataKey: string;
  categoryKey: string;
  color?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fill: AXIS, fontSize: 11 }} stroke={GRID} />
        <YAxis
          type="category"
          dataKey={categoryKey}
          tick={{ fill: AXIS, fontSize: 11 }}
          width={130}
          stroke={GRID}
        />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "hsl(36 26% 82% / 0.45)" }} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function VBarChart({
  data,
  bars,
  categoryKey,
  height = 280,
}: {
  data: any[];
  bars: { key: string; color?: string; name?: string }[];
  categoryKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: 4, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis
          dataKey={categoryKey}
          tick={{ fill: AXIS, fontSize: 11 }}
          stroke={GRID}
        />
        <YAxis tick={{ fill: AXIS, fontSize: 11 }} stroke={GRID} />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "hsl(36 26% 82% / 0.45)" }} />
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.name ?? b.key}
            fill={b.color ?? ACCENT}
            radius={[4, 4, 0, 0]}
            maxBarSize={38}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({
  data,
  dataKey,
  categoryKey,
  height = 260,
}: {
  data: any[];
  dataKey: string;
  categoryKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: 4, right: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} tick={{ fill: AXIS, fontSize: 11 }} stroke={GRID} />
        <YAxis tick={{ fill: AXIS, fontSize: 11 }} stroke={GRID} />
        <Tooltip content={<TooltipBox />} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={ACCENT}
          strokeWidth={2.5}
          dot={{ r: 3, fill: ACCENT2 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export { RISK_COLORS, ACCENT, ACCENT2 };
