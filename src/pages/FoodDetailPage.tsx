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
import { CATEGORY_LABEL, CUISINE_LABEL, MEAL_LABEL, PRICE_RANGE } from "../constants/labels";
import { stagger } from "../animations/variants";
import NotFoundPage from "./NotFoundPage";

export default function FoodDetailPage() {
  const { id = "" } = useParams();
  const dish = foodService.get(id);
  if (!dish) return <NotFoundPage />;

  const related = sampleDishes(
    foodService.all().filter((d) => d.id !== dish.id && (d.cuisine === dish.cuisine || d.category === dish.category)),
    4
  );

  const facts = [
    { icon: Wallet, label: "Anggaran harga", value: PRICE_RANGE[dish.price] },
    { icon: Clock, label: "Sesuai untuk", value: dish.mealTime.map((m) => MEAL_LABEL[m]).join(", ") },
    { icon: Flame, label: "Pedas", value: dish.spicy ? "Ya, biasanya pedas" : "Tidak pedas" },
    {
      icon: ShieldCheck,
      label: "Halal",
      value: dish.halalOption ? "Versi halal mudah dicari" : "Selalunya tidak halal",
    },
  ];

  return (
    <Page title={`${dish.name} · Makan Mana?`}>
      <section className="container-page pt-6 md:pt-10">
        <Link to="/cari" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={16} /> Semua hidangan
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <motion.div layoutId={`dish-${dish.id}`}>
            <DishImage dish={dish} className="aspect-[4/3] rounded-[2rem]" credit eager />
          </motion.div>

          <div>
            <p className="text-sm font-semibold text-orange-deep">
              {CUISINE_LABEL[dish.cuisine]} · {CATEGORY_LABEL[dish.category]}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{dish.name}</h1>
            <p className="mt-4 text-lg text-ink/85">{dish.description}</p>

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
              Harga ialah anggaran kedai biasa. Status halal bergantung pada kedai; sentiasa semak sijil kedai.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={mapsSearchUrl(dish.name)} target="_blank" rel="noreferrer" className="btn-primary">
                <MapPin size={18} /> Cari kedai berdekatan
              </a>
              <FavouriteButton dish={dish} variant="full" />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page mt-20">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Kalau tak nak {dish.name}…</h2>
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
