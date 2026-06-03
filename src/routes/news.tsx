import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { getNews } from "@/lib/news.functions";

const newsQO = queryOptions({
  queryKey: ["news"],
  queryFn: () => getNews(),
});

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Security News — Sentinel/Intel" },
      {
        name: "description",
        content:
          "Curated cybersecurity news from The Hacker News, Krebs on Security, SecurityWeek, BleepingComputer, and Dark Reading.",
      },
      { property: "og:title", content: "Security News — Sentinel/Intel" },
      {
        property: "og:description",
        content: "Latest security news aggregated from five top industry sources.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQO),
  component: NewsPage,
  errorComponent: ({ error }) => (
    <p className="px-6 py-16 text-center text-destructive">{error.message}</p>
  ),
});

function NewsPage() {
  const { data } = useSuspenseQuery(newsQO);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-mono">
          Newswire
        </div>
        <h1 className="mt-2 text-3xl font-bold">Security news, aggregated.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {data.news.length} stories from 5 trusted sources · auto-refreshes hourly
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.news.map((n) => (
          <a
            key={n.link}
            href={n.link}
            target="_blank"
            rel="noreferrer"
            className="group block rounded-lg border border-border/70 bg-card p-4 transition hover:border-primary/50 hover:shadow-glow"
          >
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-primary font-mono">
              <span>{n.source}</span>
              {n.pubDate && (
                <span className="text-muted-foreground normal-case tracking-normal">
                  {new Date(n.pubDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug">{n.title}</h3>
            {n.summary && (
              <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{n.summary}</p>
            )}
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition group-hover:opacity-100">
              Read more <ExternalLink className="h-3 w-3" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
