import { createServerFn } from "@tanstack/react-start";

export type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  summary: string;
};

const FEEDS: { name: string; url: string }[] = [
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
  { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/" },
  { name: "SecurityWeek", url: "https://www.securityweek.com/feed/" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
];

function stripHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  return m ? stripHtml(m[1]) : "";
}

function parseRss(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRe = /<item[\s>][\s\S]*?<\/item>/gi;
  const blocks = xml.match(itemRe) ?? [];
  for (const block of blocks.slice(0, 12)) {
    const title = pick(block, "title");
    const link = pick(block, "link");
    const pubDate = pick(block, "pubDate") || pick(block, "dc:date");
    const summary =
      pick(block, "description") ||
      pick(block, "content:encoded") ||
      pick(block, "summary");
    if (!title || !link) continue;
    items.push({
      title,
      link,
      source,
      pubDate,
      summary: summary.slice(0, 280),
    });
  }
  return items;
}

let cache: { ts: number; data: NewsItem[] } | null = null;
const CACHE_MS = 30 * 60 * 1000;

export const getNews = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.ts < CACHE_MS) {
    return { news: cache.data };
  }
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "ThreatIntelDashboard/1.0" },
      });
      if (!res.ok) throw new Error(`${feed.name}: ${res.status}`);
      const xml = await res.text();
      return parseRss(xml, feed.name);
    }),
  );
  const all: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
    else console.error("RSS fetch failed:", r.reason);
  }
  all.sort((a, b) => {
    const ta = Date.parse(a.pubDate) || 0;
    const tb = Date.parse(b.pubDate) || 0;
    return tb - ta;
  });
  const top = all.slice(0, 40);
  cache = { ts: Date.now(), data: top };
  return { news: top };
});
