import { FormattedText } from "@/components/content/FormattedText";
import type { NosotrosPageContent } from "@/lib/pageContent/nosotrosTypes";

type Props = { content: NosotrosPageContent["history"] };

export function NosotrosHistory({ content }: Props) {
  const hasImage =
    Boolean(content.imageSrc) && !content.imageSrc.includes("placeholders");

  return (
    <section className="bg-white px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div data-reveal>
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-neutral-700 lg:text-base">
            {content.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div
          data-reveal
          data-reveal-delay="100"
          className="relative min-h-[280px] overflow-hidden rounded-lg bg-neutral-200 lg:min-h-[360px]"
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.imageSrc}
              alt={content.imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <p className="text-center text-[13px] text-neutral-500">
                [ Foto — {content.imageAlt} ]
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
