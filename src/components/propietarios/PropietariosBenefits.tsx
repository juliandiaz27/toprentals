import { FormattedText } from "@/components/content/FormattedText";
import type { PropietariosBenefitsContent } from "@/lib/pageContent/propietariosTypes";

type Props = { content: PropietariosBenefitsContent };

function BulletColumn({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2.5 pl-5 text-[15px] text-neutral-900 marker:text-neutral-950">
      {items.map((item) => (
        <li key={item} className="pl-1 leading-relaxed">
          <FormattedText value={item} as="inline" />
        </li>
      ))}
    </ul>
  );
}

export function PropietariosBenefits({ content }: Props) {
  return (
    <section className="bg-white">
      <div data-reveal className="px-6 py-14 lg:px-12 lg:py-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-neutral-950">
            <FormattedText value={content.title} as="inline" />
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16 lg:mt-12">
            <BulletColumn items={content.leftColumn} />
            <BulletColumn items={content.rightColumn} />
          </div>
        </div>
      </div>
    </section>
  );
}
