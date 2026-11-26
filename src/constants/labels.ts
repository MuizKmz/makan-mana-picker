import type { Category, Cuisine, MealTime, PriceTier, Region } from "../types/food";

// Display text lives in src/i18n. This file only holds language-neutral values.

export const MEAL_TIMES: MealTime[] = ["breakfast", "lunch", "teatime", "dinner", "supper"];
export const PRICE_TIERS: PriceTier[] = ["cheap", "mid", "pricey"];
export const CATEGORIES: Category[] = ["rice", "noodle", "bread", "meat", "soup", "salad", "snack", "dessert", "drink"];

/** Which region each cuisine belongs to. Order here is the order shown in filters. */
export const REGION_CUISINES: Record<Region, Cuisine[]> = {
  malaysia: ["malay", "chinese", "mamak", "peranakan", "east-malaysia", "western"],
  "southeast-asia": ["thai", "indonesian", "vietnamese", "filipino", "burmese", "cambodian"],
  "east-asia": ["china", "taiwanese", "japanese", "korean"],
  "south-asia": ["indian", "pakistani", "sri-lankan", "nepali"],
  "middle-east": ["middle-eastern", "turkish"],
  europe: ["italian", "french", "spanish", "greek", "british", "german", "east-european"],
  americas: ["american", "mexican", "south-american", "caribbean"],
  africa: ["african"],
  oceania: ["oceanian"],
  "fast-food": ["fast-food"],
};

export const REGIONS = Object.keys(REGION_CUISINES) as Region[];
export const CUISINES: Cuisine[] = REGIONS.flatMap((r) => REGION_CUISINES[r]);

export const CUISINE_REGION = Object.fromEntries(
  REGIONS.flatMap((r) => REGION_CUISINES[r].map((c) => [c, r]))
) as Record<Cuisine, Region>;

/** Price levels are relative, so they make sense in any country. */
export const PRICE_SIGN: Record<PriceTier, string> = {
  cheap: "$",
  mid: "$$",
  pricey: "$$$",
};

/** Rough Malaysian ringgit ceilings, used when someone searches "bawah RM15". */
export const PRICE_MAX: Record<PriceTier, number> = {
  cheap: 10,
  mid: 25,
  pricey: Infinity,
};
