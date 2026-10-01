"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EASE } from "@/animations/transitions";
import { events } from "@/content/events";
import { rsvpSchema, submitRsvp, type RsvpInput } from "@/lib/rsvp";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

/**
 * RSVP form — React Hook Form + Zod validation, submitting through the
 * swappable `submitRsvp()` abstraction (currently a stub). On success the form
 * cross-fades into a warm confirmation card. All inputs are labelled and
 * errors are announced for assistive tech.
 */
export function Rsvp() {
  const prefersReducedMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      attending: undefined,
      guestCount: 1,
      events: [],
      dietaryRestrictions: "",
      message: "",
    },
  });

  const attending = watch("attending");

  const onSubmit = handleSubmit(async (data) => {
    await submitRsvp(rsvpSchema.parse(data));
    setSubmitted(true);
  });

  const fieldError = (msg?: string) =>
    msg ? (
      <p role="alert" className="mt-1.5 font-sans text-xs text-maroon">
        {msg}
      </p>
    ) : null;

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-heading"
      className="bg-ivory px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          kicker="Join Us"
          title="Will You Celebrate With Us?"
          subtitle="Kindly respond by 15 November 2026 so we can plan every detail."
        />
        <h2 id="rsvp-heading" className="sr-only">
          RSVP
        </h2>

        <div className="relative mt-16">
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: EASE }}
                className="flex flex-col items-center rounded-[2rem] border border-beige/70 bg-warm-white p-12 text-center shadow-[0_24px_60px_-40px_rgba(43,33,27,0.5)]"
              >
                <motion.span
                  initial={{ scale: prefersReducedMotion ? 1 : 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    ease: EASE,
                    delay: prefersReducedMotion ? 0 : 0.15,
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold-deep"
                >
                  <Check className="h-8 w-8" />
                </motion.span>
                <h3 className="mt-6 font-serif text-3xl text-maroon">
                  Thank you!
                </h3>
                <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-ink/70">
                  Your response has been received. We can&apos;t wait to celebrate
                  this special day with you.
                </p>
                <Button
                  variant="ghost"
                  className="mt-6"
                  onClick={() => {
                    reset();
                    setSubmitted(false);
                  }}
                >
                  Submit another response
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
                className="flex flex-col gap-6 rounded-[2rem] border border-beige/70 bg-warm-white p-8 shadow-[0_24px_60px_-40px_rgba(43,33,27,0.5)] sm:p-10"
              >
                <div>
                  <label htmlFor="rsvp-name" className="mb-1.5 block font-sans text-sm text-ink/80">
                    Full name
                  </label>
                  <Input
                    id="rsvp-name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {fieldError(errors.name?.message)}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="rsvp-email" className="mb-1.5 block font-sans text-sm text-ink/80">
                      Email
                    </label>
                    <Input
                      id="rsvp-email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                    {fieldError(errors.email?.message)}
                  </div>
                  <div>
                    <label htmlFor="rsvp-phone" className="mb-1.5 block font-sans text-sm text-ink/80">
                      Phone <span className="text-ink/40">(optional)</span>
                    </label>
                    <Input
                      id="rsvp-phone"
                      type="tel"
                      autoComplete="tel"
                      {...register("phone")}
                    />
                    {fieldError(errors.phone?.message)}
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-2 font-sans text-sm text-ink/80">
                    Will you be attending?
                  </legend>
                  <div className="flex gap-3">
                    {(
                      [
                        { value: "yes", label: "Joyfully accepts" },
                        { value: "no", label: "Regretfully declines" },
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex flex-1 cursor-pointer items-center justify-center rounded-2xl border px-4 py-3 text-center font-sans text-sm transition-colors duration-300",
                          attending === opt.value
                            ? "border-gold bg-gold/15 text-maroon"
                            : "border-beige bg-warm-white text-ink/70 hover:border-gold/60",
                        )}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          className="sr-only"
                          {...register("attending")}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {fieldError(errors.attending?.message)}
                </fieldset>

                {/* Attendance-dependent fields */}
                <AnimatePresence initial={false}>
                  {attending === "yes" ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
                      className="flex flex-col gap-6 overflow-hidden"
                    >
                      <div>
                        <label htmlFor="rsvp-guests" className="mb-1.5 block font-sans text-sm text-ink/80">
                          Number of guests (including you)
                        </label>
                        <Input
                          id="rsvp-guests"
                          type="number"
                          min={1}
                          max={10}
                          className="w-32"
                          aria-invalid={!!errors.guestCount}
                          {...register("guestCount")}
                        />
                        {fieldError(errors.guestCount?.message)}
                      </div>

                      <fieldset>
                        <legend className="mb-2 font-sans text-sm text-ink/80">
                          Which events will you join? <span className="text-ink/40">(optional)</span>
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {events.map((event) => (
                            <label
                              key={event.id}
                              className="flex cursor-pointer items-center gap-2 rounded-full border border-beige bg-warm-white px-4 py-2 font-sans text-sm text-ink/75 transition-colors duration-300 hover:border-gold/60 has-[:checked]:border-gold has-[:checked]:bg-gold/15 has-[:checked]:text-maroon"
                            >
                              <input
                                type="checkbox"
                                value={event.id}
                                className="sr-only"
                                {...register("events")}
                              />
                              {event.name}
                            </label>
                          ))}
                        </div>
                      </fieldset>

                      <div>
                        <label htmlFor="rsvp-diet" className="mb-1.5 block font-sans text-sm text-ink/80">
                          Dietary restrictions <span className="text-ink/40">(optional)</span>
                        </label>
                        <Input id="rsvp-diet" {...register("dietaryRestrictions")} />
                        {fieldError(errors.dietaryRestrictions?.message)}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div>
                  <label htmlFor="rsvp-message" className="mb-1.5 block font-sans text-sm text-ink/80">
                    A note for the couple <span className="text-ink/40">(optional)</span>
                  </label>
                  <Textarea id="rsvp-message" {...register("message")} />
                  {fieldError(errors.message?.message)}
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
                  {isSubmitting ? (
                    "Sending…"
                  ) : (
                    <>
                      Send RSVP <Heart className="h-4 w-4 fill-current" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
