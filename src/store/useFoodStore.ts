import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FoodState {
  favourites: string[];
  recentPicks: string[];
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  rememberPick: (id: string) => void;
}

const RECENT_LIMIT = 6;

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      favourites: [],
      recentPicks: [],
      toggleFavourite: (id) =>
        set((s) => ({
          favourites: s.favourites.includes(id)
            ? s.favourites.filter((f) => f !== id)
            : [id, ...s.favourites],
        })),
      isFavourite: (id) => get().favourites.includes(id),
      rememberPick: (id) =>
        set((s) => ({
          recentPicks: [id, ...s.recentPicks.filter((r) => r !== id)].slice(0, RECENT_LIMIT),
        })),
    }),
    { name: "makanmana:store:v1" }
  )
);
