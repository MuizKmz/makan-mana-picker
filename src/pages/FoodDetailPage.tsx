import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Clock, Flame, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { Page } from "../layouts/Page";
import { DishImage } from "../components/DishImage";
import { DishCard } from "../components/DishCard";
import { FavouriteButton } from "../components/FavouriteButton";
import { foodService } from "../services/foodService";
import { sampleDishes } from "../lib/picker";
import { mapsSearchUrl } from "../lib/maps";
import { priceText } from "../lib/price";
import { useDescription, useT } from "../i18n";
import { stagger } from "../animations/variants";
import NotFoundPage from "./NotFoundPage";

export default function FoodDetailPage() {
  const t = useT();
  const desc = useDescription();
  const { id = "" } = useParams();
  const dish = foodService.get(id);
  if (!dish) return <NotFoundPage />;

  const related = sampleDishes(
    foodService.all().filter((d) => d.id !== dish.id && (d.cuisine === dish.cuisine || d.category === dish.category)),
    4
  );

  const facts = [
    { icon: Wallet, label: t.detail.price, value: priceText(dish, t) },
    { icon: Clock, label: t.detail.suits, value: dish.mealTime.map((m) => t.meal[m]).join(", ") },
    { icon: Flame, label: t.detail.spicy, value: dish.spicy ? t.detail.spicyYes : t.detail.spicyNo },
    { icon: ShieldCheck, label: t.detail.halal, value: dish.halalOption ? t.detail.halalYes : t.detail.halalNo },
  ];

  return (
    <Page title={`${dish.name} · Makan Mana?`}>
      <section className="container-page pt-6 md:pt-10">
        <Link to="/cari" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={16} /> {t.detail.back}
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <motion.div layoutId={`dish-${dish.id}`}>
            <DishImage dish={dish} className="aspect-[4/3] rounded-[2rem]" credit eager />
          </motion.div>

          <div>
            <p className="text-sm font-semibold text-orange-ink">
              {t.cuisine[dish.cuisine]} · {t.category[dish.category]}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{dish.name}</h1>
            <p className="mt-4 text-lg text-ink/85">{desc(dish)}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-cream p-4">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                    <Icon size={14} /> {label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted">
              {t.detail.note}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={mapsSearchUrl(dish.name)} target="_blank" rel="noreferrer" className="btn-primary">
                <MapPin size={18} /> {t.common.findNearby}
              </a>
              <FavouriteButton dish={dish} variant="full" />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page mt-20">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t.detail.related(dish.name)}</h2>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {related.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </motion.div>
        </section>
      )}
    </Page>
  );
}
