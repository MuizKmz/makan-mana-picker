import { motion } from "motion/react";
import { useLang, useT, type Lang } from "../i18n";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "ms", label: "BM" },
  { value: "en", label: "EN" },
];

/** Two-option segmented switch. The active pill slides between options. */
export function LangToggle({ className = "" }: { className?: string }) {
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const t = useT();

  return (
    <div role="group" aria-label={t.nav.switchTo} className={`flex h-10 items-center rounded-full bg-cream p-1 ${className}`}>
      {OPTIONS.map((o) => {
        const active = lang === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setLang(o.value)}
            aria-pressed={active}
            lang={o.value}
            className={`relative h-8 min-w-9 rounded-full px-2.5 text-xs font-extrabold transition-colors ${active ? "text-white" : "text-muted hover:text-ink"}`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
