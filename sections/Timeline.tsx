"use client";

import { motion } from "framer-motion";
import { Flower2, Heart, Sparkles, Sun, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { fadeIn, fadeUp, staggerChildren } from "@/animations/variants";
import { timeline } from "@/content/timeline";
import type { Milestone } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";

/** Maps a milestone's icon key to its lucide glyph. */
const ICONS: Record<Milestone["icon"], LucideIcon> = {
  sun: Sun,
  flower: Flower2,
  heart: Heart,
  sparkles: Sparkles,
};

/**
 * A single milestone row. Each milestone has its own illustration (couple on
 * one side of a soft cream field); the text card floats over the cream side.
 * Rows alternate left/right of the center gold spine on md+; the image is
 * flipped horizontally on right-side rows so the couple always sits on the
 * outer edge and the text always faces the spine. On small screens every row
 * stacks to the right of a left-aligned spine. The gold icon node sits on the
 * line.
 */
function TimelineRow({
  milestone,
  index,
  itemVariant,
}: {
  milestone: Milestone;
  index: number;
  itemVariant: typeof fadeUp;
}) {
  const Icon = ICONS[milestone.icon];
  const isLeft = index % 2 === 0;

  return (
    <motion.li variants={itemVariant} className="relative">
      {/* Node on the spine: gold ring + icon, centered on the line. */}
      <span
        className="absolute left-4 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
        aria-hidden
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-warm-white shadow-[0_10px_30px_-16px_rgba(110,43,43,0.6)]">
          <Icon className="h-5 w-5 text-gold-deep" />
        </span>
      </span>

      {/* Image panel, sized clear of the spine on its side. */}
      <div
        className={cn(
          "pl-14 md:w-[54%] md:pl-0",
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8",
        )}
      >
        <div className="relative aspect-[3/2] overflow-hidden rounded-[1.75rem] border border-beige/70 bg-warm-white shadow-[0_24px_60px_-45px_rgba(43,33,27,0.5)] transition-shadow duration-500 hover:shadow-[0_28px_66px_-38px_rgba(110,43,43,0.4)]">
          {/* The event illustration at 0.8 opacity. Flipped on right-side rows
              so the couple faces outward and the cream text-space sits toward
              the spine. */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage: `url(${milestone.image})`,
              transform: isLeft ? undefined : "scaleX(-1)",
            }}
            aria-hidden
          />
          {/* Soft veil fading toward the cream (text) side so the text reads
              directly on the image without a card. */}
          <div
            className={cn(
              "absolute inset-0",
              isLeft
                ? "bg-gradient-to-r from-warm-white/0 via-warm-white/30 to-warm-white/70"
                : "bg-gradient-to-l from-warm-white/0 via-warm-white/30 to-warm-white/70",
            )}
            aria-hidden
          />

          {/* Text sitting directly on the cream side of the image. */}
          <div
            className={cn(
              "absolute inset-y-0 flex w-[58%] flex-col justify-center px-6 sm:px-8",
              isLeft ? "right-0 items-end text-right" : "left-0 items-start text-left",
            )}
          >
            <p className="font-sans text-xs font-medium uppercase tracking-[0.28em] text-gold-deep">
              {formatDate(milestone.date)}
              {milestone.timeOfDay ? ` · ${milestone.timeOfDay}` : ""}
            </p>
            <h3 className="mt-2 font-serif text-3xl text-maroon drop-shadow-[0_1px_2px_rgba(253,252,249,0.8)] sm:text-4xl">
              {milestone.name}
            </h3>
            <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-ink/80">
              {milestone.description}
            </p>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

/**
 * "Wedding Timeline" — a center-line vertical timeline of the celebration's
 * milestones (haldi → mehndi → wedding → reception). Each milestone carries
 * its own illustration with a floating text card, alternating left/right of a
 * gold spine on desktop and stacking on mobile, each with a gold icon node.
 * Rendered in the site's own ivory/gold/maroon theme.
 */
export function Timeline() {
  const prefersReducedMotion = useReducedMotion();
  const itemVariant = prefersReducedMotion ? fadeIn : fadeUp;

  return (
    <section
      id="timeline"
      aria-labelledby="timeline-heading"
      className="bg-ivory px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          kicker="The Celebration"
          title="Wedding Timeline"
          subtitle="Days of ritual, colour, and joy — the moment we say forever, and the celebration after."
        />
        <h2 id="timeline-heading" className="sr-only">
          Wedding Timeline
        </h2>

        <motion.ol
          className="relative mt-20 flex flex-col gap-16"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {/* The spine: a soft vertical gold line the nodes sit on. Left-aligned
              on mobile, centered on md+. */}
          <span
            className="absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-gold/0 via-gold/70 to-gold/0 md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          {timeline.map((milestone, index) => (
            <TimelineRow
              key={milestone.id}
              milestone={milestone}
              index={index}
              itemVariant={itemVariant}
            />
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
