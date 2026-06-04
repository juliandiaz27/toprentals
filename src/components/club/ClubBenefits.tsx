import { CLUB_GOLD } from "@/lib/pageContent/clubTheme";
import type { ClubBenefitsColumn } from "@/lib/pageContent/clubTypes";

type Props = {
  title: string;
  columns: ClubBenefitsColumn[];
};

function benefitsGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "sm:grid-cols-2";
  if (count === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-2 lg:grid-cols-3";
}

export function ClubBenefits({ title, columns }: Props) {
  return (
    <section className="bg-white px-6 py-14 lg:px-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-left text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold text-neutral-950"
        >
          {title}
        </h2>
        <ul className={`mt-10 grid gap-5 ${benefitsGridClass(columns.length)}`}>
          {columns.map((col, index) => (
            <li
              key={col.title}
              data-reveal
              data-reveal-delay={String(60 + index * 40)}
              className="overflow-hidden rounded-lg"
              style={{ backgroundColor: "#F8F8F8" }}
            >
              <div className="h-1.5 w-full" style={{ backgroundColor: CLUB_GOLD }} />
              <div className="px-5 py-6">
                <h3 className="text-left text-[15px] font-bold text-neutral-950">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-left text-[14px] leading-relaxed text-neutral-600">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span
                        className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: CLUB_GOLD }}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
