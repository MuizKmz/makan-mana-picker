import { useState } from "react";
import { ExternalLink, LocateFixed, MapPin, Search } from "lucide-react";
import { Page } from "../layouts/Page";
import { mapsSearchUrl } from "../lib/maps";
import { useT } from "../i18n";

type Location = { lat: number; lng: number };

/** Brand names only (no logos). Each opens that chain's nearest outlets in Google Maps. */
const FAST_FOOD = ["McDonald's", "KFC", "Burger King", "Marrybrown", "Texas Chicken", "Pizza Hut", "Domino's", "Subway", "A&W", "Wingstop"];
type Status = "idle" | "locating" | "ready" | "denied" | "unsupported";

export default function NearbyPage() {
  const t = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [loc, setLoc] = useState<Location | null>(null);
  const [area, setArea] = useState("");
  const [what, setWhat] = useState("");

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ready");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const near = loc ?? (area.trim() || null);

  return (
    <Page title={t.nearby.title}>
      <section className="container-page pt-8 md:pt-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t.nearby.headline}</h1>
          <p className="mt-3 text-lg text-muted">
            {t.nearby.sub}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
          <div className="rounded-card border border-line bg-white p-6">
            <h2 className="text-lg font-extrabold">{t.nearby.step1}</h2>
            <button type="button" onClick={locate} disabled={status === "locating"} className="btn-primary mt-4 w-full sm:w-auto">
              <LocateFixed size={18} /> {status === "locating" ? t.nearby.locating : status === "ready" ? t.nearby.found : t.nearby.useLocation}
            </button>
            <p className="mt-2 text-sm text-muted" role="status">
              {status === "ready" && t.nearby.readyNote}
              {status === "denied" && t.nearby.denied}
              {status === "unsupported" && t.nearby.unsupported}
              {(status === "idle" || status === "locating") && t.nearby.idle}
            </p>
            <label htmlFor="area" className="mt-4 block text-sm font-bold">
              {t.nearby.area}
            </label>
            <input
              id="area"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                if (loc) {
                  setLoc(null);
                  setStatus("idle");
                }
              }}
              placeholder="Mount Austin, Johor Bahru"
              className="mt-1.5 h-12 w-full rounded-2xl border-2 border-line bg-white px-4 font-medium focus:border-orange focus:outline-none"
            />
          </div>

          <div className="rounded-card border border-line bg-white p-6">
            <h2 className="text-lg font-extrabold">{t.nearby.step2}</h2>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (what.trim()) window.open(mapsSearchUrl(what.trim(), near), "_blank", "noopener");
              }}
            >
              <label htmlFor="what" className="sr-only">
                {t.nearby.whatLabel}
              </label>
              <input
                id="what"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder={t.nearby.whatPlaceholder}
                className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-4 font-medium focus:border-orange focus:outline-none"
              />
              <button type="submit" className="btn-primary !px-4" aria-label={t.nearby.open}>
                <Search size={18} />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {t.nearby.quick.map((q) => (
                <a key={q} href={mapsSearchUrl(q, near)} target="_blank" rel="noreferrer" className="chip !min-h-9">
                  <MapPin size={14} className="text-orange-ink" /> {q}
                </a>
              ))}
            </div>
            <p className="mt-5 text-sm font-bold">{t.nearby.fastFood}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {FAST_FOOD.map((b) => (
                <a key={b} href={mapsSearchUrl(b, near)} target="_blank" rel="noreferrer" className="chip !min-h-9">
                  {b}
                </a>
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted">
              <ExternalLink size={13} /> {loc ? t.nearby.opensNear : area.trim() ? t.nearby.opensArea(area.trim()) : t.nearby.opensMe}
            </p>
          </div>
        </div>
      </section>
    </Page>
  );
}
