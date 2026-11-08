import { createRng } from "./rng.ts";
import type { Box, Footprint, LayoutMode, MineAnchor, Point } from "./types.ts";

/** Height of the fixed site header; scene content may tuck under it but never depends on it. */
export const NAV_PX = 72;
export const BAND_MIN_PX = 176;
export const BAND_MAX_PX = 288;
const BAND_VIEWPORT_SHARE = 0.3;

export const MAX_DPR = 2;
export const MAX_BACKING_PIXELS = 4.2e6;

export const SWEEP_PERIOD_MS = 10000;
/** Leading edge at 35 degrees clockwise from 3 o'clock. */
export const CONTOUR_STILL_PHASE = 972;

export const SCAN_CYCLE_MS = 14000;
export const SCAN_SWEEP_MS = 10000;
const SCAN_OVERSHOOT = 0.08;
/** Inside the rest period of the scan cycle, so the still frame has no scan line. */
export const MINE_STILL_PHASE = 13250;


/** Bottom strip kept free for the proof strip (TASK-004a). */
export const PROOF_ZONE_PX = 160;
/** Hero text column ends at this share of the width in side mode. */
export const TEXT_SAFE_X = 0.56;
export const CALLOUT_MIN_X = 0.58;
const CALLOUT_EDGE_PX = 16;
const CALLOUT_NAV_GAP = 24;

const FEATURE_SEED = 0xd0a7;
const PIT_ROTATION = (-14 * Math.PI) / 180;
const PIT_FLATNESS = 0.7;
const DEG = Math.PI / 180;
/**
 * Side-mode placement: the pit centre as a share of the hero size, every other feature as an offset in pit radii.
 * Tuned within the spec's +-20% latitude so that the callout labels and the note keep clear of the features.
 */
const SIDE = { pit: { x: 0.68, y: 0.42 }, stock: { x: 0.36, y: 1.32 }, plant: { x: 1.3, y: 0.64 }, dump: { x: 0.76, y: -0.64 }, tailings: { x: -0.48, y: 1.7 }, plantSize: { x: 0.32, y: 0.26 } };
const DUMP_SIZE = { x: 0.42, y: 0.27 };
const SHADOW_PX = 3;

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
export const smoothstep = (a: number, b: number, v: number): number => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Stacked-mode image band height for a viewport height (mirrors the CSS `--hero-band`). */
export const bandFor = (viewportH: number): number => clamp(viewportH * BAND_VIEWPORT_SHARE, BAND_MIN_PX, BAND_MAX_PX);

/** Canvas backing-store scale: at most 2, reduced (never below 1) to stay within 4.2 megapixels. */
export function backingStore(cssW: number, cssH: number, dpr: number): number {
  const wanted = Math.max(1, Math.min(dpr || 1, MAX_DPR));
  const area = Math.max(1, cssW * cssH);
  if (area * wanted * wanted <= MAX_BACKING_PIXELS) return wanted;
  return Math.max(1, Math.floor(Math.sqrt(MAX_BACKING_PIXELS / area) * 100) / 100);
}

/** x of the scan line in CSS px, or null during the rest period. */
export function scanX(phaseMs: number, w: number): number | null {
  const t = ((phaseMs % SCAN_CYCLE_MS) + SCAN_CYCLE_MS) % SCAN_CYCLE_MS;
  if (t >= SCAN_SWEEP_MS) return null;
  return -SCAN_OVERSHOOT * w + (1 + 2 * SCAN_OVERSHOOT) * w * (t / SCAN_SWEEP_MS);
}

/** Phase (ms into the cycle, within the sweep) at which the scan line is at x. Inverse of `scanX`. */
export const scanPhaseFor = (x: number, w: number): number => ((x / w + SCAN_OVERSHOOT) / (1 + 2 * SCAN_OVERSHOOT)) * SCAN_SWEEP_MS;

/** Clockwise angle (radians from 3 o'clock) of the sweep's leading edge. */
export const sweepAngle = (phaseMs: number): number => (((phaseMs / SWEEP_PERIOD_MS) % 1) + 1) % 1 * Math.PI * 2;

/**
 * Brightness multiplier that darkens the side of the scene behind the hero text.
 * side: `floor` up to 40% of the width, 1 from 60%. stacked: 1 down to the end of the band, `floor` 200px below it.
 */
export function toneMask(x: number, y: number, w: number, mode: LayoutMode, band: number, floor: number): number {
  const t = mode === "side" ? smoothstep(0.4 * w, 0.6 * w, x) : 1 - smoothstep(NAV_PX + band, NAV_PX + band + 200, y);
  return floor + (1 - floor) * t;
}

export interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
}
export interface Cone {
  x: number;
  y: number;
  r: number;
}
/** A roof in the plant's own frame (px from the plant centre, axes rotated by `plant.rot`). */
export interface Roof {
  u: number;
  v: number;
  hw: number;
  hh: number;
  tone: number;
  gable: boolean;
}
export interface Tank {
  u: number;
  v: number;
  r: number;
  big: boolean;
}
export interface BrightItem {
  name: string;
  minX: number;
  maxX: number;
  tone: number;
}
export interface MineLayout {
  mode: LayoutMode;
  radius: number;
  pit: Ellipse;
  /** Second, smaller lobe that makes the pit outline irregular. The pit is the union of both. */
  pitLobe: Ellipse;
  dump: Ellipse;
  /** Direction (radians) in which the dump's partial lift faces: away from the pit. */
  dumpFacing: number;
  tailings: Ellipse;
  stockpiles: Cone[];
  windrow: Ellipse;
  plant: { cx: number; cy: number; hw: number; hh: number; rot: number; roofs: Roof[]; tanks: Tank[] };
  haulRoad: Point[];
  conveyor: Point[];
  accessRoad: Point[];
  anchors: Record<MineAnchor, Footprint>;
}

const rotate = (x: number, y: number, a: number): Point => ({ x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a) });

export function ellipseBounds(e: Ellipse): { minX: number; maxX: number; minY: number; maxY: number } {
  const hx = Math.hypot(e.rx * Math.cos(e.rot), e.ry * Math.sin(e.rot));
  const hy = Math.hypot(e.rx * Math.sin(e.rot), e.ry * Math.cos(e.rot));
  return { minX: e.cx - hx, maxX: e.cx + hx, minY: e.cy - hy, maxY: e.cy + hy };
}

/** Bounding box of the whole pit outline (main ellipse and lobe). */
export function pitBounds(lay: MineLayout): { minX: number; maxX: number; minY: number; maxY: number } {
  const [a, b] = [ellipseBounds(lay.pit), ellipseBounds(lay.pitLobe)];
  return { minX: Math.min(a.minX, b.minX), maxX: Math.max(a.maxX, b.maxX), minY: Math.min(a.minY, b.minY), maxY: Math.max(a.maxY, b.maxY) };
}

/** Every element brighter than about 170 with its horizontal extent. Used by tests to check the text-safe zone. */
export function brightItems(lay: MineLayout): BrightItem[] {
  const { plant, stockpiles, windrow, conveyor } = lay;
  const reach = Math.abs(plant.hw * Math.cos(plant.rot)) + Math.abs(plant.hh * Math.sin(plant.rot));
  const wr = ellipseBounds(windrow);
  return [
    ...stockpiles.map((c, i) => ({ name: `stockpile${i}`, minX: c.x - c.r, maxX: c.x + c.r, tone: 175 })),
    { name: "windrow", minX: wr.minX, maxX: wr.maxX, tone: 175 },
    { name: "conveyor", minX: Math.min(...conveyor.map((p) => p.x)), maxX: Math.max(...conveyor.map((p) => p.x)), tone: 200 },
    { name: "plant", minX: plant.cx - reach, maxX: plant.cx + reach, tone: 227 },
  ];
}

/** Point on the pit at a normalised radius and an angle in the pit's own (rotated, flattened) frame. */
function pitPoint(pit: Ellipse, rho: number, theta: number): Point {
  const p = rotate(pit.rx * rho * Math.cos(theta), pit.ry * rho * Math.sin(theta), pit.rot);
  return { x: pit.cx + p.x, y: pit.cy + p.y };
}

/** Roofs in plant-normalised coordinates: centre u, v, half sizes, tone, gable. One long mill, three medium, two small. */
const ROOFS: ReadonlyArray<readonly [number, number, number, number, number, boolean]> = [
  [-0.4, -0.52, 0.5, 0.2, 205, true],
  [0.4, -0.48, 0.28, 0.3, 190, false],
  [-0.52, 0.1, 0.28, 0.26, 210, true],
  [0, 0.02, 0.2, 0.22, 175, false],
  [0.58, 0.14, 0.14, 0.16, 225, false],
  [-0.1, 0.55, 0.14, 0.14, 185, false],
];
/** Tanks: centre u, v, big (thickener) or small. */
const TANKS: ReadonlyArray<readonly [number, number, boolean]> = [
  [0.76, 0.66, true],
  [0.34, 0.66, true],
  [-0.6, 0.72, false],
  [-0.34, 0.8, false],
];

/**
 * All positions for the mine scene, in CSS px. Pure and deterministic in (w, h, mode, band):
 * the only randomness is the seeded feature generator.
 */
export function mineLayout(w: number, h: number, mode: LayoutMode, band: number): MineLayout {
  const side = mode === "side";
  const radius = side ? clamp(Math.min(0.19 * w, 0.36 * h), 150, 380) : Math.min(0.3 * w, 0.56 * band);
  const R = radius;
  const P: Point = side ? { x: SIDE.pit.x * w, y: SIDE.pit.y * h } : { x: 0.64 * w, y: NAV_PX + 0.5 * band };
  const at = (o: { x: number; y: number }): Point => ({ x: P.x + o.x * R, y: P.y + o.y * R });
  const S: Point = side ? at(SIDE.stock) : { x: 0.36 * w, y: NAV_PX + 0.86 * band };
  const Q: Point = side ? at(SIDE.plant) : { x: 0.17 * w, y: NAV_PX + 0.62 * band };
  const D: Point = side ? at(SIDE.dump) : { x: 0.95 * w, y: NAV_PX + 0.12 * band };
  const T: Point = side ? at(SIDE.tailings) : { x: 0.4 * w, y: NAV_PX + band + 0.35 * R };

  const pit: Ellipse = { cx: P.x, cy: P.y, rx: R, ry: PIT_FLATNESS * R, rot: PIT_ROTATION };
  const pitLobe: Ellipse = { cx: P.x - 0.38 * R, cy: P.y - 0.22 * R, rx: 0.55 * R, ry: 0.45 * R, rot: PIT_ROTATION };
  const dump: Ellipse = { cx: D.x, cy: D.y, rx: DUMP_SIZE.x * R, ry: DUMP_SIZE.y * R, rot: PIT_ROTATION };
  const tailings: Ellipse = { cx: T.x, cy: T.y, rx: 0.5 * R, ry: 0.25 * R, rot: 0 };

  const rng = createRng(FEATURE_SEED);

  // Ore stockpiles (three cones and one windrow) in a row along the conveyor.
  const toPlant = Math.atan2(Q.y - S.y, Q.x - S.x);
  const [dc, ds] = [Math.cos(toPlant), Math.sin(toPlant)];
  const stockpiles: Cone[] = [-0.22, -0.06, 0.08].map((along) => ({ x: S.x + along * R * dc, y: S.y + along * R * ds, r: R * 0.075 * (0.7 + 0.6 * rng()) }));
  const windrowR = R * 0.085 * (0.7 + 0.6 * rng());
  const windrow: Ellipse = { cx: S.x + 0.21 * R * dc, cy: S.y + 0.21 * R * ds, rx: windrowR * 1.58, ry: windrowR * 0.63, rot: toPlant };

  // Plant: a rotated grid with one mill, medium and small roofs, thickeners and small tanks.
  const phw = (side ? SIDE.plantSize.x : 0.5) * R;
  const phh = (side ? SIDE.plantSize.y : 0.38) * R;
  const roofs: Roof[] = ROOFS.map(([u, v, hu, hv, tone, gable]) => ({
    u: u * phw,
    v: v * phh,
    hw: hu * phw,
    hh: hv * phh,
    tone: tone + Math.round((rng() - 0.5) * 8),
    gable,
  }));
  const tanks: Tank[] = TANKS.map(([u, v, big]) => ({ u: u * phw, v: v * phh, r: R * (big ? 0.08 : 0.035 * (0.9 + 0.2 * rng())), big }));
  const plant = { cx: Q.x, cy: Q.y, hw: phw, hh: phh, rot: PIT_ROTATION, roofs, tanks };

  // Haul road: a ramp (0.62 turns) out of the pit floor, one switchback, then a short run to the rim at the side
  // facing the stockpiles. Derived from its exit so it never crosses the pit and never runs parallel to a bench for long.
  const local = rotate(S.x - P.x, S.y - P.y, -PIT_ROTATION);
  const exit = Math.atan2(local.y / PIT_FLATNESS, local.x);
  const leg = (n: number, r0: number, r1: number, a0: number, a1: number): Point[] =>
    Array.from({ length: n + 1 }, (_, i) => pitPoint(pit, r0 + ((r1 - r0) * i) / n, a0 + ((a1 - a0) * i) / n));
  const a2 = exit - 50 * DEG;
  const a1 = a2 + 100 * DEG;
  const a0 = a1 - 223 * DEG;
  const haulRoad = [...leg(40, 0.2, 0.62, a0, a1), ...leg(18, 0.62, 0.88, a1, a2), ...leg(12, 0.88, 1, a2, exit), S];

  const conveyor = [S, Q];
  const accessRoad: Point[] = [Q, side ? { x: w + 8, y: 0.6 * h } : { x: -8, y: Q.y + 0.1 * band }];

  const boxes = [...stockpiles.map((c) => ({ minX: c.x - c.r, maxX: c.x + c.r, minY: c.y - c.r, maxY: c.y + c.r })), ellipseBounds(windrow)];
  const sp = { minX: Math.min(...boxes.map((b) => b.minX)), maxX: Math.max(...boxes.map((b) => b.maxX)), minY: Math.min(...boxes.map((b) => b.minY)), maxY: Math.max(...boxes.map((b) => b.maxY)) };
  const [cosR, sinR] = [Math.abs(Math.cos(PIT_ROTATION)), Math.abs(Math.sin(PIT_ROTATION))];
  const anchors: Record<MineAnchor, Footprint> = {
    plant: { x: Q.x, y: Q.y, hw: phw * cosR + phh * sinR + SHADOW_PX, hh: phw * sinR + phh * cosR + SHADOW_PX },
    stockpile: { x: (sp.minX + sp.maxX) / 2, y: (sp.minY + sp.maxY) / 2, hw: (sp.maxX - sp.minX) / 2 + SHADOW_PX, hh: (sp.maxY - sp.minY) / 2 + SHADOW_PX },
    pit: { x: P.x, y: P.y, hw: pit.rx, hh: pit.ry, round: true, rot: pit.rot },
    tailings: { x: T.x, y: T.y, hw: tailings.rx, hh: tailings.ry, round: true, rot: 0 },
  };

  return { mode, radius, pit, pitLobe, dump, dumpFacing: Math.atan2(D.y - P.y, D.x - P.x), tailings, stockpiles, windrow, plant, haulRoad, conveyor, accessRoad, anchors };
}

export interface ContourLayout {
  cx: number;
  cy: number;
  rings: number[];
}

export function contourLayout(w: number, h: number, mode: LayoutMode, band: number): ContourLayout {
  const side = mode === "side";
  const unit = side ? Math.min(w, h) : w;
  return {
    cx: side ? 0.78 * w : 0.7 * w,
    cy: side ? 0.45 * h : NAV_PX + 0.5 * band,
    rings: [0.1, 0.2, 0.3].map((k) => k * unit),
  };
}

/** Terrain height field for the contour scene: three summed sinusoids. */
export const contourHeight = (x: number, y: number): number =>
  Math.sin(x * 0.011) * Math.cos(y * 0.013) + 0.6 * Math.sin((x + y) * 0.007) + 0.4 * Math.cos(x * 0.004 - y * 0.009);

/** Marching-squares edge pairs per corner case (edges: 0 top, 1 right, 2 bottom, 3 left). */
const CASES: readonly (readonly number[])[] = [[], [3, 2], [2, 1], [3, 1], [0, 1], [0, 3, 2, 1], [0, 2], [0, 3], [0, 3], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], []];
const INDEX_EVERY = 5;

/** Isolines of `f` every `step`, as flat [x1, y1, x2, y2, ...] segment lists. Every 5th level is an "index" line. */
export function isolines(f: (x: number, y: number) => number, w: number, h: number, cell: number, step: number): { minor: number[]; major: number[] } {
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const stride = cols + 1;
  const g = new Float32Array(stride * (rows + 1));
  for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) g[r * stride + c] = f(c * cell, r * cell);
  const out = { minor: [] as number[], major: [] as number[] };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = g[r * stride + c];
      const b = g[r * stride + c + 1];
      const cc = g[(r + 1) * stride + c + 1];
      const d = g[(r + 1) * stride + c];
      const x0 = c * cell;
      const y0 = r * cell;
      const x1 = x0 + cell;
      const y1 = y0 + cell;
      const hi = Math.max(a, b, cc, d);
      for (let k = Math.ceil(Math.min(a, b, cc, d) / step); k * step <= hi; k++) {
        const level = k * step;
        const edge = (e: number): Point => {
          if (e === 0) return { x: x0 + ((level - a) / (b - a)) * cell, y: y0 };
          if (e === 1) return { x: x1, y: y0 + ((level - b) / (cc - b)) * cell };
          if (e === 2) return { x: x0 + ((level - d) / (cc - d)) * cell, y: y1 };
          return { x: x0, y: y0 + ((level - a) / (d - a)) * cell };
        };
        const pairs = CASES[(a > level ? 8 : 0) | (b > level ? 4 : 0) | (cc > level ? 2 : 0) | (d > level ? 1 : 0)];
        const list = k % INDEX_EVERY === 0 ? out.major : out.minor;
        for (let i = 0; i < pairs.length; i += 2) {
          const p = edge(pairs[i]);
          const q = edge(pairs[i + 1]);
          list.push(p.x, p.y, q.x, q.y);
        }
      }
    }
  }
  return out;
}

export interface CalloutRequest {
  /** The feature the label describes. */
  footprint: Footprint;
  size: { w: number; h: number };
  prefer: "below" | "above";
  /** Other features the label must keep clear of. */
  avoid?: readonly Footprint[];
}
export interface PlacedCallout {
  box: Box;
  /** Where the reticle sits: on the feature's edge, facing the label. */
  marker: Point;
}

const CLEARANCE_PX = 8;
const LEADER_MIN_PX = 24;
const LEADER_MAX_PX = 72;
const GAP = { above: 32, below: 28, left: 28 };

const boxesOverlap = (a: Box, b: Box, gap: number): boolean => a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;

/** Does a label box come within `gap` px of a feature footprint (a box, or a rotated ellipse when `round`)? */
export function footprintHits(f: Footprint, box: Box, gap: number): boolean {
  if (!f.round) return boxesOverlap({ x: f.x - f.hw, y: f.y - f.hh, w: 2 * f.hw, h: 2 * f.hh }, box, gap);
  const [cos, sin] = [Math.cos(f.rot ?? 0), Math.sin(f.rot ?? 0)];
  const inside = (px: number, py: number): boolean => {
    const [dx, dy] = [px - f.x, py - f.y];
    return ((dx * cos + dy * sin) / (f.hw + gap)) ** 2 + ((dy * cos - dx * sin) / (f.hh + gap)) ** 2 <= 1;
  };
  // Sample the box on a grid at most 12px apart (features are far larger), and the ellipse's own extreme points.
  const [nx, ny] = [Math.ceil(box.w / 12), 2];
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) if (inside(box.x + (box.w * i) / nx, box.y + (box.h * j) / ny)) return true;
  return f.x >= box.x - gap && f.x <= box.x + box.w + gap && f.y >= box.y - gap && f.y <= box.y + box.h + gap;
}

/** Leader line from a marker to the nearest point of its label box. */
export function leaderSegment(anchor: Point, box: Box): { length: number; angle: number } {
  const dx = clamp(anchor.x, box.x, box.x + box.w) - anchor.x;
  const dy = clamp(anchor.y, box.y, box.y + box.h) - anchor.y;
  return { length: Math.sqrt(dx * dx + dy * dy), angle: Math.atan2(dy, dx) };
}

/**
 * Places a callout label and its marker. Candidates are tried in order above/below/left (the preferred
 * vertical side first), each aligned to the marker and then flush with the right margin. A candidate is valid when it lies in x [0.58w, w-16] and y [nav+24, h-160], its leader is
 * 24-72px, and it keeps 8px clear of its own footprint, the other features and the labels already placed.
 * If none is valid the preferred candidate is clamped into the zone.
 */
export function placeCallout(req: CalloutRequest, w: number, h: number, placed: readonly Box[] = []): PlacedCallout {
  const { footprint: f, size } = req;
  const minX = CALLOUT_MIN_X * w;
  const maxX = Math.max(minX, w - CALLOUT_EDGE_PX - size.w);
  const minY = NAV_PX + CALLOUT_NAV_GAP;
  const maxY = Math.max(minY, h - PROOF_ZONE_PX - size.h);
  const candidate = (side: "above" | "below" | "left", flush: boolean): PlacedCallout => {
    const marker: Point = side === "above" ? { x: f.x, y: f.y - f.hh } : side === "below" ? { x: f.x, y: f.y + f.hh } : { x: f.x - f.hw, y: f.y };
    const rawX = flush ? maxX : (side === "left" ? marker.x - GAP.left : marker.x) - size.w;
    const rawY = side === "above" ? marker.y - GAP.above - size.h : side === "below" ? marker.y + GAP.below : marker.y - size.h / 2;
    return { marker, box: { x: clamp(rawX, minX, maxX), y: clamp(rawY, minY, maxY), w: size.w, h: size.h } };
  };
  const order = req.prefer === "below" ? (["below", "above", "left"] as const) : (["above", "below", "left"] as const);
  const options = order.flatMap((side) => [candidate(side, false), candidate(side, true)]);
  const valid = (c: PlacedCallout): boolean => {
    const leader = leaderSegment(c.marker, c.box).length;
    return (
      leader >= LEADER_MIN_PX &&
      leader <= LEADER_MAX_PX &&
      c.box.x >= minX &&
      c.box.y >= minY &&
      c.box.y + c.box.h <= h - PROOF_ZONE_PX &&
      !footprintHits(f, c.box, CLEARANCE_PX) &&
      !(req.avoid ?? []).some((o) => footprintHits(o, c.box, CLEARANCE_PX)) &&
      !placed.some((p) => boxesOverlap(c.box, p, CLEARANCE_PX))
    );
  };
  return options.find(valid) ?? options[0];
}
