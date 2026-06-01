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

/** Orden alineado al wireframe: ciudades y disponibilidad primero. */
const CHIP_ORDER: PropertyFilterId[] = [
  "buenos-aires",
  "ecuador",
  "disponibilidad",
  "all",
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
                ? "bg-neutral-950 text-white"
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
