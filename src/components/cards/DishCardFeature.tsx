import { Link } from "react-router";
import { motion } from "motion/react";
import { Flame } from "lucide-react";
import type { Dish } from "../../types/food";
import { priceText } from "../../lib/price";
import { useT } from "../../i18n";
import { DishImage } from "../DishImage";
import { FavouriteButton } from "../FavouriteButton";
import { CardBadge } from "../ui/Card";
import { Spotlight } from "../ui/Spotlight";
import { rise } from "../../animations/variants";

/** Variant 1: full-bleed photo with the name over a dark gradient, and a mouse spotlight. */
export function DishCardFeature({ dish }: { dish: Dish }) {
  const t = useT();
  return (
    <motion.article variants={rise} className="group relative">
      <Link to={`/makanan/${dish.id}`} className="block rounded-card focus-visible:outline-offset-4">
        <Spotlight className="overflow-hidden rounded-card shadow-sm transition-[box-shadow,translate] duration-300 group-hover:shadow-lift motion-safe:group-hover:-translate-y-1">
          <DishImage dish={dish} className="aspect-[4/5]" />
          {/* The gradient keeps white text readable on light photos and plate tiles alike. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-ink/90 via-ink/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="line-clamp-2 text-lg font-extrabold leading-tight text-white">{dish.name}</h3>
            <p className="mt-1 truncate text-sm font-medium text-white/85">
              {t.cuisine[dish.cuisine]} · {priceText(dish, t)}
            </p>
          </div>
        </Spotlight>
      </Link>
      {dish.spicy && (
        <CardBadge className="pointer-events-none absolute left-3 top-3 bg-tomato-ink text-white shadow-sm">
          <Flame size={13} aria-hidden="true" /> {t.common.spicy}
        </CardBadge>
      )}
      <div className="absolute right-3 top-3">
        <FavouriteButton dish={dish} />
      </div>
    </motion.article>
  );
}
