import { useRef, useState } from "react";
import { useInView } from "motion/react";
import type { Category, Dish } from "../types/food";
import { useDishImage } from "../hooks/useDishImage";
import { useT } from "../i18n";

interface Props {
  dish: Dish;
  className?: string;
  /** Show a small "Wikipedia" credit link over Wikipedia photos. */
  credit?: boolean;
  eager?: boolean;
}

/** Placeholder tint per food type, so a grid of tiles still reads as varied. */
const TILE: Record<Category, { bg: string; dot: string; rim: string }> = {
  rice: { bg: "#FFE9C4", dot: "#F5CF8E", rim: "#F2C27A" },
  noodle: { bg: "#FFDCC6", dot: "#F7B994", rim: "#F2A77B" },
  bread: { bg: "#F7E6CB", dot: "#E9CC9C", rim: "#E0BE88" },
  meat: { bg: "#F9D6CB", dot: "#EEAF9C", rim: "#E79E89" },
  salad: { bg: "#E3F0D8", dot: "#BCD9A6", rim: "#AACD92" },
  soup: { bg: "#FBE2D2", dot: "#F1C1A3", rim: "#EAB291" },
  snack: { bg: "#EDF0D6", dot: "#D4DBA8", rim: "#C9D196" },
  dessert: { bg: "#F9DFE7", dot: "#EFB9CA", rim: "#E8A7BC" },
  drink: { bg: "#DCEDE5", dot: "#B3D6C5", rim: "#A2CCB8" },
};

/** Illustrated stand-in: the dish emoji served on a plate, tinted by food type. */
function PlateTile({ dish }: { dish: Dish }) {
  const tone = TILE[dish.category];
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{
        backgroundColor: tone.bg,
        backgroundImage: `radial-gradient(${tone.dot} 1.3px, transparent 1.5px)`,
        backgroundSize: "16px 16px",
      }}
    >
      <div
        className="grid aspect-square place-items-center rounded-full bg-white"
        style={{
          // Size from whichever side is shorter, so wide or tall tiles never clip the plate.
          width: "min(46cqw, 66cqh)",
          boxShadow: `0 0 0 6px ${tone.rim}55, 0 14px 30px -14px rgba(36,33,31,0.45)`,
        }}
      >
        <span className="leading-none drop-shadow-sm" style={{ fontSize: "min(24cqw, 34cqh)" }} aria-hidden="true">
          {dish.emoji}
        </span>
      </div>
    </div>
  );
}

/**
 * Dish photo with a stable aspect box (no layout shift).
 * Priority: your own photo (dish.image) -> Wikipedia photo -> illustrated plate tile.
 */
export function DishImage({ dish, className = "", credit = false, eager = false }: Props) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  // Only look up a photo once the tile is close to the screen; with 200+ dishes this saves a lot of requests.
  const inView = useInView(ref, { once: true, margin: "300px 0px" });
  const [ownFailed, setOwnFailed] = useState(false);
  const useOwn = Boolean(dish.image) && !ownFailed;
  const { status, image } = useDishImage(useOwn || (!inView && !eager) ? null : dish.wiki);
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);

  const src = useOwn ? dish.image : status === "ready" && image && !broken ? image.src : null;
  const fromWiki = !useOwn && src !== null;
  const waiting = !useOwn && (inView || eager) && status === "loading";

  return (
    <div ref={ref} className={`relative overflow-hidden bg-cream [container-type:size] ${className}`}>
      {(!src || !loaded) && !waiting && <PlateTile dish={dish} />}
      {waiting && <div className="absolute inset-0 animate-pulse bg-[#f6ebdc]" />}

      {src && (
        <img
          key={src}
          src={src}
          alt={dish.name}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => (useOwn ? setOwnFailed(true) : setBroken(true))}
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {credit && fromWiki && loaded && image && (
        <a
          href={image.pageUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm hover:bg-black/70"
        >
          {t.common.photoCredit}
        </a>
      )}
    </div>
  );
}
