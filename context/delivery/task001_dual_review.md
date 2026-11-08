# TASK-001: Dual-Model Review Reconciliation
*Tech Lead | 2026-11-06 | Commit under review: 23571e5*
*Review A: dev-pair-beta @ sonnet/high · Review B: dev-pair-beta @ opus/high · plus SecDev @ opus/high. All blind and executed.*

## Verdicts
| Reviewer | Overall | Confidence | Commands | Findings |
|----------|---------|------------|----------|----------|
| Beta A (Sonnet) | CHANGES REQUIRED | High | check/lint/test/build/budget/e2e all pass + 3 probes | 2 MUST · 8 SHOULD |
| Beta B (Opus) | CHANGES REQUIRED | High | same + 5 probes (pixel contrast, landscape, focus, relay) | 2 MUST · 10 SHOULD |
| SecDev (Opus) | CLEARED WITH CONDITIONS | — | history scan, audit, dist/ inspection, relay probe | 11 (P0 operator action, P2–P3) |

## Reconciliation
| # | Issue | A | B | SecDev | Outcome | Resolution |
|---|-------|---|---|--------|---------|------------|
| R1 | `window.gtag` undefined (define:vars IIFE), so `generate_lead` never fires | F2 MUST | F2 MUST | — | **AGREED · MUST** | Expose `window.gtag`; e2e asserts `typeof window.gtag === "function"` |
| R2 | Relay throws on `null` / non-string fields (500, not 4xx) | F1 MUST | F3 SHOULD | #4 | **AGREED · MUST** (higher severity) | Shape-check and coerce; 400 on bad shape; unit tests |
| R3 | Relay has zero tests | F4 | F3 | — | **AGREED · SHOULD** | Handler unit tests with mocked `fetch` |
| R4 | Stale field errors after reopening the dialog | F3 | F12 | — | **AGREED · SHOULD** | Clear errors in `open()`; e2e |
| R5 | Hard-coded Zapier fallback URL | F5 | — | #1 (deploy condition) | **AGREED · MUST** (SecDev condition) | Remove fallback; 503 when env unset; operator rotates hook |
| R6 | Trailing-slash URLs (`/company/`) may 404 on Netlify | F6 (unverified) | F10 (emulated 404) | — | **AGREED · SHOULD** | Explicit 301s for every route's trailing-slash form; unit-tested |
| R7 | /product briefing buttons: actual contrast | F8: "shipped output is fine, test is weak" | F1 MUST: measured 1.50–3.85:1 | — | **DISPUTED → evidence** | B sampled pixels behind the text. A inspected only the gradient's start colour. The gradient ends in cyan, so B's evidence holds. **Confirmed MUST.** Fix: navy translucent fill; e2e measures the real pixel contrast |
| R8 | Weak e2e assertions (`h1: /./`, contrast test) | F8 | F1 | — | **AGREED · SHOULD** | Real h1 text per route; pixel-based contrast test |
| R9 | CSP `'unsafe-inline'` undocumented; GA `img-src` too narrow | F10 | F8 | #8 | **AGREED · SHOULD** | Widen img-src now; DEBT-010 to move to hashes |
| R10 | Drag-select ending on the backdrop closes the dialog | F7 (repro) | — | — | **Single-source → evidence** | Repro steps given; reproduced by new e2e. **Confirmed.** Close only when mousedown + click both hit the backdrop |
| R11 | Mobile menu unscrollable in landscape | — | F4 (measured) | — | **Single-source → evidence** | Measurements given (433px button bottom vs 375px viewport). **Confirmed.** `max-height` + `overflow-y:auto`; e2e at 740×360 |
| R12 | Focus lost to `<body>` (menu-opened dialog; disabled submit) | — | F5 (repro) | — | **Single-source → evidence** | **Confirmed.** Fall back to the menu toggle; move focus to the status message |
| R13 | Error text 3.76:1 | — | F6 (computed) | — | **Single-source → evidence** | red-500 on white is 3.76:1 (verified arithmetic). **Confirmed.** Use red-700 (≈ 6.5:1) |
| R14 | Cyan focus outline 1.31:1 on white | — | F7 | — | **Single-source → evidence** | **Confirmed.** Two-tone focus ring (navy outline + white halo) visible on light and dark |
| R15 | Cyan text on light cards (pre-existing content) | F9 | — | — | **Single-source · pre-existing** | Out of TASK-001 scope → DEBT-011 |
| R16 | Budget ignores third-party gtag.js | — | F9 | — | **Single-source → evidence** | True. AC6 is restated as *first-party* JS; GA weight is tracked under DEBT-007. Script prints the exclusion |
| R17 | Server honeypot check unreachable from the real form | — | F11 | (#2 related) | **Single-source → evidence** | True. Server check kept for scripted posts that include it; comment corrected |
| R18 | No Content-Type/Origin check (cross-site form posts) | — | — | #3 | **Single-source (security)** | Require `application/json` (415 otherwise) and same-site `Sec-Fetch-Site` when present |
| R19 | Size limit counts chars and reads the full body | — | — | #5 | **Single-source (security)** | Check Content-Length first; measure bytes |
| R20 | Referer passed through into the CRM | — | — | #6 | **Single-source (security)** | Keep only the same-host pathname, capped length |
| R21 | Control chars / CRLF in single-line fields | — | — | #7 | **Single-source (security)** | Reject control characters in name/company/email |
| R22 | JSON-LD `</script>` escaping | — | — | #9 | **Single-source (security)** | Escape `<` as `<` |
| R23 | No rate limiting | — | — | #2 | **Single-source (security)** | Netlify `config.rateLimit` (5/min/IP); operator turns on Zapier task alerts |
| R24 | CI actions unpinned; secret scan working-tree only | — | — | #11 | **Single-source** | DEBT-012 |

## Observations (feeds agent_performance_reviews.md)
- **Agreement rate:** 6 of the 14 Beta-level issues were found by both models. Both found the analytics bug and the relay crash; **neither model alone found everything.**
- **The one true disagreement (R7) was settled by measurement, not rank.** B's pixel sampling beat A's inspection of the gradient's start colour. This is exactly the failure mode dual review exists to catch: A's own test had passed *for the wrong reason*.
- Opus (B) found more accessibility and focus issues (R11–R14). Sonnet (A) found an interaction bug B missed (R10).
- SecDev found history exposure that no code review could see (the repo is public, so the HF token is exposed).
- **Original self-check + 70 passing tests missed R1, R2, R7, R10–R14.** Executed independent review is worth its cost at T3.
