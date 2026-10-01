"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Play, X } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EASE } from "@/animations/transitions";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Screen recording of the little website Nikhil built to ask Shreya to be his Valentine. */
const VIDEO_SRC = "/assets/video/proposal.mp4";
const POSTER_SRC = "/assets/video/proposal-poster.jpg";

/**
 * "Our Journey" — the origin of the story. It frames the single question that
 * started everything ("Will you be my Valentine?") and plays a recording of the
 * little website Nikhil built to ask it. Clicking the poster opens a full-width
 * lightbox (Radix Dialog handles focus trap + Esc) where the video plays with
 * controls and sound — nothing plays until the visitor opts in, consistent with
 * the site's sound philosophy.
 */
export function Journey() {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    // Defer so the dialog video mounts before we call play().
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => {
        // If play is rejected, native controls remain available.
      });
    });
  };

  const close = () => {
    videoRef.current?.pause();
    setIsOpen(false);
  };

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="bg-ivory px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          kicker="Our Journey"
          title="Where It All Began"
          subtitle="Every forever starts with a single question."
        />
        <h2 id="journey-heading" className="sr-only">
          Our Journey
        </h2>

        <Reveal className="mt-16" delay={0.1}>
          <div className="relative overflow-hidden rounded-[2rem] bg-warm-white px-8 py-14 text-center shadow-[0_40px_100px_-50px_rgba(43,33,27,0.55)] ring-1 ring-beige/60 sm:px-14 sm:py-16">
            {/* Soft gold glow accents in the corners. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-gold/30 to-transparent blur-2xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-tl from-maroon/15 to-transparent blur-2xl"
            />

            <span
              aria-hidden
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-deep"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
            </span>

            <p className="mt-8 font-script text-4xl leading-tight text-maroon sm:text-5xl">
              “Will you be my Valentine?”
            </p>

            <p className="mx-auto mt-6 max-w-md font-sans text-base leading-relaxed text-ink/70">
              It began with one nervous question — and a little website Nikhil
              built just to ask it. She said yes, and the rest became our
              forever.
            </p>

            {/* Poster that opens the recording in a full-width lightbox. */}
            <button
              type="button"
              onClick={open}
              aria-label="Play the recording of the proposal website"
              className="group relative mt-10 block aspect-[2.116] w-full overflow-hidden rounded-2xl bg-ink shadow-[0_30px_70px_-40px_rgba(43,33,27,0.6)] ring-1 ring-beige/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static poster, no layout shift concerns */}
              <img
                src={POSTER_SRC}
                alt=""
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors duration-500 group-hover:bg-ink/10">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-white/90 text-maroon shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7 fill-current" strokeWidth={0} />
                </span>
              </span>
            </button>

            <p className="mt-4 font-sans text-xs text-ink/40">
              The little site that started it all
            </p>
          </div>
        </Reveal>
      </div>

      {/* Full-width lightbox — plays the recording with native controls. */}
      <Dialog.Root open={isOpen} onOpenChange={(o) => !o && close()}>
        <AnimatePresence>
          {isOpen ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[120] bg-ink/85 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-label="Proposal website recording">
                <motion.div
                  className="fixed inset-0 z-[121] flex items-center justify-center p-4 sm:p-10"
                  initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE }}
                >
                  <Dialog.Title className="sr-only">
                    “Will you be my Valentine?” — the proposal website
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    A screen recording of the website Nikhil built to propose.
                    Press Escape or the close button to exit.
                  </Dialog.Description>

                  <video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    poster={POSTER_SRC}
                    controls
                    playsInline
                    className="max-h-[85vh] w-full max-w-6xl rounded-2xl bg-ink object-contain shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close video"
                      className="absolute right-3 top-3 rounded-full bg-warm-white/90 p-2.5 text-ink shadow-lg transition hover:bg-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-6 sm:top-6"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  );
}
