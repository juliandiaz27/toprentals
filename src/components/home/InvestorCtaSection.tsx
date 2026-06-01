import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeInvestorCtaContent } from "@/lib/pageContent/homeTypes";

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
    <section data-reveal className="bg-white px-6 py-16 sm:px-8 lg:px-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="max-w-3xl text-[clamp(1.375rem,2.5vw,1.75rem)] font-bold leading-snug text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={content.devHref}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-6 py-3 text-[15px] font-medium text-neutral-950 transition hover:bg-neutral-300"
          >
            <span>{dev.text}</span>
            {dev.arrow ? <span aria-hidden>→</span> : null}
          </Link>
          <Link
            href={content.invHref}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-6 py-3 text-[15px] font-medium text-neutral-950 transition hover:bg-neutral-300"
          >
            <span>{inv.text}</span>
            {inv.arrow ? <span aria-hidden>→</span> : null}
          </Link>
        </div>
      </div>
    </section>
  );
}
