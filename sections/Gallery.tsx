"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EASE } from "@/animations/transitions";
import { gallery } from "@/content/gallery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A Pinterest-style masonry gallery (CSS columns) with lazy-loaded images and
 * an accessible lightbox (Radix Dialog handles focus trap + Esc). Arrow keys
 * and on-screen buttons page through images; motion respects reduced-motion.
 */
export function Gallery() {
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const show = useCallback((index: number) => setOpenIndex(index), []);
  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length)),
    [],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % gallery.length)),
    [],
  );

  // Arrow-key navigation while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, prev, next]);

  const active = openIndex !== null ? gallery[openIndex] : null;

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-sand/60 px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="Moments"
          title="Captured Together"
          subtitle="A few of the memories that led us here."
        />
        <h2 id="gallery-heading" className="sr-only">
          Gallery
        </h2>

        <div className="mt-20 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {gallery.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => show(index)}
              className="group relative block w-full overflow-hidden rounded-2xl shadow-[0_18px_50px_-30px_rgba(43,33,27,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
              aria-label={`View image: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span
                className="absolute inset-0 bg-maroon/0 transition-colors duration-500 group-hover:bg-maroon/10"
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>

      <Dialog.Root open={isOpen} onOpenChange={(o) => !o && close()}>
        <AnimatePresence>
          {isOpen && active ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[120] bg-ink/80 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-label="Image viewer">
                <motion.div
                  className="fixed inset-0 z-[121] flex items-center justify-center p-4 sm:p-10"
                  initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE }}
                >
                  <Dialog.Title className="sr-only">{active.alt}</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Image {openIndex! + 1} of {gallery.length}. Use the left and right
                    arrow keys to navigate.
                  </Dialog.Description>

                  <div
                    className="relative max-h-full max-w-4xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={active.src}
                      alt={active.alt}
                      width={active.width}
                      height={active.height}
                      sizes="90vw"
                      className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
                      priority
                    />
                  </div>

                  {/* Controls */}
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-warm-white/90 p-3 text-ink shadow-lg transition hover:bg-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:left-6"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-warm-white/90 p-3 text-ink shadow-lg transition hover:bg-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-6"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close"
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
