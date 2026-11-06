/**
 * Lead capture: validation, payload building and the adapter interface
 * (ADR-004, RULE 1 + RULE 5). Pure functions, no DOM and no imports, so the
 * module runs unchanged in the browser, the Netlify Function and `node --test`.
 */

export interface LeadInput {
  name: string;
  email: string;
  company: string;
  message: string;
  /** Honeypot field. Real users never see or fill it. */
  website?: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  company: string;
  message: string;
  timestamp: string;
  origin: string;
}

export type LeadField = "name" | "email" | "company" | "message";
export type LeadErrors = Partial<Record<LeadField, string>>;

export const LEAD_LIMITS = {
  nameMin: 2,
  nameMax: 120,
  emailMax: 254,
  companyMin: 1,
  companyMax: 160,
  messageMin: 10,
  messageMax: 5000,
} as const;

// Pragmatic email check: one @, no whitespace/quotes/angle brackets, and a dot in the domain part.
const EMAIL_PATTERN = /^[^\s@<>"'`]+@[^\s@<>"'`]+\.[^\s@<>"'`]+$/;
// C0 control characters (incl. CR/LF) and DEL. Single-line fields must not contain them (header injection in downstream emails).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

/** Only real strings count; numbers, objects, null, etc. become "". */
function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Accepts *any* parsed JSON (including null, arrays, numbers) and returns a
 * well-formed lead. Untrusted input from the relay goes through here, so it must never throw.
 */
export function normalizeLead(input: unknown): LeadInput {
  const source = (typeof input === "object" && input !== null && !Array.isArray(input) ? input : {}) as Record<string, unknown>;
  return {
    name: text(source.name),
    email: text(source.email),
    company: text(source.company),
    message: text(source.message),
    // Any non-empty honeypot value, string or not, marks a bot.
    website: typeof source.website === "string" ? source.website.trim() : source.website ? "filled" : "",
  };
}

/** True when the honeypot was filled, which only bots do. */
export function isSpam(input: Pick<LeadInput, "website">): boolean {
  return Boolean(input.website && input.website.trim().length > 0);
}

/** Validate a normalized lead. Returns an empty object when valid. */
export function validateLead(lead: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  const L = LEAD_LIMITS;

  if (lead.name.length < L.nameMin) errors.name = "Please enter your full name";
  else if (lead.name.length > L.nameMax) errors.name = `Name must be ${L.nameMax} characters or fewer`;
  else if (CONTROL_CHARS.test(lead.name)) errors.name = "Name contains unsupported characters";

  if (!EMAIL_PATTERN.test(lead.email) || lead.email.length > L.emailMax || CONTROL_CHARS.test(lead.email)) {
    errors.email = "Please enter a valid email";
  }

  if (lead.company.length < L.companyMin) errors.company = "Please enter your company";
  else if (lead.company.length > L.companyMax) errors.company = `Company must be ${L.companyMax} characters or fewer`;
  else if (CONTROL_CHARS.test(lead.company)) errors.company = "Company contains unsupported characters";

  if (lead.message.length < L.messageMin) errors.message = "Please provide a bit more detail (10+ characters)";
  else if (lead.message.length > L.messageMax) errors.message = `Message must be ${L.messageMax} characters or fewer`;

  return errors;
}

export function hasErrors(errors: LeadErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Build the payload forwarded to the CRM/Zapier. The honeypot is never included. */
export function buildLeadPayload(lead: LeadInput, origin: string, now: Date = new Date()): LeadPayload {
  return {
    name: lead.name,
    email: lead.email,
    company: lead.company,
    message: lead.message,
    timestamp: now.toISOString(),
    origin,
  };
}

/** Result of a submission attempt, shown to the visitor verbatim. */
export type SubmitResult = { ok: true } | { ok: false; error: string };

/** Adapter for any lead destination (RULE 5). */
export interface LeadCaptureAdapter {
  submit(payload: LeadPayload): Promise<SubmitResult>;
}

export const GENERIC_SUBMIT_ERROR = "We couldn't send your request. Please try again or email us directly.";

/**
 * Browser adapter: POSTs JSON to the same-origin relay and reports the real
 * outcome. `fetchImpl` is injectable for tests.
 */
export function createHttpLeadAdapter(endpoint: string, fetchImpl: typeof fetch = fetch): LeadCaptureAdapter {
  return {
    async submit(payload: LeadPayload): Promise<SubmitResult> {
      try {
        const response = await fetchImpl(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) return { ok: true };
        return { ok: false, error: GENERIC_SUBMIT_ERROR };
      } catch {
        return { ok: false, error: GENERIC_SUBMIT_ERROR };
      }
    },
  };
}
