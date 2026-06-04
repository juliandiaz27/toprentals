import type { PropertyCity, PropertyListing } from "./catalogTypes";

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

const REGION_LABEL: Record<PropertyCity, string> = {
  "Buenos Aires": "Buenos Aires",
  Quito: "Ecuador",
};

const CITY_ORDER: PropertyCity[] = ["Buenos Aires", "Quito"];

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
): SearchEstablishmentGroup[] {
  return CITY_ORDER.map((city) => ({
    regionLabel: REGION_LABEL[city],
    city,
    items: items.filter((p) => p.city === city),
  })).filter((g) => g.items.length > 0);
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
