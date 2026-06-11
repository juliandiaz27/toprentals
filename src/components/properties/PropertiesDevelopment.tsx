import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { PropiedadesDevelopmentContent } from "@/lib/pageContent/propiedadesTypes";

type Props = {
  content: PropiedadesDevelopmentContent;
};

export function PropertiesDevelopment({ content }: Props) {
  const ctaText = content.ctaLabel.replace(/\s*→\s*$/, "").trim();

  return (
    <section
      data-reveal
      className="border-y border-neutral-200 bg-[#F8F8F8]"
      aria-labelledby="properties-development-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-12 lg:py-10">
        <p className="text-[13px] font-normal text-neutral-500">
          <FormattedText value={content.label} as="inline" />
        </p>
        <h2
          id="properties-development-title"
          className="mt-1 flex items-center gap-1.5 text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold leading-tight text-neutral-950"
        >
          <span className="text-neutral-950" aria-hidden>
            ★
          </span>
          <FormattedText value={content.title} as="inline" />
        </h2>
        <FormattedText
          value={content.description}
          className="mt-2 block max-w-2xl text-[15px] font-normal leading-relaxed text-neutral-600"
        />
        <Link
          href={content.ctaHref}
          className="mt-4 inline-flex text-[13px] font-bold text-neutral-950 hover:underline"
        >
          {ctaText} →
        </Link>
      </div>
    </section>
  );
}
