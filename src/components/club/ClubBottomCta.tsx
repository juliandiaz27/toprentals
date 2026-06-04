import Link from "next/link";
import { CLUB_GOLD } from "@/lib/pageContent/clubTheme";
import type { ClubBottomCtaContent } from "@/lib/pageContent/clubTypes";

type Props = { content: ClubBottomCtaContent };

export function ClubBottomCta({ content }: Props) {
  return (
    <div data-reveal className="mt-10 max-w-3xl text-left">
      <p className="text-[15px] leading-relaxed text-neutral-600 lg:text-base">
        {content.text}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={content.ctaPropertiesHref}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg px-5 text-[14px] font-semibold text-neutral-950 hover:opacity-90"
          style={{ backgroundColor: CLUB_GOLD }}
        >
          <span>{content.ctaPropertiesLabel}</span>
          <span aria-hidden>→</span>
        </Link>
        <Link
          href={content.ctaMemberHref}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-neutral-950 px-5 text-[14px] font-medium text-white hover:bg-neutral-800"
        >
          <span>{content.ctaMemberLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
