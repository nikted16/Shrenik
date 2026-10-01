"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PhoneFrame } from "@/components/shared/PhoneFrame";

const VIDEO_SRC = "/assets/video/save-the-date.mp4";
const POSTER_SRC = "/assets/video/save-the-date-poster.jpg";

/**
 * "Save the Date" — the couple's video invitation. Shows a poster frame with a
 * gold play button; on first play the overlay fades away and native controls
 * take over. Kept click-to-play (never autoplay) so the page stays quiet until
 * the visitor opts in — consistent with the site's sound philosophy.
 */
export function SaveTheDate() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    setStarted(true);
    // Defer so the overlay-removal render commits before we call play().
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => {
        // If play is rejected, native controls remain available.
      });
    });
  };

  return (
    <section
      id="save-the-date"
      aria-labelledby="save-the-date-heading"
      className="bg-ivory px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          kicker="Save the Date"
          title="A Little Invitation"
          subtitle="Press play — we made something to ask you in person."
        />
        <h2 id="save-the-date-heading" className="sr-only">
          Save the Date video
        </h2>

        <Reveal className="mt-16" delay={0.1}>
          <PhoneFrame>
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              controls={started}
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            />

            {/* Poster overlay + play button — removed once playback starts. */}
            {!started ? (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Play the save the date video"
                className="group absolute inset-0 z-20 flex items-center justify-center bg-ink/20 transition-colors duration-500 hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-warm-white/90 text-maroon shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                  <Play className="ml-1 h-8 w-8 fill-current" strokeWidth={0} />
                </span>
              </button>
            ) : null}
          </PhoneFrame>
        </Reveal>
      </div>
    </section>
  );
}
