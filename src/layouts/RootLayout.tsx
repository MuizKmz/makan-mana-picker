import { useLocation, useOutlet, ScrollRestoration } from "react-router";
import { AnimatePresence, MotionConfig } from "motion/react";
import { cloneElement } from "react";
import { Navbar, MobileTabBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Toaster } from "../components/Toaster";

export function RootLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Langkau ke kandungan
      </a>
      <Navbar />
      <AnimatePresence mode="wait">
        {outlet && cloneElement(outlet, { key: location.pathname })}
      </AnimatePresence>
      <Footer />
      <MobileTabBar />
      <Toaster />
      <ScrollRestoration getKey={(loc) => loc.pathname + loc.search} />
    </MotionConfig>
  );
}
