import { Link } from "react-router";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { Page } from "../layouts/Page";
import { DishCard } from "../components/DishCard";
import { foodService } from "../services/foodService";
import { useFoodStore } from "../store/useFoodStore";
import { stagger } from "../animations/variants";
import type { Dish } from "../types/food";
import { useT } from "../i18n";

export default function FavouritesPage() {
  const t = useT();
  const ids = useFoodStore((s) => s.favourites);
  const dishes = ids.map((id) => foodService.get(id)).filter(Boolean) as Dish[];

  return (
    <Page title={t.favourites.title}>
      <section className="container-page pt-8 md:pt-12">
        <h1 className="text-4xl font-extrabold sm:text-5xl">{t.favourites.headline}</h1>
        <p className="mt-2 text-muted">{t.favourites.sub}</p>

        {dishes.length === 0 ? (
          <div className="mt-8 rounded-card border border-dashed border-line p-10 text-center">
            <Heart size={32} className="mx-auto text-tomato" />
            <p className="mt-3 text-lg font-bold">{t.favourites.emptyTitle}</p>
            <p className="mt-1 text-muted">{t.favourites.emptyBody}</p>
            <Link to="/cari" className="btn-primary mt-5">
              {t.favourites.emptyCta}
            </Link>
          </div>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate" className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {dishes.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </motion.div>
        )}
      </section>
    </Page>
  );
}
