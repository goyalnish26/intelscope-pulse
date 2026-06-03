import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Cve = {
  id: string;
  publishedAt: string;
  lastModified: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  score: number | null;
  description: string;
  vendor: string | null;
  url: string;
};

type NvdCveItem = {
  cve: {
    id: string;
    published: string;
    lastModified: string;
    descriptions: { lang: string; value: string }[];
    metrics?: {
      cvssMetricV31?: { cvssData: { baseScore: number; baseSeverity: string } }[];
      cvssMetricV30?: { cvssData: { baseScore: number; baseSeverity: string } }[];
      cvssMetricV2?: { cvssData: { baseScore: number }; baseSeverity?: string }[];
    };
    configurations?: {
      nodes?: { cpeMatch?: { criteria?: string }[] }[];
    }[];
  };
};

function extractSeverityAndScore(item: NvdCveItem): { severity: Cve["severity"]; score: number | null } {
  const m = item.cve.metrics;
  const v3 = m?.cvssMetricV31?.[0] ?? m?.cvssMetricV30?.[0];
  if (v3) {
    return {
      severity: (v3.cvssData.baseSeverity?.toUpperCase() as Cve["severity"]) || "NONE",
      score: v3.cvssData.baseScore,
    };
  }
  const v2 = m?.cvssMetricV2?.[0];
  if (v2) {
    const s = v2.cvssData.baseScore;
    let sev: Cve["severity"] = "NONE";
    if (s >= 9) sev = "CRITICAL";
    else if (s >= 7) sev = "HIGH";
    else if (s >= 4) sev = "MEDIUM";
    else if (s > 0) sev = "LOW";
    return { severity: sev, score: s };
  }
  return { severity: "NONE", score: null };
}

function extractVendor(item: NvdCveItem): string | null {
  const cpe = item.cve.configurations?.[0]?.nodes?.[0]?.cpeMatch?.[0]?.criteria;
  if (!cpe) return null;
  // cpe:2.3:a:vendor:product:version:...
  const parts = cpe.split(":");
  return parts[3] ?? null;
}

let cache: { ts: number; data: Cve[] } | null = null;
const CACHE_MS = 10 * 60 * 1000;

async function fetchFromNvd(limit: number): Promise<Cve[]> {
  if (cache && Date.now() - cache.ts < CACHE_MS) {
    return cache.data.slice(0, limit);
  }
  const url = new URL("https://services.nvd.nist.gov/rest/json/cves/2.0");
  url.searchParams.set("resultsPerPage", "100");
  url.searchParams.set("startIndex", "0");

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "ThreatIntelDashboard/1.0" },
    });
    if (!res.ok) throw new Error(`NVD returned ${res.status}`);
    const json = (await res.json()) as { vulnerabilities?: NvdCveItem[] };
    const items = json.vulnerabilities ?? [];
    const data: Cve[] = items.map((item) => {
      const { severity, score } = extractSeverityAndScore(item);
      const desc = item.cve.descriptions.find((d) => d.lang === "en")?.value ?? "";
      return {
        id: item.cve.id,
        publishedAt: item.cve.published,
        lastModified: item.cve.lastModified,
        severity,
        score,
        description: desc,
        vendor: extractVendor(item),
        url: `https://nvd.nist.gov/vuln/detail/${item.cve.id}`,
      };
    });
    cache = { ts: Date.now(), data };
    return data.slice(0, limit);
  } catch (err) {
    console.error("NVD fetch failed:", err);
    if (cache) return cache.data.slice(0, limit);
    return [];
  }
}

export const getCves = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number } | undefined) =>
    z.object({ limit: z.number().int().min(1).max(100).default(50) }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const cves = await fetchFromNvd(data.limit);
    return { cves };
  });
