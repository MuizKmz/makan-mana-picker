import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Dices, MapPin, Search } from "lucide-react";
import { Page } from "../layouts/Page";
import { SmartSearch } from "../components/SmartSearch";
import { DishImage } from "../components/DishImage";
import { DishCard } from "../components/DishCard";
import { foodService } from "../services/foodService";
import { filterDishes, mealTimeForHour, sampleDishes } from "../lib/picker";
import { CUISINE_LABEL, MEAL_LABEL } from "../constants/labels";
import { rise, stagger } from "../animations/variants";
import type { Cuisine, Dish } from "../types/food";

const HERO_IDS = ["nasi-lemak", "roti-canai", "char-kway-teow", "satay"];
const HERO_LABELS: Record<string, string> = {
  "nasi-lemak": "Nasi Lemak · RM4–10",
  "roti-canai": "Roti Canai · Mamak",
  "char-kway-teow": "Char Kway Teow",
  satay: "Satay · Makan malam",
};

const CUISINE_TILES: { cuisine: Cuisine; dishId: string }[] = [
  { cuisine: "malay", dishId: "nasi-kerabu" },
  { cuisine: "chinese", dishId: "wantan-mee" },
  { cuisine: "indian", dishId: "banana-leaf-rice" },
  { cuisine: "mamak", dishId: "mee-goreng-mamak" },
  { cuisine: "western", dishId: "chicken-chop" },
  { cuisine: "japanese", dishId: "ramen" },
  { cuisine: "korean", dishId: "korean-fried-chicken" },
  { cuisine: "east-malaysia", dishId: "laksa-sarawak" },
];

const QUICK = [
  { to: "/putar", icon: Dices, title: "Pilih secara rawak", body: "Putar roda, terima nasib.", tone: "bg-orange text-white" },
  { to: "/cari", icon: Search, title: "Cari makanan", body: "Tapis ikut bajet, masa dan selera.", tone: "bg-white text-ink border border-line" },
  { to: "/dekat", icon: MapPin, title: "Kedai berdekatan", body: "Buka kedai sebenar di Google Maps.", tone: "bg-avocado text-white" },
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
  const all = foodService.all();
  const meal = mealTimeForHour(new Date().getHours());
  const hero = HERO_IDS.map((id) => foodService.get(id)).filter(Boolean) as Dish[];
  const now = sampleDishes(filterDishes(all, { mealTime: meal }), 4);

  return (
    <Page title="Makan Mana? Nak makan apa hari ni?">
      {/* Hero */}
      <section className="container-page grid grid-cols-[minmax(0,1fr)] items-center gap-10 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        <motion.div variants={stagger} initial="initial" animate="animate">
          <motion.p variants={rise} className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-sm font-semibold text-orange-deep">
            <span className="h-2 w-2 rounded-full bg-avocado" aria-hidden="true" />
            {all.length} hidangan Malaysia, sumber terbuka
          </motion.p>
          <motion.h1 variants={rise} className="mt-5 text-[2.6rem] font-extrabold sm:text-6xl lg:text-[4.2rem]">
            Perut dah lapar, tapi tak tahu nak makan apa?
          </motion.h1>
          <motion.p variants={rise} className="mt-5 max-w-xl text-lg text-muted">
            Tak perlu pening kepala. Taip apa yang kau idam, atau putar roda, dan Makan Mana pilihkan yang ngam dengan selera dan bajet.
          </motion.p>
          <motion.div variants={rise} className="mt-7 max-w-xl">
            <SmartSearch />
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid h-[22rem] grid-cols-6 grid-rows-6 gap-3 sm:h-[30rem]"
          aria-hidden="true"
        >
          {hero[0] && <HeroPhoto dish={hero[0]} label={HERO_LABELS[hero[0].id]} className="col-span-4 row-span-4" />}
          {hero[1] && <HeroPhoto dish={hero[1]} label={HERO_LABELS[hero[1].id]} className="col-span-2 row-span-3" />}
          {hero[2] && <HeroPhoto dish={hero[2]} label={HERO_LABELS[hero[2].id]} className="col-span-2 row-span-3" />}
          {hero[3] && <HeroPhoto dish={hero[3]} label={HERO_LABELS[hero[3].id]} className="col-span-4 row-span-2" />}
        </motion.div>
      </section>

      {/* Quick actions */}
      <section className="container-page mt-12" aria-label="Pilihan pantas">
        <motion.ul variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-60px" }} className="grid gap-3 sm:grid-cols-3">
          {QUICK.map(({ to, icon: Icon, title, body, tone }) => (
            <motion.li key={to} variants={rise}>
              <Link to={to} className={`group flex h-full items-center gap-4 rounded-card p-5 transition-transform hover:-translate-y-1 ${tone}`}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
                  <Icon size={24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold">{title}</span>
                  <span className="block text-sm opacity-80">{body}</span>
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
            <h2 className="text-3xl font-extrabold sm:text-4xl">Sesuai untuk {MEAL_LABEL[meal].toLowerCase()} sekarang</h2>
            <p className="mt-2 text-muted">Dipilih dari set data kami ikut masa sekarang. Muat semula untuk cadangan lain.</p>
          </div>
          <Link to={`/cari?meal=${meal}`} className="hidden shrink-0 items-center gap-1 font-bold text-orange-deep hover:underline sm:inline-flex">
            Lihat semua <ArrowRight size={18} />
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
        <h2 className="text-3xl font-extrabold sm:text-4xl">Teroka ikut masakan</h2>
        <p className="mt-2 text-muted">Dari kedai mamak sampai ramen, semua ada dalam satu tempat.</p>
        <motion.ul variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-60px" }} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CUISINE_TILES.map(({ cuisine, dishId }) => {
            const dish = foodService.get(dishId);
            if (!dish) return null;
            return (
              <motion.li key={cuisine} variants={rise}>
                <Link to={`/cari?cuisine=${cuisine}`} className="group relative block overflow-hidden rounded-card">
                  <DishImage dish={dish} className="aspect-square" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <span className="absolute bottom-3 left-4 text-lg font-extrabold text-white">{CUISINE_LABEL[cuisine]}</span>
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
            <h2 className="text-3xl font-extrabold sm:text-5xl">Masih tak boleh decide?</h2>
            <p className="mt-3 max-w-md text-white/70">
              Biar roda pilih. Kau boleh tapis ikut bajet, pedas atau halal, dan buang hidangan yang memang tak nak.
            </p>
            <Link to="/putar" className="btn-primary mt-6">
              <Dices size={18} /> Putar roda sekarang
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
