import type { FamilyMember } from "@/types";

// Ordered for a two-row layout: mothers on top, then fathers and the bride's
// brother below. The Family section renders the first two as the top row and
// the remaining three as the bottom row.
export const family: FamilyMember[] = [
  {
    id: "groom-mother",
    name: "Rita Dubey",
    relation: "Mother of the Groom",
    side: "groom",
    image: "/assets/images/family-groom-mother.jpg",
  },
  {
    id: "bride-mother",
    name: "Santosh Tiwari",
    relation: "Mother of the Bride",
    side: "bride",
    image: "/assets/images/family-bride-mother.jpg",
  },
  {
    id: "groom-father",
    name: "Parmanand Dubey",
    relation: "Father of the Groom",
    side: "groom",
    image: "/assets/images/family-groom-father.jpg",
  },
  {
    id: "bride-father",
    name: "Naval Kishore Tiwari",
    relation: "Father of the Bride",
    side: "bride",
    image: "/assets/images/family-bride-father.jpg",
  },
  {
    id: "bride-sibling",
    name: "Shrey Tiwari",
    relation: "Brother of the Bride",
    side: "bride",
    image: "/assets/images/family-bride-sibling.jpg",
  },
];
