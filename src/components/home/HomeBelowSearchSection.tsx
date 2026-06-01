import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type {
  HomeDifferentialsContent,
  HomeFeaturedContent,
} from "@/lib/pageContent/homeTypes";
import { PROPERTY_LISTINGS, type PropertyListing } from "@/lib/properties/catalog";
import { HomeFeaturedPropertyCard } from "./HomeFeaturedPropertyCard";

type Props = {
  differentials: HomeDifferentialsContent;
  featured: HomeFeaturedContent;
};

const FEATURED_SLUGS = [
  "belgrano",
  "wow-nunez",
  "dorrego",
  "montaneses",
  "qorner",
] as const;

function pickFeaturedProperties(): PropertyListing[] {
  const bySlug = new Map(
    PROPERTY_LISTINGS.filter((p) => !p.comingSoon).map((p) => [p.slug, p]),
  );
  const ordered = FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (p): p is PropertyListing => p != null,
  );
  if (ordered.length >= 5) return ordered.slice(0, 5);
  const rest = PROPERTY_LISTINGS.filter(
    (p) =>
      !p.comingSoon &&
      !FEATURED_SLUGS.includes(p.slug as (typeof FEATURED_SLUGS)[number]),
  );
  return [...ordered, ...rest].slice(0, 5);
}

export function HomeBelowSearchSection({ differentials, featured }: Props) {
  const properties = pickFeaturedProperties();

  return (
    <>
      <div data-reveal className="border-b border-neutral-200 bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-10 md:py-12">
        {/* Diferenciales */}
        <div>
          <h2 className="text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold leading-tight text-neutral-950">
            <FormattedText value={differentials.title} as="inline" />
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {differentials.cards.map((card) => (
              <li
                key={card.title}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-6"
              >
                <span
                  className="mb-4 inline-block h-10 w-10 rounded-md bg-neutral-100"
                  aria-hidden
                />
                <h3 className="text-[15px] font-bold text-neutral-950">{card.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                  {card.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Propiedades destacadas */}
        <div className="mt-14 md:mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold leading-tight text-neutral-950">
              <FormattedText value={featured.title} as="inline" />
            </h2>
            <Link
              href={featured.linkHref}
              className="text-[14px] font-medium text-neutral-950 hover:underline"
            >
              {featured.linkLabel}
            </Link>
          </div>
          <ul className="mt-8 flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
            {properties.map((property) => (
              <li key={property.slug} className="w-[42vw] shrink-0 sm:w-[28vw] lg:w-auto">
                <HomeFeaturedPropertyCard property={property} />
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>
    </>
  );
}
