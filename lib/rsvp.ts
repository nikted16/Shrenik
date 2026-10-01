import { z } from "zod";

/**
 * Validation schema for the RSVP form. Mirrors the `Rsvp` type in
 * `@/types`, with user-facing validation rules and messages.
 */
export const rsvpSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name"),
    email: z.string().trim().email("Please enter a valid email"),
    phone: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),
    attending: z.enum(["yes", "no"], {
      message: "Please let us know if you can make it",
    }),
    guestCount: z.coerce
      .number()
      .int("Whole numbers only")
      .min(1, "At least one guest")
      .max(10, "Please contact us for larger parties"),
    events: z.array(z.string()).default([]),
    dietaryRestrictions: z.string().trim().max(300).optional().or(z.literal("")),
    message: z.string().trim().max(500).optional().or(z.literal("")),
  })
  // If not attending, guest count and event selection are irrelevant — but we
  // keep the schema permissive so the form can still submit a polite "no".
  .transform((data) => ({
    ...data,
    guestCount: data.attending === "no" ? 0 : data.guestCount,
  }));

/** The validated, transformed RSVP payload. */
export type RsvpInput = z.input<typeof rsvpSchema>;
export type RsvpData = z.output<typeof rsvpSchema>;

/**
 * Submits an RSVP.
 *
 * NOTE: This is intentionally a stub. The UI (form + success animation) is
 * complete, but no backend is wired yet. When a backend is chosen (Google
 * Sheet via Apps Script, a form service, email, or a serverless DB), replace
 * ONLY the body of this function with the real network call — every caller
 * already awaits this single abstraction, so no component needs to change.
 */
export async function submitRsvp(data: RsvpData): Promise<void> {
  // Simulate network latency so the success animation feels real in dev.
  await new Promise((resolve) => setTimeout(resolve, 900));
  console.info("[RSVP] (stub) received submission:", data);
}
