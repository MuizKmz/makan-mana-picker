import type { Category, Cuisine, MealTime, PriceTier } from "../types/food";

export const MEAL_LABEL: Record<MealTime, string> = {
  breakfast: "Sarapan",
  lunch: "Tengah hari",
  teatime: "Minum petang",
  dinner: "Makan malam",
  supper: "Supper",
};

export const PRICE_LABEL: Record<PriceTier, string> = {
  cheap: "Murah",
  mid: "Sederhana",
  pricey: "Belanja sikit",
};

export const PRICE_RANGE: Record<PriceTier, string> = {
  cheap: "RM4–10",
  mid: "RM10–25",
  pricey: "RM25+",
};

export const PRICE_MAX: Record<PriceTier, number> = {
  cheap: 10,
  mid: 25,
  pricey: Infinity,
};

export const CUISINE_LABEL: Record<Cuisine, string> = {
  malay: "Melayu",
  chinese: "Cina",
  indian: "India",
  mamak: "Mamak",
  peranakan: "Peranakan",
  thai: "Siam",
  "east-malaysia": "Sabah & Sarawak",
  western: "Western",
  japanese: "Jepun",
  korean: "Korea",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  rice: "Nasi",
  noodle: "Mi",
  bread: "Roti",
  meat: "Lauk",
  soup: "Sup",
  snack: "Snek",
  dessert: "Pencuci mulut",
  drink: "Minuman",
};

export const MEAL_TIMES = Object.keys(MEAL_LABEL) as MealTime[];
export const PRICE_TIERS = Object.keys(PRICE_LABEL) as PriceTier[];
export const CUISINES = Object.keys(CUISINE_LABEL) as Cuisine[];
export const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];
