"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { EASE } from "@/animations/transitions";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PARTICLE_COUNT = 30;

interface Particle {
  id: number;
  left: number; // vw, 0-100
  top: number; // vh, 0-100
  size: number; // px
  driftX: number; // px, +/-
  driftY: number; // px, +/-
  duration: number; // seconds
  delay: number; // seconds
}

/**
 * Deterministic pseudo-random in [0, 1), seeded by an integer. Using a fixed
 * arithmetic seed (rather than `Math.random()`) means every particle's
 * position/timing is a pure function of its index, so the server render and
 * the first client render produce byte-identical output — no hydration
 * mismatch, no "flash of relocated dots" on load.
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const r1 = seededRandom(i * 2 + 1);
    const r2 = seededRandom(i * 2 + 2);
    const r3 = seededRandom(i * 3 + 5);
    const r4 = seededRandom(i * 5 + 7);
    const r5 = seededRandom(i * 7 + 11);

    return {
      id: i,
      left: r1 * 100,
      top: r2 * 100,
      size: 2 + r3 * 3,
      driftX: (r4 - 0.5) * 40,
      driftY: (r5 - 0.5) * 60,
      duration: 6 + r3 * 6,
      delay: r1 * 4,
    };
  });
}

/**
 * ~30 tiny gold particles drifting slowly with gentle opacity "breathing".
 * Positions/timings are deterministic (see `seededRandom`) so this renders
 * identically on server and client.
 *
 * Under reduced motion, particles render as static, dim dots with no
 * animation loop at all.
 */
export function ParticleField() {
  const prefersReducedMotion = useReducedMotion();
  const particles = useMemo(buildParticles, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.25 }
              : {
                  opacity: [0, 0.6, 0.15, 0.5, 0],
                  x: [0, p.driftX, p.driftX * 0.4, 0],
                  y: [0, p.driftY, p.driftY * 0.6, 0],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.6 }
              : {
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: EASE,
                }
          }
        />
      ))}
    </div>
  );
}
