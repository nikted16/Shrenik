"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  AMBIENT,
  SOUND_SRC,
  SoundContext,
  type SoundContextValue,
  type SoundName,
} from "@/hooks/useSound";

export interface SoundProviderProps {
  children: ReactNode;
}

/**
 * Owns the single, shared `enabled` flag and `<audio>` element cache for the
 * site's ambient/ritual sound cues, exposed to descendants via
 * `SoundContext` (see `hooks/useSound.ts` for why this is shared rather than
 * per-component local state). Mount once, high enough in the tree that both
 * the persistent `SoundToggle` and `IntroOverlay` are inside it — currently
 * in `app/providers.tsx`, wrapping the whole app.
 *
 * - `enabled` starts `false` — browsers block autoplay-with-sound anyway, so
 *   the intro must always be silent by default; the visitor opts in via the
 *   SoundToggle.
 * - `toggle()` flips `enabled` and starts/stops the ambient bed accordingly.
 * - `play(name)` is a no-op whenever sound is disabled OR the visitor
 *   prefers reduced motion (treated as "prefers a calmer experience" —
 *   reduced motion implies no surprise audio cues either).
 *
 * Audio elements are created lazily on first use and cached in a ref map so
 * we never touch `Audio`/`window` during render or at module scope (SSR-safe).
 */
export function SoundProvider({ children }: SoundProviderProps) {
  const [enabled, setEnabled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const audiosRef = useRef<Partial<Record<SoundName, HTMLAudioElement>>>({});

  const getAudio = useCallback((name: SoundName): HTMLAudioElement | null => {
    if (typeof window === "undefined") return null;
    let audio = audiosRef.current[name];
    if (!audio) {
      audio = new Audio(SOUND_SRC[name]);
      audio.preload = "none";
      audiosRef.current[name] = audio;
    }
    return audio;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled || prefersReducedMotion) return;
      const audio = getAudio(name);
      if (!audio) return;
      audio.currentTime = 0;
      void audio.play().catch(() => {
        // Autoplay/permission errors are expected in some browser states;
        // sound is a non-essential enhancement so we swallow them.
      });
    },
    [enabled, prefersReducedMotion, getAudio]
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      const ambient = getAudio(AMBIENT);
      if (ambient) {
        if (next && !prefersReducedMotion) {
          ambient.loop = true;
          ambient.currentTime = 0;
          void ambient.play().catch(() => {});
        } else {
          ambient.pause();
        }
      }
      return next;
    });
  }, [getAudio, prefersReducedMotion]);

  // Stop everything on unmount so nothing keeps playing behind a closed page.
  useEffect(() => {
    const audios = audiosRef.current;
    return () => {
      Object.values(audios).forEach((audio) => audio?.pause());
    };
  }, []);

  const value = useMemo<SoundContextValue>(
    () => ({ enabled, toggle, play }),
    [enabled, toggle, play]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
