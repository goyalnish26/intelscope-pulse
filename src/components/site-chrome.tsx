import { Link } from "@tanstack/react-router";
import { Github, ShieldAlert } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/cves", label: "CVEs" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/30 group-hover:bg-primary/15 transition">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-foreground">
              INTEL<span className="text-primary"> </span>SCOPE
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Cyber Threat Intelligence
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
              activeProps={{ className: "text-primary bg-primary/10 hover:bg-primary/10" }}
            >
              {n.label}
            </Link>
          ))}
          <a
            href="https://github.com/goyalnish26"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub: goyalnish26"
            title="GitHub"
            className="ml-1 grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
          >
            <Github className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Intel Scope · Open threat intelligence for everyone.</p>
        <p className="font-mono">
          Data: <span className="text-primary">NVD</span> · RSS:{" "}
          <span className="text-primary">5 sources</span>
        </p>
      </div>
    </footer>
  );
}
