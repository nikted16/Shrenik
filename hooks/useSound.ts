"use client";

import { createContext, useContext } from "react";

export type SoundName = "bells" | "flute" | "shloka";

export const SOUND_SRC: Record<SoundName, string> = {
  bells: "/assets/audio/bells.mp3",
  flute: "/assets/audio/flute.mp3",
  shloka: "/assets/audio/shloka.mp3",
};

/** The ambient bed that plays/stops as the sound toggle is flipped. */
export const AMBIENT: SoundName = "flute";

export interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
}

/**
 * Shared sound state, provided by `<SoundProvider>`
 * (`components/layout/SoundProvider.tsx`). Kept in this plain `.ts` module
 * (rather than inside the provider component itself) so both the provider
 * and this hook import the exact same `Context` object.
 */
export const SoundContext = createContext<SoundContextValue | null>(null);

/**
 * Reads the shared sound state from the nearest `<SoundProvider>`.
 *
 * This exists as shared context — rather than each caller owning its own
 * local `useState` — so every consumer reads/writes the *same* `enabled`
 * flag. An earlier version had `useSound` manage independent local state
 * per call site, so the persistent `SoundToggle` and `IntroOverlay`'s
 * `play("bells")`/`play("shloka")` cues each got a disconnected `enabled`
 * flag and a disconnected Audio cache: toggling sound in `SoundToggle` never
 * affected the flag `IntroOverlay` was checking, so the bell/shloka cues
 * were permanently dead (always saw `enabled === false`). `<SoundProvider>`
 * is mounted once, in `app/providers.tsx`, wrapping the whole app, so both
 * consumers now read the one true `enabled` value.
 *
 * Throws if no provider is mounted, so a missing provider fails loudly at
 * the call site rather than silently falling back to a disconnected flag.
 */
export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound() must be called within a <SoundProvider>.");
  }
  return ctx;
}
