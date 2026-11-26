import type { Cuisine, DishFilters, MealTime, PriceTier, SpicyPref } from "../types/food";
import { CUISINE_LABEL, CUISINES, MEAL_LABEL, MEAL_TIMES } from "../constants/labels";

interface Props {
  filters: DishFilters;
  onChange: (next: DishFilters) => void;
  showCuisines?: boolean;
}

const BUDGETS: { value: PriceTier | "any"; label: string }[] = [
  { value: "any", label: "Tak kisah" },
  { value: "cheap", label: "Bawah RM10" },
  { value: "mid", label: "Bawah RM25" },
];

const SPICY: { value: SpicyPref; label: string }[] = [
  { value: "any", label: "Tak kisah" },
  { value: "yes", label: "Nak pedas" },
  { value: "no", label: "Tak nak pedas" },
];

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 text-sm font-bold">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FilterPanel({ filters, onChange, showCuisines = true }: Props) {
  const set = (patch: Partial<DishFilters>) => onChange({ ...filters, ...patch });

  const toggleCuisine = (c: Cuisine) =>
    set({
      cuisines: filters.cuisines.includes(c) ? filters.cuisines.filter((x) => x !== c) : [...filters.cuisines, c],
    });

  return (
    <div className="space-y-5">
      <Group label="Bila nak makan?">
        {(["any", ...MEAL_TIMES] as (MealTime | "any")[]).map((m) => (
          <button key={m} type="button" className="chip" aria-pressed={filters.mealTime === m} onClick={() => set({ mealTime: m })}>
            {m === "any" ? "Bila-bila" : MEAL_LABEL[m]}
          </button>
        ))}
      </Group>

      <Group label="Bajet">
        {BUDGETS.map((b) => (
          <button key={b.value} type="button" className="chip" aria-pressed={filters.price === b.value} onClick={() => set({ price: b.value })}>
            {b.label}
          </button>
        ))}
      </Group>

      <Group label="Pedas?">
        {SPICY.map((s) => (
          <button key={s.value} type="button" className="chip" aria-pressed={filters.spicy === s.value} onClick={() => set({ spicy: s.value })}>
            {s.label}
          </button>
        ))}
      </Group>

      {showCuisines && (
        <Group label="Jenis masakan">
          {CUISINES.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={filters.cuisines.includes(c)} onClick={() => toggleCuisine(c)}>
              {CUISINE_LABEL[c]}
            </button>
          ))}
        </Group>
      )}

      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={filters.halalOnly}
          onChange={(e) => set({ halalOnly: e.target.checked })}
          className="h-5 w-5 accent-[#F97336]"
        />
        Hanya hidangan yang mudah dapat versi halal
      </label>
    </div>
  );
}
