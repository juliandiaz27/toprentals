import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import { CLUB_GOLD } from "@/lib/pageContent/clubTheme";
import type { ClubHeroContent } from "@/lib/pageContent/clubTypes";

type Props = { content: ClubHeroContent };

export function ClubHero({ content }: Props) {
  return (
    <section className="bg-[#111111] text-white">
      <div
        data-reveal
        className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-14 text-left lg:px-12 lg:pb-20 lg:pt-20"
      >
        <p
          className="inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-950"
          style={{ backgroundColor: CLUB_GOLD }}
        >
          {content.label}
        </p>
        <h1 className="mt-8 max-w-3xl whitespace-pre-line text-[clamp(2.125rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-tight">
          <FormattedText value={content.title} as="inline" />
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#AAAAAA] lg:text-[17px]">
          {content.subtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={content.ctaJoinHref}
            className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-[14px] font-semibold text-neutral-950 hover:opacity-90"
            style={{ backgroundColor: CLUB_GOLD }}
          >
            {content.ctaJoinLabel}
          </Link>
          <Link
            href={content.ctaMemberHref}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/50 bg-transparent px-6 text-[14px] font-medium text-white hover:border-white/70 hover:bg-white/5"
          >
            {content.ctaMemberLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
