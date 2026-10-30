"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  PropiedadesFiltersContent,
  PropiedadesHeroContent,
} from "@/lib/pageContent/propiedadesTypes";
import type { PropertyListing } from "@/lib/properties/catalog";
import {
  PROPERTY_AUDIENCES,
  type PropertyAudience,
} from "@/lib/properties/catalogTypes";
import {
  PROPERTY_FILTER_ALL,
  activeFilterCount,
  categoryOptionsWithCounts,
  cityOptionsWithCounts,
  filterPropertyListings,
  listingMaxGuests,
  listingsForCityFilter,
  neighborhoodOptionsWithCounts,
  type PropertyFilterId,
} from "@/lib/properties/propertyListingFilters";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { PropertiesFilterDrawer } from "./PropertiesFilterDrawer";
import { PropertiesFilterPanel } from "./PropertiesFilterPanel";
import { PropertiesHero, type HeroZoneGroup } from "./PropertiesHero";
import { PropertyCard } from "./PropertyCard";

type Props = {
  hero: PropiedadesHeroContent;
  filters: PropiedadesFiltersContent;
  listings: PropertyListing[];
};

function chipClass(active: boolean): string {
  return `shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium text-tr-ink transition ${
    active ? "bg-tr-sky" : "bg-white hover:bg-tr-cream"
  }`;
}

export function PropertiesGrid({ hero, filters, listings }: Props) {
  const { ui, lang } = useLanguage();
  const resultsRef = useRef<HTMLDivElement>(null);
  /* «Todos» por defecto, como en el Figma */
  const [cityFilterId, setCityFilterId] =
    useState<PropertyFilterId>(PROPERTY_FILTER_ALL);
  const [neighborhoodId, setNeighborhoodId] =
    useState<PropertyFilterId>(PROPERTY_FILTER_ALL);
  const [categoryId, setCategoryId] =
    useState<PropertyFilterId>(PROPERTY_FILTER_ALL);
  const [guests, setGuests] = useState(0);
  const [audience, setAudience] = useState<PropertyAudience | "">("");
  const [exclusiveOnly, setExclusiveOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Filtros que dependen de datos cargados en el admin: se ocultan si nadie los tiene */
  const maxGuests = useMemo(
    () => Math.min(12, Math.max(0, ...listings.map(listingMaxGuests))),
    [listings],
  );
  const audienceOptions = useMemo(
    () => PROPERTY_AUDIENCES.filter((a) => listings.some((l) => l.audience?.includes(a))),
    [listings],
  );
  const hasExclusive = useMemo(
    () => listings.some((l) => l.isExclusive),
    [listings],
  );

  const activeCityFilter = filters.find((filter) => filter.id === cityFilterId);

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

  /* Desplegable «Ciudad / Zona» del hero: país → barrios */
  const zoneGroups = useMemo<HeroZoneGroup[]>(
    () =>
      filters.map((filter) => ({
        cityId: filter.id,
        label: filter.label,
        neighborhoods: neighborhoodOptionsWithCounts(
          listingsForCityFilter(listings, filter),
        ),
      })),
    [filters, listings],
  );

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
        guests,
        audience,
        exclusiveOnly,
      }),
    [activeCityFilter, audience, categoryId, exclusiveOnly, guests, listings, neighborhoodId],
  );

  const extraFilterCount =
    (guests ? 1 : 0) + (audience ? 1 : 0) + (exclusiveOnly ? 1 : 0);

  const hasSecondaryFilters =
    neighborhoodId !== PROPERTY_FILTER_ALL ||
    categoryId !== PROPERTY_FILTER_ALL ||
    extraFilterCount > 0;

  const secondaryFilterCount =
    activeFilterCount(neighborhoodId, categoryId) + extraFilterCount;

  function changeCity(id: PropertyFilterId) {
    setCityFilterId(id);
    setNeighborhoodId(PROPERTY_FILTER_ALL);
    setCategoryId(PROPERTY_FILTER_ALL);
  }

  function changeZone(cityId: PropertyFilterId, hoodId: PropertyFilterId) {
    setCityFilterId(cityId);
    setNeighborhoodId(hoodId);
  }

  function clearSecondaryFilters() {
    setNeighborhoodId(PROPERTY_FILTER_ALL);
    setCategoryId(PROPERTY_FILTER_ALL);
    setGuests(0);
    setAudience("");
    setExclusiveOnly(false);
  }

  function scrollToResults() {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const resultLabel =
    visible.length === 1
      ? "1 departamento"
      : `${visible.length} departamentos`;

  const panelProps = {
    cityFilters: filters,
    cityOptions,
    cityActive: cityFilterId,
    onCityChange: changeCity,
    neighborhoodOptions,
    neighborhoodActive: neighborhoodId,
    onNeighborhoodChange: setNeighborhoodId,
    categoryOptions,
    categoryActive: categoryId,
    onCategoryChange: setCategoryId,
    hasSecondaryFilters,
    onClearSecondaryFilters: clearSecondaryFilters,
  };

  const chips = [
    { id: PROPERTY_FILTER_ALL, label: ui.properties.all },
    ...filters.map((filter) => ({ id: filter.id, label: filter.label })),
  ];

  return (
    <>
      <PropertiesHero
        hero={hero}
        zoneGroups={zoneGroups}
        cityId={cityFilterId}
        neighborhoodId={neighborhoodId}
        onZoneChange={changeZone}
        categoryOptions={categoryOptions}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        maxGuests={maxGuests}
        guests={guests}
        onGuestsChange={setGuests}
        audienceOptions={audienceOptions}
        audience={audience}
        onAudienceChange={setAudience}
        onSubmit={scrollToResults}
      />

      {/* Franja roja con accesos rápidos por país */}
      <div className="bg-tr-red">
        <div
          className="mx-auto flex w-full max-w-[1440px] gap-3 overflow-x-auto px-6 py-6 lg:px-16 lg:py-9"
          role="group"
          aria-label={ui.properties.location}
        >
          {chips.map((chip) => {
            const active = cityFilterId === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                onClick={() => changeCity(chip.id)}
                className={chipClass(active)}
              >
                {chip.label}
              </button>
            );
          })}
          {/* Atajos que se activan/desactivan sin cambiar el país */}
          {audienceOptions.includes("grupos") ? (
            <button
              type="button"
              aria-pressed={audience === "grupos"}
              onClick={() => setAudience(audience === "grupos" ? "" : "grupos")}
              className={chipClass(audience === "grupos")}
            >
              {lang === "en" ? "Groups" : "Grupos"}
            </button>
          ) : null}
          {hasExclusive ? (
            <button
              type="button"
              aria-pressed={exclusiveOnly}
              onClick={() => setExclusiveOnly((v) => !v)}
              className={chipClass(exclusiveOnly)}
            >
              {lang === "en" ? "Exclusive units" : "Unidades exclusivas"}
            </button>
          ) : null}
        </div>
      </div>

      <div
        ref={resultsRef}
        className="relative mx-auto w-full max-w-[1440px] scroll-mt-24 px-6 pb-16 pt-10 lg:px-16 lg:pt-[84px]"
      >
        {/* Línea curva superior (Figma) */}
        <span
          className="pointer-events-none absolute left-6 right-6 top-9 hidden h-[160px] rounded-tr-[56px] border-r border-t border-tr-ink/70 lg:left-16 lg:right-[38px] lg:block"
          aria-hidden
        />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-[34px]">
          <div className="min-w-0 flex-1" data-reveal>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-[13px] text-tr-ink">Mostrando {resultLabel}</p>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-[3px] bg-tr-ink px-4 text-[12px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-black lg:hidden"
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
                  <path
                    d="M3 5.5h14M5.5 10h9M8 14.5h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {ui.properties.filters}
                {secondaryFilterCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-bold">
                    {secondaryFilterCount}
                  </span>
                ) : null}
              </button>
            </div>

            {visible.length > 0 ? (
              <ul className="grid gap-x-[34px] gap-y-7 sm:grid-cols-2">
                {visible.map((property) => (
                  <li key={property.slug}>
                    <PropertyCard property={property} cityFilters={filters} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[4px] bg-tr-cream px-6 py-16 text-center">
                <p className="text-[17px] font-semibold text-tr-ink">
                  {ui.properties.emptyTitle}
                </p>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-neutral-600">
                  {ui.properties.emptyHint}
                </p>
                {hasSecondaryFilters ? (
                  <button
                    type="button"
                    onClick={clearSecondaryFilters}
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-[3px] bg-tr-ink px-5 text-[14px] font-medium text-white transition-colors hover:bg-black"
                  >
                    {ui.properties.clearFilters}
                  </button>
                ) : null}
              </div>
            )}
          </div>

          {/* Columna de filtros: acompaña el scroll; nunca más alta que la pantalla */}
          <aside className="hidden w-[276px] shrink-0 self-stretch lg:block xl:w-[300px]">
            <div className="sticky top-[96px] mt-[38px]">
              <PropertiesFilterPanel
                {...panelProps}
                resultCount={visible.length}
                className="max-h-[calc(100dvh-120px)]"
              />
            </div>
          </aside>
        </div>
      </div>

      <PropertiesFilterDrawer
        {...panelProps}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
