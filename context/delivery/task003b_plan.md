# TASK-003b implementation plan: HeroBackground (mine, contour) + Home hero
*Dev Pair Alpha | 2026-11-07 | Tier T2 | Spec: task003b_design_spec.md | Tasks: MSG-009 / MSG-010*

## 1. Scope and decisions carried in
- Implement the approved spec as written. Tech Lead decisions (MSG-010): the "Illustrative" note ships; the `hero` Button variant gets `text-primary` (navy on cyan).
- Home hero copy is NOT touched (TASK-004a). Only layout, background, alignment.
- Integration route: named slot (`index.astro` -> `Home.tsx` -> `Hero.tsx`), spec's preferred route.
- No method terms anywhere in the component, its scripts, `src/lib/heroScene/*`, comments or rendered text (spec 15). Neutral words only: scan, sweep, imagery, activity.

## 2. Files
Create
- `src/lib/heroScene/types.ts`: `HERO_BG_VARIANTS`, `HeroBackgroundVariant`, `LayoutMode`, `Scene`, `SceneFactory`, `HeroCallout`, `MineAnchor`.
- `src/lib/heroScene/rng.ts`: `createRng(seed)` (mulberry32, [0,1)), `expSpeckle(rng)`.
- `src/lib/heroScene/layout.ts`: constants (`NAV_PX`, `SCAN_*`, `STILL_*`), `bandFor`, `backingStore`, `scanX`, `sweepAngle`, `toneMask`, `mineLayout`, `contourLayout`, `placeCallouts`, `leaderSegment`.
- `src/lib/heroScene/callouts.ts`: `MINE_CALLOUTS`, `MAX_CALLOUTS`.
- `src/scripts/heroScenes/mine.ts`, `contour.ts`, `index.ts` (typed registry).
- `src/scripts/heroBackground.ts`: DOM glue (`initHeroBackgrounds`).
- `src/components/HeroBackground.astro`: markup, scoped CSS, module script.
- `tests/unit/heroScene.test.ts`, `tests/e2e/heroBackground.spec.ts`.
Modify
- `src/styles/global.css`: `--signal-alert`, `--hero-band`, `@custom-variant hero-side`.
- `src/components/Hero.tsx`, `src/views/Home.tsx`, `src/pages/index.astro`: slot + layout changes (section 5).
- `src/components/ui/button.tsx`: `hero` variant `text-white` -> `text-primary`.
- `tests/e2e/contrast.ts`: add `worstContrastAgainst(el, rgb)`, keep `worstContrastAgainstWhite` as wrapper; hide descendants and `background-clip:text` fill.
- `tests/e2e/pages.spec.ts`: add a Home hero primary CTA contrast test (navy on cyan).
Delete
- `public/images/generated/hero-background.jpg` (only referenced by `Hero.tsx`; verified by grep). `scripts/generate-images.js` untouched.

## 3. Data flow
Build time: `index.astro` renders `<HeroBackground variant="mine"/>` as slot content -> `Home.tsx` prop `heroBackground` -> `Hero.tsx` renders it as first child of the `<section>`. The Astro component outputs the root div, canvas, scrim, up to 2 callouts, note; throws on unknown variant or more than 2 callouts.
Run time (one bundled module, zero React): `initHeroBackgrounds()` finds each `[data-hero-bg]`:
1. read the mode from CSS (`--hero-bg-layout`), tokens from `:root`, `bandPx = clamp(176, .30*innerHeight, 288)`;
2. `backingStore()` -> size the canvas, `scene.resize()` (builds the static texture, timed with `performance.measure("hero-bg:build")`);
3. draw `STILL_PHASE` synchronously, set `data-ready`, position callouts with the pure `placeCallouts`;
4. start the 30 fps rAF loop only if motion is allowed, the root is intersecting and the tab is visible. Phase only advances while running.
Hydration: none. No `client:*` directive anywhere (RULE 4).

## 4. Pure vs DOM split (RULE 1)
All geometry, tone masks, timings, DPR math and callout placement are pure functions in `src/lib/heroScene/layout.ts` and unit-tested in node. The scene painters (`mine.ts`, `contour.ts`) hold only canvas rasterisation; the glue holds only observers, events and the loop.

## 5. Hero.tsx layout changes (copy unchanged)
- Section: `relative isolate bg-primary min-h-[100svh] overflow-hidden flex`, stacked: `items-start pt-[calc(4.5rem+var(--hero-band))] pb-12`; `hero-side:items-center hero-side:pt-24 hero-side:pb-16`.
- Remove: background `<img>`, `bg-gradient-hero` wrapper, navy overlay, two blur blobs, 7 pulsing dots.
- Content: `text-left`, inner column `max-w-[36rem] hero-side:max-w-[min(40rem,50vw)]`; paragraph, pills and CTA row left aligned. h1 `text-[clamp(2.5rem,4.6vw,4.5rem)]`; gradient span replaced by `text-accent` (spec: optional, identical look).

## 6. Mine scene approach
- Texture at `0.5 x` CSS px (capped 1600x1000 texels) in Float32 buffers: mean tone `v`, speckle weight `k`, cap. Elements are rasterised in texel space in spec order (terrain, waste dump, pit benches, pad/stockpiles, plant, tailings, roads, conveyor, vehicles). One row-major pass then adds exponential speckle `v + k*S`, clamps to the per-texel cap (terrain 150, global 240), applies the tone mask and the faint cool cast (0.86, 0.95, 1.0).
- Seeds: terrain `0x5EED01` (speckle only, consumed row-major for every texel), features `0xD0A7` (inside `mineLayout`: vehicle positions, plant building sizes). No `Math.random`/`Date`.
- Per frame: blit texture (smoothing off), draw trailing wash + 1 px core line at `scanX(phase,w)`; scrim is CSS above the canvas.
- Terrain field is separable (row/column tables) to keep the build under the 30 ms target.
- Layout is a pure function returning ellipses, polylines (haul road, conveyor, tracks), plant parts, stockpiles, vehicles, anchors, and a `bright` list (elements with tone > 180) that the unit tests check against x >= 0.56w.

## 7. Contour scene
Preview height field unchanged. Marching squares on a 6 CSS px grid into two `Path2D`s (normal, every 5th "index" line), stroked into a static offscreen layer at backing-store resolution. Tone mask drawn as a navy gradient overlay (min 0.5). Per frame: blit, conic sweep (10 s/rev, leading edge `accent/.18` fading 32 degrees behind), 3 range rings, centre mark. Without `createConicGradient`, only rings and centre are drawn.

## 8. Edge cases
- No JS: root bg `hsl(var(--primary))` plus scrim (navy on navy at the sampled corner); canvas `opacity:0`; callouts `visibility:hidden` until `data-ready`.
- Reduced motion (and `motion="still"`): one still draw, zero rAF; `change` listener stops/resumes without a jump; no fades, no lit state.
- Offscreen / hidden tab: loop cancelled, phase frozen. Resize: `ResizeObserver` debounced 150 ms, rebuild only when CSS size changes by >= 1 px or the mode changes.
- No 2d context: leave navy base and scrim, never throw. IntersectionObserver missing: run, still stop when hidden.
- Mobile 360px: stacked mode, image band above the text, callouts `display:none`; no horizontal scroll (absolute layer, `contain:strict`).
- Keyboard: layer is `pointer-events:none`, `aria-hidden`, nothing focusable.
- Slow network: zero network requests from the component.

## 9. Deviations / flags (raised in the plan, final state after implementation)
1. Spec 6.3 haul road: "start angle 200 deg, 1.25 turns clockwise" ends at 290 deg (10 o'clock), contradicting "exits the rim at about 4-5 o'clock", and a fixed exit would cross the pit in stacked mode. The spiral keeps 1.25 clockwise turns but is derived from its exit: the angle at which the pit faces the stockpiles (about 5:30 side, 8 o'clock stacked), so the road never crosses the pit.
2. "Illustrative" note gets the same opaque navy chip as the labels (padding 3px 6px): over raw imagery a bare 60% white label would measure about 3.5:1.
3. Vehicles are filtered to x >= 0.58w in side mode so AC-2 (everything above tone 180 at x >= 0.56w) holds exactly.
4. Dropped under the latitude clause: edge vignette, drainage lines, the waste-dump track. Kept: access road, 3-tier dump, lake, beach, dam crest.
5. Callout label placement flips above/below when the preferred side violates the y bounds (e.g. 1100x700), instead of clamping onto the reticle.
6. Pit bench crests are 90-150 (spec 95-175) so the 160 haul road reads against them; the L <= 0.10 behind-text target is unaffected (the pit is right of the text column).
7. Pit lake sits off-centre (spec: optional) so the pit-centre region used by AC-10 is textured.
8. Scan core is snapped to the device pixel grid (crisp 1 px line; also makes the e2e line detector exact).
9. Speckle uses a 4096-entry lookup of the exponential distribution instead of `Math.log` per texel (cold-start build time).
10. `HeroPills.tsx` padding/gaps tighten below `sm`: the existing pill clipped "De-Risk" at 390px once left aligned in a 342px column (pre-existing at 390px, visible in the screenshots that the design gate reviews).
11. `brightItems(layout)` is a separate exported function (used only by tests) so it is tree-shaken out of the shipped module.

## 9b. Test plan
- Unit (`npm test`): AC-1..AC-8 (`createRng`, `mineLayout` side and stacked sets, `scanX`, `backingStore`, `placeCallouts` clamps and no overlap, banned-terms scan incl. a sensitivity check that the scanner flags a planted term, registry completeness, tone mask monotonic, `leaderSegment`).
- E2E (`heroBackground.spec.ts`): AC-9..AC-21 on desktop and Pixel 7 where specified; AC-16 uses `page.clock.install()` before `goto` with `scanX` offsets from the h1 box; AC-19 with a `javaScriptEnabled:false` context.
- Mutation checks (reported): remove the scrim -> contrast tests must fail; plant a banned term -> banned-terms test must fail.

## 10. Acceptance criteria and self-check gate
Self-check from repo root, in order: `npm run check`, `npm run lint`, `npm test`, `npm run build`, `npm run qa:budget`, `npx playwright test`, `npx playwright test --repeat-each=3`. Report actual hero module gzip size against the 4 KB target / 6 KB hard limit. If over target, trim latitude items first (callout lit state, tracks, vehicles, tanks), never MUST-PRESERVE items.

## 11. Debt logged
- DEBT-018 (module 5.7 KB gzip vs 4 KB target), DEBT-019 (cold texture build vs 30 ms target), DEBT-020 (`generate-images.js` still describes the hero image). Added to `technical_debt.md`.

## 12. Fix round (UI/UX MF-1..MF-10, Beta SHOULD 1-4)
- Rendering is now two layers composed into one backing-store cache: a half-resolution ground raster (smoothed, plus a seeded 128x128 grain at 1:1, alpha 0.10) and anti-aliased vector built elements (cast shadows baked in), then a multiply tone-mask gradient. Each frame is one `drawImage` plus the scan line.
- Layout: pit lobe and 0.70 flatness, 7 seeded benches with crest/face/berm lighting, ramp + switchback haul road, crescent dump, hierarchical plant (mill, medium and small roofs, thickeners), shaded stockpiles and windrow. Callouts get footprints, markers on the feature edge and a fallback order above/below/left (each also tried flush with the right margin); positions tuned within the +-20% latitude (searched numerically at 1440x900 and 1280x800, with the note kept clear at 1100/1280/1440/1920).
- Still frame has no scan line (phase 13250); stacked mode clips the line to the image band with a 40px fade.
- Tests: contrast checks at 1440x900, 1280x800, 1100x700, 1024x768 and Pixel 7; label and note contrast; `contour` smoke tests on a gated fixture page.
- Deviations: leader length is measured from the marker (on the feature's edge) to the label's nearest point; the dump may touch the pit rim (the pit is painted over it); bench edges are literal constants (seeded values written out) to save bytes.

