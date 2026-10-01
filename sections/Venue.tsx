"use client";

import { MapPin, Navigation } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { venues } from "@/content/venues";

const linkBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-sans text-sm font-medium tracking-wide " +
  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

/**
 * "The Venues" — where each celebration happens: one card per venue with its
 * events, name, an embedded Google Map, and two links (turn-by-turn
 * directions, and the place page in Google Maps). The links are styled to
 * match the Button primitive but are real anchors, so on phones they open
 * the Maps app. Cards sit side by side on wide screens, stacked on phones.
 */
export function Venue() {
  return (
    <section id="venue" aria-label="Venues" className="bg-warm-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="Where to Find Us"
          title="The Venues"
          subtitle="Both are a short walk apart in Prayagraj."
        />

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {venues.map((v, i) => (
            <Reveal
              key={v.id}
              as="article"
              delay={0.1 * (i + 1)}
              className="flex flex-col items-center rounded-3xl border border-gold/40 bg-ivory p-3 text-center shadow-[0_30px_60px_-30px_rgba(110,43,43,0.35)]"
            >
              <iframe
                src={v.embedUrl}
                title={`Map showing ${v.name}, ${v.city}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-[4/3] w-full rounded-2xl border-0"
              />

              <div className="flex flex-col items-center px-4 pb-6 pt-7">
                <span className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-gold-deep">
                  {v.events}
                </span>
                <h3 className="mt-3 font-serif text-3xl text-maroon sm:text-4xl">{v.name}</h3>
                <p className="mt-2 font-sans text-sm text-ink/70">{v.city}</p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={v.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to ${v.name}`}
                    className={`${linkBase} bg-gold text-ink shadow-[0_12px_30px_-12px_rgba(199,163,78,0.7)] hover:bg-gold-deep hover:text-warm-white`}
                  >
                    <Navigation className="h-4 w-4" aria-hidden />
                    Get Directions
                  </a>
                  <a
                    href={v.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${v.name} in Google Maps`}
                    className={`${linkBase} border border-gold/60 text-gold-deep hover:bg-gold/10`}
                  >
                    <MapPin className="h-4 w-4" aria-hidden />
                    Open in Maps
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
