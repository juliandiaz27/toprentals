import { FormattedText } from "@/components/content/FormattedText";
import { CheckCircleIcon } from "@/components/brand/BrandShapes";
import type { CorporateSpacesContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateSpacesContent };

/**
 * Vector «Espacios» exportado del Figma (2142×770, frame de 1440 en x=443, y=464):
 * cierre del bloque crema con dos muescas curvas abajo.
 */
function SpacesBand({ className }: { className?: string }) {
  return (
    <svg viewBox="-443 -464 2142 770" fill="currentColor" className={className} aria-hidden>
      <path d="M221.55 -464H-159.057C-315.866 -464 -443 -336.779 -443 -179.861V21.861C-443 178.778 -315.866 306 -159.057 306H221.549C249.135 306 271.498 283.622 271.498 256.017V21.861C271.498 178.778 398.632 306 555.441 306H936.047C963.633 306 985.995 283.622 985.995 256.018V51.034C1000.6 194.261 1121.49 306 1268.45 306H1649.05C1676.64 306 1699 283.623 1699 256.018V-413.993C1699 -441.597 1676.64 -463.975 1649.05 -463.975H221.55V-464Z" />
    </svg>
  );
}

/** Segunda parte del bloque crema: en desktop el fondo es el vector con muescas. */
export function CorporateSpaces({ content }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-tr-cream px-6 pb-16 pt-8 lg:min-h-[306px] lg:bg-transparent lg:px-16 lg:pb-20">
      {/* Anclado abajo y centrado respecto del frame de 1440 */}
      <SpacesBand className="pointer-events-none absolute bottom-0 left-[calc(50%-1163px)] -z-10 hidden h-[770px] w-[2142px] text-tr-cream lg:block" />
      <div data-reveal className="mx-auto w-full max-w-[1440px]">
        <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] [&_em]:text-[1.25em]">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <FormattedText
          value={content.subtitle}
          className="mt-1 block text-[14px] text-tr-ink"
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:max-w-[1270px] lg:gap-9">
          {content.cards.map((card) => (
            <li
              key={card}
              className="flex min-h-[70px] items-center gap-3 rounded-[4px] bg-[#111111] px-5 py-4 text-[15px] font-medium leading-snug text-white"
            >
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              <FormattedText value={card} as="inline" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
