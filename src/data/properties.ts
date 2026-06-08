export type Landmark = {
  name: string;
  distance: string;
};

export type Property = {
  id: string;
  title: string;
  address: string;
  neighborhood: string;
  landmarks: Landmark[];
  pricePerBed: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  availability: string;
  image: string;
  blurb: string;
};

export const properties: Property[] = [
  {
    id: "state-house-on-state",
    title: "The State House on State",
    address: "611 State St, Ann Arbor, MI 48104",
    neighborhood: "Central Campus",
    landmarks: [
      { name: "The Diag", distance: "0.2 mi · 4 min walk" },
      { name: "Ross School of Business", distance: "0.5 mi · 9 min walk" },
      { name: "Central Campus Transit Center", distance: "0.4 mi · 7 min walk" },
    ],
    pricePerBed: 1095,
    bedrooms: 4,
    bathrooms: 2,
    amenities: ["In-unit laundry", "Fully furnished", "Central A/C", "Rooftop lounge"],
    availability: "Fall 2026 Lease",
    image: "/images/properties/state-house-on-state.svg",
    blurb: "A landmark brick mid-rise reimagined with designer interiors, blocks from the Diag.",
  },
  {
    id: "william-street-lofts",
    title: "William Street Lofts",
    address: "320 W William St, Ann Arbor, MI 48103",
    neighborhood: "Old West Side / Downtown",
    landmarks: [
      { name: "Michigan Union", distance: "0.6 mi · 11 min walk" },
      { name: "Central Campus Transit Center", distance: "0.5 mi · 10 min walk" },
      { name: "Liberty St Shops & Dining", distance: "0.3 mi · 6 min walk" },
    ],
    pricePerBed: 1175,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["In-unit laundry", "Parking included", "Fully furnished", "Central A/C"],
    availability: "Fall 2026 Lease",
    image: "/images/properties/william-street-lofts.svg",
    blurb: "Industrial-chic loft conversions with exposed beams and oversized windows.",
  },
  {
    id: "maizeline-residences",
    title: "Maizeline Residences",
    address: "215 S Forest Ave, Ann Arbor, MI 48104",
    neighborhood: "South Campus",
    landmarks: [
      { name: "Ross School of Business", distance: "0.3 mi · 6 min walk" },
      { name: "Crisler Center", distance: "0.7 mi · 13 min walk" },
      { name: "The Diag", distance: "0.6 mi · 12 min walk" },
    ],
    pricePerBed: 985,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Fitness center", "Study lounge", "Central A/C", "Pet friendly"],
    availability: "Fall 2026 Lease",
    image: "/images/properties/maizeline-residences.svg",
    blurb: "Bright, contemporary residences with shared amenity spaces built for student life.",
  },
  {
    id: "the-arbor-collective",
    title: "The Arbor Collective",
    address: "734 Packard St, Ann Arbor, MI 48104",
    neighborhood: "Burns Park / South University",
    landmarks: [
      { name: "South University Ave Shops", distance: "0.2 mi · 4 min walk" },
      { name: "The Diag", distance: "0.5 mi · 10 min walk" },
      { name: "Central Campus Transit Center", distance: "0.6 mi · 12 min walk" },
    ],
    pricePerBed: 1050,
    bedrooms: 5,
    bathrooms: 3,
    amenities: ["In-unit laundry", "Parking available", "Fully furnished", "Private balconies"],
    availability: "Fall 2026 Lease",
    image: "/images/properties/the-arbor-collective.svg",
    blurb: "Spacious group housing in a converted craftsman row, perfect for upperclassmen.",
  },
  {
    id: "north-quad-flats",
    title: "North Quad Flats",
    address: "1101 N University Ave, Ann Arbor, MI 48104",
    neighborhood: "North Campus Gateway",
    landmarks: [
      { name: "Central Campus Transit Center", distance: "0.3 mi · 6 min walk" },
      { name: "The Diag", distance: "0.7 mi · 14 min walk" },
      { name: "Ross School of Business", distance: "0.8 mi · 15 min walk" },
    ],
    pricePerBed: 925,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["In-unit laundry", "Central A/C", "Bike storage", "Fully furnished"],
    availability: "Fall 2026 Lease",
    image: "/images/properties/north-quad-flats.svg",
    blurb: "Smartly designed flats with quick transit access to every corner of campus.",
  },
  {
    id: "huron-row-townhomes",
    title: "Huron Row Townhomes",
    address: "812 Huron St, Ann Arbor, MI 48104",
    neighborhood: "Kerrytown",
    landmarks: [
      { name: "Kerrytown Market & Shops", distance: "0.2 mi · 3 min walk" },
      { name: "The Diag", distance: "0.6 mi · 11 min walk" },
      { name: "Central Campus Transit Center", distance: "0.5 mi · 9 min walk" },
    ],
    pricePerBed: 1225,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ["Parking included", "Fully furnished", "Central A/C", "In-unit laundry", "Private patio"],
    availability: "Fall 2026 Lease",
    image: "/images/properties/huron-row-townhomes.svg",
    blurb: "Multi-level townhomes near Kerrytown's cafes, markets, and morning energy.",
  },
];
