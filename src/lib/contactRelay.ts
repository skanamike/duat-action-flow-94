/**
 * Server-side contact relay logic, kept platform-neutral and unit-testable
 * (RULE 1). The Netlify Function in netlify/functions/contact.mts is a thin wrapper.
 */
import { buildLeadPayload, hasErrors, isSpam, normalizeLead, validateLead } from "./leadCapture.ts";

export interface RelayOptions {
  /** Destination webhook. When missing, the relay refuses with 503. */
  webhookUrl: string | undefined;
  fetchImpl: typeof fetch;
  /** Host whose pages may submit, e.g. "duatflow.com" (subdomains like www. are allowed). */
  siteHost: string;
}

export const MAX_BODY_BYTES = 20_000;
const MAX_ORIGIN_PATH = 200;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function isSiteHost(host: string, siteHost: string): boolean {
  return host === siteHost || host.endsWith(`.${siteHost}`);
}

/**
 * Reduce the Referer to a same-site path for the CRM (R20). Anything off-site
 * or unparseable becomes "unknown", so attacker-chosen URLs never reach the CRM.
 */
export function sanitizeOrigin(referer: string | null, siteHost: string): string {
  if (!referer) return "unknown";
  try {
    const url = new URL(referer);
    return isSiteHost(url.hostname, siteHost) ? url.pathname.slice(0, MAX_ORIGIN_PATH) : "unknown";
  } catch {
    return "unknown";
  }
}

export async function handleContact(request: Request, options: RelayOptions): Promise<Response> {
  if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed" });

  // R18: JSON only. Cross-site HTML forms can't send application/json without a CORS preflight, which this endpoint never grants.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false, error: "Content-Type must be application/json" });
  }
  // Browsers send Sec-Fetch-Site; refuse explicit cross-site requests.
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return json(403, { ok: false, error: "Cross-site submission refused" });
  }

  // R19: refuse oversize bodies before reading them, then verify actual bytes.
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return json(413, { ok: false, error: "Request too large" });
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return json(413, { ok: false, error: "Request too large" });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return json(400, { ok: false, error: "Expected a JSON object" });
  }

  const lead = normalizeLead(parsed);
  // Scripted posts that include the honeypot get a fake success and are dropped.
  // (The real form strips the field client-side and never reaches this branch.)
  if (isSpam(lead)) return json(200, { ok: true });

  const errors = validateLead(lead);
  if (hasErrors(errors)) return json(422, { ok: false, errors });

  if (!options.webhookUrl) {
    console.error("Lead relay: ZAPIER_WEBHOOK_URL is not configured");
    return json(503, { ok: false, error: "Lead capture is not configured" });
  }

  const payload = buildLeadPayload(lead, sanitizeOrigin(request.headers.get("referer"), options.siteHost));
  try {
    const upstream = await options.fetchImpl(options.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
}
