import { Link } from "react-router";
import { motion } from "motion/react";
import { Check, MapPin, RotateCw, X } from "lucide-react";
import type { Dish } from "../../types/food";
import { PRICE_SIGN } from "../../constants/labels";
import { useDescription, useT } from "../../i18n";
import { DishImage } from "../DishImage";
import { FavouriteButton } from "../FavouriteButton";
import { CardBody } from "../ui/Card";
import { mapsSearchUrl } from "../../lib/maps";

interface Props {
  dish: Dish;
  reasons: string[];
  onAgain: () => void;
  onExclude: () => void;
}

/** Variant 2: the spin result, framed by a slowly turning orange glow (see .glow-frame in index.css). */
export function ResultCardGlow({ dish, reasons, onAgain, onExclude }: Props) {
  const t = useT();
  const desc = useDescription();
  return (
    <motion.section
      key={dish.id}
      initial={{ opacity: 0, y: 32, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      aria-live="polite"
      className="glow-frame rounded-card p-[3px]"
    >
      <div className="overflow-hidden rounded-[calc(var(--radius-card)-3px)] bg-white">
        <div className="relative">
          <DishImage dish={dish} className="aspect-[16/10]" credit eager />
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-orange-ink shadow-sm backdrop-blur-sm"
          >
            {t.picker.resultKicker}
          </motion.p>
        </div>
        <CardBody>
          <h2 className="text-3xl font-extrabold sm:text-4xl">{dish.name}</h2>
          <p className="mt-1 text-sm text-muted">
            {t.cuisine[dish.cuisine]} · {t.category[dish.category]} · {t.picker.estimate(PRICE_SIGN[dish.price], t.price[dish.price])}
          </p>
          <p className="mt-3 text-ink/90">{desc(dish)}</p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {reasons.map((r) => (
              <li key={r} className="inline-flex items-center gap-1.5 rounded-full bg-avocado/10 px-3 py-1 text-sm font-medium">
                <Check size={15} className="shrink-0 text-avocado-deep" aria-hidden="true" /> {r}
              </li>
            ))}
          </ul>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" onClick={onAgain} className="btn-primary col-span-2 sm:col-span-1">
              <RotateCw size={18} /> {t.picker.again}
            </button>
            <FavouriteButton dish={dish} variant="full" />
            <button type="button" onClick={onExclude} className="btn-ghost">
              <X size={18} /> {t.picker.nope}
            </button>
            <a href={mapsSearchUrl(dish.name)} target="_blank" rel="noreferrer" className="btn-ghost col-span-2 sm:col-span-1">
              <MapPin size={18} /> {t.common.findNearby}
            </a>
          </div>
          <Link to={`/makanan/${dish.id}`} className="mt-4 inline-block text-sm font-semibold text-muted underline underline-offset-4 hover:text-ink">
            {t.picker.details(dish.name)}
          </Link>
        </CardBody>
      </div>
    </motion.section>
  );
}
