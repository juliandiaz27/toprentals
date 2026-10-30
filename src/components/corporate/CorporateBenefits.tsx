import { FormattedText } from "@/components/content/FormattedText";
import type { CorporateBenefitsContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateBenefitsContent };

function BulletColumn({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-[14px] text-tr-ink">
      {items.map((item) => (
        <li key={item} className="flex items-baseline gap-3">
          <span className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full bg-tr-green" aria-hidden />
          <FormattedText value={item} as="inline" />
        </li>
      ))}
    </ul>
  );
}

export function CorporateBenefits({ content }: Props) {
  /* Figma: 3 columnas — la izquierda tal cual, la derecha repartida en dos */
  const half = Math.ceil(content.rightColumn.length / 2);
  const columns = [
    content.leftColumn,
    content.rightColumn.slice(0, half),
    content.rightColumn.slice(half),
  ].filter((col) => col.length > 0);

  return (
    <section data-reveal className="bg-white px-6 pb-14 pt-4 lg:px-16 lg:pb-14">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] [&_em]:text-[1.25em]">
          <FormattedText value={content.title} as="inline" />
        </h2>
        {content.closing ? (
          <FormattedText
            value={content.closing}
            className="mt-1 block text-[14px] tracking-[0.03em] text-tr-ink"
          />
        ) : null}
        <div className="relative mt-7 grid gap-x-10 gap-y-3 lg:grid-cols-3">
          <span
            className="pointer-events-none absolute left-[24%] top-0.5 hidden h-3 w-[42px] bg-tr-red lg:block"
            aria-hidden
          />
          {columns.map((items, i) => (
            <BulletColumn key={i} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
}
