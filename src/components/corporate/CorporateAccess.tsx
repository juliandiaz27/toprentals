import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import { sanitizeCorporateLoginHref } from "@/lib/pageContent/corporateCtas";
import type { CorporateAccessContent } from "@/lib/pageContent/corporateTypes";
import { CorporateAccessForm } from "./CorporateAccessForm";

type Props = { content: CorporateAccessContent };

export function CorporateAccess({ content }: Props) {
  const loginCta = content.loginCtaLabel.replace(/\s*→\s*$/, "").trim();

  return (
    <section
      id="acceso-corporativo"
      className="scroll-mt-24 bg-tr-green px-6 py-14 text-white lg:px-16 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] !text-white [&_em]:text-[1.3em] lg:pl-2"
        >
          <FormattedText value={content.title} as="inline" />
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div
            id="acceso-agencias"
            data-reveal
            data-reveal-delay="80"
            className="scroll-mt-24 rounded-[4px] bg-tr-sky px-6 py-7 text-tr-ink"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.02em]">
              <FormattedText value={content.loginQuestion} as="inline" />
            </p>
            <FormattedText
              value={content.loginDescription}
              className="mt-1 block max-w-[200px] text-[11px] leading-snug"
            />
            <Link
              href={sanitizeCorporateLoginHref(content.loginCtaHref)}
              className="mt-5 inline-flex h-9 min-w-[180px] items-center rounded-[2px] bg-tr-ink px-4 text-[12px] font-medium text-white transition hover:bg-black"
            >
              {loginCta} →
            </Link>
          </div>

          <div data-reveal data-reveal-delay="160" className="min-w-0">
            <CorporateAccessForm content={content} />
          </div>
        </div>
      </div>
    </section>
  );
}
