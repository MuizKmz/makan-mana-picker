import { useState } from "react";
import { ExternalLink, LocateFixed, MapPin, Search } from "lucide-react";
import { Page } from "../layouts/Page";
import { mapsSearchUrl } from "../lib/maps";

type Location = { lat: number; lng: number };
type Status = "idle" | "locating" | "ready" | "denied" | "unsupported";

const QUICK_SEARCHES = ["Nasi lemak", "Kedai mamak", "Nasi kandar", "Restoran halal", "Kopitiam", "Western food", "Ramen", "Supper"];

export default function NearbyPage() {
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
    <Page title="Kedai berdekatan · Makan Mana?">
      <section className="container-page pt-8 md:pt-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Kedai berdekatan</h1>
          <p className="mt-3 text-lg text-muted">
            Kami tak reka senarai kedai. Kami buka carian Google Maps sebenar di sekitar kau, lengkap dengan jarak, waktu buka dan ulasan.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
          <div className="rounded-card border border-line bg-white p-6">
            <h2 className="text-lg font-extrabold">1. Di mana kau?</h2>
            <button type="button" onClick={locate} disabled={status === "locating"} className="btn-primary mt-4 w-full sm:w-auto">
              <LocateFixed size={18} /> {status === "locating" ? "Mencari lokasi…" : status === "ready" ? "Lokasi dijumpai" : "Guna lokasi saya"}
            </button>
            <p className="mt-2 text-sm text-muted" role="status">
              {status === "ready" && "Lokasi kau hanya digunakan dalam pelayar ini untuk pautan Google Maps."}
              {status === "denied" && "Akses lokasi ditolak. Taip kawasan kau di bawah sebagai ganti."}
              {status === "unsupported" && "Pelayar ni tak sokong lokasi. Taip kawasan kau di bawah."}
              {status === "idle" && "Atau taip negeri, bandar atau kawasan."}
            </p>
            <label htmlFor="area" className="mt-4 block text-sm font-bold">
              Kawasan
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
            <h2 className="text-lg font-extrabold">2. Nak makan apa?</h2>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (what.trim()) window.open(mapsSearchUrl(what.trim(), near), "_blank", "noopener");
              }}
            >
              <label htmlFor="what" className="sr-only">
                Hidangan atau jenis kedai
              </label>
              <input
                id="what"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="Char kway teow"
                className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-4 font-medium focus:border-orange focus:outline-none"
              />
              <button type="submit" className="btn-primary !px-4" aria-label="Buka di Google Maps">
                <Search size={18} />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((q) => (
                <a key={q} href={mapsSearchUrl(q, near)} target="_blank" rel="noreferrer" className="chip !min-h-9">
                  <MapPin size={14} className="text-orange" /> {q}
                </a>
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted">
              <ExternalLink size={13} /> Pautan dibuka di Google Maps
              {loc ? " berdekatan lokasi kau" : area.trim() ? ` sekitar ${area.trim()}` : " ('near me')"}.
            </p>
          </div>
        </div>
      </section>
    </Page>
  );
}
