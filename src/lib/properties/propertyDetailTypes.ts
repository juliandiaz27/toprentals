import type { PropertyListing } from "./catalogTypes";

export type PropertyUnit = {
  name: string;
  sqm: string;
  guests: string;
  features: string;
  tourUrl?: string;
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
};

export type PropertyDetail = PropertyListing & PropertyDetailExtra;
