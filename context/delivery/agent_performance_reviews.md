# DUAT Website: Agent Performance Reviews
*Owned by: Operator + Tech Lead | Cadence: per sprint, after each incident, quarterly*

| Rating | Meaning |
|--------|---------|
| ELITE | Exceeds expectations; zero rework |
| SOLID | Meets expectations |
| GAPS | Improvement plan required |
| FAILING | Rebuild the persona |

Dimensions: Output quality · Process adherence · Autonomy · Communication · Improvement · **Cost fit** (was the model/effort tier right-sized?)
Actions: RETAIN · IMPROVE · RETIER · REPLACE

---

## Review: TASK-001 (Astro migration), 2026-11-06

| Agent (model/effort) | Rating | Cost fit | Notes | Action |
|----------------------|--------|----------|-------|--------|
| Dev Pair Beta A (sonnet/high) | SOLID | Right-sized | Found both MUSTs (gtag, relay crash) and a unique interaction bug (R10). **Missed the real contrast failure (R7)**: it reasoned from the gradient's start colour instead of measuring | RETAIN. Persona note: *"measure rendered output for visual claims"* |
| Dev Pair Beta B (opus/high) | ELITE | Right-sized for T3 | Pixel-measured contrast (settled the only dispute); found 5 unique a11y/focus issues (R11–R14). Detected and reported its own build race honestly | RETAIN |
| SecDev (opus/high) | ELITE | Right-sized | Found public-history exposure no code review could, and confirmed the CSP against the real build. Clear operator actions | RETAIN |
| Orchestrator as Tech Lead/Alpha (DEVIATION-001) | GAPS | — | Self-check + 70 passing tests missed R1, R2, R7, R10–R14. The original AC4 test passed for the wrong reason | IMPROVE: mutation-test new assertions (break the code, confirm the test fails) |

### Dual-model review metrics
- Beta-level issues: 14 · found by both: 6 (43%) · A-only: 2 · B-only: 6
- True disagreements: 1 (R7), resolved by evidence in B's favour
- **Conclusion:** keep dual review mandatory at T3/T4. Re-evaluate after 3 more T3 tasks; drop it for a task type if the disagreement and unique-find rate stays below 10%.

## Review: TASK-002 (Netlify Forms), 2026-11-06

| Agent (model/effort) | Rating | Cost fit | Notes | Action |
|----------------------|--------|----------|-------|--------|
| Dev Pair Alpha (opus/high) | ELITE | Right-sized for T3 | All gates green first time, its own mutation check, honest known-issues list; self-reported and undid a staging slip | RETAIN |
| Dev Pair Beta A (sonnet/high) | SOLID | Right-sized | Good debt-honesty findings; **APPROVED a test that could not fail** (2nd time missing a mutation-class issue) | RETAIN; watch. If it recurs on a 3rd T3 task, RETIER Beta's default to opus for T3 |
| Dev Pair Beta B (opus/high) | ELITE | Right-sized | Proved S1 by replaying the test against a mutant, and gave the exact fix | RETAIN |
| SecDev (opus/high) | ELITE | Right-sized | Clear conditions; privacy angle no one else raised | RETAIN |
| Dev Pair Alpha @ haiku/low (T1 live-region fix) | SOLID | **Over-costed for size**: ~85k tokens for a 1-line change (cold-start context load) | Correct fix, tests run | Consider letting the orchestrator apply T1 edits directly, with QA Runner + Git Ops still gating (proposal for operator) |
| QA Runner (haiku/low) | GAPS | Right-sized (~21k tokens) | **Skipped `npm run build`** although it was in the list, so `qa:budget` ran on a stale dist. Tech Lead re-ran: pass | IMPROVE: prompt now requires running the commands *exactly* as listed |

### Process lessons (feed into agent prompts)
1. **Mutation-test visual and contrast assertions.** The first fixed contrast test still passed against the old buggy style because Playwright reused a stale preview server. Fixed: `reuseExistingServer: false`, plus a single-process `serve-dist.mjs` (`astro preview` leaked an orphaned child that held the port).
2. **Test against real host config.** `serve-dist.mjs` now applies `_redirects` and `_headers`, so redirects and CSP are executed, not regex-checked.
