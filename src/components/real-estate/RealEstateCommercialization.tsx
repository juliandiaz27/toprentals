import { FormattedText } from "@/components/content/FormattedText";
import type { RealEstateCommercializationContent } from "@/lib/pageContent/realEstateTypes";

type Props = { content: RealEstateCommercializationContent };

export function RealEstateCommercialization({ content }: Props) {
  return (
    <section data-reveal className="bg-white px-6 pb-14 lg:px-12 lg:pb-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-xl bg-[#F0F0F0] px-6 py-10 lg:px-10 lg:py-12">
          <h2 className="max-w-2xl text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold leading-snug text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h2>
          {content.intro ? (
            <FormattedText
              value={content.intro}
              className="mt-4 block max-w-3xl text-[15px] leading-relaxed text-neutral-700"
            />
          ) : null}
          <ul className="mt-6 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-800 marker:text-neutral-950">
            {content.items.map((item) => (
              <li key={item}>
                <FormattedText value={item} as="inline" />
              </li>
            ))}
          </ul>
          {content.closing ? (
            <FormattedText
              value={content.closing}
              className="mt-8 block text-[15px] font-bold leading-relaxed text-neutral-950"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
