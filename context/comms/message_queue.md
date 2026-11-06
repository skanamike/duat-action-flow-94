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
STATUS: IN-PROGRESS
---
