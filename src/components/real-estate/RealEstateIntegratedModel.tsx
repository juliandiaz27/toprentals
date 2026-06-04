import { FormattedText } from "@/components/content/FormattedText";
import type { RealEstateIntegratedModelContent } from "@/lib/pageContent/realEstateTypes";

type Props = { content: RealEstateIntegratedModelContent };

export function RealEstateIntegratedModel({ content }: Props) {
  return (
    <section data-reveal className="bg-white px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="max-w-3xl text-[clamp(1.5rem,2.8vw,2.125rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {content.steps.map((step, index) => (
            <li key={step.title} className="flex flex-col">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-[15px] font-bold text-white"
                aria-hidden
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-neutral-950">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
