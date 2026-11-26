import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useFoodStore } from "../store/useFoodStore";
import { useToast } from "../store/useToast";
import type { Dish } from "../types/food";

export function FavouriteButton({ dish, variant = "icon" }: { dish: Dish; variant?: "icon" | "full" }) {
  const isFav = useFoodStore((s) => s.favourites.includes(dish.id));
  const toggle = useFoodStore((s) => s.toggleFavourite);
  const toast = useToast((s) => s.show);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(dish.id);
    toast(isFav ? `${dish.name} dibuang dari kegemaran` : `${dish.name} disimpan ke kegemaran`);
  };

  if (variant === "full") {
    return (
      <button type="button" onClick={onClick} className="btn-ghost" aria-pressed={isFav}>
        <Heart size={18} className={isFav ? "fill-tomato text-tomato" : ""} />
        {isFav ? "Disimpan" : "Simpan"}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-pressed={isFav}
      aria-label={isFav ? `Buang ${dish.name} dari kegemaran` : `Simpan ${dish.name} ke kegemaran`}
      className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm hover:bg-white"
    >
      <Heart size={18} className={isFav ? "fill-tomato text-tomato" : ""} />
    </motion.button>
  );
}
