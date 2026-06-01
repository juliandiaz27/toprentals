import Link from "next/link";
import type { PropertyListing } from "@/lib/properties/catalog";

type Props = {
  property: PropertyListing;
};

export function PropertyCard({ property }: Props) {
  if (property.comingSoon) {
    return (
      <article className="flex min-h-[320px] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        <div className="flex flex-1 items-center justify-center bg-neutral-200 px-6 py-12">
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
    <article className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="relative aspect-[4/3] bg-neutral-200">
        {property.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.imageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : null}
        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[12px] font-medium text-neutral-900 shadow-sm">
          {property.city}
        </span>
      </div>
      <div className="px-4 py-4">
        <h3 className="text-[17px] font-bold leading-snug text-neutral-950">
          {property.name}
        </h3>
        {locationLine ? (
          <p className="mt-1 text-[14px] text-neutral-500">{locationLine}</p>
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
