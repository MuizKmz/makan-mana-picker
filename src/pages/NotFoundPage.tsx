import { Link } from "react-router";
import { Page } from "../layouts/Page";

export default function NotFoundPage() {
  return (
    <Page title="Tak jumpa · Makan Mana?">
      <section className="container-page py-24 text-center">
        <p className="text-6xl" aria-hidden="true">🍽️</p>
        <h1 className="mt-4 text-4xl font-extrabold">Pinggan ni kosong</h1>
        <p className="mt-2 text-muted">Halaman yang kau cari tak wujud atau dah dialihkan.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/" className="btn-ghost">Laman utama</Link>
          <Link to="/putar" className="btn-primary">Putar roda</Link>
        </div>
      </section>
    </Page>
  );
}
