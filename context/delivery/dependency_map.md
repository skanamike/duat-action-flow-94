# DUAT Website: Dependency Map
*Owned by: Tech Lead | Updated: 2026-11-06 | Policy: ADR-006 (exact pins, releases ≥ 2 weeks old)*

## Runtime (build-time; nothing below ships to the browser except via src/scripts)
| Package | Version | Purpose |
|---------|---------|---------|
| astro | 7.4.2 | Static site framework |
| @astrojs/react | 7.1.1 | Render React views to HTML at build time |
| @astrojs/sitemap | 3.7.4 | sitemap-index.xml |
| react / react-dom | 19.3.1 | View templates (server-side only) |
| tailwindcss / @tailwindcss/vite | 4.3.3 | Styling |
| @radix-ui/react-slot | 1.5.0 | `Button asChild` |
| class-variance-authority, clsx, tailwind-merge | 0.7.1 / 2.1.1 / 3.7.0 | Button variants, class merging |
| lucide-react | 1.61.0 | Icons (rendered to inline SVG at build) |

## Dev
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | 5.9.3 | `@astrojs/check` supports TS 5–6 only (not 7) |
| @astrojs/check | 0.9.12 | `npm run check` |
| eslint, @eslint/js, typescript-eslint, eslint-plugin-astro, globals | 10.13.0 / 10.0.1 / 8.72.0 / 3.2.1 / 17.13.0 | Lint |
| @playwright/test | 1.63.0 | E2E. Matches the preinstalled browser build |
| @types/* | — | Types |

**Not used:** vitest. npm 10.9 crashes (`Cannot read properties of null (reading 'edgesOut')`) resolving vitest 4.1.x's peer set. Unit tests use Node's built-in `node --test`, which runs TypeScript natively on Node ≥ 22.18. Revisit when npm is upgraded.

## External services
| Service | Where | Adapter / config |
|---------|-------|------------------|
| Zapier catch hook (lead routing) | `netlify/functions/contact.mts` | `LeadCaptureAdapter`; `ZAPIER_WEBHOOK_URL` env |
| Google Analytics 4 (G-LMDZPXWHR6) | `BaseLayout.astro` | `SITE.analyticsId`; DEBT-007 consent |
| Interactive demo (Render) | links only | `DEMO_URL`, `DEMO_VIDEO_URL`; DEBT-006 |
