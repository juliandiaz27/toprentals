import { FormattedText } from "@/components/content/FormattedText";
import { CheckCircleIcon } from "@/components/brand/BrandShapes";
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

/** Colores de tarjeta en el orden del Figma (verde, naranja, ámbar, rojo). */
const CARD_COLORS = ["bg-tr-green", "bg-tr-orange", "bg-tr-amber", "bg-tr-red"];

export function HomeBelowSearchSection({
  differentials,
  featured,
  properties,
}: Props) {

  return (
    <>
      <div data-reveal className="bg-white">
        <div className="relative mx-auto w-full max-w-[1440px] px-5 py-14 md:px-10 lg:px-16 lg:py-16">
        {/* Diferenciales */}
        <header className="text-center">
          <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.5rem)]">
            <FormattedText value={differentials.title} as="inline" />
          </h2>
          {differentials.subtitle ? (
            <p className="tr-subheading mt-2 text-[15px] text-tr-ink lg:text-base">
              <FormattedText value={differentials.subtitle} as="inline" />
            </p>
          ) : null}
        </header>

        <div className="relative mt-10 lg:px-11">
          <span
            className="pointer-events-none absolute -top-11 left-0 hidden h-[192px] w-[201px] bg-tr-cream [border-top-right-radius:100%_100%] lg:block"
            aria-hidden
          />
          <ul
            className={`relative grid gap-3.5 ${differentialCardsGridClass(differentials.cards.length)}`}
          >
            {differentials.cards.map((card, index) => (
              <li
                key={`${card.title}-${index}`}
                className={`rounded-lg px-7 py-6 text-white ${CARD_COLORS[index % CARD_COLORS.length]}`}
              >
                <CheckCircleIcon className="mb-4 h-6 w-6" />
                <h3 className="text-[15px] font-semibold uppercase leading-snug">
                  <FormattedText value={card.title} as="inline" />
                </h3>
                <p className="text-[14px] leading-snug text-white/90">
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
