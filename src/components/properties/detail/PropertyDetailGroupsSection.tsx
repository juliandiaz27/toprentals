import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { PropertyStat } from "@/lib/properties/propertyDetailTypes";

type Props = {
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  stats: PropertyStat[];
};

function ctaText(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "Consultar grupos →";
  return trimmed.includes("→") ? trimmed : `${trimmed} →`;
}

/** Franja crema «Grupos de hasta X pax» con cifras a la derecha (Figma). */
export function PropertyDetailGroupsSection({
  headline,
  description,
  ctaLabel,
  ctaHref,
  stats,
}: Props) {
  const visibleStats = stats.filter((s) => s.value && s.value !== "—");

  return (
    <section data-reveal className="bg-tr-cream px-6 py-12 lg:px-16 lg:py-14">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10">
        <div className="max-w-[560px]">
          <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] [&_em]:text-[1.25em]">
            <FormattedText value={headline} as="inline" />
          </h2>
          {description ? (
            <p className="mt-3 text-[13px] leading-relaxed text-tr-ink/70">{description}</p>
          ) : null}
          <Link
            href={ctaHref}
            className="mt-5 inline-flex h-9 items-center rounded-[2px] bg-tr-red px-4 text-[12px] font-medium text-white transition hover:brightness-110"
          >
            {ctaText(ctaLabel)}
          </Link>
        </div>

        {visibleStats.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-12 gap-y-6 text-center sm:grid-cols-4">
            {visibleStats.map((stat) => (
              <li key={`${stat.label}-${stat.value}`}>
                <p className="font-display text-[clamp(2rem,3vw,2.5rem)] font-semibold leading-none text-tr-ink">
                  {stat.value}
                </p>
                <p className="mt-3 text-[12px] text-tr-ink">{stat.label}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
