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
      className="scroll-mt-24 bg-[#111111] px-6 py-16 text-white lg:px-12 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight"
        >
          <FormattedText value={content.title} as="inline" />
        </h2>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[3fr_2fr] lg:items-stretch lg:gap-8">
          <div data-reveal data-reveal-delay="80" className="min-w-0">
            <CorporateAccessForm content={content} />
          </div>

          <div
            id="acceso-agencias"
            data-reveal
            data-reveal-delay="160"
            className="scroll-mt-24 flex flex-col justify-center rounded-lg bg-[#2a2a2a] px-6 py-8 lg:px-8 lg:py-10"
          >
            <h3 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold leading-tight text-white">
              <FormattedText value={content.title} as="inline" />
            </h3>
            <p className="mt-6 text-[15px] font-semibold text-white">
              {content.loginQuestion}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#AAAAAA]">
              {content.loginDescription}
            </p>
            <Link
              href={sanitizeCorporateLoginHref(content.loginCtaHref)}
              className="mt-8 inline-flex h-11 w-fit items-center justify-center rounded-lg bg-white px-5 text-[14px] font-semibold text-neutral-950 hover:bg-neutral-100"
            >
              {loginCta} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
