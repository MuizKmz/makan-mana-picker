import type { Cuisine, DishFilters, MealTime, PriceTier, Region, SpicyPref } from "../types/food";
import { MEAL_TIMES, REGION_CUISINES, REGIONS } from "../constants/labels";
import { useT } from "../i18n";

interface Props {
  filters: DishFilters;
  onChange: (next: DishFilters) => void;
  showCuisines?: boolean;
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 text-sm font-bold">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FilterPanel({ filters, onChange, showCuisines = true }: Props) {
  const t = useT();
  const set = (patch: Partial<DishFilters>) => onChange({ ...filters, ...patch });

  const budgets: { value: PriceTier | "any"; label: string }[] = [
    { value: "any", label: t.filters.any },
    { value: "cheap", label: t.filters.under10 },
    { value: "mid", label: t.filters.under25 },
  ];
  const spicyOptions: { value: SpicyPref; label: string }[] = [
    { value: "any", label: t.filters.any },
    { value: "yes", label: t.filters.wantSpicy },
    { value: "no", label: t.filters.noSpicy },
  ];

  // Regions first; the cuisines of the picked regions appear underneath, so 36 cuisines never show at once.
  const toggleRegion = (r: Region) => {
    const on = filters.regions.includes(r);
    const regions = on ? filters.regions.filter((x) => x !== r) : [...filters.regions, r];
    const cuisines = on ? filters.cuisines.filter((c) => !REGION_CUISINES[r].includes(c)) : filters.cuisines;
    set({ regions, cuisines });
  };

  const toggleCuisine = (c: Cuisine) =>
    set({
      cuisines: filters.cuisines.includes(c) ? filters.cuisines.filter((x) => x !== c) : [...filters.cuisines, c],
    });

  const visibleCuisines = filters.regions.flatMap((r) => REGION_CUISINES[r]);
  const showCuisineRow = visibleCuisines.length > 1;

  return (
    <div className="space-y-5">
      <Group label={t.filters.when}>
        {(["any", ...MEAL_TIMES] as (MealTime | "any")[]).map((m) => (
          <button key={m} type="button" className="chip" aria-pressed={filters.mealTime === m} onClick={() => set({ mealTime: m })}>
            {m === "any" ? t.filters.anytime : t.meal[m]}
          </button>
        ))}
      </Group>

      {showCuisines && (
        <>
          <Group label={t.filters.region}>
            <button
              type="button"
              className="chip"
              aria-pressed={filters.regions.length === 0 && filters.cuisines.length === 0}
              onClick={() => set({ regions: [], cuisines: [] })}
            >
              {t.filters.allRegions}
            </button>
            {REGIONS.map((r) => (
              <button key={r} type="button" className="chip" aria-pressed={filters.regions.includes(r)} onClick={() => toggleRegion(r)}>
                {t.region[r]}
              </button>
            ))}
          </Group>

          {showCuisineRow && (
            <Group label={t.filters.cuisine}>
              {visibleCuisines.map((c) => (
                <button key={c} type="button" className="chip" aria-pressed={filters.cuisines.includes(c)} onClick={() => toggleCuisine(c)}>
                  {t.cuisine[c]}
                </button>
              ))}
            </Group>
          )}
        </>
      )}

      <Group label={t.filters.budget}>
        {budgets.map((b) => (
          <button key={b.value} type="button" className="chip" aria-pressed={filters.price === b.value} onClick={() => set({ price: b.value })}>
            {b.label}
          </button>
        ))}
      </Group>

      <Group label={t.filters.spicyQ}>
        {spicyOptions.map((s) => (
          <button key={s.value} type="button" className="chip" aria-pressed={filters.spicy === s.value} onClick={() => set({ spicy: s.value })}>
            {s.label}
          </button>
        ))}
      </Group>

      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={filters.halalOnly}
          onChange={(e) => set({ halalOnly: e.target.checked })}
          className="h-5 w-5 accent-[#F97336]"
        />
        {t.filters.halalOnly}
      </label>
    </div>
  );
}
