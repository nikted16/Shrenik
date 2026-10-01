"use client";

import Lenis from "lenis";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SoundProvider } from "@/components/layout/SoundProvider";

export interface ProvidersProps {
  children: ReactNode;
}

/**
 * App-wide client providers. Currently responsible for initializing Lenis
 * smooth-scroll. When the user prefers reduced motion, Lenis is skipped
 * entirely so native/instant browser scrolling is used instead.
 */
export function Providers({ children }: ProvidersProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <SoundProvider>{children}</SoundProvider>;
}
