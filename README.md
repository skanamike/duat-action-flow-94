# DUAT Website (duatflow.com)

Marketing and investor site for **DUAT** / **DuatFlow**: predictive supply-chain risk intelligence.

**Stack:** Astro 7 (static) · React 19 (build-time only) · Tailwind CSS 4 · TypeScript · Netlify

## Quick start

Requires Node 22.12 or newer.

```bash
npm install
```

```bash
npm run dev
```

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local dev server at http://localhost:4321 |
| `npm run check` | Type-check `.astro` and `.ts` files |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Node's built-in test runner) |
| `npm run build` | Static build to `dist/` |
| `npm run qa:budget` | JS/image size budgets (after build) |
| `npm run test:e2e` | Playwright, desktop + mobile (builds first) |

## Project layout

```
src/pages/        One .astro file per route (title, description, layout)
src/views/        Page bodies (React, rendered to static HTML at build time)
src/components/   Nav, Footer, ContactModal (.astro); shared React pieces; ui/
src/lib/          Pure, unit-tested logic (lead capture, paths)
src/scripts/      The only client JS: mobile menu + contact dialog
src/config/site.ts  Site-wide constants: URLs, email, nav items
netlify/functions/contact.mts  Contact-form relay → Zapier
public/_redirects, _headers    Netlify redirects + security headers
context/          ADRs, debt register, plans, agent message queue
.claude/agents/   AI delivery team (see CLAUDE.md)
templates/agent-team/  Reusable copy of the agent team for other repos
```

## Editing content

- **Text on a page:** edit the matching file in `src/views/`.
- **Page title and description (SEO):** edit `src/pages/<route>.astro`.
- **Email, demo links, nav items:** edit `src/config/site.ts`.
- **Contact buttons:** any element with `data-contact` opens the form. Add `data-contact-title="..."` to customise its heading.

## Deployment (Netlify)

Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).

> **Required before the first deploy:** set `ZAPIER_WEBHOOK_URL` in Netlify → Site configuration → Environment variables (scope: Functions). Use a **new** Zapier Catch Hook, because the old one is public in git history. Without it, the contact form shows an error and offers the email link instead.

## How we work

Development follows the multi-agent process in [`CLAUDE.md`](CLAUDE.md): tiered tasks (T1–T4), plan before code, executed QA gates, and Git Ops as the only committer. Decisions are recorded in [`context/delivery/adr_log.md`](context/delivery/adr_log.md), and known gaps are listed in [`context/delivery/technical_debt.md`](context/delivery/technical_debt.md).
