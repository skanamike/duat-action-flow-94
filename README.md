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

### Contact form (Netlify Forms, ADR-007)

The contact dialog is a Netlify form named `contact`. Netlify finds it by parsing the built HTML at deploy time; the browser then submits it in the background (URL-encoded POST to `/`). There is no server code and no environment variable.

> **Required once, before the form can work:**
> 1. In Netlify, open **Forms** for this site and **enable form detection** (newer sites have it off by default), then trigger a new deploy so the form is detected. Until then, submissions are rejected and visitors see an error with the email link.
> 2. Netlify → Forms → **Form notifications** (also under the site's configuration → Notifications → Emails and webhooks) → add an **email notification** for the form `contact`, sent to the operator's notification inbox. Configure the address in the Netlify UI only; never commit it to this repo.
> 3. On a deploy preview, send a test request and confirm it appears under Forms and arrives by email.

Submissions are stored under **Forms** in the Netlify UI and count against the Netlify plan's monthly form allowance. Netlify's spam filtering and the hidden `website` honeypot field protect the form.

**Ongoing operator hygiene** (SecDev, TASK-002):
- **Check Forms → Spam weekly.** Spam-flagged submissions send no notification, so a real lead filed as spam would otherwise be missed. Mark false positives as verified.
- Treat notification emails as untrusted (anyone can post to the form). Check the sender before replying, and don't open links from unknown senders. When exporting CSV, import the columns as text (formula injection).
- Turn on 2FA on the Netlify account, keep the team members who can see Forms to a minimum, and delete submissions once they're handled (DEBT-016).
- Watch monthly form usage. Spam over the DEBT-015 trigger means adding reCAPTCHA.

## How we work

Development follows the multi-agent process in [`CLAUDE.md`](CLAUDE.md): tiered tasks (T1–T4), plan before code, executed QA gates, and Git Ops as the only committer. Decisions are recorded in [`context/delivery/adr_log.md`](context/delivery/adr_log.md), and known gaps are listed in [`context/delivery/technical_debt.md`](context/delivery/technical_debt.md).
