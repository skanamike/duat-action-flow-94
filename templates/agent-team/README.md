# Agent Team Template (v1.0)

A reusable, **cost-tiered** Claude Code delivery team. Derived from the DstN8 multi-agent system (github.com/DstN8/dstn8) and generalised for any repo.

## What you get

| File | Purpose |
|------|---------|
| `.claude/agents/*.md` | 8 subagents with role prompts and default `model` / `effort` |
| `CLAUDE.md` | Orchestration rules, gates, T1–T4 routing table |
| `context/` | ADR log, debt register, incidents, performance reviews, message queue |
| `install.mjs` | Copies everything into a target repo and fills in placeholders |

## Improvements over the original DstN8 structure

1. **Real subagents.** Files live in `.claude/agents/` with frontmatter, so Claude Code can delegate to them by name. In DstN8 they were reference docs in `agents/`.
2. **Right-sized models per role.** Judgment-heavy roles (Tech Lead, SecDev) default to `opus/high`. Volume roles (Alpha, UI/UX, QA Manager) use `sonnet/medium`. Mechanical roles (Git Ops, QA Runner) use `haiku/low`.
3. **Complexity tiers T1–T4.** One table decides which agents run, which gates apply, and when to override model/effort per call. A typo fix no longer pays for an architecture review; a security incident always gets maximum reasoning.
4. **QA Runner split.** Running the test suite (cheap and frequent) is separated from QA judgment (expensive and occasional).
5. **Escalation rules.** Repeated gate failures or low reviewer confidence automatically tier the task up.
6. **Dual-Model Review gate (T3/T4).** Two blind Beta reviews on different models. Disagreements are resolved by evidence (tests, repro), never by vote. The disagreement rate is tracked to tune tiers.
7. **"Cost fit" review dimension.** Performance reviews now ask whether each agent's tier was right-sized, with a RETIER action.

## Model & effort defaults

| Agent | Model | Effort |
|-------|-------|--------|
| tech-lead | opus | high |
| secdev-manager | opus | high |
| dev-pair-beta | sonnet | high |
| dev-pair-alpha | sonnet | medium |
| uiux-lead | sonnet | medium |
| qa-manager | sonnet | medium |
| qa-runner | haiku | low |
| git-ops | haiku | low |

Precedence (from the Claude Code docs): per-invocation parameter > frontmatter > `CLAUDE_CODE_SUBAGENT_MODEL` (model only). `CLAUDE_CODE_EFFORT_LEVEL` overrides **all** effort settings, so leave it unset. Subagents inherit the session's extended-thinking setting; there is no per-agent thinking field.

## Install into another repo

```bash
cp templates/agent-team/agent-team.env.example my-project.env
```

Edit `my-project.env`, then preview the install:

```bash
node templates/agent-team/install.mjs ../my-other-repo my-project.env --dry-run
```

```bash
node templates/agent-team/install.mjs ../my-other-repo my-project.env
```

The installer never overwrites existing files without `--force`, and it fails if any `{{PLACEHOLDER}}` is left unfilled.

## Placeholders

`PROJECT_NAME`, `PROJECT_DESCRIPTION`, `STACK`, `OPERATOR`, `REPO_URL`, `DEFAULT_BRANCH`, `CMD_CHECK`, `CMD_LINT`, `CMD_TEST`, `CMD_BUILD`, `CMD_E2E`, `REVIEW_FOCUS`, `BRAND_PERSONALITY`, `PERF_BUDGET`, `SECURITY_FOCUS`, `RULE_4`

## Not included (yet)

DstN8's **strategic** layer (CPIO, Innovation Catalyst) and **validation** layer (User Validation, Business Value). They're tightly bound to hypothesis-driven app testing. Good candidates for template v1.1.
