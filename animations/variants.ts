import type { Variants } from "framer-motion";
import { transition } from "./transitions";

/** Fade in while rising slightly from below. Default for section/content reveals. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
};

/** Opacity-only fade. Used as the reduced-motion fallback for fadeUp. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
};

/** Gentle scale-up with fade. No spring/overshoot — eased in via the signature curve. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition },
};

/** Fade in while a blur resolves to sharp focus. */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition },
};

/** Container variant: staggers the reveal of motion children. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/** Animates an SVG stroke's pathLength from 0 to 1, for line-drawing reveals. */
export const drawPath: Variants = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1, transition },
};
