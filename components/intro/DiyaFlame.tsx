"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/animations/transitions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

export interface DiyaFlameProps {
  /** Whether the diya has been "lit" yet — controls the entrance + flicker. */
  lit: boolean;
  className?: string;
}

/**
 * A more realistic clay oil-lamp (diya): a terracotta vessel with a warm
 * lip-gradient, sitting under a teardrop flame that gradients from a
 * cool blue base through gold to a white-hot tip, breathing/flickering
 * gently once lit (scale + slight rotate on a slow loop — not a strobe),
 * with a soft gold radial glow behind it consistent with the intro's
 * particles/Ganesha glow.
 *
 * Both the flame and the vessel are drawn as SVG paths sharing one
 * viewBox/coordinate space — a true teardrop (pointed tip, bulged waist,
 * pinched-in base) reads as a lifelike flame far better than a CSS
 * border-radius blob, while staying crisp at any size.
 *
 * Reduced motion: no flicker loop — the flame renders at its lit resting
 * state immediately, and the light-up entrance (opacity/scale, no bounce)
 * still plays but capped under ~0.5s.
 */
export function DiyaFlame({ lit, className }: DiyaFlameProps) {
  const prefersReducedMotion = useReducedMotion();
  // Flips true once the light-up entrance finishes, switching the flame
  // from its one-shot "lighting" transition to the infinite gentle flicker
  // loop, so the two animations never fight on the same element.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!lit) setSettled(false);
  }, [lit]);

  const flickering = lit && settled && !prefersReducedMotion;

  return (
    <div
      className={cn("relative flex items-end justify-center", className)}
      aria-hidden="true"
    >
      {/* Ambient gold glow behind the whole lamp, echoing the particle/
          Ganesha glow so the diya reads as part of the same warm light
          source rather than a separate graphic. */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "170%",
          height: "170%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--gold) 55%, transparent) 0%, color-mix(in srgb, var(--gold-deep) 25%, transparent) 45%, transparent 72%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: lit ? (flickering ? [0.75, 1, 0.8, 1] : 1) : 0 }}
        transition={
          flickering
            ? { duration: 3.2, ease: EASE, repeat: Infinity, repeatType: "mirror" }
            : { duration: 1.1, ease: EASE }
        }
      />

      {/* Flame — a true teardrop silhouette (pointed tip, full belly,
          rounded base) drawn as SVG paths sharing one coordinate space, so
          the shape itself reads as flame-like even before any animation:
          a bottom-to-top gradient sweeps from a cool blue-tinted base
          through gold to a warm white-hot tip, with a small separate
          inner blue tongue layered at the base for the characteristic
          two-tone look of a real oil flame. */}
      <motion.svg
        viewBox="0 0 60 90"
        className="relative z-10"
        style={{
          width: "40%",
          height: "70%",
          transformOrigin: "50% 100%",
          filter:
            "drop-shadow(0 0 10px color-mix(in srgb, var(--gold) 65%, transparent)) drop-shadow(0 0 20px color-mix(in srgb, var(--maroon) 40%, transparent))",
        }}
        initial={{ opacity: 0, scaleY: 0.5, scaleX: 0.7, y: 6 }}
        animate={
          !lit
            ? { opacity: 0, scaleY: 0.5, scaleX: 0.7, y: 6, rotate: 0 }
            : flickering
              ? {
                  opacity: 1,
                  scaleY: [1, 1.12, 0.94, 1.08, 1],
                  scaleX: [1, 0.95, 1.04, 0.97, 1],
                  rotate: [0, -1.5, 1, -0.8, 0],
                  y: 0,
                }
              : { opacity: 1, scaleY: 1, scaleX: 1, y: 0, rotate: 0 }
        }
        transition={
          !lit
            ? { duration: 0.4, ease: EASE }
            : flickering
              ? {
                  duration: 3.6,
                  ease: EASE,
                  repeat: Infinity,
                  repeatType: "mirror",
                }
              : {
                  duration: prefersReducedMotion ? 0.5 : 1,
                  ease: EASE,
                }
        }
        onAnimationComplete={() => {
          if (lit && !prefersReducedMotion && !settled) setSettled(true);
        }}
      >
        <defs>
          <linearGradient id="flameOuter" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7C93B4" />
            <stop offset="30%" stopColor="var(--gold-deep)" />
            <stop offset="68%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="#FFF6E0" />
          </linearGradient>
          <linearGradient id="flameInner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#5C7DA3" />
            <stop offset="100%" stopColor="#9FBBD6" />
          </linearGradient>
        </defs>

        {/* Outer flame: pointed tip, generous belly, rounded base. */}
        <path
          d="M30 2
             C 16 24 8 42 9 58
             C 10 76 18 88 30 88
             C 42 88 50 76 51 58
             C 52 42 44 24 30 2 Z"
          fill="url(#flameOuter)"
        />

        {/* Inner blue-tinted tongue, offset low and slightly narrower —
            the coolest, most saturated part of a real oil flame. */}
        <path
          d="M30 40
             C 24 50 21 60 22 68
             C 23 78 26 84 30 84
             C 34 84 37 78 38 68
             C 39 60 36 50 30 40 Z"
          fill="url(#flameInner)"
          opacity="0.55"
        />
      </motion.svg>

      {/* Lamp vessel — a simple clay diya silhouette: a shallow terracotta
          bowl with a pinched lip on either side and a warm gradient rim,
          sized to sit just beneath the flame. */}
      <svg
        viewBox="0 0 120 46"
        className="absolute bottom-0 left-1/2 z-20 w-full -translate-x-1/2"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="diyaBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BA5B39" />
            <stop offset="55%" stopColor="#9D452F" />
            <stop offset="100%" stopColor="#6E301D" />
          </linearGradient>
          <linearGradient id="diyaLip" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5D351F" />
            <stop offset="45%" stopColor="#BA3E22" />
            <stop offset="75%" stopColor="#F56F2D" />
            <stop offset="100%" stopColor="#5D351F" />
          </linearGradient>
        </defs>
        <path
          d="M6 20c10-11 30-17 54-17s44 6 54 17c-3 5-10 9-16 9-4 8-16 13-38 13S26 34 22 29c-6 0-13-4-16-9Z"
          fill="url(#diyaBody)"
        />
        <path
          d="M6 20c10-11 30-17 54-17s44 6 54 17c-8 5-30 8-54 8S14 25 6 20Z"
          fill="url(#diyaLip)"
        />
      </svg>
    </div>
  );
}
