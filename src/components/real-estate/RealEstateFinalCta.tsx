import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { RealEstateFinalCtaContent } from "@/lib/pageContent/realEstateTypes";

type Props = { content: RealEstateFinalCtaContent };

export function RealEstateFinalCta({ content }: Props) {
  const external = content.ctaHref.startsWith("http");

  return (
    <section
      id="invertir"
      data-reveal
      className="scroll-mt-24 bg-[#111111] px-6 py-16 text-white lg:px-12 lg:py-20"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold leading-tight tracking-tight">
            <FormattedText value={content.title} as="inline" />
          </h2>
          {content.text ? (
            <FormattedText
              value={content.text}
              className="mt-4 block text-[15px] leading-relaxed text-[#AAAAAA] lg:text-base"
            />
          ) : null}
        </div>
        <Link
          href={content.ctaHref}
          className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-lg bg-white px-6 text-[14px] font-semibold text-neutral-950 hover:bg-neutral-100 lg:self-center"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
