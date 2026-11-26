import type { Category, Cuisine, DishFilters, MealTime, PriceTier, Region, SpicyPref } from "../types/food";
import { PRICE_MAX } from "../constants/labels";
import type { Dict } from "../i18n/ms";

/**
 * Turns a casual sentence in Malay or English ("nak makan nasi pedas bawah RM10 malam ni",
 * "cheap korean food near Mount Austin") into filters. Runs fully in the browser with
 * keyword rules, so it never invents restaurants, prices or halal status.
 */

/** What we understood, kept language-neutral so the UI can describe it in BM or EN. */
export type Understood =
  | { kind: "meal"; value: MealTime }
  | { kind: "under"; value: number }
  | { kind: "cheap" }
  | { kind: "spicy"; value: Exclude<SpicyPref, "any"> }
  | { kind: "halal" }
  | { kind: "cuisine"; value: Cuisine }
  | { kind: "region"; value: Region }
  | { kind: "category"; value: Category }
  | { kind: "place"; value: string };

export interface ParsedSearch {
  filters: Partial<DishFilters>;
  understood: Understood[];
  /** A place name, if the user typed one (used for the Nearby link). */
  place: string | null;
  /** Words left after removing everything understood, used as a dish-name search ("nasi lemak" -> "lemak"). */
  rest: string;
}

/** Filler words in BM and English that never name a dish. */
const FILLER =
  /\b(nak|aku|saya|kita|i|want|makan|makanan|food|foods|cari|find|me|something|yang|untuk|dan|and|or|but|not|too|the|a|an|ni|hari|today|recommend|suggest|good|sedap|best|where|can|of|in|at|with|tolong|bagi|some|like|feel|eat|eating|lets|let|for|please|tonight|night|late|time|dekat|kat|di|near|around|sekitar|area|nearby|berdekatan|bawah|under|below|kurang|max|bajet|budget|tak|tidak|no|non|dish|dishes|hidangan)\b/g;

const MEAL_WORDS: [RegExp, MealTime][] = [
  [/\b(sarapan|breakfast|pagi)\b/, "breakfast"],
  [/\b(tengah ?hari|lunch|makan tengahari)\b/, "lunch"],
  [/\b(petang|minum petang|tea ?time|hi-?tea)\b/, "teatime"],
  [/\b(supper|lewat malam|tengah malam|midnight|late night)\b/, "supper"],
  [/\b(malam|dinner|makan malam|tonight)\b/, "dinner"],
];

const CUISINE_WORDS: [RegExp, Cuisine[]][] = [
  [/\b(melayu|malay|kampung)\b/, ["malay"]],
  [/\b(cina|chinese|kopitiam)\b/, ["chinese", "china"]],
  [/\b(india|indian)\b/, ["indian"]],
  [/\bmamak\b/, ["mamak"]],
  [/\b(western|barat)\b/, ["western"]],
  [/\b(jepun|japanese|japan)\b/, ["japanese"]],
  [/\b(korea|korean)\b/, ["korean"]],
  [/\b(thai|siam)\b/, ["thai"]],
  [/\b(sabah|sarawak)\b/, ["east-malaysia"]],
  [/\b(nyonya|peranakan)\b/, ["peranakan"]],
  [/\b(indonesia|indonesian|indon)\b/, ["indonesian"]],
  [/\b(vietnam|vietnamese)\b/, ["vietnamese"]],
  [/\b(filipina|filipino|pinoy|philippines)\b/, ["filipino"]],
  [/\b(taiwan|taiwanese)\b/, ["taiwanese"]],
  [/\b(pakistan|pakistani)\b/, ["pakistani"]],
  [/\b(sri ?lanka|sri ?lankan)\b/, ["sri-lankan"]],
  [/\b(nepal|nepali)\b/, ["nepali"]],
  [/\b(arab|arabic|lebanese|yemen|yaman)\b/, ["middle-eastern"]],
  [/\b(turki|turkish|turkey)\b/, ["turkish"]],
  [/\b(itali|italian|italy)\b/, ["italian"]],
  [/\b(perancis|french|france)\b/, ["french"]],
  [/\b(sepanyol|spanish|spain)\b/, ["spanish"]],
  [/\b(yunani|greek|greece)\b/, ["greek"]],
  [/\b(british|english|uk)\b/, ["british"]],
  [/\b(jerman|german|germany)\b/, ["german"]],
  [/\b(amerika|american|usa)\b/, ["american"]],
  [/\b(mexico|mexican)\b/, ["mexican"]],
  [/\b(brazil|brazilian|peru|peruvian|argentina)\b/, ["south-american"]],
  [/\b(afrika|african|maghribi|moroccan|ethiopian|nigerian)\b/, ["african"]],
  [/\b(australia|australian|aussie)\b/, ["oceanian"]],
  [/\b(fast ?food|makanan segera)\b/, ["fast-food"]],
];

const REGION_WORDS: [RegExp, Region][] = [
  [/\b(asia tenggara|southeast asian?)\b/, "southeast-asia"],
  [/\b(asia timur|east asian?)\b/, "east-asia"],
  [/\b(timur tengah|middle east(ern)?)\b/, "middle-east"],
  [/\b(eropah|europe|european)\b/, "europe"],
  [/\b(local|tempatan)\b/, "malaysia"],
];

const CATEGORY_WORDS: [RegExp, Category][] = [
  [/\b(nasi|rice)\b/, "rice"],
  [/\b(mee|mi|noodle|noodles|laksa|kuey ?teow|bihun)\b/, "noodle"],
  [/\b(roti|bread)\b/, "bread"],
  [/\b(sup|soup)\b/, "soup"],
  [/\b(snek|snack|snacks|kuih)\b/, "snack"],
  [/\b(dessert|desserts|manis|sweet|pencuci mulut)\b/, "dessert"],
  [/\b(minum|minuman|drink|drinks|air)\b/, "drink"],
  [/\b(salad|salads|kerabu)\b/, "salad"],
];

const PLACE_PATTERN =
  /\b(?:dekat|kat|di|near|around|sekitar|area|in)\s+([a-z][a-z\s]{1,30}?)(?=$|\s+(?:bawah|under|below|yang|untuk|for|pedas|spicy|halal|murah|cheap|malam|tonight|pagi|petang)\b)/;

function priceFromAmount(amount: number): PriceTier {
  if (amount <= PRICE_MAX.cheap) return "cheap";
  if (amount <= PRICE_MAX.mid) return "mid";
  return "pricey";
}

/** "jb" -> "JB", "mount austin" -> "Mount Austin" */
export function formatPlace(place: string) {
  return place
    .split(" ")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/** Human-readable chip text for one understood item. */
export function describe(u: Understood, t: Dict): string {
  switch (u.kind) {
    case "meal":
      return t.meal[u.value];
    case "under":
      return t.understood.under(u.value);
    case "cheap":
      return t.understood.cheap;
    case "spicy":
      return u.value === "yes" ? t.understood.spicy : t.understood.notSpicy;
    case "halal":
      return t.understood.halal;
    case "cuisine":
      return t.cuisine[u.value];
    case "region":
      return t.region[u.value];
    case "category":
      return t.category[u.value];
    case "place":
      return t.understood.place(formatPlace(u.value));
  }
}

export function parseSearch(input: string): ParsedSearch {
  const text = ` ${input.toLowerCase()} `;
  const filters: Partial<DishFilters> = {};
  const understood: Understood[] = [];

  for (const [re, meal] of MEAL_WORDS) {
    if (re.test(text)) {
      filters.mealTime = meal;
      understood.push({ kind: "meal", value: meal });
      break;
    }
  }

  const amount =
    text.match(/(?:bawah|under|below|kurang|<|max|bajet|budget)\s*(?:dari|than)?\s*rm\s?(\d+)/) ?? text.match(/rm\s?(\d+)/);
  if (amount) {
    const value = Number(amount[1]);
    filters.price = priceFromAmount(value);
    filters.maxRM = value;
    understood.push({ kind: "under", value });
  } else if (/\b(murah|cheap|jimat|budget)\b/.test(text)) {
    filters.price = "cheap";
    understood.push({ kind: "cheap" });
  }

  let spicy: "yes" | "no" | null = null;
  if (/\b(tak|tidak|tak nak|no|not|non|kurang)[\s-]+(pedas|spicy)\b/.test(text)) spicy = "no";
  else if (/\b(pedas|spicy|berapi)\b/.test(text)) spicy = "yes";
  if (spicy) {
    filters.spicy = spicy;
    understood.push({ kind: "spicy", value: spicy });
  }

  if (/\bhalal\b/.test(text)) {
    filters.halalOnly = true;
    understood.push({ kind: "halal" });
  }

  const cuisineHits = CUISINE_WORDS.filter(([re]) => re.test(text));
  if (cuisineHits.length) {
    filters.cuisines = [...new Set(cuisineHits.flatMap(([, c]) => c))];
    // Show one chip per matched word ("chinese" covers both Malaysian Chinese and China).
    understood.push(...cuisineHits.map(([, c]) => ({ kind: "cuisine" as const, value: c[c.length - 1] })));
  }

  const regions = REGION_WORDS.filter(([re]) => re.test(text)).map(([, r]) => r);
  if (regions.length) {
    filters.regions = regions;
    understood.push(...regions.map((value) => ({ kind: "region" as const, value })));
  }

  const categories = CATEGORY_WORDS.filter(([re]) => re.test(text)).map(([, c]) => c);
  if (categories.length) {
    filters.categories = categories;
    understood.push(...categories.map((value) => ({ kind: "category" as const, value })));
  }

  const placeMatch = text.match(PLACE_PATTERN);
  const place = placeMatch ? placeMatch[1].trim().replace(/\b(ni|sini|this|here|me)\b/g, "").trim() || null : null;
  if (place) understood.push({ kind: "place", value: place });

  // Strip every understood phrase, the place and filler words; what remains is a name search.
  let rest = text;
  if (place) rest = rest.replace(place, " ");
  const allPatterns = [
    ...MEAL_WORDS.map(([re]) => re),
    ...CUISINE_WORDS.map(([re]) => re),
    ...REGION_WORDS.map(([re]) => re),
    ...CATEGORY_WORDS.map(([re]) => re),
    /\b(pedas|spicy|berapi|halal|murah|cheap|jimat|budget)\b/,
    /(?:dari|than)?\s*rm\s?\d+/,
  ];
  for (const re of allPatterns) rest = rest.replace(new RegExp(re.source, "g"), " ");
  rest = rest.replace(FILLER, " ").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

  return { filters, understood, place, rest };
}
