import { FormattedText } from "@/components/content/FormattedText";
import type { PropiedadesDevelopmentContent } from "@/lib/pageContent/propiedadesTypes";
import { differentialCardsGridClass } from "@/lib/pageContent/propiedadesTypes";
import { DevelopmentNewsletterForm } from "./DevelopmentNewsletterForm";

type Props = {
  content: PropiedadesDevelopmentContent;
};

export function PropertiesDevelopment({ content }: Props) {
  const ctaText = content.ctaLabel.replace(/\s*→\s*$/, "").trim();

  return (
    <section
      data-reveal
      className="border-y border-neutral-200 bg-[#F8F8F8]"
      aria-labelledby="properties-development-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-10 lg:px-12 lg:py-12">
        <p
          id="properties-development-title"
          className="text-[13px] font-normal text-neutral-500"
        >
          <FormattedText value={content.label} as="inline" />
        </p>

        <ul
          className={`mt-6 grid gap-4 sm:gap-5 ${differentialCardsGridClass(content.cards.length)}`}
        >
          {content.cards.map((card, index) => (
            <li
              key={`${card.title}-${index}`}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-6"
            >
              <h3 className="flex items-center gap-1.5 text-[15px] font-bold text-neutral-950">
                <span className="text-neutral-950" aria-hidden>
                  ★
                </span>
                <FormattedText value={card.title} as="inline" />
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                <FormattedText value={card.text} as="inline" />
              </p>
            </li>
          ))}
        </ul>

        {ctaText ? <DevelopmentNewsletterForm ctaLabel={ctaText} /> : null}
      </div>
    </section>
  );
}
