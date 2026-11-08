# {{PROJECT_NAME}}: Multi-Agent Development System
*Master Orchestration File | Generated from agent-team template v1.0*

## What This Project Is
{{PROJECT_DESCRIPTION}}

**Stack:** {{STACK}}
**Repo:** {{REPO_URL}}
**Branch strategy:** {{DEFAULT_BRANCH}} ← develop ← feature/*
**Operator / Product owner:** {{OPERATOR}}

**Commands**
```bash
{{CMD_CHECK}}
{{CMD_LINT}}
{{CMD_TEST}}
{{CMD_BUILD}}
{{CMD_E2E}}
```

---

## Team (`.claude/agents/`)
```
DELIVERY LAYER
├── tech-lead        opus   / high    Tiering, ADRs, decomposition, merge approval
├── secdev-manager   opus   / high    Security + CI/CD sign-off
├── dev-pair-beta    sonnet / high    Peer review (executes checks)
├── dev-pair-alpha   sonnet / medium  Implementation
├── uiux-lead        sonnet / medium  Specs + design review
├── qa-manager       sonnet / medium  Test design + release verdicts
├── qa-runner        haiku  / low     Runs the suite, reports results
└── git-ops          haiku  / low     Sole commit/push authority + gates
```

---

## Model & Effort Routing

Frontmatter sets each agent's **default**. The task's **tier** decides which agents run and whether to override per invocation (Agent tool `model` / `effort` parameters).

| Tier | Typical work | Flow & overrides | Gates |
|------|--------------|------------------|-------|
| **T1 Trivial** | Copy/typo, config value, ≤ 1 file / ≤ 20 lines | Alpha **haiku/low** → qa-runner → git-ops | Self-Check + QA Runner |
| **T2 Standard** | One component/screen/module, patch dependency bump | Alpha → Beta → qa-runner → git-ops (+ UI/UX if visual) | Self + Peer + QA |
| **T3 Complex** | Multi-module feature, integration, framework/toolchain change, auth/forms/analytics | Tech Lead plan + ADR → UI/UX → Alpha **opus/high** → Beta **opus/high** → QA Manager → SecDev → git-ops | All production gates |
| **T4 Critical** | Security incident, outage, data loss, irreversible migration | Tech Lead + SecDev **opus/max** (operator may choose `fable`), then T3 flow | All gates + operator sign-off + incident log |

**Escalation:** two gate failures on one task ⇒ tier up. Beta `CONFIDENCE: Low` ⇒ re-review one tier up. Secrets, auth, forms, analytics, CI or infrastructure ⇒ at least T3. Never down-tier mid-task.
**Cost hygiene:** qa-runner for every "run the tests"; batch independent read-only reviews in parallel; leave `CLAUDE_CODE_SUBAGENT_MODEL` and `CLAUDE_CODE_EFFORT_LEVEL` unset (they override the tiers).

---

## Dual-Model Review (cross-model disagreement detection)

**When:** mandatory for T3/T4. Optional for T2 when Beta reports `CONFIDENCE: Low`. Never for T1.

**How:**
1. Run `dev-pair-beta` **twice in parallel** on the same diff, **blind** (neither sees the other's output):
   - Review A: default (`sonnet` / high)
   - Review B: per-invocation override `model: opus` (T4: `opus` + `effort: max`, or `fable` if the operator chooses)
2. Both must use the structured finding format: `ID | file:line | category | severity | claim | evidence`.
3. The Tech Lead **reconciles** item by item:

| Outcome | Meaning | Action |
|---------|---------|--------|
| **AGREED** | Both flag the same issue | Treat as confirmed; severity = the higher of the two |
| **DISPUTED** | Only one flags it, or the severities differ by ≥ 2 levels | Resolve by **evidence**: write a failing test, reproduce it, or cite the spec/docs. Never by vote or model rank |
| **CLEAR** | Neither flags anything in an area | Not proof of correctness. The QA executed suite still decides |

4. Log the reconciliation in `context/delivery/<task>_dual_review.md`. Track the disagreement rate per task type in `agent_performance_reviews.md`: a persistently high rate means a prompt or tier needs fixing; near-zero means dual review can be dropped for that task type.

**Known limits:** models share blind spots (agreement ≠ correctness); cost roughly doubles; stylistic disagreements are noise and are filtered out by the severity floor (only MUST/SHOULD findings are reconciled).

---

## Git Operations: Single Authority
Only `git-ops` commits, pushes, branches or opens PRs. Others send COMMIT-REQUEST messages.

## Operator Accountability
Session checklist: state the goal · name the agents · confirm the branch (not `{{DEFAULT_BRANCH}}`) · set scope · acknowledge the process. Deviations are explicit and logged in `context/delivery/process_incidents.md`. Over 3 files or 50 lines ⇒ incident. Root causes include the operator's role.

## Validation Chain
Minimum: Self-Check + one independent gate. Production: Self + Peer + QA + Tech Lead (+ SecDev per PROC-005).

## Standing Rules
1. **Function isolation**: pure, single-responsibility, unit-testable
2. **No workarounds**: solve properly, or defer with a logged ADR/DEBT entry
3. **CI must be real**: gates execute code; LLM reading never substitutes
4. **Isolation of side effects**: {{RULE_4}}
5. **Adapter pattern**: every external service sits behind a typed interface

## Process Rules
PROC-001 plan before code · PROC-002 no direct edits on `{{DEFAULT_BRANCH}}` · PROC-003 QA must execute · PROC-004 commit at checkpoints · PROC-005 SecDev on secrets/auth/third-party/CI/infra

## Message Format (`context/comms/message_queue.md`)
```
---
MSG-XXX
FROM: [Agent] → TO: [Agent]
TYPE: [TASK | REVIEW | BUG | QUESTION | DECISION | HANDOFF | SIGN-OFF | COMMIT-REQUEST]
PRIORITY: [P0–P3]   TIER: [T1–T4]
SUBJECT / CONTEXT / BODY / ACTION REQUIRED / BLOCKERS / DEADLINE
STATUS: [OPEN | IN-PROGRESS | RESOLVED]
---
```
