# TASK-002: Replace Function→Zapier relay with Netlify Forms
*Tech Lead | 2026-11-06 | Tier: **T3** (forms/lead capture, PROC-005) | Supersedes ADR-004 → ADR-007*

## Why
The operator is on Zapier's free plan, and "Webhooks by Zapier" is a paid feature, so the TASK-001 relay (`/api/contact` → Zapier) cannot deliver leads. Netlify Forms is built into the declared host. It stores submissions, sends email notifications, filters spam and needs no third party, no Function and no secret URL.

## Design
- `src/components/ContactModal.astro`: the existing static `<form>` becomes a Netlify form:
  `name="contact" method="POST" data-netlify="true" netlify-honeypot="website"`, plus `<input type="hidden" name="form-name" value="contact">` and `<input type="hidden" name="origin">`.
  Netlify detects the form at deploy by parsing the built HTML. Every field it should store must exist in that HTML.
- `src/lib/leadCapture.ts`: add `encodeNetlifyForm(formName, payload)` (pure, gives `application/x-www-form-urlencoded`) and `createNetlifyFormsAdapter(endpoint = "/", formName = "contact", fetchImpl)` implementing `LeadCaptureAdapter`. Success only on `response.ok`; network error or non-2xx gives `GENERIC_SUBMIT_ERROR`. Fields sent: `form-name, name, email, company, message, origin`. The honeypot `website` is never sent by the real form (the client drops spam first). `timestamp` is not sent, because Netlify records its own.
- `src/scripts/contactModal.ts`: use the Netlify adapter. Origin is `window.location.pathname` (not the full URL). Everything else (validation, truthful status, focus handling, gtag `generate_lead`) is unchanged.
- **Remove:** `netlify/functions/contact.mts`, `src/lib/contactRelay.ts`, `tests/unit/contactRelay.test.ts`, `CONTACT_ENDPOINT` in `src/config/site.ts`, `[functions]` in `netlify.toml`, `ZAPIER_WEBHOOK_URL` in `.env.example`.
- `scripts/serve-dist.mjs`: non-GET/HEAD requests return **404** (as Netlify does when no form is detected), so an unstubbed POST can never fake success in e2e.
- **Privacy:** never write the operator's notification address into the repo. It is configured in the Netlify UI only.

## Acceptance criteria
1. Built `dist/index.html` (and every page) contains the contact form with `name="contact"`, `data-netlify="true"`, `netlify-honeypot="website"`, a hidden `form-name=contact`, and inputs named `name, email, company, message, origin, website`. Asserted by e2e on raw HTML.
2. A valid submission POSTs `application/x-www-form-urlencoded` to `/` with `form-name=contact` and the five fields. Success is shown only on 2xx, and an error on non-2xx or network failure (e2e with the POST stubbed; unit tests for the adapter and encoder).
3. The honeypot is never sent in the real flow; validation errors still block sending.
4. No references remain to `/api/contact`, `ZAPIER`, `contactRelay` or `netlify/functions` outside `context/` history docs.
5. All gates pass: check, lint, unit, build, qa:budget, e2e (desktop + mobile), and `--repeat-each=3` is stable.
6. Mutation check: making the adapter report success on non-2xx causes a test to fail.

## Operator actions (after merge/deploy)
1. Netlify → Site configuration → Forms → **enable form detection** (newer sites have it off by default), then redeploy.
2. Netlify → Forms → **Form notifications** → Email notification → operator inbox, for form `contact`.
3. Deploy preview: submit a test lead and confirm it appears under Forms and arrives by email.

## Validation (T3)
Alpha (opus/high) → blind dual Beta (sonnet/high + opus/high) → SecDev (opus/high) → QA Runner (`--repeat-each=3`) → Tech Lead → Git Ops.
