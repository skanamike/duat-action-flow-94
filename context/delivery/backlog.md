# DUAT Website: Backlog (pinned ideas, not yet scheduled)
*Owned by: Tech Lead · Operator adds items; the Tech Lead tiers them when scheduled.*

| ID | Idea | Notes | Proposed tier |
|----|------|-------|---------------|
| BL-001 | **Spinning globe** (operator's original wish, 2026-11-07) | The original Lovable site had `SpinningEarth.tsx` (three.js / @react-three/fiber, imported but never rendered; removed in the Astro migration, recoverable from commit `fb02c29`). Rebuild it as a `HeroBackground` variant **"D" (`globe`)** with no three.js: an orthographic canvas or WebGL globe of land dots, a slow rotation, supply routes as great-circle arcs, and the occasional disruption pulse travelling along a route. Must meet the same gates as the mine/contour variants (≤ 6 KB gzip module, reduced motion = static frame, pixel-measured text contrast, method-neutral labels). Candidate uses: Company or Why Duat hero, or an "investor" section | T2 (new variant behind the existing component API) |
| BL-002 | Option B "network cascade" as a section visual | Operator: "possibly B" for inner pages. Best fit is the "Define" section of the Home story (beat 7, cascade through tiers) | T2 |
