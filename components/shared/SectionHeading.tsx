"use client";

import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/utils/cn";

export interface SectionHeadingProps {
  /** Small uppercase kicker above the title. */
  kicker?: string;
  title: string;
  /** Optional supporting line beneath the title. */
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
}

/**
 * Reusable section header: an optional gold kicker, a large serif title, and
 * an optional subtitle — with a small gold divider. Revealed on scroll.
 */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {kicker ? (
        <span className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-gold-deep">
          {kicker}
        </span>
      ) : null}
      <h2 className="font-serif text-4xl leading-tight text-maroon sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <span
        className={cn(
          "h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent",
          align === "center" ? "mx-auto" : "",
        )}
        aria-hidden
      />
      {subtitle ? (
        <p className="max-w-xl font-sans text-base leading-relaxed text-ink/70">
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
