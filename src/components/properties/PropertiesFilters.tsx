"use client";

import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import type { PropertyCity } from "@/lib/properties/catalog";

export type PropertyFilterId = "buenos-aires" | "ecuador";

type Props = {
  labels: PropiedadesFiltersContent;
  active: PropertyFilterId;
  onChange: (id: PropertyFilterId) => void;
};

const CHIP_ORDER: PropertyFilterId[] = ["buenos-aires", "ecuador"];

export function filterMatchesCity(
  filter: PropertyFilterId,
  city: PropertyCity,
  comingSoon?: boolean,
): boolean {
  if (filter === "buenos-aires") return city === "Buenos Aires" && !comingSoon;
  return city === "Quito" || comingSoon === true;
}

export function PropertiesFilters({ labels, active, onChange }: Props) {
  const labelMap: Record<PropertyFilterId, string> = {
    "buenos-aires": labels.buenosAires,
    ecuador: labels.ecuador,
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CHIP_ORDER.map((id) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors ${
              isActive
                ? "bg-btn text-white"
                : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
            }`}
          >
            {labelMap[id]}
          </button>
        );
      })}
    </div>
  );
}
