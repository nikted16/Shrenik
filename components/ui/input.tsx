"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const fieldBase =
  "w-full rounded-2xl border border-beige bg-warm-white/70 px-4 py-3 font-sans text-ink " +
  "placeholder:text-ink/40 transition-colors duration-300 " +
  "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  ),
);
Input.displayName = "Input";
