"use client";

import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";

export type PropertyFilterId = string;

type Props = {
  filters: PropiedadesFiltersContent;
  active: PropertyFilterId;
  onChange: (id: PropertyFilterId) => void;
};

export function PropertiesFilters({ filters, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filters.map((filter) => {
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors ${
              isActive
                ? "bg-btn text-white"
                : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
