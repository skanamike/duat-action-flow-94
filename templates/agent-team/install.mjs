#!/usr/bin/env node
/**
 * Installs the agent-team template into a target repository.
 *
 * Usage:
 *   node templates/agent-team/install.mjs <target-dir> <values.env> [--force] [--dry-run]
 *
 * - Copies .claude/agents/*, CLAUDE.md and context/* into <target-dir>
 * - Replaces every {{KEY}} with the value from <values.env> (KEY="value" lines)
 * - Refuses to overwrite existing files unless --force
 * - Fails if any {{PLACEHOLDER}} is left unfilled
 *
 * Works on Linux, macOS and Windows (Node 18+). No dependencies.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATE_ROOT = dirname(fileURLToPath(import.meta.url));
const INSTALLABLE = [".claude/agents", "context", "CLAUDE.md"];
const PLACEHOLDER = /\{\{([A-Z0-9_]+)\}\}/g;

/** @param {string} text @returns {Record<string, string>} */
export function parseEnv(text) {
  /** @type {Record<string, string>} */
  const values = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) throw new Error(`Unparseable line in values file: ${raw}`);
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

/** @param {string} text @param {Record<string, string>} values */
export function fill(text, values) {
  const missing = new Set();
  const out = text.replace(PLACEHOLDER, (whole, key) => {
    if (key in values && values[key] !== "") return values[key];
    missing.add(key);
    return whole;
  });
  return { out, missing: [...missing] };
}

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const dryRun = args.includes("--dry-run");
  const [target, valuesPath] = args.filter((a) => !a.startsWith("--"));
  if (!target || !valuesPath) {
    console.error("Usage: node install.mjs <target-dir> <values.env> [--force] [--dry-run]");
    process.exit(2);
  }

  const values = parseEnv(readFileSync(valuesPath, "utf8"));
  const targetRoot = resolve(target);
  const sources = INSTALLABLE.flatMap((p) => {
    const full = join(TEMPLATE_ROOT, p);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

  const conflicts = sources
    .map((src) => join(targetRoot, relative(TEMPLATE_ROOT, src)))
    .filter((dest) => existsSync(dest));
  if (conflicts.length && !force) {
    console.error(`Refusing to overwrite ${conflicts.length} existing file(s) (use --force):`);
    conflicts.forEach((c) => console.error(`  ${c}`));
    process.exit(1);
  }

  const allMissing = new Set();
  const planned = sources.map((src) => {
    const rel = relative(TEMPLATE_ROOT, src);
    const { out, missing } = fill(readFileSync(src, "utf8"), values);
    missing.forEach((m) => allMissing.add(`${m} (in ${rel})`));
    return { dest: join(targetRoot, rel), out, rel };
  });

  if (allMissing.size) {
    console.error("Unfilled placeholders. Add these keys to your values file:");
    [...allMissing].forEach((m) => console.error(`  ${m}`));
    process.exit(1);
  }

  for (const { dest, out, rel } of planned) {
    if (dryRun) {
      console.log(`[dry-run] would write ${rel}`);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, out);
    console.log(`wrote ${rel}`);
  }
  console.log(dryRun ? "Dry run complete." : `Installed agent team into ${targetRoot}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
