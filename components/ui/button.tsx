"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide " +
  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid: "bg-gold text-ink hover:bg-gold-deep hover:text-warm-white shadow-[0_12px_30px_-12px_rgba(199,163,78,0.7)]",
  outline: "border border-gold/60 text-gold-deep hover:bg-gold/10",
  ghost: "text-gold-deep hover:bg-gold/10",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-2.5 text-sm",
  lg: "px-9 py-4 text-base",
};

/**
 * The site's single button primitive. Rounded, gold-forward, with the
 * signature ease. Restyled well away from any default component look.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
