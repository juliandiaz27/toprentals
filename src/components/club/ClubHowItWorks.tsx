import { FormattedText } from "@/components/content/FormattedText";
import { CLUB_GOLD } from "@/lib/pageContent/clubTheme";
import { clubStepsGridClass } from "@/lib/pageContent/clubTypes";
import type { ClubTextBlock } from "@/lib/pageContent/clubTypes";

type Props = {
  title: string;
  steps: ClubTextBlock[];
};

export function ClubHowItWorks({ title, steps }: Props) {
  return (
    <section className="bg-white px-6 py-14 lg:px-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-left text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold text-neutral-950"
        >
          <FormattedText value={title} as="inline" />
        </h2>
        <ul className={`mt-10 grid gap-4 ${clubStepsGridClass(steps.length)}`}>
          {steps.map((step, index) => (
            <li
              key={`${step.title}-${index}`}
              data-reveal
              data-reveal-delay={String(60 + index * 40)}
              className="rounded-xl px-5 py-6"
              style={{ backgroundColor: "#F8F8F8" }}
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-neutral-950"
                style={{ backgroundColor: CLUB_GOLD }}
                aria-hidden
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-left text-[15px] font-bold text-neutral-950">
                <FormattedText value={step.title} as="inline" />
              </h3>
              <FormattedText
                value={step.text}
                className="mt-2 block text-left text-[14px] leading-relaxed text-neutral-600"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
