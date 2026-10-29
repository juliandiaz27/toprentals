import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeInvestorCtaContent } from "@/lib/pageContent/homeTypes";
import { BrandArchStack, BrandDome } from "@/components/brand/BrandShapes";

type Props = {
  content: HomeInvestorCtaContent;
};

function splitArrow(label: string) {
  const arrow = "→";
  if (label.endsWith(` ${arrow}`)) {
    return { text: label.slice(0, -(arrow.length + 1)), arrow: true };
  }
  if (label.endsWith(arrow)) {
    return { text: label.slice(0, -arrow.length), arrow: true };
  }
  return { text: label, arrow: false };
}

export function InvestorCtaSection({ content }: Props) {
  const dev = splitArrow(content.devLabel);
  const inv = splitArrow(content.invLabel);

  return (
    <section
      data-reveal
      className="relative overflow-hidden bg-[#1f2a2e] px-6 py-24 text-white sm:px-8 lg:px-16 lg:py-[110px]"
    >
      {content.imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={content.imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <span className="absolute inset-0 bg-black/15" aria-hidden />
      <BrandArchStack className="pointer-events-none absolute left-[7%] top-6 hidden h-[84px] w-[46px] text-tr-cream lg:block" />
      <BrandDome className="pointer-events-none absolute bottom-[100px] right-[4.6%] hidden h-[26px] w-[46px] text-tr-amber lg:block" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center text-center">
        <h2 className="max-w-3xl text-[clamp(1.25rem,2vw,1.375rem)] font-medium leading-snug">
          <FormattedText value={content.title} as="inline" />
        </h2>

        <div className="mt-6 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href={content.devHref}
            className="inline-flex h-9 w-full items-center gap-2 rounded-[2px] bg-tr-cream px-5 text-[14px] text-tr-ink transition hover:bg-white sm:w-[260px]"
          >
            <span>{dev.text}</span>
            {dev.arrow ? <span aria-hidden>→</span> : null}
          </Link>
          <Link
            href={content.invHref}
            className="inline-flex h-9 w-full items-center gap-2 rounded-[2px] bg-tr-sky px-5 text-[14px] text-tr-ink transition hover:bg-[#b9dcf2] sm:w-[212px]"
          >
            <span>{inv.text}</span>
            {inv.arrow ? <span aria-hidden>→</span> : null}
          </Link>
        </div>
      </div>
    </section>
  );
}
