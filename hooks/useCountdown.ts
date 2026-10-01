"use client";

import { useEffect, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target moment has passed. */
  hasArrived: boolean;
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, hasArrived: false };

function computeTimeLeft(targetMs: number, nowMs: number): TimeLeft {
  const diff = targetMs - nowMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasArrived: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    hasArrived: false,
  };
}

/**
 * Live countdown to an ISO date string, ticking once per second.
 *
 * Returns all-zeros on the server and the first client render so SSR and the
 * initial hydration match; the real value is computed in an effect after
 * mount. Consumers should not read the live value until after hydration —
 * `mounted` distinguishes the placeholder zeros from a genuine "arrived" state.
 */
export function useCountdown(target: string): TimeLeft & { mounted: boolean } {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const targetMs = new Date(target).getTime();

    // Guard against an unparseable date — leave the placeholder zeros in place.
    if (Number.isNaN(targetMs)) {
      setMounted(true);
      return;
    }

    const tick = () => setTimeLeft(computeTimeLeft(targetMs, Date.now()));
    tick();
    setMounted(true);

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return { ...timeLeft, mounted };
}
