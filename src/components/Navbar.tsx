import { NavLink, Link } from "react-router";
import { Compass, Heart, Home, MapPin, RotateCw, Search } from "lucide-react";
import { Logo } from "./Logo";
import { useFoodStore } from "../store/useFoodStore";

const links = [
  { to: "/", label: "Utama", icon: Home, end: true },
  { to: "/cari", label: "Cari", icon: Compass },
  { to: "/dekat", label: "Berdekatan", icon: MapPin },
  { to: "/tentang", label: "Tentang", icon: null },
] as const;

export function Navbar() {
  const favCount = useFoodStore((s) => s.favourites.length);

  return (
    <header className="sticky top-0 z-40 pt-3">
      <div className="container-page">
        <nav
          aria-label="Navigasi utama"
          className="flex h-14 items-center justify-between rounded-full border border-line bg-white/85 pl-4 pr-2 backdrop-blur-md"
        >
          <Logo />

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={"end" in l ? l.end : false}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive ? "bg-cream text-ink" : "text-muted hover:text-ink"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <Link to="/cari" className="hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-cream sm:flex" aria-label="Cari makanan">
              <Search size={19} />
            </Link>
            <Link to="/simpan" className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-cream sm:flex" aria-label={`Kegemaran (${favCount})`}>
              <Heart size={19} />
              {favCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-tomato px-1 text-[10px] font-bold text-white">
                  {favCount}
                </span>
              )}
            </Link>
            <Link to="/putar" className="btn-primary !min-h-10 !px-4 text-sm">
              Jom cari makan
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

const tabs = [
  { to: "/", label: "Utama", icon: Home, end: true },
  { to: "/cari", label: "Cari", icon: Compass },
  { to: "/putar", label: "Putar", icon: RotateCw },
  { to: "/dekat", label: "Dekat", icon: MapPin },
  { to: "/simpan", label: "Simpan", icon: Heart },
] as const;

/** Bottom tab bar on phones so the picker and search stay one thumb away. */
export function MobileTabBar() {
  return (
    <nav aria-label="Navigasi bawah" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isSpin = t.to === "/putar";
          return (
            <li key={t.to}>
              <NavLink
                to={t.to}
                end={"end" in t ? t.end : false}
                className={({ isActive }) =>
                  `flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                    isActive ? "text-orange" : "text-muted"
                  }`
                }
              >
                {isSpin ? (
                  <span className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-orange text-white shadow-lift">
                    <Icon size={22} />
                  </span>
                ) : (
                  <Icon size={21} />
                )}
                {t.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
