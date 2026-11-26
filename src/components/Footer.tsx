import { Link } from "react-router";
import { GitPullRequest } from "lucide-react";
import { Logo } from "./Logo";
import { useT } from "../i18n";

const REPO = "https://github.com/MuizKmz/makan-mana-picker";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-24 border-t border-line bg-cream pb-28 pt-12 md:pb-12">
      <div className="container-page grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">{t.footer.blurb}</p>
        </div>
        <div>
          <h2 className="text-sm font-bold">{t.footer.explore}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" to="/putar">{t.footer.spin}</Link></li>
            <li><Link className="hover:text-ink" to="/cari">{t.footer.search}</Link></li>
            <li><Link className="hover:text-ink" to="/dekat">{t.footer.nearby}</Link></li>
            <li><Link className="hover:text-ink" to="/simpan">{t.footer.favourites}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold">{t.footer.project}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" to="/tentang">{t.footer.about}</Link></li>
            <li><a className="hover:text-ink" href={`${REPO}/issues/new`} target="_blank" rel="noreferrer">{t.footer.feedback}</a></li>
            <li>
              <a className="inline-flex items-center gap-1.5 hover:text-ink" href={REPO} target="_blank" rel="noreferrer">
                <GitPullRequest size={15} /> {t.footer.source}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="container-page mt-10 text-xs text-muted">{t.footer.note}</p>
    </footer>
  );
}
