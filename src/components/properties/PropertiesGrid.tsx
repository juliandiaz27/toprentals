"use client";

import { useMemo, useState } from "react";
import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import { PROPERTY_LISTINGS } from "@/lib/properties/catalog";
import { PropertiesFiltersBar } from "./PropertiesFiltersBar";
import { filterMatchesCity, type PropertyFilterId } from "./PropertiesFilters";
import { PropertyCard } from "./PropertyCard";

type Props = {
  filterLabels: PropiedadesFiltersContent;
};

export function PropertiesGrid({ filterLabels }: Props) {
  const [filter, setFilter] = useState<PropertyFilterId>("all");

  const visible = useMemo(
    () =>
      PROPERTY_LISTINGS.filter((p) =>
        filterMatchesCity(filter, p.city, p.comingSoon),
      ),
    [filter],
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
