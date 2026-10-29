import { FormattedText } from "@/components/content/FormattedText";
import { BenefitShape } from "@/components/brand/BrandShapes";
import type { HomeDirectBenefitsContent } from "@/lib/pageContent/homeTypes";

type Props = {
  content: HomeDirectBenefitsContent;
};

const SHAPE_STYLES = [
  "h-5 w-[52px] text-tr-orange",
  "h-7 w-[42px] text-tr-amber",
  "h-[30px] w-7 text-tr-red",
  "h-[26px] w-[42px] text-tr-sky",
];

export function DirectBenefitsSection({ content }: Props) {
  return (
    <section data-reveal className="bg-white px-6 py-16 sm:px-8 lg:px-16 lg:pb-20 lg:pt-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="tr-heading text-center text-[clamp(1.25rem,2vw,1.5rem)]">
          <FormattedText value={content.title} as="inline" />
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {content.cards.map((card, index) => (
            <li
              key={card.title}
              className="rounded-lg bg-tr-cream px-5 pb-7 pt-10"
            >
              <div className="flex h-[30px] items-end">
                <BenefitShape
                  variant={index}
                  className={SHAPE_STYLES[index % SHAPE_STYLES.length]}
                />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold uppercase leading-snug text-tr-ink">
                <FormattedText value={card.title} as="inline" />
              </h3>
              <FormattedText
                value={card.text}
                className="mt-2 block text-[13px] leading-snug text-tr-ink"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
