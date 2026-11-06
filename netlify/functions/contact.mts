/**
 * Lead-capture relay (ADR-004). Receives the contact form as same-origin JSON,
 * validates it again server-side, and forwards it to Zapier. Returns the real
 * outcome, so the browser can tell success from failure.
 *
 * Configure ZAPIER_WEBHOOK_URL in Netlify → Site configuration → Environment variables.
 * The fallback is the hook already used by the previous site, so leads keep
 * flowing on first deploy.
 */
import {
  buildLeadPayload,
  hasErrors,
  isSpam,
  normalizeLead,
  validateLead,
  type LeadInput,
} from "../../src/lib/leadCapture.ts";

const FALLBACK_WEBHOOK = "https://hooks.zapier.com/hooks/catch/24194548/u6f847r/";
const MAX_BODY_BYTES = 20_000;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed" });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, error: "Request too large" });

  let parsed: Partial<LeadInput>;
  try {
    parsed = JSON.parse(raw) as Partial<LeadInput>;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  const lead = normalizeLead(parsed);
  // Pretend success to bots so they don't retry; nothing is forwarded.
  if (isSpam(lead)) return json(200, { ok: true });

  const errors = validateLead(lead);
  if (hasErrors(errors)) return json(422, { ok: false, errors });

  const origin = request.headers.get("referer") ?? "unknown";
  const webhook = process.env.ZAPIER_WEBHOOK_URL || FALLBACK_WEBHOOK;

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildLeadPayload(lead, origin)),
    });
    if (!upstream.ok) {
      console.error(`Lead relay: upstream responded ${upstream.status}`);
      return json(502, { ok: false, error: "Upstream error" });
    }
    return json(200, { ok: true });
  } catch (error) {
    console.error("Lead relay: upstream unreachable", error);
    return json(502, { ok: false, error: "Upstream unreachable" });
  }
};

export const config = { path: "/api/contact" };
