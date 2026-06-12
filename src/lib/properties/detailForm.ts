import type {
  PropertyDetailStored,
  PropertyListingStored,
  PropertyStatStored,
  PropertyUnitStored,
} from "./catalogTypes";
import { DEFAULT_PROPERTY_STATS } from "./catalogTypes";
import { buildDefaultDetail } from "./propertyDetailDefaults";

export const DEFAULT_GROUPS = {
  groupsHeadline: "Grupos y estadías corporativas · Consultanos disponibilidad",
  groupsCtaLabel: "Consultar grupos",
  groupsCtaHref: "/corporate",
} as const;

export function emptyUnit(): PropertyUnitStored {
  return { name: "", sqm: "", guests: "", features: "", tourUrl: "" };
}

export function ensureStats(stats?: PropertyStatStored[]): PropertyStatStored[] {
  const base = [...DEFAULT_PROPERTY_STATS];
  if (!stats?.length) return base;

  const valueByLabel = new Map<string, string>();
  for (const s of stats) {
    const label = s.label?.trim();
    const value = s.value?.trim();
    if (label) valueByLabel.set(label, value || "—");
  }

  if (!valueByLabel.has("Seguridad 24/7") && valueByLabel.has("Tipologías")) {
    valueByLabel.set("Seguridad 24/7", "24/7");
  }

  return base.map((def) => ({
    label: def.label,
    value: valueByLabel.get(def.label) ?? def.value,
  }));
}

function defaultDetailStored(
  listing: PropertyListingStored,
  allListings: PropertyListingStored[],
): PropertyDetailStored {
  const defaults = buildDefaultDetail(listing, allListings);
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
): PropertyDetailStored {
  const base = defaultDetailStored(listing, allListings);
  const stored = listing.detail;
  if (!stored) return base;

  const poiLines = (stored.poiLines ?? []).map((l) => l.trim()).filter(Boolean);
  const tags = (stored.tags ?? []).map((t) => t.trim()).filter(Boolean);
  const stats = ensureStats(stored.stats);
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
    stats: hasCustomStats ? stats : base.stats ?? ensureStats(),
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
): PropertyDetailStored {
  return {
    subtitle: detail?.subtitle ?? "",
    about: detail?.about ?? "",
    tags: detail?.tags ?? [],
    poiLines: detail?.poiLines ?? [],
    groupsHeadline: detail?.groupsHeadline ?? DEFAULT_GROUPS.groupsHeadline,
    groupsDescription: detail?.groupsDescription ?? "",
    groupsCtaLabel: detail?.groupsCtaLabel ?? DEFAULT_GROUPS.groupsCtaLabel,
    groupsCtaHref: detail?.groupsCtaHref ?? DEFAULT_GROUPS.groupsCtaHref,
    stats: ensureStats(detail?.stats),
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
