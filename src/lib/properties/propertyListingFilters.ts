import { listingMatchesCityFilter } from "@/lib/pageContent/propertyCityFilters";
import type { PropertyCityFilterItem } from "@/lib/pageContent/propertyCityFilters";
import type { PropertyListing } from "./catalogTypes";
import { DEFAULT_PROPERTY_UNITS } from "./propertyDetailDefaults";

export const PROPERTY_FILTER_ALL = "todos";

export type PropertyFilterId = string;

const CATEGORY_ORDER = [
  "Studio",
  "Habitación",
  "2 Ambientes",
  "3 Ambientes",
  "4 Ambientes",
  "Lounge",
] as const;

export type PropertyFilterOption = {
  id: string;
  label: string;
};

export type PropertyFilterOptionWithCount = PropertyFilterOption & {
  count: number;
};

function slugifyFilterId(value: string): string {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "otro";
}

/** Agrupa nombres de unidad en categorías del listado (Studio, 2 Ambientes, etc.). */
export function normalizeUnitCategory(unitName: string): string {
  const raw = String(unitName ?? "").trim();
  const n = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");

  if (/\blounge\b/.test(n)) return "Lounge";
  if (/\bhabitacion\b/.test(n)) return "Habitación";
  if (/\bstudio\b|\bmonoambiente\b/.test(n)) return "Studio";
  if (/\b4\s*amb|\bcuatro\s*amb/.test(n)) return "4 Ambientes";
  if (/\b3\s*amb|\btres\s*amb|\btwo\s*bedroom\b/.test(n)) return "3 Ambientes";
  if (/\b2\s*amb|\bdos\s*amb|\bone\s*bedroom\b/.test(n)) return "2 Ambientes";

  return raw;
}

export function getListingUnitNames(listing: PropertyListing): string[] {
  const stored = listing.detail?.units;
  if (stored && stored.length > 0) {
    return stored
      .map((u) => String(u?.name ?? "").trim())
      .filter(Boolean);
  }
  return DEFAULT_PROPERTY_UNITS.map((u) => u.name);
}

export function getListingUnitCategories(listing: PropertyListing): string[] {
  const categories = new Set<string>();
  for (const name of getListingUnitNames(listing)) {
    categories.add(normalizeUnitCategory(name));
  }
  return sortCategories([...categories]);
}

function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a as (typeof CATEGORY_ORDER)[number]);
    const bi = CATEGORY_ORDER.indexOf(b as (typeof CATEGORY_ORDER)[number]);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b, "es");
  });
}

export function neighborhoodFilterId(neighborhood: string): string {
  const trimmed = String(neighborhood ?? "").trim();
  if (!trimmed) return "sin-barrio";
  return slugifyFilterId(trimmed);
}

export function categoryFilterId(category: string): string {
  return slugifyFilterId(category);
}

export function listingsForCityFilter(
  listings: PropertyListing[],
  cityFilter: PropertyCityFilterItem | undefined,
): PropertyListing[] {
  if (!cityFilter) return listings;
  return listings.filter((listing) =>
    listingMatchesCityFilter(cityFilter, listing.city, listing.comingSoon),
  );
}

export function neighborhoodOptionsFromListings(
  listings: PropertyListing[],
): PropertyFilterOption[] {
  return neighborhoodOptionsWithCounts(listings).map(({ id, label }) => ({
    id,
    label,
  }));
}

export function neighborhoodOptionsWithCounts(
  listings: PropertyListing[],
): PropertyFilterOptionWithCount[] {
  const byId = new Map<string, { label: string; count: number }>();
  for (const listing of listings) {
    const label = String(listing.neighborhood ?? "").trim();
    if (!label) continue;
    const id = neighborhoodFilterId(label);
    const row = byId.get(id);
    if (row) row.count += 1;
    else byId.set(id, { label, count: 1 });
  }

  return [...byId.entries()]
    .sort(([, a], [, b]) => a.label.localeCompare(b.label, "es"))
    .map(([id, { label, count }]) => ({ id, label, count }));
}

export function categoryOptionsFromListings(
  listings: PropertyListing[],
): PropertyFilterOption[] {
  return categoryOptionsWithCounts(listings).map(({ id, label }) => ({
    id,
    label,
  }));
}

export function categoryOptionsWithCounts(
  listings: PropertyListing[],
): PropertyFilterOptionWithCount[] {
  const byId = new Map<string, { label: string; count: number }>();

  for (const listing of listings) {
    for (const category of getListingUnitCategories(listing)) {
      const id = categoryFilterId(category);
      const row = byId.get(id);
      if (row) row.count += 1;
      else byId.set(id, { label: category, count: 1 });
    }
  }

  return sortCategories([...byId.values()].map((row) => row.label))
    .map((label) => {
      const id = categoryFilterId(label);
      return { id, label, count: byId.get(id)?.count ?? 0 };
    })
    .filter((row) => row.count > 0);
}

export function cityOptionsWithCounts(
  listings: PropertyListing[],
  cityFilters: PropertyCityFilterItem[],
): PropertyFilterOptionWithCount[] {
  return cityFilters.map((filter) => ({
    id: filter.id,
    label: filter.label,
    count: listingsForCityFilter(listings, filter).length,
  }));
}

export function activeFilterCount(
  neighborhoodId: string,
  categoryId: string,
): number {
  let count = 0;
  if (neighborhoodId !== PROPERTY_FILTER_ALL) count += 1;
  if (categoryId !== PROPERTY_FILTER_ALL) count += 1;
  return count;
}

export function listingMatchesNeighborhoodFilter(
  listing: PropertyListing,
  neighborhoodId: string,
): boolean {
  if (neighborhoodId === PROPERTY_FILTER_ALL) return true;
  return neighborhoodFilterId(listing.neighborhood) === neighborhoodId;
}

export function listingMatchesCategoryFilter(
  listing: PropertyListing,
  categoryId: string,
): boolean {
  if (categoryId === PROPERTY_FILTER_ALL) return true;
  return getListingUnitCategories(listing).some(
    (category) => categoryFilterId(category) === categoryId,
  );
}

export function filterPropertyListings(
  listings: PropertyListing[],
  options: {
    cityFilter?: PropertyCityFilterItem;
    neighborhoodId?: string;
    categoryId?: string;
  },
): PropertyListing[] {
  const cityScoped = listingsForCityFilter(listings, options.cityFilter);

  return cityScoped.filter(
    (listing) =>
      listingMatchesNeighborhoodFilter(
        listing,
        options.neighborhoodId ?? PROPERTY_FILTER_ALL,
      ) &&
      listingMatchesCategoryFilter(
        listing,
        options.categoryId ?? PROPERTY_FILTER_ALL,
      ),
  );
}
