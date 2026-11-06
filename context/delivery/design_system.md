# DUAT Website: Design System
*Owned by: UI/UX Lead | Updated: 2026-11-06 | Tokens live in `src/styles/global.css`*

## Tokens (HSL channels; use as `hsl(var(--token))` or the Tailwind colour of the same name)
| Token | Value | Use |
|-------|-------|-----|
| primary | 213 84% 11% | Navy: nav, footer, hero canvas, headings |
| secondary / accent | 180 95% 56% | Cyan: CTAs, highlights, icons. **Never body text on white** |
| accent-foreground | 213 84% 11% | Text on cyan (changed from white: white-on-cyan fails contrast) |
| muted-foreground | 215.4 16.3% **40%** | Secondary text (darkened from 46.9% to clear 4.5:1 on white and muted backgrounds) |
| border / input | 214.3 31.8% 91.4% | Hairlines |
| gradients | primary / secondary / hero | `bg-gradient-*` utilities |

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
