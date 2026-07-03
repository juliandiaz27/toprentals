import { FormattedText } from "@/components/content/FormattedText";
import type { PropietariosProtectedRentContent } from "@/lib/pageContent/propietariosTypes";

type Props = { content: PropietariosProtectedRentContent };

export function PropietariosProtectedRent({ content }: Props) {
  return (
    <section className="border-t border-solid border-[#EEEEEE] bg-white">
      <div data-reveal className="px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-[1440px]">
          <h2 className="text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h2>
          <FormattedText
            value={content.text}
            className="mt-4 block max-w-3xl text-[15px] leading-relaxed text-neutral-600 lg:text-base"
          />
        </div>
      </div>
    </section>
  );
}
