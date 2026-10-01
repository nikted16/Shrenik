"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { fadeUp, fadeIn, staggerChildren } from "@/animations/variants";
import { family } from "@/content/family";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * "Our Greatest Blessings" — a warm grid of the families. Each card has a soft
 * rounded portrait, the person's name, and a handwritten-style relation caption.
 * Cards reveal in a gentle stagger as the section scrolls into view.
 */
export function Family() {
  const prefersReducedMotion = useReducedMotion();
  const itemVariant = prefersReducedMotion ? fadeIn : fadeUp;

  return (
    <section
      id="family"
      aria-labelledby="family-heading"
      className="bg-sand/60 px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="With Gratitude"
          title="Our Greatest Blessings"
          subtitle="The families whose love and blessings light our path."
        />
        <h2 id="family-heading" className="sr-only">
          Our Family
        </h2>

        <motion.div
          className="mt-20 flex flex-col gap-14"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {/* Top row: the mothers. Bottom row: the fathers and the bride's
              brother. Both rows center and wrap on small screens. */}
          {[family.slice(0, 2), family.slice(2)].map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex flex-wrap justify-center gap-x-8 gap-y-14"
            >
              {row.map((member) => (
                <motion.figure
                  key={member.id}
                  variants={itemVariant}
                  className="flex w-full max-w-[16rem] flex-col items-center text-center sm:w-64"
                >
                  <div className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-warm-white shadow-[0_20px_50px_-25px_rgba(43,33,27,0.6)]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="208px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-6 flex flex-col items-center gap-1">
                    <span className="font-serif text-2xl text-maroon">
                      {member.name}
                    </span>
                    <span className="font-script text-xl text-gold-deep">
                      {member.relation}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
