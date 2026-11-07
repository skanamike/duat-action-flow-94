import { defineConfig, devices } from "@playwright/test";

// Dedicated port, and never reuse a running server: a stale server silently skips the build
// and tests old code (found by mutation-testing the AC4 contrast check).
const PORT = 4329;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "off",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // Tests run against the production build, served by a single-process server that applies
    // the real _redirects and _headers (incl. CSP). `astro preview` leaked an orphaned child process.
    // E2E_FIXTURES=1 also builds the test-only pages in src/pages/e2e-fixtures (never part of a production build).
    command: `E2E_FIXTURES=1 npm run build && node scripts/serve-dist.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
