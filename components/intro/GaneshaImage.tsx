"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { EASE } from "@/animations/transitions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

export interface GaneshaImageProps {
  /** Whether the reveal (fade + gentle scale-up) should play/be complete. */
  animate: boolean;
  className?: string;
}

/**
 * The opening blessing image of Lord Ganesha — a gold-and-ivory murti that
 * carries its own ornate frame, so it stands on its own without the earlier
 * hand-drawn glyph or spinning mandala rings. It sits on a soft radial gold
 * glow and reveals with a slow fade and a barely-there scale-up so the
 * entrance feels reverent rather than flashy.
 *
 * Reduced motion: appears at rest with a short opacity fade, no scale.
 */
export function GaneshaImage({ animate, className }: GaneshaImageProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("relative flex items-center justify-center", className)}
      initial={
        prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }
      }
      animate={{
        opacity: animate ? 1 : 0,
        scale: prefersReducedMotion ? 1 : animate ? 1 : 0.92,
      }}
      transition={{ duration: prefersReducedMotion ? 0.4 : 1.4, ease: EASE }}
      aria-hidden="true"
    >
      {/* Warm gold halo behind the murti, echoing the diya/particle glow so
          the deity reads as lit from within the same warm light source. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "128%",
          height: "128%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--gold) 40%, transparent) 0%, color-mix(in srgb, var(--gold) 14%, transparent) 45%, transparent 72%)",
        }}
      />
      <Image
        src="/assets/intro/ganesha.jpg"
        alt="Lord Ganesha"
        width={512}
        height={512}
        priority
        className="relative h-full w-full object-contain"
        style={{
          filter:
            "drop-shadow(0 8px 28px color-mix(in srgb, var(--gold-deep) 32%, transparent))",
        }}
      />
    </motion.div>
  );
}
