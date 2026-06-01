"use client";

import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import type { PropertyCity } from "@/lib/properties/catalog";

export type PropertyFilterId =
  | "all"
  | "buenos-aires"
  | "ecuador"
  | "disponibilidad"
  | "grupos"
  | "exclusivas"
  | "barrio";

type Props = {
  labels: PropiedadesFiltersContent;
  active: PropertyFilterId;
  onChange: (id: PropertyFilterId) => void;
};

const CHIP_ORDER: PropertyFilterId[] = [
  "all",
  "buenos-aires",
  "ecuador",
  "disponibilidad",
  "grupos",
  "exclusivas",
  "barrio",
];

export function filterMatchesCity(
  filter: PropertyFilterId,
  city: PropertyCity,
  comingSoon?: boolean,
): boolean {
  if (filter === "all") return true;
  if (filter === "buenos-aires") return city === "Buenos Aires" && !comingSoon;
  if (filter === "ecuador") return city === "Quito" || comingSoon === true;
  return true;
}

export function PropertiesFilters({ labels, active, onChange }: Props) {
  const labelMap: Record<PropertyFilterId, string> = {
    all: labels.all,
    "buenos-aires": labels.buenosAires,
    ecuador: labels.ecuador,
    disponibilidad: labels.disponibilidad,
    grupos: labels.grupos,
    exclusivas: labels.exclusivas,
    barrio: labels.barrio,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CHIP_ORDER.map((id) => {
        const isActive = active === id;
        const isPlaceholder = ["disponibilidad", "grupos", "exclusivas", "barrio"].includes(
          id,
        );
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
              isActive
                ? "bg-neutral-950 text-white"
                : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
            } ${isPlaceholder && !isActive ? "opacity-90" : ""}`}
          >
            {labelMap[id]}
          </button>
        );
      })}
    </div>
  );
}
