"use client";

import { FormattedText } from "@/components/content/FormattedText";
import { BrandArchStack } from "@/components/brand/BrandShapes";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { PropiedadesHeroContent } from "@/lib/pageContent/propiedadesTypes";
import type { PropertyAudience } from "@/lib/properties/catalogTypes";
import {
  PROPERTY_FILTER_ALL,
  type PropertyFilterId,
  type PropertyFilterOptionWithCount,
} from "@/lib/properties/propertyListingFilters";

export type HeroZoneGroup = {
  cityId: string;
  label: string;
  neighborhoods: PropertyFilterOptionWithCount[];
};

type Props = {
  hero: PropiedadesHeroContent;
  zoneGroups: HeroZoneGroup[];
  cityId: PropertyFilterId;
  neighborhoodId: PropertyFilterId;
  onZoneChange: (cityId: PropertyFilterId, neighborhoodId: PropertyFilterId) => void;
  categoryOptions: PropertyFilterOptionWithCount[];
  categoryId: PropertyFilterId;
  onCategoryChange: (id: PropertyFilterId) => void;
  /** 0 = ninguna propiedad tiene capacidad cargada → se oculta el campo. */
  maxGuests: number;
  guests: number;
  onGuestsChange: (guests: number) => void;
  /** Vacío = ninguna propiedad tiene «Ideal para» → se oculta el campo. */
  audienceOptions: PropertyAudience[];
  audience: PropertyAudience | "";
  onAudienceChange: (audience: PropertyAudience | "") => void;
  onSubmit: () => void;
};

const LABELS = {
  es: {
    zone: "Ciudad / Zona",
    allZones: "Todas las ciudades",
    allIn: "Todo",
    unitType: "Tipo de unidad",
    allTypes: "Studio, 2 amb, 3 amb…",
    guests: "Huéspedes",
    anyGuests: "¿Cuántos viajan?",
    guest: "huésped",
    guestsPlural: "huéspedes",
    audience: "Disponibilidad",
    audiences: { grupos: "Grupos", solo: "Solo", familia: "Familia" },
    search: "Buscar",
  },
  en: {
    zone: "City / Area",
    allZones: "All cities",
    allIn: "All of",
    unitType: "Unit type",
    allTypes: "Studio, 1 bed, 2 bed…",
    guests: "Guests",
    anyGuests: "How many travelers?",
    guest: "guest",
    guestsPlural: "guests",
    audience: "Ideal for",
    audiences: { grupos: "Groups", solo: "Solo", familia: "Family" },
    search: "Search",
  },
};

/** Separador para codificar país + barrio en un único <select>. */
const SEP = "::";

/** Campo de la barra: separador vertical entre campos en desktop. */
const fieldClass =
  "block min-w-0 border-neutral-300 px-2 lg:flex-1 lg:border-r lg:px-5 lg:first:pl-2 lg:[&:nth-last-child(2)]:border-r-0";

const selectClass =
  "h-9 w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[14px] text-tr-ink focus:outline-none";

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PropertiesHero({
  hero,
  zoneGroups,
  cityId,
  neighborhoodId,
  onZoneChange,
  categoryOptions,
  categoryId,
  onCategoryChange,
  maxGuests,
  guests,
  onGuestsChange,
  audienceOptions,
  audience,
  onAudienceChange,
  onSubmit,
}: Props) {
  const { lang } = useLanguage();
  const t = lang === "en" ? LABELS.en : LABELS.es;
  const hasImage = Boolean(hero.imageSrc) && !hero.imageSrc.includes("placeholders");
  const zoneValue = `${cityId}${SEP}${neighborhoodId}`;

  return (
    <section className="relative isolate overflow-hidden bg-tr-green text-white">
      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.imageSrc}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <span className="absolute inset-0 -z-10 bg-black/15" aria-hidden />
        </>
      ) : null}

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-10 pt-16 lg:px-16 lg:pb-11 lg:pt-[170px]">
        <BrandArchStack className="pointer-events-none absolute right-[16%] top-[70px] hidden h-[86px] w-[47px] text-tr-amber lg:block" />

        <h1 className="font-display text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-tight">
          <FormattedText value={hero.title} as="inline" />
        </h1>
        {hero.subtitle ? (
          <FormattedText
            value={hero.subtitle}
            className="mt-1 block max-w-2xl text-[15px] text-white/90 lg:text-base"
          />
        ) : null}

        {/* Barra de filtros (Figma): filtra el listado de abajo */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mt-6 grid gap-3 rounded-[3px] bg-white p-3 text-tr-ink shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:grid-cols-2 lg:mt-7 lg:flex lg:items-center lg:gap-0 lg:py-2 lg:pl-3 lg:pr-2"
        >
          <label className={fieldClass}>
            <span className="block text-[9px] font-medium uppercase tracking-[0.06em] text-neutral-500">
              {t.zone}
            </span>
            <span className="relative block">
              <select
                value={zoneValue}
                onChange={(e) => {
                  const [nextCity, nextHood] = e.target.value.split(SEP);
                  onZoneChange(nextCity ?? PROPERTY_FILTER_ALL, nextHood ?? PROPERTY_FILTER_ALL);
                }}
                className={selectClass}
              >
                <option value={`${PROPERTY_FILTER_ALL}${SEP}${PROPERTY_FILTER_ALL}`}>
                  {zoneGroups.map((g) => g.label).join(" · ") || t.allZones}
                </option>
                {zoneGroups.map((group) => (
                  <optgroup key={group.cityId} label={group.label}>
                    <option value={`${group.cityId}${SEP}${PROPERTY_FILTER_ALL}`}>
                      {t.allIn} {group.label}
                    </option>
                    {group.neighborhoods.map((hood) => (
                      <option key={hood.id} value={`${group.cityId}${SEP}${hood.id}`}>
                        {hood.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <Chevron />
            </span>
          </label>

          <label className={fieldClass}>
            <span className="block text-[9px] font-medium uppercase tracking-[0.06em] text-neutral-500">
              {t.unitType}
            </span>
            <span className="relative block">
              <select
                value={categoryId}
                onChange={(e) => onCategoryChange(e.target.value)}
                className={selectClass}
              >
                <option value={PROPERTY_FILTER_ALL}>{t.allTypes}</option>
                {categoryOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </span>
          </label>

          {maxGuests > 0 ? (
            <label className={fieldClass}>
              <span className="block text-[9px] font-medium uppercase tracking-[0.06em] text-neutral-500">
                {t.guests}
              </span>
              <span className="relative block">
                <select
                  value={guests}
                  onChange={(e) => onGuestsChange(Number(e.target.value))}
                  className={selectClass}
                >
                  <option value={0}>{t.anyGuests}</option>
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? t.guest : t.guestsPlural}
                    </option>
                  ))}
                </select>
                <Chevron />
              </span>
            </label>
          ) : null}

          {audienceOptions.length > 0 ? (
            <label className={fieldClass}>
              <span className="block text-[9px] font-medium uppercase tracking-[0.06em] text-neutral-500">
                {t.audience}
              </span>
              <span className="relative block">
                <select
                  value={audience}
                  onChange={(e) => onAudienceChange(e.target.value as PropertyAudience | "")}
                  className={selectClass}
                >
                  <option value="">
                    {audienceOptions.map((a) => t.audiences[a]).join(" · ")}
                  </option>
                  {audienceOptions.map((a) => (
                    <option key={a} value={a}>
                      {t.audiences[a]}
                    </option>
                  ))}
                </select>
                <Chevron />
              </span>
            </label>
          ) : null}

          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[3px] bg-tr-ink px-12 text-[14px] font-medium text-white transition hover:bg-black sm:col-span-2 lg:ml-3 lg:h-[52px]"
          >
            {t.search} <span aria-hidden>→</span>
          </button>
        </form>
      </div>
    </section>
  );
}
