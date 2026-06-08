export type UnitImage = {
  src: string;
  alt: string;
  caption: string;
};

export type Unit621William = {
  id: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  basePricePerBed: number;
  accent: "blue" | "brass" | "green";
  floorPlan: UnitImage;
  renderings: UnitImage[];
};

export const williamStreetAddress = "615.5 / 621 E. William St, Ann Arbor, MI 48104";

export const units621William: Unit621William[] = [
  {
    id: "level-2-west",
    name: "Level 2 West",
    address: "615.5 E. William St.",
    bedrooms: 5,
    bathrooms: 3,
    squareFootage: 1534,
    basePricePerBed: 1150,
    accent: "blue",
    floorPlan: {
      src: "/images/621-william/arch-plan-level2west.jpg",
      alt: "Level 2 West architectural floor plan",
      caption: "Architect floor plan · Level 2 West",
    },
    renderings: [
      {
        src: "/images/621-william/render-3d-level2west.jpg",
        alt: "3D rendered floor plan overview for Level 2 West, 5 bedroom 3 bathroom",
        caption: "3D floor plan · Level 2 West",
      },
      {
        src: "/images/621-william/render-living-hallway.jpg",
        alt: "Living room and hallway rendering for Level 2 West",
        caption: "Living room & hallway",
      },
    ],
  },
  {
    id: "level-2-east",
    name: "Level 2 East",
    address: "621 E. William St.",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 987,
    basePricePerBed: 1550,
    accent: "brass",
    floorPlan: {
      src: "/images/621-william/arch-plan-level2east.jpg",
      alt: "Level 2 East architectural floor plan",
      caption: "Architect floor plan · Level 2 East",
    },
    renderings: [
      {
        src: "/images/621-william/render-3d-level2east.jpg",
        alt: "3D rendered floor plan overview for Level 2 East, 3 bedroom 2 bathroom",
        caption: "3D floor plan · Level 2 East",
      },
      {
        src: "/images/621-william/render-kitchen-island.jpg",
        alt: "Kitchen island and living area rendering for Level 2 East",
        caption: "Kitchen island & living area",
      },
      {
        src: "/images/621-william/render-bedroom-study.jpg",
        alt: "Bedroom and study nook rendering",
        caption: "Bedroom & study nook",
      },
    ],
  },
  {
    id: "level-3-east",
    name: "Level 3 East",
    address: "621 E. William St.",
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1042,
    basePricePerBed: 1850,
    accent: "green",
    floorPlan: {
      src: "/images/621-william/arch-plan-level3east.jpg",
      alt: "Level 3 East architectural floor plan",
      caption: "Architect floor plan · Level 3 East",
    },
    renderings: [
      {
        src: "/images/621-william/render-3d-level3east.jpg",
        alt: "3D rendered floor plan overview for Level 3 East, 2 bedroom 2 bathroom",
        caption: "3D floor plan · Level 3 East",
      },
      {
        src: "/images/621-william/render-vaulted-living.jpg",
        alt: "Vaulted-ceiling living and kitchen rendering for Level 3 East",
        caption: "Vaulted living & kitchen",
      },
    ],
  },
];
