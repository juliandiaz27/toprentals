import Link from "next/link";
import type { PropertyListing } from "@/lib/properties/catalog";
import { PropertyHighlightBadges } from "@/components/properties/PropertyHighlightBadges";

type Props = {
  property: PropertyListing;
  href: string;
};

/** Tarjeta vertical del carrusel (Figma: imagen + pie con título y enlace). */
export function HomeFeaturedPropertyCard({ property, href }: Props) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl bg-neutral-200">
      <Link
        href={href}
        className="group relative block aspect-[5/6] w-full shrink-0 overflow-hidden bg-neutral-100"
        aria-label={`Ver ${property.name}`}
      >
        {property.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.imageSrc}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
        <div className="pointer-events-none absolute left-3 top-3 z-[1]">
          <PropertyHighlightBadges
            hasOffer={property.hasOffer}
            isPopular={property.isPopular}
            size="sm"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-1 bg-neutral-200 px-4 py-4">
        <h3 className="text-[15px] font-bold leading-snug text-neutral-950">
          {property.name}
        </h3>
        <Link
          href={href}
          className="inline-flex text-[13px] font-normal text-neutral-600 transition hover:text-neutral-950 hover:underline"
        >
          Ver detalles →
        </Link>
      </div>
    </article>
  );
}
