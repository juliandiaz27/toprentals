import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { NosotrosPageContent } from "@/lib/pageContent/nosotrosTypes";

type Props = { content: NosotrosPageContent["hero"] };

function ctaLabel(label: string) {
  return label.replace(/\s*→\s*$/, "").trim();
}

export function NosotrosHero({ content }: Props) {
  return (
    <section className="bg-[#F5F5F5] px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div data-reveal>
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h1>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-neutral-700 lg:text-base">
            {content.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link
            href={content.ctaHref}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-btn px-6 text-[14px] font-semibold text-white hover:bg-btn-hover"
          >
            {ctaLabel(content.ctaLabel)} →
          </Link>
        </div>

        <ul
          data-reveal
          data-reveal-delay="100"
          className="grid grid-cols-2 gap-x-8 gap-y-10 lg:gap-y-12"
        >
          {content.stats.map((stat) => (
            <li key={stat.value + stat.label}>
              <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none text-neutral-950">
                {stat.value}
              </p>
              <p className="mt-2 text-[14px] leading-snug text-neutral-600 lg:text-[15px]">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
