"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { fadeIn, fadeUp } from "@/animations/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

export interface RevealProps {
  children: ReactNode;
  /** Element/component to render the wrapper as. Defaults to "div". */
  as?: ElementType;
  /** Additional delay (seconds) before the reveal transition starts. */
  delay?: number;
  className?: string;
}

/**
 * Reveals children on scroll into view using the fadeUp preset. Under
 * prefers-reduced-motion, falls back to an opacity-only fadeIn with no
 * translation, so motion-sensitive users never see content "fly in".
 */
export function Reveal({ children, as = "div", delay = 0, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motion[as as "div"] ?? motion.div;
  const variants = prefersReducedMotion ? fadeIn : fadeUp;

  return (
    <MotionComponent
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionComponent>
  );
}
