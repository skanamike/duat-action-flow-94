/**
 * Checks on the Netlify config files in public/ (redirects, headers, robots).
 * They only take effect on Netlify, so they can't be exercised by `astro preview`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p: string): string => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

test("retired routes 301 to /company (ADR-005)", () => {
  const redirects = read("public/_redirects");
  assert.match(redirects, /^\/pantheon\s+\/company\s+301$/m);
  assert.match(redirects, /^\/companyv1\s+\/company\s+301$/m);
  assert.doesNotMatch(redirects, /^\/\*\s+\/index\.html\s+200/m, "SPA catch-all must be gone");
});

test("security headers are declared for every path", () => {
  const headers = read("public/_headers");
  for (const h of ["X-Content-Type-Options: nosniff", "Referrer-Policy:", "Content-Security-Policy:", "frame-ancestors 'none'"]) {
    assert.ok(headers.includes(h), `missing ${h}`);
  }
});

test("robots.txt points to the sitemap", () => {
  assert.match(read("public/robots.txt"), /^Sitemap: https:\/\/duatflow\.com\/sitemap-index\.xml$/m);
});

test("no hard-coded Hugging Face tokens in scripts (SEC-001)", () => {
  assert.doesNotMatch(read("scripts/generate-images.js"), /hf_[A-Za-z0-9]{20,}/);
});
