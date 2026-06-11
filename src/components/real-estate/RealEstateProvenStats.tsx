import { FormattedText } from "@/components/content/FormattedText";
import type { RealEstateProvenContent } from "@/lib/pageContent/realEstateTypes";

type Props = { content: RealEstateProvenContent };

export function RealEstateProvenStats({ content }: Props) {
  return (
    <section data-reveal className="bg-[#111111] px-6 py-14 text-white lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-[clamp(1.5rem,2.8vw,2.125rem)] font-bold leading-tight">
          <FormattedText value={content.title} as="inline" />
        </h2>
        {content.intro ? (
          <FormattedText
            value={content.intro}
            className="mt-4 block max-w-2xl text-[15px] leading-relaxed text-[#AAAAAA]"
          />
        ) : null}
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {content.stats.map((stat, index) => (
            <li
              key={`${stat.value}-${stat.label}`}
              className={`flex flex-col ${
                index > 0 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""
              }`}
            >
              <p className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-tight">
                <FormattedText value={stat.value} as="inline" />
              </p>
              <p className="mt-3 text-[13px] leading-snug text-[#AAAAAA] lg:text-[14px]">
                <FormattedText value={stat.label} as="inline" />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
