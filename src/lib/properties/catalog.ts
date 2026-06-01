/** Listado público — ids alineados con GNAHS (`src/lib/gnahs/hotels.ts`). */
export type PropertyCity = "Buenos Aires" | "Quito";

export type PropertyListing = {
  slug: string;
  gnahsId: number;
  name: string;
  city: PropertyCity;
  neighborhood: string;
  address: string;
  imageSrc: string;
  comingSoon?: boolean;
};

/** Placeholders hasta recibir fotos oficiales por edificio. */
export const PROPERTY_PLACEHOLDER_IMAGES = [
  "/images/properties/placeholder-lobby.png",
  "/images/properties/placeholder-facade.png",
  "/images/properties/placeholder-building.png",
] as const;

export function propertyPlaceholderImage(index: number): string {
  return PROPERTY_PLACEHOLDER_IMAGES[
    index % PROPERTY_PLACEHOLDER_IMAGES.length
  ]!;
}

const LISTINGS_BASE: Omit<PropertyListing, "imageSrc">[] = [
  {
    slug: "downtown-torre-bellini",
    gnahsId: 10,
    name: "Downtown — Torre Bellini",
    city: "Buenos Aires",
    neighborhood: "Microcentro",
    address: "Av. Corrientes 1234",
  },
  {
    slug: "huergo-475",
    gnahsId: 8,
    name: "Huergo 475",
    city: "Buenos Aires",
    neighborhood: "San Telmo",
    address: "Huergo 475",
  },
  {
    slug: "palermo-soho",
    gnahsId: 3,
    name: "Palermo Soho",
    city: "Buenos Aires",
    neighborhood: "Palermo",
    address: "Honduras 4567",
  },
  {
    slug: "dorrego",
    gnahsId: 1,
    name: "Top Rentals Dorrego",
    city: "Buenos Aires",
    neighborhood: "Palermo",
    address: "Dorrego 2345",
  },
  {
    slug: "wow-nunez",
    gnahsId: 2,
    name: "WOW Nuñez",
    city: "Buenos Aires",
    neighborhood: "Nuñez",
    address: "Av. del Libertador 7200",
  },
  {
    slug: "qorner",
    gnahsId: 4,
    name: "Qorner",
    city: "Buenos Aires",
    neighborhood: "Palermo",
    address: "Costa Rica 5545",
  },
  {
    slug: "montaneses",
    gnahsId: 5,
    name: "Montañeses",
    city: "Buenos Aires",
    neighborhood: "Belgrano",
    address: "Montañeses 3456",
  },
  {
    slug: "palermo-chico",
    gnahsId: 6,
    name: "Palermo Chico",
    city: "Buenos Aires",
    neighborhood: "Palermo Chico",
    address: "Av. Libertador 4500",
  },
  {
    slug: "palermo-hollywood",
    gnahsId: 7,
    name: "Palermo Hollywood",
    city: "Buenos Aires",
    neighborhood: "Palermo Hollywood",
    address: "El Salvador 5678",
  },
  {
    slug: "belgrano",
    gnahsId: 9,
    name: "Belgrano",
    city: "Buenos Aires",
    neighborhood: "Belgrano",
    address: "Cabildo 2100",
  },
  {
    slug: "torre-nunez",
    gnahsId: 11,
    name: "Torre Nuñez",
    city: "Buenos Aires",
    neighborhood: "Nuñez",
    address: "Av. del Libertador 6800",
  },
  {
    slug: "ecuador-proximamente",
    gnahsId: 0,
    name: "Próximamente: Más propiedades en Ecuador",
    city: "Quito",
    neighborhood: "",
    address: "",
    comingSoon: true,
  },
];

export const PROPERTY_LISTINGS: PropertyListing[] = LISTINGS_BASE.map(
  (item, index) => ({
    ...item,
    imageSrc: item.comingSoon
      ? ""
      : propertyPlaceholderImage(index),
  }),
);

export function getPropertyBySlug(slug: string): PropertyListing | undefined {
  return PROPERTY_LISTINGS.find((p) => p.slug === slug && !p.comingSoon);
}
