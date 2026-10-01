"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fadeIn, fadeUp } from "@/animations/variants";
import { introContent } from "@/content/intro";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

export interface ShlokaProps {
  visible: boolean;
  className?: string;
}

/** Blessing-line typewriter: short beat after the shloka fades in, then
 * ~60ms per character. */
const BLESSING_START_DELAY = 600;
const BLESSING_CHAR_MS = 38;
const BLESSING_TEXT = introContent.blessingLine;

/**
 * The Ganesha Vandana verse — Devanagari + transliteration — fading in after
 * Ganesha appears, followed by a personal blessing line that types itself out
 * beneath (as if written live) with a trailing blinking caret. Reduced motion
 * uses a plain opacity fade and shows the blessing line at once, no typing.
 */
export function Shloka({ visible, className }: ShlokaProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? fadeIn : fadeUp;

  const [shown, setShown] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;

    if (!visible) {
      setShown(0);
      return;
    }

    if (prefersReducedMotion) {
      setShown(BLESSING_TEXT.length);
      return;
    }

    setShown(0);
    let elapsed = BLESSING_START_DELAY;
    for (let i = 0; i < BLESSING_TEXT.length; i++) {
      elapsed += BLESSING_CHAR_MS;
      const count = i + 1;
      pending.push(setTimeout(() => setShown(count), elapsed));
    }

    return () => {
      pending.forEach(clearTimeout);
      pending.length = 0;
    };
  }, [visible, prefersReducedMotion]);

  const typedBlessing = BLESSING_TEXT.slice(0, shown);
  const typing = visible && !prefersReducedMotion && shown < BLESSING_TEXT.length;

  return (
    <motion.div
      className={cn("text-center", className)}
      variants={variants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <p className="whitespace-pre-line font-serif text-xl leading-relaxed text-gold-deep sm:text-2xl">
        {introContent.shlokaDevanagari}
      </p>
      <p className="mt-2 font-serif text-sm italic text-maroon/80 sm:text-base">
        {introContent.shlokaTransliteration}
      </p>

      {/* Personal blessing, typed out beneath the shloka. */}
      <p
        className="mx-auto mt-5 max-w-md px-4 text-center font-serif text-base leading-relaxed text-maroon/85 sm:text-lg"
        aria-label={BLESSING_TEXT}
      >
        <span aria-hidden>{typedBlessing}</span>
        {typing && (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.12em] animate-pulse bg-maroon/60 align-middle"
          />
        )}
      </p>
    </motion.div>
  );
}
