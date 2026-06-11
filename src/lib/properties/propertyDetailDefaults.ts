import type { PropertyListing } from "./catalogTypes";
import { resolvePropertyGalleryImages } from "./gallery";
import type { PropertyDetailExtra, PropertyUnit } from "./propertyDetailTypes";

/** Misma plantilla para todas las fichas; solo cambia el contenido por edificio. */
export const DEFAULT_PROPERTY_UNITS: PropertyUnit[] = [
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

export const DEFAULT_POI_SECTION_TITLE = "Puntos de interés cercanos";

export const DEFAULT_POI_BA = [
  "Transporte público",
  "Gastronomía",
  "Comercios",
  "Espacios verdes",
  "Zona corporativa",
];

/** Reparte ítems en columnas (fila a fila, como el wireframe 4×2). */
export function buildPoiColumns(items: string[], columnCount = 4): string[][] {
  if (!items.length) return [];
  const rows = Math.ceil(items.length / columnCount);
  const columns: string[][] = [];
  for (let c = 0; c < columnCount; c++) {
    const col: string[] = [];
    for (let r = 0; r < rows; r++) {
      const item = items[r * columnCount + c];
      if (item) col.push(item);
    }
    if (col.length) columns.push(col);
  }
  return columns;
}

function propertyShortName(name: string): string {
  return name.replace(/^Top Rentals\s*/i, "").trim() || name;
}

function defaultGroupsCopy(listing: PropertyListing): {
  groupsHeadline: string;
  groupsDescription: string;
} {
  const shortName = propertyShortName(listing.name);
  return {
    groupsHeadline: `Grupos y estadías corporativas en ${shortName}`,
    groupsDescription: `${shortName} forma parte del portfolio de Top Rentals con capacidad para alojar grandes grupos en un mismo edificio, ya sean corporativos o turísticos, con una experiencia ágil y coordinada.`,
  };
}

function pickRelatedSlugs(
  listings: PropertyListing[],
  current: PropertyListing,
  count = 3,
): string[] {
  const sameCity = listings.filter(
    (p) => !p.comingSoon && p.slug !== current.slug && p.city === current.city,
  );
  const otherCity = listings.filter(
    (p) => !p.comingSoon && p.slug !== current.slug && p.city !== current.city,
  );
  return [...sameCity, ...otherCity].slice(0, count).map((p) => p.slug);
}

/** Contenido por defecto generado desde el listado (mismo diseño, textos distintos). */
export function buildDefaultDetail(
  listing: PropertyListing,
  allListings: PropertyListing[],
): PropertyDetailExtra {
  const location = listing.neighborhood || listing.city;
  return {
    subtitle: `Departamentos con servicio de hotel en ${location}, ${listing.city}.`,
    tags: [listing.neighborhood, listing.city, "Servicio de hotel"].filter(Boolean),
    pdfHref: "#",
    pdfLabel: "Descargar PDF torre",
    galleryImages: resolvePropertyGalleryImages(
      listing.imageSrc,
      listing.detail?.galleryImages,
    ),
    about: `${listing.name} forma parte de la red Top Rentals en ${listing.city}. Departamentos totalmente equipados, atención 24 hs y la flexibilidad de un alquiler temporario con estándares de hotel.${listing.address ? ` Ubicación: ${listing.address}.` : ""}`,
    poi: {
      sectionTitle: DEFAULT_POI_SECTION_TITLE,
      columns: buildPoiColumns(DEFAULT_POI_BA),
    },
    units: DEFAULT_PROPERTY_UNITS,
    ...defaultGroupsCopy(listing),
    groupsCtaLabel: "Consultar grupos",
    groupsCtaHref: "/corporate",
    stats: [
      { value: "—", label: "Unidades" },
      { value: "—", label: "Huéspedes" },
      { value: "—", label: "Pisos" },
      { value: String(DEFAULT_PROPERTY_UNITS.length), label: "Tipologías" },
    ],
    finalCtaTitle: `Reservá en ${listing.name} con Top Rentals.`,
    finalCtaSubtitle:
      "Contactanos y te ayudamos a encontrar el departamento ideal.",
    finalCtaHref: "/reservas",
    relatedSlugs: pickRelatedSlugs(allListings, listing),
  };
}
