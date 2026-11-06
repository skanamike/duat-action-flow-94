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
