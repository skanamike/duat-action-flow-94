# DUAT Website: Technical & Content Debt Register
*Owned by: Tech Lead | Updated: 2026-11-06*

## Format
```
DEBT-XXX: [Short title]
AREA / DESCRIPTION / IMPACT / RESOLUTION
PRIORITY: [P1-Critical | P2-High | P3-Medium | P4-Low]
INTRODUCED: [when/why]   TRIGGER: [what forces resolution]
```

---

### DEBT-001: Hugging Face token remains in git history (PUBLIC repo): ✅ RESOLVED 2026-11-06
**STATUS:** Operator reports the token has been revoked. The value remains in history but is now inert.
**AREA:** Security · **PRIORITY:** P0-Critical (SecDev)
**DESCRIPTION:** `scripts/generate-images.js` hard-coded an `hf_…` token, introduced in 57f3d7f (2025-10-23). Removed from source in 23571e5, but it is in history, and SecDev confirmed the repo is **public**, so the token has been publicly exposed for about a year.
**RESOLUTION:** Operator revokes the token at huggingface.co → Settings → Access Tokens and checks usage/billing for unknown activity. Rewriting history does not help (clones and forks keep it); revocation is the fix. Also enable GitHub secret scanning + push protection.
**TRIGGER:** Immediately.

### DEBT-013: Old Zapier catch hook is public: ⛔ OBSOLETE by ADR-007 (2026-11-06)
**STATUS:** Lead capture no longer uses Zapier (TASK-002: Netlify Forms). Nothing in the site posts to, or depends on, any Zapier hook, so there is no relay to bypass and no `ZAPIER_WEBHOOK_URL` to set. Residual hygiene only: if the operator ever finds the old Zap, turn it off so stray posts to the public URL go nowhere.
**AREA:** Security / lead capture · **PRIORITY:** ~~P1-High~~ CLOSED. SecDev deploy condition C2 is satisfied by ADR-007
**DESCRIPTION:** The previous hook URL (`…/24194548/u6f847r/`) is in public git history, so anyone can post to Zapier directly and bypass the relay. The relay no longer has a hard-coded fallback (R5).
**RESOLUTION:** Operator creates a new Catch Hook, sets it as `ZAPIER_WEBHOOK_URL` in Netlify (Functions scope), then disables the old hook. Turn on Zapier task-usage alerts.
**TRIGGER:** Before the first Netlify deploy of this branch (the form returns 503 until the variable is set).

### DEBT-002: Unsourced statistics and claims
**UPDATE 2026-11-07:** Verified replacements are in task003_004_home_story_plan.md §3: $210B (AlixPartners 2021), 3.7 years and ≈45% (McKinsey Global Institute 2020). "$4.7T" and "$184B" are still unsourced; TASK-004a replaces them.
**AREA:** Content / credibility · **PRIORITY:** P2-High
**DESCRIPTION:** "$4.7T crisis", "$184B lost annually", "69% lack visibility", "85–95% prediction accuracy validated", "20TB daily", "first and only platform", and "patented" have no citations on the site.
**RESOLUTION:** Add sources to `src/content/sources.ts` and footnote them (PROC-006); confirm the patent is granted (vs pending) and adjust the wording.
**TRIGGER:** Before the next investor outreach.

### DEBT-003: Page bodies are React "views" rendered statically
**AREA:** Architecture · **PRIORITY:** P4-Low
**DESCRIPTION:** Per ADR-003, page content lives in `src/views/*.tsx` rendered without hydration.
**RESOLUTION:** Convert to `.astro`/MDX incrementally when a page is next substantially edited.

### DEBT-004: AI-generated images contain garbled text
**AREA:** Content / design · **PRIORITY:** P2-High
**DESCRIPTION:** `disruption-timeline.png` and `sar-intelligence.png` contain fake, illegible text.
**RESOLUTION:** Replace with real demo screenshots or hand-built SVG diagrams (UI/UX Lead spec).

### DEBT-005: No team headshots or real logo SVG
**AREA:** Content / brand · **PRIORITY:** P2-High
**RESOLUTION:** Operator supplies headshots and a logo SVG; UI/UX Lead specs placement.

### DEBT-006: Demo hosted on Render free tier
**AREA:** Product · **PRIORITY:** P3-Medium
**DESCRIPTION:** The /product demo link cold-starts (up to 60s). Two demo URLs exist (`demo.duatflow.com`, the onrender URL).
**RESOLUTION:** One canonical demo URL on an always-on host. URLs are centralised in `src/config/site.ts`.

### DEBT-007: Analytics loads without consent
**AREA:** Privacy · **PRIORITY:** P3-Medium
**RESOLUTION:** GA4 Consent Mode v2 or a cookieless analytics tool; add a /privacy page.

### DEBT-009: Moderate advisories in dev-only tooling
**AREA:** Security / dependencies · **PRIORITY:** P4-Low
**DESCRIPTION:** `npm audit` reports 11 moderate findings, all from a transitive `minimatch` (ReDoS) pulled in by dev tooling. Production dependencies: 0 vulnerabilities (CI enforces `--omit=dev --audit-level=high`).
**RESOLUTION:** Pick up on the next routine tooling bump; don't `audit fix --force` (breaking).

### DEBT-010: CSP allows `'unsafe-inline'` scripts
**AREA:** Security · **PRIORITY:** P3-Medium (dual review R9, SecDev #8)
**DESCRIPTION:** Astro inlines the menu/contact module scripts and the gtag bootstrap, so `script-src` includes `'unsafe-inline'`. That removes most of the CSP's XSS protection. The e2e suite runs pages under the real CSP and verifies there are no violations.
**RESOLUTION:** Switch to hashes (there are only 3 stable inline scripts) via Astro's `security.csp`, with a test that recomputes the hashes from dist/.
**TRIGGER:** Next change to inline scripts, or before adding any user-generated content.

### DEBT-011: Cyan text on light backgrounds (pre-existing content)
**AREA:** Accessibility · **PRIORITY:** P2-High (dual review R15)
**DESCRIPTION:** `text-secondary` (cyan) labels such as "The advantage:" in `src/views/Company.tsx` sit on near-white cards at about 1.3:1 contrast.
**RESOLUTION:** UI/UX Lead adds a dark-teal text token for light surfaces and replaces light-surface uses of `text-secondary`.
**TRIGGER:** Next content pass on /company, /technology or /why-duat.

### DEBT-012: CI hardening
**AREA:** DevOps · **PRIORITY:** P3-Medium (SecDev #11)
**DESCRIPTION:** GitHub Actions are pinned to movable tags (`@v4`). The secret scan greps only the working tree.
**RESOLUTION:** Pin actions to SHAs (and keep them updated with Dependabot). Replace the grep with gitleaks over PR commits.

### DEBT-014: Relay rate limiting depends on the Netlify plan: ⛔ OBSOLETE by ADR-007 (2026-11-06)
**STATUS:** The Netlify Function and its `config.rateLimit` were removed (TASK-002). Abuse protection is now Netlify Forms' built-in spam filtering plus the `website` honeypot (`netlify-honeypot`). There is no per-IP rate limit; submissions count against the Netlify plan's monthly form allowance instead of Zapier tasks. **The underlying risk is still open and is tracked in DEBT-015.**
**AREA:** Security / cost · **PRIORITY:** P3-Medium (SecDev #2)
**DESCRIPTION:** `config.rateLimit` (5/min/IP) is declared in the function. Whether it is enforced depends on the Netlify plan. Every forwarded lead uses one Zapier task.
**RESOLUTION:** Operator confirms the plan supports function rate limiting. Add Cloudflare Turnstile if spam appears.

### DEBT-015: Form endpoint can be posted directly: no server-side validation or rate limit
**AREA:** Security / cost · **PRIORITY:** P2-High (TASK-002 dual review A-R1/B-04, SecDev #1/#2)
**DESCRIPTION:** Anyone can POST `form-name=contact&…` straight to any page, bypassing client validation and the honeypot. The relay's server-side checks (JSON-only, cross-site refusal, byte limits, control characters, Referer sanitising) no longer exist; `origin` is client-supplied. A flood could use up the Netlify form allowance (on credit-based plans that may also pause the site), after which real leads get the (truthful) error.
**ACCEPTED RISK:** Reasonable for a low-traffic B2B contact form. All Netlify-stored values are treated as untrusted.
**RESOLUTION:** Netlify reCAPTCHA (`data-netlify-recaptcha`; the AJAX body must include `g-recaptcha-response`; CSP needs `https://www.google.com https://www.gstatic.com` in `script-src` and `frame-src`), or Turnstile (needs a Function and a secret, so a new ADR and SecDev review).
**TRIGGER:** More than about 5 spam messages a week reach the inbox, OR monthly form usage exceeds 50% of the allowance.

### DEBT-016: Lead personal data stored by Netlify without a privacy notice or retention policy
**AREA:** Privacy / compliance · **PRIORITY:** P2-High (SecDev #3; extends DEBT-007)
**DESCRIPTION:** Netlify Forms stores name, email, company and message with no defined retention period. The site has no privacy page naming Netlify as processor.
**RESOLUTION:** Add a /privacy page (contact data, Netlify as processor/DPA, retention period, analytics) and a one-line notice under the form linking to it. Operator deletes handled submissions (or after N months) and keeps Netlify team access minimal with 2FA.
**TRIGGER:** Before any paid campaign or EU/UK outreach, whichever comes first.

### DEBT-017: Netlify Forms behaviour is verified only manually
**AREA:** QA / release · **PRIORITY:** P1-High release gate (dual review A-R4, SecDev #5)
**DESCRIPTION:** Form detection, the response to a POST before detection (expected 404, so the visitor sees the truthful error), spam filtering and notifications cannot be emulated locally. e2e stubs the POST.
**RESOLUTION:** Deploy-preview smoke test before launch: (1) before detection is enabled, a submission shows the error; (2) after, a test lead appears under Forms and arrives by email. Consider a scripted post-deploy check later.
**TRIGGER:** Every production deploy that changes the form markup, and the first launch.

### DEBT-021: CI cannot run (GitHub account billing)
**AREA:** DevOps / quality gates · **PRIORITY:** P1-High
**DESCRIPTION:** GitHub Actions jobs fail to start (no runner, ~2 s) because of an account billing issue. RULE 3 ("CI must be real") is currently met only by local execution (DEVIATION-002).
**RESOLUTION:** Operator fixes billing in GitHub Settings → Billing and plans, then pushes or re-runs to confirm green CI.
**TRIGGER:** Before the next merge after PR #8. Until then every merge needs the local suite run and logged.

### DEBT-008: Product roadmap has no dates
**AREA:** Content · **PRIORITY:** P3-Medium
**DESCRIPTION:** The roadmap previously showed "Q1 2025 – CURRENT" (stale by ~18 months). Phases are now labelled Now / Next / Later rather than inventing new dates.
**RESOLUTION:** Operator confirms the current stage and target dates.

### DEBT-018: Hero background module is far above its 4 KB gzip target (needs a decision above 7 KB)
**AREA:** Performance · **PRIORITY:** P2-High (TASK-003b fix round)
**DESCRIPTION:** After the UI/UX design-review fixes (MF-1 to MF-10) the single module (glue + registry + `mine` + `contour` + lib) is **8,182 bytes gzip (8.0 KB)**: over the 6 KB hard limit and over the 7 KB pre-approved ceiling. Before the fixes it was 5.75 KB. The lit-callout state and the vehicles were cut first, as instructed (about 130 B), plus golfing (bench constants, shadow helper, drainage in the grain loop, a smaller footprint test); splitting `contour` into its own chunk saves only about 130 B (it is small), so that was tried and reverted to keep the first frame synchronous. Only Home uses the module. `contour` is covered by an e2e smoke test through the gated fixture page `src/pages/e2e-fixtures/[name].astro` (built only with `E2E_FIXTURES=1`, excluded from the sitemap).
**RESOLUTION:** Tech Lead to approve 8 KB, or choose cuts. Estimated savings: soft cone shadows (about 250 B), second noise octave (about 350 B), gable roof halves and parapets (about 200 B), the merging bench (about 100 B), the windrow (about 250 B). Bench lighting and anti-aliasing stay.
**TRIGGER:** Before the next deploy that includes TASK-003b.

### DEBT-019: Hero texture build exceeds the 30 ms target on cold start (e2e bound loosened to 100 ms)
**AREA:** Performance · **PRIORITY:** P3-Medium (TASK-003b)
**DESCRIPTION:** `performance.measure("hero-bg:build")`, first (cold JIT) build, DPR 1, five runs each in this sandbox after MF-1: **1440x900: 56-78 ms (66.6, 62.1, 61.1, 77.6, 55.6)**; **1920x1080: 84-103 ms (102.6, 85.5, 95.6, 84.0, 91.3)**. Before MF-1 it was 35-60 ms at 1440x900. Spec target 30 ms, hard limit 50 ms. Most of the cost is the ground raster (pit about 25 ms, grain loop about 18 ms, dump about 7 ms, cold JIT included); the vector layer, smoothing, grain overlay and tone mask together take under 10 ms. **The e2e test bound is 100 ms (Tech Lead accepted this deviation because of sandbox variance), and it is asserted at 1440x900 only**, so the 50 ms hard limit and the 1920x1080 figure are not enforced by any test.
**RESOLUTION:** Re-measure on real CI hardware. If still over 50 ms: build the ground in two passes (terrain first, features after the first paint), or lower the ground scale below 0.5 for very large viewports.
**TRIGGER:** First CI measurement above 100 ms, or a Lighthouse TBT regression on Home.

### DEBT-020: `scripts/generate-images.js` still describes `hero-background.png`
**AREA:** Tooling · **PRIORITY:** P4-Low (design spec follow-up)
**DESCRIPTION:** The Home hero no longer uses an image (`public/images/generated/hero-background.jpg` was deleted in TASK-003b). The generator script still lists the hero prompt. Left untouched per the spec.
**RESOLUTION:** Remove the hero entries when the generator is retired.
**TRIGGER:** Generator retirement.
