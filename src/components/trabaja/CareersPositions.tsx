import Link from "next/link";
import type { TrabajaPageContent } from "@/lib/pageContent/trabajaTypes";

type Props = { content: TrabajaPageContent["positions"] };

function applyText(label: string) {
  return label.replace(/\s*→\s*$/, "").trim();
}

export function CareersPositions({ content }: Props) {
  return (
    <section
      id="posiciones"
      className="scroll-mt-24 bg-white px-6 pb-14 lg:px-12 lg:pb-20"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-neutral-950"
        >
          {content.title}
        </h2>
        <ul className="mt-8 divide-y divide-neutral-200/80">
          {content.items.map((job, i) => (
            <li
              key={job.title + job.location}
              data-reveal
              data-reveal-delay={String(40 + i * 30)}
            >
              <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:py-6">
                <p className="min-w-0 flex-1 text-[15px] font-medium text-neutral-950 lg:text-base">
                  {job.title}
                </p>
                <p className="shrink-0 text-[14px] text-neutral-600 sm:w-36 sm:text-center">
                  {job.location}
                </p>
                <span className="inline-flex w-fit shrink-0 rounded-full bg-neutral-200/80 px-3 py-1 text-[12px] font-medium text-neutral-700">
                  {job.type}
                </span>
                <Link
                  href={job.applyHref}
                  className="shrink-0 text-[14px] font-medium text-neutral-950 hover:text-neutral-600"
                >
                  {applyText(content.applyLabel)} →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
