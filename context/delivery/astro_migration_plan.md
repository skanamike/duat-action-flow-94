# TASK-001: Astro Migration Plan
*Tech Lead | 2026-11-06 | Tier: **T3 Complex** | Per PROC-001 (plan before code)*

## Goal
Rebuild duatflow.com on Astro (ADR-001) with no loss of content, and fix the Phase 0 defects from `MODERNIZATION_PLAN.md`.

## Scope
**In:** toolchain swap; all 6 live pages + 404; layout, nav (with a working mobile menu), footer; contact form relay; per-page SEO; sitemap; redirects; security headers; unit + e2e tests; CI.
**Out (logged as debt):** new copy, new imagery, sourcing statistics, headshots, analytics consent, converting views to `.astro`.

## Target structure
```
astro.config.mjs            static output, react(), sitemap(), tailwind vite plugin
netlify/functions/contact.mts   lead relay → Zapier (ADR-004)
public/_redirects _headers robots.txt images/ favicon
src/
  config/site.ts            name, URLs, nav, contact email, demo URL
  layouts/BaseLayout.astro  <head> SEO/OG/canonical/JSON-LD, nav, footer, ContactModal island
  components/
    Nav.astro  Footer.astro  (zero JS; inline menu script)
    ContactModal.tsx        the only React island (client:idle)
    ContactForm.tsx
    ContactTrigger.tsx      static: clones child with data-contact attrs
    ui/                     only used shadcn components
  lib/leadCapture.ts        adapter + pure helpers (unit tested)
  lib/utils.ts
  views/*.tsx               page bodies (static)
  pages/*.astro             index, product, technology, company/index, company/team, why-duat, 404
  styles/global.css         Tailwind 4 @theme tokens
tests/unit/*.test.ts        vitest
tests/e2e/*.spec.ts         Playwright desktop + mobile
scripts/qa-budget.mjs       JS/image size budget
```

## Task breakdown
| Task | Description | Size |
|------|-------------|------|
| 001-a | Toolchain: package.json, astro config, tsconfig, eslint, Tailwind 4 tokens | M |
| 001-b | BaseLayout + SEO + Nav (mobile menu) + Footer | M |
| 001-c | ContactModal island, ContactTrigger, leadCapture adapter, Netlify relay | M |
| 001-d | Port views; replace dialogs/Link; remove missing /grid.svg; fix invisible button; Now/Next/Later roadmap | L |
| 001-e | Redirects, headers, sitemap, robots, remove Vite/Lovable leftovers and the leaked token | S |
| 001-f | Tests (unit + e2e) + budgets + CI workflow | M |

## Acceptance criteria
1. Every route returns real HTML containing its `<h1>` and a unique `<title>`/description.
2. Phone (390px): the menu button opens a nav listing all pages; no horizontal scroll on any page.
3. Every "contact" CTA opens the form; the form shows success only on a 2xx from `/api/contact`, and a real error otherwise.
4. "Schedule Executive Briefing" on /product is visible (contrast ≥ 4.5:1).
5. `/pantheon` and `/companyv1` redirect 301 to `/company`.
6. Home page ships ≤ 40 KB gzip JS before interaction.
7. `npm run check`, `lint`, `test`, `build`, `test:e2e` all exit 0, in CI too.
8. No secrets in source; the HF token is removed from `scripts/`.

## Validation (T3)
Self-Check → **Dual-Model Beta review (sonnet + opus, blind)** → QA Runner/QA Manager → SecDev → Tech Lead.

## Rollback
The Vite app stays recoverable from commit `bd3022d` (pre-migration). The branch is not merged until the operator approves.
