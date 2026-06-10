import { FormattedText } from "@/components/content/FormattedText";
import type { ClubIntroContent } from "@/lib/pageContent/clubTypes";

type Props = { content: ClubIntroContent };

export function ClubIntro({ content }: Props) {
  return (
    <section
      className="px-6 py-14 lg:px-12 lg:py-16"
      style={{ backgroundColor: "#E0E0E0" }}
    >
      <div data-reveal className="mx-auto w-full max-w-[1440px] text-left">
        <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <FormattedText
          value={content.text}
          className="mt-5 block max-w-3xl text-[15px] leading-relaxed text-neutral-600 lg:text-base"
        />
      </div>
    </section>
  );
}
