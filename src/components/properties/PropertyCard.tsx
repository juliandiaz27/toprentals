"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import { cityDisplayLabel } from "@/lib/pageContent/propertyCityFilters";
import type { PropertyListing } from "@/lib/properties/catalog";

type Props = {
  property: PropertyListing;
  cityFilters?: PropiedadesFiltersContent;
};

/** Valor de la cifra «Unidades» de la ficha, si está cargada. */
function unitsValue(property: PropertyListing): string {
  const stat = property.detail?.stats?.find((s) =>
    /unidad|unit/i.test(s.label),
  );
  const value = String(stat?.value ?? "").trim();
  return value && value !== "—" ? value : "";
}

export function PropertyCard({ property, cityFilters = [] }: Props) {
  const { ui } = useLanguage();
  const cityBadge = cityDisplayLabel(property.city, cityFilters);
  if (property.comingSoon) {
    return (
      <article className="flex min-h-[280px] flex-col overflow-hidden rounded-[4px] bg-tr-cream">
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <p className="max-w-[220px] text-center text-[15px] font-medium text-neutral-600">
            {property.name}
          </p>
        </div>
      </article>
    );
  }

  /* Destacadas (oferta / más solicitada) van con fondo celeste, como en el Figma */
  const highlight = property.hasOffer
    ? ui.properties.offer
    : property.isPopular
      ? ui.properties.popular
      : "";
  const units = unitsValue(property);
  const location = [property.neighborhood, property.city].filter(Boolean).join(", ");
  const tags = (property.detail?.tags ?? [])
    .map((tag) => tag.trim())
    .filter((tag) => tag && tag !== property.neighborhood && tag !== property.city)
    .slice(0, 4);
  const href = `/propiedades/${property.slug}`;

  return (
    <article
      className={`group h-full overflow-hidden rounded-[4px] transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${
        highlight ? "bg-tr-sky" : "bg-tr-cream"
      }`}
    >
      <Link
        href={href}
        className="relative block aspect-[276/163] overflow-hidden bg-neutral-200"
        aria-label={`${ui.properties.viewProperty} ${property.name}`}
      >
        {property.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.imageSrc}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="pointer-events-none absolute right-3 top-3 flex gap-1.5">
          {highlight ? (
            <span className="rounded-full bg-white px-3 py-1 text-[11px] text-tr-ink">
              {highlight}
            </span>
          ) : null}
          <span className="rounded-full bg-tr-sky px-3 py-1 text-[11px] text-tr-ink">
            {cityBadge}
          </span>
        </div>
      </Link>
      <div className="px-4 pb-5 pt-4 text-tr-ink">
        <h3 className="text-[16px] font-semibold leading-snug">{property.name}</h3>
        {location ? <p className="mt-0.5 text-[12px]">{location}</p> : null}
        {units ? (
          <p className="text-[12px]">
            {units} {ui.properties.units.toLowerCase()}
          </p>
        ) : null}
        {tags.length > 0 ? (
          <p className="mt-0.5 text-[11px] text-tr-ink/80">{tags.join(" · ")}</p>
        ) : null}
        <Link
          href={href}
          className="mt-3 inline-flex text-[13px] font-semibold hover:underline"
        >
          {ui.properties.viewDetails}
        </Link>
      </div>
    </article>
  );
}
