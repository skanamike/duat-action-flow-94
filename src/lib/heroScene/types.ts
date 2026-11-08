export const HERO_BG_VARIANTS = ["mine", "contour"] as const;
export type HeroBackgroundVariant = (typeof HERO_BG_VARIANTS)[number];

export type LayoutMode = "side" | "stacked";
export type MineAnchor = "plant" | "stockpile" | "pit" | "tailings";
export type CalloutTone = "signal" | "alert";

export interface HeroCallout {
  anchor: MineAnchor;
  label: string;
  tone: CalloutTone;
}

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A feature's footprint in CSS px: centre and half extents (an axis-aligned box, or a rotated ellipse when `round`). */
export interface Footprint extends Point {
  hw: number;
  hh: number;
  round?: boolean;
  rot?: number;
}

export interface SceneTokens {
  /** HSL channel triplet, e.g. "213 84% 11%". Use as `hsl(${primary} / 0.5)`. */
  primary: string;
  accent: string;
}

export interface Scene {
  /** Rebuild static layers for a new CSS size / mode. Deterministic in its arguments. */
  resize(cssW: number, cssH: number, dpr: number, mode: LayoutMode, bandPx: number): void;
  /** Draw one frame at an animation phase (ms). `STILL_PHASE` renders the reduced-motion frame. */
  draw(phaseMs: number): void;
  /** Feature footprints in CSS px for callouts (mine only). */
  anchors?(): Partial<Record<MineAnchor, Footprint>>;
  readonly STILL_PHASE: number;
}

export type SceneFactory = (ctx: CanvasRenderingContext2D, tokens: SceneTokens) => Scene;
