"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

export interface TypewriterProps {
  /** Text to type. A "\n" starts a new line and gets a longer pause. */
  text: string;
  className?: string;
  /**
   * Whether typing may begin. Callers hold this `false` until the text is
   * actually on screen, so it doesn't finish typing unseen.
   */
  start?: boolean;
  /** Pause before the first character, in ms. */
  startDelay?: number;
  /** Delay per character, in ms. */
  charMs?: number;
  /** Extra pause at each line break, in ms. */
  linePauseMs?: number;
}

/**
 * Types `text` out one character at a time with a soft blinking caret
 * trailing it, as if someone is writing it live. The full text is exposed to
 * assistive tech via `aria-label` so screen readers get it at once rather than
 * key-by-key.
 *
 * Reduced motion: the whole text is shown immediately, no typing, no caret.
 */
export function Typewriter({
  text,
  className,
  start = true,
  startDelay = 1000,
  charMs = 55,
  linePauseMs = 500,
}: TypewriterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [shown, setShown] = useState(prefersReducedMotion ? text.length : 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShown(text.length);
      return;
    }

    // Hold at zero until the caller says the text is visible.
    if (!start) {
      setShown(0);
      return;
    }

    setShown(0);
    const pending = timers.current;

    // Schedule one reveal per character; a newline gets an extra pause so
    // each line feels like a separate written stroke.
    let elapsed = startDelay;
    for (let i = 0; i < text.length; i++) {
      elapsed += text[i] === "\n" ? linePauseMs : charMs;
      const count = i + 1;
      pending.push(setTimeout(() => setShown(count), elapsed));
    }

    return () => {
      pending.forEach(clearTimeout);
      pending.length = 0;
    };
  }, [prefersReducedMotion, start, text, startDelay, charMs, linePauseMs]);

  const typing = !prefersReducedMotion && shown < text.length;

  return (
    <p
      className={cn("whitespace-pre-line", className)}
      aria-label={text.replace(/\n/g, " ")}
    >
      <span aria-hidden>{text.slice(0, shown)}</span>
      {/* Blinking caret that trails the text while typing. */}
      {typing && (
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.12em] animate-pulse bg-current align-middle opacity-60"
        />
      )}
    </p>
  );
}
