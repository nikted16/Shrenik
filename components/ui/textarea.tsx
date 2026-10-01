"use client";

import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const fieldBase =
  "w-full rounded-2xl border border-beige bg-warm-white/70 px-4 py-3 font-sans text-ink " +
  "placeholder:text-ink/40 transition-colors duration-300 resize-none " +
  "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea ref={ref} rows={rows} className={cn(fieldBase, className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
