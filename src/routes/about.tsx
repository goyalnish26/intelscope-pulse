import { createFileRoute } from "@tanstack/react-router";
import { Database, Newspaper, Radar, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Sentinel/Intel" },
      {
        name: "description",
        content:
          "About Sentinel/Intel: a free, open threat intelligence dashboard aggregating NVD CVEs and curated security news.",
      },
      { property: "og:title", content: "About Sentinel/Intel" },
      {
        property: "og:description",
        content: "Why we built a free threat intelligence dashboard for everyone.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-mono">
        About
      </div>
      <h1 className="mt-2 text-3xl font-bold">Threat intelligence, democratized.</h1>
      <p className="mt-4 text-muted-foreground">
        Sentinel/Intel is a free, no-friction dashboard for cybersecurity professionals,
        small business owners, students, and curious technologists. We aggregate
        vulnerability data from the NIST National Vulnerability Database and curated security
        news from five trusted sources — and present them through clear visualizations.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Feature icon={<Radar className="h-5 w-5" />} title="Live CVE feed">
          The latest vulnerabilities pulled directly from the NVD 2.0 API, with severity,
          CVSS score, affected vendor, and a deep link to the full advisory.
        </Feature>
        <Feature icon={<ShieldAlert className="h-5 w-5" />} title="Attack trends">
          Severity distribution, vendor heatmap, and publication trend — interactive charts
          that make the data legible at a glance.
        </Feature>
        <Feature icon={<Newspaper className="h-5 w-5" />} title="News, curated">
          Five top security news sources, deduplicated and sorted by recency. One click to
          read the full article at the source.
        </Feature>
        <Feature icon={<Database className="h-5 w-5" />} title="Email alerts">
          Subscribe with a severity threshold. We only ping you when something actually
          crosses your bar.
        </Feature>
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card p-5 text-sm">
        <h2 className="font-semibold">Data sources</h2>
        <ul className="mt-3 space-y-1 text-muted-foreground font-mono text-xs">
          <li>· NIST NVD API 2.0</li>
          <li>· The Hacker News</li>
          <li>· Krebs on Security</li>
          <li>· SecurityWeek</li>
          <li>· BleepingComputer</li>
          <li>· Dark Reading</li>
        </ul>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/30">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
