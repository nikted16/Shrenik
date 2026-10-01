"use client";

import { Heart, Mail } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { CoupleNames } from "@/components/shared/CoupleNames";
import { footerContent } from "@/content/footer";

/**
 * Closing blessing — a quiet, reverent sign-off. Om, the couple's names and a
 * closing line, and contact links, all on a light ivory-to-
 * sand wash so the gold and maroon text stay legible, with a slim maroon
 * strip as the base. Deliberately still after the energy of the RSVP.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-ivory to-sand text-center">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-20 pt-28 sm:pt-36">
        <span
          className="text-4xl text-gold-deep"
          aria-hidden
        >
          ॐ
        </span>

        <div className="my-12 h-px w-24 bg-gold/50" aria-hidden />

        <CoupleNames
          nameClassName="text-4xl text-maroon sm:text-5xl"
          heartClassName="h-6 w-6 sm:h-7 sm:w-7"
        />

        <p className="mt-6 font-script text-2xl text-gold-deep">
          {footerContent.closingMessage}
        </p>

        <div className="mt-10 flex items-center gap-5">
          <a
            href={`mailto:${footerContent.contactEmail}`}
            aria-label="Email the couple"
            className="rounded-full border border-gold/40 p-3 text-gold-deep transition-colors duration-300 hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="rounded-full border border-gold/40 p-3 text-gold-deep transition-colors duration-300 hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </Reveal>

      <p className="flex items-center justify-center gap-1.5 bg-maroon px-6 py-5 font-sans text-xs tracking-wide text-warm-white/85">
        Made with <Heart className="h-3 w-3 fill-current" aria-label="love" /> for
        our celebration
      </p>
    </footer>
  );
}
