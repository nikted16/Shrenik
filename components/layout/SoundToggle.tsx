"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/utils/cn";

export interface SoundToggleProps {
  className?: string;
}

/**
 * Persistent glassmorphic floating button for toggling ambient sound.
 * Sound defaults off (browsers block autoplay-with-sound anyway); this is
 * the visitor's explicit opt-in. Remains mounted after the intro finishes.
 */
export function SoundToggle({ className }: SoundToggleProps) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute ambient sound" : "Unmute ambient sound"}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full",
        "border border-gold/30 bg-warm-white/10 text-gold backdrop-blur-md",
        "shadow-lg transition-colors duration-300 hover:bg-warm-white/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
        className
      )}
    >
      {enabled ? (
        <Volume2 className="h-5 w-5" aria-hidden="true" />
      ) : (
        <VolumeX className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
