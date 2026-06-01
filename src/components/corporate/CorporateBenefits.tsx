import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateBenefitsContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateBenefitsContent };

function BulletColumn({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-[15px] text-neutral-900 marker:text-neutral-950">
      {items.map((item) => (
        <li key={item} className="pl-1 leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CorporateBenefits({ content }: Props) {
  return (
    <section className="bg-white">
      <div data-reveal className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16 lg:mt-12">
            <div>
              <BulletColumn items={content.leftColumn} />
              {content.closing ? (
                <p className="mt-8 text-[15px] leading-relaxed text-[#AAAAAA] lg:mt-10">
                  {content.closing}
                </p>
              ) : null}
            </div>
            <BulletColumn items={content.rightColumn} />
          </div>
        </div>
      </div>
    </section>
  );
}
