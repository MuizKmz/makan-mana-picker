import { useMemo, useState } from "react";

const PAGE = 24;
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { MapPin, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { Page } from "../layouts/Page";
import { SmartSearch } from "../components/SmartSearch";
import { FilterPanel } from "../components/FilterPanel";
import { DishCard } from "../components/DishCard";
import { foodService } from "../services/foodService";
import { EMPTY_FILTERS, filterDishes } from "../lib/picker";
import { describe, formatPlace, parseSearch, type Understood } from "../lib/smartSearch";
import { useT } from "../i18n";
import { mapsSearchUrl } from "../lib/maps";
import { CUISINES, MEAL_TIMES, REGIONS } from "../constants/labels";
import { stagger } from "../animations/variants";
import type { Cuisine, DishFilters, MealTime, Region } from "../types/food";

function initialFilters(params: URLSearchParams): { filters: DishFilters; understood: Understood[]; place: string | null; rest: string } {
  const q = params.get("q") ?? "";
  const filters: DishFilters = { ...EMPTY_FILTERS };
  const meal = params.get("meal");
  const cuisine = params.get("cuisine");
  const region = params.get("region");
  if (region && REGIONS.includes(region as Region)) filters.regions = [region as Region];
  if (meal && MEAL_TIMES.includes(meal as MealTime)) filters.mealTime = meal as MealTime;
  if (cuisine && CUISINES.includes(cuisine as Cuisine)) filters.cuisines = [cuisine as Cuisine];
  if (!q) return { filters, understood: [], place: null, rest: "" };

  const parsed = parseSearch(q);
  return { filters: { ...filters, ...parsed.filters }, understood: parsed.understood, place: parsed.place, rest: parsed.rest };
}

export default function DiscoverPage() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const all = foodService.all();
  const q = params.get("q") ?? "";
  const start = useMemo(() => initialFilters(params), [params]);
  const [filters, setFilters] = useState<DishFilters>(start.filters);
  const [lastKey, setLastKey] = useState(params.toString());
  const [showFilters, setShowFilters] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [lastFilters, setLastFilters] = useState(filters);

  // New filters start from the first page again.
  if (lastFilters !== filters) {
    setLastFilters(filters);
    setLimit(PAGE);
  }

  // When the URL changes (new search), reset filters from it.
  if (params.toString() !== lastKey) {
    setLastKey(params.toString());
    setFilters(start.filters);
  }

  const nameQuery = start.rest;
  const results = useMemo(() => {
    const strict = filterDishes(all, { ...filters, query: nameQuery });
    // If the leftover words match nothing, fall back to the understood filters only.
    return strict.length || !nameQuery ? strict : filterDishes(all, filters);
  }, [all, filters, nameQuery]);

  // Nothing matched: drop the budget and spice limits and offer the nearest dishes instead of a dead end.
  const closest = useMemo(
    () => (results.length ? [] : filterDishes(all, { ...filters, price: "any", spicy: "any" }).slice(0, 6)),
    [all, filters, results.length]
  );

  const active =
    filters.mealTime !== "any" ||
    filters.price !== "any" ||
    filters.spicy !== "any" ||
    filters.halalOnly ||
    filters.regions.length > 0 ||
    filters.cuisines.length > 0 ||
    filters.categories.length > 0;

  return (
    <Page title={t.discover.title}>
      <section className="container-page pt-8 md:pt-12">
        <h1 className="text-4xl font-extrabold sm:text-5xl">{t.discover.headline}</h1>
        <p className="mt-2 text-muted">{t.discover.sub}</p>
        <div className="mt-6 max-w-2xl">
          <SmartSearch key={q} initial={q} size="md" onSearch={(text) => setParams({ q: text })} />
        </div>

        {start.understood.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-orange-ink">
              <Sparkles size={15} /> {t.discover.understood}
            </span>
            {start.understood.map((u, i) => (
              <span key={i} className="rounded-full bg-cream px-3 py-1 font-semibold">
                {describe(u, t)}
              </span>
            ))}
            {start.place && (
              <a href={mapsSearchUrl(nameQuery || "restoran", start.place)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-ink underline underline-offset-4">
                <MapPin size={14} /> {t.discover.openIn(formatPlace(start.place))}
              </a>
            )}
          </motion.div>
        )}

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside>
            <button
              type="button"
              className="btn-ghost w-full lg:hidden"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              aria-controls="discover-filters"
            >
              <SlidersHorizontal size={18} /> {showFilters ? t.filters.close : t.filters.toggle}
            </button>
            <div id="discover-filters" className={`${showFilters ? "mt-4 block" : "hidden"} lg:sticky lg:top-24 lg:block`}>
              <FilterPanel filters={filters} onChange={setFilters} />
              {active && (
                <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS })} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
                  <X size={15} /> {t.filters.clear}
                </button>
              )}
            </div>
          </aside>

          <div>
            <p className="text-sm text-muted" role="status">
              {t.common.nDishes(results.length)}
            </p>
            {results.length === 0 && closest.length > 0 ? (
              <div className="mt-4">
                <p className="font-semibold">{t.discover.closest}</p>
                <motion.div variants={stagger} initial="initial" animate="animate" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                  {closest.map((d) => (
                    <DishCard key={d.id} dish={d} />
                  ))}
                </motion.div>
              </div>
            ) : results.length === 0 ? (
              <div className="mt-4 rounded-card border border-dashed border-line p-10 text-center">
                <p className="text-lg font-bold">{t.discover.emptyTitle}</p>
                <p className="mt-1 text-muted">{t.discover.emptyBody}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS })} className="btn-ghost">
                    {t.filters.clear}
                  </button>
                  <Link to="/putar" className="btn-primary">
                    {t.common.spinWheel}
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  key={results.map((r) => r.id).join()}
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3"
                >
                  {results.slice(0, PAGE).map((d) => (
                    <DishCard key={d.id} dish={d} />
                  ))}
                </motion.div>
                {limit > PAGE && (
                  <motion.div variants={stagger} initial="initial" animate="animate" className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                    {results.slice(PAGE, limit).map((d) => (
                      <DishCard key={d.id} dish={d} />
                    ))}
                  </motion.div>
                )}
                {results.length > limit && (
                  <div className="mt-10 text-center">
                    <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn-ghost">
                      {t.common2.showMore(results.length - limit)}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </Page>
  );
}
