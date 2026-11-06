import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { MAX_BODY_BYTES, handleContact, sanitizeOrigin, type RelayOptions } from "../../src/lib/contactRelay.ts";

const WEBHOOK = "https://hooks.example.test/catch/1";
const valid = { name: "Jane Doe", email: "jane@acme.com", company: "Acme", message: "We need tier-3 visibility." };

function setup(upstreamStatus = 200, overrides: Partial<RelayOptions> = {}) {
  const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
  const options: RelayOptions = {
    webhookUrl: WEBHOOK,
    siteHost: "duatflow.com",
    fetchImpl: (async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
      return new Response("{}", { status: upstreamStatus });
    }) as typeof fetch,
    ...overrides,
  };
  return { calls, options };
}

function post(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://duatflow.com/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("handleContact", () => {
  test("forwards a valid lead and returns 200", async () => {
    const { calls, options } = setup();
    const res = await handleContact(post(valid, { referer: "https://duatflow.com/product?x=1" }), options);
    assert.equal(res.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, WEBHOOK);
    assert.equal(calls[0].body.origin, "/product");
  });

  test("R2: malformed-but-valid JSON returns 4xx instead of throwing", async () => {
    const { calls, options } = setup();
    for (const body of ["null", "[]", "42", '"str"']) {
      const res = await handleContact(post(body), options);
      assert.equal(res.status, 400, `body ${body}`);
    }
    const typed = await handleContact(post({ ...valid, name: 12345 }), options);
    assert.equal(typed.status, 422);
    assert.equal(calls.length, 0);
  });

  test("rejects invalid JSON (400), wrong method (405) and wrong content type (415)", async () => {
    const { options } = setup();
    assert.equal((await handleContact(post("{not json"), options)).status, 400);
    assert.equal((await handleContact(new Request("https://duatflow.com/api/contact"), options)).status, 405);
    assert.equal((await handleContact(post(valid, { "content-type": "text/plain" }), options)).status, 415);
  });

  test("refuses explicit cross-site browser submissions (403)", async () => {
    const { calls, options } = setup();
    const res = await handleContact(post(valid, { "sec-fetch-site": "cross-site" }), options);
    assert.equal(res.status, 403);
    assert.equal(calls.length, 0);
  });

  test("R19: rejects oversize bodies by declared length and by actual bytes", async () => {
    const { options } = setup();
    assert.equal((await handleContact(post(valid, { "content-length": String(MAX_BODY_BYTES + 1) }), options)).status, 413);
    // 7,000 x '€' = 21,000 bytes but only 7,000 characters.
    const euros = { ...valid, message: "€".repeat(7000) };
    assert.equal((await handleContact(post(euros), options)).status, 413);
  });

  test("returns 422 with field errors for invalid leads", async () => {
    const { calls, options } = setup();
    const res = await handleContact(post({ ...valid, email: "nope" }), options);
    assert.equal(res.status, 422);
    assert.ok((await res.json()).errors.email);
    assert.equal(calls.length, 0);
  });

  test("R21: rejects CRLF/control characters in single-line fields", async () => {
    const { calls, options } = setup();
    const res = await handleContact(post({ ...valid, name: "Jo\r\nBcc: x@evil.tld" }), options);
    assert.equal(res.status, 422);
    assert.equal(calls.length, 0);
  });

  test("honeypot posts get a silent 200 and are not forwarded (any type)", async () => {
    const { calls, options } = setup();
    assert.equal((await handleContact(post({ ...valid, website: "spam" }), options)).status, 200);
    assert.equal((await handleContact(post({ ...valid, website: true }), options)).status, 200);
    assert.equal(calls.length, 0);
  });

  test("R5: no webhook configured → 503, nothing forwarded", async () => {
    const { calls, options } = setup(200, { webhookUrl: undefined });
    assert.equal((await handleContact(post(valid), options)).status, 503);
    assert.equal(calls.length, 0);
  });

  test("upstream failure → 502; upstream unreachable → 502", async () => {
    assert.equal((await handleContact(post(valid), setup(500).options)).status, 502);
    const throwing = setup(200, {
      fetchImpl: (async () => {
        throw new TypeError("down");
      }) as typeof fetch,
    });
    assert.equal((await handleContact(post(valid), throwing.options)).status, 502);
  });
});

describe("sanitizeOrigin (R20)", () => {
  test("keeps only same-site paths", () => {
    assert.equal(sanitizeOrigin("https://duatflow.com/company/team", "duatflow.com"), "/company/team");
    assert.equal(sanitizeOrigin("https://www.duatflow.com/product", "duatflow.com"), "/product");
    assert.equal(sanitizeOrigin("https://evil.example/phish", "duatflow.com"), "unknown");
    assert.equal(sanitizeOrigin("https://duatflow.com.evil.example/", "duatflow.com"), "unknown");
    assert.equal(sanitizeOrigin("not a url", "duatflow.com"), "unknown");
    assert.equal(sanitizeOrigin(null, "duatflow.com"), "unknown");
  });
});
