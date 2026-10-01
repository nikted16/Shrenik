import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Wraps Framer Motion's useReducedMotion so every consumer imports the
 * reduced-motion check from a single project-local module.
 */
export function useReducedMotion(): boolean {
  return !!useFramerReducedMotion();
}
