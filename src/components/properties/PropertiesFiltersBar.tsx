"use client";

import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import {
  PropertiesFilters,
  type PropertyFilterId,
} from "./PropertiesFilters";

type Props = {
  filters: PropiedadesFiltersContent;
  active: PropertyFilterId;
  onChange: (id: PropertyFilterId) => void;
};

/** Franja de filtros con borde arriba y abajo (wireframe propiedades). */
export function PropertiesFiltersBar({ filters, active, onChange }: Props) {
  return (
    <div
      className="relative z-20 border-y border-neutral-200 bg-white"
      role="region"
      aria-label="Filtrar propiedades"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-4 lg:px-12 lg:py-5">
        <PropertiesFilters
          filters={filters}
          active={active}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
