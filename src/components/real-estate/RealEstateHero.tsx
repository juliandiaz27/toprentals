import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { RealEstateHeroContent } from "@/lib/pageContent/realEstateTypes";

type Props = { content: RealEstateHeroContent };

export function RealEstateHero({ content }: Props) {
  return (
    <section className="bg-[#111111] text-white">
      <div
        data-reveal
        className="mx-auto w-full max-w-[1440px] px-6 pt-14 pb-16 lg:px-12 lg:pt-20 lg:pb-20"
      >
        <h1 className="max-w-3xl text-[clamp(2.125rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-tight">
          <FormattedText value={content.title} as="inline" />
        </h1>
        <FormattedText
          value={content.subtitle}
          className="mt-6 block max-w-2xl text-base leading-relaxed text-[#AAAAAA] lg:text-[17px]"
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={content.ctaPrimaryHref}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-[14px] font-semibold text-neutral-950 hover:bg-neutral-100"
          >
            {content.ctaPrimaryLabel}
          </Link>
          <Link
            href={content.ctaSecondaryHref}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/50 bg-transparent px-6 text-[14px] font-medium text-white hover:border-white/70 hover:bg-white/5"
          >
            {content.ctaSecondaryLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
