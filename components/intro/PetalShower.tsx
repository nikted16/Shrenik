"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface PetalShowerProps {
  /** Whether the petals should be falling. */
  active: boolean;
}

const PETAL_COUNT = 22;

interface Petal {
  id: number;
  left: number; // vw, 0-100
  size: number; // px (width; height is ~1.4x)
  drift: number; // px horizontal sway, +/-
  rotate: number; // deg total spin
  duration: number; // seconds to fall
  delay: number; // seconds before this petal starts
  hue: number; // 0-1 -> picks a warm petal color
}

/**
 * Deterministic pseudo-random in [0, 1), seeded by an integer — same approach
 * as ParticleField, so the server and first client render produce identical
 * petal layouts (no hydration mismatch, no flash of relocated petals).
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildPetals(): Petal[] {
  return Array.from({ length: PETAL_COUNT }, (_, i) => {
    const r1 = seededRandom(i * 2 + 1);
    const r2 = seededRandom(i * 3 + 2);
    const r3 = seededRandom(i * 5 + 3);
    const r4 = seededRandom(i * 7 + 5);
    const r5 = seededRandom(i * 11 + 7);

    return {
      id: i,
      left: r1 * 100,
      size: 10 + r2 * 10,
      drift: (r3 - 0.5) * 120,
      rotate: (r4 - 0.5) * 540,
      duration: 4 + r2 * 3,
      delay: r5 * 2.5,
      hue: r4,
    };
  });
}

/** Warm marigold / rose petal palette to match the gold-and-maroon theme. */
const PETAL_COLORS = ["#E8A33D", "#D98324", "#E7B24C", "#C56B7A", "#D98C9A"];

function petalColor(hue: number): string {
  return PETAL_COLORS[Math.floor(hue * PETAL_COLORS.length) % PETAL_COLORS.length];
}

/**
 * A slow shower of flower petals drifting down from the top of the frame —
 * played when Ganesha appears in the intro, evoking a pushpanjali (offering of
 * flowers). Each petal falls from just above the viewport to just below it
 * while swaying sideways and spinning gently; positions/timing are
 * deterministic so the render is hydration-stable.
 *
 * Reduced motion: renders nothing — a continuous falling loop would be the
 * kind of large, sustained motion reduced-motion users opt out of.
 */
export function PetalShower({ active }: PetalShowerProps) {
  const prefersReducedMotion = useReducedMotion();
  const petals = useMemo(buildPetals, []);

  if (prefersReducedMotion || !active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{ left: `${p.left}%` }}
          initial={{ y: "-12vh", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "112vh",
            x: [0, p.drift, p.drift * 0.3, p.drift],
            rotate: p.rotate,
            opacity: [0, 0.9, 0.9, 0.75],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* A single petal: a soft teardrop/leaf shape with a subtle center
              vein, tinted from the warm marigold/rose palette. */}
          <svg
            width={p.size}
            height={p.size * 1.4}
            viewBox="0 0 20 28"
            fill="none"
            style={{
              filter:
                "drop-shadow(0 1px 2px color-mix(in srgb, var(--maroon) 22%, transparent))",
            }}
          >
            <path
              d="M10 0 C 3 8 0 16 4 23 C 6 27 14 27 16 23 C 20 16 17 8 10 0 Z"
              fill={petalColor(p.hue)}
              opacity="0.92"
            />
            <path
              d="M10 4 C 9 12 9 18 10 24"
              stroke="color-mix(in srgb, #6E2B2B 35%, transparent)"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
