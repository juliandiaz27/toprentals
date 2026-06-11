"use client";

import type { ReactNode } from "react";
import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import type { PropertyFilterOptionWithCount } from "@/lib/properties/propertyListingFilters";
import {
  PROPERTY_FILTER_ALL,
  type PropertyFilterId,
} from "@/lib/properties/propertyListingFilters";

type PillProps = {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
};

function FilterPill({ label, active, count, onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
        active
          ? "bg-btn text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
          : "bg-white text-neutral-700 ring-1 ring-neutral-300 hover:ring-neutral-400 hover:bg-neutral-50"
      }`}
    >
      {label}
      {count != null ? (
        <span
          className={`text-[11px] font-semibold tabular-nums ${
            active ? "text-white/75" : "text-neutral-400"
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

type ListOptionProps = {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
};

function FilterListOption({ label, count, active, onClick }: ListOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
        active
          ? "bg-neutral-950/[0.04] ring-1 ring-neutral-950/10"
          : "hover:bg-neutral-50"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
            active
              ? "border-neutral-950 bg-neutral-950 text-white"
              : "border-neutral-300 bg-white"
          }`}
          aria-hidden
        >
          {active ? (
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
              <path
                d="M2.5 6.25 4.75 8.5 9.5 3.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
        <span
          className={`truncate text-[14px] ${
            active ? "font-semibold text-neutral-950" : "text-neutral-700"
          }`}
        >
          {label}
        </span>
      </span>
      <span className="shrink-0 text-[13px] tabular-nums text-neutral-400">
        {count}
      </span>
    </button>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
  showDivider?: boolean;
};

function FilterSection({ title, children, showDivider = true }: SectionProps) {
  return (
    <section className={showDivider ? "border-t border-neutral-200 pt-5" : ""}>
      <h3 className="mb-3 text-[13px] font-semibold text-neutral-900">{title}</h3>
      {children}
    </section>
  );
}

export type PropertiesFilterPanelProps = {
  cityFilters: PropiedadesFiltersContent;
  cityOptions: PropertyFilterOptionWithCount[];
  cityActive: PropertyFilterId;
  onCityChange: (id: PropertyFilterId) => void;
  neighborhoodOptions: PropertyFilterOptionWithCount[];
  neighborhoodActive: PropertyFilterId;
  onNeighborhoodChange: (id: PropertyFilterId) => void;
  categoryOptions: PropertyFilterOptionWithCount[];
  categoryActive: PropertyFilterId;
  onCategoryChange: (id: PropertyFilterId) => void;
  hasSecondaryFilters: boolean;
  onClearSecondaryFilters: () => void;
  className?: string;
};

export function PropertiesFilterPanel({
  cityFilters,
  cityOptions,
  cityActive,
  onCityChange,
  neighborhoodOptions,
  neighborhoodActive,
  onNeighborhoodChange,
  categoryOptions,
  categoryActive,
  onCategoryChange,
  hasSecondaryFilters,
  onClearSecondaryFilters,
  className = "",
}: PropertiesFilterPanelProps) {
  const totalInCity = cityOptions.find((o) => o.id === cityActive)?.count ?? 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${className}`}
      role="region"
      aria-label="Filtrar propiedades"
    >
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-950 px-5 py-4 text-white">
        <div className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="h-4 w-4 shrink-0 opacity-90"
          >
            <path
              d="M3 5.5h14M5.5 10h9M8 14.5h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-[13px] font-bold uppercase tracking-[0.08em]">
            Filtros
          </p>
        </div>
        {hasSecondaryFilters ? (
          <button
            type="button"
            onClick={onClearSecondaryFilters}
            className="text-[12px] font-medium text-white/80 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
          >
            Limpiar
          </button>
        ) : null}
      </div>

      <div className="space-y-5 p-5">
        <FilterSection title="Ubicación" showDivider={false}>
          <div className="flex flex-wrap gap-2">
            {(cityOptions.length > 0
              ? cityOptions
              : cityFilters.map((f) => ({ id: f.id, label: f.label, count: 0 }))
            ).map((option) => (
              <FilterPill
                key={option.id}
                label={option.label}
                count={option.count}
                active={cityActive === option.id}
                onClick={() => onCityChange(option.id)}
              />
            ))}
          </div>
        </FilterSection>

        {neighborhoodOptions.length > 0 ? (
          <FilterSection title="Barrio">
            <div className="space-y-0.5">
              <FilterListOption
                label="Todos los barrios"
                count={totalInCity}
                active={neighborhoodActive === PROPERTY_FILTER_ALL}
                onClick={() => onNeighborhoodChange(PROPERTY_FILTER_ALL)}
              />
              {neighborhoodOptions.map((option) => (
                <FilterListOption
                  key={option.id}
                  label={option.label}
                  count={option.count}
                  active={neighborhoodActive === option.id}
                  onClick={() => onNeighborhoodChange(option.id)}
                />
              ))}
            </div>
          </FilterSection>
        ) : null}

        {categoryOptions.length > 0 ? (
          <FilterSection title="Categoría">
            <div className="space-y-0.5">
              <FilterListOption
                label="Todas las tipologías"
                count={totalInCity}
                active={categoryActive === PROPERTY_FILTER_ALL}
                onClick={() => onCategoryChange(PROPERTY_FILTER_ALL)}
              />
              {categoryOptions.map((option) => (
                <FilterListOption
                  key={option.id}
                  label={option.label}
                  count={option.count}
                  active={categoryActive === option.id}
                  onClick={() => onCategoryChange(option.id)}
                />
              ))}
            </div>
          </FilterSection>
        ) : null}
      </div>
    </div>
  );
}
