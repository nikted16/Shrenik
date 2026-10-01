"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/animations/transitions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSound } from "@/hooks/useSound";
import { DiyaFlame } from "./DiyaFlame";
import { GaneshaImage } from "./GaneshaImage";
import { ParticleField } from "./ParticleField";
import { PetalShower } from "./PetalShower";
import { Shloka } from "./Shloka";

export interface IntroOverlayProps {
  /** Called once the sequence (or its skip/reduced-motion fallback) finishes. */
  onDone: () => void;
}

type Phase = "black" | "diya" | "ganesha" | "shloka" | "hold" | "exit";

/**
 * Timeline (ms from mount), full motion path. Each phase's start time is
 * when that beat begins layering in — earlier beats stay visible/animating
 * underneath later ones until the final fade-out.
 */
const TIMELINE = {
  diya: 700,
  ganesha: 2000,
  shloka: 4700,
  hold: 6400,
  exit: 11500,
  done: 12500,
} as const;

/** Reduced-motion path: show the fully composed final frame briefly, then finish. */
const REDUCED_MOTION_HOLD_MS = 900;

/**
 * Fixed full-screen cinematic blessing sequence:
 * black frame -> gold particles drift in -> diya lights -> Ganesha/Om line
 * draws on -> shloka fades in -> a held beat -> the whole overlay fades out
 * and calls `onDone()`.
 *
 * Reduced motion: skips straight to the final composed frame (particles
 * static, diya lit, glyph fully drawn, shloka visible) for a brief hold,
 * then calls `onDone()` — no drift, no long draw-on, no repeat loops.
 */
export function IntroOverlay({ onDone }: IntroOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const { play } = useSound();
  const [phase, setPhase] = useState<Phase>("black");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach(clearTimeout);
    onDone();
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("shloka"); // composed final frame, no animation loops
      const t = setTimeout(finish, REDUCED_MOTION_HOLD_MS);
      timers.current.push(t);
      return () => clearTimeout(t);
    }

    const schedule = (ms: number, run: () => void) => {
      const t = setTimeout(run, ms);
      timers.current.push(t);
    };

    schedule(TIMELINE.diya, () => {
      setPhase("diya");
      play("bells");
    });
    schedule(TIMELINE.ganesha, () => setPhase("ganesha"));
    schedule(TIMELINE.shloka, () => {
      setPhase("shloka");
      play("shloka");
    });
    schedule(TIMELINE.hold, () => setPhase("hold"));
    schedule(TIMELINE.exit, () => setPhase("exit"));
    schedule(TIMELINE.done, finish);

    const pendingTimers = timers.current;
    return () => {
      pendingTimers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  const diyaLit = phase !== "black";
  const ganeshaDrawn =
    phase === "ganesha" || phase === "shloka" || phase === "hold" || phase === "exit";
  const shlokaVisible = phase === "shloka" || phase === "hold" || phase === "exit";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1, backgroundColor: "#F6E9C6" }}
      // On exit, drift the light-gold field toward the hero's ivory as it
      // fades, so the hand-off lands ivory-on-ivory rather than snapping from
      // solid gold to the mandap scene.
      animate={{
        opacity: phase === "exit" ? 0 : 1,
        backgroundColor: phase === "exit" ? "#FBF8F1" : "#F6E9C6",
      }}
      transition={{ duration: 1, ease: EASE }}
      onAnimationComplete={() => {
        if (phase === "exit") finish();
      }}
    >
      {/* Soft warm gold wash behind the diya/Ganesha, keeping the opening
          frame light and airy to match the site's ivory theme while still
          reading as a warm, intentional glow rather than a flat fill. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--gold) 18%, transparent) 0%, transparent 62%)",
        }}
        aria-hidden="true"
      />

      <ParticleField />

      {/* A slow shower of flower petals raining down once Ganesha appears —
          a pushpanjali (offering of flowers) welcoming the deity. */}
      <PetalShower active={ganeshaDrawn && phase !== "exit"} />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6">
        <GaneshaImage animate={ganeshaDrawn} className="h-52 w-52 sm:h-64 sm:w-64" />

        {/* Invocation directly beneath Ganesha, fading in with him under a
            very subtle golden glow. */}
        <motion.p
          className="font-serif text-2xl text-gold-deep sm:text-3xl"
          style={{
            textShadow:
              "0 0 12px color-mix(in srgb, var(--gold) 55%, transparent), 0 0 4px color-mix(in srgb, var(--gold) 40%, transparent)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: ganeshaDrawn ? 1 : 0, y: ganeshaDrawn ? 0 : 8 }}
          transition={{ duration: prefersReducedMotion ? 0.4 : 1, ease: EASE }}
        >
          श्री गणेशाय नमः
        </motion.p>

        <DiyaFlame lit={diyaLit} className="h-16 w-16 sm:h-20 sm:w-20" />
        <Shloka visible={shlokaVisible} />
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-8 right-8 z-20 font-sans text-xs uppercase tracking-widest text-maroon/50 transition-colors duration-300 hover:text-maroon/90 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/60"
      >
        Skip
      </button>
    </motion.div>
  );
}
