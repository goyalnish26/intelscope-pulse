import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Database, Github, Newspaper, Radar, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Intel Scope" },
      {
        name: "description",
        content:
          "About Intel Scope: a free, open threat intelligence dashboard aggregating NVD CVEs and curated security news.",
      },
      { property: "og:title", content: "About — Intel Scope" },
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
        Intel Scope is a free, no-friction dashboard for cybersecurity professionals,
        small business owners, students, and curious technologists. We aggregate
        vulnerability data from the NIST National Vulnerability Database and curated security
        news from trusted sources — and present them through clear visualizations.
      </p>

      {/* Features */}
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
          Top security news sources, deduplicated and sorted by recency. One click to
          read the full article at the source.
        </Feature>
        <Feature icon={<Bookmark className="h-5 w-5" />} title="Personal watchlist">
          Bookmark any CVE to track it. Your watchlist lives in your browser — no account,
          no email required.
        </Feature>
      </div>

      {/* How it works */}
      <Section title="How it works">
        <ol className="space-y-3 text-sm text-muted-foreground">
          <Step n={1} title="Fetch">
            Our server queries the <span className="font-mono text-primary">NVD 2.0 REST API</span>{" "}
            for vulnerabilities published in the last 90 days, in batches of 100, sorted by
            publication date.
          </Step>
          <Step n={2} title="Normalize">
            Raw NVD payloads are parsed, severity is derived from the highest available CVSS
            metric (v3.1 → v3.0 → v2), and the affected vendor is extracted from CPE strings.
          </Step>
          <Step n={3} title="Cache">
            Results are cached server-side for 10 minutes to stay polite to NIST and keep the
            dashboard snappy. RSS news feeds are fetched in parallel from five publishers.
          </Step>
          <Step n={4} title="Display">
            The frontend renders charts, stats, and feeds with live filtering by date range and
            severity — no page reloads, fully client-interactive.
          </Step>
        </ol>
      </Section>

      {/* Tech stack */}
      <Section title="Tech stack">
        <div className="grid gap-3 sm:grid-cols-2">
          <Tech label="Frontend" items={["React 19", "TanStack Start & Router", "Tailwind CSS", "Recharts"]} />
          <Tech label="Data" items={["NVD API 2.0 (NIST)", "RSS — The Hacker News", "RSS — SecurityWeek", "RSS — BleepingComputer", "RSS — Dark Reading", "RSS — Krebs on Security"]} />
        </div>
      </Section>

      {/* Built by */}
      <Section title="Built by">
        <a
          href="https://github.com/goyalnish26"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition hover:border-primary/50 hover:shadow-glow"
        >
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/30">
            <Github className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold">@goyalnish26</div>
            <div className="text-xs text-muted-foreground font-mono">
              github.com/goyalnish26
            </div>
          </div>
        </a>
      </Section>

      {/* Roadmap */}
      <Section title="Roadmap & coming soon">
        <ul className="grid gap-2 sm:grid-cols-2">
          <Roadmap status="shipped" title="CVE watchlist" desc="Bookmark CVEs, stored locally." />
          <Roadmap status="planned" title="Email alerts" desc="Get pinged when new CVEs cross your severity threshold." />
          <Roadmap status="planned" title="Vendor-specific filtering" desc="Subscribe only to CVEs that affect vendors you care about." />
          <Roadmap status="planned" title="Exploit & KEV signals" desc="Surface CISA KEV listings and public PoC availability." />
        </ul>
      </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 rounded-lg border border-border/70 bg-card p-4">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary text-xs font-mono font-semibold ring-1 ring-primary/30">
        {n}
      </span>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-0.5 text-sm">{children}</div>
      </div>
    </li>
  );
}

function Tech({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono">
        {label}
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Roadmap({
  status,
  title,
  desc,
}: {
  status: "shipped" | "planned";
  title: string;
  desc: string;
}) {
  const shipped = status === "shipped";
  return (
    <li className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        <span
          className={`rounded px-2 py-0.5 text-[10px] uppercase tracking-wider font-mono ${
            shipped
              ? "bg-severity-low/15 text-severity-low ring-1 ring-severity-low/30"
              : "bg-primary/10 text-primary ring-1 ring-primary/30"
          }`}
        >
          {shipped ? "Shipped" : "Planned"}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </li>
  );
}
