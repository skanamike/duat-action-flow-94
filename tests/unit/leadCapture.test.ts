import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  CONTACT_FORM_NAME,
  FORM_URLENCODED,
  GENERIC_SUBMIT_ERROR,
  buildLeadPayload,
  createNetlifyFormsAdapter,
  encodeNetlifyForm,
  hasErrors,
  isSpam,
  normalizeLead,
  validateLead,
} from "../../src/lib/leadCapture.ts";

const valid = {
  name: "Jane Doe",
  email: "jane@acme.com",
  company: "Acme",
  message: "We source lithium from three tiers.",
};

describe("normalizeLead", () => {
  test("trims fields and fills missing ones with empty strings", () => {
    assert.deepEqual(normalizeLead({ name: "  Jane  ", email: " a@b.co " }), {
      name: "Jane",
      email: "a@b.co",
      company: "",
      message: "",
      website: "",
    });
  });
});

describe("validateLead", () => {
  test("accepts a valid lead", () => {
    assert.equal(hasErrors(validateLead(normalizeLead(valid))), false);
  });

  test("flags every missing required field", () => {
    const errors = validateLead(normalizeLead({}));
    assert.deepEqual(Object.keys(errors).sort(), ["company", "email", "message", "name"]);
  });

  test("rejects malformed emails", () => {
    for (const email of ["jane", "jane@", "jane@acme", "ja ne@acme.com", "@acme.com"]) {
      assert.ok(validateLead(normalizeLead({ ...valid, email })).email, `expected error for ${email}`);
    }
  });

  test("enforces minimum message length after trimming", () => {
    assert.ok(validateLead(normalizeLead({ ...valid, message: "   short   " })).message);
  });

  test("enforces maximum lengths", () => {
    assert.ok(validateLead(normalizeLead({ ...valid, message: "x".repeat(5001) })).message);
    assert.ok(validateLead(normalizeLead({ ...valid, name: "x".repeat(121) })).name);
  });
});

describe("isSpam", () => {
  test("detects a filled honeypot", () => {
    assert.equal(isSpam({ website: "http://spam.example" }), true);
    assert.equal(isSpam({ website: "   " }), false);
    assert.equal(isSpam({}), false);
  });
});

describe("buildLeadPayload", () => {
  test("never includes the honeypot and stamps time and origin", () => {
    const payload = buildLeadPayload(
      normalizeLead({ ...valid, website: "bot" }),
      "https://duatflow.com/product",
      new Date("2026-11-06T12:00:00Z"),
    );
    assert.equal("website" in payload, false);
    assert.equal(payload.timestamp, "2026-11-06T12:00:00.000Z");
    assert.equal(payload.origin, "https://duatflow.com/product");
  });
});

const NETLIFY_FIELDS = ["form-name", "name", "email", "company", "message", "origin"];

describe("encodeNetlifyForm", () => {
  const payload = buildLeadPayload(
    normalizeLead({ ...valid, website: "bot" }),
    "/product",
    new Date("2026-11-06T12:00:00Z"),
  );

  test("sends form-name first, then exactly the five lead fields", () => {
    const params = new URLSearchParams(encodeNetlifyForm(CONTACT_FORM_NAME, payload));
    assert.deepEqual([...params.keys()], NETLIFY_FIELDS);
    assert.deepEqual(Object.fromEntries(params), {
      "form-name": "contact",
      name: "Jane Doe",
      email: "jane@acme.com",
      company: "Acme",
      message: "We source lithium from three tiers.",
      origin: "/product",
    });
  });

  test("never sends the honeypot or the timestamp, even if extra keys are present", () => {
    const polluted = { ...payload, website: "http://spam.example" } as typeof payload;
    const params = new URLSearchParams(encodeNetlifyForm("contact", polluted));
    assert.equal(params.has("website"), false);
    assert.equal(params.has("timestamp"), false);
  });

  test("escapes reserved characters so values survive the round trip", () => {
    const tricky = { ...payload, company: "R&D = A+B", message: "Line one\nline two & 100% ünïcødé?" };
    const body = encodeNetlifyForm("contact", tricky);
    assert.doesNotMatch(body, /R&D/, "raw & would split the field");
    const params = new URLSearchParams(body);
    assert.equal(params.get("company"), "R&D = A+B");
    assert.equal(params.get("message"), "Line one\nline two & 100% ünïcødé?");
  });
});

describe("createNetlifyFormsAdapter", () => {
  const payload = buildLeadPayload(normalizeLead(valid), "/product");
  const respond =
    (status: number): typeof fetch =>
    async () =>
      new Response(status === 204 ? null : "<html></html>", { status });

  test("reports success on 2xx responses", async () => {
    for (const status of [200, 204]) {
      const adapter = createNetlifyFormsAdapter("/", "contact", respond(status));
      assert.deepEqual(await adapter.submit(payload), { ok: true }, `status ${status}`);
    }
  });

  test("reports failure on every non-2xx response (e.g. form not detected → 404)", async () => {
    for (const status of [400, 404, 405, 422, 429, 500, 502, 503]) {
      const adapter = createNetlifyFormsAdapter("/", "contact", respond(status));
      assert.deepEqual(await adapter.submit(payload), { ok: false, error: GENERIC_SUBMIT_ERROR }, `status ${status}`);
    }
  });

  test("reports failure on a network error", async () => {
    const down = createNetlifyFormsAdapter("/", "contact", async () => {
      throw new TypeError("network down");
    });
    assert.deepEqual(await down.submit(payload), { ok: false, error: GENERIC_SUBMIT_ERROR });
  });

  test("POSTs URL-encoded form data to the site root by default", async () => {
    let seen: { url: string; init?: RequestInit } | undefined;
    const spy = createNetlifyFormsAdapter(undefined, undefined, async (url, init) => {
      seen = { url: String(url), init };
      return new Response("", { status: 200 });
    });
    await spy.submit(payload);
    assert.equal(seen?.url, "/");
    assert.equal(seen?.init?.method, "POST");
    assert.deepEqual(seen?.init?.headers, { "Content-Type": FORM_URLENCODED });
    assert.equal(seen?.init?.body, encodeNetlifyForm(CONTACT_FORM_NAME, payload));
    assert.equal(new URLSearchParams(String(seen?.init?.body)).get("form-name"), "contact");
  });

  test("honours a custom endpoint and form name", async () => {
    let seen: { url: string; body: string } | undefined;
    const spy = createNetlifyFormsAdapter("/thanks", "briefing", async (url, init) => {
      seen = { url: String(url), body: String(init?.body) };
      return new Response("", { status: 200 });
    });
    await spy.submit(payload);
    assert.equal(seen?.url, "/thanks");
    assert.equal(new URLSearchParams(seen?.body).get("form-name"), "briefing");
  });
});
