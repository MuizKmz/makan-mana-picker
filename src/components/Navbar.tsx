import { NavLink, Link } from "react-router";
import { Compass, Heart, Home, MapPin, RotateCw, Search } from "lucide-react";
import { Logo } from "./Logo";
import { LangToggle } from "./LangToggle";
import { useFoodStore } from "../store/useFoodStore";
import { useT } from "../i18n";

export function Navbar() {
  const t = useT();
  const favCount = useFoodStore((s) => s.favourites.length);

  const links = [
    { to: "/", label: t.nav.home, end: true },
    { to: "/cari", label: t.nav.discover, end: false },
    { to: "/dekat", label: t.nav.nearby, end: false },
    { to: "/tentang", label: t.nav.about, end: false },
  ];

  return (
    <header className="sticky top-0 z-40 pt-3">
      <div className="container-page">
        <nav
          aria-label={t.nav.mainNav}
          className="flex h-14 items-center justify-between gap-2 rounded-full border border-line bg-white/85 pl-4 pr-2 backdrop-blur-md"
        >
          <Logo />

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
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
            <LangToggle />
            <Link to="/cari" className="hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-cream lg:flex" aria-label={t.nav.search}>
              <Search size={19} />
            </Link>
            <Link to="/simpan" className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-cream md:flex" aria-label={t.nav.favourites(favCount)}>
              <Heart size={19} />
              {favCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-tomato-ink px-1 text-[10px] font-bold text-white">
                  {favCount}
                </span>
              )}
            </Link>
            <Link to="/putar" className="btn-primary hidden !min-h-10 !px-4 text-sm sm:inline-flex">
              {t.nav.cta}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

/** Bottom tab bar on phones so the picker and search stay one thumb away. */
export function MobileTabBar() {
  const t = useT();
  const tabs = [
    { to: "/", label: t.nav.home, icon: Home, end: true },
    { to: "/cari", label: t.nav.discover, icon: Compass, end: false },
    { to: "/putar", label: t.nav.spin, icon: RotateCw, end: false },
    { to: "/dekat", label: t.nav.near, icon: MapPin, end: false },
    { to: "/simpan", label: t.nav.saved, icon: Heart, end: false },
  ];

  return (
    <nav aria-label={t.nav.bottomNav} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSpin = tab.to === "/putar";
          return (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                    isActive ? "text-orange-ink" : "text-muted"
                  }`
                }
              >
                {isSpin ? (
                  <span className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-orange text-ink shadow-lift">
                    <Icon size={22} />
                  </span>
                ) : (
                  <Icon size={21} />
                )}
                {tab.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
