import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribe } from "@/lib/subscribe.functions";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export function SubscribeForm() {
  const subscribeFn = useServerFn(subscribe);
  const [email, setEmail] = useState("");
  const [severity, setSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await subscribeFn({ data: { email, severity_threshold: severity } });
      setMessage(res.message);
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
      setMessage("Invalid email or something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            className="w-full rounded-md border border-input bg-input/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as typeof severity)}
          className="rounded-md border border-input bg-input/40 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="CRITICAL">Critical only</option>
          <option value="HIGH">High +</option>
          <option value="MEDIUM">Medium +</option>
          <option value="LOW">All</option>
        </select>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-60"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get alerts"}
        </button>
      </div>
      {message && (
        <p
          className={`flex items-center gap-2 text-xs ${
            status === "success" ? "text-severity-low" : "text-destructive"
          }`}
        >
          {status === "success" && <CheckCircle2 className="h-3.5 w-3.5" />}
          {message}
        </p>
      )}
    </form>
  );
}
