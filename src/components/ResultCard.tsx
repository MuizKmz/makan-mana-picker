import { Link } from "react-router";
import { motion } from "motion/react";
import { Check, MapPin, RotateCw, X } from "lucide-react";
import type { Dish } from "../types/food";
import { CATEGORY_LABEL, CUISINE_LABEL, PRICE_RANGE } from "../constants/labels";
import { DishImage } from "./DishImage";
import { FavouriteButton } from "./FavouriteButton";
import { mapsSearchUrl } from "../lib/maps";

interface Props {
  dish: Dish;
  reasons: string[];
  onAgain: () => void;
  onExclude: () => void;
}

export function ResultCard({ dish, reasons, onAgain, onExclude }: Props) {
  return (
    <motion.section
      key={dish.id}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      aria-live="polite"
      className="overflow-hidden rounded-card border border-line bg-white"
    >
      <DishImage dish={dish} className="aspect-[16/10]" credit eager />
      <div className="p-5 sm:p-6">
        <p className="text-sm font-semibold text-orange">Hari ni makan…</p>
        <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">{dish.name}</h2>
        <p className="mt-1 text-sm text-muted">
          {CUISINE_LABEL[dish.cuisine]} · {CATEGORY_LABEL[dish.category]} · Anggaran {PRICE_RANGE[dish.price]}
        </p>
        <p className="mt-3 text-ink/90">{dish.description}</p>

        <ul className="mt-4 space-y-1.5">
          {reasons.map((r) => (
            <li key={r} className="flex items-center gap-2 text-sm">
              <Check size={16} className="shrink-0 text-avocado" /> {r}
            </li>
          ))}
        </ul>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button type="button" onClick={onAgain} className="btn-primary col-span-2 sm:col-span-1">
            <RotateCw size={18} /> Pilih lagi
          </button>
          <FavouriteButton dish={dish} variant="full" />
          <button type="button" onClick={onExclude} className="btn-ghost">
            <X size={18} /> Tak nak ni
          </button>
          <a href={mapsSearchUrl(dish.name)} target="_blank" rel="noreferrer" className="btn-ghost col-span-2 sm:col-span-1">
            <MapPin size={18} /> Cari kedai berdekatan
          </a>
        </div>
        <Link to={`/makanan/${dish.id}`} className="mt-4 inline-block text-sm font-semibold text-muted underline underline-offset-4 hover:text-ink">
          Lihat butiran {dish.name}
        </Link>
      </div>
    </motion.section>
  );
}
