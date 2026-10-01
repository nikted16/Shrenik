"use client";

import { couple } from "@/content/couple";
import { cn } from "@/utils/cn";
import { Typewriter } from "./Typewriter";

export interface BlessingRevealProps {
  className?: string;
  /**
   * Whether the typewriter may begin. Defaults to true, but the hero passes
   * `false` while the intro overlay still covers the page — otherwise the line
   * types itself out unseen underneath the intro and is already complete
   * (static) by the time the overlay fades away.
   */
  start?: boolean;
}

/** The couplet as one string, one display line per entry. */
const FULL_TEXT = couple.blessing.join("\n");

/**
 * The opening blessing couplet, typed out beneath the names as if someone is
 * writing it live — a one-second pause, then characters appear one at a time,
 * pausing briefly at the line break.
 */
export function BlessingReveal({ className, start = true }: BlessingRevealProps) {
  return (
    <Typewriter
      text={FULL_TEXT}
      start={start}
      className={cn(
        "font-serif text-lg italic leading-relaxed text-maroon/75 sm:text-xl",
        className,
      )}
    />
  );
}
