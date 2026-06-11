import { FormattedText } from "@/components/content/FormattedText";
import type { RealEstateOperationDiffContent } from "@/lib/pageContent/realEstateTypes";

type Props = { content: RealEstateOperationDiffContent };

export function RealEstateOperationDiff({ content }: Props) {
  return (
    <section data-reveal className="bg-white px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="max-w-2xl text-[clamp(1.5rem,2.8vw,2.125rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <ul className="mt-8 max-w-2xl space-y-3">
          {content.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-800"
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-[11px] text-white"
                aria-hidden
              >
                ✓
              </span>
              <FormattedText value={item} as="inline" />
            </li>
          ))}
        </ul>
        <FormattedText
          value={content.closing}
          className="mt-10 block max-w-2xl text-[15px] font-bold leading-relaxed text-neutral-950 lg:text-base"
        />
      </div>
    </section>
  );
}
