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

test("trailing-slash URLs 301 to the canonical form (R6)", () => {
  const redirects = read("public/_redirects");
  for (const route of ["/product", "/technology", "/company", "/company/team", "/why-duat"]) {
    assert.match(redirects, new RegExp(`^${route}/\\s+${route}\\s+301$`, "m"), route);
  }
  assert.doesNotMatch(redirects, /^\/solutions/m, "no redirects for routes that never existed");
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

test("test-only fixture pages are gated off in production builds and kept out of the sitemap (TASK-003b)", () => {
  assert.match(read("src/pages/e2e-fixtures/[name].astro"), /process\.env\.E2E_FIXTURES === "1" \? \[[^\]]*\] : \[\]/, "fixture routes exist only when E2E_FIXTURES=1");
  assert.match(read("astro.config.mjs"), /filter: \(page\) => !page\.includes\("\/e2e-fixtures\/"\)/);
  assert.match(read("playwright.config.ts"), /E2E_FIXTURES=1 npm run build/);
  assert.doesNotMatch(read("package.json"), /E2E_FIXTURES/, "the real build script must not enable fixtures");
});
