import type { PropertyCity, PropertyListing } from "./catalogTypes";
import { cityDisplayLabel } from "@/lib/pageContent/propertyCityFilters";
import type { PropertyCityFilterItem } from "@/lib/pageContent/propertyCityFilters";

function isPropertyPublic(item: PropertyListing): boolean {
  return !item.hidden;
}

export type SearchEstablishmentOption = {
  gnahsId: number;
  name: string;
  slug: string;
  city: PropertyCity;
};

export type SearchEstablishmentGroup = {
  regionLabel: string;
  city: PropertyCity;
  items: SearchEstablishmentOption[];
};

export function listingsForSearch(
  listings: PropertyListing[],
): SearchEstablishmentOption[] {
  return listings
    .filter(
      (p) =>
        isPropertyPublic(p) &&
        !p.comingSoon &&
        p.gnahsId > 0,
    )
    .map((p) => ({
      gnahsId: p.gnahsId,
      name: p.name,
      slug: p.slug,
      city: p.city,
    }));
}

export function groupSearchEstablishments(
  items: SearchEstablishmentOption[],
  cityFilters: PropertyCityFilterItem[] = [],
): SearchEstablishmentGroup[] {
  const cities = [...new Set(items.map((p) => p.city))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );

  return cities.map((city) => ({
    regionLabel: cityDisplayLabel(city, cityFilters),
    city,
    items: items.filter((p) => p.city === city),
  }));
}

export function filterSearchEstablishments(
  items: SearchEstablishmentOption[],
  query: string,
): SearchEstablishmentOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.slug.replace(/-/g, " ").includes(q),
  );
}
