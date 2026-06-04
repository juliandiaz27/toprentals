import type {
  PropertyDetailStored,
  PropertyStatStored,
  PropertyUnitStored,
} from "./catalogTypes";
import { DEFAULT_PROPERTY_STATS } from "./catalogTypes";

export const DEFAULT_GROUPS = {
  groupsHeadline: "Grupos y estadías corporativas · Consultanos disponibilidad",
  groupsCtaLabel: "Consultar grupos",
  groupsCtaHref: "/corporate",
} as const;

export function emptyUnit(): PropertyUnitStored {
  return { name: "", sqm: "", guests: "", features: "" };
}

export function ensureStats(stats?: PropertyStatStored[]): PropertyStatStored[] {
  const base = [...DEFAULT_PROPERTY_STATS];
  if (!stats?.length) return base;
  return base.map((def, i) => ({
    value: stats[i]?.value?.trim() ?? def.value,
    label: stats[i]?.label?.trim() || def.label,
  }));
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
      d.groupsCtaLabel?.trim() ||
      d.stats?.some((s) => s.value.trim() && s.value !== "—") ||
      d.units?.length ||
      d.galleryImages?.length ||
      d.relatedSlugs?.length,
  );
}
