import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { MapPin, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { Page } from "../layouts/Page";
import { SmartSearch } from "../components/SmartSearch";
import { FilterPanel } from "../components/FilterPanel";
import { DishCard } from "../components/DishCard";
import { foodService } from "../services/foodService";
import { EMPTY_FILTERS, filterDishes } from "../lib/picker";
import { formatPlace, parseSearch } from "../lib/smartSearch";
import { mapsSearchUrl } from "../lib/maps";
import { CUISINES, MEAL_TIMES } from "../constants/labels";
import { stagger } from "../animations/variants";
import type { Cuisine, DishFilters, MealTime } from "../types/food";

/** Words that describe preferences rather than a dish name, so they shouldn't be used as a text match. */
const STOP_WORDS = /\b(nak|aku|saya|i|want|makan|makanan|food|cari|find|me|something|yang|untuk|dan|and|but|not|too|the|a|ni|hari|today|recommend|suggest|good|sedap|best|where|can|of|in|at|with|tolong|bagi|some)\b/g;

function initialFilters(params: URLSearchParams): { filters: DishFilters; understood: string[]; place: string | null } {
  const q = params.get("q") ?? "";
  const filters: DishFilters = { ...EMPTY_FILTERS };
  const meal = params.get("meal");
  const cuisine = params.get("cuisine");
  if (meal && MEAL_TIMES.includes(meal as MealTime)) filters.mealTime = meal as MealTime;
  if (cuisine && CUISINES.includes(cuisine as Cuisine)) filters.cuisines = [cuisine as Cuisine];
  if (!q) return { filters, understood: [], place: null };

  const parsed = parseSearch(q);
  return { filters: { ...filters, ...parsed.filters }, understood: parsed.understood, place: parsed.place };
}

/** Leftover words (after removing understood preferences) become a name search, e.g. "nasi lemak". */
function leftoverQuery(q: string, place: string | null) {
  let text = q.toLowerCase();
  if (place) text = text.replace(place, " ");
  text = text
    .replace(/(?:bawah|under|below|kurang|max|bajet|budget)?\s*(?:dari|than)?\s*rm\s?\d+/g, " ")
    .replace(/\b(dekat|kat|di|near|around|sekitar|area|nearby|berdekatan)\b/g, " ")
    .replace(/\b(pedas|spicy|tak|tidak|no|halal|murah|cheap|jimat|sarapan|breakfast|pagi|tengah ?hari|lunch|petang|supper|malam|dinner|lewat|western|melayu|malay|cina|chinese|india|indian|mamak|jepun|japanese|korea|korean|thai|siam|sabah|sarawak|nasi|rice|mee|mi|noodles?|roti|bread|sup|soup|snek|snack|dessert|manis|minum|minuman|drink|air)\b/g, " ")
    .replace(STOP_WORDS, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

export default function DiscoverPage() {
  const [params, setParams] = useSearchParams();
  const all = foodService.all();
  const q = params.get("q") ?? "";
  const start = useMemo(() => initialFilters(params), [params]);
  const [filters, setFilters] = useState<DishFilters>(start.filters);
  const [lastKey, setLastKey] = useState(params.toString());
  const [showFilters, setShowFilters] = useState(false);

  // When the URL changes (new search), reset filters from it.
  if (params.toString() !== lastKey) {
    setLastKey(params.toString());
    setFilters(start.filters);
  }

  const nameQuery = q ? leftoverQuery(q, start.place) : "";
  const results = useMemo(() => {
    const strict = filterDishes(all, { ...filters, query: nameQuery });
    // If the leftover words match nothing, fall back to the understood filters only.
    return strict.length || !nameQuery ? strict : filterDishes(all, filters);
  }, [all, filters, nameQuery]);

  const active =
    filters.mealTime !== "any" ||
    filters.price !== "any" ||
    filters.spicy !== "any" ||
    filters.halalOnly ||
    filters.cuisines.length > 0 ||
    filters.categories.length > 0;

  return (
    <Page title="Cari makanan · Makan Mana?">
      <section className="container-page pt-8 md:pt-12">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Cari makanan</h1>
        <p className="mt-2 text-muted">Taip macam kau cakap dengan kawan. Kami faham bajet, masa, pedas, halal dan jenis masakan.</p>
        <div className="mt-6 max-w-2xl">
          <SmartSearch key={q} initial={q} size="md" onSearch={(text) => setParams({ q: text })} />
        </div>

        {start.understood.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-orange-deep">
              <Sparkles size={15} /> Kami faham:
            </span>
            {start.understood.map((u) => (
              <span key={u} className="rounded-full bg-cream px-3 py-1 font-semibold">
                {u}
              </span>
            ))}
            {start.place && (
              <a href={mapsSearchUrl(nameQuery || "restoran", start.place)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-ink underline underline-offset-4">
                <MapPin size={14} /> Buka kedai di {formatPlace(start.place)} dalam Google Maps
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
              <SlidersHorizontal size={18} /> {showFilters ? "Tutup penapis" : "Penapis"}
            </button>
            <div id="discover-filters" className={`${showFilters ? "mt-4 block" : "hidden"} lg:sticky lg:top-24 lg:block`}>
              <FilterPanel filters={filters} onChange={setFilters} />
              {active && (
                <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS })} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
                  <X size={15} /> Kosongkan penapis
                </button>
              )}
            </div>
          </aside>

          <div>
            <p className="text-sm text-muted" role="status">
              {results.length} hidangan
            </p>
            {results.length === 0 ? (
              <div className="mt-4 rounded-card border border-dashed border-line p-10 text-center">
                <p className="text-lg font-bold">Tiada hidangan yang padan</p>
                <p className="mt-1 text-muted">Longgarkan penapis, atau biar roda pilihkan untuk kau.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS })} className="btn-ghost">
                    Kosongkan penapis
                  </button>
                  <Link to="/putar" className="btn-primary">
                    Putar roda
                  </Link>
                </div>
              </div>
            ) : (
              <motion.div
                key={results.map((r) => r.id).join()}
                variants={stagger}
                initial="initial"
                animate="animate"
                className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3"
              >
                {results.map((d) => (
                  <DishCard key={d.id} dish={d} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Page>
  );
}
