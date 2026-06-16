/**
 * Static UI screen inventory validator.
 * Reads src/App.jsx as text and checks three things:
 *   1. screens[] registry contains all expected IDs (no missing, no duplicates, no unexpected)
 *   2. Every expected ID has an explicit pageContent branch
 *   3. Every lazy-imported page file exists on disk
 *
 * Uses only Node.js built-in modules. Zero new dependencies.
 * Source: docs/nashir_ui_navigation_inventory_gate.md §4 (Step 17, 23-screen inventory)
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APP_JSX = resolve(ROOT, "src/App.jsx");

// ── Expected inventory (locked in Step 17) ────────────────────────────────────
const EXPECTED_SCREEN_IDS = [
  "dashboard",
  "storeSetup",
  "productCatalog",
  "productIntelligence",
  "dataSourcesHub",
  "assetLibrary",
  "campaigns",
  "campaignsList",
  "creatorStudio",
  "content",
  "contentReview",
  "publishingQueue",
  "analytics",
  "templateEngine",
  "multiPlatform",
  "teamCollaboration",
  "workflowRuns",
  "systemAdmin",
  "secrets",
  "modelRouting",
  "promptGovernance",
  "costMonitor",
  "settings",
];

// ── Read source ───────────────────────────────────────────────────────────────
if (!existsSync(APP_JSX)) {
  console.error(`[FAIL] Cannot read ${APP_JSX} — file not found.`);
  process.exit(1);
}
const src = readFileSync(APP_JSX, "utf8");

const failures = [];
const pass = (msg) => console.log(`  ✓  ${msg}`);
const fail = (msg) => { failures.push(msg); console.log(`  ✗  ${msg}`); };

// ── 1. screens[] registry ─────────────────────────────────────────────────────
console.log("\n[1] screens[] registry");

// Extract all id:"..." entries inside the screens useMemo array.
// Matches: { id: "someId", ... }
const registryMatches = [...src.matchAll(/\{\s*id:\s*["']([^"']+)["']/g)].map((m) => m[1]);

const seen = new Set();
const duplicates = [];
for (const id of registryMatches) {
  if (seen.has(id)) duplicates.push(id);
  else seen.add(id);
}

if (duplicates.length > 0) {
  fail(`Duplicate screen IDs in registry: ${duplicates.join(", ")}`);
}

const expectedSet = new Set(EXPECTED_SCREEN_IDS);
const registeredSet = new Set(registryMatches);

for (const id of EXPECTED_SCREEN_IDS) {
  if (!registeredSet.has(id)) {
    fail(`Missing from screens[]: "${id}"`);
  }
}
for (const id of registeredSet) {
  if (!expectedSet.has(id)) {
    fail(`Unexpected screen ID in screens[]: "${id}"`);
  }
}

if (duplicates.length === 0 && failures.filter((f) => f.includes("screens[]")).length === 0) {
  pass(`All ${EXPECTED_SCREEN_IDS.length} expected IDs found in screens[]; no duplicates; no unexpected IDs`);
}

// ── 2. pageContent branches ───────────────────────────────────────────────────
console.log("\n[2] pageContent branches");

// Match: activeScreen === "someId" or activeScreen === 'someId'
const branchMatches = new Set(
  [...src.matchAll(/activeScreen\s*===\s*["']([^"']+)["']/g)].map((m) => m[1])
);

// Also accept the dashboard block which is in an if (activeScreen === "dashboard") { ... } form
// (already caught by the above pattern)

let branchFailures = 0;
for (const id of EXPECTED_SCREEN_IDS) {
  if (!branchMatches.has(id)) {
    fail(`No pageContent branch for screen ID: "${id}"`);
    branchFailures++;
  }
}
if (branchFailures === 0) {
  pass(`All ${EXPECTED_SCREEN_IDS.length} expected IDs have explicit pageContent branches`);
}

// ── 3. Lazy import file existence ─────────────────────────────────────────────
console.log("\n[3] Lazy import file paths");

// Match: lazy(() => import("./pages/SomePage.jsx")) or single-quoted equivalent
const lazyMatches = [...src.matchAll(/lazy\(\s*\(\)\s*=>\s*import\(\s*["']([^"']+)["']\s*\)/g)].map(
  (m) => m[1]
);

let importFailures = 0;
for (const importPath of lazyMatches) {
  // Resolve relative to App.jsx itself — handles any relative prefix correctly
  const fullPath = resolve(dirname(APP_JSX), importPath);
  if (!existsSync(fullPath)) {
    fail(`Lazy import not found on disk: "${importPath}" → ${fullPath}`);
    importFailures++;
  }
}

if (importFailures === 0) {
  pass(`All ${lazyMatches.length} lazy import paths exist on disk`);
}

// ── 4. No expected ID falls through to PlaceholderPage ───────────────────────
console.log("\n[4] PlaceholderPage fallback check");

// The fallback block pattern in App.jsx: if (!pageContent) { pageContent = <PlaceholderPage ...
const hasGuardedFallback = /if\s*\(\s*!pageContent\s*\)/.test(src);
if (!hasGuardedFallback) {
  fail("Could not find guarded PlaceholderPage fallback (expected: if (!pageContent) {...})");
} else {
  // Since all 23 IDs have explicit branches (checked in §2), none will fall through.
  // We confirm the fallback pattern exists so the guard is known to be intentional.
  pass("PlaceholderPage fallback is guarded by !pageContent — no named screen ID falls through");
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n─────────────────────────────────────────────");
console.log(`  Expected screen IDs  : ${EXPECTED_SCREEN_IDS.length}`);
console.log(`  Registry count       : ${registeredSet.size}`);
console.log(`  Branch count         : ${branchMatches.size}`);
console.log(`  Lazy import count    : ${lazyMatches.length}`);
console.log("─────────────────────────────────────────────");

if (failures.length === 0) {
  console.log("  Result: PASS — all inventory checks passed.\n");
  process.exit(0);
} else {
  console.log(`  Result: FAIL — ${failures.length} issue(s) found:\n`);
  failures.forEach((f) => console.log(`    • ${f}`));
  console.log();
  process.exit(1);
}
