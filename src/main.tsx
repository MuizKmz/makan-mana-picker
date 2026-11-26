import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/index.css";
import { RootLayout } from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import { useT } from "./i18n";
import NotFoundPage from "./pages/NotFoundPage";

// Secondary pages load on demand to keep the first load light.
const PickerPage = lazy(() => import("./pages/PickerPage"));
const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));
const FoodDetailPage = lazy(() => import("./pages/FoodDetailPage"));
const FavouritesPage = lazy(() => import("./pages/FavouritesPage"));
const NearbyPage = lazy(() => import("./pages/NearbyPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

function Loading() {
  const t = useT();
  return (
    <div className="container-page py-24" aria-busy="true" aria-label={t.common.loading}>
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded-2xl bg-cream" />
      <div className="mt-4 h-5 w-1/2 max-w-sm animate-pulse rounded-xl bg-cream" />
    </div>
  );
}

const withSuspense = (el: React.ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "putar", element: withSuspense(<PickerPage />) },
      { path: "cari", element: withSuspense(<DiscoverPage />) },
      { path: "makanan/:id", element: withSuspense(<FoodDetailPage />) },
      { path: "simpan", element: withSuspense(<FavouritesPage />) },
      { path: "dekat", element: withSuspense(<NearbyPage />) },
      { path: "tentang", element: withSuspense(<AboutPage />) },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
