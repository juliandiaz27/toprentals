import { FormattedText } from "@/components/content/FormattedText";
import { differentialCardsGridClass } from "@/lib/pageContent/differentialCards";
import type {
  HomeDifferentialsContent,
  HomeFeaturedContent,
} from "@/lib/pageContent/homeTypes";
import type { PropertyListing } from "@/lib/properties/catalog";
import { HomePropertiesCarousel } from "./HomePropertiesCarousel";

type Props = {
  differentials: HomeDifferentialsContent;
  featured: HomeFeaturedContent;
  properties: PropertyListing[];
};

export function HomeBelowSearchSection({
  differentials,
  featured,
  properties,
}: Props) {

  return (
    <>
      <div data-reveal className="border-b border-neutral-200 bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-10 md:py-12">
        {/* Diferenciales */}
        <div>
          <h2 className="text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold leading-tight text-neutral-950">
            <FormattedText value={differentials.title} as="inline" />
          </h2>
          <ul
            className={`mt-8 grid gap-4 sm:gap-5 ${differentialCardsGridClass(differentials.cards.length)}`}
          >
            {differentials.cards.map((card, index) => (
              <li
                key={`${card.title}-${index}`}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-6"
              >
                <span
                  className="mb-4 inline-block h-10 w-10 rounded-md bg-neutral-100"
                  aria-hidden
                />
                <h3 className="text-[15px] font-bold text-neutral-950">
                  <FormattedText value={card.title} as="inline" />
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                  <FormattedText value={card.text} as="inline" />
                </p>
              </li>
            ))}
          </ul>
        </div>

        </div>
      </div>

      <HomePropertiesCarousel featured={featured} properties={properties} />
    </>
  );
}
