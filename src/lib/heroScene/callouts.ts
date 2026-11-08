import type { HeroCallout } from "./types.ts";

/** Hard cap on callouts per scene: restraint is part of the design. */
export const MAX_CALLOUTS = 2;

/** Mock activity readings. The note "Illustrative" is shown next to them on the scene. */
export const MINE_CALLOUTS: readonly HeroCallout[] = [
  { anchor: "stockpile", label: "TIER-4 SUPPLIER · STOCKPILE ↑ 2.1×", tone: "signal" },
  { anchor: "plant", label: "PROCESSING · ACTIVITY ↓ 38%", tone: "alert" },
];
