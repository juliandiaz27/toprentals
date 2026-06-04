import Link from "next/link";
import type { PropiedadesFiltersContent } from "@/lib/pageContent/propiedadesTypes";
import { cityDisplayLabel } from "@/lib/pageContent/propertyCityFilters";
import type { PropertyListing } from "@/lib/properties/catalog";
import { PropertyHighlightBadges } from "@/components/properties/PropertyHighlightBadges";

type Props = {
  property: PropertyListing;
  cityFilters?: PropiedadesFiltersContent;
};

export function PropertyCard({ property, cityFilters = [] }: Props) {
  const cityBadge = cityDisplayLabel(property.city, cityFilters);
  if (property.comingSoon) {
    return (
      <article className="flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        <div className="flex flex-1 items-center justify-center bg-neutral-100 px-6 py-16">
          <p className="max-w-[220px] text-center text-[15px] font-medium text-neutral-600">
            {property.name}
          </p>
        </div>
      </article>
    );
  }

  const locationLine = [property.neighborhood, property.address]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {property.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.imageSrc}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
        <div className="absolute left-3 top-3 z-[1]">
          <PropertyHighlightBadges
            hasOffer={property.hasOffer}
            isPopular={property.isPopular}
            size="sm"
          />
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 shadow-sm">
          {cityBadge}
        </span>
      </div>
      <div className="px-4 py-4 md:px-5 md:py-5">
        <h3 className="text-[17px] font-bold leading-snug text-neutral-950">
          {property.name}
        </h3>
        {locationLine ? (
          <p className="mt-1.5 text-[14px] text-neutral-500">{locationLine}</p>
        ) : null}
        <Link
          href={`/propiedades/${property.slug}`}
          className="mt-4 inline-flex text-[14px] font-medium text-neutral-950 hover:underline"
        >
          Ver detalles →
        </Link>
      </div>
    </article>
  );
}
