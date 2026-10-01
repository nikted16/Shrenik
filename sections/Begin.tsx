"use client";

import { useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { SparkleShower } from "@/components/shared/SparkleShower";
import { Typewriter } from "@/components/shared/Typewriter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LINE = "Two souls. One perfect fit.";

/**
 * Full-screen interlude the hero's "Begin Our Journey" button scrolls to: the
 * couple's two childhood photos as puzzle pieces fitting together, with a
 * single line typed out along the bottom once the section is on screen.
 */
export function Begin() {
  const ref = useRef<HTMLElement>(null);
  // Start typing only once most of the section is visible, so the line is
  // written while the visitor is looking at it.
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // Sparkles fall only while the section is on screen, and stop when it
  // scrolls away so they aren't animating unseen.
  const onScreen = useInView(ref, { amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const scrollToNext = () => {
    document.getElementById("journey")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={ref}
      id="begin"
      aria-label="Two souls, one perfect fit"
      className="relative flex min-h-[100svh] items-end justify-center overflow-hidden"
    >
      <ParallaxImage
        src="/assets/images/begin-bg.jpg"
        portraitSrc="/assets/images/begin-bg-mobile.jpg"
        alt="Childhood photos of Shreya and Nikhil as two puzzle pieces fitting together"
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />

      <SparkleShower active={onScreen} />

      <div className="relative z-10 flex w-full flex-col items-center px-6 pb-[6svh] text-center">
        <Typewriter
          text={LINE}
          start={inView}
          startDelay={600}
          charMs={70}
          className="font-serif text-3xl italic text-maroon sm:text-4xl md:text-5xl"
        />

        <button
          type="button"
          onClick={scrollToNext}
          className="mt-8 flex flex-col items-center gap-1 rounded-full px-4 py-2 font-sans text-xs uppercase tracking-[0.35em] text-gold-deep transition-colors duration-300 hover:text-maroon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          Continue
          <ChevronDown className="h-5 w-5 motion-safe:animate-bounce" aria-hidden />
        </button>
      </div>
    </section>
  );
}
