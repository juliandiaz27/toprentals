"use client";

import { useState, type ReactNode } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
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
          ? "bg-tr-sky text-tr-ink"
          : "bg-white text-tr-ink ring-1 ring-black/10 hover:ring-black/25"
      }`}
    >
      {label}
      {count != null ? (
        <span
          className={`text-[11px] font-semibold tabular-nums ${
            active ? "text-tr-ink/60" : "text-neutral-400"
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
          ? "bg-white ring-1 ring-black/10"
          : "hover:bg-white/70"
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
  /** Muestra el encabezado como botón para plegar la sección. */
  collapsible?: boolean;
};

function FilterSection({
  title,
  children,
  showDivider = true,
  collapsible = false,
}: SectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <section className={showDivider ? "border-t border-neutral-200 pt-5" : ""}>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mb-3 flex w-full items-center justify-between text-left text-[13px] font-semibold text-neutral-900"
        >
          {title}
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
            className={`h-3.5 w-3.5 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <h3 className="mb-3 text-[13px] font-semibold text-neutral-900">{title}</h3>
      )}
      {open ? children : null}
    </section>
  );
}

/** Opciones visibles antes de «Ver más». */
const VISIBLE_OPTIONS = 5;

type OptionListProps = {
  allLabel: string;
  allCount: number;
  options: PropertyFilterOptionWithCount[];
  active: PropertyFilterId;
  onChange: (id: PropertyFilterId) => void;
  moreLabel: string;
  lessLabel: string;
};

/** Lista con «Todos» + opciones; las largas se recortan con «Ver más». */
function FilterOptionList({
  allLabel,
  allCount,
  options,
  active,
  onChange,
  moreLabel,
  lessLabel,
}: OptionListProps) {
  const [expanded, setExpanded] = useState(false);
  const activeIndex = options.findIndex((o) => o.id === active);
  // Si la opción elegida quedó fuera del recorte, se muestra todo
  const showAll = expanded || activeIndex >= VISIBLE_OPTIONS;
  const shown = showAll ? options : options.slice(0, VISIBLE_OPTIONS);
  const hidden = options.length - VISIBLE_OPTIONS;

  return (
    <div className="space-y-0.5">
      <FilterListOption
        label={allLabel}
        count={allCount}
        active={active === PROPERTY_FILTER_ALL}
        onClick={() => onChange(PROPERTY_FILTER_ALL)}
      />
      {shown.map((option) => (
        <FilterListOption
          key={option.id}
          label={option.label}
          count={option.count}
          active={active === option.id}
          onClick={() => onChange(option.id)}
        />
      ))}
      {hidden > 0 && activeIndex < VISIBLE_OPTIONS ? (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="px-3 pt-1.5 text-[13px] font-medium text-tr-ink underline underline-offset-2 hover:opacity-70"
        >
          {expanded ? lessLabel : `${moreLabel} (${hidden})`}
        </button>
      ) : null}
    </div>
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
  /** Resultados con los filtros actuales (se muestra en el encabezado). */
  resultCount?: number;
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
  resultCount,
  className = "",
}: PropertiesFilterPanelProps) {
  const { ui, lang } = useLanguage();
  const moreLabel = lang === "en" ? "Show more" : "Ver más";
  const lessLabel = lang === "en" ? "Show less" : "Ver menos";
  const totalInCity =
    cityActive === PROPERTY_FILTER_ALL
      ? cityOptions.reduce((sum, o) => sum + o.count, 0)
      : (cityOptions.find((o) => o.id === cityActive)?.count ?? 0);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[4px] bg-tr-cream ${className}`}
      role="region"
      aria-label={ui.properties.filterAria}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 bg-tr-ink px-6 py-4 text-white">
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
          <p className="text-[12px] font-medium uppercase tracking-[0.06em]">
            {ui.properties.filters}
          </p>
          {resultCount != null ? (
            <span className="text-[12px] text-white/70" aria-live="polite">
              · {resultCount} {lang === "en" ? "results" : "resultados"}
            </span>
          ) : null}
        </div>
        {hasSecondaryFilters ? (
          <button
            type="button"
            onClick={onClearSecondaryFilters}
            className="text-[12px] font-medium text-white/80 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
          >
            {ui.common.clear}
          </button>
        ) : null}
      </div>

      {/* Scroll propio si el panel no entra en la pantalla */}
      <div className="min-h-0 space-y-5 overflow-y-auto overscroll-contain p-5">
        <FilterSection title={ui.properties.location} showDivider={false}>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              label={ui.properties.all}
              active={cityActive === PROPERTY_FILTER_ALL}
              onClick={() => onCityChange(PROPERTY_FILTER_ALL)}
            />
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
          <FilterSection title={ui.properties.neighborhood} collapsible>
            <FilterOptionList
              allLabel={ui.properties.allNeighborhoods}
              allCount={totalInCity}
              options={neighborhoodOptions}
              active={neighborhoodActive}
              onChange={onNeighborhoodChange}
              moreLabel={moreLabel}
              lessLabel={lessLabel}
            />
          </FilterSection>
        ) : null}

        {categoryOptions.length > 0 ? (
          <FilterSection title={ui.properties.category} collapsible>
            <FilterOptionList
              allLabel={ui.properties.allTypologies}
              allCount={totalInCity}
              options={categoryOptions}
              active={categoryActive}
              onChange={onCategoryChange}
              moreLabel={moreLabel}
              lessLabel={lessLabel}
            />
          </FilterSection>
        ) : null}
      </div>
    </div>
  );
}
