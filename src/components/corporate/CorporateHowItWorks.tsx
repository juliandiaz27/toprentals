import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateHowItWorksContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateHowItWorksContent };

export function CorporateHowItWorks({ content }: Props) {
  return (
    <section className="border-t border-solid border-[#EEEEEE] bg-white">
      <div data-reveal className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <h2 className="text-[clamp(1.5rem,2.8vw,2rem)] font-bold text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {content.steps.map((step, index) => (
              <li key={step.title}>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-btn text-[15px] font-bold text-white"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-neutral-950">
                  <FormattedText value={step.title} as="inline" />
                </h3>
                <FormattedText
                  value={step.text}
                  className="mt-2 block text-[14px] leading-relaxed text-neutral-600"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
