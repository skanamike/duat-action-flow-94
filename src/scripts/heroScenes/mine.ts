import { RNG_STEP, createRng, mix, speckle } from "@/lib/heroScene/rng";
import {
  MINE_STILL_PHASE,
  NAV_PX,
  ellipseBounds,
  mineLayout,
  scanX,
  toneMask,
  type Ellipse,
  type MineLayout,
} from "@/lib/heroScene/layout";
import type { LayoutMode, MineAnchor, Footprint, SceneFactory } from "@/lib/heroScene/types";

/*
 * Mocked orbital imagery of an open-pit mine with a processing plant, generated from seeded noise and geometry
 * (no image files, no network). Tones are 0-255 grey. Light comes from the north-west: pit walls on the south-east
 * side face the light and read brighter, built shapes cast soft shadows to the south-east.
 *
 * Two layers are composed into one backing-store-sized cache whenever the size changes:
 *   1. the ground (terrain, pit, dump, tailings) as a half-resolution raster, smoothed on upscale and given a fine grain;
 *   2. built elements (stockpiles, conveyor, plant, roads) as anti-aliased vector paths at full resolution.
 * A multiply gradient (the tone mask) then darkens the text side. Each frame is one drawImage plus the scan line.
 */
const GROUND_SCALE = 0.5;
const MAX_GROUND_W = 1600;
const MAX_GROUND_H = 1000;
const TERRAIN_SEED = 0x5eed01;
const GRAIN_SEED = 0x6a17;
const GRAIN_SIZE = 128;
const GRAIN_ALPHA = 0.1;
const TERRAIN_CAP = 105;
const GLOBAL_CAP = 240;
const CAST = { r: 0.86, g: 0.95 };
const MASK_FLOOR = { side: 0.35, stacked: 0.45 };
const MASK_STOPS = 16;
const SCAN_TRAIL_PX = 96;
const SCAN_FADE_PX = 40;
const SCAN_FADE_STEPS = 8;
const SCAN_STACKED_MARGIN_PX = 24;
const SHADOW = { color: "rgba(0,0,0,0.45)", offset: 2.5, blur: 2 };

const PIT_LUMP = 0.07;
const FLOOR = 0.13;
const FLOOR_AT = { u: 0.15, v: 0.08 };
const BENCHES = 7;
const MERGE_BENCH = 3;
const MERGE_DIR = { c: Math.cos(1.7), s: Math.sin(1.7) };
const MERGE_COS = Math.cos((20 * Math.PI) / 180);
const APRON = 0.06;
/** Beyond this normalised radius no outline lump can bring a point inside, so the harmonics are skipped. */
const EARLY_OUT = 1.2;

const len = (a: number, b: number): number => Math.sqrt(a * a + b * b);
const mixTone = (a: number, b: number, t: number): number => a + (b - a) * t;
const grey = (v: number): string => `rgb(${(v * CAST.r) | 0},${(v * CAST.g) | 0},${v | 0})`;
const [COS1, SIN1, COS2, SIN2] = [1, 2].flatMap((k) => [Math.cos(k), Math.sin(k)]);

interface Raster {
  tw: number;
  th: number;
  /** Texels per CSS px. */
  s: number;
  tone: Float32Array;
  grain: Float32Array;
  /** Brightness cap per texel; 0 marks open terrain, which is evaluated later from noise. */
  cap: Uint8Array;
}
interface Sample {
  rho: number;
  dx: number;
  dy: number;
  c: number;
  s: number;
}

/** Sets a texel's mean tone, speckle weight and brightness cap. */
const paint = (r: Raster, i: number, tone: number, grain = 0, cap = GLOBAL_CAP): void => {
  r.tone[i] = tone - grain;
  r.grain[i] = grain;
  r.cap[i] = cap;
};

/** Visits every texel whose centre lies in a CSS-px box. */
function each(r: Raster, x0: number, x1: number, y0: number, y1: number, fn: (i: number, x: number, y: number) => void): void {
  const ax = Math.max(0, Math.floor(x0 * r.s));
  const bx = Math.min(r.tw - 1, Math.ceil(x1 * r.s));
  const ay = Math.max(0, Math.floor(y0 * r.s));
  const by = Math.min(r.th - 1, Math.ceil(y1 * r.s));
  for (let ty = ay; ty <= by; ty++) for (let tx = ax; tx <= bx; tx++) fn(ty * r.tw + tx, (tx + 0.5) / r.s, (ty + 0.5) / r.s);
}

/**
 * Normalised radius of a point in a rotated ellipse with a lumpy outline (3rd and 4th harmonics, as
 * polynomials rather than trig calls), plus its offset from the centre and its direction in the ellipse frame.
 * `cos` and `sin` are those of the ellipse's rotation, computed once by the caller.
 */
function sample(e: Ellipse, cos: number, sin: number, x: number, y: number, lump: number, out: Sample): Sample {
  const dx = x - e.cx;
  const dy = y - e.cy;
  const u = (dx * cos + dy * sin) / e.rx;
  const v = (dy * cos - dx * sin) / e.ry;
  const d = len(u, v);
  if (d > EARLY_OUT) {
    out.rho = d;
    return out;
  }
  const c = u / (d + 1e-9);
  const s = v / (d + 1e-9);
  const [c2, s2] = [c * c, s * s];
  const [c3, s3] = [c * (4 * c2 - 3), s * (3 - 4 * s2)];
  const [c4, s4] = [1 - 8 * s2 * c2, 4 * s * c * (c2 - s2)];
  const wobble = 1 + lump * (0.6 * (s3 * COS1 + c3 * SIN1) + 0.4 * (s4 * COS2 + c4 * SIN2));
  out.rho = d / wobble;
  out.dx = dx;
  out.dy = dy;
  out.c = c;
  out.s = s;
  return out;
}

/** Visits texels around an ellipse with a lumpy outline. */
function ellipse(r: Raster, e: Ellipse, lump: number, margin: number, fn: (i: number, p: Sample) => void): void {
  const b = ellipseBounds(e);
  const p: Sample = { rho: 0, dx: 0, dy: 0, c: 0, s: 0 };
  const [cos, sin] = [Math.cos(e.rot), Math.sin(e.rot)];
  each(r, e.cx - (e.cx - b.minX) * margin, e.cx + (b.maxX - e.cx) * margin, e.cy - (e.cy - b.minY) * margin, e.cy + (b.maxY - e.cy) * margin, (i, x, y) => {
    if (sample(e, cos, sin, x, y, lump, p).rho <= margin) fn(i, p);
  });
}

/** How strongly a point is lit: 1 on the south-east side of its feature (walls facing the north-west light), 0 on the north-west side. */
const lit = (p: Sample): number => (p.dx + p.dy) / (len(p.dx, p.dy) * Math.SQRT2 + 1e-6) * 0.5 + 0.5;

/** The waste dump: an irregular flat top, with one partial lift (about 140 degrees) on the side facing away from the pit. */
function paintDump(r: Raster, lay: MineLayout): void {
  const [cf, sf] = [Math.cos(lay.dumpFacing), Math.sin(lay.dumpFacing)];
  const crescent = Math.cos((70 * Math.PI) / 180);
  ellipse(r, lay.dump, 0.12, 1.15, (i, p) => {
    if (p.rho > 1) return;
    const d = len(p.dx, p.dy) + 1e-6;
    const lift = (p.dx * cf + p.dy * sf) / d > crescent && p.rho > 0.52 && p.rho < 0.68;
    if (p.rho > 0.86 || lift) paint(r, i, mixTone(50, 125, 1 - lit(p)), 6);
    else paint(r, i, 96, 5);
  });
}

/** Seeded bench edges (normalised radius from the floor to the rim; outer two benches widest) and angular phases (radians). */
const BENCH_EDGE = [0.13, 0.23, 0.36, 0.44, 0.56, 0.65, 0.82, 1];
const BENCH_PHASE = [0.7, 2.9, 4.4, 1.3, 5.6, 3.6, 2.1];
const [BENCH_COS, BENCH_SIN] = [BENCH_PHASE.map(Math.cos), BENCH_PHASE.map(Math.sin)];

/** Bench edge k at a direction (sc = sin 2t, cs = cos 2t): nominal edge plus a quarter-bench of angular phase; the floor and rim are fixed. */
const benchEdge = (k: number, sc: number, cs: number): number =>
  BENCH_EDGE[k] + (k === 0 || k === BENCHES ? 0 : 0.25 * (BENCH_EDGE[k + 1] - BENCH_EDGE[k]) * (sc * BENCH_COS[k] + cs * BENCH_SIN[k]));

/** The pit: an irregular outline (main ellipse united with a lobe), lit benches, an offset floor with a small lake, a rim apron. */
function paintPit(r: Raster, lay: MineLayout): void {
  const [A, B]: Sample[] = [0, 1].map(() => ({ rho: 0, dx: 0, dy: 0, c: 0, s: 0 }));
  const [b1, b2] = [ellipseBounds(lay.pit), ellipseBounds(lay.pitLobe)];
  const [cosR, sinR] = [Math.cos(lay.pit.rot), Math.sin(lay.pit.rot)];
  const reach = 1 + APRON + 0.03;
  const lobeBox = { x0: b2.minX - 0.08 * lay.radius, x1: b2.maxX + 0.08 * lay.radius, y0: b2.minY - 0.08 * lay.radius, y1: b2.maxY + 0.08 * lay.radius };
  each(r, Math.min(b1.minX, b2.minX) - 8, Math.max(b1.maxX, b2.maxX) + 8, Math.min(b1.minY, b2.minY) - 8, Math.max(b1.maxY, b2.maxY) + 8, (i, x, y) => {
    sample(lay.pit, cosR, sinR, x, y, PIT_LUMP, A);
    if (x > lobeBox.x0 && x < lobeBox.x1 && y > lobeBox.y0 && y < lobeBox.y1) sample(lay.pitLobe, cosR, sinR, x, y, PIT_LUMP, B);
    else B.rho = Infinity;
    // The lobe's own floor is lifted to 0.35 so it reads as part of the same pit, not a second one.
    const lobe = 0.35 + 0.65 * B.rho < A.rho;
    const p = lobe ? B : A;
    const rho = lobe ? 0.35 + 0.65 * B.rho : A.rho;
    if (rho > reach) return;
    if (rho > 1) return paint(r, i, 77, 6);
    const [fu, fv] = [A.rho * A.c, A.rho * A.s];
    if (!lobe && len(fu - FLOOR_AT.u, fv - FLOOR_AT.v) < FLOOR) {
      const lake = len(fu - 0.17, fv - 0.09) < 0.06 || len(fu - 0.11, fv - 0.04) < 0.045;
      return lake ? paint(r, i, 17) : paint(r, i, 43, 4);
    }
    if (rho < FLOOR) return paint(r, i, 43, 4);
    const [sc, cs] = [2 * p.s * p.c, p.c * p.c - p.s * p.s];
    // Edges move by less than a bench width, so only the nominal bench and its neighbours need checking.
    let k = 0;
    while (k < BENCHES - 1 && rho >= BENCH_EDGE[k + 1]) k++;
    if (k > 0 && rho < benchEdge(k, sc, cs)) k--;
    else if (k < BENCHES - 1 && rho >= benchEdge(k + 1, sc, cs)) k++;
    const t = (rho - benchEdge(k, sc, cs)) / (benchEdge(k + 1, sc, cs) - benchEdge(k, sc, cs));
    const light = lit(p);
    const merged = k === MERGE_BENCH && p.c * MERGE_DIR.c + p.s * MERGE_DIR.s > MERGE_COS;
    if (t < 0.12) paint(r, i, mixTone(92, 167, light), 4);
    else if (t < 0.55 || merged) paint(r, i, mixTone(34, 107, light), 6);
    else paint(r, i, mixTone(55, 77, light), 4);
  });
}

/** Tailings pond: smooth water, a dam crest on the south side (only inside the image band when stacked), a beach at the discharge. */
function paintTailings(r: Raster, lay: MineLayout, crestMaxY: number): void {
  const pond = lay.tailings;
  const BEACH = 0.15;
  const [toward, away] = [Math.cos(-2.3), Math.sin(-2.3)];
  ellipse(r, pond, 0.18, 1.3, (i, p) => {
    const edge = (1 - p.rho) * pond.ry * r.s;
    if (p.rho <= 1) {
      if (edge < 1.5 && p.dy > 0 && pond.cy + p.dy <= crestMaxY) paint(r, i, 165, 4);
      else paint(r, i, 13);
    } else if (p.rho < 1 + BEACH && p.c * toward + p.s * away > 0.6) paint(r, i, 70 + 25 * (1 - (p.rho - 1) / BEACH), 10);
  });
}

interface Octave {
  lat: Float32Array;
  stride: number;
  ix: Int32Array;
  fx: Float32Array;
  iy: Int32Array;
  fy: Float32Array;
}

/** Seeded value noise on a lattice of `cell` CSS px, with per-column and per-row interpolation tables. */
function octave(cell: number, seed: number, r: Raster): Octave {
  const [cols, rows] = [Math.ceil(r.tw / r.s / cell) + 2, Math.ceil(r.th / r.s / cell) + 2];
  const lat = Float32Array.from({ length: cols * rows }, (_, k) => mix((((k % cols) * 73856093) ^ (Math.floor(k / cols) * 19349663) ^ seed) >>> 0) / 2147483648 - 1);
  const axis = (n: number): { i: Int32Array; f: Float32Array } => {
    const pos = Float32Array.from({ length: n }, (_, k) => (k + 0.5) / r.s / cell);
    return { i: Int32Array.from(pos, Math.floor), f: pos.map((p) => ((p % 1) ** 2) * (3 - 2 * (p % 1))) };
  };
  const [ax, ay] = [axis(r.tw), axis(r.th)];
  return { lat, stride: cols, ix: ax.i, fx: ax.f, iy: ay.i, fy: ay.f };
}
const noiseAt = (o: Octave, x: number, y: number): number => {
  const a = o.iy[y] * o.stride + o.ix[x];
  const b = a + o.stride;
  const t = o.fx[x];
  const top = o.lat[a] + (o.lat[a + 1] - o.lat[a]) * t;
  return top + (o.lat[b] + (o.lat[b + 1] - o.lat[b]) * t - top) * o.fy[y];
};

/** Rasterises the ground into a texture-sized canvas (cool-cast grey, no tone mask). */
function buildGround(cssW: number, cssH: number, mode: LayoutMode, band: number, lay: MineLayout): HTMLCanvasElement {
  const s = GROUND_SCALE * Math.min(1, MAX_GROUND_W / (cssW * GROUND_SCALE), MAX_GROUND_H / (cssH * GROUND_SCALE));
  const [tw, th] = [Math.max(1, Math.round(cssW * s)), Math.max(1, Math.round(cssH * s))];
  const r: Raster = { tw, th, s, tone: new Float32Array(tw * th), grain: new Float32Array(tw * th), cap: new Uint8Array(tw * th) };
  paintDump(r, lay);
  paintPit(r, lay);
  paintTailings(r, lay, mode === "side" ? Infinity : NAV_PX + band);

  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const octx = canvas.getContext("2d");
  if (!octx) return canvas;
  const img = octx.createImageData(tw, th);
  const pixels = new Uint32Array(img.data.buffer);
  let state = TERRAIN_SEED;
  const [big, small] = [octave(160, 0x1f3d, r), octave(60, 0x9a71, r)];
  // Two meandering drainage lines (tone 30-34), as the column of each line on every row.
  const creek = (x0: number, amp: number, phase: number): Float32Array =>
    Float32Array.from({ length: th }, (_, y) => (x0 + amp * (Math.sin(6 * (y / th) + phase) + 0.4 * Math.sin(17 * (y / th) + 2 * phase))) * cssW * s);
  const [creekA, creekB] = [creek(0.55, 0.04, 0), creek(0.88, -0.055, 1)];
  // Terrain noise is smooth (cells of 30+ texels), so it is evaluated on every other texel and row.
  const smooth = new Float32Array(tw + 1);
  for (let y = 0; y < th; y++) {
    if ((y & 1) === 0) {
      for (let x = 0; x < tw; x += 2) smooth[x] = smooth[x + 1] = 0.65 * noiseAt(big, x, y) + 0.35 * noiseAt(small, x, y);
    }
    for (let x = 0; x < tw; x++) {
      const i = y * tw + x;
      state = (state + RNG_STEP) >>> 0;
      const grain = speckle(mix(state));
      let g: number;
      // Untouched texels (cap 0) are open terrain: two octaves of value noise plus speckle, mean about 60, crossed by two drainage lines.
      if (r.cap[i] === 0) {
        g = Math.min(TERRAIN_CAP, 46 + 10 * smooth[x] + 14 * grain);
        if (Math.abs(x - creekA[y]) < 0.8) g = 30;
        else if (Math.abs(x - creekB[y]) < 0.8) g = 34;
      }
      else g = Math.min(r.tone[i] + r.grain[i] * grain, r.cap[i]);
      g = Math.max(0, g);
      pixels[i] = 0xff000000 | (g << 16) | (((g * CAST.g) | 0) << 8) | ((g * CAST.r) | 0);
    }
  }
  octx.putImageData(img, 0, 0);
  return canvas;
}

/** A 128x128 tile of seeded grey noise: the fine grain laid over the smoothed ground at 1:1. */
function buildGrain(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = GRAIN_SIZE;
  const c = canvas.getContext("2d");
  if (!c) return canvas;
  const rng = createRng(GRAIN_SEED);
  const img = c.createImageData(GRAIN_SIZE, GRAIN_SIZE);
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = img.data[i + 1] = img.data[i + 2] = (rng() * 255) | 0;
    img.data[i + 3] = 255;
  }
  c.putImageData(img, 0, 0);
  return canvas;
}

type Ctx = CanvasRenderingContext2D;

/** Fills an ellipse (any rotation) with a fill built in its own frame. */
function blob(g: Ctx, e: Ellipse, fill: (rx: number) => string | CanvasGradient): void {
  g.save();
  g.translate(e.cx, e.cy);
  g.rotate(e.rot);
  g.scale(1, e.ry / e.rx);
  g.fillStyle = fill(e.rx);
  g.beginPath();
  g.arc(0, 0, e.rx, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

const line = (g: Ctx, pts: readonly { x: number; y: number }[], width: number, tone: number): void => {
  g.strokeStyle = grey(tone);
  g.lineWidth = width;
  g.lineJoin = g.lineCap = "round";
  g.beginPath();
  pts.forEach((p, k) => (k ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.stroke();
};

/** Stockpiles (shaded cones and a windrow), conveyor, plant and roads as anti-aliased vector shapes. */
function paintBuilt(g: Ctx, lay: MineLayout, dpr: number): void {
  const shadow = (on: boolean): void => void Object.assign(g, on ? { shadowColor: SHADOW.color, shadowOffsetX: SHADOW.offset * dpr, shadowOffsetY: SHADOW.offset * dpr, shadowBlur: SHADOW.blur * dpr } : { shadowColor: "transparent", shadowOffsetX: 0, shadowOffsetY: 0, shadowBlur: 0 });
  const R = lay.radius;
  const { plant } = lay;
  line(g, lay.accessRoad, 1.5, 120);
  line(g, lay.haulRoad, 4, 142);

  // Stockpiles: soft south-east shadows first, then cones and the windrow shaded from the north-west light.
  const S = lay.anchors.stockpile;
  const toPlant = Math.atan2(plant.cy - S.y, plant.cx - S.x);
  blob(g, { cx: S.x, cy: S.y, rx: 0.4 * R, ry: 0.17 * R, rot: toPlant }, () => grey(72));
  const piles: Ellipse[] = [...lay.stockpiles.map((c) => ({ cx: c.x, cy: c.y, rx: c.r, ry: c.r, rot: 0 })), lay.windrow];
  for (const e of piles) blob(g, { ...e, cx: e.cx + 0.55 * e.rx, cy: e.cy + 0.55 * e.rx, rx: e.rx * 1.4, ry: e.ry * 1.4 }, (rx) => {
    const sh = g.createRadialGradient(0, 0, 0.3 * rx, 0, 0, rx);
    sh.addColorStop(0, "rgba(0,0,0,0.4)");
    sh.addColorStop(1, "rgba(0,0,0,0)");
    return sh;
  });
  for (const e of piles) {
    blob(g, e, (rx) => {
      const [a, b] = [0.7 * rx * Math.cos(Math.PI / 4 - e.rot), 0.7 * rx * Math.sin(Math.PI / 4 - e.rot)];
      const lg = g.createLinearGradient(a, b / (e.ry / e.rx), -a, -b / (e.ry / e.rx));
      lg.addColorStop(0, grey(55));
      lg.addColorStop(1, grey(175));
      return lg;
    });
  }

  // Conveyor with two transfer towers.
  line(g, lay.conveyor, 1.25, 200);
  shadow(true);
  g.fillStyle = grey(215);
  for (const p of lay.conveyor) g.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
  shadow(false);

  // Plant, drawn in its own rotated frame.
  g.save();
  g.translate(plant.cx, plant.cy);
  g.rotate(plant.rot);
  g.fillStyle = grey(72);
  g.fillRect(-plant.hw - 6, -plant.hh - 6, 2 * plant.hw + 12, 2 * plant.hh + 12);
  line(g, [{ x: -plant.hw, y: -0.26 * plant.hh }, { x: plant.hw, y: -0.26 * plant.hh }], 1, 110);
  line(g, [{ x: 0.26 * plant.hw, y: -plant.hh }, { x: 0.26 * plant.hw, y: plant.hh }], 1, 110);
  for (const roof of plant.roofs) {
    const { u, v, hw, hh, tone } = roof;
    shadow(true);
    g.fillStyle = grey(tone);
    g.fillRect(u - hw, v - hh, 2 * hw, 2 * hh);
    shadow(false);
    if (roof.gable) {
      const along = hw >= hh;
      g.fillStyle = grey(tone + 12);
      if (along) g.fillRect(u - hw, v - hh, 2 * hw, hh);
      else g.fillRect(u - hw, v - hh, hw, 2 * hh);
      g.fillStyle = grey(tone - 12);
      if (along) g.fillRect(u - hw, v, 2 * hw, hh);
      else g.fillRect(u, v - hh, hw, 2 * hh);
    } else {
      g.strokeStyle = grey(tone * 0.7);
      g.lineWidth = 1;
      g.strokeRect(u - hw + 0.5, v - hh + 0.5, 2 * hw - 1, 2 * hh - 1);
    }
  }
  for (const t of plant.tanks) {
    shadow(true);
    g.fillStyle = grey(t.big ? 80 : 85);
    g.beginPath();
    g.arc(t.u, t.v, t.r, 0, Math.PI * 2);
    g.fill();
    shadow(false);
    g.strokeStyle = grey(190);
    g.lineWidth = t.big ? 1.25 : 1;
    g.stroke();
    if (t.big) line(g, [{ x: t.u - t.r, y: t.v }, { x: t.u + t.r, y: t.v }], 1, 190);
  }
  g.restore();

}

export const createMineScene: SceneFactory = (ctx, tokens) => {
  let cache: HTMLCanvasElement | null = null;
  let layout: MineLayout | null = null;
  let grain: HTMLCanvasElement | null = null;
  let [cssW, cssH, scale, band] = [0, 0, 1, 0];
  let mode: LayoutMode = "side";

  /** One scan line (wash then 1 px core, snapped to the device grid) in CSS px. */
  function scan(x: number): void {
    const wash = ctx.createLinearGradient(x - SCAN_TRAIL_PX, 0, x, 0);
    wash.addColorStop(0, `hsl(${tokens.accent} / 0)`);
    wash.addColorStop(1, `hsl(${tokens.accent} / 0.1)`);
    ctx.fillStyle = wash;
    ctx.fillRect(x - SCAN_TRAIL_PX, 0, SCAN_TRAIL_PX, cssH);
    ctx.fillStyle = `hsl(${tokens.accent} / 0.55)`;
    ctx.fillRect(Math.round(x * scale) / scale, 0, 1, cssH);
  }

  return {
    STILL_PHASE: MINE_STILL_PHASE,
    resize(w, h, dpr, nextMode, bandPx): void {
      [cssW, cssH, scale, mode, band] = [w, h, dpr, nextMode, bandPx];
      layout = mineLayout(w, h, mode, band);
      const [W, H] = [ctx.canvas.width, ctx.canvas.height];
      cache = document.createElement("canvas");
      cache.width = W;
      cache.height = H;
      const g = cache.getContext("2d");
      if (!g) return;
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";
      g.drawImage(buildGround(w, h, mode, band, layout), 0, 0, W, H);
      grain ??= buildGrain();
      const tile = g.createPattern(grain, "repeat");
      if (tile) {
        g.globalCompositeOperation = "overlay";
        g.globalAlpha = GRAIN_ALPHA;
        g.fillStyle = tile;
        g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = "source-over";
        g.globalAlpha = 1;
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintBuilt(g, layout, dpr);
      // Tone mask: a multiply gradient that darkens the text side.
      g.setTransform(1, 0, 0, 1, 0, 0);
      const side = mode === "side";
      const fade = side ? g.createLinearGradient(0, 0, W, 0) : g.createLinearGradient(0, 0, 0, H);
      for (let k = 0; k <= MASK_STOPS; k++) {
        const p = k / MASK_STOPS;
        const m = side ? toneMask(p * w, 0, w, mode, band, MASK_FLOOR.side) : toneMask(0, p * h, w, mode, band, MASK_FLOOR.stacked);
        fade.addColorStop(p, `rgb(${(m * 255) | 0},${(m * 255) | 0},${(m * 255) | 0})`);
      }
      g.globalCompositeOperation = "multiply";
      g.fillStyle = fade;
      g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = "source-over";
    },
    draw(phaseMs): void {
      if (!cache) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(cache, 0, 0);
      const x = scanX(phaseMs, cssW);
      if (x === null) return;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      if (mode === "side") return scan(x);
      // Stacked: the line stays inside the image band and fades out over the text.
      const end = NAV_PX + band + SCAN_STACKED_MARGIN_PX;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, cssW, end);
      ctx.clip();
      scan(x);
      ctx.restore();
      const step = SCAN_FADE_PX / SCAN_FADE_STEPS;
      for (let k = 0; k < SCAN_FADE_STEPS; k++) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, end + k * step, cssW, step);
        ctx.clip();
        ctx.globalAlpha = 1 - (k + 0.5) / SCAN_FADE_STEPS;
        scan(x);
        ctx.restore();
      }
    },
    anchors: (): Partial<Record<MineAnchor, Footprint>> => layout?.anchors ?? {},
  };
};
