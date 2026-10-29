import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeLocationsContent } from "@/lib/pageContent/homeTypes";

type Props = {
  content: HomeLocationsContent;
};

export function LocationsSection({ content }: Props) {
  return (
    <section data-reveal className="bg-white px-6 pb-12 pt-4 sm:px-8 lg:px-16 lg:pb-16">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Marco del Figma: línea superior con esquina curva a la derecha */}
        <div className="pt-10 lg:ml-11 lg:rounded-tr-[56px] lg:border-r lg:border-t lg:border-tr-ink/80 lg:pb-12 lg:pr-12 lg:pt-14">
          <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.5rem)] [&_em]:text-[1.3em]">
            <FormattedText value={content.title} as="inline" />
          </h2>

          <ul className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-[68px]">
            {content.locations.map((loc) => (
              <li key={loc.title}>
                <h3 className="text-[20px] font-medium uppercase leading-tight text-tr-ink">
                  <FormattedText value={loc.title} as="inline" />
                </h3>
                <FormattedText
                  value={loc.subtitle}
                  className="mt-1 block text-[14px] text-tr-ink"
                />
                <Link
                  href={loc.href}
                  className="group mt-5 block overflow-hidden rounded-lg bg-[#111111]"
                >
                  <div className="relative aspect-[576/145] w-full overflow-hidden bg-tr-cream">
                    {loc.imageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={loc.imageSrc}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                  <span className="flex h-[42px] items-center justify-center text-[14px] font-medium text-white group-hover:underline">
                    {loc.linkLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
