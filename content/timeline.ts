import type { Milestone } from "@/types";

/**
 * The wedding timeline milestones, in chronological order. Kept intentionally
 * short for now — haldi, mehndi, the wedding, and the reception — and rendered as
 * a center-line vertical timeline in the Timeline section.
 */
export const timeline: Milestone[] = [
  {
    id: "haldi",
    name: "Haldi",
    date: "2026-11-23",
    timeOfDay: "Morning",
    icon: "sun",
    image: "/assets/images/timeline/haldi.png",
    description:
      "A joyful morning ritual, blessing the couple with turmeric for a radiant start.",
  },
  {
    id: "mehndi",
    name: "Mehndi",
    date: "2026-11-23",
    timeOfDay: "Evening",
    icon: "flower",
    image: "/assets/images/timeline/mehndi.png",
    description:
      "An evening of intricate henna, music, and marigold-strewn celebration.",
  },
  {
    id: "wedding",
    name: "Wedding",
    date: "2026-11-24",
    icon: "heart",
    image: "/assets/images/timeline/wedding.png",
    description:
      "The sacred rites uniting Nikhil and Shreya as husband and wife.",
  },
  {
    id: "reception",
    name: "Reception",
    date: "2026-11-27",
    icon: "sparkles",
    image: "/assets/images/timeline/reception.png",
    description:
      "An elegant evening to celebrate the newlyweds with family, friends, dinner, and dancing.",
  },
];
