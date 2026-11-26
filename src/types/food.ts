export type MealTime = "breakfast" | "lunch" | "teatime" | "dinner" | "supper";
export type PriceTier = "cheap" | "mid" | "pricey";
export type Category = "rice" | "noodle" | "bread" | "meat" | "soup" | "snack" | "dessert" | "drink";
export type Cuisine =
  | "malay"
  | "chinese"
  | "indian"
  | "mamak"
  | "peranakan"
  | "thai"
  | "east-malaysia"
  | "western"
  | "japanese"
  | "korean";

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
  price: PriceTier;
  description: string;
  /** English Wikipedia page title used for the photo, or null when there isn't a good one. */
  wiki: string | null;
}

export type SpicyPref = "any" | "yes" | "no";

export interface DishFilters {
  mealTime: MealTime | "any";
  price: PriceTier | "any";
  spicy: SpicyPref;
  halalOnly: boolean;
  cuisines: Cuisine[];
  categories: Category[];
  excludeIds: string[];
  query: string;
}
