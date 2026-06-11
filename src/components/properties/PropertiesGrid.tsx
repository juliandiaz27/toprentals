"use client";

import { useEffect, useMemo, useState } from "react";
import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import type { PropertyListing } from "@/lib/properties/catalog";
import {
  PROPERTY_FILTER_ALL,
  activeFilterCount,
  categoryOptionsWithCounts,
  cityOptionsWithCounts,
  filterPropertyListings,
  listingsForCityFilter,
  neighborhoodOptionsWithCounts,
  type PropertyFilterId,
} from "@/lib/properties/propertyListingFilters";
import { PropertiesFilterDrawer } from "./PropertiesFilterDrawer";
import { PropertiesFilterPanel } from "./PropertiesFilterPanel";
import { PropertyCard } from "./PropertyCard";

type Props = {
  filters: PropiedadesFiltersContent;
  listings: PropertyListing[];
};

export function PropertiesGrid({ filters, listings }: Props) {
  const defaultCityId = filters[0]?.id ?? "";
  const [cityFilterId, setCityFilterId] =
    useState<PropertyFilterId>(defaultCityId);
  const [neighborhoodId, setNeighborhoodId] =
    useState<PropertyFilterId>(PROPERTY_FILTER_ALL);
  const [categoryId, setCategoryId] =
    useState<PropertyFilterId>(PROPERTY_FILTER_ALL);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCityFilter =
    filters.find((filter) => filter.id === cityFilterId) ?? filters[0];

  const cityScopedListings = useMemo(
    () => listingsForCityFilter(listings, activeCityFilter),
    [activeCityFilter, listings],
  );

  const cityOptions = useMemo(
    () => cityOptionsWithCounts(listings, filters),
    [filters, listings],
  );

  const neighborhoodOptions = useMemo(
    () => neighborhoodOptionsWithCounts(cityScopedListings),
    [cityScopedListings],
  );

  const categoryOptions = useMemo(
    () => categoryOptionsWithCounts(cityScopedListings),
    [cityScopedListings],
  );

  useEffect(() => {
    setNeighborhoodId(PROPERTY_FILTER_ALL);
    setCategoryId(PROPERTY_FILTER_ALL);
  }, [cityFilterId]);

  useEffect(() => {
    if (
      neighborhoodId !== PROPERTY_FILTER_ALL &&
      !neighborhoodOptions.some((option) => option.id === neighborhoodId)
    ) {
      setNeighborhoodId(PROPERTY_FILTER_ALL);
    }
  }, [neighborhoodId, neighborhoodOptions]);

  useEffect(() => {
    if (
      categoryId !== PROPERTY_FILTER_ALL &&
      !categoryOptions.some((option) => option.id === categoryId)
    ) {
      setCategoryId(PROPERTY_FILTER_ALL);
    }
  }, [categoryId, categoryOptions]);

  const visible = useMemo(
    () =>
      filterPropertyListings(listings, {
        cityFilter: activeCityFilter,
        neighborhoodId,
        categoryId,
      }),
    [activeCityFilter, categoryId, listings, neighborhoodId],
  );

  const hasSecondaryFilters =
    neighborhoodId !== PROPERTY_FILTER_ALL ||
    categoryId !== PROPERTY_FILTER_ALL;

  const secondaryFilterCount = activeFilterCount(neighborhoodId, categoryId);

  function clearSecondaryFilters() {
    setNeighborhoodId(PROPERTY_FILTER_ALL);
    setCategoryId(PROPERTY_FILTER_ALL);
  }

  const resultLabel =
    visible.length === 1
      ? "1 departamento"
      : `${visible.length} departamentos`;

  const panelProps = {
    cityFilters: filters,
    cityOptions,
    cityActive: cityFilterId,
    onCityChange: setCityFilterId,
    neighborhoodOptions,
    neighborhoodActive: neighborhoodId,
    onNeighborhoodChange: setNeighborhoodId,
    categoryOptions,
    categoryActive: categoryId,
    onCategoryChange: setCategoryId,
    hasSecondaryFilters,
    onClearSecondaryFilters: clearSecondaryFilters,
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-10 pt-8 lg:px-12 lg:pt-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="min-w-0 flex-1" data-reveal>
          <div className="mb-6 flex items-center justify-between gap-4 lg:mb-8">
            <p className="text-[14px] text-neutral-600">
              Mostrando{" "}
              <span className="font-semibold text-neutral-950">{resultLabel}</span>
            </p>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-btn px-4 text-[13px] font-semibold uppercase tracking-wide text-white shadow-[0_4px_16px_rgba(0,0,0,0.14)] transition-colors hover:bg-btn-hover lg:hidden"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
                <path
                  d="M3 5.5h14M5.5 10h9M8 14.5h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Filtros
              {secondaryFilterCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-bold">
                  {secondaryFilterCount}
                </span>
              ) : null}
              <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-3.5 w-3.5 opacity-80">
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {visible.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {visible.map((property) => (
                <li key={property.slug}>
                  <PropertyCard property={property} cityFilters={filters} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
              <p className="text-[17px] font-semibold text-neutral-900">
                No hay departamentos con estos filtros
              </p>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-neutral-500">
                Probá con otro barrio o tipología, o restablecé los filtros para
                ver todas las opciones.
              </p>
              {hasSecondaryFilters ? (
                <button
                  type="button"
                  onClick={clearSecondaryFilters}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-neutral-950 px-5 text-[14px] font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          )}
        </div>

        <aside className="hidden w-[300px] shrink-0 lg:block">
          <div className="sticky top-24">
            <PropertiesFilterPanel {...panelProps} />
          </div>
        </aside>
      </div>

      <PropertiesFilterDrawer
        {...panelProps}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
