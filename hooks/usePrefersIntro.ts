"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

// `useLayoutEffect` has no effect during SSR and React warns if it's used
// there directly; falling back to `useEffect` on the server (where it's a
// no-op either way) avoids that warning while still getting the
// fire-before-paint behavior on the client. This is the standard
// "isomorphic layout effect" pattern.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Drives whether the cinematic intro overlay should be showing right now.
 *
 * By product decision the intro plays on EVERY visit/refresh — there is no
 * "seen before, skip it" persistence. An earlier version gated this via a
 * `ns-intro-seen` localStorage flag that survived across visits; that flag
 * (and all reads/writes of it) has been removed so returning visitors get
 * the full blessing sequence again each time. `markSeen` still exists (now
 * just flipping local state) so `onDone` in `app/page.tsx` keeps working
 * unchanged for the current visit's "Skip"/finish flow.
 *
 * SSR-safety / hydration note: `shouldShowIntro` starts `false` — the only
 * value the server can ever render, since deciding "show the intro" is now
 * an unconditional client-side choice rather than a data read, and the
 * server must not guess ahead of the client. The flip to `true` happens in
 * a `useIsomorphicLayoutEffect` (see above), which runs synchronously after
 * the client's first commit but before the browser paints that commit —
 * unlike a plain `useEffect`, which is deferred until after paint. That
 * re-render/re-commit lands within the same pre-paint window, so the
 * browser's actual first paint already shows the intro, preserving "warm
 * frame first" (the very first HTML the browser receives is still the
 * server-rendered "no intro" markup — an inherent SSR tradeoff, unchanged
 * from before — but no user-visible frame is ever painted without it).
 */
export function usePrefersIntro() {
  const [shouldShowIntro, setShouldShowIntro] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setShouldShowIntro(true);
  }, []);

  const markSeen = useCallback(() => {
    setShouldShowIntro(false);
  }, []);

  return { shouldShowIntro, markSeen };
}
