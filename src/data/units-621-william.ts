export type UnitImage = {
  src: string;
  alt: string;
  caption: string;
};

export type RoomPrice = {
  label: string;
  price: number;
};

export type Unit621William = {
  id: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  basePricePerBed: number;
  pricePerUnit?: number;
  roomPricing?: RoomPrice[];
  accent: "blue" | "brass" | "green";
  floorPlan: UnitImage;
  renderings: UnitImage[];
};

export const williamStreetAddress = "615.5 / 621 E. William St, Ann Arbor, MI 48104";

export const units621William: Unit621William[] = [
  {
    id: "level-2-west",
    name: "Floor 2 Unit 1",
    address: "615.5 E. William St.",
    bedrooms: 5,
    bathrooms: 3,
    squareFootage: 1534,
    basePricePerBed: 1667, // entire-unit rent ÷ 5 beds, same rule as the other units
    pricePerUnit: 8333,
    roomPricing: [
      { label: "Room 226 (157 sq ft)", price: 1994 },
      { label: "Room 225 (144 sq ft)", price: 1829 },
      { label: "Room 224 (142 sq ft)", price: 1804 },
      { label: "Room 223 (107 sq ft)", price: 1359 },
      { label: "Room 222 (106 sq ft)", price: 1347 },
    ],
    accent: "blue",
    floorPlan: {
      src: "/images/621-william/arch-plan-level2west.jpg",
      alt: "Floor 2 Unit 1 architectural floor plan",
      caption: "Architect floor plan · Floor 2 Unit 1",
    },
    renderings: [
      {
        src: "/images/621-william/render-3d-level2west.jpg",
        alt: "3D rendered floor plan overview for Floor 2 Unit 1, 5 bedroom 3 bathroom",
        caption: "3D floor plan · Floor 2 Unit 1",
      },
      {
        src: "/images/621-william/render-vaulted-kitchen-level2west.jpg",
        alt: "Vaulted kitchen and living area rendering for Floor 2 Unit 1",
        caption: "Vaulted kitchen & living",
      },
      {
        src: "/images/621-william/rooms-level2west-v2.jpg",
        alt: "Floor 2 Unit 1 bedrooms and bathrooms — 5 bed 3 bath",
        caption: "Bedrooms & bathrooms",
      },
    ],
  },
  {
    id: "level-2-east",
    name: "Floor 2 Unit 2",
    address: "621 E. William St.",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 987,
    basePricePerBed: 1750,
    pricePerUnit: 5250,
    roomPricing: [
      { label: "Room 201 (114 sq ft)", price: 1847 },
      { label: "Room 202 (112 sq ft)", price: 1816 },
      { label: "Room 203 (98 sq ft)", price: 1587 },
    ],
    accent: "brass",
    floorPlan: {
      src: "/images/621-william/arch-plan-level2east.jpg",
      alt: "Floor 2 Unit 2 architectural floor plan",
      caption: "Architect floor plan · Floor 2 Unit 2",
    },
    renderings: [
      {
        src: "/images/621-william/render-3d-level2east.jpg",
        alt: "3D rendered floor plan overview for Floor 2 Unit 2, 3 bedroom 2 bathroom",
        caption: "3D floor plan · Floor 2 Unit 2",
      },
      {
        src: "/images/621-william/render-living-level2east.jpg",
        alt: "Living room and kitchen rendering for Floor 2 Unit 2",
        caption: "Living room & kitchen",
      },
      {
        src: "/images/621-william/render-bedroom-study.jpg",
        alt: "Bedroom and study nook rendering",
        caption: "Bedroom & study nook",
      },
      {
        src: "/images/621-william/rooms-level2east.jpg",
        alt: "Floor 2 Unit 2 bedrooms and bathrooms — 3 bed 2 bath",
        caption: "Bedrooms & bathrooms",
      },
    ],
  },
  {
    id: "level-3-east",
    name: "Floor 3 Unit 3",
    address: "621 E. William St.",
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1042,
    basePricePerBed: 2500,
    pricePerUnit: 5000,
    roomPricing: [
      { label: "Room 301 (141 sq ft, master bed + master bath)", price: 2750 },
      { label: "Room 302 (129 sq ft, second bed + bathroom)", price: 2250 },
    ],
    accent: "green",
    floorPlan: {
      src: "/images/621-william/arch-plan-level3east.jpg",
      alt: "Floor 3 Unit 3 architectural floor plan",
      caption: "Architect floor plan · Floor 3 Unit 3",
    },
    renderings: [
      {
        src: "/images/621-william/render-3d-level3east.jpg",
        alt: "3D rendered floor plan overview for Floor 3 Unit 3, 2 bedroom 2 bathroom",
        caption: "3D floor plan · Floor 3 Unit 3",
      },
      {
        src: "/images/621-william/render-living-kitchen-level3east.jpg",
        alt: "Living room and kitchen rendering for Floor 3 Unit 3",
        caption: "Living room & kitchen",
      },
      {
        src: "/images/621-william/render-bedroom-level3east.jpg",
        alt: "Bedroom rendering for Floor 3 Unit 3",
        caption: "Bedroom",
      },
      {
        src: "/images/621-william/rooms-level3east.jpg",
        alt: "Floor 3 Unit 3 bedrooms and bathrooms — 2 bed 2 bath",
        caption: "Bedrooms & bathrooms",
      },
    ],
  },
];
