import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateAccessContent } from "@/lib/pageContent/corporateTypes";
import { CorporateAccessForm } from "./CorporateAccessForm";

type Props = { content: CorporateAccessContent };

export function CorporateAccess({ content }: Props) {
  const loginCta = content.loginCtaLabel.replace(/\s*→\s*$/, "").trim();

  return (
    <section className="bg-[#111111] px-6 py-16 text-white lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight"
        >
          <FormattedText value={content.title} as="inline" />
        </h2>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[2fr_3fr] lg:items-stretch lg:gap-8">
          <div
            data-reveal
            data-reveal-delay="80"
            className="flex flex-col justify-center rounded-lg bg-[#2a2a2a] px-6 py-8 lg:px-8 lg:py-10"
          >
            <p className="text-[15px] font-semibold text-white">
              {content.loginQuestion}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#AAAAAA]">
              {content.loginDescription}
            </p>
            <Link
              href={content.loginCtaHref}
              className="mt-8 inline-flex h-11 w-fit items-center justify-center rounded-lg bg-white px-5 text-[14px] font-semibold text-neutral-950 hover:bg-neutral-100"
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
