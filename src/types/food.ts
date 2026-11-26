export type MealTime = "breakfast" | "lunch" | "teatime" | "dinner" | "supper";
export type PriceTier = "cheap" | "mid" | "pricey";
export type Category = "rice" | "noodle" | "bread" | "meat" | "soup" | "salad" | "snack" | "dessert" | "drink";

export type Region =
  | "malaysia"
  | "southeast-asia"
  | "east-asia"
  | "south-asia"
  | "middle-east"
  | "europe"
  | "americas"
  | "africa"
  | "oceania"
  | "fast-food";

export type Cuisine =
  // Malaysia
  | "malay"
  | "chinese"
  | "mamak"
  | "peranakan"
  | "east-malaysia"
  | "western"
  // Southeast Asia
  | "thai"
  | "indonesian"
  | "vietnamese"
  | "filipino"
  | "burmese"
  | "cambodian"
  // East Asia
  | "china"
  | "taiwanese"
  | "japanese"
  | "korean"
  // South Asia
  | "indian"
  | "pakistani"
  | "sri-lankan"
  | "nepali"
  // Middle East
  | "middle-eastern"
  | "turkish"
  // Europe
  | "italian"
  | "french"
  | "spanish"
  | "greek"
  | "british"
  | "german"
  | "east-european"
  // Americas
  | "american"
  | "mexican"
  | "south-american"
  | "caribbean"
  // Africa, Oceania, fast food
  | "african"
  | "oceanian"
  | "fast-food";

export interface Dish {
  id: string;
  name: string;
  emoji: string;
  category: Category;
  cuisine: Cuisine;
  mealTime: MealTime[];
  spicy: boolean;
  /** true when a halal version is easy to find in Malaysia. Says nothing about a specific shop. */
  halalOption: boolean;
  /** Rough price level, used when there's no ringgit estimate. */
  price: PriceTier;
  /** Estimated price range for one serving in Malaysia, in ringgit [min, max]. Filled by `npm run estimate-prices`. */
  priceMYR: [number, number] | null;
  /** Malay description (10–120 chars). */
  description: string;
  /** English description (10–120 chars). */
  descriptionEn: string;
  /** Your own photo, e.g. "/food/nasi-lemak.webp" (file in public/food). Takes priority over `wiki`. */
  image: string | null;
  /** English Wikipedia page title used for the photo, or null when there isn't a good one. */
  wiki: string | null;
}

export type SpicyPref = "any" | "yes" | "no";

export interface DishFilters {
  mealTime: MealTime | "any";
  price: PriceTier | "any";
  spicy: SpicyPref;
  halalOnly: boolean;
  regions: Region[];
  cuisines: Cuisine[];
  categories: Category[];
  excludeIds: string[];
  /** Exact ringgit ceiling from searches like "bawah RM15". Uses priceMYR when a dish has it. */
  maxRM: number | null;
  query: string;
}
