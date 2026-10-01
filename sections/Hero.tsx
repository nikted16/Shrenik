"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BlessingReveal } from "@/components/shared/BlessingReveal";
import { CoupleNames } from "@/components/shared/CoupleNames";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { Button } from "@/components/ui/button";
import { EASE } from "@/animations/transitions";
import { couple } from "@/content/couple";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDate } from "@/utils/formatDate";

/**
 * Full-viewport cinematic hero: a parallax celestial-mandap backdrop behind an ivory scrim,
 * the names revealed with a soft blur-in, a minimal date/venue subtitle, and a
 * single "Begin Our Journey" CTA that scrolls to the countdown. Deliberately
 * withholds all other information — this is an invitation to explore.
 */
export interface HeroProps {
  /** True once the intro overlay is gone and the hero is actually on screen —
   * gates the blessing typewriter so it doesn't type itself out unseen. */
  introFinished?: boolean;
}

export function Hero({ introFinished = true }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const scrollToNext = () => {
    document.getElementById("begin")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.18, delayChildren: 0.15 },
    },
  };
  const item = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } }
    : {
        hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 1.1, ease: EASE },
        },
      };

  return (
    <section
      id="hero"
      aria-label="Welcome"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Background image with subtle parallax: a cream paper scene with the
          couple's childhood photos pinned left and right and an open centre
          for the names. Shown at full strength so the photos stay crisp.
          Portrait screens (phones) get a tall version with the photos moved
          to the top and bottom, since cropping the wide one loses them;
          landscape tablets get a 4:3 cut for the same reason. */}
      <ParallaxImage
        src="/assets/images/hero-bg.jpg"
        portraitSrc="/assets/images/hero-bg-mobile-v2.jpg"
        tabletSrc="/assets/images/hero-bg-tablet.jpg"
        alt=""
        priority
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      {/* Soft ivory veil only behind the centred text, leaving the photos at
          the edges untouched. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_center,rgba(251,248,241,0.55),transparent_75%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(110,43,43,0.10))]"
        aria-hidden
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        variants={container}
        initial="hidden"
        // Hold hidden until the intro overlay has lifted, then rise + blur in —
        // so the hero *arrives* as the intro fades, rather than being revealed
        // already-static underneath it.
        animate={introFinished ? "visible" : "hidden"}
      >
        <motion.span
          variants={item}
          // On phones, nudged down a little so it clears the photo at the top
          // of the portrait background.
          className="relative top-6 font-sans text-xs uppercase tracking-[0.4em] text-gold-deep sm:top-0"
        >
          Together with their families
        </motion.span>

        <motion.div variants={item} className="mt-8">
          <CoupleNames
            nameClassName="text-6xl text-maroon sm:text-7xl md:text-8xl lg:text-[7rem] leading-none"
            heartClassName="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
          />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-8 font-serif text-xl tracking-[0.2em] text-ink/80 sm:text-2xl md:text-3xl"
        >
          {formatDate(couple.weddingDate)} · Prayagraj, India
        </motion.p>

        <motion.div variants={item} className="mt-4 max-w-md">
          <BlessingReveal start={introFinished} />
        </motion.div>

        <motion.div variants={item} className="mt-12">
          <Button size="lg" onClick={scrollToNext}>
            Begin Our Journey
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll to our journey"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gold-deep"
        initial={{ opacity: 0 }}
        animate={{ opacity: prefersReducedMotion ? 1 : [0.4, 1, 0.4] }}
        transition={
          prefersReducedMotion
            ? { duration: 0.6 }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <ChevronDown className="h-6 w-6" />
      </motion.button>
    </section>
  );
}
