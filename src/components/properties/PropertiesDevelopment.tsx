import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { PropiedadesDevelopmentContent } from "@/lib/pageContent/propiedadesTypes";

type Props = {
  content: PropiedadesDevelopmentContent;
};

export function PropertiesDevelopment({ content }: Props) {
  const ctaText = content.ctaLabel.replace(/\s*→\s*$/, "");

  return (
    <section className="mt-16 border-t border-neutral-200 pt-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {content.label}
      </p>
      <h2 className="mt-3 flex items-center gap-2 text-xl font-bold text-neutral-950">
        <span className="text-amber-500" aria-hidden>
          ★
        </span>
        <FormattedText value={content.title} as="inline" />
      </h2>
      <FormattedText
        value={content.description}
        className="mt-3 block max-w-2xl text-[15px] leading-relaxed text-neutral-600"
      />
      <Link
        href={content.ctaHref}
        className="mt-5 inline-flex text-[15px] font-medium text-neutral-950 hover:underline"
      >
        {ctaText} →
      </Link>
    </section>
  );
}
