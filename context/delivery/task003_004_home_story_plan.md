# TASK-003 & TASK-004: Home Page Story Rewrite + Hero Background
*Tech Lead | 2026-11-07 | Brief: MSG-006 (operator)*

---

## 1. The storytelling rule: "But / Therefore", never "And then"

Popularised by Trey Parker and Matt Stone: beats joined by **"and then"** are a list, and lists don't persuade. Beats joined by **"but"** (conflict) or **"therefore"** (consequence) create causality and tension, and the reader feels pulled forward.

**Rule for every page, section and paragraph:**
- Each beat must connect to the previous one with **BUT** (a complication or turn) or **THEREFORE** (what follows from it).
- If two adjacent beats would only connect with "and", either cut one or rewrite the turn.
- The literal words "but" and "therefore" don't have to appear; the *logic* must. ("Yet", "So", "That's why", "Which means" all count.)
- Every number in a beat needs a source in `src/content/sources.ts` (PROC-006). Unsourced figures don't ship.

**Self-test for writers and reviewers:** write the page as a one-line-per-beat outline and read only the connectors. If you hear "and… and… and…", it fails.

---

## 2. Home page narrative arc (TASK-004)

| # | Beat | Connector | Section / visual |
|---|------|-----------|------------------|
| 1 | Enterprises invest billions every year in planning, forecasting, risk and resilience. | (setup) | Hero eyebrow / lead-in |
| 2 | **But** disruptions keep getting more frequent and more expensive: one event cost automakers **$210B** in a single year. | BUT | Hero headline + proof strip |
| 3 | **Therefore** the question isn't *whether* the next one hits, but *who sees it first*. | THEREFORE | Hero subhead |
| 4 | **But** today's tools look at *reported* data (supplier surveys, shipping records, news), which arrives after the disruption has started, often 4+ tiers upstream where no one is looking. | BUT | "The blind spot" section (replaces "$4.7T crisis") |
| 5 | **Therefore** Duat watches the physical world directly: radar satellites see production activity at mines, smelters, ports and plants, through clouds and at night. | THEREFORE | "Detect" + SAR visual (new SVG pipeline) |
| 6 | **But** a signal alone is noise: you need to know what it means for *your* parts, plants and margins. | BUT | "Define" |
| 7 | **Therefore** Duat's digital twin traces the cascade through every tier to your products, with timing and cost. | THEREFORE | "Define" + interactive tier map |
| 8 | **But** knowing isn't enough if competitors can react just as fast. | BUT | "De-risk" |
| 9 | **Therefore** Duat recommends actions months ahead (secure supply, re-route, hedge), so disruption becomes **your head start**. | THEREFORE | "De-risk" + outcome stats |
| 10 | Close: see it first, act first. | THEREFORE (CTA) | Final CTA: Request Executive Briefing |

Pages after Home (same rule, same task family): Why Duat → Company → Technology → Product → Team intro.

---

## 3. Hero copy options (operator to choose or remix)

**Option A: closest to the operator's draft** ✅ APPROVED 2026-11-07, with the "retail alone" subhead (see MSG-007)
> *Eyebrow:* Supply-chain risk intelligence
> **Enterprises spend billions to predict supply-chain risk. Disruptions keep winning.**
> Planning tools watch reported data, but disruptions start in the physical world, tiers away and months earlier. That's why Duat watches the physical world itself, from orbit, so you see the next disruption first and turn it into your advantage.

**Option B: the question**
> **Everyone plans for the next disruption. Almost no one sees it coming.**
> Supply-chain disruptions are more frequent and more costly every year, yet the tools meant to predict them read yesterday's data. Duat reads the physical world from orbit, so you know months ahead and move first.

**Option C: the payoff**
> **Turn the next supply-chain disruption into your head start.**
> One disruption cost automakers $210 billion in a single year. The companies that saw it coming earliest lost the least. Duat shows you what's forming deep in your supply chain, months before it reaches you.

**Proof strip under the hero (all sourced):**
| Figure | Claim | Source |
|--------|-------|--------|
| **$210B** | Revenue automakers lost to a single event, the 2021 chip shortage | AlixPartners, Sept 2021 forecast |
| **Every 3.7 years** | How often industries face a supply disruption lasting a month or longer | McKinsey Global Institute, 2020 |
| **≈45%** | Of one year's profits lost to disruptions over a decade (average) | McKinsey Global Institute, 2020 |

**Update 2026-11-07: operator intent is "$100s of billions across all SC software, planning and spend to predict demand and supply".** Candidate support:
- **IHL Group (Sept 2025):** global retail still loses **$1.73T a year** to inventory distortion (out-of-stocks + overstocks) "despite $172 billion in improvements". **Supply-chain disruption is the largest single cause, at $301B a year.**
  ⚠️ To confirm against the IHL article before use: whether "$172B in improvements" means money **spent** or losses **reduced**. Its 2023 study used $172B as a *reduction*. The page wasn't reachable from the agent sandbox.
- Supply-chain management software ≈ **$38.5B** (MarketsandMarkets, 2025).
- Global logistics spend ≈ **$10–13T a year** (Statista via BusinessToday / Cargoson). This is spend on *running* supply chains, not on predicting them.

**Allowed hero phrasings, from safest to boldest:**
1. "Companies spend billions to predict supply and demand." (always safe)
2. "Retailers alone lose $1.73 trillion a year to inventory they got wrong, and disruption is the #1 cause." (IHL, verified headline figures)
3. "Companies pour hundreds of billions into predicting supply and demand." (only if the IHL $172B is confirmed as *spend*: $172B retail + $38.5B SCM software > $200B, footnoted with both sources)

**Preferred framing (operator, 2026-11-07): "that's a single vertical".** Use *"retail alone"* so the reader extrapolates across industries, rather than asserting an unsourced cross-industry total:
> "Retail alone loses **$1.73 trillion** a year to supply and demand it got wrong, and disruption is the single biggest cause. Now multiply that across automotive, aerospace, energy and electronics."
If IHL's $172B is confirmed as *spend*: "Retailers alone invested **$172 billion** in one year to fix it. The losses barely moved."
Upgrade to an explicit cross-industry "hundreds of billions" only once a single source covering all verticals is found (Gartner/IDC supply-chain tech + planning spend is the target).

**Word-choice notes on the draft:**
- "100s of BILLIONS" → use the "retail alone" framing above. An explicit total needs a cross-industry source.
- "$240 Billion" → "$210 billion" (the AlixPartners figure), unless the operator has a source for $240B.
- "Unique" → show it instead of claiming it ("from orbit", "through clouds and at night").
- "Opportunity to get and stay ahead" → "your head start" (shorter, concrete, one idea).
- Avoid "etc." in headlines; pick the 3 strongest nouns.

---

## 4. Hero background (TASK-003)

Preview page first (a private artifact; not part of the site): the same hero text over three live options at 1440px and 390px.

| Option | Description | Weight | Notes |
|--------|-------------|--------|-------|
| **A. Real SAR imagery** (recommended for Home) | Darkened Sentinel-1 radar scene of a port or mine + code-drawn cyan scan line and data callouts | ~100–200 KB | Authentic and on-message. Needs the Copernicus data host allowed (operator) or a code-mocked SAR look for the preview |
| **B. Generative supply network** | SVG/canvas nodes and routes; a "disruption pulse" ripples downstream (ties into beat 7) | a few KB JS | Must pause under reduced motion |
| **C. Topographic + radar sweep** (recommended system background) | Contour lines + slow conic sweep, CSS/SVG only | < 5 KB | Calm and premium; for other pages' heroes |

Gates: pixel-measured contrast ≥ 4.5:1 for hero text (existing helper), reduced motion respected, no layout shift, first-party JS budget ≤ 40 KB.

---

## 5. Tasks, tiers and agents

| Task | Tier | Flow | Model overrides |
|------|------|------|-----------------|
| **TASK-003a** Background preview page (artifact) | T2 | UI/UX Lead designs → orchestrator publishes the preview | UI/UX **opus/high** (visual judgment) |
| **TASK-003b** Implement the chosen background | T2 | Alpha → Beta → QA Runner → Git Ops | defaults |
| **TASK-004a** `src/content/sources.ts` + Home copy rewrite (beats 1–10, chosen hero) | **T3**: claims and investor-facing messaging (PROC-006) | Copy draft → operator approval → Alpha → dual Beta (incl. a "but/therefore" connector audit) → QA → Git Ops | Copy drafting on **opus/high** |
| **TASK-004b** Rewrite Why Duat, Company, Technology, Product, Team intro | T2 each | Same, one page per task | defaults |

**Decision for operator:** there is no copywriter agent. Options: (1) the UI/UX Lead drafts copy (default), or (2) add a **Content Strategist** agent (`opus/high`) whose prompt carries the But/Therefore rule, the sourcing rule and the brand voice. Recommended: (2), and add it to the template too.

## 6. Acceptance criteria (TASK-004a)
1. The Home outline, read as connectors only, contains no "and then" transitions (Beta audit table in the review).
2. Every number on the page resolves to an entry in `src/content/sources.ts` with a URL and date; a unit test fails on any `data-stat` without a source id.
3. Hero headline ≤ 12 words; subhead ≤ 40 words; one primary CTA.
4. Proof-strip figures render with visible source attribution (footnote or tooltip).
5. All existing gates stay green (contrast, mobile, budgets, e2e).

## 7. Open questions for the operator
1. Pick hero A / B / C (or remix).
2. Is there a source for "$240B" or "hundreds of billions"? Otherwise use $210B and "billions".
3. Add the Content Strategist agent? (recommended)
4. Patent status: granted or pending (affects Technology copy).
5. Allow the Copernicus data host for real SAR imagery, or mock the look in code?
