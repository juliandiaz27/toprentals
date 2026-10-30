import Link from "next/link";
import type { CSSProperties } from "react";
import { FormattedText } from "@/components/content/FormattedText";
import { BrandArchStack } from "@/components/brand/BrandShapes";
import type { CorporateDesignedForContent } from "@/lib/pageContent/corporateTypes";

type Props = {
  content: CorporateDesignedForContent;
  ctaLabel: string;
  ctaHref: string;
};

export function CorporateDesignedFor({ content, ctaLabel, ctaHref }: Props) {
  /* Dos columnas que se llenan de arriba hacia abajo (como en el Figma) */
  const rows = Math.ceil(content.items.length / 2);

  return (
    <section data-reveal className="relative bg-white px-6 pb-12 pt-12 lg:px-16 lg:pb-14 lg:pt-14">
      <BrandArchStack className="pointer-events-none absolute right-[4%] top-[48%] hidden h-[86px] w-[47px] text-tr-green lg:block" />
      <div className="mx-auto w-full max-w-[1440px] lg:pl-6">
        <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] [&_em]:text-[1.25em]">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <FormattedText
          value={content.intro}
          className="mt-1 block text-[14px] tracking-[0.03em] text-tr-ink"
        />
        <ul
          className="mt-6 grid max-w-[1000px] gap-x-16 gap-y-2.5 text-[14px] text-tr-ink lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(var(--rows),auto)]"
          style={{ "--rows": rows } as CSSProperties}
        >
          {content.items.map((item) => (
            <li key={item} className="flex items-baseline gap-3">
              <span className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full bg-tr-green" aria-hidden />
              <FormattedText value={item} as="inline" />
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Link
            href={ctaHref}
            className="inline-flex h-[42px] min-w-[200px] items-center justify-center rounded-[2px] bg-tr-sky px-6 text-[13px] font-medium text-tr-ink transition hover:brightness-95"
          >
            {ctaLabel.replace(/\s*→\s*$/, "").trim()} →
          </Link>
          <FormattedText value={content.closing} className="block text-[12px] text-tr-ink" />
        </div>
      </div>
    </section>
  );
}
