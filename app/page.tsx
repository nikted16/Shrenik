"use client";

import { useState } from "react";
import { IntroOverlay } from "@/components/intro/IntroOverlay";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Hero } from "@/sections/Hero";
import { Begin } from "@/sections/Begin";
import { Journey } from "@/sections/Journey";
import { Countdown } from "@/sections/Countdown";
import { Timeline } from "@/sections/Timeline";
import { SaveTheDate } from "@/sections/SaveTheDate";
import { Family } from "@/sections/Family";
import { Gallery } from "@/sections/Gallery";
import { Venue } from "@/sections/Venue";
import { Rsvp } from "@/sections/Rsvp";
import { Footer } from "@/sections/Footer";
import { usePrefersIntro } from "@/hooks/usePrefersIntro";

/** The "Moments · Captured Together" photo gallery is hidden for now — flip
 * to true to bring it back. */
const SHOW_GALLERY = false;

export default function Home() {
  const { shouldShowIntro, markSeen } = usePrefersIntro();

  // Tracks whether the intro has finished (or was skipped), independent of
  // `shouldShowIntro` — this drives when the persistent SoundToggle becomes
  // visible/focusable. While the intro's opaque overlay (z-[100]) covers the
  // page, the SoundToggle (z-50) sits underneath it but was still a real
  // focusable button in the DOM: a keyboard user tabbing from the intro's
  // "Skip" button could land on it without it being visible (WCAG 2.4.11
  // focus-obscured). Not rendering it until the intro is done removes it from
  // the tab order entirely during that window.
  const [introDone, setIntroDone] = useState(false);
  const introFinished = !shouldShowIntro || introDone;

  return (
    <>
      {shouldShowIntro && !introDone ? (
        <IntroOverlay
          onDone={() => {
            markSeen();
            setIntroDone(true);
          }}
        />
      ) : null}

      {introFinished ? (
        <>
          <ScrollProgress />
          <SoundToggle />
        </>
      ) : null}

      <main>
        <Hero introFinished={introFinished} />
        <Begin />
        <Journey />
        <Countdown />
        <SaveTheDate />
        <Family />
        <Timeline />
        {SHOW_GALLERY ? <Gallery /> : null}
        <Venue />
        <Rsvp />
        <Footer />
      </main>
    </>
  );
}
