import { FormattedText } from "@/components/content/FormattedText";
import { CheckCircleIcon } from "@/components/brand/BrandShapes";
import type { CorporateFeaturesContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateFeaturesContent };

/** Colores de tarjeta en el orden del Figma (verde, naranja, rojo, ámbar). */
const CARD_COLORS = ["bg-tr-green", "bg-tr-orange", "bg-tr-red", "bg-tr-amber"];

export function CorporateFeaturesGrid({ content }: Props) {
  return (
    <section data-reveal className="bg-white px-6 pb-12 pt-6 lg:px-16 lg:pb-16">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] [&_em]:text-[1.25em]">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <div className="relative mt-5 lg:pb-12">
          {/* Línea curva bajo las tarjetas (Figma) */}
          <span
            className="pointer-events-none absolute -left-10 bottom-0 right-0 top-[55%] hidden rounded-bl-[64px] border-b border-l border-tr-ink/70 lg:block"
            aria-hidden
          />
          <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[46px]">
            {content.items.map((item, index) => (
              <li
                key={item.title}
                className={`flex gap-3 rounded-[4px] px-5 py-5 text-white ${CARD_COLORS[index % CARD_COLORS.length]}`}
              >
                <CheckCircleIcon className="h-6 w-6 shrink-0" />
                <div>
                  <h3 className="text-[12px] font-semibold uppercase leading-tight">
                    <FormattedText value={item.title} as="inline" />
                  </h3>
                  <FormattedText
                    value={item.text}
                    className="mt-2 block text-[12px] leading-snug text-white/90"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
