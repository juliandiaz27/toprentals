import type { SiteLanguage } from "@/lib/i18n";
import { DEFAULT_SITE_LANGUAGE } from "@/lib/i18n";
import { loadPropertyListings } from "./catalog";
import type { PropertyListing } from "./catalog";
import type { PropertyDetailStored } from "./catalogTypes";
import { resolvePropertyGalleryImages } from "./gallery";
import {
  buildDefaultDetail,
  buildPoiColumns,
  DEFAULT_POI_SECTION_TITLE,
  DEFAULT_POI_SECTION_TITLE_EN,
} from "./propertyDetailDefaults";

import type {
  PropertyDetail,
  PropertyDetailExtra,
} from "./propertyDetailTypes";

export type {
  PropertyDetail,
  PropertyDetailExtra,
  PropertyNearbyPoi,
  PropertyStat,
  PropertyUnit,
} from "./propertyDetailTypes";
export { buildDefaultDetail, buildPoiColumns } from "./propertyDetailDefaults";

function poiSectionTitle(language: SiteLanguage): string {
  return language === "en"
    ? DEFAULT_POI_SECTION_TITLE_EN
    : DEFAULT_POI_SECTION_TITLE;
}

function detailOverrideFromStored(
  stored: PropertyDetailStored | undefined,
  language: SiteLanguage,
): Partial<PropertyDetailExtra> {
  if (!stored) return {};

  const poiItems = (stored.poiLines ?? []).map((line) => line.trim()).filter(Boolean);
  const poi =
    poiItems.length > 0
      ? {
          sectionTitle: poiSectionTitle(language),
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
          .map((u) => {
            const tourUrl = u.tourUrl?.trim();
            return {
              name: u.name.trim(),
              sqm: u.sqm.trim(),
              guests: u.guests.trim(),
              features: u.features.trim(),
              ...(tourUrl ? { tourUrl } : {}),
            };
          })
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
    ...(stored.groupsDescription ? { groupsDescription: stored.groupsDescription } : {}),
    ...(stored.groupsCtaLabel ? { groupsCtaLabel: stored.groupsCtaLabel } : {}),
    ...(stored.groupsCtaHref ? { groupsCtaHref: stored.groupsCtaHref } : {}),
    ...(stats ? { stats } : {}),
    ...(units ? { units } : {}),
    ...(stored.relatedSlugs?.length ? { relatedSlugs: stored.relatedSlugs } : {}),
  };
}

export async function getPropertyDetail(
  slug: string,
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): Promise<PropertyDetail | null> {
  const listings = await loadPropertyListings({ includeHidden: true, language });
  const listing = listings.find(
    (p) => p.slug === slug && !p.comingSoon && !p.hidden,
  );
  if (!listing) return null;

  const visible = listings.filter((p) => !p.hidden);
  const base = buildDefaultDetail(listing, visible, language);
  const override = detailOverrideFromStored(listing.detail, language);

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
    groupsDescription: override.groupsDescription ?? base.groupsDescription,
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
