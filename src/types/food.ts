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
  /** Relative price level: cheap ($), mid ($$), pricey ($$$). */
  price: PriceTier;
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
  query: string;
}
