import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Cve } from "@/lib/cves.functions";

const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NONE"] as const;
const SEV_COLOR: Record<string, string> = {
  CRITICAL: "oklch(0.62 0.25 18)",
  HIGH: "oklch(0.7 0.2 45)",
  MEDIUM: "oklch(0.82 0.18 90)",
  LOW: "oklch(0.72 0.18 150)",
  NONE: "oklch(0.6 0.02 250)",
};

const tooltipStyle = {
  background: "oklch(0.32 0.05 250)",
  border: "2px solid oklch(0.78 0.15 200 / 0.7)",
  borderRadius: 10,
  fontSize: 14,
  color: "oklch(0.97 0.01 230)",
  boxShadow: "0 6px 24px oklch(0.78 0.15 200 / 0.35)",
  padding: "10px 14px",
};

export function SeverityPie({ cves }: { cves: Cve[] }) {
  const counts = SEVERITY_ORDER.map((s) => ({
    name: s,
    value: cves.filter((c) => c.severity === s).length,
  })).filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={counts}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          stroke="oklch(0.16 0.03 250)"
        >
          {counts.map((d) => (
            <Cell key={d.name} fill={SEV_COLOR[d.name]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopVendorsBar({ cves }: { cves: Cve[] }) {
  const map = new Map<string, number>();
  for (const c of cves) {
    if (!c.vendor) continue;
    map.set(c.vendor, (map.get(c.vendor) ?? 0) + 1);
  }
  const data = [...map.entries()]
    .map(([vendor, count]) => ({ vendor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
        <CartesianGrid stroke="oklch(0.3 0.04 250)" horizontal={false} />
        <XAxis type="number" stroke="oklch(0.7 0.03 240)" fontSize={11} />
        <YAxis
          type="category"
          dataKey="vendor"
          stroke="oklch(0.7 0.03 240)"
          fontSize={11}
          width={90}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.78 0.15 200 / 0.08)" }} />
        <Bar dataKey="count" fill="oklch(0.78 0.15 200)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PublishedTrend({ cves }: { cves: Cve[] }) {
  // Group by day (last 14 days present in data)
  const map = new Map<string, number>();
  for (const c of cves) {
    const d = c.publishedAt.slice(0, 10);
    map.set(d, (map.get(d) ?? 0) + 1);
  }
  const data = [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid stroke="oklch(0.3 0.04 250)" vertical={false} />
        <XAxis dataKey="date" stroke="oklch(0.7 0.03 240)" fontSize={11} />
        <YAxis stroke="oklch(0.7 0.03 240)" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.78 0.15 200 / 0.08)" }} />
        <Bar dataKey="count" fill="oklch(0.78 0.15 200)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
