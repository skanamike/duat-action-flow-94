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

### DEBT-001: Hugging Face token remains in git history
**AREA:** Security · **PRIORITY:** P1-Critical
**DESCRIPTION:** `scripts/generate-images.js` hard-coded an `hf_…` token. It has been removed from source (SEC-001) but is still in history.
**RESOLUTION:** Operator revokes the token at huggingface.co → Settings → Access Tokens. Rewriting history is optional once the token is revoked.
**TRIGGER:** Immediately.

### DEBT-002: Unsourced statistics and claims
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

### DEBT-008: Product roadmap has no dates
**AREA:** Content · **PRIORITY:** P3-Medium
**DESCRIPTION:** The roadmap previously showed "Q1 2025 – CURRENT" (stale by ~18 months). Phases are now labelled Now / Next / Later rather than inventing new dates.
**RESOLUTION:** Operator confirms the current stage and target dates.
