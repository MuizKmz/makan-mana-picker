import type { Dish, DishFilters, MealTime, PriceTier } from "../types/food";
import type { Dict } from "../i18n/ms";
import { CUISINE_REGION } from "../constants/labels";

/** Budget is a ceiling: "mid" means cheap or mid. */
const PRICE_RANK: Record<PriceTier, number> = { cheap: 0, mid: 1, pricey: 2 };

export const EMPTY_FILTERS: DishFilters = {
  mealTime: "any",
  price: "any",
  spicy: "any",
  halalOnly: false,
  regions: [],
  cuisines: [],
  categories: [],
  excludeIds: [],
  maxRM: null,
  query: "",
};

export function mealTimeForHour(hour: number): MealTime {
  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 15) return "lunch";
  if (hour >= 15 && hour < 18) return "teatime";
  if (hour >= 18 && hour < 22) return "dinner";
  return "supper";
}

function normalise(text: string) {
  return text.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s]/gu, " ");
}

export function filterDishes(dishes: Dish[], f: Partial<DishFilters>): Dish[] {
  const filters = { ...EMPTY_FILTERS, ...f };
  const words = normalise(filters.query).split(/\s+/).filter(Boolean);

  return dishes.filter((d) => {
    if (filters.mealTime !== "any" && !d.mealTime.includes(filters.mealTime)) return false;
    if (filters.maxRM !== null && d.priceMYR) {
      // Real estimate available: the cheapest typical price must fit the budget.
      if (d.priceMYR[0] > filters.maxRM) return false;
    } else if (filters.price !== "any" && PRICE_RANK[d.price] > PRICE_RANK[filters.price]) {
      return false;
    }
    if (filters.spicy === "yes" && !d.spicy) return false;
    if (filters.spicy === "no" && d.spicy) return false;
    if (filters.halalOnly && !d.halalOption) return false;
    // A picked cuisine is more specific than a region, so it wins when both are set.
    if (filters.cuisines.length) {
      if (!filters.cuisines.includes(d.cuisine)) return false;
    } else if (filters.regions.length && !filters.regions.includes(CUISINE_REGION[d.cuisine])) {
      return false;
    }
    if (filters.categories.length && !filters.categories.includes(d.category)) return false;
    if (filters.excludeIds.includes(d.id)) return false;
    if (words.length) {
      const haystack = normalise(`${d.name} ${d.description} ${d.descriptionEn}`);
      if (!words.every((w) => haystack.includes(w))) return false;
    }
    return true;
  });
}

/** Random pick that avoids recent ids when it can. `random` is injectable for tests. */
export function pickDish(dishes: Dish[], recentIds: string[] = [], random = Math.random): Dish | null {
  if (dishes.length === 0) return null;
  const fresh = dishes.filter((d) => !recentIds.includes(d.id));
  const pool = fresh.length ? fresh : dishes;
  return pool[Math.floor(random() * pool.length)];
}

/** Pick up to `count` distinct dishes for the wheel, always including `must` if given. */
export function sampleDishes(dishes: Dish[], count: number, must?: Dish, random = Math.random): Dish[] {
  const rest = dishes.filter((d) => d.id !== must?.id);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  const picked = rest.slice(0, must ? count - 1 : count);
  if (must) picked.splice(Math.floor(random() * (picked.length + 1)), 0, must);
  return picked;
}

/** Plain-language reasons a dish matched, shown under the result. */
export function whyPicked(dish: Dish, f: Partial<DishFilters>, t: Dict): string[] {
  const filters = { ...EMPTY_FILTERS, ...f };
  const reasons: string[] = [];
  if (filters.mealTime !== "any") reasons.push(t.why.meal(t.meal[filters.mealTime]));
  if (filters.price !== "any") reasons.push(t.why.budget(t.price[dish.price]));
  if (filters.spicy === "yes") reasons.push(t.why.spicy);
  if (filters.spicy === "no") reasons.push(t.why.notSpicy);
  if (filters.halalOnly) reasons.push(t.why.halal);
  if (reasons.length === 0) reasons.push(t.why.random);
  return reasons;
}
