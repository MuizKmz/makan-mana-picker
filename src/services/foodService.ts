import type { Dish } from "../types/food";
import data from "../data/dishes.json";

/**
 * The dataset ships with the app. Keeping access behind this service means
 * the data source can later move to an API without touching components.
 */
const dishes = data as Dish[];
const byId = new Map(dishes.map((d) => [d.id, d]));

export const foodService = {
  all(): Dish[] {
    return dishes;
  },
  get(id: string): Dish | undefined {
    return byId.get(id);
  },
};
