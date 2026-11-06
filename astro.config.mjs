// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Canonical production origin. Used for canonical URLs, OG tags and the sitemap.
const SITE_URL = "https://duatflow.com";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  // React renders page "views" to static HTML at build time only (ADR-003).
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
