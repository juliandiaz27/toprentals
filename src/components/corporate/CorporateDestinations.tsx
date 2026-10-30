import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import { BrandDome } from "@/components/brand/BrandShapes";
import type { CorporateDestinationsContent } from "@/lib/pageContent/corporateTypes";

type Props = { content: CorporateDestinationsContent };

/**
 * Destinos (mismo marco que «Ubicaciones» de la home). El botón lleva al listado
 * de propiedades: desde Corporativo no se reserva por el motor.
 */
export function CorporateDestinations({ content }: Props) {
  return (
    <section data-reveal className="relative bg-white px-6 pb-12 pt-6 sm:px-8 lg:px-16 lg:pb-16 lg:pt-10">
      <BrandDome className="pointer-events-none absolute left-[2.5%] top-[48%] hidden h-[26px] w-[48px] text-tr-amber lg:block" />
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="pt-10 lg:ml-11 lg:rounded-tr-[56px] lg:border-r lg:border-t lg:border-tr-ink/80 lg:pb-12 lg:pr-12 lg:pt-14">
          <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] [&_em]:text-[1.3em]">
            <FormattedText value={content.title} as="inline" />
          </h2>

          <ul className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-[68px]">
            {content.items.map((item) => (
              <li key={item.title}>
                <h3 className="text-[20px] font-medium uppercase leading-tight text-tr-ink">
                  <FormattedText value={item.title} as="inline" />
                </h3>
                <FormattedText
                  value={item.text}
                  className="mt-1 block max-w-[440px] text-[14px] text-tr-ink"
                />
                <Link
                  href={content.linkHref}
                  className="group mt-5 block overflow-hidden rounded-lg bg-[#111111]"
                >
                  <div className="relative aspect-[576/145] w-full overflow-hidden bg-tr-cream">
                    {item.imageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageSrc}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                  <span className="flex h-[42px] items-center justify-center text-[14px] font-medium text-white group-hover:underline">
                    {content.linkLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
