import type { Category, Cuisine, DishFilters, MealTime, PriceTier, SpicyPref } from "../types/food";
import { PRICE_MAX } from "../constants/labels";

/**
 * Turns a casual sentence ("nak makan nasi pedas bawah RM10 malam ni")
 * into filters. Runs fully in the browser with keyword rules, so it never
 * invents restaurants, prices or halal status.
 */
export interface ParsedSearch {
  filters: Partial<DishFilters>;
  /** Human-readable chips describing what we understood. */
  understood: string[];
  /** A place name, if the user typed one (used for the Nearby link). */
  place: string | null;
}

const MEAL_WORDS: [RegExp, MealTime, string][] = [
  [/\b(sarapan|breakfast|pagi)\b/, "breakfast", "Sarapan"],
  [/\b(tengah ?hari|lunch|makan tengahari)\b/, "lunch", "Tengah hari"],
  [/\b(petang|minum petang|tea ?time|hi-?tea)\b/, "teatime", "Minum petang"],
  [/\b(supper|lewat malam|tengah malam|midnight)\b/, "supper", "Supper"],
  [/\b(malam|dinner|makan malam)\b/, "dinner", "Makan malam"],
];

const CUISINE_WORDS: [RegExp, Cuisine, string][] = [
  [/\b(melayu|malay|kampung)\b/, "malay", "Melayu"],
  [/\b(cina|chinese|kopitiam)\b/, "chinese", "Cina"],
  [/\b(india|indian)\b/, "indian", "India"],
  [/\bmamak\b/, "mamak", "Mamak"],
  [/\b(western|barat)\b/, "western", "Western"],
  [/\b(jepun|japanese|japan)\b/, "japanese", "Jepun"],
  [/\b(korea|korean)\b/, "korean", "Korea"],
  [/\b(thai|siam)\b/, "thai", "Siam"],
  [/\b(sabah|sarawak)\b/, "east-malaysia", "Sabah & Sarawak"],
  [/\b(nyonya|peranakan)\b/, "peranakan", "Peranakan"],
];

const CATEGORY_WORDS: [RegExp, Category, string][] = [
  [/\b(nasi|rice)\b/, "rice", "Nasi"],
  [/\b(mee|mi|noodle|noodles|laksa|kuey ?teow|bihun)\b/, "noodle", "Mi"],
  [/\b(roti|bread)\b/, "bread", "Roti"],
  [/\b(sup|soup)\b/, "soup", "Sup"],
  [/\b(snek|snack|kuih)\b/, "snack", "Snek"],
  [/\b(dessert|manis|pencuci mulut|ais)\b/, "dessert", "Pencuci mulut"],
  [/\b(minum|minuman|drink|air)\b/, "drink", "Minuman"],
];

const PLACE_PATTERN = /\b(?:dekat|kat|di|near|around|sekitar|area)\s+([a-z][a-z\s]{1,30}?)(?=$|\s+(?:bawah|under|yang|untuk|pedas|halal|murah|malam|pagi|petang)\b)/;

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

export function parseSearch(input: string): ParsedSearch {
  const text = ` ${input.toLowerCase()} `;
  const filters: Partial<DishFilters> = {};
  const understood: string[] = [];

  for (const [re, meal, label] of MEAL_WORDS) {
    if (re.test(text)) {
      filters.mealTime = meal;
      understood.push(label);
      break;
    }
  }

  const amount = text.match(/(?:bawah|under|below|kurang|<|max|bajet|budget)\s*(?:dari|than)?\s*rm\s?(\d+)/) ??
    text.match(/rm\s?(\d+)/);
  if (amount) {
    const value = Number(amount[1]);
    filters.price = priceFromAmount(value);
    understood.push(`Bawah RM${value}`);
  } else if (/\b(murah|cheap|jimat|budget)\b/.test(text)) {
    filters.price = "cheap";
    understood.push("Murah");
  }

  let spicy: SpicyPref | null = null;
  if (/\b(tak|tidak|tak nak|no|not|kurang)\s+(pedas|spicy)\b/.test(text)) spicy = "no";
  else if (/\b(pedas|spicy|berapi)\b/.test(text)) spicy = "yes";
  if (spicy) {
    filters.spicy = spicy;
    understood.push(spicy === "yes" ? "Pedas" : "Tak pedas");
  }

  if (/\bhalal\b/.test(text)) {
    filters.halalOnly = true;
    understood.push("Versi halal");
  }

  const cuisines = CUISINE_WORDS.filter(([re]) => re.test(text));
  if (cuisines.length) {
    filters.cuisines = cuisines.map(([, c]) => c);
    understood.push(...cuisines.map(([, , l]) => l));
  }

  const categories = CATEGORY_WORDS.filter(([re]) => re.test(text));
  if (categories.length) {
    filters.categories = categories.map(([, c]) => c);
    understood.push(...categories.map(([, , l]) => l));
  }

  const placeMatch = text.match(PLACE_PATTERN);
  const place = placeMatch ? placeMatch[1].trim().replace(/\b(ni|sini|this)\b/g, "").trim() || null : null;
  if (place) understood.push(`Lokasi: ${formatPlace(place)}`);

  return { filters, understood, place };
}
