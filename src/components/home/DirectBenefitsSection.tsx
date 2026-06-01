import { FormattedText } from "@/components/content/FormattedText";
import type { HomeDirectBenefitsContent } from "@/lib/pageContent/homeTypes";

type Props = {
  content: HomeDirectBenefitsContent;
};

export function DirectBenefitsSection({ content }: Props) {
  return (
    <section className="bg-white px-6 py-16 sm:px-8 lg:px-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-left text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {content.cards.map((card) => (
            <li
              key={card.title}
              className="rounded-xl bg-[#F8F8F8] px-5 py-6 lg:px-6 lg:py-7"
            >
              <h3 className="text-[15px] font-bold leading-snug text-neutral-950 lg:text-base">
                <FormattedText value={card.title} as="inline" />
              </h3>
              <FormattedText
                value={card.text}
                className="mt-3 block text-[14px] leading-relaxed text-neutral-600 lg:text-[15px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
