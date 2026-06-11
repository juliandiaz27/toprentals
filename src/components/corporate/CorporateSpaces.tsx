import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateSpacesContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateSpacesContent };

export function CorporateSpaces({ content }: Props) {
  return (
    <section data-reveal className="bg-[#E0E0E0] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="max-w-3xl text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <FormattedText
          value={content.subtitle}
          className="mt-4 block max-w-2xl text-[15px] leading-relaxed text-neutral-600"
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-3 lg:gap-6">
          {content.cards.map((card) => (
            <li
              key={card}
              className="flex min-h-16 items-center rounded-lg bg-white px-5 py-4 text-left text-[14px] font-semibold leading-snug text-neutral-950"
            >
              <FormattedText value={card} as="inline" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
