import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary text-glow font-mono">404</h1>
        <h2 className="mt-4 text-xl font-semibold">No signal</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page isn't on the wire. Head back to the dashboard.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Feed interrupted</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Retry
          </button>
          <a
            href="/"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Intel Scope — Threat Intelligence Dashboard" },
      {
        name: "description",
        content:
          "Free, real-time cybersecurity threat intelligence dashboard: latest CVEs, attack trends, and curated security news.",
      },
      { property: "og:title", content: "Intel Scope — Threat Intelligence Dashboard" },
      {
        property: "og:description",
        content:
          "Real-time CVE feed, attack trend visualizations, and curated cybersecurity news in one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Intel Scope — Threat Intelligence Dashboard" },
      { name: "description", content: "Intel Scope is a web application that centralizes cybersecurity threat data, presenting it through interactive visualizations and curated security news." },
      { property: "og:description", content: "Intel Scope is a web application that centralizes cybersecurity threat data, presenting it through interactive visualizations and curated security news." },
      { name: "twitter:description", content: "Intel Scope is a web application that centralizes cybersecurity threat data, presenting it through interactive visualizations and curated security news." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a9be3b7f-ac2c-4cd7-be3c-1e71c36b034c/id-preview-9acc5652--6117c642-4fbe-4a32-9296-b2d8bb11639a.lovable.app-1780488161698.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a9be3b7f-ac2c-4cd7-be3c-1e71c36b034c/id-preview-9acc5652--6117c642-4fbe-4a32-9296-b2d8bb11639a.lovable.app-1780488161698.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none fixed inset-0 glow-bg" />
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </div>
    </QueryClientProvider>
  );
}
