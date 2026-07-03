import { FormattedText } from "@/components/content/FormattedText";
import type { PropietariosEquipmentContent } from "@/lib/pageContent/propietariosTypes";

type Props = { content: PropietariosEquipmentContent };

export function PropietariosEquipment({ content }: Props) {
  return (
    <section data-reveal className="bg-[#F8F8F8] px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-[clamp(1.5rem,2.8vw,2rem)] font-bold text-neutral-950">
          <FormattedText value={content.title} as="inline" />
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {content.items.map((item) => (
            <li
              key={item.title}
              className="rounded-xl bg-white px-6 py-7 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-[15px] font-bold text-neutral-950 lg:text-base">
                <FormattedText value={item.title} as="inline" />
              </h3>
              <FormattedText
                value={item.text}
                className="mt-2 block text-[14px] leading-relaxed text-neutral-600 lg:text-[15px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
