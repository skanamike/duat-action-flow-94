/**
 * Pure-function tests for the hero background scenes (src/lib/heroScene) plus the content rules
 * from the design spec: no method-specific terms in any shipped source of the component.
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { createRng, mix, RNG_STEP, speckle } from "../../src/lib/heroScene/rng.ts";
import {
  BAND_MAX_PX,
  BAND_MIN_PX,
  CONTOUR_STILL_PHASE,
  MAX_BACKING_PIXELS,
  MINE_STILL_PHASE,
  NAV_PX,
  PROOF_ZONE_PX,
  TEXT_SAFE_X,
  backingStore,
  bandFor,
  brightItems,
  contourLayout,
  ellipseBounds,
  footprintHits,
  isolines,
  leaderSegment,
  mineLayout,
  pitBounds,
  placeCallout,
  scanPhaseFor,
  scanX,
  sweepAngle,
  toneMask,
} from "../../src/lib/heroScene/layout.ts";
import { MAX_CALLOUTS, MINE_CALLOUTS } from "../../src/lib/heroScene/callouts.ts";
import { HERO_BG_VARIANTS } from "../../src/lib/heroScene/types.ts";
import type { Box, Footprint, MineAnchor } from "../../src/lib/heroScene/types.ts";
import { findBanned } from "../support/bannedTerms.ts";

const read = (p: string): string => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

describe("createRng / speckle (AC-1)", () => {
  test("same seed gives an identical sequence, all values in [0, 1)", () => {
    const a = createRng(0x5eed01);
    const b = createRng(0x5eed01);
    for (let i = 0; i < 2000; i++) {
      const v = a();
      assert.equal(v, b());
      assert.ok(v >= 0 && v < 1, `value ${v} out of range`);
    }
  });

  test("different seeds give different sequences", () => {
    const a = createRng(1);
    const b = createRng(2);
    assert.notEqual([a(), a(), a()].join(), [b(), b(), b()].join());
  });

  test("speckle(mix(counter)) is deterministic, positive and has a mean near 1", () => {
    let state = 0xd0a7;
    let sum = 0;
    const n = 40000;
    for (let i = 0; i < n; i++) {
      state = (state + RNG_STEP) >>> 0;
      const v = speckle(mix(state));
      assert.ok(v > 0 && Number.isFinite(v));
      sum += v;
    }
    assert.ok(Math.abs(sum / n - 1) < 0.05, `mean ${sum / n}`);
  });
});

describe("mineLayout, side mode (AC-2)", () => {
  const sizes: Array<[number, number]> = [
    [1440, 900],
    [1280, 800],
    [1100, 700],
    [1920, 1080],
  ];
  for (const [w, h] of sizes) {
    test(`${w}x${h}: pit clear of the text column, bright elements right of ${TEXT_SAFE_X}w, plant in frame`, () => {
      const lay = mineLayout(w, h, "side", bandFor(h));
      assert.ok(pitBounds(lay).minX >= 0.48 * w, "pit bbox left edge (main ellipse and lobe)");
      assert.ok(brightItems(lay).length > 0);
      for (const item of brightItems(lay)) assert.ok(item.minX >= TEXT_SAFE_X * w, `${item.name} minX ${item.minX} < ${TEXT_SAFE_X * w}`);
      const names = brightItems(lay).map((b) => b.name);
      assert.ok(names.includes("plant") && names.includes("stockpile0") && names.includes("windrow") && names.includes("conveyor"));
      assert.ok(lay.plant.cx > 0 && lay.plant.cx < w && lay.plant.cy > 0 && lay.plant.cy < h, "plant centre inside the frame");
      for (const p of Object.values(lay.anchors)) assert.ok(p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h);
    });
  }

  test("the scene has the expected parts", () => {
    const lay = mineLayout(1440, 900, "side", bandFor(900));
    assert.ok(brightItems(lay).every((b) => b.tone >= 175));
    assert.equal(lay.stockpiles.length, 3);
    assert.ok(lay.windrow.rx / lay.windrow.ry > 2.2 && lay.windrow.rx / lay.windrow.ry < 2.8, "windrow is about 2.5:1");
    const { roofs, tanks } = lay.plant;
    assert.equal(roofs.length, 6);
    const mill = roofs.reduce((a, b) => (a.hw / a.hh > b.hw / b.hh ? a : b));
    assert.ok(mill.hw / mill.hh > 2.5 && mill.hw / mill.hh < 3.6, "one long mill at about 3:1");
    assert.ok(roofs.every((r) => r.tone >= 170 && r.tone <= 229) && roofs.filter((r) => r.tone >= 222).length <= 1, "roof tones 170-215 with at most one near 225");
    assert.equal(tanks.filter((t) => t.big).length, 2);
    assert.ok(tanks.filter((t) => !t.big).length >= 1 && tanks.filter((t) => !t.big).length <= 2);
    assert.ok(Math.abs(tanks.find((t) => t.big)!.r / lay.radius - 0.08) < 1e-9);
    assert.ok(lay.haulRoad.length > 50 && lay.conveyor.length === 2);
    const lobe = ellipseBounds(lay.pitLobe);
    assert.ok(lobe.minX < lay.pit.cx - 0.5 * lay.radius && lay.pitLobe.rx === 0.55 * lay.radius && lay.pitLobe.ry === 0.45 * lay.radius, "pit has its lobe");
    assert.equal(lay.pit.ry / lay.pit.rx, 0.7);
  });
});

describe("mineLayout, stacked mode (AC-3)", () => {
  const sizes: Array<[number, number]> = [
    [412, 915],
    [360, 640],
    [768, 1024],
  ];
  for (const [w, h] of sizes) {
    test(`${w}x${h}: pit and plant inside the image band`, () => {
      const band = bandFor(h);
      const lay = mineLayout(w, h, "stacked", band);
      const bottom = NAV_PX + band;
      assert.ok(lay.pit.cy >= NAV_PX && lay.pit.cy <= bottom, "pit centre in band");
      assert.ok(lay.plant.cy >= NAV_PX && lay.plant.cy <= bottom, "plant centre in band");
      assert.ok(pitBounds(lay).maxY <= bottom + 8, `pit bottom ${pitBounds(lay).maxY} vs ${bottom + 8}`);
      assert.ok(lay.plant.cx > 0 && lay.plant.cx < w);
      assert.equal(lay.stockpiles.length, 3);
    });
  }
});

test("layouts are deterministic (pure function of their arguments)", () => {
  assert.deepEqual(mineLayout(1440, 900, "side", 270), mineLayout(1440, 900, "side", 270));
  assert.deepEqual(mineLayout(412, 915, "stacked", 258), mineLayout(412, 915, "stacked", 258));
  assert.notDeepEqual(mineLayout(1440, 900, "side", 270).pit, mineLayout(1280, 800, "side", 270).pit);
});

describe("scanX (AC-4)", () => {
  const w = 1440;
  test("starts at -0.08w, ends at 1.08w, rests off-screen", () => {
    assert.equal(scanX(0, w), -0.08 * w);
    assert.equal(scanX(10000, w), null);
    assert.equal(scanX(13999, w), null);
    assert.equal(scanX(14000, w), -0.08 * w);
    assert.ok(Math.abs((scanX(9999.999, w) ?? 0) - 1.08 * w) < 0.01);
  });
  test("the still frame has no scan line, and it appears within 2 s of motion starting", () => {
    assert.ok(MINE_STILL_PHASE >= 13000 && MINE_STILL_PHASE <= 13500);
    assert.equal(scanX(MINE_STILL_PHASE, w), null);
    assert.notEqual(scanX(MINE_STILL_PHASE + 2000, w), null);
  });
  test("scanPhaseFor inverts scanX", () => {
    for (const phase of [0, 1234, 5000, 8000, 9999]) assert.ok(Math.abs(scanPhaseFor(scanX(phase, w) ?? 0, w) - phase) < 1e-6, String(phase));
  });
  test("moves left to right and handles negative phases", () => {
    assert.ok((scanX(5000, w) ?? 0) > (scanX(4000, w) ?? 0));
    assert.equal(scanX(-4000, w), scanX(10000, w));
  });
});

describe("sweepAngle", () => {
  test("one revolution per 10 s, clockwise, still frame at about 35 degrees", () => {
    assert.equal(sweepAngle(0), 0);
    assert.ok(Math.abs(sweepAngle(5000) - Math.PI) < 1e-9);
    assert.ok(Math.abs(sweepAngle(10000)) < 1e-9);
    assert.ok(Math.abs((sweepAngle(CONTOUR_STILL_PHASE) * 180) / Math.PI - 35) < 0.1);
  });
});

describe("backingStore (AC-5)", () => {
  test("caps DPR at 2 and never goes below 1", () => {
    assert.equal(backingStore(1000, 600, 1), 1);
    assert.equal(backingStore(412, 915, 2.625), 2);
    assert.equal(backingStore(412, 915, 3), 2);
    assert.equal(backingStore(412, 915, 0.5), 1);
    assert.equal(backingStore(412, 915, Number.NaN), 1);
  });
  test("reduces the scale to stay within 4.2 megapixels", () => {
    const d = backingStore(2560, 1440, 2);
    assert.ok(d >= 1 && d < 2);
    assert.ok(Math.round(2560 * d) * Math.round(1440 * d) <= MAX_BACKING_PIXELS);
    assert.equal(backingStore(5000, 3000, 2), 1);
  });
});

describe("bandFor", () => {
  test("mirrors clamp(11rem, 30svh, 18rem)", () => {
    assert.equal(bandFor(400), BAND_MIN_PX);
    assert.equal(bandFor(2000), BAND_MAX_PX);
    assert.equal(bandFor(844), 844 * 0.3);
  });
});

describe("toneMask", () => {
  test("side: floor up to 40% of the width, 1 from 60%, never decreasing", () => {
    const w = 1000;
    assert.equal(toneMask(0, 0, w, "side", 0, 0.35), 0.35);
    assert.equal(toneMask(400, 0, w, "side", 0, 0.35), 0.35);
    assert.equal(toneMask(600, 0, w, "side", 0, 0.35), 1);
    assert.equal(toneMask(1000, 0, w, "side", 0, 0.35), 1);
    let prev = 0;
    for (let x = 0; x <= w; x += 10) {
      const m = toneMask(x, 0, w, "side", 0, 0.35);
      assert.ok(m >= prev);
      prev = m;
    }
  });
  test("stacked: 1 inside the band, floor 200px below it", () => {
    const band = 250;
    assert.equal(toneMask(0, NAV_PX + band, 400, "stacked", band, 0.45), 1);
    assert.equal(toneMask(0, NAV_PX + band + 200, 400, "stacked", band, 0.45), 0.45);
    assert.equal(toneMask(0, 5000, 400, "stacked", band, 0.45), 0.45);
  });
});

describe("placeCallout (AC-6, MF-8)", () => {
  const size = { w: 230, h: 29 };
  const bounds = (w: number, h: number) => (b: Box): boolean => b.x >= 0.58 * w - 1e-6 && b.x + b.w <= w - 16 && b.y >= NAV_PX + 24 && b.y + b.h <= h - PROOF_ZONE_PX;
  const feature: Footprint = { x: 1131, y: 600, hw: 60, hh: 30 };

  test("above puts the label over the feature's top edge with a 32px leader, below under it with 28px", () => {
    const above = placeCallout({ footprint: feature, size, prefer: "above" }, 1440, 900);
    assert.deepEqual(above.marker, { x: 1131, y: 570 });
    assert.equal(above.box.y + above.box.h, 570 - 32);
    const below = placeCallout({ footprint: { ...feature, y: 400 }, size, prefer: "below" }, 1440, 900);
    assert.equal(below.box.y, 430 + 28);
    assert.equal(leaderSegment(below.marker, below.box).length, 28);
  });

  test("clamps into x [0.58w, w-16] and y [nav+24, h-160] for any anchor", () => {
    const inZone = bounds(1440, 900);
    for (const x of [0, 300, 700, 1300, 1440, 2000]) {
      for (const y of [100, 300, 500, 700, 900]) {
        for (const prefer of ["below", "above"] as const) {
          const r = placeCallout({ footprint: { x, y, hw: 40, hh: 20 }, size, prefer }, 1440, 900);
          assert.ok(inZone(r.box), `${x},${y} ${prefer} -> ${JSON.stringify(r.box)}`);
        }
      }
    }
  });

  test("falls back above -> below -> left when a side is blocked", () => {
    const blocker: Footprint = { x: 1131, y: 500, hw: 400, hh: 40 };
    const r = placeCallout({ footprint: feature, size, prefer: "above", avoid: [blocker] }, 1440, 900);
    assert.ok(r.box.y > feature.y, "above is blocked, so the label goes below");
    assert.ok(!footprintHits(blocker, r.box, 8));
  });

  test("two callouts never overlap, even with identical features", () => {
    const first = placeCallout({ footprint: feature, size, prefer: "above" }, 1440, 900);
    const second = placeCallout({ footprint: feature, size: { w: 250, h: 29 }, prefer: "above" }, 1440, 900, [first.box]);
    const [a, b] = [first.box, second.box];
    assert.ok(a.x >= b.x + b.w + 8 || b.x >= a.x + a.w + 8 || a.y >= b.y + b.h + 8 || b.y >= a.y + a.h + 8, `${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  });

  /** Label width at 11px mono with 0.06em spacing, 8px padding and a 1px border. */
  const labelBox = (text: string): { w: number; h: number } => ({ w: Math.ceil(text.length * 7.3 + 18), h: 29 });

  for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
    test(`${w}x${h}: both shipped labels fit, clear their feature, the pit and each other by 8px, with 24-72px leaders`, () => {
      const lay = mineLayout(w, h, "side", bandFor(h));
      const placed: Box[] = [];
      for (const c of MINE_CALLOUTS) {
        const own = lay.anchors[c.anchor];
        const others = (Object.keys(lay.anchors) as MineAnchor[]).filter((k) => k !== c.anchor).map((k) => lay.anchors[k]);
        const r = placeCallout({ footprint: own, size: labelBox(c.label), prefer: c.anchor === "plant" ? "above" : "below", avoid: others }, w, h, placed);
        assert.ok(bounds(w, h)(r.box), `${c.anchor} inside the zone: ${JSON.stringify(r.box)}`);
        assert.ok(!footprintHits(own, r.box, 8), `${c.anchor} label overlaps its own footprint`);
        for (const o of others) assert.ok(!footprintHits(o, r.box, 8), `${c.anchor} label overlaps another feature or the pit`);
        const leader = leaderSegment(r.marker, r.box).length;
        assert.ok(leader >= 24 && leader <= 72, `${c.anchor} leader ${leader}`);
        for (const p of placed) assert.ok(!footprintHits({ x: p.x + p.w / 2, y: p.y + p.h / 2, hw: p.w / 2, hh: p.h / 2 }, r.box, 8), "labels overlap");
        placed.push(r.box);
      }
    });
  }
});

describe("the 'Illustrative' note (MF-9)", () => {
  test("in the top-right corner it overlaps no built feature, the pit or the dump at 1100, 1280, 1440 and 1920", () => {
    for (const [w, h] of [[1100, 700], [1280, 800], [1440, 900], [1920, 1080]] as const) {
      const lay = mineLayout(w, h, "side", bandFor(h));
      const note: Box = { x: w - 16 - 104, y: NAV_PX + 12, w: 104, h: 20 };
      const features: Array<[string, Footprint]> = [
        ["dump", { x: lay.dump.cx, y: lay.dump.cy, hw: lay.dump.rx, hh: lay.dump.ry, round: true, rot: lay.dump.rot }],
        ["pit lobe", { x: lay.pitLobe.cx, y: lay.pitLobe.cy, hw: lay.pitLobe.rx, hh: lay.pitLobe.ry, round: true, rot: lay.pitLobe.rot }],
        ...(Object.entries(lay.anchors) as Array<[string, Footprint]>),
      ];
      for (const [name, f] of features) assert.ok(!footprintHits(f, note, 8), `${w}x${h}: note overlaps ${name}`);
    }
  });
});

describe("contour helpers", () => {
  test("isolines of a linear ramp are vertical lines at multiples of the step, every 5th is an index line", () => {
    const step = 0.2;
    const { minor, major } = isolines((x) => x / 100, 300, 120, 6, step);
    assert.ok(minor.length > 0 && major.length > 0);
    const levelOf = (x: number): number => Math.round((x / 100) / step);
    for (let i = 0; i < minor.length; i += 4) {
      assert.ok(Math.abs(minor[i] - minor[i + 2]) < 1e-6, "vertical");
      assert.ok(Math.abs(minor[i] / 100 - levelOf(minor[i]) * step) < 1e-6);
      assert.notEqual(levelOf(minor[i]) % 5, 0);
    }
    for (let i = 0; i < major.length; i += 4) assert.equal(levelOf(major[i]) % 5, 0);
  });
  test("contourLayout places the sweep centre per mode with three rings", () => {
    const side = contourLayout(1440, 900, "side", 270);
    assert.equal(side.cx, 0.78 * 1440);
    assert.deepEqual(side.rings, [90, 180, 270]);
    const stacked = contourLayout(400, 800, "stacked", 240);
    assert.equal(stacked.cy, NAV_PX + 120);
    assert.deepEqual(stacked.rings, [40, 80, 120]);
  });
});

describe("callout copy and registry", () => {
  test("default callouts are the two approved activity statements", () => {
    assert.ok(MINE_CALLOUTS.length <= MAX_CALLOUTS);
    assert.deepEqual(
      MINE_CALLOUTS.map((c) => [c.anchor, c.label, c.tone]),
      [
        ["stockpile", "TIER-4 SUPPLIER · STOCKPILE ↑ 2.1×", "signal"],
        ["plant", "PROCESSING · ACTIVITY ↓ 38%", "alert"],
      ],
    );
  });

  test("the scene registry has a factory for every variant (AC-8; `npm run check` also enforces it)", () => {
    const registry = read("src/scripts/heroScenes/index.ts");
    for (const variant of HERO_BG_VARIANTS) assert.match(registry, new RegExp(`^\\s+${variant}:\\s+create\\w+Scene,$`, "m"), variant);
  });
});

describe("method-neutral wording (AC-7)", () => {
  const files = [
    "src/components/HeroBackground.astro",
    "src/scripts/heroBackground.ts",
    ...readdirSync(new URL("../../src/scripts/heroScenes", import.meta.url)).map((f) => `src/scripts/heroScenes/${f}`),
    ...readdirSync(new URL("../../src/lib/heroScene", import.meta.url)).map((f) => `src/lib/heroScene/${f}`),
  ];

  test("the scanned file set covers the component, glue, scenes and lib", () => {
    for (const f of ["src/components/HeroBackground.astro", "src/scripts/heroBackground.ts", "src/scripts/heroScenes/mine.ts", "src/scripts/heroScenes/contour.ts", "src/lib/heroScene/layout.ts", "src/lib/heroScene/callouts.ts"]) {
      assert.ok(files.includes(f), `${f} not scanned`);
    }
  });

  for (const file of files) {
    test(`${file} has no banned terms (code, comments, strings)`, () => {
      assert.deepEqual(findBanned(read(file)), []);
    });
  }

  test("the scanner itself flags each banned term and ignores look-alike words", () => {
    for (const bad of ["SAR scene", "a Radar sweep", "backscatter", "Sentinel-1", "Copernicus", "InSAR", "interferometric", "polarimetry", "C-band", "x-band", "−38 dB", "synthetic aperture"]) {
      assert.ok(findBanned(bad).length > 0, bad);
    }
    for (const fine of ["scan line", "database", "activity", "transparent", "disarm", "Sarah"]) {
      assert.deepEqual(findBanned(fine), [], fine);
    }
  });

  test("the callout copy is method-neutral", () => {
    for (const c of MINE_CALLOUTS) assert.deepEqual(findBanned(c.label), []);
  });
});
