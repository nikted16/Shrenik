export const couple = {
  groom: {
    name: "Nikhil",
    fullName: "Nikhil Dubey",
    image: "/assets/images/groom.png",
  },
  bride: {
    name: "Shreya",
    fullName: "Shreya Tiwari",
    image: "/assets/images/bride.png",
  },
  weddingDate: "2026-11-24",
  /** Hindi date + venue line shown beneath the names in the hero. */
  weddingDateHindi: "२४ नवम्बर २०२६ • प्रयागराज",
  tagline: "Two families, one story, forever.",
  /**
   * The opening blessing couplet, shown beneath the names in the hero and
   * typed out line by line. One entry per display line.
   */
  blessing: [
    "ईश्वर की कृपा, अपनों का आशीर्वाद,",
    "और प्रेम से सजी हमारी नई शुरुआत।",
  ] as const,
  /**
   * Bride-first display order (tradition: the bride's name leads). This is
   * the single source of truth for name order across the site — components
   * should read `couple.displayOrder` rather than hardcoding
   * `couple.groom`/`couple.bride` in a particular sequence, so the order
   * only ever needs to change in one place.
   */
  displayOrder: ["bride", "groom"] as const,
} as const;
