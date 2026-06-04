"use client";

import { useMemo, useState } from "react";
import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import { listingMatchesCityFilter } from "@/lib/pageContent/propertyCityFilters";
import type { PropertyListing } from "@/lib/properties/catalog";
import { PropertiesFiltersBar } from "./PropertiesFiltersBar";
import type { PropertyFilterId } from "./PropertiesFilters";
import { PropertyCard } from "./PropertyCard";

type Props = {
  filters: PropiedadesFiltersContent;
  listings: PropertyListing[];
};

export function PropertiesGrid({ filters, listings }: Props) {
  const defaultFilterId = filters[0]?.id ?? "";
  const [filter, setFilter] = useState<PropertyFilterId>(defaultFilterId);

  const activeFilter = filters.find((f) => f.id === filter) ?? filters[0];

  const visible = useMemo(() => {
    if (!activeFilter) return listings;
    return listings.filter((p) =>
      listingMatchesCityFilter(activeFilter, p.city, p.comingSoon),
    );
  }, [activeFilter, listings]);

  return (
    <>
      <PropertiesFiltersBar
        filters={filters}
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
              <PropertyCard property={property} cityFilters={filters} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
