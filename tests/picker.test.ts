import { describe, expect, it } from "vitest";
import { filterDishes, mealTimeForHour, pickDish, sampleDishes, whyPicked } from "../src/lib/picker";
import { describe as describeItem, parseSearch } from "../src/lib/smartSearch";
import { ms } from "../src/i18n/ms";
import { en } from "../src/i18n/en";
import type { Dish } from "../src/types/food";

const base: Omit<Dish, "id" | "name"> = {
  emoji: "🍛",
  category: "rice",
  cuisine: "malay",
  mealTime: ["lunch"],
  spicy: false,
  halalOption: true,
  price: "cheap",
  priceMYR: null,
  description: "Test dish description.",
  descriptionEn: "Test dish description in English.",
  image: null,
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

describe("bilingual", () => {
  it("understands an English sentence", () => {
    const r = parseSearch("spicy noodles under RM10 tonight");
    expect(r.filters.spicy).toBe("yes");
    expect(r.filters.categories).toEqual(["noodle"]);
    expect(r.filters.price).toBe("cheap");
    expect(r.filters.mealTime).toBe("dinner");
  });

  it("describes what it understood in either language", () => {
    const r = parseSearch("nasi pedas bawah RM15 dekat JB");
    expect(r.understood.map((u) => describeItem(u, ms))).toEqual(["Bawah RM15", "Pedas", "Nasi", "Lokasi: JB"]);
    expect(r.understood.map((u) => describeItem(u, en))).toEqual(["Under RM15", "Spicy", "Rice", "Location: JB"]);
  });

  it("explains a pick in the chosen language", () => {
    expect(whyPicked(dishes[0], { spicy: "yes" }, en)).toEqual(["Spicy, like you wanted"]);
    expect(whyPicked(dishes[0], { spicy: "yes" }, ms)).toEqual(["Pedas, macam yang kau nak"]);
  });

  it("understands global cuisines and regions", () => {
    expect(parseSearch("makanan jepun murah").filters.cuisines).toEqual(["japanese"]);
    expect(parseSearch("cheap chinese food").filters.cuisines).toEqual(["chinese", "china"]);
    expect(parseSearch("fast food supper").filters.cuisines).toEqual(["fast-food"]);
    expect(parseSearch("something european").filters.regions).toEqual(["europe"]);
  });

  it("filters by region when no cuisine is picked", () => {
    expect(filterDishes(dishes, { regions: ["east-asia"] })).toHaveLength(0);
    expect(filterDishes(dishes, { regions: ["malaysia"] }).map((d) => d.id)).toEqual(["a", "b", "c"]);
  });

  it("leaves only dish words for the name search", () => {
    expect(parseSearch("cari nasi lemak pedas bawah RM10").rest).toBe("lemak");
    expect(parseSearch("cheap italian food near KL").rest).toBe("");
    expect(parseSearch("I want ramen tonight").rest).toBe("ramen");
  });

  it("uses real ringgit estimates when a dish has one", () => {
    const priced: Dish[] = [
      { ...dishes[0], id: "x", price: "mid", priceMYR: [12, 18] },
      { ...dishes[0], id: "y", price: "cheap", priceMYR: [20, 30] },
      { ...dishes[0], id: "z", price: "cheap", priceMYR: null },
    ];
    // x fits RM15 by its estimate, y doesn't, z falls back to its level.
    expect(filterDishes(priced, parseSearch("bawah RM15").filters).map((d) => d.id)).toEqual(["x", "z"]);
  });

  it("searches English descriptions too", () => {
    expect(filterDishes(dishes, { query: "english" })).toHaveLength(3);
  });
});
