import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BookmarkCheck, Search, Trash2 } from "lucide-react";
import { getCves } from "@/lib/cves.functions";
import { CveCard } from "@/components/cve-card";
import { useWatchlist } from "@/hooks/use-watchlist";

const cvesQO = queryOptions({
  queryKey: ["cves", 100],
  queryFn: () => getCves({ data: { limit: 100 } }),
});

export const Route = createFileRoute("/cves")({
  head: () => ({
    meta: [
      { title: "CVE Feed — Intel Scope" },
      {
        name: "description",
        content:
          "Browse the latest CVEs from the NIST National Vulnerability Database. Filter by severity, search by ID or keyword, and bookmark to your watchlist.",
      },
      { property: "og:title", content: "CVE Feed — Intel Scope" },
      {
        property: "og:description",
        content: "Latest CVEs from NVD with severity filters, keyword search, and a personal watchlist.",
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
const TABS = ["all", "watchlist"] as const;
type Tab = (typeof TABS)[number];

function CvesPage() {
  const { data } = useSuspenseQuery(cvesQO);
  const { ids: watchIds, has, count, clear } = useWatchlist();
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>("ALL");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const base = useMemo(
    () => (tab === "watchlist" ? data.cves.filter((c) => has(c.id)) : data.cves),
    [tab, data.cves, has],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return base.filter((c) => {
      if (severity !== "ALL" && c.severity !== severity) return false;
      if (!needle) return true;
      return (
        c.id.toLowerCase().includes(needle) ||
        c.description.toLowerCase().includes(needle) ||
        (c.vendor?.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [base, severity, q]);

  const missingFromFeed =
    tab === "watchlist"
      ? watchIds.filter((id) => !data.cves.some((c) => c.id === id))
      : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-mono">
          NVD live feed
        </div>
        <h1 className="mt-2 text-3xl font-bold">CVE intelligence</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {data.cves.length} vulnerabilities loaded · showing {filtered.length}
          {tab === "watchlist" && ` · ${count} bookmarked`}
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-4 inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card p-1">
        <button
          onClick={() => setTab("all")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
            tab === "all"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All CVEs
        </button>
        <button
          onClick={() => setTab("watchlist")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
            tab === "watchlist"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookmarkCheck className="h-3.5 w-3.5" />
          Watchlist
          <span
            className={`ml-1 rounded px-1.5 py-0.5 text-[10px] ${
              tab === "watchlist" ? "bg-primary-foreground/20" : "bg-secondary text-foreground"
            }`}
          >
            {count}
          </span>
        </button>
      </div>

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

      {tab === "watchlist" && count > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-border/70 bg-card/60 px-3 py-2 text-xs text-muted-foreground">
          <span>Watchlist is stored on this device only.</span>
          <button
            onClick={() => {
              if (confirm("Clear your entire watchlist?")) clear();
            }}
            className="inline-flex items-center gap-1 text-destructive hover:underline"
          >
            <Trash2 className="h-3 w-3" /> Clear all
          </button>
        </div>
      )}

      <div className="grid gap-3">
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {tab === "watchlist" && count === 0 ? (
              <>
                Your watchlist is empty. Click the{" "}
                <span className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 align-middle text-xs">
                  <BookmarkCheck className="h-3 w-3" /> bookmark
                </span>{" "}
                icon on any CVE to track it.{" "}
                <button onClick={() => setTab("all")} className="text-primary hover:underline">
                  Browse all CVEs →
                </button>
              </>
            ) : (
              "No CVEs match your filters."
            )}
          </div>
        )}
        {filtered.map((c) => (
          <CveCard key={c.id} cve={c} />
        ))}

        {missingFromFeed.length > 0 && (
          <div className="rounded-lg border border-dashed border-border/70 p-4 text-xs text-muted-foreground">
            <div className="mb-2 font-semibold text-foreground">
              {missingFromFeed.length} bookmarked CVE{missingFromFeed.length === 1 ? "" : "s"} not in the current feed
            </div>
            <p className="mb-2">These are older than the 90-day window. View them directly at NVD:</p>
            <ul className="space-y-1">
              {missingFromFeed.map((id) => (
                <li key={id}>
                  <a
                    href={`https://nvd.nist.gov/vuln/detail/${id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-primary hover:underline"
                  >
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Want the dashboard view?{" "}
        <Link to="/" className="text-primary hover:underline">
          Back to overview →
        </Link>
      </p>
    </div>
  );
}
