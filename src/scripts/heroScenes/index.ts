import type { HeroBackgroundVariant, SceneFactory } from "@/lib/heroScene/types";
import { createContourScene } from "./contour";
import { createMineScene } from "./mine";

/** Adding a variant: extend HERO_BG_VARIANTS, add a scene file, register it here. `npm run check` enforces all three. */
export const SCENES: Record<HeroBackgroundVariant, SceneFactory> = {
  mine: createMineScene,
  contour: createContourScene,
};
