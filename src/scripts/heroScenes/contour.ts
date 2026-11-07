import {
  CONTOUR_STILL_PHASE,
  contourHeight,
  contourLayout,
  isolines,
  sweepAngle,
  toneMask,
  type ContourLayout,
} from "@/lib/heroScene/layout";
import type { LayoutMode, SceneFactory } from "@/lib/heroScene/types";

const GRID_PX = 6;
const LEVEL_STEP = 0.22;
const MASK_FLOOR = 0.5;
const MASK_STOPS = 12;
const SWEEP_TRAIL_DEG = 32;
const SWEEP_RADIUS_PAD = 1;

function toPath(segments: readonly number[]): Path2D {
  const path = new Path2D();
  for (let i = 0; i < segments.length; i += 4) {
    path.moveTo(segments[i], segments[i + 1]);
    path.lineTo(segments[i + 2], segments[i + 3]);
  }
  return path;
}

/** Topographic contours with a slow rotating sweep, for inner-page heroes. */
export const createContourScene: SceneFactory = (ctx, tokens) => {
  let layer: HTMLCanvasElement | null = null;
  let geometry: ContourLayout = { cx: 0, cy: 0, rings: [] };
  let cssW = 0;
  let cssH = 0;
  let scale = 1;

  function buildLayer(w: number, h: number, dpr: number, mode: LayoutMode, band: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    const o = canvas.getContext("2d");
    if (!o) return canvas;
    o.scale(dpr, dpr);
    o.fillStyle = `hsl(${tokens.primary})`;
    o.fillRect(0, 0, w, h);
    const lines = isolines(contourHeight, w, h, GRID_PX, LEVEL_STEP);
    o.lineWidth = 1;
    o.strokeStyle = `hsl(${tokens.accent} / 0.32)`;
    o.stroke(toPath(lines.minor));
    o.strokeStyle = `hsl(${tokens.accent} / 0.5)`;
    o.stroke(toPath(lines.major));
    // Tone mask: navy over the text side, with the same ramp as the mine scene.
    const side = mode === "side";
    const fade = side ? o.createLinearGradient(0, 0, w, 0) : o.createLinearGradient(0, 0, 0, h);
    for (let k = 0; k <= MASK_STOPS; k++) {
      const p = k / MASK_STOPS;
      const m = side ? toneMask(p * w, 0, w, mode, band, MASK_FLOOR) : toneMask(0, p * h, w, mode, band, MASK_FLOOR);
      fade.addColorStop(p, `hsl(${tokens.primary} / ${1 - m})`);
    }
    o.fillStyle = fade;
    o.fillRect(0, 0, w, h);
    return canvas;
  }

  return {
    STILL_PHASE: CONTOUR_STILL_PHASE,
    resize(w, h, dpr, mode, bandPx): void {
      cssW = w;
      cssH = h;
      scale = dpr;
      geometry = contourLayout(w, h, mode, bandPx);
      layer = buildLayer(w, h, dpr, mode, bandPx);
    },
    draw(phaseMs): void {
      if (!layer) return;
      const { cx, cy, rings } = geometry;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layer, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      if (typeof ctx.createConicGradient === "function") {
        const trail = SWEEP_TRAIL_DEG / 360;
        const sweep = ctx.createConicGradient(sweepAngle(phaseMs) - trail * Math.PI * 2, cx, cy);
        sweep.addColorStop(0, `hsl(${tokens.accent} / 0)`);
        sweep.addColorStop(trail, `hsl(${tokens.accent} / 0.18)`);
        sweep.addColorStop(Math.min(1, trail + 0.0005), `hsl(${tokens.accent} / 0)`);
        sweep.addColorStop(1, `hsl(${tokens.accent} / 0)`);
        ctx.fillStyle = sweep;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.hypot(cssW, cssH) + SWEEP_RADIUS_PAD, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsl(${tokens.accent} / 0.14)`;
      for (const radius of rings) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = `hsl(${tokens.accent} / 0.2)`;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsl(${tokens.accent} / 0.9)`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    },
  };
};
