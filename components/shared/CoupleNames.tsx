import { Heart } from "lucide-react";
import { couple } from "@/content/couple";
import { cn } from "@/utils/cn";

export interface CoupleNamesProps {
  className?: string;
  /** Tailwind size classes for each name. */
  nameClassName?: string;
  heartClassName?: string;
}

/**
 * Renders the couple's names in the site-wide display order (bride first, per
 * `couple.displayOrder`) with a filled heart between them. Single source of
 * truth for how "Shreya ♥ Nikhil" is composed, so hero and intro stay in sync.
 */
export function CoupleNames({ className, nameClassName, heartClassName }: CoupleNamesProps) {
  const [first, second] = couple.displayOrder.map((key) => couple[key].name);

  return (
    <span className={cn("inline-flex items-center justify-center gap-4 font-serif", className)}>
      <span className={cn(nameClassName)}>{first}</span>
      <Heart
        className={cn("shrink-0 fill-maroon text-maroon", heartClassName)}
        aria-label="and"
      />
      <span className={cn(nameClassName)}>{second}</span>
    </span>
  );
}
