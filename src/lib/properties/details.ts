import { loadPropertyListings } from "./catalog";
import type { PropertyListing } from "./catalog";
import type { PropertyDetailStored } from "./catalogTypes";
import { resolvePropertyGalleryImages } from "./gallery";

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

export type PropertyNearbyPoi = {
  sectionTitle: string;
  /** Cada columna: ítems de arriba a abajo (como en Figma). */
  columns: string[][];
};

export type PropertyDetailExtra = {
  subtitle: string;
  tags: string[];
  pdfHref: string;
  pdfLabel?: string;
  /** Galería de la ficha; vacío = solo imageSrc del listado. */
  galleryImages: string[];
  about: string;
  poi: PropertyNearbyPoi;
  units: PropertyUnit[];
  groupsHeadline: string;
  groupsCtaLabel: string;
  groupsCtaHref: string;
  stats: PropertyStat[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
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

const DEFAULT_POI_SECTION_TITLE = "Puntos de interés cercanos";

const DEFAULT_POI_BA = [
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

function normalizePoi(
  raw: PropertyNearbyPoi | string[] | undefined,
  fallbackItems: string[],
): PropertyNearbyPoi {
  if (raw && typeof raw === "object" && "columns" in raw && Array.isArray(raw.columns)) {
    return {
      sectionTitle: raw.sectionTitle ?? DEFAULT_POI_SECTION_TITLE,
      columns: raw.columns,
    };
  }
  const flat = Array.isArray(raw) ? raw : fallbackItems;
  return {
    sectionTitle: DEFAULT_POI_SECTION_TITLE,
    columns: buildPoiColumns(flat),
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
    galleryImages: resolvePropertyGalleryImages(listing.imageSrc, listing.detail?.galleryImages),
    about: `${listing.name} forma parte de la red Top Rentals en ${listing.city}. Departamentos totalmente equipados, atención 24 hs y la flexibilidad de un alquiler temporario con estándares de hotel.${listing.address ? ` Ubicación: ${listing.address}.` : ""}`,
    poi: {
      sectionTitle: DEFAULT_POI_SECTION_TITLE,
      columns: buildPoiColumns(DEFAULT_POI_BA),
    },
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
    finalCtaSubtitle:
      "Contactanos y te ayudamos a encontrar el departamento ideal.",
    finalCtaHref: "/reservas",
    relatedSlugs: pickRelatedSlugs(allListings, listing),
  };
}

function detailOverrideFromStored(
  stored: PropertyDetailStored | undefined,
): Partial<PropertyDetailExtra> {
  if (!stored) return {};

  const poiItems = (stored.poiLines ?? []).map((line) => line.trim()).filter(Boolean);
  const poi =
    poiItems.length > 0
      ? {
          sectionTitle: DEFAULT_POI_SECTION_TITLE,
          columns: buildPoiColumns(poiItems),
        }
      : undefined;

  const stats =
    stored.stats && stored.stats.length > 0
      ? stored.stats
          .filter((s) => s.label.trim())
          .map((s) => ({
            value: s.value.trim() || "—",
            label: s.label.trim(),
          }))
      : undefined;

  const units =
    stored.units && stored.units.length > 0
      ? stored.units
          .filter((u) => u.name.trim())
          .map((u) => ({
            name: u.name.trim(),
            sqm: u.sqm.trim(),
            guests: u.guests.trim(),
            features: u.features.trim(),
          }))
      : undefined;

  const galleryImages =
    stored.galleryImages && stored.galleryImages.length > 0
      ? stored.galleryImages.map((s) => s.trim()).filter(Boolean)
      : undefined;

  return {
    ...(stored.subtitle ? { subtitle: stored.subtitle } : {}),
    ...(galleryImages ? { galleryImages } : {}),
    ...(stored.about ? { about: stored.about } : {}),
    ...(stored.tags?.length ? { tags: stored.tags } : {}),
    ...(poi ? { poi } : {}),
    ...(stored.groupsHeadline ? { groupsHeadline: stored.groupsHeadline } : {}),
    ...(stored.groupsCtaLabel ? { groupsCtaLabel: stored.groupsCtaLabel } : {}),
    ...(stored.groupsCtaHref ? { groupsCtaHref: stored.groupsCtaHref } : {}),
    ...(stats ? { stats } : {}),
    ...(units ? { units } : {}),
    ...(stored.relatedSlugs?.length ? { relatedSlugs: stored.relatedSlugs } : {}),
  };
}

export async function getPropertyDetail(slug: string): Promise<PropertyDetail | null> {
  const listings = await loadPropertyListings({ includeHidden: true });
  const listing = listings.find(
    (p) => p.slug === slug && !p.comingSoon && !p.hidden,
  );
  if (!listing) return null;

  const base = buildDefaultDetail(listing, listings.filter((p) => !p.hidden));
  const override = detailOverrideFromStored(listing.detail);

  const galleryImages = resolvePropertyGalleryImages(
    listing.imageSrc,
    override.galleryImages ?? listing.detail?.galleryImages,
  );

  return {
    ...listing,
    ...base,
    ...override,
    galleryImages,
    tags: override.tags ?? base.tags,
    poi: override.poi ?? base.poi,
    units: override.units ?? base.units,
    stats: override.stats ?? base.stats,
    groupsHeadline: override.groupsHeadline ?? base.groupsHeadline,
    groupsCtaLabel: override.groupsCtaLabel ?? base.groupsCtaLabel,
    groupsCtaHref: override.groupsCtaHref ?? base.groupsCtaHref,
    relatedSlugs: override.relatedSlugs ?? base.relatedSlugs,
  };
}

export function getRelatedProperties(
  listings: PropertyListing[],
  slugs: string[],
  excludeSlug: string,
) {
  return slugs
    .map((s) => listings.find((p) => p.slug === s && !p.comingSoon))
    .filter((p): p is PropertyListing => p != null && p.slug !== excludeSlug);
}
