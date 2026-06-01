"use client";

import { useMemo, useState } from "react";
import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import { PROPERTY_LISTINGS } from "@/lib/properties/catalog";
import {
  PropertiesFilters,
  filterMatchesCity,
  type PropertyFilterId,
} from "./PropertiesFilters";
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
      <PropertiesFilters labels={filterLabels} active={filter} onChange={setFilter} />
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((property) => (
          <li key={property.slug}>
            <PropertyCard property={property} />
          </li>
        ))}
      </ul>
    </>
  );
}
