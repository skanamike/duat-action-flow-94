/**
 * Terms that must never appear in the hero background component, its scripts, its lib or its rendered
 * markup (design spec 15, operator decision MSG-008). Bare "SAR" and "dB" are matched as whole words so
 * that ordinary words such as "database" or "Sarah" are not flagged.
 */
export const BANNED_TERMS =
  /\bSAR\b|synthetic aperture|backscatter|radar|sentinel|copernicus|insar|interferometr|polarimetr|\bc-band\b|\bx-band\b|\bdB\b/i;

/** Lines of `text` that contain a banned term. */
export const findBanned = (text: string): string[] => text.split("\n").filter((line) => BANNED_TERMS.test(line));
