import type { WeddingEvent } from "@/types";

/**
 * Pads a number to two digits (e.g. 9 -> "09").
 */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Converts a local date ("YYYY-MM-DD") + time ("HH:MM") into an iCalendar
 * UTC timestamp of the form YYYYMMDDTHHMMSSZ.
 *
 * The event times in content are authored as local wall-clock times for the
 * venue. We build a local Date and emit its UTC components so calendar apps
 * place the event correctly relative to the viewer's timezone.
 */
function toIcsUtc(date: string, time: string): string {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const local = new Date(y, (mo ?? 1) - 1, d ?? 1, h ?? 0, mi ?? 0, 0);
  return (
    `${local.getUTCFullYear()}${pad(local.getUTCMonth() + 1)}${pad(local.getUTCDate())}` +
    `T${pad(local.getUTCHours())}${pad(local.getUTCMinutes())}${pad(local.getUTCSeconds())}Z`
  );
}

/**
 * Escapes text for inclusion in an iCalendar field per RFC 5545 (commas,
 * semicolons, backslashes, and newlines must be escaped).
 */
function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Builds a valid single-event iCalendar (.ics) document for a wedding event.
 * If no end time is given, the event defaults to a 2-hour duration is NOT
 * assumed — instead DTEND is omitted and calendars treat it as a point event;
 * however all our events supply endTime.
 */
export function buildIcs(event: WeddingEvent): string {
  const dtStart = toIcsUtc(event.date, event.startTime);
  const dtEnd = event.endTime ? toIcsUtc(event.date, event.endTime) : undefined;
  const location = `${event.venueName}, ${event.address}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nikhil & Shreya Wedding//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@nikhil-shreya-wedding`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    ...(dtEnd ? [`DTEND:${dtEnd}`] : []),
    `SUMMARY:${escapeIcs(event.name)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // iCalendar lines are CRLF-delimited.
  return lines.join("\r\n");
}

/**
 * Triggers a client-side download of the .ics file for an event. Safe to call
 * only in the browser (guards on `document`).
 */
export function downloadIcs(event: WeddingEvent): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
