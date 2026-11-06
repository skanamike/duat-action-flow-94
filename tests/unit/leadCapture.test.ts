import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  GENERIC_SUBMIT_ERROR,
  buildLeadPayload,
  createHttpLeadAdapter,
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

describe("createHttpLeadAdapter", () => {
  const payload = buildLeadPayload(normalizeLead(valid), "test");

  test("reports success only on a 2xx response", async () => {
    const ok = createHttpLeadAdapter("/api/contact", async () => new Response("{}", { status: 200 }));
    assert.deepEqual(await ok.submit(payload), { ok: true });
  });

  test("reports failure on a non-2xx response (the old no-cors bug)", async () => {
    const bad = createHttpLeadAdapter("/api/contact", async () => new Response("{}", { status: 502 }));
    assert.deepEqual(await bad.submit(payload), { ok: false, error: GENERIC_SUBMIT_ERROR });
  });

  test("reports failure on a network error", async () => {
    const down = createHttpLeadAdapter("/api/contact", async () => {
      throw new TypeError("network down");
    });
    assert.deepEqual(await down.submit(payload), { ok: false, error: GENERIC_SUBMIT_ERROR });
  });

  test("posts JSON to the configured endpoint", async () => {
    let seen: { url: string; init?: RequestInit } | undefined;
    const spy = createHttpLeadAdapter("/api/contact", async (url, init) => {
      seen = { url: String(url), init };
      return new Response("{}", { status: 200 });
    });
    await spy.submit(payload);
    assert.equal(seen?.url, "/api/contact");
    assert.equal(seen?.init?.method, "POST");
    assert.deepEqual(JSON.parse(String(seen?.init?.body)), payload);
  });
});
