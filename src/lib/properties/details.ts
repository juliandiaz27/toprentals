import type { SiteLanguage } from "@/lib/i18n";
import { DEFAULT_SITE_LANGUAGE } from "@/lib/i18n";
import { loadPropertyListings } from "./catalog";
import type { PropertyListing } from "./catalog";
import type { PropertyDetailStored } from "./catalogTypes";
import { resolvePropertyGalleryImages } from "./gallery";
import { normalizeAmenities, parsePoiLine } from "./amenities";
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

  const poiPlaces = (stored.poiLines ?? [])
    .map(parsePoiLine)
    .filter((p) => p.name);
  const poiItems = poiPlaces.map((p) => p.name);
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
          .map((s) => ({
            value: String(s?.value ?? "").trim() || "—",
            label: String(s?.label ?? "").trim(),
          }))
          .filter((s) => s.label)
      : undefined;

  const units =
    stored.units && stored.units.length > 0
      ? stored.units
          .map((u) => {
            const name = String(u?.name ?? "").trim();
            if (!name) return null;
            const tourUrl = String(u?.tourUrl ?? "").trim();
            const imageSrc = String(u?.imageSrc ?? "").trim();
            return {
              name,
              sqm: String(u?.sqm ?? "").trim(),
              guests: String(u?.guests ?? "").trim(),
              features: String(u?.features ?? "").trim(),
              ...(tourUrl ? { tourUrl } : {}),
              ...(imageSrc ? { imageSrc } : {}),
            };
          })
          .filter((u): u is NonNullable<typeof u> => u != null)
      : undefined;

  const galleryImages =
    stored.galleryImages && stored.galleryImages.length > 0
      ? stored.galleryImages.map((s) => String(s ?? "").trim()).filter(Boolean)
      : undefined;

  return {
    ...(stored.subtitle ? { subtitle: stored.subtitle } : {}),
    ...(galleryImages ? { galleryImages } : {}),
    ...(stored.about ? { about: stored.about } : {}),
    ...(stored.tags?.length ? { tags: stored.tags } : {}),
    ...(poi ? { poi, poiPlaces } : {}),
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
    poiPlaces:
      override.poiPlaces ??
      (override.poi ?? base.poi).columns.flat().map((name) => ({ name, imageSrc: "" })),
    bannerImage: String(listing.detail?.bannerImage ?? "").trim(),
    bannerTitle: String(listing.detail?.bannerTitle ?? "").trim(),
    seoTitle: String(listing.detail?.seoTitle ?? "").trim(),
    seoDescription: String(listing.detail?.seoDescription ?? "").trim(),
    bannerPills: (listing.detail?.bannerPills ?? [])
      .map((p) => String(p ?? "").trim())
      .filter(Boolean),
    finalCtaTitle:
      String(listing.detail?.finalCtaTitle ?? "").trim() || base.finalCtaTitle,
    finalCtaSubtitle:
      String(listing.detail?.finalCtaSubtitle ?? "").trim() || base.finalCtaSubtitle,
    introText: String(listing.detail?.introText ?? "").trim(),
    introCtaLabel: String(listing.detail?.introCtaLabel ?? "").trim(),
    aboutTitle: String(listing.detail?.aboutTitle ?? "").trim(),
    highlightTitle: String(listing.detail?.highlightTitle ?? "").trim(),
    highlightText: String(listing.detail?.highlightText ?? "").trim(),
    restaurantsTitle: String(listing.detail?.restaurantsTitle ?? "").trim(),
    unitsIntro: String(listing.detail?.unitsIntro ?? "").trim(),
    amenitiesIntro: String(listing.detail?.amenitiesIntro ?? "").trim(),
    finalCtaLabel: String(listing.detail?.finalCtaLabel ?? "").trim(),
    restaurants: (listing.detail?.restaurants ?? [])
      .map((r) => String(r ?? "").trim())
      .filter(Boolean),
    amenities: normalizeAmenities(listing.detail?.amenities),
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
