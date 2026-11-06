# DUAT Website: Architecture Decision Records
*Owned by: Tech Lead | Never delete. Mark superseded ADRs SUPERSEDED with a link to the replacement.*

## Format
```
ADR-XXX: [Title]
DATE: YYYY-MM-DD
STATUS: [PROPOSED | ACCEPTED | SUPERSEDED | DEPRECATED]
CONTEXT / DECISION / RATIONALE / CONSEQUENCES / ALTERNATIVES CONSIDERED
```

---

## ADR-001: Migrate from Vite SPA (Lovable) to Astro static site
DATE: 2026-11-06
STATUS: ACCEPTED

CONTEXT: The site was a Lovable-generated Vite + React SPA. Every route served an empty `<div id="root">` with identical title/description, so crawlers and LinkedIn/Slack previews saw no content. The whole site shipped one 565 KB JS bundle (158 KB gzip). The operator confirmed the site will be developed in code from now on (not Lovable).

DECISION: Astro 7 with `output: "static"`, React 19 islands only for interactive UI, Tailwind CSS 4, TypeScript strict, Netlify hosting.

RATIONALE: A marketing/investor site's jobs are speed, SEO/link previews and easy content updates. Astro renders each page to real HTML at build time and ships zero JS by default. Existing React components can be reused unchanged as server-rendered templates.

CONSEQUENCES: (+) Per-page HTML, meta and OG tags; tiny JS; sitemap; image optimisation. (−) Lovable round-tripping ends. Client-side routing is replaced by normal page loads, which is fine for a 6-page site.

ALTERNATIVES CONSIDERED: (B) Stay on Vite and add prerendering. Keeps Lovable, but keeps the SPA runtime and patching. (C) Next.js. Overkill for a static marketing site; needs a server or extra config.

---

## ADR-002: Standing architectural rules
DATE: 2026-11-06
STATUS: ACCEPTED: STANDING RULE
DECISION: RULE 1 function isolation · RULE 2 no workarounds · RULE 3 CI must be real · RULE 4 zero-JS by default · RULE 5 adapter pattern for external services. Full text in `CLAUDE.md`.

---

## ADR-003: Port strategy: page components as server-rendered "views" + one global contact island
DATE: 2026-11-06
STATUS: ACCEPTED

CONTEXT: The six content pages are large, fully static JSX (no state, no data fetching). Their only interactivity is ~25 "open contact form" buttons, each wrapping its own Radix Dialog.

DECISION:
- Move page bodies to `src/views/*.tsx` and render them from `.astro` pages **without** a `client:*` directive, so they become static HTML.
- Replace per-button dialogs with **one** `ContactModal.astro` mounted in `BaseLayout`, built on the native HTML `<dialog>` element plus a small bundled TypeScript module (**no React on the client**). Any element with `data-contact` opens it; optional `data-contact-title` / `data-contact-description` customise the heading.
- The mobile navigation menu is a native `<button aria-expanded>` + a small script (no React).

RATIONALE: Preserves every word of existing content (lowest-risk port). React's client runtime (~60 KB gzip) alone would exceed the 40 KB page budget, so React runs **only at build time**. Native `<dialog>` provides focus containment, Esc-to-close and top-layer rendering without a library. Validation moves from zod to pure, unit-tested functions in `src/lib/leadCapture.ts`.

CONSEQUENCES: Client JS is just the nav + contact scripts (a few KB). Converting views to `.astro` can happen incrementally (DEBT-003, P4).

---

## ADR-004: Lead capture via a server-side relay behind `LeadCaptureAdapter`
DATE: 2026-11-06
STATUS: ACCEPTED

CONTEXT: The form POSTed to a Zapier catch hook with `mode: "no-cors"`. The response is opaque, so failures were invisible and a success toast always showed. The toast also told prospects to "check Zapier task history".

DECISION:
- `src/lib/leadCapture.ts` defines `LeadCaptureAdapter` plus pure helpers (`buildLeadPayload`, `isSpam`). These are unit-tested.
- The browser posts JSON to a same-origin endpoint, `/api/contact` (Netlify Function `netlify/functions/contact.mts`). The function validates input and forwards it to Zapier server-side, returning the real status.
- The Zapier URL is read **only** from `ZAPIER_WEBHOOK_URL`; the relay returns 503 when it is unset. *(Amended 2026-11-06 after SecDev review: the original hard-coded fallback was removed because the old hook is public in history. See DEBT-013.)*
- Relay logic lives in `src/lib/contactRelay.ts` (unit-tested); the Netlify Function is a thin wrapper. It enforces JSON-only (415), refuses cross-site requests (403), checks size by bytes (413), validates shape (400) and content (422), and sanitises the Referer to a same-site path.

RATIONALE: Same-origin request → readable response → truthful success/failure UI. Lead routing (Zapier → existing Zap) is unchanged.

CONSEQUENCES: Requires Netlify hosting (declared by the existing `netlify.toml`). **Operator must confirm the production host.** If it isn't Netlify, swap the relay implementation; the adapter interface stays.

---

## ADR-005: Retire `/pantheon` and `/companyv1`; 301 to `/company`
DATE: 2026-11-06
STATUS: ACCEPTED
CONTEXT: Orphaned draft pages, not linked from navigation, duplicating /company content.
DECISION: Not ported. Netlify `_redirects` sends both permanently to `/company`.

---

## ADR-006: Dependency policy
DATE: 2026-11-06
STATUS: ACCEPTED
DECISION: Pin exact versions. Adopt releases ≥ 2 weeks old (security fixes excepted). Keep only shadcn/Radix components that are actually imported (11 of 48 were in use).
