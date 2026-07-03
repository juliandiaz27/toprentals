import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { PropietariosFinalCtaContent } from "@/lib/pageContent/propietariosTypes";

type Props = { content: PropietariosFinalCtaContent };

export function PropietariosFinalCta({ content }: Props) {
  return (
    <section
      data-reveal
      className="border-t border-solid border-[#EEEEEE] bg-white px-6 py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <h2 className="max-w-2xl text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <Link
          href={content.ctaHref}
          className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-lg bg-btn px-6 text-[14px] font-semibold text-white hover:bg-btn-hover lg:self-center"
        >
          {content.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
