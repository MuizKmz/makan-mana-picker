import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useFoodStore } from "../store/useFoodStore";
import { useToast } from "../store/useToast";
import type { Dish } from "../types/food";
import { useT } from "../i18n";

export function FavouriteButton({ dish, variant = "icon" }: { dish: Dish; variant?: "icon" | "full" }) {
  const isFav = useFoodStore((s) => s.favourites.includes(dish.id));
  const toggle = useFoodStore((s) => s.toggleFavourite);
  const toast = useToast((s) => s.show);
  const t = useT();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(dish.id);
    toast(isFav ? t.common.removedToast(dish.name) : t.common.savedToast(dish.name));
  };

  if (variant === "full") {
    return (
      <button type="button" onClick={onClick} className="btn-ghost" aria-pressed={isFav}>
        <Heart size={18} className={isFav ? "fill-tomato text-tomato" : ""} />
        {isFav ? t.common.saved : t.common.save}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-pressed={isFav}
      aria-label={isFav ? t.common.removeFrom(dish.name) : t.common.saveTo(dish.name)}
      className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm hover:bg-white"
    >
      <Heart size={18} className={isFav ? "fill-tomato text-tomato" : ""} />
    </motion.button>
  );
}
