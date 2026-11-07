import type { Locator } from "@playwright/test";
import sharp from "sharp";

export type Rgb = readonly [number, number, number];

/** WCAG relative luminance of an sRGB colour (0–255 channels). */
export function luminance(r: number, g: number, b: number): number {
  const lin = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(l1: number, l2: number): number {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Parses "rgb(r, g, b)" / "rgba(r, g, b, a)" computed colours. */
export function parseRgb(css: string): Rgb {
  const m = css.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) throw new Error(`Not an rgb() colour: ${css}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/**
 * Worst-case contrast between text of colour `text` and the pixels actually rendered behind an element.
 * All text in the element and its descendants is made invisible (including gradient-clipped text, whose
 * gradient would otherwise be captured as "background"), the element is screenshotted, and every pixel is
 * compared with the text colour: gradients, imagery and animated overlays are measured at their worst point.
 * (Replaces the alpha-only check that passed for the wrong reason; dual review R7/R8.)
 */
export async function worstContrastAgainst(element: Locator, text: Rgb): Promise<number> {
  await element.evaluate((el) => {
    const nodes = [el as HTMLElement, ...Array.from(el.querySelectorAll<HTMLElement>("*"))];
    for (const node of nodes) {
      node.style.setProperty("color", "transparent", "important");
      node.style.setProperty("-webkit-text-fill-color", "transparent", "important");
      node.style.setProperty("text-shadow", "none", "important");
      node.style.setProperty("transition", "none", "important");
      if (getComputedStyle(node).backgroundClip === "text") node.style.setProperty("background-image", "none", "important");
      // Icons and decorative (aria-hidden) marks such as separators are not text: leave only what sits behind the words.
      if (node instanceof SVGElement || node.getAttribute("aria-hidden") === "true") node.style.visibility = "hidden";
    }
  });
  const png = await element.screenshot();
  // Screenshots are in device pixels. Inset 4 CSS px (scaled by DPR) to skip the border and anti-aliased rounded corners.
  const dpr = await element.evaluate(() => window.devicePixelRatio || 1);
  const meta = await sharp(png).metadata();
  const inset = Math.ceil(4 * dpr);
  const { data, info } = await sharp(png)
    .extract({ left: inset, top: inset, width: (meta.width ?? 0) - 2 * inset, height: (meta.height ?? 0) - 2 * inset })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const textL = luminance(text[0], text[1], text[2]);
  let worst = Number.POSITIVE_INFINITY;
  for (let i = 0; i < info.width * info.height * 3; i += 3) {
    worst = Math.min(worst, contrastRatio(textL, luminance(data[i], data[i + 1], data[i + 2])));
  }
  return worst;
}

/** White text against the rendered pixels behind an element. */
export const worstContrastAgainstWhite = (element: Locator): Promise<number> => worstContrastAgainst(element, [255, 255, 255]);
