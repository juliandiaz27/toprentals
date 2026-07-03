import { FormattedText } from "@/components/content/FormattedText";
import type { PropietariosHeroContent } from "@/lib/pageContent/propietariosTypes";

type Props = { content: PropietariosHeroContent };

export function PropietariosHero({ content }: Props) {
  return (
    <section className="bg-white px-6 pt-14 lg:px-12 lg:pt-20">
      <div data-reveal className="mx-auto w-full max-w-[1440px]">
        <h1 className="max-w-4xl text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h1>
        <FormattedText
          value={content.subtitle}
          className="mt-6 block max-w-3xl text-[15px] leading-relaxed text-neutral-600 lg:text-base"
        />
      </div>
    </section>
  );
}
