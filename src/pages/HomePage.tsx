import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Dices, MapPin, Search } from "lucide-react";
import { Page } from "../layouts/Page";
import { SmartSearch } from "../components/SmartSearch";
import { DishImage } from "../components/DishImage";
import { DishCard } from "../components/DishCard";
import { foodService } from "../services/foodService";
import { filterDishes, mealTimeForHour, sampleDishes } from "../lib/picker";
import { useT } from "../i18n";
import { rise, stagger } from "../animations/variants";
import type { Dish, Region } from "../types/food";
import { CUISINE_REGION } from "../constants/labels";

const HERO_IDS = ["nasi-lemak", "roti-canai", "char-kway-teow", "satay"];

/** One signature dish per region for the explore tiles. */
const REGION_TILES: { region: Region; dishId: string }[] = [
  { region: "malaysia", dishId: "nasi-lemak" },
  { region: "southeast-asia", dishId: "pad-thai" },
  { region: "east-asia", dishId: "ramen" },
  { region: "south-asia", dishId: "butter-chicken" },
  { region: "middle-east", dishId: "shawarma" },
  { region: "europe", dishId: "pizza-margherita" },
  { region: "americas", dishId: "tacos" },
  { region: "africa", dishId: "jollof-rice" },
  { region: "oceania", dishId: "pavlova" },
  { region: "fast-food", dishId: "burger" },
];

const QUICK = [
  { to: "/putar", icon: Dices, tone: "bg-orange text-ink" },
  { to: "/cari", icon: Search, tone: "bg-white text-ink border border-line" },
  { to: "/dekat", icon: MapPin, tone: "bg-avocado-deep text-white" },
];

function HeroPhoto({ dish, className, label }: { dish: Dish; className: string; label: string }) {
  return (
    <motion.div variants={rise} className={`relative ${className}`}>
      <DishImage dish={dish} className="h-full w-full rounded-card" eager />
      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur-sm">
        {label}
      </span>
    </motion.div>
  );
}

export default function HomePage() {
  const t = useT();
  const all = foodService.all();
  const meal = mealTimeForHour(new Date().getHours());
  const hero = HERO_IDS.map((id) => foodService.get(id)).filter(Boolean) as Dish[];
  const now = sampleDishes(filterDishes(all, { mealTime: meal }), 4);

  return (
    <Page title={t.home.title}>
      {/* Hero */}
      <section className="container-page grid grid-cols-[minmax(0,1fr)] items-center gap-10 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        <motion.div variants={stagger} initial="initial" animate="animate">
          <motion.p variants={rise} className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-sm font-semibold text-orange-ink">
            <span className="h-2 w-2 rounded-full bg-avocado" aria-hidden="true" />
            {t.home.badge(all.length)}
          </motion.p>
          <motion.h1 variants={rise} className="mt-5 text-[2.6rem] font-extrabold sm:text-6xl lg:text-[4.2rem]">
            {t.home.headline}
          </motion.h1>
          <motion.p variants={rise} className="mt-5 max-w-xl text-lg text-muted">
            {t.home.sub}
          </motion.p>
          <motion.div variants={rise} className="mt-7 max-w-xl">
            <SmartSearch />
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid h-64 grid-cols-6 grid-rows-6 gap-2 sm:h-[30rem] sm:gap-3"
          aria-hidden="true"
        >
          {hero[0] && <HeroPhoto dish={hero[0]} label={t.home.heroTags[hero[0].id]} className="col-span-4 row-span-4" />}
          {hero[1] && <HeroPhoto dish={hero[1]} label={t.home.heroTags[hero[1].id]} className="col-span-2 row-span-3" />}
          {hero[2] && <HeroPhoto dish={hero[2]} label={t.home.heroTags[hero[2].id]} className="col-span-2 row-span-3" />}
          {hero[3] && <HeroPhoto dish={hero[3]} label={t.home.heroTags[hero[3].id]} className="col-span-4 row-span-2" />}
        </motion.div>
      </section>

      {/* Quick actions */}
      <section className="container-page mt-12" aria-label={t.home.quickLabel}>
        <motion.ul variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-60px" }} className="grid gap-3 sm:grid-cols-3">
          {QUICK.map(({ to, icon: Icon, tone }, i) => (
            <motion.li key={to} variants={rise}>
              <Link to={to} className={`group flex h-full items-center gap-4 rounded-card p-5 transition-transform hover:-translate-y-1 ${tone}`}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
                  <Icon size={24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold">{t.home.quick[i].title}</span>
                  <span className="block text-sm opacity-80">{t.home.quick[i].body}</span>
                </span>
                <ArrowRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* Right now */}
      <section className="container-page mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">{t.home.nowTitle(t.meal[meal])}</h2>
            <p className="mt-2 text-muted">{t.home.nowSub}</p>
          </div>
          <Link to={`/cari?meal=${meal}`} className="hidden shrink-0 items-center gap-1 font-bold text-orange-ink hover:underline sm:inline-flex">
            {t.home.seeAll} <ArrowRight size={18} />
          </Link>
        </div>
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-60px" }} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {now.map((d) => (
            <DishCard key={d.id} dish={d} />
          ))}
        </motion.div>
      </section>

      {/* Cuisines */}
      <section className="container-page mt-20">
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t.home.cuisineTitle}</h2>
        <p className="mt-2 text-muted">{t.home.cuisineSub}</p>
        <motion.ul variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-60px" }} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {REGION_TILES.map(({ region, dishId }) => {
            const dish = foodService.get(dishId);
            if (!dish) return null;
            const count = all.filter((d) => CUISINE_REGION[d.cuisine] === region).length;
            return (
              <motion.li key={region} variants={rise}>
                <Link to={`/cari?region=${region}`} className="group relative block overflow-hidden rounded-card">
                  <DishImage dish={dish} className="aspect-[4/5]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                  <span className="absolute inset-x-4 bottom-3 text-white">
                    <span className="block text-lg font-extrabold leading-tight">{t.region[region]}</span>
                    <span className="block text-xs font-semibold text-white/85">{t.home.regionCount(count)}</span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      {/* Picker band */}
      <section className="container-page mt-20">
        <div className="grid items-center gap-6 overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-5xl">{t.home.bandTitle}</h2>
            <p className="mt-3 max-w-md text-white/70">
              {t.home.bandBody}
            </p>
            <Link to="/putar" className="btn-primary mt-6">
              <Dices size={18} /> {t.home.bandCta}
            </Link>
          </div>
          <div className="relative mx-auto hidden aspect-square w-56 md:block" aria-hidden="true">
            <div
              className="absolute inset-0 rounded-full border-[6px] border-white/90"
              style={{
                background:
                  "conic-gradient(#F97336 0 45deg,#FFF8EF 0 90deg,#EF5350 0 135deg,#FFE7CF 0 180deg,#6D9255 0 225deg,#FFF8EF 0 270deg,#E85D24 0 315deg,#FFE7CF 0 360deg)",
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink bg-white" />
          </div>
        </div>
      </section>
    </Page>
  );
}
