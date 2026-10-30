import type { PropertyListing } from "./catalogTypes";

export type PropertyUnit = {
  name: string;
  sqm: string;
  guests: string;
  features: string;
  tourUrl?: string;
  imageSrc?: string;
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

export type PropertyPoiPlace = {
  name: string;
  /** Vacío = tarjeta sin foto. */
  imageSrc: string;
};

export type PropertyDetailExtra = {
  subtitle: string;
  tags: string[];
  pdfHref: string;
  pdfLabel?: string;
  galleryImages: string[];
  about: string;
  poi: PropertyNearbyPoi;
  units: PropertyUnit[];
  groupsHeadline: string;
  groupsDescription: string;
  groupsCtaLabel: string;
  groupsCtaHref: string;
  stats: PropertyStat[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalCtaHref: string;
  relatedSlugs: string[];
  /** Lugares con foto opcional (de las líneas «Nombre | url»). */
  poiPlaces: PropertyPoiPlace[];
  bannerImage: string;
  bannerTitle: string;
  bannerPills: string[];
  introText: string;
  introCtaLabel: string;
  aboutTitle: string;
  highlightTitle: string;
  highlightText: string;
  restaurantsTitle: string;
  unitsIntro: string;
  amenitiesIntro: string;
  finalCtaLabel: string;
  restaurants: string[];
  /** Nombres tal como se muestran (el ícono se elige por palabra clave). */
  amenities: string[];
};

export type PropertyDetail = PropertyListing & PropertyDetailExtra;
