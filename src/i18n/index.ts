import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ms, type Dict } from "./ms";
import { en } from "./en";
import type { Dish } from "../types/food";

export type Lang = "ms" | "en";

const dictionaries: Record<Lang, Dict> = { ms, en };

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

/** Default to Malay, unless the browser is clearly set to English only. */
function detect(): Lang {
  if (typeof navigator === "undefined") return "ms";
  const langs = navigator.languages ?? [navigator.language];
  return langs.some((l) => l.toLowerCase().startsWith("ms")) ? "ms" : langs[0]?.toLowerCase().startsWith("en") ? "en" : "ms";
}

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: detect(),
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === "ms" ? "en" : "ms" }),
    }),
    { name: "makanmana:lang:v1" }
  )
);

/** Returns the dictionary for the current language. */
export function useT(): Dict {
  const lang = useLang((s) => s.lang);
  return dictionaries[lang];
}

/** Dish description in the current language. */
export function useDescription() {
  const lang = useLang((s) => s.lang);
  return (dish: Dish) => (lang === "en" ? dish.descriptionEn : dish.description);
}

/** Keeps <html lang> in sync so screen readers pronounce text correctly. */
export function useSyncHtmlLang() {
  const t = useT();
  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);
}
