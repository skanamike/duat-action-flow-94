#!/usr/bin/env node
/**
 * Minimal, single-process static server for e2e tests that emulates the
 * Netlify behaviour this site relies on, so tests exercise the real config:
 *   - public/_redirects   (exact-path 301/302 rules)
 *   - public/_headers     (incl. Content-Security-Policy) on every response, including
 *                         redirects, 404s and rejected methods
 *   - clean URLs          (/company → company.html, /company/team → company/team.html)
 *   - 404.html            for unknown paths (status 404)
 *   - 404 for any method other than GET/HEAD, as Netlify answers a POST when no
 *     form was detected. Netlify Forms is NOT emulated: e2e stubs the form POST at
 *     the network layer, so an unstubbed POST can never fake a successful submission.
 *
 * Usage: node scripts/serve-dist.mjs [port]
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const DIST = "dist";
const PORT = Number(process.argv[2] ?? 4329);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

/** Parse Netlify _redirects: "from to [status]" (exact paths only). */
export function parseRedirects(text) {
  const rules = new Map();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [from, to, status = "301"] = trimmed.split(/\s+/);
    rules.set(from, { to, status: Number.parseInt(status, 10) });
  }
  return rules;
}

/** Parse Netlify _headers into [{ pattern, headers }]; supports "/*" and "/prefix/*". */
export function parseHeaders(text) {
  const blocks = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: {} };
      blocks.push(current);
    } else if (current) {
      const idx = line.indexOf(":");
      current.headers[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  return blocks;
}

function matches(pattern, path) {
  return pattern.endsWith("/*") ? path.startsWith(pattern.slice(0, -1)) : pattern === path;
}

function resolveFile(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const candidates = safe.endsWith("/") ? [join(safe, "index.html")] : [safe, `${safe}.html`, join(safe, "index.html")];
  for (const candidate of candidates) {
    const full = join(DIST, candidate);
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}

const redirects = parseRedirects(existsSync(join(DIST, "_redirects")) ? readFileSync(join(DIST, "_redirects"), "utf8") : "");
const headerBlocks = parseHeaders(existsSync(join(DIST, "_headers")) ? readFileSync(join(DIST, "_headers"), "utf8") : "");

const READ_METHODS = new Set(["GET", "HEAD"]);

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  const path = url.pathname;

  for (const block of headerBlocks) {
    if (matches(block.pattern, path)) for (const [k, v] of Object.entries(block.headers)) res.setHeader(k, v);
  }

  if (!READ_METHODS.has(req.method ?? "")) {
    req.resume(); // drain any request body before answering
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const rule = redirects.get(path);
  if (rule && rule.status >= 300 && rule.status < 400) {
    res.writeHead(rule.status, { Location: rule.to });
    res.end();
    return;
  }

  const file = path === "/" ? join(DIST, "index.html") : resolveFile(path);
  if (!file) {
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    res.end(existsSync(join(DIST, "404.html")) ? readFileSync(join(DIST, "404.html")) : "Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});

server.listen(PORT, "127.0.0.1", () => console.log(`serving ${DIST}/ on http://127.0.0.1:${PORT}`));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close(() => process.exit(0)));
