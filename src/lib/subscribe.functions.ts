import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  severity_threshold: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("HIGH"),
});

export const subscribe = createServerFn({ method: "POST" })
  .inputValidator((input) => SubscribeSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("subscribers")
      .insert({ email: data.email, severity_threshold: data.severity_threshold });
    if (error) {
      if (error.code === "23505") {
        return { ok: true, message: "You're already subscribed." };
      }
      console.error("subscribe insert error:", error);
      return { ok: false, message: "Could not subscribe. Try again later." };
    }
    return { ok: true, message: "Subscribed. We'll alert you on critical threats." };
  });
