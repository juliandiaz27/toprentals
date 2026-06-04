import type {
  PropertiesCatalogFile,
  PropertyListing,
  PropertyListingStored,
} from "./catalogTypes";
import { readPropertiesCatalog } from "./catalogStorage";
import { propertyPlaceholderImage } from "./catalog";

export function normalizeListing(
  item: PropertyListingStored,
  index: number,
): PropertyListing {
  return {
    slug: item.slug.trim(),
    gnahsId: Number(item.gnahsId) || 0,
    name: item.name.trim(),
    city: item.city === "Quito" ? "Quito" : "Buenos Aires",
    neighborhood: String(item.neighborhood ?? "").trim(),
    address: String(item.address ?? "").trim(),
    comingSoon: Boolean(item.comingSoon),
    hidden: Boolean(item.hidden),
    hasOffer: Boolean(item.hasOffer),
    isPopular: Boolean(item.isPopular),
    detail: item.detail,
    imageSrc:
      item.comingSoon || !String(item.imageSrc ?? "").trim()
        ? ""
        : String(item.imageSrc).trim(),
  };
}

export function isPropertyPublic(item: PropertyListing): boolean {
  return !item.hidden;
}

export function listingsWithPlaceholders(
  listings: PropertyListingStored[],
): PropertyListing[] {
  return listings.map((item, index) => {
    const base = normalizeListing(item, index);
    if (base.comingSoon || base.imageSrc) return base;
    return { ...base, imageSrc: propertyPlaceholderImage(index) };
  });
}

export async function loadPropertyListings(options?: {
  includeHidden?: boolean;
}): Promise<PropertyListing[]> {
  const catalog = await readPropertiesCatalog();
  const listings = listingsWithPlaceholders(catalog.listings);
  if (options?.includeHidden) return listings;
  return listings.filter(isPropertyPublic);
}

export async function loadPropertiesCatalog(): Promise<PropertiesCatalogFile> {
  return readPropertiesCatalog();
}

export function pickHomeFeaturedProperties(
  listings: PropertyListing[],
  featuredSlugs: string[],
  limit = 5,
): PropertyListing[] {
  const active = listings.filter((p) => !p.comingSoon && isPropertyPublic(p));
  const bySlug = new Map(active.map((p) => [p.slug, p]));
  const ordered = featuredSlugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is PropertyListing => p != null);

  if (ordered.length >= limit) return ordered.slice(0, limit);

  const used = new Set(ordered.map((p) => p.slug));
  const rest = active.filter((p) => !used.has(p.slug));
  return [...ordered, ...rest].slice(0, limit);
}

export async function getPropertyBySlug(
  slug: string,
): Promise<PropertyListing | undefined> {
  const listings = await loadPropertyListings();
  return listings.find(
    (p) => p.slug === slug && !p.comingSoon && isPropertyPublic(p),
  );
}
