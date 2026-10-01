"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface SparkleShowerProps {
  /** Whether the sparkles should be falling. */
  active: boolean;
}

const SPARKLE_COUNT = 75;

interface Sparkle {
  id: number;
  left: number; // %, 0-100
  size: number; // px
  drift: number; // px horizontal sway, +/-
  rotate: number; // deg total spin
  duration: number; // seconds to fall
  delay: number; // seconds before this sparkle starts
  twinkle: number; // seconds per twinkle cycle
  color: string;
}

/**
 * Deterministic pseudo-random in [0, 1), seeded by an integer — same approach
 * as PetalShower, so server and first client render match (no hydration
 * mismatch).
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Warm golds, matching the hand-drawn sparkles in the artwork. */
const SPARKLE_COLORS = ["#E6B84E", "#D9A441", "#F2D58A", "#C8912F"];

function buildSparkles(): Sparkle[] {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const r1 = seededRandom(i * 2 + 11);
    const r2 = seededRandom(i * 3 + 13);
    const r3 = seededRandom(i * 5 + 17);
    const r4 = seededRandom(i * 7 + 19);
    const r5 = seededRandom(i * 11 + 23);

    return {
      id: i,
      left: r1 * 100,
      size: 6 + r2 * 16,
      drift: (r3 - 0.5) * 80,
      rotate: (r4 - 0.5) * 180,
      duration: 6 + r2 * 4,
      // Spread across a full fall so the screen fills quickly and stays
      // evenly covered rather than arriving in one wave.
      delay: r5 * 6,
      twinkle: 1.2 + r3 * 1.4,
      color: SPARKLE_COLORS[Math.floor(r4 * SPARKLE_COLORS.length) % SPARKLE_COLORS.length],
    };
  });
}

/**
 * A slow shower of gold four-point sparkles drifting down over a section —
 * the sparkle counterpart to the intro's PetalShower. Each sparkle falls from
 * just above its container to just below it, swaying, turning slightly and
 * twinkling (pulsing scale/brightness) on its own rhythm.
 *
 * Positioned `absolute inset-0`, so the parent must be `relative`.
 *
 * Reduced motion: renders nothing.
 */
export function SparkleShower({ active }: SparkleShowerProps) {
  const prefersReducedMotion = useReducedMotion();
  const sparkles = useMemo(buildSparkles, []);

  if (prefersReducedMotion || !active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute top-0"
          style={{ left: `${s.left}%` }}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "110vh",
            x: [0, s.drift, s.drift * 0.4, s.drift],
            rotate: s.rotate,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Twinkle on its own faster loop, layered inside the fall. */}
          <motion.svg
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            animate={{ scale: [0.7, 1.15, 0.7], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: s.twinkle, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 4px ${s.color})` }}
          >
            {/* Four-point star with concave sides. */}
            <path
              d="M12 0 C 13 8 16 11 24 12 C 16 13 13 16 12 24 C 11 16 8 13 0 12 C 8 11 11 8 12 0 Z"
              fill={s.color}
            />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
}
