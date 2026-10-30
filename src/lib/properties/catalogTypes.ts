/** Valor guardado en cada propiedad; opciones definidas en admin → Propiedades → Filtros. */
export type PropertyCity = string;

export type PropertyStatStored = {
  value: string;
  label: string;
};

export type PropertyUnitStored = {
  name: string;
  sqm: string;
  guests: string;
  features: string;
  /** Tour Matterport u otro 360° (botón «Tour 360°»). */
  tourUrl?: string;
  /** Foto de la unidad (franja bajo la tarjeta). */
  imageSrc?: string;
};

/** Textos de la ficha pública (/propiedades/[slug]). */
export type PropertyDetailStored = {
  subtitle?: string;
  about?: string;
  /** Una etiqueta por línea en el panel. */
  tags?: string[];
  /** Un punto de interés por línea. */
  poiLines?: string[];
  /** Franja negra: grupos corporativos. */
  groupsHeadline?: string;
  groupsDescription?: string;
  groupsCtaLabel?: string;
  groupsCtaHref?: string;
  /** Hasta 4 cifras (Unidades, Pisos, Huéspedes, Seguridad 24/7). */
  stats?: PropertyStatStored[];
  /** Tarjetas «Unidades». */
  units?: PropertyUnitStored[];
  /** Galería de la ficha (carrusel + laterales). URLs en orden. */
  galleryImages?: string[];
  /** Slugs para «Otras propiedades» (vacío = automático). */
  relatedSlugs?: string[];
  /** Foto de la franja con el nombre del edificio. */
  bannerImage?: string;
  /** Título de la franja (admite <em>cursiva</em>); vacío = nombre. */
  bannerTitle?: string;
  /** Etiquetas celestes de la franja; vacío = se arman con las cifras. */
  bannerPills?: string[];
  /** Título de la franja final (admite <em>cursiva</em>). */
  finalCtaTitle?: string;
  /** Título en Google (vacío = automático). */
  seoTitle?: string;
  /** Descripción en Google (vacío = automática). */
  seoDescription?: string;
  /** Frase de la franja bajo el título del edificio. */
  introText?: string;
  /** Botón de esa franja (si dice «grupo», lleva a grupos). */
  introCtaLabel?: string;
  /** Título de «Sobre el edificio» (admite <em>). */
  aboutTitle?: string;
  /** Banda oscura destacada (ej. vistas, piscina). */
  highlightTitle?: string;
  /** Texto chico de la banda destacada. */
  highlightText?: string;
  /** Título de restaurantes (ej. «Restaurantes a pasos»). */
  restaurantsTitle?: string;
  /** Línea bajo «Unidades disponibles»; vacío = resumen automático. */
  unitsIntro?: string;
  /** Línea bajo «Amenities & servicios». */
  amenitiesIntro?: string;
  /** Subtítulo de la franja final. */
  finalCtaSubtitle?: string;
  /** Botón de la franja final (sin flecha). */
  finalCtaLabel?: string;
  /** Restaurantes cercanos (uno por línea). */
  restaurants?: string[];
  /** IDs de amenities (ver lib/properties/amenities). */
  amenities?: string[];
};

export const DEFAULT_PROPERTY_STATS: PropertyStatStored[] = [
  { value: "—", label: "Unidades" },
  { value: "—", label: "Pisos" },
  { value: "—", label: "Huéspedes" },
  { value: "24/7", label: "Seguridad 24/7" },
];

export const DEFAULT_PROPERTY_STATS_EN: PropertyStatStored[] = [
  { value: "—", label: "Units" },
  { value: "—", label: "Floors" },
  { value: "—", label: "Guests" },
  { value: "24/7", label: "24/7 security" },
];

/** «Ideal para» — alimenta el filtro Disponibilidad y el botón «Grupos». */
export const PROPERTY_AUDIENCES = ["grupos", "solo", "familia"] as const;
export type PropertyAudience = (typeof PROPERTY_AUDIENCES)[number];

export function normalizeAudience(raw: unknown): PropertyAudience[] {
  if (!Array.isArray(raw)) return [];
  return PROPERTY_AUDIENCES.filter((a) => raw.includes(a));
}

export type PropertyListingStored = {
  slug: string;
  gnahsId: number;
  name: string;
  city: PropertyCity;
  neighborhood: string;
  address: string;
  imageSrc: string;
  comingSoon?: boolean;
  /** Si true, no se muestra en el sitio (sigue en el panel). */
  hidden?: boolean;
  /** Muestra sello «Oferta» en home, listado y ficha. */
  hasOffer?: boolean;
  /** Muestra sello «Más solicitada» en home, listado y ficha. */
  isPopular?: boolean;
  /** Para quién es ideal la propiedad (filtros del listado). */
  audience?: PropertyAudience[];
  /** Botón «Unidades exclusivas» del listado. */
  isExclusive?: boolean;
  /**
   * App ID del widget Elfsight Google Reviews (uno por torre).
   * En admin se puede pegar el snippet completo; se guarda solo el ID.
   */
  elfsightReviewsAppId?: string;
  detail?: PropertyDetailStored;
};

export type PropertyListing = PropertyListingStored;

export type PropertiesCatalogFile = {
  featuredSlugs: string[];
  listings: PropertyListingStored[];
};

/** Overlay inglés: solo campos de texto que difieren del español, keyed por slug. */
export type PropertiesCatalogEnOverlay = {
  properties: Array<Partial<PropertyListingStored> & { slug: string }>;
};
