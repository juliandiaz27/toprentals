"use client";

import { useMemo, useState } from "react";
import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import type { PropertyListing } from "@/lib/properties/catalog";
import { PropertiesFiltersBar } from "./PropertiesFiltersBar";
import { filterMatchesCity, type PropertyFilterId } from "./PropertiesFilters";
import { PropertyCard } from "./PropertyCard";

type Props = {
  filterLabels: PropiedadesFiltersContent;
  listings: PropertyListing[];
};

export function PropertiesGrid({ filterLabels, listings }: Props) {
  const [filter, setFilter] = useState<PropertyFilterId>("buenos-aires");

  const visible = useMemo(
    () =>
      listings.filter((p) =>
        filterMatchesCity(filter, p.city, p.comingSoon),
      ),
    [filter, listings],
  );

  return (
    <>
      <PropertiesFiltersBar
        labels={filterLabels}
        active={filter}
        onChange={setFilter}
      />

      <div
        data-reveal
        className="mx-auto w-full max-w-[1440px] px-6 pb-10 pt-10 lg:px-12 lg:pt-12"
      >
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visible.map((property) => (
            <li key={property.slug}>
              <PropertyCard property={property} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
