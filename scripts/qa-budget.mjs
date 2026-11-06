#!/usr/bin/env node
/**
 * QA-2 performance budgets, run after `npm run build`.
 * - JS actually referenced by each page (inline module scripts + linked _astro/*.js), gzipped
 * - Every image shipped in dist/ under the size cap
 * Exits 1 on any breach.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { gzipSync } from "node:zlib";

const DIST = "dist";
const JS_BUDGET_GZ = 40 * 1024;
const IMAGE_BUDGET = 300 * 1024;
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"]);

if (!existsSync(DIST)) {
  console.error("dist/ not found. Run `npm run build` first.");
  process.exit(2);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(DIST);
let failed = false;

// Scope (dual review R16): first-party JS only. Third-party scripts (Google Analytics
// gtag.js, async) are listed but not counted; their cost is tracked under DEBT-007.
console.log("First-party JS per page (gzip):");
for (const html of files.filter((f) => f.endsWith(".html"))) {
  const src = readFileSync(html, "utf8");
  let bytes = 0;
  for (const m of src.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)) {
    bytes += gzipSync(m[1]).length;
  }
  for (const m of src.matchAll(/<script[^>]*src="(\/_astro\/[^"]+\.js)"/g)) {
    bytes += gzipSync(readFileSync(join(DIST, m[1]))).length;
  }
  const ok = bytes <= JS_BUDGET_GZ;
  failed ||= !ok;
  const thirdParty = [...src.matchAll(/<script[^>]*src="(https?:\/\/[^"]+)"/g)].map((m) => new URL(m[1]).host);
  const note = thirdParty.length ? `  + third-party (not counted): ${thirdParty.join(", ")}` : "";
  console.log(`  ${ok ? "✓" : "✗"} ${relative(DIST, html).padEnd(22)} ${(bytes / 1024).toFixed(1)} KB (budget ${JS_BUDGET_GZ / 1024} KB)${note}`);
}

console.log("Images:");
for (const img of files.filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))) {
  const size = statSync(img).size;
  const ok = size <= IMAGE_BUDGET;
  failed ||= !ok;
  console.log(`  ${ok ? "✓" : "✗"} ${relative(DIST, img).padEnd(42)} ${(size / 1024).toFixed(0)} KB`);
}

if (failed) {
  console.error("\nBudget exceeded.");
  process.exit(1);
}
console.log("\nAll budgets met.");
