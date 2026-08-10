import type { SiteLanguage } from "@/lib/i18n";
import { DEFAULT_SITE_LANGUAGE } from "@/lib/i18n";
import type { PropertyListing } from "./catalogTypes";
import {
  DEFAULT_PROPERTY_STATS,
  DEFAULT_PROPERTY_STATS_EN,
} from "./catalogTypes";
import {
  buildGnahsBookingUrl,
  defaultCheckinCheckout,
} from "@/lib/gnahs/buildBookingUrl";
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

export const DEFAULT_PROPERTY_UNITS_EN: PropertyUnit[] = [
  {
    name: "Studio",
    sqm: "28–32 m²",
    guests: "Up to 2 guests",
    features: "Equipped kitchen · Balcony · WiFi",
  },
  {
    name: "Two Bedroom",
    sqm: "42–48 m²",
    guests: "Up to 3 guests",
    features: "Living dining · Bedroom · Laundry",
  },
  {
    name: "Two Bed. Luxury",
    sqm: "55–60 m²",
    guests: "Up to 4 guests",
    features: "City view · Premium amenities",
  },
  {
    name: "Three Bedroom",
    sqm: "68–75 m²",
    guests: "Up to 5 guests",
    features: "Ideal for families · Two bathrooms",
  },
];

export const DEFAULT_POI_SECTION_TITLE = "Puntos de interés cercanos";
export const DEFAULT_POI_SECTION_TITLE_EN = "Nearby points of interest";

export const DEFAULT_POI_BA = [
  "Transporte público",
  "Gastronomía",
  "Comercios",
  "Espacios verdes",
  "Zona corporativa",
];

export const DEFAULT_POI_BA_EN = [
  "Public transport",
  "Dining",
  "Shops",
  "Green spaces",
  "Business district",
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

function defaultGroupsCopy(
  listing: PropertyListing,
  language: SiteLanguage,
): {
  groupsHeadline: string;
  groupsDescription: string;
} {
  const shortName = propertyShortName(listing.name);
  if (language === "en") {
    return {
      groupsHeadline: `Groups and corporate stays at ${shortName}`,
      groupsDescription: `${shortName} is part of the Top Rentals portfolio with capacity to host large groups in the same building—corporate or leisure—with a smooth, coordinated experience.`,
    };
  }
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
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): PropertyDetailExtra {
  const location = listing.neighborhood || listing.city;
  const { checkin, checkout } = defaultCheckinCheckout();
  const bookingHref =
    listing.gnahsId > 0
      ? buildGnahsBookingUrl({
          checkin,
          checkout,
          adults: 2,
          establishmentId: listing.gnahsId,
        })
      : "/reservas";

  const isEn = language === "en";

  return {
    subtitle: isEn
      ? `Hotel-serviced apartments in ${location}, ${listing.city}.`
      : `Departamentos con servicio de hotel en ${location}, ${listing.city}.`,
    tags: [
      listing.neighborhood,
      listing.city,
      isEn ? "Hotel service" : "Servicio de hotel",
    ].filter(Boolean),
    pdfHref: "#",
    pdfLabel: isEn ? "Download tower PDF" : "Descargar PDF torre",
    galleryImages: resolvePropertyGalleryImages(
      listing.imageSrc,
      listing.detail?.galleryImages,
    ),
    about: isEn
      ? `${listing.name} is part of the Top Rentals network in ${listing.city}. Fully equipped apartments, 24/7 service, and the flexibility of a short-term rental with hotel standards.${listing.address ? ` Location: ${listing.address}.` : ""}`
      : `${listing.name} forma parte de la red Top Rentals en ${listing.city}. Departamentos totalmente equipados, atención 24 hs y la flexibilidad de un alquiler temporario con estándares de hotel.${listing.address ? ` Ubicación: ${listing.address}.` : ""}`,
    poi: {
      sectionTitle: isEn
        ? DEFAULT_POI_SECTION_TITLE_EN
        : DEFAULT_POI_SECTION_TITLE,
      columns: buildPoiColumns(isEn ? DEFAULT_POI_BA_EN : DEFAULT_POI_BA),
    },
    units: isEn ? DEFAULT_PROPERTY_UNITS_EN : DEFAULT_PROPERTY_UNITS,
    ...defaultGroupsCopy(listing, language),
    groupsCtaLabel: isEn ? "Inquire for groups" : "Consultar grupos",
    groupsCtaHref: "/corporate",
    stats: isEn
      ? [...DEFAULT_PROPERTY_STATS_EN]
      : [...DEFAULT_PROPERTY_STATS],
    finalCtaTitle: isEn
      ? `Book ${listing.name} with Top Rentals.`
      : `Reservá en ${listing.name} con Top Rentals.`,
    finalCtaSubtitle: isEn
      ? "Contact us and we’ll help you find the ideal apartment."
      : "Contactanos y te ayudamos a encontrar el departamento ideal.",
    finalCtaHref: bookingHref,
    relatedSlugs: pickRelatedSlugs(allListings, listing),
  };
}
