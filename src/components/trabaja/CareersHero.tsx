import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { TrabajaPageContent } from "@/lib/pageContent/trabajaTypes";

type Props = { content: TrabajaPageContent["hero"] };

function ctaLabel(label: string) {
  return label.replace(/\s*↓\s*$/, "").replace(/\s*→\s*$/, "").trim();
}

export function CareersHero({ content }: Props) {
  const showArrow = /↓\s*$/.test(content.ctaLabel);

  return (
    <section className="bg-[#111111] text-white">
      <div
        data-reveal
        className="mx-auto w-full max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20"
      >
        <h1 className="max-w-3xl text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-tight">
          <FormattedText value={content.title} as="inline" />
        </h1>
        <FormattedText
          value={content.subtitle}
          className="mt-6 block max-w-2xl text-base leading-relaxed text-white lg:text-[17px]"
        />
        <p className="mt-4 text-[14px] text-[#AAAAAA]">{content.metaLine}</p>
        <Link
          href={content.ctaHref}
          className="mt-10 inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-[14px] font-semibold text-neutral-950 hover:bg-neutral-100"
        >
          {ctaLabel(content.ctaLabel)}
          {showArrow ? " ↓" : " →"}
        </Link>
      </div>
    </section>
  );
}
