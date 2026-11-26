import { Link } from "react-router";
import { motion } from "motion/react";
import type { Dish } from "../../types/food";
import { PRICE_SIGN } from "../../constants/labels";
import { useT } from "../../i18n";
import { DishImage } from "../DishImage";
import { FavouriteButton } from "../FavouriteButton";
import { rise } from "../../animations/variants";

/** Variant 3: one-line row with a small thumbnail, for favourites and short lists. */
export function DishCardCompact({ dish }: { dish: Dish }) {
  const t = useT();
  return (
    <motion.article variants={rise} className="group relative">
      <Link
        to={`/makanan/${dish.id}`}
        className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5 pr-16 transition-colors hover:border-[#e2d3c0]"
      >
        <DishImage dish={dish} className="h-16 w-16 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <h3 className="truncate font-bold">{dish.name}</h3>
          <p className="truncate text-sm text-muted">
            {t.cuisine[dish.cuisine]} · {PRICE_SIGN[dish.price]}
            {dish.spicy && <span className="font-semibold text-tomato-ink"> · {t.common.spicy}</span>}
          </p>
        </div>
      </Link>
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <FavouriteButton dish={dish} />
      </div>
    </motion.article>
  );
}
