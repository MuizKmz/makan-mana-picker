// Fills `priceMYR` in src/data/dishes.json with AI-estimated ringgit prices.
//
// Run locally (never in the browser), then review the diff before committing:
//   npm run estimate-prices                # only dishes without a price yet
//   npm run estimate-prices -- --dry-run   # print results, don't save
//   npm run estimate-prices -- --force     # re-estimate every dish
//   npm run estimate-prices -- --only=nasi-lemak,pho
//
// Needs OPENAI_API_KEY in your shell or in a .env file (see .env.example).
// The key is only read by this script; it is never bundled into the website.
import { readFileSync, writeFileSync } from "node:fs";

try {
  process.loadEnvFile(); // reads .env if present (Node 21.7+)
} catch {
  // no .env file: fall back to real environment variables
}

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const BASE_URL = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const ONLY = args.find((a) => a.startsWith("--only="))?.slice(7).split(",").filter(Boolean) ?? null;
const BATCH = Number(args.find((a) => a.startsWith("--batch="))?.slice(8) ?? 20);

if (!API_KEY) {
  console.error("Missing OPENAI_API_KEY. Copy .env.example to .env and add your key, or export it in your shell.");
  process.exit(1);
}

const file = new URL("../src/data/dishes.json", import.meta.url);
const dishes = JSON.parse(readFileSync(file, "utf8"));
const byId = new Map(dishes.map((d) => [d.id, d]));

const todo = dishes.filter((d) => (ONLY ? ONLY.includes(d.id) : FORCE || d.priceMYR === null));
if (todo.length === 0) {
  console.log("Nothing to estimate. Use --force to redo every dish.");
  process.exit(0);
}

const SYSTEM = `You estimate food prices in Malaysia.
For each dish, give the typical price range in Malaysian ringgit (RM) for ONE serving, as sold in Malaysia in the current year.
Use the kind of place where most Malaysians buy it: hawker stall, kopitiam or mamak for street food; casual restaurant for restaurant dishes; a typical outlet for fast food.
Rules:
- Whole numbers only. min <= max. Keep the range realistic and fairly tight (max at most about 2x min).
- Drinks are one glass/cup. Shared dishes (steamboat, Korean BBQ, whole roast) are per person.
- Never refuse; if unsure, give your best typical estimate.
Reply with JSON only: {"prices":[{"id":"<id>","min":<number>,"max":<number>}]}`;

async function ask(batch, attempt = 1) {
  const payload = batch.map((d) => ({
    id: d.id,
    name: d.name,
    cuisine: d.cuisine,
    category: d.category,
    about: d.descriptionEn,
  }));

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    const wait = 2000 * attempt;
    console.warn(`  API busy (${res.status}), retrying in ${wait / 1000}s…`);
    await new Promise((r) => setTimeout(r, wait));
    return ask(batch, attempt + 1);
  }
  if (!res.ok) {
    throw new Error(`OpenAI API error ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content).prices ?? [];
}

/** Reject answers that can't be right, so a bad reply never lands in the dataset. */
function check(p) {
  if (!p || typeof p.id !== "string" || !byId.has(p.id)) return "unknown id";
  const min = Math.round(Number(p.min));
  const max = Math.round(Number(p.max));
  if (!Number.isFinite(min) || !Number.isFinite(max)) return "not a number";
  if (min <= 0 || max > 1000) return "out of range";
  if (min > max) return "min is above max";
  if (max > min * 4) return "range too wide";
  return [min, max];
}

let saved = 0;
const skipped = [];

for (let i = 0; i < todo.length; i += BATCH) {
  const batch = todo.slice(i, i + BATCH);
  console.log(`Batch ${i / BATCH + 1}/${Math.ceil(todo.length / BATCH)}: ${batch.map((d) => d.id).join(", ")}`);

  const answers = await ask(batch);
  const answered = new Set();

  for (const p of answers) {
    if (p?.id) answered.add(p.id);
    const result = check(p);
    if (typeof result === "string") {
      skipped.push(`${p?.id ?? "?"} (${result})`);
      continue;
    }
    byId.get(p.id).priceMYR = result;
    saved++;
    console.log(`  ${p.id.padEnd(28)} RM${result[0]}–${result[1]}`);
  }
  for (const d of batch) if (!answered.has(d.id)) skipped.push(`${d.id} (no answer)`);

  // Save after every batch so a crash halfway keeps the progress.
  if (!DRY_RUN) writeFileSync(file, JSON.stringify(dishes, null, 2) + "\n");
}

console.log(`\n${DRY_RUN ? "Dry run: would save" : "Saved"} ${saved} estimate(s) using ${MODEL}.`);
if (skipped.length) console.log(`Skipped ${skipped.length}: ${skipped.join(", ")}. Run again to retry them.`);
if (!DRY_RUN) console.log("Review with `git diff src/data/dishes.json`, then run `npm run validate`.");
