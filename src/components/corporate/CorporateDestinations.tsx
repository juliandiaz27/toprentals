import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateDestinationsContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateDestinationsContent };

/** Destinos informativos (sin botones al motor de reservas). */
export function CorporateDestinations({ content }: Props) {
  return (
    <section
      data-reveal
      className="border-y border-neutral-200 bg-[#E0E0E0] px-6 py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-[clamp(1.5rem,2.8vw,2rem)] font-bold text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <ul className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {content.items.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-neutral-200 bg-white px-6 py-8 lg:px-8 lg:py-10"
            >
              <h3 className="text-xl font-bold text-neutral-950">
                <FormattedText value={item.title} as="inline" />
              </h3>
              <FormattedText
                value={item.text}
                className="mt-3 block text-[15px] leading-relaxed text-neutral-600"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
