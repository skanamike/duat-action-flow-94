/** Counter increment of mulberry32. */
export const RNG_STEP = 0x6d2b79f5;

/** mulberry32 output function: hashes a counter state into 32 well-mixed bits. Pure, so hot loops can inline it. */
export function mix(state: number): number {
  let t = state;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (t ^ (t >>> 14)) >>> 0;
}

/** Seeded PRNG (mulberry32). Same seed, same sequence, values in [0, 1). */
export function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return (): number => {
    state = (state + RNG_STEP) >>> 0;
    return mix(state) / 4294967296;
  };
}

const EXP_TABLE_BITS = 12;
const EXP_TABLE_SIZE = 1 << EXP_TABLE_BITS;
const EXP_TABLE = Float32Array.from({ length: EXP_TABLE_SIZE }, (_, k) => -Math.log(1 - (k + 0.5) / EXP_TABLE_SIZE));

/** Exponentially distributed multiplicative grain (mean 1) from 32 random bits: the imagery speckle. */
export const speckle = (bits: number): number => EXP_TABLE[bits >>> (32 - EXP_TABLE_BITS)];
