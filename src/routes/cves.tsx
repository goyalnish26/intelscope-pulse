import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getCves } from "@/lib/cves.functions";
import { CveCard } from "@/components/cve-card";

const cvesQO = queryOptions({
  queryKey: ["cves", 100],
  queryFn: () => getCves({ data: { limit: 100 } }),
});

export const Route = createFileRoute("/cves")({
  head: () => ({
    meta: [
      { title: "CVE Feed — Sentinel/Intel" },
      {
        name: "description",
        content:
          "Browse the latest CVEs from the NIST National Vulnerability Database. Filter by severity, search by ID or keyword.",
      },
      { property: "og:title", content: "CVE Feed — Sentinel/Intel" },
      {
        property: "og:description",
        content: "Latest CVEs from NVD with severity filters and keyword search.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(cvesQO),
  component: CvesPage,
  errorComponent: ({ error }) => (
    <p className="px-6 py-16 text-center text-destructive">{error.message}</p>
  ),
});

const SEVERITIES = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

function CvesPage() {
  const { data } = useSuspenseQuery(cvesQO);
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>("ALL");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.cves.filter((c) => {
      if (severity !== "ALL" && c.severity !== severity) return false;
      if (!needle) return true;
      return (
        c.id.toLowerCase().includes(needle) ||
        c.description.toLowerCase().includes(needle) ||
        (c.vendor?.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [data.cves, severity, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-mono">
          NVD live feed
        </div>
        <h1 className="mt-2 text-3xl font-bold">CVE intelligence</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {data.cves.length} vulnerabilities loaded · showing {filtered.length}
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by CVE ID, vendor, or keyword..."
            className="w-full rounded-md border border-input bg-input/40 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border/70 bg-card p-1">
          {SEVERITIES.map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`rounded px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                severity === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No CVEs match your filters.
          </p>
        )}
        {filtered.map((c) => (
          <CveCard key={c.id} cve={c} />
        ))}
      </div>
    </div>
  );
}
