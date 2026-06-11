import Link from "next/link";
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

export function PropertyDetailGroupsSection({
  headline,
  description,
  ctaLabel,
  ctaHref,
  stats,
}: Props) {
  return (
    <section data-reveal className="bg-neutral-950 px-6 py-12 text-white lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="max-w-3xl">
            <h2 className="text-[clamp(1.35rem,2.8vw,1.75rem)] font-bold leading-snug tracking-tight text-white">
              {headline}
            </h2>
            {description ? (
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-400 lg:text-base">
                {description}
              </p>
            ) : null}
          </div>
          <Link
            href={ctaHref}
            className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-lg bg-white px-6 text-[14px] font-medium text-neutral-950 transition-colors hover:bg-neutral-100 lg:self-center"
          >
            {ctaText(ctaLabel)}
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:mt-12 lg:gap-8">
          {stats.map((stat) => (
            <li key={`${stat.label}-${stat.value}`}>
              <p className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-[14px] text-neutral-400">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
