import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { useT } from "../i18n";

/** Router error boundary: catches render errors so one broken component never blanks the whole app. */
export default function ErrorPage() {
  const t = useT();
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : t.error.unknown;

  return (
    <main className="container-page py-24 text-center">
      <p className="text-6xl" aria-hidden="true">🥢</p>
      <h1 className="mt-4 text-3xl font-extrabold">{t.error.headline}</h1>
      <p className="mt-2 text-muted">{t.error.body}</p>
      <p className="mx-auto mt-4 max-w-md rounded-2xl bg-cream px-4 py-2 font-mono text-xs text-muted">{message}</p>
      <div className="mt-6 flex justify-center gap-2">
        <button type="button" onClick={() => window.location.reload()} className="btn-ghost">{t.error.reload}</button>
        <Link to="/" className="btn-primary">{t.common.home}</Link>
      </div>
    </main>
  );
}
