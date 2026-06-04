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
  groupsCtaLabel?: string;
  groupsCtaHref?: string;
  /** Hasta 4 cifras (Unidades, Huéspedes, etc.). */
  stats?: PropertyStatStored[];
  /** Tarjetas «Unidades». */
  units?: PropertyUnitStored[];
  /** Galería de la ficha (carrusel + laterales). URLs en orden. */
  galleryImages?: string[];
  /** Slugs para «Otras propiedades» (vacío = automático). */
  relatedSlugs?: string[];
};

export const DEFAULT_PROPERTY_STATS: PropertyStatStored[] = [
  { value: "—", label: "Unidades" },
  { value: "—", label: "Huéspedes" },
  { value: "—", label: "Pisos" },
  { value: "4", label: "Tipologías" },
];

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
  detail?: PropertyDetailStored;
};

export type PropertyListing = PropertyListingStored;

export type PropertiesCatalogFile = {
  featuredSlugs: string[];
  listings: PropertyListingStored[];
};
