import { Link } from "react-router";
import { GitPullRequest, MessageSquare } from "lucide-react";
import { Page } from "../layouts/Page";
import { foodService } from "../services/foodService";

const REPO = "https://github.com/MuizKmz/makan-mana-picker";

export default function AboutPage() {
  const count = foodService.all().length;
  return (
    <Page title="Tentang · Makan Mana?">
      <section className="container-page max-w-3xl pt-8 md:pt-12">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Tentang Makan Mana</h1>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/85">
          <p>
            Setiap hari soalan sama: <em>nak makan apa?</em> Makan Mana ialah projek sumber terbuka yang jawab soalan tu dengan
            roda putar, carian ayat biasa dan set data {count} hidangan Malaysia.
          </p>
          <p>
            Carian kami berjalan sepenuhnya dalam pelayar kau. Ia baca bajet, masa, pedas, halal dan jenis masakan daripada ayat
            kau, kemudian tapis set data. Ia tak reka nama kedai, harga atau status halal. Untuk kedai sebenar, kami hantar kau ke
            Google Maps.
          </p>
          <p>
            Harga ialah anggaran kedai biasa. Medan halal bermaksud versi halal mudah dicari di Malaysia, bukan pengesahan mana-mana
            kedai. Foto hidangan datang dari Wikipedia dan Wikimedia Commons.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <a href={REPO} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-card border border-line bg-white p-5 hover:border-[#e2d3c0]">
            <GitPullRequest size={24} className="mt-0.5 shrink-0" />
            <span>
              <span className="block font-extrabold">Tambah hidangan</span>
              <span className="block text-sm text-muted">Hidangan negeri kau tak ada? Tambah satu baris dalam dishes.json dan hantar pull request.</span>
            </span>
          </a>
          <a href={`${REPO}/issues/new`} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-card border border-line bg-white p-5 hover:border-[#e2d3c0]">
            <MessageSquare size={24} className="mt-0.5 shrink-0" />
            <span>
              <span className="block font-extrabold">Hantar maklum balas</span>
              <span className="block text-sm text-muted">Jumpa salah, ada idea, atau nak ciri baru? Buka isu di GitHub.</span>
            </span>
          </a>
        </div>

        <Link to="/putar" className="btn-primary mt-10">
          Cuba putar roda
        </Link>
      </section>
    </Page>
  );
}
