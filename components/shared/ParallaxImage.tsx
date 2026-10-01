"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image, { getImageProps } from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

export interface ParallaxImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  /** Passed through to next/image's `sizes` prop. Defaults to "100vw". */
  sizes?: string;
  /** Optional alternate image for portrait screens (phones). When set, the
   * browser picks `src` or `portraitSrc` by orientation and downloads only
   * the one it shows. */
  portraitSrc?: string;
  /** Optional alternate image for squarer landscape screens (tablets held
   * sideways, ~4:3), where a wide image would crop its sides off. Only used
   * alongside `portraitSrc`. */
  tabletSrc?: string;
}

/** Squarer than 3:2 — iPads and similar in landscape, not laptops/desktops. */
const TABLET_LANDSCAPE = "(orientation: landscape) and (max-aspect-ratio: 3/2)";

/** Screen-shape art direction: one `<picture>`, a source per shape. The
 * browser uses the first matching source, so the order matters. */
function ArtDirectedImage({
  src,
  portraitSrc,
  tabletSrc,
  alt,
  priority,
  sizes,
}: Required<Pick<ParallaxImageProps, "src" | "portraitSrc" | "alt" | "sizes">> & {
  tabletSrc?: string;
  priority?: boolean;
}) {
  const common = { alt, sizes, fill: true, priority };
  const {
    props: { srcSet: landscapeSrcSet },
  } = getImageProps({ ...common, src });
  const {
    props: { srcSet: portraitSrcSet, ...rest },
  } = getImageProps({ ...common, src: portraitSrc });
  const tabletSrcSet = tabletSrc
    ? getImageProps({ ...common, src: tabletSrc }).props.srcSet
    : undefined;

  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={portraitSrcSet} />
      {tabletSrcSet ? <source media={TABLET_LANDSCAPE} srcSet={tabletSrcSet} /> : null}
      <source media="(orientation: landscape)" srcSet={landscapeSrcSet} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps via `rest` */}
      <img {...rest} className="object-cover" />
    </picture>
  );
}

/**
 * A next/image wrapped in a motion.div whose vertical position drifts by a
 * subtle amount (<=12% of the element's height) as it scrolls through the
 * viewport, for a cinematic parallax feel. Under prefers-reduced-motion the
 * image is rendered static with no scroll-linked transform.
 */
export function ParallaxImage({
  src,
  alt,
  priority,
  className,
  sizes = "100vw",
  portraitSrc,
  tabletSrc,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="relative h-full w-full"
        style={prefersReducedMotion ? undefined : { y }}
      >
        {portraitSrc ? (
          <ArtDirectedImage
            src={src}
            portraitSrc={portraitSrc}
            tabletSrc={tabletSrc}
            alt={alt}
            priority={priority}
            sizes={sizes}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        )}
      </motion.div>
    </div>
  );
}
