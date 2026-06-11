import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateFeaturesContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateFeaturesContent };

export function CorporateFeaturesGrid({ content }: Props) {
  return (
    <section data-reveal className="bg-[#E0E0E0] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {content.items.map((item) => (
            <li key={item.title}>
              <h3 className="text-[15px] font-bold leading-snug text-neutral-950 lg:text-base">
                <FormattedText value={item.title} as="inline" />
              </h3>
              <FormattedText
                value={item.text}
                className="mt-2 block text-[14px] leading-relaxed text-neutral-600 lg:text-[15px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
