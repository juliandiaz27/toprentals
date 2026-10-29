import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeCorporateTeaserContent } from "@/lib/pageContent/homeTypes";
import { BrandBuildings, CheckCircleIcon } from "@/components/brand/BrandShapes";

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

export function CorporateTeaserSection({ content }: Props) {
  const hasImage =
    Boolean(content.imageSrc) && !content.imageSrc.includes("placeholders");
  const { text: ctaText, showArrow } = ctaParts(content.ctaLabel);

  return (
    <section data-reveal className="bg-white px-6 py-16 text-tr-ink sm:px-10 lg:px-16 lg:pb-0 lg:pt-24">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-[80px]">
        <div className="flex flex-col justify-center">
          <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.5rem)] [&_em]:text-[1.3em] [&_em]:leading-[1.1]">
            <FormattedText value={content.title} as="inline" />
          </h2>

          {content.description ? (
            <FormattedText
              value={content.description}
              className="mt-5 block max-w-[27rem] text-[16px] font-medium leading-[1.45] lg:text-[17px]"
            />
          ) : null}

          <ul className="mt-8 max-w-[28rem] space-y-3 text-[15px]">
            {content.bullets.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircleIcon className="h-[18px] w-[18px] shrink-0" />
                <FormattedText value={item} as="inline" />
              </li>
            ))}
          </ul>

          <Link
            href={content.ctaHref}
            className="mt-9 inline-flex w-fit items-center gap-2 rounded-[3px] bg-tr-ink px-6 py-3.5 text-[14px] font-semibold leading-none text-white transition hover:bg-black"
          >
            <span>{ctaText}</span>
            {showArrow ? <span aria-hidden>→</span> : null}
          </Link>
        </div>

        {/* Imagen con borde superior izquierdo curvo (Figma) */}
        <div className="relative w-full lg:ml-auto lg:max-w-[556px]">
          <div className="relative aspect-[556/366] w-full overflow-hidden bg-tr-cream [border-top-left-radius:24%_68%]">
            {hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.imageSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[13px] text-neutral-500">{content.imagePlaceholder}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edificios: centrados en x=498–888 del frame de 1440, montados sobre el pie de la imagen */}
      <div className="mx-auto hidden w-full max-w-[1440px] lg:block">
        <BrandBuildings className="relative -mt-10 ml-[calc(50%-222px)] h-[196px] w-[390px]" />
      </div>
    </section>
  );
}
