import { Link } from "react-router";
import { GitPullRequest } from "lucide-react";
import { Logo } from "./Logo";

const REPO = "https://github.com/MuizKmz/makan-mana-picker";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-cream pb-28 pt-12 md:pb-12">
      <div className="container-page grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">
            Pemilih makanan Malaysia sumber terbuka. Kami tak jual data kau, tak ada iklan, dan tak reka nama kedai.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold">Teroka</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" to="/putar">Putar roda</Link></li>
            <li><Link className="hover:text-ink" to="/cari">Cari makanan</Link></li>
            <li><Link className="hover:text-ink" to="/dekat">Kedai berdekatan</Link></li>
            <li><Link className="hover:text-ink" to="/simpan">Kegemaran</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold">Projek</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" to="/tentang">Tentang Makan Mana</Link></li>
            <li><a className="hover:text-ink" href={`${REPO}/issues/new`} target="_blank" rel="noreferrer">Hantar maklum balas</a></li>
            <li>
              <a className="inline-flex items-center gap-1.5 hover:text-ink" href={REPO} target="_blank" rel="noreferrer">
                <GitPullRequest size={15} /> Kod sumber di GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="container-page mt-10 text-xs text-muted">
        Foto hidangan dari Wikipedia dan Wikimedia Commons. Status halal bergantung pada kedai; sentiasa semak sijil kedai.
      </p>
    </footer>
  );
}
