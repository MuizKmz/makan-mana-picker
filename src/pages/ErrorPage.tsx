import { isRouteErrorResponse, Link, useRouteError } from "react-router";

/** Router error boundary: catches render errors so one broken component never blanks the whole app. */
export default function ErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Ralat tidak diketahui";

  return (
    <main className="container-page py-24 text-center">
      <p className="text-6xl" aria-hidden="true">🥢</p>
      <h1 className="mt-4 text-3xl font-extrabold">Ada yang tak kena</h1>
      <p className="mt-2 text-muted">Halaman ni gagal dimuatkan. Cuba muat semula, atau balik ke laman utama.</p>
      <p className="mx-auto mt-4 max-w-md rounded-2xl bg-cream px-4 py-2 font-mono text-xs text-muted">{message}</p>
      <div className="mt-6 flex justify-center gap-2">
        <button type="button" onClick={() => window.location.reload()} className="btn-ghost">Muat semula</button>
        <Link to="/" className="btn-primary">Laman utama</Link>
      </div>
    </main>
  );
}
