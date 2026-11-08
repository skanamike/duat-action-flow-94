import { SCENES } from "./heroScenes";
import { backingStore, bandFor, leaderSegment, placeCallout } from "@/lib/heroScene/layout";
import type { Box, HeroBackgroundVariant, LayoutMode, MineAnchor } from "@/lib/heroScene/types";

const FRAME_MIN_MS = 32;
const RESIZE_DEBOUNCE_MS = 150;
const SIZE_EPSILON_PX = 1;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** DOM glue for one hero background: sizing, the frame loop, pausing rules and callout placement. */
function mount(root: HTMLElement): void {
  const canvas = root.querySelector<HTMLCanvasElement>(".hero-bg__canvas");
  const ctx = canvas?.getContext("2d");
  const factory = SCENES[root.dataset.heroBg as HeroBackgroundVariant];
  if (!canvas || !ctx || !factory) return;
  const surface: HTMLCanvasElement = canvas;

  const rootStyle = getComputedStyle(document.documentElement);
  const scene = factory(ctx, { primary: rootStyle.getPropertyValue("--primary").trim(), accent: rootStyle.getPropertyValue("--accent").trim() });
  const reduce = matchMedia(MOTION_QUERY);
  const callouts = [...root.querySelectorAll<HTMLElement>(".hero-bg__callout")];

  let width = 0;
  let height = 0;
  let mode: LayoutMode = "stacked";
  let phase = scene.STILL_PHASE;
  let frameId = 0;
  let lastTs: number | null = null;
  let visible = true;
  let resizeTimer = 0;

  const animated = (): boolean => root.dataset.motion !== "still" && !reduce.matches;

  function placeCallouts(): void {
    const feet = scene.anchors?.() ?? {};
    const placed: Box[] = [];
    for (const el of callouts) {
      const name = el.dataset.anchor as MineAnchor;
      const label = el.querySelector<HTMLElement>(".hero-bg__label");
      const reticle = el.querySelector<HTMLElement>(".hero-bg__reticle");
      const leader = el.querySelector<HTMLElement>(".hero-bg__leader");
      if (!feet[name] || !label || !reticle || !leader || getComputedStyle(el).display === "none") continue;
      const avoid = Object.entries(feet).filter(([key]) => key !== name).map(([, f]) => f);
      const { box, marker } = placeCallout(
        { footprint: feet[name], size: { w: label.offsetWidth, h: label.offsetHeight }, prefer: name === "plant" ? "above" : "below", avoid },
        width,
        height,
        placed,
      );
      placed.push(box);
      const line = leaderSegment(marker, box);
      reticle.style.translate = `${marker.x}px ${marker.y}px`;
      label.style.translate = `${box.x}px ${box.y}px`;
      leader.style.width = `${line.length}px`;
      leader.style.translate = `${marker.x}px ${marker.y}px`;
      leader.style.rotate = `${line.angle}rad`;
    }
  }

  function layout(force: boolean): void {
    const w = root.clientWidth;
    const h = root.clientHeight;
    const next: LayoutMode = getComputedStyle(root).getPropertyValue("--hero-bg-layout").trim() === "side" ? "side" : "stacked";
    if (w < 1 || h < 1) return;
    if (!force && Math.abs(w - width) < SIZE_EPSILON_PX && Math.abs(h - height) < SIZE_EPSILON_PX && next === mode) return;
    width = w;
    height = h;
    mode = next;
    const dpr = backingStore(w, h, window.devicePixelRatio);
    surface.width = Math.round(w * dpr);
    surface.height = Math.round(h * dpr);
    const started = performance.now();
    scene.resize(w, h, dpr, mode, bandFor(window.innerHeight));
    performance.measure("hero-bg:build", { start: started });
    scene.draw(phase);
    placeCallouts();
    root.setAttribute("data-ready", "");
  }

  function frame(now: number): void {
    frameId = requestAnimationFrame(frame);
    if (lastTs !== null && now - lastTs < FRAME_MIN_MS) return;
    phase += lastTs === null ? 0 : now - lastTs;
    lastTs = now;
    scene.draw(phase);
  }

  /** Runs the loop only while motion is allowed, the layer is on screen and the tab is visible. */
  function sync(): void {
    const run = animated() && visible && !document.hidden;
    if (run && !frameId) {
      lastTs = null;
      frameId = requestAnimationFrame(frame);
    } else if (!run && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }

  layout(true);
  sync();

  reduce.addEventListener("change", () => {
    if (!animated()) {
      phase = scene.STILL_PHASE;
      scene.draw(phase);
    }
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }).observe(root);
  }
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => layout(false), RESIZE_DEBOUNCE_MS);
    }).observe(root);
  }
}

export function initHeroBackgrounds(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>("[data-hero-bg]").forEach(mount);
}
