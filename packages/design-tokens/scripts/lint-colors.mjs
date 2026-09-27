#!/usr/bin/env node
/**
 * Finds hardcoded color literals in the apps and maps them to design tokens.
 *
 * Usage:
 *   node scripts/lint-colors.mjs              report, always exit 0
 *   node scripts/lint-colors.mjs --strict     exit 1 if any hardcoded color is found
 *   node scripts/lint-colors.mjs --verbose    list every occurrence, not just a summary
 *   node scripts/lint-colors.mjs apps/mobile  limit to specific paths (relative to repo root)
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(pkgRoot, "../..");

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const verbose = args.includes("--verbose");
const targets = args.filter((a) => !a.startsWith("--"));
const roots = (targets.length ? targets : ["apps"]).map((t) => path.resolve(repoRoot, t));

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);
const IGNORE_DIRS = new Set(["node_modules", ".expo", "dist", "build", "generated", "ui"]);
const IGNORE_FILES = new Set(["default_shadcn_theme.css"]);
const COLOR_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b|rgba?\([^)]*\)/g;

const normalize = (c) => {
  let v = c.toLowerCase().replace(/\s+/g, "");
  if (/^#[0-9a-f]{3}$/.test(v)) v = `#${[...v.slice(1)].map((x) => x + x).join("")}`;
  if (v === "#ffffff" || v === "rgb(255,255,255)") return "#ffffff";
  return v;
};

async function loadTokenIndex() {
  const flat = JSON.parse(await readFile(path.join(pkgRoot, "generated/tokens.json"), "utf8"));
  const index = new Map();
  for (const [name, t] of Object.entries(flat)) {
    if (t.type !== "color") continue;
    const key = normalize(t.value);
    if (!index.has(key)) index.set(key, { name, css: t.css });
  }
  return index;
}

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) yield* walk(full);
    } else if (EXTENSIONS.has(path.extname(entry.name)) && !IGNORE_FILES.has(entry.name)) {
      yield full;
    }
  }
}

const summarizeFiles = (files) => {
  const list = [...files].map((f) => path.basename(f));
  return list.length > 3 ? `${list.slice(0, 3).join(", ")} +${list.length - 3} more` : list.join(", ");
};

async function main() {
  const index = await loadTokenIndex();
  const hits = [];

  for (const root of roots) {
    for await (const file of walk(root)) {
      const lines = (await readFile(file, "utf8")).split("\n");
      lines.forEach((line, i) => {
        for (const match of line.matchAll(COLOR_RE)) {
          hits.push({ file: path.relative(repoRoot, file), line: i + 1, color: match[0], token: index.get(normalize(match[0])) });
        }
      });
    }
  }

  if (!hits.length) {
    console.log("✔ No hardcoded colors found");
    return;
  }

  if (verbose) {
    for (const h of hits) {
      const hint = h.token ? `→ color.${h.token.name.replace(/^color\./, "")} (${h.token.css})` : "→ not in palette";
      console.log(`${h.file}:${h.line}  ${h.color}  ${hint}`);
    }
    console.log("");
  }

  const byColor = new Map();
  for (const h of hits) {
    const key = normalize(h.color);
    const entry = byColor.get(key) ?? { color: h.color, token: h.token, count: 0, files: new Set() };
    entry.count++;
    entry.files.add(h.file);
    byColor.set(key, entry);
  }
  const rows = [...byColor.values()].sort((a, b) => b.count - a.count);
  const matched = rows.filter((r) => r.token);
  const offPalette = rows.filter((r) => !r.token);

  console.log(`Found ${hits.length} hardcoded color literals in ${new Set(hits.map((h) => h.file)).size} files.\n`);
  if (matched.length) {
    console.log("Replaceable with an existing token:");
    for (const r of matched) console.log(`  ${String(r.count).padStart(4)}×  ${r.color.padEnd(24)} → ${r.token.name}  (${r.token.css})`);
  }
  if (offPalette.length) {
    console.log("\nNot in the palette (add a token or switch to an existing one):");
    for (const r of offPalette) console.log(`  ${String(r.count).padStart(4)}×  ${r.color.padEnd(24)} ${summarizeFiles(r.files)}`);
  }
  if (!verbose) console.log("\nRun with --verbose for file:line locations.");

  if (strict) process.exit(1);
}

main().catch((err) => {
  console.error(`✖ ${err.message}`);
  process.exit(1);
});
