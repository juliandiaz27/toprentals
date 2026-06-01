import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateDesignedForContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateDesignedForContent };

export function CorporateDesignedFor({ content }: Props) {
  return (
    <section data-reveal className="bg-white px-6 pb-16 pt-14 lg:px-12 lg:pb-20 lg:pt-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <p className="mt-5 text-[15px] text-[#AAAAAA] lg:mt-6">{content.intro}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-neutral-900 marker:text-neutral-950 lg:mt-5">
          {content.items.map((item) => (
            <li key={item} className="pl-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-[#AAAAAA] lg:mt-12">
          {content.closing}
        </p>
      </div>
    </section>
  );
}
