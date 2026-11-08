# DUAT Website: Multi-Agent Development System
*Master Orchestration File | Version: 1.0 | Updated: 2026-11-06*
*Delivery structure imported and adapted from github.com/DstN8/dstn8 (CLAUDE.md v2.0)*

---

## What This Project Is

The public marketing and investor website for **DUAT** (company) and **DuatFlow** (product): AI-powered supply-chain risk intelligence that uses multimodal satellite (SAR) data, big data and digital twinning to predict disruptions months ahead.

**Audiences:** (1) investors, (2) enterprise pilot customers (supply-chain and operations leaders).
**Site job:** establish credibility in seconds, explain the technology, convert to *briefing / demo / contact*.

**Stack:** Astro 7 (static) · React 19 islands · Tailwind CSS 4 · TypeScript · Netlify
**Repo:** https://github.com/skanamike/duat-action-flow-94
**Branch strategy:** main ← develop ← feature/* (and claude/* for agent sessions)

**Commands** (run from repo root):
```bash
npm run dev        # local dev server
npm run check      # astro check (types)
npm run lint       # eslint
npm test           # vitest unit tests
npm run build      # static build → dist/
npm run test:e2e   # Playwright (desktop + mobile)
npm run qa:budget  # JS/image size budgets (after build)
```

---

## Team

**CPIO / Product / Operator:** Michael

---

## Multi-Agent Team Structure

Agents live in `.claude/agents/` and are invokable as Claude Code subagents.

```
STRATUM 2: DELIVERY LAYER (imported)
├── Tech Lead           → .claude/agents/tech-lead.md
├── Dev Pair Alpha      → .claude/agents/dev-pair-alpha.md
├── Dev Pair Beta       → .claude/agents/dev-pair-beta.md
├── UI/UX Design Lead   → .claude/agents/uiux-lead.md
├── QA Manager          → .claude/agents/qa-manager.md
├── QA Runner           → .claude/agents/qa-runner.md      (new: mechanical executor)
├── SecDev Manager      → .claude/agents/secdev-manager.md
└── Git Operations      → .claude/agents/git-ops.md
```

---

## Model & Effort Routing (cost/quality optimisation)

Each agent declares a **default** `model` + `effort` in its frontmatter, sized to the role:

| Agent | Default model | Default effort | Why |
|-------|---------------|----------------|-----|
| Tech Lead | opus | high | Architecture mistakes are the most expensive to undo |
| SecDev Manager | opus | high | Security misses are high-impact; needs adversarial reasoning |
| Dev Pair Beta | sonnet | high | Review must be thorough, but most diffs are routine |
| Dev Pair Alpha | sonnet | medium | High-volume implementation; strong coding at moderate cost |
| UI/UX Lead | sonnet | medium | Spec writing and design review |
| QA Manager | sonnet | medium | Test design and verdicts; delegates execution |
| QA Runner | haiku | low | Runs commands, reports output; no judgment needed |
| Git Ops | haiku | low | Deterministic gate checklist |

### Complexity tiers (set by the Tech Lead, or by the operator for T1)

Every task is tagged with a tier. The tier decides **which agents run**, **which gates apply**, and whether to **override** the defaults per invocation (Agent tool `model` / `effort` parameters).

| Tier | Typical work | Agents & overrides | Gates |
|------|--------------|--------------------|-------|
| **T1 Trivial** | Copy/typo edit, link fix, single style tweak, ≤ 1 file / ≤ 20 lines | Alpha **haiku / low** → QA Runner → Git Ops. No Tech Lead, no plan doc | Self-Check + QA Runner |
| **T2 Standard** | New section/component, one-page change, dependency patch bump | Alpha (default) → Beta (default) → QA Runner → Git Ops. UI/UX spec if visual | Self-Check + Peer Review + QA |
| **T3 Complex** | Multi-page feature, new integration, toolchain/framework change, forms/analytics, perf work | Tech Lead plan + ADR → UI/UX → Alpha **opus / high** → Beta **opus / high** → QA Manager → SecDev → Git Ops | All production gates |
| **T4 Critical** | Security incident, production outage, data/lead loss, irreversible migration | Tech Lead **opus / max** + SecDev **opus / max**, then T3 flow. Operator approval required to start | All gates + operator sign-off + incident log |

**Escalation rules**
- A gate failure **twice** on the same task escalates one tier (T1→T2, T2→T3).
- Beta flags `CONFIDENCE: Low` → re-run Beta one tier higher before sign-off.
- Anything touching secrets, forms, analytics, CI or hosting is **at least T3** (PROC-005).
- Never down-tier a task mid-flight to save cost; finish at the tier it was opened at.

**Cost hygiene**
- Use QA Runner (haiku) for every "run the tests" request; reserve QA Manager for planning and verdicts.
- Batch parallelisable read-only reviews (Beta, UI/UX, SecDev) in one message.
- Environment overrides: `CLAUDE_CODE_SUBAGENT_MODEL` sets the model for agents without a `model` field; `CLAUDE_CODE_EFFORT_LEVEL` overrides **all** effort settings. Leave both unset so the tiers work.

The strategic layer (CPIO, Innovation Catalyst) and validation layer (User Validation, Business Value) exist in DstN8 but were **not** imported. The operator currently fills the CPIO role directly.

---

## Dual-Model Review (cross-model disagreement detection)

**When:** mandatory for T3/T4. Optional for T2 when Beta reports `CONFIDENCE: Low`. Never for T1.

1. Run `dev-pair-beta` twice **in parallel and blind**: Review A at the default (`sonnet`/high), Review B with a per-invocation `model: opus` override (T4: `opus` + `effort: max`).
2. Both use the structured finding format `ID | file:line | category | severity | claim | evidence`.
3. The Tech Lead reconciles: **AGREED** → confirmed (take the higher severity). **DISPUTED** → resolved by **evidence** (failing test, reproduction, spec citation), never by vote or model rank. **CLEAR** → not proof; the executed QA suite still decides.
4. Log to `context/delivery/<task>_dual_review.md`. Track the disagreement rate per task type; retune prompts/tiers when it stays high, and drop dual review for task types where it stays near zero.

---

## Git Operations: Single Authority

All commits, pushes, branches and PRs go through the Git Operations Agent. No other agent runs `git commit`, `git push`, `git branch` or creates PRs. Agents send a COMMIT-REQUEST via `context/comms/message_queue.md`. See `.claude/agents/git-ops.md`.

---

## Operator Accountability Protocol

The operator is part of the system, not above it.

### Session Initiation Checklist
1. **State the goal**: what are we building/fixing/investigating?
2. **Name the agent(s)**: invoke by role, not ad-hoc
3. **Confirm the branch**: if you're on `main`, stop
4. **Set scope boundaries**: what is in scope, and what explicitly is not
5. **Acknowledge the process**: "This session follows standard process." Log any deviation

### Deviation Approval
- Deviations must be explicit and logged in `context/delivery/process_incidents.md` with the real constraint. "Quick fix" is not a reason.
- Any deviation touching >3 files or >50 lines is automatically escalated to a full incident.
- Incident root causes always include the operator's role.

---

## Validation Chain

Every agent output passes at least TWO gates:

| Gate | Validator | What It Checks |
|------|-----------|----------------|
| Self-Check | Executing agent | check + lint + unit tests + build clean, ACs met |
| Peer Review | Dev Pair Beta | Logic, spec compliance, JS cost, a11y |
| QA Gate | QA Manager | Executed e2e (desktop + mobile), budgets, a11y |
| Security Gate | SecDev Manager | Secrets, dependencies, third-party scripts, headers |
| Design Gate | UI/UX Lead | Brand, layout, responsive, contrast |
| Tech Lead Gate | Tech Lead | Architecture alignment, merge approval |

**Minimum:** Self-Check + one independent gate.
**For production deploys:** Self-Check + Peer Review + QA Gate + Security Gate + Tech Lead Gate.

### Batch Sequence Template
```
BATCH-XXX: [Batch Name]
AGENTS: [Ordered list]
PARALLELIZABLE: [Which can run concurrently]
DEPENDENCIES: [A before B]
VALIDATION: [Gates per agent output]
ROLLBACK: [What to undo if a gate fails]
```

---

## Context Store

```
/context
├── /delivery
│   ├── adr_log.md               ← Architecture decision records
│   ├── technical_debt.md        ← Known debt, prioritised (incl. content/credibility debt)
│   ├── dependency_map.md        ← Libraries, versions, external integrations
│   ├── design_system.md         ← Tokens + component rules (UI/UX Lead)
│   ├── process_incidents.md     ← Deviations and incidents
│   ├── agent_performance_reviews.md
│   ├── qa_testplan_*.md         ← QA plans and results
│   └── *_plan.md / *_beta_review.md
└── /comms
    └── message_queue.md         ← Inter-agent communication
```

---

## Non-Negotiable Architectural Rules (ADR-002)

**RULE 1: FUNCTION ISOLATION.** Logic lives in pure, single-responsibility, independently testable functions in `src/lib/`.
**RULE 2: NO WORKAROUNDS.** Solve it properly, or defer with a logged ADR/DEBT entry and a resolution trigger.
**RULE 3: CI MUST BE REAL.** Gates execute code (check, lint, vitest, build, Playwright). Static LLM review never substitutes.
**RULE 4: ZERO-JS BY DEFAULT.** Pages are static `.astro`. A React island needs a stated reason and the lightest `client:*` directive.
**RULE 5: ADAPTER PATTERN IS MANDATORY.** External services (lead capture, analytics) are wrapped in a TypeScript adapter interface. Reference: `LeadCaptureAdapter` in `src/lib/leadCapture.ts`.

---

## Process Rules

**PROC-001: PLAN BEFORE CODE.** Structured plan and Beta approval before implementation.
**PROC-002: NO DIRECT EDITS ON MAIN.** All changes go on a feature branch through the agent workflow. P0 hotfixes are logged retroactively within 24h.
**PROC-003: QA MUST EXECUTE.** QA verdicts require executed commands and output.
**PROC-004: COMMIT AT CHECKPOINTS.** Commit after each task and after QA passes. Don't accumulate uncommitted work.
**PROC-005: SECDEV ON THIRD PARTIES.** Any change to forms, analytics, external scripts, CI or hosting config requires SecDev review.
**PROC-006: CLAIMS NEED SOURCES.** Every statistic or competitive claim on the site has a source in `src/content/sources.ts`, or a DEBT entry until it does.

---

## Inter-Agent Communication Protocol

All agent-to-agent communication goes via `context/comms/message_queue.md`:

```
---
MSG-XXX
FROM: [Agent Role]
TO: [Target Agent Role]
TYPE: [TASK | REVIEW | BUG | QUESTION | DECISION | HANDOFF | SIGN-OFF | COMMIT-REQUEST]
PRIORITY: [P0-Critical | P1-High | P2-Medium | P3-Low]
SUBJECT: [Clear, specific subject line]
CONTEXT: [Brief background]
BODY: [Detailed content]
ACTION REQUIRED: [What the recipient must do]
BLOCKERS: [Dependencies or 'None']
DEADLINE: [When needed or 'No hard deadline']
STATUS: [OPEN | IN-PROGRESS | RESOLVED]
---
```

---

## Orchestration Flow

```
1. Operator (CPIO) writes a BRIEF → message_queue.md → Tech Lead
2. Tech Lead decomposes into tasks and writes ADRs if needed
3. UI/UX Lead writes specs for anything visual
4. Dev Pair Alpha plans → Beta approves plan → Alpha implements
5. Beta reviews (executes checks)
6. QA Manager executes suites and signs off
7. SecDev reviews (mandatory for third-party/forms/CI/hosting)
8. Tech Lead approves → Git Ops commits/pushes/opens PR
```

---

## Quality Gates (no merge without)
- [ ] CI passing (check + lint + unit + build + e2e)
- [ ] Dev Pair Beta sign-off
- [ ] QA Manager release-readiness sign-off (executed)
- [ ] SecDev sign-off (when PROC-005 applies)
- [ ] Tech Lead approval
- [ ] All acceptance criteria met
