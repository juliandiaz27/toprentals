import Link from "next/link";
import { ClubBottomCta } from "@/components/club/ClubBottomCta";
import { FormattedText } from "@/components/content/FormattedText";
import type { ClubBottomCtaContent, ClubFeaturedContent } from "@/lib/pageContent/clubTypes";
import type { PropertyListing } from "@/lib/properties/catalog";

type Props = {
  content: ClubFeaturedContent;
  bottomCta: ClubBottomCtaContent;
  properties: PropertyListing[];
};

function propertyHref(property: PropertyListing): string {
  if (property.comingSoon) return "/propiedades";
  return `/propiedades/${property.slug}`;
}

export function ClubPropertiesStrip({ content, bottomCta, properties }: Props) {
  const visible = properties.filter((p) => !p.hidden).slice(0, 5);

  return (
    <section className="bg-white px-6 py-14 lg:px-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-4 text-left"
        >
          <h2 className="text-left text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h2>
          <Link
            href={content.linkHref}
            className="text-[14px] font-medium text-neutral-950 hover:underline"
          >
            {content.linkLabel} →
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {visible.map((property, index) => (
            <li key={property.slug} data-reveal data-reveal-delay={String(40 + index * 30)}>
              <Link
                href={propertyHref(property)}
                className="group flex flex-col overflow-hidden rounded-xl bg-neutral-200"
              >
                <div className="relative aspect-[4/5] w-full bg-neutral-100">
                  {property.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.imageSrc}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : null}
                  {property.neighborhood ? (
                    <span className="absolute left-2 top-2 rounded bg-neutral-950 px-2 py-0.5 text-[11px] font-semibold text-white">
                      {property.neighborhood}
                    </span>
                  ) : null}
                </div>
                <div className="px-3 py-3 text-left">
                  <p className="text-[14px] font-bold text-neutral-950">
                    {property.name}
                  </p>
                  {property.city ? (
                    <p className="mt-0.5 text-[12px] text-neutral-600">
                      {property.city}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <ClubBottomCta content={bottomCta} />
      </div>
    </section>
  );
}
