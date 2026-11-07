# DUAT Website: Design System
*Owned by: UI/UX Lead | Updated: 2026-11-07 | Tokens live in `src/styles/global.css`*

## Tokens (HSL channels; use as `hsl(var(--token))` or the Tailwind colour of the same name)
| Token | Value | Use |
|-------|-------|-----|
| primary | 213 84% 11% | Navy: nav, footer, hero canvas, headings |
| secondary / accent | 180 95% 56% | Cyan: CTAs, highlights, icons. **Never body text on white** |
| accent-foreground | 213 84% 11% | Text on cyan (changed from white: white-on-cyan fails contrast) |
| muted-foreground | 215.4 16.3% **40%** | Secondary text (darkened from 46.9% to clear 4.5:1 on white and muted backgrounds) |
| border / input | 214.3 31.8% 91.4% | Hairlines |
| gradients | primary / secondary / hero | `bg-gradient-*` utilities. `gradient-hero` ends in bright cyan: never use it as a hero background behind text |
| signal-alert | 6 100% 68% | Alert callouts/markers **on navy only** (≈ 2.8:1 on white: never on light) |
| hero-band | clamp(11rem, 30svh, 18rem) | Height of the image band above the text in stacked (phone/portrait) heroes |

## Buttons (`src/components/ui/button.tsx`)
| Variant | Where |
|---------|-------|
| `hero` | Primary CTA on dark backgrounds |
| `secondary` | Cyan fill CTA |
| `outline` | Secondary action **on light backgrounds only** |
| `outline-light` | Secondary action **on dark/gradient backgrounds** (fixes the old white-on-white bug) |
| `outline-hero` | Cyan-outlined CTA on dark backgrounds |

## Rules
- One `<h1>` per page; title and description set per page in `src/pages/*.astro`.
- Contact CTAs: any element with `data-contact` (+ optional `data-contact-title`/`-description`).
- Images: explicit `width`/`height`; `loading="lazy"` below the fold; decorative images get `alt=""`.
- Motion is disabled under `prefers-reduced-motion`.
- Layouts must not scroll horizontally at 360px (enforced by e2e).

## Hero backgrounds (`src/components/HeroBackground.astro`; full spec: `task003b_design_spec.md`)
| Variant | Where | What |
|---------|-------|------|
| `mine` | Home | Code-generated grayscale "orbital imagery" of an open-pit mine + processing plant, slow cyan scan line (14 s cycle), max 2 activity callouts, "Illustrative" note |
| `contour` | Inner-page heroes (TASK-003c) | Topographic contours + slow sweep (10 s/rev) |

- One API: `<HeroBackground variant="…" />`, absolutely positioned inside a `relative isolate` hero `<section>`. Zero client React; one small bundled module (< 4 KB gzip target).
- New variants go into the typed registry (`src/scripts/heroScenes/`); pages never change to support a new variant.
- Layout modes: `side` = `(min-width: 45.0625rem) and (min-aspect-ratio: 6/5)` (Tailwind `hero-side:`), text column left within x ≤ 56% of width; otherwise `stacked`, with the image band (`--hero-band`) under the nav and the text below it over the darkest area.
- Readability by construction: the tone mask darkens the scene on the text side, a CSS scrim sits **above** the canvas, and animated overlays are drawn **under** the scrim. Hero text ≥ 4.5:1 measured on real pixels, mid-animation included (target ≥ 7:1 for white text).
- Words never go on the canvas: callouts are DOM, the whole layer is `aria-hidden`, and `pointer-events:none` is set.
- **Method-neutral wording:** no "SAR", "radar", "backscatter", "Sentinel", "Copernicus" or similar in hero backgrounds (operator, MSG-008). Use activity language ("PROCESSING · ACTIVITY ↓ 38%").
- Motion: slow linear ambient loops, 30 fps cap, paused offscreen and in hidden tabs. Reduced motion = the static first frame, with no loop at all. UI transitions ≤ 300 ms ease-out.
- Deterministic (seeded), DPR ≤ 2, no image or network assets, no layout shift (callouts stay hidden until positioned).
