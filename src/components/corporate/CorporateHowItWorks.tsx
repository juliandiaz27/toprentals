import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateHowItWorksContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateHowItWorksContent };

/** Color del número de cada paso (Figma). */
const STEP_COLORS = ["bg-tr-red", "bg-tr-green", "bg-tr-amber", "bg-tr-orange"];

/** Primera parte del bloque crema (sigue en CorporateSpaces). */
export function CorporateHowItWorks({ content }: Props) {
  return (
    <section className="bg-tr-cream">
      <div data-reveal className="px-6 pb-6 pt-12 lg:px-16 lg:pb-10 lg:pt-14">
        <div className="mx-auto w-full max-w-[1440px]">
          <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] [&_em]:text-[1.25em]">
            <FormattedText value={content.title} as="inline" />
          </h2>
          <ol className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {content.steps.map((step, index) => (
              <li key={step.title}>
                <span
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-semibold text-white ${STEP_COLORS[index % STEP_COLORS.length]}`}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <h3 className="mt-3 text-[13px] font-semibold text-tr-ink">
                  <FormattedText value={step.title} as="inline" />
                </h3>
                <FormattedText
                  value={step.text}
                  className="mt-1 block max-w-[260px] text-[11px] leading-snug text-tr-ink"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
