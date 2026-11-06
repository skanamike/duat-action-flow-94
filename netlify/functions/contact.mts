/**
 * Lead-capture relay (ADR-004). Receives the contact form as same-origin JSON,
 * validates it again server-side, and forwards it to Zapier. Returns the real
 * outcome, so the browser can tell success from failure.
 *
 * REQUIRED: set ZAPIER_WEBHOOK_URL in Netlify → Site configuration →
 * Environment variables (scope: Functions). There is deliberately no fallback
 * (SecDev R5): without it the relay answers 503 and the form shows an error
 * with the mailto alternative.
 */
import { handleContact } from "../../src/lib/contactRelay.ts";

export default async (request: Request): Promise<Response> =>
  handleContact(request, { webhookUrl: process.env.ZAPIER_WEBHOOK_URL, fetchImpl: fetch, siteHost: "duatflow.com" });

export const config = {
  path: "/api/contact",
  // Netlify function rate limiting (R23): 5 submissions per minute per IP.
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
