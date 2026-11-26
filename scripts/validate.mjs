// Checks data/dishes.json so a bad pull request fails CI instead of breaking the site.
// Run: node scripts/validate.mjs
import { readFileSync } from "node:fs";

const MEAL_TIMES = ["breakfast", "lunch", "teatime", "dinner", "supper"];
const PRICES = ["cheap", "mid", "pricey"];
const CATEGORIES = ["rice", "noodle", "bread", "meat", "soup", "salad", "snack", "dessert", "drink"];
// Keep in sync with REGION_CUISINES in src/constants/labels.ts
const CUISINES = [
  "malay", "chinese", "mamak", "peranakan", "east-malaysia", "western",
  "thai", "indonesian", "vietnamese", "filipino", "burmese", "cambodian",
  "china", "taiwanese", "japanese", "korean",
  "indian", "pakistani", "sri-lankan", "nepali",
  "middle-eastern", "turkish",
  "italian", "french", "spanish", "greek", "british", "german", "east-european",
  "american", "mexican", "south-american", "caribbean",
  "african", "oceanian", "fast-food",
];

const file = new URL("../src/data/dishes.json", import.meta.url);
const errors = [];
let dishes;

try {
  dishes = JSON.parse(readFileSync(file, "utf8"));
} catch (err) {
  console.error(`dishes.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

if (!Array.isArray(dishes)) {
  console.error("dishes.json must be an array of dishes.");
  process.exit(1);
}

const seen = new Set();

dishes.forEach((d, i) => {
  const where = `dish #${i + 1} (${d?.id ?? "no id"})`;
  const fail = (msg) => errors.push(`${where}: ${msg}`);

  if (typeof d.id !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.id)) {
    fail('id must be lowercase-kebab-case, e.g. "nasi-lemak"');
  } else if (seen.has(d.id)) {
    fail("id is duplicated");
  } else {
    seen.add(d.id);
  }

  if (typeof d.name !== "string" || d.name.trim() === "") fail("name is required");
  if (typeof d.emoji !== "string" || d.emoji.trim() === "") fail("emoji is required");
  if (!CATEGORIES.includes(d.category)) fail(`category must be one of: ${CATEGORIES.join(", ")}`);
  if (!CUISINES.includes(d.cuisine)) fail(`cuisine must be one of: ${CUISINES.join(", ")}`);
  if (d.image !== null && (typeof d.image !== "string" || !/^(\/food\/[a-z0-9-]+\.(webp|jpe?g|png|avif)|https:\/\/.+)$/.test(d.image))) {
    fail('image must be null, a file like "/food/nasi-lemak.webp", or an https URL');
  }
  if (d.wiki !== null && (typeof d.wiki !== "string" || /\s/.test(d.wiki))) fail("wiki must be null or a Wikipedia title with underscores, e.g. \"Nasi_lemak\"");
  if (!PRICES.includes(d.price)) fail(`price must be one of: ${PRICES.join(", ")}`);
  if (typeof d.spicy !== "boolean") fail("spicy must be true or false");
  if (typeof d.halalOption !== "boolean") fail("halalOption must be true or false");

  if (!Array.isArray(d.mealTime) || d.mealTime.length === 0) {
    fail("mealTime must be a non-empty list");
  } else {
    d.mealTime
      .filter((m) => !MEAL_TIMES.includes(m))
      .forEach((m) => fail(`unknown mealTime "${m}" (use: ${MEAL_TIMES.join(", ")})`));
  }

  if (typeof d.description !== "string" || d.description.length < 10 || d.description.length > 120) {
    fail("description must be 10–120 characters");
  }
  if (typeof d.descriptionEn !== "string" || d.descriptionEn.length < 10 || d.descriptionEn.length > 120) {
    fail("descriptionEn (English) must be 10–120 characters");
  }
});

if (errors.length) {
  console.error(`Found ${errors.length} problem(s) in dishes.json:\n`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(`dishes.json OK: ${dishes.length} dishes.`);
