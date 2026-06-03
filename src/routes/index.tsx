import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Newspaper,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { getCves } from "@/lib/cves.functions";
import { getNews } from "@/lib/news.functions";
import { CveCard } from "@/components/cve-card";
import { SubscribeForm } from "@/components/subscribe-form";
import {
  PublishedTrend,
  SeverityPie,
  TopVendorsBar,
} from "@/components/threat-charts";
import { useState, useMemo } from "react";

const cvesQO = queryOptions({
  queryKey: ["cves", 2000],
  queryFn: () => getCves({ data: { limit: 2000 } }),
});
const newsQO = queryOptions({
  queryKey: ["news"],
  queryFn: () => getNews(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentinel/Intel — Threat Intelligence Dashboard" },
      {
        name: "description",
        content:
          "Live overview of new CVEs, attack trends, and curated security news. Free and open.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(cvesQO);
    context.queryClient.ensureQueryData(newsQO);
  },
  component: Dashboard,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="text-destructive">Couldn't load the dashboard: {error.message}</p>
    </div>
  ),
});

function Dashboard() {
  const { data: cveData } = useSuspenseQuery(cvesQO);
  const { data: newsData } = useSuspenseQuery(newsQO);
  const cves = cveData.cves;
  const news = newsData.news;

  const critical = cves.filter((c) => c.severity === "CRITICAL").length;
  const high = cves.filter((c) => c.severity === "HIGH").length;
  const avgScore =
    cves.filter((c) => c.score != null).reduce((s, c) => s + (c.score ?? 0), 0) /
    Math.max(1, cves.filter((c) => c.score != null).length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero */}
      <section className="mb-10">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary font-mono">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Live feed · NVD synced
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Real-time <span className="text-primary text-glow">threat intelligence</span>
          <br className="hidden sm:block" /> without the enterprise price tag.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Aggregated CVEs from the NIST National Vulnerability Database, attack-pattern charts,
          and curated security news from five trusted sources — in one clean dashboard.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total CVEs tracked"
          value={cves.length.toString()}
          icon={<Radar className="h-4 w-4" />}
        />
        <StatCard
          label="Critical"
          value={critical.toString()}
          icon={<AlertTriangle className="h-4 w-4" />}
          tone="critical"
        />
        <StatCard
          label="High"
          value={high.toString()}
          icon={<Activity className="h-4 w-4" />}
          tone="high"
        />
        <StatCard
          label="Avg CVSS score"
          value={Number.isFinite(avgScore) ? avgScore.toFixed(1) : "—"}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </section>

      {/* Charts */}
      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <Panel title="Severity distribution" subtitle="Latest fetched CVEs">
          <SeverityPie cves={cves} />
        </Panel>
        <Panel title="Published trend" subtitle="CVEs per day">
          <PublishedTrend cves={cves} />
        </Panel>
        <Panel title="Top affected vendors" subtitle="Most CVEs in the feed">
          <TopVendorsBar cves={cves} />
        </Panel>
      </section>

      {/* CVE + News */}
      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader
            title="Recent vulnerabilities"
            link="/cves"
            linkLabel="Browse all CVEs"
            icon={<Radar className="h-4 w-4" />}
          />
          <div className="mt-4 grid gap-3">
            {cves.slice(0, 6).map((c) => (
              <CveCard key={c.id} cve={c} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            title="Security newswire"
            link="/news"
            linkLabel="All news"
            icon={<Newspaper className="h-4 w-4" />}
          />
          <ul className="mt-4 space-y-3">
            {news.slice(0, 6).map((n) => (
              <li key={n.link}>
                <a
                  href={n.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border border-border/70 bg-card p-3 transition hover:border-primary/50"
                >
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary font-mono">
                    {n.source}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-medium">{n.title}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Subscribe */}
      <section className="mt-12 rounded-xl border border-primary/30 bg-card p-6 shadow-glow sm:p-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-mono">
              Alerts
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Get pinged on critical threats.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a severity threshold. We'll only email when something crosses it.
              Unsubscribe any time.
            </p>
          </div>
          <SubscribeForm />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: "critical" | "high";
}) {
  const valueClass =
    tone === "critical"
      ? "text-severity-critical"
      : tone === "high"
        ? "text-severity-high"
        : "text-foreground";
  return (
    <div className="rounded-lg border border-border/70 bg-card p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className={`mt-2 font-mono text-3xl font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && <span className="text-[11px] text-muted-foreground">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  link,
  linkLabel,
  icon,
}: {
  title: string;
  link: "/cves" | "/news";
  linkLabel: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      <Link
        to={link}
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        {linkLabel} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
