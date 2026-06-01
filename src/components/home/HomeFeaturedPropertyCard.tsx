import Link from "next/link";
import type { PropertyListing } from "@/lib/properties/catalog";

type Props = {
  property: PropertyListing;
};

/** Tarjeta compacta para el carrusel bajo el buscador (Figma). */
export function HomeFeaturedPropertyCard({ property }: Props) {
  return (
    <article className="flex min-w-[min(100%,200px)] flex-1 flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-200">
        {property.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.imageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <h3 className="mt-4 text-[15px] font-bold leading-snug text-neutral-950">
        {property.name}
      </h3>
      <Link
        href={`/propiedades/${property.slug}`}
        className="mt-1 inline-flex text-[14px] font-medium text-neutral-950 hover:underline"
      >
        Ver detalles →
      </Link>
    </article>
  );
}
