import { Link } from "react-router";
import { Page } from "../layouts/Page";
import { useT } from "../i18n";

export default function NotFoundPage() {
  const t = useT();
  return (
    <Page title={t.notFound.title}>
      <section className="container-page py-24 text-center">
        <p className="text-6xl" aria-hidden="true">🍽️</p>
        <h1 className="mt-4 text-4xl font-extrabold">{t.notFound.headline}</h1>
        <p className="mt-2 text-muted">{t.notFound.body}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/" className="btn-ghost">{t.common.home}</Link>
          <Link to="/putar" className="btn-primary">{t.common.spinWheel}</Link>
        </div>
      </section>
    </Page>
  );
}
