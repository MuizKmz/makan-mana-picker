import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowUp, Sparkles } from "lucide-react";
import { useT } from "../i18n";

interface Props {
  initial?: string;
  size?: "lg" | "md";
  onSearch?: (q: string) => void;
  showChips?: boolean;
}

/** Sentence-style search box. Submits to /cari?q=... unless onSearch is given. */
export function SmartSearch({ initial = "", size = "lg", onSearch, showChips = true }: Props) {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  const t = useT();

  const submit = (value: string) => {
    const text = value.trim();
    if (!text) return;
    if (onSearch) onSearch(text);
    else navigate(`/cari?q=${encodeURIComponent(text)}`);
  };

  const big = size === "lg";

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className={`flex items-center gap-2 rounded-full border-2 border-ink bg-white pl-4 pr-2 transition-shadow focus-within:shadow-[0_0_0_5px_rgba(249,115,54,0.2)] ${
          big ? "h-16" : "h-14"
        }`}
      >
        <Sparkles size={20} className="shrink-0 text-orange-ink" aria-hidden="true" />
        <label htmlFor="smart-search" className="sr-only">
          {t.search.label}
        </label>
        <input
          id="smart-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.search.placeholder}
          className={`min-w-0 flex-1 bg-transparent font-medium text-ink placeholder:text-muted/80 focus:outline-none ${
            big ? "text-base sm:text-lg" : "text-base"
          }`}
          autoComplete="off"
          enterKeyHint="search"
        />
        <button
          type="submit"
          aria-label={t.search.submit}
          className={`grid shrink-0 place-items-center rounded-full bg-orange text-ink transition-colors hover:bg-[#FF8550] ${
            big ? "h-12 w-12" : "h-10 w-10"
          }`}
        >
          <ArrowUp size={20} />
        </button>
      </form>

      {showChips && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap">
          {t.search.chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setQ(chip);
                submit(chip);
              }}
              className="chip shrink-0 !min-h-9 !text-[13px]"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
