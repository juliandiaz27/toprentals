import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeLocationsContent } from "@/lib/pageContent/homeTypes";

type Props = {
  content: HomeLocationsContent;
};

export function LocationsSection({ content }: Props) {
  return (
    <section data-reveal className="border-y border-[#D0D0D0] bg-[#F8F8F8] px-6 py-16 sm:px-8 lg:px-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-tight text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>

        <ul className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-2 lg:gap-6">
          {content.locations.map((loc) => (
            <li key={loc.title}>
              <Link
                href={loc.href}
                className="group flex min-h-[200px] flex-col justify-between rounded-lg border border-[#D0D0D0] bg-[#DDDDDD] px-8 py-8 text-neutral-950 transition hover:border-[#C8C8C8] hover:bg-[#D4D4D4] lg:min-h-[220px] lg:px-10 lg:py-10"
              >
                <div>
                  <h3 className="text-xl font-bold lg:text-2xl">
                    <FormattedText value={loc.title} as="inline" />
                  </h3>
                  <FormattedText
                    value={loc.subtitle}
                    className="mt-2 block text-[15px] text-neutral-500"
                  />
                </div>
                <span className="mt-8 inline-flex text-[15px] font-medium text-neutral-600 group-hover:text-neutral-950 group-hover:underline">
                  {loc.linkLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
