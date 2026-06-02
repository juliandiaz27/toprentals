import type { NosotrosPageContent } from "@/lib/pageContent/nosotrosTypes";

type Props = { content: NosotrosPageContent["values"] };

export function NosotrosValues({ content }: Props) {
  return (
    <section className="bg-[#F7F7F7] px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2
          data-reveal
          className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-neutral-950"
        >
          {content.title}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 lg:mt-12">
          {content.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              data-reveal-delay={String(80 + index * 60)}
              className="rounded-lg bg-white px-5 py-6 lg:px-6 lg:py-7"
            >
              <h3 className="text-[15px] font-bold text-neutral-950 lg:text-base">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600 lg:text-[15px]">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
