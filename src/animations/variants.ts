import type { Transition, Variants } from "motion/react";

export const spring: Transition = { type: "spring", stiffness: 380, damping: 28 };

export const page: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

export const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const rise: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
