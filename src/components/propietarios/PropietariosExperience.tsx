import { FormattedText } from "@/components/content/FormattedText";
import type { PropietariosExperienceContent } from "@/lib/pageContent/propietariosTypes";

type Props = { content: PropietariosExperienceContent };

export function PropietariosExperience({ content }: Props) {
  return (
    <section data-reveal className="bg-[#111111] px-6 py-14 text-white lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-[clamp(1.5rem,2.8vw,2rem)] font-bold text-white">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {content.items.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-7"
            >
              <h3 className="text-[15px] font-bold text-white lg:text-base">
                <FormattedText value={item.title} as="inline" />
              </h3>
              <FormattedText
                value={item.text}
                className="mt-2 block text-[14px] leading-relaxed text-[#AAAAAA] lg:text-[15px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
