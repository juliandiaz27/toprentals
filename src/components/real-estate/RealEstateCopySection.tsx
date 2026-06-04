import { FormattedText } from "@/components/content/FormattedText";
import type { RealEstateCopySection as RealEstateCopySectionContent } from "@/lib/pageContent/realEstateTypes";

type Props = {
  content: RealEstateCopySectionContent;
  variant: "light" | "light-separated";
};

export function RealEstateCopySection({ content, variant }: Props) {
  const separated = variant === "light-separated";

  return (
    <section
      data-reveal
      className={`bg-[#F8F8F8] px-6 lg:px-12 ${
        separated
          ? "border-t border-neutral-200/80 py-12 lg:py-16"
          : "py-14 lg:py-20"
      }`}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="max-w-3xl text-[clamp(1.5rem,2.8vw,2.125rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-relaxed text-neutral-700 lg:text-base">
          {content.paragraphs.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
