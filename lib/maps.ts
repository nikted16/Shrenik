/**
 * Builds a Google Maps search URL for a free-text query (venue name + address).
 * Uses the documented Maps URL API so it works on desktop and deep-links into
 * the app on mobile.
 */
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
