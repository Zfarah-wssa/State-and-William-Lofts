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
  /** Reference rent for the closest comparable unit, used to compute "discount to comp" live. */
  compPricePerBed: number;
  compName: string;
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
    compPricePerBed: 1716,
    compName: "Vic Village 5A",
    accent: "blue",
    floorPlan: {
      src: "/images/621-william/floorplan-5bed-3bath.jpg",
      alt: "Level 2 West floor plan, 5 bedroom 3 bathroom layout",
      caption: "Level 2 West · 5 bed / 3 bath · 1,534 SF",
    },
    renderings: [
      {
        src: "/images/621-william/render-living-hallway.jpg",
        alt: "Living room and hallway rendering for Level 2 West",
        caption: "Living room & bedroom hall",
      },
      {
        src: "/images/621-william/render-bedroom-study.jpg",
        alt: "Bedroom and study nook rendering",
        caption: "Bedroom & study nook",
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
    compPricePerBed: 1845,
    compName: "Vic Village 3A",
    accent: "brass",
    floorPlan: {
      src: "/images/621-william/floorplan-3bed-2bath.jpg",
      alt: "Level 2 East floor plan, 3 bedroom 2 bathroom layout",
      caption: "Level 2 East · 3 bed / 2 bath · 987 SF",
    },
    renderings: [
      {
        src: "/images/621-william/render-kitchen-island.jpg",
        alt: "Kitchen island and living area rendering for Level 2 East",
        caption: "Kitchen island & living area",
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
    compPricePerBed: 2056,
    compName: "Vic Village S 2BR",
    accent: "green",
    floorPlan: {
      src: "/images/621-william/floorplan-2bed-2bath.jpg",
      alt: "Level 3 East floor plan, 2 bedroom 2 bathroom layout",
      caption: "Level 3 East · 2 bed / 2 bath · 1,042 SF",
    },
    renderings: [
      {
        src: "/images/621-william/render-vaulted-living.jpg",
        alt: "Vaulted-ceiling living and kitchen rendering for Level 3 East",
        caption: "Vaulted living & kitchen",
      },
    ],
  },
];
