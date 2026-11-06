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
