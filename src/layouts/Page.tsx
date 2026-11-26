import { useEffect } from "react";
import { motion } from "motion/react";
import { page } from "../animations/variants";

/** Wraps every page: sets the document title and plays the shared page transition. */
export function Page({ title, children }: { title: string; children: React.ReactNode }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <motion.main id="main" variants={page} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.main>
  );
}
