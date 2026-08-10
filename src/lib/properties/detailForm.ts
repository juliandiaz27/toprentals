import type { SiteLanguage } from "@/lib/i18n";
import { DEFAULT_SITE_LANGUAGE } from "@/lib/i18n";
import type {
  PropertyDetailStored,
  PropertyListingStored,
  PropertyStatStored,
  PropertyUnitStored,
} from "./catalogTypes";
import {
  DEFAULT_PROPERTY_STATS,
  DEFAULT_PROPERTY_STATS_EN,
} from "./catalogTypes";
import { buildDefaultDetail } from "./propertyDetailDefaults";

export const DEFAULT_GROUPS = {
  groupsHeadline: "Grupos y estadías corporativas · Consultanos disponibilidad",
  groupsCtaLabel: "Consultar grupos",
  groupsCtaHref: "/corporate",
} as const;

export const DEFAULT_GROUPS_EN = {
  groupsHeadline: "Groups and corporate stays · Ask us about availability",
  groupsCtaLabel: "Inquire for groups",
  groupsCtaHref: "/corporate",
} as const;

export function emptyUnit(): PropertyUnitStored {
  return { name: "", sqm: "", guests: "", features: "", tourUrl: "" };
}

function defaultStatsForLanguage(language: SiteLanguage): PropertyStatStored[] {
  return language === "en"
    ? [...DEFAULT_PROPERTY_STATS_EN]
    : [...DEFAULT_PROPERTY_STATS];
}

/** Normaliza etiquetas conocidas ES/EN para alinear valores por índice. */
function statsLabelKey(label: string): string {
  const n = label.trim().toLowerCase();
  if (n === "unidades" || n === "units") return "units";
  if (n === "pisos" || n === "floors") return "floors";
  if (n === "huéspedes" || n === "huespedes" || n === "guests") return "guests";
  if (
    n === "seguridad 24/7" ||
    n === "24/7 security" ||
    n === "tipologías" ||
    n === "tipologias"
  ) {
    return "security";
  }
  return n;
}

export function ensureStats(
  stats?: PropertyStatStored[],
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): PropertyStatStored[] {
  const base = defaultStatsForLanguage(language);
  if (!stats?.length) return base;

  const valueByKey = new Map<string, string>();
  for (const s of stats) {
    const label = s.label?.trim();
    const value = s.value?.trim();
    if (label) valueByKey.set(statsLabelKey(label), value || "—");
  }

  return base.map((def) => ({
    label: def.label,
    value: valueByKey.get(statsLabelKey(def.label)) ?? def.value,
  }));
}

function defaultDetailStored(
  listing: PropertyListingStored,
  allListings: PropertyListingStored[],
  language: SiteLanguage,
): PropertyDetailStored {
  const defaults = buildDefaultDetail(listing, allListings, language);
  return {
    subtitle: defaults.subtitle,
    about: defaults.about,
    tags: defaults.tags,
    poiLines: defaults.poi.columns.flat(),
    groupsHeadline: defaults.groupsHeadline,
    groupsDescription: defaults.groupsDescription,
    groupsCtaLabel: defaults.groupsCtaLabel,
    groupsCtaHref: defaults.groupsCtaHref,
    stats: defaults.stats,
    units: defaults.units,
    galleryImages: defaults.galleryImages,
    relatedSlugs: defaults.relatedSlugs,
  };
}

/** Misma base que la ficha pública: defaults del sitio + lo guardado en el catálogo. */
export function detailForAdminForm(
  listing: PropertyListingStored,
  allListings: PropertyListingStored[],
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): PropertyDetailStored {
  const base = defaultDetailStored(listing, allListings, language);
  const stored = listing.detail;
  if (!stored) return base;

  const poiLines = (stored.poiLines ?? []).map((l) => l.trim()).filter(Boolean);
  const tags = (stored.tags ?? []).map((t) => t.trim()).filter(Boolean);
  const stats = ensureStats(stored.stats, language);
  const hasCustomStats = stats.some((s) => s.value.trim() && s.value !== "—");

  return {
    subtitle: stored.subtitle?.trim() || base.subtitle,
    about: stored.about?.trim() || base.about,
    tags: tags.length ? tags : base.tags ?? [],
    poiLines: poiLines.length ? poiLines : base.poiLines ?? [],
    groupsHeadline: stored.groupsHeadline?.trim() || base.groupsHeadline,
    groupsDescription: stored.groupsDescription?.trim() || base.groupsDescription,
    groupsCtaLabel: stored.groupsCtaLabel?.trim() || base.groupsCtaLabel,
    groupsCtaHref: stored.groupsCtaHref?.trim() || base.groupsCtaHref,
    stats: hasCustomStats ? stats : base.stats ?? ensureStats(undefined, language),
    units: stored.units?.length ? stored.units : base.units ?? [],
    galleryImages: stored.galleryImages?.length
      ? stored.galleryImages
      : base.galleryImages ?? [],
    relatedSlugs: stored.relatedSlugs?.length
      ? stored.relatedSlugs
      : base.relatedSlugs ?? [],
  };
}

export function normalizeDetailForForm(
  detail?: PropertyDetailStored,
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): PropertyDetailStored {
  const groups = language === "en" ? DEFAULT_GROUPS_EN : DEFAULT_GROUPS;
  return {
    subtitle: detail?.subtitle ?? "",
    about: detail?.about ?? "",
    tags: detail?.tags ?? [],
    poiLines: detail?.poiLines ?? [],
    groupsHeadline: detail?.groupsHeadline ?? groups.groupsHeadline,
    groupsDescription: detail?.groupsDescription ?? "",
    groupsCtaLabel: detail?.groupsCtaLabel ?? groups.groupsCtaLabel,
    groupsCtaHref: detail?.groupsCtaHref ?? groups.groupsCtaHref,
    stats: ensureStats(detail?.stats, language),
    units: detail?.units?.length ? detail.units : [],
    galleryImages: detail?.galleryImages ?? [],
    relatedSlugs: detail?.relatedSlugs ?? [],
  };
}

export function detailHasContent(d: PropertyDetailStored): boolean {
  return Boolean(
    d.subtitle?.trim() ||
      d.about?.trim() ||
      d.tags?.length ||
      d.poiLines?.length ||
      d.groupsHeadline?.trim() ||
      d.groupsDescription?.trim() ||
      d.groupsCtaLabel?.trim() ||
      d.stats?.some((s) => s.value.trim() && s.value !== "—") ||
      d.units?.length ||
      d.galleryImages?.length ||
      d.relatedSlugs?.length,
  );
}
