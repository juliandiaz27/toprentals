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
    <article className="flex w-full flex-col overflow-hidden rounded-lg bg-[#111111]">
      <Link
        href={href}
        className="group relative block aspect-[227/192] w-full shrink-0 overflow-hidden bg-neutral-100"
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
      <div className="flex min-h-[96px] flex-col justify-end gap-0.5 px-5 pb-5 pt-6 text-white">
        <h3 className="text-[15px] font-semibold leading-snug">
          {property.name}
        </h3>
        <Link
          href={href}
          className="inline-flex text-[13px] font-normal text-white/85 transition hover:text-white hover:underline"
        >
          Ver detalles →
        </Link>
      </div>
    </article>
  );
}
