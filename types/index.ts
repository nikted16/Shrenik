/** A single chapter/beat in the couple's story timeline. */
export interface Chapter {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

/** A member of the extended families being introduced on the site. */
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  side: "groom" | "bride";
  image: string;
}

/**
 * A single milestone on the wedding timeline (haldi, mehndi, wedding,
 * wedding). Lighter than a full WeddingEvent — just what the timeline shows.
 */
export interface Milestone {
  id: string;
  name: string;
  date: string;
  /** Optional part-of-day label (e.g. "Morning"), shown after the date when
   * two milestones fall on the same day. */
  timeOfDay?: string;
  /** Lucide icon key rendered in the timeline node — see Timeline.tsx. */
  icon: "sun" | "flower" | "heart" | "sparkles";
  /** Per-event illustration shown alongside the milestone's card. */
  image: string;
  description: string;
}

/** A single event on the wedding schedule (mehndi, sangeet, wedding, etc). */
export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  venueName: string;
  address: string;
  mapUrl: string;
  description: string;
}

/** A single photo/video entry in the gallery grid. */
export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** A single RSVP form submission. */
export interface Rsvp {
  name: string;
  email: string;
  phone?: string;
  attending: "yes" | "no";
  guestCount: number;
  events: string[];
  dietaryRestrictions?: string;
  message?: string;
}
