# DESIGN SPEC: HeroBackground component (variants `mine`, `contour`) + Home hero application
*UI/UX Design Lead | 2026-11-07 | Brief: MSG-006, decisions MSG-007 / MSG-008 | Plan: task003_004_home_story_plan.md §4*

```
DESIGN SPEC: HeroBackground (pluggable canvas hero background) + Home hero
FOR TASK: TASK-003b (T2)
DELIVERED TO: Dev Pair Alpha   (cc: Dev Pair Beta, QA Runner, Tech Lead)
STARTING POINT: TASK-003a preview, scenes `sarScene` (→ renamed `mine`) and `contourScene` (→ `contour`)
```

---

## 0. Decisions honoured (operator, MSG-008)

| # | Decision | How this spec honours it |
|---|----------|--------------------------|
| 1 | Home = option A, a **mocked** orbital-imagery look of an **open-pit mine with a processing plant** | §6: code-generated grayscale speckled scene: terraced pit, spiral haul road, waste dump, ore stockpiles, conveyor, plant buildings + tanks, tailings pond, terrain. No image files. |
| 2 | **No method-specific terms** visible; neutral activity language; decorative layers `aria-hidden` | §8 callout copy; §15 banned-terms list enforced by a unit test; the whole component root is `aria-hidden="true"`; no text is ever drawn on the canvas. |
| 3 | Inner pages = option C; component **pluggable** (`variant` prop) so B or "D" can be added without touching pages | §2 API + §2.3 "adding a variant" (type-checked registry). Contour is implemented and unit-tested here; applied to inner pages in TASK-003c. |

The preview's mock label ("Mock · real Sentinel-1 scene in production"), the identifier `sarScene`, and the comment wording "SAR/backscatter/radar" **do not carry over** into site code.

---

## 1. Files

| Path | Kind | Responsibility |
|------|------|----------------|
| `src/components/HeroBackground.astro` | Astro component (no React) | Markup, scoped CSS (layers, scrims, callouts), includes the module script once |
| `src/scripts/heroBackground.ts` | Client module (bundled by Astro) | DOM glue only: find roots, size canvases, run loop, reduced-motion / visibility / intersection / resize handling, callout placement and "lit" state |
| `src/scripts/heroScenes/index.ts` | Client module | Registry `Record<HeroBackgroundVariant, SceneFactory>` |
| `src/scripts/heroScenes/mine.ts` | Client module | Canvas painter for the mine scene (uses `src/lib/heroScene/*`) |
| `src/scripts/heroScenes/contour.ts` | Client module | Canvas painter for the contour scene |
| `src/lib/heroScene/types.ts` | Pure TS (ADR-002 R1) | `HERO_BG_VARIANTS`, `HeroBackgroundVariant`, `LayoutMode`, `Scene`, `SceneFactory`, `HeroCallout`, `MineAnchor` |
| `src/lib/heroScene/rng.ts` | Pure TS | Seeded PRNG (`createRng(seed)`), exponential speckle helper |
| `src/lib/heroScene/layout.ts` | Pure TS | `mineLayout(w,h,mode,band)`, `contourLayout(...)`, `toneMask(...)`, `scanX(phaseMs,w)`, `sweepAngle(phaseMs)`, `backingStore(cssW,cssH,dpr)`, `placeCallout(...)` |
| `src/lib/heroScene/callouts.ts` | Pure TS | `MINE_CALLOUTS` (default copy, §8) |
| `tests/unit/heroScene.test.ts` | node --test | Pure-function tests + banned-terms scan (§16) |
| `tests/e2e/heroBackground.spec.ts` | Playwright | Runtime ACs (§16) |
| `tests/e2e/contrast.ts` | Test helper (extend) | Add `worstContrastAgainst(element, rgb)`; keep `worstContrastAgainstWhite` as a wrapper. Must hide **all descendants** and any `background-clip:text` fill before the screenshot (the current h1 uses gradient-clipped text, which the existing helper would capture as "background"). |
| `src/styles/global.css` | Tokens | Add `--signal-alert`, `--hero-band`, `@custom-variant hero-side` (§5, §13) |
| `src/components/Hero.tsx`, `src/views/Home.tsx`, `src/pages/index.astro` | Integration | §3 |
| `public/images/generated/hero-background.jpg` | Delete | Only referenced by `Hero.tsx` (verified by grep). Leave `scripts/generate-images.js` untouched. |

Placing pure logic in `src/lib/` (unit-testable in node, no DOM) and canvas/DOM code in `src/scripts/` follows ADR-002 Rule 1 and the existing `src/scripts/*.ts` pattern (`mobileMenu.ts`, `contactModal.ts`).

---

## 2. Component API

```astro
---
// src/components/HeroBackground.astro
import { HERO_BG_VARIANTS, type HeroBackgroundVariant, type HeroCallout } from "@/lib/heroScene/types";
import { MINE_CALLOUTS } from "@/lib/heroScene/callouts";

interface Props {
  /** Which scene to draw. Required. */
  variant: HeroBackgroundVariant;                 // "mine" | "contour"
  /** Mine only. Default MINE_CALLOUTS. `false` renders none. Max 2 (build error above 2). Ignored by other variants. */
  callouts?: readonly HeroCallout[] | false;
  /** "auto" animates when allowed; "still" always renders the static frame. Default "auto". */
  motion?: "auto" | "still";
  /** Extra classes on the root (e.g. a page-specific scrim tweak). */
  class?: string;
}
---
```

```ts
// src/lib/heroScene/types.ts
export const HERO_BG_VARIANTS = ["mine", "contour"] as const;
export type HeroBackgroundVariant = (typeof HERO_BG_VARIANTS)[number];
export type LayoutMode = "side" | "stacked";
export type MineAnchor = "plant" | "stockpile" | "pit" | "tailings";
export interface HeroCallout { anchor: MineAnchor; label: string; tone: "signal" | "alert" }

export interface Scene {
  /** Rebuild static layers for a new CSS size / mode. Pure function of its arguments (deterministic). */
  resize(cssW: number, cssH: number, dpr: number, mode: LayoutMode, bandPx: number): void;
  /** Draw one frame at an animation phase (ms). phase = STILL_PHASE renders the reduced-motion frame. */
  draw(phaseMs: number): void;
  /** Anchor positions in CSS px for callouts (mine only). */
  anchors?(): Partial<Record<MineAnchor, { x: number; y: number }>>;
  readonly STILL_PHASE: number;
}
export type SceneFactory = (ctx: CanvasRenderingContext2D, tokens: { primary: string; accent: string }) => Scene;
```

### 2.1 Rendered markup (shape, not literal)

```html
<div class="hero-bg" data-hero-bg="mine" data-motion="auto" aria-hidden="true">
  <canvas class="hero-bg__canvas"></canvas>
  <div class="hero-bg__scrim"></div>
  <!-- mine only, when callouts !== false -->
  <div class="hero-bg__callout" data-anchor="stockpile" data-tone="signal">
    <span class="hero-bg__reticle"></span><span class="hero-bg__leader"></span>
    <span class="hero-bg__label">TIER-4 SUPPLIER · STOCKPILE ↑ 2.1×</span>
  </div>
  <div class="hero-bg__callout" data-anchor="plant" data-tone="alert">…PROCESSING · ACTIVITY ↓ 38%…</div>
  <span class="hero-bg__note">Illustrative</span>
</div>
```

- Root: `position:absolute; inset:0; z-index:0; overflow:hidden; pointer-events:none; contain:strict; background: hsl(var(--primary));`
- No `id`s (the component may appear once per page, but must not assume it).
- Unknown `variant` → throw at build time (`HERO_BG_VARIANTS.includes`).

### 2.2 Script inclusion

A single processed `<script>` in the component: `import { initHeroBackgrounds } from "@/scripts/heroBackground"; initHeroBackgrounds();`. Astro bundles and dedupes it. It finds every `[data-hero-bg]` root on the page. Not `is:inline`, no external URLs.

### 2.3 Adding a variant (B "network", future "D") without touching pages

1. Add the name to `HERO_BG_VARIANTS`.
2. Add `src/scripts/heroScenes/<name>.ts` implementing `SceneFactory`.
3. Register it in `heroScenes/index.ts`. The registry is typed `Record<HeroBackgroundVariant, SceneFactory>`, so `npm run check` fails until steps 1–3 agree.
4. Optional: a `[data-hero-bg="<name>"]` scrim override in the component CSS.
Pages change only if they opt into the new variant.

Bundle rule: the registry imports scenes statically while the combined module is ≤ 4 KB gzip. When a new variant pushes it past that, switch to per-variant `import()` **and** extend `scripts/qa-budget.mjs` to count dynamically imported chunks (log a DEBT entry in the same PR). Don't let code-splitting hide bytes from the budget.

---

## 3. Integration on Home

The Home page renders a React tree on the server (`index.astro` → `Home.tsx` → `Hero.tsx`, no `client:*` directive). An Astro component cannot be imported inside a React component, so:

**Preferred:** pass it through a named slot.
```astro
<!-- src/pages/index.astro -->
<Home>
  <HeroBackground slot="heroBackground" variant="mine" />
</Home>
```
`Home.tsx` receives it as the prop `heroBackground?: ReactNode` and forwards it to `<Hero background={heroBackground} />`. `Hero.tsx` renders `{background}` as the **first child** of the `<section>`. Astro wraps slot HTML in an `<astro-static-slot>` element; the root's `position:absolute` resolves against the hero `<section>`, which is fine (AC-3 checks the box).

**Acceptable alternative (Tech Lead's call):** convert the hero to `src/components/Hero.astro` (it has no client state; `ContactTrigger` only adds `data-contact*` attributes) and render it from `index.astro` ahead of `<Home />`. Choose one; don't do both.

### 3.1 Hero section changes in `Hero.tsx` (layout only, copy unchanged; TASK-004a rewrites copy)

| Item | Now | Change to |
|------|-----|-----------|
| Section | `relative min-h-[100svh] pt-24 md:pt-28 flex items-center justify-center overflow-hidden` | Add `isolate bg-primary`. Keep `min-h-[100svh] overflow-hidden`. Stacked mode: `items-start` with `pt-[calc(4.5rem+var(--hero-band))] pb-12`. `hero-side:` mode: `items-center pt-24 pb-16` |
| Background `<img>` + `bg-gradient-hero` wrapper + navy overlay | present | **Remove** (replaced by HeroBackground). `bg-gradient-hero` ends in bright cyan, which is unsafe as a no-JS fallback. |
| Two blurred blobs, 7 pulsing "moonlight" dots | present | **Remove** (they compete with the scene, and `animate-pulse` ignores the scan's calm rhythm) |
| Content wrapper | `relative z-10 container mx-auto px-6 text-center` + `max-w-4xl mx-auto` | `relative z-10 container mx-auto px-6 text-left`; inner column `max-w-[min(40rem,50vw)]` in `hero-side:`, full width (max `36rem`) when stacked. **Left-aligned in both modes.** CTA row `justify-start`; pills `justify-start`. |
| h1 size | `text-5xl md:text-7xl` | `text-[clamp(2.5rem,4.6vw,4.5rem)]` (keeps a 2-line h1 inside the narrower column). The gradient-clipped span is cyan to cyan, so plain `text-accent` is visually identical and simpler (recommended, not required). |

The text column must stay within **x ≤ 0.56·w** in side mode at every width ≥ 721px. Checked: 1100 → 0.556, 1280 → 0.52, 1440 → 0.52, 1920 → 0.53.

---

## 4. Layer stack (back to front)

| z | Layer | Notes |
|---|-------|-------|
| 0 | Root background `hsl(var(--primary))` | The no-JS and pre-init state. Never white, never the cyan hero gradient. |
| 0 | `<canvas>` | Scene + scan line / sweep. `opacity:0` until the first draw, then `opacity:1` (300ms ease-out; instant under reduced motion). |
| 0 | `.hero-bg__scrim` | CSS gradients (§10). Sits **above** the canvas so the scan line is attenuated behind text. |
| 0 | Callouts + "Illustrative" note | Above the scrim. Hidden until positioned (`.hero-bg:not([data-ready]) .hero-bg__callout { visibility:hidden }`). |
| 10 | Hero content (`Hero.tsx`) | `relative z-10` |
| 50 | Fixed nav | Unchanged |

---

## 5. Layout modes (single definition)

Two compositions, chosen by **aspect ratio as well as width**, so that phone-landscape and short laptops get the side composition and tablet-portrait gets the stacked one.

| Mode | Media query | Composition |
|------|-------------|-------------|
| `side` | `(min-width: 45.0625rem) and (min-aspect-ratio: 6/5)` | Text column left; scene weighted right |
| `stacked` | everything else | Image band on top (below the nav); text below over the darkest, scrimmed area |

- Declared **once in CSS** in two places that must stay in sync (each carries a comment pointing to the other): `@custom-variant hero-side (@media (min-width: 45.0625rem) and (min-aspect-ratio: 6/5));` in `global.css`, and the same query in `HeroBackground.astro`'s `<style>`, where it sets `--hero-bg-layout: side` (default `stacked`) on the root.
- **JS reads the mode from CSS** (`getComputedStyle(root).getPropertyValue("--hero-bg-layout").trim()`); it never re-declares the breakpoint.
- `--hero-band: clamp(11rem, 30svh, 18rem)` (global token): the height of the stacked image band below the nav. JS mirrors it as `bandPx = clamp(176, 0.30 × innerHeight, 288)`. The svh/innerHeight gap (≤ ~20px) is absorbed by the composition's slack.
- Nav overlay height constant `N = 72` CSS px (the fixed header). Scene content may tuck under it; it must not *depend* on being visible there.
- Callouts show only in `side` mode **and** `min-width: 68.75rem` (1100px).

---

## 6. Mine scene

### 6.1 Look

A cloud-free orbital image, **grayscale with a faint cool cast** (RGB = v·0.86, v·0.95, v; from the preview), multiplicative speckle grain (exponential, mean 1) for the "imagery" texture, and sharp, man-made geometry: concentric benches, straight conveyor, rectangular roofs, round tanks. It should read as **a real site seen from orbit**, not as an illustration: no outlines, no glow on the scene itself, no colour except the cyan instrument overlay and the callouts.

### 6.2 Rendering pipeline

1. **Static texture** (rebuilt only on resize or mode change): an offscreen canvas at **0.5 × CSS px** (cap 1600 × 1000 texels; scale further down above that). Every scene element is rasterised into it: terrain first, then features, then the tone mask (§6.6). It is drawn to the visible canvas with `imageSmoothingEnabled = false`, so one texel = 2×2 CSS px of grain, consistent across all elements.
2. **Overlay per frame** at full backing-store resolution: blit the texture, then the scan line (§7). Nothing else animates on the canvas.
3. Determinism: two fixed seeds (terrain `0x5EED01`, features `0xD0A7`), consumed in a fixed order (row-major for speckle). No `Math.random`, no `Date`. Output is a pure function of `(cssW, cssH, dpr, mode, bandPx, phase)`.
4. Colours for the overlay come from tokens read once at init (`--primary`, `--accent`, `--signal-alert` via `getComputedStyle`) and are used as `hsl(<channels> / <alpha>)`. Grayscale imagery values below are scene constants (documented in `mine.ts`).

### 6.3 Composition: side mode (desktop / landscape)

All positions are derived from `w`, `h` and the pit radius `R`. Worked numbers are for **1440 × 900**.

| Element | Position (centre) | Size | 1440 × 900 |
|---------|-------------------|------|------------|
| Pit radius `R` | | `R = clamp(150, min(0.19w, 0.36h), 380)` | 274 |
| **Pit** `P` | `(0.70w, 0.44h)` | Ellipse `rx = R`, `ry = 0.80R`, rotated −14° | centre (1008, 396); spans x 734–1282 |
| Waste dump | `P + (0.95R, −0.80R)` | Ellipse 0.45R × 0.30R, 3 flat terraces | (1268, 177) |
| ROM pad + **stockpiles** `S` | `P + (0.45R, 1.10R)` | 4 cones, radius 0.06–0.09R, in a row along the conveyor | (1131, 697) |
| **Processing plant** `Q` | `P + (1.15R, 0.80R)` | Footprint 0.70R × 0.55R, grid rotated −14° | (1323, 615); may crop at the right edge |
| Conveyor | `S → Q` | 1 texel wide, 2 transfer-point squares (2×2 texels) | |
| **Tailings pond** `T` | `P + (−0.40R, 1.45R)` | Smooth blob 1.0R × 0.50R | (898, 793); dark, so it may sit near the text column and under the future proof strip |
| **Haul road** | Spiral from the pit floor (angle 200°), 1.25 turns clockwise, radius 0.25R → 1.0R; exits the rim at about 4–5 o'clock, then runs straight to `S` | 2 texels wide | |
| Access road | `Q` → right frame edge at ≈ 0.60h; a faint track from the waste dump to the top edge | 1–2 texels | |

**Relationship to the hero text (side):** everything bright (> 180) sits at **x ≥ 0.56w**; the pit's outer bench rim (≤ 175) may reach 0.51w, where the tone mask (§6.6) and scrim (§10) bring it down. The pit centre sits slightly above the text block's vertical centre, so the eye goes headline → pit → callouts.

### 6.4 Composition: stacked mode (phones, tablet portrait)

Band `B = bandPx`, starting below the nav at `N = 72`. Worked numbers for **Pixel 7, 412 × 915** (B ≈ 258).

| Element | Position (centre) | Size | 412 × 915 |
|---------|-------------------|------|-----------|
| `R` | | `R = min(0.30w, 0.56B)` | 124 |
| **Pit** `P` | `(0.64w, N + 0.50B)` | Same ellipse/rotation as side | (264, 201); y 102–300 |
| **Processing plant** `Q` | `(0.17w, N + 0.62B)` | 0.90R × 0.70R | (70, 232); x 14–126 |
| **Stockpiles** `S` | `(0.36w, N + 0.86B)` | 3 cones | (148, 294) |
| Conveyor | `S → Q` | | |
| Waste dump | `(0.95w, N + 0.12B)` | Cropped top-right | |
| **Tailings pond** `T` | `(0.40w, N + B + 0.35R)` | 1.0R × 0.5R | Below the band, under the text; dark |
| Haul road | As side; exits toward `S` | | |

The text starts at `N + B` (the content's `pt-[calc(4.5rem+var(--hero-band))]`), so on a phone the pit and plant are **fully visible above the headline**, and the copy sits over the darkest, most scrimmed area.

### 6.5 Element tones (0–255 grey, before the tone mask)

| Element | Value | Texture |
|---------|-------|---------|
| Terrain | `38 + 26·S + 10·field(x,y)`, clamp 0–150 (mean ≈ 64) | Speckle `S`; low-frequency field/ridge pattern + 2 drainage lines (value 30) |
| Bench crests, lit side (NW-facing) | 150–175 | Light speckle |
| Bench crests, shadow side | 95–115 | Light speckle |
| Bench faces | 45–70 | Speckle |
| Pit floor | 22–32; optional pit lake 0.12R at 8–14 | Lake is smooth (no speckle) |
| Haul road | 150 ± 10 | Low speckle (weight 6) |
| Waste dump top / terrace edges | 85–100 / 120 | Speckle |
| Stockpiles | lit half 185, shadow half 40 | None |
| Conveyor | 205 | None |
| Plant roofs | 205–230, with a 1-texel shadow offset down-right at 14 | None |
| Tanks (3–4, radius 0.035–0.06R) | rim 225, interior 80 | None |
| Tailings water / dam crest / beach | 10–16 / 165 (1–2 sides, 1 texel) / 70–95 gradient at the discharge point | Water smooth |
| Vehicles on the haul road (6–8) | 240, 1 texel | None |
| **Global max** | **240** | |

### 6.6 Tone mask (built into the texture: readability by design, not just by scrim)

Multiply every texel by `m(x, y)` (smoothstep ramps):
- **side:** `m = 0.35` for `x ≤ 0.40w` → `1.0` at `x ≥ 0.60w`.
- **stacked:** `m = 1.0` for `y ≤ N + B` → `0.45` at `y ≥ N + B + 200`.
- Optional soft edge vignette (≤ 15% darkening at the frame edges).

Worked worst case (side, 1440 wide, pixel at the text column's right edge x = 0.55w, a raw bench crest of 175): m ≈ 0.79 → 138; under a 0.685 scrim → RGB ≈ (40, 59, 79), L ≈ 0.042 → **white 11.5:1, cyan 8.7:1**. Design target: the lightest pixel behind any hero text has **L ≤ 0.10** (white ≥ 7:1, cyan ≥ 5.3:1). Gate: ≥ 4.5:1.

---

## 7. Scan line (mine)

A slow **acquisition pass**: a vertical cyan line moving left to right with a trailing wash.

| Property | Value |
|----------|-------|
| Direction | Left → right, full height |
| Cycle | **14 s**: a 10 s linear sweep from x = −0.08w to x = 1.08w, then 4 s off-screen rest |
| Position | `scanX(φ, w) = −0.08w + 1.16w · (φ mod 14000) / 10000` while `(φ mod 14000) < 10000`, else `null` (pure, exported, unit-tested) |
| Core | 1 CSS px wide, `hsl(var(--accent) / 0.75)` |
| Trailing wash | 96 CSS px to the left of the core, linear gradient `accent / 0.16 → 0` |
| Leading edge | None |
| Layer | Canvas, **below the scrim**: behind the text it is attenuated to ≈ L 0.06 (white ≥ 9:1) |
| Easing | Linear (it reads as an instrument, not a UI transition) |
| Frame rate | Capped at 30 fps (≈ 4 px steps at 1440, imperceptible at this speed) |
| Still frame | `STILL_PHASE = 8000` → line at x ≈ 0.85w (past the plant, clear of the text) |

---

## 8. Callouts (mine only)

Two at most, never more. Copy is neutral activity language and tells one causal story: processing slowed, so ore piles up upstream.

| ID | Anchor | Label (exact) | Tone | Label placement relative to the anchor |
|----|--------|---------------|------|----------------------------------------|
| C1 | `stockpile` (`S`) | `TIER-4 SUPPLIER · STOCKPILE ↑ 2.1×` | `signal` (cyan) | Below-left: label's right edge at `anchor.x`, top 28px below the anchor |
| C2 | `plant` (`Q`) | `PROCESSING · ACTIVITY ↓ 38%` | `alert` (coral) | Above-left: label's right edge at `anchor.x`, bottom 32px above the anchor |

**Anatomy**
- **Reticle:** 12×12 CSS px corner brackets (four 4px L-shapes, 1px), centred on the anchor; colour = tone at α 0.9.
- **Leader:** 1px line from the reticle to the nearest label corner, tone at α 0.6.
- **Label:** `font-mono` (system stack; no web font), 11px / 1.35, `letter-spacing: .06em`, uppercase, `white-space: nowrap`, padding 6px 8px, radius 2px, background `hsl(var(--primary) / 0.92)` (not the preview's 0.72: at ≤ 0.80 a label over a 230 roof drops coral text to ≈ 3.8:1), border 1px tone at α 0.45, text = tone at 100%. Worst case (label over the brightest texel, 240): cyan ≈ 11:1, coral ≈ 5.2:1. Both must stay ≥ 4.5:1.
- **Position:** set by JS from `scene.anchors()` via the pure `placeCallout()`, clamped to x ∈ [0.58w, w − 16] and y ∈ [N + 24, h − 160] (the bottom 160px stays clear for the TASK-004a proof strip). Labels must not overlap each other.
- **First paint:** hidden (`visibility:hidden`) until positioned, then the root gets `data-ready` and labels fade in (300ms ease-out). Appearing elements are not layout shifts, but moving visible ones are, so callouts never render at a default position.
- **"Lit" on scan pass (motion on only):** when `scanX` crosses `anchor.x`, set `data-lit` for 1.5 s: border α 0.45 → 0.9 and reticle scale 1 → 1.15 (both 300ms ease-out in, 300ms ease-out out). Under reduced motion there is no lit state; callouts show at rest styling.
- **Visibility:** `display:none` unless side mode **and** ≥ 1100px. Always `aria-hidden` (inherited from the root) and `pointer-events:none`.

### 8.1 "Illustrative" note

`Illustrative` in the corner of the scene: `font-mono` 10px uppercase, `letter-spacing: .08em`, `hsl(0 0% 100% / 0.6)` (≈ 6.9:1 on navy). Side mode: bottom-right, inset 16px **above the proof-strip zone** (bottom 160px). Stacked mode: top-right at `N + 8`.
Why: the callout numbers are mock data on a mock scene. Without a label, an investor can fairly read them as a real customer detection (PROC-006 spirit, brand value "precise"). See open question Q1.

---

## 9. Contour variant (option C, for inner pages in TASK-003c)

| Property | Value |
|----------|-------|
| Height field | Preview's `height(x,y)` (three summed sinusoids), unchanged so it matches what the operator approved |
| Isolines | Step 0.22. **Preferred:** marching squares on a 6 CSS px grid, stroked at full DPR with 1px lines (crisp hairlines, cheap). Per-pixel thresholding (the preview's method) is acceptable only if lines render ≤ 1.5 CSS px and the build is ≤ 50 ms |
| Line colour | `accent / 0.32`; every 5th (index) contour `accent / 0.50` |
| Base | `hsl(var(--primary))` |
| Tone mask | As §6.6, with the minimum raised to 0.5 (contours are already dim) |
| Sweep centre | side `(0.78w, 0.45h)`; stacked `(0.70w, N + 0.5B)` |
| Sweep | Conic gradient, clockwise, **10 s per revolution**, constant speed; leading edge `accent / 0.18`, fading to 0 over 32° behind it |
| Range rings | 3 rings at 0.10, 0.20, 0.30 × `min(w, h)` (side) or × `w` (stacked); `accent / 0.14`, 1px |
| Centre mark | Dot r = 2.5px `accent / 0.9` + 8px halo `accent / 0.2` |
| Still frame | Leading edge at 35° clockwise from 3 o'clock (pointing down-right, away from the text) |
| No `createConicGradient` | Draw rings and centre only (static); no error |
| Callouts | None |

---

## 10. Scrims (`.hero-bg__scrim`, CSS only, token-based)

`P = var(--primary)`. Gradients run from the text side to the image side.

| Variant / mode | Background |
|----------------|------------|
| **mine, side** | `linear-gradient(90deg, hsl(P/.94) 0%, hsl(P/.88) 40%, hsl(P/.62) 60%, hsl(P/.12) 85%, hsl(P/.06) 100%), linear-gradient(0deg, hsl(P/.70) 0%, transparent 22%)` (the second layer grounds the CTA row and the future proof strip) |
| **mine, stacked (≤ 720px or portrait)** | `linear-gradient(180deg, hsl(P/.20) 0, hsl(P/.10) calc(4.5rem + var(--hero-band) * .55), hsl(P/.88) calc(4.5rem + var(--hero-band) + .5rem), hsl(P/.96) 100%)` |
| **contour, side** | `linear-gradient(90deg, hsl(P/.90) 0%, hsl(P/.78) 42%, hsl(P/.30) 70%, hsl(P/.10) 100%)` |
| **contour, stacked** | `linear-gradient(180deg, hsl(P/.30) 0, hsl(P/.15) calc(4.5rem + var(--hero-band) * .5), hsl(P/.85) calc(4.5rem + var(--hero-band) + .5rem), hsl(P/.94) 100%)` |

In stacked mode the image band stays nearly clear (α 0.10–0.20), and the scrim reaches ≥ 0.86 by the time the headline starts.

---

## 11. Motion and runtime behaviour

| Concern | Rule |
|---------|------|
| Init | On script execution: for each root, read the mode and tokens, `resize()`, then **draw `STILL_PHASE` synchronously** (the complete static frame), set `data-ready`, position the callouts. Only then start the loop (if allowed). |
| Phase | `phase = STILL_PHASE + accumulated running time`. Motion continues seamlessly from the still frame (no jump), and the phase **does not advance while paused**. |
| Reduced motion | `matchMedia("(prefers-reduced-motion: reduce)")`: if it matches (or `motion="still"`), draw `STILL_PHASE` once and schedule **no** `requestAnimationFrame`. Listen for `change`: reduce → stop and redraw the still frame; no-preference → resume. No canvas fade, no callout fade, no lit state. |
| Offscreen | `IntersectionObserver` (threshold 0): not intersecting → cancel the rAF loop. No observer support → run (but still stop on hidden). |
| Tab hidden | `visibilitychange` → stop while `document.hidden`. |
| Frame cap | 30 fps (skip frames < 33 ms apart). |
| Resize | `ResizeObserver` on the root, debounced 150 ms; rebuild the texture only when the CSS size changes by ≥ 1 px or the mode changes; then redraw the current phase and reposition the callouts. |
| DPR | `backingStore(cssW, cssH, dpr)`: `dpr' = min(devicePixelRatio, 2)`, then reduced further (not below 1) so `cssW·cssH·dpr'² ≤ 4.2 MP`. |
| UI transitions | ≤ 300 ms, ease-out (canvas fade-in, callout fade/lit). Ambient loops (scan 14 s, sweep 10 s) are exempt from the 300 ms rule but are slow, linear and fully disabled under reduced motion. |
| Errors | No `getContext("2d")` → leave the navy base and scrim (still a valid hero); never throw to the console. |

---

## 12. Static first frame and no-JS

- **Before JS / no JS:** navy base + scrim render from CSS; the hero text is fully readable; callouts and note stay hidden (they need positioning). No white flash and no cyan gradient corner.
- **First JS frame = the reduced-motion frame** (`STILL_PHASE`). It is complete: every scene element present, scan line at ≈ 0.85w (mine) or sweep at 35° (contour), and callouts positioned and visible.
- **No layout shift:** the root is absolutely positioned, with nothing in flow. The canvas has no intrinsic size in flow, and the callouts appear rather than move.

---

## 13. Tokens (add to `src/styles/global.css`)

| Token | Value | Use |
|-------|-------|-----|
| `--signal-alert` | `6 100% 68%` (≈ #ff6b5b, the approved preview's alert) | Alert callouts and markers **on navy only**. Fails on white (≈ 2.8:1): never on light backgrounds |
| `--hero-band` | `clamp(11rem, 30svh, 18rem)` | Stacked-mode image band height (shared by Hero padding, scrim stops and the JS mirror) |
| `@custom-variant hero-side` | `(@media (min-width: 45.0625rem) and (min-aspect-ratio: 6/5))` | Hero layout switch (mirrors the component CSS, §5) |

Existing tokens used: `--primary`, `--accent`. No new fonts (callouts use the system mono stack via `font-mono`).

---

## 14. Performance and budget

| Item | Target | Hard limit |
|------|--------|------------|
| Module (glue + registry + both scenes + lib), gzip | **< 4 KB** | 6 KB |
| First-party JS per page (`npm run qa:budget`) | unchanged headroom | 40 KB gzip |
| Texture build at 1440 × 900 (`performance.measure("hero-bg:build")`) | ≤ 30 ms | 50 ms (unthrottled CI Chromium) |
| Network | Zero new requests (no images, fonts or data). The deleted `hero-background.jpg` removes the hero's only high-priority image | |
| Memory | Backing store ≤ 4.2 MP; texture ≤ 1.6 MP | |

---

## 15. Accessibility and content rules

- The root is `aria-hidden="true"`, so the callouts, note and canvas never reach assistive tech. The hero `<h1>` stays the only `<h1>`.
- **No text is drawn on the canvas.** All words are DOM (auditable, contrast-testable, and the banned-terms scan can see them).
- **Banned terms** (case-insensitive, anywhere in the component, its scripts, `src/lib/heroScene/*`, rendered markup and code comments): `SAR`, `synthetic aperture`, `backscatter`, `radar`, `Sentinel`, `Copernicus`, `InSAR`, `interferometr*`, `polarimetr*`, `C-band`, `X-band`, `dB`. Use neutral words in code too ("scan", "sweep", "imagery", "activity").
- Hero text contrast ≥ 4.5:1 against the **actual rendered pixels** (white and cyan text), including while the scan line passes behind the text.
- `pointer-events:none` on the whole layer; it must never intercept CTA clicks or focus.
- No horizontal scroll at 360px (existing e2e).

---

## 16. Acceptance criteria (testable)

Unit = `tests/unit/heroScene.test.ts` (`npm test`). E2E = `tests/e2e/heroBackground.spec.ts` (`npm run test:e2e`, desktop 1440×900 + Pixel 7 projects, served by `serve-dist.mjs` with production headers).

| AC | Criterion | How |
|----|-----------|-----|
| AC-1 | `createRng(seed)` returns an identical sequence for an identical seed, in [0, 1) | Unit |
| AC-2 | `mineLayout` side at 1440×900, 1280×800, 1100×700, 1920×1080: pit bbox left ≥ 0.48w; plant, stockpiles and every element > 180 at x ≥ 0.56w; plant centre inside the frame | Unit |
| AC-3 | `mineLayout` stacked at 412×915, 360×640, 768×1024: pit and plant centres between `N` and `N + B`; pit bbox bottom ≤ `N + B` + 8 | Unit |
| AC-4 | `scanX`: 0 → −0.08w; 10 000 → null (rest); 14 000 → −0.08w; `STILL_PHASE` → ≈ 0.848w | Unit |
| AC-5 | `backingStore`: DPR 1 → 1; 2.625 → 2; 3 → 2; 2560×1440 @2 → reduced to ≤ 4.2 MP | Unit |
| AC-6 | `placeCallout` clamps to x ∈ [0.58w, w−16], y ∈ [N+24, h−160]; two callouts never overlap | Unit |
| AC-7 | Banned-terms scan (§15) over component/script/lib sources and `MINE_CALLOUTS`: zero matches | Unit |
| AC-8 | Registry has a factory for every entry in `HERO_BG_VARIANTS` | Unit + `npm run check` |
| AC-9 | Home: exactly one `[data-hero-bg="mine"]` with `aria-hidden="true"`; no `<img>` inside the hero `<section>`; the root's bounding box equals the hero section's box (±1px) | E2E |
| AC-10 | Canvas not blank: luminance variance over the pit-centre 64×64 region > a threshold; canvas `width ≤ 2 × clientWidth` on Pixel 7 (DPR 2.625) | E2E |
| AC-11 | Determinism: two fresh loads with `reducedMotion: "reduce"` at the same viewport give an identical `canvas.toDataURL()` hash | E2E |
| AC-12 | Reduced motion: after init, zero `requestAnimationFrame` calls over 2 s (counted via `addInitScript` wrapper) and the canvas hash is unchanged | E2E |
| AC-13 | Motion on: canvas hash changes within 1 s. Scrolled fully out of view: ≤ 1 rAF over the next 1 s. `document.hidden` emulated: loop stops | E2E |
| AC-14 | CLS: summed `layout-shift` entries (no recent input) < 0.01 from load to +3 s, on both projects | E2E |
| AC-15 | Contrast at the reduced-motion frame: `h1`, the h2/subhead, the paragraph and the pills have worst-case ≥ 4.5:1 (white text via `worstContrastAgainstWhite`, cyan text via the new `worstContrastAgainst(el, accentRGB)`), on both projects | E2E |
| AC-16 | Contrast **with the scan line behind the text**: `page.clock.install()` before `goto`, advance so `scanX` is at the h1's left edge and then at its centre (offsets computed from the exported `scanX`); worst-case ≥ 4.5:1 at both (desktop) | E2E |
| AC-17 | Callouts: visible at 1440×900 with the exact §8 labels; `display:none` on Pixel 7 and at 1024×1366; at 1440 the callout boxes don't intersect the h1/paragraph/CTA boxes, and they lie within the hero and below the nav | E2E |
| AC-18 | Hero `textContent` + the `aria-*`/`title` attributes contain none of the §15 terms | E2E |
| AC-19 | No JS (`javaScriptEnabled: false`): the hero background is navy (sampled pixel ≈ `--primary`), and AC-15 contrast passes | E2E |
| AC-20 | Zero console errors, zero `securitypolicyviolation` events, and no network requests initiated by the component, under the production CSP | E2E |
| AC-21 | Resize 1440×900 → 390×844 → 1440×900: the mode switches (`--hero-bg-layout`), no exceptions, callouts hidden then shown | E2E |
| AC-22 | `npm run build && npm run qa:budget` passes; the hero module chunk is ≤ 6 KB gzip (report the actual figure; target < 4 KB) | QA Runner |
| AC-23 | `npm run check`, `npm run lint`, `npm test` clean; the existing e2e suite stays green (incl. no horizontal scroll at 360px) | QA Runner |
| AC-24 | Design gate: UI/UX Lead approves screenshots at 390, 1440 and also 1024×768 and 768×1024, still frame and mid-sweep | UI/UX review |

---

## LATITUDE (what can be simplified)

- **Integration route:** named slot through `Home.tsx` (preferred) or convert the hero to `Hero.astro`. Tech Lead picks one.
- **Element counts and exact proportions:** ±20% on any size or offset in §6.3/§6.4, and fewer stockpiles, tanks or vehicles, as long as AC-2/AC-3 hold and the scene still reads as *pit + haul road + stockpiles + conveyor + plant + tailings*.
- **Terrain field texture and the edge vignette:** simplify or drop.
- **Callout "lit" state on scan pass (§8):** can be cut entirely if it costs > 0.5 KB gzip.
- **Contour isolines:** per-pixel instead of marching squares, within the §9 limits.
- **Tone values:** ±10 per row of §6.5, if the L ≤ 0.10 design target behind text still holds.
- **Scan timing:** sweep 9–12 s and rest 3–5 s.
- **h1 gradient span → `text-accent`:** optional.
- **`motion="still"` prop:** may be deferred if unused in 003b (keep the type).

## MUST PRESERVE (cannot be cut)

1. **Zero client React.** Astro component + bundled TS module; no `client:*` directive.
2. **No method-specific terms** anywhere visible or in the component's sources (§15), and **no text on the canvas**.
3. **Mocked imagery generated in code**, deterministic (seeded), with no image or network assets.
4. A **complete static first frame**, equal to the reduced-motion frame; reduced motion = **no animation loop at all**.
5. **Pause offscreen and when the tab is hidden**; DPR ≤ 2 (and ≤ 4.2 MP); 30 fps cap.
6. **No layout shift:** absolutely positioned layer; callouts hidden until positioned.
7. **Readability by construction:** tone mask in the texture + scrim above the canvas + scan line under the scrim. Hero text ≥ 4.5:1 measured on real pixels, including mid-sweep.
8. **Mobile composition:** stacked band above the text, text over the darkest area, callouts hidden below 1100px or in stacked mode.
9. **Pluggable `variant`** with a type-checked registry; adding a variant needs no page edits.
10. **Restraint:** grayscale scene, cyan used only for the instrument overlay and callouts, max 2 callouts, the slow 14 s cycle.
11. **The "Illustrative" note**, unless the operator waives it (Q1).
12. Module ≤ 6 KB gzip; first-party JS ≤ 40 KB per page.

---

## Out of scope, follow-ups, open questions

- **Out of scope:** hero copy and proof strip (TASK-004a), inner-page application of `contour` (TASK-003c), option B "network" scene.
- **FOLLOW-UP (pre-existing defect, recommend folding into 003b):** `Button` variant `hero` = `bg-gradient-secondary text-white`, i.e. **white on cyan ≈ 1.3:1** (fails WCAG AA; the design system already moved `accent-foreground` to navy for this reason). The Home hero's primary CTA "See What's Next" uses it. Fix: `text-primary` in `src/components/ui/button.tsx` (one token), plus a `worstContrastAgainst` e2e for that button. MUST FIX before any hero ships, whichever task carries it.
- **FOLLOW-UP:** `scripts/generate-images.js` still describes `hero-background.png`; leave it, or log a DEBT note to remove it when the generator is retired.
- **Q1 (operator):** keep the "Illustrative" corner note on the mine scene? Recommended **yes** (mock numbers over a mock site). Default if unanswered: ship with it.
- **Q2 (operator, from MSG-008):** whether public copy keeps naming the satellite method. It doesn't affect this component, which stays method-neutral either way.
