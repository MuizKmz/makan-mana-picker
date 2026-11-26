import { useState } from "react";
import type { Dish } from "../types/food";
import { useDishImage } from "../hooks/useDishImage";

interface Props {
  dish: Dish;
  className?: string;
  /** Show a small "Wikipedia" credit link over the photo. */
  credit?: boolean;
  eager?: boolean;
}

/**
 * Real food photo with a stable aspect box (no layout shift),
 * a shimmer while loading, and an illustrated fallback tile.
 */
export function DishImage({ dish, className = "", credit = false, eager = false }: Props) {
  const { status, image } = useDishImage(dish.wiki);
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);

  const showPhoto = status === "ready" && image && !broken;

  return (
    <div className={`relative overflow-hidden bg-cream ${className}`}>
      {status === "loading" && <div className="absolute inset-0 animate-pulse bg-[#f6ebdc]" />}

      {!showPhoto && status !== "loading" && (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            backgroundImage: "radial-gradient(#f3dcc2 1.2px, transparent 1.4px)",
            backgroundSize: "14px 14px",
          }}
        >
          <span className="text-5xl drop-shadow-sm" aria-hidden="true">{dish.emoji}</span>
        </div>
      )}

      {showPhoto && (
        <img
          src={image.src}
          alt={dish.name}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setBroken(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {credit && showPhoto && (
        <a
          href={image.pageUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm hover:bg-black/60"
        >
          Foto: Wikipedia
        </a>
      )}
    </div>
  );
}
