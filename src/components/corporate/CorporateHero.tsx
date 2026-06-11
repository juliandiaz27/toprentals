import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateHeroContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateHeroContent };

/** Hero corporativo: un solo bloque negro (texto, CTAs, divisor, barra de features). */
export function CorporateHero({ content }: Props) {
  return (
    <section className="bg-[#111111] text-white">
      <div data-reveal className="mx-auto w-full max-w-[1440px] px-6 pt-14 lg:px-12 lg:pt-20">
        <p className="inline-flex rounded-full border border-white/30 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
          <FormattedText value={content.label} as="inline" />
        </p>
        <h1 className="mt-8 max-w-3xl text-[clamp(2.125rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-tight">
          <FormattedText value={content.title} as="inline" />
        </h1>
        <FormattedText
          value={content.subtitle}
          className="mt-6 block max-w-2xl text-base leading-relaxed text-[#AAAAAA] lg:text-[17px]"
        />
        <div className="mt-10 flex flex-wrap gap-3">
          {content.ctas.map((cta) => (
            <Link
              key={`${cta.variant}-${cta.label}`}
              href={cta.href}
              className={
                cta.variant === "primary"
                  ? "inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-[14px] font-semibold text-neutral-950 hover:bg-neutral-100"
                  : "inline-flex h-11 items-center justify-center rounded-lg border border-white/50 bg-transparent px-6 text-[14px] font-medium text-white hover:border-white/70 hover:bg-white/5"
              }
            >
              {cta.label} →
            </Link>
          ))}
        </div>
      </div>

      <div
        className="mt-10 w-full border-t border-solid border-[#EEEEEE]"
        role="separator"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-8 lg:px-12 lg:pb-24 lg:pt-10">
        <ul
          data-reveal
          data-reveal-delay="100"
          className="grid gap-4 rounded-xl bg-[#F8F8F8] px-6 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:px-8 lg:py-7"
        >
          {content.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 text-[13px] leading-snug text-neutral-900 lg:text-[14px]"
            >
              <span className="shrink-0 text-[15px] text-neutral-950" aria-hidden>
                ✔
              </span>
              <FormattedText value={feature} as="inline" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
