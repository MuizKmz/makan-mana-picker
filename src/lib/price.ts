import type { Dish } from "../types/food";
import type { Dict } from "../i18n/ms";

/** "≈ RM8–12" when there's an estimate, otherwise the plain level ("Murah"). */
export function priceText(dish: Dish, t: Dict): string {
  if (dish.priceMYR) {
    const [min, max] = dish.priceMYR;
    return min === max ? `≈ RM${min}` : `≈ RM${min}–${max}`;
  }
  return t.price[dish.price];
}
