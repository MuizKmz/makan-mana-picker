import { Link } from "react-router";
import { motion } from "motion/react";
import type { Dish } from "../types/food";
import { priceText } from "../lib/price";
import { useT } from "../i18n";
import { DishImage } from "./DishImage";
import { FavouriteButton } from "./FavouriteButton";
import { rise } from "../animations/variants";

export function DishCard({ dish }: { dish: Dish }) {
  const t = useT();
  return (
    <motion.article variants={rise} className="group relative">
      <Link to={`/makanan/${dish.id}`} className="block rounded-card focus-visible:outline-offset-4">
        <DishImage dish={dish} className="aspect-[4/3] rounded-card" />
        <div className="mt-3 flex items-start justify-between gap-3 px-1">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold">{dish.name}</h3>
            <p className="text-sm text-muted">
              {t.cuisine[dish.cuisine]} · {priceText(dish, t)}
            </p>
          </div>
          {dish.spicy && (
            <span className="mt-0.5 shrink-0 rounded-full bg-tomato/10 px-2 py-0.5 text-xs font-semibold text-tomato-ink">{t.common.spicy}</span>
          )}
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <FavouriteButton dish={dish} />
      </div>
    </motion.article>
  );
}
