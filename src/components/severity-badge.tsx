import { cn } from "@/lib/utils";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";

const styles: Record<Severity, string> = {
  CRITICAL: "bg-severity-critical/15 text-severity-critical ring-severity-critical/40",
  HIGH: "bg-severity-high/15 text-severity-high ring-severity-high/40",
  MEDIUM: "bg-severity-medium/15 text-severity-medium ring-severity-medium/40",
  LOW: "bg-severity-low/15 text-severity-low ring-severity-low/40",
  NONE: "bg-muted text-muted-foreground ring-border",
};

export function SeverityBadge({
  severity,
  score,
  className,
}: {
  severity: Severity;
  score?: number | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset font-mono",
        styles[severity],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {severity}
      {typeof score === "number" && <span className="opacity-80">{score.toFixed(1)}</span>}
    </span>
  );
}
