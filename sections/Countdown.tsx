"use client";

import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useCountdown } from "@/hooks/useCountdown";
import { couple } from "@/content/couple";

interface Unit {
  label: string;
  value: number;
}

/**
 * "Counting Down to Forever" — a live countdown to the wedding date, replacing
 * the former story section. Four cards (days/hours/minutes/seconds) tick every
 * second; once the date passes, an "arrived" message takes their place.
 *
 * The date is the single source of truth in content/couple.ts, so this stays
 * in sync with the hero and events automatically.
 */
export function Countdown() {
  const { days, hours, minutes, seconds, hasArrived, mounted } = useCountdown(
    couple.weddingDate,
  );

  const units: Unit[] = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <section
      id="countdown"
      aria-labelledby="countdown-heading"
      className="bg-ivory px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          kicker="Counting Down"
          title="Counting Down to Forever"
          subtitle="Every moment brings us closer to our special day."
        />
        <h2 id="countdown-heading" className="sr-only">
          Countdown to the wedding
        </h2>

        <Reveal
          className="mt-16 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4"
          delay={0.1}
        >
          {units.map((unit) => (
            <div
              key={unit.label}
              className="relative overflow-hidden rounded-[1.75rem] bg-warm-white px-6 py-10 text-center shadow-[0_30px_80px_-50px_rgba(43,33,27,0.55)] ring-1 ring-beige/60"
            >
              {/* Soft gold corner accent, echoing the cards in the reference. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-gold/40 to-transparent blur-md"
              />
              <span className="block font-serif text-5xl leading-none text-maroon tabular-nums sm:text-6xl">
                {/* Placeholder dashes until hydration so SSR/CSR match. */}
                {mounted ? String(unit.value).padStart(2, "0") : "--"}
              </span>
              <span className="mt-4 block font-sans text-xs font-medium uppercase tracking-[0.3em] text-ink/60">
                {unit.label}
              </span>
            </div>
          ))}
        </Reveal>

        {mounted && hasArrived ? (
          <Reveal className="mt-14 flex justify-center">
            <p className="rounded-full bg-warm-white px-8 py-4 font-serif text-xl text-maroon shadow-[0_20px_60px_-40px_rgba(43,33,27,0.55)] ring-1 ring-beige/60">
              The moment has arrived! 💕
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
