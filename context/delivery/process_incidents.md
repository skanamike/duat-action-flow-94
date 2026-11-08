# DUAT Website: Process Incidents & Deviations
*Owned by: Tech Lead + Operator*

## Format
```
PROCESS-INCIDENT-XXX | DEVIATION-XXX
Date / Severity / Status
What happened · Process violated · Root cause (including the operator's role) · Corrective action
```

---

## DEVIATION-001
**Date:** 2026-11-06 · **Status:** ACCEPTED · **Auto-escalated:** yes (>3 files, >50 lines → tracked like an incident)
**What:** For TASK-001 (Astro migration), the orchestrating session performed the Tech Lead (plan, ADRs) and Dev Pair Alpha (implementation) roles directly, instead of invoking those subagents. Git Ops gates were run by the same session.
**Constraint:** Bootstrap. The agent team was created in the same session, and the operator asked for the migration in one pass.
**Mitigation:** Independent gates still run as separate subagents: blind dual-model Dev Pair Beta review, plus SecDev review. QA verdicts come from executed commands.
**Operator role:** Requested agent setup and rebuild together; accepted the bootstrap deviation implicitly. Explicit acknowledgement requested in the session summary.

## DEVIATION-002
**Date:** 2026-11-08 · **Status:** ACCEPTED (operator) · **Scope:** merge gate for PR #8
**What:** The GitHub Actions CI jobs cannot start because of a GitHub account billing issue (jobs fail in ~2 s with no runner assigned, no logs). The operator chose to proceed without the CI gate until billing is fixed.
**Constraint:** External: account billing. Not a code failure. The workflow is left unchanged, so it resumes automatically once billing is fixed. No test was skipped or disabled.
**Substitute evidence (executed locally on PR head c1262aa):** `astro check` 0 errors · eslint clean · 68/68 unit · build OK · qa:budget met · `npm audit --omit=dev` 0 vulnerabilities · secret pattern scan clean · Playwright 134 passed (desktop + mobile). Netlify's own Redirect-rules and Header-rules checks: success.
**Operator role:** Approved proceeding with red CI. Owns fixing GitHub billing (DEBT-021).
**Follow-up:** When CI runs again, the first green run on `main` closes this deviation. Any red result is handled as a normal CI failure.
