# DUAT Website: Inter-Agent Message Queue
*All agents write outbound messages here. The recipient acts and marks the message RESOLVED. Archive resolved messages monthly.*

---
MSG-001
FROM: Operator (CPIO)
TO: Tech Lead
TYPE: TASK
PRIORITY: P1-High
TIER: T3
SUBJECT: Rebuild the website on Astro
CONTEXT: MODERNIZATION_PLAN.md, Option A chosen; Lovable no longer used.
BODY: Migrate the site to Astro, preserving content and fixing the Phase 0 defects.
ACTION REQUIRED: Plan (PROC-001), ADRs, implement, run all T3 gates.
BLOCKERS: Production host unconfirmed (assume Netlify per netlify.toml).
DEADLINE: No hard deadline
STATUS: RESOLVED (pending operator actions in MSG-004)
---

---
MSG-002
FROM: Dev Pair Beta (A: sonnet, B: opus), blind dual review
TO: Tech Lead
TYPE: REVIEW
PRIORITY: P1-High
TIER: T3
SUBJECT: TASK-001 review: CHANGES REQUIRED (both reviewers)
BODY: See context/delivery/task001_dual_review.md (R1–R24). All MUST items fixed in the follow-up commit; deferred items logged as DEBT-010…014.
STATUS: RESOLVED
---

---
MSG-003
FROM: QA Manager (executed via QA Runner)
TO: Tech Lead
TYPE: SIGN-OFF
PRIORITY: P1-High
SUBJECT: Release readiness: TASK-001 after review fixes
BODY:
  VERDICT: GO (code), conditional on operator actions in MSG-004 before production deploy
  EXECUTED: check → 0 errors · lint → clean · unit → 29/29 · build → 7 pages · qa:budget → all met (2.4 KB first-party JS/page) · e2e → 71 passed, 7 device-skipped; --repeat-each=3 → 213/213
  MUTATION CHECK: reverting the R7 fix makes the AC4 contrast test fail (1.48–3.18:1) ✓
  COVERAGE GAPS: /api/contact is exercised by unit tests (handler) and e2e (stubbed); no live Netlify deploy-preview smoke yet
STATUS: RESOLVED
---

---
MSG-004
FROM: SecDev Manager
TO: Operator
TYPE: TASK
PRIORITY: P0-Critical
SUBJECT: Operator actions before public deploy
BODY:
  1. ✅ DONE 2026-11-06 (operator): Hugging Face token revoked (DEBT-001).
  2. ~~New Zapier hook~~ OBSOLETE (ADR-007): Netlify → Forms → enable form detection, then redeploy.
  3. ~~Zapier alerts / function rate limit~~ OBSOLETE (ADR-007): Netlify → Forms → Form notifications → email to the operator's notification inbox (set in the Netlify UI only).
  4. Enable GitHub secret scanning + push protection.
  5. Confirm every *.duatflow.com subdomain serves HTTPS (HSTS includeSubDomains).
  6. Smoke-test a Netlify deploy preview (DEBT-017): /pantheon → 301, /company/ → 301; before detection is enabled the form shows an error; after, a test lead appears under Forms and arrives by email.
  7. Weekly: check Forms → Spam for misclassified leads. Enable Netlify 2FA. Check the plan's form allowance and set usage alerts (DEBT-015/016).
STATUS: OPEN
---

---
MSG-005
FROM: Git Operations Agent
TO: Tech Lead
TYPE: COMMIT-REQUEST → COMMIT-CONFIRMED
PRIORITY: P1-High
TIER: T3
SUBJECT: TASK-002 committed: Netlify Forms lead capture
BODY: SHA 28780b9 on claude/ecstatic-pascal-1qcnqo, 23 files. Gates: check/lint/unit pass; secret + personal-email scan clean; artifact scan clean; pre-push build + e2e 79 passed / 7 device-skipped. Pushed.
STATUS: RESOLVED
---

---
MSG-006
FROM: Operator (CPIO)
TO: Tech Lead
TYPE: TASK
PRIORITY: P1-High
SUBJECT: Home page storytelling rewrite ("But/Therefore") + professional hero background
CONTEXT: Investor/customer credibility. The current copy reads as a list ("and… and…").
BODY: Plan: context/delivery/task003_004_home_story_plan.md
  - TASK-003a (T2): background preview page: A real SAR / B generative network / C topographic sweep
  - TASK-003b (T2): implement the chosen background
  - TASK-004a (T3): src/content/sources.ts + Home rewrite on the But/Therefore arc (10 beats), sourced proof strip
  - TASK-004b (T2 each): rewrite Why Duat, Company, Technology, Product, Team intro with the same rule
ACTION REQUIRED: Operator answers the open questions in §7 (hero option, $240B source, Content Strategist agent, patent status, SAR imagery source)
BLOCKERS: Operator decisions (§7)
DEADLINE: No hard deadline
STATUS: OPEN
---

---
MSG-007
FROM: Operator (CPIO) → Tech Lead
TYPE: DECISION
PRIORITY: P2-Medium
SUBJECT: Hero copy direction approved; background preview published (TASK-003a)
BODY:
  - Approved hero: "Companies pour billions into predicting supply and demand. Disruptions keep winning." Subhead uses the "retail alone" framing ($1.73T, IHL 2025). Proof strip: $1.73T (IHL 2025) · $210B (AlixPartners 2021) · 3.7 yrs (McKinsey GI 2020).
  - TASK-003a preview (private artifact): https://claude.ai/artifact/SsxDsjnnWFmuek2h52NNHn. Options A radar scene (rec. Home), B network cascade, C terrain + sweep (rec. inner pages).
  - Still open from MSG-006 §7: background pick, Content Strategist agent, patent status, Copernicus access, IHL $172B spend-vs-reduction.
  - Note: the preview was built by the orchestrator instead of the UI/UX Lead agent (it's an artifact, not site code). The UI/UX Lead reviews the chosen option in TASK-003b.
STATUS: OPEN (awaiting operator pick)
---

---
MSG-008
FROM: Operator (CPIO) → Tech Lead
TYPE: DECISION
PRIORITY: P1-High
SUBJECT: Background picks: A (mine + processing) for Home, C for inner pages; keep methods non-specific
BODY:
  - Home: Option A, a MOCKED satellite look (no real imagery needed) showing an OPEN-PIT MINE WITH A PROCESSING PLANT.
  - Inner pages: Option C (terrain contours + sweep). Keep the component pluggable for B or a future "D".
  - Don't be specific about methods: no "SAR", "backscatter", "Sentinel", "radar" or similar technical terms in visible labels/callouts; use neutral activity language.
  - Tech Lead tiering: TASK-003b (T2) = HeroBackground component (variants: mine, contour; pluggable) + apply to Home. TASK-003c (T3, multi-page) = apply C to Product, Technology, Company, Team, Why Duat heroes.
  - Open for TASK-004 (copy): whether public copy should keep naming satellite/SAR methods (the current Technology page does). Operator to confirm.
STATUS: IN-PROGRESS
---

---
MSG-009
FROM: UI/UX Design Lead
TO: Dev Pair Alpha (cc: Dev Pair Beta, QA Runner, Tech Lead)
TYPE: HANDOFF
PRIORITY: P1-High
TIER: T2
SUBJECT: TASK-003b design spec delivered: HeroBackground (variants mine, contour) + Home hero
CONTEXT: MSG-008 picks: A as a mocked open-pit mine + processing plant for Home, C for inner pages, method-neutral wording.
BODY: Spec: context/delivery/task003b_design_spec.md (API, files, mine composition side/stacked, tones + tone mask, scan line, callouts, contour, scrims, motion, ACs 1–24, LATITUDE, MUST PRESERVE). design_system.md now has a "Hero backgrounds" section and the tokens --signal-alert and --hero-band.
  - Integration: the Home hero is a server-rendered React tree, so pass <HeroBackground slot="heroBackground" variant="mine"/> through Home.tsx → Hero.tsx (or convert to Hero.astro: Tech Lead's call).
  - Pre-existing defect found: Button variant "hero" is white text on cyan (≈1.3:1), used by the Home hero's primary CTA. Recommend fixing in 003b (text-primary).
ACTION REQUIRED: Alpha plans against the spec → Beta approves the plan (PROC-001). Operator: answer Q1 (keep the "Illustrative" note on the mine scene; default yes).
BLOCKERS: None (Q1 has a default)
DEADLINE: No hard deadline
STATUS: OPEN
---

---
MSG-010
FROM: Tech Lead
TO: Dev Pair Alpha
TYPE: TASK
PRIORITY: P1-High
TIER: T2
SUBJECT: TASK-003b: implement HeroBackground (mine, contour) + apply to Home
BODY: Implement context/delivery/task003b_design_spec.md. Tech Lead decisions on MSG-009: (1) the "Illustrative" label ships (operator may remove later); (2) fix the `hero` button variant contrast (navy text on cyan) in this task.
STATUS: IN-PROGRESS
---
