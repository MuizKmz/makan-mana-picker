import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";
import { RotateCcw, Shuffle, SlidersHorizontal } from "lucide-react";
import { foodService } from "../services/foodService";
import { EMPTY_FILTERS, filterDishes, mealTimeForHour, pickDish, sampleDishes, whyPicked } from "../lib/picker";
import { useFoodStore } from "../store/useFoodStore";
import { SpinWheel } from "../components/SpinWheel";
import { ResultCard } from "../components/ResultCard";
import { FilterPanel } from "../components/FilterPanel";
import { Page } from "../layouts/Page";
import type { Dish, DishFilters } from "../types/food";

const WHEEL_SIZE = 8;

export default function PickerPage() {
  const all = foodService.all();
  const reduce = useReducedMotion();
  const recentPicks = useFoodStore((s) => s.recentPicks);
  const rememberPick = useFoodStore((s) => s.rememberPick);

  const [filters, setFilters] = useState<DishFilters>(() => ({
    ...EMPTY_FILTERS,
    mealTime: mealTimeForHour(new Date().getHours()),
  }));
  const [wheel, setWheel] = useState<Dish[]>(() => sampleDishes(filterDishes(all, filters), WHEEL_SIZE));
  const [target, setTarget] = useState(0);
  const [spinKey, setSpinKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Dish | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const pool = useMemo(() => filterDishes(all, filters), [all, filters]);

  const updateFilters = (next: DishFilters) => {
    setFilters(next);
    if (!spinning) {
      setWheel(sampleDishes(filterDishes(all, next), WHEEL_SIZE));
      setResult(null);
    }
  };

  const spin = () => {
    if (spinning || pool.length === 0) return;
    const pick = pickDish(pool, recentPicks);
    if (!pick) return;
    const nextWheel = sampleDishes(pool, WHEEL_SIZE, pick);
    setWheel(nextWheel);
    setTarget(nextWheel.findIndex((d) => d.id === pick.id));
    setResult(null);
    setSpinning(true);
    setSpinKey((k) => k + 1);
  };

  const onDone = () => {
    const dish = wheel[target];
    setSpinning(false);
    setResult(dish);
    rememberPick(dish.id);
    // On phones the result sits below the wheel: bring it into view once it lands.
    setTimeout(() => {
      const el = resultRef.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.6) {
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }, 350);
    if (!reduce) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.45 },
        colors: ["#F97336", "#EF5350", "#6D9255", "#FFF8EF", "#E85D24"],
        disableForReducedMotion: true,
      });
    }
  };

  const exclude = () => {
    if (!result) return;
    const next = { ...filters, excludeIds: [...filters.excludeIds, result.id] };
    setFilters(next);
    setResult(null);
    setWheel(sampleDishes(filterDishes(all, next), WHEEL_SIZE));
  };

  const resetExcluded = () => updateFilters({ ...filters, excludeIds: [] });

  return (
    <Page title="Putar roda · Makan Mana?">
      <section className="container-page pt-8 md:pt-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Biar roda yang tentukan.</h1>
          <p className="mt-3 text-lg text-muted">
            Tetapkan selera kau, tekan putar, dan terima je apa yang keluar. Atau tekan "Tak nak ni" kalau memang tak boleh.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <SpinWheel
              dishes={wheel}
              targetIndex={target}
              spinKey={spinKey}
              onDone={onDone}
              onCenterClick={spin}
              disabled={spinning || pool.length === 0}
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={spin} disabled={spinning || pool.length === 0} className="btn-primary min-w-48 disabled:opacity-60">
                <Shuffle size={18} /> {spinning ? "Tengah putar…" : "Surprise me"}
              </button>
              <button
                type="button"
                onClick={() => setShowFilters((s) => !s)}
                className="btn-ghost lg:hidden"
                aria-expanded={showFilters}
                aria-controls="picker-filters"
              >
                <SlidersHorizontal size={18} /> Penapis
              </button>
            </div>
            <p className="mt-3 text-center text-sm text-muted" role="status">
              {pool.length === 0
                ? "Tiada hidangan ikut penapis ni. Longgarkan sikit."
                : `${pool.length} hidangan dalam cabutan`}
              {filters.excludeIds.length > 0 && (
                <>
                  {" · "}
                  <button type="button" onClick={resetExcluded} className="inline-flex items-center gap-1 font-semibold text-ink underline underline-offset-4">
                    <RotateCcw size={13} /> pulihkan {filters.excludeIds.length} yang dibuang
                  </button>
                </>
              )}
            </p>
          </div>

          <div ref={resultRef} className="scroll-mt-24 space-y-6">
            <AnimatePresence mode="wait">
              {result && (
                <ResultCard
                  key={result.id}
                  dish={result}
                  reasons={whyPicked(result, filters)}
                  onAgain={spin}
                  onExclude={exclude}
                />
              )}
            </AnimatePresence>

            <motion.div
              id="picker-filters"
              className={`${showFilters ? "block" : "hidden"} rounded-card border border-line bg-white p-5 lg:block`}
            >
              <FilterPanel filters={filters} onChange={updateFilters} />
            </motion.div>
          </div>
        </div>
      </section>
    </Page>
  );
}
