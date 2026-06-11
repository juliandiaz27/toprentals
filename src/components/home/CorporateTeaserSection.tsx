import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeCorporateTeaserContent } from "@/lib/pageContent/homeTypes";

type Props = {
  content: HomeCorporateTeaserContent;
};

function ctaParts(label: string) {
  const arrow = "→";
  if (label.endsWith(` ${arrow}`)) {
    return { text: label.slice(0, -(arrow.length + 1)), showArrow: true };
  }
  if (label.endsWith(arrow)) {
    return { text: label.slice(0, -arrow.length), showArrow: true };
  }
  return { text: label, showArrow: true };
}

/** Mismo ritmo vertical que el boceto (Figma ~1440px). */
const bodyText = "text-base leading-[1.6] text-[#a3a3a3]";

export function CorporateTeaserSection({ content }: Props) {
  const hasImage =
    Boolean(content.imageSrc) && !content.imageSrc.includes("placeholders");
  const { text: ctaText, showArrow } = ctaParts(content.ctaLabel);

  return (
    <section data-reveal className="bg-[#111111] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-[80px]">
        <div className="flex flex-col justify-center lg:py-4">
          <h2 className="text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[2.25rem] lg:text-[2.75rem] lg:leading-[1.1]">
            <FormattedText value={content.title} as="inline" />
          </h2>

          {content.description ? (
            <FormattedText
              value={content.description}
              className={`mt-6 block max-w-[28rem] ${bodyText}`}
            />
          ) : null}

          <ul className={`mt-8 max-w-[28rem] space-y-4 ${bodyText}`}>
            {content.bullets.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-[0.2em] w-[1.125rem] shrink-0 text-center text-[15px] font-light leading-none text-[#a3a3a3]"
                  aria-hidden
                >
                  ✓
                </span>
                <FormattedText value={item} as="inline" />
              </li>
            ))}
          </ul>

          <Link
            href={content.ctaHref}
            className="mt-10 inline-flex w-fit items-center gap-2 rounded-md bg-white px-6 py-3 text-[15px] font-semibold leading-none text-black transition hover:bg-neutral-100"
          >
            <span>{ctaText}</span>
            {showArrow ? <span className="text-[16px]" aria-hidden>→</span> : null}
          </Link>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl bg-[#1a1a1a]">
          <div className="relative aspect-[16/10] w-full sm:aspect-[8/5] lg:aspect-[16/11]">
            {hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.imageSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[13px] text-zinc-500">{content.imagePlaceholder}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
