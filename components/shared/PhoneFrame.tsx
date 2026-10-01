"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface PhoneFrameProps {
  /** Screen content — clipped to the phone's rounded screen. */
  children: ReactNode;
  className?: string;
}

/**
 * A realistic CSS-only iPhone shell used to present the mobile video invitation.
 * Renders a titanium bezel, Dynamic Island, side buttons, and a subtle screen
 * sheen. Children fill the portrait screen (9 / 19.5) and are clipped to its
 * rounded corners, so native <video> controls stay inside the device.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[300px] select-none",
        className,
      )}
    >
      {/* Side buttons — behind the bezel so only the nubs peek out. */}
      <span
        aria-hidden
        className="absolute -left-[3px] top-[22%] h-9 w-[3px] rounded-l-sm bg-neutral-700"
      />
      <span
        aria-hidden
        className="absolute -left-[3px] top-[32%] h-14 w-[3px] rounded-l-sm bg-neutral-700"
      />
      <span
        aria-hidden
        className="absolute -left-[3px] top-[47%] h-14 w-[3px] rounded-l-sm bg-neutral-700"
      />
      <span
        aria-hidden
        className="absolute -right-[3px] top-[30%] h-20 w-[3px] rounded-r-sm bg-neutral-700"
      />

      {/* Titanium bezel */}
      <div className="relative rounded-[3rem] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[3px] shadow-[0_40px_90px_-40px_rgba(43,33,27,0.75)]">
        <div className="rounded-[2.85rem] bg-black p-[10px]">
          {/* Screen */}
          <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.2rem] bg-ink">
            {children}

            {/* Dynamic Island */}
            <div className="pointer-events-none absolute left-1/2 top-[11px] z-20 h-[26px] w-[86px] -translate-x-1/2 rounded-full bg-black" />

            {/* Screen sheen — a soft diagonal reflection. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 rounded-[2.2rem] bg-gradient-to-br from-white/10 via-transparent to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
