import {
  getPropertyBySlug,
  PROPERTY_LISTINGS,
  type PropertyListing,
} from "./catalog";

export type PropertyUnit = {
  name: string;
  sqm: string;
  guests: string;
  features: string;
};

export type PropertyStat = {
  value: string;
  label: string;
};

export type PropertyDetailExtra = {
  subtitle: string;
  tags: string[];
  pdfHref: string;
  pdfLabel?: string;
  about: string;
  poi: string[];
  units: PropertyUnit[];
  groupsHeadline: string;
  groupsCtaLabel: string;
  groupsCtaHref: string;
  stats: PropertyStat[];
  finalCtaTitle: string;
  finalCtaHref: string;
  relatedSlugs: string[];
};

export type PropertyDetail = PropertyListing & PropertyDetailExtra;

/** Misma plantilla para todas las fichas; solo cambia el contenido por edificio. */
const DEFAULT_UNITS: PropertyUnit[] = [
  {
    name: "Studio",
    sqm: "28–32 m²",
    guests: "Hasta 2 huéspedes",
    features: "Cocina equipada · Balcón · WiFi",
  },
  {
    name: "Dos Ambientes",
    sqm: "42–48 m²",
    guests: "Hasta 3 huéspedes",
    features: "Living comedor · Dormitorio · Laundry",
  },
  {
    name: "Dos Amb. Luxury",
    sqm: "55–60 m²",
    guests: "Hasta 4 huéspedes",
    features: "Vista ciudad · Amenities premium",
  },
  {
    name: "Tres Ambientes",
    sqm: "68–75 m²",
    guests: "Hasta 5 huéspedes",
    features: "Ideal familias · Dos baños",
  },
];

const DEFAULT_POI_BA = [
  "Transporte público",
  "Gastronomía",
  "Comercios",
  "Espacios verdes",
  "Zona corporativa",
];

function pickRelatedSlugs(current: PropertyListing, count = 3): string[] {
  const sameCity = PROPERTY_LISTINGS.filter(
    (p) => !p.comingSoon && p.slug !== current.slug && p.city === current.city,
  );
  const otherCity = PROPERTY_LISTINGS.filter(
    (p) => !p.comingSoon && p.slug !== current.slug && p.city !== current.city,
  );
  return [...sameCity, ...otherCity].slice(0, count).map((p) => p.slug);
}

/** Contenido por defecto generado desde el listado (mismo diseño, textos distintos). */
export function buildDefaultDetail(listing: PropertyListing): PropertyDetailExtra {
  const location = listing.neighborhood || listing.city;
  return {
    subtitle: `Departamentos con servicio de hotel en ${location}, ${listing.city}.`,
    tags: [listing.neighborhood, listing.city, "Servicio de hotel"].filter(Boolean),
    pdfHref: "#",
    pdfLabel: "Descargar PDF torre",
    about: `${listing.name} forma parte de la red Top Rentals en ${listing.city}. Departamentos totalmente equipados, atención 24 hs y la flexibilidad de un alquiler temporario con estándares de hotel.${listing.address ? ` Ubicación: ${listing.address}.` : ""}`,
    poi: DEFAULT_POI_BA,
    units: DEFAULT_UNITS,
    groupsHeadline: "Grupos y estadías corporativas · Consultanos disponibilidad",
    groupsCtaLabel: "Consultar grupos",
    groupsCtaHref: "/corporate",
    stats: [
      { value: "—", label: "Unidades" },
      { value: "—", label: "Huéspedes" },
      { value: "—", label: "Pisos" },
      { value: String(DEFAULT_UNITS.length), label: "Tipologías" },
    ],
    finalCtaTitle: `Reservá en ${listing.name} con Top Rentals.`,
    finalCtaHref: "/reservas",
    relatedSlugs: pickRelatedSlugs(listing),
  };
}

/** Overrides opcionales por slug (textos reales cuando el cliente los pase). */
const PROPERTY_OVERRIDES: Partial<Record<string, Partial<PropertyDetailExtra>>> = {
  "downtown-torre-bellini": {
    subtitle:
      "Escala y confort en el corazón financiero de Buenos Aires.",
    tags: ["+270 Huéspedes", "45 Pisos", "Microcentro"],
    about:
      "Torre Bellini es el edificio insignia de Top Rentals en el microcentro porteño. Departamentos totalmente equipados con servicios de hotel, amenities de primer nivel y una ubicación estratégica para viajes de negocios y estadías prolongadas.",
    poi: [
      "Puerto Madero",
      "Plaza San Martín",
      "9 de Julio | Obelisco",
      "Teatro Colón",
      "Café Tortoni",
      "Retiro",
    ],
    units: [
      ...DEFAULT_UNITS,
      {
        name: "Dúplex Piso 45",
        sqm: "120 m²",
        guests: "Hasta 6 huéspedes",
        features: "Terraza · Vista 360° · Exclusivo",
      },
    ],
    groupsHeadline: "134 unidades · Grupos de más de 270 personas",
    stats: [
      { value: "134", label: "Unidades" },
      { value: "+270", label: "Huéspedes" },
      { value: "45", label: "Pisos" },
      { value: "5", label: "Tipologías" },
    ],
    finalCtaTitle: "El edificio insignia de Top Rentals en Buenos Aires.",
    relatedSlugs: ["huergo-475", "palermo-soho", "belgrano"],
  },
};

export function getPropertyDetail(slug: string): PropertyDetail | null {
  const listing = getPropertyBySlug(slug);
  if (!listing) return null;

  const base = buildDefaultDetail(listing);
  const override = PROPERTY_OVERRIDES[slug] ?? {};

  return {
    ...listing,
    ...base,
    ...override,
    tags: override.tags ?? base.tags,
    poi: override.poi ?? base.poi,
    units: override.units ?? base.units,
    stats: override.stats ?? base.stats,
    relatedSlugs: override.relatedSlugs ?? base.relatedSlugs,
  };
}

export function getRelatedProperties(slugs: string[], excludeSlug: string) {
  return slugs
    .map((s) => PROPERTY_LISTINGS.find((p) => p.slug === s && !p.comingSoon))
    .filter((p): p is PropertyListing => p != null && p.slug !== excludeSlug);
}
