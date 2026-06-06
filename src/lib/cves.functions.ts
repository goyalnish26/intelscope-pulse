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

function toNvdDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${d.getMilliseconds().toString().padStart(3, "0")}`;
}

let cache: { ts: number; data: Cve[] } | null = null;
const CACHE_MS = 10 * 60 * 1000;

async function fetchFromNvd(
  limit: number,
): Promise<{ cves: Cve[]; fetchedAt: string; error: string | null }> {
  if (cache && Date.now() - cache.ts < CACHE_MS) {
    return {
      cves: cache.data.slice(0, limit),
      fetchedAt: new Date(cache.ts).toISOString(),
      error: null,
    };
  }

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 90);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const url = new URL("https://services.nvd.nist.gov/rest/json/cves/2.0");
  url.searchParams.set("pubStartDate", toNvdDate(start));
  url.searchParams.set("pubEndDate", toNvdDate(end));
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
    return { cves: data.slice(0, limit), fetchedAt: new Date(cache.ts).toISOString(), error: null };
  } catch (err) {
    console.error("NVD fetch failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    if (cache) {
      return {
        cves: cache.data.slice(0, limit),
        fetchedAt: new Date(cache.ts).toISOString(),
        error: message,
      };
    }
    return { cves: [], fetchedAt: new Date().toISOString(), error: message };
  }
}

export const getCves = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number } | undefined) =>
    z.object({ limit: z.number().int().min(1).max(100).default(100) }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    return await fetchFromNvd(data.limit);
  });

