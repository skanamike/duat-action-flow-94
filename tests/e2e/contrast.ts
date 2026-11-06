import type { Locator } from "@playwright/test";
import sharp from "sharp";

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

/**
 * Worst-case contrast between an element's (white) text and the pixels actually
 * rendered behind it. The text is hidden, the element is screenshotted, and the
 * lightest background pixel is used, so gradients are measured at their worst point.
 * (Replaces the alpha-only check that passed for the wrong reason; dual review R7/R8.)
 */
export async function worstContrastAgainstWhite(element: Locator): Promise<number> {
  await element.evaluate((el) => {
    (el as HTMLElement).style.setProperty("color", "transparent", "important");
    (el as HTMLElement).style.setProperty("transition", "none", "important");
    el.querySelectorAll("svg").forEach((s) => (s.style.visibility = "hidden"));
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
  let lightest = 0;
  for (let i = 0; i < info.width * info.height * 3; i += 3) {
    lightest = Math.max(lightest, luminance(data[i], data[i + 1], data[i + 2]));
  }
  return contrastRatio(1, lightest);
}
