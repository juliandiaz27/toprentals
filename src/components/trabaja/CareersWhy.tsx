import { FormattedText } from "@/components/content/FormattedText";
import type { TrabajaPageContent } from "@/lib/pageContent/trabajaTypes";

type Props = { content: TrabajaPageContent["why"] };

export function CareersWhy({ content }: Props) {
  return (
    <section className="bg-white px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-neutral-950"
        >
          <FormattedText value={content.title} as="inline" />
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {content.items.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              data-reveal-delay={String(60 + i * 40)}
              className="rounded-lg bg-[#F8F8F8] px-5 py-6 lg:px-6 lg:py-7"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-xl shadow-sm"
                aria-hidden
              >
                {item.icon}
              </span>
              <h3 className="mt-4 text-[15px] font-bold text-neutral-950">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
