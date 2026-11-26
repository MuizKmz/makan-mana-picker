import { describe, expect, it } from "vitest";
import { filterDishes, mealTimeForHour, pickDish, sampleDishes } from "../src/lib/picker";
import { parseSearch } from "../src/lib/smartSearch";
import type { Dish } from "../src/types/food";

const base: Omit<Dish, "id" | "name"> = {
  emoji: "🍛",
  category: "rice",
  cuisine: "malay",
  mealTime: ["lunch"],
  spicy: false,
  halalOption: true,
  price: "cheap",
  description: "Test dish description.",
  wiki: null,
};

const dishes: Dish[] = [
  { ...base, id: "a", name: "Nasi Lemak", mealTime: ["breakfast"], spicy: true },
  { ...base, id: "b", name: "Char Kway Teow", category: "noodle", cuisine: "chinese", price: "mid" },
  { ...base, id: "c", name: "Bak Kut Teh", category: "soup", cuisine: "chinese", halalOption: false, price: "pricey" },
];

describe("filterDishes", () => {
  it("returns everything with no filters", () => {
    expect(filterDishes(dishes, {})).toHaveLength(3);
  });

  it("treats budget as a ceiling", () => {
    expect(filterDishes(dishes, { price: "mid" }).map((d) => d.id)).toEqual(["a", "b"]);
    expect(filterDishes(dishes, { price: "cheap" }).map((d) => d.id)).toEqual(["a"]);
  });

  it("combines halal, spicy, cuisine and exclusions", () => {
    expect(filterDishes(dishes, { halalOnly: true }).map((d) => d.id)).toEqual(["a", "b"]);
    expect(filterDishes(dishes, { spicy: "yes" }).map((d) => d.id)).toEqual(["a"]);
    expect(filterDishes(dishes, { cuisines: ["chinese"], excludeIds: ["b"] }).map((d) => d.id)).toEqual(["c"]);
  });

  it("matches text queries on name", () => {
    expect(filterDishes(dishes, { query: "kway" }).map((d) => d.id)).toEqual(["b"]);
  });
});

describe("pickDish", () => {
  it("returns null for an empty list", () => {
    expect(pickDish([])).toBeNull();
  });

  it("avoids recent picks when possible", () => {
    expect(pickDish(dishes, ["a", "b"], () => 0)?.id).toBe("c");
    expect(pickDish(dishes, ["a", "b", "c"], () => 0)?.id).toBe("a");
  });
});

describe("sampleDishes", () => {
  it("always includes the required dish without duplicates", () => {
    const out = sampleDishes(dishes, 3, dishes[2]);
    expect(out).toHaveLength(3);
    expect(out.map((d) => d.id)).toContain("c");
    expect(new Set(out.map((d) => d.id)).size).toBe(3);
  });
});

describe("mealTimeForHour", () => {
  it("maps the clock to a meal", () => {
    expect(mealTimeForHour(8)).toBe("breakfast");
    expect(mealTimeForHour(13)).toBe("lunch");
    expect(mealTimeForHour(16)).toBe("teatime");
    expect(mealTimeForHour(20)).toBe("dinner");
    expect(mealTimeForHour(1)).toBe("supper");
  });
});

describe("parseSearch", () => {
  it("understands a Malay sentence", () => {
    const r = parseSearch("nak makan nasi pedas bawah RM15 dekat JB malam ni");
    expect(r.filters.categories).toEqual(["rice"]);
    expect(r.filters.spicy).toBe("yes");
    expect(r.filters.price).toBe("mid");
    expect(r.filters.mealTime).toBe("dinner");
    expect(r.place).toBe("jb");
  });

  it("handles 'tak pedas', halal and supper", () => {
    const r = parseSearch("supper tak pedas halal");
    expect(r.filters.spicy).toBe("no");
    expect(r.filters.halalOnly).toBe(true);
    expect(r.filters.mealTime).toBe("supper");
  });

  it("understands English", () => {
    const r = parseSearch("cheap korean food around Mount Austin");
    expect(r.filters.price).toBe("cheap");
    expect(r.filters.cuisines).toEqual(["korean"]);
    expect(r.place).toBe("mount austin");
  });
});
