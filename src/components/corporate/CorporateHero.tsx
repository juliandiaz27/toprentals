import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import { BENEFIT_SHAPE_STYLES, BenefitShape } from "@/components/brand/BrandShapes";
import type { CorporateHeroContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateHeroContent };

/** Hero corporativo (Figma): foto de fondo, CTAs y barra crema de features. */
export function CorporateHero({ content }: Props) {
  const hasImage = Boolean(content.imageSrc);

  return (
    <section className="relative isolate overflow-hidden bg-tr-green text-white">
      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.imageSrc}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <span className="absolute inset-0 -z-10 bg-black/15" aria-hidden />
        </>
      ) : null}

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-9 pt-10 lg:px-16 lg:pb-12 lg:pt-12">
        <div data-reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="inline-flex rounded-full bg-white/25 px-5 py-1 text-[10px] font-medium uppercase tracking-[0.06em] backdrop-blur-sm">
              <FormattedText value={content.label} as="inline" />
            </p>
            {content.tagline ? (
              <p className="flex items-center gap-2.5 text-[13px] text-white/95">
                <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
                <FormattedText value={content.tagline} as="inline" />
              </p>
            ) : null}
          </div>
          <h1 className="mt-8 max-w-[600px] font-display text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.1]">
            <FormattedText value={content.title} as="inline" />
          </h1>
          <FormattedText
            value={content.subtitle}
            className="mt-3 block max-w-[560px] text-[15px] leading-snug text-white/95 lg:text-base"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {content.ctas.map((cta) => (
              <Link
                key={`${cta.variant}-${cta.label}`}
                href={cta.href}
                className={`inline-flex h-[42px] min-w-[200px] items-center justify-center rounded-[2px] px-6 text-[13px] font-medium text-tr-ink transition ${
                  cta.variant === "primary"
                    ? "bg-tr-sky hover:brightness-95"
                    : "bg-white hover:bg-tr-cream"
                }`}
              >
                {cta.label} →
              </Link>
            ))}
          </div>
        </div>

        <ul
          data-reveal
          data-reveal-delay="100"
          className="mt-10 grid gap-6 rounded-[4px] bg-tr-cream px-6 py-6 text-tr-ink sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:px-8"
        >
          {content.features.map((feature, index) => (
            <li key={feature}>
              <div className="flex h-[30px] items-end">
                <BenefitShape
                  variant={index}
                  className={BENEFIT_SHAPE_STYLES[index % BENEFIT_SHAPE_STYLES.length]}
                />
              </div>
              <p className="mt-2 text-[14px] font-medium leading-snug">
                <FormattedText value={feature} as="inline" />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
