import { FormattedText } from "@/components/content/FormattedText";
import type { ClubFaqItem } from "@/lib/pageContent/clubTypes";

type Props = {
  title: string;
  items: ClubFaqItem[];
};

export function ClubFaq({ title, items }: Props) {
  return (
    <section
      className="px-6 py-14 lg:px-12 lg:py-16"
      style={{ backgroundColor: "#E0E0E0" }}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-left text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold text-neutral-950"
        >
          <FormattedText value={title} as="inline" />
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={item.question}
              data-reveal
              data-reveal-delay={String(50 + index * 30)}
              className="rounded-lg px-5 py-5"
              style={{ backgroundColor: "#E8E8E8" }}
            >
              <h3 className="text-left text-[15px] font-bold text-neutral-950">
                <FormattedText value={item.question} as="inline" />
              </h3>
              <FormattedText
                value={item.answer}
                className="mt-2 block text-left text-[14px] leading-relaxed text-neutral-600"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
